import { Router } from 'express';
import { createCampaign, getCampaigns, getCampaignById, endCampaign } from '../controllers/campaignController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Public routes (Marketplace browsing might be public later, but let's keep it protected for now or mixed)
// For MVP, user must be logged in to see campaigns? Let's assume protected.
router.get('/', authenticate, getCampaigns);
router.get('/:id', authenticate, getCampaignById);

// Brand only
router.post('/', authenticate, createCampaign);
router.post('/:id/end', authenticate, endCampaign as any);

export default router;
