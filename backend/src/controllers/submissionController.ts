
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z, ZodError } from 'zod';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

// Validation schemas
const submitWorkSchema = z.object({
    campaignId: z.string().uuid(),
    contentUrl: z.string().url(),
    promoLink: z.string().url().optional(), // Affiliate link
    day: z.number().int().optional(), // For challenges
    notes: z.string().optional(),
    platform: z.enum(['TikTok', 'Instagram', 'YouTube']).optional().default('TikTok'),
});

const updateStatusSchema = z.object({
    status: z.enum(['APPROVED', 'REJECTED', 'REVISION_REQUESTED']),
    reason: z.string().optional(),
});

export const submitWork = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // validate input
        const validatedData = submitWorkSchema.parse(req.body);

        // 1. Get Creator Profile
        const creator = await prisma.creatorProfile.findUnique({
            where: { userId },
        });

        if (!creator) {
            res.status(403).json({ error: 'Creator profile not found' });
            return;
        }

        // 2. Check if Creator has applied and is APPROVED
        const application = await prisma.application.findUnique({
            where: {
                campaignId_creatorId: {
                    campaignId: validatedData.campaignId,
                    creatorId: creator.id,
                },
            },
        });

        if (!application || application.status !== 'APPROVED') {
            res.status(403).json({ error: 'You must be an approved creator to submit work for this campaign' });
            return;
        }

        // 3. Check for duplicate link
        const existingSubmission = await prisma.submission.findFirst({
            where: {
                contentUrl: validatedData.contentUrl,
                campaignId: validatedData.campaignId // Scope to campaign as requested ("each campaign")
            }
        });

        if (existingSubmission) {
            res.status(400).json({ error: 'This link has already been submitted for this campaign' });
            return;
        }

        // 4. Create Submission
        const submission = await prisma.submission.create({
            data: {
                campaignId: validatedData.campaignId,
                creatorId: creator.id,
                contentUrl: validatedData.contentUrl,
                promoLink: validatedData.promoLink,
                day: validatedData.day,
                platform: validatedData.platform,
                caption: validatedData.notes, // Mapping notes to caption for now
                status: 'PENDING',
            },
        });

        res.status(201).json(submission);
    } catch (error) {
        console.error('Submit work error:', error);
        if (error instanceof ZodError) {
            res.status(400).json({ error: 'Invalid input', details: (error as any).errors });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

export const getSubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { campaignId, creatorId, status } = req.query;

        const whereClause: any = {};

        if (campaignId) whereClause.campaignId = String(campaignId);
        if (creatorId) whereClause.creatorId = String(creatorId);
        if (status) whereClause.status = String(status);

        // Filter by ownership if necessary (Brand sees their campaign's subs, Creator sees theirs)
        const userId = (req as AuthRequest).user?.userId;
        const userRole = (req as AuthRequest).user?.role;

        if (userRole === 'CREATOR') {
            const creator = await prisma.creatorProfile.findUnique({ where: { userId } });
            if (creator) {
                // ALWAYS restrict to their own submissions using Profile ID
                // Frontend sends User ID, but DB needs Profile ID
                whereClause.creatorId = creator.id;
            } else {
                res.json([]);
                return;
            }
        } else if (userRole === 'BRAND') {
            const brand = await prisma.brandProfile.findUnique({ where: { userId } });
            if (brand) {
                // Brands should see submissions for THEIR campaigns
                const brandCampaigns = await prisma.campaign.findMany({
                    where: { brandId: brand.id },
                    select: { id: true }
                });
                const brandCampaignIds = brandCampaigns.map(c => c.id);

                if (campaignId) {
                    if (!brandCampaignIds.includes(String(campaignId))) {
                        res.status(403).json({ error: 'Access denied' });
                        return;
                    }
                } else {
                    whereClause.campaignId = { in: brandCampaignIds };
                }
            }
        }

        const submissions = await prisma.submission.findMany({
            where: whereClause,
            include: {
                creator: {
                    select: {
                        id: true,
                        displayName: true,
                        avatar: true,
                        tiktokHandle: true,
                        instagramHandle: true,
                        youtubeHandle: true,
                    }
                },
                campaign: {
                    select: {
                        title: true,
                        brandId: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedSubmissions = submissions.map(submission => ({
            ...submission,
            creatorName: submission.creator.displayName,
            creatorAvatar: submission.creator.avatar,
            creatorHandle: submission.creator.tiktokHandle || submission.creator.instagramHandle || submission.creator.youtubeHandle,
            performance: {
                views: submission.views,
                likes: submission.likes,
                shares: submission.shares,
                comments: submission.comments,
                gmv: 0, // Todo: Calculate real GMV from sales tracking
                engagement: submission.views > 0 ? ((submission.likes + submission.comments + submission.shares) / submission.views) * 100 : 0
            }
        }));

        res.json(formattedSubmissions);
    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateSubmissionStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params; // id might be string or undefined
        if (!id) {
            res.status(400).json({ error: 'Missing submission ID' });
            return;
        }

        const { status, reason } = updateStatusSchema.parse(req.body);
        const userId = (req as AuthRequest).user?.userId;
        const userRole = (req as AuthRequest).user?.role;

        // Fetch submission with Campaign to check Brand ownership
        const submission = await prisma.submission.findUnique({
            where: { id: id as string }, // Cast to string
            include: { campaign: true } // Include campaign to access brandId
        });

        if (!submission) {
            res.status(404).json({ error: 'Submission not found' });
            return;
        }

        // Verify Brand ownership
        if (userRole === 'BRAND') {
            const brand = await prisma.brandProfile.findUnique({ where: { userId } });
            // Check if brand exists AND owns the campaign
            if (!brand || brand.id !== submission.campaign.brandId) {
                res.status(403).json({ error: 'Unauthorized' });
                return;
            }
        } else {
            // Only brands can update submission status
            res.status(403).json({ error: 'Permission denied' });
            return;
        }

        const updated = await prisma.submission.update({
            where: { id: id as string },
            data: {
                status,
                reviewNote: reason,
                revisionCount: status === 'REVISION_REQUESTED' ? { increment: 1 } : undefined
            }
        });

        res.json(updated);

    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Invalid input', details: (error as any).errors });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
