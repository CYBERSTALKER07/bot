import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';

interface NavigationProps {
  onScrollToSection: (sectionName: string) => void;
}

export default function Navigation({ onScrollToSection }: NavigationProps) {
  const { isDark } = useTheme();
  
  return (
    <nav className={`fixed top-0 w-full backdrop-blur-xl z-50 border-b-4 shadow-lg transform rotate-0.5 transition-colors duration-300 ${
      isDark 
        ? 'bg-dark-surface/90 border-lime/20' 
        : 'bg-white/90 border-asu-maroon/20'
    }`}>
      <div className={`absolute top-0 left-0 w-full h-1 opacity-60 ${
        isDark 
          ? 'bg-gradient-to-r from-lime via-dark-accent to-lime' 
          : 'bg-gradient-to-r from-asu-maroon via-asu-gold to-asu-maroon'
      }`}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3 group">
            <div className="relative transform group-hover:rotate-12 transition-transform duration-300">
              <GraduationCap className={`h-9 w-9 transition-colors duration-300 ${
                isDark ? 'text-lime' : 'text-asu-maroon'
              }`} />
              <Sparkles className={`sparkle absolute -top-1 -right-1 h-4 w-4 ${
                isDark ? 'text-lime' : 'text-asu-gold'
              }`} />
              <div className={`absolute -bottom-1 -left-1 w-2 h-2 rounded-full animate-pulse ${
                isDark ? 'bg-lime/50' : 'bg-asu-gold/50'
              }`}></div>
            </div>
            <span className={`font-bold text-xl relative transition-colors duration-300 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}>
              ASU Handshake
              <div className={`absolute -bottom-1 left-0 w-full h-0.5 transform -skew-x-12 ${
                isDark ? 'bg-lime/30' : 'bg-asu-maroon/30'
              }`}></div>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onScrollToSection('features')} 
              className={`transition-all duration-300 hover:scale-105 transform hover:-rotate-1 relative group ${
                isDark 
                  ? 'text-dark-text hover:text-lime' 
                  : 'text-gray-600 hover:text-asu-maroon'
              }`}
            >
              Features
              <div className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full transform -skew-x-12 ${
                isDark ? 'bg-lime' : 'bg-asu-maroon'
              }`}></div>
            </button>
            <button 
              onClick={() => onScrollToSection('howItWorks')} 
              className={`transition-all duration-300 hover:scale-105 transform hover:rotate-1 relative group ${
                isDark 
                  ? 'text-dark-text hover:text-lime' 
                  : 'text-gray-600 hover:text-asu-maroon'
              }`}
            >
              How it Works
              <div className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full transform skew-x-12 ${
                isDark ? 'bg-lime' : 'bg-asu-maroon'
              }`}></div>
            </button>
            <button 
              onClick={() => onScrollToSection('demo')} 
              className={`transition-all duration-300 hover:scale-105 transform hover:-rotate-1 relative group ${
                isDark 
                  ? 'text-dark-text hover:text-lime' 
                  : 'text-gray-600 hover:text-asu-maroon'
              }`}
            >
              Demo
              <div className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full transform -skew-x-12 ${
                isDark ? 'bg-lime' : 'bg-asu-maroon'
              }`}></div>
            </button>
            <ThemeToggle size="sm" />
            <Link to="/login" className={`transition-all duration-300 hover:scale-105 transform hover:rotate-1 relative group ${
              isDark 
                ? 'text-dark-text hover:text-lime' 
                : 'text-gray-600 hover:text-asu-maroon'
            }`}>
              Sign In
              <div className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full transform skew-x-12 ${
                isDark ? 'bg-lime' : 'bg-asu-maroon'
              }`}></div>
            </Link>
            <Link to="/register" className={`px-6 py-2 rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:rotate-1 relative overflow-hidden ${
              isDark 
                ? 'bg-gradient-to-r from-lime to-dark-accent text-dark-surface' 
                : 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white'
            }`}>
              <span className="relative z-10">Get Started 🚀</span>
              <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 ${
                isDark 
                  ? 'bg-gradient-to-r from-dark-accent/20 to-transparent' 
                  : 'bg-gradient-to-r from-asu-gold/20 to-transparent'
              }`}></div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}