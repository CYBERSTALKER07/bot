import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'floating' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  animated?: boolean;
  resizable?: boolean;
  characterCount?: boolean;
  maxLength?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  icon: Icon,
  variant = 'default',
  size = 'md',
  fullWidth = true,
  animated = true,
  resizable = true,
  characterCount = false,
  maxLength,
  className = '',
  value,
  ...props
}, ref) => {
  const baseClasses = "transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-asu-maroon border-2";
  
  const variantClasses = {
    default: "bg-white border-gray-200 focus:border-asu-maroon hover:shadow-md",
    floating: "bg-white/80 backdrop-blur-sm border-gray-200 focus:border-asu-maroon shadow-inner hover:shadow-md",
    minimal: "bg-transparent border-0 border-b-2 border-gray-300 focus:border-asu-maroon rounded-none"
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm rounded-lg min-h-[80px]",
    md: "px-4 py-3 text-base rounded-xl min-h-[100px]",
    lg: "px-6 py-4 text-lg rounded-2xl min-h-[120px]"
  };

  const animationClasses = animated ? "transform hover:scale-[1.02]" : "";
  const widthClasses = fullWidth ? "w-full" : "";
  const errorClasses = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "";
  const resizeClasses = resizable ? "resize-y" : "resize-none";

  const textareaClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${animationClasses}
    ${widthClasses}
    ${errorClasses}
    ${resizeClasses}
    ${Icon ? 'pl-12' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
        )}
        <textarea
          ref={ref}
          className={textareaClasses}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        {characterCount && maxLength && (
          <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-white/80 backdrop-blur-sm px-2 py-1 rounded">
            {currentLength}/{maxLength}
          </div>
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

Textarea.displayName = 'Textarea';

export default Textarea;