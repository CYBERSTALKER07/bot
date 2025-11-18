import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  Users,
  LogOut,
  Feather,
  X as XIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useScrollDirection } from '../hooks/useScrollDirection';
import Button from './ui/Button';
import { cn } from '../lib/cva';
import { FloatingActionMenu } from './FloatingActionMenu';
import PostEventForm from './PostEventForm';
import Dock from './Dock';

// Helper component for thin icons
const ThinIcon = ({ Icon, ...props }: any) => <Icon strokeWidth={1.5} {...props} />;

interface NavigationItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  badge?: number;
  font?: 'serif' | 'sans-serif';
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
  const [showPostEventModal, setShowPostEventModal] = useState(false);

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
        { icon: Briefcase, label: 'Jobs', path: '/jobs' },
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
        { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
        { icon: Briefcase, label: 'Post Jobs', path: '/post-job' },
        { icon: Calendar, label: 'Post Event', path: '/post-event' },
        { icon: Users, label: 'Applicants', path: '/applicants' },
        { icon: User, label: 'Profile', path: '/profile' }
      ];
    } else {
      return [
        ...baseItems,
        { icon: BarChart3, label: 'Admin', path: '/admin' },
        { icon: Users, label: 'Users', path: '/users' },
        // { icon: Settings, label: 'Settings', path: '/settings' },
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

  // OnPress handler for navigation items with haptic feedback
  const handleNavItemPress = (path: string, item: NavigationItem) => {
    // Haptic feedback for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    // Handle Post Event modal separately
    if (path === '/post-event') {
      setShowPostEventModal(true);
      setIsMobileMenuOpen(false);
      return;
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

        <header className={`fixed top-0 left-0 right-0 z-50 border-none ${isDark ? 'bg-black/95 backdrop-blur-xl border-gray-800' : 'bg-white/95 backdrop-blur-xl border-gray-200'
          }`}>
          {/* iOS Status Bar Safe Area */}
          {/* <div className="h-5 bg-black ios-only" />
          <div className="h-5 bg-black ios-only" /> */}

          <div className="flex items-center justify-between px-4 py-3">
            {/* <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDark ? 'bg-white' : 'bg-black'
              }`}>
                <ThinIcon Icon={Feather} className={`h-4 w-4 ${isDark ? 'text-black' : 'text-white'}`} />
              </div>
              <span className={`font-light text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                AUT Handshake
              </span>
            </div> */}

            <Button
              variant="ghost"
              size="small"
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
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-normal overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700">
                  {user?.profile?.avatar_url ? (
                    <img
                      src={user.profile.avatar_url}
                      alt={user?.profile?.full_name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-700 dark:text-gray-200 font-semibold">
                      {user?.profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-white' : 'bg-[#800002]'
                }`}>
                <ThinIcon Icon={Feather} className={`h-4 w-4 ${isDark ? 'text-black' : 'text-white'}`} />
              </div>
              <span className={`font-light text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Menu
              </span>
            </div>
            <Button
              variant="ghost"
              size="small"
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
          'fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t transition-all duration-300 ios-bottom-nav rounded-tl-3xl rounded-tr-3xl',
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
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
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
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Mobile Floating Action Menu - Enhanced with advanced interactions */}
        <FloatingActionMenu />

        {/* Post Event Modal */}
        {showPostEventModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <PostEventForm
                onClose={() => setShowPostEventModal(false)}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop Navigation
  return (
    <>
      {/* Desktop Sidebar - Replaced with Dock */}
      <div className="fixed left-0 top-0 h-full z-40 flex flex-col items-center justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <Dock
            items={[
              ...navigationItems.map(item => ({
                icon: <item.icon size={24} strokeWidth={1.5} />,
                label: item.label,
                onClick: () => handleNavItemPress(item.path, item),
                isActive: isCurrentPath(item.path),
              })),
              // Add Logout item at the bottom
              {
                icon: <LogOut size={24} strokeWidth={1.5} />,
                label: 'Logout',
                onClick: handleLogout
              }
            ]}
            panelWidth={68}
            distance={100}
            magnification={70}
          />
        </div>
      </div>

      {/* Main Content Spacer */}
      <div className={cn(
        "transition-all duration-300",
        "ml-24" // Fixed margin for Dock
      )}>
        {/* Content goes here */}
      </div>

      {/* Floating Action Button with Curved Menu - Bottom Right */}
      <FloatingActionMenu />

      {/* Post Event Modal */}
      {showPostEventModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <PostEventForm
              onClose={() => setShowPostEventModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
