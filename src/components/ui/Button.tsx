import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { CircularProgress } from '@mui/material';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal' | 'fab';
  size?: 'small' | 'medium' | 'large';
  startIcon?: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ReactElement;
  endIcon?: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ReactElement;
  loading?: boolean;
  fullWidth?: boolean;
  href?: string;
  component?: React.ElementType;
  to?: string;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'filled',
  size = 'medium',
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
  ...props
}, ref) => {
  
  const baseClasses = `
    relative inline-flex items-center justify-center font-medium
    transition-all duration-200 ease-material-standard
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:pointer-events-none overflow-hidden
    select-none cursor-pointer
  `;

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm rounded-lg min-h-[32px] gap-1',
    medium: 'px-4 py-2.5 text-base rounded-xl min-h-[40px] gap-2',
    large: 'px-6 py-3 text-base rounded-2xl min-h-[48px] gap-2'
  };

  const widthClasses = fullWidth ? 'w-full' : '';
  
  const fabClasses = variant === 'fab' 
    ? size === 'small' 
      ? 'w-10 h-10 p-0' 
      : size === 'large' 
        ? 'w-14 h-14 p-0' 
        : 'w-12 h-12 p-0'
    : '';

  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${widthClasses}
    ${fabClasses}
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

  const Component = component || (href ? 'a' : 'button');
  const componentProps = {
    ref,
    className: buttonClasses,
    disabled: disabled || loading,
    ...(href && { href }),
    ...(to && { to }),
    ...props
  };

  return (
    <Component {...componentProps}>
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-inherit">
        {loading ? (
          <CircularProgress 
            size={loadingSize} 
            className="text-current"
          />
        ) : StartIcon && (
          renderIcon(StartIcon, '')
        )}
        
        {variant !== 'fab' && children}
        
        {!loading && EndIcon && (
          renderIcon(EndIcon, '')
        )}
      </span>
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;