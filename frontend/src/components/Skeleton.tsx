import { ReactNode } from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export default function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-slate-700';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  // Default heights for text variant
  if (variant === 'text' && !height) {
    style.height = '1em';
  }

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${animationClasses[animation]}
        ${className}
      `}
      style={style}
    />
  );
}

// Pre-built skeleton layouts
export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-600 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton variant="rounded" width={80} height={80} />
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" height={20} />
          <Skeleton width="50%" height={16} />
        </div>
      </div>
      <Skeleton width="100%" height={60} />
      <div className="flex gap-2">
        <Skeleton width={80} height={32} className="rounded-lg" />
        <Skeleton width={80} height={32} className="rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonStatsCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-600">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <Skeleton width={100} height={16} />
          <Skeleton width={80} height={32} />
          <Skeleton width={60} height={14} />
        </div>
        <Skeleton variant="rounded" width={48} height={48} />
      </div>
    </div>
  );
}

export function SkeletonCampaignCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 overflow-hidden">
      <Skeleton width="100%" height={176} variant="rectangular" />
      <div className="p-5 space-y-4">
        <Skeleton width="80%" height={24} />
        <Skeleton width="100%" height={40} />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton height={60} className="rounded-xl" />
          <Skeleton height={60} className="rounded-xl" />
          <Skeleton height={60} className="rounded-xl" />
          <Skeleton height={60} className="rounded-xl" />
        </div>
        <Skeleton width="100%" height={48} className="rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-slate-700/50 p-4 border-b border-gray-100 dark:border-slate-600">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} width={`${100 / columns}%`} height={20} />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-gray-100 dark:divide-slate-600">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4 flex gap-4 items-center">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton 
                key={colIndex} 
                width={`${100 / columns}%`} 
                height={colIndex === 0 ? 40 : 20}
                variant={colIndex === 0 ? 'rounded' : 'text'}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonList({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div 
          key={i} 
          className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-600 flex items-center gap-4"
        >
          <Skeleton variant="rounded" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <Skeleton width="40%" height={18} />
            <Skeleton width="60%" height={14} />
          </div>
          <Skeleton width={80} height={32} className="rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 p-6">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton variant="circular" width={80} height={80} />
        <div className="flex-1 space-y-2">
          <Skeleton width={200} height={24} />
          <Skeleton width={150} height={16} />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton width="100%" height={48} className="rounded-xl" />
        <Skeleton width="100%" height={48} className="rounded-xl" />
        <Skeleton width="100%" height={48} className="rounded-xl" />
      </div>
    </div>
  );
}

// Page-level skeleton layouts
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonStatsCard />
        <SkeletonStatsCard />
        <SkeletonStatsCard />
        <SkeletonStatsCard />
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton width={200} height={28} />
          <SkeletonCampaignCard />
          <SkeletonCampaignCard />
        </div>
        <div className="space-y-4">
          <Skeleton width={150} height={28} />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}

export function CampaignsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton width={200} height={32} />
        <Skeleton width={120} height={40} className="rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <SkeletonCampaignCard />
        <SkeletonCampaignCard />
        <SkeletonCampaignCard />
        <SkeletonCampaignCard />
        <SkeletonCampaignCard />
        <SkeletonCampaignCard />
      </div>
    </div>
  );
}
