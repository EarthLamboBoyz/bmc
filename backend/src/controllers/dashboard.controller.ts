
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getBrandStats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const brand = await prisma.brandProfile.findUnique({ where: { userId } });
        if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });

        // 1. Active Campaigns
        const activeCampaignsCount = await prisma.campaign.count({
            where: {
                brandId: brand.id,
                status: { in: ['LIVE', 'live'] }
            }
        });

        // 2. Total Creators (Unique creators in approved applications)
        // Prisma doesn't support distinct count on related fields easily in one go, 
        // so we can count approved applications or distinct creators.
        // Let's count total approved applications for now as a proxy for "Creators Working"
        const totalCreatorsWorking = await prisma.application.count({
            where: {
                campaign: { brandId: brand.id },
                status: 'APPROVED'
            }
        });

        // 3. Total Budget Spent (Paid Transactions)
        const paidTransactions = await prisma.transaction.aggregate({
            where: {
                brandId: brand.id,
                status: { in: ['PAID', 'CONFIRMED'] }
            },
            _sum: { amount: true }
        });

        // 4. Pending Actions (Applications pending review)
        const pendingApplications = await prisma.application.count({
            where: {
                campaign: { brandId: brand.id },
                status: 'PENDING'
            }
        });

        res.json({
            success: true,
            data: {
                activeCampaigns: activeCampaignsCount,
                totalCreators: totalCreatorsWorking,
                totalSpent: paidTransactions._sum.amount || 0,
                pendingApplications: pendingApplications
            }
        });

    } catch (error) {
        console.error('Get brand stats error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch brand stats' });
    }
};

export const getCreatorStats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const creator = await prisma.creatorProfile.findUnique({ where: { userId } });
        if (!creator) return res.status(404).json({ success: false, message: 'Creator not found' });

        // 1. Total Earnings (Confirmed)
        const totalEarnings = await prisma.transaction.aggregate({
            where: {
                creatorId: creator.id,
                status: 'CONFIRMED'
            },
            _sum: { amount: true }
        });

        // 2. Pending Earnings (Pending/Paid)
        const pendingEarnings = await prisma.transaction.aggregate({
            where: {
                creatorId: creator.id,
                status: { in: ['PENDING', 'PAID'] }
            },
            _sum: { amount: true }
        });

        // 3. Active Campaigns (Approved applications in live campaigns)
        const activeCampaigns = await prisma.application.count({
            where: {
                creatorId: creator.id,
                status: 'APPROVED',
                campaign: { status: { in: ['LIVE', 'live'] } }
            }
        });

        // 4. Total Videos (Submissions)
        const totalVideos = await prisma.submission.count({
            where: {
                creatorId: creator.id
            }
        });

        res.json({
            success: true,
            data: {
                totalEarnings: totalEarnings._sum.amount || 0,
                pendingEarnings: pendingEarnings._sum.amount || 0,
                activeCampaigns: activeCampaigns,
                totalVideos: totalVideos
            }
        });

    } catch (error) {
        console.error('Get creator stats error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch creator stats' });
    }
};
