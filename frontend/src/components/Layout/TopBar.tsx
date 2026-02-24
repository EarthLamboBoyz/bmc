import { useState } from 'react';
import { Bell, Search, LogOut, User, ChevronDown, Menu, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { mockNotifications } from '../../data/mockData';
import DarkModeToggle from '../DarkModeToggle';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = mockNotifications.filter(n => !n.read && n.userId === user?.id).length;

  const handleLogout = () => {
    logout();
    window.location.href = '/'; // Force reload to clear state effectively
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-600 fixed top-0 left-0 lg:left-64 right-0 z-30">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Hamburger Menu (Mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-secondary text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 bg-black/5 bg-opacity-10 z-30 md:hidden"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="fixed left-4 right-4 top-20 md:absolute md:left-auto md:right-0 md:top-12 w-auto md:w-80 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg overflow-hidden z-40">
                  <div className="p-4 border-b border-gray-100 dark:border-slate-600 flex items-center justify-between">
                    <h3 className="font-semibold dark:text-gray-100">การแจ้งเตือน</h3>
                    <button className="text-sm text-primary hover:underline">
                      อ่านทั้งหมด
                    </button>
                  </div>
                  <div className="max-h-[60vh] md:max-h-80 overflow-y-auto">
                    {mockNotifications
                      .filter(n => n.userId === user?.id)
                      .map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            if (notif.link) {
                              navigate(notif.link);
                              setShowNotifications(false);
                            }
                          }}
                          className={`p-4 border-b border-gray-50 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors ${!notif.read ? 'bg-primary/5 dark:bg-primary/10' : ''
                            }`}
                        >
                          <p className="font-medium text-sm dark:text-gray-100">{notif.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            {new Date(notif.createdAt).toLocaleDateString('th-TH')}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <DarkModeToggle />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium dark:text-gray-100">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-300 capitalize">{user?.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 bg-black/5 z-30 md:hidden"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="fixed left-4 right-4 top-20 md:absolute md:left-auto md:right-0 md:top-12 w-auto md:w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg overflow-hidden z-40">
                  <button
                    onClick={() => {
                      navigate(user?.role === 'brand' ? '/brand/settings' : '/creator/settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>ตั้งค่าโปรไฟล์</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
