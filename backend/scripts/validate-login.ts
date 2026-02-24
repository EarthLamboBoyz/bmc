
import axios from 'axios';

const API_URL = 'http://127.0.0.1:3001/api';

async function testLogin() {
    try {
        console.log('--- Testing Login ---');

        // Brand
        try {
            const res = await axios.post(`${API_URL}/auth/login`, {
                email: 'brand@demo.com',
                password: 'password123'
            });
            console.log('✅ BRAND Login: SUCCESS');
        } catch (error: any) {
            console.error('❌ BRAND Login: FAILED', error.response?.data || error.message);
        }

        // Creator
        try {
            const res = await axios.post(`${API_URL}/auth/login`, {
                email: 'creator@demo.com',
                password: 'password123'
            });
            console.log('✅ CREATOR Login: SUCCESS');
        } catch (error: any) {
            console.error('❌ CREATOR Login: FAILED', error.response?.data || error.message);
        }

    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

testLogin();
