import { useState } from 'react';
import { Bell, Check, Filter } from 'lucide-react';
import { DashboardLayout } from '../components/Layout';
import { Notification, NotificationType, notificationTypeConfig } from '../types/notification';

// Mock notifications data
const mockNotifications: Notification[] = [
    {
        id: '1',
        userId: 'current-user-id',
        type: 'submission_approved',
        title: 'งานของคุณได้รับการอนุมัติ!',
        message: 'งาน Day 5 ของแคมเปญ "Summer Sale 2026" ได้รับการอนุมัติแล้ว',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        actionUrl: '/creator/campaigns/1',
        metadata: { campaignId: '1', campaignName: 'Summer Sale 2026' },
    },
    {
        id: '2',
        userId: 'current-user-id',
        type: 'new_campaign',
        title: 'แคมเปญใหม่เปิดรับสมัคร',
        message: 'แคมเปญ "Valentine Special" เปิดรับสมัครแล้ว งบประมาณ ฿50,000',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        actionUrl: '/creator/campaigns',
    },
    {
        id: '3',
        userId: 'current-user-id',
        type: 'submission_revision',
        title: 'ต้องแก้ไขงาน',
        message: 'งาน Day 3 ต้องการการแก้ไข: คุณภาพวิดีโอต่ำ',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        actionUrl: '/creator/campaigns/1',
    },
    {
        id: '4',
        userId: 'current-user-id',
        type: 'payment_received',
        title: 'ได้รับเงิน ฿5,000',
        message: 'คุณได้รับเงินจากแคมเปญ "Summer Sale 2026"',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        actionUrl: '/creator/earnings',
        metadata: { amount: 5000 },
    },
];

const tabs = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'unread', label: 'ยังไม่อ่าน' },
    { id: 'read', label: 'อ่านแล้ว' },
];

const typeFilters: { id: NotificationType | 'all'; label: string }[] = [
    { id: 'all', label: 'ทุกประเภท' },
    { id: 'new_submission', label: 'งานใหม่' },
    { id: 'submission_approved', label: 'การอนุมัติ' },
    { id: 'new_campaign', label: 'แคมเปญใหม่' },
    { id: 'system', label: 'ระบบ' },
];

export default function Notifications() {
    const [activeTab, setActiveTab] = useState('all');
    const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');
    const [notifications, setNotifications] = useState(mockNotifications);

    const filteredNotifications = notifications.filter((notification) => {
        // Tab filter
        if (activeTab === 'unread' && notification.read) return false;
        if (activeTab === 'read' && !notification.read) return false;

        // Type filter
        if (typeFilter !== 'all' && notification.type !== typeFilter) return false;

        return true;
    });

    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleMarkAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const handleMarkAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'เมื่อสักครู่';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} นาทีที่แล้ว`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ชั่วโมงที่แล้ว`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} วันที่แล้ว`;
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold dark:text-white">การแจ้งเตือน</h1>
                        <p className="text-gray-500 dark:text-gray-300">
                            ติดตามการอัพเดทและกิจกรรมทั้งหมด
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            อ่านทั้งหมด ({unreadCount})
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 mb-4 border-b border-gray-200 dark:border-slate-600">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            {tab.label}
                            {tab.id === 'unread' && unreadCount > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Type Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as NotificationType | 'all')}
                        className="px-3 py-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                    >
                        {typeFilters.map((filter) => (
                            <option key={filter.id} value={filter.id}>
                                {filter.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600">
                        <Bell className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-300">ไม่มีการแจ้งเตือน</p>
                    </div>
                ) : (
                    filteredNotifications.map((notification) => {
                        const config = notificationTypeConfig[notification.type];
                        return (
                            <div
                                key={notification.id}
                                className={`bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-600 p-4 transition-all hover:shadow-md ${!notification.read ? 'ring-2 ring-primary/20' : ''
                                    }`}
                            >
                                <div className="flex gap-4">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 ${config.bgColor} dark:opacity-80 rounded-full flex items-center justify-center flex-shrink-0 text-2xl`}>
                                        {config.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className={`font-semibold ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {notification.title}
                                            </h3>
                                            {!notification.read && (
                                                <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0 mt-1" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                {formatTimeAgo(notification.createdAt)}
                                            </p>
                                            {!notification.read && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    className="text-xs text-primary hover:underline"
                                                >
                                                    ทำเครื่องหมายว่าอ่านแล้ว
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </DashboardLayout>
    );
}
