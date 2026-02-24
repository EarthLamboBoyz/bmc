
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetDemoUsers() {
    try {
        console.log('--- Resetting Demo Users ---');

        const brandEmail = 'brand@demo.com';
        const creatorEmail = 'creator@demo.com';
        const password = 'password123';
        const passwordHash = await bcrypt.hash(password, 10);

        // 1. Delete existing users
        console.log('1. Deleting existing demo users...');
        await prisma.user.deleteMany({
            where: {
                email: {
                    in: [brandEmail, creatorEmail]
                }
            }
        });
        console.log('✅ Deleted existing users.');

        // 2. Create Brand
        console.log(`2. Creating Brand: ${brandEmail}...`);
        const brandUser = await prisma.user.create({
            data: {
                email: brandEmail,
                passwordHash,
                role: 'BRAND',
                brandProfile: {
                    create: {
                        companyName: 'Demo Brand Co.',
                        industry: 'Technology'
                    }
                }
            }
        });
        console.log('✅ Brand created.');

        // 3. Create Creator
        console.log(`3. Creating Creator: ${creatorEmail}...`);
        const creatorUser = await prisma.user.create({
            data: {
                email: creatorEmail,
                passwordHash,
                role: 'CREATOR',
                creatorProfile: {
                    create: {
                        displayName: 'Demo Creator',
                        tiktokHandle: '@democreator',
                        followersCount: 10000
                    }
                }
            }
        });
        console.log('✅ Creator created.');

        console.log('\n🎉 RESET COMPLETE');
        console.log('Use these credentials:');
        console.log(`Brand: ${brandEmail} / ${password}`);
        console.log(`Creator: ${creatorEmail} / ${password}`);

    } catch (error: any) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

resetDemoUsers();
