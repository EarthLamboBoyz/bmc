/**
 * Create Full Test Campaign + E2E Test
 * Creates a new LIVE campaign with ALL 5 reward types, then runs the full loop:
 * Creator Apply → Brand Approve → Creator Submit → Brand Approve Work → GMV Upload → End Campaign → Check Rewards
 * 
 * Run: npx ts-node scripts/test-full-e2e.ts
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
    console.log('\n🚀 === FULL E2E TEST WITH ALL REWARDS === 🚀\n');

    // ========== STEP 1: Login ==========
    console.log('[1/10] Logging in...');
    const brandToken = await login('demo-brand@bmc.com', '123456');
    console.log('  ✅ Brand logged in.');
    const creatorToken = await login('demo-creator@bmc.com', '123456');
    console.log('  ✅ Creator logged in.');

    // ========== STEP 2: Create Campaign with ALL 5 Reward Types ==========
    console.log('\n[2/10] Creating campaign with ALL 5 reward types (total ฿100,000)...');
    const rewards = [
        {
            id: 'reward-1',
            type: 'sales_milestone',
            title: 'Sales Milestones',
            budget: 30000,
            config: {
                milestones: [
                    { gmvTarget: 5000, reward: 3000 },
                    { gmvTarget: 15000, reward: 10000 },
                    { gmvTarget: 50000, reward: 17000 }
                ]
            }
        },
        {
            id: 'reward-2',
            type: 'top_volume',
            title: 'Top Volume',
            budget: 25000,
            config: {
                prizes: [
                    { rank: 1, reward: 15000 },
                    { rank: 2, reward: 7000 },
                    { rank: 3, reward: 3000 }
                ]
            }
        },
        {
            id: 'reward-3',
            type: 'streak_bonus',
            title: 'Streak Bonus',
            budget: 15000,
            config: {
                streakDays: 7,
                bonusPerStreak: 1500,
                maxStreaks: 10
            }
        },
        {
            id: 'reward-4',
            type: 'lucky_draw',
            title: 'Lucky Draw',
            budget: 20000,
            config: {
                prizes: [
                    { name: 'Grand Prize', amount: 10000, winners: 1 },
                    { name: 'Runner Up', amount: 5000, winners: 2 }
                ]
            }
        },
        {
            id: 'reward-5',
            type: 'custom',
            title: 'Best Content Award',
            budget: 10000,
            config: {
                description: 'รางวัลคอนเทนต์ยอดเยี่ยม ตัดสินโดยแบรนด์',
                winners: 2
            }
        }
    ];

    const campaignData = {
        title: 'Full Reward Test Campaign',
        description: 'แคมเปญทดสอบครบทุกรางวัล 5 ประเภท: Sales Milestones, Top Volume, Streak Bonus, Lucky Draw, Custom',
        budget: 100000,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        minFollowers: 100,
        type: 'CAMPAIGN',
        platforms: ['TikTok', 'Instagram'],
        categories: ['Lifestyle', 'Fashion', 'Beauty'],
        contentGuidelines: ['รีวิวสินค้าอย่างน้อย 30 วินาที', 'ใส่ hashtag #FullRewardTest'],
        rewards: rewards,
        status: 'LIVE'
    };

    const createRes = await fetch(`${API}/campaigns`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${brandToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(campaignData)
    });
    const campaign = await createRes.json();

    if (!createRes.ok) {
        console.log('  ❌ Failed to create campaign:', campaign.error || JSON.stringify(campaign).substring(0, 300));
        return;
    }
    console.log(`  ✅ Campaign created: "${campaign.title}" (ID: ${campaign.id})`);
    console.log(`  💰 Budget: ฿${campaign.budget?.toLocaleString()}`);
    console.log(`  🎁 Rewards: ${rewards.length} types`);

    const campaignId = campaign.id;

    // ========== STEP 3: Creator Apply ==========
    console.log('\n[3/10] Creator applying to campaign...');
    const applyRes = await fetch(`${API}/applications/apply`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${creatorToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            campaignId,
            message: 'สนใจเข้าร่วมแคมเปญทดสอบรางวัลครบ 5 ประเภทครับ!'
        })
    });
    const application = await applyRes.json();
    if (!applyRes.ok) {
        console.log('  ❌ Apply failed:', application.error);
        return;
    }
    console.log(`  ✅ Application submitted! ID: ${application.id}`);

    // ========== STEP 4: Brand Approve Application ==========
    console.log('\n[4/10] Brand approving application...');
    const approveRes = await fetch(`${API}/applications/${application.id}/status`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${brandToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'APPROVED' })
    });
    const approveData = await approveRes.json();
    if (!approveRes.ok) {
        console.log('  ❌ Approve failed:', approveData.error);
        return;
    }
    console.log(`  ✅ Application approved! Status: ${approveData.status}`);

    // ========== STEP 5: Creator Submit Work ==========
    console.log('\n[5/10] Creator submitting work...');
    const submitRes = await fetch(`${API}/submissions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${creatorToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            campaignId,
            contentUrl: 'https://www.tiktok.com/@demo/video/full-reward-test-001',
            promoLink: 'https://s.shopee.co.th/full-reward-test',
            notes: 'วิดีโอทดสอบแคมเปญรางวัลครบ 5 ประเภท',
            day: 1,
            platform: 'TikTok'
        })
    });
    const submission = await submitRes.json();
    if (!submitRes.ok) {
        console.log('  ❌ Submit failed:', submission.error);
        return;
    }
    console.log(`  ✅ Work submitted! ID: ${submission.id}, Status: ${submission.status}`);

    // ========== STEP 6: Brand Approve Submission ==========
    console.log('\n[6/10] Brand approving submission...');
    const approveSubRes = await fetch(`${API}/submissions/${submission.id}/status`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${brandToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'APPROVED' })
    });
    const approveSubData = await approveSubRes.json();
    if (!approveSubRes.ok) {
        console.log('  ❌ Approve submission failed:', approveSubData.error);
    } else {
        console.log(`  ✅ Submission approved! Status: ${approveSubData.status}`);
    }

    // ========== STEP 7: Upload GMV Data ==========
    console.log('\n[7/10] Uploading GMV data...');

    // Get creatorId from the application
    const creatorId = application.creatorId;
    const csvContent = `creator_id,creator_name,gmv,orders\n${creatorId},Demo Creator,25000,42`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const formData = new FormData();
    formData.append('file', blob, 'full_test_gmv.csv');
    formData.append('campaignId', campaignId);

    const gmvRes = await fetch(`${API}/gmv/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${brandToken}` },
        body: formData
    });
    const gmvData = await gmvRes.json();
    if (gmvRes.ok) {
        console.log(`  ✅ GMV uploaded! Total GMV: ฿${gmvData.data?.summary?.totalGMV}, Orders: ${gmvData.data?.summary?.totalOrders}`);
    } else {
        console.log('  ❌ GMV upload failed:', gmvData.error);
    }

    // ========== STEP 8: Check Leaderboard ==========
    console.log('\n[8/10] Checking leaderboard...');
    const lbRes = await fetch(`${API}/gmv/leaderboard/${campaignId}`, {
        headers: { 'Authorization': `Bearer ${brandToken}` }
    });
    const lbData = await lbRes.json();
    if (lbRes.ok) {
        console.log('  ✅ Leaderboard data:');
        const entries = Array.isArray(lbData) ? lbData : (lbData.leaderboard || []);
        entries.forEach((e: any, i: number) => {
            console.log(`     #${i + 1}: ${e.creatorName || e.creatorId} — GMV: ฿${e.gmv}, Orders: ${e.orders}`);
        });
    } else {
        console.log('  ❌ Leaderboard failed:', lbData.error);
    }

    // ========== STEP 9: End Campaign ==========
    console.log('\n[9/10] Ending campaign (triggers reward calculation)...');
    const endRes = await fetch(`${API}/campaigns/${campaignId}/end`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${brandToken}`,
            'Content-Type': 'application/json'
        }
    });
    const endData = await endRes.json();
    if (endRes.ok) {
        console.log(`  ✅ Campaign ended! Status: ${endData.campaign?.status || endData.status}`);
        if (endData.rewards) {
            console.log('  🎁 Rewards distributed:');
            console.log(`     ${JSON.stringify(endData.rewards).substring(0, 500)}`);
        }
        if (endData.transactions) {
            console.log(`  💳 Transactions created: ${endData.transactions?.length || 0}`);
            endData.transactions?.forEach((tx: any) => {
                console.log(`     - ${tx.description || tx.type}: ฿${tx.amount} → ${tx.creatorName || tx.creatorId}`);
            });
        }
    } else {
        console.log('  ❌ End campaign failed:', endData.error);
        console.log('     Details:', JSON.stringify(endData).substring(0, 300));
    }

    // ========== STEP 10: Check Creator Income ==========
    console.log('\n[10/10] Checking Creator Income...');
    const incomeRes = await fetch(`${API}/payment/creator/pending-payments`, {
        headers: { 'Authorization': `Bearer ${creatorToken}` }
    });

    if (incomeRes.ok) {
        const incomeData = await incomeRes.json();
        console.log('  ✅ Creator Income data:');
        if (Array.isArray(incomeData) && incomeData.length > 0) {
            incomeData.forEach((tx: any) => {
                console.log(`     - ${tx.description || tx.campaignName || 'Payment'}: ฿${tx.amount} (${tx.status})`);
            });
        } else if (typeof incomeData === 'object') {
            console.log(`     ${JSON.stringify(incomeData).substring(0, 500)}`);
        }
    } else {
        const errText = await incomeRes.text();
        console.log(`  ❌ Creator income failed (${incomeRes.status}):`, errText.substring(0, 200));
    }

    console.log('\n🏁 === FULL E2E TEST COMPLETE === 🏁\n');
}

main().catch(console.error);
