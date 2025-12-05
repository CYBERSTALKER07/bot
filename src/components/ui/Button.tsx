import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { CircularProgress } from '@mui/material';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal' | 'fab' | 'ghost' | 'soft';
  size?: 'small' | 'medium' | 'large' | '2xl';
  iconSize?: 'sm' | 'md' | 'lg' | 'xl' | number;
  startIcon?: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ReactElement;
  endIcon?: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ReactElement;
  loading?: boolean;
  fullWidth?: boolean;
  href?: string;
  component?: React.ElementType;
  to?: string;
  children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'filled',
  size = 'medium',
  iconSize: customIconSize,
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

  // UX Improvement 1: Tactile Feedback & Transitions
  const baseClasses = `
    relative inline-flex items-center justify-center font-medium
    transition-all duration-200 ease-material-standard
    active:scale-[0.97] hover:-translate-y-0.5
    focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-info-500
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:translate-y-0
    overflow-hidden select-none cursor-pointer
  `;

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm rounded-lg min-h-[32px] gap-1.5',
    medium: 'px-5 py-2.5 text-sm rounded-xl min-h-[40px] gap-2',
    large: 'px-7 py-3.5 text-base rounded-2xl min-h-[48px] gap-2.5',
    '2xl': 'px-9 py-4.5 text-lg rounded-3xl min-h-[56px] gap-3'
  };

  // UX Improvement 5: Polished Colors matching your config
  const variantClasses = {
    filled: `
      bg-black text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-black/20
      dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:hover:shadow-white/20
      border border-transparent
    `,
    outlined: `
      bg-transparent border border-gray-200 text-gray-700 
      hover:bg-gray-50 hover:border-gray-300
      dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-700
    `,
    text: `
      bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/50
      dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5
    `,
    elevated: `
      bg-white text-gray-900 shadow-sm border border-gray-100
      hover:shadow-md hover:border-gray-200
      dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700
    `,
    tonal: `
      bg-gray-100 text-gray-900 hover:bg-gray-200
      dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700
    `,
    ghost: `
      bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900
      dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white
    `,
    fab: `
      bg-info-500 text-white shadow-xl shadow-info-500/30 hover:bg-info-600 hover:shadow-info-600/40 
      rounded-full aspect-square p-0 flex items-center justify-center
    `,
    // New "Soft" Variant
    soft: `
      bg-info-50 text-info-700 hover:bg-info-100
      dark:bg-info-500/10 dark:text-info-400 dark:hover:bg-info-500/20
    `
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  const fabSizeClasses = variant === 'fab'
    ? size === 'small' ? 'w-10 h-10 min-h-0 px-0'
      : size === 'large' ? 'w-14 h-14 min-h-0 px-0'
        : 'w-12 h-12 min-h-0 px-0'
    : '';

  // Override standard size classes if FAB
  const appliedSizeClass = variant === 'fab' ? fabSizeClasses : sizeClasses[size];

  const buttonClasses = `
    ${baseClasses}
    ${appliedSizeClass}
    ${variantClasses[variant] || variantClasses.filled}
    ${widthClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const getIconSize = () => {
    if (typeof customIconSize === 'number') return customIconSize;
    if (customIconSize === 'xl') return 28;
    if (customIconSize === 'lg') return 24;
    if (customIconSize === 'md') return 20;
    if (customIconSize === 'sm') return 16;

    // Auto-size based on button size
    if (size === '2xl') return 26;
    if (size === 'large') return 22;
    if (size === 'small') return 16;
    return 18; // Medium default
  };

  const iconSizePx = getIconSize();

  const renderIcon = (Icon: any, extraClass: string) => {
    if (!Icon) return null;

    // If it's a Lucide icon or React component
    if (typeof Icon === 'function' || typeof Icon === 'object') {
      // Check if it's a valid element first
      if (React.isValidElement(Icon)) {
        return React.cloneElement(Icon as React.ReactElement<any>, {
          className: `${extraClass} ${Icon.props.className || ''}`
        });
      }

      const IconComp = Icon as React.ComponentType<any>;
      return <IconComp size={iconSizePx} className={extraClass} />;
    }
    return null;
  };

  const Component = component || (href ? 'a' : (to ? 'a' : 'button')); // Simple link handling

  // Safe props filtering could go here if needed, but spreading rest is standard
  const componentProps = {
    ref,
    className: buttonClasses,
    disabled: disabled || loading,
    ...(href && { href }),
    ...(to && { href: to }), // Assuming using standard anchor, if Link component needed, pass via `component` prop
    ...props
  };

  return (
    <Component {...componentProps}>
      {/* Inner container for proper centering and z-index */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <CircularProgress
            size={iconSizePx}
            thickness={5}
            style={{ color: 'currentColor' }}
          />
        ) : (
          StartIcon && renderIcon(StartIcon, "-ml-0.5")
        )}

        {variant !== 'fab' && children}

        {!loading && EndIcon && renderIcon(EndIcon, "-mr-0.5")}
      </span>

      {/* Optional: subtle shimmer overlay for loading or special states could go here */}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;