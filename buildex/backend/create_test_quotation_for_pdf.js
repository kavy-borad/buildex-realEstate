
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quotation from './models/Quotation.js';
import Client from './models/Client.js';

dotenv.config();

const createTestQuotation = async () => {
    try {
        console.log('📦 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // 1. Create or find a test client
        let client = await Client.findOne({ name: 'Test Client for PDF' });

        if (!client) {
            console.log('👤 Creating test client...');
            client = await Client.create({
                name: 'Test Client for PDF',
                email: 'testclient@example.com',
                phone: '9876543210',
                address: '123 Test Street, Test City, Test State - 123456',
                status: 'active'
            });
            console.log('✅ Test client created:', client.name);
        } else {
            console.log('✅ Test client already exists:', client.name);
        }

        // 2. Create a test quotation
        console.log('\n📄 Creating test quotation...');

        const quotation = await Quotation.create({
            quotationNumber: `QT-${Date.now()}`,
            client: client._id,
            projectDetails: {
                projectType: 'Residential - Villa',
                builtUpArea: 2500,
                areaUnit: 'Sq.ft',
                city: 'Mumbai',
                area: 'Bandra West',
                constructionQuality: 'premium',
                projectDuration: '6 months'
            },
            costItems: [
                {
                    itemName: 'Civil Work',
                    category: 'Construction',
                    description: 'Complete civil construction including foundation, walls, and finishing',
                    quantity: 2500,
                    unit: 'Sq.ft',
                    rate: 1500,
                    total: 3750000
                },
                {
                    itemName: 'Electrical Work',
                    category: 'Electrical',
                    description: 'Complete electrical wiring, fixtures, and connection',
                    quantity: 2500,
                    unit: 'Sq.ft',
                    rate: 200,
                    total: 500000
                },
                {
                    itemName: 'Plumbing Work',
                    category: 'Plumbing',
                    description: 'Complete plumbing including pipes, fittings, and sanitary',
                    quantity: 2500,
                    unit: 'Sq.ft',
                    rate: 150,
                    total: 375000
                },
                {
                    itemName: 'False Ceiling',
                    category: 'Interior',
                    description: 'POP false ceiling with modern design',
                    quantity: 2000,
                    unit: 'Sq.ft',
                    rate: 180,
                    total: 360000
                },
                {
                    itemName: 'Painting',
                    category: 'Finishing',
                    description: 'Premium quality paint for interior and exterior',
                    quantity: 5000,
                    unit: 'Sq.ft',
                    rate: 50,
                    total: 250000
                }
            ],
            summary: {
                subtotal: 5235000,
                gstPercentage: 18,
                gstAmount: 942300,
                discount: 100000,
                labourCost: 0,
                grandTotal: 6077300
            },
            status: 'sent',
            quotationDate: new Date(),
            validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            termsAndConditions: 'Payment Terms: 50% advance, 30% on structure completion, 20% on final handover\nDelivery Timeline: 6 months from the date of advance payment\nWarranty: 1 year warranty on all construction work',
            notes: 'This is a test quotation for PDF generation testing'
        });

        console.log('✅ Test quotation created successfully!');
        console.log('\n📋 Quotation Details:');
        console.log('   ID:', quotation._id.toString());
        console.log('   Number:', quotation.quotationNumber);
        console.log('   Client:', client.name);
        console.log('   Total:', `₹${quotation.summary.grandTotal.toLocaleString()}`);

        console.log('\n🔗 Test PDF Generation URL:');
        console.log(`   http://localhost:5000/api/pdf/${quotation._id}/download`);

        console.log('\n✅ You can now test PDF generation with this quotation!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createTestQuotation();
