/**
 * Test Remaining Flows: GMV Upload → End Campaign → Creator Income
 * Run: npx ts-node scripts/test-remaining-flows.ts
 */

const API = 'http://localhost:3001/api';

async function login(email: string, password: string): Promise<string> {
    const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`Login failed: ${data.error}`);
    return data.token;
}

async function main() {
    console.log('\n=== TESTING REMAINING FLOWS ===\n');

    // 1. Login
    console.log('[1/7] Logging in as Brand...');
    const brandToken = await login('demo-brand@bmc.com', '123456');
    console.log('✅ Brand logged in.');

    console.log('[2/7] Logging in as Creator...');
    const creatorToken = await login('demo-creator@bmc.com', '123456');
    console.log('✅ Creator logged in.');

    // 2. Find a live campaign with approved creators
    console.log('\n[3/7] Finding a live campaign...');
    const campaignsRes = await fetch(`${API}/campaigns`, {
        headers: { 'Authorization': `Bearer ${brandToken}` }
    });
    const campaigns = await campaignsRes.json();

    // Find a live campaign (prefer "Test Campaign 2026")
    const liveCampaign = campaigns.find((c: any) => c.status === 'LIVE' || c.status === 'live')
        || campaigns[0];

    if (!liveCampaign) {
        console.log('❌ No campaigns found. Please create a campaign first.');
        return;
    }
    console.log(`✅ Found campaign: "${liveCampaign.name}" (ID: ${liveCampaign.id}, Status: ${liveCampaign.status})`);

    // 3. Find approved creator ID for this campaign
    console.log('\n[4/7] Finding approved creator for this campaign...');
    const appsRes = await fetch(`${API}/applications/campaign/${liveCampaign.id}`, {
        headers: { 'Authorization': `Bearer ${brandToken}` }
    });
    const apps = await appsRes.json();
    const approvedApp = apps.find((a: any) => a.status === 'APPROVED');

    if (!approvedApp) {
        console.log('⚠️  No approved creators found. Skipping GMV upload test.');
        console.log('   Available apps:', apps.map((a: any) => `${a.id} (${a.status})`).join(', '));
    } else {
        console.log(`✅ Found approved creator: ${approvedApp.creator?.displayName || approvedApp.creatorId}`);

        // 4. GMV Upload
        console.log('\n[5/7] Testing GMV Upload...');
        const csvContent = `creator_id,creator_name,gmv,orders\n${approvedApp.creatorId},Demo Creator,15000,25`;
        const blob = new Blob([csvContent], { type: 'text/csv' });

        const formData = new FormData();
        formData.append('file', blob, 'test_gmv.csv');
        formData.append('campaignId', liveCampaign.id);

        const gmvRes = await fetch(`${API}/gmv/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${brandToken}` },
            body: formData
        });
        const gmvData = await gmvRes.json();

        if (gmvRes.ok) {
            console.log('✅ GMV uploaded successfully!');
            console.log(`   Processed: ${gmvData.data?.successCount || 0} rows`);
            console.log(`   Total GMV: ฿${gmvData.data?.summary?.totalGMV || 0}`);
            console.log(`   Total Orders: ${gmvData.data?.summary?.totalOrders || 0}`);
        } else {
            console.log(`❌ GMV upload failed: ${gmvData.error}`);
            console.log('   Details:', gmvData.details || 'none');
        }

        // 5. Check Leaderboard
        console.log('\n[6/7] Checking Leaderboard...');
        const lbRes = await fetch(`${API}/gmv/leaderboard/${liveCampaign.id}`, {
            headers: { 'Authorization': `Bearer ${brandToken}` }
        });
        const lbData = await lbRes.json();

        if (lbRes.ok) {
            console.log('✅ Leaderboard data retrieved!');
            if (Array.isArray(lbData) && lbData.length > 0) {
                lbData.forEach((entry: any, i: number) => {
                    console.log(`   #${i + 1}: ${entry.creatorName || entry.creatorId} — GMV: ฿${entry.gmv}, Orders: ${entry.orders}`);
                });
            } else if (lbData.leaderboard && lbData.leaderboard.length > 0) {
                lbData.leaderboard.forEach((entry: any, i: number) => {
                    console.log(`   #${i + 1}: ${entry.creatorName || entry.creatorId} — GMV: ฿${entry.gmv}, Orders: ${entry.orders}`);
                });
            } else {
                console.log('   Leaderboard data:', JSON.stringify(lbData).substring(0, 200));
            }
        } else {
            console.log(`❌ Leaderboard fetch failed: ${lbData.error}`);
        }
    }

    // 6. End Campaign
    console.log('\n[7/7] Testing End Campaign...');
    const endRes = await fetch(`${API}/campaigns/${liveCampaign.id}/end`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${brandToken}`,
            'Content-Type': 'application/json'
        }
    });
    const endData = await endRes.json();

    if (endRes.ok) {
        console.log('✅ Campaign ended successfully!');
        console.log(`   Status: ${endData.campaign?.status || endData.status || 'completed'}`);
        if (endData.rewards) {
            console.log(`   Rewards distributed: ${JSON.stringify(endData.rewards).substring(0, 200)}`);
        }
        if (endData.transactions) {
            console.log(`   Transactions created: ${endData.transactions.length || 0}`);
        }
    } else {
        console.log(`❌ End campaign failed: ${endData.error}`);
        console.log('   Details:', JSON.stringify(endData).substring(0, 300));
    }

    // 7. Check Creator Income
    console.log('\n[BONUS] Checking Creator Income page...');
    const incomeRes = await fetch(`${API}/payment/creator/pending-payments`, {
        headers: { 'Authorization': `Bearer ${creatorToken}` }
    });
    const incomeData = await incomeRes.json();

    if (incomeRes.ok) {
        console.log('✅ Creator income data retrieved!');
        if (Array.isArray(incomeData) && incomeData.length > 0) {
            incomeData.forEach((tx: any) => {
                console.log(`   - ${tx.description || tx.campaignName || 'Transaction'}: ฿${tx.amount} (${tx.status})`);
            });
        } else {
            console.log('   Income data:', JSON.stringify(incomeData).substring(0, 300));
        }
    } else {
        console.log(`⚠️  Creator income fetch: ${incomeData.error || incomeRes.status}`);
        console.log('   Response:', JSON.stringify(incomeData).substring(0, 300));
    }

    console.log('\n=== ALL REMAINING TESTS COMPLETE ===\n');
}

main().catch(console.error);
