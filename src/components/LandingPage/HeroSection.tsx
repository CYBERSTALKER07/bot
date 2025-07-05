import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  GraduationCap, 
  Building2, 
  ArrowRight,
  TrendingUp,
  Trophy,
  Zap,
  Heart,
  Sparkles,
  Coffee,
  ChevronDown,
  Smile
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLDivElement>;
}

export default function HeroSection({ heroRef }: HeroSectionProps) {
  const { isDark } = useTheme();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced Hero Section Animations
      const heroTl = gsap.timeline();
      
      heroTl.from('.hero-title', {
        duration: 1.5,
        y: 120,
        opacity: 0,
        ease: 'power4.out',
        rotation: 5
      })
      .from('.hero-subtitle', {
        duration: 1.2,
        y: 60,
        opacity: 0,
        ease: 'power3.out'
      }, '-=0.8')
      .from('.hero-buttons', {
        duration: 1,
        y: 40,
        opacity: 0,
        scale: 0.9,
        ease: 'back.out(1.7)'
      }, '-=0.6')
      .from('.hero-mockup', {
        duration: 2,
        scale: 0.7,
        opacity: 0,
        rotation: -10,
        ease: 'power3.out'
      }, '-=1.2')
      .from('.hero-stats-card', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: 'power2.out',
        stagger: 0.1
      }, '-=0.5')
      .from('.success-metric', {
        duration: 1.2,
        scale: 0.3,
        opacity: 0,
        ease: 'back.out(1.7)',
        stagger: 0.15
      }, '-=0.3')
      .to('.success-metric', {
        duration: 0.6,
        scale: 1.1,
        ease: 'power2.out'
      })
      .from('.floating-element', {
        duration: 1.5,
        scale: 0,
        opacity: 0,
        ease: 'elastic.out(1, 0.3)',
        stagger: 0.2
      }, '-=1');

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

      // Mouse follower effect for hero section
      const heroSection = heroRef.current;
      if (heroSection) {
        const handleMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const { offsetWidth, offsetHeight } = heroSection;
          const xPos = (clientX / offsetWidth - 0.5) * 20;
          const yPos = (clientY / offsetHeight - 0.5) * 20;

          gsap.to('.hero-mockup', {
            duration: 1,
            x: xPos,
            y: yPos,
            ease: 'power2.out'
          });
        };

        heroSection.addEventListener('mousemove', handleMouseMove);
      }

    });

    return () => ctx.revert();
  }, [heroRef]);

  return (
    <section ref={heroRef} className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-dark-bg via-dark-surface to-gray-900' 
        : 'bg-gradient-to-br from-asu-maroon via-asu-maroon-dark to-gray-900'
    }`}>
      {/* Hand-drawn style background elements */}
      <div className="absolute inset-0">
        <div className={`float-1 floating-element absolute top-16 left-8 w-28 h-28 rounded-full blur-2xl transform rotate-12 ${
          isDark ? 'bg-lime/20' : 'bg-asu-gold/20'
        }`}></div>
        <div className={`float-2 floating-element absolute top-32 right-16 w-36 h-36 rounded-full blur-3xl transform -rotate-6 ${
          isDark ? 'bg-dark-accent/10' : 'bg-white/10'
        }`}></div>
        <div className={`float-3 floating-element absolute bottom-16 left-1/3 w-32 h-32 rounded-full blur-2xl transform rotate-45 ${
          isDark ? 'bg-lime/25' : 'bg-asu-gold/25'
        }`}></div>
        <Sparkles className={`sparkle absolute top-1/4 left-1/4 h-8 w-8 ${
          isDark ? 'text-lime/60' : 'text-asu-gold/60'
        }`} />
        <Sparkles className={`sparkle absolute top-3/4 right-1/3 h-6 w-6 ${
          isDark ? 'text-dark-accent/40' : 'text-white/40'
        }`} />
        <Sparkles className={`sparkle absolute top-1/2 left-1/6 h-5 w-5 ${
          isDark ? 'text-lime/50' : 'text-asu-gold/50'
        }`} />
        <Coffee className={`sparkle absolute top-1/3 right-1/4 h-6 w-6 ${
          isDark ? 'text-lime/40' : 'text-asu-gold/40'
        }`} />
        <Heart className={`sparkle absolute bottom-1/3 left-1/2 h-5 w-5 ${
          isDark ? 'text-dark-accent/30' : 'text-white/30'
        }`} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`transform -rotate-1 ${
            isDark ? 'text-dark-text' : 'text-white'
          }`}>
            <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6 leading-tight relative">
              Your Career
              <span className={`block bg-clip-text text-transparent animate-pulse transform rotate-1 ${
                isDark 
                  ? 'bg-gradient-to-r from-lime via-dark-accent to-lime' 
                  : 'bg-gradient-to-r from-asu-gold via-yellow-300 to-asu-gold'
              }`}>
                Starts Here ✨
              </span>
              <div className="absolute -top-3 -right-8 text-4xl animate-bounce">🎯</div>
            </h1>
            <p className={`hero-subtitle text-xl md:text-2xl mb-8 leading-relaxed transform rotate-0.5 ${
              isDark ? 'text-dark-muted' : 'text-gray-200'
            }`}>
              Connect with amazing companies, find your dream internship, and launch your career at Arizona State University's most human job platform! 🌟
            </p>
            <div className="hero-buttons flex flex-col sm:flex-row gap-4">
              <Link to="/register?role=student" className={`group px-8 py-4 rounded-full font-semibold text-lg transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:-rotate-1 flex items-center justify-center relative overflow-hidden ${
                isDark 
                  ? 'bg-gradient-to-r from-lime to-dark-accent text-dark-surface hover:from-dark-accent hover:to-lime' 
                  : 'bg-gradient-to-r from-asu-gold to-yellow-300 text-asu-maroon hover:from-yellow-300 hover:to-asu-gold'
              }`}>
                <span className="relative z-10">Find My Dream Job 🚀</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform rotate-12 ${
                  isDark ? 'bg-dark-surface/20' : 'bg-white/20'
                }`}></div>
              </Link>
              <Link to="/register?role=employer" className={`group border-2 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:rotate-1 flex items-center justify-center relative overflow-hidden ${
                isDark 
                  ? 'border-lime text-lime hover:bg-lime hover:text-dark-surface' 
                  : 'border-white text-white hover:bg-white hover:text-asu-maroon'
              }`}>
                <span className="relative z-10">Post Amazing Jobs 💼</span>
                <Building2 className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -rotate-6 ${
                  isDark ? 'bg-gradient-to-r from-lime/10 to-lime/30' : 'bg-gradient-to-r from-white/10 to-white/30'
                }`}></div>
              </Link>
            </div>
          </div>
          
          {/* More organic hero image */}
          <div className="hero-mockup relative transform rotate-2">
            <div className={`relative z-10 backdrop-blur-2xl rounded-3xl p-8 border-2 shadow-2xl transform -rotate-1 ${
              isDark 
                ? 'bg-dark-surface/15 border-lime/30' 
                : 'bg-white/15 border-white/30'
            }`}>
              <div className={`relative w-full h-96 rounded-2xl overflow-hidden flex items-center justify-center transform rotate-1 ${
                isDark 
                  ? 'bg-gradient-to-br from-dark-surface/25 to-dark-surface/5' 
                  : 'bg-gradient-to-br from-white/25 to-white/5'
              }`}>
                <div className="text-center">
                  <div className="text-9xl mb-4 animate-pulse">🎓</div>
                  <div className={`rounded-2xl p-6 shadow-lg transform -rotate-1 ${
                    isDark ? 'bg-dark-surface/95' : 'bg-white/95'
                  }`}>
                    <h3 className={`text-2xl font-bold mb-2 ${
                      isDark ? 'text-lime' : 'text-asu-maroon'
                    }`}>Your Success Story</h3>
                    <p className={`text-lg ${
                      isDark ? 'text-dark-muted' : 'text-gray-600'
                    }`}>Starts Right Here! 🌟</p>
                    <div className={`mt-3 text-sm ${
                      isDark ? 'text-dark-muted' : 'text-gray-500'
                    }`}>Join 15,000+ students</div>
                  </div>
                </div>
              </div>

              {/* Organic floating badges */}
              <div className={`absolute -top-6 -right-6 p-3 rounded-full shadow-lg animate-bounce transform rotate-12 ${
                isDark ? 'bg-dark-surface' : 'bg-white'
              }`}>
                <Trophy className={`h-6 w-6 ${
                  isDark ? 'text-lime' : 'text-asu-maroon'
                }`} />
              </div>
              <div className={`absolute -bottom-6 -left-6 p-3 rounded-full shadow-lg animate-pulse transform -rotate-12 ${
                isDark ? 'bg-lime' : 'bg-asu-maroon'
              }`}>
                <Zap className={`h-6 w-6 ${
                  isDark ? 'text-dark-surface' : 'text-white'
                }`} />
              </div>
              <div className={`absolute top-1/2 -right-8 p-2 rounded-full shadow-lg transform rotate-45 ${
                isDark ? 'bg-lime' : 'bg-asu-gold'
              }`}>
                <TrendingUp className={`h-5 w-5 ${
                  isDark ? 'text-dark-surface' : 'text-asu-maroon'
                }`} />
              </div>
              <div className={`absolute bottom-8 -left-4 p-2 rounded-full shadow-lg transform -rotate-45 ${
                isDark ? 'bg-dark-surface' : 'bg-white'
              }`}>
                <Smile className={`h-5 w-5 ${
                  isDark ? 'text-lime' : 'text-asu-maroon'
                }`} />
              </div>
            </div>

            {/* Organic background decoration */}
            <div className={`absolute inset-0 rounded-3xl transform rotate-6 scale-105 blur-sm ${
              isDark 
                ? 'bg-gradient-to-t from-lime/20 to-transparent' 
                : 'bg-gradient-to-t from-asu-maroon/20 to-transparent'
            }`}></div>
            
            {/* Hand-drawn style success metrics */}
            <div className={`hero-stats-card success-metric absolute bottom-6 left-6 backdrop-blur-sm rounded-xl p-4 shadow-lg transform rotate-3 ${
              isDark ? 'bg-dark-surface/98' : 'bg-white/98'
            }`}>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  isDark ? 'text-lime' : 'text-asu-maroon'
                }`}>95%</div>
                <div className={`text-xs font-medium ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}>Happy Students 😊</div>
              </div>
            </div>
            
            <div className={`hero-stats-card success-metric absolute top-6 left-6 backdrop-blur-sm rounded-xl p-4 shadow-lg transform -rotate-2 ${
              isDark ? 'bg-dark-surface/98' : 'bg-white/98'
            }`}>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  isDark ? 'text-lime' : 'text-asu-maroon'
                }`}>2.5k+</div>
                <div className={`text-xs font-medium ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}>Dream Jobs 💼</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Organic scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce ${
        isDark ? 'text-dark-text' : 'text-white'
      }`}>
        <div className="flex flex-col items-center space-y-2 transform rotate-1">
          <span className="text-sm font-medium">Scroll for magic ✨</span>
          <ChevronDown className="h-8 w-8 animate-pulse" />
        </div>
      </div>
    </section>
  );
}