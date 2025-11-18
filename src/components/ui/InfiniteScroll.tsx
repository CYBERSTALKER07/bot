import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { cn } from '../../lib/cva';

interface InfiniteScrollProps {
  children: React.ReactNode;
  onLoadMore?: () => Promise<void>;
  hasMore?: boolean;
  isDark?: boolean;
  isMobile?: boolean;
  isLoading?: boolean;
  threshold?: number;
  enablePullToRefresh?: boolean;
  onRefresh?: () => Promise<void>;
}

/**
 * Infinite Scroll Component with Pull-to-Refresh
 * Features:
 * - Spring-based scroll detection
 * - Pull-to-refresh animation
 * - Smooth transitions
 * - Mobile-optimized
 * - Haptic feedback support
 */
export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  onLoadMore,
  hasMore = true,
  isDark = false,
  isMobile = false,
  isLoading = false,
  threshold = 0.8,
  enablePullToRefresh = true,
  onRefresh,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartRef = useRef<number>(0);
  const scrollPositionRef = useRef<number>(0);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && hasMore && !isLoading && onLoadMore) {
            onLoadMore();
          }
        });
      },
      { threshold }
    );

    const sentinel = document.createElement('div');
    sentinel.className = 'infinite-scroll-sentinel';
    containerRef.current.appendChild(sentinel);

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, [hasMore, isLoading, onLoadMore, threshold]);

  // Pull-to-refresh gesture
  useEffect(() => {
    if (!enablePullToRefresh || !isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientY;
      scrollPositionRef.current = containerRef.current?.scrollTop ?? 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const scrollTop = containerRef.current?.scrollTop ?? 0;

      // Only enable pull-to-refresh if at the top of the scroll
      if (scrollTop === 0 && currentY > touchStartRef.current) {
        e.preventDefault();
        const distance = currentY - touchStartRef.current;
        setPullDistance(distance);
        setIsPulling(distance > 80); // Threshold for triggering refresh

        // Haptic feedback
        if (distance > 80 && distance < 85 && navigator.vibrate) {
          navigator.vibrate(20);
        }
      }
    };

    const handleTouchEnd = async () => {
      if (isPulling && onRefresh) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }
      setPullDistance(0);
      setIsPulling(false);
    };

    const element = containerRef.current;
    element?.addEventListener('touchstart', handleTouchStart);
    element?.addEventListener('touchmove', handleTouchMove, { passive: false });
    element?.addEventListener('touchend', handleTouchEnd);

    return () => {
      element?.removeEventListener('touchstart', handleTouchStart);
      element?.removeEventListener('touchmove', handleTouchMove);
      element?.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enablePullToRefresh, isMobile, isPulling, onRefresh]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'relative overflow-y-auto overflow-x-hidden',
        'transition-colors duration-200'
      )}
    >
      {/* Pull-to-Refresh Header */}
      <AnimatePresence>
        {enablePullToRefresh && (pullDistance > 0 || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              'absolute top-0 left-0 right-0 h-20 flex items-center justify-center',
              'z-50 pointer-events-none'
            )}
          >
            <motion.div
              animate={{
                rotate: isRefreshing ? 360 : (pullDistance / 80) * 180,
                scale: Math.max(0.8, 1 + pullDistance / 200),
              }}
              transition={{
                rotate: { duration: isRefreshing ? 1 : 0 },
                type: 'spring',
                stiffness: 100,
                damping: 15,
              }}
              className={cn(
                'p-3 rounded-full',
                isDark ? 'bg-gray-800' : 'bg-gray-100'
              )}
            >
              <RefreshCw
                className={cn(
                  'w-6 h-6 transition-colors duration-200',
                  isPulling || isRefreshing
                    ? isDark
                      ? 'text-info-400'
                      : 'text-info-600'
                    : isDark
                      ? 'text-gray-400'
                      : 'text-gray-600'
                )}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        style={{
          y: enablePullToRefresh ? pullDistance * 0.5 : 0,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        {children}
      </motion.div>

      {/* Loading Indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className={cn(
                'w-8 h-8 border-4 border-transparent rounded-full',
                isDark
                  ? 'border-t-info-500 border-r-info-500'
                  : 'border-t-info-600 border-r-info-600'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* End of List */}
      <AnimatePresence>
        {!hasMore && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'text-center py-8',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}
          >
            <p className="text-sm font-medium">No more posts</p>
            <p className="text-xs opacity-60 mt-1">You've reached the end</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InfiniteScroll;
