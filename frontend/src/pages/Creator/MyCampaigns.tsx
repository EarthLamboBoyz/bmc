import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  List, 
  Search, 
  Filter,
  Flame,
  TrendingUp,
  Video,
  DollarSign,
  Clock,
  Calendar,
  ChevronRight,
  Plus
} from 'lucide-react';
import { DashboardLayout } from '../../components/Layout';
import EmptyState from '../../components/EmptyState';
import { CampaignsSkeleton } from '../../components/Skeleton';
import { campaignService } from '../../services/campaign.service';
import { creatorCampaignService } from '../../services/creatorCampaign.service';
import { useAuth } from '../../context/AuthContext';

// Types
interface MyCampaign {
  id: string;
  title: string;
  brandName: string;
  image: string;
  status: 'active' | 'pending' | 'completed';
  progress: {
    current: number;
    total: number;
  };
  streak: {
    current: number;
    longest: number;
  };
  videos: {
    submitted: number;
    approved: number;
  };
  earnings: {
    current: number;
    potential: number;
  };
  daysRemaining: number;
  deadline: string;
  submittedToday: boolean;
  submittedAt?: string;
  hoursRemaining?: number;
  minutesRemaining?: number;
}

// Mock data
const mockMyCampaigns: MyCampaign[] = [
  {
    id: 'demo-leaderboard-campaign',
    title: '🎯 Leaderboard Demo - Test Rewards',
    brandName: 'Demo Brand Co.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    status: 'active',
    progress: { current: 14, total: 30 },
    streak: { current: 10, longest: 10 },
    videos: { submitted: 14, approved: 14 },
    earnings: { current: 6800, potential: 25000 },
    daysRemaining: 346,
    deadline: '2026-12-31',
    submittedToday: true,
    submittedAt: '14:30',
  },
  {
    id: '1',
    title: 'สามสิบ ตรา คุณสัมฤทธิ์',
    brandName: 'Demo Brand Co.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60',
    status: 'active',
    progress: { current: 12, total: 365 },
    streak: { current: 12, longest: 12 },
    videos: { submitted: 12, approved: 12 },
    earnings: { current: 3500, potential: 15000 },
    daysRemaining: 353,
    deadline: '2027-01-26',
    submittedToday: true,
    submittedAt: '18:30',
  },
  {
    id: '2',
    title: 'Summer Beauty Challenge',
    brandName: 'Beauty Brand',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=60',
    status: 'active',
    progress: { current: 5, total: 30 },
    streak: { current: 5, longest: 5 },
    videos: { submitted: 5, approved: 5 },
    earnings: { current: 2500, potential: 8000 },
    daysRemaining: 25,
    deadline: '2026-03-31',
    submittedToday: false,
    hoursRemaining: 12,
    minutesRemaining: 8,
  },
  {
    id: '3',
    title: 'Healthy Life 2026',
    brandName: 'Health Co.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=60',
    status: 'pending',
    progress: { current: 0, total: 90 },
    streak: { current: 0, longest: 0 },
    videos: { submitted: 0, approved: 0 },
    earnings: { current: 0, potential: 5000 },
    daysRemaining: 90,
    deadline: '2026-06-30',
    submittedToday: false,
  },
];

