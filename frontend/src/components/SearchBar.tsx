import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    suggestions?: Array<{ id: string; title: string; subtitle?: string }>;
    onSelectSuggestion?: (id: string) => void;
    className?: string;
}

export default function SearchBar({
    value,
    onChange,
    placeholder = 'ค้นหา...',
    suggestions = [],
    onSelectSuggestion,
    className = '',
}: SearchBarProps) {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleClear = () => {
        onChange('');
        setShowSuggestions(false);
    };

    const handleSelectSuggestion = (id: string) => {
        setShowSuggestions(false);
        if (onSelectSuggestion) {
            onSelectSuggestion(id);
        }
    };

    const showDropdown = showSuggestions && value.trim().length > 0 && suggestions.length > 0;

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />

            <input
                type="text"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:placeholder-gray-400"
            />

            {value && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            {/* Autocomplete Dropdown */}
            {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg max-h-80 overflow-y-auto z-50">
                    <div className="p-2">
                        <div className="text-xs text-gray-500 dark:text-gray-300 px-3 py-2">
                            พบ {suggestions.length} ผลลัพธ์
                        </div>
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion.id}
                                onClick={() => handleSelectSuggestion(suggestion.id)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <div className="font-medium text-gray-900 dark:text-white">
                                    {suggestion.title}
                                </div>
                                {suggestion.subtitle && (
                                    <div className="text-sm text-gray-500 dark:text-gray-300">
                                        {suggestion.subtitle}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
