import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../context/ThemeContext';
import { Typography } from '@mui/material';
import { useScrollTrigger, useScrollTriggerStagger } from '../../hooks/useScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StatsSectionProps {
  statsRef: React.RefObject<HTMLDivElement>;
}

export default function StatsSection({ statsRef }: StatsSectionProps) {
  const { isDark } = useTheme();
  const headerRef = useRef<HTMLDivElement>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic header animation
  useScrollTrigger(headerRef, (element, progress) => {
    gsap.set(element, {
      opacity: progress,
      y: (1 - progress) * 50,
      scale: 0.95 + (progress * 0.05),
      ease: 'none'
    });
  }, { 
    start: 'top 90%', 
    end: 'top 40%',
    scrub: 1.5 
  });

  // Staggered stats animation with counter effect
  useScrollTriggerStagger(statsContainerRef, '.stat-item', (elements, progress) => {
    elements.forEach((element, index) => {
      const delay = index * 0.2;
      const elementProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      
      // Animate the container
      gsap.set(element, {
        opacity: elementProgress,
        y: (1 - elementProgress) * 60,
        scale: 0.8 + (elementProgress * 0.2),
        ease: 'none'
      });

      // Animate the number counter
      const numberElement = element.querySelector('.stat-number');
      if (numberElement && elementProgress > 0) {
        const targetValue = parseInt(numberElement.getAttribute('data-target') || '0');
        const currentValue = Math.floor(targetValue * elementProgress);
        numberElement.textContent = currentValue.toLocaleString();
      }
    });
  }, { 
    start: 'top 80%', 
    end: 'bottom 90%',
    scrub: 2 
  });

  // Initial setup
  useEffect(() => {
    if (!statsRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(headerRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.95
      });

      gsap.set('.stat-item', {
        opacity: 0,
        y: 60,
        scale: 0.8
      });

      // Set initial counter values
      gsap.set('.stat-number', {
        textContent: 0
      });

      // Continuous floating animations for stat items
      gsap.to('.stat-item', {
        y: -5,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.5
      });
    }, statsRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { 
      number: 15000, 
      label: 'Active Students', 
      suffix: '+',
      description: 'Students actively using our platform'
    },
    { 
      number: 2500, 
      label: 'Dream Jobs Posted', 
      suffix: '+',
      description: 'Amazing opportunities available'
    },
    { 
      number: 95, 
      label: 'Success Rate', 
      suffix: '%',
      description: 'Students who found their perfect job'
    },
    { 
      number: 500, 
      label: 'Partner Companies', 
      suffix: '+',
      description: 'Top employers hiring through us'
    }
  ];

  return (
    <section ref={statsRef} className={`py-20 relative overflow-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-dark-surface to-dark-bg' 
        : 'bg-gradient-to-b from-gray-50 to-white'
    }`}>
      {/* Decorative background elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-16 left-16 w-24 h-24 rounded-full opacity-10 ${
          isDark ? 'bg-lime' : 'bg-asu-maroon'
        }`}></div>
        <div className={`absolute bottom-20 right-20 w-32 h-32 rounded-full opacity-5 ${
          isDark ? 'bg-dark-accent' : 'bg-asu-gold'
        }`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <Typography 
            variant="h2" 
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}
          >
            Trusted by Thousands of
            <span className={`block bg-clip-text text-transparent ${
              isDark 
                ? 'bg-gradient-to-r from-lime to-dark-accent' 
                : 'bg-gradient-to-r from-asu-maroon to-asu-gold'
            }`}>
              Successful Students 🌟
            </span>
          </Typography>
          <Typography 
            variant="h6" 
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}
          >
            Join our growing community and achieve your career goals
          </Typography>
        </div>

        {/* Stats Grid */}
        <div ref={statsContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item text-center">
              <div className={`rounded-2xl p-8 ${
                isDark 
                  ? 'bg-dark-surface/80 border border-lime/10' 
                  : 'bg-white/80 border border-gray-200'
              } backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300`}>
                <div className="mb-4">
                  <span 
                    className={`stat-number text-4xl md:text-5xl font-bold ${
                      isDark ? 'text-lime' : 'text-asu-maroon'
                    }`}
                    data-target={stat.number}
                  >
                    0
                  </span>
                  <span className={`text-2xl md:text-3xl font-bold ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`}>
                    {stat.suffix}
                  </span>
                </div>
                
                <Typography 
                  variant="h6" 
                  className={`font-semibold mb-2 ${
                    isDark ? 'text-dark-text' : 'text-gray-900'
                  }`}
                >
                  {stat.label}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  className={isDark ? 'text-dark-muted' : 'text-gray-600'}
                >
                  {stat.description}
                </Typography>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Typography 
            variant="h5" 
            className={`font-semibold ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}
          >
            Ready to join our success stories? 🚀
          </Typography>
        </div>
      </div>
    </section>
  );
}