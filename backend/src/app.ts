import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.routes';
import paymentRoutes from './routes/payment.routes';
import campaignRoutes from './routes/campaign.routes';
import applicationRoutes from './routes/application.routes';
import submissionRoutes from './routes/submission.routes';
import uploadRoutes from './routes/upload.routes';
import dashboardRoutes from './routes/dashboard.routes';
import profileRoutes from './routes/profile.routes';
import gmvRoutes from './routes/gmv.routes';
import testRoutes from './routes/test.routes';
import rewardCalcRoutes from './routes/rewardCalculation.routes';
import creatorCampaignRoutes from './routes/creatorCampaign.routes';

const app = express();

// ============================================
// Security Middleware
// ============================================
app.use(helmet());

// Rate limiting — 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ============================================
// Health Check (for Docker / Load Balancer)
// ============================================
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// API Routes
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/gmv', gmvRoutes);
app.use('/api/rewards', rewardCalcRoutes);
app.use('/api/creator', creatorCampaignRoutes);

// Test routes — only in development
if (process.env.NODE_ENV !== 'production') {
    app.use('/api/test', testRoutes);
}

// Temporary seed endpoint — remove after seeding production
app.get('/api/seed', async (_req: Request, res: Response) => {
    try {
        // First push the schema to create tables
        const { execSync } = await import('child_process');
        execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });

        const { PrismaClient } = await import('@prisma/client');
        const bcrypt = await import('bcryptjs');
        const prisma = new PrismaClient();

        const passwordHash = await bcrypt.hash('123456', 10);

        // Create demo brand
        const brandUser = await prisma.user.upsert({
            where: { email: 'demo-brand@bmc.com' },
            update: {},
            create: {
                email: 'demo-brand@bmc.com',
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

        // Create demo creator
        await prisma.user.upsert({
            where: { email: 'demo-creator@bmc.com' },
            update: {},
            create: {
                email: 'demo-creator@bmc.com',
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

        // Create demo campaigns
        if (brandUser.brandProfile) {
            await prisma.campaign.upsert({
                where: { id: 'demo-campaign-1' },
                update: {},
                create: {
                    id: 'demo-campaign-1',
                    brandId: brandUser.brandProfile.id,
                    title: 'Summer Sale 2026',
                    description: 'Join our biggest summer sale campaign!',
                    coverImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
                    budget: 50000,
                    status: 'LIVE',
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    minFollowers: 1000,
                    platforms: JSON.stringify(['TikTok', 'Instagram']),
                    categories: JSON.stringify(['Fashion', 'Lifestyle']),
                    rewards: JSON.stringify([{ title: 'Best Video', budget: 5000, type: 'custom' }])
                }
            });

            await prisma.campaign.upsert({
                where: { id: 'demo-campaign-2' },
                update: {},
                create: {
                    id: 'demo-campaign-2',
                    brandId: brandUser.brandProfile.id,
                    title: 'New Year Campaign',
                    description: 'Celebrate the new year with us.',
                    coverImage: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800',
                    budget: 30000,
                    status: 'LIVE',
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                    minFollowers: 5000,
                    platforms: JSON.stringify(['TikTok']),
                    categories: JSON.stringify(['Lifestyle']),
                    rewards: JSON.stringify([{ title: 'Top Views', budget: 3000, type: 'custom' }])
                }
            });
        }

        await prisma.$disconnect();
        res.json({ success: true, message: 'Demo data seeded!' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (_req: Request, res: Response) => {
    res.json({ message: 'BrandMeetCreator API is running 🚀' });
});

// ============================================
// Global Error Handler
// ============================================
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', err.message);
    console.error(err.stack);
    res.status(500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message
    });
});

export default app;
