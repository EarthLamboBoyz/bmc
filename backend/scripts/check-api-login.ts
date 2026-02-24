import axios from 'axios';

async function main() {
    const url = 'http://localhost:3001/api/auth/login';
    console.log(`Testing login at: ${url}`);

    try {
        const res = await axios.post(url, {
            email: 'demo-brand@bmc.com',
            password: '123456'
        });
        console.log('✅ Login SUCCESS!');
        console.log('Token:', res.data.token ? 'Received' : 'Missing');
        console.log('User Role:', res.data.user?.role);
    } catch (error: any) {
        console.error('❌ Login FAILED');
        if (error.code === 'ECONNREFUSED') {
            console.error('Connection Refused. Server might not be running on port 3001.');
        } else if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

main();
