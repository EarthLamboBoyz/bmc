import { useEffect, useState } from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcut {
    key: string;
    description: string;
    category: string;
}

const shortcuts: KeyboardShortcut[] = [
    { key: '/', description: 'เปิดการค้นหา', category: 'Navigation' },
    { key: 'Ctrl + K', description: 'Command Palette', category: 'Navigation' },
    { key: 'Esc', description: 'ปิด Modal/Dropdown', category: 'General' },
    { key: 'Shift + Click', description: 'เลือกหลายรายการ', category: 'Selection' },
    { key: 'Ctrl + A', description: 'เลือกทั้งหมด', category: 'Selection' },
    { key: 'Ctrl + D', description: 'ยกเลิกการเลือก', category: 'Selection' },
    { key: '?', description: 'แสดง Keyboard Shortcuts', category: 'Help' },
];

export default function KeyboardShortcutsModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Open shortcuts modal with ?
            if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
                const target = e.target as HTMLElement;
                // Don't trigger if typing in input/textarea
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    setIsOpen(true);
                }
            }
            // Close with Escape
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isOpen]);

    if (!isOpen) return null;

    const categories = Array.from(new Set(shortcuts.map(s => s.category)));

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-600 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Keyboard className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold dark:text-white">Keyboard Shortcuts</h2>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                    {categories.map((category) => (
                        <div key={category} className="mb-6 last:mb-0">
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-3">
                                {category}
                            </h3>
                            <div className="space-y-2">
                                {shortcuts
                                    .filter((s) => s.category === category)
                                    .map((shortcut, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
                                        >
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {shortcut.description}
                                            </span>
                                            <kbd className="px-3 py-1 bg-white dark:bg-slate-600 border border-gray-200 dark:border-slate-500 rounded text-sm font-mono text-gray-700 dark:text-gray-200 shadow-sm">
                                                {shortcut.key}
                                            </kbd>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-600">
                    <p className="text-xs text-gray-500 dark:text-gray-300 text-center">
                        กด <kbd className="px-2 py-0.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded text-xs font-mono">?</kbd> เพื่อเปิดหน้านี้อีกครั้ง
                    </p>
                </div>
            </div>
        </div>
    );
}
