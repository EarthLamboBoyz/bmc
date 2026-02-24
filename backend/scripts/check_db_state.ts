
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Checking Database State ---');

    const campaigns = await prisma.campaign.findMany({ select: { id: true, title: true, status: true, brandId: true } });
    console.log(`\nCampaigns (${campaigns.length}):`);
    campaigns.forEach(c => console.log(`- [${c.status}] ${c.title} (ID: ${c.id})`));

    const submissions = await prisma.submission.findMany({
        include: { creator: { select: { displayName: true } } }
    });
    console.log(`\nSubmissions (${submissions.length}):`);
    submissions.forEach(s => console.log(`- [${s.status}] ID: ${s.id}, Campaign: ${s.campaignId}, Creator: ${s.creator.displayName}`));

    const transactions = await prisma.transaction.findMany();
    console.log(`\nTransactions (${transactions.length}):`);
    transactions.forEach(t => console.log(`- [${t.status}] Amount: ${t.amount}, SubmissionId: ${t.submissionId}`));

    const creators = await prisma.creatorProfile.findMany({ select: { id: true, displayName: true } });
    console.log(`\nCreators (${creators.length}):`);
    creators.forEach(c => console.log(`- ${c.displayName} (ID: ${c.id})`));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
