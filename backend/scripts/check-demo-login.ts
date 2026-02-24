
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkLogin() {
    const email = 'demo-brand@bmc.com';
    const password = '123456';

    console.log(`Checking login for ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log('❌ User not found in database!');
        return;
    }

    console.log('✅ User found:', {
        id: user.id,
        email: user.email,
        role: user.role,
        passwordHashLength: user.passwordHash.length
    });

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (isMatch) {
        console.log('✅ Password "123456" matches the hash in DB.');
    } else {
        console.log('❌ Password "123456" DOES NOT match the hash in DB.');
        console.log('   The password in the DB might be different.');
    }
}

checkLogin()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
