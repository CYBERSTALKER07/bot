import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  RocketLaunch,
  Business,
  ArrowForward,
  TrendingUp,
  EmojiEvents,
  KeyboardArrowDown
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import Typography from '../ui/Typography';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLDivElement>;
}

export default function HeroSection({ heroRef }: HeroSectionProps) {
  const { isDark } = useTheme();
  const floatingImagesRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!floatingImagesRef.current || !heroRef.current) return;

    const images = floatingImagesRef.current.querySelectorAll('.floating-image');
    
    // Set initial positions for floating images with responsive considerations
    gsap.set(images, {
      opacity: 1,
      scale: 0.8,
      rotation: (i) => (i % 2 === 0 ? -15 : 15),
    });

    // Create scroll-triggered animation for each image with mobile optimization
    images.forEach((image, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
          onUpdate: (self) => {
            const progress = self.progress;
            const isMobile = window.innerWidth < 768;
            const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
            
            // Calculate movement patterns with responsive adjustments
            let centerX, centerY;
            
            // Logos that animate upward (indices 5, 7, 9, 11, 13)
            const upwardLogos = [5, 7, 9, 11, 13];
            const isUpwardLogo = upwardLogos.includes(index);
            
            // Adjust movement based on screen size
            const movementMultiplier = isMobile ? 0.5 : isTablet ? 0.75 : 1;
            
            if (isUpwardLogo) {
              // Animate upward and slightly inward with responsive scaling
              centerX = -20 * progress * movementMultiplier;
              centerY = -150 * progress * movementMultiplier;
            } else {
              // Original center-bound animation with responsive scaling
              const baseX = -50 * progress * movementMultiplier;
              const baseY = -30 * progress * movementMultiplier;
              
              centerX = baseX;
              centerY = baseY;
              
              // Add unique movement patterns for center-bound logos
              const patternMultiplier = isMobile ? 0.3 : isTablet ? 0.6 : 1;
              switch(index % 5) {
                case 0: // Spiral inward
                  centerX += Math.sin(progress * Math.PI * 2) * 20 * (1 - progress) * patternMultiplier;
                  centerY += Math.cos(progress * Math.PI * 2) * 15 * (1 - progress) * patternMultiplier;
                  break;
                case 1: // Wave motion
                  centerX += Math.sin(progress * Math.PI * 4) * 15 * (1 - progress) * patternMultiplier;
                  break;
                case 2: // Bounce effect
                  centerY += Math.abs(Math.sin(progress * Math.PI * 6)) * 10 * (1 - progress) * patternMultiplier;
                  break;
                case 3: // Zigzag pattern
                  centerX += (Math.sin(progress * Math.PI * 8) * 25) * (1 - progress) * patternMultiplier;
                  centerY += (Math.cos(progress * Math.PI * 6) * 20) * (1 - progress) * patternMultiplier;
                  break;
                case 4: // Circular motion
                  centerX += Math.cos(progress * Math.PI * 3) * 18 * (1 - progress) * patternMultiplier;
                  centerY += Math.sin(progress * Math.PI * 3) * 18 * (1 - progress) * patternMultiplier;
                  break;
              }
            }
            
            // Enhanced scale animation with responsive considerations
            let scale;
            const baseScaleAdjustment = isMobile ? 0.6 : isTablet ? 0.8 : 1;
            
            if (isUpwardLogo) {
              // Upward logos shrink as they move up
              const baseScale = (0.8 - (0.4 * progress)) * baseScaleAdjustment;
              const pulseScale = 1 + Math.sin(progress * Math.PI * 6) * 0.15 * (1 - progress);
              scale = Math.max(0.1, baseScale * pulseScale);
            } else {
              // Center logos grow as they move inward
              const baseScale = (0.8 + (0.4 * progress)) * baseScaleAdjustment;
              const pulseScale = 1 + Math.sin(progress * Math.PI * 4) * 0.1 * (1 - progress);
              scale = baseScale * pulseScale;
            }
            
            // Dynamic rotation with responsive adjustments
            let rotation;
            const rotationMultiplier = isMobile ? 0.5 : isTablet ? 0.75 : 1;
            
            if (isUpwardLogo) {
              const baseRotation = (index % 2 === 0 ? -15 : 15) * (1 - progress);
              const spinRotation = progress * 720 * (index % 2 === 0 ? 1 : -1) * rotationMultiplier;
              rotation = baseRotation + spinRotation;
            } else {
              const baseRotation = (index % 2 === 0 ? -15 : 15) * (1 - progress);
              const spinRotation = progress * 360 * (index % 2 === 0 ? 1 : -1) * 0.5 * rotationMultiplier;
              rotation = baseRotation + spinRotation;
            }
            
            // Enhanced opacity with different fade patterns
            let opacity;
            if (isUpwardLogo) {
              if (progress < 0.5) {
                opacity = 1 - (progress * 0.4);
              } else {
                opacity = 0.6 - ((progress - 0.5) / 0.5) * 0.6;
              }
            } else {
              if (progress < 0.3) {
                opacity = 1;
              } else if (progress < 0.7) {
                opacity = 1 - ((progress - 0.3) / 0.4) * 0.5;
              } else {
                opacity = 0.5 - ((progress - 0.7) / 0.3) * 0.5;
              }
            }
            
            // Apply transformations
            gsap.set(image, {
              x: `${centerX}%`,
              y: `${centerY}%`,
              scale: scale,
              rotation: rotation,
              opacity: opacity,
              ease: 'power2.out'
            });
            
            // Add dynamic glow effect with responsive intensity
            const imageElement = image as HTMLElement;
            if (progress > 0.2 && progress < 0.8) {
              const glowIntensity = Math.sin((progress - 0.2) * Math.PI / 0.6) * (isMobile ? 10 : 20);
              const glowColor = isUpwardLogo ? 
                (isDark ? '70, 130, 180' : '255, 140, 0') :
                (isDark ? '227, 255, 112' : '128, 0, 58');
              
              imageElement.style.filter = `drop-shadow(0 0 ${glowIntensity}px rgba(${glowColor}, 0.6))`;
            } else {
              imageElement.style.filter = 'none';
            }
          }
        }
      });
    });

    // Animate hero content with responsive considerations
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    });

    heroTl.to(heroContentRef.current, {
      y: window.innerWidth < 768 ? -50 : -100,
      opacity: 0.3,
      scale: window.innerWidth < 768 ? 0.95 : 0.9,
      ease: 'power2.out'
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isDark]);

  return (
    <section ref={heroRef} className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-dark-bg via-dark-surface to-gray-900' 
        : 'bg-gradient-to-br from-asu-maroon via-asu-maroon-dark to-gray-900'
    }`}>
      {/* Enhanced responsive container */}
      <div className="w-full max-w-7xl mx-auto px-responsive py-responsive relative z-10">
        <div ref={heroContentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center min-h-[80vh] lg:min-h-screen">
          
          {/* Enhanced responsive content section */}
          <div className={`text-center lg:text-left ${isDark ? 'text-dark-text' : 'text-white'} order-2 lg:order-1`}>
            <Typography 
              variant="h1" 
              className="text-responsive-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 lg:mb-6 leading-tight"
              color={isDark ? 'textPrimary' : 'inherit'}
            >
              Your Career
              <span className={`block bg-clip-text text-transparent ${
                isDark 
                  ? 'bg-gradient-to-r from-lime via-dark-accent to-lime' 
                  : 'bg-gradient-to-r from-asu-gold via-yellow-300 to-asu-gold'
              }`}>
                Starts Here
              </span>
            </Typography>
            
            <Typography 
              variant="h5" 
              className={`text-responsive-lg sm:text-xl md:text-2xl mb-6 lg:mb-8 leading-relaxed max-w-none lg:max-w-2xl ${
                isDark ? 'text-dark-muted' : 'text-white/90'
              }`}
            >
              Connect with amazing companies, find your dream internship, and launch your career at American University of Technology's most comprehensive job platform!
            </Typography>
            
            {/* Enhanced responsive button layout */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start max-w-md lg:max-w-none mx-auto lg:mx-0">
              <Button
                component={Link}
                to="/register?role=student"
                variant="contained"
                color="primary"
                size="large"
                className={`w-full sm:w-auto min-h-[48px] lg:min-h-[56px] px-6 lg:px-8 text-responsive shadow-lg rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  isDark 
                    ? 'bg-lime text-dark-bg hover:bg-lime/90' 
                    : 'bg-asu-gold hover:bg-yellow-400'
                }`}
                startIcon={<RocketLaunch className="h-5 w-5 lg:h-6 lg:w-6" />}
                endIcon={<ArrowForward className="h-5 w-5 lg:h-6 lg:w-6" />}
              >
                Find Your Dream Job
              </Button>
              
              <Button
                component={Link}
                to="/register?role=employer"
                variant="outlined"
                color="primary"
                size="large"
                className={`w-full sm:w-auto min-h-[48px] lg:min-h-[56px] px-6 lg:px-8 text-responsive shadow-lg rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 ${
                  isDark 
                    ? 'border-lime text-lime hover:bg-lime/10' 
                    : 'border-white text-white hover:bg-white/10'
                }`}
                startIcon={<Business className="h-5 w-5 lg:h-6 lg:w-6" />}
              >
                Post Jobs
              </Button>
            </div>
          </div>
          
          {/* Enhanced responsive floating images section */}
          <div className="relative order-1 lg:order-2 h-64 sm:h-80 md:h-96 lg:h-full min-h-[300px] lg:min-h-[500px]">
            {/* Floating Images Container with responsive positioning */}
            <div ref={floatingImagesRef} className="absolute inset-0 pointer-events-none">
              {/* Company Logo Cards with responsive sizing and positioning */}
              
              {/* Large featured logos - always visible */}
              <Card className="floating-image absolute top-4 left-1/2 transform -translate-x-1/2 translate-x-16 sm:translate-x-32 lg:translate-x-64 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl flex items-center justify-center" elevation={4}>
                <img src="https://logo.clearbit.com/google.com" alt="Google" className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-48 sm:top-60 lg:top-72 left-1/2 transform -translate-x-1/2 translate-x-2 sm:translate-x-4 lg:translate-x-8 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl flex items-center justify-center" elevation={3}>
                <img src="https://logo.clearbit.com/microsoft.com" alt="Microsoft" className="w-9 h-9 sm:w-10 sm:h-10 lg:w-14 lg:h-14 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-12 sm:top-16 left-1/2 transform -translate-x-1/2 translate-x-24 sm:translate-x-40 lg:translate-x-104 w-12 h-12 sm:w-14 sm:h-14 lg:w-18 lg:h-18 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl flex items-center justify-center" elevation={2}>
                <img src="https://logo.clearbit.com/apple.com" alt="Apple" className="w-8 h-8 sm:w-9 sm:h-9 lg:w-12 lg:h-12 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-64 sm:top-80 lg:top-96 left-1/2 transform -translate-x-1/2 translate-x-8 sm:translate-x-16 lg:translate-x-40 w-18 h-18 sm:w-22 sm:h-22 lg:w-28 lg:h-28 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl flex items-center justify-center" elevation={4}>
                <img src="https://logo.clearbit.com/tesla.com" alt="Tesla" className="w-12 h-12 sm:w-15 sm:h-15 lg:w-20 lg:h-20 object-contain" />
              </Card>
              
              {/* Medium logos - hidden on mobile, visible on tablet+ */}
              <Card className="floating-image absolute top-6 sm:top-8 left-1/2 transform -translate-x-1/2 translate-x-32 sm:translate-x-48 lg:translate-x-128 w-0 h-0 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl flex items-center justify-center" elevation={2}>
                <img src="https://logo.clearbit.com/meta.com" alt="Meta" className="w-0 h-0 sm:w-8 sm:h-8 lg:w-12 lg:h-12 object-contain" />
              </Card>

              <Card className="floating-image absolute top-72 sm:top-88 lg:top-112 left-1/2 transform -translate-x-1/2 translate-x-20 sm:translate-x-32 lg:translate-x-80 w-0 h-0 sm:w-16 sm:h-16 lg:w-22 lg:h-22 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl flex items-center justify-center" elevation={3}>
                <img src="https://logo.clearbit.com/netflix.com" alt="Netflix" className="w-0 h-0 sm:w-12 sm:h-12 lg:w-16 lg:h-16 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-24 sm:top-32 left-1/2 transform -translate-x-1/2 translate-x-6 sm:translate-x-12 lg:translate-x-24 w-0 h-0 sm:w-14 sm:h-14 lg:w-20 lg:h-20 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl flex items-center justify-center" elevation={4}>
                <img src="https://logo.clearbit.com/amazon.com" alt="Amazon" className="w-0 h-0 sm:w-10 sm:h-10 lg:w-14 lg:h-14 object-contain" />
              </Card>
              
              {/* Small logos - only visible on desktop */}
              <Card className="floating-image absolute top-56 sm:top-68 lg:top-88 left-1/2 transform -translate-x-1/2 translate-x-36 sm:translate-x-56 lg:translate-x-144 w-0 h-0 lg:w-18 lg:h-18 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl flex items-center justify-center" elevation={2}>
                <img src="https://logo.clearbit.com/adobe.com" alt="Adobe" className="w-0 h-0 lg:w-12 lg:h-12 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-36 sm:top-40 lg:top-48 left-1/2 transform -translate-x-1/2 translate-x-1 sm:translate-x-2 lg:translate-x-4 w-0 h-0 lg:w-19 lg:h-19 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl flex items-center justify-center" elevation={3}>
                <img src="https://logo.clearbit.com/spotify.com" alt="Spotify" className="w-0 h-0 lg:w-13 lg:h-13 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-68 sm:top-84 lg:top-104 left-1/2 transform -translate-x-1/2 translate-x-28 sm:translate-x-44 lg:translate-x-112 w-0 h-0 lg:w-21 lg:h-21 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl flex items-center justify-center" elevation={3}>
                <img src="https://logo.clearbit.com/airbnb.com" alt="Airbnb" className="w-0 h-0 lg:w-15 lg:h-15 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-44 sm:top-52 lg:top-64 left-1/2 transform -translate-x-1/2 translate-x-12 sm:translate-x-20 lg:translate-x-48 w-0 h-0 lg:w-17 lg:h-17 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl flex items-center justify-center" elevation={2}>
                <img src="https://logo.clearbit.com/slack.com" alt="Slack" className="w-0 h-0 lg:w-12 lg:h-12 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-52 sm:top-64 lg:top-80 left-1/2 transform -translate-x-1/2 translate-x-40 sm:translate-x-60 lg:translate-x-136 w-0 h-0 lg:w-23 lg:h-23 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl flex items-center justify-center" elevation={4}>
                <img src="https://logo.clearbit.com/uber.com" alt="Uber" className="w-0 h-0 lg:w-17 lg:h-17 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-40 sm:top-48 lg:top-56 left-1/2 transform -translate-x-1/2 translate-x-18 sm:translate-x-28 lg:translate-x-72 w-0 h-0 lg:w-18 lg:h-18 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl flex items-center justify-center" elevation={2}>
                <img src="https://logo.clearbit.com/linkedin.com" alt="LinkedIn" className="w-0 h-0 lg:w-13 lg:h-13 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-76 sm:top-92 lg:top-120 left-1/2 transform -translate-x-1/2 translate-x-22 sm:translate-x-36 lg:translate-x-88 w-0 h-0 lg:w-20 lg:h-20 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl flex items-center justify-center" elevation={3}>
                <img src="https://logo.clearbit.com/salesforce.com" alt="Salesforce" className="w-0 h-0 lg:w-14 lg:h-14 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-28 sm:top-36 lg:top-40 left-1/2 transform -translate-x-1/2 translate-x-26 sm:translate-x-38 lg:translate-x-96 w-0 h-0 lg:w-19 lg:h-19 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl flex items-center justify-center" elevation={3}>
                <img src="https://logo.clearbit.com/shopify.com" alt="Shopify" className="w-0 h-0 lg:w-13 lg:h-13 object-contain" />
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced responsive scroll indicator */}
      <div className={`absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 safe-bottom ${
        isDark ? 'text-dark-text' : 'text-white'
      }`}>
        <div className="animate-bounce">
          <KeyboardArrowDown className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
        </div>
      </div>
    </section>
  );
}