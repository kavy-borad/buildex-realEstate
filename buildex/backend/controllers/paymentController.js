/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 💰 PAYMENT CONTROLLER
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Payment from '../models/Payment.js';
import Invoice from '../models/Invoice.js';
import Client from '../models/Client.js';

// Create Payment
export const createPayment = async (req, res) => {
    try {
        const { invoiceId, amount, paymentDate, paymentMethod, transactionId, notes } = req.body;

        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        const payment = await Payment.create({
            invoice: invoiceId,
            client: invoice.client,
            amount,
            paymentDate: paymentDate || new Date(),
            paymentMethod,
            transactionId,
            notes
        });

        // Update invoice payment status
        invoice.paidAmount += amount;
        invoice.updatePaymentStatus();
        await invoice.save();

        // Update client revenue
        const client = await Client.findById(invoice.client);
        if (client) {
            client.totalRevenue += amount;
            await client.save();
        }

        await payment.populate(['invoice', 'client']);

        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Failed to record payment', error: error.message });
    }
};

// Get All Payments
export const getAllPayments = async (req, res) => {
    try {
        const { invoiceId, clientId, startDate, endDate } = req.query;

        const filter = {};
        if (invoiceId) filter.invoice = invoiceId;
        if (clientId) filter.client = clientId;
        if (startDate || endDate) {
            filter.paymentDate = {};
            if (startDate) filter.paymentDate.$gte = new Date(startDate);
            if (endDate) filter.paymentDate.$lte = new Date(endDate);
        }

        const payments = await Payment.find(filter).sort({ paymentDate: -1 });

        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch payments', error: error.message });
    }
};

// Get Single Payment
export const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch payment', error: error.message });
    }
};

// Delete Payment
export const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Revert invoice payment status
        const invoice = await Invoice.findById(payment.invoice);
        if (invoice) {
            invoice.paidAmount = Math.max(0, invoice.paidAmount - payment.amount);
            invoice.updatePaymentStatus();
            await invoice.save();
        }

        // Revert client revenue
        const client = await Client.findById(payment.client);
        if (client) {
            client.totalRevenue = Math.max(0, client.totalRevenue - payment.amount);
            await client.save();
        }

        await payment.deleteOne();

        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete payment', error: error.message });
    }
};

// Get Payment Stats
export const getPaymentStats = async (req, res) => {
    try {
        const totalPayments = await Payment.countDocuments();
        const payments = await Payment.find();
        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

        // Group by payment method
        const byMethod = await Payment.aggregate([
            {
                $group: {
                    _id: '$paymentMethod',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        res.status(200).json({
            total: totalPayments,
            totalAmount,
            byMethod
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch payment stats', error: error.message });
    }
};
