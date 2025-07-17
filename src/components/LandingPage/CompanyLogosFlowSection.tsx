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
  const trendsRef = useRef<HTMLDivElement>(null);

  // Company data with real logo URLs and category icons
  const companies = [
    { name: 'Apple', logo: 'https://logo.clearbit.com/apple.com', category: 'Technology', color: '#007AFF', icon: <Monitor className="w-3 h-3" /> },
    { name: 'Google', logo: 'https://logo.clearbit.com/google.com', category: 'Technology', color: '#4285F4', icon: <Globe className="w-3 h-3" /> },
    { name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com', category: 'Technology', color: '#00BCF2', icon: <Cpu className="w-3 h-3" /> },
    { name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com', category: 'E-commerce', color: '#FF9900', icon: <ShoppingBag className="w-3 h-3" /> },
    { name: 'Tesla', logo: 'https://logo.clearbit.com/tesla.com', category: 'Automotive', color: '#CC0000', icon: <Car className="w-3 h-3" /> },
    { name: 'Netflix', logo: 'https://logo.clearbit.com/netflix.com', category: 'Entertainment', color: '#E50914', icon: <Monitor className="w-3 h-3" /> },
    { name: 'Spotify', logo: 'https://logo.clearbit.com/spotify.com', category: 'Entertainment', color: '#1DB954', icon: <Heart className="w-3 h-3" /> },
    { name: 'Uber', logo: 'https://logo.clearbit.com/uber.com', category: 'Transportation', color: '#000000', icon: <Car className="w-3 h-3" /> },
    { name: 'Airbnb', logo: 'https://logo.clearbit.com/airbnb.com', category: 'Hospitality', color: '#FF5A5F', icon: <Building2 className="w-3 h-3" /> },
    { name: 'Meta', logo: 'https://logo.clearbit.com/meta.com', category: 'Technology', color: '#1877F2', icon: <Users className="w-3 h-3" /> },
    { name: 'Salesforce', logo: 'https://logo.clearbit.com/salesforce.com', category: 'Technology', color: '#00A1E0', icon: <Cpu className="w-3 h-3" /> },
    { name: 'Adobe', logo: 'https://logo.clearbit.com/adobe.com', category: 'Technology', color: '#FF0000', icon: <Monitor className="w-3 h-3" /> },
    { name: 'Intel', logo: 'https://logo.clearbit.com/intel.com', category: 'Technology', color: '#0071C5', icon: <Cpu className="w-3 h-3" /> },
    { name: 'Oracle', logo: 'https://logo.clearbit.com/oracle.com', category: 'Technology', color: '#F80000', icon: <Cpu className="w-3 h-3" /> },
    { name: 'IBM', logo: 'https://logo.clearbit.com/ibm.com', category: 'Technology', color: '#1261FE', icon: <Cpu className="w-3 h-3" /> },
    { name: 'Cisco', logo: 'https://logo.clearbit.com/cisco.com', category: 'Technology', color: '#1BA0D7', icon: <Globe className="w-3 h-3" /> },
    { name: 'PayPal', logo: 'https://logo.clearbit.com/paypal.com', category: 'Finance', color: '#003087', icon: <CreditCard className="w-3 h-3" /> },
    { name: 'Zoom', logo: 'https://logo.clearbit.com/zoom.us', category: 'Technology', color: '#2D8CFF', icon: <Monitor className="w-3 h-3" /> },
    { name: 'Slack', logo: 'https://logo.clearbit.com/slack.com', category: 'Technology', color: '#4A154B', icon: <Users className="w-3 h-3" /> },
    { name: 'Shopify', logo: 'https://logo.clearbit.com/shopify.com', category: 'E-commerce', color: '#96BF48', icon: <ShoppingBag className="w-3 h-3" /> },
  ];

  const categories = [
    { name: 'Technology', icon: <Cpu className="w-6 h-6" />, count: 250000, color: '#3B82F6' },
    { name: 'Healthcare', icon: <Heart className="w-6 h-6" />, count: 180000, color: '#EF4444' },
    { name: 'Finance', icon: <CreditCard className="w-6 h-6" />, count: 150000, color: '#10B981' },
    { name: 'Education', icon: <Building2 className="w-6 h-6" />, count: 120000, color: '#8B5CF6' },
    { name: 'Retail', icon: <ShoppingBag className="w-6 h-6" />, count: 200000, color: '#F59E0B' },
    { name: 'Energy', icon: <Zap className="w-6 h-6" />, count: 90000, color: '#06B6D4' },
  ];

  // Text reveal animation based on scroll - contained within this section only
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Character reveal animation for the main text using trendsRef - FASTER
      const mainTextElements = gsap.utils.toArray('.reveal-char');
      
      ScrollTrigger.create({
        trigger: companyLogosRef.current,
        start: 'top 80%',
        end: 'bottom 100%',
        scrub: 0.5, // Much faster scrub animation
        onUpdate: (self) => {
          const progress = self.progress;
          
          mainTextElements.forEach((char: any, index) => {
            const charProgress = Math.max(0, Math.min(1, (progress * mainTextElements.length - index) / 0.5)); // Faster progression
            
            gsap.set(char, {
              opacity: charProgress,
              y: (1 - charProgress) * 15, // Reduced movement for faster feel
              scale: 0.9 + (charProgress * 0.1), // Smaller scale range for speed
              rotation: (1 - charProgress) * 30, // Reduced rotation for speed
              ease: 'power2.out'
            });
          });
        }
      });

      // Enhanced text animation with trendsRef trigger - MUCH FASTER
      gsap.fromTo('.trend-item', {
        opacity: 0,
        x: -30, // Reduced distance
        scale: 0.95 // Less scale change
      }, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.4, // Much faster duration
        ease: 'power3.out', // Snappier easing
        stagger: 0.05, // Faster stagger
        scrollTrigger: {
          trigger: companyLogosRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        } 
      });

      // Categories animation - FASTER
      ScrollTrigger.create({
        trigger: companyLogosRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.3, // Much faster scrub
        onUpdate: (self) => {
          const progress = self.progress;
          const categoryCards = gsap.utils.toArray('.category-card');
          
          categoryCards.forEach((card: any, index) => {
            const cardProgress = Math.max(0, Math.min(1, (progress * categoryCards.length - index) / 0.3)); // Faster
            
            gsap.set(card, {
              opacity: cardProgress,
              y: (1 - cardProgress) * 15, // Reduced movement
              scale: 0.95 + (cardProgress * 0.05), // Smaller scale range
              rotation: (1 - cardProgress) * (index % 2 === 0 ? -2 : 2), // Less rotation
              ease: 'power2.out'
            });
          });
        }
      });

      // Stats animation - FASTER
      ScrollTrigger.create({
        trigger: companyLogosRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.3, // Much faster
        onUpdate: (self) => {
          const progress = self.progress;
          const statCards = gsap.utils.toArray('.stat-card');
          
          statCards.forEach((card: any, index) => {
            const cardProgress = Math.max(0, Math.min(1, (progress * statCards.length - index) / 0.3)); // Faster
            
            gsap.set(card, {
              opacity: cardProgress,
              scale: 0.95 + (cardProgress * 0.05), // Smaller range
              y: (1 - cardProgress) * 20, // Reduced movement
              ease: 'power2.out'
            });
            
            const icon = card.querySelector('.stat-icon');
            if (icon) {
              gsap.set(icon, {
                rotation: cardProgress * 90, // Less rotation
                scale: 1 + (cardProgress * 0.05), // Smaller scale change
                ease: 'power2.out'
              });
            }
          });
        }
      });

      // Logo animations - MUCH FASTER
      ScrollTrigger.create({
        trigger: companyLogosRef.current,
        start: 'top 90%',
        end: 'bottom 10%',
        scrub: 0.2, // Very fast scrub
        onUpdate: (self) => {
          const progress = self.progress;
          
          gsap.to('.company-logo', {
            duration: 0.1, // Much faster duration
            ease: 'power3.out',
            stagger: 0.01, // Faster stagger
            scale: 0.98 + Math.sin(progress * Math.PI) * 0.02, // Smaller scale range
            rotation: progress * 180, // Less rotation
            y: Math.sin(progress * Math.PI * 2) * 5, // Reduced movement
            x: Math.cos(progress * Math.PI * 2) * 2, // Reduced movement
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

  return (
    <section 
      ref={companyLogosRef} 
      className={`relative py-48 lg:py-64 min-h-[150vh] transition-colors duration-300 overflow-hidden ${
        isDark ? 'bg-dark-bg' : 'bg-asu-maroon'
      }`}
    >
      {/* Animated Company Logos Background Only */}
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col justify-center">
        {/* Centered main text - Fixed Position */}
        <div ref={trendsRef} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20 w-full max-w-7xl px-4">
          {/* Main headline with character reveal */}
          <div className="mb-8 relative trend-item">
            <Typography 
              variant="h1" 
              className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-tight transition-colors duration-300 ${
                isDark ? 'text-dark-text' : 'text-white'
              }`}
            >
              {splitTextToChars('Almost 1M ')}
              <span className={`bg-clip-text text-transparent ${
                isDark 
                  ? 'bg-gradient-to-r from-lime via-dark-accent to-lime' 
                  : 'bg-gradient-to-r from-asu-maroon via-asu-gold to-asu-maroon'
              }`}>
                {splitTextToChars('1M')}
              </span>
            </Typography>
          </div>

          <div className="mb-8 trend-item">
            <Typography 
              variant="h2" 
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold transition-colors duration-300 ${
                isDark ? 'text-dark-text' : 'text-white'
              }`}
            >
              {splitTextToChars('employers')}
            </Typography>
          </div>

          <div className="mb-12 trend-item">
            <Typography 
              variant="h3" 
              className={`text-2xl sm:text-3xl md:text-4xl font-medium transition-colors duration-300 ${
                isDark ? 'text-dark-muted' : 'text-white'
              }`}
            >
              {splitTextToChars('ready to help you land')}
            </Typography>
          </div>

          <div className="space-y-4 relative trend-item">
            <Typography 
              variant="h2" 
              className={`text-4xl sm:text-5xl md:text-6xl font-bold transition-colors duration-300 ${
                isDark ? 'text-lime' : 'text-lime'
              }`}
            >
              {splitTextToChars('your dream job')}
            </Typography>
          </div>
        </div>

        {/* Company logos section removed - only text content remains */}

        {/* Enhanced stats with icons */}
        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
    

       

      
        </div>
      </div>
    </section>
  );
}