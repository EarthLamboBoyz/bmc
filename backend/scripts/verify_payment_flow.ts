
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:3001/api';

async function main() {
    console.log("--- Starting Payment Flow Verification ---");
    console.log(`Targeting API: ${API_URL}`);

    // 1. Setup: Clean up previous test data if any (optional, be careful)
    // For now, we'll just create new unique data

    const uniqueId = Date.now().toString();
    const brandEmail = `brand_test_${uniqueId}@example.com`;
    const creatorEmail = `creator_test_${uniqueId}@example.com`;
    const password = 'password123';

    try {
        // 2. Register/Login Brand
        console.log("Creating Brand...");
        await axios.post(`${API_URL}/auth/register`, {
            email: brandEmail,
            password,
            role: 'BRAND',
            companyName: 'Test Brand Co'
        }).catch((err) => {
            console.log("Registration failed/skipped:", err.response?.data || err.message);
        });

        const brandLogin = await axios.post(`${API_URL}/auth/login`, { email: brandEmail, password });
        const brandToken = brandLogin.data.token;
        console.log("Brand logged in.");

        // 3. Register/Login Creator
        console.log("Creating Creator...");
        await axios.post(`${API_URL}/auth/register`, {
            email: creatorEmail,
            password,
            role: 'CREATOR',
            displayName: 'Test Creator'
        }).catch(() => { });

        const creatorLogin = await axios.post(`${API_URL}/auth/login`, { email: creatorEmail, password });
        const creatorToken = creatorLogin.data.token;
        const creatorId = creatorLogin.data.user.id; // User ID

        // Get Creator Profile ID
        const creatorProfile = await prisma.creatorProfile.findUnique({ where: { userId: creatorId } });
        if (!creatorProfile) throw new Error("Creator profile not found");
        console.log("Creator logged in.");

        // 4. Create Campaign (Brand)
        console.log("Creating Campaign...");
        const campaignRes = await axios.post(`${API_URL}/campaigns`, {
            title: `Test Campaign ${uniqueId}`,
            description: "Test Description",
            budget: 10000,
            rewardPerPost: 500, // Fallback amount
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            status: 'live'
        }, { headers: { Authorization: `Bearer ${brandToken}` } });

        const campaignId = campaignRes.data.id;
        console.log(`Campaign created: ${campaignId}`);

        // 5. Apply & Submit (Creator) - Using Prisma to cheat/speed up as Application API might be complex to script fully if not focused
        console.log("Simulating Application & Submission...");
        await prisma.application.create({
            data: {
                campaignId,
                creatorId: creatorProfile.id,
                status: 'APPROVED' // Direct approve
            }
        });

        const submission = await prisma.submission.create({
            data: {
                campaignId,
                creatorId: creatorProfile.id,
                contentUrl: `http://tiktok.com/video/${uniqueId}`,
                status: 'APPROVED', // Direct approve to trigger payment rule
                platform: 'TikTok'
            }
        });
        console.log("Submission created and approved directly in DB.");

        // 6. End Campaign (Brand)
        console.log("Ending Campaign via API...");
        const endRes = await axios.post(`${API_URL}/campaigns/${campaignId}/end`, {}, {
            headers: { Authorization: `Bearer ${brandToken}` }
        });
        console.log("End Campaign Response:", endRes.data);

        // 7. Verify Transaction
        console.log("Verifying Transaction...");
        const tx = await prisma.transaction.findFirst({
            where: { campaignId, creatorId: creatorProfile.id }
        });

        if (tx) {
            console.log("✅ SUCCESS: Transaction found!");
            console.log(tx);
        } else {
            console.error("❌ FAILURE: No transaction found!");
        }

    } catch (error: any) {
        console.error("Test Failed!");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error Message:", error.message);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
