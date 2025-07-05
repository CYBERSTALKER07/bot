import React, { forwardRef, useState } from 'react';
import { 
  Visibility, 
  VisibilityOff, 
  Search, 
  Email, 
  Person, 
  Lock, 
  Phone, 
  LocationOn,
  Error,
  CheckCircle
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  showPasswordToggle?: boolean;
  focused?: boolean;
  supportingText?: string;
  success?: boolean;
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
  supportingText,
  success = false,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(focused);
  const [hasValue, setHasValue] = useState(Boolean(props.value || props.defaultValue));

  const actualType = type === 'password' && showPassword ? 'text' : type;
  const isFloating = isFocused || hasValue;
  const hasError = Boolean(error);

  const baseClasses = `
    w-full transition-all duration-200 ease-material-standard
    focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
    text-body-large
  `;

  const sizeClasses = {
    small: 'px-4 py-2 text-body-small',
    medium: 'px-4 py-4 text-body-large',
    large: 'px-4 py-5 text-body-large'
  };

  const getStateColor = () => {
    if (hasError) return isDark ? 'error-400' : 'error-600';
    if (success) return isDark ? 'success-400' : 'success-600';
    if (isFocused) return isDark ? 'lime' : 'asu-maroon';
    return isDark ? 'gray-600' : 'gray-300';
  };

  const variantClasses = {
    outlined: `
      border-2 rounded-lg bg-transparent
      ${isDark 
        ? `text-dark-text placeholder-transparent
           border-gray-600 hover:border-gray-500
           focus:border-${getStateColor()} focus:ring-4 focus:ring-${getStateColor()}/10` 
        : `text-gray-900 placeholder-transparent
           border-gray-300 hover:border-gray-400
           focus:border-${getStateColor()} focus:ring-4 focus:ring-${getStateColor()}/10`
      }
      ${hasError ? `border-error-600 focus:border-error-600 focus:ring-error-600/10` : ''}
      ${success ? `border-success-600 focus:border-success-600 focus:ring-success-600/10` : ''}
    `,
    filled: `
      border-0 border-b-2 rounded-t-lg
      ${isDark 
        ? `bg-dark-surface/50 text-dark-text placeholder-transparent
           border-gray-600 hover:border-gray-500
           focus:border-${getStateColor()} focus:ring-0 focus:bg-dark-surface/70` 
        : `bg-surface-200 text-gray-900 placeholder-transparent
           border-gray-300 hover:border-gray-400
           focus:border-${getStateColor()} focus:ring-0 focus:bg-surface-300`
      }
      ${hasError ? `border-error-600 focus:border-error-600` : ''}
      ${success ? `border-success-600 focus:border-success-600` : ''}
    `
  };

  const labelClasses = `
    absolute left-4 transition-all duration-200 ease-material-standard pointer-events-none
    ${isFloating
      ? variant === 'outlined'
        ? `top-0 text-label-small px-2 -translate-y-1/2 ${
            isDark ? 'bg-dark-surface' : 'bg-white'
          }`
        : `top-2 text-label-small`
      : `top-1/2 -translate-y-1/2 text-body-large`
    }
    ${hasError 
      ? 'text-error-600' 
      : success 
        ? 'text-success-600'
        : isFocused 
          ? isDark ? 'text-lime' : 'text-asu-maroon'
          : isDark ? 'text-gray-400' : 'text-gray-500'
    }
  `;

  const iconClasses = `
    absolute top-1/2 transform -translate-y-1/2 w-5 h-5
    ${hasError 
      ? 'text-error-600' 
      : success 
        ? 'text-success-600'
        : isFocused 
          ? isDark ? 'text-lime' : 'text-asu-maroon'
          : isDark ? 'text-gray-400' : 'text-gray-500'
    }
  `;

  const inputClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${startIcon ? 'pl-12' : ''}
    ${(endIcon || showPasswordToggle || hasError || success) ? 'pr-12' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(Boolean(e.target.value));
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(Boolean(e.target.value));
    props.onChange?.(e);
  };

  const renderEndIcon = () => {
    if (showPasswordToggle && type === 'password') {
      return (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
        >
          {showPassword ? <VisibilityOff className="w-5 h-5" /> : <Visibility className="w-5 h-5" />}
        </button>
      );
    }
    if (hasError) return <Error className="w-5 h-5" />;
    if (success) return <CheckCircle className="w-5 h-5" />;
    return endIcon;
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {/* Input Container */}
      <div className="relative">
        {/* Start Icon */}
        {startIcon && (
          <div className={`${iconClasses} left-4`}>
            {startIcon}
          </div>
        )}

        {/* Input Field */}
        {multiline ? (
          <textarea
            ref={ref as any}
            rows={rows}
            className={inputClasses}
            onFocus={handleFocus as any}
            onBlur={handleBlur as any}
            onChange={handleChange as any}
            {...props}
          />
        ) : (
          <input
            ref={ref}
            type={actualType}
            className={inputClasses}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
        )}

        {/* Floating Label */}
        {label && (
          <label className={labelClasses}>
            {label}
          </label>
        )}

        {/* End Icon */}
        {(endIcon || showPasswordToggle || hasError || success) && (
          <div className={`${iconClasses} right-4`}>
            {renderEndIcon()}
          </div>
        )}
      </div>

      {/* Supporting Text */}
      {(supportingText || error || helperText) && (
        <div className={`mt-1 px-4 text-body-small ${
          error 
            ? 'text-error-600' 
            : success
              ? 'text-success-600'
              : isDark ? 'text-dark-muted' : 'text-gray-600'
        }`}>
          {error || supportingText || helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

// Material Design 3 Input Variants
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