import React from 'react';
import { Add, Edit, Share, Delete, Favorite, Star } from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';

interface FABProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: 'surface' | 'primary' | 'secondary' | 'tertiary';
  extended?: boolean;
  label?: string;
  disabled?: boolean;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
}

const FAB: React.FC<FABProps> = ({
  onClick,
  icon = <Add />,
  size = 'medium',
  variant = 'primary',
  extended = false,
  label,
  disabled = false,
  className = '',
  position = 'bottom-right',
}) => {
  const { isDark } = useTheme();

  const getSizeClasses = () => {
    if (extended) {
      return {
        small: 'h-10 px-4 text-label-medium',
        medium: 'h-12 px-6 text-label-large',
        large: 'h-14 px-8 text-label-large'
      }[size];
    }
    
    return {
      small: 'h-10 w-10',
      medium: 'h-14 w-14',
      large: 'h-18 w-18'
    }[size];
  };

  const getVariantClasses = () => {
    const variants = {
      surface: isDark
        ? 'bg-dark-surface text-dark-text hover:bg-dark-surface/90 shadow-elevation-1'
        : 'bg-surface-100 text-gray-800 hover:bg-surface-200 shadow-elevation-1',
      primary: isDark
        ? 'bg-lime text-dark-surface hover:bg-lime/90 shadow-elevation-2'
        : 'bg-asu-maroon text-white hover:bg-asu-maroon/90 shadow-elevation-2',
      secondary: isDark
        ? 'bg-secondary-300 text-secondary-900 hover:bg-secondary-300/90 shadow-elevation-2'
        : 'bg-secondary-600 text-white hover:bg-secondary-600/90 shadow-elevation-2',
      tertiary: isDark
        ? 'bg-tertiary-300 text-tertiary-900 hover:bg-tertiary-300/90 shadow-elevation-1'
        : 'bg-tertiary-600 text-white hover:bg-tertiary-600/90 shadow-elevation-1'
    };
    return variants[variant];
  };

  const getPositionClasses = () => {
    const positions = {
      'bottom-right': 'fixed bottom-4 right-4',
      'bottom-left': 'fixed bottom-4 left-4',
      'top-right': 'fixed top-4 right-4',
      'top-left': 'fixed top-4 left-4',
      'center': 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
    };
    return positions[position];
  };

  const baseClasses = `
    inline-flex items-center justify-center rounded-full font-medium
    transition-all duration-200 ease-material-standard
    focus:outline-hidden focus:ring-4 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    hover:shadow-elevation-3 active:shadow-elevation-1
    ${extended ? 'gap-2' : ''}
    ${getSizeClasses()}
    ${getVariantClasses()}
    ${getPositionClasses()}
    ${className}
  `;

  const iconSizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      style={{ zIndex: 1000 }}
    >
      <span className={iconSizeClasses[size]}>
        {icon}
      </span>
      {extended && label && (
        <span className="whitespace-nowrap">
          {label}
        </span>
      )}
    </button>
  );
};

export default FAB;

// Material Design 3 FAB Variants
export const MaterialFAB = {
  Add: (props: Omit<FABProps, 'icon'>) => 
    <FAB icon={<Add />} {...props} />,
  
  Edit: (props: Omit<FABProps, 'icon'>) => 
    <FAB icon={<Edit />} {...props} />,
  
  Share: (props: Omit<FABProps, 'icon'>) => 
    <FAB icon={<Share />} {...props} />,
  
  Delete: (props: Omit<FABProps, 'icon' | 'variant'>) => 
    <FAB icon={<Delete />} variant="secondary" {...props} />,
  
  Favorite: (props: Omit<FABProps, 'icon'>) => 
    <FAB icon={<Favorite />} {...props} />,
  
  Star: (props: Omit<FABProps, 'icon'>) => 
    <FAB icon={<Star />} {...props} />,
  
  Extended: (props: Omit<FABProps, 'extended'>) => 
    <FAB extended={true} {...props} />,
};