import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

interface CompanyLogosBackgroundProps {
  density?: 'low' | 'medium' | 'high';
  opacity?: number;
  enableAnimation?: boolean;
}

export default function CompanyLogosBackground({ 
  density = 'medium', 
  opacity = 0.08,
  enableAnimation = true 
}: CompanyLogosBackgroundProps) {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  // Company data with real logos and authentic brand colors
  const companies = [
    // Tech Giants with real brand colors
    { 
      name: 'Google', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', 
      category: 'tech', 
      color: '#4285F4',
      bgColor: '#FFFFFF',
      textColor: '#EA4335'
    },
    { 
      name: 'Microsoft', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', 
      category: 'tech', 
      color: '#00A4EF',
      bgColor: '#FFFFFF',
      textColor: '#737373'
    },
    { 
      name: 'Apple', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', 
      category: 'tech', 
      color: '#000000',
      bgColor: '#FFFFFF',
      textColor: '#1D1D1F'
    },
    { 
      name: 'Meta', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', 
      category: 'tech', 
      color: '#1877F2',
      bgColor: '#FFFFFF',
      textColor: '#1C2B33'
    },
    { 
      name: 'Amazon', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', 
      category: 'tech', 
      color: '#FF9900',
      bgColor: '#FFFFFF',
      textColor: '#232F3E'
    },
    { 
      name: 'Netflix', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', 
      category: 'tech', 
      color: '#E50914',
      bgColor: '#000000',
      textColor: '#FFFFFF'
    },
    { 
      name: 'Tesla', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg', 
      category: 'automotive', 
      color: '#CC0000',
      bgColor: '#000000',
      textColor: '#FFFFFF'
    },
    { 
      name: 'SpaceX', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/d/de/SpaceX-Logo.svg', 
      category: 'aerospace', 
      color: '#005288',
      bgColor: '#000000',
      textColor: '#FFFFFF'
    },
    { 
      name: 'Airbnb', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg', 
      category: 'tech', 
      color: '#FF5A5F',
      bgColor: '#FFFFFF',
      textColor: '#484848'
    },
    { 
      name: 'Uber', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png', 
      category: 'tech', 
      color: '#000000',
      bgColor: '#FFFFFF',
      textColor: '#000000'
    },
    { 
      name: 'Spotify', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg', 
      category: 'tech', 
      color: '#1DB954',
      bgColor: '#191414',
      textColor: '#FFFFFF'
    },
    { 
      name: 'Adobe', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg', 
      category: 'tech', 
      color: '#FF0000',
      bgColor: '#FFFFFF',
      textColor: '#FA0F00'
    },
    { 
      name: 'GitHub', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg', 
      category: 'tech', 
      color: '#181717',
      bgColor: '#FFFFFF',
      textColor: '#24292E'
    },
    { 
      name: 'LinkedIn', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png', 
      category: 'tech', 
      color: '#0A66C2',
      bgColor: '#FFFFFF',
      textColor: '#000000'
    },
    
    // Finance with real brand colors
    { 
      name: 'Goldman Sachs', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg', 
      category: 'finance', 
      color: '#0073B2',
      bgColor: '#FFFFFF',
      textColor: '#0073B2'
    },
    { 
      name: 'JPMorgan', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/JPMorgan_Chase_Logo_2008.svg', 
      category: 'finance', 
      color: '#003C71',
      bgColor: '#FFFFFF',
      textColor: '#003C71'
    },
    { 
      name: 'PayPal', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg', 
      category: 'finance', 
      color: '#003087',
      bgColor: '#FFFFFF',
      textColor: '#009CDE'
    },
    { 
      name: 'Visa', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg', 
      category: 'finance', 
      color: '#1A1F71',
      bgColor: '#FFFFFF',
      textColor: '#1A1F71'
    },
    { 
      name: 'Mastercard', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg', 
      category: 'finance', 
      color: '#EB001B',
      bgColor: '#FFFFFF',
      textColor: '#FF5F00'
    },
    
    // Consulting & Professional Services
    { 
      name: 'Deloitte', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Deloitte_Logo.svg', 
      category: 'consulting', 
      color: '#86BC25',
      bgColor: '#FFFFFF',
      textColor: '#000000'
    },
    { 
      name: 'Accenture', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg', 
      category: 'consulting', 
      color: '#A100FF',
      bgColor: '#FFFFFF',
      textColor: '#A100FF'
    },
    { 
      name: 'IBM', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg', 
      category: 'tech', 
      color: '#052FAD',
      bgColor: '#FFFFFF',
      textColor: '#1F70C1'
    },
    
    // Consumer Brands with real colors
    { 
      name: 'Coca Cola', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg', 
      category: 'consumer', 
      color: '#F40009',
      bgColor: '#FFFFFF',
      textColor: '#F40009'
    },
    { 
      name: 'Nike', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', 
      category: 'consumer', 
      color: '#FF7500',
      bgColor: '#FFFFFF',
      textColor: '#111111'
    },
    { 
      name: 'McDonald\'s', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg', 
      category: 'consumer', 
      color: '#FFC72C',
      bgColor: '#DA020E',
      textColor: '#FFFFFF'
    },
    { 
      name: 'Starbucks', 
      logo: 'https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg', 
      category: 'consumer', 
      color: '#00704A',
      bgColor: '#FFFFFF',
      textColor: '#00704A'
    },
    
    // Automotive with real colors
    { 
      name: 'Toyota', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Toyota_Motor_Logo.svg', 
      category: 'automotive', 
      color: '#C8102E',
      bgColor: '#FFFFFF',
      textColor: '#C8102E'
    },
    { 
      name: 'BMW', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg', 
      category: 'automotive', 
      color: '#1C69D4',
      bgColor: '#FFFFFF',
      textColor: '#000000'
    },
    { 
      name: 'Mercedes', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg', 
      category: 'automotive', 
      color: '#A6A6A6',
      bgColor: '#FFFFFF',
      textColor: '#000000'
    },
    
    // Media & Entertainment
    { 
      name: 'Disney', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg', 
      category: 'media', 
      color: '#003B7F',
      bgColor: '#11161D',
      textColor: '#F9F9F9'
    },
    { 
      name: 'YouTube', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg', 
      category: 'media', 
      color: '#FF0000',
      bgColor: '#FFFFFF',
      textColor: '#282828'
    },
    
    // Cloud & Infrastructure with real colors
    { 
      name: 'Oracle', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg', 
      category: 'tech', 
      color: '#F80000',
      bgColor: '#FFFFFF',
      textColor: '#C74634'
    },
    { 
      name: 'Salesforce', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg', 
      category: 'tech', 
      color: '#00A1E0',
      bgColor: '#FFFFFF',
      textColor: '#032D60'
    },
    
    // Airlines & Travel
    { 
      name: 'Boeing', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Boeing_full_logo.svg', 
      category: 'aerospace', 
      color: '#0039A6',
      bgColor: '#FFFFFF',
      textColor: '#0039A6'
    },
    
    // Semiconductor with real colors
    { 
      name: 'Intel', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg', 
      category: 'tech', 
      color: '#0071C5',
      bgColor: '#FFFFFF',
      textColor: '#0071C5'
    },
    { 
      name: 'NVIDIA', 
      logo: 'https://upload.wikimedia.org/wikipedia/en/2/21/Nvidia_logo.svg', 
      category: 'tech', 
      color: '#76B900',
      bgColor: '#000000',
      textColor: '#76B900'
    },
    { 
      name: 'AMD', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg', 
      category: 'tech', 
      color: '#ED1C24',
      bgColor: '#FFFFFF',
      textColor: '#000000'
    }
  ];

  // Get number of logos based on density
  const getLogoCount = () => {
    switch (density) {
      case 'low': return 20;
      case 'medium': return 30;
      case 'high': return 45;
      default: return 30;
    }
  };

  // Generate random positions for logos
  const generateLogos = () => {
    const logoCount = getLogoCount();
    const logos = [];
    
    for (let i = 0; i < logoCount; i++) {
      const company = companies[Math.floor(Math.random() * companies.length)];
      const size = Math.random() * 50 + 30; // 30px to 80px for better visibility
      const x = Math.random() * 100; // 0% to 100%
      const y = Math.random() * 100; // 0% to 100%
      const rotation = Math.random() * 360;
      
      logos.push({
        ...company,
        id: `logo-${i}`,
        size,
        x,
        y,
        rotation,
        animationDelay: Math.random() * 10
      });
    }
    
    return logos;
  };

  const [logos] = React.useState(generateLogos());

  useEffect(() => {
    if (!enableAnimation || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Store initial positions and create animation data for each logo
      const logoData = logos.map((logo, index) => {
        const element = containerRef.current?.querySelector(`#${logo.id}`);
        if (!element) return null;
        
        return {
          element,
          initialY: logo.y,
          initialX: logo.x,
          initialRotation: logo.rotation,
          speed: (index % 5 + 1) * 0.2, // More varied parallax speeds
          floatRange: Math.random() * 40 + 20,
          rotationRange: Math.random() * 60 - 30,
          scaleRange: Math.random() * 0.4 + 0.8, // 0.8 to 1.2
          horizontalDrift: Math.random() * 100 - 50 // -50 to 50px drift
        };
      }).filter(Boolean);

      // Continuous floating animation for each logo
      logoData.forEach((data, index) => {
        if (!data) return;

        // Main floating animation
        gsap.to(data.element, {
          y: `+=${data.floatRange}`,
          x: `+=${data.horizontalDrift}`,
          rotation: `+=${data.rotationRange}`,
          duration: Math.random() * 12 + 18, // 18-30 seconds for slower, more natural movement
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: logos[index].animationDelay
        });

        // Independent scale pulsing
        gsap.to(data.element, {
          scale: data.scaleRange,
          duration: Math.random() * 10 + 12, // 12-22 seconds
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: logos[index].animationDelay * 0.5
        });

        // Subtle opacity breathing
        gsap.to(data.element, {
          opacity: `+=${Math.random() * 0.3 + 0.1}`, // Vary opacity by 0.1-0.4
          duration: Math.random() * 8 + 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: logos[index].animationDelay * 1.2
        });
      });

      // Enhanced dynamic scroll-based animations
      let previousProgress = 0;
      let scrollVelocity = 0;
      let velocityHistory = [];
      const maxVelocityHistory = 5;
      
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5, // Slightly less scrub for more responsive feel
        onUpdate: (self) => {
          const progress = self.progress;
          const currentVelocity = Math.abs(progress - previousProgress);
          
          // Track velocity history for smoother animations
          velocityHistory.push(currentVelocity);
          if (velocityHistory.length > maxVelocityHistory) {
            velocityHistory.shift();
          }
          
          // Calculate average velocity for smoother responses
          const avgVelocity = velocityHistory.reduce((a, b) => a + b, 0) / velocityHistory.length;
          const direction = progress > previousProgress ? 1 : -1;
          
          scrollVelocity = avgVelocity;
          
          logoData.forEach((data, index) => {
            if (!data) return;
            
            // Dynamic parallax based on scroll progress and velocity
            const baseParallax = progress * data.speed * 200;
            const velocityBoost = avgVelocity * direction * 100;
            const finalY = baseParallax + velocityBoost;
            
            // Dynamic rotation based on scroll direction and velocity
            const scrollRotation = progress * 45 + (direction * avgVelocity * 180);
            
            // Dynamic scale based on velocity (logos get smaller when scrolling fast)
            const velocityScale = Math.max(0.7, 1 - (avgVelocity * 2));
            
            // Dynamic horizontal drift based on scroll
            const horizontalOffset = Math.sin(progress * Math.PI * 2 + index) * 30;
            
            gsap.to(data.element, {
              y: finalY,
              x: horizontalOffset,
              rotation: scrollRotation,
              scale: velocityScale,
              duration: 0.6,
              ease: 'power2.out',
              overwrite: 'auto'
            });
            
            // Dynamic blur effect based on velocity
            const blurAmount = Math.min(avgVelocity * 10, 3);
            gsap.to(data.element, {
              filter: `blur(${blurAmount}px)`,
              duration: 0.3,
              ease: 'power2.out'
            });
          });
          
          previousProgress = progress;
        },
        
        onEnter: () => {
          // Staggered entrance animation
          logoData.forEach((data, index) => {
            if (!data) return;
            gsap.fromTo(data.element, 
              { 
                opacity: 0, 
                scale: 0.3,
                rotation: -180,
                y: 100 
              },
              { 
                opacity: opacity, 
                scale: 1, 
                rotation: data.initialRotation,
                y: 0,
                duration: 1.2, 
                delay: index * 0.08,
                ease: 'back.out(1.7)'
              }
            );
          });
        },
        
        onLeave: () => {
          // Dynamic exit animation
          logoData.forEach((data, index) => {
            if (!data) return;
            gsap.to(data.element, {
              opacity: 0,
              scale: 0.6,
              rotation: `+=${180}`,
              y: -100,
              duration: 0.8,
              delay: index * 0.03,
              ease: 'power2.in'
            });
          });
        },
        
        onEnterBack: () => {
          // Re-entrance from bottom with different animation
          logoData.forEach((data, index) => {
            if (!data) return;
            gsap.fromTo(data.element,
              { 
                opacity: 0, 
                scale: 0.5,
                rotation: 360,
                y: -100 
              },
              { 
                opacity: opacity, 
                scale: 1, 
                rotation: data.initialRotation,
                y: 0,
                duration: 1.0, 
                delay: index * 0.06,
                ease: 'elastic.out(1, 0.75)'
              }
            );
          });
        },
        
        onLeaveBack: () => {
          // Exit upward when scrolling back up
          logoData.forEach((data, index) => {
            if (!data) return;
            gsap.to(data.element, {
              opacity: 0,
              scale: 0.3,
              rotation: `-=${180}`,
              y: 150,
              duration: 0.7,
              delay: index * 0.02,
              ease: 'power2.in'
            });
          });
        }
      });

      // Additional scroll velocity-based effects
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: () => {
          // Create ripple effect based on scroll velocity
          if (scrollVelocity > 0.02) {
            logoData.forEach((data, index) => {
              if (!data || Math.random() > 0.3) return; // Only affect 30% of logos randomly
              
              gsap.to(data.element, {
                scale: `+=${scrollVelocity * 2}`,
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: 'power2.out'
              });
            });
          }
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, [logos, enableAnimation, opacity]);

  const BackgroundLogo = ({ logo }: { logo: any }) => (
    <div
      id={logo.id}
      className="absolute pointer-events-none transition-opacity duration-500"
      style={{
        left: `${logo.x}%`,
        top: `${logo.y}%`,
        width: `${logo.size}px`,
        height: `${logo.size}px`,
        transform: `rotate(${logo.rotation}deg)`,
        opacity: opacity
      }}
    >
      <div 
        className="w-full h-full rounded-2xl flex items-center justify-center p-3 relative overflow-hidden shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${logo.bgColor}E6, ${logo.color}33)`,
          border: `2px solid ${logo.color}66`,
          backdropFilter: 'blur(4px)',
        }}
      >
        <img 
          src={logo.logo} 
          alt={logo.name}
          className="w-full h-full object-contain relative z-10"
          style={{
            filter: isDark 
              ? `brightness(1.1) contrast(1.4) saturate(1.2) drop-shadow(0 0 8px ${logo.color}80)` 
              : `brightness(1.0) contrast(1.2) saturate(1.1) drop-shadow(0 0 6px ${logo.color}60)`,
            maxWidth: '100%',
            maxHeight: '100%',
            opacity: 1
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="w-full h-full flex items-center justify-center text-sm font-bold rounded-xl" 
                     style="background: ${logo.color}40; color: ${logo.color}; border: 2px solid ${logo.color}80; opacity: 1;">
                  ${logo.name.split(' ').map((word: string) => word.charAt(0)).join('')}
                </div>
              `;
            }
          }}
        />
        {/* Enhanced brand color overlay */}
        <div 
          className="absolute inset-0 rounded-2xl mix-blend-soft-light opacity-30 pointer-events-none"
          style={{ 
            background: `linear-gradient(45deg, ${logo.color}40, ${logo.bgColor}20)`,
          }}
        />
        {/* Stronger brand accent border */}
        <div 
          className="absolute inset-0 rounded-2xl border opacity-60 pointer-events-none"
          style={{ 
            borderColor: logo.color,
            borderWidth: '2px'
          }}
        />
      </div>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none "
    //   aria-hidden="true"
    >
      {logos.map((logo) => (
        <BackgroundLogo key={logo.id} logo={logo} />
      ))}
    </div>
  );
}