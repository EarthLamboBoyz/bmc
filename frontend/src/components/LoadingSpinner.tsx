import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    text?: string;
}

const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
};

export default function LoadingSpinner({
    size = 'md',
    className = '',
    text
}: LoadingSpinnerProps) {
    return (
        <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
            <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
            {text && (
                <p className="text-sm text-gray-500 dark:text-gray-300">{text}</p>
            )}
        </div>
    );
}

// Full Page Loading
export function PageLoading({ text = 'กำลังโหลด...' }: { text?: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
            <LoadingSpinner size="xl" text={text} />
        </div>
    );
}

// Button Loading
export function ButtonLoading() {
    return <Loader2 className="w-4 h-4 animate-spin" />;
}

// Overlay Loading
export function OverlayLoading({ text }: { text?: string }) {
    return (
        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
            <LoadingSpinner size="lg" text={text} />
        </div>
    );
}
