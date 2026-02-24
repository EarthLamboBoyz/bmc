import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  onActionClick?: () => void;
  className?: string;
  ctaText?: string;
  ctaAction?: () => void;
  variant?: 'default' | 'warning' | 'info' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionLink,
  onActionClick,
  className = '',
  ctaText,
  ctaAction,
  variant = 'default',
  size = 'md',
}: EmptyStateProps) {
  const effectiveActionLabel = actionLabel || ctaText;
  const effectiveOnActionClick = onActionClick || ctaAction;

  // Size configurations
  const sizeConfig = {
    sm: {
      wrapper: 'py-8 px-4',
      icon: 'w-12 h-12',
      iconSize: 24,
      title: 'text-base',
      desc: 'text-sm',
      padding: 'p-3',
    },
    md: {
      wrapper: 'py-12 px-6',
      icon: 'w-16 h-16',
      iconSize: 32,
      title: 'text-lg',
      desc: 'text-base',
      padding: 'p-4',
    },
    lg: {
      wrapper: 'py-16 px-8',
      icon: 'w-20 h-20',
      iconSize: 40,
      title: 'text-xl',
      desc: 'text-base',
      padding: 'p-5',
    },
  };

  const config = sizeConfig[size];

  // Variant configurations
  const variants = {
    default: {
      bg: 'bg-gray-50/80 dark:bg-slate-800/50',
      border: 'border-gray-200 dark:border-slate-600',
      iconBg: 'bg-white dark:bg-slate-700',
      iconColor: 'text-gray-400 dark:text-gray-500',
      shadow: 'shadow-sm',
      button: 'bg-primary hover:bg-primary-dark',
    },
    warning: {
      bg: 'bg-amber-50/80 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      iconBg: 'bg-amber-100 dark:bg-amber-900/40',
      iconColor: 'text-amber-600 dark:text-amber-400',
      shadow: 'shadow-amber-100 dark:shadow-none',
      button: 'bg-amber-500 hover:bg-amber-600',
    },
    info: {
      bg: 'bg-blue-50/80 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
      shadow: 'shadow-blue-100 dark:shadow-none',
      button: 'bg-blue-500 hover:bg-blue-600',
    },
    success: {
      bg: 'bg-emerald-50/80 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      shadow: 'shadow-emerald-100 dark:shadow-none',
      button: 'bg-emerald-500 hover:bg-emerald-600',
    },
  };

  const v = variants[variant];

  return (
    <div 
      className={`
        flex flex-col items-center justify-center text-center rounded-2xl 
        border border-dashed ${v.border} ${v.bg} ${v.shadow}
        ${config.wrapper} ${className}
        transition-all duration-300 hover:shadow-md
      `}
    >
      {/* Icon Container with floating animation */}
      <div 
        className={`
          ${config.icon} ${v.iconBg} ${config.padding} rounded-2xl 
          flex items-center justify-center shadow-lg mb-5
          transform transition-transform duration-300 hover:scale-110
        `}
      >
        <Icon 
          className={`${v.iconColor}`} 
          size={config.iconSize} 
          strokeWidth={1.5}
        />
      </div>

      {/* Title */}
      <h3 className={`${config.title} font-bold mb-2 text-gray-900 dark:text-gray-100`}>
        {title}
      </h3>

      {/* Description */}
      <p className={`${config.desc} max-w-md mb-6 text-gray-500 dark:text-gray-400 leading-relaxed`}>
        {description}
      </p>

      {/* Action Button */}
      {effectiveActionLabel && (
        actionLink ? (
          <Link
            to={actionLink}
            className={`
              px-6 py-2.5 text-white rounded-xl transition-all duration-200
              font-medium inline-flex items-center gap-2 shadow-lg hover:shadow-xl
              hover:-translate-y-0.5 ${v.button}
            `}
          >
            {effectiveActionLabel}
            <svg 
              className="w-4 h-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        ) : effectiveOnActionClick ? (
          <button
            onClick={effectiveOnActionClick}
            className={`
              px-6 py-2.5 text-white rounded-xl transition-all duration-200
              font-medium inline-flex items-center gap-2 shadow-lg hover:shadow-xl
              hover:-translate-y-0.5 ${v.button}
            `}
          >
            {effectiveActionLabel}
            <svg 
              className="w-4 h-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        ) : null
      )}
    </div>
  );
}
