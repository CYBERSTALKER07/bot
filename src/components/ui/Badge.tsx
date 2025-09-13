import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface BadgeProps {
  variant?: 'filled' | 'outlined' | 'tonal';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
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
  variant = 'filled',
  color = 'primary',
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
    if (typeof badgeContent === 'number') {
      if (!showZero && badgeContent === 0) return null;
      return badgeContent > max ? `${max}+` : badgeContent;
    }
    return badgeContent;
  };

  const content = getBadgeContent();
  const shouldShow = !invisible && content !== null;

  const getColorClasses = () => {
    const colorMap = {
      primary: {
        filled: isDark 
          ? 'bg-lime text-dark-surface' 
          : 'bg-lime text-dark-surface',
        outlined: isDark 
          ? 'border-lime text-lime bg-transparent' 
          : 'border-lime text-lime bg-transparent',
        tonal: isDark 
          ? 'bg-lime/20 text-lime' 
          : 'bg-lime/20 text-lime'
      },
      secondary: {
        filled: isDark 
          ? 'bg-secondary-300 text-secondary-900' 
          : 'bg-secondary-600 text-white',
        outlined: isDark 
          ? 'border-secondary-300 text-secondary-300 bg-transparent' 
          : 'border-secondary-600 text-secondary-600 bg-transparent',
        tonal: isDark 
          ? 'bg-secondary-300/20 text-secondary-300' 
          : 'bg-secondary-600/20 text-secondary-600'
      },
      error: {
        filled: 'bg-error-600 text-white',
        outlined: 'border-error-600 text-error-600 bg-transparent',
        tonal: 'bg-error-600/20 text-error-600'
      },
      warning: {
        filled: 'bg-warning-600 text-white',
        outlined: 'border-warning-600 text-warning-600 bg-transparent',
        tonal: 'bg-warning-600/20 text-warning-600'
      },
      info: {
        filled: 'bg-info-600 text-white',
        outlined: 'border-info-600 text-info-600 bg-transparent',
        tonal: 'bg-info-600/20 text-info-600'
      },
      success: {
        filled: 'bg-success-600 text-white',
        outlined: 'border-success-600 text-success-600 bg-transparent',
        tonal: 'bg-success-600/20 text-success-600'
      }
    };
    return colorMap[color][variant];
  };

  const getSizeClasses = () => {
    const sizeMap = {
      small: 'min-w-[16px] h-4 px-1.5 text-label-small',
      medium: 'min-w-[20px] h-5 px-2 text-label-medium',
      large: 'min-w-[24px] h-6 px-2.5 text-label-large'
    };
    return sizeMap[size];
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
    const baseClasses = `
      absolute flex items-center justify-center font-medium 
      transition-all duration-200 ease-material-standard
      rounded-full shadow-elevation-1
    `;
    
    const borderClass = variant === 'outlined' ? 'border-2' : '';
    
    return `
      ${baseClasses}
      ${borderClass}
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

// Material Design 3 Badge Variants
export const MaterialBadge = {
  Notification: (props: Omit<BadgeProps, 'color' | 'variant'>) => 
    <Badge color="error" variant="filled" {...props} />,
  
  Status: (props: Omit<BadgeProps, 'variant'>) => 
    <Badge variant="tonal" {...props} />,
  
  Count: (props: Omit<BadgeProps, 'variant'>) => 
    <Badge variant="filled" {...props} />,
  
  Primary: (props: Omit<BadgeProps, 'color'>) => 
    <Badge color="primary" {...props} />,
  
  Secondary: (props: Omit<BadgeProps, 'color'>) => 
    <Badge color="secondary" {...props} />,
};