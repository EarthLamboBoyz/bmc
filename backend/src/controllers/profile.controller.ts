import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Get Brand Public Profile
export const getBrandProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Brand Profile ID (not User ID)

        if (!id || typeof id !== 'string') {
            return res.status(400).json({ success: false, message: 'Invalid ID' });
        }

        // Find brand profile
        const brand = await prisma.brandProfile.findUnique({
            where: { id },
        });

        if (!brand) {
            return res.status(404).json({ success: false, message: 'Brand not found' });
        }

        // Get active campaigns for this brand (visible to public)
        const activeCampaigns = await prisma.campaign.findMany({
            where: {
                brandId: id,
                status: { in: ['LIVE', 'live'] }, // Only show LIVE campaigns
            },
            select: {
                id: true,
                title: true,
                coverImage: true,
                budget: true,
                type: true,
                platforms: true,
                categories: true,
                endDate: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        // Get stats (optional)
        const totalCampaigns = await prisma.campaign.count({ where: { brandId: id } });

        res.json({
            success: true,
            data: {
                ...brand,
                stats: {
                    totalCampaigns
                },
                activeCampaigns
            }
        });
    } catch (error) {
        console.error('Get Brand Profile Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch brand profile' });
    }
};

// Get Creator Public Profile
export const getCreatorProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Creator Profile ID

        if (!id || typeof id !== 'string') {
            return res.status(400).json({ success: false, message: 'Invalid ID' });
        }

        // Find creator profile
        const creator = await prisma.creatorProfile.findUnique({
            where: { id },
        });

        if (!creator) {
            return res.status(404).json({ success: false, message: 'Creator not found' });
        }

        // Get Portfolio (Approved Submissions)
        // We only want to show high quality work that has been approved
        const portfolio = await prisma.submission.findMany({
            where: {
                creatorId: id,
                status: 'APPROVED',
            },
            select: {
                id: true,
                contentUrl: true,
                platform: true,
                views: true,
                likes: true,
                createdAt: true,
                campaign: {
                    select: {
                        title: true,
                        brand: {
                            select: {
                                companyName: true,
                                logo: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 9 // Limit to top 9 recent works
        });

        // Calculate Stats
        const totalApproved = await prisma.submission.count({
            where: { creatorId: id, status: 'APPROVED' }
        });

        // Approximate total views from approved submissions
        const totalViews = await prisma.submission.aggregate({
            where: { creatorId: id, status: 'APPROVED' },
            _sum: { views: true }
        });

        res.json({
            success: true,
            data: {
                ...creator,
                stats: {
                    totalApprovedWork: totalApproved,
                    totalViews: totalViews._sum?.views || 0,
                    engagementRate: 'N/A' // Placeholder for now
                },
                portfolio
            }
        });

    } catch (error) {
        console.error('Get Creator Profile Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch creator profile' });
    }
};
