import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedLeaderboardData() {
  const campaignId = '1'; // Test campaign - String type
  
  // Mock data - 10 creators with realistic GMV/Video/Streak data
  const mockCreators = [
    { creatorId: 'CREATOR001', gmv: 158000, orders: 45, videos: 12, streak: 5 },
    { creatorId: 'CREATOR002', gmv: 142500, orders: 38, videos: 10, streak: 7 },
    { creatorId: 'CREATOR003', gmv: 125000, orders: 32, videos: 8, streak: 4 },
    { creatorId: 'CREATOR004', gmv: 98000, orders: 28, videos: 15, streak: 10 },  // Top Volume
    { creatorId: 'CREATOR005', gmv: 87500, orders: 25, videos: 6, streak: 3 },
    { creatorId: 'CREATOR006', gmv: 76000, orders: 22, videos: 9, streak: 6 },
    { creatorId: 'CREATOR007', gmv: 65000, orders: 18, videos: 7, streak: 8 },
    { creatorId: 'CREATOR008', gmv: 54000, orders: 15, videos: 11, streak: 2 },
    { creatorId: 'CREATOR009', gmv: 42000, orders: 12, videos: 4, streak: 4 },
    { creatorId: 'CREATOR010', gmv: 35000, orders: 10, videos: 5, streak: 5 },
  ];

  console.log('🌱 Seeding leaderboard test data...\n');

  for (const data of mockCreators) {
    // Upsert stats
    await prisma.creatorCampaignStats.upsert({
      where: {
        campaignId_creatorId: {
          campaignId,
          creatorId: data.creatorId,
        },
      },
      create: {
        campaignId,
        creatorId: data.creatorId,
        gmv: data.gmv,
        orders: data.orders,
        approvedSubmissions: data.videos,
        totalSubmissions: data.videos,
        currentStreak: data.streak,
        longestStreak: data.streak,
      },
      update: {
        gmv: data.gmv,
        orders: data.orders,
        approvedSubmissions: data.videos,
        totalSubmissions: data.videos,
        currentStreak: data.streak,
        longestStreak: data.streak,
      },
    });

    console.log(`✅ Stats: ${data.creatorId} - GMV=฿${data.gmv.toLocaleString()}, Videos=${data.videos}, Streak=${data.streak} days`);
  }

  // Also create submission records for these stats
  console.log('\n📝 Creating submission records...');
  
  for (const data of mockCreators) {
    // Delete existing mock submissions for this creator in this campaign
    await prisma.submission.deleteMany({
      where: {
        campaignId,
        creatorId: data.creatorId,
      },
    });

    // Create approved submissions equal to video count
    for (let i = 0; i < data.videos; i++) {
      await prisma.submission.create({
        data: {
          campaignId,
          creatorId: data.creatorId,
          contentUrl: `https://example.com/video/${data.creatorId}/${i + 1}`,
          caption: `Test submission ${i + 1} for campaign`,
          platform: 'TikTok',
          status: 'APPROVED',
          day: i + 1,
        },
      });
    }
    console.log(`   ${data.creatorId}: Created ${data.videos} submissions`);
  }

  console.log('\n✅ Seed complete!');
  console.log('\n📊 Leaderboard Summary:');
  console.log('   🏆 Top GMV:     CREATOR001 (฿158,000)');
  console.log('   🎬 Top Volume:  CREATOR004 (15 videos)');
  console.log('   🔥 Top Streak:  CREATOR004 (10 days)');
}

seedLeaderboardData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
