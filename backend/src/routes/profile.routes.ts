import express from 'express';
import { getBrandProfile, getCreatorProfile } from '../controllers/profile.controller';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Public Profile Routes
// Note: We might want these to be truly public (no auth) in the future,
// but for now, let's keep them behind login to prevent scraping.
router.get('/brand/:id', authenticate, getBrandProfile);
router.get('/creator/:id', authenticate, getCreatorProfile);

export default router;
