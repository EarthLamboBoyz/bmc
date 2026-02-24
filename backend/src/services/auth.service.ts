import prisma from '../utils/prisma';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

type Role = 'BRAND' | 'CREATOR';

interface User {
    id: string;
    email: string;
    passwordHash: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

export const registerUser = async (email: string, password: string, role: Role): Promise<{ user: User; token: string }> => {
    const existingUser = await prisma.user.findUnique({ where: { email } }) as User | null;
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash: hashedPassword,
            role,
        },
    }) as User;

    // Create empty profile based on role
    if (role === 'BRAND') {
        await prisma.brandProfile.create({
            data: {
                userId: user.id,
                companyName: 'New Brand', // Default name, user should update later
            },
        });
    } else if (role === 'CREATOR') {
        await prisma.creatorProfile.create({
            data: {
                userId: user.id,
                displayName: 'New Creator', // Default name
            },
        });
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });
    return { user, token };
};

export const loginUser = async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const user = await prisma.user.findUnique({ where: { email } }) as User | null;
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });
    return { user, token };
};
