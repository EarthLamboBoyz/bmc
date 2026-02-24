
import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import {
    applyToCampaign,
    getMyApplications,
    getCampaignApplications,
    updateApplicationStatus
} from '../controllers/applicationController';

const router = express.Router();

// Creator Routes
router.post('/apply', authenticate, applyToCampaign);
router.get('/my-applications', authenticate, getMyApplications);

// Brand Routes
router.get('/campaign/:campaignId', authenticate, getCampaignApplications);
router.patch('/:id/status', authenticate, updateApplicationStatus);

export default router;
