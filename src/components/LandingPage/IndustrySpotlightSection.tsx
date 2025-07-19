import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { 
  Computer, 
  Business, 
  Science, 
  Engineering, 
  HealthAndSafety,
  Brush,
  TrendingUp,
  Lightbulb
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import Typography from '../ui/Typography';
import { useScrollTriggerStagger } from '../../hooks/useScrollTrigger';

interface IndustrySpotlightSectionProps {
  industryRef: React.RefObject<HTMLDivElement>;
}

export default function IndustrySpotlightSection({ industryRef }: IndustrySpotlightSectionProps) {
  const { isDark } = useTheme();
  const cardsRef = useRef<HTMLDivElement>(null);

  // Animate industry cards
  useScrollTriggerStagger(cardsRef, '.industry-card', (elements, progress) => {
    elements.forEach((element, index) => {
      const delay = index * 0.1;
      const elementProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      
      gsap.set(element, {
        opacity: elementProgress,
        y: (1 - elementProgress) * 80,
        scale: 0.9 + (elementProgress * 0.1),
        rotationY: (1 - elementProgress) * 15,
        ease: 'none'
      });
    });
  }, { 
    start: 'top 70%', 
    end: 'bottom 80%',
    scrub: 1.5 
  });

  const industries = [
    {
      title: "Technology",
      icon: <Computer className="h-8 w-8" />,
      companies: ["Google", "Microsoft", "Apple", "Meta"],
      openings: "1,200+",
      color: "from-blue-500 to-purple-600",
      description: "Software engineering, data science, AI/ML, cybersecurity"
    },
    {
      title: "Finance",
      icon: <TrendingUp className="h-8 w-8" />,
      companies: ["Goldman Sachs", "JPMorgan", "BlackRock"],
      openings: "450+",
      color: "from-green-500 to-emerald-600",
      description: "Investment banking, financial analysis, fintech"
    },
    {
      title: "Healthcare",
      icon: <HealthAndSafety className="h-8 w-8" />,
      companies: ["Johnson & Johnson", "Pfizer", "Mayo Clinic"],
      openings: "320+",
      color: "from-red-500 to-pink-600",
      description: "Medical research, healthcare IT, pharmaceuticals"
    },
    {
      title: "Engineering",
      icon: <Engineering className="h-8 w-8" />,
      companies: ["Tesla", "Boeing", "SpaceX", "General Electric"],
      openings: "680+",
      color: "from-orange-500 to-red-600",
      description: "Mechanical, electrical, aerospace, civil engineering"
    },
    {
      title: "Creative",
      icon: <Brush className="h-8 w-8" />,
      companies: ["Netflix", "Adobe", "Disney", "Spotify"],
      openings: "280+",
      color: "from-purple-500 to-pink-600",
      description: "Design, media, marketing, content creation"
    },
    {
      title: "Consulting",
      icon: <Lightbulb className="h-8 w-8" />,
      companies: ["McKinsey", "BCG", "Deloitte", "Accenture"],
      openings: "190+",
      color: "from-indigo-500 to-blue-600",
      description: "Management consulting, strategy, operations"
    }
  ];

  return (
    <section ref={industryRef} className={`py-24 transition-colors duration-300 ${
      isDark ? 'bg-dark-surface' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Typography 
            variant="h2" 
            className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}
          >
            Explore Career Paths by <span className={`bg-clip-text text-transparent ${
              isDark 
                ? 'bg-gradient-to-r from-lime to-dark-accent' 
                : 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark'
            }`}>Industry</span>
          </Typography>
          <Typography 
            variant="subtitle1" 
            className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}
          >
            Discover opportunities across diverse industries and find the perfect match for your passion and skills
          </Typography>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <Card 
              key={index}
              className={`industry-card group relative overflow-hidden transition-all duration-500 hover:shadow-2xl cursor-pointer ${
                isDark 
                  ? 'bg-dark-bg border-lime/20 hover:border-lime/40' 
                  : 'bg-white border-gray-200 hover:border-asu-maroon/30'
              }`}
              elevation={3}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${industry.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <div className="relative p-6">
                {/* Icon and title */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-8 rounded-2xl text-white relative overflow-hidden transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gradient-to-r from-dark-surface to-lime' 
                      : 'bg-gradient-to-r from-asu-maroon to-asu-maroon'
                  }`}>
                    <div className="text-white">{industry.icon}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isDark ? 'bg-lime/20 text-lime' : 'bg-asu-maroon/10 text-asu-maroon'
                  }`}>
                    {industry.openings} jobs
                  </span>
                </div>

                <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>
                  {industry.title}
                </h3>

                <p className={`text-sm mb-4 transition-colors duration-300 ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}>
                  {industry.description}
                </p>

                {/* Top companies */}
                <div className="mb-4">
                  <p className={`text-xs font-medium mb-2 transition-colors duration-300 ${
                    isDark ? 'text-dark-muted' : 'text-gray-500'
                  }`}>
                    TOP COMPANIES HIRING:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {industry.companies.slice(0, 3).map((company, idx) => (
                      <span 
                        key={idx}
                        className={`px-2 py-1 rounded text-xs transition-colors duration-300 ${
                          isDark 
                            ? 'bg-dark-surface text-dark-text' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {company}
                      </span>
                    ))}
                    {industry.companies.length > 3 && (
                      <span className={`px-2 py-1 rounded text-xs transition-colors duration-300 ${
                        isDark ? 'text-dark-muted' : 'text-gray-500'
                      }`}>
                        +{industry.companies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <button className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-300 group-hover:scale-105 ${
                  isDark 
                    ? 'bg-lime/10 text-lime hover:bg-lime/20' 
                    : 'bg-asu-maroon/10 text-asu-maroon hover:bg-asu-maroon/20'
                }`}>
                  Explore {industry.title} Jobs
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}