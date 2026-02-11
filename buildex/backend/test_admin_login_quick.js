import fetch from 'node-fetch';

async function testLogin() {
    try {
        console.log('🔐 Testing Admin Login...\n');

        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@buildex.com',
                password: 'admin123'
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Login Successful!\n');
            console.log('Admin Details:');
            console.log('  Name:', data.data.admin.name);
            console.log('  Email:', data.data.admin.email);
            console.log('  Role:', data.data.admin.role);
            console.log('\n🔑 Token:', data.data.token.substring(0, 50) + '...');
            console.log('\n✨ You can now login with:');
            console.log('  Email: admin@buildex.com');
            console.log('  Password: admin123');
        } else {
            console.log('❌ Login Failed!\n');
            console.log('Error:', data.error);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testLogin();
