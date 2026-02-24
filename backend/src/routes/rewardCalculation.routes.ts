import { Router } from 'express';
import { calculateRewards, getRewardPreview } from '../controllers/rewardCalculationController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

console.log('📌 Registering reward routes...');

// Calculate rewards (POST)
router.post('/calculate/:campaignId', authenticate, (req, res, next) => {
    console.log('📌 POST /calculate/:campaignId hit, params:', req.params);
    next();
}, calculateRewards as any);

// Get preview (GET)
router.get('/preview/:campaignId', authenticate, (req, res, next) => {
    console.log('📌 GET /preview/:campaignId hit, params:', req.params);
    next();
}, getRewardPreview as any);

export default router;
