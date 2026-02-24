import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/application.service';
import { Check, X, MessageSquare, MapPin, User, Clock, Eye, Filter, Search } from 'lucide-react';
import { Application } from '../../types';
import EmptyState from '../../components/EmptyState';
import ApplicantActionModal from '../../components/Brand/ApplicantActionModal';

interface ApplicantListProps {
    campaignId: string;
}

export default function ApplicantList({ campaignId }: ApplicantListProps) {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        appId: string | null;
        status: 'APPROVED' | 'REJECTED' | null;
        creatorName: string;
    }>({
        isOpen: false,
        appId: null,
        status: null,
        creatorName: '',
    });

    useEffect(() => {
        fetchApplications();
    }, [campaignId]);

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const data = await applicationService.getCampaignApplications(token, campaignId);

            // Map backend data to frontend expected format
            const mappedData = data.map((app: any) => ({
                ...app,
                creatorName: app.creator?.displayName || 'Unknown Creator',
                creatorTiktokHandle: app.creator?.tiktokHandle || '',
                creatorLocation: app.creator?.address?.province || '',
                creatorFollowers: app.creator?.followersCount || 0,
                creatorAvatar: app.creator?.avatar || '',
            }));

            setApplications(mappedData);
        } catch (error) {
            console.error("Failed to fetch applications", error);
        } finally {
            setLoading(false);
        }
    };

    const confirmAction = (appId: string, status: 'APPROVED' | 'REJECTED', creatorName: string) => {
        setModalConfig({
            isOpen: true,
            appId,
            status,
            creatorName,
        });
    };

    const handleAction = async (note?: string) => {
        if (!modalConfig.appId || !modalConfig.status) return;

        setActionLoading(modalConfig.appId);
        setModalConfig(prev => ({ ...prev, isOpen: false }));

        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            if (modalConfig.status === 'APPROVED') {
                await applicationService.updateStatus(token, modalConfig.appId, 'APPROVED');
            } else {
                await applicationService.updateStatus(token, modalConfig.appId, 'REJECTED');
            }

            // Refresh list
            fetchApplications();
        } catch (error) {
            console.error("Action failed", error);
        } finally {
            setActionLoading(null);
            setModalConfig({ isOpen: false, appId: null, status: null, creatorName: '' });
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesFilter = filter === 'all' || app.status.toLowerCase() === filter.toLowerCase();
        const matchesSearch = !searchQuery ||
            app.creatorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.creatorTiktokHandle?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const counts = {
        all: applications.length,
        pending: applications.filter(a => a.status === 'PENDING').length,
        approved: applications.filter(a => a.status === 'APPROVED').length,
        rejected: applications.filter(a => a.status === 'REJECTED').length,
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
                        <Check className="w-3.5 h-3.5" />
                        อนุมัติแล้ว
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
                        <X className="w-3.5 h-3.5" />
                        ปฏิเสธ
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        รอตรวจสอบ
                    </span>
                );
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-8">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-slate-600 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-1/4" />
                                <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        รายชื่อผู้สมัคร
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        ตรวจสอบและอนุมัติครีเอเตอร์ที่สนใจเข้าร่วมแคมเปญ
                    </p>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-white w-full sm:w-64"
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                            }`}
                    >
                        {f === 'all' && 'ทั้งหมด'}
                        {f === 'pending' && 'รอตรวจสอบ'}
                        {f === 'approved' && 'อนุมัติแล้ว'}
                        {f === 'rejected' && 'ปฏิเสธ'}
                        <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${filter === f ? 'bg-white/20' : 'bg-gray-200 dark:bg-slate-600'
                            }`}>
                            {counts[f]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Applicants List */}
            {filteredApplications.length === 0 ? (
                <EmptyState
                    icon={searchQuery ? Search : Filter}
                    title={searchQuery ? 'ไม่พบผลลัพธ์' : 'ไม่มีผู้สมัคร'}
                    description={
                        searchQuery
                            ? 'ลองค้นหาด้วยคำอื่นหรือล้างตัวกรอง'
                            : 'ยังไม่มีครีเอเตอร์สมัครเข้าร่วมแคมเปญนี้'
                    }
                    actionLabel={searchQuery ? 'ล้างการค้นหา' : undefined}
                    onActionClick={searchQuery ? () => setSearchQuery('') : undefined}
                    size="md"
                />
            ) : (
                <div className="space-y-3">
                    {filteredApplications.map((app, index) => (
                        <div
                            key={app.id}
                            className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-5 hover:shadow-lg transition-all animate-slide-up"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                {/* Creator Info */}
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold">
                                        {app.creatorName?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg dark:text-white">{app.creatorName}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            @{app.creatorTiktokHandle || 'unknown'}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {app.creatorLocation || 'ไม่ระบุ'}
                                            </span>
                                            <span>•</span>
                                            <span>{app.creatorFollowers?.toLocaleString() || 0} ผู้ติดตาม</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex items-center gap-3">
                                    <Link
                                        to={`/creator/${app.creatorId}?appId=${app.id}&appStatus=${app.status}`}
                                        className="text-sm font-medium text-primary hover:text-primary-dark transition-colors mr-2 flex items-center gap-1"
                                    >
                                        <Eye className="w-4 h-4" /> ดูโปรไฟล์
                                    </Link>
                                    {getStatusBadge(app.status)}

                                    {app.status === 'PENDING' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => confirmAction(app.id, 'APPROVED', app.creatorName)}
                                                disabled={actionLoading === app.id}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20"
                                            >
                                                <Check className="w-4 h-4" />
                                                อนุมัติ
                                            </button>
                                            <button
                                                onClick={() => confirmAction(app.id, 'REJECTED', app.creatorName)}
                                                disabled={actionLoading === app.id}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl font-medium transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                                ปฏิเสธ
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Message */}
                            {app.message && (
                                <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                                    <div className="flex items-start gap-2">
                                        <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{app.message}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Action Modal */}
            <ApplicantActionModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ isOpen: false, appId: null, status: null, creatorName: '' })}
                onConfirm={() => handleAction()}
                creatorName={modalConfig.creatorName}
                actionType={modalConfig.status === 'APPROVED' ? 'approve' : 'reject'}
                title={modalConfig.status === 'APPROVED' ? 'ยืนยันการอนุมัติ' : 'ยืนยันการปฏิเสธ'}
                description={modalConfig.status === 'APPROVED' ? 'คุณแน่ใจหรือไม่ที่จะอนุมัติผู้สมัครรายนี้เข้าสู่แคมเปญ?' : 'คุณแน่ใจหรือไม่ที่จะปฏิเสธผู้สมัครรายนี้?'}
            />
        </div>
    );
}
