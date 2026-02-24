
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  console.log('🔍 Checking Database Data...');

  const users = await prisma.user.findMany({
    include: { brandProfile: true }
  });
  console.log(`\n👤 Users Found: ${users.length}`);
  users.forEach(u => {
    console.log(`- ${u.email} (Role: ${u.role}, BrandID: ${u.brandProfile?.id || 'N/A'})`);
  });

  const campaigns = await prisma.campaign.findMany();
  console.log(`\n📢 Campaigns Found: ${campaigns.length}`);
  campaigns.forEach(c => {
    console.log(`- ${c.title} (BrandID: ${c.brandId}, Status: ${c.status})`);
  });
}

checkData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
