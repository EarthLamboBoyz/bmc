import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Plus, Filter, Grid, List } from 'lucide-react';
import { DashboardLayout } from '../../components/Layout';
import { CampaignCard } from '../../components/Shared';
// import { useData } from '../../context/DataContext'; // Deprecated for this page
import { campaignService } from '../../services/campaign.service';
import SearchBar from '../../components/SearchBar';
import { useSearch } from '../../hooks/useSearch';
import EmptyState from '../../components/EmptyState';

export default function BrandCampaigns() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const data = await campaignService.getCampaigns(token, undefined, true);
        console.log('Fetched Campaigns for Brand:', data);
        setCampaigns(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // Filter by status first
  const statusFilteredCampaigns = campaigns.filter(campaign => {
    if (statusFilter === 'all') return true;
    return campaign.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  // Use fuzzy search
  const { searchQuery, setSearchQuery, searchResults } = useSearch({
    items: statusFilteredCampaigns,
    searchKeys: ['title', 'description', 'brandName'],
    threshold: 0.3,
  });

  // Create suggestions for autocomplete
  const suggestions = searchResults.slice(0, 5).map(campaign => ({
    id: campaign.id,
    title: campaign.title,
    subtitle: `${campaign.brand?.companyName || 'Brand'} • ${campaign.status}`,
  }));

  return (
    <DashboardLayout>
      {/* Header Row - Title + Create Button */}
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">แคมเปญ</h1>
          <p className="text-gray-500 dark:text-gray-300">จัดการแคมเปญทั้งหมดของคุณ</p>
        </div>
      </div>

      {/* Filters + Create Button Row */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Top Row: Search + Filters + View Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Search */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="ค้นหาแคมเปญ..."
              suggestions={suggestions}
              onSelectSuggestion={(id) => navigate(`/brand/campaigns/${id}`)}
              className="flex-1"
            />

            {/* Right Controls */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400 dark:text-gray-500 hidden sm:block" />
                <select
                  value={statusFilter}
                  onChange={(e) => setSearchParams({ status: e.target.value })}
                  className="px-3 py-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                >
                  <option value="all" className="dark:bg-slate-700">ทั้งหมด</option>
                  <option value="draft" className="dark:bg-slate-700">แบบร่าง</option>
                  <option value="live" className="dark:bg-slate-700">กำลังดำเนินการ</option>
                  <option value="completed" className="dark:bg-slate-700">จบแล้ว</option>
                  <option value="cancelled" className="dark:bg-slate-700">ยกเลิก</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center border border-gray-200 dark:border-slate-600 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Create Button - Desktop */}
              <Link
                to="/brand/campaigns/create"
                className="hidden lg:flex px-4 py-2 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                สร้างแคมเปญใหม่
              </Link>
            </div>
          </div>

          {/* Create Button - Mobile/Tablet */}
          <Link
            to="/brand/campaigns/create"
            className="lg:hidden px-4 py-2.5 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            สร้างแคมเปญใหม่
          </Link>
        </div>
      </div>

      {/* Campaigns */}
      {searchResults.length === 0 ? (
        <EmptyState
          icon={searchQuery ? Filter : Plus}
          title={searchQuery ? 'ไม่พบแคมเปญที่ค้นหา' : 'ยังไม่มีแคมเปญ'}
          description={searchQuery ? `ไม่พบผลลัพธ์สำหรับ "${searchQuery}"` : 'เริ่มสร้างแคมเปญแรกของคุณเพื่อโปรโมทสินค้า'}
          actionLabel={searchQuery ? undefined : "สร้างแคมเปญใหม่"}
          actionLink="/brand/campaigns/create"
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} viewAs="brand" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {searchResults.map(campaign => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              variant="list"
              viewAs="brand"
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
