
// Test script to check what error backend is throwing

async function testWithRealId() {
    console.log('🧪 Testing PDF Generation with Real Quotation ID...\n');

    // First, get a real quotation ID from the database
    try {
        const listResponse = await fetch('http://localhost:5000/api/quotations', {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YjNhMWEyMTY5OWUxYWY4MGYzYTRhMCIsImlhdCI6MTczOTc4ODIyNywiZXhwIjoxNzQyMzgwMjI3fQ.oFv--EKa70b7s4EwPjR2CyqTp-kvPfnC5qnMkW9nKaI'
            }
        });

        const listData = await listResponse.json();
        console.log('✅ Quotations fetched:', listData.data?.quotations?.length || 0);

        if (!listData.data?.quotations || listData.data.quotations.length === 0) {
            console.log('❌ No quotations found in the database');
            return;
        }

        const firstQuotation = listData.data.quotations[0];
        console.log(`\n📋 Using Quotation: ${firstQuotation.quotationNumber} (ID: ${firstQuotation.id})\n`);

        // Now try to generate PDF
        console.log('📄 Requesting PDF generation...');
        const pdfResponse = await fetch(`http://localhost:5000/api/pdf/${firstQuotation.id}/download`, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YjNhMWEyMTY5OWUxYWY4MGYzYTRhMCIsImlhdCI6MTczOTc4ODIyNywiZXhwIjoxNzQyMzgwMjI3fQ.oFv--EKa70b7s4EwPjR2CyqTp-kvPfnC5qnMkW9nKaI'
            }
        });

        console.log('Status:', pdfResponse.status, pdfResponse.statusText);
        console.log('Content-Type:', pdfResponse.headers.get('content-type'));

        if (pdfResponse.ok) {
            const buffer = await pdfResponse.arrayBuffer();
            console.log('✅ PDF Generated Successfully! Size:', buffer.byteLength, 'bytes');
        } else {
            const errorText = await pdfResponse.text();
            console.log('❌ Error Response:');
            console.log(errorText);

            try {
                const errorJson = JSON.parse(errorText);
                console.log('\n📊 Parsed Error:', JSON.stringify(errorJson, null, 2));
            } catch (e) {
                console.log('\n⚠️ Could not parse as JSON');
            }
        }

    } catch (error) {
        console.error('❌ Test Failed:', error);
    }
}

testWithRealId();
