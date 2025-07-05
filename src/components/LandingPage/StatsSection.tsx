import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../context/ThemeContext';

interface StatsSectionProps {
  statsRef: React.RefObject<HTMLDivElement>;
}

export default function StatsSection({ statsRef }: StatsSectionProps) {
  const { isDark } = useTheme();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced stats counter animation - only numbers change
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 80%',
        onEnter: () => {
          // Only animate the numbers, not the entire cards
          gsap.fromTo('.stat-number', 
            { textContent: 0, scale: 0.8 },
            {
              duration: 2.5,
              textContent: (index: any, target: any) => target.getAttribute('data-target'),
              scale: 1,
              snap: { textContent: 1 },
              ease: 'power2.out',
              stagger: 0.3
            }
          );

          // Animate labels independently
          gsap.fromTo('.stat-label', 
            { opacity: 0, y: 10 },
            {
              duration: 1,
              opacity: 1,
              y: 0,
              ease: 'power2.out',
              stagger: 0.2,
              delay: 0.5
            }
          );

          // Add a subtle glow effect to active stat
          gsap.fromTo('.stat-glow',
            { opacity: 0, scale: 0 },
            {
              duration: 1.5,
              opacity: 0.3,
              scale: 1,
              ease: 'power2.out',
              stagger: 0.3,
              delay: 1
            }
          );
        }
      });
    });

    return () => ctx.revert();
  }, [statsRef]);

  return (
    <section ref={statsRef} className={`py-24 relative overflow-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-r from-dark-bg via-dark-surface to-dark-bg' 
        : 'bg-gradient-to-r from-asu-maroon via-asu-maroon-dark to-asu-maroon'
    }`}>
      <div className={`absolute inset-0 ${
        isDark ? 'bg-dark-surface/10' : 'bg-black/10'
      }`}></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className={`absolute top-12 left-12 w-32 h-32 rounded-full blur-3xl ${
          isDark ? 'bg-lime/20' : 'bg-asu-gold/20'
        }`}></div>
        <div className={`absolute bottom-12 right-12 w-28 h-28 rounded-full blur-2xl ${
          isDark ? 'bg-dark-accent/10' : 'bg-white/10'
        }`}></div>
        <div className={`absolute top-1/2 left-1/3 w-24 h-24 rounded-full blur-xl ${
          isDark ? 'bg-lime/15' : 'bg-asu-gold/15'
        }`}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-8 text-center ${
          isDark ? 'text-dark-text' : 'text-white'
        }`}>
          <div className="stat-card space-y-4 transform hover:scale-105 transition-transform duration-300 rotate-1">
            <div className={`stat-glow absolute inset-0 rounded-full blur-2xl ${
              isDark ? 'bg-lime/30' : 'bg-asu-gold/30'
            }`}></div>
            <div className={`stat-number text-5xl md:text-6xl font-bold bg-clip-text text-transparent relative z-10 ${
              isDark 
                ? 'bg-gradient-to-b from-dark-text to-lime' 
                : 'bg-gradient-to-b from-white to-asu-gold'
            }`} data-target="15000">0</div>
            <div className={`stat-label font-bold text-lg ${
              isDark ? 'text-lime' : 'text-asu-gold'
            }`}>Happy Students 😊</div>
            <div className={`text-sm ${
              isDark ? 'text-dark-muted' : 'text-gray-300'
            }`}>Ready to succeed!</div>
          </div>
          <div className="stat-card space-y-4 transform hover:scale-105 transition-transform duration-300 -rotate-1">
            <div className={`stat-glow absolute inset-0 rounded-full blur-2xl ${
              isDark ? 'bg-lime/30' : 'bg-asu-gold/30'
            }`}></div>
            <div className={`stat-number text-5xl md:text-6xl font-bold bg-clip-text text-transparent relative z-10 ${
              isDark 
                ? 'bg-gradient-to-b from-dark-text to-lime' 
                : 'bg-gradient-to-b from-white to-asu-gold'
            }`} data-target="500">0</div>
            <div className={`stat-label font-bold text-lg ${
              isDark ? 'text-lime' : 'text-asu-gold'
            }`}>Amazing Companies 🏢</div>
            <div className={`text-sm ${
              isDark ? 'text-dark-muted' : 'text-gray-300'
            }`}>Looking for talent!</div>
          </div>
          <div className="stat-card space-y-4 transform hover:scale-105 transition-transform duration-300 rotate-0.5">
            <div className={`stat-glow absolute inset-0 rounded-full blur-2xl ${
              isDark ? 'bg-lime/30' : 'bg-asu-gold/30'
            }`}></div>
            <div className={`stat-number text-5xl md:text-6xl font-bold bg-clip-text text-transparent relative z-10 ${
              isDark 
                ? 'bg-gradient-to-b from-dark-text to-lime' 
                : 'bg-gradient-to-b from-white to-asu-gold'
            }`} data-target="2000">0</div>
            <div className={`stat-label font-bold text-lg ${
              isDark ? 'text-lime' : 'text-asu-gold'
            }`}>Dream Jobs 💼</div>
            <div className={`text-sm ${
              isDark ? 'text-dark-muted' : 'text-gray-300'
            }`}>Posted monthly!</div>
          </div>
          <div className="stat-card space-y-4 transform hover:scale-105 transition-transform duration-300 -rotate-0.5">
            <div className={`stat-glow absolute inset-0 rounded-full blur-2xl ${
              isDark ? 'bg-lime/30' : 'bg-asu-gold/30'
            }`}></div>
            <div className={`stat-number text-5xl md:text-6xl font-bold bg-clip-text text-transparent relative z-10 ${
              isDark 
                ? 'bg-gradient-to-b from-dark-text to-lime' 
                : 'bg-gradient-to-b from-white to-asu-gold'
            }`} data-target="95">0</div>
            <div className={`stat-label font-bold text-lg ${
              isDark ? 'text-lime' : 'text-asu-gold'
            }`}>% Success Rate 🎯</div>
            <div className={`text-sm ${
              isDark ? 'text-dark-muted' : 'text-gray-300'
            }`}>Absolutely amazing!</div>
          </div>
        </div>
      </div>
    </section>
  );
}