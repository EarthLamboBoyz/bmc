import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  sparklineData?: number[]; // สำหรับ mini chart
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  isLoading?: boolean;
}

const colorClasses = {
  primary: {
    bg: 'bg-primary/10 text-primary',
    gradient: 'from-primary to-primary-dark',
    sparkline: '#6366f1',
  },
  secondary: {
    bg: 'bg-secondary/10 text-secondary',
    gradient: 'from-secondary to-secondary-dark',
    sparkline: '#ec4899',
  },
  success: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    gradient: 'from-emerald-500 to-emerald-600',
    sparkline: '#10b981',
  },
  warning: {
    bg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    gradient: 'from-amber-500 to-amber-600',
    sparkline: '#f59e0b',
  },
  danger: {
    bg: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    gradient: 'from-red-500 to-red-600',
    sparkline: '#ef4444',
  },
  info: {
    bg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-500 to-blue-600',
    sparkline: '#3b82f6',
  },
};

// Mini Sparkline Component
function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 30;
  const padding = 2;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - ((value - min) / range) * (height - padding * 2) - padding;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="opacity-60">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={points.split(' ').pop()?.split(',')[0]}
        cy={points.split(' ').pop()?.split(',')[1]}
        r="3"
        fill={color}
      />
    </svg>
  );
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  sparklineData,
  color = 'primary',
  isLoading = false,
}: StatsCardProps) {
  const colors = colorClasses[color];

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-600 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-24"></div>
            <div className="h-8 bg-gray-200 dark:bg-slate-600 rounded w-20"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-16"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 dark:bg-slate-600 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-gray-500 dark:text-gray-300 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-2 dark:text-white tracking-tight">{value}</p>

          {/* Trend indicator */}
          {trend && trendValue && (
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${trend === 'up'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                    : trend === 'down'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                  }`}
              >
                {trend === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : trend === 'down' ? (
                  <TrendingDown className="w-3 h-3" />
                ) : (
                  <Minus className="w-3 h-3" />
                )}
                {trendValue}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-400">vs เดือนที่แล้ว</span>
            </div>
          )}
        </div>

        {/* Icon & Sparkline */}
        <div className="flex flex-col items-end gap-2">
          {icon && (
            <div className={`p-3 rounded-xl ${colors.bg} transition-transform group-hover:scale-110 duration-300`}>
              {icon}
            </div>
          )}
          {sparklineData && (
            <MiniSparkline data={sparklineData} color={colors.sparkline} />
          )}
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
    </div>
  );
}
