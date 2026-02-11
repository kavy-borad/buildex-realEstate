
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quotation from './models/Quotation.js';
import Client from './models/Client.js';
import Settings from './models/Settings.js';
import connectDB from './db/index.js';

dotenv.config();

async function viewData() {
    await connectDB();
    console.log('\n══════════════════════════════════════');
    console.log('📊 DATABASE VIEWER');
    console.log('══════════════════════════════════════');

    // 1. Settings
    const settings = await Settings.findOne();
    console.log('\n⚙️  SETTINGS (Counters):');
    console.log(`   - Quotation Counter: ${settings?.numbering?.quotationCounter}`);
    console.log(`   - Invoice Counter:   ${settings?.numbering?.invoiceCounter}`);

    // 2. Clients
    const clients = await Client.find().sort({ createdAt: -1 }).limit(5);
    console.log(`\n👥 RECENT CLIENTS (${clients.length}):`);
    clients.forEach(c => {
        console.log(`   - [${c.name}] Phone: ${c.phone}, Quotes: ${c.totalQuotations}`);
    });

    // 3. Quotations
    const quotes = await Quotation.find().sort({ createdAt: -1 }).limit(5).populate('client');
    console.log(`\n📄 RECENT QUOTATIONS (${quotes.length}):`);
    quotes.forEach(q => {
        console.log(`   - ${q.quotationNumber} | Client: ${q.client?.name} | Amount: ₹${q.summary.grandTotal}`);
        console.log(`     ID: ${q._id}`);
    });

    console.log('\n══════════════════════════════════════');
    process.exit(0);
}

viewData();
