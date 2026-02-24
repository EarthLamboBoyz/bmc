
import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/authMiddleware';
import { uploadImage, uploadVideo } from '../controllers/uploadController';

const router = express.Router();

// Memory storage for multer (we want the buffer to send to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit (Video)
    }
});

// POST /api/upload/image
router.post('/image', authenticate, upload.single('image'), uploadImage);

// POST /api/upload/video
router.post('/video', authenticate, upload.single('video'), uploadVideo);

export default router;
