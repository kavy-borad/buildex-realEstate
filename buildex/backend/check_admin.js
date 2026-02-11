import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import connectDB from './db/index.js';

dotenv.config();

async function checkAdmins() {
    try {
        await connectDB();
        console.log('\n══════════════════════════════════════');
        console.log('👮 ADMIN USERS IN DATABASE');
        console.log('══════════════════════════════════════');

        const admins = await Admin.find().select('+password');

        if (admins.length === 0) {
            console.log('\n❌ No admin users found in the database.');
            console.log('\n💡 Run create_super_admin.js to create the first admin.');
        } else {
            console.log(`\n✅ Found ${admins.length} admin(s):\n`);
            admins.forEach(admin => {
                console.log(`   📧 Email: ${admin.email}`);
                console.log(`   👤 Name: ${admin.name}`);
                console.log(`   🔑 Role: ${admin.role}`);
                console.log(`   ✓  Active: ${admin.isActive}`);
                console.log(`   🔒 Password Hash: ${admin.password.substring(0, 20)}...`);
                console.log('   ---');
            });
        }

        console.log('\n══════════════════════════════════════');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkAdmins();
