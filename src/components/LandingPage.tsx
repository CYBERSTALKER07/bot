import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Sparkles,
  Coffee,
  Heart,
  Star,
  Rocket,
  GraduationCap
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Import section components
import Navigation from './LandingPage/Navigation';
import HeroSection from './LandingPage/HeroSection';
import CompanySection from './LandingPage/CompanySection';
import StatsSection from './LandingPage/StatsSection';
import FeaturesSection from './LandingPage/FeaturesSection';
import HowItWorksSection from './LandingPage/HowItWorksSection';
import TestimonialsSection from './LandingPage/TestimonialsSection';
import DemoSection from './LandingPage/DemoSection';
import CTASection from './LandingPage/CTASection';
import CareerPathSection from './LandingPage/CareerPathSection';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create refs for all sections with correct names
  const heroRef = useRef<HTMLDivElement>(null);
  const companiesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const careerPathRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  


  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Splash Screen Animation
      if (showSplash) {
        const splashTl = gsap.timeline({
          onComplete: () => {
            setShowSplash(false);
          }
        });

        splashTl.from('.splash-letter', {
          duration: 0.8,
          y: 100,
          opacity: 0,
          rotation: 45,
          scale: 0.3,
          ease: 'back.out(1.7)',
          stagger: 0.15
        })
        .from('.splash-handshake', {
          duration: 1.2,
          y: 50,
          opacity: 0,
          scale: 0.8,
          ease: 'elastic.out(1, 0.3)'
        }, '-=0.3')
        .from('.splash-tagline', {
          duration: 0.8,
          y: 30,
          opacity: 0,
          ease: 'power2.out'
        }, '-=0.5')
        .from('.splash-icon', {
          duration: 1,
          scale: 0,
          rotation: 360,
          opacity: 0,
          ease: 'elastic.out(1, 0.3)'
        }, '-=0.8')
        .to('.splash-letter', {
          duration: 0.6,
          scale: 1.2,
          color: '#FFC627',
          ease: 'power2.out',
          stagger: 0.1
        }, '+=0.5')
        .to('.splash-letter', {
          duration: 0.4,
          scale: 1,
          ease: 'power2.out',
          stagger: 0.1
        })
        .to('.splash-container', {
          duration: 1,
          scale: 0.8,
          opacity: 0,
          ease: 'power2.in'
        }, '+=1');

        gsap.to('.splash-sparkle', {
          scale: 1.5,
          opacity: 0.3,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
          stagger: 0.2
        });
      }

      // Floating decorations
      gsap.to('.floating-element', {
        y: -15,
        x: 10,
        rotation: 360,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.5
      });

      // Enhanced floating animations
      gsap.to('.float-1', {
        y: -30,
        x: 20,
        rotation: 360,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });

      gsap.to('.float-2', {
        y: -25,
        x: -15,
        rotation: -180,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 0.7
      });

      gsap.to('.float-3', {
        y: -35,
        x: 10,
        rotation: 270,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 1.2
      });

      // Sparkle animations
      gsap.to('.sparkle', {
        scale: 1.5,
        opacity: 0.3,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        stagger: 0.3
      });

    }, containerRef);

    return () => ctx.revert();
  }, [showSplash]);

  return (
    <div ref={containerRef} className={`min-h-screen ${
      isDark ? 'bg-dark-bg text-dark-text' : 'bg-white text-gray-900'
    }`}>
      {/* Splash Screen */}
      {showSplash && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-br from-asu-maroon via-asu-maroon-dark to-gray-900 flex items-center justify-center">
          <div className="splash-container text-center relative">
            <div className="absolute inset-0 pointer-events-none">
              <Sparkles className="splash-sparkle absolute top-10 left-10 h-8 w-8 text-asu-gold/50" />
              <Sparkles className="splash-sparkle absolute bottom-10 right-10 h-6 w-6 text-white/30" />
              <Sparkles className="splash-sparkle absolute top-20 right-20 h-10 w-10 text-asu-gold/40" />
              <Sparkles className="splash-sparkle absolute bottom-20 left-20 h-7 w-7 text-white/40" />
            </div>

            <div className="relative mb-8">
              <div className="splash-icon mb-6">
                <GraduationCap className="h-20 w-20 text-asu-gold mx-auto" />
              </div>
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="splash-letter text-8xl font-bold text-white">A</span>
                <span className="splash-letter text-8xl font-bold text-white">S</span>
                <span className="splash-letter text-8xl font-bold text-white">U</span>
              </div>
              
              <div className="splash-handshake text-4xl font-bold text-asu-gold mb-6">
                Handshake
              </div>
              
              <p className="splash-tagline text-xl text-gray-200 max-w-md mx-auto">
                Your Career Journey Starts Here
              </p>
            </div>

            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-asu-gold to-yellow-300 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <Sparkles className={`floating-element absolute top-20 left-20 h-6 w-6 ${
          isDark ? 'text-lime/30' : 'text-asu-gold/30'
        }`} />
        <Coffee className={`floating-element absolute top-40 right-32 h-5 w-5 ${
          isDark ? 'text-dark-accent/40' : 'text-asu-maroon/40'
        }`} />
        <Heart className={`floating-element absolute bottom-32 left-1/4 h-4 w-4 ${
          isDark ? 'text-lime/50' : 'text-asu-gold/50'
        }`} />
        <Star className={`floating-element absolute top-1/2 right-20 h-5 w-5 ${
          isDark ? 'text-dark-accent/30' : 'text-asu-maroon/30'
        }`} />
        <Rocket className={`floating-element absolute bottom-20 right-1/3 h-6 w-6 ${
          isDark ? 'text-lime/40' : 'text-asu-gold/40'
        }`} />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection heroRef={heroRef} />

      {/* Company Section */}
      <CompanySection companiesRef={companiesRef} />

      {/* Stats Section */}
      <StatsSection statsRef={statsRef} />

      {/* Features Section */}
      <FeaturesSection featuresRef={featuresRef} />

      {/* How It Works Section */}
      <HowItWorksSection howItWorksRef={howItWorksRef} />

      {/* Career Path Section */}
      <CareerPathSection careerPathRef={careerPathRef} />

      {/* Testimonials Section */}
      <TestimonialsSection testimonialsRef={testimonialsRef} />

      {/* Demo Section */}
      <DemoSection demoRef={demoRef} />

      {/* CTA Section */}
      <CTASection ctaRef={ctaRef} />

      {/* Footer */}
      <footer className={`py-12 border-t ${
        isDark 
          ? 'bg-dark-surface border-gray-700' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-lime/20' : 'bg-asu-maroon/10'
              }`}>
                <GraduationCap className={`h-6 w-6 ${
                  isDark ? 'text-lime' : 'text-asu-maroon'
                }`} />
              </div>
              <span className="font-bold text-xl">ASU Handshake</span>
            </div>
            
            <p className={`text-sm text-center md:text-right ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}>
              © 2024 ASU Handshake. All rights reserved.<br />
              Empowering careers, connecting futures.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}