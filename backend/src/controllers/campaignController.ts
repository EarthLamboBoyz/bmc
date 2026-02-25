import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../utils/prisma';
import { rewardService } from '../services/reward.service';

// Helper to safe parse JSON
const safeParse = (jsonString: any, fallback: any) => {
    if (!jsonString) return fallback;
    if (typeof jsonString === 'object') return jsonString;
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        return fallback;
    }
};

export const createCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const brandId = req.user?.userId; // Assumes user is authenticated and is a brand (middleware check recommended)

        if (!brandId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Verify user is a BRAND
        const user = await prisma.user.findUnique({
            where: { id: brandId },
            include: { brandProfile: true }
        });

        if (user?.role !== 'BRAND' || !user.brandProfile) {
            res.status(403).json({ error: 'Only brands can create campaigns' });
            return;
        }

        const {
            title,
            description,
            coverImage,
            budget,
            startDate,
            endDate,
            announceDate,
            minFollowers,
            platforms,
            categories,
            rewards,
            contentGuidelines,
            hasSamples,
            sampleInfo
        } = req.body;

        // Create campaign
        const campaign = await prisma.campaign.create({
            data: {
                brandId: user.brandProfile.id,
                title,
                description,
                coverImage,
                budget: parseFloat(budget),
                type: req.body.type || 'single', // Default to single
                status: req.body.status || 'LIVE', // Default to LIVE for MVP
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                announceDate: announceDate ? new Date(announceDate) : null,
                minFollowers: minFollowers || 0,
                // Serialize JSON fields
                platforms: JSON.stringify(platforms || []),
                categories: JSON.stringify(categories || []),
                rewards: JSON.stringify(rewards || []),
                contentGuidelines: JSON.stringify(contentGuidelines || {}),
                hasSamples: hasSamples || false,
                sampleInfo: JSON.stringify(sampleInfo || {})
            }
        });

        res.status(201).json(campaign);
    } catch (error: any) {
        console.error('Error creating campaign:', error);
        res.status(500).json({ error: 'Failed to create campaign', details: error.message });
    }
};

