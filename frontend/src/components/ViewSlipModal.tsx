import { X } from 'lucide-react';

interface ViewSlipModalProps {
    isOpen: boolean;
    onClose: () => void;
    slipImageUrl: string;
    transferDate: string;
    brandNote?: string;
    amount: number;
    brandName: string;
}

export default function ViewSlipModal({
    isOpen,
    onClose,
    slipImageUrl,
    transferDate,
    brandNote,
    amount,
    brandName,
}: ViewSlipModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold dark:text-white">สลิปโอนเงิน</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                            จาก {brandName} • ฿{amount.toLocaleString()}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 dark:text-gray-400" />
                    </button>
                </div>

                {/* Slip Image */}
                <div className="mb-6">
                    <img
                        src={slipImageUrl}
                        alt="Payment slip"
                        className="w-full rounded-xl border border-gray-200 dark:border-slate-600"
                    />
                </div>

                {/* Transfer Details */}
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    วันที่โอน
                                </label>
                                <div className="text-gray-900 dark:text-white">
                                    {new Date(transferDate).toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    จำนวนเงิน
                                </label>
                                <div className="text-xl font-bold text-indigo-600 dark:text-indigo-300">
                                    ฿{amount.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {brandNote && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                            <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                                หมายเหตุจาก Brand
                            </label>
                            <p className="text-gray-700 dark:text-gray-300">{brandNote}</p>
                        </div>
                    )}
                </div>

                {/* Close Button */}
                <div className="mt-6">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors font-medium dark:text-white"
                    >
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    );
}
