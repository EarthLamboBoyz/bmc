import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  Flame,
  DollarSign,
  Trophy,
  TrendingUp,
  Calendar,
  Plus,
  ArrowRight,
  Zap
} from 'lucide-react';
import { DashboardLayout } from '../../components/Layout';
import CampaignCardCompact from '../../components/Creator/CampaignCardCompact';
import RewardsPanel from '../../components/Creator/RewardsPanel';
import SubmitWorkModal from '../../components/Creator/SubmitWorkModal';
import StatsCard from '../../components/Shared/StatsCard';
import EmptyState from '../../components/EmptyState';
import { DashboardSkeleton } from '../../components/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/dashboard.service';
import { campaignService } from '../../services/campaign.service';
import { transactionService, Transaction } from '../../services/transaction.service';
import { Campaign } from '../../types';

const mockRewards = {
  totalMin: 8500,
  totalMax: 13500,
  campaignCount: 2,
  guaranteed: [],
  possible: [],
  difficult: [],
  recommendations: [],
};

export default function CreatorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingEarnings: 0,
    activeCampaigns: 0,
    totalVideos: 0
  });

  const [myCampaigns, setMyCampaigns] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const statsData = await dashboardService.getCreatorStats();
          if (statsData.success) {
            setStats(statsData.data);
          }

          // Only fetch campaigns creator is APPROVED for
          const approvedCampaigns = await campaignService.getMyCampaigns(token);
          setMyCampaigns(approvedCampaigns.slice(0, 3));

          // Fetch real pending payments
          try {
            const payments = await transactionService.getCreatorPendingPayments();
            setRecentPayments(Array.isArray(payments) ? payments.slice(0, 3) : []);
          } catch {
            // Payment endpoint may not have data yet, that's ok
            setRecentPayments([]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmitClick = (campaignId: string) => {
    const campaign = myCampaigns.find(c => c.id === campaignId);
    if (campaign) {
      setSelectedCampaign(campaign);
      setSubmitModalOpen(true);
    }
  };

  const handleSubmitSuccess = () => {
    console.log('Submit successful!');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-fade-in">
          <DashboardSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <DashboardLayout>
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-2xl">👋</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold dark:text-white">
                สวัสดี, {user?.name || 'Creator'}!
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                ยินดีต้อนรับกลับมา มาดูความคืบหน้าของคุณกัน
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="แคมเปญที่เข้าร่วม"
            value={stats.activeCampaigns}
            icon={<Video className="w-6 h-6" />}
            trend="up"
            trendValue="2"
            color="primary"
          />
          <StatsCard
            title="รายได้รวม"
            value={`฿${stats.totalEarnings.toLocaleString()}`}
            icon={<DollarSign className="w-6 h-6" />}
            trend="up"
            trendValue="15%"
            sparklineData={[5000, 7000, 6500, 8000, 7500, 9000, stats.totalEarnings]}
            color="success"
          />
          <StatsCard
            title="วิดีโอที่ส่ง"
            value={stats.totalVideos}
            icon={<TrendingUp className="w-6 h-6" />}
            color="info"
          />
          <StatsCard
            title="รอโอนเงิน"
            value={`฿${stats.pendingEarnings.toLocaleString()}`}
            icon={<Flame className="w-6 h-6" />}
            color="warning"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Campaigns Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Campaigns */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold dark:text-white">แคมเปญแนะนำ</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {myCampaigns.length} แคมเปญที่เหมาะกับคุณ
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/creator/campaigns')}
                  className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1 transition-colors"
                >
                  ดูทั้งหมด
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {myCampaigns.length > 0 ? (
                <div className="space-y-4">
                  {myCampaigns.map((campaign, index) => (
                    <div
                      key={campaign.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CampaignCardCompact
                        campaign={{
                          ...campaign,
                          name: campaign.title,
                          daysRemaining: 10,
                          totalBudget: campaign.budget,
                          currentDay: 1,
                          submittedToday: false,
                          currentStreak: 0,
                          currentRank: 0,
                          totalParticipants: 0,
                          gmv: 0
                        }}
                        onSubmitClick={() => handleSubmitClick(campaign.id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="ไม่มีแคมเปญแนะนำ"
                  description="ยังไม่มีแคมเปญที่เหมาะกับคุณในขณะนี้ ลองกลับมาดูใหม่ภายหลัง"
                  actionLabel="หาแคมเปญเอง"
                  actionLink="/creator/campaigns"
                  size="sm"
                />
              )}

              <button
                onClick={() => navigate('/creator/campaigns')}
                className="w-full mt-4 py-4 border-2 border-dashed border-gray-200 dark:border-slate-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-all flex items-center justify-center gap-2 group"
              >
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                ดูแคมเปญทั้งหมด
              </button>
            </div>

            {/* Quick Stats / Recent Activity */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 rounded-2xl border border-primary/10 p-6">
              <h3 className="font-bold text-lg mb-4 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                ความสำเร็จล่าสุด
              </h3>

              {stats.totalEarnings > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium dark:text-white">ได้รับรางวัล Top Volume!</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">สามสิบ ตรา คุณสัมฤทธิ์ • 2 วันที่แล้ว</p>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">+฿5,000</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Trophy className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">ยังไม่มีรางวัล</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">เข้าร่วมแคมเปญเพื่อชิงรางวัล!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Earnings Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
              <h3 className="font-bold text-lg mb-4 dark:text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                รายได้ของฉัน
              </h3>

              {stats.pendingEarnings > 0 ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">ยอดเงินรอโอน</span>
                      <span className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded-full text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-700">
                        รอการโอนจาก Brand
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      ฿{stats.pendingEarnings.toLocaleString()}
                    </p>
                    <button
                      onClick={() => navigate('/creator/earnings')}
                      className="w-full mt-3 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm"
                    >
                      ตรวจสอบสถานะการโอน
                    </button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">รายการล่าสุด</h4>
                    {recentPayments.length > 0 ? (
                      recentPayments.map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                          onClick={() => navigate('/creator/earnings')}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.status === 'CONFIRMED'
                              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                              : tx.status === 'PAID'
                                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                                : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
                            }`}>
                            <Trophy className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm dark:text-white truncate">{tx.campaignName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {tx.status === 'CONFIRMED' ? '✅ ยืนยันแล้ว' : tx.status === 'PAID' ? '💳 โอนแล้ว' : '⏳ รอโอน'}
                            </p>
                          </div>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">+฿{tx.amount.toLocaleString()}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-3">ยังไม่มีรายการ</p>
                    )}
                  </div>

                  <button
                    onClick={() => navigate('/creator/earnings')}
                    className="w-full py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-white rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    ดูประวัติทั้งหมด
                  </button>
                </div>
              ) : (
                <EmptyState
                  icon={DollarSign}
                  title="ยังไม่มีรายได้"
                  description="เข้าร่วมแคมเปญและส่งงานเพื่อเริ่มสร้างรายได้"
                  actionLabel="หาแคมเปญ"
                  actionLink="/creator/campaigns"
                  size="sm"
                  variant="default"
                />
              )}
            </div>

            {/* Rewards Panel */}
            <RewardsPanel rewards={mockRewards} />

            {/* Streak Card */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Streak ปัจจุบัน</p>
                  <p className="text-2xl font-bold">12 วัน 🔥</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">ไปสู่ 20 วัน</span>
                  <span className="font-medium">60%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all" style={{ width: '60%' }} />
                </div>
                <p className="text-xs text-white/70 mt-2">
                  ส่งอีก 8 วันเพื่อรับรางวัล Streak 20 วัน!
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* Submit Modal */}
      {selectedCampaign && (
        <SubmitWorkModal
          isOpen={submitModalOpen}
          onClose={() => setSubmitModalOpen(false)}
          campaignId={selectedCampaign.id}
          campaignName={selectedCampaign.title || 'Campaign'}
          currentDay={1}
          onSuccess={handleSubmitSuccess}
        />
      )}
    </>
  );
}
