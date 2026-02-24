import axios from 'axios';

const API_URL = 'http://127.0.0.1:3001/api/auth';

async function testProfileUpdate() {
    try {
        console.log('--- Starting Profile Update Test ---');

        // 1. Register a new user
        const email = `update_test_${Date.now()}@example.com`;
        const password = 'password123';

        console.log(`1. Registering user: ${email}...`);
        const regRes = await axios.post(`${API_URL}/register`, {
            email,
            password,
            role: 'CREATOR',
            displayName: 'Original Name'
        });
        const token = regRes.data.token;
        console.log('✅ Registered successfully.');

        // 2. Update Profile
        console.log('2. Updating Profile (Name, Phone, Bio, Address)...');
        const updatePayload = {
            displayName: 'Updated Name',
            phone: '0999999999',
            bio: 'Updated Bio Content',
            tiktokHandle: '@newtiktok',
            instagramHandle: '@newinsta',
            address: JSON.stringify({ line1: '999 Update Rd', district: 'Test District' })
        };

        await axios.put(`${API_URL}/me`, updatePayload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Update request sent successfully.');

        // 3. Verify Updates by fetching profile again
        console.log('3. Fetching profile to verify persistence...');
        const getRes = await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const user = getRes.data.user;
        const profile = user.creatorProfile;

        console.log('--- Verification Results ---');
        console.log(`Name: ${user.name} (Expected: 'Updated Name')`);
        console.log(`Phone: ${profile.phone} (Expected: '0999999999')`);
        console.log(`Bio: ${profile.bio} (Expected: 'Updated Bio Content')`);

        if (user.name === 'Updated Name' && profile.phone === '0999999999') {
            console.log('🎉 SUCCESS: Profile updated and persisted correctly!');
        } else {
            console.error('❌ FAILED: Data mismatch.');
        }

    } catch (error: any) {
        console.error('❌ Error during test:', error.response?.data || error.message);
    }
}

testProfileUpdate();
