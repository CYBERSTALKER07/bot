import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, 
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/cva';

interface UserCardProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

export default function UserCard({ isOpen, onClose, position = 'bottom-left' }: UserCardProps) {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();

  if (!isOpen || !user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'top-16 right-4'; // Position below navbar on the right
      case 'top-left':
        return 'top-16 left-4'; // Position below navbar on the left
      case 'top-right':
        return 'top-16 right-4'; // Position below navbar on the right
      default:
        // Position below the navbar where user button is located
        return 'top-16 right-4';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* User Card - Simplified X Style */}
      <div className={cn(
        "fixed z-50 w-64 rounded-2xl shadow-2xl border duration-200 py-2",
        isDark ? 'bg-black border-gray-600 shadow-gray-900/50' : 'bg-white border-gray-300 shadow-gray-900/20',
        getPositionClasses()
      )}
      style={{
        transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.95)',
        opacity: isOpen ? 1 : 0,
        transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      >
        
        {/* Settings */}
        <Link
          to="/settings"
          onClick={onClose}
          className={cn(
            "flex items-center px-4 py-3 transition-colors duration-200 w-full",
            isDark ? 'hover:bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-900'
          )}
        >
          <Settings className="h-5 w-5 mr-3" />
          <span className="font-normal text-sm">
            Settings and privacy
          </span>
        </Link>

        {/* Logout */}
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
    </>
  );
}