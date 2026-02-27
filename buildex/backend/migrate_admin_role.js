/**
 * One-time migration: Update admin@buildex.io role to 'superadmin'
 * Run: node migrate_admin_role.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/buildex';

const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    isActive: Boolean
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

async function migrate() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Update buildexadmin → superadmin for the platform super admin account
        const result = await Admin.updateMany(
            { role: { $in: ['buildexadmin', 'super-admin'] } },
            { $set: { role: 'superadmin' } }
        );

        console.log(`✅ Migration done — ${result.modifiedCount} admin(s) updated to role: superadmin`);

        // Show current admins
        const admins = await Admin.find({}, 'name email role isActive');
        console.log('\n📋 Current admin accounts:');
        admins.forEach(a => {
            console.log(`  - ${a.name} (${a.email}) | role: ${a.role} | active: ${a.isActive}`);
        });

        await mongoose.disconnect();
        console.log('\n✅ Migration complete.');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
