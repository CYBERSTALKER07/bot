import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home,
  Search,
  Bell,
  User,
  Briefcase,
  Building2,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  Users,
  LogOut,
  Feather,
  MoreHorizontal,
  X as XIcon,
  Brain,
  Linkedin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useScrollDirection } from '../hooks/useScrollDirection';
import Button from './ui/Button';
import { cn } from '../lib/cva';
import { FloatingActionMenu } from './FloatingActionMenu';

// Helper component for thin icons
const ThinIcon = ({ Icon, ...props }: any) => <Icon strokeWidth={1.5} {...props} />;

interface NavigationItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  badge?: number;
}

// X-Style Navigation
export default function Navigation() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { isVisible: isBottomNavVisible } = useScrollDirection({ threshold: 3 });
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUserCardOpen, setIsUserCardOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
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
      { icon: Search, label: 'Explore', path: '/search' },
      { icon: Bell, label: 'Notifications', path: '/notifications', badge: 3 },
      // { icon: Mail, label: 'Messages', path: '/messages', badge: 2 },
      // { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
    ];

    if (user?.role === 'student') {
      return [
        ...baseItems,
        { icon: Brain, label: 'AI Jobs', path: '/ai-job-recommendations' },
        { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
        { icon: Building2, label: 'Companies', path: '/companies' },
        { icon: FileText, label: 'Applications', path: '/applications' },
        // { icon: FileText, label: 'Resume Builder', path: '/resume-builder' },
        { icon: Calendar, label: 'Events', path: '/events' },
        { icon: User, label: 'Profile', path: '/profile' }
      ];
    } else if (user?.role === 'employer') {
      return [
        ...baseItems,
        { icon: BarChart3, label: 'Dashboard', path: '/employer-dashboard' },
        { icon: Briefcase, label: 'Post Jobs', path: '/post-job' },
        { icon: FileText, label: 'My Jobs', path: '/employer/jobs' },
        { icon: Linkedin, label: 'LinkedIn Jobs', path: '/linkedin-job-manager' },
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

  const handleUserClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUserCardOpen(true);
  };

  // OnPress handler for navigation items with haptic feedback
  const handleNavItemPress = (path: string, item: NavigationItem) => {
    // Haptic feedback for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    // Visual feedback - could add press state here
    console.log(`Navigating to: ${item.label} (${path})`);
    
    // Navigate to the selected path
    navigate(path);
  };

  if (!user) return null;

  // Mobile Navigation
  if (isMobile) {
    return (
      <>
        {/* Mobile Top Bar */} 
        
        <header className={`fixed top-0 left-0 right-0 z-50 border-b ${
          isDark ? 'bg-black/95 backdrop-blur-xl border-gray-800' : 'bg-white/95 backdrop-blur-xl border-gray-200'
        }`}>
          {/* iOS Status Bar Safe Area */}
          {/* <div className="h-5 bg-black ios-only" />
          <div className="h-5 bg-black ios-only" /> */}
          
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDark ? 'bg-white' : 'bg-black'
              }`}>
                <ThinIcon Icon={Feather} className={`h-4 w-4 ${isDark ? 'text-black' : 'text-white'}`} />
              </div>
              <span className={`font-light text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                AUT Handshake
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "p-2 rounded-full transition-colors duration-200",
                isDark ? 'hover:bg-black text-white' : 'hover:bg-gray-100'
              )}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <ThinIcon Icon={XIcon} className="h-5 w-5" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-sm font-normal">
                  {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || <ThinIcon Icon={User} className="h-5 w-5" />}
                </div>
              )}
            </Button>
          </div>
        </header>

        {/* Mobile Sidebar Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Left Sidebar */}
        <div
          className={cn(
            'fixed top-0 left-0 h-full w-80 z-50 shadow-xl border-r',
            isDark ? 'bg-black/95 border-gray-800' : 'bg-white/95 border-gray-200'
          )}
          style={{
            transform: isMobileMenuOpen ? 'translateX(0px)' : 'translateX(-100%)',
            transition: 'transform 300ms ease-out',
            willChange: 'transform'
          }}
        >
          {/* Sidebar Header */}
          <div className={cn(
            'flex items-center justify-between h-16 px-4 border-b',
            isDark ? 'border-gray-800' : 'border-gray-200'
          )}>
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDark ? 'bg-white' : 'bg-[#800002]'
              }`}>
                <ThinIcon Icon={Feather} className={`h-4 w-4 ${isDark ? 'text-black' : 'text-white'}`} />
              </div>
              <span className={`font-light text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Menu
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
              className={isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
            >
              <ThinIcon Icon={XIcon} className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Items - Fixed Height, No Scroll */}
          <div className="px-4 py-4">
            <nav className="space-y-2">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = isCurrentPath(item.path);
                
                return (
                  <button
                    key={index}
                    onTouchStart={() => {
                      // Haptic feedback on touch start
                      if (navigator.vibrate) {
                        navigator.vibrate(10);
                      }
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      handleNavItemPress(item.path, item);
                    }}
                    className={cn(
                      "flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 w-full text-left",
                      "active:scale-95 active:bg-gray-100/20 transform-gpu",
                      isActive
                        ? isDark 
                          ? 'bg-white/10 text-white' 
                          : 'bg-gray-100 text-gray-900'
                        : isDark
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )}
                    aria-label={`Navigate to ${item.label}`}
                  >
                    <div className="flex items-center space-x-3">
                      <ThinIcon Icon={Icon} className="h-5 w-5" />
                      <span className="font-normal">{item.label}</span>
                    </div>
                    {item.badge && item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full justify-start px-3 py-3 text-red-500 hover:bg-red-500/10 rounded-xl"
              >
                <ThinIcon Icon={LogOut} className="h-5 w-5 mr-3" />
                <span className="font-normal">Logout</span>
              </Button>
            </div>
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
            {navigationItems.slice(0, 5).map((item, index) => {
              const Icon = item.icon;
              const isActive = isCurrentPath(item.path);
              
              return (
                <button
                  key={index}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    // Haptic feedback on touch start
                    if (navigator.vibrate) {
                      navigator.vibrate(10);
                    }
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavItemPress(item.path, item);
                  }}
                  className={cn(
                    'flex flex-col items-center justify-center py-2 transition-all duration-200 relative ios-touch-target',
                    'active:scale-95 active:bg-gray-100/20 transform-gpu',
                    isActive 
                      ? isDark ? 'text-white' : 'text-black'
                      : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
                  )}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <div className="relative">
                    <ThinIcon Icon={Icon} className="h-6 w-6" />
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs mt-1 truncate font-normal">{item.label}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className={cn(
                      "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full",
                      isDark ? 'bg-white' : 'bg-black'
                    )} />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Mobile Floating Action Menu - Enhanced with advanced interactions */}
        <FloatingActionMenu />
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
              isDark ? 'bg-white' : 'bg-[#800020]'
            }`}>
              <ThinIcon Icon={Feather} className={`h-5 w-5 ${isDark ? 'text-black' : 'text-white'}`} />
            </div>
            {isExpanded && (
              <div className="ml-3 overflow-hidden">
                <h2 className={`font-light text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavItemPress(item.path, item);
                }}
                onMouseDown={(e) => {
                  // Add subtle click feedback for desktop
                  e.currentTarget.style.transform = 'scale(0.98)';
                }}
                onMouseUp={(e) => {
                  // Reset scale after click
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                onMouseLeave={(e) => {
                  // Ensure scale is reset if mouse leaves during press
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                className={cn(
                  "flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative",
                  "active:scale-98 transform-gpu cursor-pointer text-left w-full",
                  isExpanded ? 'space-x-3' : 'justify-center',
                  isActive
                    ? isDark 
                      ? 'bg-white text-black' 
                      : 'bg-lime text-black'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
                aria-label={`Navigate to ${item.label}`}
              >
                <div className="relative">
                  <ThinIcon Icon={Icon} className="h-6 w-6" />
                  {item.badge && item.badge > 0 && !isExpanded && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                
                {isExpanded && (
                  <>
                    <span className="font-normal text-xl">{item.label}</span>
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
                    "absolute left-full ml-4 px-3 py-2 rounded-lg text-sm font-normal",
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
              </button>
            );
          })}
        </nav>

        {/* Post Button */}
        <div className="p-4">
          <Button
            className={cn(
              "w-full rounded-full font-bold transition-all duration-200",
              isDark ? 'bg-white text-black hover:bg-black' : 'bg-black text-black hover:bg-black-text-white',
              isExpanded ? 'justify-center' : 'justify-center px-0'
            )}
          >
            {isExpanded ? 'Post' : <ThinIcon Icon={Briefcase} className="h-5 w-5" />}
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 relative">
          <div className={cn(
            "flex items-center space-x-3 w-full",
            !isExpanded && 'justify-center'
          )}>
            <button
              onClick={() => setIsUserCardOpen(!isUserCardOpen)}
              className={cn(
                "flex items-center rounded-full transition-all duration-200",
                isExpanded ? 'space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800' : 'p-2'
              )}
            >
              <div className={cn(
                "rounded-full flex items-center justify-center text-lg font-normal relative",
                isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-800',
                isExpanded ? 'w-10 h-10' : 'w-8 h-8'
              )}>
                {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              {isExpanded && (
                <>
                  <div>
                    <p className={cn(
                      "font-normal text-sm truncate",
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
                  <ThinIcon Icon={MoreHorizontal} className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  )} />
                </>
              )}
            </button>

            {/* Desktop Dropdown Menu */}
            {isUserCardOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 animate-in fade-in duration-150"
                  onClick={() => setIsUserCardOpen(false)}
                />
                <div className={cn(
                  "absolute bottom-full mb-2 w-64 rounded-2xl shadow-2xl border py-2 z-50",
                  "transform transition-all duration-300 ease-out",
                  "animate-in slide-in-from-bottom-2 fade-in zoom-in-95",
                  "will-change-transform origin-bottom",
                  isExpanded ? "left-0" : "left-full ml-4",
                  isDark ? 'bg-black border-gray-600 shadow-gray-900/50' : 'bg-white border-gray-300 shadow-gray-900/20'
                )}
                style={{
                  animationDelay: '0ms',
                  animationFillMode: 'both',
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)',
                }}
                >
                  {/* Settings */}
                  <Link
                    to="/settings"
                    onClick={() => setIsUserCardOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 transition-all duration-200 w-full",
                      "hover:translate-x-1 transform will-change-transform",
                      isDark ? 'hover:bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-900'
                    )}
                  >
                    <ThinIcon Icon={Settings} className="h-5 w-5 mr-3 transition-transform duration-200 group-hover:rotate-12" />
                    <span className="font-normal text-sm">
                      Settings and privacy
                    </span>
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      setIsUserCardOpen(false);
                      handleLogout();
                    }}
                    className={cn(
                      "w-full flex items-center px-4 py-3 transition-all duration-200 text-left",
                      "hover:translate-x-1 transform will-change-transform group",
                      isDark ? 'hover:bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-900'
                    )}
                  >
                    <ThinIcon Icon={LogOut} className="h-5 w-5 mr-3 transition-transform duration-200 group-hover:-rotate-12" />
                    <span className="font-normal text-sm">
                      Log out @{user?.email?.split('@')[0]}
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Backdrop for expanded sidebar */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30 transition-all duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* User Card */}
      {/* <UserCard 
        isOpen={isUserCardOpen}
        onClose={() => setIsUserCardOpen(false)}
        position={isExpanded ? "bottom-right" : "bottom-left"}
      /> */}

      {/* Main Content Spacer */}
      <div className={cn(
        "transition-all duration-300",
        isExpanded ? "ml-64" : "ml-20"
      )}>
        {/* Content goes here */}
      </div>

      {/* Floating Action Button with Curved Menu - Bottom Right */}
      <FloatingActionMenu />
    </>
  );
}
