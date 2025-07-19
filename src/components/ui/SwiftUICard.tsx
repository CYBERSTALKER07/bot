import React, { useRef, useEffect } from 'react';
import { useSwiftUIAnimation, useViewState, SwiftUITransitions } from '../../hooks/useSwiftUIAnimations';
import { useTheme } from '../../context/ThemeContext';

interface SwiftUICardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'elevated' | 'filled' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  interactive?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  animateOnMount?: boolean;
  hoverScale?: number;
  springy?: boolean;
  delay?: number;
  slideDirection?: 'left' | 'right' | 'up' | 'down';
}

export const SwiftUICard: React.FC<SwiftUICardProps> = ({
  children,
  className = '',
  variant = 'elevated',
  padding = 'medium',
  interactive = false,
  clickable = false,
  onClick,
  animateOnMount = true,
  hoverScale = 1.02,
  springy = true,
  delay = 0,
  slideDirection = 'up'
}) => {
  const { isDark } = useTheme();
  const { animate, staggeredAnimate } = useSwiftUIAnimation();
  const { elementRef } = useViewState();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!animateOnMount || hasAnimated.current || !elementRef.current) return;

    // Delay the animation
    setTimeout(() => {
      if (elementRef.current) {
        SwiftUITransitions.slideIn(elementRef.current, slideDirection);
        hasAnimated.current = true;
      }
    }, delay * 1000);
  }, [animateOnMount, delay, slideDirection]);

  const handleMouseEnter = () => {
    if (springy && (interactive || clickable) && elementRef.current) {
      animate(elementRef.current, { 
        scale: hoverScale,
        y: -2,
        boxShadow: isDark 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
          : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }, { 
        duration: 0.3, 
        ease: 'back.out(1.7)' 
      });
    }
  };

  const handleMouseLeave = () => {
    if (springy && (interactive || clickable) && elementRef.current) {
      animate(elementRef.current, { 
        scale: 1,
        y: 0,
        boxShadow: isDark 
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }, { 
        duration: 0.3, 
        ease: 'back.out(1.7)' 
      });
    }
  };

  const handleClick = () => {
    if (clickable && springy && elementRef.current) {
      // Tap feedback animation
      animate(elementRef.current, { 
        scale: 0.98,
        duration: 0.1
      }, {
        onComplete: () => {
          if (elementRef.current) {
            animate(elementRef.current, { 
              scale: hoverScale,
              duration: 0.2,
              ease: 'back.out(1.7)'
            });
          }
        }
      });
    }
    
    if (onClick) onClick();
  };

  const baseClasses = `
    transition-all duration-300 ease-out
    rounded-xl overflow-hidden
    ${clickable ? 'cursor-pointer' : ''}
    ${springy ? 'transform-gpu' : ''}
  `;

  const variantClasses = {
    elevated: isDark 
      ? "bg-dark-surface shadow-lg border border-lime/10" 
      : "bg-white shadow-lg border border-gray-100",
    filled: isDark 
      ? "bg-dark-bg border-0" 
      : "bg-gray-50 border-0",
    outlined: isDark 
      ? "bg-dark-surface border-2 border-lime/20 shadow-sm" 
      : "bg-white border-2 border-gray-200 shadow-sm"
  };

  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div 
      ref={elementRef}
      className={cardClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {children}
    </div>
  );
};

// SwiftUI-style list component with staggered animations
interface SwiftUIListProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  animateOnMount?: boolean;
  direction?: 'vertical' | 'horizontal';
}

export const SwiftUIList: React.FC<SwiftUIListProps> = ({
  children,
  className = '',
  staggerDelay = 0.1,
  animateOnMount = true,
  direction = 'vertical'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { staggeredAnimate } = useSwiftUIAnimation();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!animateOnMount || hasAnimated.current || !containerRef.current) return;

    const items = containerRef.current.querySelectorAll('.swift-list-item');
    if (items.length > 0) {
      // Initial state - all items hidden and offset
      items.forEach((item, index) => {
        (item as HTMLElement).style.opacity = '0';
        (item as HTMLElement).style.transform = direction === 'vertical' 
          ? 'translateY(30px)' 
          : 'translateX(30px)';
      });

      // Animate items in with stagger
      setTimeout(() => {
        staggeredAnimate(
          Array.from(items),
          { 
            opacity: 1, 
            x: 0, 
            y: 0 
          },
          {
            stagger: staggerDelay,
            duration: 0.6,
            ease: 'back.out(1.7)'
          }
        );
        hasAnimated.current = true;
      }, 100);
    }
  }, [animateOnMount, staggerDelay, direction, children.length]);

  const containerClasses = `
    ${direction === 'vertical' ? 'space-y-4' : 'flex space-x-4'}
    ${className}
  `;

  return (
    <div ref={containerRef} className={containerClasses}>
      {children.map((child, index) => (
        <div key={index} className="swift-list-item">
          {child}
        </div>
      ))}
    </div>
  );
};

// SwiftUI-style animated text
interface SwiftUITextProps {
  children: React.ReactNode;
  className?: string;
  animateOnMount?: boolean;
  delay?: number;
  typewriter?: boolean;
  typewriterSpeed?: number;
}

export const SwiftUIText: React.FC<SwiftUITextProps> = ({
  children,
  className = '',
  animateOnMount = true,
  delay = 0,
  typewriter = false,
  typewriterSpeed = 50
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [displayText, setDisplayText] = React.useState('');
  const originalText = typeof children === 'string' ? children : '';

  useEffect(() => {
    if (!animateOnMount || !textRef.current) return;

    if (typewriter && originalText) {
      let currentIndex = 0;
      const intervalId = setInterval(() => {
        if (currentIndex <= originalText.length) {
          setDisplayText(originalText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, typewriterSpeed);

      return () => clearInterval(intervalId);
    } else {
      // Simple fade in animation
      setTimeout(() => {
        if (textRef.current) {
          SwiftUITransitions.slideIn(textRef.current, 'up');
        }
      }, delay * 1000);
    }
  }, [animateOnMount, delay, typewriter, originalText, typewriterSpeed]);

  return (
    <span ref={textRef} className={className}>
      {typewriter ? displayText : children}
      {typewriter && displayText !== originalText && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

export default SwiftUICard;