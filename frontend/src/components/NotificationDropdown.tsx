import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Check, X } from 'lucide-react';
import { Notification, notificationTypeConfig } from '../types/notification';

interface NotificationDropdownProps {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
}

export default function NotificationDropdown({
    notifications,
    onMarkAsRead,
    onMarkAllAsRead,
}: NotificationDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const unreadCount = notifications.filter(n => !n.read).length;
    const recentNotifications = notifications.slice(0, 5);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            onMarkAsRead(notification.id);
        }
        if (notification.actionUrl) {
            navigate(notification.actionUrl);
        }
        setIsOpen(false);
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'เมื่อสักครู่';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} นาทีที่แล้ว`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ชั่วโมงที่แล้ว`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} วันที่แล้ว`;
        return date.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' });
    };

    return (
        <div ref={dropdownRef} className="relative">
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-2xl z-50 max-h-[600px] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-600 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            การแจ้งเตือน
                            {unreadCount > 0 && (
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">
                                    ({unreadCount} ใหม่)
                                </span>
                            )}
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onMarkAllAsRead();
                                }}
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                <Check className="w-3 h-3" />
                                อ่านทั้งหมด
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto flex-1">
                        {recentNotifications.length === 0 ? (
                            <div className="py-12 text-center text-gray-500 dark:text-gray-300">
                                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="text-sm">ไม่มีการแจ้งเตือน</p>
                            </div>
                        ) : (
                            recentNotifications.map((notification) => {
                                const config = notificationTypeConfig[notification.type];
                                return (
                                    <button
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`w-full px-4 py-3 border-b border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-left ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            {/* Icon */}
                                            <div className={`w-10 h-10 ${config.bgColor} dark:opacity-80 rounded-full flex items-center justify-center flex-shrink-0 text-xl`}>
                                                {config.icon}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <p className={`font-medium text-sm ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                                        {notification.title}
                                                    </p>
                                                    {!notification.read && (
                                                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-1">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                                    {formatTimeAgo(notification.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    {recentNotifications.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-200 dark:border-slate-600">
                            <Link
                                to="/notifications"
                                onClick={() => setIsOpen(false)}
                                className="block text-center text-sm text-primary hover:underline font-medium"
                            >
                                ดูการแจ้งเตือนทั้งหมด →
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
