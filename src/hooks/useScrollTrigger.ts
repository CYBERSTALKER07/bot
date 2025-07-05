import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseScrollTriggerOptions {
  trigger?: string | Element | null;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  toggleActions?: string;
  onUpdate?: (self: ScrollTrigger) => void;
  onToggle?: (self: ScrollTrigger) => void;
  onEnter?: (self: ScrollTrigger) => void;
  onLeave?: (self: ScrollTrigger) => void;
  onEnterBack?: (self: ScrollTrigger) => void;
  onLeaveBack?: (self: ScrollTrigger) => void;
}

export const useScrollTrigger = (
  elementRef: React.RefObject<HTMLElement>,
  animation: (element: HTMLElement, progress: number) => void,
  options: UseScrollTriggerOptions = {}
) => {
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    
    // Create scroll trigger with dynamic progress tracking
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: options.trigger || element,
      start: options.start || 'top 80%',
      end: options.end || 'bottom 20%',
      scrub: options.scrub !== undefined ? options.scrub : true,
      pin: options.pin || false,
      toggleActions: options.toggleActions || 'play none none reverse',
      
      onUpdate: (self) => {
        // Call animation with current progress (0-1)
        animation(element, self.progress);
        if (options.onUpdate) options.onUpdate(self);
      },
      
      onToggle: (self) => {
        if (options.onToggle) options.onToggle(self);
      },
      
      onEnter: (self) => {
        if (options.onEnter) options.onEnter(self);
      },
      
      onLeave: (self) => {
        if (options.onLeave) options.onLeave(self);
      },
      
      onEnterBack: (self) => {
        if (options.onEnterBack) options.onEnterBack(self);
      },
      
      onLeaveBack: (self) => {
        if (options.onLeaveBack) options.onLeaveBack(self);
      }
    });

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, [elementRef, animation, options]);

  return scrollTriggerRef.current;
};

// Hook for multiple elements with staggered animations
export const useScrollTriggerStagger = (
  containerRef: React.RefObject<HTMLElement>,
  selector: string,
  animation: (elements: Element[], progress: number) => void,
  options: UseScrollTriggerOptions = {}
) => {
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const elements = container.querySelectorAll(selector);
    
    if (elements.length === 0) return;

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: options.trigger || container,
      start: options.start || 'top 80%',
      end: options.end || 'bottom 20%',
      scrub: options.scrub !== undefined ? options.scrub : true,
      pin: options.pin || false,
      toggleActions: options.toggleActions || 'play none none reverse',
      
      onUpdate: (self) => {
        animation(Array.from(elements), self.progress);
        if (options.onUpdate) options.onUpdate(self);
      },
      
      onToggle: (self) => {
        if (options.onToggle) options.onToggle(self);
      },
      
      onEnter: (self) => {
        if (options.onEnter) options.onEnter(self);
      },
      
      onLeave: (self) => {
        if (options.onLeave) options.onLeave(self);
      },
      
      onEnterBack: (self) => {
        if (options.onEnterBack) options.onEnterBack(self);
      },
      
      onLeaveBack: (self) => {
        if (options.onLeaveBack) options.onLeaveBack(self);
      }
    });

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, [containerRef, selector, animation, options]);

  return scrollTriggerRef.current;
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