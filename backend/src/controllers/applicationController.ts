
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../utils/prisma';

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

// ==========================================
// Creator Actions
// ==========================================

export const applyToCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { campaignId, message } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Check if user is a Creator
        const creator = await prisma.creatorProfile.findUnique({
            where: { userId }
        });

        if (!creator) {
            res.status(403).json({ error: 'Only creators can apply to campaigns' });
            return;
        }

        // Check if campaign exists
        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId }
        });

        if (!campaign) {
            res.status(404).json({ error: 'Campaign not found' });
            return;
        }

        // Check if already applied
        const existingApplication = await prisma.application.findUnique({
            where: {
                campaignId_creatorId: {
                    campaignId,
                    creatorId: creator.id
                }
            }
        });

        if (existingApplication) {
            res.status(400).json({ error: 'You have already applied to this campaign' });
            return;
        }

        // Create Application
        const application = await prisma.application.create({
            data: {
                campaignId,
                creatorId: creator.id,
                message: message || '',
                status: 'PENDING'
            }
        });

        res.status(201).json(application);

    } catch (error: any) {
        console.error('Error applying to campaign:', error);
        res.status(500).json({ error: 'Failed to apply to campaign' });
    }
};

export const getMyApplications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const creator = await prisma.creatorProfile.findUnique({
            where: { userId }
        });

        if (!creator) {
            res.status(403).json({ error: 'Only creators can view their applications' });
            return;
        }

        const applications = await prisma.application.findMany({
            where: { creatorId: creator.id },
            include: {
                campaign: {
                    include: {
                        brand: {
                            select: { companyName: true, logo: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Format response
        const formattedApplications = applications.map(app => ({
            ...app,
            campaign: {
                ...app.campaign,
                image: app.campaign.coverImage,
                brandName: app.campaign.brand?.companyName,
                brandLogo: app.campaign.brand?.logo,
                rewards: safeParse(app.campaign.rewards, [])
            }
        }));

        res.json(formattedApplications);

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// Brand Actions
// ==========================================

export const getCampaignApplications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { campaignId } = req.params as { campaignId: string };

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Verify Brand owns the campaign
        const brand = await prisma.brandProfile.findUnique({
            where: { userId }
        });

        if (!brand) {
            res.status(403).json({ error: 'Only brands can view applications' });
            return;
        }

        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId }
        });

        if (!campaign || campaign.brandId !== brand.id) {
            res.status(403).json({ error: 'You do not have permission to view this campaign' });
            return;
        }

        // Get applications
        const applications = await prisma.application.findMany({
            where: { campaignId },
            include: {
                creator: {
                    include: {
                        user: {
                            select: { email: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Parse creator JSON fields
        const formattedApplications = applications.map(app => ({
            ...app,
            creator: {
                ...app.creator,
                categories: safeParse(app.creator.categories, []),
                address: safeParse(app.creator.address, {})
            }
        }));

        res.json(formattedApplications);

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params as { id: string };
        const { status } = req.body; // APPROVED, REJECTED

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Validate status
        if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
            res.status(400).json({ error: 'Invalid status' });
            return;
        }

        // Find application and check brand ownership via campaign
        const application = await prisma.application.findUnique({
            where: { id },
            include: {
                campaign: true
            }
        });

        if (!application) {
            res.status(404).json({ error: 'Application not found' });
            return;
        }

        // Check if user is the brand owner of the campaign
        const brand = await prisma.brandProfile.findUnique({
            where: { userId }
        });

        if (!brand || brand.id !== application.campaign.brandId) {
            res.status(403).json({ error: 'You do not have permission to update this application' });
            return;
        }

        // Update status
        const updatedApplication = await prisma.application.update({
            where: { id },
            data: { status }
        });

        res.json(updatedApplication);

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
