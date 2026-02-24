import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { showSuccess } from '../utils/toast';

interface PaymentDetailsCardProps {
    paymentMethod: 'PROMPTPAY' | 'BANK_TRANSFER';
    promptpayId?: string;
    bankName?: string;
    bankAccountNo?: string;
    bankAccountName?: string;
    creatorName: string;
}

export default function PaymentDetailsCard({
    paymentMethod,
    promptpayId,
    bankName,
    bankAccountNo,
    bankAccountName,
    creatorName,
}: PaymentDetailsCardProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copyToClipboard = (text: string, fieldName: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        showSuccess(`คัดลอก${fieldName}แล้ว`);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">
                    {paymentMethod === 'PROMPTPAY' ? '💳' : '🏦'}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        {paymentMethod === 'PROMPTPAY' ? 'PromptPay' : 'โอนธนาคาร'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        ข้อมูลบัญชีของ {creatorName}
                    </p>
                </div>
            </div>

            {paymentMethod === 'PROMPTPAY' && promptpayId && (
                <div className="space-y-3">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            หมายเลข PromptPay
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 font-mono text-lg font-semibold text-gray-900 dark:text-white">
                                {promptpayId}
                            </div>
                            <button
                                onClick={() => copyToClipboard(promptpayId, 'หมายเลข PromptPay')}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                {copiedField === 'หมายเลข PromptPay' ? (
                                    <Check className="w-5 h-5 text-green-600" />
                                ) : (
                                    <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-300 bg-white dark:bg-slate-800 rounded-lg p-3">
                        💡 <strong>วิธีโอน:</strong> เปิดแอปธนาคาร → เลือก PromptPay → ใส่หมายเลขด้านบน → โอนเงิน
                    </div>
                </div>
            )}

            {paymentMethod === 'BANK_TRANSFER' && bankName && bankAccountNo && bankAccountName && (
                <div className="space-y-3">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                ธนาคาร
                            </label>
                            <div className="text-gray-900 dark:text-white font-medium">
                                {bankName}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                เลขบัญชี
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 font-mono text-lg font-semibold text-gray-900 dark:text-white">
                                    {bankAccountNo}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(bankAccountNo, 'เลขบัญชี')}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    {copiedField === 'เลขบัญชี' ? (
                                        <Check className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                ชื่อบัญชี
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 text-gray-900 dark:text-white font-medium">
                                    {bankAccountName}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(bankAccountName, 'ชื่อบัญชี')}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    {copiedField === 'ชื่อบัญชี' ? (
                                        <Check className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-300 bg-white dark:bg-slate-800 rounded-lg p-3">
                        💡 <strong>วิธีโอน:</strong> เปิดแอปธนาคาร → เลือกโอนเงิน → ใส่ข้อมูลด้านบน → โอนเงิน
                    </div>
                </div>
            )}
        </div>
    );
}
