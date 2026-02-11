/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔄 MIGRATION SCRIPT - Generate Access Tokens for Existing Quotations
 * ═══════════════════════════════════════════════════════════════════════════
 */

import mongoose from 'mongoose';
import Quotation from './models/Quotation.js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const generateTokensForExistingQuotations = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find all quotations without access token
        const quotationsWithoutToken = await Quotation.find({
            $or: [
                { accessToken: { $exists: false } },
                { accessToken: null },
                { accessToken: '' }
            ]
        });

        console.log(`📋 Found ${quotationsWithoutToken.length} quotations without access tokens\n`);

        if (quotationsWithoutToken.length === 0) {
            console.log('✅ All quotations already have access tokens!');
            process.exit(0);
        }

        let updated = 0;
        for (const quotation of quotationsWithoutToken) {
            // Generate secure access token
            const accessToken = crypto.randomBytes(32).toString('hex');

            // Set token expiry (use validTill or 30 days from now)
            const tokenExpiresAt = quotation.validTill || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

            // Update directly to bypass validation
            await Quotation.updateOne(
                { _id: quotation._id },
                {
                    $set: {
                        accessToken: accessToken,
                        tokenExpiresAt: tokenExpiresAt
                    }
                }
            );

            console.log(`✅ Generated token for quotation: ${quotation.quotationNumber || quotation._id}`);
            console.log(`   Token: ${accessToken}`);
            console.log(`   Link: http://localhost:8080/quotation/view/${accessToken}\n`);

            updated++;
        }

        console.log(`\n🎉 Successfully generated tokens for ${updated} quotations!`);
        console.log('✅ Migration complete!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error generating tokens:', error);
        process.exit(1);
    }
};

// Run the migration
generateTokensForExistingQuotations();
