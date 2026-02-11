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

        // 2. Revenue Stats
        const invoices = await Invoice.find();
        const totalRevenue = invoices.reduce((sum, inv) => sum + inv.summary.grandTotal, 0);
        const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
        const totalPending = totalRevenue - totalCollected;

        // 3. Status Breakdown
        const draftQuotations = await Quotation.countDocuments({ status: 'draft' });
        const sentQuotations = await Quotation.countDocuments({ status: 'sent' });
        const acceptedQuotations = await Quotation.countDocuments({ status: 'accepted' });

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

        // 5. Revenue Chart Data (Last 30 Days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const revenueChartData = await Invoice.aggregate([
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

        // Fill in missing dates for the last 30 days
        const filledRevenueData = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateString = d.toISOString().split('T')[0];
            const found = revenueChartData.find(item => item._id === dateString);

            // Format date for display (e.g., "Oct 24")
            const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            filledRevenueData.push({
                date: dateString,
                name: displayDate,
                value: found ? found.value : 0
            });
        }

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalQuotations,
                    totalInvoices,
                    totalClients,
                    totalRevenue,
                    totalCollected,
                    totalPending
                },
                quotationStats: {
                    draft: draftQuotations,
                    sent: sentQuotations,
                    accepted: acceptedQuotations
                },
                invoiceStats: {
                    pending: pendingInvoices,
                    overdue: overdueInvoices
                },
                recentActivity: activities,
                notifications,
                revenueChart: filledRevenueData
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
