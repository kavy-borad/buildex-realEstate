import mongoose from 'mongoose';
import Quotation from './models/Quotation.js';
import Client from './models/Client.js';
import { generateQuotationNumber } from './utils/generateNumber.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const createTestQuotation = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');

        // Create dummy client
        const client = await Client.findOneAndUpdate(
            { phone: '9999999999' },
            {
                name: 'Test Client',
                phone: '9999999999',
                email: 'test@example.com',
                address: 'Test Address'
            },
            { upsert: true, new: true }
        );

        const quotationNumber = await generateQuotationNumber();
        const accessToken = crypto.randomBytes(32).toString('hex');

        const quotation = await Quotation.create({
            quotationNumber,
            client: client._id,
            projectDetails: {
                projectType: 'Residential',
                builtUpArea: 1000,
                areaUnit: 'Sq.ft',
                city: 'Test City',
                area: 'Test Area',
                constructionQuality: 'standard',
                projectDuration: '6 Months'
            },
            costItems: [{
                itemName: 'Test Item',
                quantity: 1,
                unit: 'Nos',
                rate: 1000,
                total: 1000
            }],
            summary: {
                subtotal: 1000,
                gstAmount: 180,
                grandTotal: 1180
            },
            status: 'draft',
            accessToken,
            tokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

        const fs = await import('fs');
        fs.writeFileSync('quotation_link.txt', `http://localhost:8080/quotation/view/${quotation.accessToken}`);
        console.log('Link written to quotation_link.txt');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`Validation Error [${key}]:`, error.errors[key].message);
            });
        }
        process.exit(1);
    }
};

createTestQuotation();
