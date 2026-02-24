import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

export interface FilterOption {
    id: string;
    label: string;
    value: any;
}

export interface FilterConfig {
    id: string;
    label: string;
    type: 'select' | 'multiselect' | 'range' | 'checkbox';
    options?: FilterOption[];
    min?: number;
    max?: number;
}

interface FilterPanelProps {
    filters: FilterConfig[];
    activeFilters: Record<string, any>;
    onFilterChange: (filterId: string, value: any) => void;
    onClearAll: () => void;
    className?: string;
}

export default function FilterPanel({
    filters,
    activeFilters,
    onFilterChange,
    onClearAll,
    className = '',
}: FilterPanelProps) {
    const [isOpen, setIsOpen] = useState(false);

    const activeFilterCount = Object.keys(activeFilters).filter(
        (key) => activeFilters[key] !== null && activeFilters[key] !== undefined && activeFilters[key] !== ''
    ).length;

    return (
        <div className={`relative ${className}`}>
            {/* Filter Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
                <Filter className="w-4 h-4" />
                <span className="font-medium">ตัวกรอง</span>
                {activeFilterCount > 0 && (
                    <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                        {activeFilterCount}
                    </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Filter Dropdown */}
            {isOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-2xl z-50 max-h-[600px] overflow-y-auto">
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-600 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white">ตัวกรอง</h3>
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={onClearAll}
                                    className="text-sm text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                                >
                                    <X className="w-3 h-3" />
                                    ล้างทั้งหมด
                                </button>
                            )}
                        </div>

                        {/* Filter Options */}
                        <div className="p-4 space-y-4">
                            {filters.map((filter) => (
                                <div key={filter.id}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {filter.label}
                                    </label>

                                    {/* Select */}
                                    {filter.type === 'select' && (
                                        <select
                                            value={activeFilters[filter.id] || ''}
                                            onChange={(e) => onFilterChange(filter.id, e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        >
                                            <option value="">ทั้งหมด</option>
                                            {filter.options?.map((option) => (
                                                <option key={option.id} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    )}

                                    {/* Multi-select (Checkboxes) */}
                                    {filter.type === 'multiselect' && (
                                        <div className="space-y-2">
                                            {filter.options?.map((option) => (
                                                <label
                                                    key={option.id}
                                                    className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={(activeFilters[filter.id] || []).includes(option.value)}
                                                        onChange={(e) => {
                                                            const current = activeFilters[filter.id] || [];
                                                            const newValue = e.target.checked
                                                                ? [...current, option.value]
                                                                : current.filter((v: any) => v !== option.value);
                                                            onFilterChange(filter.id, newValue.length > 0 ? newValue : null);
                                                        }}
                                                        className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary/20"
                                                    />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                                        {option.label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {/* Range */}
                                    {filter.type === 'range' && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    placeholder="ต่ำสุด"
                                                    value={activeFilters[filter.id]?.min || ''}
                                                    onChange={(e) =>
                                                        onFilterChange(filter.id, {
                                                            ...activeFilters[filter.id],
                                                            min: e.target.value ? Number(e.target.value) : null,
                                                        })
                                                    }
                                                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                />
                                                <span className="text-gray-400">-</span>
                                                <input
                                                    type="number"
                                                    placeholder="สูงสุด"
                                                    value={activeFilters[filter.id]?.max || ''}
                                                    onChange={(e) =>
                                                        onFilterChange(filter.id, {
                                                            ...activeFilters[filter.id],
                                                            max: e.target.value ? Number(e.target.value) : null,
                                                        })
                                                    }
                                                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Checkbox */}
                                    {filter.type === 'checkbox' && (
                                        <label className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={activeFilters[filter.id] || false}
                                                onChange={(e) => onFilterChange(filter.id, e.target.checked || null)}
                                                className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary/20"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                เปิดใช้งาน
                                            </span>
                                        </label>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 border-t border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 sticky bottom-0">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                            >
                                ใช้ตัวกรอง
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// Active Filter Tags Component
export function ActiveFilterTags({
    filters,
    activeFilters,
    onRemove,
}: {
    filters: FilterConfig[];
    activeFilters: Record<string, any>;
    onRemove: (filterId: string) => void;
}) {
    const activeFilterEntries = Object.entries(activeFilters).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ''
    );

    if (activeFilterEntries.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {activeFilterEntries.map(([filterId, value]) => {
                const filter = filters.find((f) => f.id === filterId);
                if (!filter) return null;

                let displayValue = '';
                if (filter.type === 'select') {
                    const option = filter.options?.find((o) => o.value === value);
                    displayValue = option?.label || value;
                } else if (filter.type === 'multiselect') {
                    displayValue = `${value.length} รายการ`;
                } else if (filter.type === 'range') {
                    displayValue = `${value.min || '∞'} - ${value.max || '∞'}`;
                } else if (filter.type === 'checkbox') {
                    displayValue = 'เปิดใช้งาน';
                }

                return (
                    <button
                        key={filterId}
                        onClick={() => onRemove(filterId)}
                        className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                    >
                        <span className="font-medium">{filter.label}:</span>
                        <span>{displayValue}</span>
                        <X className="w-3 h-3 ml-1" />
                    </button>
                );
            })}
        </div>
    );
}
