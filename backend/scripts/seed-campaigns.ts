import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 0. Ensure Demo Brand User Exists with CORRECT credentials
    const demoEmail = 'demo-brand@bmc.com'; // Matches Frontend
    const demoPassword = '123456';
    const passwordHash = await bcrypt.hash(demoPassword, 10);

    let demoUser: any = await prisma.user.findUnique({
        where: { email: demoEmail },
        include: { brandProfile: true }
    });

    if (!demoUser) {
        console.log(`Creating new demo user: ${demoEmail}`);
        demoUser = await prisma.user.create({
            data: {
                email: demoEmail,
                passwordHash,
                // name: 'Brand Demo', // Removed: Not in User schema
                role: 'BRAND',
                brandProfile: {
                    create: {
                        companyName: 'Demo Company',
                        description: 'A demo company for testing.',
                        industry: 'Technology',
                    }
                }
            },
            include: { brandProfile: true }
        });
    } else {
        console.log(`Updating existing demo user: ${demoEmail}`);
        // Update password just in case it was wrong
        demoUser = await prisma.user.update({
            where: { id: demoUser.id },
            data: { passwordHash },
            include: { brandProfile: true }
        });
    }

    // 1. Find ALL Brand Profiles (now includes our demo user)
    let brands = await prisma.brandProfile.findMany({
        include: { user: true }
    });

    if (brands.length === 0) {
        console.log('⚠️ No Brand Profile found even after creation? Something is wrong.');
    } else {
        console.log(`ℹ️ Found ${brands.length} existing Brands. Creating campaigns for ALL of them...`);
    }

    // 2. Loop through all brands and create campaigns
    for (const brand of brands) {
        // Use brand.companyName or fallback to user email/id if name not available on user (User has no name)
        console.log(`👉 Adding campaigns for: ${brand.companyName} (${brand.user.email})`);

        // Campaign 1: Skincare
        await prisma.campaign.create({
            data: {
                title: 'Skincare Revolution Challenge',
                description: 'Join us in showcasing the best skincare routine using our new serum!',
                brandId: brand.id,
                coverImage: 'https://images.unsplash.com/photo-1556228720-1957be83f80c?q=80&w=2574&auto=format&fit=crop',
                status: 'LIVE',
                budget: 50000,
                startDate: new Date(),
                endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
                // platform: 'TikTok', // Removed
                // category: 'Beauty', // Removed: Not in Campaign schema (use categories)
                minFollowers: 1000,
                type: 'CHALLENGE',
                rewards: JSON.stringify([
                    { title: 'Best Video', type: 'custom', budget: 10000, description: 'Highest engagement', totalQuantity: 1, remainingQuantity: 1 },
                    { title: 'Participation', type: 'custom', budget: 500, description: 'For everyone', totalQuantity: 80, remainingQuantity: 80 }
                ]),
                // 'requirements' field does not exist in schema, mapped to contentGuidelines
                contentGuidelines: JSON.stringify(['Must show product usage', 'Minimum 30 seconds']),
                platforms: JSON.stringify(['TikTok', 'Instagram']),
                categories: JSON.stringify(['Beauty', 'Lifestyle'])
            }
        });

        // Campaign 2: Tech
        await prisma.campaign.create({
            data: {
                title: 'Tech Gadget Unboxing',
                description: 'Unbox our latest wireless earbuds and share your first impressions.',
                brandId: brand.id,
                coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2670&auto=format&fit=crop',
                status: 'DRAFT',
                budget: 20000,
                startDate: new Date(new Date().setDate(new Date().getDate() + 5)),
                endDate: new Date(new Date().setDate(new Date().getDate() + 35)),
                // platform: 'Instagram', // Removed
                // category: 'Tech', // Removed: Not in Campaign schema
                minFollowers: 5000,
                type: 'CAMPAIGN',
                contentGuidelines: JSON.stringify(['Clear audio', 'Unboxing sequence']),
                platforms: JSON.stringify(['YouTube', 'Facebook']),
                categories: JSON.stringify(['Tech', 'Gadgets'])
            }
        });
    }

    console.log('✨ Seed completed successfully for ALL brands.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
