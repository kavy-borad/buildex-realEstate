
// Test PDF generation with the latest quotation

const quotationId = '699446507dab66dcdc01eb49';

async function testPdfGeneration() {
    console.log('🧪 Testing PDF Generation...\n');
    console.log(`📋 Quotation ID: ${quotationId}\n`);

    try {
        const response = await fetch(`http://localhost:5000/api/pdf/${quotationId}/download`);

        console.log('Response Status:', response.status, response.statusText);
        console.log('Content-Type:', response.headers.get('content-type'));

        if (response.ok) {
            const buffer = await response.arrayBuffer();
            console.log(`\n✅ SUCCESS! PDF Generated`);
            console.log(`📦 Size: ${buffer.byteLength} bytes (${(buffer.byteLength / 1024).toFixed(2)} KB)`);

            // Save to file
            const fs = await import('fs');
            fs.writeFileSync('test_generated.pdf', Buffer.from(buffer));
            console.log('💾 Saved as: test_generated.pdf');
        } else {
            const errorText = await response.text();
            console.log('\n❌ FAILED');
            console.log('Error Response:');
            console.log(errorText);

            try {
                const json = JSON.parse(errorText);
                console.log('\nParsed Error:', JSON.stringify(json, null, 2));
            } catch (e) { }
        }
    } catch (error) {
        console.error('\n❌ Network Error:', error.message);
    }
}

testPdfGeneration();
