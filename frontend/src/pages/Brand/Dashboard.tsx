import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Megaphone,
  Users,
  Wallet,
  TrendingUp,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { DashboardLayout } from '../../components/Layout';
import { StatsCard, CampaignCard } from '../../components/Shared';
import { campaignService } from '../../services/campaign.service';
import { dashboardService } from '../../services/dashboard.service';
import { Campaign } from '../../types';

import { useAuth } from '../../context/AuthContext';

export default function BrandDashboard() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalCreators: 0,
    totalSpent: 0,
    pendingApplications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Fetch campaigns
          const campaignsData = await campaignService.getCampaigns(token, undefined, true);
          setCampaigns(campaignsData);

          // Fetch stats
          const statsData = await dashboardService.getBrandStats();
          if (statsData.success) {
            setStats(statsData.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeCampaigns = campaigns.filter(c => c.status?.toLowerCase() === 'live');

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">สวัสดี, {user?.name || 'Brand'}</h1>
          <p className="text-gray-500 dark:text-gray-300">ภาพรวมแคมเปญและผลงานทั้งหมด</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="แคมเปญที่กำลังทำ"
          value={stats.activeCampaigns}
          icon={<Megaphone className="w-6 h-6" />}
          color="primary"
          trend="neutral"
          trendValue="Live Now"
        />
        <StatsCard
          title="Creators ที่ร่วมงาน"
          value={stats.totalCreators}
          icon={<Users className="w-6 h-6" />}
          color="secondary"
          trend="neutral"
          trendValue="Approved"
        />
        <StatsCard
          title="งบประมาณที่ใช้ไป"
          value={`฿${(stats.totalSpent).toLocaleString()}`}
          icon={<Wallet className="w-6 h-6" />}
          color="success"
        />
      </div>

      {/* Active Campaigns */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:text-white">แคมเปญของคุณ</h2>
          <Link
            to="/brand/campaigns"
            className="text-primary hover:underline flex items-center gap-1 text-sm"
          >
            ดูทั้งหมด
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10">กำลังโหลด...</div>
        ) : activeCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} viewAs="brand" />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
            <p className="text-gray-500 dark:text-gray-400 mb-4">คุณยังไม่มีแคมเปญที่กำลังดำเนินการ</p>
            <Link to="/brand/campaigns/create" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              สร้างแคมเปญเลย
            </Link>
          </div>
        )}
      </div>

      {/* Quick Stats - Using Placeholders for now until Analytics API is ready */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 p-6">
        <h2 className="font-semibold mb-4 dark:text-white">ภาพรวมประสิทธิภาพ (Coming Soon)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-bold dark:text-white">-</p>
            <p className="text-sm text-gray-500 dark:text-gray-300">GMV รวม</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-2">
              <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold dark:text-white">-</p>
            <p className="text-sm text-gray-500 dark:text-gray-300">การเข้าถึงรวม</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-2">
              <Megaphone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-bold dark:text-white">-</p>
            <p className="text-sm text-gray-500 dark:text-gray-300">วิดีโอทั้งหมด</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <p className="text-2xl font-bold dark:text-white">-</p>
            <p className="text-sm text-gray-500 dark:text-gray-300">อัตราความสำเร็จ</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
