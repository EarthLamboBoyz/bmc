import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/Layout';
import { Wallet, TrendingUp, Users, ChevronDown, ChevronUp, Upload, Search } from 'lucide-react';
import PaymentDetailsCard from '../../components/PaymentDetailsCard';
import UploadSlipModal from '../../components/UploadSlipModal';
import { transactionService } from '../../services/transaction.service';
import { showError } from '../../utils/toast';

interface PendingPayment {
    id: string;
    creatorId: string;
    creatorName: string;
    creatorAvatar: string;
    campaignName: string;
    amount: number;
    paymentMethod: string; // Changed to string to be safe
    promptpayId?: string;
    bankName?: string;
    bankAccountNo?: string;
    bankAccountName?: string;
    status: 'PENDING' | 'PAID' | 'CONFIRMED' | 'DISPUTED';
    dueDate: string;
    proofImageUrl?: string;
}

const statusConfig = {
    PENDING: { label: 'รอโอนเงิน', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    PAID: { label: 'โอนแล้ว', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    CONFIRMED: { label: 'ยืนยันแล้ว', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
    DISPUTED: { label: 'มีข้อโต้แย้ง', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
};

export default function BrandPayments() {
    const [payments, setPayments] = useState<PendingPayment[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedPayment, setExpandedPayment] = useState<string | null>(null);
    const [uploadSlipModal, setUploadSlipModal] = useState<{
        isOpen: boolean;
        transactionId: string;
        creatorName: string;
        amount: number;
    }>({
        isOpen: false,
        transactionId: '',
        creatorName: '',
        amount: 0,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'PAID' | 'CONFIRMED' | 'DISPUTED'>('ALL');

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const data = await transactionService.getBrandPendingPayments();
            setPayments(data);
        } catch (error) {
            console.error(error);
            showError('ไม่สามารถดึงข้อมูลรายการจ่ายเงินได้');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    // Calculate summary
    const totalPending = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0);
    const paidThisMonth = payments.filter(p => p.status === 'PAID' || p.status === 'CONFIRMED').reduce((sum, p) => sum + p.amount, 0);
    const creatorsCount = new Set(payments.map(p => p.creatorId)).size;

    // Filter payments
    const filteredPayments = payments.filter(payment => {
        const matchesSearch = payment.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.campaignName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || payment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const toggleExpand = (paymentId: string) => {
        setExpandedPayment(expandedPayment === paymentId ? null : paymentId);
    };

    const openUploadModal = (payment: PendingPayment) => {
        setUploadSlipModal({
            isOpen: true,
            transactionId: payment.id,
            creatorName: payment.creatorName,
            amount: payment.amount,
        });
    };

    const handleUploadSuccess = (transactionId: string) => {
        fetchPayments(); // Refresh list to see updated status
        setUploadSlipModal(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold dark:text-white mb-2">การจ่ายเงิน</h1>
                <p className="text-gray-500 dark:text-gray-300">
                    จัดการการจ่ายเงินให้ Creator
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Wallet className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">฿{totalPending.toLocaleString()}</div>
                    <div className="text-white/80">รอโอนเงิน</div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">฿{paidThisMonth.toLocaleString()}</div>
                    <div className="text-white/80">จ่ายแล้วเดือนนี้</div>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">{creatorsCount}</div>
                    <div className="text-white/80">Creator ที่ต้องจ่าย</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ค้นหา Creator หรือแคมเปญ..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                        <option value="ALL">ทุกสถานะ</option>
                        <option value="PENDING">รอโอนเงิน</option>
                        <option value="PAID">โอนแล้ว</option>
                        <option value="CONFIRMED">ยืนยันแล้ว</option>
                    </select>
                </div>
            </div>

            {/* Pending Payments Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-600">
                    <h2 className="text-lg font-semibold dark:text-white">รายการที่ต้องจ่าย</h2>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-slate-700">
                    {filteredPayments.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-300">
                            ไม่พบรายการ
                        </div>
                    ) : (
                        filteredPayments.map((payment) => (
                            <div key={payment.id} className="p-4 sm:p-6">
                                {/* Payment Row */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    {/* Creator Info */}
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl flex-shrink-0">
                                            {payment.creatorAvatar}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-semibold dark:text-white truncate">{payment.creatorName}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-300 truncate">{payment.campaignName}</div>
                                        </div>
                                    </div>

                                    {/* Amount & Status - Row on mobile */}
                                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto">
                                        {/* Amount */}
                                        <div className="text-left sm:text-right">
                                            <div className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-300">
                                                ฿{payment.amount.toLocaleString()}
                                            </div>
                                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                                                ครบกำหนด {new Date(payment.dueDate).toLocaleDateString('th-TH')}
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="flex-shrink-0">
                                            <span className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${statusConfig[payment.status].color}`}>
                                                {statusConfig[payment.status].label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-4">
                                        {payment.status === 'PENDING' && (
                                            <button
                                                onClick={() => openUploadModal(payment)}
                                                className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                                            >
                                                <Upload className="w-4 h-4" />
                                                <span className="hidden sm:inline">อัพโหลดสลิป</span>
                                                <span className="sm:hidden">อัพโหลด</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => toggleExpand(payment.id)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
                                        >
                                            {expandedPayment === payment.id ? (
                                                <ChevronUp className="w-5 h-5 dark:text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 dark:text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Payment Details */}
                                {expandedPayment === payment.id && (
                                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-600">
                                        <PaymentDetailsCard
                                            paymentMethod={payment.paymentMethod as any}
                                            promptpayId={payment.promptpayId}
                                            bankName={payment.bankName}
                                            bankAccountNo={payment.bankAccountNo}
                                            bankAccountName={payment.bankAccountName}
                                            creatorName={payment.creatorName}
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Upload Slip Modal */}
            <UploadSlipModal
                isOpen={uploadSlipModal.isOpen}
                onClose={() => setUploadSlipModal({ ...uploadSlipModal, isOpen: false })}
                onSuccess={handleUploadSuccess}
                transactionId={uploadSlipModal.transactionId}
                creatorName={uploadSlipModal.creatorName}
                amount={uploadSlipModal.amount}
            />
        </DashboardLayout>
    );
}
