
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function check() {
    console.log('Checking demo-brand@bmc.com...');
    const user = await prisma.user.findUnique({
        where: { email: 'demo-brand@bmc.com' }
    });

    if (!user) {
        console.log('❌ User NOT FOUND');
    } else {
        console.log('✅ User FOUND');
        console.log('Role:', user.role);
        console.log('PasswordHash:', user.passwordHash.substring(0, 10) + '...');

        const isMatch = await bcrypt.compare('123456', user.passwordHash);
        console.log('Password "123456" match:', isMatch ? 'YES ✅' : 'NO ❌');
    }
}

check().catch(console.error).finally(() => prisma.$disconnect());
