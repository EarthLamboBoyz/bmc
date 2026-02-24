import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const API_URL = 'http://127.0.0.1:3001/api';
const prisma = new PrismaClient();

async function testCampaignCreation() {
    try {
        console.log('--- Starting Campaign Creation Test ---');

        // 1. Setup: Ensure a Brand user exists (or create one)
        const email = `brand_test_${Date.now()}@example.com`;
        const password = 'password123';

        console.log(`1. Registering Brand user: ${email}...`);
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            email,
            password,
            role: 'BRAND',
            companyName: 'Test Brand Co.'
        });
        const token = regRes.data.token;
        console.log('✅ Registered successfully.');

        // 2. Create Campaign via API
        console.log('2. Creating Campaign via API...');
        const campaignPayload = {
            title: 'Test Campaign for Verification',
            description: 'This is a test campaign created by script.',
            budget: 50000,
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            minFollowers: 1000,
            rewards: [{ type: 'sales_milestone', title: 'Sales', budget: 10000 }],
            contentGuidelines: { dosAndDonts: 'Do good stuff' },
            hasSamples: true,
            sampleInfo: { description: 'Test Sample', totalSamples: 10 }
        };

        const createRes = await axios.post(`${API_URL}/campaigns`, campaignPayload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const campaignId = createRes.data.id;
        console.log(`✅ Campaign Created! ID: ${campaignId}`);

        // 3. Verify in Database directly using Prisma
        console.log('3. Verifying data in Database...');
        const dbCampaign = await prisma.campaign.findUnique({
            where: { id: campaignId }
        });

        if (!dbCampaign) {
            throw new Error('Campaign not found in database!');
        }

        console.log('--- Verification Results ---');
        console.log(`Title: ${dbCampaign.title}`);
        console.log(`Rewards (JSON): ${dbCampaign.rewards}`);
        console.log(`Samples: ${dbCampaign.hasSamples}`);

        if (dbCampaign.title === campaignPayload.title && dbCampaign.hasSamples === true) {
            console.log('🎉 SUCCESS: Campaign data verified in database!');
        } else {
            console.error('❌ FAILED: Data mismatch.');
        }

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        if (error.response) console.error('Response:', error.response.data);
    } finally {
        await prisma.$disconnect();
    }
}

testCampaignCreation();
