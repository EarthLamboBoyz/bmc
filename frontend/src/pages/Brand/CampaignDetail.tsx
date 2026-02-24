import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Settings, Users, Eye, TrendingUp, Wallet, Calendar, Gift, CheckCircle, XCircle, Search, Filter, Play, Upload, Trophy, Clock, Target, Flame, Shuffle, Award, FileText, BarChart3, RefreshCw } from 'lucide-react';
import ContentLibrary from '../../components/Brand/ContentLibrary';
import GMVUploadForm from '../../components/GMVUpload/GMVUploadForm';
import RewardSummary from '../../components/Rewards/RewardSummary';
import CreatorPortfolioModal from '../../components/Brand/CreatorPortfolioModal';
import BulkApproveModal from '../../components/BulkApproveModal';
import BulkActionBar from '../../components/BulkActionBar';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/Layout';
import { useData } from '../../context/DataContext';
import { campaignService } from '../../services/campaign.service';
import { submissionService } from '../../services/submission.service';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SampleManagement from '../../components/Brand/SampleManagement';
import { showSuccess, showError } from '../../utils/toast';
import { useBulkSelection } from '../../hooks/useBulkSelection';
import ApplicantList from './ApplicantList';
import { applicationService } from '../../services/application.service';

// Mock GMV trend data
const gmvTrendData = [
  { date: '1/1', gmv: 120000 },
  { date: '1/5', gmv: 280000 },
  { date: '1/10', gmv: 450000 },
  { date: '1/15', gmv: 720000 },
  { date: '1/20', gmv: 1100000 },
  { date: '1/25', gmv: 1650000 },
  { date: '1/30', gmv: 2400000 },
];

