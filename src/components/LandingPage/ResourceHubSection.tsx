import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { 
  MenuBook,
  VideoLibrary,
  Assignment,
  Event,
  Psychology,
  TrendingUp,
  Download,
  PlayArrow
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import Typography from '../ui/Typography';
import { useScrollTriggerStagger } from '../../hooks/useScrollTrigger';

interface ResourceHubSectionProps {
  resourcesRef: React.RefObject<HTMLDivElement>;
}

export default function ResourceHubSection({ resourcesRef }: ResourceHubSectionProps) {
  const { isDark } = useTheme();
  const cardsRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  // Animate resource cards
  useScrollTriggerStagger(cardsRef, '.resource-card', (elements, progress) => {
    elements.forEach((element, index) => {
      const delay = index * 0.1;
      const elementProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      
      gsap.set(element, {
        opacity: elementProgress,
        y: (1 - elementProgress) * 60,
        scale: 0.95 + (elementProgress * 0.05),
        ease: 'none'
      });
    });
  }, { 
    start: 'top 70%', 
    end: 'bottom 80%',
    scrub: 1.5 
  });

  const resources = [
    {
      title: "Resume Templates",
      description: "ATS-optimized templates for tech, finance, and consulting roles",
      icon: <Assignment className="h-8 w-8" />,
      type: "Templates",
      downloads: "12k+",
      color: "from-info-500 to-indigo-600"
    },
    {
      title: "Interview Prep Videos",
      description: "Technical and behavioral interview guidance from industry experts",
      icon: <VideoLibrary className="h-8 w-8" />,
      type: "Video Series",
      downloads: "8k+",
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Career Development Courses",
      description: "Self-paced courses on leadership, communication, and technical skills",
      icon: <MenuBook className="h-8 w-8" />,
      type: "Courses",
      downloads: "15k+",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Industry Reports",
      description: "Latest salary trends, hiring patterns, and market insights",
      icon: <TrendingUp className="h-8 w-8" />,
      type: "Reports",
      downloads: "6k+",
      color: "from-orange-500 to-red-600"
    },
    {
      title: "Mock Interview Sessions",
      description: "Practice with AI-powered mock interviews and get instant feedback",
      icon: <Psychology className="h-8 w-8" />,
      type: "Interactive",
      downloads: "9k+",
      color: "from-teal-500 to-cyan-600"
    },
    {
      title: "Networking Events",
      description: "Virtual and in-person events with industry professionals",
      icon: <Event className="h-8 w-8" />,
      type: "Events",
      downloads: "4k+",
      color: "from-pink-500 to-rose-600"
    }
  ];

  const featuredContent = [
    {
      title: "Ultimate Tech Interview Guide",
      description: "Comprehensive guide covering algorithms, system design, and behavioral questions",
      duration: "2.5 hours",
      rating: 4.9,
      thumbnail: "tech-interview-guide",
      type: "Video Course"
    },
    {
      title: "Salary Negotiation Masterclass",
      description: "Learn proven strategies to negotiate your dream salary and benefits package",
      duration: "1.5 hours",
      rating: 4.8,
      thumbnail: "salary-negotiation",
      type: "Workshop"
    }
  ];

  return (
    <section ref={resourcesRef} className={`py-24 transition-colors duration-300 ${
      isDark ? 'bg-dark-surface' : 'bg-gray-50'
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
            Career <span className={`bg-clip-text text-transparent ${
              isDark 
                ? 'bg-gradient-to-r from-lime to-dark-accent' 
                : 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark'
            }`}>Resource Hub</span>
          </Typography>
          <Typography 
            variant="subtitle1" 
            className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}
          >
            Access exclusive career development resources, templates, and expert guidance to accelerate your job search
          </Typography>
        </div>

        {/* Featured Content */}
        <div ref={featuredRef} className="mb-16">
          <h3 className={`text-2xl font-bold mb-8 transition-colors duration-300 ${
            isDark ? 'text-dark-text' : 'text-gray-900'
          }`}>
            Featured Content
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredContent.map((content, index) => (
              <Card 
                key={index}
                className={`group relative overflow-hidden transition-all duration-500 hover:shadow-2xl ${
                  isDark 
                    ? 'bg-dark-bg border-lime/20 hover:border-lime/40' 
                    : 'bg-white border-gray-200 hover:border-asu-maroon/30'
                }`}
                elevation={4}
              >
                <div className="relative">
                  {/* Thumbnail placeholder */}
                  <div className={`h-48 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center ${
                    isDark ? 'from-dark-surface to-dark-bg' : 'from-gray-200 to-gray-300'
                  }`}>
                    <PlayArrow className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isDark ? 'bg-lime text-dark-surface' : 'bg-asu-maroon text-white'
                    }`}>
                      {content.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                    isDark ? 'text-dark-text' : 'text-gray-900'
                  }`}>
                    {content.title}
                  </h4>
                  <p className={`text-sm mb-4 transition-colors duration-300 ${
                    isDark ? 'text-dark-muted' : 'text-gray-600'
                  }`}>
                    {content.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <span className={`text-sm transition-colors duration-300 ${
                        isDark ? 'text-dark-muted' : 'text-gray-600'
                      }`}>
                        {content.duration}
                      </span>
                      <span className={`text-sm transition-colors duration-300 ${
                        isDark ? 'text-lime' : 'text-asu-maroon'
                      }`}>
                        ⭐ {content.rating}
                      </span>
                    </div>
                    <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group-hover:scale-105 ${
                      isDark 
                        ? 'bg-lime text-dark-surface hover:bg-lime/90' 
                        : 'bg-asu-maroon text-white hover:bg-asu-maroon/90'
                    }`}>
                      Watch Now
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Resource Categories */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <Card 
              key={index}
              className={`resource-card group relative overflow-hidden transition-all duration-500 hover:shadow-2xl cursor-pointer ${
                isDark 
                  ? 'bg-dark-bg border-lime/20 hover:border-lime/40' 
                  : 'bg-white border-gray-200 hover:border-asu-maroon/30'
              }`}
              elevation={3}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${resource.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <div className="relative p-6">
                {/* Icon and type */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${resource.color}`}>
                    <div className="text-white">{resource.icon}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDark ? 'bg-dark-surface text-dark-text' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {resource.type}
                  </span>
                </div>

                <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>
                  {resource.title}
                </h3>

                <p className={`text-sm mb-4 transition-colors duration-300 ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}>
                  {resource.description}
                </p>

                {/* Stats and CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Download className="h-4 w-4 text-gray-400" />
                    <span className={`text-sm transition-colors duration-300 ${
                      isDark ? 'text-dark-muted' : 'text-gray-600'
                    }`}>
                      {resource.downloads} downloads
                    </span>
                  </div>
                  <button className={`text-sm font-medium transition-colors duration-300 ${
                    isDark 
                      ? 'text-lime hover:text-dark-accent' 
                      : 'text-asu-maroon hover:text-asu-maroon-dark'
                  }`}>
                    Explore →
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
            Access All Resources
          </button>
          <p className={`mt-4 text-sm transition-colors duration-300 ${
            isDark ? 'text-dark-muted' : 'text-gray-600'
          }`}>
            Free for AUT students • Premium content available
          </p>
        </div>
      </div>
    </section>
  );
}