// Campaign Card - Grid View
function CampaignCardGrid({ campaign, onSubmit }: { campaign: MyCampaign; onSubmit: (id: string) => void }) {
  const navigate = useNavigate();
  const progressPercent = (campaign.progress.current / campaign.progress.total) * 100;
  
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image Header */}
      <div className="relative h-40">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {campaign.status === 'active' && (
            <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
              กำลังดำเนินการ
            </span>
          )}
          {campaign.status === 'pending' && (
            <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg">
              รออนุมัติ
            </span>
          )}
          {campaign.status === 'completed' && (
            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
              เสร็จสิ้น
            </span>
          )}
        </div>

        {/* Streak Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-orange-500 text-white px-2.5 py-1 rounded-lg shadow-lg">
          <Flame className="w-3.5 h-3.5" />
          <span className="text-xs font-bold">{campaign.streak.current}</span>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white text-lg line-clamp-1 drop-shadow-lg">{campaign.title}</h3>
          <p className="text-white/80 text-sm">by {campaign.brandName}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Progress Section */}
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-gray-500 dark:text-gray-400">ความคืบหน้า</span>
            <span className="font-medium dark:text-white">
              {campaign.progress.current}/{campaign.progress.total} วัน
            </span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2.5 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
              <Flame className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Streak</p>
              <p className="font-bold text-sm dark:text-white">{campaign.streak.current}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <Video className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">วิดีโอ</p>
              <p className="font-bold text-sm dark:text-white">{campaign.videos.submitted}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">รายได้</p>
              <p className="font-bold text-sm text-emerald-600">฿{campaign.earnings.current.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">เหลือ</p>
              <p className="font-bold text-sm dark:text-white">{campaign.daysRemaining} วัน</p>
            </div>
          </div>
        </div>

        {/* Status */}
        {campaign.status === 'active' && (
          <div>
            {campaign.submittedToday ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm text-emerald-700 dark:text-emerald-300">
                  ส่งงานแล้ว {campaign.submittedAt} น.
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-amber-700 dark:text-amber-300">
                  ยังไม่ส่ง • เหลือ {campaign.hoursRemaining} ชม. {campaign.minutesRemaining} น.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onSubmit(campaign.id)}
            className="flex-1 py-2.5 gradient-primary text-white rounded-xl font-medium hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 transition-all text-sm"
          >
            {campaign.submittedToday ? 'ส่งงานอีกครั้ง' : 'ส่งงาน'}
          </button>
          <button
            onClick={() => {
              console.log('🔥 Clicked รายละเอียด, campaign.id:', campaign.id);
              navigate(`/creator/campaigns/${campaign.id}`);
            }}
            className="flex-1 py-2.5 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-sm flex items-center justify-center gap-1 group/btn"
          >
            รายละเอียด
            <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Campaign Card - List View
function CampaignCardList({ campaign, onSubmit }: { campaign: MyCampaign; onSubmit: (id: string) => void }) {
  const navigate = useNavigate();
  const progressPercent = (campaign.progress.current / campaign.progress.total) * 100;

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative w-full md:w-56 h-48 md:h-auto flex-shrink-0">
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            {campaign.status === 'active' && (
              <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                กำลังดำเนินการ
              </span>
            )}
            {campaign.status === 'pending' && (
              <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg">
                รออนุมัติ
              </span>
            )}
          </div>

          {/* Streak Badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-orange-500 text-white px-2.5 py-1 rounded-lg shadow-lg">
            <Flame className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">{campaign.streak.current}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="mb-4">
              <h3 className="font-bold text-lg dark:text-white group-hover:text-primary transition-colors">
                {campaign.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">by {campaign.brandName}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-500 dark:text-gray-400">ความคืบหน้า</span>
                <span className="font-medium dark:text-white">{progressPercent.toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {campaign.progress.current}/{campaign.progress.total} วัน • เหลือ {campaign.daysRemaining} วัน
              </p>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Streak</p>
                  <p className="font-bold text-sm dark:text-white">{campaign.streak.current} วัน</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Video className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">วิดีโอ</p>
                  <p className="font-bold text-sm dark:text-white">{campaign.videos.submitted} คลิป</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">รายได้</p>
                  <p className="font-bold text-sm text-emerald-600">฿{campaign.earnings.current.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
              {campaign.status === 'active' && (
                <div>
                  {campaign.submittedToday ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100 dark:border-emerald-800">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-sm text-emerald-700 dark:text-emerald-300">
                        ส่งแล้ว {campaign.submittedAt} น.
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-full border border-amber-100 dark:border-amber-800">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-amber-700 dark:text-amber-300">
                        ยังไม่ส่ง • เหลือ {campaign.hoursRemaining} ชม.
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => onSubmit(campaign.id)}
                  className="px-4 py-2 gradient-primary text-white rounded-xl font-medium hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 transition-all text-sm"
                >
                  {campaign.submittedToday ? 'ส่งอีกครั้ง' : 'ส่งงาน'}
                </button>
                <button
                  onClick={() => navigate(`/creator/campaigns/${campaign.id}`)}
                  className="px-4 py-2 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-sm flex items-center gap-1 group/btn"
                >
                  รายละเอียด
                  <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function MyCampaigns() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [campaigns, setCampaigns] = useState<MyCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  // Fetch campaigns from API
  useEffect(() => {
    console.log('📌 MyCampaigns: Fetching campaigns...');
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const data = await creatorCampaignService.getMyCampaigns();
        console.log('📌 MyCampaigns: API data received:', data);
        console.log('📌 MyCampaigns: Number of campaigns:', data.length);
        setCampaigns(data);
      } catch (error: any) {
        console.error('❌ MyCampaigns: Error fetching campaigns:', error);
        console.error('❌ Error status:', error.response?.status);
        console.error('❌ Error message:', error.message);
        // Don't fallback - show error state instead
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    if (filter !== 'all' && campaign.status !== filter) return false;
    if (searchQuery && !campaign.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Count by status
  const counts = {
    all: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    pending: campaigns.filter(c => c.status === 'pending').length,
    completed: campaigns.filter(c => c.status === 'completed').length,
  };

  const handleSubmit = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setSubmitModalOpen(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-fade-in">
          <CampaignsSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">แคมเปญที่กำลังทำ</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              แคมเปญที่คุณกำลังทำอยู่ ส่งงานทุกวันเพื่อรักษา Streak
            </p>
          </div>
          <button
            onClick={() => navigate('/creator/campaigns')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            หาแคมเปญใหม่
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Filter Tabs */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {(['all', 'active', 'pending', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === status
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {status === 'all' && 'ทั้งหมด'}
                  {status === 'active' && 'กำลังทำ'}
                  {status === 'pending' && 'รออนุมัติ'}
                  {status === 'completed' && 'เสร็จแล้ว'}
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                    filter === status ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-700'
                  }`}>
                    {counts[status]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search & View Toggle */}
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาแคมเปญ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white w-full sm:w-64"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Campaigns Grid/List */}
        {filteredCampaigns.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {filteredCampaigns.map((campaign, index) => (
              <div 
                key={campaign.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {viewMode === 'grid' ? (
                  <CampaignCardGrid campaign={campaign} onSubmit={handleSubmit} />
                ) : (
                  <CampaignCardList campaign={campaign} onSubmit={handleSubmit} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={searchQuery ? Search : Filter}
            title={searchQuery ? 'ไม่พบผลลัพธ์' : 'ไม่มีแคมเปญ'}
            description={searchQuery 
              ? 'ลองค้นหาด้วยคำอื่นหรือล้างตัวกรอง'
              : 'คุณยังไม่มีแคมเปญในกลุ่มนี้ ไปหาแคมเปญใหม่กัน!'
            }
            actionLabel={searchQuery ? 'ล้างการค้นหา' : 'หาแคมเปญ'}
            onActionClick={() => searchQuery ? setSearchQuery('') : navigate('/creator/campaigns')}
            size="lg"
          />
        )}
      </div>
    </DashboardLayout>
  );
}
