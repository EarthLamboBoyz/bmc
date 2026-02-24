import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fix() {
    // 1. Update ALL campaigns to LIVE
    const updated = await prisma.campaign.updateMany({
        data: { status: 'LIVE' }
    });
    console.log('Updated campaigns to LIVE:', updated.count);

    // 2. Get first campaign and creator
    const campaign = await prisma.campaign.findFirst();
    const creator = await prisma.creatorProfile.findFirst();

    if (!campaign || !creator) {
        console.log('No campaign or creator found!');
        await prisma.$disconnect();
        return;
    }

    console.log('Campaign:', campaign.id, campaign.title);
    console.log('Creator:', creator.id, creator.displayName);

    // 3. Create or update application as APPROVED
    const app = await prisma.application.upsert({
        where: {
            campaignId_creatorId: {
                campaignId: campaign.id,
                creatorId: creator.id,
            }
        },
        update: { status: 'APPROVED' },
        create: {
            campaignId: campaign.id,
            creatorId: creator.id,
            status: 'APPROVED',
            message: 'Auto-approved for testing',
        }
    });
    console.log('Application:', app.id, app.status);

    await prisma.$disconnect();
}

fix().catch(console.error);
