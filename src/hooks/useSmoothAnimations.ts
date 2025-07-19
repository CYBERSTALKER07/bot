import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  SmoothAnimations, 
  entranceAnimations, 
  scrollAnimations, 
  interactionAnimations,
  animationUtils 
} from '../lib/smooth-animations';

// Enhanced smooth animation hook
export const useSmoothAnimations = (options: {
  autoInit?: boolean;
  reduceMotion?: boolean;
} = {}) => {
  const containerRef = useRef<HTMLElement>(null);
  const { autoInit = true, reduceMotion = false } = options;

  // Check for reduced motion preference
  const prefersReducedMotion = useCallback(() => {
    return reduceMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, [reduceMotion]);

  // Initialize smooth animations on mount
  useEffect(() => {
    if (!autoInit || !containerRef.current || prefersReducedMotion()) return;

    const container = containerRef.current;
    animationUtils.initSmoothAnimations(container);

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger && container.contains(trigger.trigger as Node)) {
          trigger.kill();
        }
      });
    };
  }, [autoInit, prefersReducedMotion]);

  // Enhanced entrance animations
  const animate = useCallback({
    // Ultra-smooth fade in from bottom
    fadeInUp: (selector: string, options = {}) => {
      if (prefersReducedMotion()) return;
      const elements = containerRef.current?.querySelectorAll(selector);
      if (elements) return entranceAnimations.fadeInUp(Array.from(elements), options);
    },

    // Smooth scale entrance
    scaleIn: (selector: string, options = {}) => {
      if (prefersReducedMotion()) return;
      const elements = containerRef.current?.querySelectorAll(selector);
      if (elements) return entranceAnimations.scaleIn(Array.from(elements), options);
    },

    // Slide from left with momentum
    slideInLeft: (selector: string, options = {}) => {
      if (prefersReducedMotion()) return;
      const elements = containerRef.current?.querySelectorAll(selector);
      if (elements) return entranceAnimations.slideInLeft(Array.from(elements), options);
    },

    // Elastic bounce entrance
    bounceIn: (selector: string, options = {}) => {
      if (prefersReducedMotion()) return;
      const elements = containerRef.current?.querySelectorAll(selector);
      if (elements) return entranceAnimations.bounceIn(Array.from(elements), options);
    },

    // Custom timeline builder
    timeline: (callback: (tl: gsap.core.Timeline) => void) => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline();
      callback(tl);
      return tl;
    },

    // Smooth sequence animation
    sequence: (animations: Array<{ selector: string; type: string; options?: any; delay?: number }>) => {
      if (prefersReducedMotion()) return;
      
      const tl = gsap.timeline();
      let currentDelay = 0;

      animations.forEach(({ selector, type, options = {}, delay = 0.1 }) => {
        const elements = containerRef.current?.querySelectorAll(selector);
        if (!elements) return;

        const animationOptions = {
          ...options,
          delay: currentDelay
        };

        switch (type) {
          case 'fadeIn':
            tl.add(() => entranceAnimations.fadeInUp(Array.from(elements), animationOptions));
            break;
          case 'scaleIn':
            tl.add(() => entranceAnimations.scaleIn(Array.from(elements), animationOptions));
            break;
          case 'slideIn':
            tl.add(() => entranceAnimations.slideInLeft(Array.from(elements), animationOptions));
            break;
          case 'bounceIn':
            tl.add(() => entranceAnimations.bounceIn(Array.from(elements), animationOptions));
            break;
        }

        currentDelay += delay;
      });

      return tl;
    }
  }, [prefersReducedMotion]);

  // Scroll-triggered animations
  const scrollAnimate = useCallback({
    // Reveal elements on scroll with ultra-smooth easing
    revealOnScroll: (selector: string, options = {}) => {
      if (prefersReducedMotion()) return;
      const elements = containerRef.current?.querySelectorAll(selector);
      if (!elements) return;

      return Array.from(elements).map(element => 
        scrollAnimations.revealOnScroll(element, options)
      );
    },

    // Smooth parallax effect
    parallax: (selector: string, options = {}) => {
      if (prefersReducedMotion()) return;
      const elements = containerRef.current?.querySelectorAll(selector);
      if (!elements) return;

      return Array.from(elements).map(element => 
        scrollAnimations.smoothParallax(element, options)
      );
    },

    // Smooth counter animation
    counter: (selector: string, options = {}) => {
      if (prefersReducedMotion()) return;
      const elements = containerRef.current?.querySelectorAll(selector);
      if (!elements) return;

      return Array.from(elements).map(element => 
        scrollAnimations.smoothCounter(element, options)
      );
    },

    // Advanced stagger reveal
    staggerReveal: (selector: string, options = {}) => {
      if (prefersReducedMotion()) return;
      const elements = containerRef.current?.querySelectorAll(selector);
      if (!elements) return;

      ScrollTrigger.batch(Array.from(elements), {
        onEnter: (batch) => {
          entranceAnimations.fadeInUp(batch, {
            stagger: SmoothAnimations.stagger.normal,
            duration: SmoothAnimations.duration.smooth,
            ease: SmoothAnimations.easing.smooth,
            ...options
          });
        },
        start: 'top 85%'
      });
    }
  }, [prefersReducedMotion]);

  // Interactive animations
  const interactive = useCallback({
    // Add smooth hover effect to buttons
    addButtonHover: (selector: string) => {
      if (prefersReducedMotion()) return;
      const buttons = containerRef.current?.querySelectorAll(selector);
      if (!buttons) return;

      buttons.forEach(button => interactionAnimations.buttonHover(button));
    },

    // Add smooth hover effect to cards
    addCardHover: (selector: string, options = {}) => {
      if (prefersReducedMotion()) return;
      const cards = containerRef.current?.querySelectorAll(selector);
      if (!cards) return;

      cards.forEach(card => interactionAnimations.cardHover(card, options));
    },

    // Add click effect
    addClickEffect: (selector: string) => {
      if (prefersReducedMotion()) return;
      const elements = containerRef.current?.querySelectorAll(selector);
      if (!elements) return;

      elements.forEach(element => interactionAnimations.clickEffect(element));
    }
  }, [prefersReducedMotion]);

  // Utility functions
  const utils = useCallback({
    // Refresh all ScrollTriggers
    refresh: () => ScrollTrigger.refresh(),

    // Kill specific animations
    kill: (selector?: string) => {
      if (selector && containerRef.current) {
        const elements = containerRef.current.querySelectorAll(selector);
        elements.forEach(element => gsap.killTweensOf(element));
      } else {
        animationUtils.killAll();
      }
    },

    // Set smooth defaults for GSAP
    setSmoothDefaults: () => {
      gsap.defaults({
        duration: SmoothAnimations.duration.smooth,
        ease: SmoothAnimations.easing.smooth
      });
    },

    // Create smooth timeline
    createTimeline: (options = {}) => {
      return gsap.timeline({
        defaults: {
          duration: SmoothAnimations.duration.smooth,
          ease: SmoothAnimations.easing.smooth
        },
        ...options
      });
    }
  }, []);

  return {
    containerRef,
    animate,
    scrollAnimate,
    interactive,
    utils,
    SmoothAnimations
  };
};

