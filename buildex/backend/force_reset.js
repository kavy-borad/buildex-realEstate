
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Settings from './models/Settings.js';
import connectDB from './db/index.js';

dotenv.config();

async function forceReset() {
    await connectDB();
    const settings = await Settings.getInstance();

    console.log('Old Quotation Counter:', settings.numbering.quotationCounter);
    settings.numbering.quotationCounter = 10;

    await settings.save();
    console.log('New Quotation Counter:', settings.numbering.quotationCounter);

    process.exit(0);
}

forceReset();
