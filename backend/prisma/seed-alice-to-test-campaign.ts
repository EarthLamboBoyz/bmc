import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addAliceToTestCampaign() {
  console.log('🌱 Adding Alice Creative to test campaign...\n');

  const campaignId = 'demo-leaderboard-campaign';

  // Find Alice Creative
  const alice = await prisma.creatorProfile.findFirst({
    where: { 
      OR: [
        { displayName: { contains: 'Alice' } },
        { user: { email: { contains: 'alice' } } }
      ]
    }
  });

  if (!alice) {
    console.log('❌ Alice Creative not found');
    return;
  }

  console.log(`✅ Found: ${alice.displayName} (ID: ${alice.id})`);

  // Add application
  await prisma.application.upsert({
    where: {
      campaignId_creatorId: {
        campaignId: campaignId,
        creatorId: alice.id,
      }
    },
    create: {
      campaignId: campaignId,
      creatorId: alice.id,
      status: 'APPROVED',
    },
    update: {
      status: 'APPROVED',
    }
  });

  // Add stats for Alice (make her competitive!)
  await prisma.creatorCampaignStats.upsert({
    where: {
      campaignId_creatorId: {
        campaignId: campaignId,
        creatorId: alice.id,
      }
    },
    create: {
      campaignId: campaignId,
      creatorId: alice.id,
      gmv: 680000,  // High GMV - Rank 2
      orders: 1650,
      approvedSubmissions: 14,
      totalSubmissions: 14,
      currentStreak: 10,
      longestStreak: 10,
    },
    update: {
      gmv: 680000,
      orders: 1650,
      approvedSubmissions: 14,
      totalSubmissions: 14,
      currentStreak: 10,
      longestStreak: 10,
    }
  });

  // Add submissions
  await prisma.submission.deleteMany({
    where: {
      campaignId: campaignId,
      creatorId: alice.id,
    }
  });

  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const submittedDate = new Date(today);
    submittedDate.setDate(today.getDate() - i);
    
    await prisma.submission.create({
      data: {
        campaignId: campaignId,
        creatorId: alice.id,
        contentUrl: `https://tiktok.com/@alicecreative/video/${3000000 + i}`,
        caption: `Alice รีวิวสินค้า ${i + 1}`,
        platform: 'TikTok',
        status: 'APPROVED',
        day: i + 1,
        views: Math.floor(Math.random() * 60000) + 20000,
        likes: Math.floor(Math.random() * 6000) + 1500,
        createdAt: submittedDate,
      },
    });
  }

  console.log(`✅ Alice Creative added to Test Campaign!`);
  console.log(`   GMV: ฿680,000 (Rank 2)`);
  console.log(`   Videos: 14`);
  console.log(`   Streak: 10 days`);
  console.log(`\n🏆 Alice มีลุ้น Top 2 ทุกประเภท!`);
}

addAliceToTestCampaign()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