// Enhanced scroll trigger hook with smooth animations
export const useSmoothScrollTrigger = (
  targetRef: React.RefObject<HTMLElement>,
  callback: (element: HTMLElement, progress: number) => void,
  options: {
    start?: string;
    end?: string;
    scrub?: number | boolean;
    smooth?: boolean;
    once?: boolean;
  } = {}
) => {
  const {
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = false,
    smooth = true,
    once = false
  } = options;

  useEffect(() => {
    if (!targetRef.current) return;

    const element = targetRef.current;
    let scrollTrigger: ScrollTrigger;

    if (smooth) {
      // Enhanced smooth scroll trigger
      scrollTrigger = ScrollTrigger.create({
        trigger: element,
        start,
        end,
        scrub: scrub || 1.5, // Smooth scrub value
        once,
        onUpdate: (self) => {
          // Apply smooth easing to progress
          const smoothProgress = gsap.parseEase(SmoothAnimations.easing.ultraSmooth)(self.progress);
          callback(element, smoothProgress);
        }
      });
    } else {
      // Standard scroll trigger
      scrollTrigger = ScrollTrigger.create({
        trigger: element,
        start,
        end,
        scrub,
        once,
        onUpdate: (self) => callback(element, self.progress)
      });
    }

    return () => scrollTrigger.kill();
  }, [targetRef, callback, start, end, scrub, smooth, once]);
};

// Smooth stagger animation hook
export const useSmoothStagger = (
  containerRef: React.RefObject<HTMLElement>,
  selector: string,
  animationType: 'fadeIn' | 'scaleIn' | 'slideIn' | 'bounceIn' = 'fadeIn',
  options: {
    start?: string;
    stagger?: number;
    duration?: number;
    ease?: string;
  } = {}
) => {
  const {
    start = 'top 85%',
    stagger = SmoothAnimations.stagger.normal,
    duration = SmoothAnimations.duration.smooth,
    ease = SmoothAnimations.easing.smooth
  } = options;

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(selector);
    if (!elements.length) return;

    const animationOptions = { stagger, duration, ease };

    const scrollTrigger = ScrollTrigger.batch(Array.from(elements), {
      onEnter: (batch) => {
        switch (animationType) {
          case 'scaleIn':
            entranceAnimations.scaleIn(batch, animationOptions);
            break;
          case 'slideIn':
            entranceAnimations.slideInLeft(batch, animationOptions);
            break;
          case 'bounceIn':
            entranceAnimations.bounceIn(batch, animationOptions);
            break;
          default:
            entranceAnimations.fadeInUp(batch, animationOptions);
        }
      },
      start
    });

    return () => {
      scrollTrigger.forEach(trigger => trigger.kill());
    };
  }, [containerRef, selector, animationType, start, stagger, duration, ease]);
};