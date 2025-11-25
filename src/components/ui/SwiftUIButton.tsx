import React, { forwardRef } from 'react';
import { useSwiftUIAnimation, useViewState, SwiftUITransitions } from '../../hooks/useSwiftUIAnimations';
import { useTheme } from '../../context/ThemeContext';
import { LucideIcon } from 'lucide-react';

interface SwiftUIButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal' | 'fab';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  startIcon?: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ReactElement;
  endIcon?: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ReactElement;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  springy?: boolean;
  hoverScale?: number;
  tapScale?: number;
  animateOnMount?: boolean;
}

const SwiftUIButton = forwardRef<HTMLButtonElement, SwiftUIButtonProps>(({
  variant = 'filled',
  size = 'medium',
  color = 'primary',
  startIcon: StartIcon,
  endIcon: EndIcon,
  loading = false,
  fullWidth = false,
  className = '',
  children,
  disabled,
  springy = true,
  hoverScale = 1.05,
  tapScale = 0.95,
  animateOnMount = true,
  onClick,
  ...props
}, ref) => {
  const { isDark } = useTheme();
  const { animate } = useSwiftUIAnimation();
  const { 
    elementRef, 
    scalePress, 
    scaleRelease, 
    hoverScale: hoverScaleAnimation, 
    hoverReset 
  } = useViewState();

  React.useEffect(() => {
    if (animateOnMount && elementRef.current) {
      SwiftUITransitions.scaleIn(elementRef.current);
    }
  }, [animateOnMount]);

  const handleMouseDown = () => {
    if (springy) {
      animate(elementRef.current, { scale: tapScale }, { 
        duration: 0.1, 
        ease: 'power2.out' 
      });
    }
  };

  const handleMouseUp = () => {
    if (springy) {
      animate(elementRef.current, { scale: 1 }, { 
        duration: 0.3, 
        ease: 'back.out(1.7)' 
      });
    }
  };

  const handleMouseEnter = () => {
    if (springy && !disabled) {
      animate(elementRef.current, { scale: hoverScale }, { 
        duration: 0.2, 
        ease: 'power2.out' 
      });
    }
  };

  const handleMouseLeave = () => {
    if (springy && !disabled) {
      animate(elementRef.current, { scale: 1 }, { 
        duration: 0.3, 
        ease: 'back.out(1.7)' 
      });
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (springy) {
      // Create ripple effect
      animate(elementRef.current, { 
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });
    }
    
    if (onClick) onClick(e);
  };

  const baseClasses = `
    relative inline-flex items-center justify-center font-medium
    transition-all duration-200 ease-out
    focus:outline-hidden focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:pointer-events-none overflow-hidden
    select-none cursor-pointer
    ${springy ? 'transform-gpu' : ''}
  `;

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm rounded-lg min-h-[32px] gap-1',
    medium: 'px-4 py-2.5 text-base rounded-xl min-h-[40px] gap-2',
    large: 'px-6 py-3 text-lg rounded-2xl min-h-[48px] gap-2'
  };

  const getColorClasses = () => {
    const colors = {
      primary: {
        filled: isDark 
          ? 'bg-lime text-dark-surface hover:bg-lime/90 focus:ring-lime/20 shadow-lg hover:shadow-xl' 
          : 'bg-lime text-dark-surface hover:bg-lime/90 focus:ring-lime/20 shadow-lg hover:shadow-xl',
        outlined: isDark
          ? 'border-2 border-lime text-lime hover:bg-lime/10 focus:ring-lime/20'
          : 'border-2 border-lime text-lime hover:bg-lime/10 focus:ring-lime/20',
        text: isDark
          ? 'text-lime hover:bg-lime/10 focus:ring-lime/20'
          : 'text-lime hover:bg-lime/10 focus:ring-lime/20',
      }
    };

    return colors[color][variant] || colors.primary[variant];
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${getColorClasses()}
    ${widthClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      ref={(node) => {
        elementRef.current = node;
        if (ref) {
          if (typeof ref === 'function') {
            ref(node);
          } else {
            ref.current = node;
          }
        }
      }}
      className={buttonClasses}
      disabled={disabled || loading}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      {...props}
    >
      {/* Ripple effect background */}
      <span className="absolute inset-0 overflow-hidden rounded-inherit">
        <span className="absolute inset-0 rounded-inherit transition-opacity duration-200 opacity-0 hover:opacity-100 bg-white/10" />
      </span>
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-inherit">
        {StartIcon && !loading && (
          <StartIcon className="h-5 w-5" />
        )}
        
        {loading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          children
        )}
        
        {EndIcon && !loading && (
          <EndIcon className="h-5 w-5" />
        )}
      </span>
    </button>
  );
});

SwiftUIButton.displayName = 'SwiftUIButton';

export default SwiftUIButton;