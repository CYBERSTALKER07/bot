import React from 'react';
import { Link } from 'react-router-dom';
import { School } from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';

interface NavigationProps {
  onScrollToSection: (sectionName: string) => void;
}

export default function Navigation({ onScrollToSection }: NavigationProps) {
  const { isDark } = useTheme();
  
  return (
    <nav className={`fixed top-0 w-full backdrop-blur-sm z-50 border-b transition-colors duration-300 ${
      isDark 
        ? 'bg-dark-surface/95 border-gray-700' 
        : 'bg-white/95 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <span className={`font-bold text-xl -skew-x-12 ${
              isDark ? 'text-lime' : 'text-primary'
            }`}>
            AUTHandshake
            </span>
          </Link>

          {/* Center - Navigation Pages */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onScrollToSection('features')} 
              className={`text-sm font-medium transition-colors duration-200 ${
                isDark 
                  ? 'text-dark-muted hover:text-dark-text' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Features
            </button>
            <button 
              onClick={() => onScrollToSection('howItWorks')} 
              className={`text-sm font-medium transition-colors duration-200 ${
                isDark 
                  ? 'text-dark-muted hover:text-dark-text' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              How it Works
            </button>
            <Link 
              to="/for-students"
              className={`text-sm font-medium transition-colors duration-200 ${
                isDark 
                  ? 'text-dark-muted hover:text-dark-text' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              For Students
            </Link>
            <Link 
              to="/for-employers"
              className={`text-sm font-medium transition-colors duration-200 ${
                isDark 
                  ? 'text-dark-muted hover:text-dark-text' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              For Employers
            </Link>
            <button 
              onClick={() => onScrollToSection('demo')} 
              className={`text-sm font-medium transition-colors duration-200 ${
                isDark 
                  ? 'text-dark-muted hover:text-dark-text' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Demo
            </button>
          </div>

          {/* Right side - Authentication */}
          <div className="flex items-center space-x-4">
            <ThemeToggle size="small" />
            <Link 
              to="/login" 
              className={`text-sm font-medium transition-colors duration-200 ${
                isDark 
                  ? 'text-dark-muted hover:text-dark-text' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'bg-lime text-dark-surface hover:bg-lime/90' 
                  : 'bg-asu-maroon text-white hover:bg-asu-maroon-dark'
              }`}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu - simplified */}
      <div className="md:hidden">
        {/* You can add a mobile hamburger menu here if needed */}
      </div>
    </nav>
  );
}