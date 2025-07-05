import React, { forwardRef, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { CircularProgress } from '@mui/material';
import { useTheme } from '../../context/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal' | 'fab';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  startIcon?: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ReactElement;
  endIcon?: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ReactElement;
  loading?: boolean;
  fullWidth?: boolean;
  href?: string;
  component?: React.ElementType;
  to?: string;
  children: React.ReactNode;
  ripple?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'filled',
  size = 'medium',
  color = 'primary',
  startIcon: StartIcon,
  endIcon: EndIcon,
  loading = false,
  fullWidth = false,
  href,
  component,
  to,
  className = '',
  children,
  disabled,
  ripple = true,
  ...props
}, ref) => {
  const { isDark } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  
  const baseClasses = `
    relative inline-flex items-center justify-center font-medium
    transition-all duration-200 ease-material-standard
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:pointer-events-none overflow-hidden
    select-none cursor-pointer
  `;

  const sizeClasses = {
    small: 'px-3 py-1.5 text-label-medium rounded-lg min-h-[32px] gap-1',
    medium: 'px-4 py-2.5 text-label-large rounded-xl min-h-[40px] gap-2',
    large: 'px-6 py-3 text-label-large rounded-2xl min-h-[48px] gap-2'
  };

  const getColorClasses = () => {
    const colors = {
      primary: {
        filled: isDark 
          ? 'bg-lime text-dark-surface hover:shadow-elevation-2 focus:ring-lime/20 active:shadow-elevation-1'
          : 'bg-asu-maroon text-white hover:shadow-elevation-2 focus:ring-asu-maroon/20 active:shadow-elevation-1',
        outlined: isDark
          ? 'border border-lime text-lime hover:bg-lime/8 focus:ring-lime/20 active:bg-lime/12'
          : 'border border-asu-maroon text-asu-maroon hover:bg-asu-maroon/8 focus:ring-asu-maroon/20 active:bg-asu-maroon/12',
        text: isDark
          ? 'text-lime hover:bg-lime/8 focus:ring-lime/20 active:bg-lime/12'
          : 'text-asu-maroon hover:bg-asu-maroon/8 focus:ring-asu-maroon/20 active:bg-asu-maroon/12',
        elevated: isDark
          ? 'bg-dark-surface text-lime shadow-elevation-1 hover:shadow-elevation-2 focus:ring-lime/20 active:shadow-elevation-1'
          : 'bg-surface-50 text-asu-maroon shadow-elevation-1 hover:shadow-elevation-2 focus:ring-asu-maroon/20 active:shadow-elevation-1',
        tonal: isDark
          ? 'bg-lime/10 text-lime hover:bg-lime/20 focus:ring-lime/20 active:bg-lime/15'
          : 'bg-asu-maroon/10 text-asu-maroon hover:bg-asu-maroon/20 focus:ring-asu-maroon/20 active:bg-asu-maroon/15',
        fab: isDark
          ? 'bg-lime text-dark-surface shadow-elevation-3 hover:shadow-elevation-4 focus:ring-lime/20 active:shadow-elevation-2 rounded-2xl'
          : 'bg-asu-maroon text-white shadow-elevation-3 hover:shadow-elevation-4 focus:ring-asu-maroon/20 active:shadow-elevation-2 rounded-2xl'
      },
      secondary: {
        filled: isDark 
          ? 'bg-secondary-300 text-secondary-900 hover:shadow-elevation-2 focus:ring-secondary-300/20 active:shadow-elevation-1'
          : 'bg-secondary-600 text-white hover:shadow-elevation-2 focus:ring-secondary-600/20 active:shadow-elevation-1',
        outlined: isDark
          ? 'border border-secondary-300 text-secondary-300 hover:bg-secondary-300/8 focus:ring-secondary-300/20 active:bg-secondary-300/12'
          : 'border border-secondary-600 text-secondary-600 hover:bg-secondary-600/8 focus:ring-secondary-600/20 active:bg-secondary-600/12',
        text: isDark
          ? 'text-secondary-300 hover:bg-secondary-300/8 focus:ring-secondary-300/20 active:bg-secondary-300/12'
          : 'text-secondary-600 hover:bg-secondary-600/8 focus:ring-secondary-600/20 active:bg-secondary-600/12',
        elevated: isDark
          ? 'bg-dark-surface text-secondary-300 shadow-elevation-1 hover:shadow-elevation-2 focus:ring-secondary-300/20 active:shadow-elevation-1'
          : 'bg-surface-50 text-secondary-600 shadow-elevation-1 hover:shadow-elevation-2 focus:ring-secondary-600/20 active:shadow-elevation-1',
        tonal: isDark
          ? 'bg-secondary-300/10 text-secondary-300 hover:bg-secondary-300/20 focus:ring-secondary-300/20 active:bg-secondary-300/15'
          : 'bg-secondary-600/10 text-secondary-600 hover:bg-secondary-600/20 focus:ring-secondary-600/20 active:bg-secondary-600/15',
        fab: isDark
          ? 'bg-secondary-300 text-secondary-900 shadow-elevation-3 hover:shadow-elevation-4 focus:ring-secondary-300/20 active:shadow-elevation-2 rounded-2xl'
          : 'bg-secondary-600 text-white shadow-elevation-3 hover:shadow-elevation-4 focus:ring-secondary-600/20 active:shadow-elevation-2 rounded-2xl'
      },
      success: {
        filled: 'bg-success-600 text-white hover:shadow-elevation-2 focus:ring-success-600/20 active:shadow-elevation-1',
        outlined: 'border border-success-600 text-success-600 hover:bg-success-600/8 focus:ring-success-600/20 active:bg-success-600/12',
        text: 'text-success-600 hover:bg-success-600/8 focus:ring-success-600/20 active:bg-success-600/12',
        elevated: isDark
          ? 'bg-dark-surface text-success-400 shadow-elevation-1 hover:shadow-elevation-2 focus:ring-success-400/20 active:shadow-elevation-1'
          : 'bg-surface-50 text-success-600 shadow-elevation-1 hover:shadow-elevation-2 focus:ring-success-600/20 active:shadow-elevation-1',
        tonal: 'bg-success-600/10 text-success-600 hover:bg-success-600/20 focus:ring-success-600/20 active:bg-success-600/15',
        fab: 'bg-success-600 text-white shadow-elevation-3 hover:shadow-elevation-4 focus:ring-success-600/20 active:shadow-elevation-2 rounded-2xl'
      },
      error: {
        filled: 'bg-error-600 text-white hover:shadow-elevation-2 focus:ring-error-600/20 active:shadow-elevation-1',
        outlined: 'border border-error-600 text-error-600 hover:bg-error-600/8 focus:ring-error-600/20 active:bg-error-600/12',
        text: 'text-error-600 hover:bg-error-600/8 focus:ring-error-600/20 active:bg-error-600/12',
        elevated: isDark
          ? 'bg-dark-surface text-error-400 shadow-elevation-1 hover:shadow-elevation-2 focus:ring-error-400/20 active:shadow-elevation-1'
          : 'bg-surface-50 text-error-600 shadow-elevation-1 hover:shadow-elevation-2 focus:ring-error-600/20 active:shadow-elevation-1',
        tonal: 'bg-error-600/10 text-error-600 hover:bg-error-600/20 focus:ring-error-600/20 active:bg-error-600/15',
        fab: 'bg-error-600 text-white shadow-elevation-3 hover:shadow-elevation-4 focus:ring-error-600/20 active:shadow-elevation-2 rounded-2xl'
      },
      warning: {
        filled: 'bg-warning-600 text-white hover:shadow-elevation-2 focus:ring-warning-600/20 active:shadow-elevation-1',
        outlined: 'border border-warning-600 text-warning-600 hover:bg-warning-600/8 focus:ring-warning-600/20 active:bg-warning-600/12',
        text: 'text-warning-600 hover:bg-warning-600/8 focus:ring-warning-600/20 active:bg-warning-600/12',
        elevated: isDark
          ? 'bg-dark-surface text-warning-400 shadow-elevation-1 hover:shadow-elevation-2 focus:ring-warning-400/20 active:shadow-elevation-1'
          : 'bg-surface-50 text-warning-600 shadow-elevation-1 hover:shadow-elevation-2 focus:ring-warning-600/20 active:shadow-elevation-1',
        tonal: 'bg-warning-600/10 text-warning-600 hover:bg-warning-600/20 focus:ring-warning-600/20 active:bg-warning-600/15',
        fab: 'bg-warning-600 text-white shadow-elevation-3 hover:shadow-elevation-4 focus:ring-warning-600/20 active:shadow-elevation-2 rounded-2xl'
      },
      info: {
        filled: 'bg-info-600 text-white hover:shadow-elevation-2 focus:ring-info-600/20 active:shadow-elevation-1',
        outlined: 'border border-info-600 text-info-600 hover:bg-info-600/8 focus:ring-info-600/20 active:bg-info-600/12',
        text: 'text-info-600 hover:bg-info-600/8 focus:ring-info-600/20 active:bg-info-600/12',
        elevated: isDark
          ? 'bg-dark-surface text-info-400 shadow-elevation-1 hover:shadow-elevation-2 focus:ring-info-400/20 active:shadow-elevation-1'
          : 'bg-surface-50 text-info-600 shadow-elevation-1 hover:shadow-elevation-2 focus:ring-info-600/20 active:shadow-elevation-1',
        tonal: 'bg-info-600/10 text-info-600 hover:bg-info-600/20 focus:ring-info-600/20 active:bg-info-600/15',
        fab: 'bg-info-600 text-white shadow-elevation-3 hover:shadow-elevation-4 focus:ring-info-600/20 active:shadow-elevation-2 rounded-2xl'
      }
    };

    return colors[color][variant] || colors.primary[variant];
  };

  const widthClasses = fullWidth ? 'w-full' : '';
  
  const fabClasses = variant === 'fab' 
    ? size === 'small' 
      ? 'w-10 h-10 p-0' 
      : size === 'large' 
        ? 'w-14 h-14 p-0' 
        : 'w-12 h-12 p-0'
    : '';

  const stateClasses = isPressed ? 'transform scale-95' : '';

  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${getColorClasses()}
    ${widthClasses}
    ${fabClasses}
    ${stateClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
  const loadingSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;

  const renderIcon = (Icon: typeof StartIcon, iconClassName: string) => {
    if (!Icon) return null;
    
    if (React.isValidElement(Icon)) {
      return React.cloneElement(Icon as React.ReactElement<{className?: string}>, { 
        className: iconClassName 
      });
    }
    
    if (typeof Icon === 'function' || typeof Icon === 'object') {
      const IconComponent = Icon as React.ComponentType<{className?: string; style?: React.CSSProperties}>;
      return <IconComponent className={iconClassName} style={{ fontSize: iconSize }} />;
    }
    
    return null;
  };

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  const Component = component || (href ? 'a' : 'button');
  const componentProps = {
    ref,
    className: buttonClasses,
    disabled: disabled || loading,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
    ...(href && { href }),
    ...(to && { to }),
    ...props
  };

  return (
    <Component {...componentProps}>
      {/* Ripple Effect */}
      {ripple && (
        <span className="absolute inset-0 overflow-hidden rounded-inherit">
          <span className="absolute inset-0 rounded-inherit transition-opacity duration-200 opacity-0 hover:opacity-100 bg-white/10" />
        </span>
      )}
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-inherit">
        {loading ? (
          <CircularProgress 
            size={loadingSize} 
            className="text-current"
          />
        ) : StartIcon && (
          renderIcon(StartIcon, variant === 'fab' ? '' : '')
        )}
        
        {variant !== 'fab' && children}
        
        {!loading && EndIcon && (
          renderIcon(EndIcon, variant === 'fab' ? '' : '')
        )}
      </span>
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;

// Material Design 3 Button Variants
export const MaterialButton = {
  Filled: (props: Omit<ButtonProps, 'variant'>) => 
    <Button variant="filled" {...props} />,
  
  Outlined: (props: Omit<ButtonProps, 'variant'>) => 
    <Button variant="outlined" {...props} />,
  
  Text: (props: Omit<ButtonProps, 'variant'>) => 
    <Button variant="text" {...props} />,
  
  Elevated: (props: Omit<ButtonProps, 'variant'>) => 
    <Button variant="elevated" {...props} />,
  
  Tonal: (props: Omit<ButtonProps, 'variant'>) => 
    <Button variant="tonal" {...props} />,
  
  FAB: (props: Omit<ButtonProps, 'variant'>) => 
    <Button variant="fab" {...props} />,
};