/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧾 INVOICE CONTROLLER - Complete Business Logic
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Invoice from '../models/Invoice.js';
import Quotation from '../models/Quotation.js';
import Client from '../models/Client.js';
import { generateInvoiceNumber } from '../utils/generateNumber.js';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * 1. CREATE INVOICE (from Quotation or Direct)
 * ─────────────────────────────────────────────────────────────────────────
 */
export const createInvoice = async (req, res) => {
    try {
        const { quotationId, clientDetails, projectDetails, items, summary, issueDate, dueDate, notes } = req.body;

        let client;
        let quotation;

        // If creating from quotation
        if (quotationId) {
            quotation = await Quotation.findById(quotationId).populate('client');
            if (!quotation) {
                return res.status(404).json({ message: 'Quotation not found' });
            }
            client = quotation.client;
        } else {
            // Direct invoice creation
            client = await Client.findOne({ phone: clientDetails.phone });
            if (!client) {
                client = await Client.create({
                    name: clientDetails.name,
                    phone: clientDetails.phone,
                    email: clientDetails.email,
                    address: clientDetails.siteAddress
                });
            }
        }

        // Generate invoice number
        const invoiceNumber = await generateInvoiceNumber();

        // Prepare invoice data
        const invoiceData = {
            invoiceNumber,
            client: client._id,
            quotation: quotationId || undefined,
            projectDetails: projectDetails || quotation?.projectDetails,
            items: items || quotation?.costItems,
            summary: summary || quotation?.summary,
            issueDate: issueDate || new Date(),
            dueDate: dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            balanceAmount: summary?.grandTotal || quotation?.summary.grandTotal,
            notes
        };

        const invoice = await Invoice.create(invoiceData);

        // Update client statistics
        client.totalInvoices += 1;
        await client.save();

        await invoice.populate(['client', 'quotation']);

        res.status(201).json(invoice);
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({
            message: 'Failed to create invoice',
            error: error.message
        });
    }
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * 2. GET ALL INVOICES
 * ─────────────────────────────────────────────────────────────────────────
 */
export const getAllInvoices = async (req, res) => {
    try {
        const { status, paymentStatus, startDate, endDate, clientId } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (paymentStatus) filter.paymentStatus = paymentStatus;
        if (clientId) filter.client = clientId;
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const invoices = await Invoice.find(filter)
            .sort({ createdAt: -1 })
            .populate('client')
            .populate('quotation');

        res.status(200).json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({
            message: 'Failed to fetch invoices',
            error: error.message
        });
    }
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * 3. GET SINGLE INVOICE
 * ─────────────────────────────────────────────────────────────────────────
 */
export const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate('client')
            .populate('quotation');

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json(invoice);
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({
            message: 'Failed to fetch invoice',
            error: error.message
        });
    }
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * 4. UPDATE INVOICE
 * ─────────────────────────────────────────────────────────────────────────
 */
export const updateInvoice = async (req, res) => {
    try {
        const { projectDetails, items, summary, dueDate, notes } = req.body;

        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        if (projectDetails) invoice.projectDetails = projectDetails;
        if (items) invoice.items = items;
        if (summary) {
            invoice.summary = summary;
            invoice.balanceAmount = summary.grandTotal - invoice.paidAmount;
        }
        if (dueDate) invoice.dueDate = new Date(dueDate);
        if (notes !== undefined) invoice.notes = notes;

        await invoice.save();

        res.status(200).json(invoice);
    } catch (error) {
        console.error('Error updating invoice:', error);
        res.status(500).json({
            message: 'Failed to update invoice',
            error: error.message
        });
    }
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * 5. DELETE INVOICE
 * ─────────────────────────────────────────────────────────────────────────
 */
export const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // Update client statistics
        const client = await Client.findById(invoice.client);
        if (client) {
            client.totalInvoices = Math.max(0, client.totalInvoices - 1);
            client.totalRevenue = Math.max(0, client.totalRevenue - invoice.paidAmount);
            await client.save();
        }

        await invoice.deleteOne();

        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({
            message: 'Failed to delete invoice',
            error: error.message
        });
    }
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * 6. UPDATE INVOICE STATUS
 * ─────────────────────────────────────────────────────────────────────────
 */
export const updateInvoiceStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        invoice.status = status;

        if (status === 'sent') invoice.sentAt = new Date();
        if (status === 'viewed') invoice.viewedAt = new Date();

        await invoice.save();

        res.status(200).json(invoice);
    } catch (error) {
        console.error('Error updating invoice status:', error);
        res.status(500).json({
            message: 'Failed to update invoice status',
            error: error.message
        });
    }
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * 7. GET INVOICE STATISTICS
 * ─────────────────────────────────────────────────────────────────────────
 */
export const getInvoiceStats = async (req, res) => {
    try {
        const totalInvoices = await Invoice.countDocuments();
        const pendingInvoices = await Invoice.countDocuments({ paymentStatus: 'Pending' });
        const partialInvoices = await Invoice.countDocuments({ paymentStatus: 'Partial' });
        const paidInvoices = await Invoice.countDocuments({ paymentStatus: 'Paid' });
        const overdueInvoices = await Invoice.countDocuments({ paymentStatus: 'Overdue' });

        const invoices = await Invoice.find();
        const totalRevenue = invoices.reduce((sum, inv) => sum + inv.summary.grandTotal, 0);
        const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
        const totalPending = totalRevenue - totalPaid;

        res.status(200).json({
            total: totalInvoices,
            pending: pendingInvoices,
            partial: partialInvoices,
            paid: paidInvoices,
            overdue: overdueInvoices,
            totalRevenue,
            totalPaid,
            totalPending
        });
    } catch (error) {
        console.error('Error fetching invoice stats:', error);
        res.status(500).json({
            message: 'Failed to fetch invoice stats',
            error: error.message
        });
    }
};
