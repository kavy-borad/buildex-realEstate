const https = require('http');

const postData = JSON.stringify({
    email: 'admin@buildex.com',
    password: 'admin123'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log('🔐 Testing Admin Login...\n');

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        const response = JSON.parse(data);

        if (res.statusCode === 200) {
            console.log('✅ LOGIN SUCCESSFUL!\n');
            console.log('Admin Details:');
            console.log('  Name:', response.data.admin.name);
            console.log('  Email:', response.data.admin.email);
            console.log('  Role:', response.data.admin.role);
            console.log('\n✨ CREDENTIALS VERIFIED:');
            console.log('  📧 Email: admin@buildex.com');
            console.log('  🔑 Password: admin123');
            console.log('\n✅ You can now login to the application with these credentials!');
        } else {
            console.log('❌ LOGIN FAILED!\n');
            console.log('Status Code:', res.statusCode);
            console.log('Error:', response.error);
        }
    });
});

req.on('error', (e) => {
    console.error('❌ Error:', e.message);
});

req.write(postData);
req.end();
