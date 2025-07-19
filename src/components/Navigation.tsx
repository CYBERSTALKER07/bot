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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // Changed to lg breakpoint
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // For hover expansion

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Changed to lg breakpoint
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // X-style navigation items
  const getNavigationItems = (): NavigationItem[] => {
    const baseItems = [
      { icon: Home, label: 'Home', path: '/feed' },
      { icon: Search, label: 'Explore', path: '/jobs' },
      { icon: Bell, label: 'Notifications', path: '/notifications', badge: 3 },
      // { icon: Mail, label: 'Messages', path: '/messages', badge: 2 },
      // { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
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

  // Desktop Navigation
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full z-40 transition-all duration-300",
        "border-r backdrop-blur-xl",
        isDark ? 'bg-black/95 border-gray-800' : 'bg-white/95 border-gray-200',
        isExpanded ? 'w-64' : 'w-20'
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo/Brand */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isDark ? 'bg-white' : 'bg-black'
            }`}>
              <Feather className={`h-5 w-5 ${isDark ? 'text-black' : 'text-white'}`} />
            </div>
            {isExpanded && (
              <div className="ml-3 overflow-hidden">
                <h2 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  TalentLink
                </h2>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col flex-1 p-4 space-y-2">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = isCurrentPath(item.path);
            
            return (
              <Link
                key={index}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative",
                  isExpanded ? 'space-x-3' : 'justify-center',
                  isActive
                    ? isDark 
                      ? 'bg-white text-black' 
                      : 'bg-black text-white'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <div className="relative">
                  <Icon className="h-6 w-6" />
                  {item.badge && item.badge > 0 && !isExpanded && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                
                {isExpanded && (
                  <>
                    <span className="font-medium text-xl">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-sm px-2 py-1 rounded-full min-w-[20px] text-center">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className={cn(
                    "absolute left-full ml-4 px-3 py-2 rounded-lg text-sm font-medium",
                    "opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50",
                    "whitespace-nowrap shadow-lg",
                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900 border'
                  )}>
                    {item.label}
                    {item.badge && item.badge > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Post Button */}
        <div className="p-4">
          <Button
            className={cn(
              "w-full rounded-full font-bold transition-all duration-200",
              isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800',
              isExpanded ? 'py-3' : 'aspect-square p-3'
            )}
            onClick={() => navigate('/post-job')}
          >
            {isExpanded ? (
              'Post'
            ) : (
              <Plus className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={cn(
                "w-full flex items-center rounded-xl transition-all duration-200",
                isExpanded ? 'space-x-3 p-3' : 'justify-center p-3',
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              )}
            >
              {/* Avatar */}
              <div className="relative">
                {user?.avatar_url ? (
                  <img 
                    src={user.avatar_url}
                    alt={user?.full_name || 'User'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold",
                    isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-800'
                  )}>
                    {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              
              {isExpanded && (
                <>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className={cn(
                      "font-medium text-base truncate",
                      isDark ? 'text-white' : 'text-gray-900'
                    )}>
                      {user?.full_name || 'User'}
                    </p>
                    <p className={cn(
                      "text-sm truncate",
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      @{user?.email?.split('@')[0]}
                    </p>
                  </div>
                  <MoreHorizontal className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  )} />
                </>
              )}
            </button>

            {/* Profile Menu */}
            {isProfileMenuOpen && (
              <div className={cn(
                "absolute bottom-full mb-2 rounded-3xl shadow-lg border w-[300px] overflow-hidden z-50",
                "transition-all duration-300 ease-out",
                "animate-in slide-in-from-bottom-2 fade-in-0",
                isDark ? 'bg-black border-gray-800 backdrop-blur-xl' : 'bg-white/95 border-gray-200 backdrop-blur-xl',
                isExpanded ? 'left-3 right-3' : 'left-1/2 transform -translate-x-1/2 w-48'
              )}>
                <Link
                  to="/feed"
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 transition-all duration-200",
                    "hover:translate-x-1 transform",
                    isDark ? 'hover:bg-gray-800 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                  )}
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Home className="h-4 w-4 transition-transform duration-200" />
                  <span className="text-sm font-medium">Home Feed</span>
                </Link>
                <Link
                  to="/settings"
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 transition-all duration-200",
                    "hover:translate-x-1 transform",
                    isDark ? 'hover:bg-gray-800 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                  )}
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4 transition-transform duration-200 group-hover:rotate-45" />
                  <span className="text-sm font-medium">Settings & Privacy</span>
                </Link>
                <div className={cn(
                  "border-t transition-colors duration-200",
                  isDark ? 'border-gray-700' : 'border-gray-200'
                )} />
                <button
                  onClick={handleLogout}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 transition-all duration-200",
                    "hover:translate-x-1 transform",
                    "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
                  )}
                >
                  <LogOut className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
                  <span className="text-sm font-medium">Log out @{user?.email?.split('@')[0]}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Backdrop Blur Overlay when Navigation is Active/Expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30 transition-all duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
}
