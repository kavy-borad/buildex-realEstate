// Native fetch used (Node 18+)

const API_URL = 'http://localhost:5000/api';

async function test() {
    console.log('🚀 Starting Backend Test...');

    try {
        // 1. Create Quotation
        console.log('\nCreating Quotation...');
        const createRes = await fetch(`${API_URL}/quotations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clientDetails: {
                    name: "Agent User",
                    phone: "+91 8887776665",
                    email: "agent@test.com",
                    siteAddress: "Agent HQ"
                },
                projectDetails: {
                    projectType: "Full API Test",
                    location: "Cloud",
                    builtUpArea: 1000
                },
                costItems: [
                    { itemName: "Test Item", quantity: 1, unit: "LS", rate: 500, total: 500 }
                ],
                summary: {
                    subtotal: 500,
                    gstPercentage: 18,
                    gstAmount: 90,
                    grandTotal: 590
                },
                status: "draft"
            })
        });

        const createData = await createRes.json();

        if (!createRes.ok) {
            console.error('❌ Creation Failed:', createData);
            return;
        }

        console.log('✅ Created:', createData.quotationNumber, 'ID:', createData._id);

        // 2. Fetch All
        console.log('\nFetching All...');
        const listRes = await fetch(`${API_URL}/quotations`);
        const listData = await listRes.json();

        console.log(`✅ Fetched ${listData.length} quotations.`);
        const found = listData.find(q => q._id === createData._id);

        if (found) {
            console.log('✅ Verification: Newly created quotation found in list!');
            console.log('   Client Name:', found.client?.name);
            console.log('   Amount:', found.summary.grandTotal);
        } else {
            console.error('❌ Verification Failed: Quotation not found in list.');
        }

    } catch (err) {
        console.error('❌ Test Script Error:', err);
    }
}

test();
