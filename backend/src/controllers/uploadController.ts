
import { Request, Response } from 'express';
import { uploadService } from '../services/upload.service';

// Extension to Request type to include file from multer
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

export const uploadImage = async (req: MulterRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const imageUrl = await uploadService.uploadImage(req.file.buffer);

        res.status(200).json({
            message: 'Upload successful',
            url: imageUrl
        });
    } catch (error: any) {
        console.error('Upload Error:', error);

        // Check if it's a configuration error
        if (error?.message?.includes('Must supply api_key') || error?.message?.includes('cloud_name')) {
            return res.status(500).json({
                error: 'Cloudinary configuration missing. Please check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in environment variables.'
            });
        }

        res.status(500).json({ error: 'Upload failed: ' + (error.message || String(error)) });
    }
};

export const uploadVideo = async (req: MulterRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const videoUrl = await uploadService.uploadVideo(req.file.buffer);

        res.status(200).json({
            message: 'Upload successful',
            url: videoUrl
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Upload failed', error: String(error) });
    }
};
