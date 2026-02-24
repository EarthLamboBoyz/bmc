import { Router } from 'express';
import { seedCampaignTestData, getSampleCSV, clearCampaignTestData } from '../controllers/testDataController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.post('/seed-campaign-data', authenticate, seedCampaignTestData as any);
router.get('/sample-csv/:campaignId', authenticate, getSampleCSV as any);
router.delete('/clear-campaign-data/:campaignId', authenticate, clearCampaignTestData as any);

export default router;
