import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'floating' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  animated?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon: Icon,
  iconPosition = 'left',
  variant = 'default',
  size = 'md',
  fullWidth = true,
  animated = true,
  className = '',
  ...props
}, ref) => {
  const baseClasses = "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-asu-maroon border-2";
  
  const variantClasses = {
    default: "bg-white border-gray-200 focus:border-asu-maroon hover:shadow-md",
    floating: "bg-white/80 backdrop-blur-sm border-gray-200 focus:border-asu-maroon shadow-inner hover:shadow-md",
    minimal: "bg-transparent border-0 border-b-2 border-gray-300 focus:border-asu-maroon rounded-none"
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-4 py-3 text-base rounded-xl",
    lg: "px-6 py-4 text-lg rounded-2xl"
  };

  const animationClasses = animated ? "transform hover:scale-[1.02]" : "";
  const widthClasses = fullWidth ? "w-full" : "";
  const errorClasses = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "";

  const inputClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${animationClasses}
    ${widthClasses}
    ${errorClasses}
    ${Icon && iconPosition === 'left' ? 'pl-12' : ''}
    ${Icon && iconPosition === 'right' ? 'pr-12' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        {Icon && iconPosition === 'right' && (
          <Icon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;