/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 DASHBOARD CONTROLLER
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Quotation from '../models/Quotation.js';
import Invoice from '../models/Invoice.js';
import Client from '../models/Client.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';

export const getDashboardStats = async (req, res) => {
    try {
        // 1. Basic Counts
        const totalQuotations = await Quotation.countDocuments();
        const totalInvoices = await Invoice.countDocuments();
        const totalClients = await Client.countDocuments();

        // 2. Revenue Stats - DYNAMIC FROM DATABASE

        // Invoice-based revenue (Actual Revenue)
        const invoices = await Invoice.find();
        const invoiceRevenue = invoices.reduce((sum, inv) => sum + (inv.summary?.grandTotal || 0), 0);
        const totalCollected = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
        const invoicePending = invoiceRevenue - totalCollected;

        // Quotation-based revenue (Projected Revenue from accepted/sent quotations)
        const acceptedSentQuotations = await Quotation.find({
            status: { $in: ['accepted', 'sent'] }
        });
        const quotationRevenue = acceptedSentQuotations.reduce((sum, quot) => sum + (quot.summary?.grandTotal || 0), 0);

        // Total Revenue = Invoice Revenue + Quotation Revenue
        const totalRevenue = invoiceRevenue + quotationRevenue;
        const totalPending = invoicePending;

        // 3. Status Breakdown
        const draftQuotations = await Quotation.countDocuments({ status: 'draft' });
        const sentQuotations = await Quotation.countDocuments({ status: 'sent' });
        const acceptedQuotations = await Quotation.countDocuments({ status: 'accepted' });
        const rejectedQuotations = await Quotation.countDocuments({ status: 'rejected' });

        // Working Projects: accepted + sent (projects that are in progress or confirmed)
        const workingQuotations = await Quotation.countDocuments({
            status: { $in: ['accepted', 'sent'] }
        });

        const pendingInvoices = await Invoice.countDocuments({ paymentStatus: 'Pending' });
        const overdueInvoices = await Invoice.countDocuments({ paymentStatus: 'Overdue' });

        // 4. Recent Activity (Last 5 combined)
        const recentQuotations = await Quotation.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('client', 'name')
            .lean();

        const recentInvoices = await Invoice.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('client', 'name')
            .lean();

        const activities = [
            ...recentQuotations.map(q => ({ ...q, type: 'quotation' })),
            ...recentInvoices.map(i => ({ ...i, type: 'invoice' }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);

        // Notifications
        const notifications = await Notification.find()
            .sort({ createdAt: -1 })
            .limit(10);

        // 5. Revenue Chart Data (Last 30 Days) - DYNAMIC FROM DATABASE
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        // Get invoice revenue by date
        const invoiceChartData = await Invoice.aggregate([
            {
                $match: {
                    issueDate: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$issueDate" } },
                    value: { $sum: "$summary.grandTotal" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get quotation revenue by date (from accepted/sent quotations)
        const quotationChartData = await Quotation.aggregate([
            {
                $match: {
                    status: { $in: ['accepted', 'sent'] },
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    value: { $sum: "$summary.grandTotal" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Combine invoice and quotation data by date
        const combinedRevenueData = {};

        invoiceChartData.forEach(item => {
            combinedRevenueData[item._id] = (combinedRevenueData[item._id] || 0) + item.value;
        });

        quotationChartData.forEach(item => {
            combinedRevenueData[item._id] = (combinedRevenueData[item._id] || 0) + item.value;
        });

        // Get project count by date (all created quotations)
        const projectChartData = await Quotation.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const combinedProjectData = {};
        projectChartData.forEach(item => {
            combinedProjectData[item._id] = item.count;
        });

        // Fill in missing dates for the last 30 days
        const filledRevenueData = [];
        const filledProjectData = [];

        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateString = d.toISOString().split('T')[0];

            // Format date for display (e.g., "Oct 24")
            const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            filledRevenueData.push({
                date: dateString,
                name: displayDate,
                value: combinedRevenueData[dateString] || 0
            });

            filledProjectData.push({
                date: dateString,
                name: displayDate,
                value: combinedProjectData[dateString] || 0
            });
        }

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalQuotations,
                    totalInvoices,
                    totalClients,
                    totalRevenue,           // Combined revenue from invoices + quotations
                    invoiceRevenue,         // Revenue from invoices only
                    quotationRevenue,       // Revenue from accepted/sent quotations
                    totalCollected,         // Amount collected from invoices
                    totalPending            // Pending amount from invoices
                },
                quotationStats: {
                    draft: draftQuotations,
                    sent: sentQuotations,
                    accepted: acceptedQuotations,
                    rejected: rejectedQuotations,
                    working: workingQuotations
                },
                invoiceStats: {
                    pending: pendingInvoices,
                    overdue: overdueInvoices
                },
                recentActivity: activities,
                notifications,
                revenueChart: filledRevenueData,
                projectChart: filledProjectData
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard stats',
            error: error.message
        });
    }
};
