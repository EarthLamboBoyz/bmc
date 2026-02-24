
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        include: {
            creatorProfile: true,
            brandProfile: true
        }
    });
    console.log('--- User List ---');
    if (users.length === 0) {
        console.log('No users found.');
    } else {
        users.forEach(u => {
            console.log(`ID: ${u.id}`);
            console.log(`Email: ${u.email}`);
            console.log(`Role: ${u.role}`);
            if (u.role === 'CREATOR') {
                console.log(`Creator Name: ${u.creatorProfile?.displayName}`);
            } else {
                console.log(`Brand Name: ${u.brandProfile?.companyName}`);
            }
            console.log('-----------------');
        });
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
