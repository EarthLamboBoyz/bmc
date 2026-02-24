import { CheckCircle, X } from 'lucide-react';
import { useState } from 'react';
import { showSuccess } from '../utils/toast';

interface ConfirmPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    amount: number;
    brandName: string;
    campaignName: string;
}

export default function ConfirmPaymentModal({
    isOpen,
    onClose,
    onConfirm,
    amount,
    brandName,
    campaignName,
}: ConfirmPaymentModalProps) {
    const [isConfirming, setIsConfirming] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsConfirming(true);
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            onConfirm();
            showSuccess('ยืนยันการรับเงินสำเร็จ');
            onClose();
        } finally {
            setIsConfirming(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-xl font-bold dark:text-white">ยืนยันการรับเงิน</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        คุณต้องการยืนยันว่าได้รับเงินจาก <strong>{brandName}</strong> สำหรับแคมเปญ <strong>{campaignName}</strong> แล้วใช่หรือไม่?
                    </p>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                        <div className="text-center">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">จำนวนเงิน</div>
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                ฿{amount.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                            ⚠️ <strong>หมายเหตุ:</strong> กรุณาตรวจสอบให้แน่ใจว่าได้รับเงินเข้าบัญชีแล้ว เมื่อยืนยันแล้วจะไม่สามารถแก้ไขได้
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isConfirming}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium dark:text-white disabled:opacity-50"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isConfirming}
                        className="flex-1 px-4 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isConfirming ? 'กำลังยืนยัน...' : 'ยืนยันรับเงินแล้ว'}
                    </button>
                </div>
            </div>
        </div>
    );
}
