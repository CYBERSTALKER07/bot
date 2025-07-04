import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { GraduationCap } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create timeline for splash screen
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(onComplete, 500);
        }
      });

      // Initial state
      gsap.set([logoRef.current, textRef.current], {
        opacity: 0,
        scale: 0.5,
        y: 50
      });

      // Main animation sequence
      tl.to(logoRef.current, {
        duration: 1,
        opacity: 1,
        scale: 1,
        y: 0,
        ease: 'back.out(1.7)'
      })
      .to(textRef.current, {
        duration: 0.8,
        opacity: 1,
        scale: 1,
        y: 0,
        ease: 'power3.out'
      }, '-=0.5')
      .to([logoRef.current, textRef.current], {
        duration: 0.8,
        opacity: 0,
        scale: 0.8,
        y: -30,
        ease: 'power2.in'
      }, '+=1.5')
      .to(containerRef.current, {
        duration: 0.6,
        opacity: 0,
        ease: 'power2.in'
      }, '-=0.3');

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
    >
      <div className="text-center">
        {/* Logo */}
        <div ref={logoRef} className="mb-8">
          <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-lg mb-4 bg-red-900 mx-auto">
            <GraduationCap className="h-16 w-16 text-white" />
          </div>
        </div>

        {/* Text */}
        <div ref={textRef}>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-red-900">
            AUT Handshake
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Your professional career journey starts here
          </p>
        </div>
      </div>
    </div>
  );
}