import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';

// SwiftUI-inspired animation presets
export const SwiftUIAnimations = {
  // Standard easing curves from SwiftUI
  easing: {
    easeInOut: 'power2.inOut',
    easeIn: 'power2.in',
    easeOut: 'power2.out',
    spring: 'back.out(1.7)',
    bouncy: 'bounce.out',
    snappy: 'elastic.out(1, 0.8)',
    smooth: 'power1.inOut',
    linear: 'none'
  },
  
  // Duration presets
  duration: {
    instant: 0,
    fast: 0.2,
    standard: 0.3,
    slow: 0.5,
    slower: 0.8,
    slowest: 1.2
  }
};

// SwiftUI-style animation hook
export const useSwiftUIAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const animate = useCallback((
    target: string | Element | gsap.TweenTarget,
    properties: gsap.TweenVars,
    options: {
      duration?: number;
      ease?: string;
      delay?: number;
      onComplete?: () => void;
      spring?: boolean;
    } = {}
  ) => {
    const {
      duration = SwiftUIAnimations.duration.standard,
      ease = SwiftUIAnimations.easing.spring,
      delay = 0,
      onComplete,
      spring = false
    } = options;

    setIsAnimating(true);
    
    const animationProps = {
      ...properties,
      duration: spring ? SwiftUIAnimations.duration.slow : duration,
      ease: spring ? SwiftUIAnimations.easing.spring : ease,
      delay,
      onComplete: () => {
        setIsAnimating(false);
        if (onComplete) onComplete();
      }
    };

    return gsap.to(target, animationProps);
  }, []);

  const animateFrom = useCallback((
    target: string | Element | gsap.TweenTarget,
    properties: gsap.TweenVars,
    options: {
      duration?: number;
      ease?: string;
      delay?: number;
      onComplete?: () => void;
    } = {}
  ) => {
    const {
      duration = SwiftUIAnimations.duration.standard,
      ease = SwiftUIAnimations.easing.spring,
      delay = 0,
      onComplete
    } = options;

    setIsAnimating(true);

    return gsap.fromTo(target, properties, {
      ...properties,
      duration,
      ease,
      delay,
      onComplete: () => {
        setIsAnimating(false);
        if (onComplete) onComplete();
      }
    });
  }, []);

  const staggeredAnimate = useCallback((
    targets: string | Element[] | NodeList,
    properties: gsap.TweenVars,
    options: {
      stagger?: number;
      duration?: number;
      ease?: string;
      delay?: number;
      onComplete?: () => void;
    } = {}
  ) => {
    const {
      stagger = 0.1,
      duration = SwiftUIAnimations.duration.standard,
      ease = SwiftUIAnimations.easing.spring,
      delay = 0,
      onComplete
    } = options;

    setIsAnimating(true);

    return gsap.to(targets, {
      ...properties,
      duration,
      ease,
      delay,
      stagger,
      onComplete: () => {
        setIsAnimating(false);
        if (onComplete) onComplete();
      }
    });
  }, []);

  return {
    animate,
    animateFrom,
    staggeredAnimate,
    isAnimating
  };
};

// SwiftUI-style spring animation
export const useSpringAnimation = (
  initialValue = 0,
  damping = 0.7,
  stiffness = 100
) => {
  const [value, setValue] = useState(initialValue);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  const springTo = useCallback((targetValue: number, onComplete?: () => void) => {
    if (animationRef.current) {
      animationRef.current.kill();
    }

    const obj = { value };
    
    animationRef.current = gsap.to(obj, {
      value: targetValue,
      duration: 1,
      ease: `elastic.out(${stiffness / 100}, ${damping})`,
      onUpdate: () => setValue(obj.value),
      onComplete
    });
  }, [value, damping, stiffness]);

  return [value, springTo] as const;
};

