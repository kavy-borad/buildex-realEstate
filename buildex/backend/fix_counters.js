
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Settings from './models/Settings.js';
import Quotation from './models/Quotation.js';
import Invoice from './models/Invoice.js';
import connectDB from './db/index.js';

dotenv.config();

async function fix() {
    await connectDB();
    console.log('connected');

    const settings = await Settings.getInstance();

    // 1. Fix Quotation Counter
    const lastQuote = await Quotation.findOne().sort({ createdAt: -1 });
    if (lastQuote) {
        // Assume format QT-YYYY-XXXX
        const parts = lastQuote.quotationNumber.split('-');
        const num = parseInt(parts[parts.length - 1]);
        if (!isNaN(num)) {
            console.log(`Latest Quote: ${lastQuote.quotationNumber} (Seq: ${num})`);
            if (settings.numbering.quotationCounter <= num) {
                console.log(`Updating Quote Counter from ${settings.numbering.quotationCounter} to ${num + 1}`);
                settings.numbering.quotationCounter = num + 1;
            }
        }
    }

    // 2. Fix Invoice Counter
    const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
    if (lastInvoice) {
        // Assume format INV-YYYY-XXXX
        const parts = lastInvoice.invoiceNumber.split('-');
        const num = parseInt(parts[parts.length - 1]);
        if (!isNaN(num)) {
            console.log(`Latest Invoice: ${lastInvoice.invoiceNumber} (Seq: ${num})`);
            if (settings.numbering.invoiceCounter <= num) {
                console.log(`Updating Invoice Counter from ${settings.numbering.invoiceCounter} to ${num + 1}`);
                settings.numbering.invoiceCounter = num + 1;
            }
        }
    }

    await settings.save();
    console.log('✅ Counters Synchronized.');
    process.exit(0);
}

fix();
