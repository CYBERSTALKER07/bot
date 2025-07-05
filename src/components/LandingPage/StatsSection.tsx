import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StatsSection() {
  const statsRef = useRef<HTMLDivElement>(null);

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
  }, []);

  return (
    <section ref={statsRef} className="py-24 bg-gradient-to-r from-asu-maroon via-asu-maroon-dark to-asu-maroon relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-12 left-12 w-32 h-32 bg-asu-gold/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-12 right-12 w-28 h-28 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-asu-gold/15 rounded-full blur-xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
          <div className="stat-card space-y-4 transform hover:scale-105 transition-transform duration-300 rotate-1">
            <div className="stat-number text-5xl md:text-6xl font-bold bg-gradient-to-b from-white to-asu-gold bg-clip-text text-transparent" data-target="15000">0</div>
            <div className="stat-label text-asu-gold font-bold text-lg">Happy Students 😊</div>
            <div className="text-sm text-gray-300">Ready to succeed!</div>
          </div>
          <div className="stat-card space-y-4 transform hover:scale-105 transition-transform duration-300 -rotate-1">
            <div className="stat-number text-5xl md:text-6xl font-bold bg-gradient-to-b from-white to-asu-gold bg-clip-text text-transparent" data-target="500">0</div>
            <div className="stat-label text-asu-gold font-bold text-lg">Amazing Companies 🏢</div>
            <div className="text-sm text-gray-300">Looking for talent!</div>
          </div>
          <div className="stat-card space-y-4 transform hover:scale-105 transition-transform duration-300 rotate-0.5">
            <div className="stat-number text-5xl md:text-6xl font-bold bg-gradient-to-b from-white to-asu-gold bg-clip-text text-transparent" data-target="2000">0</div>
            <div className="stat-label text-asu-gold font-bold text-lg">Dream Jobs 💼</div>
            <div className="text-sm text-gray-300">Posted monthly!</div>
          </div>
          <div className="stat-card space-y-4 transform hover:scale-105 transition-transform duration-300 -rotate-0.5">
            <div className="stat-number text-5xl md:text-6xl font-bold bg-gradient-to-b from-white to-asu-gold bg-clip-text text-transparent" data-target="95">0</div>
            <div className="stat-label text-asu-gold font-bold text-lg">% Success Rate 🎯</div>
            <div className="text-sm text-gray-300">Absolutely amazing!</div>
          </div>
        </div>
      </div>
    </section>
  );
}