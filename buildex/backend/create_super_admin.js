import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import connectDB from './db/index.js';

dotenv.config();

async function createSuperAdmin() {
    await connectDB();

    console.log('\n🔐 Creating Super Admin...\n');

    try {
        // Check if super-admin already exists
        const existingAdmin = await Admin.findOne({ role: 'super-admin' });

        if (existingAdmin) {
            console.log('⚠️  Super Admin already exists:');
            console.log(`   Email: ${existingAdmin.email}`);
            console.log(`   Name: ${existingAdmin.name}\n`);
            process.exit(0);
        }

        // Create super-admin
        const superAdmin = await Admin.create({
            name: 'Super Admin',
            email: 'admin@buildex.com',
            password: 'admin123', // Change this password after first login!
            role: 'super-admin'
        });

        console.log('✅ Super Admin created successfully!\n');
        console.log('📧 Email:', superAdmin.email);
        console.log('🔑 Password: admin123');
        console.log('\n⚠️  IMPORTANT: Change this password after first login!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating super admin:', error.message);
        process.exit(1);
    }
}

createSuperAdmin();