export const updateCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const campaignId = req.params.id as string;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Verify user is a BRAND and owns this campaign
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { brandProfile: true }
        });

        if (user?.role !== 'BRAND' || !user.brandProfile) {
            res.status(403).json({ error: 'Only brands can update campaigns' });
            return;
        }

        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId }
        });

        if (!campaign) {
            res.status(404).json({ error: 'Campaign not found' });
            return;
        }

        if (campaign.brandId !== user.brandProfile.id) {
            res.status(403).json({ error: 'You can only update your own campaigns' });
            return;
        }

        const {
            title, description, coverImage, budget,
            startDate, endDate, announceDate, minFollowers,
            platforms, categories, rewards,
            contentGuidelines, hasSamples, sampleInfo, status
        } = req.body;

        const updated = await prisma.campaign.update({
            where: { id: campaignId },
            data: {
                ...(title && { title }),
                ...(description && { description }),
                ...(coverImage && { coverImage }),
                ...(budget && { budget: parseFloat(budget) }),
                ...(status && { status }),
                ...(startDate && { startDate: new Date(startDate) }),
                ...(endDate && { endDate: new Date(endDate) }),
                ...(announceDate !== undefined && { announceDate: announceDate ? new Date(announceDate) : null }),
                ...(minFollowers !== undefined && { minFollowers }),
                ...(platforms && { platforms: JSON.stringify(platforms) }),
                ...(categories && { categories: JSON.stringify(categories) }),
                ...(rewards && { rewards: JSON.stringify(rewards) }),
                ...(contentGuidelines && { contentGuidelines: JSON.stringify(contentGuidelines) }),
                ...(hasSamples !== undefined && { hasSamples }),
                ...(sampleInfo && { sampleInfo: JSON.stringify(sampleInfo) }),
            }
        });

        res.json(updated);
    } catch (error: any) {
        console.error('Error updating campaign:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getCampaigns = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { brandId, owner } = req.query;

        const whereClause: any = {};

        // Filter by specific brand ID
        if (brandId) {
            whereClause.brandId = String(brandId);
        }

        // Filter by owner (current user's brand profile)
        if (owner === 'true') {
            const userId = req.user?.userId;
            if (userId) {
                const userBrand = await prisma.brandProfile.findUnique({
                    where: { userId }
                });

                if (userBrand) {
                    whereClause.brandId = userBrand.id;
                } else {
                    // User has no brand profile, so they own no campaigns
                    res.json([]);
                    return;
                }
            }
        } else {
            // If not viewing own campaigns, only show LIVE campaigns
            whereClause.status = { in: ['LIVE', 'live'] };
        }

        const campaigns = await prisma.campaign.findMany({
            where: whereClause,
            include: {
                brand: {
                    select: { companyName: true, logo: true }
                },
                _count: {
                    select: { applications: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Parse JSON fields for frontend
        const parsedCampaigns = campaigns.map(c => ({
            ...c,
            image: c.coverImage,
            brandName: c.brand?.companyName || 'Unknown Brand',
            brandLogo: c.brand?.logo,
            currentCreators: (c as any)._count?.applications || 0,
            platforms: safeParse(c.platforms, []),
            categories: safeParse(c.categories, []),
            rewards: safeParse(c.rewards, []),
            contentGuidelines: safeParse(c.contentGuidelines, {}),
            sampleInfo: safeParse(c.sampleInfo, {})
        }));

        res.json(parsedCampaigns);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getCampaignById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const campaign = await prisma.campaign.findUnique({
            where: { id: id as string },
            include: {
                brand: {
                    select: { companyName: true, logo: true, id: true }
                },
                _count: {
                    select: { applications: true }
                }
            }
        });

        if (!campaign) {
            res.status(404).json({ error: 'Campaign not found' });
            return;
        }

        // Check visibility
        if (!['LIVE', 'live'].includes(campaign.status)) {
            const userId = req.user?.userId;
            const userBrand = userId ? await prisma.brandProfile.findUnique({ where: { userId } }) : null;

            // If not the owner of this campaign, deny access
            if (!userBrand || userBrand.id !== campaign.brandId) {
                res.status(404).json({ error: 'Campaign not found' }); // Hide existence
                return;
            }
        }



        // Parse JSON
        const parsedCampaign = {
            ...campaign,
            image: campaign.coverImage,
            brandName: campaign.brand?.companyName || 'Unknown Brand',
            brandLogo: campaign.brand?.logo,
            currentCreators: (campaign as any)._count?.applications || 0,
            platforms: safeParse(campaign.platforms, []),
            categories: safeParse(campaign.categories, []),
            rewards: safeParse(campaign.rewards, []),
            contentGuidelines: safeParse(campaign.contentGuidelines, {}),
            sampleInfo: safeParse(campaign.sampleInfo, {})
        };

        res.json(parsedCampaign);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
export const endCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const campaignId = String(id);
        const brandId = req.user?.userId;

        if (!brandId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const userBrand = await prisma.brandProfile.findUnique({ where: { userId: brandId } });
        if (!userBrand) {
            res.status(403).json({ error: 'Brand profile not found' });
            return;
        }

        const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
        if (!campaign) {
            res.status(404).json({ error: 'Campaign not found' });
            return;
        }

        if (campaign.brandId !== userBrand.id) {
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }

        if (['completed', 'COMPLETED'].includes(campaign.status)) {
            res.status(400).json({ error: 'Campaign already completed' });
            return;
        }

        // Logic to calculate winners and create transactions
        // For MVP, we will simplify: 
        // 1. Fetch all approved submissions
        // 2. Parse rewards config
        // 3. Allocate budget based on config (Mock logic for complex tiers, but simpler for straightforward rewards)

        // Fetch approved submissions with Creator Profile
        const submissions = await prisma.submission.findMany({
            where: { campaignId: campaignId, status: 'APPROVED' },
            include: { creator: true }
        });

        const rewards = safeParse(campaign.rewards, []);
        const transactionsCreated: any[] = [];

        await prisma.$transaction(async (tx) => {
            await tx.campaign.update({
                where: { id: campaignId },
                data: { status: 'COMPLETED' }
            });

            // 2. Distribute Rewards using Service
            await rewardService.distributeRewards(campaignId);
        });

        res.json({ message: 'Campaign ended successfully and rewards distributed.' });

    } catch (error: any) {
        console.error("End campaign error", error);
        res.status(500).json({ error: error.message });
    }
};
