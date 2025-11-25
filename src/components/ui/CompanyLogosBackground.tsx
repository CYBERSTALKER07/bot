import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

interface CompanyLogosBackgroundProps {
  density?: 'low' | 'medium' | 'high';
  opacity?: number;
  enableAnimation?: boolean;
}

// Memoized company data for better performance
const COMPANIES = [
  { name: 'Google', logo: 'https://logo.clearbit.com/google.com', color: '#4285F4' },
  { name: 'Apple', logo: 'https://logo.clearbit.com/apple.com', color: '#000000' },
  { name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com', color: '#00A4EF' },
  { name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com', color: '#FF9900' },
  { name: 'Tesla', logo: 'https://logo.clearbit.com/tesla.com', color: '#CC0000' },
  { name: 'Netflix', logo: 'https://logo.clearbit.com/netflix.com', color: '#E50914' },
  { name: 'Meta', logo: 'https://logo.clearbit.com/meta.com', color: '#1877F2' },
  { name: 'Spotify', logo: 'https://logo.clearbit.com/spotify.com', color: '#1DB954' },
  { name: 'Airbnb', logo: 'https://logo.clearbit.com/airbnb.com', color: '#FF5A5F' },
  { name: 'Uber', logo: 'https://logo.clearbit.com/uber.com', color: '#000000' },
] as const;

export default function CompanyLogosBackground({ 
  density = 'medium', 
  opacity = 0.08,
  enableAnimation = true 
}: CompanyLogosBackgroundProps) {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);
  const isVisible = useRef<boolean>(false);

  // Memoized logo configuration based on density
  const logoConfig = useMemo(() => {
    const densityMap = { low: 8, medium: 12, high: 16 };
    const count = densityMap[density];
    
    return Array.from({ length: count }, (_, i) => {
      const company = COMPANIES[i % COMPANIES.length];
      return {
        ...company,
        id: `logo-${i}`,
        size: Math.random() * 20 + 40, // 40-60px
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        animationDelay: Math.random() * 5,
        speed: Math.random() * 0.5 + 0.3, // 0.3-0.8
      };
    });
  }, [density]);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !isVisible.current) return;

    const scrollY = window.scrollY;
    const logos = containerRef.current.querySelectorAll('.floating-logo');
    
    // Batch DOM updates for better performance
    gsap.set(logos, {
      y: (i: number) => `${scrollY * logoConfig[i]?.speed || 0.5 * -0.3}px`,
      ease: 'none'
    });
  }, [logoConfig]);

  // Intersection observer for performance optimization
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
        
        if (entry.isIntersecting && enableAnimation) {
          // Start animations only when visible
          const animate = () => {
            handleScroll();
            rafId.current = requestAnimationFrame(animate);
          };
          animate();
        } else {
          // Stop animations when not visible
          if (rafId.current) {
            cancelAnimationFrame(rafId.current);
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [enableAnimation, handleScroll]);

  // Optimized entrance animation
  useEffect(() => {
    if (!containerRef.current || !enableAnimation) return;

    const ctx = gsap.context(() => {
      const logos = gsap.utils.toArray('.floating-logo');
      
      // Simple entrance animation without complex scroll triggers
      gsap.fromTo(logos, {
        opacity: 0,
        scale: 0,
        rotation: 180
      }, {
        opacity: opacity,
        scale: 1,
        rotation: 0,
        duration: 1.5,
        ease: 'power2.out',
        stagger: {
          amount: 2,
          from: 'random'
        }
      });

      // Simplified floating animation
      gsap.to(logos, {
        y: '+=15',
        x: '+=8',
        rotation: '+=360',
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          amount: 5,
          from: 'random'
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, [opacity, enableAnimation]);

  if (!enableAnimation) {
    return (
      <div 
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{ opacity }}
      >
        {logoConfig.map((logo) => (
          <div
            key={logo.id}
            className="absolute w-12 h-12 bg-white/90 backdrop-blur-sm border border-gray-200/30 shadow-xs rounded-lg flex items-center justify-center"
            style={{
              left: `${logo.x}%`,
              top: `${logo.y}%`,
              transform: `rotate(${logo.rotation}deg)`,
            }}
          >
            <img
              src={logo.logo}
              alt={logo.name}
              className="w-8 h-8 object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity }}
    >
      {logoConfig.map((logo) => (
        <div
          key={logo.id}
          id={logo.id}
          className="floating-logo absolute bg-white/90 backdrop-blur-sm border border-gray-200/30 shadow-xs rounded-lg flex items-center justify-center will-change-transform"
          style={{
            width: `${logo.size}px`,
            height: `${logo.size}px`,
            left: `${logo.x}%`,
            top: `${logo.y}%`,
          }}
        >
          <img
            src={logo.logo}
            alt={logo.name}
            className="w-8 h-8 object-contain"
            loading="lazy"
            decoding="async"

          />
        </div>
      ))}
    </div>
  );
}