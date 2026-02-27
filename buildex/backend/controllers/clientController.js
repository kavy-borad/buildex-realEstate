/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 👥 CLIENT CONTROLLER
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Client from '../models/Client.js';
import Quotation from '../models/Quotation.js';
import Invoice from '../models/Invoice.js';

// Get All Clients
export const getAllClients = async (req, res) => {
    try {
        const { search, status } = req.query;

        const filter = { adminId: req.admin._id };
        if (status) filter.status = status;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const clients = await Client.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: clients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch clients',
            error: error.message
        });
    }
};

// Get Single Client with Details
export const getClientById = async (req, res) => {
    try {
        const client = await Client.findOne({ _id: req.params.id, adminId: req.admin._id });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Get client's quotations and invoices
        const quotations = await Quotation.find({ client: req.params.id }).sort({ createdAt: -1 }).limit(10);
        const invoices = await Invoice.find({ client: req.params.id }).sort({ createdAt: -1 }).limit(10);

        res.status(200).json({
            success: true,
            data: {
                client,
                quotations,
                invoices
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch client',
            error: error.message
        });
    }
};

// Create Client
export const createClient = async (req, res) => {
    try {
        const clientData = {
            ...req.body,
            adminId: req.admin._id
        };
        const client = await Client.create(clientData);
        res.status(201).json({
            success: true,
            data: client
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create client',
            error: error.message
        });
    }
};

// Update Client
export const updateClient = async (req, res) => {
    try {
        const client = await Client.findOneAndUpdate(
            { _id: req.params.id, adminId: req.admin._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.status(200).json({
            success: true,
            data: client
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update client',
            error: error.message
        });
    }
};

// Delete Client
export const deleteClient = async (req, res) => {
    try {
        const client = await Client.findOneAndDelete({ _id: req.params.id, adminId: req.admin._id });
        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found' });
        }
        res.status(200).json({ success: true, message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete client', error: error.message });
    }
};

// Get Client Stats
export const getClientStats = async (req, res) => {
    try {
        const filter = { adminId: req.admin._id };
        const totalClients = await Client.countDocuments(filter);
        const activeClients = await Client.countDocuments({ ...filter, status: 'active' });

        const clients = await Client.find(filter);
        const totalRevenue = clients.reduce((sum, c) => sum + (c.totalRevenue || 0), 0);

        res.status(200).json({
            success: true,
            data: {
                total: totalClients,
                active: activeClients,
                totalRevenue
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch client stats',
            error: error.message
        });
    }
};
