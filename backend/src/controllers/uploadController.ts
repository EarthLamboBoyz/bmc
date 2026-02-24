
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
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Upload failed', error: String(error) });
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
