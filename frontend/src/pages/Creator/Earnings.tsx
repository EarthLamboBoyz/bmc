import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/Layout';
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Settings, 
  Eye, 
  AlertTriangle,
  DollarSign,
  Download,
  FileText,
  ChevronRight,
  Calendar
} from 'lucide-react';
import StatsCard from '../../components/Shared/StatsCard';
import EmptyState from '../../components/EmptyState';
import { DashboardSkeleton } from '../../components/Skeleton';
import PaymentSettingsModal from '../../components/PaymentSettingsModal';
import ViewSlipModal from '../../components/ViewSlipModal';
import ConfirmPaymentModal from '../../components/ConfirmPaymentModal';
import DisputePaymentModal from '../../components/DisputePaymentModal';
import { showSuccess, showError } from '../../utils/toast';
import { transactionService } from '../../services/transaction.service';

interface PendingConfirmation {
    id: string;
    brandName: string;
    campaignName: string;
    amount: number;
    transferDate: string;
    slipImageUrl: string;
    brandNote?: string;
    status: string;
}

interface PaymentHistory {
    id: string;
    amount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    method: string;
    date: string;
    campaignName?: string;
}

const statusConfig = {
    pending: { 
        label: 'รอดำเนินการ', 
        color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        icon: Clock 
    },
    processing: { 
        label: 'รอตรวจสอบ', 
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        icon: Eye 
    },
    completed: { 
        label: 'สำเร็จ', 
        color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
        icon: CheckCircle 
    },
    failed: { 
        label: 'มีปัญหา', 
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
        icon: AlertTriangle 
    },
};

