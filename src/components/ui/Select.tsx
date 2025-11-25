import React, { forwardRef, useState } from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SelectOption {
  value: string;
  label: string;
  emoji?: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  options?: SelectOption[];
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  supportingText?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  supportingText,
  icon: Icon,
  options = [],
  variant = 'filled',
  size = 'medium',
  fullWidth = true,
  className = '',
  children,
  disabled = false,
  ...props
}, ref) => {
  const { isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getSizeClasses = () => {
    return {
      small: 'h-10 px-3 text-body-small',
      medium: 'h-14 px-4 text-body-medium',
      large: 'h-16 px-5 text-body-large'
    }[size];
  };

  const getVariantClasses = () => {
    const baseClasses = 'transition-all duration-200 ease-material-standard focus:outline-hidden cursor-pointer appearance-none';
    
    if (variant === 'outlined') {
      return error
        ? `${baseClasses} border-2 border-error bg-transparent focus:border-error`
        : isFocused
          ? `${baseClasses} border-2 border-primary bg-transparent`
          : isDark
            ? `${baseClasses} border border-gray-600 bg-transparent hover:border-gray-500`
            : `${baseClasses} border border-gray-300 bg-transparent hover:border-gray-400`;
    }
    
    // filled variant
    return error
      ? `${baseClasses} border-0 border-b-2 border-error bg-error-container/10 focus:bg-error-container/20`
      : isFocused
        ? `${baseClasses} border-0 border-b-2 border-primary bg-surface-variant focus:bg-surface-variant`
        : isDark
          ? `${baseClasses} border-0 border-b border-gray-600 bg-dark-surface hover:bg-gray-700`
          : `${baseClasses} border-0 border-b border-gray-400 bg-surface-100 hover:bg-surface-200`;
  };

  const getLabelClasses = () => {
    const isFloating = isFocused || props.value;
    const baseClasses = 'absolute left-4 transition-all duration-200 ease-material-standard pointer-events-none';
    
    if (variant === 'outlined') {
      return isFloating
        ? `${baseClasses} -top-2 bg-surface px-1 text-label-small ${
            error ? 'text-error' : isFocused ? 'text-primary' : isDark ? 'text-gray-300' : 'text-gray-600'
          }`
        : `${baseClasses} top-1/2 -translate-y-1/2 text-body-medium ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`;
    }
    
    // filled variant
    return isFloating
      ? `${baseClasses} top-2 text-label-small ${
          error ? 'text-error' : isFocused ? 'text-primary' : isDark ? 'text-gray-300' : 'text-gray-600'
        }`
      : `${baseClasses} top-1/2 -translate-y-1/2 text-body-medium ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`;
  };

  const selectClasses = `
    ${getSizeClasses()}
    ${getVariantClasses()}
    ${variant === 'filled' ? 'rounded-t-xl' : 'rounded-xl'}
    ${fullWidth ? 'w-full' : ''}
    ${Icon ? 'pl-12' : label ? 'pt-6' : ''}
    pr-12
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${isDark ? 'text-dark-text' : 'text-gray-900'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      <div className="relative">
        {/* Leading icon */}
        {Icon && (
          <Icon className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10 ${
            error ? 'text-error' : isFocused ? 'text-primary' : isDark ? 'text-gray-400' : 'text-gray-500'
          }`} />
        )}
        
        {/* Select element */}
        <select
          ref={ref}
          className={selectClasses}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          {children || options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.emoji ? `${option.emoji} ${option.label}` : option.label}
            </option>
          ))}
        </select>
        
        {/* Floating label */}
        {label && (
          <label className={getLabelClasses()}>
            {label}
          </label>
        )}
        
        {/* Trailing icon */}
        <ChevronDown className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none transition-transform duration-200 ${
          isFocused ? 'rotate-180' : ''
        } ${
          error ? 'text-error' : isFocused ? 'text-primary' : isDark ? 'text-gray-400' : 'text-gray-500'
        }`} />
        
        {/* Active indicator */}
        {variant === 'filled' && (
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200 ${
            error ? 'bg-error' : isFocused ? 'bg-primary' : 'bg-transparent'
          }`} />
        )}
      </div>
      
      {/* Supporting text */}
      {(error || helperText || supportingText) && (
        <div className="mt-1 px-4">
          <p className={`text-label-small ${
            error ? 'text-error' : isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {error || helperText || supportingText}
          </p>
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;