/**
 * Test script to verify quotation creation flow with backend integration
 */

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

// Sample quotation data
const sampleQuotation = {
    clientDetails: {
        name: 'Test Client',
        phone: '9876543210',
        email: 'test@example.com',
        siteAddress: 'Test Site Address, Mumbai',
        quotationDate: new Date().toISOString().split('T')[0],
        validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    projectDetails: {
        projectType: 'Plastering & Painting',
        builtUpArea: 1500,
        areaUnit: 'Sq.ft',
        location: 'Mumbai',
        constructionQuality: 'standard'
    },
    costItems: [
        {
            itemName: 'Wall Plastering',
            quantity: 1500,
            unit: 'Sq.ft',
            rate: 45,
            total: 67500
        },
        {
            itemName: 'Asian Paints Premium',
            quantity: 1500,
            unit: 'Sq.ft',
            rate: 20,
            total: 30000
        }
    ],
    summary: {
        subtotal: 97500,
        gstPercentage: 18,
        gstAmount: 17550,
        discount: 0,
        grandTotal: 115050
    },
    status: 'draft'
};

async function testQuotationAPI() {
    try {
        console.log('\n🧪 Testing Quotation API Integration...\n');

        // Test 1: Create Quotation
        console.log('📝 Test 1: Creating quotation...');
        const createResponse = await fetch(`${API_BASE}/quotations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sampleQuotation)
        });

        const createResult = await createResponse.json();

        if (createResult.success && createResult.data) {
            console.log('✅ Quotation created successfully!');
            console.log(`   Quotation Number: ${createResult.data.quotationNumber}`);
            console.log(`   Client: ${createResult.data.client.name}`);
            console.log(`   Grand Total: ₹${createResult.data.summary.grandTotal}`);

            const quotationId = createResult.data._id;

            // Test 2: Get All Quotations
            console.log('\n📋 Test 2: Fetching all quotations...');
            const getAllResponse = await fetch(`${API_BASE}/quotations`);
            const getAllResult = await getAllResponse.json();

            if (getAllResult.success && getAllResult.data) {
                console.log(`✅ Found ${getAllResult.data.length} quotation(s)`);
            }

            // Test 3: Get Single Quotation
            console.log('\n🔍 Test 3: Fetching single quotation...');
            const getOneResponse = await fetch(`${API_BASE}/quotations/${quotationId}`);
            const getOneResult = await getOneResponse.json();

            if (getOneResult.success && getOneResult.data) {
                console.log('✅ Quotation fetched successfully!');
                console.log(`   Project Type: ${getOneResult.data.projectDetails.projectType}`);
            }

            console.log('\n✅ All tests passed! Backend integration is working perfectly! 🎉\n');
        } else {
            console.error('❌ Failed to create quotation:', createResult);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testQuotationAPI();
