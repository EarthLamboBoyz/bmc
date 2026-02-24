
import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { submitWork, getSubmissions, updateSubmissionStatus } from '../controllers/submissionController';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticate);

// Create a new submission
router.post('/', submitWork);

// Get submissions (can filter by campaignId, creatorId via query params)
router.get('/', getSubmissions);

// Update submission status (Brand only)
router.put('/:id/status', updateSubmissionStatus);

export default router;
