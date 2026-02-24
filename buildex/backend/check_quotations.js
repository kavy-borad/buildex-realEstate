
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quotation from './models/Quotation.js';

dotenv.config();

async function checkQuotations() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB\n');

        const quotations = await Quotation.find().populate('client').limit(5).sort({ createdAt: -1 });

        console.log(`Found ${quotations.length} quotation(s):\n`);

        quotations.forEach((q, i) => {
            console.log(`${i + 1}. ID: ${q._id}`);
            console.log(`   Number: ${q.quotationNumber}`);
            console.log(`   Client: ${q.client?.name || 'Unknown'}`);
            console.log(`   Total: ₹${q.summary.grandTotal.toLocaleString()}`);
            console.log(`   PDF Link: http://localhost:5000/api/pdf/${q._id}/download\n`);
        });

        if (quotations.length > 0) {
            console.log(`\n✅ Test this ID in your frontend: ${quotations[0]._id}`);
        } else {
            console.log('\n❌ No quotations found!');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkQuotations();
