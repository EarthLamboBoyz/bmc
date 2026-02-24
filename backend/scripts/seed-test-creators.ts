/**
 * Seed multiple test creators for Full Reward Test Campaign
 * Creates 8 creators with different performance levels for testing all 5 reward types:
 * - Sales Milestones: GMV thresholds (5K, 15K, 50K)
 * - Top Volume: Ranking by GMV (1st, 2nd, 3rd)
 * - Streak Bonus: Different streak lengths
 * - Lucky Draw: All eligible participants
 * - Custom: Selected by brand
 * Run: npx ts-node scripts/seed-test-creators.ts
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

const creators = [
    { email: 'creator-alice@bmc.com', name: 'Alice สายบิวตี้', handle: '@alice_beauty', followers: 120000, gmv: 85000, orders: 210, videos: 8, streak: 7 },
    { email: 'creator-bob@bmc.com', name: 'Bob TechReview', handle: '@bob_tech', followers: 75000, gmv: 52000, orders: 130, videos: 5, streak: 5 },
    { email: 'creator-cherry@bmc.com', name: 'Cherry Lifestyle', handle: '@cherry_life', followers: 95000, gmv: 38000, orders: 95, videos: 6, streak: 3 },
    { email: 'creator-dave@bmc.com', name: 'Dave ฟิตเนส', handle: '@dave_fit', followers: 60000, gmv: 18000, orders: 45, videos: 4, streak: 2 },
    { email: 'creator-emma@bmc.com', name: 'Emma Foodie', handle: '@emma_food', followers: 200000, gmv: 12000, orders: 30, videos: 3, streak: 1 },
    { email: 'creator-frank@bmc.com', name: 'Frank Gaming', handle: '@frank_game', followers: 45000, gmv: 6000, orders: 15, videos: 2, streak: 0 },
    { email: 'creator-grace@bmc.com', name: 'Grace แฟชั่น', handle: '@grace_style', followers: 150000, gmv: 3000, orders: 8, videos: 1, streak: 0 },
    { email: 'creator-henry@bmc.com', name: 'Henry Travel', handle: '@henry_travel', followers: 30000, gmv: 800, orders: 2, videos: 1, streak: 0 },
];

async function main() {
    console.log('🌱 Seeding 8 test creators for Full Reward Test Campaign...\n');

    // Find the campaign
    const campaign = await prisma.campaign.findFirst({
        where: { title: 'Full Reward Test Campaign' },
        orderBy: { createdAt: 'desc' }
    });

    if (!campaign) {
        console.log('❌ Campaign not found!');
        return;
    }
    console.log(`📌 Campaign: ${campaign.title} (${campaign.id})\n`);

    const passwordHash = await bcrypt.hash('123456', 10);

    for (const c of creators) {
        // Create or find user
        let user = await prisma.user.findUnique({ where: { email: c.email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: c.email,
                    passwordHash,
                    role: 'CREATOR',
                    creatorProfile: {
                        create: {
                            displayName: c.name,
                            tiktokHandle: c.handle,
                            followersCount: c.followers,
                            bio: `ครีเอเตอร์ทดสอบ - ${c.name}`,
                        }
                    }
                }
            });
            console.log(`  ✅ Created user: ${c.name} (${c.email})`);
        } else {
            console.log(`  ⏭️  User exists: ${c.name} (${c.email})`);
        }

        // Get creator profile
        const profile = await prisma.creatorProfile.findUnique({ where: { userId: user.id } });
        if (!profile) continue;

        // Create approved application (skip if exists)
        const existingApp = await prisma.application.findUnique({
            where: { campaignId_creatorId: { campaignId: campaign.id, creatorId: profile.id } }
        });
        if (!existingApp) {
            await prisma.application.create({
                data: {
                    campaignId: campaign.id,
                    creatorId: profile.id,
                    status: 'APPROVED',
                    message: `สมัครเข้าร่วมแคมเปญ - ${c.name}`
                }
            });
        }

        // Create submissions
        for (let day = 1; day <= c.videos; day++) {
            const existing = await prisma.submission.findFirst({
                where: { campaignId: campaign.id, creatorId: profile.id, day }
            });
            if (!existing) {
                await prisma.submission.create({
                    data: {
                        campaignId: campaign.id,
                        creatorId: profile.id,
                        contentUrl: `https://www.tiktok.com/${c.handle}/video/test-${day}`,
                        promoLink: `https://s.shopee.co.th/${c.handle.replace('@', '')}-${day}`,
                        platform: 'TikTok',
                        day,
                        status: 'APPROVED',
                        views: Math.floor(Math.random() * 100000) + 5000,
                        likes: Math.floor(Math.random() * 10000) + 500,
                        shares: Math.floor(Math.random() * 1000) + 50,
                        comments: Math.floor(Math.random() * 500) + 20,
                    }
                });
            }
        }

        // Upsert creator campaign stats (GMV/orders/streak)
        await prisma.creatorCampaignStats.upsert({
            where: { campaignId_creatorId: { campaignId: campaign.id, creatorId: profile.id } },
            create: {
                campaignId: campaign.id,
                creatorId: profile.id,
                gmv: c.gmv,
                orders: c.orders,
                totalSubmissions: c.videos,
                approvedSubmissions: c.videos,
                currentStreak: c.streak,
                longestStreak: c.streak,
                lastGmvUpdate: new Date()
            },
            update: {
                gmv: c.gmv,
                orders: c.orders,
                totalSubmissions: c.videos,
                approvedSubmissions: c.videos,
                currentStreak: c.streak,
                longestStreak: c.streak,
                lastGmvUpdate: new Date()
            }
        });

        console.log(`     📊 GMV: ฿${c.gmv.toLocaleString()} | Orders: ${c.orders} | Videos: ${c.videos} | Streak: ${c.streak}`);
    }

    // Update campaign creator count
    const totalCreators = await prisma.application.count({
        where: { campaignId: campaign.id, status: 'APPROVED' }
    });

    // Show summary
    console.log('\n📋 Leaderboard Summary:');
    console.log('─────────────────────────────────────────────────────');
    console.log('อันดับ | Creator              | GMV       | Videos | Streak');
    console.log('─────────────────────────────────────────────────────');

    // Include existing Demo Creator
    const allStats = await prisma.creatorCampaignStats.findMany({
        where: { campaignId: campaign.id },
        orderBy: { gmv: 'desc' },
    });

    const pIds = allStats.map(s => s.creatorId);
    const pList = await prisma.creatorProfile.findMany({ where: { id: { in: pIds } } });
    const nameMap = new Map(pList.map(p => [p.id, p.displayName]));

    allStats.forEach((s, i) => {
        const name = (nameMap.get(s.creatorId) || 'Unknown').padEnd(20);
        console.log(`  #${i + 1}   | ${name} | ฿${String(s.gmv).padStart(8)} | ${String(s.approvedSubmissions).padStart(6)} | 🔥 ${s.longestStreak}`);
    });

    console.log('─────────────────────────────────────────────────────');
    console.log(`\n✨ Total: ${totalCreators} creators ready for testing!`);
    console.log('\n🎁 Reward Testing Guide:');
    console.log('  Sales Milestones (฿5K/15K/50K):');
    console.log('    - ฿50K+: Alice (฿85K), Bob (฿52K) → ได้รางวัลระดับสูงสุด');
    console.log('    - ฿15K+: Cherry (฿38K), Dave (฿18K) → ได้รางวัลระดับกลาง');
    console.log('    - ฿5K+: Emma (฿12K), Frank (฿6K) → ได้รางวัลระดับเริ่มต้น');
    console.log('    - ต่ำกว่า ฿5K: Grace (฿3K), Henry (฿800) → ไม่ได้รางวัล');
    console.log('  Top Volume: #1 Alice, #2 Bob, #3 Cherry');
    console.log('  Streak Bonus: Alice (7), Bob (5), Cherry (3)');
    console.log('  Lucky Draw: ทุกคนมีสิทธิ์จับฉลาก');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
