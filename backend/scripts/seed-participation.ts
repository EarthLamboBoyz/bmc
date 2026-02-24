
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting participation seed...');

    // 1. Find the Demo Brand and its Live Campaign
    const demoEmail = 'demo-brand@bmc.com';
    const user = await prisma.user.findUnique({
        where: { email: demoEmail },
        include: { brandProfile: { include: { campaigns: true } } }
    });

    if (!user || !user.brandProfile) {
        console.error('❌ Demo Brand not found. Please run seed-campaigns.ts first.');
        return;
    }

    const campaign = user.brandProfile.campaigns.find(c => c.status === 'live');
    if (!campaign) {
        console.error('❌ No LIVE campaign found for Demo Brand.');
        return;
    }

    console.log(`✅ Found Campaign: "${campaign.title}" (ID: ${campaign.id})`);

    // 2. Create Test Creators
    const creatorsData = [
        { email: 'creator1@test.com', name: 'Alice Creative', handle: '@alice_creates', paymentMethod: 'PROMPTPAY', bank: 'KBank' },
        { email: 'creator2@test.com', name: 'Bob Vlogger', handle: '@bobby_vlogs', paymentMethod: 'BANK_TRANSFER', bank: 'SCB' },
        { email: 'creator3@test.com', name: 'Charlie Streamer', handle: '@charlie_live', paymentMethod: 'PROMPTPAY', bank: 'BBL' },
        { email: 'creator4@test.com', name: 'Diana Reviewer', handle: '@diana_reviews', paymentMethod: 'BANK_TRANSFER', bank: 'KTB' },
        { email: 'creator5@test.com', name: 'Eve Influencer', handle: '@eve_style', paymentMethod: 'PROMPTPAY', bank: 'TTB' },
    ];

    const passwordHash = await bcrypt.hash('123456', 10);

    for (const c of creatorsData) {
        let user = await prisma.user.findUnique({ where: { email: c.email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: c.email,
                    passwordHash,
                    role: 'CREATOR'
                }
            });
            console.log(`Created User: ${c.email}`);
        }

        let creatorProfile = await prisma.creatorProfile.findUnique({ where: { userId: user.id } });
        if (!creatorProfile) {
            creatorProfile = await prisma.creatorProfile.create({
                data: {
                    userId: user.id,
                    displayName: c.name,
                    tiktokHandle: c.handle,
                    followersCount: Math.floor(Math.random() * 100000) + 1000,
                    paymentMethod: c.paymentMethod,
                    promptpayId: c.paymentMethod === 'PROMPTPAY' ? `08${Math.floor(Math.random() * 100000000)}` : null,
                    bankName: c.paymentMethod === 'BANK_TRANSFER' ? c.bank : null,
                    bankAccountNo: c.paymentMethod === 'BANK_TRANSFER' ? '1234567890' : null,
                    bankAccountName: c.name
                }
            });
            console.log(`Created Profile: ${c.name}`);
        }

        // 3. Create Application (Approved)
        const existingApp = await prisma.application.findUnique({
            where: {
                campaignId_creatorId: {
                    campaignId: campaign.id,
                    creatorId: creatorProfile.id
                }
            }
        });

        if (!existingApp) {
            await prisma.application.create({
                data: {
                    campaignId: campaign.id,
                    creatorId: creatorProfile.id,
                    status: 'APPROVED'
                }
            });
            console.log(`  -> Applied & Approved`);
        }

        // 4. Create Submission (Approved)
        // Some creators might have multiple submissions? Let's just do 1 for now.
        const existingSub = await prisma.submission.findFirst({
            where: {
                campaignId: campaign.id,
                creatorId: creatorProfile.id
            }
        });

        if (!existingSub) {
            await prisma.submission.create({
                data: {
                    campaignId: campaign.id,
                    creatorId: creatorProfile.id,
                    contentUrl: `https://tiktok.com/@${c.handle.substring(1)}/video/${Math.floor(Math.random() * 1000000)}`,
                    platform: 'TikTok',
                    status: 'APPROVED',
                    views: Math.floor(Math.random() * 50000),
                    likes: Math.floor(Math.random() * 5000),
                    shares: Math.floor(Math.random() * 500),
                    comments: Math.floor(Math.random() * 100),
                    day: 1
                }
            });
            console.log(`  -> Submitted Work & Approved`);
        }
    }

    console.log('✨ Participation seed completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
