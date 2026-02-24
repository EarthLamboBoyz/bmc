import { Router } from 'express';
import multer from 'multer';
import { uploadGMV, getGMVUploads, getLeaderboard, getTemplate } from '../controllers/gmvController';
import { getSampleDataCSV } from '../controllers/gmvTemplateController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Configure multer for memory storage (no disk storage needed)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept CSV files only
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'));
        }
    }
});

// Routes
router.post(
    '/upload',
    authenticate,
    upload.single('file'),
    uploadGMV as any
);

router.get(
    '/campaign/:campaignId',
    authenticate,
    getGMVUploads as any
);

router.get(
    '/leaderboard/:campaignId',
    authenticate,
    getLeaderboard as any
);

router.get(
    '/template',
    authenticate,
    getTemplate as any
);

router.get(
    '/sample-data',
    authenticate,
    getSampleDataCSV as any
);

export default router;
