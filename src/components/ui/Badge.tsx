import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  animated?: boolean;
  pill?: boolean;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  animated = true,
  pill = false
}: BadgeProps) {
  const baseClasses = "inline-flex items-center font-medium transition-all duration-200";
  
  const variantClasses = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200", 
    danger: "bg-red-100 text-red-800 border border-red-200",
    info: "bg-blue-100 text-blue-800 border border-blue-200",
    secondary: "bg-asu-maroon/10 text-asu-maroon border border-asu-maroon/20",
    outline: "bg-transparent text-asu-maroon border border-asu-maroon"
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm", 
    lg: "px-4 py-2 text-base"
  };

  const shapeClasses = pill ? "rounded-full" : "rounded-lg";
  const animationClasses = animated ? "hover:scale-105 transform" : "";

  const badgeClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${shapeClasses}
    ${animationClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <span className={badgeClasses}>
      {Icon && iconPosition === 'left' && (
        <Icon className={`${children ? 'mr-1.5' : ''} h-4 w-4`} />
      )}
      {children}
      {Icon && iconPosition === 'right' && (
        <Icon className={`${children ? 'ml-1.5' : ''} h-4 w-4`} />
      )}
    </span>
  );
}