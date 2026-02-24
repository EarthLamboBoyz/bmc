
import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { getBrandStats, getCreatorStats } from '../controllers/dashboard.controller';

const router = express.Router();

// GET /api/dashboard/brand
router.get('/brand', authenticate, getBrandStats);

// GET /api/dashboard/creator
router.get('/creator', authenticate, getCreatorStats);

export default router;
