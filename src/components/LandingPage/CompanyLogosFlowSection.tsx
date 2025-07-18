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
        start: 'top 10%',
        end: 'bottom 100%',
        scrub: 0.5, // Much faster scrub animation
        onUpdate: (self) => {
          const progress = self.progress;
          
          mainTextElements.forEach((char: any, index) => {
            const charProgress = Math.max(0, Math.min(1, (progress * mainTextElements.length - index) / 1)); // Faster progression
            
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

      // Company logos scroll-based animations - Move to top on scroll down, back on scroll up
      const visibleLogos = gsap.utils.toArray('.company-logo');
      
      ScrollTrigger.create({
        trigger: companyLogosRef.current,
        start: 'top 90%',
        end: 'bottom 10%',
        scrub: 0.3, // Fast scroll response
        onUpdate: (self) => {
          const progress = self.progress;
          
          visibleLogos.forEach((logo: any, index) => {
            // Staggered appearance based on scroll progress
            const logoProgress = Math.max(0, Math.min(1, (progress * visibleLogos.length - index) / 2));
            
            // Move logos to top when scrolling down, back to original when scrolling up
            const targetY = -300 * progress; // Move up 300px by end of section
            const waveY = Math.sin(progress * Math.PI * 3 + index) * 10 * (1 - progress); // Reduce wave as we go up
            const finalY = targetY + waveY;
            
            // Dynamic rotation - spin faster as they move up
            const baseRotation = progress * 720 * (index % 2 === 0 ? 1 : -1); // 2 full rotations
            const wobbleRotation = Math.sin(progress * Math.PI * 4 + index) * 15 * (1 - progress);
            const finalRotation = baseRotation + wobbleRotation;
            
            // Dynamic scaling - get smaller as they move up
            const baseScale = 1 - (progress * 0.5); // Scale from 1 to 0.5
            const pulseScale = 1 + Math.sin(progress * Math.PI * 8 + index) * 0.1 * (1 - progress);
            const finalScale = Math.max(0.2, baseScale * pulseScale);
            
            // Horizontal drift - converge toward center as they move up
            const centerDrift = (0.5 - (index / visibleLogos.length)) * 100 * progress; // Move toward center
            const randomDrift = Math.cos(progress * Math.PI * 2 + index) * 20 * (1 - progress);
            const finalX = centerDrift + randomDrift;
            
            // Opacity - fade as they reach the top
            let opacity = 1;
            if (progress > 0.7) {
              opacity = 1 - ((progress - 0.7) / 0.3); // Fade out in last 30%
            }
            
            gsap.set(logo, {
              y: finalY,
              x: finalX,
              rotation: finalRotation,
              scale: finalScale,
              opacity: opacity,
              ease: 'power2.out'
            });
          });
        }
      });

      // Additional logo entrance animation - from bottom when entering section
      ScrollTrigger.create({
        trigger: companyLogosRef.current,
        start: 'top 85%',
        end: 'top 50%',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          
          visibleLogos.forEach((logo: any, index) => {
            const delay = index * 0.05;
            const logoProgress = Math.max(0, Math.min(1, progress - delay));
            
            // Entrance from bottom - logos start below their position
            const entranceY = 200 * (1 - logoProgress); // Start 200px below
            const entranceScale = 0.3 + (logoProgress * 0.7); // Scale from 0.3 to 1
            const entranceRotation = 180 * (1 - logoProgress) * (index % 2 === 0 ? 1 : -1);
            
            gsap.set(logo, {
              y: `+=${entranceY}`,
              scale: entranceScale,
              rotation: `+=${entranceRotation}`,
              opacity: logoProgress,
            });
          });
        }
      });

      // Continuous floating animation for logos - reduces as scroll progresses
      visibleLogos.forEach((logo: any, index) => {
        const floatTl = gsap.timeline({ repeat: -1, yoyo: true });
        
        floatTl.to(logo, {
          y: `+=${Math.random() * 15 - 7.5}`,
          x: `+=${Math.random() * 10 - 5}`,
          rotation: `+=${Math.random() * 10 - 5}`,
          duration: 2 + Math.random() * 2,
          ease: 'sine.inOut',
          delay: index * 0.1
        });

        // Scale floating effect based on scroll progress
        ScrollTrigger.create({
          trigger: companyLogosRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const progress = self.progress;
            const intensity = 1 - progress; // Reduce floating as we scroll
            floatTl.timeScale(intensity);
          }
        });
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
      className={` sticky py-48 lg:py-64 min-h-[150vh] transition-colors duration-300 overflow-hidden ${
        isDark ? 'bg-dark-bg' : 'bg-asu-maroon'
      }`}
    >
      {/* Animated Company Logos Background */}
      {/* <CompanyLogosBackground density="high" opacity={0.1} enableAnimation={true} /> */}
      
      {/* Hero Section Company Logos - Visible and Animated */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Google */}
        <div className="company-logo absolute top-10 left-1/4 w-20 h-20 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
          <img src="https://logo.clearbit.com/google.com" alt="Google" className="w-14 h-14 object-contain" />
        </div>
        
        {/* Microsoft */}
        <div className="company-logo absolute top-32 right-1/4 w-18 h-18 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
          <img src="https://logo.clearbit.com/microsoft.com" alt="Microsoft" className="w-12 h-12 object-contain" />
        </div>
        
        {/* Apple */}
        <div className="company-logo absolute top-20 left-3/4 w-16 h-16 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
          <img src="https://logo.clearbit.com/apple.com" alt="Apple" className="w-10 h-10 object-contain" />
        </div>
        
        {/* Tesla */}
        <div className="company-logo absolute top-96 left-1/3 w-24 h-24 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
          <img src="https://logo.clearbit.com/tesla.com" alt="Tesla" className="w-18 h-18 object-contain" />
        </div>
        
        {/* Meta */}
        <div className="company-logo absolute top-16 left-1/6 w-14 h-14 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
          <img src="https://logo.clearbit.com/meta.com" alt="Meta" className="w-8 h-8 object-contain" />
        </div>
        
        {/* Netflix */}
        <div className="company-logo absolute top-80 right-1/3 w-22 h-22 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
          <img src="https://logo.clearbit.com/netflix.com" alt="Netflix" className="w-16 h-16 object-contain" />
        </div>
        
        {/* Amazon */}
        <div className="company-logo absolute top-48 left-1/5 w-20 h-20 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
          <img src="https://logo.clearbit.com/amazon.com" alt="Amazon" className="w-14 h-14 object-contain" />
        </div>
        
        {/* Adobe */}
        <div className="company-logo absolute top-64 right-1/6 w-18 h-18 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
          <img src="https://logo.clearbit.com/adobe.com" alt="Adobe" className="w-12 h-12 object-contain" />
        </div>
        
        {/* Spotify */}
        <div className="company-logo absolute top-72 left-2/3 w-19 h-19 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
          <img src="https://logo.clearbit.com/spotify.com" alt="Spotify" className="w-13 h-13 object-contain" />
        </div>
        
        {/* Airbnb */}
        <div className="company-logo absolute bottom-32 right-1/4 w-21 h-21 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
          <img src="https://logo.clearbit.com/airbnb.com" alt="Airbnb" className="w-15 h-15 object-contain" />
        </div>
        
        {/* Slack */}
        <div className="company-logo absolute bottom-48 left-1/4 w-17 h-17 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
          <img src="https://logo.clearbit.com/slack.com" alt="Slack" className="w-12 h-12 object-contain" />
        </div>
        
        {/* Uber */}
        <div className="company-logo absolute bottom-64 right-1/3 w-23 h-23 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
          <img src="https://logo.clearbit.com/uber.com" alt="Uber" className="w-17 h-17 object-contain" />
        </div>
        
        {/* LinkedIn */}
        <div className="company-logo absolute bottom-80 left-1/3 w-18 h-18 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
          <img src="https://logo.clearbit.com/linkedin.com" alt="LinkedIn" className="w-13 h-13 object-contain" />
        </div>
        
        {/* Salesforce */}
        <div className="company-logo absolute bottom-96 right-1/5 w-20 h-20 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
          <img src="https://logo.clearbit.com/salesforce.com" alt="Salesforce" className="w-14 h-14 object-contain" />
        </div>
        
        {/* Shopify */}
        <div className="company-logo absolute bottom-16 left-1/6 w-19 h-19 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
          <img src="https://logo.clearbit.com/shopify.com" alt="Shopify" className="w-13 h-13 object-contain" />
        </div>
      </div>
    
      {/* Centered main text - Fixed Position */}
      <div ref={trendsRef} className=" sticky top-1/2 ml-[1000px] transform -translate-x-1/2 -translate-y-1/2 text-center z-20 w-full max-w-7xl px-4">
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

      {/* Enhanced stats with icons */}
      <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
    

       

      
      </div>
    </section>
  );
}