import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'button' | 'switch';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ThemeToggle({ 
  variant = 'button', 
  size = 'md', 
  className = '' 
}: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  if (variant === 'switch') {
    return (
      <button
        onClick={toggleTheme}
        className={`relative inline-flex items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isDark
            ? 'bg-lime focus:ring-lime'
            : 'bg-gray-200 focus:ring-asu-maroon'
        } ${
          size === 'sm' ? 'h-6 w-11' : size === 'lg' ? 'h-8 w-14' : 'h-7 w-12'
        } ${className}`}
        aria-label="Toggle theme"
      >
        <span
          className={`inline-block transform rounded-full transition-all duration-300 ${
            isDark
              ? 'translate-x-5 bg-dark-surface'
              : 'translate-x-0 bg-white'
          } ${
            size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-7 w-7' : 'h-6 w-6'
          } shadow-lg`}
        >
          {isDark ? (
            <Moon className={`${iconSizes[size]} text-lime m-auto mt-0.5`} />
          ) : (
            <Sun className={`${iconSizes[size]} text-asu-maroon m-auto mt-0.5`} />
          )}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`${sizes[size]} rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isDark
          ? 'bg-lime/20 text-lime hover:bg-lime/30 focus:ring-lime'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 focus:ring-asu-maroon'
      } ${className}`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className={`${iconSizes[size]} transition-transform duration-300 hover:rotate-180`} />
      ) : (
        <Moon className={`${iconSizes[size]} transition-transform duration-300 hover:-rotate-12`} />
      )}
    </button>
  );
}