import { useState } from 'react';
import { X } from 'lucide-react';
import { showSuccess, showError } from '../utils/toast';
import { transactionService } from '../services/transaction.service';

interface PaymentSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentSettings?: {
        paymentMethod?: 'PROMPTPAY' | 'BANK_TRANSFER';
        promptpayId?: string;
        bankName?: string;
        bankAccountNo?: string;
        bankAccountName?: string;
    };
}

export default function PaymentSettingsModal({ isOpen, onClose, currentSettings }: PaymentSettingsModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<'PROMPTPAY' | 'BANK_TRANSFER'>(
        currentSettings?.paymentMethod || 'PROMPTPAY'
    );
    const [promptpayId, setPromptpayId] = useState(currentSettings?.promptpayId || '');
    const [bankName, setBankName] = useState(currentSettings?.bankName || '');
    const [bankAccountNo, setBankAccountNo] = useState(currentSettings?.bankAccountNo || '');
    const [bankAccountName, setBankAccountName] = useState(currentSettings?.bankAccountName || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await transactionService.updatePaymentSettings({
                paymentMethod,
                promptpayId: paymentMethod === 'PROMPTPAY' ? promptpayId : undefined,
                bankName: paymentMethod === 'BANK_TRANSFER' ? bankName : undefined,
                bankAccountNo: paymentMethod === 'BANK_TRANSFER' ? bankAccountNo : undefined,
                bankAccountName: paymentMethod === 'BANK_TRANSFER' ? bankAccountName : undefined,
            });

            showSuccess('บันทึกข้อมูลการรับเงินสำเร็จ');
            onClose();
        } catch (error) {
            console.error(error);
            showError('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold dark:text-white">ตั้งค่าบัญชีรับเงิน</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 dark:text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Payment Method Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            วิธีการรับเงิน
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('PROMPTPAY')}
                                className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'PROMPTPAY'
                                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'
                                    }`}
                            >
                                <div className="text-center">
                                    <div className="text-2xl mb-1">💳</div>
                                    <div className="font-medium dark:text-white">PromptPay</div>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('BANK_TRANSFER')}
                                className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'BANK_TRANSFER'
                                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'
                                    }`}
                            >
                                <div className="text-center">
                                    <div className="text-2xl mb-1">🏦</div>
                                    <div className="font-medium dark:text-white">โอนธนาคาร</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* PromptPay Fields */}
                    {paymentMethod === 'PROMPTPAY' && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                หมายเลข PromptPay
                            </label>
                            <input
                                type="text"
                                value={promptpayId}
                                onChange={(e) => setPromptpayId(e.target.value)}
                                placeholder="เบอร์โทรศัพท์ หรือ เลขบัตรประชาชน"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-300 mt-2">
                                ตัวอย่าง: 0812345678 หรือ 1234567890123
                            </p>
                        </div>
                    )}

                    {/* Bank Transfer Fields */}
                    {paymentMethod === 'BANK_TRANSFER' && (
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    ธนาคาร
                                </label>
                                <select
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                >
                                    <option value="">เลือกธนาคาร</option>
                                    <option value="ธนาคารกสิกรไทย">ธนาคารกสิกรไทย</option>
                                    <option value="ธนาคารกรุงเทพ">ธนาคารกรุงเทพ</option>
                                    <option value="ธนาคารไทยพาณิชย์">ธนาคารไทยพาณิชย์</option>
                                    <option value="ธนาคารกรุงไทย">ธนาคารกรุงไทย</option>
                                    <option value="ธนาคารทหารไทยธนชาต">ธนาคารทหารไทยธนชาต</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    เลขบัญชี
                                </label>
                                <input
                                    type="text"
                                    value={bankAccountNo}
                                    onChange={(e) => setBankAccountNo(e.target.value)}
                                    placeholder="1234567890"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    ชื่อบัญชี
                                </label>
                                <input
                                    type="text"
                                    value={bankAccountName}
                                    onChange={(e) => setBankAccountName(e.target.value)}
                                    placeholder="นาย/นาง/นางสาว ..."
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium dark:text-white"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
