import React, { useState, useRef, useEffect } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, MessageSquare, Repeat2 } from 'lucide-react';
import gsap from 'gsap';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/cva';

interface EnhancedPostCardInteractionsProps {
  postId: string;
  initialLikes: number;
  initialRetweets: number;
  initialReplies: number;
  isLiked: boolean;
  isRetweeted: boolean;
  onLike: (postId: string) => Promise<void> | void;
  onComment: (postId: string) => void;
  onReply: (postId: string) => void;
  onRetweet: (postId: string) => Promise<void> | void;
}

// 1. Enhanced Ripple with sharper fade-out
const RippleEffect: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <motion.div
      className="absolute pointer-events-none rounded-full bg-current opacity-20" // Use current text color for ripple
      initial={{ x, y, scale: 0, opacity: 0.3 }}
      animate={{ x, y, scale: 3, opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        width: 20, // Slightly larger start
        height: 20,
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

// 2. Physics-based Particles
const FloatingParticle: React.FC<{ delay: number; color: string }> = ({ delay, color }) => {
  // Random dispersion
  const x = (Math.random() - 0.5) * 60;
  const y = -Math.random() * 50 - 20; // Move mostly up
  const scale = Math.random() * 0.5 + 0.5;

  return (
    <motion.div
      className="absolute pointer-events-none rounded-full"
      initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
      animate={{ x, y, opacity: 0, scale: scale }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] }} // Custom bezier
      style={{
        width: 6,
        height: 6,
        backgroundColor: color,
        top: '50%',
        left: '50%',
      }}
    />
  );
};

// Enhanced Action Button
const EnhancedActionButton: React.FC<{
  icon: React.ReactNode;
  count?: number;
  isActive?: boolean;
  isDark: boolean;
  isMobile: boolean;
  type: 'like' | 'retweet' | 'reply' | 'share' | 'bookmark';
  onClick: () => void;
  showParticles?: boolean;
}> = ({
  icon,
  count,
  isActive,
  isDark,
  isMobile,
  type,
  onClick,
  showParticles,
}) => {
    const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const rippleIdRef = useRef(0);
    const [displayCount, setDisplayCount] = useState(count);

    // Spring animation for "press" feel
    const scale = useSpring(1, { stiffness: 400, damping: 17 });

    useEffect(() => {
      if (count !== displayCount) {
        setDisplayCount(count);
      }
    }, [count, displayCount]);

    // Color Logic aligned with Tailwind Config
    const colorStyles = {
      like: {
        active: isDark ? 'text-red-500' : 'text-red-600',
        hover: isDark ? 'hover:text-red-400 hover:bg-red-500/10' : 'hover:text-red-600 hover:bg-red-50',
        particle: '#ef4444'
      },
      retweet: {
        active: isDark ? 'text-green-500' : 'text-green-600',
        hover: isDark ? 'hover:text-green-400 hover:bg-green-500/10' : 'hover:text-green-600 hover:bg-green-50',
        particle: '#22c55e'
      },
      reply: {
        active: isDark ? 'text-info-500' : 'text-info-600',
        hover: isDark ? 'hover:text-info-400 hover:bg-info-500/10' : 'hover:text-info-600 hover:bg-info-50',
        particle: '#3b82f6'
      },
      share: {
        active: isDark ? 'text-blue-500' : 'text-blue-600',
        hover: isDark ? 'hover:text-blue-400 hover:bg-blue-500/10' : 'hover:text-blue-600 hover:bg-blue-50',
        particle: '#3b82f6'
      },
      bookmark: {
        active: isDark ? 'text-yellow-500' : 'text-yellow-600',
        hover: isDark ? 'hover:text-yellow-400 hover:bg-yellow-500/10' : 'hover:text-yellow-600 hover:bg-yellow-50',
        particle: '#eab308'
      }
    };

    const currentStyle = colorStyles[type];

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = rippleIdRef.current++;
        setRipples((prev) => [...prev, { x, y, id }]);

        scale.set(0.9); // Press in
        setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
      }
    };

    const handleMouseUp = () => {
      scale.set(1); // Release
    }

    const handleClick = () => {
      onClick();
      // Haptic feedback
      if (navigator.vibrate) navigator.vibrate(15);
    };

    return (
      <motion.button
        ref={buttonRef}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ scale }}
        className={cn(
          'relative flex items-center gap-1.5 p-2 -ml-2 rounded-full transition-colors duration-200 group overflow-hidden select-none', // Negative margin for alignment
          isActive ? currentStyle.active : (isDark ? 'text-gray-500' : 'text-gray-500'),
          currentStyle.hover,
          isMobile ? 'text-xs' : 'text-sm'
        )}
      >
        {/* Ripples */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <RippleEffect key={ripple.id} x={ripple.x} y={ripple.y} />
          ))}
        </AnimatePresence>

        {/* Icon Container */}
        <div className="relative z-10">
          {icon}

          {/* Particles */}
          {showParticles && isActive &&
            [...Array(6)].map((_, i) => (
              <FloatingParticle key={i} delay={i * 0.05} color={currentStyle.particle} />
            ))
          }
        </div>

        {/* Count Animation */}
        <AnimatePresence mode='wait'>
          {count !== undefined && count > 0 && (
            <motion.span
              key={displayCount} // Trigger animation on change
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "font-medium tabular-nums leading-none",
                isActive ? "font-semibold" : "opacity-80"
              )}
            >
              {displayCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    );
  };

