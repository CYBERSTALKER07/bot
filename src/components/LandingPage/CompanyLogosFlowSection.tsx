import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../context/ThemeContext';
import Typography from '../ui/Typography';

gsap.registerPlugin(ScrollTrigger);

interface CompanyLogosFlowSectionProps {
  companyLogosRef: React.RefObject<HTMLDivElement>;
}

// Memoized company data to prevent recreation on every render
const COMPANY_LOGOS = [
  { name: 'Google', logo: 'https://logo.clearbit.com/google.com', id: 'google' },
  { name: 'Apple', logo: 'https://logo.clearbit.com/apple.com', id: 'apple' },
  { name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com', id: 'microsoft' },
  { name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com', id: 'amazon' },
  { name: 'Tesla', logo: 'https://logo.clearbit.com/tesla.com', id: 'tesla' },
  { name: 'Netflix', logo: 'https://logo.clearbit.com/netflix.com', id: 'netflix' },
  { name: 'Meta', logo: 'https://logo.clearbit.com/meta.com', id: 'meta' },
  { name: 'Spotify', logo: 'https://logo.clearbit.com/spotify.com', id: 'spotify' },
  { name: 'Airbnb', logo: 'https://logo.clearbit.com/airbnb.com', id: 'airbnb' },
  { name: 'Uber', logo: 'https://logo.clearbit.com/uber.com', id: 'uber' },
  { name: 'Salesforce', logo: 'https://logo.clearbit.com/salesforce.com', id: 'salesforce' },
  { name: 'Adobe', logo: 'https://logo.clearbit.com/adobe.com', id: 'adobe' },
  { name: 'PayPal', logo: 'https://logo.clearbit.com/paypal.com', id: 'paypal' },
  { name: 'Slack', logo: 'https://logo.clearbit.com/slack.com', id: 'slack' },
  { name: 'Shopify', logo: 'https://logo.clearbit.com/shopify.com', id: 'shopify' },
] as const;

export default function CompanyLogosFlowSection({ companyLogosRef }: CompanyLogosFlowSectionProps) {
  const { isDark } = useTheme();
  const textRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);

  // Memoized text splitting function with performance optimization
  const splitTextToChars = useCallback((text: string) => {
    return text.split('').map((char, index) => (
      <span 
        key={`${text}-${index}`}
        className="reveal-char inline-block will-change-transform"
        style={{ opacity: 0 }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  }, []);

  // Memoized company logo components
  const CompanyLogos = useMemo(() => (
    <>
      {/* Left Side Logos */}
      <div className="absolute left-0 top-0 bottom-0 w-1/6 pointer-events-none">
        {COMPANY_LOGOS.slice(0, 8).map((company, index) => (
          <div 
            key={company.id}
            className="company-logo absolute bg-transparent backdrop-blur-sm border border-none shadow-lg rounded-full flex items-center justify-center transition-transform duration-300 will-change-transform"
            style={{
              width: `${Math.random() * 4 + 100}px`,
              height: `${Math.random() * 4 + 100}px`,
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 60 + 10}px`,
              borderRadius: `100px`
            }}
          >
            <img 
              src={company.logo} 
              alt={company.name}
              className="w-full h-full object-fill rounded-full"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>

      {/* Right Side Logos */}
      <div className="absolute right-0 top-0 bottom-0 w-1/6 pointer-events-none">
        {COMPANY_LOGOS.slice(8).map((company, index) => (
          <div 
            key={company.id}
            className="company-logo absolute bg-transparent backdrop-blur-sm border border-none shadow-lg rounded-full flex items-center justify-center transition-transform duration-300 will-change-transform"
            style={{
              width: `${Math.random() * 4 + 100}px`,
              height: `${Math.random() * 4 + 100}px`,
              top: `${Math.random() * 80 + 10}%`,
              right: `${Math.random() * 60 + 10}px`,
              borderRadius: `100px`

              
            }}
          >
            <img 
              src={company.logo} 
              alt={company.name}
              className="w-full h-full object- rounded-full"
              loading="lazy"
              decoding="async"
              
            />
          </div>
        ))}
      </div>
    </>
  ), []);

  // Optimized animations with reduced complexity and better performance
  useEffect(() => {
    if (!companyLogosRef.current) return;

    const ctx = gsap.context(() => {
      // Optimized text reveal animation with requestAnimationFrame
      const mainTextElements = gsap.utils.toArray('.reveal-char');
      
      if (mainTextElements.length > 0) {
        ScrollTrigger.create({
          trigger: companyLogosRef.current,
          start: 'top 90%',
          end: 'bottom 70%',
          scrub: 1, // Reduced scrub value for smoother animation
          onUpdate: (self) => {
            const progress = self.progress;
            
            // Use batch updates for better performance
            gsap.set(mainTextElements, {
              opacity: (i) => Math.max(0, Math.min(1, (progress * mainTextElements.length - i) / 2)),
              y: (i) => (1 - Math.max(0, Math.min(1, (progress * mainTextElements.length - i) / 2))) * 20,
              ease: 'power2.out'
            });
          }
        });
      }

      // Simplified logo animations with reduced complexity
      const visibleLogos = gsap.utils.toArray('.company-logo');
      
      if (visibleLogos.length > 0) {
        // Single scroll trigger for all logo animations
        ScrollTrigger.create({
          trigger: companyLogosRef.current,
          start: 'top 90%',
          end: 'bottom 70%',
          scrub: 2, // Slower scrub for smoother performance
          onUpdate: (self) => {
            const progress = self.progress;
            
            // Batch update all logos at once for better performance
            gsap.set(visibleLogos, {
              y: (i) => -200 * progress + Math.sin(progress * Math.PI * 2 + i) * 15 * (1 - progress),
              rotation: (i) => progress * 360 * (i % 2 === 0 ? 1 : -1),
              scale: (i) => Math.max(0.3, 1 - (progress * 0.6)),
              opacity: (i) => progress > 0.8 ? 1 - ((progress - 0.8) / 0.2) : 1,
              ease: 'none'
            });
          }
        });

        // Simplified entrance animation
        ScrollTrigger.create({
          trigger: companyLogosRef.current,
          start: 'top 85%',
          end: 'top 60%',
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            
            gsap.set(visibleLogos, {
              opacity: progress,
              scale: 0.5 + (progress * 0.5),
              ease: 'none'
            });
          }
        });
      }
    }, companyLogosRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={companyLogosRef} 
      className={`sticky py-48 lg:py-64 min-h-[120vh] transition-colors duration-300 overflow-hidden ${
        isDark ? 'bg-dark-bg' : 'bg-asu-maroon'
      }`}
    >
      {/* Company Logos */}
      <div ref={logoContainerRef} className="absolute inset-0 pointer-events-none">
        {CompanyLogos}
      </div>
    
      {/* Main Content */}
      <div ref={textRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20 w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Main headline with optimized character reveal */}
        <div className="mb-6 sm:mb-8 relative will-change-transform">
          <Typography 
            variant="h1" 
            className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight transition-colors duration-300 ${
              isDark ? 'text-dark-text' : 'text-white'
            }`}
          >
            {splitTextToChars('Almost ')}
            <span className={`bg-clip-text text-transparent ${
              isDark 
                ? 'bg-linear-to-r from-lime via-dark-accent to-lime' 
                : 'bg-linear-to-r from-asu-maroon via-asu-gold to-asu-maroon'
            }`}>
              {splitTextToChars('1M+')}
            </span>
          </Typography>
        </div>

        <div className="mb-6 sm:mb-8 will-change-transform">
          <Typography 
            variant="h2" 
            className={`text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold transition-colors duration-300 ${
              isDark ? 'text-dark-text' : 'text-white'
            }`}
          >
            {splitTextToChars('employers')}
          </Typography>
        </div>

        <div className="mb-8 sm:mb-12 will-change-transform">
          <Typography 
            variant="h3" 
            className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium transition-colors duration-300 ${
              isDark ? 'text-dark-muted' : 'text-white'
            }`}
          >
            {splitTextToChars('ready to help you land')}
          </Typography>
        </div>

        <div className="space-y-4 relative will-change-transform">
          <Typography 
            variant="h2" 
            className={`text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold transition-colors duration-300 ${
              isDark ? 'text-lime' : 'text-lime'
            }`}
          >
            {splitTextToChars('your dream job')}
          </Typography>
        </div>
      </div>
    </section>
  );
}