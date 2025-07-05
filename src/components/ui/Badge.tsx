import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface BadgeProps {
  variant?: 'standard' | 'dot' | 'outlined';
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'standard';
  size?: 'small' | 'medium' | 'large';
  overlap?: 'circular' | 'rectangular';
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right';
  };
  showZero?: boolean;
  max?: number;
  badgeContent?: React.ReactNode;
  invisible?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'standard',
  color = 'default',
  size = 'medium',
  overlap = 'rectangular',
  anchorOrigin = { vertical: 'top', horizontal: 'right' },
  showZero = false,
  max = 99,
  badgeContent,
  invisible = false,
  className = '',
  children,
  ...props
}) => {
  const { isDark } = useTheme();

  const getBadgeContent = () => {
    if (variant === 'dot') return null;
    
    if (typeof badgeContent === 'number') {
      if (!showZero && badgeContent === 0) return null;
      return badgeContent > max ? `${max}+` : badgeContent;
    }
    
    return badgeContent;
  };

  const content = getBadgeContent();
  const shouldShow = !invisible && (variant === 'dot' || content !== null);

  const getColorClasses = () => {
    const colors = {
      default: isDark 
        ? 'bg-gray-600 text-gray-100' 
        : 'bg-gray-500 text-white',
      standard: isDark 
        ? 'bg-gray-600 text-gray-100' 
        : 'bg-gray-500 text-white',
      primary: isDark 
        ? 'bg-lime text-dark-surface' 
        : 'bg-asu-maroon text-white',
      secondary: isDark 
        ? 'bg-dark-accent text-dark-surface' 
        : 'bg-asu-gold text-white',
      error: 'bg-red-500 text-white',
      warning: 'bg-amber-500 text-white',
      info: 'bg-blue-500 text-white',
      success: 'bg-green-500 text-white'
    };
    return colors[color];
  };

  const getSizeClasses = () => {
    if (variant === 'dot') {
      const dotSizes = {
        small: 'w-1.5 h-1.5',
        medium: 'w-2 h-2',
        large: 'w-2.5 h-2.5'
      };
      return dotSizes[size];
    }

    const standardSizes = {
      small: 'min-w-[16px] h-4 px-1 text-xs',
      medium: 'min-w-[20px] h-5 px-1.5 text-xs',
      large: 'min-w-[24px] h-6 px-2 text-sm'
    };
    return standardSizes[size];
  };

  const getPositionClasses = () => {
    const { vertical, horizontal } = anchorOrigin;
    
    if (overlap === 'circular') {
      return `
        ${vertical === 'top' ? '-top-1' : '-bottom-1'}
        ${horizontal === 'right' ? '-right-1' : '-left-1'}
      `;
    }
    
    return `
      ${vertical === 'top' ? '-top-2' : '-bottom-2'}
      ${horizontal === 'right' ? '-right-2' : '-left-2'}
    `;
  };

  const getVariantClasses = () => {
    const baseClasses = 'absolute flex items-center justify-center font-medium transition-all duration-200';
    
    if (variant === 'dot') {
      return `${baseClasses} rounded-full ${getSizeClasses()} ${getColorClasses()}`;
    }
    
    if (variant === 'outlined') {
      return `
        ${baseClasses} rounded-full border-2 bg-transparent
        ${getSizeClasses()}
        ${isDark 
          ? 'border-lime text-lime' 
          : 'border-asu-maroon text-asu-maroon'
        }
      `;
    }
    
    // Standard variant
    return `
      ${baseClasses} rounded-full shadow-sm
      ${getSizeClasses()}
      ${getColorClasses()}
    `;
  };

  const badgeClasses = `
    ${getVariantClasses()}
    ${getPositionClasses()}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  if (!children) {
    // Standalone badge
    return shouldShow ? (
      <span className={`inline-flex ${getVariantClasses()} relative`} {...props}>
        {content}
      </span>
    ) : null;
  }

  return (
    <div className="relative inline-flex" {...props}>
      {children}
      {shouldShow && (
        <span className={badgeClasses}>
          {content}
        </span>
      )}
    </div>
  );
};

export default Badge;

// Predefined badge variants for common use cases
export const MaterialBadge = {
  Notification: (props: Omit<BadgeProps, 'color' | 'variant'>) => 
    <Badge color="error" variant="standard" {...props} />,
  
  Status: (props: Omit<BadgeProps, 'variant'>) => 
    <Badge variant="dot" {...props} />,
  
  Count: (props: Omit<BadgeProps, 'variant'>) => 
    <Badge variant="standard" {...props} />,
  
  Primary: (props: Omit<BadgeProps, 'color'>) => 
    <Badge color="primary" {...props} />,
  
  Secondary: (props: Omit<BadgeProps, 'color'>) => 
    <Badge color="secondary" {...props} />,
};