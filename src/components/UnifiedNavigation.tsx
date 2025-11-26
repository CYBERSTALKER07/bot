import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  Building2,
  MessageSquare,
  Calendar,
  BookOpen,
  User,
  LogOut,
  Bell,
  X,
  BarChart3,
  Rss,
  Smartphone
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useScrollDirection } from '../hooks/useScrollDirection';
import ThemeToggle from './ui/ThemeToggle';
import Button from './ui/Button';
import { cn } from '../lib/cva';
import { useExclusiveAccordion } from '../hooks/useExclusiveState';

interface NavigationItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  badge?: number;
  group?: string;
}

interface UnifiedNavigationProps {
  onScrollToSection?: (sectionName: string) => void;
  mode?: 'landing' | 'authenticated';
}

// Public routes that should show the landing navigation
const LANDING_ROUTES = [
  '/',
  '/login',
  '/register',
  '/mobile-app',
  '/for-students',
  '/for-employers',
  '/career-tips',
  '/whos-hiring'
];

// Semi-public routes that can be accessed without login but might show minimal nav
const SEMI_PUBLIC_ROUTES = [
  '/companies',
  '/company',
  '/events',
  '/event',
  '/resources',
  '/resource',
  '/job'
];

export default function UnifiedNavigation({ onScrollToSection, mode }: UnifiedNavigationProps) {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { isVisible: isBottomNavVisible } = useScrollDirection({ threshold: 3 });

  // Always call all hooks first, before any conditional logic
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Use exclusive accordion for navigation groups
  const { toggle: toggleGroup, isOpen: isGroupOpen } = useExclusiveAccordion();

  const sidebarRef = useRef<HTMLDivElement>(null);
  const hoverZoneRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

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

  // Determine navigation mode
  const isLandingRoute = LANDING_ROUTES.includes(location.pathname) ||
    SEMI_PUBLIC_ROUTES.some(route => location.pathname.startsWith(route));

  const shouldShowLandingNav = mode === 'landing' || (isLandingRoute && !user);
  const shouldShowAuthenticatedNav = mode === 'authenticated' || (user && !isLandingRoute);

  // Don't render navigation if conditions aren't met
  if (!shouldShowLandingNav && !shouldShowAuthenticatedNav) {
    return null;
  }

  // LANDING PAGE NAVIGATION
  if (shouldShowLandingNav) {
    return (
      <>
        {/* Landing Page Navigation */}
        <nav className={`fixed top-0 w-full z-50 border-b transition-colors duration-300 ${isDark
          ? 'bg-dark-surface/95 backdrop-blur-sm border-gray-700'
          : 'bg-white/95 backdrop-blur-sm border-gray-200'
          }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Left side - Logo */}
              <Link to="/" className="flex items-center space-x-3">
                <GraduationCap className={`h-8 w-8 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
                <span className={`font-bold text-xl -skew-x-12 ${isDark ? 'text-lime' : 'text-asu-maroon'
                  }`}>
                  AUTHandshake
                </span>
              </Link>

              {/* Center - Navigation Pages (Desktop) */}
              <div className="hidden md:flex items-center space-x-8">
                {onScrollToSection && (
                  <>
                    <button
                      onClick={() => onScrollToSection('features')}
                      className={`text-sm font-medium transition-colors duration-200 ${isDark
                        ? 'text-dark-muted hover:text-dark-text'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      Features
                    </button>
                    <button
                      onClick={() => onScrollToSection('howItWorks')}
                      className={`text-sm font-medium transition-colors duration-200 ${isDark
                        ? 'text-dark-muted hover:text-dark-text'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      How it Works
                    </button>
                  </>
                )}
                <Link
                  to="/for-students"
                  className={`text-sm font-medium transition-colors duration-200 ${isDark
                    ? 'text-dark-muted hover:text-dark-text'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  For Students
                </Link>
                <Link
                  to="/for-employers"
                  className={`text-sm font-medium transition-colors duration-200 ${isDark
                    ? 'text-dark-muted hover:text-dark-text'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  For Employers
                </Link>
                <Link
                  to="/career-tips"
                  className={`text-sm font-medium transition-colors duration-200 ${isDark
                    ? 'text-dark-muted hover:text-dark-text'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Career Tips
                </Link>
                <Link
                  to="/whos-hiring"
                  className={`text-sm font-medium transition-colors duration-200 ${isDark
                    ? 'text-dark-muted hover:text-dark-text'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Who's Hiring
                </Link>
                {onScrollToSection && (
                  <button
                    onClick={() => onScrollToSection('demo')}
                    className={`text-sm font-medium transition-colors duration-200 ${isDark
                      ? 'text-dark-muted hover:text-dark-text'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Demo
                  </button>
                )}
              </div>

              {/* Right side - Authentication & Mobile Menu */}
              <div className="flex items-center space-x-4">
                <ThemeToggle size="small" />

                {/* Desktop Auth Links */}
                <div className="hidden md:flex items-center space-x-4">
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        className={`text-sm font-medium transition-colors duration-200 ${isDark
                          ? 'text-dark-muted hover:text-dark-text'
                          : 'text-gray-600 hover:text-gray-900'
                          }`}
                      >
                        Dashboard
                      </Link>
                      <div className="w-8 h-8 rounded-ful l bg-brand-primary/10 text-brand-primary flex items-center justify-center text-sm font-medium">
                        {user?.name?.charAt(0) || <User className="h-4 w-4" />}
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className={`text-sm font-medium transition-colors duration-200 ${isDark
                          ? 'text-dark-muted hover:text-dark-text'
                          : 'text-gray-600 hover:text-gray-900'
                          }`}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isDark
                          ? 'bg-lime text-dark-surface hover:bg-lime/90'
                          : 'bg-asu-maroon text-white hover:bg-asu-maroon-dark'
                          }`}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-expanded={isMobileMenuOpen}
                    aria-label="Toggle menu"
                    className="relative"
                  >
                    {isMobileMenuOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
                        {user?.name?.charAt(0) || <User className="h-4 w-4" />}
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
              <div className="border-t border-neutral-200 bg-background">
                <nav className="py-2 max-h-[70vh] overflow-y-auto" role="navigation" aria-label="Mobile navigation">
                  {/* Profile Section */}
                  <div className="px-4 py-3 border-b border-neutral-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-sm font-medium">
                        {user?.name?.charAt(0) || <User className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user?.name || 'User'}</p>
                        <p className="text-xs text-neutral-500">{user?.email || 'user@example.com'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Groups */}
                  {Object.entries(groupedItems).map(([group, items]) => (
                    <div key={group} className="py-2">
                      {group !== 'main' && (
                        <div className="px-4 py-2">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            {group}
                          </h3>
                        </div>
                      )}
                      {items.map((item, index) => {
                        const Icon = item.icon;
                        const active = isCurrentPath(item.path);

                        return (
                          <Link
                            key={`${group}-${index}`}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              'flex items-center justify-between px-4 py-3 mx-2 rounded-lg transition-colors',
                              active
                                ? 'bg-brand-primary/10 text-brand-primary'
                                : 'text-neutral-700 hover:bg-neutral-50'
                            )}
                            aria-current={active ? 'page' : undefined}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className="h-5 w-5" />
                              <span className="font-medium">{item.label}</span>
                            </div>
                            {item.badge && item.badge > 0 && (
                              <span className="bg-error text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                                {item.badge > 99 ? '99+' : item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  ))}

                  <div className="border-t border-neutral-200 mt-2 pt-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-colors',
                        isCurrentPath('/profile')
                          ? 'bg-brand-primary/10 text-brand-primary'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      )}
                      aria-current={isCurrentPath('/profile') ? 'page' : undefined}
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">My Profile</span>
                    </Link>

                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full justify-start px-4 py-3 mx-2 text-error hover:bg-error/10 rounded-lg"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Logout
                    </Button>
                  </div>
                </nav>
              </div>
            )}
          </div>
        </nav>
      </>
    );
  }

  // AUTHENTICATED USER NAVIGATION
  // Handle mouse enter to show sidebar
  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsHovered(true);
    if (isHidden) {
      setIsHidden(false);
    }
  };

  // Handle mouse leave to hide sidebar after delay
  const handleMouseLeave = () => {
    setIsHovered(false);
    // Keep sidebar in collapsed mode instead of completely hiding
    if (!isCollapsed) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsCollapsed(true);
      }, 300); // Reduced delay for better UX
    }
  };

  // Enhanced navigation items with grouping
  const getNavigationItems = (): NavigationItem[] => {
    if (user?.role === 'student') {
      return [
        { icon: Rss, label: 'Feed', path: '/feed', group: 'main' },
        { icon: BarChart3, label: 'Dashboard', path: '/dashboard', group: 'main' },
        { icon: Search, label: 'Find Jobs', path: '/jobs', group: 'jobs' },
        { icon: Building2, label: 'Companies', path: '/companies', group: 'jobs' },
        { icon: FileText, label: 'Applications', path: '/applications', group: 'jobs' },
        { icon: FileText, label: 'Learning Passport', path: '/digital-passport', group: 'learning' },
        { icon: BarChart3, label: 'Skills Audit', path: '/skills-audit', group: 'learning' },
        { icon: MessageSquare, label: 'Messages', path: '/messages', badge: unreadCount, group: 'communication' },
        { icon: Calendar, label: 'Events', path: '/events', group: 'communication' },
        { icon: BookOpen, label: 'Resources', path: '/resources', group: 'learning' },
        { icon: Settings, label: 'Profile Setup', path: '/profile-setup', group: 'profile' },
        // Add new mobile-accessible pages
        { icon: BookOpen, label: 'Career Tips', path: '/career-tips', group: 'learning' },
        { icon: Users, label: 'Who\'s Hiring', path: '/whos-hiring', group: 'jobs' },
        { icon: GraduationCap, label: 'For Students', path: '/for-students', group: 'tools' },
        { icon: Smartphone, label: 'Mobile App', path: '/mobile-app', group: 'tools' },
      ];
    }

    if (user?.role === 'employer') {
      return [
        { icon: Rss, label: 'Feed', path: '/feed', group: 'main' },
        { icon: BarChart3, label: 'Dashboard', path: '/dashboard', group: 'main' },
        { icon: Briefcase, label: 'Post Jobs', path: '/post-job', group: 'jobs' },
        { icon: Users, label: 'Applicants', path: '/applicants', group: 'jobs' },
        { icon: Building2, label: 'Companies', path: '/companies', group: 'jobs' },
        { icon: MessageSquare, label: 'Messages', path: '/messages', badge: unreadCount, group: 'communication' },
        { icon: FileText, label: 'Resources', path: '/resources', group: 'learning' },
        { icon: Settings, label: 'Profile Setup', path: '/profile-setup', group: 'profile' },
        // Add new mobile-accessible pages
        { icon: Building2, label: 'For Employers', path: '/for-employers', group: 'tools' },
        { icon: BookOpen, label: 'Career Tips', path: '/career-tips', group: 'learning' },
        { icon: Smartphone, label: 'Mobile App', path: '/mobile-app', group: 'tools' },
      ];
    }

    if (user?.role === 'admin') {
      return [
        { icon: Rss, label: 'Feed', path: '/feed', group: 'main' },
        { icon: BarChart3, label: 'Admin Panel', path: '/dashboard', group: 'main' },
        { icon: Users, label: 'Users', path: '/users', group: 'management' },
        { icon: Briefcase, label: 'Jobs', path: '/jobs', group: 'management' },
        { icon: Building2, label: 'Companies', path: '/companies', group: 'management' },
        { icon: FileText, label: 'Reports', path: '/reports', group: 'analytics' },
        { icon: Settings, label: 'Settings', path: '/settings', group: 'system' },
        { icon: User, label: 'Profile Setup', path: '/profile-setup', group: 'profile' },
        // Add new mobile-accessible pages
        { icon: BookOpen, label: 'Career Tips', path: '/career-tips', group: 'tools' },
        { icon: Users, label: 'Who\'s Hiring', path: '/whos-hiring', group: 'tools' },
        { icon: Smartphone, label: 'Mobile App', path: '/mobile-app', group: 'tools' },
        { icon: GraduationCap, label: 'For Students', path: '/for-students', group: 'tools' },
        { icon: Building2, label: 'For Employers', path: '/for-employers', group: 'tools' },
      ];
    }

    return [
      { icon: Rss, label: 'Feed', path: '/feed', group: 'main' },
      { icon: BarChart3, label: 'Dashboard', path: '/dashboard', group: 'main' },
      { icon: Search, label: 'Find Jobs', path: '/jobs', group: 'jobs' },
      { icon: Building2, label: 'Companies', path: '/companies', group: 'jobs' },
      { icon: MessageSquare, label: 'Messages', path: '/messages', group: 'communication' },
      { icon: Calendar, label: 'Events', path: '/events', group: 'communication' },
      { icon: BookOpen, label: 'Resources', path: '/resources', group: 'learning' },
      { icon: Settings, label: 'Profile Setup', path: '/profile-setup', group: 'profile' },
      // Add new mobile-accessible pages
      { icon: BookOpen, label: 'Career Tips', path: '/career-tips', group: 'learning' },
      { icon: Users, label: 'Who\'s Hiring', path: '/whos-hiring', group: 'jobs' },
      { icon: Smartphone, label: 'Mobile App', path: '/mobile-app', group: 'tools' },
    ];
  };

  const navigationItems = getNavigationItems();
  const mobileNavItems = navigationItems.filter(item => item.group === 'main' || ['jobs', 'messages'].includes(item.path.split('/')[1]));

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isCurrentPath = (path: string) => location.pathname === path;

  // Group navigation items
  const groupedItems = navigationItems.reduce((acc, item) => {
    const group = item.group || 'main';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  // Mobile Navigation for authenticated users
  if (isMobile) {
    return (
      <>
        {/* Top App Bar with Enhanced iOS Safe Area - Positioned Lower */}
        <header
          className="fixed left-0 right-0 z-50 ios-header ios-safe-top ios-pro-max-adjust ios-pro-adjust ios-standard-adjust ios-x-adjust ios-se-adjust"
          style={{
            top: '0',
            paddingTop: 'calc(max(env(safe-area-inset-top), 44px) + 100px)'
          }}
        >
          {/* iOS Status Bar Safe Area */}
          <div className="h-12 bg-black ios-only" />
          <div className="h-12 bg-black ios-only" />
          <div className="h-8 bg-black ios-only" />

          <div className="flex justify-between items-center h-16 px-4 ios-landscape-header mt-6">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-brand-primary" />
              <span className="font-semibold text-foreground">AUT</span>
            </Link>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="relative ios-touch-target"
                aria-label={`Notifications ${unreadCount ? `(${unreadCount} unread)` : ''}`}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-error text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle menu"
                className="relative ios-touch-target"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-sm font-medium">
                    {user?.name?.charAt(0) || <User className="h-4 w-4" />}
                  </div>
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Sidebar Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Left Sidebar with Enhanced iOS Safe Areas */}
        <div
          className={cn(
            "fixed top-0 left-0 h-full w-80 border-r z-50 shadow-xl ios-safe-area ios-momentum-scroll ios-sidebar-fix",
            isDark
              ? 'bg-black border-gray-800'
              : 'bg-white border-neutral-200'
          )}
          style={{
            transform: isMobileMenuOpen ? 'translateX(0px)' : 'translateX(-100%)',
            transition: 'transform 300ms ease-out',
            willChange: 'transform'
          }}
        >
          {/* Sidebar Header with Enhanced iOS spacing */}
          <div className={cn(
            "flex items-center justify-between h-14 px-4 border-b ios-header-safe ios-pro-max-adjust ios-pro-adjust ios-standard-adjust ios-x-adjust ios-se-adjust ios-sidebar-fix",
            isDark
              ? 'bg-black border-gray-800'
              : 'bg-white border-neutral-200'
          )}>
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-6 w-6 text-brand-primary" />
              <span className={cn(
                "font-semibold",
                isDark ? 'text-white' : 'text-foreground'
              )}>AUT Menu</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "ios-touch-target",
                isDark
                  ? 'text-gray-400 hover:text-white'
                  : 'text-neutral-500 hover:text-neutral-700'
              )}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Sidebar Content with Enhanced iOS scrolling */}
          <div className="flex-1 overflow-y-auto ios-momentum-scroll ios-landscape-safe">
            <nav className="py-2" role="navigation" aria-label="Mobile navigation">
              {/* Profile Section with Enhanced iOS spacing */}
              <div className="px-4 py-4 border-b border-neutral-200 bg-linear-to-r from-brand-primary/5 to-transparent ios-nav-spacing">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 ios-rounded bg-brand-primary/10 text-brand-primary flex items-center justify-center text-lg font-medium">
                    {user?.name?.charAt(0) || <User className="h-6 w-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Groups with Enhanced iOS touch targets */}
              <div className="px-2 py-2">
                {Object.entries(groupedItems).map(([group, items]) => (
                  <div key={group} className="mb-4">
                    {group !== 'main' && (
                      <div className="px-3 py-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                          {group}
                        </h3>
                      </div>
                    )}
                    <div className="space-y-1">
                      {items.map((item, index) => {
                        const Icon = item.icon;
                        const active = isCurrentPath(item.path);

                        return (
                          <Link
                            key={`${group}-${index}`}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              'flex items-center justify-between px-3 py-3.5 mx-1 ios-rounded-lg transition-all duration-200 ios-touch-target-large ios-nav-item',
                              active
                                ? 'bg-brand-primary/10 text-brand-primary shadow-xs'
                                : 'text-neutral-700 hover:bg-neutral-50 hover:translate-x-1 active:bg-neutral-100'
                            )}
                            aria-current={active ? 'page' : undefined}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className="h-5 w-5 shrink-0" />
                              <span className="font-medium">{item.label}</span>
                            </div>
                            {item.badge && item.badge > 0 && (
                              <span className="bg-error text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center shrink-0">
                                {item.badge > 99 ? '99+' : item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Profile and Logout Section with Enhanced iOS spacing */}
                <div className="border-t border-neutral-200 mt-4 pt-4 ios-bottom-safe">
                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center space-x-3 px-3 py-3.5 mx-1 ios-rounded-lg transition-all duration-200 ios-touch-target-large',
                        isCurrentPath('/profile')
                          ? 'bg-brand-primary/10 text-brand-primary shadow-xs'
                          : 'text-neutral-700 hover:bg-neutral-50 hover:translate-x-1 active:bg-neutral-100'
                      )}
                      aria-current={isCurrentPath('/profile') ? 'page' : undefined}
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">My Profile</span>
                    </Link>

                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full justify-start px-3 py-3.5 mx-1 text-error hover:bg-error/10 ios-rounded-lg transition-all duration-200 hover:translate-x-1 active:bg-error/20 ios-touch-target-large ios-nav-item"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Bottom Navigation with Scroll-based Visibility */}
        <nav className={cn(
          'fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t transition-all duration-300 ios-bottom-nav',
          isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200',
          // Apply scroll-based visibility with smooth animation
          isBottomNavVisible
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0'
        )}>
          <div className="grid grid-cols-5 h-16 ios-home-indicator-safe">
            {mobileNavItems.slice(0, 5).map((item, index) => {
              const Icon = item.icon;
              const isActive = isCurrentPath(item.path);

              return (
                <Link
                  key={index}
                  to={item.path}
                  className={cn(
                    'flex flex-col items-center justify-center py-2 transition-all duration-200 relative ios-touch-target active:scale-90',
                    isActive
                      ? isDark ? 'text-white' : 'text-black'
                      : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                  )}
                >
                  <div className={cn(
                    "relative p-1 rounded-xl transition-all duration-200",
                    isActive && (isDark ? "bg-white/10" : "bg-black/5")
                  )}>
                    <Icon className={cn(
                      "transition-all duration-200",
                      isActive ? "h-6 w-6 stroke-[2.5px]" : "h-6 w-6 stroke-[1.5px]"
                    )} />
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-background">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] mt-0.5 font-medium transition-all duration-200",
                    isActive ? "opacity-100" : "opacity-0 scale-0 hidden"
                  )}>{item.label}</span>

                  {/* Active indicator dot - removed in favor of background highlight */}
                </Link>
              );
            })}
          </div>
        </nav>
      </>
    );
  }

  // DESKTOP NAVIGATION
  return (
    <div
      className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0",
        isDark ? 'bg-black' : 'bg-white'
      )}
    >
      {/* Sidebar - Always visible on desktop */}
      <div className="flex-1 overflow-y-auto border-r border-neutral-200">
        {/* Profile Section - Always visible */}
        <div className="px-6 py-4 border-b border-neutral-200">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-xl font-medium">
              {user?.name?.charAt(0) || <User className="h-6 w-6" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-neutral-500 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation - Always visible on desktop */}
        <nav className="py-4" role="navigation" aria-label="Main navigation">
          {/* Render grouped navigation items */}
          {Object.entries(groupedItems).map(([group, items]) => (
            <div key={group} className="mb-4">
              {group !== 'main' && (
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {group}
                  </h3>
                </div>
              )}
              <div className="space-y-1">
                {items.map((item, index) => {
                  const Icon = item.icon;
                  const active = isCurrentPath(item.path);

                  return (
                    <Link
                      key={`${group}-${index}`}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center justify-between px-4 py-3 mx-2 rounded-lg transition-colors',
                        active
                          ? 'bg-brand-primary/10 text-brand-primary'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      )}
                      aria-current={active ? 'page' : undefined}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.badge && item.badge > 0 && (
                        <span className="bg-error text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}