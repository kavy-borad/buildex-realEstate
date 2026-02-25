import ApiLog from '../models/ApiLog.js';

/**
 * ═══════════════════════════════════════════════════════════════
 * 📊 LOG CONTROLLER - Clean, optimized API log endpoints
 * ═══════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────
// GET /api/logs — Fetch logs with filtering & pagination
// ─────────────────────────────────────────────────────────────
export const getLogs = async (req, res) => {
    try {
        const {
            limit = 50,
            page = 1,
            method,
            status,
            filter
        } = req.query;

        // Cap limit to prevent unlimited fetch
        const safeLimit = Math.min(parseInt(limit) || 50, 200);
        const safePage = Math.max(parseInt(page) || 1, 1);
        const skip = (safePage - 1) * safeLimit;

        const query = {};

        // Method filter (GET, POST, PUT, DELETE, PATCH)
        if (method) {
            query.method = method.toUpperCase();
        }

        // Smart filter groups (matching the UI tabs)
        if (filter === 'requests') {
            query.method = { $in: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] };
        } else if (filter === 'responses') {
            query.status = { $lt: 400 };
        } else if (filter === 'errors') {
            query.status = { $gte: 400 };
        }

        // Direct status filter
        if (status) {
            if (status === 'success') query.status = { $lt: 400 };
            else if (status === 'error') query.status = { $gte: 400 };
            else query.status = parseInt(status);
        }

        const [logs, total] = await Promise.all([
            ApiLog.find(query)
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(safeLimit)
                .lean(),
            ApiLog.countDocuments(query)
        ]);

        res.json({
            success: true,
            count: logs.length,
            total,
            page: safePage,
            totalPages: Math.ceil(total / safeLimit),
            data: logs
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch logs' });
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/logs/stats — MongoDB aggregation (not JS memory)
// ─────────────────────────────────────────────────────────────
export const getLogStats = async (req, res) => {
    try {
        const result = await ApiLog.aggregate([
            {
                $group: {
                    _id: null,
                    totalRequests: { $sum: 1 },
                    errorRequests: {
                        $sum: { $cond: [{ $gte: ['$status', 400] }, 1, 0] }
                    },
                    successRequests: {
                        $sum: { $cond: [{ $lt: ['$status', 400] }, 1, 0] }
                    },
                    avgResponseTime: { $avg: '$responseTime' }
                }
            }
        ]);

        const stats = result.length > 0 ? result[0] : {
            totalRequests: 0,
            errorRequests: 0,
            successRequests: 0,
            avgResponseTime: 0
        };

        res.json({
            success: true,
            data: {
                totalRequests: stats.totalRequests,
                successRequests: stats.successRequests,
                errorRequests: stats.errorRequests,
                avgResponseTime: Math.round(stats.avgResponseTime || 0)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch stats' });
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/logs/live — Live polling (since timestamp)
// ─────────────────────────────────────────────────────────────
export const getLiveLogs = async (req, res) => {
    try {
        const { since } = req.query;

        const query = {};
        if (since) {
            query.timestamp = { $gt: new Date(since) };
        }

        const logs = await ApiLog.find(query)
            .sort({ timestamp: -1 })
            .limit(50)
            .lean();

        res.json({
            success: true,
            count: logs.length,
            data: logs,
            serverTime: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch live logs' });
    }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/logs — Clear all logs
// ─────────────────────────────────────────────────────────────
export const clearLogs = async (req, res) => {
    try {
        const result = await ApiLog.deleteMany({});
        res.json({
            success: true,
            message: `Cleared ${result.deletedCount} logs successfully`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to clear logs' });
    }
};
