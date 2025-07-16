import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../context/ThemeContext';
import Typography from '../ui/Typography';
import CompanyLogosBackground from '../ui/CompanyLogosBackground';
import { 
  Building2, 
  Cpu, 
  Heart, 
  Briefcase, 
  ShoppingBag, 
  Zap, 
  TrendingUp, 
  Users, 
  Star, 
  Trophy, 
  Rocket, 
  Globe, 
  Monitor, 
  Smartphone, 
  Car, 
  Plane, 
  CreditCard, 
  ShieldCheck,
  Sparkles,
  Target,
  Award,
  CheckCircle
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CompanyLogosFlowSectionProps {
  companyLogosRef: React.RefObject<HTMLDivElement>;
}

interface Company {
  name: string;
  logo: string;
  category: string;
  color: string;
  icon: React.ReactNode;
}

interface Category {
  name: string;
  icon: React.ReactNode;
  count: number;
  color: string;
}

export default function CompanyLogosFlowSection({ companyLogosRef }: CompanyLogosFlowSectionProps) {
  const { isDark } = useTheme();
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Company data with real logo URLs and category icons - Updated with enhanced logos
 
  // Text reveal animation based on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Character reveal animation for the main text
      const mainTextElements = gsap.utils.toArray('.reveal-char');
      
      ScrollTrigger.create({
        trigger: textRef.current,
        start: 'top 80%',
        end: 'bottom 80%',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          
          mainTextElements.forEach((char: any, index) => {
            const charProgress = Math.max(0, Math.min(1, (progress * mainTextElements.length - index) / 1));
            
            gsap.set(char, {
              opacity: charProgress,
              y: (1 - charProgress) * 50,
              scale: 0.5 + (charProgress * 0.5),
              rotation: (1 - charProgress) * 360,
              ease: 'none'
            });
          });
        }
      });

      // Categories animation
      ScrollTrigger.create({
        trigger: categoriesRef.current,
        start: 'top 80%',
        end: 'bottom 60%',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const categoryCards = gsap.utils.toArray('.category-card');
          
          categoryCards.forEach((card: any, index) => {
            const cardProgress = Math.max(0, Math.min(1, (progress * categoryCards.length - index) / 1));
            
            gsap.set(card, {
              opacity: cardProgress,
              y: (1 - cardProgress) * 60,
              scale: 0.8 + (cardProgress * 0.2),
              rotation: (1 - cardProgress) * (index % 2 === 0 ? -10 : 10),
              ease: 'none'
            });
          });
        }
      });

      // Stats animation
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 80%',
        end: 'bottom 60%',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const statCards = gsap.utils.toArray('.stat-card');
          
          statCards.forEach((card: any, index) => {
            const cardProgress = Math.max(0, Math.min(1, (progress * statCards.length - index) / 1));
            
            gsap.set(card, {
              opacity: cardProgress,
              scale: 0.7 + (cardProgress * 0.3),
              y: (1 - cardProgress) * 80,
              ease: 'none'
            });
            
            // Animate the icon inside each stat card
            const icon = card.querySelector('.stat-icon');
            if (icon) {
              gsap.set(icon, {
                rotation: cardProgress * 360,
                scale: 1 + (cardProgress * 0.3),
                ease: 'none'
              });
            }
          });
        }
      });

      // Logo animations based on scroll - only move when scrolling
      let scrollTween: any = null;
      
      ScrollTrigger.create({
        trigger: companyLogosRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Only animate when scroll progress changes
          if (scrollTween) scrollTween.kill();
          
          scrollTween = gsap.to('.company-logo', {
            duration: 0.1,
            ease: 'none',
            stagger: 0.02,
            scale: 0.9 + Math.sin(progress * Math.PI) * 0.1,
            rotation: progress * 10,
            y: Math.sin(progress * Math.PI * 2) * 5,
          });
        },
        onLeave: () => {
          // Reset to static state when scroll ends
          gsap.to('.company-logo', {
            duration: 0.5,
            scale: 1,
            rotation: 0,
            y: 0,
            x: 0,
            ease: 'power2.out'
          });
        },
        onEnterBack: () => {
          // Reset to static state when scroll ends
          gsap.to('.company-logo', {
            duration: 0.5,
            scale: 1,
            rotation: 0,
            y: 0,
            ease: 'power2.out'
          });
        }
      });

    }, companyLogosRef);

    return () => ctx.revert();
  }, []);

  // Function to split text into individual characters for animation
  const splitTextToChars = (text: string) => {
    return text.split('').map((char, index) => (
      <span 
        key={index} 
        className="reveal-char inline-block"
        style={{ opacity: 0 }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const StaticLogo = ({ company, index }: { company: any, index: number }) => (
    <div
      key={`${company.name}-${index}`}
      className="company-logo group inline-block rounded-full opacity-70 cursor-pointer transition-all duration-300 hover:opacity-100 hover:scale-110 m-2 relative"
      style={{
        width: `${40 + (index % 3) * 8}px`,
        height: `${40 + (index % 3) * 8}px`,
        background: `linear-gradient(135deg, ${company.color}20, ${company.color}10)`,
        border: `2px solid ${company.color}30`,
      }}
    >
      <div className="w-full h-full rounded-full flex items-center justify-center p-2 relative overflow-hidden">
        <img 
          src={company.logo} 
          alt={company.name}
          className="w-full h-full object-contain z-10 relative transition-transform duration-300 group-hover:scale-110"
          style={{
            filter: `drop-shadow(0 0 8px ${company.color}40)`,
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div className="hidden w-full h-full rounded-full items-center justify-center text-xs font-bold z-20 relative"
             style={{ 
               color: company.color,
               textShadow: `0 0 10px ${company.color}60`
             }}>
          {company.name.split(' ').map((word: string) => word[0]).join('')}
        </div>
        {/* Color overlay for brand theming */}
        <div 
          className="absolute inset-0 rounded-full mix-blend-multiply opacity-30 pointer-events-none"
          style={{ backgroundColor: company.color }}
        />
        {/* Category icon overlay */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
             style={{ color: company.color }}>
          {company.icon}
        </div>
      </div>
    </div>
  );

  return (
    <section 
      ref={companyLogosRef} 
      className={`relative py-24 transition-colors duration-300 overflow-hidden ${
        isDark ? 'bg-dark-bg' : 'bg-white'
      }`}
    >
      {/* Animated Company Logos Background Only */}
      <CompanyLogosBackground 
        density="high" 
        opacity={isDark ? 0.8 : 0.6} 
        enableAnimation={true} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered main text */}
        <div ref={textRef} className="text-center mb-16">
          {/* Main headline with character reveal */}
          <div className="mb-8 relative">
         
            <Typography 
              variant="h1" 
              className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-tight transition-colors duration-300 ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}
            >
              {splitTextToChars('Almost ')}
              <span className={`bg-clip-text text-transparent ${
                isDark 
                  ? 'bg-gradient-to-r from-lime via-dark-accent to-lime' 
                  : 'bg-gradient-to-r from-asu-maroon via-asu-gold to-asu-maroon'
              }`}>
                {splitTextToChars('1M')}
              </span>
            </Typography>
          </div>

          <div className="mb-8">
            <Typography 
              variant="h2" 
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold transition-colors duration-300 ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}
            >
              {splitTextToChars('employers')}
            </Typography>
          </div>

          <div className="mb-12">
            <Typography 
              variant="h3" 
              className={`text-2xl sm:text-3xl md:text-4xl font-medium transition-colors duration-300 ${
                isDark ? 'text-dark-muted' : 'text-gray-600'
              }`}
            >
              {splitTextToChars('with opportunities to land that')}
            </Typography>
          </div>

          <div className="space-y-4 relative">
            <Typography 
              variant="h2" 
              className={`text-4xl sm:text-5xl md:text-6xl font-bold transition-colors duration-300 ${
                isDark ? 'text-lime' : 'text-asu-maroon'
              }`}
            >
              {splitTextToChars('first, second, and third job')}
            </Typography>
          </div>
        </div>

        {/* Industry Categories */}
    

        {/* Company logos displayed in foreground */}
   

        {/* Enhanced stats with icons */}
        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
                </div>
      </div>
    </section>
  );
}