import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { CircularProgress } from '@mui/material';
import { useTheme } from '../../context/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined' | 'text' | 'fab';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  startIcon?: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ReactElement;
  endIcon?: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ReactElement;
  loading?: boolean;
  fullWidth?: boolean;
  elevation?: number;
  disableElevation?: boolean;
  href?: string;
  component?: React.ElementType;
  to?: string;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  startIcon: StartIcon,
  endIcon: EndIcon,
  loading = false,
  fullWidth = false,
  elevation = 2,
  disableElevation = false,
  href,
  component,
  to,
  className = '',
  children,
  disabled,
  ...props
}, ref) => {
  const { isDark } = useTheme();
  
  const baseClasses = `
    inline-flex items-center justify-center font-medium transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    transform hover:scale-105 active:scale-95
  `;

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm rounded-lg min-h-[32px]',
    medium: 'px-4 py-2 text-base rounded-xl min-h-[40px]',
    large: 'px-6 py-3 text-lg rounded-2xl min-h-[48px]'
  };

  const getColorClasses = () => {
    const colors = {
      primary: {
        contained: isDark 
          ? 'bg-lime text-dark-surface hover:bg-lime/90 focus:ring-lime shadow-lg hover:shadow-xl'
          : 'bg-asu-maroon text-white hover:bg-asu-maroon/90 focus:ring-asu-maroon shadow-lg hover:shadow-xl',
        outlined: isDark
          ? 'border-2 border-lime text-lime hover:bg-lime/10 focus:ring-lime'
          : 'border-2 border-asu-maroon text-asu-maroon hover:bg-asu-maroon/10 focus:ring-asu-maroon',
        text: isDark
          ? 'text-lime hover:bg-lime/10 focus:ring-lime'
          : 'text-asu-maroon hover:bg-asu-maroon/10 focus:ring-asu-maroon',
        fab: isDark
          ? 'bg-lime text-dark-surface hover:bg-lime/90 focus:ring-lime shadow-lg hover:shadow-xl rounded-full'
          : 'bg-asu-maroon text-white hover:bg-asu-maroon/90 focus:ring-asu-maroon shadow-lg hover:shadow-xl rounded-full'
      },
      secondary: {
        contained: isDark 
          ? 'bg-dark-accent text-dark-surface hover:bg-dark-accent/90 focus:ring-dark-accent shadow-lg hover:shadow-xl'
          : 'bg-asu-gold text-white hover:bg-asu-gold/90 focus:ring-asu-gold shadow-lg hover:shadow-xl',
        outlined: isDark
          ? 'border-2 border-dark-accent text-dark-accent hover:bg-dark-accent/10 focus:ring-dark-accent'
          : 'border-2 border-asu-gold text-asu-gold hover:bg-asu-gold/10 focus:ring-asu-gold',
        text: isDark
          ? 'text-dark-accent hover:bg-dark-accent/10 focus:ring-dark-accent'
          : 'text-asu-gold hover:bg-asu-gold/10 focus:ring-asu-gold',
        fab: isDark
          ? 'bg-dark-accent text-dark-surface hover:bg-dark-accent/90 focus:ring-dark-accent shadow-lg hover:shadow-xl rounded-full'
          : 'bg-asu-gold text-white hover:bg-asu-gold/90 focus:ring-asu-gold shadow-lg hover:shadow-xl rounded-full'
      },
      success: {
        contained: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-lg hover:shadow-xl',
        outlined: 'border-2 border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
        text: 'text-green-600 hover:bg-green-50 focus:ring-green-500',
        fab: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-lg hover:shadow-xl rounded-full'
      },
      error: {
        contained: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl',
        outlined: 'border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
        text: 'text-red-600 hover:bg-red-50 focus:ring-red-500',
        fab: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl rounded-full'
      },
      warning: {
        contained: 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500 shadow-lg hover:shadow-xl',
        outlined: 'border-2 border-amber-600 text-amber-600 hover:bg-amber-50 focus:ring-amber-500',
        text: 'text-amber-600 hover:bg-amber-50 focus:ring-amber-500',
        fab: 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500 shadow-lg hover:shadow-xl rounded-full'
      },
      info: {
        contained: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl',
        outlined: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
        text: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
        fab: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl rounded-full'
      }
    };

    return colors[color][variant] || colors.primary[variant];
  };

  const elevationClasses = !disableElevation && variant === 'contained' 
    ? `shadow-${elevation === 1 ? 'sm' : elevation === 2 ? 'md' : 'lg'} hover:shadow-xl`
    : '';

  const widthClasses = fullWidth ? 'w-full' : '';
  
  const fabClasses = variant === 'fab' 
    ? 'w-14 h-14 rounded-full p-0' 
    : '';

  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${getColorClasses()}
    ${elevationClasses}
    ${widthClasses}
    ${fabClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
  const loadingSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;

  const renderIcon = (Icon: typeof StartIcon, iconClassName: string) => {
    if (!Icon) return null;
    
    // Handle React elements (JSX)
    if (React.isValidElement(Icon)) {
      return React.cloneElement(Icon as React.ReactElement<{className?: string}>, { 
        className: iconClassName 
      });
    }
    
    // Handle React components (MUI icons, Lucide icons)
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
      {loading ? (
        <CircularProgress 
          size={loadingSize} 
          className={`mr-2 ${
            variant === 'contained' 
              ? 'text-current' 
              : isDark ? 'text-lime' : 'text-asu-maroon'
          }`}
        />
      ) : StartIcon && (
        renderIcon(StartIcon, `mr-2 ${variant === 'fab' ? 'mr-0' : ''}`)
      )}
      
      {variant !== 'fab' && children}
      
      {!loading && EndIcon && (
        renderIcon(EndIcon, `ml-2 ${variant === 'fab' ? 'ml-0' : ''}`)
      )}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;

// Predefined button variants for common use cases
export const MaterialButton = {
  Primary: (props: Omit<ButtonProps, 'variant' | 'color'>) => 
    <Button variant="contained" color="primary" {...props} />,
  
  Secondary: (props: Omit<ButtonProps, 'variant' | 'color'>) => 
    <Button variant="contained" color="secondary" {...props} />,
  
  Outlined: (props: Omit<ButtonProps, 'variant'>) => 
    <Button variant="outlined" {...props} />,
  
  Text: (props: Omit<ButtonProps, 'variant'>) => 
    <Button variant="text" {...props} />,
  
  FAB: (props: Omit<ButtonProps, 'variant'>) => 
    <Button variant="fab" {...props} />,
};