import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DarkModeToggle({ className = '' }: { className?: string }) {
    const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage first
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) {
            return saved === 'true';
        }
        // Then check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${className}`}
            aria-label="Toggle dark mode"
        >
            {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
                <Moon className="w-5 h-5 text-gray-600" />
            )}
        </button>
    );
}
