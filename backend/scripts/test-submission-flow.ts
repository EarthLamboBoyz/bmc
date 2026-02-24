import axios from 'axios';

const API_URL = 'http://127.0.0.1:3001/api';

async function testFullLoop() {
    let creatorToken = '';
    let brandToken = '';
    let campaignId = '';
    let applicationId = '';
    let submissionId = '';

    try {
        // ===========================
        // STEP 1: Login as Creator
        // ===========================
        console.log('\n[1/6] Logging in as Creator...');
        const creatorLogin = await axios.post(`${API_URL}/auth/login`, {
            email: 'demo-creator@bmc.com',
            password: '123456'
        });
        creatorToken = creatorLogin.data.token;
        console.log('✅ Creator logged in.');

        // ===========================
        // STEP 2: Login as Brand
        // ===========================
        console.log('\n[2/6] Logging in as Brand...');
        const brandLogin = await axios.post(`${API_URL}/auth/login`, {
            email: 'demo-brand@bmc.com',
            password: '123456'
        });
        brandToken = brandLogin.data.token;
        console.log('✅ Brand logged in.');

        // ===========================
        // STEP 3: Find a Live Campaign
        // ===========================
        console.log('\n[3/6] Finding a live campaign...');
        const campaignsRes = await axios.get(`${API_URL}/campaigns`, {
            headers: { Authorization: `Bearer ${creatorToken}` }
        });
        const liveCampaigns = campaignsRes.data.filter((c: any) => c.status === 'live');
        if (liveCampaigns.length === 0) {
            console.log('❌ No live campaigns found.');
            return;
        }
        campaignId = liveCampaigns[0].id;
        console.log(`✅ Found live campaign: "${liveCampaigns[0].title}" (ID: ${campaignId})`);

        // ===========================
        // STEP 4: Creator Applies
        // ===========================
        console.log('\n[4/6] Creator applying to campaign...');
        try {
            const applyRes = await axios.post(`${API_URL}/applications/apply`, {
                campaignId,
                message: 'Test application from automated script'
            }, {
                headers: { Authorization: `Bearer ${creatorToken}` }
            });
            applicationId = applyRes.data.id;
            console.log(`✅ Application submitted! ID: ${applicationId}`);
        } catch (err: any) {
            if (err.response?.status === 400 && err.response?.data?.error?.includes('already applied')) {
                console.log('ℹ️  Already applied to this campaign. Fetching existing application...');
                const appsRes = await axios.get(`${API_URL}/applications/campaign/${campaignId}`, {
                    headers: { Authorization: `Bearer ${brandToken}` }
                });
                const pending = appsRes.data.find((a: any) => a.status === 'PENDING');
                if (pending) {
                    applicationId = pending.id;
                    console.log(`✅ Found existing PENDING application: ${applicationId}`);
                } else {
                    console.log('ℹ️  No PENDING application found - might already be APPROVED');
                }
            } else {
                throw err;
            }
        }

        // ===========================
        // STEP 5: Brand Approves the Application
        // ===========================
        if (applicationId) {
            console.log('\n[5/6] Brand approving the application...');
            const approveRes = await axios.patch(`${API_URL}/applications/${applicationId}/status`, {
                status: 'APPROVED'
            }, {
                headers: { Authorization: `Bearer ${brandToken}` }
            });
            console.log(`✅ Application status: ${approveRes.data.status}`);
        } else {
            console.log('\n[5/6] Skipping approval (already approved)...');
        }

        // ===========================
        // STEP 6: Creator Submits Work
        // ===========================
        console.log('\n[6/6] Creator submitting work...');
        const submitRes = await axios.post(`${API_URL}/submissions`, {
            campaignId,
            contentUrl: 'https://www.tiktok.com/@testcreator/video/1234567890',
            promoLink: 'https://shop.example.com/product/123',
            platform: 'TikTok',
            notes: 'Test submission from automated script'
        }, {
            headers: { Authorization: `Bearer ${creatorToken}` }
        });
        submissionId = submitRes.data.id;
        console.log(`✅ Work submitted! ID: ${submissionId}, Status: ${submitRes.data.status}`);

        // ===========================
        // BONUS: Brand Approves Work
        // ===========================
        console.log('\n[BONUS] Brand approving the submitted work...');
        const approveWorkRes = await axios.put(`${API_URL}/submissions/${submissionId}/status`, {
            status: 'APPROVED',
            reason: 'Great work!'
        }, {
            headers: { Authorization: `Bearer ${brandToken}` }
        });
        console.log(`✅ Submission approved! Final Status: ${approveWorkRes.data.status}`);

        console.log('\n🎉 FULL LOOP TEST PASSED! 🎉');
        console.log('Apply → Brand Approve App → Creator Submit → Brand Approve Work: ALL WORKING!');

    } catch (error: any) {
        console.error('\n❌ Test failed at step:');
        console.error('Status:', error.response?.status);
        console.error('Error:', error.response?.data || error.message);
    }
}

testFullLoop();
