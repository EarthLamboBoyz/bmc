import { useState } from 'react';
import { X, Wallet, AlertCircle, Check } from 'lucide-react';

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (amount: number, method: string) => void;
    availableBalance: number;
    minWithdraw?: number;
}

export default function WithdrawModal({
    isOpen,
    onClose,
    onSubmit,
    availableBalance,
    minWithdraw = 500,
}: WithdrawModalProps) {
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('promptpay');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const numAmount = parseFloat(amount) || 0;
    const canWithdraw = numAmount >= minWithdraw && numAmount <= availableBalance;

    const handleSubmit = () => {
        if (!canWithdraw) {
            setError(`กรุณาระบุจำนวนเงินระหว่าง ฿${minWithdraw.toLocaleString()} - ฿${availableBalance.toLocaleString()}`);
            return;
        }

        onSubmit(numAmount, method);
        setAmount('');
        setError('');
        onClose();
    };

    const quickAmounts = [500, 1000, 5000, availableBalance];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-600 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold dark:text-white">ถอนเงิน</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                ยอดคงเหลือ: ฿{availableBalance.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Info Alert */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                            <p className="font-medium mb-1">ข้อมูลการถอนเงิน</p>
                            <ul className="text-xs space-y-1 list-disc list-inside">
                                <li>ถอนขั้นต่ำ ฿{minWithdraw.toLocaleString()}</li>
                                <li>ระยะเวลาโอน 1-3 วันทำการ</li>
                                <li>ไม่มีค่าธรรมเนียม</li>
                            </ul>
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            จำนวนเงินที่ต้องการถอน
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 font-medium">
                                ฿
                            </span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                    setError('');
                                }}
                                placeholder="0.00"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg font-semibold"
                            />
                        </div>
                        {error && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
                        )}
                    </div>

                    {/* Quick Amount Buttons */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            จำนวนเงินด่วน
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {quickAmounts.map((amt) => (
                                <button
                                    key={amt}
                                    onClick={() => setAmount(amt.toString())}
                                    className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium dark:text-white"
                                >
                                    {amt === availableBalance ? 'ทั้งหมด' : `฿${amt.toLocaleString()}`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            วิธีการรับเงิน
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                                <input
                                    type="radio"
                                    name="method"
                                    value="promptpay"
                                    checked={method === 'promptpay'}
                                    onChange={(e) => setMethod(e.target.value)}
                                    className="w-4 h-4 text-primary"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-sm dark:text-white">PromptPay</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-300">โอนเร็ว ไม่มีค่าธรรมเนียม</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                                <input
                                    type="radio"
                                    name="method"
                                    value="bank"
                                    checked={method === 'bank'}
                                    onChange={(e) => setMethod(e.target.value)}
                                    className="w-4 h-4 text-primary"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-sm dark:text-white">โอนเข้าบัญชีธนาคาร</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-300">1-3 วันทำการ</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 rounded-b-2xl flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors font-medium"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!canWithdraw}
                        className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Check className="w-4 h-4" />
                        ยืนยันการถอน
                    </button>
                </div>
            </div>
        </div>
    );
}
