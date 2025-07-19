import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  Settings,
  MoreHorizontal,
  Building2,
  Briefcase,
  Calendar,
  BookOpen,
  Users,
  FileText,
  BarChart3,
  MessageSquare,
  LogOut,
  Menu,
  X as XIcon,
  Plus,
  Feather
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';
import { cn } from '../lib/cva';

interface NavigationItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  badge?: number;
  isActive?: boolean;
}

// X-Style Navigation
export default function Navigation() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const sidebarTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle mouse movement for sidebar trigger
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Show sidebar when cursor is within 50px of left edge
      if (e.clientX <= 50) {
        if (sidebarTimeoutRef.current) {
          clearTimeout(sidebarTimeoutRef.current);
        }
        setIsSidebarVisible(true);
      } else if (e.clientX > 300 && isSidebarVisible) {
        // Hide sidebar when cursor moves away from sidebar area
        if (sidebarTimeoutRef.current) {
          clearTimeout(sidebarTimeoutRef.current);
        }
        sidebarTimeoutRef.current = setTimeout(() => {
          setIsSidebarVisible(false);
        }, 300); // 300ms delay before hiding
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (sidebarTimeoutRef.current) {
        clearTimeout(sidebarTimeoutRef.current);
      }
    };
  }, [isMobile, isSidebarVisible]);

  // Handle sidebar mouse enter/leave
  const handleSidebarMouseEnter = () => {
    if (sidebarTimeoutRef.current) {
      clearTimeout(sidebarTimeoutRef.current);
    }
    setIsSidebarVisible(true);
  };

  const handleSidebarMouseLeave = () => {
    if (sidebarTimeoutRef.current) {
      clearTimeout(sidebarTimeoutRef.current);
    }
    sidebarTimeoutRef.current = setTimeout(() => {
      setIsSidebarVisible(false);
    }, 500); // 500ms delay when leaving sidebar
  };

  // X-style navigation items
  const getNavigationItems = (): NavigationItem[] => {
    const baseItems = [
      { icon: Home, label: 'Home', path: '/feed' },
      { icon: Search, label: 'Explore', path: '/jobs' },
      { icon: Bell, label: 'Notifications', path: '/notifications', badge: 3 },
      { icon: Mail, label: 'Messages', path: '/messages', badge: 2 },
      { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
    ];

    if (user?.role === 'student') {
      return [
        ...baseItems,
        { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
        { icon: Building2, label: 'Companies', path: '/companies' },
        { icon: FileText, label: 'Applications', path: '/applications' },
        { icon: Calendar, label: 'Events', path: '/events' },
        { icon: User, label: 'Profile', path: '/profile' }
      ];
    } else if (user?.role === 'employer') {
      return [
        ...baseItems,
        { icon: BarChart3, label: 'Dashboard', path: '/employer-dashboard' },
        { icon: Briefcase, label: 'Post Jobs', path: '/post-job' },
        { icon: Users, label: 'Applicants', path: '/applicants' },
        { icon: User, label: 'Profile', path: '/profile' }
      ];
    } else {
      return [
        ...baseItems,
        { icon: BarChart3, label: 'Admin', path: '/admin' },
        { icon: Users, label: 'Users', path: '/users' },
        { icon: Settings, label: 'Settings', path: '/settings' },
        { icon: User, label: 'Profile', path: '/profile' }
      ];
    }
  };

  const navigationItems = getNavigationItems();
  const isCurrentPath = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  // Mobile Navigation
  if (isMobile) {
    return (
      <>
        {/* Mobile Top Bar */}
        <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b ${
          isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
        }`}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDark ? 'bg-white' : 'bg-black'
              }`}>
                <XIcon className={`h-4 w-4 ${isDark ? 'text-black' : 'text-white'}`} />
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <XIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className={`absolute top-full left-0 right-0 ${
              isDark ? 'bg-black/95' : 'bg-white/95'
            } backdrop-blur-xl border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} shadow-lg`}>
              <div className="p-4 space-y-1">
                {navigationItems.slice(5).map((item, index) => {
                  const Icon = item.icon;
                  const isActive = isCurrentPath(item.path);
                  return (
                    <Link
                      key={index}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-full transition-colors ${
                        isActive
                          ? isDark ? 'bg-gray-900' : 'bg-gray-100'
                          : isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-xl font-normal">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="ml-auto bg-blue-500 text-white text-sm px-2 py-1 rounded-full min-w-[20px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
                <div className={`border-t pt-4 mt-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-full"
                  >
                    <LogOut className="h-6 w-6 mr-3" />
                    <span className="text-xl font-normal">Log out</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Mobile Bottom Navigation */}
        <nav className={`fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t ${
          isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
        }`}>
          <div className="grid grid-cols-5 h-14">
            {navigationItems.slice(0, 5).map((item, index) => {
              const Icon = item.icon;
              const isActive = isCurrentPath(item.path);
              
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex flex-col items-center justify-center py-2 transition-all duration-200 relative ${
                    isActive 
                      ? isDark ? 'text-white' : 'text-black'
                      : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="relative">
                    <Icon className="h-6 w-6" />
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Spacer for mobile layout */}
        <div className="h-14" />
      </>
    );
  }

  // Desktop Navigation with Hidden Sidebar
  return (
    <>
      {/* Trigger Zone - invisible area at left edge */}
      <div 
        className="fixed left-0 top-0 w-12 h-full z-40 bg-transparent"
        onMouseEnter={() => setIsSidebarVisible(true)}
      />

      {/* Hidden Sidebar */}
      <aside 
        ref={sidebarRef}
        className={cn(
          "fixed left-0 top-0 h-full z-50 transform transition-all duration-300 ease-in-out",
          "w-72 backdrop-blur-xl border-r shadow-2xl",
          isDark ? 'bg-black/90 border-gray-800' : 'bg-white/90 border-gray-200',
          isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        )}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isDark ? 'bg-white' : 'bg-black'
            }`}>
              <Feather className={`h-5 w-5 ${isDark ? 'text-black' : 'text-white'}`} />
            </div>
            <div>
              <h2 className={`font-semibold text-lg ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                TalentLink
              </h2>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Welcome back, {user?.full_name?.split(' ')[0]}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = isCurrentPath(item.path);
            
            return (
              <Link
                key={index}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? isDark 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-blue-600 text-white shadow-lg'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-transform group-hover:scale-110",
                  isActive ? 'text-white' : ''
                )} />
                <span className="font-medium">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[18px] text-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
                {isActive && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-l-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          {/* User Profile Section */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors",
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                isDark ? 'bg-gray-700' : 'bg-gray-300'
              )}>
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 text-left">
                <p className={cn(
                  "font-medium text-sm",
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  {user?.full_name || 'User'}
                </p>
                <p className={cn(
                  "text-xs",
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {user?.role || 'Member'}
                </p>
              </div>
              <MoreHorizontal className={cn(
                "h-4 w-4",
                isDark ? 'text-gray-400' : 'text-gray-600'
              )} />
            </button>

            {/* Profile Menu */}
            {isProfileMenuOpen && (
              <div className={cn(
                "absolute bottom-full left-4 right-4 mb-2 rounded-xl shadow-lg border overflow-hidden",
                isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
              )}>
                <Link
                  to="/settings"
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 transition-colors",
                    isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                  )}
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Overlay when sidebar is visible */}
      {isSidebarVisible && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarVisible(false)}
        />
      )}
    </>
  );
}
