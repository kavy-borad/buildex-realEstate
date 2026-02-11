import mongoose from 'mongoose';
import Quotation from './models/Quotation.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const checkTokens = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const quotations = await Quotation.find().sort({ createdAt: -1 }).limit(3);

        console.log('\n--- RECENT QUOTATIONS ---');
        quotations.forEach(q => {
            console.log(`QT: ${q.quotationNumber}`);
            console.log(`ID: ${q._id}`);
            console.log(`Token: ${q.accessToken}`);
            console.log(`Expires: ${q.tokenExpiresAt}`);
            console.log(`Link: http://localhost:8080/quotation/view/${q.accessToken}`);
            console.log('-------------------------');
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkTokens();
