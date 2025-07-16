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

// Material Design components
import { Card } from './ui/Card';
import Button from './ui/Button';
import Typography from './ui/Typography';

export default function LandingPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
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

  return (
    <div className={`min-h-screen relative transition-colors duration-300 ${
      isDark ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      {/* Material Design decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className={`absolute top-20 right-1/4 w-2 h-2 rounded-full ${
          isDark ? 'bg-lime/30' : 'bg-aut-maroon/30'
        }`} />
        <div className={`absolute top-1/3 left-1/5 w-1 h-1 rounded-full ${
          isDark ? 'bg-dark-accent/25' : 'bg-aut-gold/25'
        }`} />
        <div className={`absolute top-2/3 right-1/3 w-1.5 h-1.5 rounded-full ${
          isDark ? 'bg-lime/20' : 'bg-aut-maroon/20'
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

      {/* Handshake-style Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
            {/* Large Logo Section */}
            <div className="lg:col-span-5">
              <Typography 
                variant="h1" 
                className="text-6xl md:text-7xl font-bold text-lime italic transform -skew-x-12"
                style={{ fontFamily: 'serif' }}
              >
                Handshake
              </Typography>
            </div>

            {/* Navigation Columns */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Students Column */}
              <div className="space-y-4">
                <Typography variant="h6" className="font-bold text-white mb-4">
                  Students
                </Typography>
                <div className="space-y-3">
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    How it works
                  </Typography>
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Who's hiring
                  </Typography>
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Career tips
                  </Typography>
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Companies
                  </Typography>
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Job roles
                  </Typography>
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Help center
                  </Typography>
                </div>
              </div>

              {/* Employers Column */}
              <div className="space-y-4">
                <Typography variant="h6" className="font-bold text-white mb-4">
                  Employers
                </Typography>
                <div className="space-y-3">
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Solutions
                  </Typography>
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Products
                  </Typography>
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Customers
                  </Typography>
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Resources
                  </Typography>
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Blog
                  </Typography>
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Request demo
                  </Typography>
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Help center
                  </Typography>
                </div>
              </div>

              {/* Career Centers Column */}
              <div className="space-y-4">
                <Typography variant="h6" className="font-bold text-white mb-4">
                  Career centers
                </Typography>
                <div className="space-y-3">
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Marketing toolkit
                  </Typography>
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Resources
                  </Typography>
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Events
                  </Typography>
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Security
                  </Typography>
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Request demo
                  </Typography>
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Help center
                  </Typography>
                </div>
              </div>

              {/* Company Column */}
              <div className="space-y-4">
                <Typography variant="h6" className="font-bold text-white mb-4">
                  Company
                </Typography>
                <div className="space-y-3">
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    About
                  </Typography>
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Handshake AI
                  </Typography>
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Join us
                  </Typography>
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Press
                  </Typography>
                  <Typography variant="body2" className="text-lime hover:text-lime cursor-pointer transition-colors">
                    Blog
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Download Section */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-700">
            <div className="flex items-center space-x-6 mb-6 md:mb-0">
              <Typography variant="h6" className="text-white font-semibold">
                Download Handshake
              </Typography>
              <div className="flex items-center space-x-4">
                {/* QR Code */}
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <div className="grid grid-cols-8 gap-px">
                    {[...Array(64)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <Typography variant="caption" className="text-gray-400">
                    Scan to download
                  </Typography>
                  <Typography variant="caption" className="text-gray-400">
                    iOS & Android
                  </Typography>
                </div>
              </div>
            </div>

            {/* Social Links & Copyright */}
            <div className="text-center md:text-right">
              <div className="flex justify-center md:justify-end space-x-6 mb-4">
                <Typography variant="body2" className="text-gray-400 hover:text-lime cursor-pointer transition-colors">
                  Privacy Policy
                </Typography>
                <Typography variant="body2" className="text-gray-400 hover:text-lime cursor-pointer transition-colors">
                  Terms of Service
                </Typography>
                <Typography variant="body2" className="text-gray-400 hover:text-lime cursor-pointer transition-colors">
                  Contact Us
                </Typography>
              </div>
              <Typography variant="caption" className="text-gray-500">
                © 2025 American University of Technology. All rights reserved.
              </Typography>
            </div>
          </div>
        </div>
      </footer>

      {/* Material Design FAB */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
      
      </div>
    </div>
  );
}