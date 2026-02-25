
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // 1. Create Demo Brand
    const brandEmail = 'demo-brand@bmc.com';
    let brandUser = await prisma.user.findUnique({
        where: { email: brandEmail },
        include: { brandProfile: true }
    });

    if (!brandUser) {
        const passwordHash = await bcrypt.hash('123456', 10);
        brandUser = await prisma.user.create({
            data: {
                email: brandEmail,
                passwordHash,
                role: 'BRAND',
                brandProfile: {
                    create: {
                        companyName: 'Demo Brand Co.',
                        industry: 'Fashion',
                        description: 'Leading fashion retailer for Gen Z.'
                    }
                }
            },
            include: { brandProfile: true }
        });
        console.log(`Created brand: ${brandEmail}`);
    }

    // 2. Create Demo Creator
    const creatorEmail = 'demo-creator@bmc.com';
    const existingCreator = await prisma.user.findUnique({
        where: { email: creatorEmail }
    });

    if (!existingCreator) {
        const passwordHash = await bcrypt.hash('123456', 10);
        await prisma.user.create({
            data: {
                email: creatorEmail,
                passwordHash,
                role: 'CREATOR',
                creatorProfile: {
                    create: {
                        displayName: 'Demo Creator',
                        tiktokHandle: '@democreator',
                        followersCount: 50000,
                        categories: JSON.stringify(['Lifestyle', 'Fashion']),
                        paymentMethod: 'Bank Transfer',
                        bankName: 'KBANK',
                        bankAccountNo: '123-4-56789-0',
                        bankAccountName: 'Demo Creator'
                    }
                }
            }
        });
        console.log(`Created creator: ${creatorEmail}`);
    }

    // 2. Create Demo Campaigns
    if (brandUser && brandUser.brandProfile) {
        const brandId = brandUser.brandProfile.id;

        // Campaign 1: Summer Sale
        const campaign1Id = 'demo-campaign-1';
        const campaign1 = await prisma.campaign.upsert({
            where: { id: campaign1Id },
            update: {},
            create: {
                id: campaign1Id,
                brandId: brandId,
                title: 'Summer Sale 2026',
                description: 'Join our biggest summer sale campaign! Create content showing your summer vibe with our products.',
                coverImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
                budget: 50000,
                status: 'LIVE',
                startDate: new Date(),
                endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
                minFollowers: 1000,
                platforms: JSON.stringify(['TikTok', 'Instagram']),
                categories: JSON.stringify(['Fashion', 'Lifestyle']),
                rewards: JSON.stringify([{ title: 'Best Video', budget: 5000, type: 'custom' }])
            }
        });

        // Campaign 2: New Year
        const campaign2Id = 'demo-campaign-2';
        const campaign2 = await prisma.campaign.upsert({
            where: { id: campaign2Id },
            update: {},
            create: {
                id: campaign2Id,
                brandId: brandId,
                title: 'New Year Campaign',
                description: 'Celebrate the new year with us.',
                coverImage: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800',
                budget: 30000,
                status: 'LIVE',
                startDate: new Date(),
                endDate: new Date(new Date().setDate(new Date().getDate() + 15)),
                minFollowers: 5000,
                platforms: JSON.stringify(['TikTok']),
                categories: JSON.stringify(['Lifestyle']),
                rewards: JSON.stringify([{ title: 'Top Views', budget: 3000, type: 'custom' }])
            }
        });

        console.log('Seeded demo campaigns');
    }

    console.log('Seeding finished.');

    // Force reset demo passwords using raw SQL (avoids PgBouncer prepared statement issues)
    const freshHash = await bcrypt.hash('123456', 10);
    await prisma.$executeRawUnsafe(
        `UPDATE users SET "passwordHash" = $1 WHERE email IN ($2, $3)`,
        freshHash,
        'demo-brand@bmc.com',
        'demo-creator@bmc.com'
    );
    console.log('Demo passwords reset successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
