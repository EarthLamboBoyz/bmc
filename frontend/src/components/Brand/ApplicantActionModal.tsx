import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Fragment } from 'react';

interface ApplicantActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    actionType: 'approve' | 'reject';
    isLoading?: boolean;
    creatorName?: string;
}

export default function ApplicantActionModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    actionType,
    isLoading = false,
    creatorName,
}: ApplicantActionModalProps) {
    if (!isOpen) return null;

    const isApprove = actionType === 'approve';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-sm w-full overflow-hidden scale-100 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isApprove
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        }`}>
                        {isApprove ? (
                            <CheckCircle className="w-8 h-8" />
                        ) : (
                            <XCircle className="w-8 h-8" />
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {title}
                    </h3>

                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        {description}
                        {creatorName && (
                            <span className="block mt-1 font-medium text-gray-700 dark:text-gray-300">
                                "{creatorName}"
                            </span>
                        )}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium shadow-sm transition-all disabled:opacity-50 ${isApprove
                                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 dark:shadow-none'
                                    : 'bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-none'
                                }`}
                        >
                            {isLoading ? 'กำลังดำเนินการ...' : (isApprove ? 'ยืนยันอนุมัติ' : 'ยืนยันปฏิเสธ')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
