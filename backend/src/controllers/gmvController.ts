import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../utils/prisma';
import { gmvService } from '../services/gmv.service';

/**
 * Upload GMV CSV file
 * POST /api/gmv/upload
 */
export const uploadGMV = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { campaignId } = req.body;
        const file = req.file;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!campaignId) {
            res.status(400).json({ error: 'Campaign ID is required' });
            return;
        }

        if (!file) {
            res.status(400).json({ error: 'CSV file is required' });
            return;
        }

        // Verify user is a BRAND
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { brandProfile: true }
        });

        if (user?.role !== 'BRAND' || !user.brandProfile) {
            res.status(403).json({ error: 'Only brands can upload GMV data' });
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

        // Process the CSV file
        const result = await gmvService.processCSV(
            campaignId,
            userId,
            file.buffer,
            file.originalname
        );

        res.status(200).json({
            message: 'GMV data uploaded and processed successfully',
            data: result
        });
    } catch (error: any) {
        console.error('Error uploading GMV:', error);
        res.status(500).json({
            error: 'Failed to process GMV upload',
            details: error.message
        });
    }
};

/**
 * Get GMV upload history for a campaign
 * GET /api/gmv/campaign/:campaignId
 */
export const getGMVUploads = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const campaignId = String(req.params.campaignId);

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Verify user has access to this campaign
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { brandProfile: true }
        });

        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId }
        });

        if (!campaign) {
            res.status(404).json({ error: 'Campaign not found' });
            return;
        }

        // Brand can only see their own campaign's uploads
        if (user.role === 'BRAND') {
            if (!user.brandProfile || campaign.brandId !== user.brandProfile.id) {
                res.status(403).json({ error: 'Access denied' });
                return;
            }
        }

        // Creator can see uploads for campaigns they're in
        if (user.role === 'CREATOR') {
            const application = await prisma.application.findFirst({
                where: {
                    campaignId: campaignId,
                    creatorId: userId,
                    status: 'APPROVED'
                }
            });

            if (!application) {
                res.status(403).json({ error: 'Access denied' });
                return;
            }
        }

        const uploads = await prisma.gmvUpload.findMany({
            where: { campaignId: campaignId },
            orderBy: { uploadedAt: 'desc' }
        });

        res.json(uploads);
    } catch (error: any) {
        console.error('Error fetching GMV uploads:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get campaign leaderboard
 * GET /api/gmv/leaderboard/:campaignId
 */
export const getLeaderboard = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const campaignId = String(req.params.campaignId);
        const sortBy = String(req.query.sortBy || 'gmv');

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Verify campaign exists
        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId },
            include: {
                brand: {
                    select: { companyName: true, logo: true }
                }
            }
        });

        if (!campaign) {
            res.status(404).json({ error: 'Campaign not found' });
            return;
        }

        // Get creator stats for this campaign
        const stats = await prisma.creatorCampaignStats.findMany({
            where: { campaignId: campaignId }
        });

        // Get creator details - creatorId in stats is CreatorProfile.id, not User.id
        const creatorIds = stats.map(s => s.creatorId);
        const creatorProfiles = await prisma.creatorProfile.findMany({
            where: { id: { in: creatorIds } },
            include: { user: { select: { id: true, email: true } } }
        });

        const creatorMap = new Map(creatorProfiles.map(c => [c.id, c]));

        // Count approved submissions per creator for this campaign
        const submissionCounts = await prisma.submission.groupBy({
            by: ['creatorId'],
            where: {
                campaignId: campaignId,
                creatorId: { in: creatorIds },
                status: 'APPROVED'
            },
            _count: { id: true }
        });
        const submissionCountMap = new Map(submissionCounts.map(s => [s.creatorId, s._count.id]));

        // Count total submissions (all statuses) per creator
        const totalSubmissionCounts = await prisma.submission.groupBy({
            by: ['creatorId'],
            where: {
                campaignId: campaignId,
                creatorId: { in: creatorIds }
            },
            _count: { id: true }
        });
        const totalSubmissionCountMap = new Map(totalSubmissionCounts.map(s => [s.creatorId, s._count.id]));

        // Calculate ranks and format response
        const leaderboard = stats.map((stat) => {
            const profile = creatorMap.get(stat.creatorId);

            // Convert BigInt to Number for calculations
            const totalViews = Number(stat.totalViews || 0);
            const totalLikes = Number(stat.totalLikes || 0);
            const totalComments = Number(stat.totalComments || 0);
            const totalShares = Number(stat.totalShares || 0);

            // Get real submission counts from DB
            const approvedVideos = submissionCountMap.get(stat.creatorId) || 0;
            const totalVideos = totalSubmissionCountMap.get(stat.creatorId) || 0;

            return {
                rank: 0, // Will be assigned after sorting
                creatorId: stat.creatorId,
                creatorName: profile?.displayName || 'Unknown',
                creatorAvatar: profile?.avatar || null,
                tiktokHandle: profile?.tiktokHandle || null,
                followers: profile?.followersCount || 0,
                totalSubmissions: totalVideos,
                approvedSubmissions: approvedVideos,
                currentStreak: stat.currentStreak,
                longestStreak: stat.longestStreak,
                gmv: stat.gmv || 0,
                orders: stat.orders || 0,
                totalViews: totalViews,
                totalLikes: totalLikes,
                totalComments: totalComments,
                totalShares: totalShares,
                engagementRate: totalViews > 0
                    ? ((totalLikes + totalComments + totalShares) / totalViews * 100).toFixed(2)
                    : '0.00'
            };
        });

        // Sort based on query param
        if (sortBy === 'gmv') {
            leaderboard.sort((a, b) => b.gmv - a.gmv);
        } else if (sortBy === 'videos') {
            leaderboard.sort((a, b) => b.approvedSubmissions - a.approvedSubmissions);
        } else if (sortBy === 'streak') {
            leaderboard.sort((a, b) => b.longestStreak - a.longestStreak);
        }

        // Re-assign ranks after sorting
        leaderboard.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        // Get brand name from relation
        const brandProfile = await prisma.brandProfile.findUnique({
            where: { id: campaign.brandId },
            select: { companyName: true }
        });

        res.json({
            campaign: {
                id: campaign.id,
                title: campaign.title,
                brandName: brandProfile?.companyName || 'Unknown Brand',
                status: campaign.status
            },
            leaderboard,
            totalCreators: leaderboard.length,
            totalGMV: leaderboard.reduce((sum, e) => sum + e.gmv, 0),
            totalOrders: leaderboard.reduce((sum, e) => sum + e.orders, 0),
            lastUpdated: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Download GMV template CSV
 * GET /api/gmv/template
 */
export const getTemplate = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (user?.role !== 'BRAND') {
            res.status(403).json({ error: 'Only brands can download templates' });
            return;
        }

        // Generate CSV template
        const template = `creator_id,creator_name,gmv,orders,last_updated
user-uuid-1,@creator_handle_1,450000,1200,${new Date().toISOString().split('T')[0]}
user-uuid-2,@creator_handle_2,380000,980,${new Date().toISOString().split('T')[0]}
user-uuid-3,@creator_handle_3,250000,650,${new Date().toISOString().split('T')[0]}`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=gmv_template.csv');
        res.send(template);
    } catch (error: any) {
        console.error('Error generating template:', error);
        res.status(500).json({ error: error.message });
    }
};
