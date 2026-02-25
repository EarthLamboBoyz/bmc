/**
 * Seed 200 test creators for bulk testing reward calculations
 * Creates creators with varying performance (GMV, videos, streak, views)
 * Run: npx ts-node scripts/seed-bulk-creators.ts
 * Clean: npx ts-node scripts/seed-bulk-creators.ts --clean  (removes all seeded data)
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const TOTAL_CREATORS = 200;
const CAMPAIGN_NAME = 'Test'; // change this to target a different campaign

// Thai-ish random names
const firstNames = [
    'สมชาย', 'สมหญิง', 'ณัฐ', 'ปิย', 'ภัทร', 'ธน', 'กัน', 'พิม', 'อิง', 'เมย์',
    'ฟ้า', 'น้ำ', 'ดาว', 'แพร', 'มิ้น', 'บีม', 'เก่ง', 'กิ๊ฟ', 'เบล', 'ไอซ์',
    'แบม', 'ปอ', 'ฟิล์ม', 'โอม', 'นิว', 'เจ', 'ก้อง', 'เอิร์ธ', 'มาย', 'จูน',
];
const lastNames = [
    'Beauty', 'Tech', 'Food', 'Travel', 'Fitness', 'Gaming', 'Fashion', 'Music',
    'Lifestyle', 'Review', 'Vlog', 'Style', 'Cook', 'Sport', 'DIY', 'Art',
    'Photo', 'Dance', 'Comedy', 'Health',
];
const categories = ['Beauty', 'Fashion', 'Food', 'Tech', 'Lifestyle', 'Gaming', 'Health', 'Fitness'];

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateCreator(index: number) {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[index % lastNames.length];
    const name = `${firstName} ${lastName} ${index + 1}`;
    const handle = `@creator_${String(index + 1).padStart(3, '0')}`;
    const email = `test-creator-${String(index + 1).padStart(3, '0')}@bmc-test.com`;

    // Create tiered performance distribution
    // Top 10: very high performers
    // 11-50: high performers
    // 51-120: mid performers
    // 121-200: low performers
    let gmv: number, orders: number, videos: number, streak: number, followers: number;

    if (index < 10) {
        // Top 10 — superstars
        gmv = randomInt(50000, 150000);
        orders = randomInt(100, 400);
        videos = randomInt(15, 30);
        streak = randomInt(10, 30);
        followers = randomInt(100000, 500000);
    } else if (index < 50) {
        // 11-50 — high performers
        gmv = randomInt(15000, 50000);
        orders = randomInt(40, 120);
        videos = randomInt(8, 15);
        streak = randomInt(5, 12);
        followers = randomInt(50000, 150000);
    } else if (index < 120) {
        // 51-120 — mid performers
        gmv = randomInt(3000, 15000);
        orders = randomInt(10, 40);
        videos = randomInt(3, 8);
        streak = randomInt(1, 5);
        followers = randomInt(10000, 60000);
    } else {
        // 121-200 — new/low performers
        gmv = randomInt(0, 3000);
        orders = randomInt(0, 10);
        videos = randomInt(1, 3);
        streak = randomInt(0, 2);
        followers = randomInt(1000, 15000);
    }

    return { email, name, handle, followers, gmv, orders, videos, streak };
}

async function cleanData() {
    console.log('🧹 Cleaning all seeded bulk test data...\n');

    const testUsers = await prisma.user.findMany({
        where: { email: { startsWith: 'test-creator-' } },
        include: { creatorProfile: true },
    });

    if (testUsers.length === 0) {
        console.log('No test data found to clean.');
        return;
    }

    const creatorIds = testUsers
        .map(u => u.creatorProfile?.id)
        .filter(Boolean) as string[];

    // Delete in correct order (foreign key dependencies)
    const delSubmissions = await prisma.submission.deleteMany({ where: { creatorId: { in: creatorIds } } });
    console.log(`  🗑️  Deleted ${delSubmissions.count} submissions`);

    const delStats = await prisma.creatorCampaignStats.deleteMany({ where: { creatorId: { in: creatorIds } } });
    console.log(`  🗑️  Deleted ${delStats.count} campaign stats`);

    const delApps = await prisma.application.deleteMany({ where: { creatorId: { in: creatorIds } } });
    console.log(`  🗑️  Deleted ${delApps.count} applications`);

    const delProfiles = await prisma.creatorProfile.deleteMany({ where: { id: { in: creatorIds } } });
    console.log(`  🗑️  Deleted ${delProfiles.count} creator profiles`);

    const delUsers = await prisma.user.deleteMany({ where: { email: { startsWith: 'test-creator-' } } });
    console.log(`  🗑️  Deleted ${delUsers.count} users`);

    console.log('\n✅ All bulk test data cleaned!');
}

async function main() {
    // Handle --clean flag
    if (process.argv.includes('--clean')) {
        await cleanData();
        return;
    }

    console.log(`🌱 Seeding ${TOTAL_CREATORS} test creators...\n`);

    // Find target campaign
    const campaign = await prisma.campaign.findFirst({
        where: { title: { contains: CAMPAIGN_NAME } },
        orderBy: { createdAt: 'desc' },
    });

    if (!campaign) {
        console.log(`❌ Campaign "${CAMPAIGN_NAME}" not found!`);
        console.log('Available campaigns:');
        const campaigns = await prisma.campaign.findMany({ select: { id: true, title: true, status: true } });
        campaigns.forEach(c => console.log(`  - ${c.title} (${c.status})`));
        return;
    }

    console.log(`📌 Target: "${campaign.title}" (${campaign.id})\n`);

    const passwordHash = await bcrypt.hash('123456', 10);
    let created = 0;
    let skipped = 0;

    // Process in batches of 20 for performance
    for (let batch = 0; batch < TOTAL_CREATORS; batch += 20) {
        const batchEnd = Math.min(batch + 20, TOTAL_CREATORS);
        const batchCreators = [];

        for (let i = batch; i < batchEnd; i++) {
            batchCreators.push(generateCreator(i));
        }

        // Process each creator in batch
        for (const c of batchCreators) {
            try {
                // Check if already exists
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
                                    bio: `ครีเอเตอร์ทดสอบ #${created + 1}`,
                                    categories: JSON.stringify(
                                        [categories[randomInt(0, categories.length - 1)], categories[randomInt(0, categories.length - 1)]]
                                    ),
                                },
                            },
                        },
                    });
                    created++;
                } else {
                    skipped++;
                    continue; // Skip if exists — don't overwrite
                }

                const profile = await prisma.creatorProfile.findUnique({ where: { userId: user.id } });
                if (!profile) continue;

                // Create approved application
                await prisma.application.create({
                    data: {
                        campaignId: campaign.id,
                        creatorId: profile.id,
                        status: 'APPROVED',
                        message: `สมัครอัตโนมัติ - ${c.name}`,
                    },
                });

                // Create submissions
                for (let day = 1; day <= c.videos; day++) {
                    await prisma.submission.create({
                        data: {
                            campaignId: campaign.id,
                            creatorId: profile.id,
                            contentUrl: `https://www.tiktok.com/${c.handle}/video/test-day-${day}`,
                            promoLink: `https://s.shopee.co.th/promo-${c.handle.replace('@', '')}-${day}`,
                            platform: 'TikTok',
                            day,
                            status: 'APPROVED',
                            views: randomInt(1000, 500000),
                            likes: randomInt(50, 50000),
                            shares: randomInt(10, 5000),
                            comments: randomInt(5, 2000),
                        },
                    });
                }

                // Create GMV stats
                await prisma.creatorCampaignStats.create({
                    data: {
                        campaignId: campaign.id,
                        creatorId: profile.id,
                        gmv: c.gmv,
                        orders: c.orders,
                        totalSubmissions: c.videos,
                        approvedSubmissions: c.videos,
                        currentStreak: c.streak,
                        longestStreak: c.streak,
                        lastGmvUpdate: new Date(),
                    },
                });
            } catch (error: any) {
                // Handle duplicate key errors gracefully
                if (error.code === 'P2002') {
                    skipped++;
                } else {
                    console.error(`Error creating ${c.name}:`, error.message);
                }
            }
        }

        console.log(`  ✅ Batch ${Math.floor(batch / 20) + 1}/${Math.ceil(TOTAL_CREATORS / 20)} done (${batchEnd}/${TOTAL_CREATORS})`);
    }

    // Count approved creators for display
    const totalApproved = await prisma.application.count({
        where: { campaignId: campaign.id, status: 'APPROVED' },
    });

    // Show top 10 leaderboard
    console.log(`\n📊 Created: ${created} | Skipped: ${skipped} | Total in campaign: ${totalApproved}`);
    console.log('\n🏆 Top 10 Leaderboard:');
    console.log('─────────────────────────────────────────────────────────');

    const topStats = await prisma.creatorCampaignStats.findMany({
        where: { campaignId: campaign.id },
        orderBy: { gmv: 'desc' },
        take: 10,
    });

    const profileIds = topStats.map(s => s.creatorId);
    const profiles = await prisma.creatorProfile.findMany({ where: { id: { in: profileIds } } });
    const nameMap = new Map(profiles.map(p => [p.id, p.displayName]));

    topStats.forEach((s, i) => {
        const name = (nameMap.get(s.creatorId) || 'Unknown').padEnd(25);
        console.log(`  #${String(i + 1).padStart(2)} | ${name} | GMV: ฿${String(s.gmv).padStart(8)} | Videos: ${String(s.approvedSubmissions).padStart(3)} | Streak: 🔥${s.longestStreak}`);
    });

    console.log('─────────────────────────────────────────────────────────');
    console.log(`\n✨ Done! ${totalApproved} creators ready for reward testing.`);
    console.log('Password for all test accounts: 123456');
    console.log('\nTo clean: npx ts-node scripts/seed-bulk-creators.ts --clean');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
