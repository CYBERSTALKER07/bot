import { useEffect, useRef, useCallback, useState } from 'react';

interface InfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Hook for infinite scroll functionality
 * Calls the callback when user scrolls near the bottom of the page
 */
export const useInfiniteScroll = (
  callback: () => void,
  options: InfiniteScrollOptions = {}
) => {
  const { threshold = 0.1, rootMargin = '100px' } = options;
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          setIsLoading(true);
          callback();
          // Reset loading state after callback
          setTimeout(() => setIsLoading(false), 500);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [callback, threshold, rootMargin, isLoading]);

  return { sentinelRef, isLoading };
};

/**
 * Hook for pull-to-refresh functionality
 */
export const usePullToRefresh = (onRefresh: () => Promise<void>, enabled = true) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled || isRefreshing) return;
      startYRef.current = e.touches[0].clientY;
    },
    [enabled, isRefreshing]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled || isRefreshing) return;

      const container = containerRef.current;
      if (!container) return;

      // Only trigger pull-to-refresh at the top of the scroll
      if (container.scrollTop !== 0) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startYRef.current;

      if (distance > 0) {
        e.preventDefault();
        setPullDistance(distance);
        setIsPulling(distance > 60);
      }
    },
    [enabled, isRefreshing]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!enabled) return;

    if (pullDistance > 60) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Pull-to-refresh error:', error);
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
    setIsPulling(false);
  }, [pullDistance, enabled, onRefresh]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const touchStartHandler = handleTouchStart as EventListener;
    const touchMoveHandler = handleTouchMove as EventListener;
    const touchEndHandler = handleTouchEnd as EventListener;

    container.addEventListener('touchstart', touchStartHandler, false);
    container.addEventListener('touchmove', touchMoveHandler, { passive: false });
    container.addEventListener('touchend', touchEndHandler, false);

    return () => {
      container.removeEventListener('touchstart', touchStartHandler);
      container.removeEventListener('touchmove', touchMoveHandler);
      container.removeEventListener('touchend', touchEndHandler);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    containerRef,
    isPulling,
    pullDistance,
    isRefreshing,
  };
};

/**
 * Hook for virtualized list rendering
 * Improves performance by only rendering visible items
 */
export const useVirtualizedList = <T,>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  bufferSize = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const visibleRange = {
    start: Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize),
    end: Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + bufferSize
    ),
  };

  const visibleItems = items.slice(visibleRange.start, visibleRange.end);
  const offsetY = visibleRange.start * itemHeight;

  return {
    visibleItems,
    offsetY,
    visibleRange,
    onScroll: (newScrollTop: number) => setScrollTop(newScrollTop),
  };
};

/**
 * Hook for detecting scroll direction
 */
export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const prevScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (Math.abs(currentScrollY - prevScrollYRef.current) < 10) {
        // Ignore small scrolls
        return;
      }

      setScrollDirection(currentScrollY > prevScrollYRef.current ? 'down' : 'up');
      prevScrollYRef.current = currentScrollY;
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
      ticking = false;
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return scrollDirection;
};

export default useInfiniteScroll;
