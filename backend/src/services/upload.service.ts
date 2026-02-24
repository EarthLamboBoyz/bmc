import cloudinary from '../config/cloudinary';
import streamifier from 'streamifier';

export const uploadService = {
    // Upload image to Cloudinary
    uploadImage: async (buffer: Buffer, folder: string = 'bmc_uploads'): Promise<string> => {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (result) resolve(result.secure_url);
                }
            );

            streamifier.createReadStream(buffer).pipe(uploadStream);
        });
    },

    // Upload video to Cloudinary
    uploadVideo: async (buffer: Buffer, folder: string = 'bmc_videos'): Promise<string> => {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: 'video',
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (result) resolve(result.secure_url);
                }
            );

            streamifier.createReadStream(buffer).pipe(uploadStream);
        });
    },
};
