import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95";

  const variantClasses = {
    primary: "bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white hover:shadow-lg focus:ring-asu-maroon dark:from-lime dark:to-dark-accent dark:text-dark-surface dark:focus:ring-lime",
    secondary: "bg-gradient-to-r from-asu-gold to-asu-gold-dark text-white hover:shadow-lg focus:ring-asu-gold dark:from-dark-accent dark:to-lime dark:text-dark-surface dark:focus:ring-lime",
    outline: "border-2 border-asu-maroon text-asu-maroon hover:bg-asu-maroon hover:text-white focus:ring-asu-maroon dark:border-lime dark:text-lime dark:hover:bg-lime dark:hover:text-dark-surface dark:focus:ring-lime",
    ghost: "text-asu-maroon hover:bg-asu-maroon/10 focus:ring-asu-maroon dark:text-lime dark:hover:bg-lime/10 dark:focus:ring-lime",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg focus:ring-red-500 dark:from-red-600 dark:to-red-700 dark:focus:ring-red-600"
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl"
  };

  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
  );

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className={cn('h-5 w-5', children && 'mr-2')} />
      )}
      {!loading && children}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={cn('h-5 w-5', children && 'ml-2')} />
      )}
    </button>
  );
}