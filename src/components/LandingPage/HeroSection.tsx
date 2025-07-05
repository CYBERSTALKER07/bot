import React, { useRef, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Building2, 
  Sparkles, 
  Coffee, 
  Heart, 
  ChevronDown,
  Trophy,
  Zap,
  TrendingUp,
  Smile
} from 'lucide-react';

interface HeroSectionProps {
  className?: string;
}

const HeroSection = forwardRef<HTMLDivElement, HeroSectionProps>(({ className = '' }, ref) => {
  return (
    <section 
      ref={ref}
      className={`relative min-h-screen flex items-center justify-center bg-gradient-to-br from-asu-maroon via-asu-maroon-dark to-gray-900 overflow-hidden ${className}`}
    >
      {/* Hand-drawn style background elements */}
      <div className="absolute inset-0">
        <div className="float-1 floating-element absolute top-16 left-8 w-28 h-28 bg-asu-gold/20 rounded-full blur-2xl transform rotate-12"></div>
        <div className="float-2 floating-element absolute top-32 right-16 w-36 h-36 bg-white/10 rounded-full blur-3xl transform -rotate-6"></div>
        <div className="float-3 floating-element absolute bottom-16 left-1/3 w-32 h-32 bg-asu-gold/25 rounded-full blur-2xl transform rotate-45"></div>
        <Sparkles className="sparkle absolute top-1/4 left-1/4 h-8 w-8 text-asu-gold/60" />
        <Sparkles className="sparkle absolute top-3/4 right-1/3 h-6 w-6 text-white/40" />
        <Sparkles className="sparkle absolute top-1/2 left-1/6 h-5 w-5 text-asu-gold/50" />
        <Coffee className="sparkle absolute top-1/3 right-1/4 h-6 w-6 text-asu-gold/40" />
        <Heart className="sparkle absolute bottom-1/3 left-1/2 h-5 w-5 text-white/30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white transform -rotate-1">
            <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6 leading-tight relative">
              Your Career
              <span className="block bg-gradient-to-r from-asu-gold via-yellow-300 to-asu-gold bg-clip-text text-transparent animate-pulse transform rotate-1">
                Starts Here ✨
              </span>
              <div className="absolute -top-3 -right-8 text-4xl animate-bounce">🎯</div>
            </h1>
            <p className="hero-subtitle text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed transform rotate-0.5">
              Connect with amazing companies, find your dream internship, and launch your career at Arizona State University's most human job platform! 🌟
            </p>
            <div className="hero-buttons flex flex-col sm:flex-row gap-4">
              <Link to="/register?role=student" className="group bg-gradient-to-r from-asu-gold to-yellow-300 text-asu-maroon px-8 py-4 rounded-full font-semibold text-lg hover:from-yellow-300 hover:to-asu-gold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:-rotate-1 flex items-center justify-center relative overflow-hidden">
                <span className="relative z-10">Find My Dream Job 🚀</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform rotate-12"></div>
              </Link>
              <Link to="/register?role=employer" className="group border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-asu-maroon transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:rotate-1 flex items-center justify-center relative overflow-hidden">
                <span className="relative z-10">Post Amazing Jobs 💼</span>
                <Building2 className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -rotate-6"></div>
              </Link>
            </div>
          </div>
          
          {/* More organic hero image */}
          <div className="hero-mockup relative transform rotate-2">
            <div className="relative z-10 bg-white/15 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/30 shadow-2xl transform -rotate-1">
              <div className="relative w-full h-96 bg-gradient-to-br from-white/25 to-white/5 rounded-2xl overflow-hidden flex items-center justify-center transform rotate-1">
                <div className="text-center">
                  <div className="text-9xl mb-4 animate-pulse">🎓</div>
                  <div className="bg-white/95 rounded-2xl p-6 shadow-lg transform -rotate-1">
                    <h3 className="text-2xl font-bold text-asu-maroon mb-2">Your Success Story</h3>
                    <p className="text-gray-600 text-lg">Starts Right Here! 🌟</p>
                    <div className="mt-3 text-sm text-gray-500">Join 15,000+ students</div>
                  </div>
                </div>
              </div>

              {/* Organic floating badges */}
              <div className="absolute -top-6 -right-6 bg-white p-3 rounded-full shadow-lg animate-bounce transform rotate-12">
                <Trophy className="h-6 w-6 text-asu-maroon" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-asu-maroon p-3 rounded-full shadow-lg animate-pulse transform -rotate-12">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="absolute top-1/2 -right-8 bg-asu-gold p-2 rounded-full shadow-lg transform rotate-45">
                <TrendingUp className="h-5 w-5 text-asu-maroon" />
              </div>
              <div className="absolute bottom-8 -left-4 bg-white p-2 rounded-full shadow-lg transform -rotate-45">
                <Smile className="h-5 w-5 text-asu-maroon" />
              </div>
            </div>

            {/* Organic background decoration */}
            <div className="absolute inset-0 bg-gradient-to-t from-asu-maroon/20 to-transparent rounded-3xl transform rotate-6 scale-105 blur-sm"></div>
            
            {/* Hand-drawn style success metrics */}
            <div className="absolute bottom-6 left-6 bg-white/98 backdrop-blur-sm rounded-xl p-4 shadow-lg transform rotate-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-asu-maroon">95%</div>
                <div className="text-xs text-gray-600 font-medium">Happy Students 😊</div>
              </div>
            </div>
            
            <div className="absolute top-6 left-6 bg-white/98 backdrop-blur-sm rounded-xl p-4 shadow-lg transform -rotate-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-asu-maroon">2.5k+</div>
                <div className="text-xs text-gray-600 font-medium">Dream Jobs 💼</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Organic scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="flex flex-col items-center space-y-2 transform rotate-1">
          <span className="text-sm font-medium">Scroll for magic ✨</span>
          <ChevronDown className="h-8 w-8 animate-pulse" />
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;