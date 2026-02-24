import { useState, InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    error?: string;
    touched?: boolean;
}

export default function PasswordInput({
    error,
    touched,
    className = '',
    ...props
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const hasError = error && touched;

    return (
        <div className="relative">
            <input
                type={showPassword ? 'text' : 'password'}
                className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors dark:bg-slate-800 dark:text-white ${hasError
                        ? 'border-red-500 dark:border-red-400'
                        : 'border-gray-200 dark:border-slate-600 focus:border-primary'
                    } ${className}`}
                {...props}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
            >
                {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                ) : (
                    <Eye className="w-5 h-5" />
                )}
            </button>
        </div>
    );
}
