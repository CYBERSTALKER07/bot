import React, { useState } from 'react';
import { Close, Check, Person, Label, Star } from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';

interface ChipProps {
  label: string;
  variant?: 'assist' | 'filter' | 'input' | 'suggestion';
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  onDelete?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  avatar?: React.ReactNode;
  size?: 'small' | 'medium';
  className?: string;
  clickable?: boolean;
  onClick?: () => void;
}

const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'assist',
  selected = false,
  onSelect,
  onDelete,
  disabled = false,
  icon,
  avatar,
  size = 'medium',
  className = '',
  clickable = false,
  onClick,
}) => {
  const { isDark } = useTheme();
  const [isSelected, setIsSelected] = useState(selected);

  const handleClick = () => {
    if (disabled) return;
    
    if (variant === 'filter' && onSelect) {
      const newSelected = !isSelected;
      setIsSelected(newSelected);
      onSelect(newSelected);
    } else if (clickable && onClick) {
      onClick();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && !disabled) {
      onDelete();
    }
  };

  const getSizeClasses = () => {
    return {
      small: 'h-8 px-3 text-label-small',
      medium: 'h-10 px-4 text-label-medium'
    }[size];
  };

  const getVariantClasses = () => {
    const baseClasses = 'border transition-all duration-200 ease-material-standard';
    
    if (variant === 'filter') {
      return isSelected || selected
        ? isDark
          ? `${baseClasses} bg-secondary-300 text-secondary-900 border-secondary-300`
          : `${baseClasses} bg-secondary-100 text-secondary-900 border-secondary-200`
        : isDark
          ? `${baseClasses} bg-transparent text-dark-text border-gray-600 hover:bg-gray-700`
          : `${baseClasses} bg-transparent text-gray-700 border-gray-300 hover:bg-gray-50`;
    }
    
    if (variant === 'input') {
      return isDark
        ? `${baseClasses} bg-dark-surface text-dark-text border-gray-600`
        : `${baseClasses} bg-surface-100 text-gray-800 border-gray-300`;
    }
    
    if (variant === 'suggestion') {
      return isDark
        ? `${baseClasses} bg-transparent text-dark-text border-gray-600 hover:bg-gray-700`
        : `${baseClasses} bg-transparent text-gray-700 border-gray-300 hover:bg-gray-50`;
    }
    
    // assist variant (default)
    return isDark
      ? `${baseClasses} bg-dark-surface text-dark-text border-gray-600 hover:bg-gray-700`
      : `${baseClasses} bg-surface-100 text-gray-800 border-gray-300 hover:bg-gray-50`;
  };

  const iconSizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5'
  };

  const baseClasses = `
    inline-flex items-center justify-center rounded-full font-medium
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
    ${clickable || variant === 'filter' ? 'cursor-pointer' : ''}
    ${getSizeClasses()}
    ${getVariantClasses()}
    ${className}
  `;

  return (
    <div
      className={baseClasses}
      onClick={handleClick}
      role={variant === 'filter' ? 'checkbox' : clickable ? 'button' : undefined}
      aria-checked={variant === 'filter' ? isSelected || selected : undefined}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      {/* Leading icon/avatar */}
      {avatar && (
        <div className="mr-2 -ml-1">
          {avatar}
        </div>
      )}
      {icon && !avatar && (
        <div className={`mr-2 ${iconSizeClasses[size]}`}>
          {icon}
        </div>
      )}
      
      {/* Filter check icon */}
      {variant === 'filter' && (isSelected || selected) && (
        <Check className={`mr-2 ${iconSizeClasses[size]}`} />
      )}
      
      {/* Label */}
      <span className="whitespace-nowrap">
        {label}
      </span>
      
      {/* Delete button */}
      {onDelete && (
        <button
          onClick={handleDelete}
          className={`ml-2 -mr-1 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${
            disabled ? 'cursor-not-allowed' : ''
          }`}
          disabled={disabled}
          aria-label={`Delete ${label}`}
        >
          <Close className={iconSizeClasses[size]} />
        </button>
      )}
    </div>
  );
};

export default Chip;

// Material Design 3 Chip Variants
export const MaterialChip = {
  Assist: (props: Omit<ChipProps, 'variant'>) => 
    <Chip variant="assist" {...props} />,
  
  Filter: (props: Omit<ChipProps, 'variant'>) => 
    <Chip variant="filter" {...props} />,
  
  Input: (props: Omit<ChipProps, 'variant'>) => 
    <Chip variant="input" {...props} />,
  
  Suggestion: (props: Omit<ChipProps, 'variant'>) => 
    <Chip variant="suggestion" {...props} />,
  
  WithIcon: (props: Omit<ChipProps, 'icon'>) => 
    <Chip icon={<Label />} {...props} />,
  
  WithAvatar: (props: Omit<ChipProps, 'avatar'>) => 
    <Chip avatar={<Person className="w-6 h-6 rounded-full bg-gray-300" />} {...props} />,
  
  Deletable: (props: ChipProps) => 
    <Chip {...props} />,
  
  Selectable: (props: Omit<ChipProps, 'variant'>) => 
    <Chip variant="filter" {...props} />,
};

// Chip Set Component for grouping chips
interface ChipSetProps {
  children: React.ReactNode;
  className?: string;
  multiSelect?: boolean;
  onSelectionChange?: (selected: string[]) => void;
}

export const ChipSet: React.FC<ChipSetProps> = ({
  children,
  className = '',
  multiSelect = false,
  onSelectionChange,
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {children}
    </div>
  );
};