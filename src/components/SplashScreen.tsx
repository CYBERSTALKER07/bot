import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '@mui/material';

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Function to split text into characters with spans
  const wrapChars = (element: HTMLElement) => {
    const text = element.textContent || '';
    element.innerHTML = '';
    
    text.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char; // Use non-breaking space for spaces
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      if (index === 0) {
        // First character starts from the right - adjust for mobile
        span.style.transform = window.innerWidth < 640 ? 'translateX(50px)' : 'translateX(100px)';
      } else {
        // Rest of characters start from the left - adjust for mobile
        span.style.transform = window.innerWidth < 640 ? 'translateX(-15px)' : 'translateX(-30px)';
      }
      span.classList.add('char');
      span.dataset.index = index.toString();
      element.appendChild(span);
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Wrap text in spans for character animation
      if (textRef.current) wrapChars(textRef.current);

      // Create main timeline
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(onComplete, 500);
        }
      });

      const chars = textRef.current?.querySelectorAll('.char') || [];
      
      // Responsive font sizes
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth < 1024;
      
      const largeFontSize = isMobile ? '3rem' : isTablet ? '5rem' : '8rem';
      const smallFontSize = isMobile ? '2.5rem' : isTablet ? '4rem' : '5.5rem';
      
      // First character animation (from right)
      tl.to([chars[0], chars[1], chars[2]], {
        duration: 0.8,
        opacity: 1,
        fontSize: largeFontSize,
        fontWeight: 'bold',
        x: 0,
        ease: 'power2.out'
      })
      // Rest of characters animation (from left to right)
      .to(Array.from(chars).slice(3), {
        duration: 0.05,
        fontSize: smallFontSize,
        fontWeight: 'bold',
        opacity: 1,
        x: 0,
        ease: 'power2.out',
        stagger: {
          amount: 1,
          from: 'start'
        }
      }, '-=0.2')
      // Hold for a moment
      .to({}, { duration: 2 })
      // Exit animation - all characters fade out
      .to(chars, {
        duration: 0.03,
        opacity: 0,
        x: isMobile ? 15 : 30,
        ease: 'power2.in',
        stagger: {
          amount: 0.6,
          from: 'start'
        }
      })
      .to(containerRef.current, {
        duration: 0.8,
        opacity: 0,
        scale: 1.1,
        ease: 'power2.in'
      }, '-=0.3');

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete, isDark]);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300 overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}
    >
      {/* Main Content - Only "AUT Handshake" Text */}
      <div className="text-center relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Typography
            ref={textRef}
            variant="h1"
            align="center"
            className={`bg-clip-text whitespace-nowrap text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl ${
              isDark 
                ? 'bg-lime text-lime' 
                : 'bg-burgundy text-primary'
            }`}
           
          >
            AUT Handshake
          </Typography>
        </div>
      </div>
    </div>
  );
}