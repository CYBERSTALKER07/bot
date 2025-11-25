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
    
    // Set initial positions for floating images
    gsap.set(images, {
      opacity: 1,
      scale: 0.8,
      rotation: (i) => (i % 2 === 0 ? -15 : 15),
    });

    // Create scroll-triggered animation for each image
    images.forEach((image, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
          onUpdate: (self) => {
            const progress = self.progress;
            
            // Calculate movement patterns - some go to center, some go up
            let centerX, centerY;
            
            // Logos that animate upward (indices 5, 7, 9, 11, 13)
            const upwardLogos = [5, 7, 9, 11, 13];
            const isUpwardLogo = upwardLogos.includes(index);
            
            if (isUpwardLogo) {
              // Animate upward and slightly inward
              centerX = -20 * progress; // Slight inward movement
              centerY = -150 * progress; // Strong upward movement
            } else {
              // Original center-bound animation with unique patterns
              const baseX = -50 * progress;
              const baseY = -30 * progress;
              
              centerX = baseX;
              centerY = baseY;
              
              // Add unique movement patterns for center-bound logos
              switch(index % 5) {
                case 0: // Spiral inward
                  centerX += Math.sin(progress * Math.PI * 2) * 20 * (1 - progress);
                  centerY += Math.cos(progress * Math.PI * 2) * 15 * (1 - progress);
                  break;
                case 1: // Wave motion
                  centerX += Math.sin(progress * Math.PI * 4) * 15 * (1 - progress);
                  break;
                case 2: // Bounce effect
                  centerY += Math.abs(Math.sin(progress * Math.PI * 6)) * 10 * (1 - progress);
                  break;
                case 3: // Zigzag pattern
                  centerX += (Math.sin(progress * Math.PI * 8) * 25) * (1 - progress);
                  centerY += (Math.cos(progress * Math.PI * 6) * 20) * (1 - progress);
                  break;
                case 4: // Circular motion
                  centerX += Math.cos(progress * Math.PI * 3) * 18 * (1 - progress);
                  centerY += Math.sin(progress * Math.PI * 3) * 18 * (1 - progress);
                  break;
              }
            }
            
            // Enhanced scale animation with different patterns for upward vs center logos
            let scale;
            if (isUpwardLogo) {
              // Upward logos shrink as they move up
              const baseScale = 0.8 - (0.4 * progress); // Shrink from 0.8 to 0.4
              const pulseScale = 1 + Math.sin(progress * Math.PI * 6) * 0.15 * (1 - progress);
              scale = Math.max(0.2, baseScale * pulseScale); // Minimum scale of 0.2
            } else {
              // Center logos grow as they move inward
              const baseScale = 0.8 + (0.4 * progress);
              const pulseScale = 1 + Math.sin(progress * Math.PI * 4) * 0.1 * (1 - progress);
              scale = baseScale * pulseScale;
            }
            
            // Dynamic rotation with different speeds
            let rotation;
            if (isUpwardLogo) {
              // Upward logos spin faster
              const baseRotation = (index % 2 === 0 ? -15 : 15) * (1 - progress);
              const spinRotation = progress * 720 * (index % 2 === 0 ? 1 : -1); // 2 full rotations
              rotation = baseRotation + spinRotation;
            } else {
              // Center logos spin slower
              const baseRotation = (index % 2 === 0 ? -15 : 15) * (1 - progress);
              const spinRotation = progress * 360 * (index % 2 === 0 ? 1 : -1) * 0.5;
              rotation = baseRotation + spinRotation;
            }
            
            // Enhanced opacity with different fade patterns
            let opacity;
            if (isUpwardLogo) {
              // Upward logos fade out faster
              if (progress < 0.5) {
                opacity = 1 - (progress * 0.4); // Fade to 60% by halfway
              } else {
                opacity = 0.6 - ((progress - 0.5) / 0.5) * 0.6; // Fade to 0 in second half
              }
            } else {
              // Center logos fade out slower
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
            
            // Add dynamic glow effect with different colors for different directions
            const imageElement = image as HTMLElement;
            if (progress > 0.2 && progress < 0.8) {
              const glowIntensity = Math.sin((progress - 0.2) * Math.PI / 0.6) * 20;
              const glowColor = isUpwardLogo ? 
                (isDark ? '70, 130, 180' : '255, 140, 0') : // Blue for upward, orange for center
                (isDark ? '227, 255, 112' : '128, 0, 58'); // Lime/maroon for center
              
              imageElement.style.filter = `drop-shadow(0 0 ${glowIntensity}px rgba(${glowColor}, 0.6))`;
            } else {
              imageElement.style.filter = 'none';
            }
          }
        }
      });
    });

    // Animate hero content
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    });

    heroTl.to(heroContentRef.current, {
      y: -100,
      opacity: 0.3,
      scale: 0.9,
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
        ? 'bg-linear-to-br from-dark-bg via-dark-surface to-gray-900' 
        : 'bg-linear-to-br from-asu-maroon via-asu-maroon-dark to-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={heroContentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`${isDark ? 'text-dark-text' : 'text-white'}`}>
            <Typography 
              variant="h1" 
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              color={isDark ? 'textPrimary' : 'inherit'}
            >
              Your Career
              <span className={`block bg-clip-text text-transparent ${
                isDark 
                  ? 'bg-linear-to-r from-lime via-dark-accent to-lime' 
                  : 'bg-linear-to-r from-asu-gold via-yellow-300 to-asu-gold'
              }`}>
                Starts Here
              </span>
            </Typography>
            <Typography 
              variant="h5" 
              className={`text-xl md:text-2xl mb-8 leading-relaxed ${
                isDark ? 'text-dark-muted' : 'text-white'
              }`}
            >
              Connect with amazing companies, find your dream internship, and launch your career at American University of Technology's most comprehensive job platform!
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                component={Link}
                to="/register?role=student"
                variant="contained"
                color="primary"
                size="large"
                className={`shadow-lg rounded-3xl hover:shadow-xl transition-shadow duration-200
                ${isDark 
                  ? 'bg-lime text-dark-bg hover:bg-lime/90' 
                  : 'bg-asu-gold hover:bg-yellow-400'
                }`}
                startIcon={<RocketLaunch />}
                endIcon={<ArrowForward />}
              >
                Find Your Dream Job
              </Button>
              <Button
                component={Link}
                to="/register?role=employer"
                variant="outlined"
                color="primary"
                size="large"
                className={`shadow-lg rounded-3xl hover:shadow-xl transition-shadow duration-200 border-2 ${
                  isDark 
                    ? 'border-lime text-lime hover:bg-lime/10' 
                    : 'border-white text-white hover:bg-white/10'
                }`}
                startIcon={<Business />}
              >
                Post Jobs
              </Button>
            </div>
          </div>
          
          {/* Enhanced right side with floating animated images */}
          <div className="relative">
            {/* Floating Images Container */}
            <div ref={floatingImagesRef} className="absolute inset-0 pointer-events-none">
              {/* Company Logo Cards - Maximum spacing distribution */}
              <Card className="floating-image absolute top-2 left-1/2 transform -translate-x-1/2 translate-x-64 w-24 h-24 bg-white/95 backdrop-blur-sm border border-none shadow-2xl flex items-center justify-center" elevation={4}>
                <img src="https://logo.clearbit.com/google.com" alt="Google" className="w-16 h-16 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-72 left-1/2 transform -translate-x-1/2 translate-x-8 w-20 h-20 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl flex items-center justify-center" elevation={3}>
                <img src="https://logo.clearbit.com/microsoft.com" alt="Microsoft" className="w-14 h-14 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-16 left-1/2 transform -translate-x-1/2 translate-x-104 w-18 h-18 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl flex items-center justify-center" elevation={2}>
                <img src="https://logo.clearbit.com/apple.com" alt="Apple" className="w-12 h-12 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-96 left-1/2 transform -translate-x-1/2 translate-x-40 w-28 h-28 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl flex items-center justify-center" elevation={4}>
                <img src="https://logo.clearbit.com/tesla.com" alt="Tesla" className="w-20 h-20 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-8 left-1/2 transform -translate-x-1/2 translate-x-128 w-16 h-16 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl flex items-center justify-center" elevation={2}>
                <img src="https://logo.clearbit.com/meta.com" alt="Meta" className="w-12 h-12 object-contain" />
              </Card>

              {/* Additional Company Logos - Maximum spacing */}
              <Card className="floating-image absolute top-112 left-1/2 transform -translate-x-1/2 translate-x-80 w-22 h-22 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl flex items-center justify-center" elevation={3}>
                <img src="https://logo.clearbit.com/netflix.com" alt="Netflix" className="w-16 h-16 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-32 left-1/2 transform -translate-x-1/2 translate-x-24 w-20 h-20 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl flex items-center justify-center" elevation={4}>
                <img src="https://logo.clearbit.com/amazon.com" alt="Amazon" className="w-14 h-14 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-88 left-1/2 transform -translate-x-1/2 translate-x-144 w-18 h-18 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl flex items-center justify-center" elevation={2}>
                <img src="https://logo.clearbit.com/adobe.com" alt="Adobe" className="w-12 h-12 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-48 left-1/2 transform -translate-x-1/2 translate-x-4 w-19 h-19 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl flex items-center justify-center" elevation={3}>
                <img src="https://logo.clearbit.com/spotify.com" alt="Spotify" className="w-13 h-13 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-104 left-1/2 transform -translate-x-1/2 translate-x-112 w-21 h-21 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl flex items-center justify-center" elevation={3}>
                <img src="https://logo.clearbit.com/airbnb.com" alt="Airbnb" className="w-15 h-15 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-64 left-1/2 transform -translate-x-1/2 translate-x-48 w-17 h-17 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl flex items-center justify-center" elevation={2}>
                <img src="https://logo.clearbit.com/slack.com" alt="Slack" className="w-12 h-12 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-80 left-1/2 transform -translate-x-1/2 translate-x-136 w-23 h-23 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl flex items-center justify-center" elevation={4}>
                <img src="https://logo.clearbit.com/uber.com" alt="Uber" className="w-17 h-17 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-56 left-1/2 transform -translate-x-1/2 translate-x-72 w-18 h-18 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl flex items-center justify-center" elevation={2}>
                <img src="https://logo.clearbit.com/linkedin.com" alt="LinkedIn" className="w-13 h-13 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-120 left-1/2 transform -translate-x-1/2 translate-x-88 w-20 h-20 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl flex items-center justify-center" elevation={3}>
                <img src="https://logo.clearbit.com/salesforce.com" alt="Salesforce" className="w-14 h-14 object-contain" />
              </Card>
              
              <Card className="floating-image absolute top-40 left-1/2 transform -translate-x-1/2 translate-x-96 w-19 h-19 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl flex items-center justify-center" elevation={3}>
                <img src="https://logo.clearbit.com/shopify.com" alt="Shopify" className="w-13 h-13 object-contain" />
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Material Design scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 ${
        isDark ? 'text-dark-text' : 'text-white'
      }`}>
        <div className="animate-bounce">
          <KeyboardArrowDown className="h-8 w-8" />
        </div>
      </div>
    </section>
  );
}