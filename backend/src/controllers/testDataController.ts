import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';

/**
 * Generate test creators and applications for a campaign
 * POST /api/test/seed-campaign-data
 * 
 * Body: { campaignId: string, creatorCount: number }
 */
export const seedCampaignTestData = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { campaignId, creatorCount = 5 } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Verify user is a BRAND
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { brandProfile: true }
        });

        if (user?.role !== 'BRAND' || !user.brandProfile) {
            res.status(403).json({ error: 'Only brands can seed test data' });
            return;
        }

        // Verify campaign belongs to this brand
        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId }
        });

        if (!campaign) {
            res.status(404).json({ error: 'Campaign not found' });
            return;
        }

        if (campaign.brandId !== user.brandProfile.id) {
            res.status(403).json({ error: 'You do not own this campaign' });
            return;
        }

        const createdCreators: any[] = [];
        const mockHandles = [
            '@beauty_sara', '@skincare_lover', '@makeup_guru', '@fashionista_th',
            '@healthylife_jane', '@tiktok_star', '@influencer_pro', '@content_creator',
            '@viral_videos', '@lifestyle_guru', '@wellness_coach', '@product_reviewer'
        ];

        // Create test creators
        for (let i = 0; i < Math.min(creatorCount, mockHandles.length); i++) {
            const handle = mockHandles[i];
            const email = `test-${Date.now()}-${i}@bmc.test`;
            const name = `Test Creator ${i + 1}`;
            
            // Create user
            const passwordHash = await bcrypt.hash('123456', 10);
            const creatorUser = await prisma.user.create({
                data: {
                    email,
                    passwordHash,
                    role: 'CREATOR'
                }
            });

            // Create creator profile
            const creatorProfile = await prisma.creatorProfile.create({
                data: {
                    userId: creatorUser.id,
                    displayName: name,
                    tiktokHandle: handle,
                    followersCount: Math.floor(Math.random() * 50000) + 10000,
                    categories: JSON.stringify(['beauty', 'lifestyle'])
                }
            });

            // Create approved application (use creatorProfile.id, not user.id)
            const application = await prisma.application.create({
                data: {
                    campaignId,
                    creatorId: creatorProfile.id,
                    status: 'APPROVED',
                    message: 'Test application'
                }
            });

            // Create some submissions (random 5-20 videos)
            const submissionCount = Math.floor(Math.random() * 15) + 5;
            for (let j = 0; j < submissionCount; j++) {
                await prisma.submission.create({
                    data: {
                        campaignId,
                        creatorId: creatorProfile.id,
                        contentUrl: `https://tiktok.com/@${handle}/video/${Date.now()}-${j}`,
                        promoLink: 'https://shop.tiktok.com/product/123',
                        platform: 'tiktok',
                        status: 'APPROVED'
                    }
                });
            }

            createdCreators.push({
                id: creatorUser.id,
                name: name,
                handle,
                email,
                submissions: submissionCount
            });
        }

        res.json({
            message: `Created ${createdCreators.length} test creators with applications and submissions`,
            creators: createdCreators,
            campaignId
        });
    } catch (error: any) {
        console.error('Error seeding test data:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get sample CSV content for testing GMV upload
 * GET /api/test/sample-csv/:campaignId
 */
export const getSampleCSV = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const campaignId = String(req.params.campaignId);

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Get approved creators for this campaign
        const applications = await prisma.application.findMany({
            where: {
                campaignId: campaignId,
                status: 'APPROVED'
            }
        });

        if (applications.length === 0) {
            res.status(400).json({ 
                error: 'No approved creators found',
                message: 'Please seed test data first or have approved creators'
            });
            return;
        }

        // Get creator profiles separately
        const creatorIds = applications.map(app => app.creatorId);
        const profiles = await prisma.creatorProfile.findMany({
            where: { userId: { in: creatorIds } }
        });

        const profileMap = new Map(profiles.map(p => [p.userId, p]));

        // Generate sample GMV data
        const today = new Date().toISOString().split('T')[0];
        let csvContent = 'creator_id,creator_name,gmv,orders,last_updated\n';

        applications.forEach((app, index) => {
            const gmv = Math.floor(Math.random() * 500000) + 50000; // 50K - 550K
            const orders = Math.floor(Math.random() * 1000) + 100; // 100 - 1100
            const profile = profileMap.get(app.creatorId);
            const handle = profile?.tiktokHandle || `@creator_${index}`;
            
            csvContent += `${app.creatorId},${handle},${gmv},${orders},${today}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=sample_gmv_${campaignId}.csv`);
        res.send(csvContent);
    } catch (error: any) {
        console.error('Error generating sample CSV:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Clear test data for a campaign
 * DELETE /api/test/clear-campaign-data/:campaignId
 */
export const clearCampaignTestData = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const campaignId = String(req.params.campaignId);

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Verify ownership
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { brandProfile: true }
        });

        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId }
        });

        if (!campaign || campaign.brandId !== user?.brandProfile?.id) {
            res.status(403).json({ error: 'Access denied' });
            return;
        }

        // Get test users (those with @bmc.test email)
        const testUsers = await prisma.user.findMany({
            where: {
                email: {
                    endsWith: '@bmc.test'
                }
            }
        });

        const testUserIds = testUsers.map(u => u.id);

        // Get creator profiles for these users
        const testProfiles = await prisma.creatorProfile.findMany({
            where: {
                userId: { in: testUserIds }
            }
        });

        const testProfileIds = testProfiles.map(p => p.id);

        // Delete submissions (use creatorProfile.id)
        await prisma.submission.deleteMany({
            where: {
                campaignId: campaignId,
                creatorId: { in: testProfileIds }
            }
        });

        // Delete applications (use creatorProfile.id)
        await prisma.application.deleteMany({
            where: {
                campaignId: campaignId,
                creatorId: { in: testProfileIds }
            }
        });

        // Delete creator campaign stats (use creatorProfile.id)
        await prisma.creatorCampaignStats.deleteMany({
            where: {
                campaignId: campaignId,
                creatorId: { in: testProfileIds }
            }
        });

        // Delete creator profiles and users
        for (const uid of testUserIds) {
            await prisma.creatorProfile.deleteMany({
                where: { userId: uid }
            });
            await prisma.user.deleteMany({
                where: { id: uid }
            });
        }

        res.json({
            message: `Cleared ${testUserIds.length} test creators and their data`,
            deletedCount: testUserIds.length
        });
    } catch (error: any) {
        console.error('Error clearing test data:', error);
        res.status(500).json({ error: error.message });
    }
};
