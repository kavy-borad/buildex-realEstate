import bcrypt from 'bcryptjs';

console.log('Testing bcryptjs...');
async function test() {
    try {
        const hash = await bcrypt.hash('test', 10);
        console.log('Hash created:', hash);
    } catch (e) {
        console.error('Error:', e);
    }
}
test();