export const EnhancedPostCardInteractions: React.FC<EnhancedPostCardInteractionsProps> = ({
  postId,
  initialLikes,
  initialRetweets,
  initialReplies,
  isLiked,
  isRetweeted,
  onLike,
  onComment,
  onReply,
  onRetweet
}) => {
  const [showLikeParticles, setShowLikeParticles] = useState(false);
  const { isDark } = useTheme();
  const isMobile = window.innerWidth < 1024;

  const handleLikeClick = async () => {
    if (!isLiked) {
      setShowLikeParticles(true);
      setTimeout(() => setShowLikeParticles(false), 1000); // Reset
    }
    await onLike(postId);
  };

  return (
    <div className={cn(
      "flex items-center justify-between w-full mt-2",
      isMobile ? "max-w-full px-1" : "max-w-[90%]" // Adjusted width
    )}>
      {/* Reply Group */}
      <EnhancedActionButton
        type="reply"
        icon={<MessageCircle className={cn(isMobile ? 'w-[18px] h-[18px]' : 'w-5 h-5')} />}
        count={initialReplies}
        isDark={isDark}
        isMobile={isMobile}
        onClick={() => onComment(postId)}
      />

      {/* Retweet Group */}
      <EnhancedActionButton
        type="retweet"
        icon={<Repeat2 className={cn(isMobile ? 'w-[18px] h-[18px]' : 'w-5 h-5')} />}
        count={initialRetweets}
        isActive={isRetweeted}
        isDark={isDark}
        isMobile={isMobile}
        onClick={() => onRetweet(postId)}
      />

      {/* Like Group */}
      <EnhancedActionButton
        type="like"
        icon={
          <Heart
            className={cn(
              isMobile ? 'w-[18px] h-[18px]' : 'w-5 h-5',
              isLiked && "fill-current"
            )}
          />
        }
        count={initialLikes}
        isActive={isLiked}
        isDark={isDark}
        isMobile={isMobile}
        onClick={handleLikeClick}
        showParticles={showLikeParticles}
      />

      {/* Reply Action Group */}
      <EnhancedActionButton
        type="reply"
        icon={<MessageSquare className={cn(isMobile ? 'w-[18px] h-[18px]' : 'w-5 h-5')} />}
        isDark={isDark}
        isMobile={isMobile}
        onClick={() => onReply(postId)}
      />
    </div>
  );
};

export default EnhancedPostCardInteractions;  