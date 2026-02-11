import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import connectDB from './db/index.js';
import bcrypt from 'bcryptjs';

dotenv.config();

async function testLogin() {
    try {
        await connectDB();
        console.log('\n══════════════════════════════════════');
        console.log('🔐 TESTING LOGIN CREDENTIALS');
        console.log('══════════════════════════════════════');

        const email = 'admin@buildex.com';
        const password = 'admin123';

        console.log(`\n📧 Testing email: ${email}`);
        console.log(`🔑 Testing password: ${password}`);

        // Find admin
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            console.log('\n❌ Admin not found!');
            process.exit(1);
        }

        console.log(`\n✅ Admin found: ${admin.name} (${admin.role})`);
        console.log(`   Active: ${admin.isActive}`);
        console.log(`   Password hash: ${admin.password.substring(0, 30)}...`);

        // Test password comparison
        console.log('\n🔍 Testing password comparison...');
        const isMatch = await admin.comparePassword(password);

        if (isMatch) {
            console.log('✅ ✅ ✅ PASSWORD MATCH! Login should work.');
        } else {
            console.log('❌ ❌ ❌ PASSWORD DOES NOT MATCH!');

            // Try direct bcrypt comparison
            console.log('\n🔍 Trying direct bcrypt comparison...');
            const directMatch = await bcrypt.compare(password, admin.password);
            console.log(`   Direct bcrypt result: ${directMatch}`);
        }

        console.log('\n══════════════════════════════════════');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

testLogin();
