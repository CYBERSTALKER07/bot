import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, Search, Target } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface HowItWorksSectionProps {
  howItWorksRef: React.RefObject<HTMLDivElement>;
}

export default function HowItWorksSection({ howItWorksRef }: HowItWorksSectionProps) {
  const { isDark } = useTheme();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // How it works - animate step elements individually
      ScrollTrigger.create({
        trigger: howItWorksRef.current,
        start: 'top 70%',
        onEnter: () => {
          // Animate step numbers with bounce
          gsap.fromTo('.step-number', 
            { scale: 0, y: -50, opacity: 0 },
            {
              duration: 1,
              scale: 1.05,
              y: 0,
              opacity: 1,
              ease: 'bounce.out',
              stagger: 0.3
            }
          );

          // Animate step icons separately
          gsap.fromTo('.step-icon',
            { scale: 0, rotation: 180 },
            {
              duration: 1.2,
              scale: 1.1,
              rotation: 0,
              ease: 'elastic.out(1, 0.3)',
              stagger: 0.2,
              delay: 0.5
            }
          );

          // Animate step titles
          gsap.fromTo('.step-title',
            { opacity: 0, x: -30 },
            {
              duration: 0.8,
              opacity: 1,
              x: 0,
              ease: 'power2.out',
              stagger: 0.3,
              delay: 0.8
            }
          );

          // Animate step descriptions
          gsap.fromTo('.step-description',
            { opacity: 0, y: 20 },
            {
              duration: 1,
              opacity: 1,
              y: 0,
              ease: 'power2.out',
              stagger: 0.3,
              delay: 1.2
            }
          );

          // Animate connection lines
          gsap.fromTo('.connection-line',
            { scaleX: 0, opacity: 0 },
            {
              duration: 1.5,
              scaleX: 1,
              opacity: 1,
              ease: 'power2.out',
              stagger: 0.5,
              delay: 1.8
            }
          );
        }
      });
    });

    return () => ctx.revert();
  }, [howItWorksRef]);

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
          <h2 className={`text-reveal text-5xl md:text-6xl font-bold mb-6 transition-colors duration-300 ${
            isDark ? 'text-dark-text' : 'text-gray-900'
          }`}>
            How It Works
          </h2>
          <p className={`text-reveal text-xl max-w-2xl mx-auto transition-colors duration-300 ${
            isDark ? 'text-dark-muted' : 'text-gray-600'
          }`}>
            Get started in minutes and find your perfect opportunity with our streamlined process
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            {
              step: "01",
              title: "Create Your Profile",
              description: "Build a comprehensive profile showcasing your skills, experience, and career aspirations. Upload your resume and let AI optimize it.",
              icon: <User className="h-20 w-20 text-white" />,
              gradient: isDark ? "from-lime to-dark-accent" : "from-asu-maroon to-asu-maroon-dark",
              delay: 0
            },
            {
              step: "02", 
              title: "Discover Opportunities",
              description: "Browse through thousands of verified job postings and internships from top employers. Get personalized recommendations.",
              icon: <Search className="h-20 w-20 text-white" />,
              gradient: isDark ? "from-lime to-dark-accent" : "from-asu-maroon to-asu-maroon-dark",
              delay: 0.2
            },
            {
              step: "03",
              title: "Apply & Connect",
              description: "Apply with one click and connect directly with hiring managers. Track your progress and get real-time updates.",
              icon: <Target className="h-20 w-20 text-white" />,
              gradient: isDark ? "from-lime to-dark-accent" : "from-asu-maroon to-asu-maroon-dark",
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