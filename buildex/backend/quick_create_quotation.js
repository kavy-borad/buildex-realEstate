
// Simple script to create ONE test quotation using raw MongoDB
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function createQuotation() {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    console.log('📦 Connected to MongoDB\n');

    // Step 1: Create a test client
    const existingClient = await db.collection('clients').findOne({ name: 'Test PDF Client' });

    let clientId;
    const uniquePhone = `98765${Math.floor(Math.random() * 100000)}`;
    if (existingClient) {
        clientId = existingClient._id;
        console.log('✅ Using existing client:', existingClient.name);
    } else {
        const clientResult = await db.collection('clients').insertOne({
            name: 'Test PDF Client',
            phone: uniquePhone,
            email: `pdftest${Date.now()}@example.com`,
            address: '123 Test Street, Mumbai, Maharashtra - 400001',
            status: 'active',
            totalQuotations: 0,
            totalInvoices: 0,
            totalRevenue: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        clientId = clientResult.insertedId;
        console.log('✅ Created new client');
    }

    // Step 2: Create quotation
    const quotationNumber = `QT-${Date.now()}`;
    const quotation = {
        quotationNumber,
        client: clientId,
        projectDetails: {
            projectType: 'Residential - Villa',
            builtUpArea: 2000,
            areaUnit: 'Sq.ft',
            city: 'Mumbai',
            area: 'Andheri',
            constructionQuality: 'premium',
            projectDuration: '6 months'
        },
        costItems: [
            { itemName: 'Civil Work', quantity: 2000, unit: 'Sq.ft', rate: 1500, total: 3000000 },
            { itemName: 'Electrical', quantity: 2000, unit: 'Sq.ft', rate: 200, total: 400000 },
            { itemName: 'Plumbing', quantity: 2000, unit: 'Sq.ft', rate: 150, total: 300000 }
        ],
        summary: {
            subtotal: 3700000,
            gstPercentage: 18,
            gstAmount: 666000,
            discount: 0,
            labourCost: 0,
            grandTotal: 4366000
        },
        status: 'sent',
        quotationDate: new Date(),
        validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        termsAndConditions: 'Payment: 50% advance, 50% on completion\nTimeline: 6 months',
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const result = await db.collection('quotations').insertOne(quotation);

    console.log('\n✅ Quotation Created!');
    console.log('   ID:', result.insertedId.toString());
    console.log('   Number:', quotationNumber);
    console.log('   Total: ₹43,66,000\n');
    console.log('🔗 Test PDF URL:');
    const pdfUrl = `http://localhost:5000/api/pdf/${result.insertedId}/download`;
    console.log(`   ${pdfUrl}`);

    // Write to file
    const fs = await import('fs');
    fs.writeFileSync('latest_quotation.txt', `Quotation ID: ${result.insertedId}\nPDF URL: ${pdfUrl}`);
    console.log('\n📝 Quotation ID saved to latest_quotation.txt');

    await client.close();
}

createQuotation().catch(console.error);
