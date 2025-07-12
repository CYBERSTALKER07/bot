import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { User, Search, Target } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Typography } from '@mui/material';
import { useScrollTrigger, useScrollTriggerStagger } from '../../hooks/useScrollTrigger';

interface HowItWorksSectionProps {
  howItWorksRef: React.RefObject<HTMLDivElement>;
}

export default function HowItWorksSection({ howItWorksRef }: HowItWorksSectionProps) {
  const { isDark } = useTheme();
  const headerRef = useRef<HTMLDivElement>(null);

  // Dynamic header animation with real-time scroll response
  useScrollTrigger(headerRef, (element, progress) => {
    gsap.set(element, {
      opacity: progress,
      y: (1 - progress) * 80,
      scale: 0.85 + (progress * 0.15),
      rotationY: (1 - progress) * 15,
      ease: 'none'
    });
  }, { 
    start: 'top 90%', 
    end: 'top 40%',
    scrub: 2 
  });

  // Dynamic step cards animation with real-time scroll response
  useScrollTriggerStagger(howItWorksRef, '.step-card', (elements, progress) => {
    elements.forEach((element, index) => {
      const delay = index * 0.2;
      const elementProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      
      // Real-time step animations that respond to scroll direction
      gsap.set(element, {
        opacity: elementProgress,
        y: (1 - elementProgress) * 200,
        scale: 0.5 + (elementProgress * 0.5),
        rotation: (1 - elementProgress) * 20 * (index % 2 === 0 ? 1 : -1),
        ease: 'none'
      });

      // Dynamic step number scaling and rotation
      const stepNumber = element.querySelector('.step-number');
      if (stepNumber && elementProgress > 0.3) {
        const numberProgress = (elementProgress - 0.3) / 0.7;
        gsap.set(stepNumber, {
          scale: 0.5 + (numberProgress * 0.7),
          rotation: numberProgress * 360,
          ease: 'none'
        });
      }

      // Dynamic icon animation
      const stepIcon = element.querySelector('.step-icon');
      if (stepIcon && elementProgress > 0.1) {
        const iconProgress = (elementProgress - 0.1) / 0.9;
        gsap.set(stepIcon, {
          scale: 0.3 + (iconProgress * 0.8),
          rotation: iconProgress * 360,
          y: (1 - iconProgress) * 30,
          ease: 'none'
        });
        
        // Dynamic glow effect for icons
        if (iconProgress > 0.6) {
          const glowIntensity = (iconProgress - 0.6) / 0.4;
          (stepIcon as HTMLElement).style.filter = `drop-shadow(0 0 ${glowIntensity * 25}px ${
            isDark ? '#E3FF70' : '#8C1D40'
          })`;
        } else {
          (stepIcon as HTMLElement).style.filter = 'none';
        }
      }

      // Dynamic text reveal with stagger
      const stepTitle = element.querySelector('.step-title') as HTMLElement;
      const stepDescription = element.querySelector('.step-description') as HTMLElement;
      
      if (stepTitle && elementProgress > 0.5) {
        const titleProgress = (elementProgress - 0.5) / 0.5;
        stepTitle.style.opacity = titleProgress.toString();
        stepTitle.style.transform = `translateY(${(1 - titleProgress) * 30}px) scale(${0.9 + titleProgress * 0.1})`;
      }
      
      if (stepDescription && elementProgress > 0.7) {
        const descProgress = (elementProgress - 0.7) / 0.3;
        stepDescription.style.opacity = descProgress.toString();
        stepDescription.style.transform = `translateY(${(1 - descProgress) * 20}px)`;
      }

      // Dynamic connection line animation
      const connectionLine = element.querySelector('.connection-line');
      if (connectionLine && elementProgress > 0.8) {
        const lineProgress = (elementProgress - 0.8) / 0.2;
        gsap.set(connectionLine, {
          scaleX: lineProgress,
          opacity: lineProgress,
          ease: 'none'
        });
      }
    });
  }, { 
    start: 'top 70%', 
    end: 'bottom 70%',
    scrub: 1.8
  });

  return (
    <section ref={howItWorksRef} className={`py-24 relative overflow-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-dark-surface to-dark-bg' 
        : 'bg-gradient-to-b from-gray-50 to-white'
    }`}>
      <div className="absolute inset-0">
        <div className={`absolute top-10 left-10 w-20 h-20 rounded-full blur-xl ${
          isDark ? 'bg-lime/5' : 'bg-asu-maroon/5'
        }`}></div>
        <div className={`absolute bottom-10 right-10 w-32 h-32 rounded-full blur-2xl ${
          isDark ? 'bg-dark-accent/5' : 'bg-asu-gold/5'
        }`}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <Typography 
            variant="h2" 
            className={`text-reveal text-5xl md:text-6xl font-bold mb-6 transition-colors duration-300 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}
            align="center"
          >
            How It Works
          </Typography>
          <Typography 
            variant="subtitle1" 
            className={`text-reveal text-xl max-w-2xl mx-auto transition-colors duration-300 ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}
            align="center"
            ml={30}
          >
            Get started in minutes and find your perfect opportunity with our streamlined process
          </Typography>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            {
              step: "01",
              title: "Create Your Profile",
              description: "Build a comprehensive profile showcasing your skills, experience, and career aspirations. Upload your resume and let AI optimize it.",
              icon: <User className="h-20 w-20 text-white" />,
              gradient: isDark ? "from-dark to-lime" : "from-asu-maroon to-asu-maroon",
              delay: 0
            },
            {
              step: "02", 
              title: "Discover Opportunities",
              description: "Browse through thousands of verified job postings and internships from top employers. Get personalized recommendations.",
              icon: <Search className="h-20 w-20 text-white" />,
              gradient: isDark ? "from-dark to-lime" : "from-asu-maroon to-asu-maroon",
              delay: 0.2
            },
            {
              step: "03",
              title: "Apply & Connect",
              description: "Apply with one click and connect directly with hiring managers. Track your progress and get real-time updates.",
              icon: <Target className="h-20 w-20 text-white" />,
              gradient: isDark ? "from-dark to-lime" : "from-asu-maroon to-asu-maroon",
              delay: 0.4
            }
          ].map((step, index) => (
            <div key={index} className="step-card text-center group relative">
              <div className="relative mb-10">
                <div className={`step-icon mx-auto w-40 h-40 bg-gradient-to-br ${step.gradient} rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl`}>
                  {step.icon}
                </div>
                <div className={`step-number absolute -top-6 -right-6 border-4 w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-lg ${
                  isDark 
                    ? 'bg-dark-surface border-lime text-lime' 
                    : 'bg-white border-asu-gold text-asu-maroon'
                }`}>
                  {step.step}
                </div>
                {/* Connection line */}
                {index < 2 && (
                  <div className={`connection-line hidden md:block absolute top-1/2 -right-8 w-16 h-0.5 ${
                    isDark 
                      ? 'bg-gradient-to-r from-lime to-transparent' 
                      : 'bg-gradient-to-r from-asu-maroon to-transparent'
                  }`}></div>
                )}
              </div>
              <h3 className={`step-title text-3xl font-bold mb-6 transition-colors duration-300 ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}>{step.title}</h3>
              <p className={`step-description leading-relaxed text-lg transition-colors duration-300 ${
                isDark ? 'text-dark-muted' : 'text-gray-600'
              }`}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}