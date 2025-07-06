import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { GraduationCap, Sparkles, Award, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create main timeline
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(onComplete, 300);
        }
      });

      // Initial states
      gsap.set([logoRef.current, textRef.current, subtitleRef.current], {
        opacity: 0,
        scale: 0.3,
        y: 100,
        rotation: -15
      });

      gsap.set(progressBarRef.current, {
        scaleX: 0,
        transformOrigin: 'left center'
      });

      gsap.set('.particle', {
        opacity: 0,
        scale: 0,
        rotation: 0
      });

      gsap.set('.orb', {
        opacity: 0,
        scale: 0
      });

      // Logo entrance with bounce and rotation
      tl.to(logoRef.current, {
        duration: 1.2,
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0,
        ease: 'elastic.out(1, 0.5)'
      })
      // Logo glow effect
      .to(logoRef.current, {
        duration: 0.8,
        boxShadow: isDark 
          ? '0 0 40px rgba(227, 255, 112, 0.6), 0 0 80px rgba(227, 255, 112, 0.3)' 
          : '0 0 40px rgba(140, 29, 64, 0.6), 0 0 80px rgba(140, 29, 64, 0.3)',
        ease: 'power2.out'
      }, '-=0.6')
      // Text entrance with stagger
      .to(textRef.current, {
        duration: 1,
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0,
        ease: 'back.out(1.7)'
      }, '-=0.8')
      .to(subtitleRef.current, {
        duration: 0.8,
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0,
        ease: 'power3.out'
      }, '-=0.4')
      // Particles entrance
      .to('.particle', {
        duration: 1.5,
        opacity: 1,
        scale: 1,
        rotation: 360,
        ease: 'power2.out',
        stagger: {
          amount: 0.8,
          from: 'random'
        }
      }, '-=1')
      // Floating orbs
      .to('.orb', {
        duration: 1,
        opacity: 0.8,
        scale: 1,
        ease: 'power2.out',
        stagger: 0.2
      }, '-=1.2')
      // Progress bar loading
      .to(progressBarRef.current, {
        duration: 2,
        scaleX: 1,
        ease: 'power2.inOut'
      }, '-=1.5')
      // Hold for a moment
      .to({}, { duration: 0.8 })
      // Exit animation - zoom out and fade
      .to([logoRef.current, textRef.current, subtitleRef.current], {
        duration: 1,
        opacity: 0,
        scale: 1.5,
        y: -50,
        ease: 'power2.in',
        stagger: 0.1
      })
      .to(containerRef.current, {
        duration: 0.8,
        opacity: 0,
        scale: 1.1,
        ease: 'power2.in'
      }, '-=0.5');

      // Continuous animations for particles
      gsap.to('.particle', {
        y: '-=20',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          amount: 1,
          from: 'random'
        }
      });

      // Floating animation for orbs
      gsap.to('.orb', {
        y: '-=15',
        x: '+=10',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          amount: 1.5,
          from: 'center'
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete, isDark]);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}
    >
      {/* Animated Background Orbs */}
      <div ref={orbsRef} className="absolute inset-0 overflow-hidden">
        <div className={`orb absolute top-20 left-20 w-32 h-32 rounded-full blur-xl ${
          isDark ? 'bg-lime/20' : 'bg-asu-maroon/20'
        }`}></div>
        <div className={`orb absolute top-40 right-32 w-24 h-24 rounded-full blur-lg ${
          isDark ? 'bg-dark-accent/30' : 'bg-asu-gold/30'
        }`}></div>
        <div className={`orb absolute bottom-32 left-1/3 w-20 h-20 rounded-full blur-md ${
          isDark ? 'bg-lime/25' : 'bg-asu-maroon/25'
        }`}></div>
        <div className={`orb absolute bottom-20 right-20 w-28 h-28 rounded-full blur-xl ${
          isDark ? 'bg-dark-accent/20' : 'bg-asu-gold/20'
        }`}></div>
      </div>

      {/* Floating Particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`particle absolute ${
              i % 4 === 0 ? 'top-1/4' : 
              i % 4 === 1 ? 'top-1/3' : 
              i % 4 === 2 ? 'top-2/3' : 'top-3/4'
            } ${
              i % 3 === 0 ? 'left-1/4' : 
              i % 3 === 1 ? 'left-1/2' : 'left-3/4'
            }`}
          >
            {i % 3 === 0 ? (
              <Sparkles className={`h-4 w-4 ${isDark ? 'text-lime' : 'text-asu-gold'}`} />
            ) : i % 3 === 1 ? (
              <Award className={`h-3 w-3 ${isDark ? 'text-dark-accent' : 'text-asu-maroon'}`} />
            ) : (
              <TrendingUp className={`h-3 w-3 ${isDark ? 'text-lime' : 'text-asu-gold'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="text-center relative z-10">
        {/* Enhanced Logo */}
        <div ref={logoRef} className="mb-8">
          <div className={`w-40 h-40 rounded-full flex items-center justify-center shadow-2xl mb-6 mx-auto relative ${
            isDark 
              ? 'bg-gradient-to-br from-lime to-dark-accent' 
              : 'bg-gradient-to-br from-asu-maroon to-asu-maroon-dark'
          }`}>
            <GraduationCap className={`h-20 w-20 ${
              isDark ? 'text-dark-surface' : 'text-white'
            }`} />
            {/* Pulse rings */}
            <div className={`absolute inset-0 rounded-full animate-ping ${
              isDark ? 'bg-lime/30' : 'bg-asu-maroon/30'
            }`}></div>
            <div className={`absolute inset-2 rounded-full animate-pulse ${
              isDark ? 'bg-lime/20' : 'bg-asu-maroon/20'
            }`}></div>
          </div>
        </div>

        {/* Enhanced Text */}
        <div ref={textRef} className="mb-4">
          <h1 className={`text-6xl md:text-7xl font-bold mb-2 bg-clip-text text-transparent ${
            isDark 
              ? 'bg-gradient-to-r from-lime via-dark-accent to-lime' 
              : 'bg-gradient-to-r from-asu-maroon via-asu-gold to-asu-maroon'
          }`}>
            AUT Handshake
          </h1>
        </div>

        <div ref={subtitleRef}>
          <p className={`text-xl md:text-2xl font-medium max-w-md mx-auto leading-relaxed ${
            isDark ? 'text-dark-muted' : 'text-gray-600'
          }`}>
            Your professional career journey starts here
          </p>
          <p className={`text-sm mt-2 font-medium ${
            isDark ? 'text-lime' : 'text-asu-maroon'
          }`}>
            American University of Technology in Tashkent
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-12 w-64 mx-auto">
          <div className={`h-1 rounded-full overflow-hidden ${
            isDark ? 'bg-dark-surface' : 'bg-gray-200'
          }`}>
            <div 
              ref={progressBarRef}
              className={`h-full rounded-full ${
                isDark 
                  ? 'bg-gradient-to-r from-lime to-dark-accent' 
                  : 'bg-gradient-to-r from-asu-maroon to-asu-gold'
              }`}
            ></div>
          </div>
          <p className={`text-xs mt-2 font-medium ${
            isDark ? 'text-dark-muted' : 'text-gray-500'
          }`}>
            Loading your experience...
          </p>
        </div>
      </div>
    </div>
  );
}