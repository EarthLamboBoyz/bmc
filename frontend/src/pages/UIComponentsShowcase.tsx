import { useState } from 'react';
import {
  Megaphone,
  Users,
  Wallet,
  TrendingUp,
  Inbox,
  Search,
  Bell,
  Plus,
  Filter,
  Calendar,
  Gift,
  Flame,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import StatsCard from '../components/Shared/StatsCard';
import CampaignCard from '../components/Shared/CampaignCard';
import EmptyState from '../components/EmptyState';
import Skeleton, {
  SkeletonCard,
  SkeletonStatsCard,
  SkeletonCampaignCard,
  DashboardSkeleton
} from '../components/Skeleton';
import { Campaign } from '../types';

// Mock data for showcase
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'สามสิบ ตรา คุณสัมฤทธิ์',
    description: 'แคมเปญรีวิวผลิตภัณฑ์ดูแลผิว 365 วัน สำหรับครีเอเตอร์ที่รักการดูแลตัวเอง',
    image: 'https://ui-avatars.com/api/?name=%E0%B8%AA&background=random&color=fff&size=800&font-size=0.33',
    status: 'live',
    type: 'challenge',
    budget: 500000,
    currentCreators: 127,
    maxCreators: 300,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    rewards: [
      { id: 'r1', type: 'custom', title: 'Cash 5000', budget: 5000, config: {} },
      { id: 'r2', type: 'custom', title: 'Cash 3000', budget: 3000, config: {} }
    ],
    // @ts-ignore
    requirements: { minFollowers: 10000, platforms: ['tiktok'] },
    brandId: 'brand-1',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: '2',
    title: 'Summer Beauty Challenge',
    description: 'รีวิวเครื่องสำอางฤดูร้อน สร้างคอนเทนต์สนุกๆ',
    image: 'https://ui-avatars.com/api/?name=S&background=random&color=fff&size=800&font-size=0.33',
    status: 'live',
    type: 'single',
    budget: 150000,
    currentCreators: 45,
    maxCreators: 100,
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    rewards: [{ id: 'r3', type: 'custom', title: 'Cash 2000', budget: 2000, config: {} }],
    // @ts-ignore
    requirements: { minFollowers: 5000, platforms: ['tiktok', 'instagram'] },
    brandId: 'brand-1',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-01',
  },
  {
    id: '3',
    title: 'Healthy Life 2026',
    description: 'แคมเปญส่งเสริมการใช้ชีวิตแบบ active and healthy',
    image: 'https://ui-avatars.com/api/?name=H&background=random&color=fff&size=800&font-size=0.33',
    status: 'draft',
    type: 'challenge',
    budget: 300000,
    currentCreators: 0,
    maxCreators: 200,
    startDate: '2026-04-01',
    endDate: '2026-09-30',
    rewards: [],
    // @ts-ignore
    requirements: { minFollowers: 15000, platforms: ['tiktok'] },
    brandId: 'brand-1',
    createdAt: '2026-04-01',
    updatedAt: '2026-04-01',
  },
];

