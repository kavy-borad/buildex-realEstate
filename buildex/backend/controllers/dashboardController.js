/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 DASHBOARD CONTROLLER
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Quotation from '../models/Quotation.js';
import Invoice from '../models/Invoice.js';

/**
 * ─────────────────────────────────────────────────────────────
 * GET /api/dashboard/project-stats
 * Returns project status breakdown for grid cards
 * ─────────────────────────────────────────────────────────────
 */
export const getProjectStats = async (req, res) => {
    const startTime = Date.now();
    console.log(`📊 [Dashboard] GET /project-stats → Request received`);

    try {
        const [accepted, sent, rejected, working] = await Promise.all([
            Quotation.countDocuments({ status: 'accepted' }),
            Quotation.countDocuments({ status: 'sent' }),
            Quotation.countDocuments({ status: 'rejected' }),
            Quotation.countDocuments({ status: { $in: ['accepted', 'sent'] } })
        ]);

        const responseData = {
            working,
            accepted,
            sent,
            rejected
        };

        const duration = Date.now() - startTime;
        console.log(`✅ [Dashboard] GET /project-stats → 200 OK (${duration}ms) | working=${working}, accepted=${accepted}, sent=${sent}, rejected=${rejected}`);

        res.status(200).json({
            success: true,
            data: responseData
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`❌ [Dashboard] GET /project-stats → 500 Error (${duration}ms):`, error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch project stats',
            error: error.message
        });
    }
};

/**
 * ─────────────────────────────────────────────────────────────
 * GET /api/dashboard/recent-activities
 * Returns last 5 combined quotations + invoices for sidebar
 * ─────────────────────────────────────────────────────────────
 */
export const getRecentActivities = async (req, res) => {
    const startTime = Date.now();
    console.log(`📋 [Dashboard] GET /recent-activities → Request received`);

    try {
        const [recentQuotations, recentInvoices] = await Promise.all([
            Quotation.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('client', 'name')
                .lean(),
            Invoice.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('client', 'name')
                .lean()
        ]);

        const activities = [
            ...recentQuotations.map(q => ({ ...q, type: 'quotation' })),
            ...recentInvoices.map(i => ({ ...i, type: 'invoice' }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

        const duration = Date.now() - startTime;
        console.log(`✅ [Dashboard] GET /recent-activities → 200 OK (${duration}ms) | ${activities.length} activities (${recentQuotations.length} quotations, ${recentInvoices.length} invoices)`);

        res.status(200).json({
            success: true,
            data: activities
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`❌ [Dashboard] GET /recent-activities → 500 Error (${duration}ms):`, error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent activities',
            error: error.message
        });
    }
};

/**
 * ─────────────────────────────────────────────────────────────
 * GET /api/dashboard/charts?filter=30days
 * Returns date-wise revenue + project count for graph plotting
 * Supports: today, 7days, 30days (default: 30days)
 * ─────────────────────────────────────────────────────────────
 */
export const getCharts = async (req, res) => {
    const startTime = Date.now();
    const filter = req.query.filter || '30days';
    console.log(`📈 [Dashboard] GET /charts?filter=${filter} → Request received`);

    try {
        // Calculate date range based on filter
        const now = new Date();
        let startDate;
        if (filter === 'today') {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (filter === '7days') {
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 6);
            startDate.setHours(0, 0, 0, 0);
        } else {
            // Default 30days
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 29);
            startDate.setHours(0, 0, 0, 0);
        }

        // Aggregate quotations by date
        const [revenueAgg, projectAgg] = await Promise.all([
            Quotation.aggregate([
                { $match: { createdAt: { $gte: startDate }, status: { $in: ['accepted', 'sent'] } } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        value: { $sum: '$summary.grandTotal' }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            Quotation.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        value: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ])
        ]);

        // Build date-wise map for filling missing dates with 0
        const revenueMap = {};
        revenueAgg.forEach(r => { revenueMap[r._id] = r.value; });

        const projectMap = {};
        projectAgg.forEach(p => { projectMap[p._id] = p.value; });

        // Generate all dates in range
        const revenueChart = [];
        const projectChart = [];
        const current = new Date(startDate);

        while (current <= now) {
            const dateKey = current.toISOString().split('T')[0];
            const label = current.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

            revenueChart.push({ name: label, value: revenueMap[dateKey] || 0 });
            projectChart.push({ name: label, value: projectMap[dateKey] || 0 });

            current.setDate(current.getDate() + 1);
        }

        const duration = Date.now() - startTime;
        console.log(`✅ [Dashboard] GET /charts?filter=${filter} → 200 OK (${duration}ms) | ${revenueChart.length} data points`);

        res.status(200).json({
            success: true,
            data: {
                revenueChart,
                projectChart
            }
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`❌ [Dashboard] GET /charts → 500 Error (${duration}ms):`, error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch chart data',
            error: error.message
        });
    }
};

/**
 * ─────────────────────────────────────────────────────────────
 * GET /api/dashboard/overview
 * Returns total revenue + total quotations count
 * ─────────────────────────────────────────────────────────────
 */
export const getOverview = async (req, res) => {
    const startTime = Date.now();
    console.log(`🏠 [Dashboard] GET /overview → Request received`);

    try {
        const [revenueAgg, totalQuotations] = await Promise.all([
            Quotation.aggregate([
                { $match: { status: { $in: ['accepted', 'sent'] } } },
                { $group: { _id: null, total: { $sum: '$summary.grandTotal' } } }
            ]),
            Quotation.countDocuments()
        ]);

        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        const duration = Date.now() - startTime;
        console.log(`✅ [Dashboard] GET /overview → 200 OK (${duration}ms) | revenue=₹${totalRevenue}, quotations=${totalQuotations}`);

        res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                totalQuotations
            }
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`❌ [Dashboard] GET /overview → 500 Error (${duration}ms):`, error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch overview',
            error: error.message
        });
    }
};
