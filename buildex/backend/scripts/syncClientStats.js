/**
 * Script to recalculate and sync all client statistics
 * Run this to fix any data inconsistencies
 */

import mongoose from 'mongoose';
import Client from '../models/Client.js';
import Quotation from '../models/Quotation.js';
import Invoice from '../models/Invoice.js';
import dotenv from 'dotenv';

dotenv.config();

async function syncClientStats() {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get all clients
        const clients = await Client.find();
        console.log(`Found ${clients.length} clients`);

        for (const client of clients) {
            // Count actual quotations
            const actualQuotations = await Quotation.countDocuments({ client: client._id });

            // Count actual invoices
            const actualInvoices = await Invoice.countDocuments({ client: client._id });

            // Calculate actual revenue
            const invoices = await Invoice.find({ client: client._id });
            const actualRevenue = invoices.reduce((sum, inv) => sum + (inv.summary?.grandTotal || 0), 0);

            // Update client
            client.totalQuotations = actualQuotations;
            client.totalInvoices = actualInvoices;
            client.totalRevenue = actualRevenue;
            await client.save();

            console.log(`✓ ${client.name}: ${actualQuotations} quotations, ${actualInvoices} invoices, ₹${actualRevenue} revenue`);
        }

        console.log('\n✅ All client statistics synced successfully!');

        // Show summary
        const totalQuotations = await Quotation.countDocuments();
        const sumClientQuotations = clients.reduce((sum, c) => sum + c.totalQuotations, 0);
        console.log(`\nDatabase has ${totalQuotations} quotations`);
        console.log(`Clients sum shows ${sumClientQuotations} quotations`);
        console.log(totalQuotations === sumClientQuotations ? '✅ Counts match!' : '⚠️  Still mismatch - check for quotations without clients');

    } catch (error) {
        console.error('Error syncing client stats:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

syncClientStats();
