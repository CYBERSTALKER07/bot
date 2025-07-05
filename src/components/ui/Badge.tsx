import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  rounded?: boolean;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  rounded = true,
}: BadgeProps) {
  const baseClasses = "inline-flex items-center font-medium transition-all duration-200";

  const variantClasses = {
    default: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200",
    secondary: "bg-asu-maroon/10 dark:bg-lime/10 text-asu-maroon dark:text-lime",
    success: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
    warning: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
    error: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
    outline: "border-2 border-asu-maroon dark:border-lime text-asu-maroon dark:text-lime bg-transparent",
    ghost: "text-asu-maroon dark:text-lime bg-transparent hover:bg-asu-maroon/10 dark:hover:bg-lime/10"
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const roundedClasses = rounded 
    ? size === 'sm' 
      ? 'rounded-full' 
      : size === 'lg' 
        ? 'rounded-xl' 
        : 'rounded-lg'
    : 'rounded-md';

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        roundedClasses,
        className
      )}
    >
      {children}
    </span>
  );
}