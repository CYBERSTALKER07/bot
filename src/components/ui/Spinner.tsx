import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'white';
  className?: string;
  text?: string;
  icon?: LucideIcon;
  fullScreen?: boolean;
}

export default function Spinner({
  size = 'md',
  variant = 'default',
  className = '',
  text,
  icon: Icon,
  fullScreen = false
}: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const variantClasses = {
    default: 'text-gray-600',
    primary: 'text-asu-maroon',
    secondary: 'text-asu-gold',
    white: 'text-white'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const spinnerContent = (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      {Icon ? (
        <Icon className={`${sizeClasses[size]} ${variantClasses[variant]} animate-spin`} />
      ) : (
        <div className={`${sizeClasses[size]} ${variantClasses[variant]}`}>
          <svg className="animate-spin h-full w-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
      {text && (
        <p className={`${textSizeClasses[size]} ${variantClasses[variant]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
}

// Additional loading states
export const LoadingDots = ({ variant = 'default' }: { variant?: 'default' | 'primary' | 'secondary' }) => {
  const variantClasses = {
    default: 'bg-gray-400',
    primary: 'bg-asu-maroon',
    secondary: 'bg-asu-gold'
  };

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`w-2 h-2 ${variantClasses[variant]} rounded-full animate-pulse`}
          style={{
            animationDelay: `${index * 0.15}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
};

export const LoadingPulse = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
  </div>
);