import React from 'react';
import { cn } from '../../lib/cva';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: React.ReactNode;
  glassHeader?: boolean;
  safeArea?: boolean;
}

export default function PageLayout({
  children,
  className,
  maxWidth = '7xl',
  padding = 'md',
  header,
  glassHeader = false,
  safeArea = true
}: PageLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-4',
    md: 'px-4 sm:px-6 lg:px-8 py-6 lg:py-8',
    lg: 'px-6 sm:px-8 lg:px-12 py-8 lg:py-12'
  };

  return (
    <div className={cn(
      'min-h-screen w-full',
      safeArea && 'safe-top safe-bottom',
      className
    )}>
      {/* Optional Glass Header */}
      {header && (
        <div className={cn(
          'sticky top-0 z-40 border-b',
          glassHeader && 'glass backdrop-blur-xl',
          safeArea && 'ios-safe-top',
          'dark:border-gray-800 border-gray-200'
        )}>
          {header}
        </div>
      )}

      {/* Main Content */}
      <div className={cn(
        'mx-auto mobile-container',
        maxWidthClasses[maxWidth],
        paddingClasses[padding]
      )}>
        {children}
      </div>
    </div>
  );
}