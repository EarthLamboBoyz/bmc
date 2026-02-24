import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedTestCreatorLogin() {
  console.log('🌱 Creating test creator login accounts...\n');

  // Test creators with login credentials
  const testCreators = [
    { 
      id: 'creator-001', 
      name: 'พี่เอกรีวิว',
      email: 'creator1@test.com',
      password: 'test1234'
    },
    { 
      id: 'creator-002', 
      name: 'น้องมายด์ช็อปปิ้ง',
      email: 'creator2@test.com',
      password: 'test1234'
    },
    { 
      id: 'creator-008', 
      name: 'ลุงตู่ไลฟ์สด',
      email: 'creator8@test.com',
      password: 'test1234'
    },
  ];

  for (const creator of testCreators) {
    const hashedPassword = await bcrypt.hash(creator.password, 10);
    
    // Update user with password
    const user = await prisma.user.upsert({
      where: { email: creator.email },
      create: {
        id: `user-${creator.id}`,
        email: creator.email,
        passwordHash: hashedPassword,
        role: 'CREATOR',
      },
      update: {
        passwordHash: hashedPassword,
      }
    });

    console.log(`✅ ${creator.name}`);
    console.log(`   Email: ${creator.email}`);
    console.log(`   Password: ${creator.password}`);
  }

  // Also add Demo Creator to the test campaign
  const demoCreator = await prisma.creatorProfile.findFirst({
    where: { displayName: { contains: 'Demo' } }
  });

  if (demoCreator) {
    const campaignId = 'demo-leaderboard-campaign';
    
    // Add application
    await prisma.application.upsert({
      where: {
        campaignId_creatorId: {
          campaignId: campaignId,
          creatorId: demoCreator.id,
        }
      },
      create: {
        campaignId: campaignId,
        creatorId: demoCreator.id,
        status: 'APPROVED',
      },
      update: {}
    });

    // Add some stats for demo creator
    await prisma.creatorCampaignStats.upsert({
      where: {
        campaignId_creatorId: {
          campaignId: campaignId,
          creatorId: demoCreator.id,
        }
      },
      create: {
        campaignId: campaignId,
        creatorId: demoCreator.id,
        gmv: 125000,
        orders: 320,
        approvedSubmissions: 5,
        totalSubmissions: 5,
        currentStreak: 3,
        longestStreak: 3,
      },
      update: {}
    });

    // Add submissions
    await prisma.submission.deleteMany({
      where: {
        campaignId: campaignId,
        creatorId: demoCreator.id,
      }
    });

    for (let i = 0; i < 5; i++) {
      await prisma.submission.create({
        data: {
          campaignId: campaignId,
          creatorId: demoCreator.id,
          contentUrl: `https://tiktok.com/@democreator/video/${2000000 + i}`,
          caption: `รีวิวสินค้า ${i + 1}`,
          platform: 'TikTok',
          status: 'APPROVED',
          day: i + 1,
        },
      });
    }

    console.log(`\n✅ Demo Creator เข้าร่วมแคมเปญแล้ว`);
  }

  console.log('\n📋 Test Login Credentials:');
  console.log('   creator1@test.com / test1234 (พี่เอกรีวิว)');
  console.log('   creator2@test.com / test1234 (น้องมายด์ช็อปปิ้ง)');
  console.log('   creator8@test.com / test1234 (ลุงตู่ไลฟ์สด)');
  console.log('\n🎯 Campaign: demo-leaderboard-campaign');
}

seedTestCreatorLogin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
