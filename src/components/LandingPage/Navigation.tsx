import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Sparkles } from 'lucide-react';

interface NavigationProps {
  scrollToSection: (ref: React.RefObject<HTMLDivElement>) => void;
  featuresRef: React.RefObject<HTMLDivElement>;
  howItWorksRef: React.RefObject<HTMLDivElement>;
  demoRef: React.RefObject<HTMLDivElement>;
}

export default function Navigation({ scrollToSection, featuresRef, howItWorksRef, demoRef }: NavigationProps) {
  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl z-50 border-b-4 border-asu-maroon/20 shadow-lg transform rotate-0.5">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-asu-maroon via-asu-gold to-asu-maroon opacity-60"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3 group">
            <div className="relative transform group-hover:rotate-12 transition-transform duration-300">
              <GraduationCap className="h-9 w-9 text-asu-maroon" />
              <Sparkles className="sparkle absolute -top-1 -right-1 h-4 w-4 text-asu-gold" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-asu-gold/50 rounded-full animate-pulse"></div>
            </div>
            <span className="font-bold text-xl text-gray-900 relative">
              ASU Handshake
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-asu-maroon/30 transform -skew-x-12"></div>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection(featuresRef)} className="text-gray-600 hover:text-asu-maroon transition-all duration-300 hover:scale-105 transform hover:-rotate-1 relative group">
              Features
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-asu-maroon transition-all duration-300 group-hover:w-full transform -skew-x-12"></div>
            </button>
            <button onClick={() => scrollToSection(howItWorksRef)} className="text-gray-600 hover:text-asu-maroon transition-all duration-300 hover:scale-105 transform hover:rotate-1 relative group">
              How it Works
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-asu-maroon transition-all duration-300 group-hover:w-full transform skew-x-12"></div>
            </button>
            <button onClick={() => scrollToSection(demoRef)} className="text-gray-600 hover:text-asu-maroon transition-all duration-300 hover:scale-105 transform hover:-rotate-1 relative group">
              Demo
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-asu-maroon transition-all duration-300 group-hover:w-full transform -skew-x-12"></div>
            </button>
            <Link to="/login" className="text-gray-600 hover:text-asu-maroon transition-all duration-300 hover:scale-105 transform hover:rotate-1 relative group">
              Sign In
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-asu-maroon transition-all duration-300 group-hover:w-full transform skew-x-12"></div>
            </Link>
            <Link to="/register" className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-6 py-2 rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:rotate-1 relative overflow-hidden">
              <span className="relative z-10">Get Started 🚀</span>
              <div className="absolute inset-0 bg-gradient-to-r from-asu-gold/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}