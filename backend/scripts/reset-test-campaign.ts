/**
 * Reset "Full Reward Test Campaign" back to LIVE for full system testing
 * - Resets campaign status to LIVE
 * - Ensures 1 approved creator with application
 * - Adds approved submissions with video data
 * - Adds GMV data for leaderboard
 * Run: npx ts-node scripts/reset-test-campaign.ts
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Resetting Full Reward Test Campaign for testing...\n');

    // Find the campaign
    const campaign = await prisma.campaign.findFirst({
        where: { title: 'Full Reward Test Campaign' },
        orderBy: { createdAt: 'desc' }
    });

    if (!campaign) {
        console.log('❌ Campaign not found! Please create one first.');
        return;
    }
    console.log(`Found campaign: ${campaign.id} (Status: ${campaign.status})`);

    // Find demo creator profile
    const creatorUser = await prisma.user.findUnique({
        where: { email: 'demo-creator@bmc.com' },
        include: { creatorProfile: true }
    });

    if (!creatorUser?.creatorProfile) {
        console.log('❌ Demo Creator not found!');
        return;
    }
    const creatorId = creatorUser.creatorProfile.id;
    console.log(`Found creator: ${creatorUser.creatorProfile.displayName} (${creatorId})`);

    // 1. Reset campaign to LIVE
    await prisma.campaign.update({
        where: { id: campaign.id },
        data: { status: 'LIVE' }
    });
    console.log('✅ Campaign status reset to LIVE');

    // 2. Clean old data for this campaign
    await prisma.submission.deleteMany({ where: { campaignId: campaign.id } });
    await prisma.application.deleteMany({ where: { campaignId: campaign.id } });
    await prisma.creatorCampaignStats.deleteMany({ where: { campaignId: campaign.id } });
    await prisma.gmvUpload.deleteMany({ where: { campaignId: campaign.id } });
    console.log('✅ Cleaned old test data');

    // 3. Create approved application
    await prisma.application.create({
        data: {
            campaignId: campaign.id,
            creatorId: creatorId,
            status: 'APPROVED',
            message: 'Demo application for full system test'
        }
    });
    console.log('✅ Created approved application for Demo Creator');

    // 4. Create 3 approved submissions (videos)
    const submissions = [];
    for (let day = 1; day <= 3; day++) {
        const sub = await prisma.submission.create({
            data: {
                campaignId: campaign.id,
                creatorId: creatorId,
                contentUrl: `https://www.tiktok.com/@democreator/video/test-${day}`,
                promoLink: `https://s.shopee.co.th/demo-product-${day}`,
                platform: 'TikTok',
                day: day,
                status: 'APPROVED',
                views: Math.floor(Math.random() * 50000) + 10000,
                likes: Math.floor(Math.random() * 5000) + 1000,
                shares: Math.floor(Math.random() * 500) + 100,
                comments: Math.floor(Math.random() * 300) + 50,
            }
        });
        submissions.push(sub);
    }
    console.log(`✅ Created ${submissions.length} approved submissions with engagement data`);

    // 5. Add GMV data
    await prisma.creatorCampaignStats.create({
        data: {
            campaignId: campaign.id,
            creatorId: creatorId,
            gmv: 25000,
            orders: 42,
            totalViews: submissions.reduce((sum, s) => sum + (s.views || 0), 0),
            totalLikes: submissions.reduce((sum, s) => sum + (s.likes || 0), 0),
            totalShares: submissions.reduce((sum, s) => sum + (s.shares || 0), 0),
            totalComments: submissions.reduce((sum, s) => sum + (s.comments || 0), 0),
            totalSubmissions: 3,
            approvedSubmissions: 3,
            currentStreak: 3,
            longestStreak: 3,
            lastGmvUpdate: new Date()
        }
    });
    console.log('✅ Added GMV data (฿25,000 | 42 orders)');

    // Summary
    console.log('\n📋 Campaign Summary:');
    console.log(`  📌 Name: Full Reward Test Campaign`);
    console.log(`  🟢 Status: LIVE`);
    console.log(`  👤 Creators: 1 (Demo Creator - Approved)`);
    console.log(`  🎬 Videos: 3 (All Approved, with views/likes/shares)`);
    console.log(`  💰 GMV: ฿25,000 | Orders: 42`);
    console.log(`  🔥 Streak: 3 days`);
    console.log(`  🎁 Rewards: 5 types (฿100,000 total)`);
    console.log('\n✨ Ready for full system testing!');
    console.log('\nNext steps:');
    console.log('  1. ดู Leaderboard → ควรเห็น Demo Creator พร้อมชื่อ+วิดีโอ+GMV');
    console.log('  2. กด "คำนวณรางวัล" → ระบบคำนวณรางวัลทั้ง 5 ประเภท');
    console.log('  3. กด "จบแคมเปญ" → สร้าง Transaction');
    console.log('  4. ล็อกอินเป็น Creator → ดูหน้า "รายได้"');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
