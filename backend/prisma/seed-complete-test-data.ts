import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCompleteTestData() {
  console.log('🌱 Seeding complete test data...\n');

  // 1. Create test campaign
  const campaignId = 'test-campaign-001';
  const brandId = 'test-brand-001';

  // Create brand user first
  const brandUser = await prisma.user.upsert({
    where: { email: 'testbrand@example.com' },
    create: {
      id: 'user-brand-001',
      email: 'testbrand@example.com',
      passwordHash: '$2b$10$dummyhash',
      role: 'BRAND',
      brandProfile: {
        create: {
          id: brandId,
          companyName: 'Test Brand Co.',
        }
      }
    },
    update: {},
    include: { brandProfile: true }
  });

  // Create campaign
  const campaign = await prisma.campaign.upsert({
    where: { id: campaignId },
    create: {
      id: campaignId,
      brandId: brandId,
      title: 'Test Campaign - Leaderboard Demo',
      description: 'Campaign for testing leaderboard and rewards',
      budget: 100000,
      status: 'ACTIVE',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      rewards: JSON.stringify([
        {
          type: 'sales_milestone',
          name: 'Sales Milestones',
          config: {
            tiers: [
              { rank: 1, amount: 5000 },
              { rank: 2, amount: 3000 },
              { rank: 3, amount: 2000 }
            ]
          }
        },
        {
          type: 'top_volume',
          name: 'Top Volume',
          config: {
            tiers: [
              { rank: 1, amount: 3000 },
              { rank: 2, amount: 2000 },
              { rank: 3, amount: 1000 }
            ]
          }
        },
        {
          type: 'streak_bonus',
          name: 'Streak Bonus',
          config: {
            streaks: [
              { days: 7, winners: 5, amount_per_winner: 500 },
              { days: 14, winners: 3, amount_per_winner: 1000 }
            ]
          }
        },
        {
          type: 'lucky_draw',
          name: 'Lucky Draw',
          config: {
            min_videos: 5,
            winners: 10,
            amount_per_winner: 500
          }
        }
      ]),
    },
    update: {
      rewards: JSON.stringify([
        {
          type: 'sales_milestone',
          name: 'Sales Milestones',
          config: {
            tiers: [
              { rank: 1, amount: 5000 },
              { rank: 2, amount: 3000 },
              { rank: 3, amount: 2000 }
            ]
          }
        },
        {
          type: 'top_volume',
          name: 'Top Volume',
          config: {
            tiers: [
              { rank: 1, amount: 3000 },
              { rank: 2, amount: 2000 },
              { rank: 3, amount: 1000 }
            ]
          }
        },
        {
          type: 'streak_bonus',
          name: 'Streak Bonus',
          config: {
            streaks: [
              { days: 7, winners: 5, amount_per_winner: 500 },
              { days: 14, winners: 3, amount_per_winner: 1000 }
            ]
          }
        },
        {
          type: 'lucky_draw',
          name: 'Lucky Draw',
          config: {
            min_videos: 5,
            winners: 10,
            amount_per_winner: 500
          }
        }
      ]),
    }
  });

  console.log(`✅ Campaign: ${campaign.title}`);

  // 2. Test creators data
  const testCreators = [
    { id: 'creator-001', name: 'พี่เอกรีวิว', gmv: 756000, orders: 1890, videos: 12, streak: 8 },
    { id: 'creator-002', name: 'น้องมายด์ช็อปปิ้ง', gmv: 628000, orders: 1560, videos: 10, streak: 6 },
    { id: 'creator-003', name: 'เฮียตุงอินฟลู', gmv: 567000, orders: 1420, videos: 15, streak: 12 },
    { id: 'creator-004', name: 'บิวตี้บิ๊ก', gmv: 485000, orders: 1250, videos: 8, streak: 5 },
    { id: 'creator-005', name: 'คุณแม่สายแฟ', gmv: 445000, orders: 1120, videos: 6, streak: 4 },
    { id: 'creator-006', name: 'หนุ่มสายกิน', gmv: 412000, orders: 1030, videos: 9, streak: 7 },
    { id: 'creator-007', name: 'สาวน้อยรีวิว', gmv: 392000, orders: 980, videos: 11, streak: 9 },
    { id: 'creator-008', name: 'ลุงตู่ไลฟ์สด', gmv: 318000, orders: 795, videos: 20, streak: 15 },
    { id: 'creator-009', name: 'น้องใบเฟิร์น', gmv: 289000, orders: 720, videos: 7, streak: 3 },
    { id: 'creator-010', name: 'พี่สาวขายดี', gmv: 215000, orders: 540, videos: 5, streak: 5 },
  ];

  for (const creatorData of testCreators) {
    // Create user account
    const user = await prisma.user.upsert({
      where: { email: `${creatorData.id}@test.com` },
      create: {
        id: `user-${creatorData.id}`,
        email: `${creatorData.id}@test.com`,
        passwordHash: '$2b$10$dummyhash',
        role: 'CREATOR',
      },
      update: {},
    });

    // Create creator profile
    await prisma.creatorProfile.upsert({
      where: { id: creatorData.id },
      create: {
        id: creatorData.id,
        userId: user.id,
        displayName: creatorData.name,
        tiktokHandle: `@${creatorData.id}`,
      },
      update: {
        displayName: creatorData.name,
        tiktokHandle: `@${creatorData.id}`,
      }
    });

    // Create application (approved)
    await prisma.application.upsert({
      where: {
        campaignId_creatorId: {
          campaignId: campaignId,
          creatorId: creatorData.id,
        }
      },
      create: {
        campaignId: campaignId,
        creatorId: creatorData.id,
        status: 'APPROVED',
      },
      update: {}
    });

    // Delete old submissions
    await prisma.submission.deleteMany({
      where: {
        campaignId: campaignId,
        creatorId: creatorData.id,
      }
    });

    // Create submissions (videos) - staggered dates for streak calculation
    const today = new Date();
    for (let i = 0; i < creatorData.videos; i++) {
      const submittedDate = new Date(today);
      submittedDate.setDate(today.getDate() - i); // Each video 1 day apart
      
      await prisma.submission.create({
        data: {
          campaignId: campaignId,
          creatorId: creatorData.id,
          contentUrl: `https://tiktok.com/@${creatorData.id}/video/${1000000 + i}`,
          caption: `รีวิวสินค้า ${i + 1} จาก ${creatorData.name}`,
          platform: 'TikTok',
          status: 'APPROVED',
          day: i + 1,
          views: Math.floor(Math.random() * 50000) + 10000,
          likes: Math.floor(Math.random() * 5000) + 1000,
          comments: Math.floor(Math.random() * 500) + 100,
          shares: Math.floor(Math.random() * 200) + 50,
          createdAt: submittedDate,
        },
      });
    }

    // Create/update stats
    await prisma.creatorCampaignStats.upsert({
      where: {
        campaignId_creatorId: {
          campaignId: campaignId,
          creatorId: creatorData.id,
        },
      },
      create: {
        campaignId: campaignId,
        creatorId: creatorData.id,
        gmv: creatorData.gmv,
        orders: creatorData.orders,
        approvedSubmissions: creatorData.videos,
        totalSubmissions: creatorData.videos,
        currentStreak: creatorData.streak,
        longestStreak: creatorData.streak,
        totalViews: BigInt(creatorData.videos * 30000),
        totalLikes: BigInt(creatorData.videos * 3000),
      },
      update: {
        gmv: creatorData.gmv,
        orders: creatorData.orders,
        approvedSubmissions: creatorData.videos,
        totalSubmissions: creatorData.videos,
        currentStreak: creatorData.streak,
        longestStreak: creatorData.streak,
      },
    });

    console.log(`✅ ${creatorData.name}: GMV=฿${creatorData.gmv.toLocaleString()}, Videos=${creatorData.videos}, Streak=${creatorData.streak} days`);
  }

  console.log('\n✅ Seed complete!');
  console.log('\n📊 Leaderboard Summary:');
  console.log('   🏆 Top GMV:     พี่เอกรีวิว (฿756,000)');
  console.log('   🎬 Top Volume:  ลุงตู่ไลฟ์สด (20 videos)');
  console.log('   🔥 Top Streak:  ลุงตู่ไลฟ์สด (15 days)');
  console.log(`\n🔗 Campaign ID: ${campaignId}`);
}

seedCompleteTestData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
