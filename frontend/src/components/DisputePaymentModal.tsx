import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { showSuccess, showError } from '../utils/toast';

interface DisputePaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDispute: (reason: string, description: string) => void;
    amount: number;
    brandName: string;
    campaignName: string;
}

export default function DisputePaymentModal({
    isOpen,
    onClose,
    onDispute,
    amount,
    brandName,
    campaignName,
}: DisputePaymentModalProps) {
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!reason) {
            showError('กรุณาเลือกเหตุผล');
            return;
        }

        if (!description.trim()) {
            showError('กรุณาระบุรายละเอียด');
            return;
        }

        setIsSubmitting(true);
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            onDispute(reason, description);
            showSuccess('รายงานปัญหาสำเร็จ ทีมงานจะติดต่อกลับเร็วๆ นี้');
            onClose();
            // Reset form
            setReason('');
            setDescription('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-xl font-bold dark:text-white">รายงานปัญหา</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 dark:text-gray-400" />
                    </button>
                </div>

                {/* Payment Info */}
                <div className="mb-6 bg-gray-50 dark:bg-slate-900 rounded-xl p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        รายการที่มีปัญหา
                    </div>
                    <div className="font-semibold dark:text-white">{brandName} • {campaignName}</div>
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-300 mt-1">
                        ฿{amount.toLocaleString()}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Reason */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            เหตุผล <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                        >
                            <option value="">เลือกเหตุผล</option>
                            <option value="not_received">ไม่ได้รับเงิน</option>
                            <option value="wrong_amount">จำนวนเงินไม่ถูกต้อง</option>
                            <option value="fake_slip">สลิปปลอม</option>
                            <option value="other">อื่นๆ</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            รายละเอียดเพิ่มเติม <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="กรุณาอธิบายปัญหาที่พบ..."
                            required
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
                        />
                    </div>

                    {/* Warning */}
                    <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                            ⚠️ ทีมงานจะตรวจสอบและติดต่อกลับภายใน 24 ชั่วโมง
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium dark:text-white disabled:opacity-50"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'กำลังส่ง...' : 'ส่งรายงาน'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
