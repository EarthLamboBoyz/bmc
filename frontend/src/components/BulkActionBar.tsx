import { X, CheckCircle, XCircle } from 'lucide-react';

interface BulkActionBarProps {
    selectedCount: number;
    onApproveSelected?: () => void;
    onRejectSelected?: () => void;
    onClearSelection: () => void;
    approveLabel?: string;
    rejectLabel?: string;
}

export default function BulkActionBar({
    selectedCount,
    onApproveSelected,
    onRejectSelected,
    onClearSelection,
    approveLabel = 'อนุมัติที่เลือก',
    rejectLabel = 'ปฏิเสธที่เลือก',
}: BulkActionBarProps) {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4">
                {/* Selection Count */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {selectedCount}
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                        เลือกแล้ว {selectedCount} รายการ
                    </span>
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-gray-200 dark:bg-slate-600" />

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {onApproveSelected && (
                        <button
                            onClick={onApproveSelected}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium text-sm"
                        >
                            <CheckCircle className="w-4 h-4" />
                            {approveLabel} ({selectedCount})
                        </button>
                    )}

                    {onRejectSelected && (
                        <button
                            onClick={onRejectSelected}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2 font-medium text-sm"
                        >
                            <XCircle className="w-4 h-4" />
                            {rejectLabel} ({selectedCount})
                        </button>
                    )}

                    <button
                        onClick={onClearSelection}
                        className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2 font-medium text-sm"
                    >
                        <X className="w-4 h-4" />
                        ยกเลิก
                    </button>
                </div>
            </div>
        </div>
    );
}
