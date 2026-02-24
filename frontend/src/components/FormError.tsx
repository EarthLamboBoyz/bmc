import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
    error?: string;
    touched?: boolean;
    className?: string;
}

export function FormError({ error, touched, className = '' }: FormErrorProps) {
    if (!error || !touched) return null;

    return (
        <div className={`flex items-center gap-1 mt-1 text-sm text-red-600 dark:text-red-400 ${className}`}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
        </div>
    );
}

interface PasswordStrengthProps {
    password: string;
    show?: boolean;
}

export function PasswordStrength({ password, show = true }: PasswordStrengthProps) {
    if (!show || !password) return null;

    const getStrength = () => {
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[!@#$%^&*]/.test(password)) score++;

        if (score <= 2) return { label: 'อ่อนแอ', color: 'bg-red-500', width: '33%' };
        if (score <= 4) return { label: 'ปานกลาง', color: 'bg-yellow-500', width: '66%' };
        return { label: 'แข็งแรง', color: 'bg-green-500', width: '100%' };
    };

    const strength = getStrength();

    return (
        <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-300">ความแข็งแรงของรหัสผ่าน:</span>
                <span className={`text-xs font-medium ${strength.color === 'bg-red-500' ? 'text-red-600 dark:text-red-400' :
                        strength.color === 'bg-yellow-500' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-green-600 dark:text-green-400'
                    }`}>
                    {strength.label}
                </span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                    className={`h-full ${strength.color} transition-all duration-300`}
                    style={{ width: strength.width }}
                />
            </div>
        </div>
    );
}

interface ValidationMessageProps {
    show?: boolean;
}

export function PasswordRequirements({ show = true }: ValidationMessageProps) {
    if (!show) return null;

    const requirements = [
        'อย่างน้อย 8 ตัวอักษร',
        'มีตัวพิมพ์ใหญ่และเล็ก',
        'มีตัวเลข',
        'มีอักขระพิเศษ (!@#$%^&*)',
    ];

    return (
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-2">
                รหัสผ่านต้องประกอบด้วย:
            </p>
            <ul className="space-y-1">
                {requirements.map((req, index) => (
                    <li key={index} className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-1">
                        <span className="w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
                        {req}
                    </li>
                ))}
            </ul>
        </div>
    );
}
