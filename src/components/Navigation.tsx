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
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Home,
  Briefcase,
  Users,  
  Settings,
  FileText,
  BarChart3,
  Rss,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ui/ThemeToggle';
import  Button from './ui/Button';
import { cn } from '../lib/cva';

interface NavigationItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  badge?: number;
  group?: string;
}

export default function Navigation() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['main']);
  
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
    // Collapse to icon view instead of hiding completely
    hideTimeoutRef.current = setTimeout(() => {
      setIsCollapsed(true);
    }, 500); // 500ms delay
  };

  // Enhanced navigation items with grouping
  const getNavigationItems = (): NavigationItem[] => {
    if (user?.role === 'student') {
      return [
        { icon: Rss, label: 'Feed', path: '/feed', group: 'main' },
        { icon: BarChart3, label: 'Dashboard', path: '/job-search', group: 'main' },
        { icon: Search, label: 'Find Jobs', path: '/jobs', group: 'jobs' },
        { icon: Building2, label: 'Companies', path: '/companies', group: 'jobs' },
        { icon: FileText, label: 'Learning Passport', path: '/digital-learning-passport', group: 'learning' },
        { icon: BarChart3, label: 'Skills Audit', path: '/skills-audit-system', group: 'learning' },
        { icon: MessageSquare, label: 'Messages', path: '/messages', badge: unreadCount, group: 'communication' },
        { icon: Calendar, label: 'Events', path: '/events', group: 'communication' },
        { icon: BookOpen, label: 'Resources', path: '/resources', group: 'learning' },
        { icon: Settings, label: 'Profile Setup', path: '/profile-setup', group: 'profile' },
        // Add new mobile-accessible pages
        { icon: BookOpen, label: 'Career Tips', path: '/career-tips', group: 'learning' },
        { icon: Users, label: 'Who\'s Hiring', path: '/whos-hiring', group: 'jobs' },
        { icon: GraduationCap, label: 'For Students', path: '/for-students', group: 'tools' },
        // { icon: Smartphone, label: 'Mobile App', path: '/mobile-app', group: 'tools' },
      ];
    }

    if (user?.role === 'employer') {
      return [
        { icon: Rss, label: 'Feed', path: '/feed', group: 'main' },
        { icon: BarChart3, label: 'Dashboard', path: '/employer-dashboard', group: 'main' },
        { icon: Briefcase, label: 'Post Jobs', path: '/post-job', group: 'jobs' },
        { icon: Users, label: 'Applicants', path: '/applicants', group: 'jobs' },
        { icon: Building2, label: 'Companies', path: '/companies', group: 'jobs' },
        { icon: MessageSquare, label: 'Messages', path: '/messages', badge: unreadCount, group: 'communication' },
        { icon: FileText, label: 'Resources', path: '/resources', group: 'learning' },
        { icon: Settings, label: 'Profile Setup', path: '/profile-setup', group: 'profile' },
        // Add new mobile-accessible pages
        { icon: Building2, label: 'For Employers', path: '/for-employers', group: 'tools' },
        { icon: BookOpen, label: 'Career Tips', path: '/career-tips', group: 'learning' },
        // { icon: Smartphone, label: 'Mobile App', path: '/mobile-app', group: 'tools' },
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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  // Group navigation items
  const groupedItems = navigationItems.reduce((acc, item) => {
    const group = item.group || 'main';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  // Mobile Navigation
  if (isMobile) {
    return (
      <>
        {/* Top App Bar */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-neutral-200 safe-top">
          <div className="flex justify-between items-center h-14 px-4">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-brand-primary" />
              <span className="font-semibold text-foreground">AUT</span>
            </Link>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label={`Notifications ${unreadCount ? `(${unreadCount} unread)` : ''}`}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-error text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>

              <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-sm font-medium">
                {user?.name?.charAt(0) || <User className="h-4 w-4" />}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="border-t border-neutral-200 bg-background">
              <nav className="py-2" role="navigation" aria-label="Mobile navigation">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = isCurrentPath(item.path);
                  
                  return (
                    <Link
                      key={`mobile-${index}`}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center justify-between px-4 py-3 transition-colors',
                        active
                          ? 'bg-brand-primary/5 text-brand-primary border-r-2 border-brand-primary'
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
                
                <div className="border-t border-neutral-200 mx-4 my-2" />
                
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 transition-colors',
                    isCurrentPath('/profile')
                      ? 'bg-brand-primary/5 text-brand-primary border-r-2 border-brand-primary'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  )}
                  aria-current={isCurrentPath('/profile') ? 'page' : undefined}
                >
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5" />
                    <span className="font-medium">My Profile</span>
                  </div>
                </Link>
                
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full justify-start px-4 py-3 text-error hover:bg-error/10"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </Button>
              </nav>
            </div>
          )}
        </header>

        {/* Bottom Navigation */}
        <nav 
          className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-neutral-200 safe-bottom"
          role="navigation" 
          aria-label="Bottom navigation"
        >
          <div className="grid grid-cols-4 h-16">
            {mobileNavItems.slice(0, 4).map((item, index) => {
              const Icon = item.icon;
              const active = isCurrentPath(item.path);
              
              return (
                <Link
                  key={`bottom-${index}`}
                  to={item.path}
                  className={cn(
                    'flex flex-col items-center justify-center py-2 transition-colors relative',
                    active ? 'text-brand-primary' : 'text-neutral-600'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium truncate">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="absolute top-1 right-1/4 h-2 w-2 bg-error rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Spacers */}
        <div className="h-14" />
        <div className="h-16" />
      </>
    );
  }

  // Desktop Sidebar
  return (
    <>
      {/* Show/Hide Sidebar Toggle - when sidebar is hidden */}
      {isHidden && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsHidden(false)}
          className="fixed left-4 top-4 z-50 h-10 w-10 rounded-full shadow-lg hover:scale-110 transition-transform bg-background border-neutral-200"
          aria-label="Show sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Hover Zone - invisible area on the left edge to trigger sidebar when hidden */}
      {isHidden && (
        <div
          className="fixed left-0 top-0 w-16 h-full z-30"
          onMouseEnter={() => setIsHidden(false)}
        />
      )}

      {/* Hover Zone - invisible area on the right edge to trigger hover */}
      {!isHidden && (
        <div
          ref={hoverZoneRef}
          className={cn(
            'fixed top-0 z-30 h-full transition-all duration-300',
            isCollapsed ? 'left-16 w-8' : 'left-64 w-4'
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}

      <aside
        ref={sidebarRef}
        className={cn(
          'fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-out border-r',
          'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl', // glass effect
          isDark ? 'border-gray-700' : 'border-neutral-200',
          isHidden ? '-translate-x-full' : 
          isCollapsed && !isHovered ? 'w-16' : 'w-64',
          'shadow-xl' // optional: add shadow for depth
        )}
        role="navigation"
        aria-label="Main navigation"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header */}
        <div className={cn(
          'flex items-center justify-between h-16 px-4 border-b',
          isDark ? 'border-gray-700' : 'border-neutral-200'
        )}>
          {!(isCollapsed && !isHovered) ? (
        <Link to="/dashboard" className="flex items-center space-x-3">
          <GraduationCap className="h-7 w-7 text-brand-primary" />
          <span className={cn(
            'text-lg font-semibold',
            isDark ? 'text-white' : 'text-gray-900'
          )}>AUT</span>
        </Link>
          ) : (
        <Link to="/dashboard" className="flex justify-center w-full">
          <GraduationCap className="h-7 w-7 text-brand-primary" />
        </Link>
          )}
          
          {/* Hide sidebar button */}
          {!(isCollapsed && !isHovered) && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsHidden(true)}
          className={cn(
            'h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700',
            isDark ? 'text-gray-400 hover:text-gray-200' : 'text-neutral-500 hover:text-neutral-700'
          )}
          aria-label="Hide sidebar"
        >
          <X className="h-4 w-4" />
        </Button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 overflow-y-auto scrollbar-hide">
          <nav className="space-y-1 px-2">
        {Object.entries(groupedItems).map(([group, items]) => (
          <div key={group}>
            {!(isCollapsed && !isHovered) && group !== 'main' && (
          <button
            onClick={() => toggleGroup(group)}
            className={cn(
              'flex items-center justify-between w-full px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors',
              isDark 
            ? 'text-gray-400 hover:text-gray-200' 
            : 'text-neutral-500 hover:text-neutral-700'
            )}
            aria-expanded={expandedGroups.includes(group)}
          >
            <span>{group}</span>
            <ChevronDown className={cn(
              'h-3 w-3 transition-transform',
              expandedGroups.includes(group) ? 'rotate-180' : ''
            )} />
          </button>
            )}
            
            {(expandedGroups.includes(group) || group === 'main') && (
          <div className="space-y-1">
            {items.map((item, index) => {
              const Icon = item.icon;
              const active = isCurrentPath(item.path);
              
              return (
            <Link
              key={`${group}-${index}`}
              to={item.path}
              className={cn(
                'group flex items-center rounded-2xl px-3 py-2.5 text-sm font-medium  transition-all duration-300',
                active
              ? isDark
                ? 'bg-blue-600/20 text-blue-400'
                : 'bg-brand-primary/10 text-brand-primary'
              : isDark
                ? 'text-white hover:bg-gray-700 hover:text-white'
                : 'text-black hover:bg-neutral-50 hover:text-neutral-900'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={cn(
                'flex-shrink-0 h-5 w-5',
                (isCollapsed && !isHovered) ? 'mx-auto' : 'mr-3'
              )} />
              {!(isCollapsed && !isHovered) && (
                <div className="flex items-center justify-between w-full">
              <span>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
                </div>
              )}
            </Link>
              );
            })}
          </div>
            )}
          </div>
        ))}
          </nav>
        </div>

        {/* User Profile Section */}
        <div className={cn(
          'border-t px-2 py-4',
          isDark ? 'border-gray-700' : 'border-neutral-200'
        )}>
          {!(isCollapsed && !isHovered) ? (
        <Link 
          to="/profile" 
          className={cn(
            'flex items-center px-3 py-2 rounded-lg transition-colors group',
            isDark ? 'hover:bg-gray-700' : 'hover:bg-neutral-50'
          )}
        >
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3',
            isDark 
          ? 'bg-blue-600/20 text-blue-400' 
          : 'bg-brand-primary/10 text-brand-primary'
          )}>
            {user?.name?.charAt(0) || <User className="h-4 w-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn(
          'text-sm font-medium truncate group-hover:text-brand-primary transition-colors',
          isDark ? 'text-white' : 'text-gray-900'
            )}>
          {user?.name || 'User'}
            </p>
            <p className={cn(
          'text-xs truncate',
          isDark ? 'text-gray-400' : 'text-neutral-500'
            )}>
          View Profile
            </p>
          </div>
        </Link>
          ) : (
        <Link to="/profile" className="flex justify-center mb-3 hover:scale-110 transition-transform">
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
            isDark 
          ? 'bg-blue-600/20 text-blue-400' 
          : 'bg-brand-primary/10 text-brand-primary'
          )}>
            {user?.name?.charAt(0) || <User className="h-4 w-4" />}
          </div>
        </Link>
          )}
          
          <div className={cn('mt-3', (isCollapsed && !isHovered) ? 'flex justify-center' : 'px-3')}>
        <ThemeToggle />
          </div>
          
          <Button
        variant="ghost"
        onClick={handleLogout}
        className={cn(
          'w-full mt-2 text-red-500 hover:bg-red-500/10',
          (isCollapsed && !isHovered) ? 'px-2' : 'justify-start px-3'
        )}
          >
        <LogOut className={cn(
          'h-5 w-5',
          (isCollapsed && !isHovered) ? 'mx-auto' : 'mr-3'
        )} />
        {!(isCollapsed && !isHovered) && <span>Logout</span>}
          </Button>
        </div>

        {/* Collapse Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
        'absolute -right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full shadow-md hover:scale-110 transition-transform',
        isDark 
          ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700' 
          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
          )}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
        <ChevronRight className="h-3 w-3" />
          ) : (
        <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </aside>

      {/* Main Content Spacer */}
      <div className={cn(
        'transition-all duration-300 ease-out',
        isHidden ? 'ml-0' : 
        (isCollapsed && !isHovered) ? 'ml-16' : 'ml-64'
      )} />
    </>
  );
}
