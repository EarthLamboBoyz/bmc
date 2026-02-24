import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';

/**
 * Download ready-to-use sample CSV with mock data
 * GET /api/gmv/sample-data
 * 
 * Returns a CSV file with realistic mock data that can be uploaded
 * Note: This is for testing UI only. Real upload requires actual creators.
 */
export const getSampleDataCSV = async (req: AuthRequest, res: Response): Promise<void> => {
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

        // Generate realistic mock data for 10 creators
        const today = new Date().toISOString().split('T')[0];
        const mockCreators = [
            { id: 'a1111111-1111-1111-1111-111111111111', handle: '@beauty_sara', gmv: 485000, orders: 1250 },
            { id: 'b2222222-2222-2222-2222-222222222222', handle: '@skincare_lover', gmv: 392000, orders: 980 },
            { id: 'c3333333-3333-3333-3333-333333333333', handle: '@makeup_guru', gmv: 628000, orders: 1560 },
            { id: 'd4444444-4444-4444-4444-444444444444', handle: '@fashionista_th', gmv: 215000, orders: 540 },
            { id: 'e5555555-5555-5555-5555-555555555555', handle: '@healthylife_jane', gmv: 756000, orders: 1890 },
            { id: 'f6666666-6666-6666-6666-666666666666', handle: '@tiktok_star', gmv: 445000, orders: 1120 },
            { id: 'g7777777-7777-7777-7777-777777777777', handle: '@influencer_pro', gmv: 318000, orders: 795 },
            { id: 'h8888888-8888-8888-8888-888888888888', handle: '@content_creator', gmv: 567000, orders: 1420 },
            { id: 'i9999999-9999-9999-9999-999999999999', handle: '@viral_videos', gmv: 289000, orders: 720 },
            { id: 'j0000000-0000-0000-0000-000000000000', handle: '@lifestyle_guru', gmv: 412000, orders: 1030 },
        ];

        let csvContent = 'creator_id,creator_name,gmv,orders,last_updated\n';
        
        mockCreators.forEach(creator => {
            csvContent += `${creator.id},${creator.handle},${creator.gmv},${creator.orders},${today}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=sample_gmv_data.csv');
        res.send(csvContent);
    } catch (error: any) {
        console.error('Error generating sample CSV:', error);
        res.status(500).json({ error: error.message });
    }
};

// Need to import prisma
import prisma from '../utils/prisma';
