import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../utils/prisma';

/**
 * Get all campaigns for logged-in creator with their stats
 * GET /api/creator/campaigns
 */
export const getMyCampaigns = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Get creator profile
        const creator = await prisma.creatorProfile.findFirst({
            where: { userId }
        });

        if (!creator) {
            res.status(404).json({ error: 'Creator profile not found' });
            return;
        }

        // Get all approved applications for this creator
        const applications = await prisma.application.findMany({
            where: {
                creatorId: creator.id,
                status: 'APPROVED'
            },
            include: {
                campaign: {
                    include: {
                        brand: {
                            select: {
                                companyName: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Get stats for each campaign
        const campaignsWithStats = await Promise.all(
            applications.map(async (app) => {
                const campaign = app.campaign;

                // Get creator stats for this campaign
                const stats = await prisma.creatorCampaignStats.findUnique({
                    where: {
                        campaignId_creatorId: {
                            campaignId: campaign.id,
                            creatorId: creator.id
                        }
                    }
                });

                // Get submissions count
                const submissions = await prisma.submission.findMany({
                    where: {
                        campaignId: campaign.id,
                        creatorId: creator.id
                    }
                });

                const approvedSubmissions = submissions.filter(s => s.status === 'APPROVED');
                const submittedToday = submissions.some(s => {
                    const today = new Date();
                    const submitted = new Date(s.createdAt);
                    return today.toDateString() === submitted.toDateString();
                });

                // Calculate days remaining
                const endDate = new Date(campaign.endDate);
                const today = new Date();
                const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

                // Calculate progress (assuming 30 days campaign for demo)
                const startDate = new Date(campaign.startDate);
                const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                const daysPassed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                const progress = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));

                return {
                    id: campaign.id,
                    title: campaign.title,
                    brandName: campaign.brand?.companyName || 'Unknown Brand',
                    image: campaign.coverImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(campaign.title.charAt(0))}&background=random&color=fff&size=800&font-size=0.33`,
                    status: campaign.status === 'ACTIVE' ? 'active' :
                        campaign.status === 'COMPLETED' ? 'completed' : 'pending',
                    progress: {
                        current: Math.min(daysPassed, totalDays),
                        total: totalDays
                    },
                    streak: {
                        current: stats?.currentStreak || 0,
                        longest: stats?.longestStreak || 0
                    },
                    videos: {
                        submitted: submissions.length,
                        approved: approvedSubmissions.length
                    },
                    earnings: {
                        current: 0, // Will be calculated from rewards
                        potential: campaign.budget
                    },
                    daysRemaining,
                    deadline: campaign.endDate.toISOString().split('T')[0],
                    submittedToday,
                    submittedAt: submittedToday ? '14:30' : undefined,
                    hoursRemaining: submittedToday ? undefined : 12,
                    minutesRemaining: submittedToday ? undefined : 0
                };
            })
        );

        res.json({
            campaigns: campaignsWithStats
        });
    } catch (error: any) {
        console.error('Error getting creator campaigns:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get single campaign details for creator
 * GET /api/creator/campaigns/:id
 */
export const getMyCampaignDetail = async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('📌 getMyCampaignDetail called, params:', req.params);
    try {
        const userId = req.user?.userId;
        const campaignId = String(req.params.id);
        console.log('📌 userId:', userId, 'campaignId:', campaignId);

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Get creator profile
        const creator = await prisma.creatorProfile.findFirst({
            where: { userId }
        });

        if (!creator) {
            res.status(404).json({ error: 'Creator profile not found' });
            return;
        }

        // Check if creator is approved for this campaign
        const application = await prisma.application.findUnique({
            where: {
                campaignId_creatorId: {
                    campaignId: campaignId,
                    creatorId: creator.id
                }
            }
        });

        if (!application || application.status !== 'APPROVED') {
            res.status(403).json({ error: 'You are not approved for this campaign' });
            return;
        }

        // Get campaign details with brand
        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId },
            include: {
                brand: {
                    select: {
                        companyName: true
                    }
                }
            }
        });

        if (!campaign) {
            res.status(404).json({ error: 'Campaign not found' });
            return;
        }

        // Get creator stats
        const stats = await prisma.creatorCampaignStats.findUnique({
            where: {
                campaignId_creatorId: {
                    campaignId: campaignId,
                    creatorId: creator.id
                }
            }
        });

        // Get all submissions
        const submissions = await prisma.submission.findMany({
            where: {
                campaignId: campaignId,
                creatorId: creator.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Get leaderboard position
        const allStats = await prisma.creatorCampaignStats.findMany({
            where: { campaignId },
            orderBy: { gmv: 'desc' }
        });

        const gmvRank = allStats.findIndex(s => s.creatorId === creator.id) + 1;

        const allStatsByVolume = await prisma.creatorCampaignStats.findMany({
            where: { campaignId },
            orderBy: { approvedSubmissions: 'desc' }
        });

        const volumeRank = allStatsByVolume.findIndex(s => s.creatorId === creator.id) + 1;

        res.json({
            id: campaign.id,
            title: campaign.title,
            description: campaign.description,
            brandName: campaign.brand?.companyName,
            image: campaign.coverImage,
            status: campaign.status,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            budget: campaign.budget,
            rewards: JSON.parse(campaign.rewards || '[]'),
            stats: {
                gmv: stats?.gmv || 0,
                orders: stats?.orders || 0,
                videos: stats?.approvedSubmissions || 0,
                streak: stats?.currentStreak || 0,
                gmvRank,
                volumeRank,
                totalCreators: allStats.length
            },
            submissions: submissions.map(s => ({
                id: s.id,
                contentUrl: s.contentUrl,
                caption: s.caption,
                status: s.status,
                platform: s.platform,
                day: s.day,
                createdAt: s.createdAt
            }))
        });
    } catch (error: any) {
        console.error('Error getting campaign detail:', error);
        res.status(500).json({ error: error.message });
    }
};