export default function Earnings() {
    const [showPaymentSettings, setShowPaymentSettings] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [viewSlipModal, setViewSlipModal] = useState<{
        isOpen: boolean;
        payment: PendingConfirmation | null;
    }>({ isOpen: false, payment: null });

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        payment: PendingConfirmation | null;
    }>({ isOpen: false, payment: null });

    const [disputeModal, setDisputeModal] = useState<{
        isOpen: boolean;
        payment: PendingConfirmation | null;
    }>({ isOpen: false, payment: null });

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const data = await transactionService.getCreatorPendingPayments();
            setTransactions(data);
        } catch (error) {
            console.error(error);
            showError('ไม่สามารถดึงข้อมูลรายได้ได้');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Derived State
    const pendingConfirmations = transactions
        .filter(t => t.status === 'PAID')
        .map(t => ({
            id: t.id,
            brandName: t.brandName,
            campaignName: t.campaignName,
            amount: t.amount,
            transferDate: t.transferDate,
            slipImageUrl: t.slipImageUrl,
            brandNote: t.brandNote,
            status: t.status
        }));

    const paymentHistory: PaymentHistory[] = transactions.map(t => {
        let status: PaymentHistory['status'] = 'pending';
        if (t.status === 'CONFIRMED') status = 'completed';
        if (t.status === 'DISPUTED') status = 'failed';
        if (t.status === 'PAID') status = 'processing';

        return {
            id: t.id,
            amount: t.amount,
            status,
            method: 'Direct Transfer',
            date: t.transferDate || t.updatedAt || new Date().toISOString(),
            campaignName: t.campaignName
        };
    });

    // Calculate earnings
    const totalEarnings = transactions
        .filter(t => t.status === 'CONFIRMED')
        .reduce((sum, t) => sum + t.amount, 0);

    const pendingEarnings = transactions
        .filter(t => t.status === 'PENDING' || t.status === 'PAID')
        .reduce((sum, t) => sum + t.amount, 0);

    const paidEarnings = totalEarnings;
    const completedJobs = transactions.filter(t => t.status === 'CONFIRMED').length;

    const handleConfirmPayment = async () => {
        if (confirmModal.payment) {
            try {
                await transactionService.confirmTransaction(confirmModal.payment.id, true);
                showSuccess('ยืนยันการรับเงินเรียบร้อย');
                fetchTransactions();
                setConfirmModal({ isOpen: false, payment: null });
            } catch (error) {
                showError('เกิดข้อผิดพลาดในการยืนยัน');
            }
        }
    };

    const handleDisputePayment = async (reason: string, description: string) => {
        if (disputeModal.payment) {
            try {
                const note = `${reason}: ${description}`;
                await transactionService.confirmTransaction(disputeModal.payment.id, false, note);
                showSuccess('ส่งรายงานปัญหาเรียบร้อย');
                fetchTransactions();
                setDisputeModal({ isOpen: false, payment: null });
            } catch (error) {
                showError('เกิดข้อผิดพลาดในการรายงานปัญหา');
            }
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="animate-fade-in">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold dark:text-white">💰 รายได้</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            ติดตามรายได้และประวัติการรับเงิน
                        </p>
                    </div>
                    <DashboardSkeleton />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                            <DollarSign className="w-6 h-6 text-emerald-500" />
                            รายได้
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            ติดตามรายได้และประวัติการรับเงินของคุณ
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {}}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">ดาวน์โหลดรายงาน</span>
                        </button>
                        <button
                            onClick={() => setShowPaymentSettings(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium"
                        >
                            <Settings className="w-4 h-4" />
                            <span className="hidden sm:inline">ตั้งค่าการรับเงิน</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard 
                        title="รายได้ที่ได้รับแล้ว"
                        value={`฿${paidEarnings.toLocaleString()}`}
                        icon={<Wallet className="w-6 h-6" />}
                        trend="up"
                        trendValue="15%"
                        sparklineData={[10000, 15000, 12000, 18000, 22000, paidEarnings]}
                        color="success"
                    />
                    <StatsCard 
                        title="รอรับเงิน / ตรวจสอบ"
                        value={`฿${pendingEarnings.toLocaleString()}`}
                        icon={<Clock className="w-6 h-6" />}
                        color="warning"
                    />
                    <StatsCard 
                        title="งานที่สำเร็จ"
                        value={`${completedJobs} งาน`}
                        icon={<CheckCircle className="w-6 h-6" />}
                        trend="up"
                        trendValue="2"
                        color="info"
                    />
                    <StatsCard 
                        title="รายได้เฉลี่ย/งาน"
                        value={`฿${completedJobs > 0 ? Math.round(paidEarnings / completedJobs).toLocaleString() : '0'}`}
                        icon={<TrendingUp className="w-6 h-6" />}
                        color="primary"
                    />
                </div>

                {/* Pending Confirmations */}
                {pendingConfirmations.length > 0 && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-bold dark:text-white">รอยืนยันการรับเงิน</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        กรุณาตรวจสอบและยืนยันการรับเงิน
                                    </p>
                                </div>
                                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    {pendingConfirmations.length} รายการ
                                </span>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-100 dark:divide-slate-700">
                            {pendingConfirmations.map((payment, index) => (
                                <div 
                                    key={payment.id} 
                                    className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors animate-slide-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                        {/* Payment Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                                                    {payment.brandName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold dark:text-white">{payment.brandName}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{payment.campaignName}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Amount & Date */}
                                        <div className="flex items-center gap-6 lg:gap-8">
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">จำนวนเงิน</p>
                                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                    ฿{payment.amount.toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">วันที่โอน</p>
                                                <p className="font-medium dark:text-white">
                                                    {new Date(payment.transferDate).toLocaleDateString('th-TH', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setViewSlipModal({ isOpen: true, payment })}
                                                className="px-4 py-2.5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl transition-colors font-medium dark:text-white flex items-center gap-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                ดูสลิป
                                            </button>
                                            <button
                                                onClick={() => setConfirmModal({ isOpen: true, payment })}
                                                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors font-medium flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                ยืนยัน
                                            </button>
                                            <button
                                                onClick={() => setDisputeModal({ isOpen: true, payment })}
                                                className="px-4 py-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl transition-colors font-medium flex items-center gap-2"
                                            >
                                                <AlertTriangle className="w-4 h-4" />
                                                รายงานปัญหา
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Payment History */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold dark:text-white">ประวัติการเงิน</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    รายการทั้งหมด {paymentHistory.length} รายการ
                                </p>
                            </div>
                        </div>
                    </div>

                    {paymentHistory.length === 0 ? (
                        <EmptyState
                            icon={FileText}
                            title="ไม่มีประวัติการทำรายการ"
                            description="ยังไม่มีรายการรับเงิน รอให้แคมเปญจบแล้วจะได้รับเงิน"
                            size="md"
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-slate-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            วันที่
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            แคมเปญ
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            จำนวนเงิน
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            วิธีการ
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            สถานะ
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                    {paymentHistory.map((payment) => {
                                        const StatusIcon = statusConfig[payment.status].icon;
                                        return (
                                            <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-900 dark:text-white">
                                                            {new Date(payment.date).toLocaleDateString('th-TH', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {payment.campaignName || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                        ฿{payment.amount.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                                        {payment.method}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[payment.status].color}`}>
                                                        <StatusIcon className="w-3.5 h-3.5" />
                                                        {statusConfig[payment.status].label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <PaymentSettingsModal
                isOpen={showPaymentSettings}
                onClose={() => setShowPaymentSettings(false)}
            />

            {viewSlipModal.payment && (
                <ViewSlipModal
                    isOpen={viewSlipModal.isOpen}
                    onClose={() => setViewSlipModal({ isOpen: false, payment: null })}
                    slipImageUrl={viewSlipModal.payment.slipImageUrl}
                    transferDate={viewSlipModal.payment.transferDate}
                    brandNote={viewSlipModal.payment.brandNote}
                    amount={viewSlipModal.payment.amount}
                    brandName={viewSlipModal.payment.brandName}
                />
            )}

            {confirmModal.payment && (
                <ConfirmPaymentModal
                    isOpen={confirmModal.isOpen}
                    onClose={() => setConfirmModal({ isOpen: false, payment: null })}
                    onConfirm={handleConfirmPayment}
                    amount={confirmModal.payment.amount}
                    brandName={confirmModal.payment.brandName}
                    campaignName={confirmModal.payment.campaignName}
                />
            )}

            {disputeModal.payment && (
                <DisputePaymentModal
                    isOpen={disputeModal.isOpen}
                    onClose={() => setDisputeModal({ isOpen: false, payment: null })}
                    onDispute={handleDisputePayment}
                    amount={disputeModal.payment.amount}
                    brandName={disputeModal.payment.brandName}
                    campaignName={disputeModal.payment.campaignName}
                />
            )}
        </DashboardLayout>
    );
}
