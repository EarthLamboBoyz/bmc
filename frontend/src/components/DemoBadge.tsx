interface DemoBadgeProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
};

export default function DemoBadge({ className = '', size = 'md' }: DemoBadgeProps) {
    return (
        <span className={`${sizeClasses[size]} bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 rounded-full font-semibold ${className}`}>
            🎭 DEMO
        </span>
    );
}

// Demo Banner Component
export function DemoBanner() {
    return (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-center">
            <p className="text-sm font-medium">
                🎭 <strong>โหมดทดสอบ</strong> - ข้อมูลทั้งหมดเป็นข้อมูลตัวอย่างเท่านั้น
            </p>
        </div>
    );
}
