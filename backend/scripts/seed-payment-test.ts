
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🧪 Starting Payment Test Seed...');

    // 1. Create/Reset Test Brand
    const brandEmail = 'payment-test-brand@bmc.com';
    const passwordHash = await bcrypt.hash('123456', 10);

    let brandUser = await prisma.user.findUnique({ where: { email: brandEmail } });
    if (brandUser) {
        console.log('Deleting existing test brand...');
        await prisma.transaction.deleteMany({ where: { brand: { userId: brandUser.id } } });
        await prisma.submission.deleteMany({ where: { campaign: { brand: { userId: brandUser.id } } } });
        await prisma.application.deleteMany({ where: { campaign: { brand: { userId: brandUser.id } } } });
        await prisma.campaign.deleteMany({ where: { brand: { userId: brandUser.id } } });
        await prisma.brandProfile.delete({ where: { userId: brandUser.id } });
        await prisma.user.delete({ where: { id: brandUser.id } });
    }

    brandUser = await prisma.user.create({
        data: {
            email: brandEmail,
            passwordHash,
            role: 'BRAND',
            brandProfile: {
                create: {
                    companyName: 'Payment Test Co.',
                    description: 'Company for testing payments',
                    industry: 'Tech'
                }
            }
        },
        include: { brandProfile: true }
    });
    console.log(`✅ Created Brand: ${brandEmail} (Pass: 123456)`);

    // 2. Create Test Campaign
    const campaign = await prisma.campaign.create({
        data: {
            brandId: (brandUser as any).brandProfile!.id,
            title: 'Payment Logic Test Campaign',
            description: 'Campaign to verify end-campaign logic',
            coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=800',
            status: 'live',
            budget: 10000,
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
            minFollowers: 1000,
            rewards: JSON.stringify([{ title: 'Participation Reward', budget: 500, type: 'participation' }]),
            rewardPerPost: 500
        }
    });
    console.log(`✅ Created Campaign: ${campaign.title}`);

    // 3. Create Test Creator
    const creatorEmail = 'payment-test-creator@bmc.com';
    let creatorUser = await prisma.user.findUnique({ where: { email: creatorEmail } });

    if (creatorUser) {
        // Cleanup if needed, but for now assuming clean or reuse is fine if uniqueness detailed above handled it
        // Actually better to clean to ensure clean slate
        await prisma.creatorProfile.delete({ where: { userId: creatorUser.id } }).catch(() => { });
        await prisma.user.delete({ where: { id: creatorUser.id } }).catch(() => { });
    }

    creatorUser = await prisma.user.create({
        data: {
            email: creatorEmail,
            passwordHash,
            role: 'CREATOR',
            creatorProfile: {
                create: {
                    displayName: 'Pay Me Creator',
                    tiktokHandle: '@payme',
                    followersCount: 5000,
                    paymentMethod: 'BANK_TRANSFER',
                    bankName: 'KBank',
                    bankAccountNo: '888-888-8888',
                    bankAccountName: 'Pay Me Please'
                }
            }
        },
        include: { creatorProfile: true }
    });
    console.log(`✅ Created Creator: ${creatorEmail} (Pass: 123456)`);

    // 4. Submit & Approve Work
    await prisma.application.create({
        data: {
            campaignId: campaign.id,
            creatorId: (creatorUser as any).creatorProfile!.id,
            status: 'APPROVED'
        }
    });

    await prisma.submission.create({
        data: {
            campaignId: campaign.id,
            creatorId: (creatorUser as any).creatorProfile!.id,
            contentUrl: 'http://tiktok.com/@payme/video/123456',
            platform: 'TikTok',
            status: 'APPROVED'
        }
    });
    console.log('✅ Creator Applied & Submitted Work (Approved)');

    console.log('\n--- READY FOR TESTING ---');
    console.log('1. Login as Brand: payment-test-brand@bmc.com / 123456');
    console.log('2. Go to "Payment Logic Test Campaign"');
    console.log('3. Click "End Campaign"');
    console.log('4. Check Payments menu');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
