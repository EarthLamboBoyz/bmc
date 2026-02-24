import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// Creator Payment Controllers
// ============================================

export const updatePaymentSettings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { paymentMethod, promptpayId, bankName, bankAccountNo, bankAccountName } = req.body;

        const creator = await prisma.creatorProfile.findUnique({
            where: { userId }
        });

        if (!creator) {
            return res.status(404).json({ success: false, message: 'Creator profile not found' });
        }

        const updatedProfile = await prisma.creatorProfile.update({
            where: { id: creator.id },
            data: {
                paymentMethod,
                promptpayId,
                bankName,
                bankAccountNo,
                bankAccountName
            }
        });

        res.json({
            success: true,
            message: 'Payment settings updated successfully',
            data: updatedProfile
        });
    } catch (error) {
        console.error('Update payment settings error:', error);
        res.status(500).json({ success: false, message: 'Failed to update payment settings' });
    }
};

export const getCreatorPendingPayments = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const creator = await prisma.creatorProfile.findUnique({ where: { userId } });

        if (!creator) {
            return res.status(404).json({ success: false, message: 'Creator profile not found' });
        }

        const transactions = await prisma.transaction.findMany({
            where: {
                creatorId: creator.id,
                status: {
                    in: ['PENDING', 'PAID', 'CONFIRMED'] // Include CONFIRMED for history
                }
            },
            include: {
                brand: {
                    select: { companyName: true, logo: true }
                },
                campaign: {
                    select: { title: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Transform to frontend format if needed
        const formattedTransactions = transactions.map(t => ({
            id: t.id,
            brandName: t.brand.companyName,
            campaignName: t.campaign?.title || 'N/A',
            amount: t.amount,
            transferDate: t.transferDate || t.updatedAt,
            slipImageUrl: t.proofImageUrl,
            brandNote: t.brandNote,
            status: t.status
        }));

        res.json({
            success: true,
            data: formattedTransactions
        });
    } catch (error) {
        console.error('Get creator payments error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch pending payments' });
    }
};

export const confirmTransaction = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { confirmed, note } = req.body; // confirmed: boolean

        const transaction = await prisma.transaction.findUnique({
            where: { id }
        });

        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        const updatedTransaction = await prisma.transaction.update({
            where: { id },
            data: {
                status: confirmed ? 'CONFIRMED' : 'DISPUTED',
                creatorNote: note
            }
        });

        res.json({
            success: true,
            message: confirmed ? 'Payment confirmed' : 'Payment disputed',
            data: updatedTransaction
        });
    } catch (error) {
        console.error('Confirm transaction error:', error);
        res.status(500).json({ success: false, message: 'Failed to confirm transaction' });
    }
};

// ============================================
// Brand Payment Controllers
// ============================================

export const getBrandPendingPayments = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        if (!user || !user.userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const userId = user.userId;

        const brand = await prisma.brandProfile.findUnique({ where: { userId } });

        if (!brand) {
            return res.status(404).json({ success: false, message: 'Brand profile not found' });
        }

        // Find transactions that are PENDING (waiting for payment) or PAID (waiting for confirmation)
        // Or maybe just PENDING? Brand usually cares about what they need to pay.
        const transactions = await prisma.transaction.findMany({
            where: {
                brandId: brand.id,
                // status: 'PENDING'
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        userId: true, // Needed if we want to fetch user avatar from User model, but CreatorProfile has avatar too
                        displayName: true,
                        avatar: true,
                        paymentMethod: true,
                        promptpayId: true,
                        bankName: true,
                        bankAccountNo: true,
                        bankAccountName: true
                    }
                },
                campaign: {
                    select: { title: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedTransactions = transactions.map(t => {
            let recipientInfo: any = {};
            try {
                if (t.recipientInfo) {
                    recipientInfo = JSON.parse(t.recipientInfo);
                }
            } catch (e) {
                console.error('Error parsing recipientInfo', e);
            }

            // Use snapshot info if available, otherwise fallback to current creator profile
            return {
                id: t.id,
                creatorId: t.creatorId,
                creatorName: t.creator.displayName,
                creatorAvatar: t.creator.avatar,
                campaignName: t.campaign?.title || 'N/A',
                amount: t.amount,
                paymentMethod: recipientInfo.paymentMethod || t.creator.paymentMethod || 'PROMPTPAY',
                promptpayId: recipientInfo.promptpayId || t.creator.promptpayId,
                bankName: recipientInfo.bankName || t.creator.bankName,
                bankAccountNo: recipientInfo.bankAccountNo || t.creator.bankAccountNo,
                bankAccountName: recipientInfo.bankAccountName || t.creator.bankAccountName,
                status: t.status,
                dueDate: new Date(t.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Mock due date
                proofImageUrl: t.proofImageUrl
            };
        });

        res.json({
            success: true,
            data: formattedTransactions
        });
    } catch (error) {
        console.error('Get brand payments error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch pending payments' });
    }
};

export const uploadPaymentProof = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { proofImageUrl, transferDate, note } = req.body;

        const transaction = await prisma.transaction.findUnique({
            where: { id }
        });

        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        const updatedTransaction = await prisma.transaction.update({
            where: { id },
            data: {
                status: 'PAID',
                proofImageUrl,
                transferDate: transferDate ? new Date(transferDate) : new Date(),
                brandNote: note
            }
        });

        res.json({
            success: true,
            message: 'Payment proof uploaded successfully',
            data: updatedTransaction
        });
    } catch (error) {
        console.error('Upload proof error:', error);
        res.status(500).json({ success: false, message: 'Failed to upload payment proof' });
    }
};

export const getCreatorPaymentInfo = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string; // Creator ID

        const creator = await prisma.creatorProfile.findUnique({
            where: { id }
        });

        if (!creator) {
            return res.status(404).json({ success: false, message: 'Creator not found' });
        }

        res.json({
            success: true,
            data: {
                paymentMethod: creator.paymentMethod,
                promptpayId: creator.promptpayId,
                bankName: creator.bankName,
                bankAccountNo: creator.bankAccountNo,
                bankAccountName: creator.bankAccountName,
                displayName: creator.displayName
            }
        });
    } catch (error) {
        console.error('Get creator payment info error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch creator payment info' });
    }
};
