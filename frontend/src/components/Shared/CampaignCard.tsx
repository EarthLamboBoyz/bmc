import { Link } from 'react-router-dom';
import { Users, Calendar, Wallet, Gift, Clock, TrendingUp, Flame } from 'lucide-react';
import { Campaign } from '../../types';

interface CampaignCardProps {
  campaign: Campaign;
  variant?: 'grid' | 'list' | 'compact';
  viewAs?: 'brand' | 'creator';
}

const statusConfig: Record<string, { bg: string; lightBg: string; label: string; icon: any }> = {
  draft: {
    bg: 'bg-slate-500',
    lightBg: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    label: 'แบบร่าง',
    icon: Clock,
  },
  DRAFT: {
    bg: 'bg-slate-500',
    lightBg: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    label: 'แบบร่าง',
    icon: Clock,
  },
  live: {
    bg: 'bg-emerald-500',
    lightBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    label: 'กำลังดำเนินการ',
    icon: TrendingUp,
  },
  LIVE: {
    bg: 'bg-emerald-500',
    lightBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    label: 'กำลังดำเนินการ',
    icon: TrendingUp,
  },
  completed: {
    bg: 'bg-blue-500',
    lightBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    label: 'จบแล้ว',
    icon: Clock,
  },
  COMPLETED: {
    bg: 'bg-blue-500',
    lightBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    label: 'จบแล้ว',
    icon: Clock,
  },
  cancelled: {
    bg: 'bg-red-500',
    lightBg: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    label: 'ยกเลิก',
    icon: Clock,
  },
  CANCELLED: {
    bg: 'bg-red-500',
    lightBg: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    label: 'ยกเลิก',
    icon: Clock,
  },
};

// Progress Bar Component
function ProgressBar({ current, total, color = 'primary' }: { current: number; total: number; color?: string }) {
  const percentage = Math.min((current / total) * 100, 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500 dark:text-gray-300">ความคืบหน้า</span>
        <span className="font-medium dark:text-gray-300">{percentage.toFixed(0)}%</span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1 text-gray-400 dark:text-gray-500">
        <span>{current.toLocaleString()}</span>
        <span>{total.toLocaleString()}</span>
      </div>
    </div>
  );
}

// Days Left Badge
function DaysLeftBadge({ endDate }: { endDate: string }) {
  const daysLeft = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return null;

  let urgencyClass = 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400';
  let icon = null;

  if (daysLeft <= 7) {
    urgencyClass = 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 animate-pulse';
    icon = <Flame className="w-3 h-3" />;
  } else if (daysLeft <= 30) {
    urgencyClass = 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400';
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${urgencyClass}`}>
      {icon}
      เหลือ {daysLeft} วัน
    </span>
  );
}

export default function CampaignCard({
  campaign,
  variant = 'grid',
  viewAs = 'brand',
}: CampaignCardProps) {
  const linkPath =
    viewAs === 'brand'
      ? `/brand/campaigns/${campaign.id}`
      : `/creator/campaigns/${campaign.id}`;

  const status = statusConfig[campaign.status] || statusConfig.draft;
  const StatusIcon = status.icon;

  const formatBudget = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toString();
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <Link
        to={linkPath}
        className="block bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-600 p-3 hover:shadow-md hover:border-primary/30 transition-all group"
      >
        <div className="flex items-center gap-3">
          <img
            src={campaign.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(campaign.title.charAt(0))}&background=random&color=fff&size=200&font-size=0.5`}
            alt={campaign.title}
            className="w-14 h-14 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm truncate dark:text-white">{campaign.title}</h3>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full text-white ${status.bg}`}>
                {status.label}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-300">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {campaign.currentCreators || 0}
              </span>
              <span className="flex items-center gap-1">
                <Wallet className="w-3 h-3" />
                ฿{formatBudget(campaign.budget || 0)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // List variant
  if (variant === 'list') {
    return (
      <div className="group bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-600 p-4 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
        <div className="relative">
          <img
            src={campaign.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(campaign.title.charAt(0))}&background=random&color=fff&size=200&font-size=0.5`}
            alt={campaign.title}
            className="w-20 h-20 rounded-xl object-cover"
          />
          {campaign.type === 'challenge' && (
            <span className="absolute -top-2 -left-2 bg-gradient-to-r from-secondary to-pink-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow-lg">
              Challenge
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold dark:text-white truncate">{campaign.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${status.lightBg}`}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </span>
            {campaign.endDate && <DaysLeftBadge endDate={campaign.endDate} />}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-1 mb-2">{campaign.description}</p>

          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700 px-2 py-1 rounded-lg">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-medium">{campaign.currentCreators || 0}</span>
              <span className="text-gray-400">creators</span>
            </span>
            <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700 px-2 py-1 rounded-lg">
              <Wallet className="w-4 h-4 text-secondary" />
              <span className="font-medium">฿{formatBudget(campaign.budget || 0)}</span>
            </span>
            <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700 px-2 py-1 rounded-lg">
              <Gift className="w-4 h-4 text-amber-500" />
              <span className="font-medium">{campaign.rewards?.length || 0}</span>
              <span className="text-gray-400">รางวัล</span>
            </span>
          </div>
        </div>

        <Link
          to={linkPath}
          className="px-5 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-xl transition-colors whitespace-nowrap"
        >
          ดูรายละเอียด →
        </Link>
      </div>
    );
  }

  // Grid variant (default)
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
      {/* Image Section */}
      <div className="relative">
        <img
          src={campaign.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(campaign.title.charAt(0))}&background=random&color=fff&size=800&font-size=0.33`}
          alt={campaign.title}
          className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Status Badge */}
        <span
          className={`absolute top-3 right-3 text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 text-white shadow-lg ${status.bg}`}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          {status.label}
        </span>

        {/* Type Badge */}
        {campaign.type === 'challenge' && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-secondary to-pink-600 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            Challenge
          </span>
        )}

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-lg text-white line-clamp-1 drop-shadow-lg">{campaign.title}</h3>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2 mb-4 min-h-[40px]">
          {campaign.description}
        </p>

        {/* Progress Bar for Creators */}
        {campaign.maxCreators && (
          <div className="mb-4">
            <ProgressBar current={campaign.currentCreators || 0} total={campaign.maxCreators} />
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-300">Creators</p>
              <p className="font-semibold text-sm dark:text-white">{campaign.currentCreators || 0}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-300">งบประมาณ</p>
              <p className="font-semibold text-sm dark:text-white">฿{formatBudget(campaign.budget || 0)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Gift className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-300">รางวัล</p>
              <p className="font-semibold text-sm dark:text-white">{campaign.rewards?.length || 0}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-300">สิ้นสุด</p>
              <p className="font-semibold text-sm dark:text-white">
                {campaign.endDate
                  ? new Date(campaign.endDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
                  : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Days Left Badge */}
        {campaign.endDate && ['live', 'LIVE'].includes(campaign.status) && (
          <div className="mb-4">
            <DaysLeftBadge endDate={campaign.endDate} />
          </div>
        )}

        {/* CTA Button */}
        <Link
          to={linkPath}
          className="block w-full py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 transition-all text-center group/btn"
        >
          <span className="flex items-center justify-center gap-2">
            ดูรายละเอียด
            <span className="transform transition-transform group-hover/btn:translate-x-1">→</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
