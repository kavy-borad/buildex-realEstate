
import mongoose from 'mongoose';
import Quotation from './models/Quotation.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Find a quotation with an access token
        const quotation = await Quotation.findOne({ accessToken: { $exists: true, $ne: null } }).sort({ createdAt: -1 });

        if (quotation) {
            const fs = await import('fs');
            await fs.promises.writeFile('token.txt', quotation.accessToken);
            console.log('Token written to token.txt');
        } else {
            console.log('NO_TOKEN_FOUND');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();
