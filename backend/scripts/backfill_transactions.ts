
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Backfilling Transactions ---');

    // 1. Get all APPROVED submissions
    const approvedSubmissions = await prisma.submission.findMany({
        where: { status: 'APPROVED' },
        include: {
            campaign: true,
            creator: true
        }
    });

    console.log(`Found ${approvedSubmissions.length} approved submissions.`);

    let createdCount = 0;

    for (const submission of approvedSubmissions) {
        // 2. Check if transaction exists
        const existingTx = await prisma.transaction.findFirst({
            where: { submissionId: submission.id }
        });

        if (!existingTx) {
            console.log(`Creating transaction for submission ${submission.id}...`);

            // Determine amount
            let amount = submission.campaign.rewardPerPost || 0;
            if (amount === 0 && submission.campaign.rewards) {
                try {
                    const rewards = JSON.parse(submission.campaign.rewards);
                    if (rewards.length > 0 && rewards[0].budget) {
                        amount = rewards[0].budget;
                    }
                } catch (e) {
                    // ignore
                }
            }

            // Fallback amount if still 0, just so they can test
            if (amount === 0) amount = 1000;

            const recipientInfo = {
                paymentMethod: submission.creator.paymentMethod,
                promptpayId: submission.creator.promptpayId,
                bankName: submission.creator.bankName,
                bankAccountNo: submission.creator.bankAccountNo,
                bankAccountName: submission.creator.bankAccountName
            };

            await prisma.transaction.create({
                data: {
                    brandId: submission.campaign.brandId,
                    creatorId: submission.creatorId,
                    campaignId: submission.campaignId,
                    submissionId: submission.id,
                    amount: amount,
                    paymentMethod: 'BANK_TRANSFER',
                    status: 'PENDING',
                    recipientInfo: JSON.stringify(recipientInfo)
                }
            });
            createdCount++;
        }
    }

    console.log(`Successfully backfilled ${createdCount} transactions.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
