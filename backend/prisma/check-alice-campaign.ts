import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAliceCampaign() {
  const campaignId = 'demo-leaderboard-campaign';
  
  // Find Alice
  const alice = await prisma.creatorProfile.findFirst({
    where: { 
      OR: [
        { displayName: { contains: 'Alice' } },
        { user: { email: { contains: 'alice' } } }
      ]
    }
  });
  
  console.log('Alice:', alice);
  
  if (alice) {
    // Check application
    const app = await prisma.application.findUnique({
      where: {
        campaignId_creatorId: {
          campaignId: campaignId,
          creatorId: alice.id
        }
      }
    });
    console.log('Application:', app);
    
    // Check stats
    const stats = await prisma.creatorCampaignStats.findUnique({
      where: {
        campaignId_creatorId: {
          campaignId: campaignId,
          creatorId: alice.id
        }
      }
    });
    console.log('Stats:', stats);
  }
}

checkAliceCampaign()
  .finally(() => prisma.$disconnect());
