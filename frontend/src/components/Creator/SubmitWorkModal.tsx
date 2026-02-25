import { useState } from 'react';
import { X, Link2, AlertCircle, Video, CheckCircle, Info } from 'lucide-react';
import { useData } from '../../context/DataContext'; // Keeping for now if other parts need it, but SubmitWorkModal doesn't.
// Actually, let's remove it if we can.
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../ImageUpload';

import { submissionService } from '../../services/submission.service';

interface SubmitWorkModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaignId: string;
    campaignName: string;
    currentDay: number;
    onSuccess?: () => void;
    variant?: 'dashboard' | 'detail';
}

export default function SubmitWorkModal({
    isOpen,
    onClose,
    campaignId,
    campaignName,
    currentDay,
    onSuccess,
    variant = 'dashboard',
}: SubmitWorkModalProps) {
    const [videoUrl, setVideoUrl] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const [uploadType, setUploadType] = useState<'link' | 'file'>('link');
    const [shopeeLink, setShopeeLink] = useState('');
    const [notes, setNotes] = useState('');
    const [showSuccessUI, setShowSuccessUI] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!videoUrl.trim()) {
            setSubmitError('กรุณาใส่ลิงก์วิดีโอ');
            return;
        }

        if (!user) {
            setSubmitError('กรุณาเข้าสู่ระบบ');
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            await submissionService.submitWork({
                campaignId,
                contentUrl: videoUrl,
                promoLink: shopeeLink,
                notes,
                day: currentDay,
                platform: 'TikTok'
            });

            setShowSuccessUI(true);
            // Show success UI — user will close via "ตกลง" button

        } catch (error: any) {
            console.error('Submit error:', error);
            const errorMessage = error.response?.data?.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
            setSubmitError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccessUI(false);
        setVideoUrl('');
        setShopeeLink('');
        setNotes('');
        onClose();
        if (onSuccess) onSuccess();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            if (showSuccessUI) {
                handleCloseSuccess();
            } else {
                onClose();
            }
        }
    };

    if (showSuccessUI) {
        return (
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={handleBackdropClick}
            >
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center border border-gray-100 dark:border-slate-700 animate-fade-in">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold dark:text-white mb-2">ส่งงานสำเร็จ! 🎉</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        ระบบได้รับงานของคุณแล้ว<br />รอ Brand ตรวจสอบและอนุมัติ
                    </p>
                    <button
                        onClick={handleCloseSuccess}
                        className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary/20"
                    >
                        ตกลง
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-slate-700">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-xl font-bold dark:text-white">📹 ส่งงาน - Day {currentDay}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{campaignName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-500 dark:text-gray-300"
                        disabled={isSubmitting}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Upload Type Toggle */}
                    <div className="flex p-1 bg-gray-100 dark:bg-slate-700/50 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setUploadType('link')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${uploadType === 'link'
                                ? 'bg-white dark:bg-slate-600 text-primary dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            <Link2 className="w-4 h-4 inline mr-2" />
                            แปะลิงก์
                        </button>
                        <button
                            type="button"
                            onClick={() => setUploadType('file')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${uploadType === 'file'
                                ? 'bg-white dark:bg-slate-600 text-primary dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            <Video className="w-4 h-4 inline mr-2" />
                            อัปโหลดคลิป
                        </button>
                    </div>

                    {/* Video Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {uploadType === 'link'
                                ? (variant === 'detail' ? 'Link วิดีโอ *' : 'ลิงก์วิดีโอ TikTok *')
                                : 'อัปโหลดวิดีโอ *'
                            }
                        </label>

                        {uploadType === 'link' ? (
                            <div className="relative">
                                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <input
                                    type="url"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    placeholder="https://www.tiktok.com/@username/video/..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-900 dark:text-white dark:placeholder-gray-600"
                                    required={uploadType === 'link'}
                                    disabled={isSubmitting}
                                />
                            </div>
                        ) : (
                            <div className="w-full">
                                <ImageUpload
                                    value={videoUrl}
                                    onChange={setVideoUrl}
                                    mediaType="video"
                                    aspectRatio="video"
                                    label=""
                                    className="w-full"
                                />
                            </div>
                        )}

                        <p className="text-xs text-gray-500 dark:text-gray-300 mt-2">
                            {uploadType === 'link' ? (
                                variant === 'detail'
                                    ? 'วางลิงก์วิดีโอ TikTok หรือ Instagram'
                                    : 'วางลิงก์วิดีโอ TikTok ที่คุณโพสต์แล้ว'
                            ) : (
                                'รองรับไฟล์ MP4, MOV ขนาดไม่เกิน 100MB'
                            )}
                        </p>
                    </div>

                    {/* Shopee Link */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {variant === 'detail' ? 'Link Affiliate/Promo *' : 'ลิงก์แอฟฟิเลียท/Promo (ถ้ามี)'}
                        </label>
                        <div className="relative">
                            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <input
                                type="url"
                                value={shopeeLink}
                                onChange={(e) => setShopeeLink(e.target.value)}
                                placeholder="https://s.shopee.co.th/..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-900 dark:text-white dark:placeholder-gray-600"
                                disabled={isSubmitting}
                            />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                            {variant === 'detail'
                                ? 'ลิงก์ที่ใช้ในวิดีโอเพื่อ track ยอดขาย'
                                : 'ลิงก์ Shopee, Lazada หรือ affiliate link (ถ้ามี)'}
                        </p>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            หมายเหตุ (ถ้ามี)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="เช่น รีวิวสินค้าแบบละเอียด พร้อมสาธิตวิธีใช้งาน"
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none dark:bg-slate-900 dark:text-white dark:placeholder-gray-600"
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                            เพิ่มรายละเอียดหรือไฮไลท์ของวิดีโอนี้
                        </p>
                    </div>

                    {/* Streak Warning (only for detail variant) */}
                    {variant === 'detail' && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-xl p-4">
                            <div className="flex gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-800 dark:text-amber-200">
                                    ⚠️ ส่งก่อนเที่ยงคืนเพื่อรักษา Streak
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Guidelines (only for dashboard variant) */}
                    {variant === 'dashboard' && (
                        <>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-xl p-4">
                                <div className="flex gap-3">
                                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-800 dark:text-blue-200">
                                        <p className="font-medium mb-2">📋 เกณฑ์การส่งงาน</p>
                                        <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span>วิดีโอต้องเป็น Public (ไม่ใช่ Private)</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span>ต้องมี Hashtag ตามที่แคมเปญกำหนด</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span>ต้องแสดงสินค้าอย่างชัดเจน</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span>ความยาววิดีโอ 15-60 วินาที</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-900/30 rounded-xl p-4">
                                <div className="flex gap-3">
                                    <Video className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-medium text-purple-900 dark:text-purple-200 mb-2">💡 เคล็ดลับ</p>
                                        <div className="space-y-1 text-purple-700 dark:text-purple-300">
                                            <p>• 3 วินาทีแรกต้องดึงดูดความสนใจ</p>
                                            <p>• แสดงการใช้งานสินค้าจริง</p>
                                            <p>• ถ่ายในที่แสงสว่างดี ภาพชัด เสียงชัด</p>
                                            <p>• มี CTA ชัดเจน บอกให้คนดูรู้ว่าต้องทำอะไรต่อ</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Actions */}
                    {submitError && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm mb-4">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {submitError}
                        </div>
                    )}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                            disabled={isSubmitting}
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'กำลังส่ง...' : 'ส่งงาน'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
