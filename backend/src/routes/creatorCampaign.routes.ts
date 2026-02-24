import { Router } from 'express';
import { getMyCampaigns, getMyCampaignDetail } from '../controllers/creatorCampaignController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Get all campaigns for logged-in creator
router.get('/my-campaigns', authenticate, getMyCampaigns as any);

// Get single campaign detail for creator
router.get('/my-campaigns/:id', authenticate, getMyCampaignDetail as any);

export default router;
