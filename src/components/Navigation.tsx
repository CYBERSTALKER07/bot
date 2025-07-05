import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
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
  PersonAdd,
  AutoAwesome as Sparkles,
  LocalCafe as Coffee,
  Star
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ui/ThemeToggle';
import Badge from './ui/Badge';

export default function Navigation() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { icon: Dashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Search, label: 'Find Jobs', path: '/jobs' },
      { icon: Message, label: 'Messages', path: '/messages' },
      { icon: Event, label: 'Events', path: '/events' },
      { icon: MenuBook, label: 'Resources', path: '/resources' },
    ];

    if (user?.role === 'employer') {
      return [
        { icon: Dashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Work, label: 'Post Jobs', path: '/post-job' },
        { icon: Group, label: 'Applicants', path: '/applicants' },
        { icon: Message, label: 'Messages', path: '/messages' },
        { icon: Assignment, label: 'Resources', path: '/resources' },
      ];
    }

    if (user?.role === 'admin') {
      return [
        { icon: Dashboard, label: 'Admin Panel', path: '/dashboard' },
        { icon: Group, label: 'Users', path: '/users' },
        { icon: Work, label: 'Jobs', path: '/jobs' },
        { icon: Assignment, label: 'Reports', path: '/reports' },
        { icon: Settings, label: 'Settings', path: '/settings' },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  // Mobile navigation items (bottom navigation for mobile)
  const mobileNavItems = navigationItems.slice(0, 4);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced sidebar animations with stagger effect
      gsap.set('.nav-item', { x: -50, opacity: 0 });
      gsap.to('.nav-item', {
        x: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2
      });

      // Floating decorative elements
      gsap.to('.nav-decoration', {
        y: -15,
        x: 10,
        rotation: 360,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

    }, sidebarRef);

    return () => ctx.revert();
  }, []);

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
        {/* Top App Bar for Mobile */}
        <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isDark 
            ? 'bg-dark-surface/95 backdrop-blur-lg border-b border-gray-600' 
            : 'bg-white/95 backdrop-blur-lg border-b border-gray-200'
        }`}>
          {/* Material Design elevation */}
          <div className={`absolute top-0 left-0 w-full h-1 ${
            isDark 
              ? 'bg-gradient-to-r from-lime via-dark-accent to-lime' 
              : 'bg-gradient-to-r from-asu-maroon via-asu-gold to-asu-maroon'
          }`}></div>
          
          {/* Decorative elements */}
          <Coffee className={`nav-decoration absolute top-1 right-40 h-3 w-3 hidden sm:block ${
            isDark ? 'text-lime' : 'text-asu-gold'
          }`} />
          <Star className={`nav-decoration absolute bottom-1 right-60 h-2 w-2 hidden sm:block ${
            isDark ? 'text-lime' : 'text-asu-maroon'
          }`} />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/dashboard" className="flex items-center space-x-2 group">
                <div className="relative">
                  <School className={`h-8 w-8 transition-colors duration-300 ${
                    isDark 
                      ? 'text-lime group-hover:text-dark-accent' 
                      : 'text-asu-maroon group-hover:text-asu-gold'
                  }`} />
                  <div className={`absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full animate-pulse ${
                    isDark ? 'bg-lime' : 'bg-asu-gold'
                  }`}></div>
                </div>
                <span className={`font-bold text-lg sm:text-xl relative ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>
                  <span className="hidden sm:inline">ASU Handshake</span>
                  <span className="sm:hidden">ASU</span>
                  <div className={`absolute -bottom-1 left-0 w-full h-0.5 transform -skew-x-12 ${
                    isDark ? 'bg-lime' : 'bg-asu-maroon'
                  }`}></div>
                </span>
              </Link>

              {/* Right Side */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <ThemeToggle size="small" />
                
                {/* Notifications */}
                <div className="relative">
                  <Badge badgeContent={unreadCount} color="error" size="small">
                    <Notifications className={`h-6 w-6 ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`} />
                  </Badge>
                </div>

                {/* Profile */}
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    isDark 
                      ? 'bg-gradient-to-br from-lime to-dark-accent text-dark-surface' 
                      : 'bg-gradient-to-br from-asu-maroon to-asu-maroon-dark text-white'
                  }`}>
                    {user?.name?.charAt(0) || <AccountCircle className="h-5 w-5" />}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 ${
                    isDark ? 'border-dark-surface' : 'border-white'
                  }`}></div>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`p-2 transition-colors ${
                    isDark 
                      ? 'text-dark-text hover:text-lime' 
                      : 'text-gray-700 hover:text-asu-maroon'
                  }`}
                >
                  {isMobileMenuOpen ? <Close className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              className={`absolute top-16 left-0 right-0 shadow-2xl border-b-2 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto transition-colors duration-300 ${
                isDark 
                  ? 'bg-dark-surface border-gray-600' 
                  : 'bg-white border-gray-200'
              }`}
            >
              {/* User Profile Section */}
              <div className={`p-4 border-b ${
                isDark 
                  ? 'border-gray-600 bg-gradient-to-r from-lime/5 to-dark-accent/5' 
                  : 'border-gray-200 bg-gradient-to-r from-asu-maroon/5 to-asu-gold/5'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    isDark 
                      ? 'bg-gradient-to-br from-lime to-dark-accent text-dark-surface' 
                      : 'bg-gradient-to-br from-asu-maroon to-asu-maroon-dark text-white'
                  }`}>
                    {user?.name?.charAt(0) || <AccountCircle className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      isDark ? 'text-dark-text' : 'text-gray-900'
                    }`}>
                      {user?.name || 'User'}
                    </h3>
                    <p className={`text-sm ${
                      isDark ? 'text-dark-muted' : 'text-gray-600'
                    }`}>
                      {user?.email}
                    </p>
                    <span className={`inline-block px-2 py-1 mt-1 text-xs rounded-full ${
                      isDark 
                        ? 'bg-lime/20 text-lime' 
                        : 'bg-asu-maroon/10 text-asu-maroon'
                    }`}>
                      {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="p-4">
                <div className="space-y-2">
                  {navigationItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = isCurrentPath(item.path);
                    
                    return (
                      <Link
                        key={index}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`nav-item flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                          active
                            ? isDark 
                              ? 'bg-gradient-to-r from-lime to-dark-accent text-dark-surface border-l-4 border-lime'
                              : 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white border-l-4 border-asu-gold'
                            : isDark
                              ? 'text-dark-text hover:bg-lime/10 hover:text-lime'
                              : 'text-gray-700 hover:bg-asu-maroon/10 hover:text-asu-maroon'
                        }`}
                      >
                        <div className={`rounded-xl p-2 ${
                          active 
                            ? isDark 
                              ? 'bg-dark-surface/25' 
                              : 'bg-white/25'
                            : isDark
                              ? 'bg-lime/15'
                              : 'bg-asu-maroon/15'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Logout */}
              <div className={`p-4 border-t ${
                isDark ? 'border-gray-600' : 'border-gray-200'
              }`}>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'text-red-400 hover:bg-red-400/10' 
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <div className={`rounded-xl p-2 ${
                    isDark ? 'bg-red-400/15' : 'bg-red-100'
                  }`}>
                    <Logout className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${
          isDark 
            ? 'bg-dark-surface/95 backdrop-blur-lg border-t border-gray-600' 
            : 'bg-white/95 backdrop-blur-lg border-t border-gray-200'
        }`}>
          <div className="grid grid-cols-4 h-16">
            {mobileNavItems.map((item, index) => {
              const Icon = item.icon;
              const active = isCurrentPath(item.path);
              
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex flex-col items-center justify-center py-2 px-3 transition-colors ${
                    active
                      ? isDark 
                        ? 'text-lime' 
                        : 'text-asu-maroon'
                      : isDark
                        ? 'text-dark-muted hover:text-lime'
                        : 'text-gray-600 hover:text-asu-maroon'
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                  {active && <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                    isDark ? 'bg-lime' : 'bg-asu-maroon'
                  }`}></div>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Content Spacers */}
        <div className="h-16" /> {/* Top spacer */}
        <div className="h-16" /> {/* Bottom spacer */}
      </>
    );
  }

  // Desktop/Tablet Navigation (Sidebar)
  return (
    <>
      {/* Desktop Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full shadow-2xl border-r-2 z-40 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-80'
        } ${
          isDark 
            ? 'bg-dark-surface border-gray-600' 
            : 'bg-white border-gray-200'
        }`}
      >
        {/* Decorative elements */}
        {!isCollapsed && (
          <>
            <div className={`nav-decoration absolute top-8 right-8 w-3 h-3 rounded-full ${
              isDark ? 'bg-lime' : 'bg-asu-gold'
            }`}></div>
            <div className={`nav-decoration absolute top-20 right-12 w-2 h-2 rounded-full ${
              isDark ? 'bg-lime' : 'bg-asu-maroon'
            }`}></div>
            <Sparkles className={`nav-decoration absolute top-12 right-16 h-4 w-4 ${
              isDark ? 'text-lime/60' : 'text-asu-gold/60'
            }`} />
          </>
        )}

        {/* Header */}
        <div className={`border-b ${isCollapsed ? 'p-4' : 'p-6'} ${
          isDark ? 'border-gray-600' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-center">
            <div className="relative">
              <School className={`${isCollapsed ? 'h-8 w-8' : 'h-10 w-10'} ${
                isDark ? 'text-lime' : 'text-asu-maroon'
              }`} />
              {!isCollapsed && <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse ${
                isDark ? 'bg-lime' : 'bg-asu-gold'
              }`}></div>}
            </div>
            {!isCollapsed && (
              <div className="ml-3 flex-1">
                <h1 className={`text-xl font-bold ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>ASU Handshake</h1>
                <p className={`text-sm ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}>Your career platform</p>
              </div>
            )}
          </div>
          
          {/* Theme Toggle in Header */}
          {!isCollapsed && (
            <div className="mt-4 flex justify-center">
              <ThemeToggle variant="switch" size="small" />
            </div>
          )}
        </div>

        {/* User Profile Section */}
        <div className={`border-b border-gray-200 ${isCollapsed ? 'p-3' : 'p-4'}`}>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                isDark 
                  ? 'bg-gradient-to-br from-lime to-dark-accent text-dark-surface' 
                  : 'bg-gradient-to-br from-asu-maroon to-asu-maroon-dark text-white'
              }`}>
                {user?.name?.charAt(0) || <AccountCircle className="h-6 w-6" />}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 ${
                isDark ? 'border-dark-surface' : 'border-white'
              }`}></div>
            </div>
            {!isCollapsed && (
              <div className="ml-3 flex-1">
                <h3 className={`font-semibold ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>
                  {user?.name || 'User'}
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}>
                  {user?.email}
                </p>
                <span className={`inline-block px-2 py-1 mt-1 text-xs rounded-full ${
                  isDark 
                    ? 'bg-lime/20 text-lime' 
                    : 'bg-asu-maroon/10 text-asu-maroon'
                }`}>
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto">
          <div className={`space-y-2 ${isCollapsed ? 'p-2' : 'p-4'}`}>
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const active = isCurrentPath(item.path);
              
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`nav-item group relative flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                    active
                      ? isDark 
                        ? 'bg-gradient-to-r from-lime to-dark-accent text-dark-surface shadow-lg'
                        : 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white shadow-lg'
                      : isDark
                        ? 'text-dark-text hover:bg-gradient-to-r hover:from-lime/15 hover:to-dark-accent/15 hover:text-lime'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-asu-maroon/15 hover:to-asu-gold/15 hover:text-asu-maroon'
                  }`}
                >
                  <div className={`rounded-xl transition-all duration-300 p-2 ${
                    active 
                      ? isDark 
                        ? 'bg-dark-surface/25' 
                        : 'bg-white/25'
                      : isDark
                        ? 'bg-lime/15 group-hover:bg-lime/25'
                        : 'bg-asu-maroon/15 group-hover:bg-asu-maroon/25'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{item.label}</span>
                        {item.label === 'Messages' && unreadCount > 0 && (
                          <Badge badgeContent={unreadCount} color="error" size="small" />
                        )}
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <div className={`border-t ${isCollapsed ? 'p-2' : 'p-4'} ${
          isDark ? 'border-gray-600' : 'border-gray-200'
        }`}>
          <button
            onClick={handleLogout}
            className={`nav-item w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
              isDark 
                ? 'text-red-400 hover:bg-red-400/10' 
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <div className={`rounded-xl p-2 ${
              isDark ? 'bg-red-400/15' : 'bg-red-100'
            }`}>
              <Logout className="h-5 w-5" />
            </div>
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 ${
              isDark 
                ? 'bg-lime text-dark-surface' 
                : 'bg-asu-maroon text-white'
            }`}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </button>
        )}
      </div>

      {/* Main Content Spacer */}
      <div className={`transition-all duration-300 ease-in-out ${
        isCollapsed ? 'ml-20' : 'ml-80'
      }`} />
    </>
  );
}
