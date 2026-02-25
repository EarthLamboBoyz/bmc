import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Check,
  Clock,
  Users,
  DollarSign,
  Flame,
  Gift,
  TrendingUp,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { DashboardLayout } from '../../components/Layout';
import EmptyState from '../../components/EmptyState';
import { CampaignsSkeleton } from '../../components/Skeleton';
import { campaignService } from '../../services/campaign.service';

// Types
interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  budget: number;
  currentCreators: number;
  maxCreators?: number;
  startDate: string;
  endDate: string;
  status: string;
  type: 'single' | 'challenge';
  platforms: string[];
  categories: string[];
  rewards?: { type: string; amount: number }[];
}

export default function CreatorCampaigns() {
  const [searchParams] = useSearchParams();
  const filterType = searchParams.get('filter') || 'all';

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const platforms = [
    { id: 'TikTok', icon: '🔥', color: 'bg-black text-white' },
    { id: 'Instagram', icon: '📷', color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' },
    { id: 'YouTube', icon: '▶️', color: 'bg-red-600 text-white' },
    { id: 'Facebook', icon: '👤', color: 'bg-blue-600 text-white' },
  ];

  const categories = ['Beauty', 'Fashion', 'Food', 'Tech', 'Lifestyle', 'Gaming', 'Health', 'Fitness'];

  // Fetch campaigns from API
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const data = await campaignService.getCampaigns(token);
        setCampaigns(data);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
    if (campaign.status?.toLowerCase() !== 'live') return false;

    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'challenge' && campaign.type === 'challenge') ||
      (filterType === 'recommended' && (campaign.categories || []).some((c: string) => ['Beauty', 'Health'].includes(c)));
    const matchesPlatform =
      selectedPlatforms.length === 0 ||
      (campaign.platforms || []).some((p: string) => selectedPlatforms.includes(p));
    const matchesCategory =
      selectedCategories.length === 0 ||
      (campaign.categories || []).some((c: string) => selectedCategories.includes(c));

    return matchesSearch && matchesFilter && matchesPlatform && matchesCategory;
  });

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedPlatforms([]);
    setSelectedCategories([]);
  };

  const getDaysRemaining = (endDate: string) => {
    const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const formatBudget = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    return amount.toString();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-fade-in">
          <div className="mb-6">
            <h1 className="text-2xl font-bold dark:text-white">🔍 ค้นหาแคมเปญ</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              ค้นหาแคมเปญที่เหมาะกับคุณ
            </p>
          </div>
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
            <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
              <Search className="w-6 h-6 text-primary" />
              ค้นหาแคมเปญ
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              ค้นหาแคมเปญที่เหมาะกับคุณจาก {campaigns.length} รายการ
            </p>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {[
              { id: 'all', label: 'ทั้งหมด', icon: Sparkles },
              { id: 'challenge', label: 'Challenge', icon: Flame },
              { id: 'recommended', label: 'แนะนำ', icon: TrendingUp },
            ].map((filter) => {
              const Icon = filter.icon;
              const isActive = filterType === filter.id;
              return (
                <Link
                  key={filter.id}
                  to={`/creator/campaigns?filter=${filter.id}`}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อแคมเปญ, แบรนด์..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl text-gray-700 dark:text-gray-300 font-medium"
            >
              <Filter className="w-4 h-4" />
              ตัวกรอง
              {(selectedPlatforms.length + selectedCategories.length) > 0 && (
                <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                  {selectedPlatforms.length + selectedCategories.length}
                </span>
              )}
            </button>

            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-slate-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-600 text-primary shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                  }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'list'
                    ? 'bg-white dark:bg-slate-600 text-primary shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                  }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>

          {/* Expandable Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 space-y-4`}>
            {/* Platform Filter */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Platform</p>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${selectedPlatforms.includes(platform.id)
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                  >
                    {selectedPlatforms.includes(platform.id) && <Check className="w-3.5 h-3.5" />}
                    <span>{platform.icon}</span>
                    {platform.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">หมวดหมู่</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategories.includes(category)
                        ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                  >
                    {selectedCategories.includes(category) && <Check className="w-3.5 h-3.5 inline mr-1" />}
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters */}
            {(selectedPlatforms.length > 0 || selectedCategories.length > 0) && (
              <div className="flex items-center gap-2 pt-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">ตัวกรองที่ใช้:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedPlatforms.map(p => (
                    <span key={p} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg">
                      {p}
                      <button onClick={() => togglePlatform(p)} className="hover:text-primary-dark">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {selectedCategories.map(c => (
                    <span key={c} className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-lg">
                      {c}
                      <button onClick={() => toggleCategory(c)} className="hover:text-secondary-dark">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline ml-2"
                >
                  ล้างทั้งหมด
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            พบ <span className="font-bold text-gray-900 dark:text-white">{filteredCampaigns.length}</span> แคมเปญ
          </p>
        </div>

        {/* Campaigns Grid/List */}
        {filteredCampaigns.length === 0 ? (
          <EmptyState
            icon={Search}
            title="ไม่พบแคมเปญ"
            description={
              searchQuery || selectedPlatforms.length > 0 || selectedCategories.length > 0
                ? 'ลองเปลี่ยนคำค้นหาหรือล้างตัวกรอง'
                : 'ยังไม่มีแคมเปญที่เปิดรับสมัครในขณะนี้ กรุณากลับมาตรวจสอบภายหลัง'
            }
            actionLabel={
              searchQuery || selectedPlatforms.length > 0 || selectedCategories.length > 0
                ? 'ล้างตัวกรอง'
                : undefined
            }
            onActionClick={
              searchQuery || selectedPlatforms.length > 0 || selectedCategories.length > 0
                ? clearAllFilters
                : undefined
            }
            size="lg"
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign, index) => (
              <Link
                key={campaign.id}
                to={`/creator/campaigns/${campaign.id}`}
                className="group block animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={campaign.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60'}
                      alt={campaign.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Type Badge */}
                    {campaign.type === 'challenge' && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                        <Flame className="w-3.5 h-3.5" />
                        Challenge
                      </div>
                    )}

                    {/* Match Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full shadow-lg">
                      <Check className="w-3 h-3" />
                      เหมาะกับคุณ
                    </div>

                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-lg line-clamp-2 drop-shadow-lg group-hover:text-primary-light transition-colors">
                        {campaign.title}
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Stats Row */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <span className="font-medium">{getDaysRemaining(campaign.endDate)} วัน</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                          <Users className="w-3.5 h-3.5 text-purple-500" />
                        </div>
                        <span className="font-medium">{campaign.currentCreators || 0} คน</span>
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">งบประมาณ</p>
                        <p className="font-bold text-emerald-700 dark:text-emerald-400">฿{formatBudget(campaign.budget || 0)}</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {(campaign.platforms || []).slice(0, 2).map((platform: string) => (
                        <span key={platform} className="px-2.5 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs rounded-lg font-medium">
                          {platform}
                        </span>
                      ))}
                      {(campaign.categories || []).slice(0, 2).map((category: string) => (
                        <span key={category} className="px-2.5 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light text-xs rounded-lg font-medium">
                          {category}
                        </span>
                      ))}
                      {((campaign.platforms?.length || 0) + (campaign.categories?.length || 0)) > 4 && (
                        <span className="px-2.5 py-1 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 text-xs rounded-lg">
                          +{((campaign.platforms?.length || 0) + (campaign.categories?.length || 0)) - 4}
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">ดูรายละเอียด</span>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                          <ChevronRight className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCampaigns.map((campaign, index) => (
              <Link
                key={campaign.id}
                to={`/creator/campaigns/${campaign.id}`}
                className="group block animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="relative w-full sm:w-72 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
                      <img
                        src={campaign.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60'}
                        alt={campaign.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/60 to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {campaign.type === 'challenge' && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                            <Flame className="w-3 h-3" />
                            Challenge
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full shadow-lg">
                          <Check className="w-3 h-3" />
                          เหมาะกับคุณ
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 flex flex-col">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors dark:text-white">
                        {campaign.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {campaign.description}
                      </p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">เหลือ</p>
                            <p className="font-bold text-sm dark:text-white">{getDaysRemaining(campaign.endDate)} วัน</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                            <Users className="w-4 h-4 text-purple-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">ผู้เข้าร่วม</p>
                            <p className="font-bold text-sm dark:text-white">{campaign.currentCreators || 0} คน</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">งบประมาณ</p>
                            <p className="font-bold text-sm text-emerald-600">฿{formatBudget(campaign.budget || 0)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {(campaign.platforms || []).map((platform: string) => (
                          <span key={platform} className="px-2.5 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs rounded-lg">
                            {platform}
                          </span>
                        ))}
                        {(campaign.categories || []).map((category: string) => (
                          <span key={category} className="px-2.5 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light text-xs rounded-lg">
                            {category}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">ดูรายละเอียด</span>
                        <div className="flex items-center gap-2 text-primary font-medium">
                          <span className="text-sm">สมัครเลย</span>
                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
