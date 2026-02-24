import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Video, Link2, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../../components/Layout';

export default function SubmitWork() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [videoUrl, setVideoUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock campaign data (in real app, fetch from API)
    const campaign = {
        id: id,
        name: 'Summer Sale 2026',
        currentDay: 12,
        daysRemaining: 18,
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!videoUrl.trim()) {
            alert('กรุณาใส่ลิงก์วิดีโอ');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            alert('ส่งงานสำเร็จ! 🎉');
            setIsSubmitting(false);
            navigate(`/creator/campaigns/${id}`);
        }, 1500);
    };

    return (
        <DashboardLayout>
            {/* Back button */}
            <Link
                to={`/creator/campaigns/${id}`}
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>กลับ</span>
            </Link>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2 dark:text-white">📹 ส่งงาน Day {campaign.currentDay}</h1>
                <p className="text-gray-600 dark:text-gray-400">{campaign.name}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Submit Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 p-6">
                        <h2 className="text-lg font-semibold mb-4 dark:text-white">ส่งลิงก์วิดีโอ</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Video URL Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    ลิงก์วิดีโอ TikTok *
                                </label>
                                <div className="relative">
                                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="url"
                                        value={videoUrl}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                        placeholder="https://www.tiktok.com/@username/video/..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                                    วางลิงก์วิดีโอ TikTok ที่คุณโพสต์แล้ว
                                </p>
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                <div className="flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-800 dark:text-blue-200">
                                        <p className="font-medium mb-1">เกณฑ์การส่งงาน</p>
                                        <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                                            <li>วิดีโอต้องเป็น Public (ไม่ใช่ Private)</li>
                                            <li>ต้องมี Hashtag ตามที่แคมเปญกำหนด</li>
                                            <li>ต้องแสดงสินค้าอย่างชัดเจน</li>
                                            <li>ความยาววิดีโอ 15-60 วินาที</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/creator/campaigns/${id}`)}
                                    className="flex-1 py-3 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-primary/20"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'กำลังส่ง...' : 'ส่งงาน'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right: Tips & Guidelines */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-100 dark:border-purple-900/30 p-6 sticky top-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2 dark:text-white">
                            <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <span>เคล็ดลับการทำวิดีโอ</span>
                        </h3>

                        <div className="space-y-3 text-sm">
                            <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3">
                                <p className="font-medium text-purple-900 dark:text-purple-200 mb-1">✨ เนื้อหาที่ดี</p>
                                <p className="text-purple-700 dark:text-purple-300">แสดงการใช้งานสินค้าจริง รีวิวตรงไปตรงมา</p>
                            </div>

                            <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3">
                                <p className="font-medium text-purple-900 dark:text-purple-200 mb-1">🎬 คุณภาพวิดีโอ</p>
                                <p className="text-purple-700 dark:text-purple-300">ถ่ายในที่แสงสว่างดี ภาพชัด เสียงชัด</p>
                            </div>

                            <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3">
                                <p className="font-medium text-purple-900 dark:text-purple-200 mb-1">🎯 Hook ที่ดี</p>
                                <p className="text-purple-700 dark:text-purple-300">3 วินาทีแรกต้องดึงดูดความสนใจ</p>
                            </div>

                            <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3">
                                <p className="font-medium text-purple-900 dark:text-purple-200 mb-1">💬 CTA ชัดเจน</p>
                                <p className="text-purple-700 dark:text-purple-300">บอกให้คนดูรู้ว่าต้องทำอะไรต่อ</p>
                            </div>
                        </div>

                        {/* Stats Preview */}
                        <div className="mt-6 pt-6 border-t border-purple-200 dark:border-purple-800">
                            <p className="text-xs text-purple-600 dark:text-purple-400 mb-2">📊 สถิติของคุณ</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="bg-white/60 dark:bg-black/20 rounded-lg p-2 text-center">
                                    <p className="font-bold text-purple-900 dark:text-purple-200">12</p>
                                    <p className="text-xs text-purple-600 dark:text-purple-400">วิดีโอ</p>
                                </div>
                                <div className="bg-white/60 dark:bg-black/20 rounded-lg p-2 text-center">
                                    <p className="font-bold text-purple-900 dark:text-purple-200">234K</p>
                                    <p className="text-xs text-purple-600 dark:text-purple-400">views</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
