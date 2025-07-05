import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  animated?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  fullWidth = false,
  animated = true,
  ...props
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white hover:shadow-xl focus:ring-asu-maroon border border-transparent",
    secondary: "bg-gradient-to-r from-asu-gold to-yellow-300 text-asu-maroon hover:shadow-xl focus:ring-asu-gold border border-transparent",
    outline: "border-2 border-asu-maroon text-asu-maroon hover:bg-asu-maroon hover:text-white focus:ring-asu-maroon",
    ghost: "text-asu-maroon hover:bg-asu-maroon/10 focus:ring-asu-maroon border border-transparent",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-xl focus:ring-red-500 border border-transparent",
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl focus:ring-green-500 border border-transparent"
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-4 py-3 text-base rounded-xl",
    lg: "px-6 py-4 text-lg rounded-2xl",
    xl: "px-8 py-5 text-xl rounded-3xl"
  };

  const animationClasses = animated ? "transform hover:scale-105 hover:-translate-y-1" : "";
  const widthClasses = fullWidth ? "w-full" : "";

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${animationClasses}
    ${widthClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {Icon && iconPosition === 'left' && !loading && (
        <Icon className={`${children ? 'mr-2' : ''} h-5 w-5`} />
      )}
      
      {children}
      
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className={`${children ? 'ml-2' : ''} h-5 w-5`} />
      )}
    </button>
  );
}