import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { rewardCalculationService } from '../services/rewardCalculation.service';
import prisma from '../utils/prisma';

/**
 * Calculate rewards for a campaign
 * POST /api/campaigns/:id/calculate-rewards
 */
export const calculateRewards = async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('📌 calculateRewards called, params:', req.params);
    try {
        const userId = req.user?.userId;
        const campaignId = String(req.params.campaignId || req.params.id);
        console.log('📌 campaignId:', campaignId, 'userId:', userId);

        // Debug: List all campaigns
        const allCampaigns = await prisma.campaign.findMany({ select: { id: true, title: true } });
        console.log('📌 Available campaigns:', allCampaigns.map(c => c.id));

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
            res.status(403).json({ error: 'Only brands can calculate rewards' });
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

        // Calculate rewards
        const results = await rewardCalculationService.calculateRewards(campaignId);

        // Calculate totals
        const totalWinners = results.reduce((sum, r) => sum + r.winners.length, 0);
        const totalAmount = results.reduce((sum, r) => sum + r.totalAmount, 0);

        res.json({
            campaignId,
            calculatedAt: new Date().toISOString(),
            summary: {
                totalWinners,
                totalAmount,
                rewardTypes: results.length
            },
            results
        });
    } catch (error: any) {
        console.error('Error calculating rewards:', error);
        res.status(500).json({ error: error.message || 'Unknown error', stack: error.stack });
    }
};

/**
 * Get reward winners preview (without calculating)
 * GET /api/campaigns/:id/reward-preview
 */
export const getRewardPreview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const campaignId = String(req.params.campaignId || req.params.id);

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Verify access
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { brandProfile: true }
        });

        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId }
        });

        if (!campaign) {
            res.status(404).json({ error: 'Campaign not found' });
            return;
        }

        // Brand can only see their own campaign
        if (user?.role === 'BRAND' && campaign.brandId !== user.brandProfile?.id) {
            res.status(403).json({ error: 'Access denied' });
            return;
        }

        // Calculate preview
        const results = await rewardCalculationService.calculateRewards(campaignId);

        res.json({
            campaignId,
            preview: true,
            results
        });
    } catch (error: any) {
        console.error('Error getting reward preview:', error);
        res.status(500).json({ error: error.message });
    }
};
