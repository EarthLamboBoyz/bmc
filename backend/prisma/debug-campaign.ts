import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugCampaign() {
  const campaignId = 'demo-leaderboard-campaign';
  
  // Check campaign status
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId }
  });
  
  console.log('Campaign:', campaign);
  console.log('\nStatus:', campaign?.status);
  console.log('End Date:', campaign?.endDate);
  console.log('Today:', new Date());
  
  // Check Alice's application
  const alice = await prisma.creatorProfile.findFirst({
    where: { displayName: { contains: 'Alice' } }
  });
  
  if (alice) {
    const app = await prisma.application.findUnique({
      where: {
        campaignId_creatorId: {
          campaignId: campaignId,
          creatorId: alice.id
        }
      }
    });
    console.log('\nAlice Application:', app);
  }
}

debugCampaign()
  .finally(() => prisma.$disconnect());
