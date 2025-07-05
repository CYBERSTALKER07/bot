import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Search, 
  Users, 
  Award, 
  MessageSquare, 
  Shield, 
  TrendingUp, 
  CheckCircle,
  Calendar,
  BookOpen,
  Globe,
  Zap
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface FeaturesSectionProps {
  featuresRef: React.RefObject<HTMLDivElement>;
}

export default function FeaturesSection({ featuresRef }: FeaturesSectionProps) {
  const { isDark } = useTheme();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Features section - Pinterest-style masonry animations
      ScrollTrigger.create({
        trigger: featuresRef.current,
        start: 'top 70%',
        onEnter: () => {
          // Animate feature icons independently with different timings
          gsap.fromTo('.feature-icon', 
            { scale: 0, rotation: 360, opacity: 0 },
            {
              duration: 1.2,
              scale: 1.1,
              rotation: 0,
              opacity: 1,
              ease: 'elastic.out(1, 0.3)',
              stagger: {
                amount: 1.5,
                grid: [2, 3],
                from: "random"
              }
            }
          );

          // Animate feature titles with typewriter effect
          gsap.fromTo('.feature-title',
            { opacity: 0, y: 20 },
            {
              duration: 0.8,
              opacity: 1,
              y: 0,
              ease: 'power2.out',
              stagger: 0.2,
              delay: 0.5
            }
          );

          // Animate feature descriptions
          gsap.fromTo('.feature-description',
            { opacity: 0, height: 0 },
            {
              duration: 1,
              opacity: 1,
              height: 'auto',
              ease: 'power2.out',
              stagger: 0.15,
              delay: 0.8
            }
          );

          // Animate feature list items individually
          gsap.fromTo('.feature-item',
            { x: -20, opacity: 0 },
            {
              duration: 0.6,
              x: 0,
              opacity: 1,
              ease: 'power2.out',
              stagger: 0.1,
              delay: 1.2
            }
          );

          // Animate benefit icons in additional section
          gsap.fromTo('.benefit-icon',
            { scale: 0, rotation: -180 },
            {
              duration: 1,
              scale: 1,
              rotation: 0,
              ease: 'back.out(1.7)',
              stagger: 0.2,
              delay: 1.5
            }
          );
        }
      });
    });

    return () => ctx.revert();
  }, [featuresRef]);

  return (
    <section ref={featuresRef} className={`py-24 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-dark-bg' : 'bg-white'
    }`}>
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-b from-dark-surface/50 to-dark-bg' 
          : 'bg-gradient-to-b from-gray-50/50 to-white'
      }`}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className={`text-reveal text-5xl md:text-6xl font-bold mb-6 transition-colors duration-300 ${
            isDark ? 'text-dark-text' : 'text-gray-900'
          }`}>
            Everything You Need to <span className={`bg-clip-text text-transparent ${
              isDark 
                ? 'bg-gradient-to-r from-lime to-dark-accent' 
                : 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark'
            }`}>Succeed</span>
          </h2>
          <p className={`text-reveal text-xl max-w-4xl mx-auto leading-relaxed transition-colors duration-300 ${
            isDark ? 'text-dark-muted' : 'text-gray-600'
          }`}>
            Our comprehensive platform provides all the tools, resources, and connections you need to launch your dream career at ASU.
          </p>
        </div>
        
        {/* Pinterest-style Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 mb-16 space-y-6">
          {[
            {
              icon: <Search className="h-12 w-12 text-white" />,
              title: "AI-Powered Job Matching",
              description: "Advanced algorithms analyze your skills, interests, and career goals to match you with the perfect opportunities from our network of 500+ employers.",
              gradient: isDark ? "from-lime to-dark-accent" : "from-asu-maroon to-asu-maroon-dark",
              features: ["Personalized recommendations", "Skills assessment", "Career path guidance"],
              size: "large"
            },
            {
              icon: <Users className="h-10 w-10 text-white" />,
              title: "Direct Employer Network", 
              description: "Skip the middleman and connect directly with hiring managers from Fortune 500 companies.",
              gradient: isDark ? "from-lime to-dark-accent" : "from-asu-maroon to-asu-maroon-dark",
              features: ["Real-time messaging", "Video interviews"],
              size: "medium"
            },
            {
              icon: <Award className={`h-14 w-14 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />,
              title: "Career Development Hub",
              description: "Access exclusive workshops, mentorship programs, resume reviews, and interview preparation resources designed for ASU students.",
              gradient: isDark ? "from-dark-surface to-dark-bg" : "from-white to-gray-100", 
              features: ["1-on-1 mentoring", "Skill workshops", "Mock interviews", "Resume optimization"],
              size: "large"
            },
            {
              icon: <MessageSquare className="h-10 w-10 text-white" />,
              title: "Integrated Communication",
              description: "Seamless messaging system with read receipts and file sharing.",
              gradient: isDark ? "from-lime to-dark-accent" : "from-asu-maroon to-asu-maroon-dark",
              features: ["Instant notifications", "File attachments"],
              size: "small"
            },
            {
              icon: <Shield className={`h-12 w-12 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />,
              title: "Verified Opportunities Only",
              description: "Every job posting is manually reviewed and verified by our team to ensure legitimacy, competitive compensation, and growth potential.",
              gradient: isDark ? "from-dark-surface to-dark-bg" : "from-white to-gray-100",
              features: ["Background checks", "Salary transparency", "Company ratings"],
              size: "medium"
            },
            {
              icon: <TrendingUp className="h-11 w-11 text-white" />,
              title: "Success Analytics Dashboard", 
              description: "Track your application progress, view response rates, and get actionable insights.",
              gradient: isDark ? "from-lime to-dark-accent" : "from-asu-maroon to-asu-maroon-dark",
              features: ["Application tracking", "Performance metrics"],
              size: "medium"
            }
          ].map((feature, index) => (
            <div key={index} className={`feature-card group relative rounded-2xl p-6 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border break-inside-avoid mb-6 ${
              isDark 
                ? 'bg-dark-surface border-lime/20 hover:border-lime/40' 
                : 'bg-white border-gray-100 hover:border-asu-maroon/20'
            } ${feature.size === 'large' ? 'lg:p-8' : feature.size === 'medium' ? 'lg:p-7' : 'lg:p-6'}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
              <div className="relative z-10">
                <div className={`feature-icon mb-4 w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className={`feature-title text-xl font-bold mb-3 transition-colors duration-300 ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>{feature.title}</h3>
                <p className={`feature-description leading-relaxed mb-4 text-sm transition-colors duration-300 ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}>{feature.description}</p>
                <ul className="space-y-1">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className={`feature-item flex items-center text-xs transition-colors duration-300 ${
                      isDark ? 'text-dark-muted' : 'text-gray-500'
                    }`}>
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Benefits Section */}
        <div className={`rounded-3xl p-12 text-center transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-r from-lime/5 to-dark-accent/5' 
            : 'bg-gradient-to-r from-asu-maroon/5 to-asu-gold/5'
        }`}>
          <h3 className={`text-3xl font-bold mb-8 transition-colors duration-300 ${
            isDark ? 'text-dark-text' : 'text-gray-900'
          }`}>Plus So Much More</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Calendar className="h-8 w-8" />, title: "Career Events", desc: "Exclusive networking events" },
              { icon: <BookOpen className="h-8 w-8" />, title: "Resource Library", desc: "Templates & guides" },
              { icon: <Globe className="h-8 w-8" />, title: "Global Opportunities", desc: "International placements" },
              { icon: <Zap className="h-8 w-8" />, title: "Quick Apply", desc: "One-click applications" }
            ].map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className={`benefit-icon w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border ${
                  isDark 
                    ? 'bg-dark-surface border-lime/20' 
                    : 'bg-white border-asu-maroon/20'
                }`}>
                  <div className={isDark ? 'text-lime' : 'text-asu-maroon'}>{benefit.icon}</div>
                </div>
                <h4 className={`font-semibold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>{benefit.title}</h4>
                <p className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}