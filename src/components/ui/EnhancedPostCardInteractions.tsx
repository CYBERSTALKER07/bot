import React, { useState, useRef, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { Heart, MessageCircle, Repeat2, Share, Bookmark } from 'lucide-react';
import gsap from 'gsap';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/cva';

interface EnhancedPostCardInteractionsProps {
  postId: string;
  initialLikes: number;
  initialRetweets: number;
  initialReplies: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isRetweeted: boolean;
  onLike: (postId: string) => Promise<void> | void;
  onReply: (postId: string) => void;
  onRetweet: (postId: string) => Promise<void> | void;
  onShare: (postId: string) => void;
  onBookmark: (postId: string) => Promise<void> | void;
}

// Ripple effect component
const RippleEffect: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <motion.div
      className="absolute pointer-events-none rounded-full bg-white/30"
      initial={{ x, y, scale: 0, opacity: 1 }}
      animate={{ x, y, scale: 4, opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        width: 10,
        height: 10,
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

// Particle effect for likes
const FloatingParticle: React.FC<{ delay: number }> = ({ delay }) => {
  const x = Math.random() * 60 - 30;
  const y = Math.random() * 60 - 30;
  const rotation = Math.random() * 360;

  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
      animate={{ x, y, opacity: 0, scale: 0, rotate: rotation }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      style={{
        width: 8,
        height: 8,
        background: '#ef4444',
        borderRadius: '50%',
      }}
    />
  );
};

// Enhanced Action Button with Animations
const EnhancedActionButton: React.FC<{
  icon: React.ReactNode;
  count?: number;
  isActive?: boolean;
  isDark: boolean;
  isMobile: boolean;
  color: 'red' | 'blue' | 'green' | 'yellow';
  onClick: () => void;
  onHover?: (hovering: boolean) => void;
  showParticles?: boolean;
}> = ({
  icon,
  count,
  isActive,
  isDark,
  isMobile,
  color,
  onClick,
  onHover,
  showParticles,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleIdRef = useRef(0);
  const countRef = useRef(count || 0);
  const [displayCount, setDisplayCount] = useState(count);

  // Spring animations for scale and color
  const scale = useSpring(isPressed ? 0.85 : 1, {
    damping: 15,
    stiffness: 300,
    mass: 1,
  });

  useEffect(() => {
    if (count !== countRef.current) {
      // Animate count change
      const diff = (count || 0) - countRef.current;
      if (diff > 0) {
        setDisplayCount(count);
        countRef.current = count || 0;
      }
    }
  }, [count]);

  const colorMap = {
    red: isDark 
      ? 'text-gray-500 hover:text-red-500 hover:bg-red-500/10' 
      : 'text-gray-500 hover:text-red-600 hover:bg-red-100/60',
    blue: isDark 
      ? 'text-gray-500 hover:text-blue-500 hover:bg-blue-500/10' 
      : 'text-gray-500 hover:text-blue-600 hover:bg-blue-100/60',
    green: isDark 
      ? 'text-gray-500 hover:text-green-500 hover:bg-green-500/10' 
      : 'text-gray-500 hover:text-green-600 hover:bg-green-100/60',
    yellow: isDark 
      ? 'text-gray-500 hover:text-orange-500 hover:bg-orange-500/10' 
      : 'text-gray-500 hover:text-orange-600 hover:bg-orange-100/60',
  };

  const activeColorMap = {
    red: isDark ? 'text-red-500 bg-red-500/15' : 'text-red-600 bg-red-100/80',
    blue: isDark ? 'text-blue-500 bg-blue-500/15' : 'text-blue-600 bg-blue-100/80',
    green: isDark ? 'text-green-500 bg-green-500/15' : 'text-green-600 bg-green-100/80',
    yellow: isDark ? 'text-orange-500 bg-orange-500/15' : 'text-orange-600 bg-orange-100/80',
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = rippleIdRef.current++;
      setRipples((prev) => [...prev, { x, y, id }]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    }
  };

  const handleClick = () => {
    setIsPressed(true);
    onClick();

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onHoverStart={() => onHover?.()}
      onHoverEnd={() => onHover?.(false)}
      style={{
        scale,
      }}
      className={cn(
        'relative flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-300 group overflow-hidden',
        isActive ? activeColorMap[color] : colorMap[color],
        isMobile ? 'text-xs' : 'text-sm'
      )}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <RippleEffect key={ripple.id} x={ripple.x} y={ripple.y} />
      ))}

      {/* Icon */}
      <motion.div
        className="relative"
        animate={isPressed ? { scale: 1.2 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {icon}
      </motion.div>

      {/* Count with increment animation */}
      {count !== undefined && count > 0 && (
        <motion.span
          key={displayCount}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xs opacity-75 font-medium"
        >
          {displayCount}
        </motion.span>
      )}

      {/* Particles for like effect */}
      {showParticles &&
        [0, 1, 2, 3].map((i) => (
          <FloatingParticle key={i} delay={i * 0.1} />
        ))}
    </motion.button>
  );
};

// Post Card Container with elevation and hover effects
const PostCardContainer: React.FC<{ children: React.ReactNode; isDark: boolean; isMobile: boolean }> = ({
  children,
  isDark,
  isMobile,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHovered || isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    // Subtle shadow elevation on hover using GSAP
    gsap.to(container, {
      boxShadow: isDark
        ? '0 20px 40px rgba(0, 0, 0, 0.8)'
        : '0 20px 40px rgba(0, 0, 0, 0.1)',
      duration: 0.3,
      ease: 'power2.out',
    });

    return () => {
      gsap.to(container, {
        boxShadow: isDark
          ? '0 1px 3px rgba(0, 0, 0, 0.12)'
          : '0 1px 3px rgba(0, 0, 0, 0.1)',
        duration: 0.3,
        ease: 'power2.out',
      });
    };
  }, [isHovered, isDark, isMobile]);

  return (
    <motion.div
      ref={containerRef}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'relative rounded-2xl transition-all duration-300',
        // isDark ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50/50'
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {children}
    </motion.div>   
  );
};

// Main component
export const EnhancedPostCardInteractions: React.FC<EnhancedPostCardInteractionsProps> = ({
  postId,
  initialLikes,
  initialRetweets,
  initialReplies,
  isLiked,
  isBookmarked,
  isRetweeted,
  onLike,
  onReply,
  onRetweet,
  onShare,
  onBookmark,
}) => {
  const [showLikeParticles, setShowLikeParticles] = useState(false);
  const { isDark } = useTheme();
  const isMobile = window.innerWidth < 1024;

  const handleLikeClick = async () => {
    if (!isLiked) {
      setShowLikeParticles(true);
      setTimeout(() => setShowLikeParticles(false), 800);
    }
    await onLike(postId);
  };

  const handleReplyClick = () => {
    onReply(postId);
  };

  const handleRetweetClick = async () => {
    await onRetweet(postId);
  };

  const handleShareClick = () => {
    onShare(postId);
  };

  const handleBookmarkClick = async () => {
    await onBookmark(postId);
  };

  return (
    <PostCardContainer isDark={isDark} isMobile={isMobile}>
      <div className={cn(
        'flex items-center justify-between gap-2',
        isMobile ? 'max-w-full' : 'max-w-lg',
        isDark ? 'text-gray-400' : 'text-gray-600'
      )}>
        {/* Reply Button */}
        <EnhancedActionButton
          icon={<MessageCircle className={cn(isMobile ? 'h-4 w-4' : 'h-5 w-5')} />}
          count={initialReplies}
          isDark={isDark}
          isMobile={isMobile}
          color="blue"
          onClick={handleReplyClick}
        />

        {/* Retweet Button */}
        <EnhancedActionButton
          icon={<Repeat2 className={cn(isMobile ? 'h-4 w-4' : 'h-5 w-5')} />}
          count={initialRetweets}
          isActive={isRetweeted}
          isDark={isDark}
          isMobile={isMobile}
          color="green"
          onClick={handleRetweetClick}
        />

        {/* Like Button */}
        <div className="relative">
          <EnhancedActionButton
            icon={
              <motion.div
                animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                <Heart
                  className={cn(
                    isMobile ? 'h-4 w-4' : 'h-5 w-5',
                    isLiked ? 'fill-current' : ''
                  )}
                />
              </motion.div>
            }
            count={initialLikes}
            isActive={isLiked}
            isDark={isDark}
            isMobile={isMobile}
            color="red"
            onClick={handleLikeClick}
            showParticles={showLikeParticles}
          />
        </div>

        {/* Share Button */}
        <EnhancedActionButton
          icon={<Share className={cn(isMobile ? 'h-4 w-4' : 'h-5 w-5')} />}
          isDark={isDark}
          isMobile={isMobile}
          color="blue"
          onClick={handleShareClick}
        />

        {/* Bookmark Button */}
        <EnhancedActionButton
          icon={
            <Bookmark
              className={cn(
                isMobile ? 'h-4 w-4' : 'h-5 w-5',
                isBookmarked ? 'fill-current' : ''
              )}
            />
          }
          isActive={isBookmarked}
          isDark={isDark}
          isMobile={isMobile}
          color="yellow"
          onClick={handleBookmarkClick}
        />
      </div>
    </PostCardContainer>
  );
};

export default EnhancedPostCardInteractions;
