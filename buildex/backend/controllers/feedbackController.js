/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 💬 CLIENT FEEDBACK CONTROLLER
 * ═══════════════════════════════════════════════════════════════════════════
 * Handles client feedback on quotations (approve, reject, request changes)
 */

import Quotation from '../models/Quotation.js';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * 1. SUBMIT CLIENT FEEDBACK
 * ─────────────────────────────────────────────────────────────────────────
 */
export const submitClientFeedback = async (req, res) => {
    try {
        const { quotationId } = req.params;
        const { action, comments, rejectionReason, requestedChanges } = req.body;

        // Validate action
        const validActions = ['approve', 'reject', 'request-changes'];
        if (!validActions.includes(action)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid action. Must be approve, reject, or request-changes'
            });
        }

        // Find quotation
        const quotation = await Quotation.findById(quotationId).populate('client');

        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: 'Quotation not found'
            });
        }

        // Update client feedback
        quotation.clientFeedback = {
            action,
            comments: comments || '',
            rejectionReason: action === 'reject' ? rejectionReason : undefined,
            requestedChanges: action === 'request-changes' ? requestedChanges : undefined,
            respondedAt: new Date(),
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent')
        };

        // Update quotation status based on action
        if (action === 'approve') {
            quotation.status = 'accepted';
            quotation.clientStatus = 'approved';
            quotation.acceptedAt = new Date();
        } else if (action === 'reject') {
            quotation.status = 'rejected';
            quotation.clientStatus = 'rejected';
            quotation.rejectedAt = new Date();
        } else if (action === 'request-changes') {
            quotation.clientStatus = 'changes-requested';
        }

        // Add to activity log
        quotation.activityLog.push({
            action: `Client ${action}`,
            timestamp: new Date(),
            details: comments || `Client ${action} quotation`,
            ipAddress: req.ip || req.connection.remoteAddress
        });

        await quotation.save();

        res.status(200).json({
            success: true,
            message: 'Feedback submitted successfully',
            data: quotation
        });
    } catch (error) {
        console.error('Error submitting client feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit feedback',
            error: error.message
        });
    }
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * 2. GET QUOTATION FEEDBACK
 * ─────────────────────────────────────────────────────────────────────────
 */
export const getQuotationFeedback = async (req, res) => {
    try {
        const { quotationId } = req.params;

        const quotation = await Quotation.findById(quotationId)
            .select('clientFeedback clientStatus status activityLog')
            .populate('client', 'name email');

        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: 'Quotation not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                clientFeedback: quotation.clientFeedback,
                clientStatus: quotation.clientStatus,
                status: quotation.status,
                activityLog: quotation.activityLog,
                client: quotation.client
            }
        });
    } catch (error) {
        console.error('Error fetching quotation feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback',
            error: error.message
        });
    }
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * 3. GET ALL QUOTATIONS WITH FEEDBACK
 * ─────────────────────────────────────────────────────────────────────────
 */
export const getAllQuotationsWithFeedback = async (req, res) => {
    try {
        const { status, clientStatus } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (clientStatus) filter.clientStatus = clientStatus;

        const quotations = await Quotation.find(filter)
            .populate('client', 'name email phone')
            .select('quotationNumber clientFeedback clientStatus status summary createdAt')
            .sort({ createdAt: -1 });

        // Filter only quotations with feedback
        const quotationsWithFeedback = quotations.filter(q => q.clientFeedback && q.clientFeedback.action);

        res.status(200).json({
            success: true,
            count: quotationsWithFeedback.length,
            data: quotationsWithFeedback
        });
    } catch (error) {
        console.error('Error fetching quotations with feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch quotations',
            error: error.message
        });
    }
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * 4. GET FEEDBACK STATISTICS
 * ─────────────────────────────────────────────────────────────────────────
 */
export const getFeedbackStatistics = async (req, res) => {
    try {
        const [approvedCount, rejectedCount, changesRequestedCount, totalWithFeedback] = await Promise.all([
            Quotation.countDocuments({ 'clientFeedback.action': 'approve' }),
            Quotation.countDocuments({ 'clientFeedback.action': 'reject' }),
            Quotation.countDocuments({ 'clientFeedback.action': 'request-changes' }),
            Quotation.countDocuments({ clientFeedback: { $exists: true, $ne: null } })
        ]);

        // Get recent feedback
        const recentFeedback = await Quotation.find({
            'clientFeedback.action': { $exists: true }
        })
            .populate('client', 'name')
            .select('quotationNumber clientFeedback client createdAt')
            .sort({ 'clientFeedback.respondedAt': -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            data: {
                statistics: {
                    approved: approvedCount,
                    rejected: rejectedCount,
                    changesRequested: changesRequestedCount,
                    total: totalWithFeedback
                },
                recentFeedback
            }
        });
    } catch (error) {
        console.error('Error fetching feedback statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
};
