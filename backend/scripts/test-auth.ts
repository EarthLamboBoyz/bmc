import axios from 'axios';

const API_URL = 'http://127.0.0.1:3001/api/auth';

async function testAuth() {
    try {
        const email = `test${Date.now()}@example.com`;
        const password = 'password123';

        console.log('1. Testing Register...');
        const registerRes = await axios.post(`${API_URL}/register`, {
            email,
            password,
            role: 'CREATOR',
            displayName: 'Test Creator'
        });
        console.log('✅ Register Success:', registerRes.data);

        console.log('\n2. Testing Login...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email,
            password
        });
        console.log('✅ Login Success:', loginRes.data);

        if (loginRes.data.token) {
            console.log('\n🎉 Auth Flow Verified!');
        }
    } catch (error: any) {
        const err = error as any;
        console.error('❌ Error Details:', {
            code: err.code || 'UNKNOWN_CODE',
            message: err.message,
            data: err.response?.data
        });
    }
}

testAuth();
