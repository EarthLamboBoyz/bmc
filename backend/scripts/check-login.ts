import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'demo-brand@bmc.com';
    const password = '123456';

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.log('❌ User not found');
        return;
    }

    console.log(`✅ User found: ${user.email}`);
    console.log(`🔑 Stored Hash: ${user.passwordHash}`);

    const isValid = await bcrypt.compare(password, user.passwordHash);
    console.log(`🔓 Password '123456' valid? ${isValid}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
