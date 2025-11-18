import React, { useRef } from 'react';
import { GraduationCap, User, Search, Target, Award, CheckCircle, Briefcase } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Typography } from '@mui/material';
import { useScrollTrigger, useScrollTriggerStagger } from '../../hooks/useScrollTrigger';
import { gsap } from 'gsap';

export default function CareerPathSection() {
  const { isDark } = useTheme();
  const headerRef = useRef<HTMLDivElement>(null);
  const pathVisualizationRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const connectingLinesRef = useRef<SVGSVGElement>(null);

  // Header animation with dynamic scroll response
  useScrollTrigger(headerRef, (element, progress) => {
    gsap.set(element, {
      opacity: progress,
      y: (1 - progress) * 80,
      scale: 0.85 + (progress * 0.15),
      rotationX: (1 - progress) * 12,
      ease: 'none'
    });
  }, { 
    start: 'top 85%', 
    end: 'top 45%',
    scrub: 1.8 
  });

  // Path visualization with sequential step animations
  useScrollTriggerStagger(pathVisualizationRef, '.career-step', (elements, progress) => {
    elements.forEach((element, index) => {
      const delay = index * 0.15;
      const elementProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      
      // Different animation styles for each step
      if (index === 0) { // Starting step - bounce in from bottom
        gsap.set(element, {
          opacity: elementProgress,
          y: (1 - elementProgress) * 120,
          scale: 0.5 + (elementProgress * 0.5),
          rotation: (1 - elementProgress) * 360,
          ease: 'none'
        });
      } else if (index === 1) { // Application step - slide from left
        gsap.set(element, {
          opacity: elementProgress,
          x: (1 - elementProgress) * -150,
          scale: 0.7 + (elementProgress * 0.3),
          rotationY: (1 - elementProgress) * 45,
          ease: 'none'
        });
      } else if (index === 2) { // Interview step - slide from right
        gsap.set(element, {
          opacity: elementProgress,
          x: (1 - elementProgress) * 150,
          scale: 0.7 + (elementProgress * 0.3),
          rotationY: (1 - elementProgress) * -45,
          ease: 'none'
        });
      } else if (index === 3) { // Success step - epic entrance
        gsap.set(element, {
          opacity: elementProgress,
          y: (1 - elementProgress) * -100,
          scale: 0.3 + (elementProgress * 0.7),
          rotation: (1 - elementProgress) * 180,
          ease: 'none'
        });
        
        // Add glow effect for success step
        if (elementProgress > 0.7) {
          const glowIntensity = (elementProgress - 0.7) / 0.3;
          (element as HTMLElement).style.filter = `drop-shadow(0 0 ${glowIntensity * 30}px ${
            isDark ? '#E3FF70' : '#FFC627'
          })`;
        } else {
          (element as HTMLElement).style.filter = 'none';
        }
      }
    });
  }, { 
    start: 'top 75%', 
    end: 'bottom 85%',
    scrub: 1.5 
  });

  // Benefits section with staggered animations
  useScrollTriggerStagger(benefitsRef, '.benefit-item', (elements, progress) => {
    elements.forEach((element, index) => {
      const delay = index * 0.12;
      const elementProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      
      gsap.set(element, {
        opacity: elementProgress,
        x: (1 - elementProgress) * 80,
        y: (1 - elementProgress) * 40,
        scale: 0.8 + (elementProgress * 0.2),
        rotation: (1 - elementProgress) * 8,
        ease: 'none'
      });

      // Icon animation
      const icon = element.querySelector('.benefit-icon');
      if (icon && elementProgress > 0.3) {
        const iconProgress = (elementProgress - 0.3) / 0.7;
        gsap.set(icon, {
          scale: 0.5 + (iconProgress * 0.6),
          rotation: iconProgress * 360,
          ease: 'none'
        });
      }

      // Text reveal animation
      const title = element.querySelector('.benefit-title') as HTMLElement;
      const description = element.querySelector('.benefit-description') as HTMLElement;
      
      if (title && elementProgress > 0.5) {
        const titleProgress = (elementProgress - 0.5) / 0.5;
        title.style.opacity = titleProgress.toString();
        title.style.transform = `translateY(${(1 - titleProgress) * 20}px)`;
      }
      
      if (description && elementProgress > 0.7) {
        const descProgress = (elementProgress - 0.7) / 0.3;
        description.style.opacity = descProgress.toString();
        description.style.transform = `translateY(${(1 - descProgress) * 15}px)`;
      }
    });
  }, { 
    start: 'top 70%', 
    end: 'bottom 80%',
    scrub: 1.6 
  });

  // Connecting lines animation
  useScrollTrigger(connectingLinesRef, (element, progress) => {
    const path = element.querySelector('path');
    if (path) {
      // Animate path drawing
      const pathLength = path.getTotalLength();
      path.style.strokeDasharray = `${pathLength} ${pathLength}`;
      path.style.strokeDashoffset = `${pathLength * (1 - progress)}`;
      
      // Animate path opacity and glow
      gsap.set(path, {
        opacity: progress * 0.8,
        filter: `drop-shadow(0 0 ${progress * 10}px ${isDark ? '#E3FF70' : '#FFC627'})`,
        ease: 'none'
      });
    }
  }, { 
    start: 'top 60%', 
    end: 'bottom 70%',
    scrub: 2 
  });

  return (
    <section className={`py-24 relative overflow-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-lime/5 to-dark-accent/5' 
        : 'bg-gradient-to-br from-asu-maroon/5 to-asu-gold/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-20">
          <Typography 
            variant="h2" 
            className={`text-5xl md:text-6xl font-bold mb-6 transition-colors duration-300 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}
            align="center"
          >
            Your Career <span className={`bg-clip-text text-transparent ${
              isDark 
                ? 'bg-gradient-to-r from-lime to-dark-accent' 
                : 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark'
            }`}>Journey</span>
          </Typography>
          <Typography 
            variant="subtitle1" 
            className={`text-xl max-w-3xl mx-auto leading-relaxed transition-colors duration-300 ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}
            align="center"
            ml={1/2}
          >
            Follow the path from AUT American University of Technology in Tashkent student to industry professional with our comprehensive career support system
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Career Path Visualization */}
          <div ref={pathVisualizationRef} className={`relative rounded-3xl p-8 shadow-2xl border transition-colors duration-300 ${
            isDark 
              ? 'bg-dark-surface border-lime/20' 
              : 'bg-white border-gray-100'
          }`}>
            <div className={`relative w-full h-96 rounded-2xl p-6 overflow-hidden transition-colors duration-300 ${
              isDark 
                ? 'bg-gradient-to-br from-dark-bg to-dark-surface' 
                : 'bg-gradient-to-br from-gray-50 to-white'
            }`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className={`border ${
                      isDark ? 'border-lime/20' : 'border-gray-200'
                    }`}></div>
                  ))}
                </div>
              </div>
              
              {/* Career Path Steps */}
              <div className="relative z-10 h-full flex flex-col justify-between">
                {/* Step 4: Career Success */}
                <div className="career-step flex items-center justify-center">
                  <div className={`rounded-2xl p-4 shadow-lg ${
                    isDark 
                      ? 'bg-gradient-to-r from-lime to-dark-accent' 
                      : 'bg-gradient-to-r from-asu-gold to-yellow-300'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isDark ? 'bg-dark-surface/90' : 'bg-white/90'
                      }`}>
                        <Award className={`h-7 w-7 ${
                          isDark ? 'text-lime' : 'text-asu-maroon'
                        }`} />
                      </div>
                      <div className={isDark ? 'text-dark-surface' : 'text-asu-maroon'}>
                        <p className="font-bold text-lg">Dream Job</p>
                        <p className="text-sm opacity-80">Achieved!</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Interview & Offer */}
                <div className="career-step flex items-center justify-end">
                  <div className={`rounded-xl p-3 shadow-lg max-w-xs border transition-colors duration-300 ${
                    isDark 
                      ? 'bg-dark-surface border-lime/20' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${
                          isDark ? 'text-dark-text' : 'text-gray-900'
                        }`}>Interview Success</p>
                        <p className={`text-xs ${
                          isDark ? 'text-dark-muted' : 'text-gray-600'
                        }`}>Job Offer Received</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Application Submitted */}
                <div className="career-step flex items-center justify-start">
                  <div className={`rounded-xl p-3 shadow-lg max-w-xs border transition-colors duration-300 ${
                    isDark 
                      ? 'bg-dark-surface border-lime/20' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-info-500 rounded-full flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${
                          isDark ? 'text-dark-text' : 'text-gray-900'
                        }`}>Applied to Google</p>
                        <p className={`text-xs ${
                          isDark ? 'text-dark-muted' : 'text-gray-600'
                        }`}>Software Engineer Intern</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 1: Profile Created */}
                <div className="career-step flex items-center justify-center">
                  <div className={`rounded-2xl p-4 shadow-lg border transition-colors duration-300 ${
                    isDark 
                      ? 'bg-dark-surface border-lime/20' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isDark ? 'bg-lime' : 'bg-asu-maroon'
                      }`}>
                        <GraduationCap className={`h-7 w-7 ${
                          isDark ? 'text-dark-surface' : 'text-white'
                        }`} />
                      </div>
                      <div className={isDark ? 'text-lime' : 'text-asu-maroon'}>
                        <p className="font-bold text-lg">AUT Student</p>
                        <p className="text-sm opacity-80">Your journey starts here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connecting Lines */}
              <div className="absolute inset-0 pointer-events-none">
                <svg ref={connectingLinesRef} className="w-full h-full" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <linearGradient id={`pathGradient${isDark ? 'Dark' : ''}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={isDark ? "#E3FF70" : "#FFC627"} stopOpacity="0.8" />
                      <stop offset="100%" stopColor={isDark ? "#E3FF70" : "#8C1D40"} stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 150 280 Q 100 220 150 180 Q 200 140 150 100 Q 100 60 150 20"
                    stroke={`url(#pathGradient${isDark ? 'Dark' : ''})`}
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Career Path Benefits */}
          <div ref={benefitsRef} className="space-y-8">
            <div className="benefit-item flex items-start space-x-4">
              <div className={`benefit-icon w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isDark 
                  ? 'bg-gradient-to-r from-lime to-dark-accent' 
                  : 'bg-gradient-to-r from-asu-maroon to-asu-maroon'
              }`}>
                <User className={`h-6 w-6 ${
                  isDark ? 'text-dark-surface' : 'text-white'
                }`} />
              </div>
              <div>
                <h3 className={`benefit-title text-2xl font-bold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>Complete Your Profile</h3>
                <p className={`benefit-description text-lg transition-colors duration-300 ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}>Build a comprehensive profile that showcases your skills, experiences, and aspirations to attract top employers.</p>
              </div>
            </div>

            <div className="benefit-item flex items-start space-x-4">
              <div className={`benefit-icon w-12 h-12 border-2 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isDark 
                  ? 'bg-dark-surface border-lime' 
                  : 'bg-white border-asu-maroon'
              }`}>
                <Search className={`h-6 w-6 ${
                  isDark ? 'text-lime' : 'text-asu-maroon'
                }`} />
              </div>
              <div>
                <h3 className={`benefit-title text-2xl font-bold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>Find Perfect Matches</h3>
                <p className={`benefit-description text-lg transition-colors duration-300 ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}>Our AI-powered matching system connects you with opportunities that align with your skills and career goals.</p>
              </div>
            </div>

            <div className="benefit-item flex items-start space-x-4">
              <div className={`benefit-icon w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isDark 
                  ? 'bg-gradient-to-r from-lime to-dark-accent' 
                  : 'bg-gradient-to-r from-asu-maroon to-asu-maroon'
              }`}>
                <Target className={`h-6 w-6 ${
                  isDark ? 'text-dark-surface' : 'text-white'
                }`} />
              </div>
              <div>
                <h3 className={`benefit-title text-2xl font-bold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>Apply with Confidence</h3>
                <p className={`benefit-description text-lg transition-colors duration-300 ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}>Submit applications directly to employers and track your progress through our integrated dashboard.</p>
              </div>
            </div>

            <div className="benefit-item flex items-start space-x-4">
              <div className={`benefit-icon w-12 h-12 border-2 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isDark 
                  ? 'bg-dark-surface border-lime' 
                  : 'bg-white border-asu-maroon'
              }`}>
                <Award className={`h-6 w-6 ${
                  isDark ? 'text-lime' : 'text-asu-maroon'
                }`} />
              </div>
              <div>
                <h3 className={`benefit-title text-2xl font-bold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>Land Your Dream Job</h3>
                <p className={`benefit-description text-lg transition-colors duration-300 ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}>Join thousands of AUT American University of Technology in Tashkent students who have successfully launched their careers through our platform.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}