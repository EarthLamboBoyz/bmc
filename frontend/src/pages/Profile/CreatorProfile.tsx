import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { MapPin, Instagram, Youtube, Video, Eye, CheckCircle, ArrowLeft, Heart, Play } from 'lucide-react';
import { DashboardLayout } from '../../components/Layout';
import { profileService } from '../../services/profile.service';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/application.service';
import { showSuccess, showError } from '../../utils/toast';

// Custom TikTok Icon since Lucide doesn't have it standard
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

export default function CreatorProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // To check if viewing own profile
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const appId = searchParams.get('appId');
    const appStatus = searchParams.get('appStatus');
    const isAppPending = appStatus?.toUpperCase() === 'PENDING';
    const isAppApproved = appStatus?.toUpperCase() === 'APPROVED';
    const isAppRejected = appStatus?.toUpperCase() === 'REJECTED';

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!id) return;
                const data = await profileService.getCreatorProfile(id);
                if (data.success) {
                    setProfile(data.data);
                } else {
                    setError(data.message || 'Failed to load profile');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    if (loading) return <DashboardLayout><div className="flex justify-center items-center h-96">Loading...</div></DashboardLayout>;
    if (error || !profile) return <DashboardLayout><div className="text-center py-20 text-red-500">{error || 'Profile not found'}</div></DashboardLayout>;

    const handleApplicationAction = async (status: 'APPROVED' | 'REJECTED') => {
        if (!appId) return;
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            await applicationService.updateStatus(token, appId, status);
            showSuccess(status === 'APPROVED' ? 'อนุมัติใบสมัครสำเร็จ' : 'ปฏิเสธใบสมัครสำเร็จ');
            navigate(-1); // Go back to the campaign applications page
        } catch (error) {
            console.error('Failed to update application status:', error);
            showError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        } finally {
            setActionLoading(false);
        }
    };

    const categories = profile.categories ? JSON.parse(profile.categories) : [];
    const isOwnProfile = user?.id === profile.userId;

    return (
        <DashboardLayout>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
            >
                <ArrowLeft className="w-4 h-4" /> กลับ
            </button>

            {/* Profile Header */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-600 mb-8 shadow-sm">
                <div className="p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start mb-6">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-slate-700 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden shadow-md">
                            <img src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.displayName}&background=random`} alt={profile.displayName} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 pb-2">
                            <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                                {profile.displayName}
                                <CheckCircle className="w-5 h-5 text-blue-500" />
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">@{profile.tiktokHandle || profile.instagramHandle || 'username'}</p>
                        </div>

                        <div className="flex gap-2 pb-2">
                            {!isOwnProfile && appId && isAppPending && (
                                <>
                                    <button
                                        onClick={() => handleApplicationAction('APPROVED')}
                                        disabled={actionLoading}
                                        className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                    >
                                        อนุมัติ (Approve)
                                    </button>
                                    <button
                                        onClick={() => handleApplicationAction('REJECTED')}
                                        disabled={actionLoading}
                                        className="px-6 py-2.5 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                                    >
                                        ปฏิเสธ (Reject)
                                    </button>
                                </>
                            )}
                            {!isOwnProfile && appId && isAppApproved && (
                                <div className="px-6 py-2.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-xl font-medium flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" /> อนุมัติแล้ว
                                </div>
                            )}
                            {!isOwnProfile && appId && isAppRejected && (
                                <div className="px-6 py-2.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-xl font-medium flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" /> ปฏิเสธแล้ว
                                </div>
                            )}
                            {!isOwnProfile && !appId && (
                                <button className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                                    จ้างงาน (Hire)
                                </button>
                            )}
                            {isOwnProfile && (
                                <button
                                    onClick={() => navigate('/creator/settings')}
                                    className="px-6 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    แก้ไขโปรไฟล์
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-100 dark:border-slate-700 pt-6">
                        {/* Left: Info */}
                        <div className="md:col-span-1 space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">เกี่ยวกับฉัน</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {profile.bio || 'ยังไม่มีคำแนะนำตัว'}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">หมวดหมู่</h3>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((cat: string) => (
                                        <span key={cat} className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">ช่องทางโซเชียล</h3>
                                <div className="space-y-3">
                                    {profile.tiktokHandle && (
                                        <a href={`https://tiktok.com/@${profile.tiktokHandle}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                                            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center"><TikTokIcon className="w-4 h-4" /></div>
                                            <span className="font-medium">@{profile.tiktokHandle}</span>
                                        </a>
                                    )}
                                    {profile.instagramHandle && (
                                        <a href={`https://instagram.com/${profile.instagramHandle}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-pink-600 transition-colors">
                                            <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white rounded-full flex items-center justify-center"><Instagram className="w-4 h-4" /></div>
                                            <span className="font-medium">@{profile.instagramHandle}</span>
                                        </a>
                                    )}
                                    {profile.youtubeHandle && (
                                        <a href={`https://youtube.com/@${profile.youtubeHandle}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-red-600 transition-colors">
                                            <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"><Youtube className="w-4 h-4" /></div>
                                            <span className="font-medium">@{profile.youtubeHandle}</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Stats & Portfolio */}
                        <div className="md:col-span-2">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                        {(profile.followersCount || 0).toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Followers</div>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                        {profile.stats?.totalApprovedWork || 0}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">งานที่ผ่านการอนุมัติ</div>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                        {(profile.stats?.totalViews || 0).toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">ยอดวิวรวม (Approved)</div>
                                </div>
                            </div>

                            {/* Portfolio Grid */}
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                                <Video className="w-5 h-5 text-primary" /> ผลงานที่ผ่านมา (Portfolio)
                            </h2>

                            {profile.portfolio?.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {profile.portfolio.map((item: any) => (
                                        <div key={item.id} className="group relative rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-900 aspect-[9/16] border border-gray-200 dark:border-slate-700">
                                            {/* Mock thumbnail since we don't have real thumbnails for video URLs yet */}
                                            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                                                <Play className="w-12 h-12 text-white/30 group-hover:text-white/80 transition-colors" />
                                            </div>

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                                <p className="text-white font-medium text-sm line-clamp-2 mb-2">{item.campaign.title}</p>
                                                <div className="flex items-center justify-between text-xs text-gray-300">
                                                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {item.views.toLocaleString()}</span>
                                                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {item.likes.toLocaleString()}</span>
                                                </div>
                                                <a
                                                    href={item.contentUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-3 w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded text-white text-xs font-medium text-center transition-colors"
                                                >
                                                    ดูวิดีโอ
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 dark:bg-slate-800 rounded-xl border border-dashed border-gray-200 dark:border-slate-600">
                                    <p className="text-gray-500 dark:text-gray-400">ยังไม่มีผลงานที่ได้รับการอนุมัติ</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
