import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import all the separate landing page components
import Navigation from './LandingPage/Navigation';
import HeroSection from './LandingPage/HeroSection';
import CompanySection from './LandingPage/CompanySection';
import StatsSection from './LandingPage/StatsSection';
import FeaturesSection from './LandingPage/FeaturesSection';
import HowItWorksSection from './LandingPage/HowItWorksSection';
import CareerPathSection from './LandingPage/CareerPathSection';
import TestimonialsSection from './LandingPage/TestimonialsSection';
import DemoSection from './LandingPage/DemoSection';
import CTASection from './LandingPage/CTASection';
import { useTheme } from '../context/ThemeContext';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const { isDark } = useTheme();
  
  // Refs for each section
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const companiesRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionName: string) => {
    const sectionMap: Record<string, React.RefObject<HTMLDivElement>> = {
      hero: heroRef,
      stats: statsRef,
      features: featuresRef,
      companies: companiesRef,
      howItWorks: howItWorksRef,
      testimonials: testimonialsRef,
      demo: demoRef,
      cta: ctaRef
    };

    const ref = sectionMap[sectionName];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-dark-bg to-dark-surface' 
        : 'bg-gradient-to-b from-white to-gray-50'
    }`}>
      {/* Navigation */}
      <Navigation onScrollToSection={scrollToSection} />

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
      <CareerPathSection />

      {/* Testimonials Section */}
      <TestimonialsSection testimonialsRef={testimonialsRef} />

      {/* Demo Section */}
      <DemoSection demoRef={demoRef} />

      {/* CTA Section */}
      <CTASection ctaRef={ctaRef} />
    </div>
  );
}