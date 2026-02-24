
import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Video, Play } from 'lucide-react';
import { uploadService } from '../services/upload.service';
import { showError } from '../utils/toast';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    className?: string;
    aspectRatio?: 'square' | 'video' | 'cover';
    mediaType?: 'image' | 'video';
}

export default function ImageUpload({
    value,
    onChange,
    label = "อัปโหลดรูปภาพ",
    className = "",
    aspectRatio = 'square',
    mediaType = 'image'
}: ImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (mediaType === 'image') {
            if (!file.type.startsWith('image/')) {
                showError('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น');
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB
                showError('ขนาดไฟล์ต้องไม่เกิน 5MB');
                return;
            }
        } else {
            if (!file.type.startsWith('video/')) {
                showError('กรุณาอัปโหลดไฟล์วิดีโอเท่านั้น');
                return;
            }
            if (file.size > 100 * 1024 * 1024) { // 100MB
                showError('ขนาดไฟล์ต้องไม่เกิน 100MB');
                return;
            }
        }

        try {
            setLoading(true);
            const url = mediaType === 'image'
                ? await uploadService.uploadImage(file)
                : await uploadService.uploadVideo(file);
            onChange(url);
        } catch (error) {
            console.error('Upload failed:', error);
            showError('อัปโหลดไม่สำเร็จ กรุณาลองใหม่');
        } finally {
            setLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    };

    const ratioClass = {
        square: 'aspect-square',
        video: 'aspect-video',
        cover: 'aspect-[21/9]'
    }[aspectRatio];

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                </label>
            )}

            <div
                onClick={() => fileInputRef.current?.click()}
                className={`
                    relative group cursor-pointer 
                    border-2 border-dashed border-gray-300 dark:border-slate-600 
                    rounded-xl overflow-hidden hover:border-primary transition-colors
                    bg-gray-50 dark:bg-slate-800
                    ${ratioClass}
                    flex items-center justify-center
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={mediaType === 'image' ? "image/*" : "video/*"}
                    onChange={handleFileChange}
                    className="hidden"
                />

                {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-800/80 z-10">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                        <span className="text-sm text-gray-500">กำลังอัปโหลด...</span>
                    </div>
                ) : value ? (
                    <>
                        {mediaType === 'image' ? (
                            <img
                                src={value}
                                alt="Uploaded"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <video
                                src={value}
                                className="w-full h-full object-cover"
                                controls
                            />
                        )}

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                type="button"
                                className="p-2 bg-white/20 hover:bg-white/40 rounded-lg text-white backdrop-blur-sm transition-colors"
                            >
                                <Upload className="w-5 h-5" />
                            </button>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="p-2 bg-red-500/80 hover:bg-red-600 rounded-lg text-white backdrop-blur-sm transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </>

                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            {mediaType === 'image' ? <ImageIcon className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            คลิกเพื่ออัปโหลด
                        </p>
                        <p className="text-xs mt-1">
                            {mediaType === 'image' ? 'PNG, JPG ไม่เกิน 5MB' : 'MP4, MOV ไม่เกิน 100MB'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
