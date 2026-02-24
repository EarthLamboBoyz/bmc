import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

async function testAuth() {
    // Unique email to avoid collision
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';

    try {
        console.log(`1. Registering new user (${email})...`);
        await axios.post(`${API_URL}/register`, {
            email,
            password,
            role: 'BRAND',
            companyName: 'Test Company'
        });
        console.log('✅ Registration successful.');

        console.log('2. Logging in...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email,
            password
        });

        const token = loginRes.data.token;
        console.log('✅ Login successful. Token received.');

        console.log('3. Accessing protected route /me...');
        const meRes = await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('✅ Protected route accessed successfully.');
        console.log('User Profile:', meRes.data);

    } catch (error: any) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testAuth();
