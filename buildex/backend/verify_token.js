import mongoose from 'mongoose';
import Quotation from './models/Quotation.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const connectDB = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');

        // Find ALL quotations
        const quotations = await Quotation.find().sort({ createdAt: -1 }).limit(5);
        console.log(`Found ${quotations.length} quotations.`);

        for (const q of quotations) {
            console.log('--------------------------------');
            console.log('Quotation:', q.quotationNumber);
            console.log('ID:', q._id);
            console.log('Access Token:', q.accessToken);
            console.log('Client Status:', q.clientStatus);

            if (!q.accessToken) {
                console.log('Generating token for testing...');
                q.accessToken = 'test-token-' + Date.now();
                await q.save();
                console.log('Added test token:', q.accessToken);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

connectDB();