// Reward type icons and colors
const rewardTypeConfig: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
  sales_milestone: { icon: <Target className="w-5 h-5" />, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  top_volume: { icon: <BarChart3 className="w-5 h-5" />, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  streak_bonus: { icon: <Flame className="w-5 h-5" />, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  lucky_draw: { icon: <Shuffle className="w-5 h-5" />, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  custom: { icon: <Award className="w-5 h-5" />, color: 'text-pink-600', bgColor: 'bg-pink-100' },
};

const tabs = [
  { id: 'overview', label: 'ภาพรวม' },
  { id: 'creators', label: 'Creators' },
  { id: 'applications', label: 'ใบสมัคร' },
  { id: 'submissions', label: 'ตรวจสอบงาน' },
  { id: 'content', label: 'คลังคอนเทนต์' },
  { id: 'leaderboard', label: 'อันดับ' },
  { id: 'rewards', label: 'ของรางวัล' },
  { id: 'samples', label: 'สินค้าตัวอย่าง' },
  { id: 'gmv', label: 'ยอดขาย (GMV)' },
];

const statusColors = {
  draft: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  live: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  completed: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  cancelled: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  distributed: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
};

const statusLabels = {
  draft: 'แบบร่าง',
  live: 'กำลังดำเนินการ',
  completed: 'จบแล้ว (รอแจกรางวัล)',
  cancelled: 'ยกเลิก',
  distributed: 'แจกรางวัลแล้ว',
};

export default function CampaignDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [showBulkApproveApplicationsModal, setShowBulkApproveApplicationsModal] = useState(false);
  const [showBulkApproveSubmissionsModal, setShowBulkApproveSubmissionsModal] = useState(false);
  const [showEndCampaignModal, setShowEndCampaignModal] = useState(false);
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<any>(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [sortBy, setSortBy] = useState('gmv');

  // Get data from context (keeping for other features like applications for now, or TODO: refactor them too)
  // Get data from context (keeping for other features like applications for now, or TODO: refactor them too)
  const {
    applications: allApplications,
    // submissions: allSubmissions, // Removed to use real API
    creatorStats,
    approveApplication,
    rejectApplication,
    // approveSubmission, // Removed
    // rejectSubmission, // Removed
    getSampleRequestsForCampaign,
    approveSampleRequest,
    rejectSampleRequest,
    markSampleShipped,
    bulkApproveSampleRequests,
    bulkMarkSamplesShipped,
  } = useData();

  // Local state for submissions and applications
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissionToApprove, setSubmissionToApprove] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const token = localStorage.getItem('token');
        if (id && token) {
          const data = await campaignService.getCampaignById(id, token);
          setCampaign(data);
        }
      } catch (error) {
        console.error("Failed to fetch campaign", error);
        showError("Failed to fetch campaign details");
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
    fetchCampaign();
    if (id) {
      fetchApplications();
    }
  }, [id]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token && id) {
        const data = await applicationService.getCampaignApplications(token, id);
        // Map backend data to match frontend expectations for creators tab
        const mappedData = data.map((app: any) => ({
          ...app,
          creatorName: app.creator?.displayName || 'Unknown Creator',
          creatorHandle: app.creator?.tiktokHandle ? `@${app.creator.tiktokHandle}` : '',
          creatorAvatar: app.creator?.avatar || '',
          followers: app.creator?.followersCount || 0
        }));
        setApplications(mappedData);
      }
    } catch (error) {
      console.error("Failed to fetch applications", error);
    }
  };

  // Fetch submissions when tab is active
  useEffect(() => {
    if (activeTab === 'submissions' && id) {
      fetchSubmissions();
    }
  }, [activeTab, id]);

  // Fetch leaderboard when GMV tab or Leaderboard tab is active
  useEffect(() => {
    if ((activeTab === 'gmv' || activeTab === 'leaderboard') && id) {
      fetchLeaderboard();
    }
  }, [activeTab, id]);

  const fetchLeaderboardData = async (sortType: string) => {
    setSortBy(sortType);
    try {
      setLeaderboardLoading(true);
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/gmv/leaderboard/${id}?sortBy=${sortType}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLeaderboardData(data);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLeaderboardLoading(true);
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/gmv/leaderboard/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLeaderboardData(data);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoadingSubmissions(true);
      const data = await submissionService.getSubmissions({ campaignId: id });
      setSubmissions(data);
    } catch (error) {
      console.error("Failed to fetch submissions", error);
      showError("Failed to fetch submissions");
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleApproveSubmission = (submissionId: string) => {
    setSubmissionToApprove(submissionId);
  };

  const confirmApproveSubmission = async () => {
    if (!submissionToApprove) return;
    try {
      await submissionService.updateStatus(submissionToApprove, 'APPROVED');
      showSuccess('อนุมัติงานเรียบร้อย');
      // Update local state
      setSubmissions(prev => prev.map(s => s.id === submissionToApprove ? { ...s, status: 'APPROVED' } : s));
    } catch (error) {
      console.error("Failed to approve submission", error);
      showError("Failed to approve submission");
    } finally {
      setSubmissionToApprove(null);
    }
  };

  const handleRejectSubmission = async (submissionId: string) => {
    const reason = prompt('ระบุเหตุผลที่ไท่อนุมัติ (Optional):');
    if (reason === null) return; // Cancelled

    try {
      await submissionService.updateStatus(submissionId, 'REJECTED', reason);
      showError('ส่งกลับแก้ไขเรียบร้อย'); // Using red toast for reject
      // Update local state
      setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: 'REJECTED', reviewNote: reason } : s));
    } catch (error) {
      console.error("Failed to reject submission", error);
      showError("Failed to reject submission");
    }
  };

  const handleBulkApproveSubmissions = async () => {
    try {
      await Promise.all(pendingSubmissions.map(s => submissionService.updateStatus(s.id, 'APPROVED')));
      showSuccess(`อนุมัติงานทั้งหมด ${pendingSubmissions.length} รายการเรียบร้อย`);
      setSubmissions(prev => prev.map(s => pendingSubmissions.find(ps => ps.id === s.id) ? { ...s, status: 'APPROVED' } : s));
      setShowBulkApproveSubmissionsModal(false);
    } catch (error) {
      console.error("Failed to bulk approve", error);
      showError("Failed to bulk approve submissions");
    }
  };

  const handleEndCampaign = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !campaign) return;

      await campaignService.endCampaign(campaign.id, token);
      showSuccess("จบแคมเปญและคำนวณรางวัลเรียบร้อย");
      setCampaign({ ...campaign, status: 'completed' });
      setShowEndCampaignModal(false);
      // Optional: Redirect to payments or refresh
    } catch (error) {
      console.error("Failed to end campaign", error);
      showError("Failed to end campaign");
    }
  };

  // Using local state for applications instead of allApplications
  // const submissions = allSubmissions.filter(s => s.campaignId === id); // Now using local state `submissions`
  const pendingApplications = applications.filter(a => a.status === 'PENDING' || a.status === 'pending');
  // const pendingSubmissions = submissions.filter(s => s.status === 'pending'); // use local submissions
  const pendingSubmissions = submissions.filter(s => s.status === 'PENDING' || s.status === 'pending'); // Handle both case just in case
  const campaignCreatorStats = creatorStats.filter(cs => cs.campaignId === id);
  const sampleRequests = getSampleRequestsForCampaign(id || '');

  // Bulk selection for applications
  const applicationsSelection = useBulkSelection({ items: pendingApplications });

  // Bulk selection for submissions
  const submissionsSelection = useBulkSelection({ items: pendingSubmissions });

  const formatBudget = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    return amount.toString();
  };

  if (loading) return <DashboardLayout><div>Loading...</div></DashboardLayout>;
  if (!campaign) return <DashboardLayout><div>Campaign not found</div></DashboardLayout>;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/brand/campaigns"
          className="flex items-center gap-1 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับไปหน้าแคมเปญ
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 overflow-hidden">
          {/* Campaign Header */}
          <div className="relative h-48">
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${statusColors[campaign.status as keyof typeof statusColors] || statusColors.draft}`}>
                    {statusLabels[campaign.status as keyof typeof statusLabels] || 'Unknown'}
                  </span>
                  {campaign.type === 'challenge' && (
                    <span className="px-3 py-1 bg-secondary text-white rounded-full text-sm">
                      Challenge
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-white">{campaign.title}</h1>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/brand/campaigns/${campaign.id}/edit`}
                  className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                {campaign.status === 'live' && (
                  <button
                    onClick={() => setShowEndCampaignModal(true)}
                    className="p-2 bg-red-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-red-600/80 transition-colors"
                    title="จบแคมเปญ"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
                <button className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-100 dark:border-slate-600">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-300 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">Creators</span>
              </div>
              <p className="text-2xl font-bold dark:text-white">{campaign.currentCreators}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-300 mb-1">
                <Eye className="w-4 h-4" />
                <span className="text-sm">Videos</span>
              </div>
              <p className="text-2xl font-bold dark:text-white">1,245</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-300 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">การเข้าถึงรวม</span>
              </div>
              <p className="text-2xl font-bold dark:text-white">2.1M</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-300 mb-1">
                <Wallet className="w-4 h-4" />
                <span className="text-sm">งบรางวัล</span>
              </div>
              <p className="text-2xl font-bold dark:text-white">฿{formatBudget(campaign.budget || 0)}</p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-100 dark:border-slate-600 overflow-x-auto">
            {tabs.map(tab => {
              const badge =
                tab.id === 'applications' ? pendingApplications.length :
                  tab.id === 'submissions' ? pendingSubmissions.length :
                    0;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors relative ${activeTab === tab.id
                    ? 'text-primary'
                    : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  <span>{tab.label}</span>
                  {badge > 0 && (
                    <span className="px-2 py-0.5 bg-secondary text-white text-xs rounded-full font-medium">
                      {badge}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content Body */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 p-6">

        {/* 1. Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 dark:text-white">คำอธิบาย</h3>
              <p className="text-gray-600 dark:text-gray-300">{campaign.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 dark:text-white">รายละเอียด</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-300">ระยะเวลา</p>
                      <p className="font-medium dark:text-white">
                        {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString('th-TH') : '-'} -{' '}
                        {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('th-TH') : '-'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Followers ขั้นต่ำ</p>
                      <p className="font-medium dark:text-white">{(campaign.minFollowers || 0).toLocaleString()}+</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Gift className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-300">จำนวนรางวัล</p>
                      <p className="font-medium dark:text-white">{(campaign.rewards || []).length} ประเภท</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3 dark:text-white">แพลตฟอร์มและหมวดหมู่</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">แพลตฟอร์ม</p>
                    <div className="flex gap-2">
                      {(campaign.platforms || []).map((p: string) => (
                        <span key={p} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{p}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">หมวดหมู่</p>
                    <div className="flex flex-wrap gap-2">
                      {(campaign.categories || []).map((c: string) => (
                        <span key={c} className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Creators Tab */}
        {activeTab === 'creators' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold dark:text-white">Creators ในแคมเปญ ({campaign.currentCreators})</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applications.filter((a: any) => a.status === 'APPROVED' || a.status === 'approved').map((app: any) => (
                <Link
                  to={`/creator/${app.creatorId}?appId=${app.id}&appStatus=${app.status}`}
                  key={app.id}
                  className="block border border-gray-100 dark:border-slate-600 dark:bg-slate-700 rounded-xl p-4 cursor-pointer hover:border-primary hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img src={app.creatorAvatar} alt={app.creatorName} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="font-medium dark:text-white group-hover:text-primary">{app.creatorName}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-300">{app.creatorHandle}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-2 text-center">
                      <p className="font-medium dark:text-white">{(app.followers / 1000).toFixed(1)}K</p>
                      <p className="text-gray-500 dark:text-gray-300 text-xs">Followers</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-2 text-center">
                      <p className="font-medium dark:text-white">12</p>
                      <p className="text-gray-500 dark:text-gray-300 text-xs">Videos</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 3. Applications Tab */}
        {activeTab === 'applications' && (
          <ApplicantList campaignId={campaign.id} />
        )}

        {/* 4. Inbox Tab (Pending Submissions) */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg dark:text-white">ตรวจสอบงาน - งานที่รอการอนุมัติ</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">{pendingSubmissions.length} รายการรอตรวจสอบ</p>
              </div>
              {pendingSubmissions.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowBulkApproveSubmissionsModal(true)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium flex items-center gap-2 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> อนุมัติทั้งหมด ({pendingSubmissions.length})
                  </button>
                </div>
              )}
            </div>

            {pendingSubmissions.length === 0 ? (
              <div className="text-center py-16 text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-slate-700 rounded-xl border border-dashed border-gray-200 dark:border-slate-600">
                <CheckCircle className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
                <p className="font-medium text-gray-700 dark:text-white">ไม่มีงานที่ค้างอยู่</p>
                <p className="text-sm dark:text-gray-300">อนุมัติครบแล้ว!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingSubmissions.map((submission, idx) => (
                  <div key={submission.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    {/* Mobile: Stack vertically, Desktop: Side by side */}
                    <div className="flex flex-col md:flex-row">
                      {/* Video Thumbnail */}
                      <div className="relative w-full md:w-48 flex-shrink-0">
                        <div className="aspect-video md:aspect-[9/16] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white/30" />
                        </div>
                        {/* Day Badge */}
                        <div className="absolute top-2 left-2 md:top-2 md:right-2 md:left-auto px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-xs text-white font-medium">
                          Day {submission.day}
                        </div>
                        {/* Queue number on mobile */}
                        <div className="absolute top-2 right-2 md:hidden w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 md:p-5">
                        {/* Creator Info */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <img src={submission.creatorAvatar} alt={submission.creatorName} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-100 dark:border-slate-600 object-cover" />
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">{submission.creatorName}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{submission.creatorHandle}</p>
                            </div>
                          </div>
                          {/* Time submitted */}
                          <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span className="hidden sm:inline">ส่งเมื่อ</span> {new Date(submission.submittedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        {/* Links */}
                        <div className="space-y-2 mb-4">
                          {/* Video URL */}
                          <a
                            href={submission.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm break-all"
                          >
                            <Play className="w-4 h-4 flex-shrink-0" />
                            <span className="line-clamp-1">{submission.videoUrl}</span>
                          </a>

                          {/* Promo Link */}
                          {submission.promoLink && (
                            <a
                              href={submission.promoLink}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium text-sm break-all"
                            >
                              <TrendingUp className="w-4 h-4 flex-shrink-0" />
                              <span className="line-clamp-1">{submission.promoLink}</span>
                            </a>
                          )}
                        </div>

                        {/* Action Buttons - Responsive */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <button
                            onClick={() => handleApproveSubmission(submission.id)}
                            className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium shadow-sm flex items-center justify-center gap-2 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            อนุมัติ
                          </button>
                          <button
                            onClick={() => handleRejectSubmission(submission.id)}
                            className="flex-1 sm:flex-none px-4 py-2.5 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            ส่งกลับแก้ไข
                          </button>
                          <a
                            href={submission.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            ดูวิดีโอ
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. Content Library Tab */}
        {activeTab === 'content' && (
          <ContentLibrary campaignId={campaign.id} />
        )}

        {/* 6. Leaderboard Tab - Real Data from API */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Leaderboard</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchLeaderboardData('gmv')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === 'gmv' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'}`}
                >
                  GMV
                </button>
                <button
                  onClick={() => fetchLeaderboardData('videos')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === 'videos' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'}`}
                >
                  Volume
                </button>
                <button
                  onClick={() => fetchLeaderboardData('streak')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === 'streak' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'}`}
                >
                  Streak
                </button>
              </div>
            </div>

            {leaderboardData?.leaderboard?.length > 0 ? (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-slate-600">
                      <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-200 font-bold">อันดับ</th>
                      <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-200 font-bold">Creator</th>
                      <th className="text-right py-3 px-4 text-gray-800 dark:text-gray-200 font-bold">ยอดขาย (GMV)</th>
                      <th className="text-right py-3 px-4 text-gray-800 dark:text-gray-200 font-bold">ออเดอร์</th>
                      <th className="text-right py-3 px-4 text-gray-800 dark:text-gray-200 font-bold">วิดีโอ</th>
                      <th className="text-right py-3 px-4 text-gray-800 dark:text-gray-200 font-bold">ต่อเนื่อง (Streak)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.leaderboard.map((entry: any, i: number) => (
                      <tr key={entry.creatorId} className="border-b border-gray-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700">
                        <td className="py-3 px-4 text-gray-800 dark:text-gray-200 font-bold">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                              {entry.creatorName?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white">{entry.creatorName}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{entry.tiktokHandle || '@unknown'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-green-700 dark:text-green-400">฿{entry.gmv.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-gray-800 dark:text-gray-200 font-medium">{entry.orders.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-gray-800 dark:text-gray-200 font-medium">{entry.approvedSubmissions}</td>
                        <td className="py-3 px-4 text-right text-orange-600 dark:text-orange-400 font-bold"><span className="flex items-center justify-end gap-1">🔥 {entry.longestStreak}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <Trophy className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">ยังไม่มีข้อมูล Leaderboard</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">ไปที่ tab "ยอดขาย (GMV)" เพื่ออัพโหลดข้อมูล</p>
              </div>
            )}
          </div>
        )}

        {/* 7. Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            {/* Reward Calculation Summary */}
            {id && <RewardSummary campaignId={id} />}

            {/* Header with total budget */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg dark:text-white">โครงสร้างรางวัล</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">รายละเอียดรางวัลทั้งหมด</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-300">งบประมาณรวม</p>
                <p className="text-2xl font-bold text-primary">฿{(campaign.budget || 0).toLocaleString()}</p>
              </div>
            </div>

            {/* Reward Cards */}
            {(campaign.rewards || []).map((reward: any) => {
              const config = rewardTypeConfig[reward.type] || rewardTypeConfig.custom;
              const tiers = (reward.config?.tiers || reward.config?.milestones || reward.config?.prizes || []) as any[];

              // Get top creators for this reward type
              const sortedStats = [...campaignCreatorStats].sort((a, b) => {
                if (reward.type === 'sales_milestone') return b.gmv - a.gmv;
                if (reward.type === 'top_volume') return b.approvedVideos - a.approvedVideos;
                if (reward.type === 'streak_bonus') return b.currentStreak - a.currentStreak;
                return b.gmv - a.gmv;
              }).slice(0, 3);

              return (
                <div key={reward.id} className="border border-gray-100 dark:border-slate-600 rounded-xl overflow-hidden">
                  {/* Card Header */}
                  <div className="bg-white dark:bg-slate-800 px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-600">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${config?.bgColor || 'bg-gray-100'} ${config?.color || 'text-gray-600'} rounded-xl flex items-center justify-center`}>
                        {config?.icon || <Award className="w-5 h-5" />}
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{reward.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-300 capitalize">{reward.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                    {reward.type !== 'custom' && reward.budget && (
                      <span className={`text-lg font-bold ${config?.color || 'text-gray-600'}`}>฿{reward.budget.toLocaleString()}</span>
                    )}
                  </div>

                  {/* Content - Always Visible */}
                  <div className="bg-gray-50/50 dark:bg-slate-900/50 p-5">
                    {tiers.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Left: Tier Rankings */}
                        <div>
                          <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                            {reward.type === 'sales_milestone' ? 'อันดับยอดขาย GMV สูงสุด' : 'จำนวนวิดีโอที่อนุมัติมากที่สุด'}
                          </h5>
                          <div className="space-y-2">
                            {tiers.map((tier, idx) => (
                              <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-600 last:border-0">
                                <span className="flex items-center gap-2">
                                  <span className="text-lg dark:text-gray-300">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${tier.rank || idx + 1}`}</span>
                                  <span className="text-sm dark:text-gray-300">
                                    {reward.type === 'sales_milestone'
                                      ? `ยอดขาย ฿${(tier.gmvTarget || tier.threshold || 0).toLocaleString()}`
                                      : `อันดับที่ ${tier.rank || idx + 1}`}
                                  </span>
                                </span>
                                <span className={`font-semibold ${idx === 0 ? 'text-amber-600 dark:text-amber-400' :
                                  idx === 1 ? 'text-gray-700 dark:text-gray-300' :
                                    idx === 2 ? 'text-orange-600 dark:text-orange-400' :
                                      'text-gray-600 dark:text-gray-300'
                                  }`}>
                                  ฿{(tier.amount || tier.reward || 0).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right: Current Leaders */}
                        <div>
                          <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500" /> ผู้นำปัจจุบัน
                          </h5>
                          <div className="space-y-2">
                            {sortedStats.length > 0 ? sortedStats.map((stat, idx) => {
                              const app = applications.find(a => a.creatorId === stat.creatorId);
                              const value = reward.type === 'sales_milestone' ? `฿${stat.gmv.toLocaleString()}` :
                                reward.type === 'top_volume' ? `${stat.approvedVideos} วิดีโอ` :
                                  `${stat.currentStreak} วัน`;
                              return (
                                <Link
                                  key={stat.creatorId}
                                  to={`/brand/creators/${stat.creatorId}`}
                                  className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg px-4 py-2 border border-gray-100 dark:border-slate-600 hover:border-primary/50 hover:shadow-md transition-all"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-lg">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                                    <img src={app?.creatorAvatar || `https://i.pravatar.cc/40?img=${idx}`} alt="" className="w-8 h-8 rounded-full" />
                                    <div>
                                      <span className="font-medium text-gray-700 dark:text-white">{app?.creatorName || `Creator ${idx + 1}`}</span>
                                      <p className="text-xs text-gray-400">คลิกดูโปรไฟล์ →</p>
                                    </div>
                                  </div>
                                  <span className="font-semibold text-primary dark:text-indigo-300">{value}</span>
                                </Link>
                              );
                            }) : (
                              <p className="text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-100 dark:border-slate-600">ยังไม่มีข้อมูลผู้นำ</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-600">
                        {/* Lucky Draw */}
                        {reward.type === 'lucky_draw' && (
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">🎲 สุ่มจับรางวัล {(reward.config?.winners as number) || 10} รางวัล รางวัลละ ฿{((reward.config?.amount as number) || 500).toLocaleString()}</p>
                          </div>
                        )}

                        {/* Streak Bonus */}
                        {reward.type === 'streak_bonus' && (
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">🔥 รางวัลสำหรับผู้ที่ส่งงานติดต่อกัน</p>
                            <div className="space-y-2">
                              {/* Support both arrays of streaks and single streakDays config */}
                              {((reward.config?.streaks || [{ days: reward.config?.streakDays, amount: reward.config?.bonusPerStreak, winners: reward.config?.winners }]) as any[])
                                .filter(s => s.days).map((streak, idx) => (
                                  <div key={idx} className="flex items-center justify-between bg-orange-50 rounded-lg px-4 py-2 border border-orange-100">
                                    <span className="text-sm">
                                      <span className="text-orange-500 font-medium">Streak {streak.days} วัน:</span>
                                    </span>
                                    <span className="text-sm font-semibold">
                                      {streak.winners ? `สุ่ม ${streak.winners} คน × ` : ''}฿{(streak.amount || streak.bonusPerStreak || 0).toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Custom Reward */}
                        {reward.type === 'custom' && (
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">⭐ รางวัลพิเศษ</p>
                            <div className="space-y-3">
                              {((reward.config?.prizes as { description: string; condition: string }[]) || []).map((prize, idx) => (
                                <div key={idx} className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
                                  <div className="flex items-start gap-2">
                                    <span className="text-lg">🎁</span>
                                    <div className="flex-1">
                                      <p className="font-semibold text-pink-900">{prize.description || 'รางวัลพิเศษ'}</p>
                                      {prize.condition && (
                                        <div className="mt-2 pt-2 border-t border-pink-200">
                                          <p className="text-xs text-pink-600 font-medium mb-1">เงื่อนไข:</p>
                                          <p className="text-sm text-pink-800">{prize.condition}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Conditions */}
                    {reward.type === 'lucky_draw' && tiers.length === 0 && (
                      <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <p className="text-sm text-purple-700">
                          <strong>เงื่อนไข:</strong> ต้องส่งวิดีโออย่างน้อย {(reward.config?.minVideos as number) || 10} วิดีโอ จึงจะมีสิทธิ์ลุ้นรางวัล
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Campaign Status */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-300">สถานะการคำนวณรางวัล</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {campaign.status === 'completed' || campaign.status === 'distributed' ? 'คำนวณรางวัลเสร็จสิ้น' :
                    campaign.status === 'live' ? 'รอจบแคมเปญ - จะคำนวณหลังวันที่ ' + new Date(campaign.endDate).toLocaleDateString('th-TH') :
                      'แคมเปญยังไม่เริ่ม'}
                </p>
              </div>
            </div>

            {/* Distributed Rewards List (Mock for now, normally fetched from transactions) */}
            {(campaign.status === 'completed' || campaign.status === 'distributed') && (
              <div className="mt-8 border-t border-gray-100 dark:border-slate-600 pt-6">
                <h3 className="font-semibold text-lg mb-4 dark:text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  ผู้ได้รับรางวัล
                </h3>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-slate-900/50 text-left text-sm text-gray-500 dark:text-gray-400">
                      <tr>
                        <th className="py-3 px-4 font-medium">รางวัล</th>
                        <th className="py-3 px-4 font-medium">ผู้ชนะ</th>
                        <th className="py-3 px-4 font-medium text-right">จำนวนเงิน</th>
                        <th className="py-3 px-4 font-medium text-center">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                      {/* Mock Data for Visualization */}
                      {campaignCreatorStats.length > 0 ? campaignCreatorStats.slice(0, 3).map((stat, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                              {i === 0 ? 'Top Volume - Rank #1' : i === 1 ? 'Top Volume - Rank #2' : 'Lucky Draw'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <img src={`https://i.pravatar.cc/40?img=${i + 10}`} className="w-6 h-6 rounded-full" alt="" />
                              <span className="text-sm text-gray-600 dark:text-gray-300">Creator {i + 1}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-emerald-600 dark:text-emerald-400">
                            ฿{i === 0 ? '5,000' : '1,000'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full dark:bg-yellow-900/30 dark:text-yellow-300">
                              Pending
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-gray-500 dark:text-gray-400">
                            ยังไม่มีข้อมูลผู้ได้รับรางวัล
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 8. Samples Tab */}
        {
          activeTab === 'samples' && campaign.hasSamples && campaign.sampleInfo && (
            <SampleManagement
              campaignId={campaign.id}
              sampleInfo={campaign.sampleInfo}
              sampleRequests={sampleRequests}
              onApprove={approveSampleRequest}
              onReject={rejectSampleRequest}
              onMarkShipped={markSampleShipped}
              onBulkApprove={bulkApproveSampleRequests}
              onBulkMarkShipped={bulkMarkSamplesShipped}
            />
          )
        }

        {/* Show message if no samples */}
        {
          activeTab === 'samples' && !campaign.hasSamples && (
            <div className="text-center py-16 text-gray-500">
              <p className="font-medium text-gray-700">แคมเปญนี้ไม่มีตัวอย่างสินค้า</p>
              <p className="text-sm">คุณสามารถเพิ่มตัวอย่างสินค้าได้ในการตั้งค่าแคมเปญ</p>
            </div>
          )
        }

        {/* 9. GMV Tab - Unified View */}
        {
          activeTab === 'gmv' && (
            <div className="space-y-6">
              {/* Stats Cards - Real Data */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 rounded-xl shadow-sm text-white">
                  <p className="text-3xl font-bold">
                    ฿{leaderboardData ? (leaderboardData.totalGMV / 1000000).toFixed(2) : '0.00'}M
                  </p>
                  <p className="text-sm opacity-80">ยอดขายรวม (GMV)</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl shadow-sm text-white">
                  <p className="text-3xl font-bold">
                    {leaderboardData ? leaderboardData.totalOrders.toLocaleString() : '0'}
                  </p>
                  <p className="text-sm opacity-80">จำนวนออเดอร์</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-xl shadow-sm text-white">
                  <p className="text-3xl font-bold">{leaderboardData ? leaderboardData.totalCreators : '0'}</p>
                  <p className="text-sm opacity-80">ครีเอเตอร์</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 rounded-xl shadow-sm text-white">
                  <p className="text-3xl font-bold">
                    ฿{leaderboardData ? ((leaderboardData.totalGMV * 0.1) / 1000).toFixed(0) : '0'}K
                  </p>
                  <p className="text-sm opacity-80">ค่าคอมมิชชั่น (10%)</p>
                </div>
              </div>

              {/* GMV Trend Chart */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-600 p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2 dark:text-white">
                  <TrendingUp className="w-5 h-5 text-emerald-500" /> แนวโน้มยอดขาย
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={gmvTrendData}>
                      <defs>
                        <linearGradient id="gmvGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `฿${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip
                        formatter={(value: number | undefined) => value !== undefined ? [`฿${value.toLocaleString()}`, 'GMV'] : ['N/A', 'GMV']}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                      />
                      <Area type="monotone" dataKey="gmv" stroke="#10B981" strokeWidth={2} fill="url(#gmvGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Upload Section - Inline */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-600 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2 dark:text-white">
                      <Upload className="w-5 h-5 text-blue-500" /> อัพโหลดข้อมูล GMV
                    </h3>
                    {leaderboardData && (
                      <button
                        onClick={fetchLeaderboard}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
                      >
                        <RefreshCw className="w-4 h-4" /> รีเฟรช
                      </button>
                    )}
                  </div>

                  {id && (
                    <GMVUploadForm
                      campaignId={id}
                      onUploadSuccess={fetchLeaderboard}
                    />
                  )}
                </div>

                {/* GMV Leaderboard - Real Data */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-600 p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2 dark:text-white">
                    <Trophy className="w-5 h-5 text-amber-500" /> Leaderboard ยอดขาย
                  </h3>

                  {leaderboardLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                  ) : leaderboardData?.leaderboard?.length > 0 ? (
                    <div className="space-y-3">
                      {leaderboardData.leaderboard.slice(0, 5).map((entry: any, idx: number) => {
                        const percentage = Math.min(100, (entry.gmv / (leaderboardData.leaderboard[0]?.gmv || 1)) * 100);
                        return (
                          <div key={entry.creatorId} className="relative">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-3">
                                <span className="text-lg w-6 dark:text-white">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}</span>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                                  {entry.creatorName?.charAt(0) || '?'}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800 dark:text-white text-sm">{entry.creatorName}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-300">{entry.orders.toLocaleString()} orders</p>
                                </div>
                              </div>
                              <span className="font-bold text-emerald-600">฿{entry.gmv.toLocaleString()}</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden ml-9">
                              <div
                                className={`h-full rounded-full ${idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-400' : 'bg-emerald-400'}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}

                      {leaderboardData.leaderboard.length > 5 && (
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
                          และอีก {leaderboardData.leaderboard.length - 5} คน...
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">ยังไม่มีข้อมูล GMV</p>
                      <p className="text-xs mt-1">อัพโหลดไฟล์ CSV เพื่อดู Leaderboard</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        }

      </div >


      {/* Global Modals */}
      {
        showEndCampaignModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4 dark:text-white">ยืนยันจบแคมเปญ?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                การจบแคมเปญจะทำการ:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>ปิดรับการสมัครและส่งงาน</li>
                  <li>คำนวณรางวัลตามเงื่อนไข (เช่น ยอดขายสูงสุด)</li>
                  <li><strong>สร้างรายการรอจ่ายเงิน (Transaction)</strong> ให้กับผู้ชนะและผู้ที่ได้รับรางวัล</li>
                </ul>
                <br />
                คุณสามารถตรวจสอบและดำเนินการจ่ายเงินได้ที่เมนู "การจ่ายเงิน (Payments)"
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEndCampaignModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleEndCampaign}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  ยืนยันจบแคมเปญ
                </button>
              </div>
            </div>
          </div>
        )
      }

      {
        selectedCreatorId && (
          <CreatorPortfolioModal
            isOpen={true}
            onClose={() => setSelectedCreatorId(null)}
            creatorId={selectedCreatorId}
            campaignId={campaign.id}
          />
        )
      }

      {/* Bulk Approve Applications Modal */}
      <BulkApproveModal
        isOpen={showBulkApproveApplicationsModal}
        onClose={() => setShowBulkApproveApplicationsModal(false)}
        onConfirm={() => {
          pendingApplications.forEach(app => approveApplication(app.id));
          showSuccess(`อนุมัติใบสมัครสำเร็จ ${pendingApplications.length} รายการ`);
        }}
        itemCount={pendingApplications.length}
        items={pendingApplications.map(app => ({
          id: app.id,
          title: `${app.creatorName} (${app.creatorHandle})`,
        }))}
      />

      {/* Bulk Approve Submissions Modal */}
      <BulkApproveModal
        isOpen={showBulkApproveSubmissionsModal}
        onClose={() => setShowBulkApproveSubmissionsModal(false)}
        onConfirm={handleBulkApproveSubmissions}
        itemCount={pendingSubmissions.length}
        items={pendingSubmissions.map(sub => ({
          id: sub.id,
          title: `${sub.creatorName} - Day ${sub.day}`,
        }))}
      />
      {/* Confirm Approve Modal */}
      {
        submissionToApprove && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-sm w-full p-6 border border-gray-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ยืนยันการอนุมัติ?</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                คุณแน่ใจหรือไม่ที่จะอนุมัติงานชิ้นนี้? Creator จะได้รับการแจ้งเตือนทันที
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setSubmissionToApprove(null)}
                  className="flex-1 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={confirmApproveSubmission}
                  className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  ยืนยันอนุมัติ
                </button>
              </div>
            </div>
          </div>
        )
      }
    </DashboardLayout >
  );
}