export default function UIComponentsShowcase() {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<'default' | 'warning' | 'info' | 'success'>('default');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold gradient-text">UI Components Showcase</h1>
          <p className="text-gray-600 dark:text-gray-400">
            ตัวอย่างการใช้งาน components ที่ปรับปรุงใหม่ทั้งหมด
          </p>
        </div>

        {/* Stats Cards Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Stats Cards
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            การ์ดแสดงสถิติพร้อม trend indicator และ sparkline mini chart
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="แคมเปญที่ดำเนินการ"
              value={5}
              icon={<Megaphone className="w-6 h-6" />}
              trend="up"
              trendValue="12%"
              sparklineData={[2, 3, 5, 4, 6, 5, 7]}
              color="primary"
            />
            <StatsCard
              title="ครีเอเตอร์ทั้งหมด"
              value="1,247"
              icon={<Users className="w-6 h-6" />}
              trend="up"
              trendValue="8.5%"
              sparklineData={[800, 950, 900, 1100, 1050, 1200, 1247]}
              color="success"
            />
            <StatsCard
              title="งบประมาณที่ใช้"
              value="฿375K"
              icon={<Wallet className="w-6 h-6" />}
              trend="down"
              trendValue="3.2%"
              sparklineData={[400, 380, 420, 390, 410, 375, 375]}
              color="warning"
            />
            <StatsCard
              title="รอตรวจสอบ"
              value={23}
              icon={<Bell className="w-6 h-6" />}
              color="danger"
            />
          </div>
        </section>

        {/* Campaign Cards Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-secondary" />
            Campaign Cards (Grid)
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            การ์ดแคมเปญแบบ grid พร้อม progress bar และ urgency badge
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>

        {/* Campaign Cards - List View */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Filter className="w-6 h-6 text-secondary" />
            Campaign Cards (List View)
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            การ์ดแคมเปญแบบ list view เหมาะสำหรับแสดงผลแบบ compact
          </p>

          <div className="space-y-3">
            {mockCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} variant="list" />
            ))}
          </div>
        </section>

        {/* Campaign Cards - Compact View */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-secondary" />
            Campaign Cards (Compact)
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            การ์ดแบบกะทัดรัดสำหรับ sidebar หรือ dropdown
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl">
            {mockCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} variant="compact" />
            ))}
          </div>
        </section>

        {/* Empty States Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Inbox className="w-6 h-6 text-primary" />
            Empty States
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            หน้าว่างพร้อม illustration และ action button
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EmptyState
              icon={Inbox}
              title="ไม่มีแคมเปญ"
              description="คุณยังไม่มีแคมเปญที่สร้างขึ้น เริ่มสร้างแคมเปญแรกของคุณวันนี้"
              actionLabel="สร้างแคมเปญ"
              actionLink="/brand/campaigns/create"
              variant="default"
              size="md"
            />
            <EmptyState
              icon={Search}
              title="ไม่พบผลลัพธ์"
              description="ลองเปลี่ยนคำค้นหาหรือตัวกรองใหม่"
              actionLabel="ล้างตัวกรอง"
              onActionClick={() => { }}
              variant="info"
              size="md"
            />
            <EmptyState
              icon={AlertTriangle}
              title="ระวัง!"
              description="คุณมีงานที่ยังไม่ได้ส่งครบกำหนดวันนี้"
              actionLabel="ดูงานที่ค้าง"
              actionLink="/creator/my-campaigns"
              variant="warning"
              size="md"
            />
            <EmptyState
              icon={CheckCircle}
              title="เสร็จสมบูรณ์!"
              description="แคมเปญของคุณเสร็จสมบูรณ์แล้ว ขอบคุณสำหรับการร่วมงาน"
              variant="success"
              size="md"
            />
          </div>

          {/* Empty State Sizes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ขนาดต่างๆ</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EmptyState
                icon={Inbox}
                title="Small"
                description="ขนาดเล็กสำหรับพื้นที่จำกัด"
                size="sm"
              />
              <EmptyState
                icon={Inbox}
                title="Medium (Default)"
                description="ขนาดมาตรฐานสำหรับทั่วไป"
                size="md"
              />
              <EmptyState
                icon={Inbox}
                title="Large"
                description="ขนาดใหญ่สำหรับหน้าจอเต็ม"
                size="lg"
              />
            </div>
          </div>
        </section>

        {/* Skeleton Loading Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              Skeleton Loading
            </h2>
            <button
              onClick={() => setShowSkeleton(!showSkeleton)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              {showSkeleton ? 'ซ่อน Skeleton' : 'แสดง Skeleton'}
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            สถานะโหลดข้อมูลแบบต่างๆ
          </p>

          {showSkeleton && (
            <div className="space-y-8 animate-fade-in">
              {/* Stats Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SkeletonStatsCard />
                <SkeletonStatsCard />
                <SkeletonStatsCard />
                <SkeletonStatsCard />
              </div>

              {/* Campaign Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <SkeletonCampaignCard />
                <SkeletonCampaignCard />
                <SkeletonCampaignCard />
              </div>

              {/* Custom Skeletons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Custom Skeletons</h3>
                <div className="flex flex-wrap gap-4">
                  <Skeleton width={100} height={20} />
                  <Skeleton width={150} height={20} variant="rounded" />
                  <Skeleton width={50} height={50} variant="circular" />
                  <Skeleton width={100} height={60} variant="rectangular" />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Color Variants */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Gift className="w-6 h-6 text-secondary" />
            Color Variants
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            StatsCard กับสีต่างๆ
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatsCard title="Primary" value={100} color="primary" icon={<Flame className="w-5 h-5" />} />
            <StatsCard title="Secondary" value={100} color="secondary" icon={<Gift className="w-5 h-5" />} />
            <StatsCard title="Success" value={100} color="success" icon={<CheckCircle className="w-5 h-5" />} />
            <StatsCard title="Warning" value={100} color="warning" icon={<AlertTriangle className="w-5 h-5" />} />
            <StatsCard title="Danger" value={100} color="danger" icon={<Flame className="w-5 h-5" />} />
            <StatsCard title="Info" value={100} color="info" icon={<Info className="w-5 h-5" />} />
          </div>
        </section>

        {/* Animations Demo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-primary" />
            Animations
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Tailwind animations ที่เพิ่มเข้ามา
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-primary rounded-xl mx-auto mb-3 animate-fade-in" />
              <p className="text-sm text-gray-600 dark:text-gray-400">fade-in</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-secondary rounded-xl mx-auto mb-3 animate-slide-up" />
              <p className="text-sm text-gray-600 dark:text-gray-400">slide-up</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-success rounded-xl mx-auto mb-3 animate-scale-in" />
              <p className="text-sm text-gray-600 dark:text-gray-400">scale-in</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-warning rounded-xl mx-auto mb-3 animate-bounce-soft" />
              <p className="text-sm text-gray-600 dark:text-gray-400">bounce-soft</p>
            </div>
          </div>
        </section>

        {/* Shadows Demo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Plus className="w-6 h-6 text-primary" />
            Shadow Effects
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Custom shadows ที่เพิ่มเข้ามา
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-soft text-center">
              <p className="font-medium text-gray-900 dark:text-white">shadow-soft</p>
              <p className="text-sm text-gray-500 mt-2">เงาอ่อนนุ่มสำหรับ cards</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-soft-lg text-center">
              <p className="font-medium text-gray-900 dark:text-white">shadow-soft-lg</p>
              <p className="text-sm text-gray-500 mt-2">เงาใหญ่สำหรับ modal</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-glow text-center">
              <p className="font-medium text-gray-900 dark:text-white">shadow-glow</p>
              <p className="text-sm text-gray-500 mt-2">เงาเรืองแสงสี primary</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-200 dark:border-slate-700">
          <p className="text-gray-500 dark:text-gray-400">
            BrandMeetCreator UI Components • Updated 2026
          </p>
        </div>
      </div>
    </div>
  );
}
