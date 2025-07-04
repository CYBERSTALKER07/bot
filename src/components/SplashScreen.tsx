import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { GraduationCap, Sparkles, Trophy, Zap, Star, Target, Heart, Rocket, Crown, Diamond } from 'lucide-react';
import { School, Engineering } from '@mui/icons-material';

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

      // Burgundy glow animation
      gsap.to('.burgundy-glow', {
        opacity: 0.8,
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
      className="fixed inset-0 z-50 overflow-hidden relative"
      style={{
        background: `
          radial-gradient(circle at 20% 20%, rgba(139, 0, 0, 0.4) 0%, transparent 60%),
          radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.3) 0%, transparent 60%),
          radial-gradient(circle at 40% 60%, rgba(139, 0, 0, 0.3) 0%, transparent 60%),
          radial-gradient(circle at 60% 40%, rgba(255, 255, 255, 0.2) 0%, transparent 60%),
          radial-gradient(circle at 90% 10%, rgba(139, 0, 0, 0.5) 0%, transparent 60%),
          linear-gradient(135deg, 
            #8b0000 0%, 
            #a50000 25%, 
            #ffffff 50%, 
            #a50000 75%, 
            #8b0000 100%
          )
        `,
        backgroundSize: '400% 400%',
        animation: 'gradientShift 10s ease infinite'
      }}
    >
      {/* Animated Background Layers */}
      <div className="absolute inset-0">
        {/* Burgundy and white color blobs */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-red-900 via-red-800 to-red-700 rounded-full blur-3xl animate-pulse opacity-50"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-br from-white via-gray-100 to-gray-200 rounded-full blur-3xl animate-pulse opacity-40" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-red-800 via-red-700 to-red-600 rounded-full blur-2xl animate-pulse opacity-50" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 right-1/3 w-36 h-36 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-full blur-2xl animate-pulse opacity-40" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/4 right-1/4 w-28 h-28 bg-gradient-to-br from-red-900 via-red-800 to-red-700 rounded-full blur-2xl animate-pulse opacity-50" style={{animationDelay: '4s'}}></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-br from-red-800 to-red-900 transform rotate-45 animate-bounce opacity-60" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-gradient-to-br from-white to-gray-100 rounded-full animate-bounce opacity-70" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/3 left-1/2 w-12 h-12 bg-gradient-to-br from-red-700 to-red-800 transform rotate-12 animate-bounce opacity-60" style={{animationDelay: '2.5s'}}></div>
      </div>

      {/* Enhanced Floating Particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {/* Burgundy and white particles */}
        <div className="particle particle-1 absolute top-1/4 left-1/4 w-8 h-8 bg-gradient-to-br from-red-800 to-red-900 rounded-full blur-sm shadow-lg"></div>
        <div className="particle particle-2 absolute top-1/3 right-1/3 w-6 h-6 bg-gradient-to-br from-white to-gray-100 rounded-full blur-sm shadow-lg"></div>
        <div className="particle particle-3 absolute bottom-1/3 left-1/3 w-10 h-10 bg-gradient-to-br from-red-700 to-red-800 rounded-full blur-sm shadow-lg"></div>
        <div className="particle particle-4 absolute bottom-1/4 right-1/4 w-7 h-7 bg-gradient-to-br from-white to-gray-50 rounded-full blur-sm shadow-lg"></div>
        <div className="particle particle-5 absolute top-1/2 left-1/5 w-9 h-9 bg-gradient-to-br from-red-900 to-red-800 rounded-full blur-sm shadow-lg"></div>
        <div className="particle particle-6 absolute top-2/3 right-1/5 w-5 h-5 bg-gradient-to-br from-white to-gray-100 rounded-full blur-sm shadow-lg"></div>
        
        {/* Additional particles */}
        <div className="particle particle-7 absolute top-1/6 left-1/2 w-6 h-6 bg-gradient-to-br from-red-800 to-red-900 rounded-full blur-sm shadow-lg"></div>
        <div className="particle particle-8 absolute bottom-1/6 right-1/2 w-8 h-8 bg-gradient-to-br from-white to-gray-100 rounded-full blur-sm shadow-lg"></div>
        
        {/* Burgundy and white sparkles */}
        <Sparkles className="sparkle absolute top-1/4 left-1/2 h-6 w-6 text-red-800 drop-shadow-lg" />
        <Sparkles className="sparkle absolute top-2/3 right-1/3 h-8 w-8 text-white drop-shadow-lg" />
        <Sparkles className="sparkle absolute bottom-1/4 left-1/6 h-4 w-4 text-red-700 drop-shadow-lg" />
        <Sparkles className="sparkle absolute top-1/6 right-1/2 h-7 w-7 text-white drop-shadow-lg" />
        <Sparkles className="sparkle absolute bottom-1/3 left-1/2 h-5 w-5 text-red-800 drop-shadow-lg" />
        <Sparkles className="sparkle absolute top-1/2 right-1/6 h-6 w-6 text-white drop-shadow-lg" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Enhanced Logo */}
        <div ref={logoRef} className="mb-8">
          <div className="logo-pulse relative inline-block">
            <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-2xl mb-4 relative overflow-hidden"
                 style={{
                   background: `
                     conic-gradient(
                       from 0deg,
                       #8b0000 0deg,
                       #ffffff 90deg,
                       #8b0000 180deg,
                       #ffffff 270deg,
                       #8b0000 360deg
                     )
                   `,
                   animation: 'spin 8s linear infinite'
                 }}>
              <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-inner">
                <GraduationCap className="h-16 w-16 text-red-900" />
              </div>
            </div>
            
            {/* Floating Icons around Logo - Burgundy and White */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{animationDelay: '0.5s'}}>
              <Zap className="h-4 w-4 text-red-800" />
            </div>
            <div className="absolute top-1/2 -right-4 w-6 h-6 bg-gradient-to-br from-red-700 to-red-800 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{animationDelay: '1s'}}>
              <Star className="h-3 w-3 text-white" />
            </div>
            <div className="absolute top-1/2 -left-4 w-6 h-6 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{animationDelay: '1.5s'}}>
              <Target className="h-3 w-3 text-red-800" />
            </div>
            <div className="absolute -top-4 left-1/2 w-7 h-7 bg-gradient-to-br from-red-900 to-red-800 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{animationDelay: '2s'}}>
              <Heart className="h-3 w-3 text-white" />
            </div>
            <div className="absolute -bottom-4 left-1/2 w-7 h-7 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{animationDelay: '2.5s'}}>
              <Rocket className="h-3 w-3 text-red-800" />
            </div>
            <div className="absolute top-0 left-0 w-5 h-5 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{animationDelay: '3s'}}>
              <Crown className="h-2 w-2 text-white" />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{animationDelay: '3.5s'}}>
              <Diamond className="h-2 w-2 text-red-800" />
            </div>
          </div>
        </div>

        {/* AUT Branded Text */}
        <div ref={textRef} className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg"
              style={{
                textShadow: '0 0 20px rgba(139, 0, 0, 0.5), 0 0 40px rgba(139, 0, 0, 0.3)'
              }}>
            AUT Handshake
          </h1>
          <p className="text-xl text-gray-100 max-w-md mx-auto drop-shadow-lg flex items-center justify-center gap-2">
            Your professional career journey starts here 
            <School className="w-6 h-6" />
          </p>
        </div>

        {/* Enhanced Progress Bar */}
        <div ref={progressRef} className="w-80 mx-auto">
          <div className="bg-white/20 rounded-full h-3 mb-4 overflow-hidden backdrop-blur-sm border border-white/30">
            <div className="progress-bar h-full rounded-full w-0 transition-all duration-300"
                 style={{
                   background: `linear-gradient(
                     90deg,
                     #8b0000 0%,
                     #ffffff 25%,
                     #8b0000 50%,
                     #ffffff 75%,
                     #8b0000 100%
                   )`,
                   backgroundSize: '400% 100%',
                   animation: 'gradientShift 3s ease infinite'
                 }}></div>
          </div>
          <div className="loading-text text-white text-sm opacity-0 drop-shadow-lg flex items-center justify-center gap-2">
            Loading your opportunities...
            <Engineering className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Decorative AUT Brand Elements */}
      <div className="absolute top-0 left-0 w-full h-2 opacity-80"
           style={{
             background: `linear-gradient(
               90deg,
               #8b0000 0%,
               #ffffff 50%,
               #8b0000 100%
             )`,
             backgroundSize: '400% 100%',
             animation: 'gradientShift 5s ease infinite'
           }}></div>
      <div className="absolute bottom-0 left-0 w-full h-2 opacity-80"
           style={{
             background: `linear-gradient(
               90deg,
               #ffffff 0%,
               #8b0000 50%,
               #ffffff 100%
             )`,
             backgroundSize: '400% 100%',
             animation: 'gradientShift 5s ease infinite reverse'
           }}></div>
      
      {/* Burgundy glow overlay */}
      <div className="burgundy-glow absolute inset-0 bg-gradient-to-r from-red-900/20 via-transparent to-red-900/20 opacity-0"></div>
      
      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}