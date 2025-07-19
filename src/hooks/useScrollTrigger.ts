import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Performance-optimized scroll trigger hook
export const useScrollTrigger = (
  targetRef: React.RefObject<HTMLElement>,
  callback: (element: HTMLElement, progress: number) => void,
  options: {
    start?: string;
    end?: string;
    scrub?: number | boolean;
    once?: boolean;
    threshold?: number;
  } = {}
) => {
  const {
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = false,
    once = false,
    threshold = 0.1
  } = options;

  const isVisible = useRef(false);
  const animationId = useRef<number>(0);

  useEffect(() => {
    if (!targetRef.current) return;

    const element = targetRef.current;
    let scrollTrigger: ScrollTrigger | null = null;

    // Use Intersection Observer for better performance
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
        
        if (entry.isIntersecting && !scrollTrigger) {
          // Create scroll trigger only when element is visible
          scrollTrigger = ScrollTrigger.create({
            trigger: element,
            start,
            end,
            scrub,
            once,
            onUpdate: (self) => {
              if (isVisible.current) {
                callback(element, self.progress);
              }
            },
            onToggle: once ? (self) => {
              if (self.isActive) {
                callback(element, 1);
              }
            } : undefined
          });
        } else if (!entry.isIntersecting && scrollTrigger) {
          // Clean up scroll trigger when not visible
          scrollTrigger.kill();
          scrollTrigger = null;
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [targetRef, callback, start, end, scrub, once, threshold]);
};

// Optimized stagger animation hook
export const useScrollTriggerStagger = (
  containerRef: React.RefObject<HTMLElement>,
  selector: string,
  callback: (elements: Element[], progress: number) => void,
  options: {
    start?: string;
    end?: string;
    scrub?: number | boolean;
    stagger?: number;
    threshold?: number;
  } = {}
) => {
  const {
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = false,
    stagger = 0.1,
    threshold = 0.1
  } = options;

  const cachedElements = useRef<Element[]>([]);
  const isVisible = useRef(false);

  // Memoize elements selection for better performance
  const getElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    if (cachedElements.current.length === 0) {
      cachedElements.current = gsap.utils.toArray(containerRef.current.querySelectorAll(selector));
    }
    
    return cachedElements.current;
  }, [containerRef, selector]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let scrollTrigger: ScrollTrigger | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
        
        if (entry.isIntersecting && !scrollTrigger) {
          const elements = getElements();
          
          if (elements.length > 0) {
            scrollTrigger = ScrollTrigger.create({
              trigger: container,
              start,
              end,
              scrub,
              onUpdate: (self) => {
                if (isVisible.current) {
                  callback(elements, self.progress);
                }
              }
            });
          }
        } else if (!entry.isIntersecting && scrollTrigger) {
          scrollTrigger.kill();
          scrollTrigger = null;
        }
      },
      { threshold }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
      // Clear cached elements on unmount
      cachedElements.current = [];
    };
  }, [containerRef, callback, getElements, start, end, scrub, threshold]);
};

// Performance monitoring hook
export const useAnimationPerformance = () => {
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  const measureFPS = useCallback(() => {
    const now = performance.now();
    frameCount.current++;

    if (now - lastTime.current >= 1000) {
      setFps(frameCount.current);
      frameCount.current = 0;
      lastTime.current = now;
    }

    requestAnimationFrame(measureFPS);
  }, []);

  useEffect(() => {
    const rafId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(rafId);
  }, [measureFPS]);

  // Reduce animation quality if performance is poor
  const shouldReduceAnimations = useMemo(() => fps < 30, [fps]);

  return { fps, shouldReduceAnimations };
};

// Debounced resize hook for responsive animations
export const useDebouncedResize = (callback: () => void, delay = 250) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(callback, delay);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [callback, delay]);
};

// Reduced motion preference hook
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Common animation functions for reuse
export const scrollAnimations = {
  fadeInUp: (element: HTMLElement, progress: number) => {
    gsap.set(element, {
      opacity: progress,
      y: (1 - progress) * 50,
      ease: 'none'
    });
  },
  
  fadeInScale: (element: HTMLElement, progress: number) => {
    gsap.set(element, {
      opacity: progress,
      scale: 0.8 + (progress * 0.2),
      ease: 'none'
    });
  },
  
  slideInLeft: (element: HTMLElement, progress: number) => {
    gsap.set(element, {
      opacity: progress,
      x: (1 - progress) * -100,
      ease: 'none'
    });
  },
  
  slideInRight: (element: HTMLElement, progress: number) => {
    gsap.set(element, {
      opacity: progress,
      x: (1 - progress) * 100,
      ease: 'none'
    });
  },
  
  rotateIn: (element: HTMLElement, progress: number) => {
    gsap.set(element, {
      opacity: progress,
      rotation: (1 - progress) * 180,
      scale: 0.5 + (progress * 0.5),
      ease: 'none'
    });
  },
  
  parallaxY: (element: HTMLElement, progress: number) => {
    gsap.set(element, {
      y: progress * 100,
      ease: 'none'
    });
  },
  
  staggeredFadeIn: (elements: Element[], progress: number) => {
    elements.forEach((element, index) => {
      const delay = index * 0.1;
      const elementProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      
      gsap.set(element, {
        opacity: elementProgress,
        y: (1 - elementProgress) * 30,
        ease: 'none'
      });
    });
  }
};