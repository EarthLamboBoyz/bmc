import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { z } from 'zod';
import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Validation Schemas
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['BRAND', 'CREATOR']),
    // Brand fields
    companyName: z.string().optional(),
    industry: z.string().optional(),
    // Creator fields
    displayName: z.string().optional(),
    tiktokHandle: z.string().optional(),
    instagramHandle: z.string().optional(),
    followersCount: z.coerce.number().optional(), // Expect number or string convertible to number
    categories: z.array(z.string()).optional(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            email, password, role,
            companyName, industry,
            displayName, tiktokHandle, instagramHandle, followersCount, categories
        } = registerSchema.parse(req.body);

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user in transaction
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    passwordHash,
                    role,
                },
            });

            if (role === 'BRAND') {
                if (!companyName) throw new Error('Company name is required for Brand');
                await tx.brandProfile.create({
                    data: {
                        userId: user.id,
                        companyName,
                        industry,
                    },
                });
            } else if (role === 'CREATOR') {
                if (!displayName) throw new Error('Display name is required for Creator');
                await tx.creatorProfile.create({
                    data: {
                        userId: user.id,
                        displayName,
                        tiktokHandle,
                        instagramHandle,
                        followersCount: followersCount || 0,
                        categories: categories ? JSON.stringify(categories) : '[]',
                    },
                });
            }

            return user;
        });

        // Generate Token
        const token = jwt.sign(
            { userId: result.id, email: result.email, role: result.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: result.id,
                email: result.email,
                role: result.role,
                name: role === 'BRAND' ? companyName : displayName
            }
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                brandProfile: true,
                creatorProfile: true
            }
        });

        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const isValidHeader = await bcrypt.compare(password, user.passwordHash);
        if (!isValidHeader) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        let name = '';
        if (user.role === 'BRAND') {
            name = user.brandProfile?.companyName || '';
        } else {
            name = user.creatorProfile?.displayName || '';
        }

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name
            }
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                brandProfile: true,
                creatorProfile: true
            }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const { passwordHash, ...userWithoutPassword } = user;

        let name = '';
        if (user.role === 'BRAND') {
            name = user.brandProfile?.companyName || '';
        } else {
            name = user.creatorProfile?.displayName || '';
        }

        res.json({
            user: {
                ...userWithoutPassword,
                name
            }
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const role = req.user?.role;
        const updates = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // 1. Update User basic info (e.g. email) if provided
        if (updates.email) {
            await prisma.user.update({
                where: { id: userId },
                data: { email: updates.email }
            });
        }

        // 2. Update Profile based on role
        if (role === 'BRAND') {
            await prisma.brandProfile.update({
                where: { userId },
                data: {
                    companyName: updates.companyName,
                    industry: updates.industry,
                    phone: updates.phone,
                    website: updates.website,
                    address: updates.address,
                    description: updates.description
                }
            });
        } else if (role === 'CREATOR') {
            await prisma.creatorProfile.update({
                where: { userId },
                data: {
                    displayName: updates.displayName || updates.name,
                    phone: updates.phone,
                    tiktokHandle: updates.tiktokHandle,
                    instagramHandle: updates.instagramHandle,
                    youtubeHandle: updates.youtubeHandle,
                    followersCount: updates.followersCount ? parseInt(updates.followersCount) : undefined,
                    address: typeof updates.address === 'object' ? JSON.stringify(updates.address) : updates.address,
                    paymentMethod: updates.paymentMethod,
                    promptpayId: updates.promptpayId,
                    bankName: updates.bankName,
                    bankAccountNo: updates.bankAccountNo,
                    bankAccountName: updates.bankAccountName,
                    bio: updates.bio
                }
            });
        }

        // 3. Return updated user data
        const updatedUser = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                brandProfile: true,
                creatorProfile: true
            }
        });

        if (!updatedUser) {
            res.status(404).json({ error: 'User not found after update' });
            return;
        }

        const { passwordHash, ...userWithoutPassword } = updatedUser;

        let name = '';
        if (updatedUser.role === 'BRAND') {
            name = updatedUser.brandProfile?.companyName || '';
        } else {
            name = updatedUser.creatorProfile?.displayName || '';
        }

        res.json({
            user: {
                ...userWithoutPassword,
                name
            },
            message: 'Profile updated successfully'
        });

    } catch (error: any) {
        console.error('Update error:', error);
        res.status(500).json({ error: error.message });
    }
};
