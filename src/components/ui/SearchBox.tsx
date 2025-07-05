import React from 'react';
import { Search, X, LucideIcon } from 'lucide-react';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'floating' | 'minimal';
  icon?: LucideIcon;
  clearable?: boolean;
  autoFocus?: boolean;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
}

export default function SearchBox({
  value,
  onChange,
  placeholder = "Search...",
  size = 'md',
  variant = 'default',
  icon: CustomIcon,
  clearable = true,
  autoFocus = false,
  className = '',
  onFocus,
  onBlur,
  disabled = false
}: SearchBoxProps) {
  const Icon = CustomIcon || Search;

  const baseClasses = "relative transition-all duration-200";
  
  const variantClasses = {
    default: "bg-white border-2 border-gray-200 focus-within:border-asu-maroon hover:shadow-md",
    floating: "bg-white/80 backdrop-blur-sm border-2 border-gray-200 focus-within:border-asu-maroon shadow-inner hover:shadow-md",
    minimal: "bg-transparent border-0 border-b-2 border-gray-300 focus-within:border-asu-maroon rounded-none"
  };

  const sizeClasses = {
    sm: "rounded-lg",
    md: "rounded-xl", 
    lg: "rounded-2xl"
  };

  const inputSizeClasses = {
    sm: "pl-10 pr-8 py-2 text-sm",
    md: "pl-12 pr-10 py-3 text-base",
    lg: "pl-14 pr-12 py-4 text-lg"
  };

  const iconSizeClasses = {
    sm: "h-4 w-4 left-3",
    md: "h-5 w-5 left-4", 
    lg: "h-6 w-6 left-5"
  };

  const clearIconSizeClasses = {
    sm: "h-4 w-4 right-2",
    md: "h-5 w-5 right-3",
    lg: "h-6 w-6 right-4"
  };

  const containerClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={containerClasses}>
      <Icon className={`absolute top-1/2 transform -translate-y-1/2 ${iconSizeClasses[size]} text-gray-400 z-10`} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        className={`
          w-full ${inputSizeClasses[size]} 
          bg-transparent border-0 outline-none 
          text-gray-900 placeholder-gray-500
          ${clearable && value ? 'pr-10' : ''}
        `.trim().replace(/\s+/g, ' ')}
      />
      {clearable && value && (
        <button
          onClick={handleClear}
          className={`absolute top-1/2 transform -translate-y-1/2 ${clearIconSizeClasses[size]} text-gray-400 hover:text-gray-600 transition-colors z-10`}
          type="button"
        >
          <X className="h-full w-full" />
        </button>
      )}
    </div>
  );
}