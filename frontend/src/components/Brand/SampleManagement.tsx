import { Package, MapPin, CheckCircle, XCircle, Truck, User, Phone, Search, Download, Filter, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

interface SampleRequest {
    id: string;
    creatorId: string;
    creatorName: string;
    creatorHandle: string;
    creatorAvatar: string;
    creatorFollowers: number;
    status: 'pending' | 'approved' | 'rejected' | 'shipped';
    quantity: number;
    message?: string;
    shippingAddress: {
        recipientName: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        district: string;
        province: string;
        postalCode: string;
    };
    requestedAt: string;
    reviewedAt?: string;
    shippedAt?: string;
    rejectionReason?: string;
}

interface SampleManagementProps {
    campaignId: string;
    sampleInfo: {
        description: string;
        totalSamples: number;
        samplesPerCreator: number;
    };
    sampleRequests: SampleRequest[];
    onApprove: (requestId: string) => void;
    onReject: (requestId: string, reason: string) => void;
    onMarkShipped: (requestId: string) => void;
    onBulkApprove: (requestIds: string[]) => void;
    onBulkMarkShipped: (requestIds: string[]) => void;
}

export default function SampleManagement({
    campaignId,
    sampleInfo,
    sampleRequests,
    onApprove,
    onReject,
    onMarkShipped,
    onBulkApprove,
    onBulkMarkShipped,
}: SampleManagementProps) {
    const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'shipped' | 'rejected'>('all');
    const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set());
    const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'followers'>('newest');

    // Filter and Sort requests
    const filteredRequests = sampleRequests
        .filter(req => {
            const matchesFilter = activeFilter === 'all' || req.status === activeFilter;
            const matchesSearch = searchQuery === '' ||
                req.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                req.creatorHandle.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === 'followers') return b.creatorFollowers - a.creatorFollowers;
            return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
        });

    // Stats
    const stats = {
        total: sampleInfo.totalSamples,
        totalRequests: sampleRequests.length,
        pending: sampleRequests.filter(r => r.status === 'pending').length,
        approved: sampleRequests.filter(r => r.status === 'approved').length,
        shipped: sampleRequests.filter(r => r.status === 'shipped').length,
        rejected: sampleRequests.filter(r => r.status === 'rejected').length,
    };

    // Handle selection
    const toggleSelection = (requestId: string) => {
        const newSelection = new Set(selectedRequests);
        if (newSelection.has(requestId)) {
            newSelection.delete(requestId);
        } else {
            newSelection.add(requestId);
        }
        setSelectedRequests(newSelection);
    };

    const toggleSelectAll = () => {
        if (selectedRequests.size === filteredRequests.length) {
            setSelectedRequests(new Set());
        } else {
            setSelectedRequests(new Set(filteredRequests.map(r => r.id)));
        }
    };

    // Handle reject
    const handleReject = (requestId: string) => {
        if (rejectionReason.trim()) {
            onReject(requestId, rejectionReason);
            setShowRejectModal(null);
            setRejectionReason('');
        }
    };

    // Bulk actions
    const handleBulkApprove = () => {
        onBulkApprove(Array.from(selectedRequests));
        setSelectedRequests(new Set());
    };

    const handleBulkMarkShipped = () => {
        onBulkMarkShipped(Array.from(selectedRequests));
        setSelectedRequests(new Set());
    };

    const handleExportCSV = () => {
        // Only export selected if any, otherwise alert user
        const toExport = selectedRequests.size > 0
            ? filteredRequests.filter(req => selectedRequests.has(req.id))
            : [];

        if (toExport.length === 0) {
            alert('กรุณาเลือก Creator ที่ต้องการส่งออกข้อมูล');
            return;
        }

        const headers = ['Creator', 'Handle', 'Followers', 'Status', 'Recipient', 'Phone', 'Address', 'PostalCode', 'RequestedAt'];
        const rows = toExport.map(req => [
            req.creatorName,
            req.creatorHandle,
            req.creatorFollowers,
            req.status,
            req.shippingAddress.recipientName,
            `'${req.shippingAddress.phone}`, // Add ' to prevent CSV from stripping leading zero
            `"${req.shippingAddress.addressLine1} ${req.shippingAddress.addressLine2 || ''} ${req.shippingAddress.district} ${req.shippingAddress.province}"`,
            req.shippingAddress.postalCode,
            new Date(req.requestedAt).toLocaleString('th-TH')
        ]);

        const csvContent = "data:text/csv;charset=utf-8,\ufeff"
            + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `sample_requests_${selectedRequests.size}_items.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 font-medium">แจกทั้งหมด</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 font-medium">คำขอทั้งหมด</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.totalRequests}</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 font-medium">รออนุมัติ</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 font-medium">ส่งแล้ว</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.shipped}</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Filter Tabs */}
                {/* Filter Tabs - Desktop (Buttons) */}
                <div className="hidden sm:flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 scrollbar-hide">
                    <div className="flex gap-2 min-w-max">
                        {[
                            { id: 'all', label: 'ทั้งหมด', count: stats.totalRequests },
                            { id: 'pending', label: 'รอการอนุมัติ', count: stats.pending },
                            { id: 'approved', label: 'อนุมัติแล้ว', count: stats.approved },
                            { id: 'shipped', label: 'จัดส่งแล้ว', count: stats.shipped },
                            { id: 'rejected', label: 'ไม่อนุมัติ', count: stats.rejected },
                        ].map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id as any)}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all text-sm ${activeFilter === filter.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 border border-gray-100 dark:border-slate-600'
                                    }`}
                            >
                                {filter.label} ({filter.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filter Tabs - Mobile (Dropdown) */}
                <div className="block sm:hidden w-full">
                    <div className="relative">
                        <select
                            value={activeFilter}
                            onChange={(e) => setActiveFilter(e.target.value as any)}
                            className="appearance-none w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-white pr-8"
                        >
                            {[
                                { id: 'all', label: 'ทั้งหมด', count: stats.totalRequests },
                                { id: 'pending', label: 'รอการอนุมัติ', count: stats.pending },
                                { id: 'approved', label: 'อนุมัติแล้ว', count: stats.approved },
                                { id: 'shipped', label: 'จัดส่งแล้ว', count: stats.shipped },
                                { id: 'rejected', label: 'ไม่อนุมัติ', count: stats.rejected },
                            ].map(filter => (
                                <option key={filter.id} value={filter.id}>
                                    {filter.label} ({filter.count})
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Sorting and Search */}
                {/* Sorting and Search */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                        <button
                            onClick={() => setSortBy('newest')}
                            className={`px-3 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-600 dark:text-gray-300 flex items-center gap-2 whitespace-nowrap ${sortBy === 'newest' ? 'bg-gray-50 dark:bg-slate-600' : ''}`}
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            ล่าสุด
                        </button>

                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="appearance-none px-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-gray-300 pr-8"
                            >
                                <option value="newest">🕒 ล่าสุด</option>
                                <option value="followers">👥 ผู้ติดตามเยอะสุด</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>

                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ค้นหา creator..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500"
                        />
                    </div>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedRequests.size > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        เลือกแล้ว {selectedRequests.size} รายการ
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={handleExportCSV}
                            className="px-4 py-2 bg-white dark:bg-slate-700 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-sm font-medium flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            ส่งออกข้อมูล (CSV)
                        </button>
                        {activeFilter === 'pending' && (
                            <button
                                onClick={handleBulkApprove}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
                            >
                                อนุมัติที่เลือก
                            </button>
                        )}
                        {activeFilter === 'approved' && (
                            <button
                                onClick={handleBulkMarkShipped}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                            >
                                ทำเครื่องหมายส่งแล้ว
                            </button>
                        )}
                        <button
                            onClick={() => setSelectedRequests(new Set())}
                            className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white text-sm font-medium"
                        >
                            ยกเลิก
                        </button>
                    </div>
                </div>
            )}

            {/* Select All */}
            {filteredRequests.length > 0 && (
                <div className="flex items-center gap-3 px-1 mt-4 mb-2">
                    <input
                        type="checkbox"
                        checked={selectedRequests.size === filteredRequests.length && filteredRequests.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary dark:bg-slate-700 dark:border-slate-600"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">เลือกทั้งหมด ({filteredRequests.length} รายการ)</span>
                </div>
            )}

            {/* Request Cards */}
            <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                    <div className="text-center py-16 text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-slate-800 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                        <Package className="w-16 h-16 text-gray-200 dark:text-slate-600 mx-auto mb-4" />
                        <p className="font-medium text-gray-700 dark:text-gray-300">ไม่มีคำขอ</p>
                        <p className="text-sm">
                            {searchQuery ? 'ไม่พบผลลัพธ์ที่ค้นหา' : 'ยังไม่มี creator ขอตัวอย่างสินค้า'}
                        </p>
                    </div>
                ) : (
                    filteredRequests.map(request => (
                        <div key={request.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                {/* Checkbox */}
                                <input
                                    type="checkbox"
                                    checked={selectedRequests.has(request.id)}
                                    onChange={() => toggleSelection(request.id)}
                                    className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />

                                {/* Creator Info */}
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-hidden">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={request.creatorAvatar}
                                                alt={request.creatorName}
                                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-x-2">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">{request.creatorName}</h4>
                                                    <span className="text-sm text-gray-500 dark:text-gray-300 truncate">{request.creatorHandle}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-300">
                                                    👥 {(request.creatorFollowers / 1000).toFixed(1)}K followers
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status Badge - Mobile friendly position */}
                                        <div className="flex self-start sm:self-center">
                                            {request.status === 'approved' && !request.shippedAt && (
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold whitespace-nowrap">
                                                    ✓ อนุมัติแล้ว
                                                </span>
                                            )}
                                            {request.status === 'shipped' && (
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1">
                                                    <Truck className="w-3 h-3" />
                                                    จัดส่งแล้ว
                                                </span>
                                            )}
                                            {request.status === 'rejected' && (
                                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold whitespace-nowrap">
                                                    ✗ ไม่อนุมัติ
                                                </span>
                                            )}
                                            {request.status === 'pending' && (
                                                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold whitespace-nowrap">
                                                    ⌛ รออนุมัติ
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div className="mb-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-100 dark:border-slate-600">
                                        <div className="flex items-start gap-2 mb-1">
                                            <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                            <div className="text-xs sm:text-sm">
                                                <p className="font-bold text-gray-900 dark:text-white mb-0.5">
                                                    {request.shippingAddress.recipientName}
                                                </p>
                                                <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2 mb-1">
                                                    <Phone className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                                                    {request.shippingAddress.phone}
                                                </p>
                                                <div className="text-gray-600 dark:text-gray-300 space-y-0.5 leading-relaxed">
                                                    <p>{request.shippingAddress.addressLine1}</p>
                                                    {request.shippingAddress.addressLine2 && <p>{request.shippingAddress.addressLine2}</p>}
                                                    <p>
                                                        {request.shippingAddress.district} {request.shippingAddress.province}{' '}
                                                        <span className="font-medium">{request.shippingAddress.postalCode}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    {request.message && (
                                        <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                                            <p className="text-sm text-blue-900 dark:text-blue-100">
                                                <strong>💬 ข้อความ:</strong> {request.message}
                                            </p>
                                        </div>
                                    )}

                                    {/* Rejection Reason */}
                                    {request.status === 'rejected' && request.rejectionReason && (
                                        <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                                            <p className="text-sm text-red-900 dark:text-red-100">
                                                <strong>เหตุผล:</strong> {request.rejectionReason}
                                            </p>
                                        </div>
                                    )}

                                    {/* Timestamps */}
                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-300 mb-3">
                                        <span>ขอเมื่อ: {new Date(request.requestedAt).toLocaleDateString('th-TH')}</span>
                                        {request.reviewedAt && (
                                            <span>
                                                {request.status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}เมื่อ:{' '}
                                                {new Date(request.reviewedAt).toLocaleDateString('th-TH')}
                                            </span>
                                        )}
                                        {request.shippedAt && (
                                            <span>จัดส่งเมื่อ: {new Date(request.shippedAt).toLocaleDateString('th-TH')}</span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        {request.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => onApprove(request.id)}
                                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium flex items-center gap-2"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    อนุมัติ
                                                </button>
                                                <button
                                                    onClick={() => setShowRejectModal(request.id)}
                                                    className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium flex items-center gap-2"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    ปฏิเสธ
                                                </button>
                                            </>
                                        )}

                                        {request.status === 'approved' && !request.shippedAt && (
                                            <button
                                                onClick={() => onMarkShipped(request.id)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
                                            >
                                                <Truck className="w-4 h-4" />
                                                ทำเครื่องหมายว่าส่งแล้ว
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">ปฏิเสธคำขอ</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                เหตุผลในการปฏิเสธ *
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="กรุณาระบุเหตุผล..."
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none dark:bg-slate-900 dark:text-white"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(null);
                                    setRejectionReason('');
                                }}
                                className="flex-1 py-3 border border-gray-200 dark:border-slate-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-white"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={() => handleReject(showRejectModal)}
                                disabled={!rejectionReason.trim()}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ยืนยันปฏิเสธ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
