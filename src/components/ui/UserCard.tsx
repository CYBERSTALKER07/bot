import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, 
  CreditCard, 
  User, 
  Bell, 
  Shield, 
  LogOut,
  X,
  ChevronRight,
  Smartphone,
  Globe,
  HelpCircle,
  Moon,
  Sun,
  Palette,
  BarChart3,
  Bookmark,
  Users,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/cva';
import Button from './Button';

interface UserCardProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

export default function UserCard({ isOpen, onClose, position = 'bottom-left' }: UserCardProps) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  if (!isOpen || !user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      href: '/profile'
    },
    {
      icon: CreditCard,
      label: 'Digital Passport',
      href: '/digital-passport'
    },
    {
      icon: Bookmark,
      label: 'Bookmarks',
      href: '/bookmarks'
    },
    {
      icon: Users,
      label: 'Communities',
      href: '/communities'
    },
    {
      icon: DollarSign,
      label: 'Monetization',
      href: '/monetization'
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      href: '/analytics'
    }
  ];

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-20 right-4';
      case 'top-left':
        return 'top-20 left-4';
      case 'top-right':
        return 'top-20 right-4';
      default:
        return 'bottom-20 left-4';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* User Card - X Style */}
      <div className={cn(
        "fixed z-50 w-80 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-2 duration-200",
        isDark ? 'bg-black border-gray-600 shadow-gray-900/50' : 'bg-white border-gray-300 shadow-gray-900/20',
        getPositionClasses()
      )}>
        {/* User Info Section */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                {user?.avatar_url ? (
                  <img 
                    src={user.avatar_url}
                    alt={user?.full_name || 'User'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                    isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                  )}>
                    {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-bold text-sm truncate leading-tight",
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  {user?.full_name || 'User'}
                </p>
                <p className={cn(
                  "text-sm truncate leading-tight",
                  isDark ? 'text-gray-500' : 'text-gray-500'
                )}>
                  @{user?.email?.split('@')[0]}
                </p>
              </div>
            </div>
            
            <div className="text-right flex-shrink-0 ml-2">
              <p className={cn(
                "text-xs font-medium",
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                {user?.followers_count || 0}
              </p>
              <p className={cn(
                "text-xs",
                isDark ? 'text-gray-500' : 'text-gray-500'
              )}>
                Following
              </p>
            </div>
            
            <div className="text-right flex-shrink-0 ml-3">
              <p className={cn(
                "text-xs font-medium",
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                {user?.following_count || 0}
              </p>
              <p className={cn(
                "text-xs",
                isDark ? 'text-gray-500' : 'text-gray-500'
              )}>
                Followers
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={cn(
          "h-px mx-4",
          isDark ? 'bg-gray-700' : 'bg-gray-200'
        )} />

        {/* Menu Items */}
        <div className="py-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center px-4 py-3 transition-colors duration-200",
                  isDark
                    ? 'hover:bg-gray-900'
                    : 'hover:bg-gray-50'
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 mr-3",
                  isDark ? 'text-white' : 'text-gray-900'
                )} />
                <span className={cn(
                  "font-normal text-sm",
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          
          {/* Settings */}
          <Link
            to="/settings"
            onClick={onClose}
            className={cn(
              "flex items-center px-4 py-3 transition-colors duration-200",
              isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-50'
            )}
          >
            <Settings className={cn(
              "h-5 w-5 mr-3",
              isDark ? 'text-white' : 'text-gray-900'
            )} />
            <span className={cn(
              "font-normal text-sm",
              isDark ? 'text-white' : 'text-gray-900'
            )}>
              Settings and privacy
            </span>
          </Link>

          {/* Help Center */}
          <Link
            to="/help"
            onClick={onClose}
            className={cn(
              "flex items-center px-4 py-3 transition-colors duration-200",
              isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-50'
            )}
          >
            <HelpCircle className={cn(
              "h-5 w-5 mr-3",
              isDark ? 'text-white' : 'text-gray-900'
            )} />
            <span className={cn(
              "font-normal text-sm",
              isDark ? 'text-white' : 'text-gray-900'
            )}>
              Help Center
            </span>
          </Link>

          {/* Display */}
          <button
            onClick={() => {
              toggleTheme();
              onClose();
            }}
            className={cn(
              "w-full flex items-center px-4 py-3 transition-colors duration-200",
              isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-50'
            )}
          >
            {isDark ? (
              <Sun className="h-5 w-5 mr-3 text-white" />
            ) : (
              <Moon className="h-5 w-5 mr-3 text-gray-900" />
            )}
            <span className={cn(
              "font-normal text-sm",
              isDark ? 'text-white' : 'text-gray-900'
            )}>
              Display
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className={cn(
          "h-px mx-4",
          isDark ? 'bg-gray-700' : 'bg-gray-200'
        )} />

        {/* Logout */}
        <div className="py-1">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center px-4 py-3 transition-colors duration-200 text-left",
              isDark ? 'hover:bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-900'
            )}
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span className="font-normal text-sm">
              Log out @{user?.email?.split('@')[0]}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}