import React, { forwardRef } from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SelectOption {
  value: string;
  label: string;
  emoji?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  options: SelectOption[];
  variant?: 'default' | 'floating' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  animated?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  icon: Icon,
  options,
  variant = 'default',
  size = 'md',
  fullWidth = true,
  animated = true,
  className = '',
  ...props
}, ref) => {
  const { isDark } = useTheme();

  const baseClasses = "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-asu-maroon border-2 cursor-pointer appearance-none";
  
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

  const selectClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${animationClasses}
    ${widthClasses}
    ${errorClasses}
    ${Icon ? 'pl-12' : ''}
    pr-12
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
        {Icon && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
        )}
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.emoji ? `${option.emoji} ${option.label}` : option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
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

Select.displayName = 'Select';

export default Select;