import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

const testAuth = async () => {
    try {
        const timestamp = Date.now();
        const testUser = {
            email: `testbrand_${timestamp}@example.com`,
            password: 'password123',
            role: 'BRAND',
            companyName: `Test Brand ${timestamp}`,
            industry: 'Technology'
        };

        console.log('1. Testing Register...');
        try {
            const registerRes = await axios.post(`${API_URL}/register`, testUser);
            console.log('✅ Register Success:', registerRes.data);
        } catch (error: any) {
            console.error('❌ Register Failed:', error.response?.data || error.message);
            return;
        }

        console.log('\n2. Testing Login...');
        let token = '';
        try {
            const loginRes = await axios.post(`${API_URL}/login`, {
                email: testUser.email,
                password: testUser.password
            });
            console.log('✅ Login Success:', loginRes.data);
            token = loginRes.data.token;
        } catch (error: any) {
            console.error('❌ Login Failed:', error.response?.data || error.message);
            return;
        }

        console.log('\n3. Testing Get Me...');
        try {
            const meRes = await axios.get(`${API_URL}/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✅ Get Me Success:', meRes.data);
        } catch (error: any) {
            console.error('❌ Get Me Failed:', error.response?.data || error.message);
        }

    } catch (error) {
        console.error('Unexpected error:', error);
    }
};

testAuth();
