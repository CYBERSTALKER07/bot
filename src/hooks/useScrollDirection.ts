import { useState, useEffect, useRef, useCallback } from 'react';

interface UseScrollDirectionOptions {
  threshold?: number;
  initialDirection?: 'up' | 'down';
}

export function useScrollDirection({ 
  threshold = 5,
  initialDirection = 'up' 
}: UseScrollDirectionOptions = {}) {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>(initialDirection);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const isInitialized = useRef(false);

  // Initialize scroll position immediately
  useEffect(() => {
    lastScrollY.current = window.pageYOffset || document.documentElement.scrollTop;
    isInitialized.current = true;
  }, []);

  const updateScrollDirection = useCallback(() => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    // For the very first scroll, don't require threshold
    const effectiveThreshold = isInitialized.current ? threshold : 0;
    
    if (Math.abs(scrollY - lastScrollY.current) < effectiveThreshold) {
      ticking.current = false;
      return;
    }
    
    const direction = scrollY > lastScrollY.current ? 'down' : 'up';
    
    // Always update on direction change, especially for the first time
    if (direction !== scrollDirection || !isInitialized.current) {
      setScrollDirection(direction);
      
      // Show only when scrolling up, hide when scrolling down
      // Always show when at the very top of the page
      if (scrollY <= 30) {
        setIsVisible(true);
      } else {
        setIsVisible(direction === 'up');
      }
      
      isInitialized.current = true;
    }
    
    lastScrollY.current = scrollY > 0 ? scrollY : 0;
    ticking.current = false;
  }, [scrollDirection, threshold]);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        // Use immediate execution for the first few scrolls, then switch to RAF
        if (!isInitialized.current) {
          updateScrollDirection();
        } else {
          requestAnimationFrame(updateScrollDirection);
        }
        ticking.current = true;
      }
    };

    // Set initial state immediately
    const initialScrollY = window.pageYOffset || document.documentElement.scrollTop;
    lastScrollY.current = initialScrollY;
    
    // Start listening immediately
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Also listen for touch events on mobile for immediate response
    window.addEventListener('touchmove', onScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchmove', onScroll);
    };
  }, [updateScrollDirection]);

  return { scrollDirection, isVisible };
}