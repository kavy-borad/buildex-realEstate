
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Settings from './models/Settings.js';
import Quotation from './models/Quotation.js';
import connectDB from './db/index.js';

dotenv.config();

async function check() {
    await connectDB();
    console.log('connected');

    const settings = await Settings.findOne();
    console.log('Current Settings Counter:', settings?.numbering?.quotationCounter);

    const quotes = await Quotation.find().sort({ createdAt: -1 }).limit(3);
    console.log('Latest Quotations:', quotes.map(q => q.quotationNumber));

    // Check consistency
    // If Counter is 2, next is 2. 
    // If latest quote is QT-..-0002, then we have a collision if we try 2 again.
    // Ideally Counter should be > Latest Quote Suffix.

    process.exit(0);
}

check();
