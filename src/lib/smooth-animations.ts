// Enhanced smooth animation utilities
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Smooth animation presets with optimized easing
export const SmoothAnimations = {
  // Ultra-smooth easing curves
  easing: {
    smooth: 'power2.out',
    ultraSmooth: 'power1.inOut',
    buttery: 'sine.inOut',
    silky: 'expo.out',
    elastic: 'elastic.out(1, 0.5)',
    bounce: 'back.out(1.7)',
    custom: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' // Material Design standard
  },

  // Optimized duration presets
  duration: {
    instant: 0.15,
    quick: 0.25,
    normal: 0.4,
    smooth: 0.6,
    slow: 0.8,
    ultra: 1.2
  },

  // Stagger presets for multiple elements
  stagger: {
    tight: 0.05,
    normal: 0.1,
    loose: 0.2,
    dramatic: 0.3
  }
};

// Enhanced smooth entrance animations
export const entranceAnimations = {
  // Fade and slide from bottom (most common)
  fadeInUp: (elements: string | Element | Element[], options = {}) => {
    const defaults = {
      duration: SmoothAnimations.duration.smooth,
      ease: SmoothAnimations.easing.smooth,
      stagger: SmoothAnimations.stagger.normal,
      delay: 0,
      y: 50,
      opacity: 0
    };
    const config = { ...defaults, ...options };

    return gsap.fromTo(elements, 
      { opacity: 0, y: config.y },
      { 
        opacity: 1, 
        y: 0, 
        duration: config.duration,
        ease: config.ease,
        stagger: config.stagger,
        delay: config.delay
      }
    );
  },

  // Scale entrance with ultra-smooth scaling
  scaleIn: (elements: string | Element | Element[], options = {}) => {
    const defaults = {
      duration: SmoothAnimations.duration.smooth,
      ease: SmoothAnimations.easing.bounce,
      stagger: SmoothAnimations.stagger.normal,
      delay: 0,
      scale: 0.8,
      opacity: 0
    };
    const config = { ...defaults, ...options };

    return gsap.fromTo(elements,
      { opacity: 0, scale: config.scale },
      {
        opacity: 1,
        scale: 1,
        duration: config.duration,
        ease: config.ease,
        stagger: config.stagger,
        delay: config.delay
      }
    );
  },

  // Slide from left with momentum
  slideInLeft: (elements: string | Element | Element[], options = {}) => {
    const defaults = {
      duration: SmoothAnimations.duration.smooth,
      ease: SmoothAnimations.easing.ultraSmooth,
      stagger: SmoothAnimations.stagger.normal,
      delay: 0,
      x: -60,
      opacity: 0
    };
    const config = { ...defaults, ...options };

    return gsap.fromTo(elements,
      { opacity: 0, x: config.x },
      {
        opacity: 1,
        x: 0,
        duration: config.duration,
        ease: config.ease,
        stagger: config.stagger,
        delay: config.delay
      }
    );
  },

  // Elastic bounce entrance
  bounceIn: (elements: string | Element | Element[], options = {}) => {
    const defaults = {
      duration: SmoothAnimations.duration.ultra,
      ease: SmoothAnimations.easing.elastic,
      stagger: SmoothAnimations.stagger.loose,
      delay: 0,
      scale: 0.3,
      rotation: 180,
      opacity: 0
    };
    const config = { ...defaults, ...options };

    return gsap.fromTo(elements,
      { opacity: 0, scale: config.scale, rotation: config.rotation },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: config.duration,
        ease: config.ease,
        stagger: config.stagger,
        delay: config.delay
      }
    );
  }
};

// Smooth scroll-triggered animations
export const scrollAnimations = {
  // Ultra-smooth reveal on scroll
  revealOnScroll: (element: Element, options = {}) => {
    const defaults = {
      start: 'top 85%',
      end: 'top 20%',
      scrub: false,
      toggleActions: 'play none none reverse'
    };
    const config = { ...defaults, ...options };

    return ScrollTrigger.create({
      trigger: element,
      start: config.start,
      end: config.end,
      scrub: config.scrub,
      toggleActions: config.toggleActions,
      onEnter: () => entranceAnimations.fadeInUp(element, { duration: SmoothAnimations.duration.smooth }),
      onEnterBack: () => entranceAnimations.fadeInUp(element, { duration: SmoothAnimations.duration.quick }),
    });
  },

  // Parallax with ultra-smooth movement
  smoothParallax: (element: Element, options = {}) => {
    const defaults = {
      start: 'top bottom',
      end: 'bottom top',
      yPercent: -50
    };
    const config = { ...defaults, ...options };

    return ScrollTrigger.create({
      trigger: element,
      start: config.start,
      end: config.end,
      scrub: 1.5, // Smooth scrub value
      onUpdate: (self) => {
        gsap.to(element, {
          yPercent: config.yPercent * self.progress,
          duration: 0.3,
          ease: SmoothAnimations.easing.ultraSmooth,
          overwrite: true
        });
      }
    });
  },

  // Counter animation with smooth increment
  smoothCounter: (element: Element, options = {}) => {
    const defaults = {
      start: 'top 80%',
      duration: SmoothAnimations.duration.ultra,
      ease: SmoothAnimations.easing.smooth
    };
    const config = { ...defaults, ...options };

    const target = parseInt(element.getAttribute('data-target') || '0');
    
    return ScrollTrigger.create({
      trigger: element,
      start: config.start,
      onEnter: () => {
        gsap.fromTo(element, 
          { textContent: 0 },
          {
            textContent: target,
            duration: config.duration,
            ease: config.ease,
            snap: { textContent: 1 },
            onUpdate: function() {
              element.textContent = Math.ceil(this.targets()[0].textContent).toLocaleString();
            }
          }
        );
      }
    });
  }
};

