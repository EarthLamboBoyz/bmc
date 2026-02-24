import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Globe, Phone, Building2, Calendar, CheckCircle, ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '../../components/Layout';
import { profileService } from '../../services/profile.service';
import CampaignCardCompact from '../../components/Creator/CampaignCardCompact';

export default function BrandProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!id) return;
                const data = await profileService.getBrandProfile(id);
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

    return (
        <DashboardLayout>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
            >
                <ArrowLeft className="w-4 h-4" /> กลับ
            </button>

            {/* Profile Header */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-100 dark:border-slate-600 mb-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0 border border-gray-200">
                        {profile.logo ? (
                            <img src={profile.logo} alt={profile.companyName} className="w-full h-full object-contain rounded-2xl" />
                        ) : (
                            <Building2 className="w-12 h-12 text-gray-400" />
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold dark:text-white">{profile.companyName}</h1>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> VERIFIED BRAND
                            </span>
                        </div>

                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">{profile.industry || 'General Industry'}</p>

                        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-3xl">
                            {profile.description || 'No description provided.'}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                            {profile.address && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{profile.address}</span>
                                </div>
                            )}
                            {profile.website && (
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    <a href={profile.website} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                                        {profile.website.replace(/^https?:\/\//, '')}
                                    </a>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>เข้าร่วมเมื่อ {new Date(profile.createdAt).toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-xl min-w-[200px] text-center">
                        <div className="text-3xl font-bold text-primary mb-1">{profile.stats?.totalCampaigns || 0}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">แคมเปญทั้งหมด</div>
                    </div>
                </div>
            </div>

            {/* Active Campaigns */}
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
                📢 แคมเปญที่เปิดรับสมัคร ({profile.activeCampaigns?.length || 0})
            </h2>

            {profile.activeCampaigns?.length > 0 ? (
                <div className="space-y-4">
                    {profile.activeCampaigns.map((campaign: any) => (
                        <CampaignCardCompact
                            key={campaign.id}
                            campaign={{
                                ...campaign,
                                name: campaign.title,
                                brandName: profile.companyName,
                                brandLogo: profile.logo,
                                // Mock missing fields for card
                                currentDay: 1,
                                submittedToday: false,
                                daysRemaining: Math.ceil((new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                            }}
                            onSubmitClick={() => navigate(`/creator/campaigns/${campaign.id}`)}
                            submitLabel="ดูรายละเอียด"
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-slate-800 rounded-xl border border-dashed border-gray-200 dark:border-slate-600">
                    <p className="text-gray-500 dark:text-gray-400">ยังไม่มีแคมเปญที่เปิดรับสมัครในขณะนี้</p>
                </div>
            )}

        </DashboardLayout>
    );
}