// SwiftUI-like view state animations
export const useViewState = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  const fadeIn = useCallback((duration = SwiftUIAnimations.duration.standard) => {
    if (!elementRef.current) return;
    
    gsap.fromTo(elementRef.current, 
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration, 
        ease: SwiftUIAnimations.easing.spring 
      }
    );
    setIsVisible(true);
  }, []);

  const fadeOut = useCallback((duration = SwiftUIAnimations.duration.standard) => {
    if (!elementRef.current) return;
    
    gsap.to(elementRef.current, {
      opacity: 0,
      y: -20,
      duration,
      ease: SwiftUIAnimations.easing.easeIn,
      onComplete: () => setIsVisible(false)
    });
  }, []);

  const scalePress = useCallback(() => {
    if (!elementRef.current) return;
    
    gsap.to(elementRef.current, {
      scale: 0.95,
      duration: SwiftUIAnimations.duration.fast,
      ease: SwiftUIAnimations.easing.easeOut
    });
    setIsPressed(true);
  }, []);

  const scaleRelease = useCallback(() => {
    if (!elementRef.current) return;
    
    gsap.to(elementRef.current, {
      scale: 1,
      duration: SwiftUIAnimations.duration.standard,
      ease: SwiftUIAnimations.easing.spring
    });
    setIsPressed(false);
  }, []);

  const hoverScale = useCallback((scale = 1.05) => {
    if (!elementRef.current) return;
    
    gsap.to(elementRef.current, {
      scale,
      duration: SwiftUIAnimations.duration.standard,
      ease: SwiftUIAnimations.easing.easeOut
    });
    setIsHovered(true);
  }, []);

  const hoverReset = useCallback(() => {
    if (!elementRef.current) return;
    
    gsap.to(elementRef.current, {
      scale: 1,
      duration: SwiftUIAnimations.duration.standard,
      ease: SwiftUIAnimations.easing.spring
    });
    setIsHovered(false);
  }, []);

  return {
    elementRef,
    isVisible,
    isPressed,
    isHovered,
    fadeIn,
    fadeOut,
    scalePress,
    scaleRelease,
    hoverScale,
    hoverReset
  };
};

// SwiftUI-style transition animations
export const SwiftUITransitions = {
  // Slide transitions
  slideIn: (element: Element, direction: 'left' | 'right' | 'up' | 'down' = 'right') => {
    const directions = {
      left: { x: -100 },
      right: { x: 100 },
      up: { y: -100 },
      down: { y: 100 }
    };

    gsap.fromTo(element,
      { ...directions[direction], opacity: 0 },
      { 
        x: 0, 
        y: 0, 
        opacity: 1, 
        duration: SwiftUIAnimations.duration.standard,
        ease: SwiftUIAnimations.easing.spring 
      }
    );
  },

  // Scale transitions
  scaleIn: (element: Element) => {
    gsap.fromTo(element,
      { scale: 0.8, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: SwiftUIAnimations.duration.standard,
        ease: SwiftUIAnimations.easing.spring 
      }
    );
  },

  // Rotation transitions
  rotateIn: (element: Element) => {
    gsap.fromTo(element,
      { rotation: -90, scale: 0.8, opacity: 0 },
      { 
        rotation: 0, 
        scale: 1, 
        opacity: 1, 
        duration: SwiftUIAnimations.duration.slow,
        ease: SwiftUIAnimations.easing.spring 
      }
    );
  },

  // Flip transitions
  flip: (element: Element, axis: 'x' | 'y' = 'y') => {
    const property = axis === 'x' ? 'rotationX' : 'rotationY';
    
    gsap.fromTo(element,
      { [property]: -180, opacity: 0 },
      { 
        [property]: 0, 
        opacity: 1, 
        duration: SwiftUIAnimations.duration.slow,
        ease: SwiftUIAnimations.easing.spring 
      }
    );
  },

  // Morphing transition
  morph: (fromElement: Element, toElement: Element) => {
    const tl = gsap.timeline();
    
    tl.to(fromElement, {
      scale: 0,
      opacity: 0,
      duration: SwiftUIAnimations.duration.fast,
      ease: SwiftUIAnimations.easing.easeIn
    })
    .fromTo(toElement,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: SwiftUIAnimations.duration.standard,
        ease: SwiftUIAnimations.easing.spring
      }
    );

    return tl;
  }
};

// SwiftUI-style animation utilities
export const swiftUIUtils = {
  // Animate with delay
  withDelay: (delay: number, animation: () => void) => {
    gsap.delayedCall(delay, animation);
  },

  // Repeat animation
  withRepeat: (count: number, animation: () => gsap.core.Tween) => {
    const tl = gsap.timeline({ repeat: count - 1 });
    tl.add(animation());
    return tl;
  },

  // Chain animations
  sequence: (...animations: (() => gsap.core.Tween)[]) => {
    const tl = gsap.timeline();
    animations.forEach(animation => {
      tl.add(animation());
    });
    return tl;
  },

  // Parallel animations
  parallel: (...animations: (() => gsap.core.Tween)[]) => {
    animations.forEach(animation => animation());
  }
};