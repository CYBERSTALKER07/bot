import React, { forwardRef } from 'react';
import { 
  Visibility, 
  VisibilityOff, 
  Search, 
  Email, 
  Person, 
  Lock, 
  Phone, 
  LocationOn 
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  showPasswordToggle?: boolean;
  focused?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  startIcon,
  endIcon,
  variant = 'outlined',
  size = 'medium',
  fullWidth = true,
  multiline = false,
  rows = 3,
  showPasswordToggle = false,
  focused = false,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(focused);
  const [hasValue, setHasValue] = React.useState(Boolean(props.value || props.defaultValue));

  const actualType = type === 'password' && showPassword ? 'text' : type;

  const baseClasses = `
    w-full transition-all duration-200 
    focus:outline-none focus:ring-2 
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-6 py-4 text-lg'
  };

  const variantClasses = {
    outlined: `
      border-2 rounded-xl
      ${isDark 
        ? `bg-dark-surface border-gray-600 text-dark-text placeholder-dark-muted
           focus:border-lime focus:ring-lime/20 hover:border-gray-500
           ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}` 
        : `bg-white border-gray-300 text-gray-900 placeholder-gray-500
           focus:border-asu-maroon focus:ring-asu-maroon/20 hover:border-gray-400
           ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`
      }
    `,
    filled: `
      border-0 border-b-2 rounded-t-xl
      ${isDark 
        ? `bg-dark-surface/50 border-gray-600 text-dark-text placeholder-dark-muted
           focus:border-lime focus:ring-0 focus:bg-dark-surface
           ${error ? 'border-red-500 focus:border-red-500' : ''}` 
        : `bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500
           focus:border-asu-maroon focus:ring-0 focus:bg-gray-50
           ${error ? 'border-red-500 focus:border-red-500' : ''}`
      }
    `,
    standard: `
      border-0 border-b-2 bg-transparent rounded-none
      ${isDark 
        ? `border-gray-600 text-dark-text placeholder-dark-muted
           focus:border-lime focus:ring-0
           ${error ? 'border-red-500 focus:border-red-500' : ''}` 
        : `border-gray-300 text-gray-900 placeholder-gray-500
           focus:border-asu-maroon focus:ring-0
           ${error ? 'border-red-500 focus:border-red-500' : ''}`
      }
    `
  };

  const labelClasses = `
    absolute left-4 transition-all duration-200 pointer-events-none
    ${isFocused || hasValue 
      ? variant === 'outlined' 
        ? `top-0 text-xs px-2 -translate-y-1/2 ${
            isDark ? 'bg-dark-surface text-lime' : 'bg-white text-asu-maroon'
          }`
        : `top-1 text-xs ${
            isDark ? 'text-lime' : 'text-asu-maroon'
          }`
      : variant === 'standard'
        ? `top-1/2 -translate-y-1/2 text-base ${
            isDark ? 'text-dark-muted' : 'text-gray-500'
          }`
        : `top-1/2 -translate-y-1/2 text-base ${
            isDark ? 'text-dark-muted' : 'text-gray-500'
          }`
    }
    ${error ? 'text-red-500' : ''}
  `;

  const iconClasses = `
    absolute top-1/2 transform -translate-y-1/2 
    ${isDark ? 'text-dark-muted' : 'text-gray-400'}
    ${error ? 'text-red-500' : ''}
  `;

  const inputClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${startIcon ? 'pl-12' : ''}
    ${endIcon || showPasswordToggle ? 'pr-12' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {/* Input Field */}
      <div className="relative">
        {/* Start Icon */}
        {startIcon && (
          <div className={`${iconClasses} left-4`}>
            {startIcon}
          </div>
        )}

        {/* Input */}
        {multiline ? (
          <textarea
            ref={ref as any}
            rows={rows}
            className={inputClasses}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e as any);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              setHasValue(Boolean(e.target.value));
              props.onBlur?.(e as any);
            }}
            onChange={(e) => {
              setHasValue(Boolean(e.target.value));
              props.onChange?.(e as any);
            }}
            {...props}
          />
        ) : (
          <input
            ref={ref}
            type={actualType}
            className={inputClasses}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              setHasValue(Boolean(e.target.value));
              props.onBlur?.(e);
            }}
            onChange={(e) => {
              setHasValue(Boolean(e.target.value));
              props.onChange?.(e);
            }}
            {...props}
          />
        )}

        {/* Floating Label */}
        {label && (
          <label className={labelClasses}>
            {label}
          </label>
        )}

        {/* End Icon or Password Toggle */}
        {(endIcon || showPasswordToggle) && (
          <div className={`${iconClasses} right-4`}>
            {showPasswordToggle && type === 'password' ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:opacity-70 transition-opacity"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            ) : (
              endIcon
            )}
          </div>
        )}
      </div>

      {/* Helper Text or Error */}
      {(helperText || error) && (
        <div className={`mt-1 text-sm px-4 ${
          error 
            ? 'text-red-500' 
            : isDark ? 'text-dark-muted' : 'text-gray-600'
        }`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

// Predefined input variants for common use cases
export const MaterialInput = {
  Email: (props: Omit<InputProps, 'type' | 'startIcon'>) => 
    <Input type="email" startIcon={<Email />} {...props} />,
  
  Password: (props: Omit<InputProps, 'type' | 'showPasswordToggle'>) => 
    <Input type="password" showPasswordToggle {...props} />,
  
  Search: (props: Omit<InputProps, 'type' | 'startIcon'>) => 
    <Input type="search" startIcon={<Search />} {...props} />,
  
  Phone: (props: Omit<InputProps, 'type' | 'startIcon'>) => 
    <Input type="tel" startIcon={<Phone />} {...props} />,
  
  Location: (props: Omit<InputProps, 'startIcon'>) => 
    <Input startIcon={<LocationOn />} {...props} />,
  
  Person: (props: Omit<InputProps, 'startIcon'>) => 
    <Input startIcon={<Person />} {...props} />,
};