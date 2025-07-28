import { useState, useEffect, useRef } from 'react';

interface UseScrollDirectionOptions {
  threshold?: number;
  initialDirection?: 'up' | 'down';
}

export function useScrollDirection({ 
  threshold = 5, // Reduced from 10 to 5 for faster response
  initialDirection = 'up' 
}: UseScrollDirectionOptions = {}) {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>(initialDirection);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      // Reduced threshold check for faster response
      if (Math.abs(scrollY - lastScrollY.current) < threshold) {
        ticking.current = false;
        return;
      }
      
      const direction = scrollY > lastScrollY.current ? 'down' : 'up';
      
      // Update direction and visibility immediately on any direction change
      if (direction !== scrollDirection) {
        setScrollDirection(direction);
        
        // Show only when scrolling up, hide when scrolling down
        // Always show when at the very top of the page
        if (scrollY <= 30) { // Reduced from 50 to 30
          setIsVisible(true);
        } else {
          setIsVisible(direction === 'up');
        }
      }
      
      lastScrollY.current = scrollY > 0 ? scrollY : 0;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScrollDirection);
        ticking.current = true;
      }
    };

    // Use more frequent scroll detection
    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [scrollDirection, threshold]);

  return { scrollDirection, isVisible };
}