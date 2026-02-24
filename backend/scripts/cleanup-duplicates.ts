/**
 * Cleanup duplicate "Full Reward Test Campaign" campaigns
 * Keeps only the most recent completed one.
 * Run: npx ts-node scripts/cleanup-duplicates.ts
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Cleaning up duplicate campaigns...\n');

    // Find all "Full Reward Test Campaign" campaigns
    const duplicates = await prisma.campaign.findMany({
        where: { title: 'Full Reward Test Campaign' },
        orderBy: { createdAt: 'desc' },
        select: { id: true, status: true, createdAt: true }
    });

    console.log(`Found ${duplicates.length} "Full Reward Test Campaign" campaigns:`);
    duplicates.forEach((c, i) => {
        console.log(`  ${i + 1}. ID: ${c.id} | Status: ${c.status} | Created: ${c.createdAt.toISOString()}`);
    });

    if (duplicates.length <= 1) {
        console.log('\n✅ No duplicates to clean up!');
        return;
    }

    // Keep the first one (most recent), delete the rest
    const keep = duplicates[0];
    const toDelete = duplicates.slice(1);

    console.log(`\n🔒 Keeping: ${keep.id} (${keep.status})`);
    console.log(`🗑️  Deleting ${toDelete.length} duplicates...`);

    for (const campaign of toDelete) {
        try {
            // Delete related records first (cascade)
            await prisma.submission.deleteMany({ where: { campaignId: campaign.id } });
            await prisma.application.deleteMany({ where: { campaignId: campaign.id } });
            await prisma.creatorCampaignStats.deleteMany({ where: { campaignId: campaign.id } });
            await prisma.gmvUpload.deleteMany({ where: { campaignId: campaign.id } });
            await prisma.campaign.delete({ where: { id: campaign.id } });
            console.log(`  ✅ Deleted: ${campaign.id}`);
        } catch (err: any) {
            console.log(`  ⚠️ Could not delete ${campaign.id}: ${err.message}`);
        }
    }

    // Also check for E2E Test Campaign duplicates
    const e2eDuplicates = await prisma.campaign.findMany({
        where: { title: { contains: 'E2E Test Campaign' } },
        orderBy: { createdAt: 'desc' },
        select: { id: true, status: true, createdAt: true }
    });

    if (e2eDuplicates.length > 1) {
        console.log(`\nFound ${e2eDuplicates.length} "E2E Test Campaign" campaigns, keeping 1...`);
        for (const campaign of e2eDuplicates.slice(1)) {
            try {
                await prisma.submission.deleteMany({ where: { campaignId: campaign.id } });
                await prisma.application.deleteMany({ where: { campaignId: campaign.id } });
                await prisma.creatorCampaignStats.deleteMany({ where: { campaignId: campaign.id } });
                await prisma.gmvUpload.deleteMany({ where: { campaignId: campaign.id } });
                await prisma.campaign.delete({ where: { id: campaign.id } });
                console.log(`  ✅ Deleted E2E: ${campaign.id}`);
            } catch (err: any) {
                console.log(`  ⚠️ Could not delete ${campaign.id}: ${err.message}`);
            }
        }
    }

    // Show remaining campaigns
    const remaining = await prisma.campaign.findMany({
        select: { id: true, title: true, status: true },
        orderBy: { createdAt: 'desc' }
    });
    console.log(`\n📋 Remaining campaigns (${remaining.length}):`);
    remaining.forEach(c => {
        console.log(`  - ${c.title} (${c.status})`);
    });

    console.log('\n✨ Cleanup complete!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
