import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { GraduationCap, Sparkles, Trophy, Zap, Star, Target } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create timeline for splash screen
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(onComplete, 500);
        }
      });

      // Initial state
      gsap.set([logoRef.current, textRef.current, progressRef.current], {
        opacity: 0,
        scale: 0.5,
        y: 50
      });

      // Animate particles
      gsap.set('.particle', {
        opacity: 0,
        scale: 0,
        rotation: 0
      });

      // Main animation sequence
      tl.to(logoRef.current, {
        duration: 1,
        opacity: 1,
        scale: 1,
        y: 0,
        ease: 'back.out(1.7)'
      })
      .to('.particle', {
        duration: 1.5,
        opacity: 1,
        scale: 1,
        rotation: 360,
        ease: 'power2.out',
        stagger: 0.1
      }, '-=0.5')
      .to(textRef.current, {
        duration: 0.8,
        opacity: 1,
        scale: 1,
        y: 0,
        ease: 'power3.out'
      }, '-=0.8')
      .to(progressRef.current, {
        duration: 0.6,
        opacity: 1,
        scale: 1,
        y: 0,
        ease: 'power2.out'
      }, '-=0.4')
      .to('.progress-bar', {
        duration: 2,
        width: '100%',
        ease: 'power2.inOut'
      }, '-=0.2')
      .to('.loading-text', {
        duration: 0.5,
        opacity: 1,
        ease: 'power2.out'
      }, '-=1.5')
      .to([logoRef.current, textRef.current, progressRef.current], {
        duration: 0.8,
        opacity: 0,
        scale: 0.8,
        y: -30,
        ease: 'power2.in'
      }, '+=0.5')
      .to(containerRef.current, {
        duration: 0.6,
        opacity: 0,
        scale: 1.1,
        ease: 'power2.in'
      }, '-=0.3');

      // Floating animation for particles
      gsap.to('.particle-1', {
        y: -20,
        x: 15,
        rotation: 180,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });

      gsap.to('.particle-2', {
        y: -25,
        x: -10,
        rotation: -90,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 0.5
      });

      gsap.to('.particle-3', {
        y: -30,
        x: 20,
        rotation: 270,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 1
      });

      gsap.to('.particle-4', {
        y: -15,
        x: -20,
        rotation: 360,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 1.5
      });

      gsap.to('.particle-5', {
        y: -35,
        x: 10,
        rotation: 45,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 0.8
      });

      gsap.to('.particle-6', {
        y: -18,
        x: -15,
        rotation: 135,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 1.2
      });

      // Sparkle animation
      gsap.to('.sparkle', {
        scale: 1.5,
        opacity: 0.3,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        stagger: 0.3
      });

      // Pulse animation for logo
      gsap.to('.logo-pulse', {
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-gradient-to-br from-aut-maroon via-aut-maroon-dark to-gray-900 flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-aut-gold/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-aut-gold/30 rounded-full blur-xl animate-pulse"></div>
      </div>

      {/* Floating Particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        <div className="particle particle-1 absolute top-1/4 left-1/4 w-8 h-8 bg-aut-gold/40 rounded-full blur-sm"></div>
        <div className="particle particle-2 absolute top-1/3 right-1/3 w-6 h-6 bg-white/30 rounded-full blur-sm"></div>
        <div className="particle particle-3 absolute bottom-1/3 left-1/3 w-10 h-10 bg-aut-gold/30 rounded-full blur-sm"></div>
        <div className="particle particle-4 absolute bottom-1/4 right-1/4 w-7 h-7 bg-white/40 rounded-full blur-sm"></div>
        <div className="particle particle-5 absolute top-1/2 left-1/5 w-9 h-9 bg-aut-gold/35 rounded-full blur-sm"></div>
        <div className="particle particle-6 absolute top-2/3 right-1/5 w-5 h-5 bg-white/35 rounded-full blur-sm"></div>
        
        {/* Sparkles */}
        <Sparkles className="sparkle absolute top-1/4 left-1/2 h-6 w-6 text-aut-gold/60" />
        <Sparkles className="sparkle absolute top-2/3 right-1/3 h-8 w-8 text-white/40" />
        <Sparkles className="sparkle absolute bottom-1/4 left-1/6 h-4 w-4 text-aut-gold/50" />
        <Sparkles className="sparkle absolute top-1/6 right-1/2 h-7 w-7 text-white/30" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <div ref={logoRef} className="mb-8">
          <div className="logo-pulse relative inline-block">
            <div className="w-32 h-32 bg-gradient-to-br from-aut-gold to-yellow-300 rounded-full flex items-center justify-center shadow-2xl mb-4">
              <GraduationCap className="h-16 w-16 text-aut-maroon" />
            </div>
            
            {/* Floating Icons around Logo */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="h-4 w-4 text-aut-maroon" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-aut-maroon rounded-full flex items-center justify-center shadow-lg">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div className="absolute top-1/2 -right-4 w-6 h-6 bg-aut-gold rounded-full flex items-center justify-center shadow-lg">
              <Star className="h-3 w-3 text-aut-maroon" />
            </div>
            <div className="absolute top-1/2 -left-4 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Target className="h-3 w-3 text-aut-maroon" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div ref={textRef} className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            AUT Handshake
          </h1>
          <p className="text-xl text-gray-200 max-w-md mx-auto">
            Your career journey starts here
          </p>
        </div>

        {/* Progress Bar */}
        <div ref={progressRef} className="w-80 mx-auto">
          <div className="bg-white/20 rounded-full h-2 mb-4 overflow-hidden">
            <div className="progress-bar h-full bg-gradient-to-r from-aut-gold to-yellow-300 rounded-full w-0 transition-all duration-300"></div>
          </div>
          <div className="loading-text text-gray-300 text-sm opacity-0">
            Loading your opportunities...
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-aut-gold to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-aut-gold to-transparent"></div>
    </div>
  );
}