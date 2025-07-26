import { useEffect, useState } from 'react';
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

// Enhanced responsive X-Style Navigation
export default function Navigation() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUserCardOpen, setIsUserCardOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);
      setIsTablet(width >= 768 && width < 1024);
      
      if (width >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enhanced navigation items with better responsive considerations
  const getNavigationItems = (): NavigationItem[] => {
    const baseItems = [
      { icon: Home, label: 'Home', path: '/feed' },
      { icon: Search, label: 'Explore', path: '/jobs' },
      { icon: Bell, label: 'Notifications', path: '/notifications', badge: 3 },
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

  const handleUserClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUserCardOpen(true);
  };

  if (!user) return null;

  // Mobile Navigation (screens < 1024px)
  if (isMobile) {
    return (
      <>
        {/* Enhanced Mobile Top Bar with safe area support */}
        <header className={cn(
          "fixed top-0 left-0 right-0 z-50 border-none safe-top ios-header-safe",
          isDark ? 'bg-black/95 backdrop-blur-xl border-gray-800' : 'bg-white/95 backdrop-blur-xl border-gray-200'
        )}>
          <div className="flex items-center justify-between px-responsive py-3 min-h-[64px]">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-8 h-8 xs:w-10 xs:h-10 rounded-full flex items-center justify-center transition-all duration-200",
                isDark ? 'bg-white' : 'bg-black'
              )}>
                <Feather className={cn(
                  "h-4 w-4 xs:h-5 xs:w-5 transition-all duration-200",
                  isDark ? 'text-black' : 'text-white'
                )} />
              </div>
              <span className={cn(
                "font-bold text-responsive-lg transition-colors duration-200",
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                AUT Handshake
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "p-2 rounded-full transition-all duration-200 touch-target",
                isDark ? 'hover:bg-black text-white' : 'hover:bg-gray-100'
              )}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <div className={cn(
                  "w-8 h-8 xs:w-9 xs:h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                  "bg-brand-primary/10 text-brand-primary"
                )}>
                  {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
                </div>
              )}
            </Button>
          </div>
        </header>

        {/* Enhanced Mobile Sidebar Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Enhanced Mobile Left Sidebar */}
        <div
          className={cn(
            'fixed top-0 left-0 h-full w-80 xs:w-96 z-50 shadow-2xl border-r safe-top',
            isDark ? 'bg-black/98 border-gray-800' : 'bg-white/98 border-gray-200'
          )}
          style={{
            transform: isMobileMenuOpen ? 'translateX(0px)' : 'translateX(-100%)',
            transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform'
          }}
        >
          {/* Enhanced Profile Section */}
          <div className={cn(
            'px-responsive py-4 border-b ios-header-safe',
            isDark ? 'border-gray-800' : 'border-gray-200'
          )}>
            <button
              onClick={handleUserClick}
              className={cn(
                "flex items-center space-x-3 w-full text-left p-3 -m-3 rounded-xl transition-all duration-200",
                "hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-2 focus:ring-primary touch-target"
              )}
            >
              <div className={cn(
                "w-12 h-12 xs:w-14 xs:h-14 rounded-full flex items-center justify-center text-lg font-semibold relative transition-all duration-200",
                isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-800'
              )}>
                {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 xs:w-4 xs:h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-medium text-responsive truncate",
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  {user?.full_name || 'User'}
                </p>
                <p className={cn(
                  "text-responsive-sm text-gray-500 truncate"
                )}>
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </button>
          </div>

          {/* Enhanced Navigation Items */}
          <div className="flex-1 overflow-y-auto p-responsive ios-momentum-scroll">
            <nav className="space-y-2">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = isCurrentPath(item.path);
                
                return (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 touch-target focus:ring-2 focus:ring-primary",
                      isActive
                        ? isDark 
                          ? 'bg-white/10 text-white shadow-sm' 
                          : 'bg-gray-100 text-gray-900 shadow-sm'
                        : isDark
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white active:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-50'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 xs:h-6 xs:w-6 flex-shrink-0" />
                      <span className="font-medium text-responsive">{item.label}</span>
                    </div>
                    {item.badge && item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center font-medium">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Enhanced Logout Button */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full justify-start px-4 py-3 text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 rounded-xl touch-target"
              >
                <LogOut className="h-5 w-5 xs:h-6 xs:w-6 mr-3 flex-shrink-0" />
                <span className="font-medium text-responsive">Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Navigation with safe area support */}
        <nav className={cn(
          "fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t safe-bottom ios-bottom-safe",
          isDark ? 'bg-black/95 border-gray-800' : 'bg-white/95 border-gray-200'
        )}>
          <div className="grid grid-cols-5 min-h-[60px] xs:min-h-[64px]">
            {navigationItems.slice(0, 5).map((item, index) => {
              const Icon = item.icon;
              const isActive = isCurrentPath(item.path);
              
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-1 transition-all duration-200 relative touch-target group",
                    isActive 
                      ? isDark ? 'text-white' : 'text-black'
                      : isDark ? 'text-gray-400 hover:text-gray-300 active:text-gray-200' : 'text-gray-600 hover:text-gray-800 active:text-gray-900'
                  )}
                >
                  <div className="relative">
                    <Icon className="h-5 w-5 xs:h-6 xs:w-6 transition-transform duration-200 group-active:scale-95" />
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 xs:w-5 xs:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs xs:text-sm mt-1 font-medium truncate max-w-full px-1">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile layout spacers with safe area support */}
        <div className="h-16 xs:h-20 safe-top ios-header-safe" />
        <div className="h-16 xs:h-20 safe-bottom ios-bottom-safe" />
      </>
    );
  }

  // Desktop Navigation (screens >= 1024px)
  return (
    <>
      {/* Enhanced Desktop Sidebar with responsive width */}
      <aside className={cn(
        "fixed left-0 top-0 h-full z-40 transition-all duration-300 group",
        "border-r backdrop-blur-xl",
        isDark ? 'bg-black/98 border-gray-800' : 'bg-white/98 border-gray-200',
        isExpanded ? 'w-72 xl:w-80' : 'w-20 xl:w-24'
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Enhanced Logo/Brand */}
        <div className="p-4 xl:p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-center">
            <div className={cn(
              "flex items-center justify-center transition-all duration-300",
              isExpanded ? 'w-12 h-12 xl:w-14 xl:h-14' : 'w-10 h-10 xl:w-12 xl:h-12',
              isDark ? 'bg-white' : 'bg-black',
              'rounded-full'
            )}>
              <Feather className={cn(
                "transition-all duration-300",
                isExpanded ? 'h-6 w-6 xl:h-7 xl:w-7' : 'h-5 w-5 xl:h-6 xl:w-6',
                isDark ? 'text-black' : 'text-white'
              )} />
            </div>
            {isExpanded && (
              <div className="ml-4 overflow-hidden">
                <h2 className={cn(
                  "font-bold text-responsive-xl xl:text-2xl transition-colors duration-300",
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  TalentLink
                </h2>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Navigation Items */}
        <nav className="flex flex-col flex-1 p-4 xl:p-6 space-y-2">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = isCurrentPath(item.path);
            
            return (
              <Link
                key={index}
                to={item.path}
                className={cn(
                  "flex items-center rounded-xl transition-all duration-200 group relative touch-target-lg focus:ring-2 focus:ring-primary",
                  isExpanded ? 'px-4 py-3 xl:px-5 xl:py-4 space-x-4' : 'justify-center p-3 xl:p-4',
                  isActive
                    ? isDark 
                      ? 'bg-white text-black shadow-lg' 
                      : 'bg-black text-white shadow-lg'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white active:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-50'
                )}
              >
                <div className="relative flex-shrink-0">
                  <Icon className="h-6 w-6 xl:h-7 xl:w-7 transition-transform duration-200 group-active:scale-95" />
                  {item.badge && item.badge > 0 && !isExpanded && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 xl:w-5 xl:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                
                {isExpanded && (
                  <>
                    <span className="font-medium text-responsive-lg xl:text-xl flex-1 truncate">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-sm px-2 py-1 rounded-full min-w-[24px] text-center font-medium">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Enhanced Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className={cn(
                    "absolute left-full ml-4 px-3 py-2 rounded-lg text-sm font-medium z-50",
                    "opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
                    "whitespace-nowrap shadow-xl border",
                    isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                  )}>
                    {item.label}
                    {item.badge && item.badge > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Enhanced Post Button */}
        <div className="p-4 xl:p-6">
          <Button
            className={cn(
              "w-full rounded-full font-bold transition-all duration-200 touch-target-lg",
              isDark ? 'bg-white text-black hover:bg-gray-200 active:bg-gray-300' : 'bg-black text-white hover:bg-gray-800 active:bg-gray-900',
              isExpanded ? 'py-3 xl:py-4 text-responsive-lg' : 'aspect-square p-3 xl:p-4'
            )}
            onClick={() => navigate('/post-job')}
          >
            {isExpanded ? (
              'Post'
            ) : (
              <Plus className="h-6 w-6 xl:h-7 xl:w-7" />
            )}
          </Button>
        </div>

        {/* Enhanced User Profile */}
        <div className="p-4 xl:p-6 border-t border-gray-200 dark:border-gray-800">
          <div className="relative">
            <button
              onClick={() => setIsUserCardOpen(!isUserCardOpen)}
              className={cn(
                "w-full flex items-center rounded-xl transition-all duration-200 cursor-pointer touch-target-lg focus:ring-2 focus:ring-primary",
                isExpanded ? 'space-x-4 p-3 xl:p-4' : 'justify-center p-3 xl:p-4',
                isDark ? 'hover:bg-gray-800 active:bg-gray-700' : 'hover:bg-gray-100 active:bg-gray-50'
              )}
            >
              <div className="relative flex-shrink-0">
                {user?.avatar_url ? (
                  <img 
                    src={user.avatar_url}
                    alt={user?.full_name || 'User'}
                    className="w-10 h-10 xl:w-12 xl:h-12 rounded-full object-cover transition-all duration-200"
                  />
                ) : (
                  <div className={cn(
                    "w-10 h-10 xl:w-12 xl:h-12 rounded-full flex items-center justify-center text-sm xl:text-base font-semibold transition-all duration-200",
                    isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-800'
                  )}>
                    {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 xl:w-4 xl:h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              
              {isExpanded && (
                <>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className={cn(
                      "font-medium text-responsive truncate",
                      isDark ? 'text-white' : 'text-gray-900'
                    )}>
                      {user?.full_name || 'User'}
                    </p>
                    <p className={cn(
                      "text-responsive-sm truncate",
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      @{user?.email?.split('@')[0]}
                    </p>
                  </div>
                  <MoreHorizontal className={cn(
                    "h-5 w-5 xl:h-6 xl:w-6 flex-shrink-0 transition-colors duration-200",
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  )} />
                </>
              )}
            </button>

            {/* Enhanced Desktop Dropdown Menu */}
            {isUserCardOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserCardOpen(false)}
                />
                <div className={cn(
                  "absolute bottom-full mb-2 w-72 xl:w-80 rounded-2xl shadow-2xl border py-2 z-50 transition-all duration-200",
                  isExpanded ? "left-0" : "left-full ml-4",
                  isDark ? 'bg-black border-gray-600 shadow-gray-900/50' : 'bg-white border-gray-300 shadow-gray-900/20'
                )}>
                  {/* Settings */}
                  <Link
                    to="/settings"
                    onClick={() => setIsUserCardOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 xl:px-5 xl:py-4 transition-colors duration-200 w-full touch-target focus:ring-2 focus:ring-primary",
                      isDark ? 'hover:bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-900'
                    )}
                  >
                    <Settings className="h-5 w-5 xl:h-6 xl:w-6 mr-3 flex-shrink-0" />
                    <span className="font-normal text-responsive">
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
                      "w-full flex items-center px-4 py-3 xl:px-5 xl:py-4 transition-colors duration-200 text-left touch-target focus:ring-2 focus:ring-primary",
                      isDark ? 'hover:bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-900'
                    )}
                  >
                    <LogOut className="h-5 w-5 xl:h-6 xl:w-6 mr-3 flex-shrink-0" />
                    <span className="font-normal text-responsive">
                      Log out @{user?.email?.split('@')[0]}
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Enhanced Backdrop for expanded sidebar */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30 transition-all duration-300 xl:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Enhanced Main Content Spacer */}
      <div className={cn(
        'transition-all duration-300 ease-out',
        isExpanded ? 'ml-72 xl:ml-80' : 'ml-20 xl:ml-24'
      )} />
    </>
  );
}