// Smooth hover and interaction animations
export const interactionAnimations = {
  // Ultra-smooth button hover
  buttonHover: (button: Element) => {
    const tl = gsap.timeline({ paused: true });
    
    tl.to(button, {
      scale: 1.05,
      y: -2,
      duration: SmoothAnimations.duration.quick,
      ease: SmoothAnimations.easing.ultraSmooth
    });

    button.addEventListener('mouseenter', () => tl.play());
    button.addEventListener('mouseleave', () => tl.reverse());
    
    return tl;
  },

  // Card hover with smooth lift effect
  cardHover: (card: Element, options = {}) => {
    const defaults = {
      scale: 1.02,
      y: -8,
      rotateX: 5,
      duration: SmoothAnimations.duration.normal,
      ease: SmoothAnimations.easing.smooth
    };
    const config = { ...defaults, ...options };

    const tl = gsap.timeline({ paused: true });
    
    tl.to(card, {
      scale: config.scale,
      y: config.y,
      rotateX: config.rotateX,
      duration: config.duration,
      ease: config.ease,
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
    });

    card.addEventListener('mouseenter', () => tl.play());
    card.addEventListener('mouseleave', () => tl.reverse());
    
    return tl;
  },

  // Smooth click animation
  clickEffect: (element: Element) => {
    element.addEventListener('click', () => {
      gsap.to(element, {
        scale: 0.95,
        duration: SmoothAnimations.duration.instant,
        ease: SmoothAnimations.easing.smooth,
        yoyo: true,
        repeat: 1
      });
    });
  }
};

// Page transition animations
export const pageTransitions = {
  // Smooth page enter
  pageEnter: (container: Element) => {
    const tl = gsap.timeline();
    
    tl.fromTo(container, 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: SmoothAnimations.duration.smooth,
        ease: SmoothAnimations.easing.smooth 
      }
    );

    // Animate child elements
    const children = container.querySelectorAll('.animate-on-enter');
    if (children.length > 0) {
      tl.add(entranceAnimations.fadeInUp(children, { 
        stagger: SmoothAnimations.stagger.tight,
        duration: SmoothAnimations.duration.normal 
      }), '-=0.2');
    }

    return tl;
  },

  // Smooth section transitions
  sectionTransition: (fromSection: Element, toSection: Element) => {
    const tl = gsap.timeline();
    
    tl.to(fromSection, {
      opacity: 0,
      y: -20,
      duration: SmoothAnimations.duration.quick,
      ease: SmoothAnimations.easing.smooth
    })
    .fromTo(toSection,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: SmoothAnimations.duration.smooth,
        ease: SmoothAnimations.easing.smooth
      },
      '-=0.1'
    );

    return tl;
  }
};

// Utility functions for smooth animations
export const animationUtils = {
  // Batch animate multiple elements smoothly
  batchAnimate: (elements: Element[], animation: string, options = {}) => {
    const defaults = {
      stagger: SmoothAnimations.stagger.normal,
      duration: SmoothAnimations.duration.smooth,
      ease: SmoothAnimations.easing.smooth
    };
    const config = { ...defaults, ...options };

    switch (animation) {
      case 'fadeIn':
        return entranceAnimations.fadeInUp(elements, config);
      case 'scaleIn':
        return entranceAnimations.scaleIn(elements, config);
      case 'slideIn':
        return entranceAnimations.slideInLeft(elements, config);
      case 'bounceIn':
        return entranceAnimations.bounceIn(elements, config);
      default:
        return entranceAnimations.fadeInUp(elements, config);
    }
  },

  // Initialize smooth animations for common elements
  initSmoothAnimations: (container: Element = document.body) => {
    // Auto-animate elements with data attributes
    const fadeElements = container.querySelectorAll('[data-animate="fade"]');
    const scaleElements = container.querySelectorAll('[data-animate="scale"]');
    const slideElements = container.querySelectorAll('[data-animate="slide"]');
    const bounceElements = container.querySelectorAll('[data-animate="bounce"]');

    // Apply smooth animations
    if (fadeElements.length) {
      ScrollTrigger.batch(fadeElements, {
        onEnter: (elements) => entranceAnimations.fadeInUp(elements),
        start: 'top 85%'
      });
    }

    if (scaleElements.length) {
      ScrollTrigger.batch(scaleElements, {
        onEnter: (elements) => entranceAnimations.scaleIn(elements),
        start: 'top 85%'
      });
    }

    if (slideElements.length) {
      ScrollTrigger.batch(slideElements, {
        onEnter: (elements) => entranceAnimations.slideInLeft(elements),
        start: 'top 85%'
      });
    }

    if (bounceElements.length) {
      ScrollTrigger.batch(bounceElements, {
        onEnter: (elements) => entranceAnimations.bounceIn(elements),
        start: 'top 85%'
      });
    }

    // Initialize hover animations
    const buttons = container.querySelectorAll('button, .btn');
    const cards = container.querySelectorAll('.card, [class*="card"]');

    buttons.forEach(button => {
      interactionAnimations.buttonHover(button);
      interactionAnimations.clickEffect(button);
    });

    cards.forEach(card => {
      interactionAnimations.cardHover(card);
    });

    // Initialize counters
    const counters = container.querySelectorAll('[data-target]');
    counters.forEach(counter => {
      scrollAnimations.smoothCounter(counter);
    });
  },

  // Refresh ScrollTrigger (call after dynamic content changes)
  refresh: () => {
    ScrollTrigger.refresh();
  },

  // Kill all animations (cleanup)
  killAll: () => {
    ScrollTrigger.killAll();
    gsap.killTweensOf('*');
  }
};