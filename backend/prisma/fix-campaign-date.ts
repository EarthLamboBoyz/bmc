import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixCampaignDate() {
  const campaignId = 'demo-leaderboard-campaign';
  
  // Extend end date to end of 2026
  const newEndDate = new Date('2026-12-31');
  
  await prisma.campaign.update({
    where: { id: campaignId },
    data: { 
      endDate: newEndDate,
      status: 'ACTIVE'
    }
  });
  
  console.log('✅ Campaign end date updated to:', newEndDate.toISOString().split('T')[0]);
  console.log('แคมเปญจะแสดงในรายการของ Creator แล้ว!');
}

fixCampaignDate()
  .finally(() => prisma.$disconnect());
