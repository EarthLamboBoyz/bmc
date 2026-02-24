import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Megaphone,
  Settings,
  Search,
  Briefcase,
  Trophy,
  User,
  ChevronDown,
  ChevronRight,
  X,
  Wallet,
  Bell,
  LogOut,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path?: string;
  badge?: number;
  children?: { label: string; path: string; badge?: number }[];
}

interface SidebarProps {
  onClose?: () => void;
}

// Mock data - ในระบบจริงควรดึงจาก API
const mockBadgeData = {
  liveCampaigns: 2,
  pendingApplications: 5,
  pendingSubmissions: 12,
};

export default function Sidebar({ onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['campaigns', 'my-campaigns']);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const brandMenu: MenuItem[] = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/brand/dashboard',
    },
    {
      icon: Megaphone,
      label: 'แคมเปญ',
      children: [
        { label: 'ทั้งหมด', path: '/brand/campaigns' },
        { 
          label: 'กำลังดำเนินการ', 
          path: '/brand/campaigns?status=live',
          badge: mockBadgeData.liveCampaigns 
        },
        { label: 'จบแล้ว', path: '/brand/campaigns?status=completed' },
        { label: 'สร้างใหม่', path: '/brand/campaigns/create' },
      ],
    },
    { 
      icon: Wallet, 
      label: 'การจ่ายเงิน', 
      path: '/brand/payments',
    },
    { 
      icon: Settings, 
      label: 'ตั้งค่า', 
      path: '/brand/settings' 
    },
  ];

  const creatorMenu: MenuItem[] = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/creator/dashboard' 
    },
    {
      icon: Search,
      label: 'หาแคมเปญ',
      children: [
        { label: 'ทั้งหมด', path: '/creator/campaigns' },
        { label: 'แนะนำ', path: '/creator/campaigns?filter=recommended' },
        { label: 'Challenge', path: '/creator/campaigns?filter=challenge' },
      ],
    },
    {
      icon: Briefcase,
      label: 'แคมเปญของฉัน',
      children: [
        { 
          label: 'กำลังทำ', 
          path: '/creator/my-campaigns?status=active',
          badge: mockBadgeData.liveCampaigns 
        },
        { 
          label: 'รออนุมัติ', 
          path: '/creator/my-campaigns?status=pending',
          badge: mockBadgeData.pendingApplications 
        },
        { label: 'เสร็จแล้ว', path: '/creator/my-campaigns?status=completed' },
      ],
    },
    {
      icon: Trophy,
      label: 'รายได้',
      children: [
        { label: 'สรุป', path: '/creator/earnings' },
        { label: 'รางวัลที่ได้', path: '/creator/rewards' },
      ],
    },
    { 
      icon: Settings, 
      label: 'ตั้งค่า', 
      path: '/creator/settings' 
    },
  ];

  const menu = user?.role === 'brand' ? brandMenu : creatorMenu;

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev =>
      prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]
    );
  };

  const isActive = (path: string) => {
    const basePath = path.split('?')[0];
    return location.pathname === basePath || location.pathname.startsWith(basePath + '/');
  };

  const isExactActive = (path: string) => {
    return location.pathname + location.search === path;
  };

  // Close mobile menu when route changes
  useEffect(() => {
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  }, [location.pathname, location.search]);

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 h-screen overflow-y-auto flex flex-col">
      {/* Logo Section */}
      <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg gradient-text leading-tight">BMC</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">BrandMeetCreator</span>
          </div>
        </Link>
        
        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="mb-4 px-3">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            เมนูหลัก
          </p>
        </div>
        
        <ul className="space-y-1">
          {menu.map((item) => (
            <li key={item.label}>
              {item.path ? (
                <Link
                  to={item.path}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive(item.path)
                      ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary font-semibold shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  <item.icon className={`
                    w-5 h-5 transition-transform duration-200
                    ${hoveredItem === item.label ? 'scale-110' : ''}
                    ${isActive(item.path) ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}
                  `} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <span className="bg-secondary text-white text-xs px-2 py-0.5 rounded-full font-medium min-w-[20px] text-center animate-pulse">
                      {item.badge}
                    </span>
                  ) : isActive(item.path) ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  ) : null}
                </Link>
              ) : (
                <div className="space-y-1">
                  <button
                    onClick={() => toggleMenu(item.label)}
                    onMouseEnter={() => setHoveredItem(item.label)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${item.children?.some(child => isActive(child.path || ''))
                        ? 'text-primary font-medium bg-primary/5'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                      }
                    `}
                  >
                    <item.icon className={`
                      w-5 h-5 transition-all duration-200
                      ${hoveredItem === item.label ? 'scale-110' : ''}
                      ${item.children?.some(child => isActive(child.path || '')) 
                        ? 'text-primary' 
                        : 'text-gray-400 dark:text-gray-500'
                      }
                    `} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {expandedMenus.includes(item.label) ? (
                      <ChevronDown className="w-4 h-4 text-gray-400 transition-transform" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400 transition-transform" />
                    )}
                  </button>
                  
                  {/* Submenu */}
                  {expandedMenus.includes(item.label) && item.children && (
                    <ul className="ml-4 mt-1 space-y-0.5 border-l-2 border-gray-100 dark:border-slate-700 pl-3">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <Link
                            to={child.path}
                            className={`
                              flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-200
                              ${isExactActive(child.path)
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-300'
                              }
                            `}
                          >
                            <span className="flex-1">{child.label}</span>
                            {child.badge ? (
                              <span className="bg-secondary text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium min-w-[18px] text-center">
                                {child.badge}
                              </span>
                            ) : isExactActive(child.path) ? (
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-medium">
            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
              {user?.name || user?.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {user?.role === 'brand' ? 'แบรนด์' : 'ครีเอเตอร์'}
            </p>
          </div>
          <button 
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="ออกจากระบบ"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
