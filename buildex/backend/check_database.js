import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import Quotation from './models/Quotation.js';
import Client from './models/Client.js';

dotenv.config();

async function checkDatabaseConnection() {
    console.log('\n🔍 ============================================');
    console.log('   DATABASE CONNECTION TEST');
    console.log('============================================\n');

    try {
        // Connect to database
        await connectDB();
        console.log('✅ MongoDB Connected Successfully!\n');

        // Check quotations count
        const quotationCount = await Quotation.countDocuments();
        console.log('📋 Total Quotations in Database:', quotationCount);

        // Get recent quotations (last 5)
        const recentQuotations = await Quotation.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('client');

        if (recentQuotations.length > 0) {
            console.log('\n📄 Recent Quotations:');
            console.log('════════════════════════════════════════════');
            recentQuotations.forEach((q, index) => {
                console.log(`\n${index + 1}. Quotation #${q.quotationNumber}`);
                console.log(`   Client: ${q.client?.name || 'Unknown'}`);
                console.log(`   Project: ${q.projectDetails?.projectType || 'N/A'}`);
                console.log(`   Status: ${q.status}`);
                console.log(`   Total: ₹${q.summary?.grandTotal || 0}`);
                console.log(`   Created: ${q.createdAt.toLocaleDateString()}`);
            });
            console.log('\n════════════════════════════════════════════');
        } else {
            console.log('\n⚠️  No quotations found in database yet.');
            console.log('   Create a quotation to test save functionality!\n');
        }

        // Check clients count
        const clientCount = await Client.countDocuments();
        console.log(`\n👥 Total Clients in Database: ${clientCount}`);

        console.log('\n✅ ============================================');
        console.log('   DATABASE IS WORKING PROPERLY!');
        console.log('============================================');
        console.log('\n💡 Tips:');
        console.log('   - Save a quotation in the app');
        console.log('   - Run this script again to see it in database');
        console.log('   - All saves/deletes happen in MongoDB automatically!\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ ============================================');
        console.error('   DATABASE CONNECTION FAILED!');
        console.error('============================================');
        console.error('\nError:', error.message);
        console.error('\n💡 Solution:');
        console.error('   1. Make sure MongoDB is running');
        console.error('   2. Check MONGODB_URI in .env file');
        console.error('   3. Install MongoDB if not installed\n');
        process.exit(1);
    }
}

checkDatabaseConnection();
