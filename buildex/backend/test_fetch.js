
const API_URL = 'http://localhost:5000/api';

async function testFetch() {
    console.log('🚀 Testing Fetch APIs...');

    const endpoints = [
        '/quotations',
        '/dashboard/stats',
        '/clients',
        '/invoices'
    ];

    for (const ep of endpoints) {
        console.log(`\n📡 Fetching ${ep}...`);
        try {
            const res = await fetch(`${API_URL}${ep}`);
            const text = await res.text();

            console.log(`Status: ${res.status} ${res.statusText}`);

            try {
                const json = JSON.parse(text);
                console.log('✅ JSON Response:', Array.isArray(json) ? `Array[${json.length}]` : Object.keys(json));
            } catch (e) {
                console.error('❌ VALIDATION ERROR: Response is not JSON!');
                console.error('Raw Body:', text.substring(0, 500)); // Show first 500 chars
            }

        } catch (err) {
            console.error(`❌ NETWORK ERROR for ${ep}:`, err.message);
        }
    }
}

testFetch();
