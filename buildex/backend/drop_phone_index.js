import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Client from './models/Client.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        try {
            // Drop the old index
            await mongoose.connection.collection('clients').dropIndex('phone_1');
            console.log('Successfully dropped phone_1 index.');
        } catch (err) {
            console.log('phone_1 index might not exist or already dropped:', err.message);
        }

        try {
            // Make mongoose sync indexes based on the updated schema
            await Client.syncIndexes();
            console.log('Successfully synced new indexes.');
        } catch (err) {
            console.log('Error syncing indexes:', err.message);
        }

        process.exit(0);
    })
    .catch((err) => {
        console.error('Connection error:', err);
        process.exit(1);
    });
