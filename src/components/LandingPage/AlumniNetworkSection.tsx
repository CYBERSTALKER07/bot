import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { 
  School,
  Work,
  TrendingUp,
  Groups,
  EmojiEvents,
  LocationOn,
  Business
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import Typography from '../ui/Typography';
import { useScrollTriggerStagger } from '../../hooks/useScrollTrigger';

interface AlumniNetworkSectionProps {
  alumniRef: React.RefObject<HTMLDivElement>;
}

export default function AlumniNetworkSection({ alumniRef }: AlumniNetworkSectionProps) {
  const { isDark } = useTheme();
  const cardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Animate alumni cards
  useScrollTriggerStagger(cardsRef, '.alumni-card', (elements, progress) => {
    elements.forEach((element, index) => {
      const delay = index * 0.15;
      const elementProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      
      gsap.set(element, {
        opacity: elementProgress,
        y: (1 - elementProgress) * 100,
        scale: 0.8 + (elementProgress * 0.2),
        rotation: (1 - elementProgress) * 10 * (index % 2 === 0 ? 1 : -1),
        ease: 'none'
      });
    });
  }, { 
    start: 'top 70%', 
    end: 'bottom 80%',
    scrub: 1.5 
  });

  const successStories = [
    {
      name: "Ahmad Hassan",
      class: "Class of 2023",
      role: "Software Engineer",
      company: "Google",
      location: "Mountain View, CA",
      avatar: "AH",
      achievement: "Led development of new search algorithm",
      salary: "$180k+"
    },
    {
      name: "Fatima Al-Zahra",
      class: "Class of 2022",
      role: "Product Manager",
      company: "Meta",
      location: "Menlo Park, CA",
      avatar: "FZ",
      achievement: "Launched AR feature used by 50M+ users",
      salary: "$165k+"
    },
    {
      name: "Omar Rashid",
      class: "Class of 2023",
      role: "Data Scientist",
      company: "Tesla",
      location: "Austin, TX",
      avatar: "OR",
      achievement: "Optimized battery efficiency by 15%",
      salary: "$155k+"
    },
    {
      name: "Layla Mohammed",
      class: "Class of 2021",
      role: "Investment Banker",
      company: "Goldman Sachs",
      location: "New York, NY",
      avatar: "LM",
      achievement: "Closed $2B+ in deals",
      salary: "$200k+"
    }
  ];

  const networkStats = [
    { number: "15,000+", label: "AUT Alumni", icon: <School className="h-6 w-6" /> },
    { number: "500+", label: "Companies", icon: <Business className="h-6 w-6" /> },
    { number: "95%", label: "Employment Rate", icon: <Work className="h-6 w-6" /> },
    { number: "50+", label: "Countries", icon: <LocationOn className="h-6 w-6" /> }
  ];

  return (
    <section ref={alumniRef} className={`py-24 transition-colors duration-300 ${
      isDark ? 'bg-dark-bg' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Typography 
            variant="h2" 
            className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}
          >
            Join Our <span className={`bg-clip-text text-transparent ${
              isDark 
                ? 'bg-linear-to-r from-lime to-dark-accent' 
                : 'bg-linear-to-r from-asu-maroon to-asu-maroon-dark'
            }`}>Global Alumni Network</span>
          </Typography>
          <Typography 
            variant="subtitle1" 
            className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}
          >
            Connect with successful AUT graduates working at top companies worldwide
          </Typography>
        </div>

        {/* Network Stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {networkStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                isDark 
                  ? 'bg-lime text-dark-surface' 
                  : 'bg-asu-maroon text-white'
              }`}>
                {stat.icon}
              </div>
              <Typography 
                variant="h3" 
                className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}
              >
                {stat.number}
              </Typography>
              <Typography 
                variant="body2" 
                className={`transition-colors duration-300 ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}
              >
                {stat.label}
              </Typography>
            </div>
          ))}
        </div>

        {/* Success Stories */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {successStories.map((story, index) => (
            <Card 
              key={index}
              className={`alumni-card group relative overflow-hidden transition-all duration-500 hover:shadow-2xl ${
                isDark 
                  ? 'bg-dark-surface border-lime/20 hover:border-lime/40' 
                  : 'bg-white border-gray-200 hover:border-asu-maroon/30'
              }`}
              elevation={3}
            >
              <div className="p-6">
                {/* Avatar and basic info */}
                <div className="text-center mb-4">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-white text-lg font-bold ${
                    isDark ? 'bg-lime' : 'bg-asu-maroon'
                  }`}>
                    {story.avatar}
                  </div>
                  <h3 className={`font-bold text-lg transition-colors duration-300 ${
                    isDark ? 'text-dark-text' : 'text-gray-900'
                  }`}>
                    {story.name}
                  </h3>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDark ? 'text-dark-muted' : 'text-gray-600'
                  }`}>
                    {story.class}
                  </p>
                </div>

                {/* Current position */}
                <div className="mb-4">
                  <p className={`font-semibold text-sm transition-colors duration-300 ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`}>
                    {story.role}
                  </p>
                  <p className={`text-sm font-medium transition-colors duration-300 ${
                    isDark ? 'text-dark-text' : 'text-gray-900'
                  }`}>
                    {story.company}
                  </p>
                  <p className={`text-xs transition-colors duration-300 ${
                    isDark ? 'text-dark-muted' : 'text-gray-600'
                  }`}>
                    {story.location}
                  </p>
                </div>

                {/* Achievement */}
                <div className="mb-4">
                  <p className={`text-sm transition-colors duration-300 ${
                    isDark ? 'text-dark-muted' : 'text-gray-600'
                  }`}>
                    {story.achievement}
                  </p>
                </div>

                {/* Salary badge */}
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDark 
                      ? 'bg-dark-bg text-lime' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {story.salary}
                  </span>
                  <button className={`text-xs font-medium transition-colors duration-300 ${
                    isDark 
                      ? 'text-lime hover:text-dark-accent' 
                      : 'text-asu-maroon hover:text-asu-maroon-dark'
                  }`}>
                    Connect
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
            isDark 
              ? 'bg-lime text-dark-bg hover:bg-lime/90' 
              : 'bg-asu-maroon text-white hover:bg-asu-maroon/90'
          }`}>
            Join the Network
          </button>
        </div>
      </div>
    </section>
  );
}