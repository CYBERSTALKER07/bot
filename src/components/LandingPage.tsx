import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  RocketLaunch, 
  AutoAwesome, 
  Favorite, 
  EmojiEvents,
  LocalCafe,
  StarBorder
} from '@mui/icons-material';

// Landing page sections
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
import SplashScreen from './SplashScreen';

// Material Design components
import { Card } from './ui/Card';
import Button from './ui/Button';
import Typography from './ui/Typography';

export default function LandingPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  
  // Create refs for all sections with correct names
  const heroRef = useRef<HTMLDivElement>(null);
  const companiesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionId: string) => {
    const refs = {
      hero: heroRef,
      companies: companiesRef,
      stats: statsRef,
      features: featuresRef,
      howItWorks: howItWorksRef,
      testimonials: testimonialsRef,
      demo: demoRef,
      cta: ctaRef
    };

    const targetRef = refs[sectionId as keyof typeof refs];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Simplified splash screen logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className={`min-h-screen relative transition-colors duration-300 ${
      isDark ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      {/* Material Design decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className={`absolute top-20 right-1/4 w-2 h-2 rounded-full ${
          isDark ? 'bg-lime/30' : 'bg-asu-maroon/30'
        }`} />
        <div className={`absolute top-1/3 left-1/5 w-1 h-1 rounded-full ${
          isDark ? 'bg-dark-accent/25' : 'bg-asu-gold/25'
        }`} />
        <div className={`absolute top-2/3 right-1/3 w-1.5 h-1.5 rounded-full ${
          isDark ? 'bg-lime/20' : 'bg-asu-maroon/20'
        }`} />
      </div>

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

      {/* Material Design Footer */}
      <footer className={`py-16 transition-colors duration-300 ${
        isDark ? 'bg-dark-surface' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center" elevation={2}>
            <div className="p-8 space-y-6">
              <div className="flex justify-center">
                <img 
                  src="/asu-logo.png" 
                  alt="ASU Logo" 
                  className="h-12 w-auto opacity-80"
                />
              </div>
              <Typography variant="h6" color="textPrimary" className="font-bold">
                Arizona State University Career Services
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Connecting Sun Devils with their dream careers since 1885
              </Typography>
              <div className="flex justify-center space-x-4 pt-4">
                <Button variant="text" size="small" color="primary">Privacy Policy</Button>
                <Button variant="text" size="small" color="primary">Terms of Service</Button>
                <Button variant="text" size="small" color="primary">Contact Us</Button>
              </div>
              <Typography variant="caption" color="textSecondary">
                © 2024 Arizona State University. All rights reserved.
              </Typography>
            </div>
          </Card>
        </div>
      </footer>

      {/* Material Design FAB */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
        <Button
          variant="fab"
          color="primary"
          size="large"
          onClick={() => navigate('/register')}
          className="shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <RocketLaunch />
        </Button>
        <Button
          variant="fab"
          color="secondary"
          size="medium"
          onClick={() => scrollToSection('features')}
          className="shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <AutoAwesome />
        </Button>
      </div>
    </div>
  );
}