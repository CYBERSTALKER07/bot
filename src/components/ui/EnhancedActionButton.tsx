import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cva';

interface EnhancedActionButtonProps {
  icon: LucideIcon;
  label?: string;
  count?: number;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  isDark?: boolean;
  isMobile?: boolean;
  variant?: 'like' | 'retweet' | 'reply' | 'share' | 'bookmark';
  onAnimationComplete?: () => void;
  showCount?: boolean;
}

interface ParticleProps {
  id: number;
  x: number;
  y: number;
  emoji?: string;
}

/**
 * Enhanced Action Button with X-style micro-animations
 * Features:
 * - Bouncy scale animations on click
 * - Color transitions with spring physics
 * - Count increment animations
 * - Success micro-feedback (heart pop, retweet spin)
 * - Particle effects for likes
 */
export const EnhancedActionButton: React.FC<EnhancedActionButtonProps> = ({
  icon: Icon,
  label,
  count = 0,
  isActive = false,
  onClick,
  isDark = false,
  isMobile = false,
  variant = 'like',
  onAnimationComplete,
  showCount = true,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  const [displayCount, setDisplayCount] = useState(count);
  const [countChanged, setCountChanged] = useState(false);
  const particleIdRef = React.useRef(0);

  // Update display count with animation
  useEffect(() => {
    if (count !== displayCount) {
      setCountChanged(true);
      setDisplayCount(count);
      setTimeout(() => setCountChanged(false), 600);
    }
  }, [count, displayCount]);

  const getVariantColors = () => {
    switch (variant) {
      case 'like':
        return {
          default: isDark ? 'text-gray-400 hover:text-red-500' : 'text-gray-600 hover:text-red-600',
          active: 'text-red-500 fill-current',
          hoverBg: isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-500/10',
        };
      case 'retweet':
        return {
          default: isDark ? 'text-gray-400 hover:text-green-500' : 'text-gray-600 hover:text-green-600',
          active: 'text-green-500',
          hoverBg: isDark ? 'hover:bg-green-500/10' : 'hover:bg-green-500/10',
        };
      case 'share':
        return {
          default: isDark ? 'text-gray-400 hover:text-blue-500' : 'text-gray-600 hover:text-blue-600',
          active: 'text-blue-500',
          hoverBg: isDark ? 'hover:bg-blue-500/10' : 'hover:bg-blue-500/10',
        };
      case 'bookmark':
        return {
          default: isDark ? 'text-gray-400 hover:text-yellow-500' : 'text-gray-600 hover:text-yellow-600',
          active: 'text-yellow-500 fill-current',
          hoverBg: isDark ? 'hover:bg-yellow-500/10' : 'hover:bg-yellow-500/10',
        };
      case 'reply':
      default:
        return {
          default: isDark ? 'text-gray-400 hover:text-blue-500' : 'text-gray-600 hover:text-blue-600',
          active: 'text-blue-500',
          hoverBg: isDark ? 'hover:bg-blue-500/10' : 'hover:bg-blue-500/10',
        };
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    setIsPressed(true);
    
    // Create particle effects for likes
    if (variant === 'like' && isActive) {
      createParticles(e);
    }
    
    // Trigger haptic feedback on mobile
    if (navigator.vibrate && isMobile) {
      navigator.vibrate(20);
    }

    onClick?.(e);
    onAnimationComplete?.();

    setTimeout(() => setIsPressed(false), 300);
  };

  const createParticles = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = rect.width / 2;
    const y = rect.height / 2;

    const newParticles: ParticleProps[] = [];
    for (let i = 0; i < 5; i++) {
      newParticles.push({
        id: particleIdRef.current++,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        emoji: '❤️',
      });
    }

    setParticles(prev => [...prev, ...newParticles]);

    // Clear particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 800);
  };

  const colors = getVariantColors();

  return (
    <motion.button
      onClick={handleClick}
      whileHover={!isMobile ? { scale: 1.1 } : undefined}
      whileTap={isMobile ? { scale: 0.85 } : undefined}
      className={cn(
        'relative flex items-center gap-2 px-3 py-2 rounded-full',
        'transition-all duration-200 outline-none',
        'group',
        colors.hoverBg,
        isActive ? colors.active : colors.default,
        isMobile ? 'p-1' : 'p-2'
      )}
      aria-pressed={isActive}
    >
      {/* Particle Container */}
      <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
        <AnimatePresence>
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              initial={{ x: particle.x, y: particle.y, scale: 1, opacity: 1 }}
              animate={{
                x: particle.x + (Math.random() - 0.5) * 80,
                y: particle.y - 60 - Math.random() * 40,
                scale: 0,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute text-xl"
              style={{ pointerEvents: 'none' }}
            >
              {particle.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Icon */}
      <motion.div
        animate={isPressed ? { scale: 0.8, rotate: variant === 'retweet' ? 180 : 0 } : { scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 12,
        }}
        className={cn(
          'flex items-center justify-center',
          isMobile ? 'w-4 h-4' : 'w-5 h-5'
        )}
      >
        <Icon className={cn(
          isMobile ? 'h-4 w-4' : 'h-5 w-5',
          'transition-all duration-200'
        )} />
      </motion.div>

      {/* Count */}
      {showCount && count > 0 && (
        <motion.span
          key={displayCount}
          initial={countChanged ? { y: -10, opacity: 0 } : { y: 0, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={cn(
            isMobile ? 'text-xs' : 'text-sm',
            'font-medium'
          )}
        >
          {displayCount}
        </motion.span>
      )}

      {/* Label (hidden on mobile) */}
      {label && !isMobile && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm font-medium hidden group-hover:inline"
        >
          {label}
        </motion.span>
      )}

      {/* Ripple on press */}
      {isPressed && !isMobile && (
        <motion.div
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className={cn(
            'absolute inset-0 rounded-full',
            isDark ? 'bg-white/20' : 'bg-black/10'
          )}
        />
      )}
    </motion.button>
  );
};

export default EnhancedActionButton;
