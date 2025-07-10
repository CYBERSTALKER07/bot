import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  School,
  Search,
  Business,
  Message,
  Event,
  MenuBook,
  AccountCircle,
  Logout,
  Notifications,
  Menu,
  Close,
  ChevronLeft,
  ChevronRight,
  Home,
  Work,
  Group,  
  Settings,
  Assignment,
  Dashboard,
  Article,
  Analytics,
  Feed as FeedIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ui/ThemeToggle';

export default function Navigation() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Navigation items based on user role
  const getNavigationItems = () => {
    if (user?.role === 'student') {
      return [
        { icon: FeedIcon, label: 'Feed', path: '/feed' },
        { icon: Dashboard, label: 'Dashboard', path: '/job-search' },
        { icon: Article, label: 'Learning Passport', path: '/digital-learning-passport' },
        { icon: Analytics, label: 'Skills Audit', path: '/skills-audit-system' },
        { icon: Search, label: 'Find Jobs', path: '/jobs' },
        { icon: Business, label: 'Companies', path: '/companies' },
        { icon: Message, label: 'Messages', path: '/messages' },
        { icon: Event, label: 'Events', path: '/events' },
        { icon: MenuBook, label: 'Resources', path: '/resources' },
      ];
    }

    if (user?.role === 'employer') {
      return [
        { icon: FeedIcon, label: 'Feed', path: '/feed' },
        { icon: Dashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Work, label: 'Post Jobs', path: '/post-job' },
        { icon: Group, label: 'Applicants', path: '/applicants' },
        { icon: Business, label: 'Companies', path: '/companies' },
        { icon: Message, label: 'Messages', path: '/messages' },
        { icon: Assignment, label: 'Resources', path: '/resources' },
      ];
    }

    if (user?.role === 'admin') {
      return [
        { icon: FeedIcon, label: 'Feed', path: '/feed' },
        { icon: Dashboard, label: 'Admin Panel', path: '/dashboard' },
        { icon: Group, label: 'Users', path: '/users' },
        { icon: Work, label: 'Jobs', path: '/jobs' },
        { icon: Business, label: 'Companies', path: '/companies' },
        { icon: Assignment, label: 'Reports', path: '/reports' },
        { icon: Settings, label: 'Settings', path: '/settings' },
      ];
    }

    // Default items for non-authenticated users
    return [
      { icon: FeedIcon, label: 'Feed', path: '/feed' },
      { icon: Dashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Search, label: 'Find Jobs', path: '/jobs' },
      { icon: Business, label: 'Companies', path: '/companies' },
      { icon: Message, label: 'Messages', path: '/messages' },
      { icon: Event, label: 'Events', path: '/events' },
      { icon: MenuBook, label: 'Resources', path: '/resources' },
    ];
  };

  const navigationItems = getNavigationItems();
  const mobileNavItems = navigationItems.slice(0, 4);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isCurrentPath = (path: string) => location.pathname === path;

  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile Navigation (Bottom Navigation)
  if (isMobile) {
    return (
      <>
        {/* Minimalistic Top App Bar for Mobile */}
        <div className={`fixed top-0 left-0 right-0 z-50 ${
          isDark 
            ? 'bg-dark-surface/95 backdrop-blur-sm border-b border-gray-700' 
            : 'bg-white/95 backdrop-blur-sm border-b border-gray-200'
        }`}>
          <div className="flex justify-between items-center h-14 px-4">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2">
              <School className={`h-6 w-6 ${
                isDark ? 'text-lime' : 'text-asu-maroon'
              }`} />
              <span className={`font-semibold ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}>
                ASU
              </span>
            </Link>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Notifications className={`h-5 w-5 ${
                  isDark ? 'text-dark-text' : 'text-gray-700'
                }`} />
              </div>

              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                isDark 
                  ? 'bg-lime/20 text-lime' 
                  : 'bg-asu-maroon/10 text-asu-maroon'
              }`}>
                {user?.name?.charAt(0) || <AccountCircle className="h-5 w-5" />}
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-1.5 rounded-md ${
                  isDark 
                    ? 'text-dark-text hover:bg-dark-bg' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {isMobileMenuOpen ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className={`border-t ${
              isDark ? 'bg-dark-surface border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="py-2">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = isCurrentPath(item.path);
                  
                  return (
                    <Link
                      key={index}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
                        active
                          ? isDark 
                            ? 'bg-lime/10 text-lime border-r-2 border-lime'
                            : 'bg-asu-maroon/5 text-asu-maroon border-r-2 border-asu-maroon'
                          : isDark
                            ? 'text-dark-text hover:bg-dark-bg'
                            : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                
                <div className={`border-t mx-4 my-2 ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`} />
                
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className={`flex items-center space-x-3 px-4 py-3 w-full text-left transition-colors ${
                    isDark 
                      ? 'text-red-400 hover:bg-red-400/10' 
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Logout className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className={`fixed bottom-0 left-0 right-0 z-40 ${
          isDark 
            ? 'bg-dark-surface/95 backdrop-blur-sm border-t border-gray-700' 
            : 'bg-white/95 backdrop-blur-sm border-t border-gray-200'
        }`}>
          <div className="grid grid-cols-4 h-16">
            {mobileNavItems.map((item, index) => {
              const Icon = item.icon;
              const active = isCurrentPath(item.path);
              
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex flex-col items-center justify-center py-2 transition-colors ${
                    active
                      ? isDark ? 'text-lime' : 'text-asu-maroon'
                      : isDark ? 'text-dark-muted' : 'text-gray-600'
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Content Spacers */}
        <div className="h-14" />
        <div className="h-16" />
      </>
    );
  }

  // Desktop Minimalistic Sidebar
  return (
    <>
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-out ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${
          isDark 
            ? 'bg-dark-surface border-r border-gray-700' 
            : 'bg-white border-r border-gray-200'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center h-16 px-4 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {!isCollapsed ? (
            <Link to="/dashboard" className="flex items-center space-x-3">
              <School className={`h-7 w-7 ${
                isDark ? 'text-lime' : 'text-asu-maroon'
              }`} />
              <span className={`text-lg font-semibold ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}>
                AUT
              </span>
            </Link>
          ) : (
            <Link to="/dashboard" className="flex justify-center w-full">
              <School className={`h-7 w-7 ${
                isDark ? 'text-lime' : 'text-asu-maroon'
              }`} />
            </Link>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const active = isCurrentPath(item.path);
              
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? isDark 
                        ? 'bg-lime/10 text-lime' 
                        : 'bg-asu-maroon/10 text-asu-maroon'
                      : isDark
                        ? 'text-dark-muted hover:bg-dark-bg hover:text-dark-text'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`flex-shrink-0 h-5 w-5 ${
                    isCollapsed ? 'mx-auto' : 'mr-3'
                  }`} />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between w-full">
                      <span>{item.label}</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Section */}
        <div className={`border-t px-2 py-4 ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {!isCollapsed ? (
            <div className="flex items-center px-3 py-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                isDark 
                  ? 'bg-lime/20 text-lime' 
                  : 'bg-asu-maroon/10 text-asu-maroon'
              }`}>
                {user?.name?.charAt(0) || <AccountCircle className="h-5 w-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>
                  {user?.name || 'User'}
                </p>
                <p className={`text-xs truncate ${
                  isDark ? 'text-dark-muted' : 'text-gray-500'
                }`}>
                  {user?.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                isDark 
                  ? 'bg-lime/20 text-lime' 
                  : 'bg-asu-maroon/10 text-asu-maroon'
              }`}>
                {user?.name?.charAt(0) || <AccountCircle className="h-5 w-5" />}
              </div>
            </div>
          )}
          
          {/* Theme Toggle */}
          <div className={`mt-3 ${isCollapsed ? 'flex justify-center' : 'px-3'}`}>
            <ThemeToggle size="small" />
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full mt-2 flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              isDark 
                ? 'text-red-400 hover:bg-red-400/10' 
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <Logout className={`flex-shrink-0 h-5 w-5 ${
              isCollapsed ? 'mx-auto' : 'mr-3'
            }`} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center shadow-md border transition-all duration-200 hover:scale-110 ${
            isDark 
              ? 'bg-dark-surface border-gray-600 text-dark-text hover:bg-dark-bg' 
              : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </div>

      {/* Main Content Spacer */}
      <div className={`transition-all duration-300 ease-out ${
        isCollapsed ? 'ml-16' : 'ml-64'
      }`} />
    </>
  );
}
