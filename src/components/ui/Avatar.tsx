import React from 'react';
import { User, LucideIcon } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'circle' | 'square' | 'rounded';
  fallbackIcon?: LucideIcon;
  className?: string;
  online?: boolean;
  bordered?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export default function Avatar({
  src,
  alt,
  name,
  fallback,
  size = 'md',
  variant = 'circle',
  fallbackIcon: FallbackIcon = User,
  className = '',
  online,
  bordered = false,
  gradient = false,
  onClick
}: AvatarProps) {
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl'
  };

  const iconSizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
    '2xl': 'h-10 w-10'
  };

  const indicatorSizeClasses = {
    xs: 'h-2 w-2 border',
    sm: 'h-2.5 w-2.5 border',
    md: 'h-3 w-3 border-2',
    lg: 'h-3.5 w-3.5 border-2',
    xl: 'h-4 w-4 border-2',
    '2xl': 'h-5 w-5 border-2'
  };

  const variantClasses = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg'
  };

  const baseClasses = "relative inline-flex items-center justify-center overflow-hidden transition-all duration-200";
  const borderClasses = bordered ? "ring-2 ring-white shadow-lg" : "";
  const gradientClasses = gradient ? "bg-gradient-to-br from-asu-maroon to-asu-maroon-dark" : "bg-gray-200";
  const clickableClasses = onClick ? "cursor-pointer hover:scale-105 transform" : "";

  const avatarClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${borderClasses}
    ${clickableClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderContent = () => {
    if (src) {
      return (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="h-full w-full object-cover"
          onError={(e) => {
            // Hide image on error to show fallback
            e.currentTarget.style.display = 'none';
          }}
        />
      );
    }

    // Use fallback prop if provided
    if (fallback) {
      return (
        <span className={`font-bold ${gradient ? 'text-white' : 'text-gray-600'}`}>
          {fallback}
        </span>
      );
    }

    if (name) {
      return (
        <span className={`font-bold ${gradient ? 'text-white' : 'text-gray-600'}`}>
          {getInitials(name)}
        </span>
      );
    }

    return (
      <FallbackIcon className={`${iconSizeClasses[size]} ${gradient ? 'text-white' : 'text-gray-400'}`} />
    );
  };

  return (
    <div className="relative inline-block">
      <div
        className={`${avatarClasses} ${gradient || src ? '' : gradientClasses}`}
        onClick={onClick}
      >
        {renderContent()}
      </div>
      
      {online !== undefined && (
        <div className={`absolute -bottom-0.5 -right-0.5 ${indicatorSizeClasses[size]} ${online ? 'bg-green-500' : 'bg-gray-400'} rounded-full border-white`} />
      )}
    </div>
  );
}

// Avatar Group Component
interface AvatarGroupProps {
  avatars: Array<{
    src?: string;
    name?: string;
    alt?: string;
  }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export function AvatarGroup({
  avatars,
  max = 5,
  size = 'md',
  className = ''
}: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          name={avatar.name}
          alt={avatar.alt}
          size={size}
          bordered
          className="relative"
        />
      ))}
      {remainingCount > 0 && (
        <div className={`relative inline-flex items-center justify-center ${size === 'xs' ? 'h-6 w-6 text-xs' : size === 'sm' ? 'h-8 w-8 text-sm' : size === 'md' ? 'h-10 w-10 text-base' : size === 'lg' ? 'h-12 w-12 text-lg' : size === 'xl' ? 'h-16 w-16 text-xl' : 'h-20 w-20 text-2xl'} bg-gray-200 rounded-full ring-2 ring-white font-medium text-gray-600`}>
          +{remainingCount}
        </div>
      )}
    </div>
  );
}