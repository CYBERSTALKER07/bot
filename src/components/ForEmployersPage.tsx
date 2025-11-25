import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { useScrollTrigger, useScrollTriggerStagger } from '../hooks/useScrollTrigger';
import { 
  Building2,
  Users,
  TrendingUp,
  Search,
  Target,
  MessageCircle,
  Clock,
  Zap,
  Star,
  Award,
  Globe,
  Briefcase,
  Phone,
  Mail,
  Play,
  ChevronRight,
  CheckCircle,
  Filter,
  BarChart3,
  UserPlus,
  Calendar,
  Settings,
  Download,
  ExternalLink,
  Rocket,
  Shield,
  Network,
  BookOpen,
  Lightbulb,
  Heart,
  Eye,
  ThumbsUp,
  ArrowRight,
  DollarSign,
  Gauge,
  BrainCircuit,
  ChartBar,
  Users2,
  MapPin,
  GraduationCap,
  Trophy,
  Handshake
} from 'lucide-react';

// Material Design UI Components
import { Card, StatsCard } from './ui/Card';
import Button from './ui/Button';
import Typography from './ui/Typography';
import Input from './ui/Input';

gsap.registerPlugin(ScrollTrigger);

export default function ForEmployersPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  // Refs for different sections
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const integrationRef = useRef<HTMLDivElement>(null);
  const caseStudiesRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic scroll animations
  useScrollTrigger(heroRef, (element, progress) => {
    gsap.set(element, {
      opacity: 1,
      y: progress * -40,
      scale: 1 + (progress * 0.03),
      ease: 'none'
    });
  }, { start: 'top 80%', end: 'bottom 20%', scrub: 1 });

  useScrollTriggerStagger(statsRef, '.stats-card', (elements, progress) => {
    elements.forEach((element, index) => {
      const delay = index * 0.1;
      const elementProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      
      gsap.set(element, {
        opacity: elementProgress,
        y: (1 - elementProgress) * 60,
        scale: 0.9 + (elementProgress * 0.1),
        ease: 'none'
      });
    });
  }, { start: 'top 75%', end: 'bottom 25%', scrub: 1.5 });

  useScrollTriggerStagger(featuresRef, '.feature-card', (elements, progress) => {
    elements.forEach((element, index) => {
      const delay = index * 0.15;
      const elementProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      
      gsap.set(element, {
        opacity: elementProgress,
        y: (1 - elementProgress) * 80,
        rotationY: (1 - elementProgress) * 30,
        transformOrigin: 'center center',
        ease: 'none'
      });
    });
  }, { start: 'top 70%', end: 'bottom 30%', scrub: 2 });

  // Enhanced entrance animations
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Hero entrance with Material Design motion
      gsap.fromTo('.hero-content', {
        opacity: 0,
        y: 100,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.4,
        ease: 'power3.out',
        delay: 0.1
      });

      // CTA button with bounce
      gsap.fromTo('.hero-cta', {
        opacity: 0,
        y: 50,
        scale: 0.8
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'back.out(1.7)',
        delay: 0.5
      });

      // Stats cards with stagger
      gsap.fromTo('.stats-card', {
        opacity: 0,
        y: 80,
        rotationX: -45
      }, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });

      // Feature cards with Material Design entrance
      gsap.fromTo('.feature-card', {
        opacity: 0,
        y: 60,
        scale: 0.85
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      // Case study cards
      gsap.fromTo('.case-study-card', {
        opacity: 0,
        x: -60,
        scale: 0.9
      }, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: caseStudiesRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });

      // Integration section
      gsap.fromTo('.integration-content', {
        opacity: 0,
        y: 80,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: integrationRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      // CTA section
      gsap.fromTo('.cta-content', {
        opacity: 0,
        y: 60,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      // Floating elements
      gsap.to('.floating-element', {
        y: -30,
        x: 20,
        rotation: 360,
        duration: 25,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 1
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { number: '2.5M+', label: 'AUT Students & Alumni', subtitle: 'Active job seekers ready to start careers' },
    { number: '95%', label: 'Graduate Success Rate', subtitle: 'Students find jobs within 6 months' },
    { number: '500+', label: 'Partner Companies', subtitle: 'Global companies hiring our talent' },
    { number: '50%', label: 'Faster Hiring', subtitle: 'Reduce time-to-hire significantly' }
  ];

  const features = [
    {
      icon: <BrainCircuit className="h-12 w-12" />,
      title: "AI-Powered Matching",
      description: "Our advanced algorithms match your job requirements with the most qualified AUT students and recent graduates.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=350&fit=crop",
      color: "from-info-600 to-indigo-700",
      benefits: ["99% match accuracy", "Save 70% recruiting time", "Quality over quantity"]
    },
    {
      icon: <Target className="h-12 w-12" />,
      title: "Precision Targeting",
      description: "Target students by major, GPA, skills, projects, and career interests. Find exactly who you're looking for.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=350&fit=crop",
      color: "from-green-600 to-emerald-700",
      benefits: ["Filter by 50+ criteria", "Real-time availability", "Direct student profiles"]
    },
    {
      icon: <Users2 className="h-12 w-12" />,
      title: "Campus Partnerships",
      description: "Exclusive access to AUT's career services, job fairs, and direct faculty recommendations.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=350&fit=crop",
      color: "from-purple-600 to-violet-700",
      benefits: ["VIP campus access", "Faculty endorsements", "Exclusive job fairs"]
    },
    {
      icon: <Gauge className="h-12 w-12" />,
      title: "Real-Time Analytics",
      description: "Track application rates, candidate quality, and hiring success with comprehensive dashboard analytics.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=350&fit=crop",
      color: "from-orange-600 to-red-700",
      benefits: ["Live hiring metrics", "ROI tracking", "Predictive insights"]
    }
  ];

  const caseStudies = [
    {
      company: "TechCorp Global",
      title: "How TechCorp hired 50+ interns in 30 days with AUT CareerHub",
      logo: "https://images.unsplash.com/photo-1560472354-a40ab98e3025?w=100&h=100&fit=crop",
      description: "See how they streamlined their intern recruitment process and found top talent.",
      results: "300% increase in quality applications",
      industry: "Technology"
    },
    {
      company: "Financial Solutions Inc",
      title: "Building a diverse tech team with AUT's computer science graduates",
      logo: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&h=100&fit=crop",
      description: "Learn how they built their entire junior development team.",
      results: "95% retention rate after 1 year",
      industry: "Finance"
    },
    {
      company: "Green Energy Co",
      title: "Scaling startup hiring with engineering talent from AUT",
      logo: "https://images.unsplash.com/photo-1599305445411-b615a88b7a5d?w=100&h=100&fit=crop",
      description: "Discover their approach to rapid team expansion.",
      results: "Hired 20 engineers in 60 days",
      industry: "Energy"
    },
    {
      company: "Healthcare Innovation",
      title: "Finding specialized biotech talent through AUT partnerships",
      logo: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=100&h=100&fit=crop",
      description: "See how they found niche biotech specialists.",
      results: "100% offer acceptance rate",
      industry: "Healthcare"
    }
  ];

  const testimonials = [
    {
      quote: "AUT CareerHub transformed our hiring process. We found incredible talent faster than ever before.",
      author: "Sarah Chen",
      role: "Head of Talent Acquisition",
      company: "Microsoft Uzbekistan",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b734?w=80&h=80&fit=crop&crop=face"
    },
    {
      quote: "The quality of candidates from AUT is exceptional. Their technical skills and work ethic are outstanding.",
      author: "Ahmed Rahman",
      role: "CTO",
      company: "TechVentures UZ",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
    },
    {
      quote: "We've built our entire engineering team through AUT CareerHub. Best hiring decision we ever made.",
      author: "Maria Gonzalez",
      role: "VP of Engineering",
      company: "InnovateUZ",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
    }
  ];

  const pricingPlans = [
    {
      name: "Startup",
      price: "$99",
      period: "/month",
      description: "Perfect for small companies and startups",
      features: [
        "Up to 10 job postings",
        "Basic candidate filtering",
        "Email support",
        "Standard analytics",
        "Campus job fair access"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      description: "Ideal for growing companies",
      features: [
        "Unlimited job postings",
        "Advanced AI matching",
        "Priority support",
        "Advanced analytics",
        "VIP campus events",
        "Faculty recommendations",
        "Custom branding"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom integrations",
        "White-label solution",
        "On-campus recruiting",
        "Bulk hiring tools",
        "API access"
      ],
      popular: false
    }
  ];

  const handleDemoRequest = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Demo request with email:', email);
    // Add actual demo request logic here
  };

  return (
    <div ref={containerRef} className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      {/* Enhanced Navigation */}
      <nav className={`fixed top-0 w-full backdrop-blur-xl z-50 border-b shadow-lg transition-colors duration-300 ${
        isDark ? 'bg-dark-surface/95 border-lime/20' : 'bg-white/95 border-gray-200'
      }`} style={{ backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-2xl ${
                isDark ? 'bg-lime/10' : 'bg-asu-maroon/10'
              }`}>
                <GraduationCap className={`h-8 w-8 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
              </div>
              <Typography variant="h6" className="font-bold">
                AUT CareerHub
              </Typography>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="text" size="small">Features</Button>
              <Button variant="text" size="small">Pricing</Button>
              <Button variant="text" size="small">Success Stories</Button>
              <Button variant="outlined" size="small">Login</Button>
              <Button variant="contained" size="small">Start Hiring</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section ref={heroRef} className={`pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
        isDark ? 'bg-linear-to-br from-dark-surface via-dark-bg to-dark-surface' : 'bg-linear-to-br from-white via-gray-50 to-white'
      }`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className={`floating-element absolute top-20 left-10 w-32 h-32 rounded-full opacity-20 ${
            isDark ? 'bg-linear-to-br from-lime to-dark-accent' : 'bg-linear-to-br from-asu-maroon to-asu-gold'
          }`} />
          <div className={`floating-element absolute top-40 right-20 w-24 h-24 rounded-full opacity-15 ${
            isDark ? 'bg-linear-to-br from-dark-accent to-lime' : 'bg-linear-to-br from-asu-gold to-asu-maroon'
          }`} style={{ animationDelay: '2s' }} />
          <div className={`floating-element absolute bottom-32 left-1/4 w-16 h-16 rounded-full opacity-25 ${
            isDark ? 'bg-lime' : 'bg-asu-maroon'
          }`} style={{ animationDelay: '4s' }} />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="hero-content">
              <div className={`inline-flex items-center px-4 py-2 rounded-full mb-6 ${
                isDark ? 'bg-lime/10 border border-lime/20' : 'bg-asu-maroon/10 border border-asu-maroon/20'
              }`}>
                <Typography variant="caption" className={`font-medium ${
                  isDark ? 'text-lime' : 'text-asu-maroon'
                }`}>
                  Top University Talent Platform in Uzbekistan
                </Typography>
              </div>

              <Typography 
                variant="h1" 
                className={`text-5xl md:text-6xl font-bold mb-6 leading-tight ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}
              >
                Hire Tomorrow's 
                <span className={`block bg-clip-text text-transparent ${
                  isDark 
                    ? 'bg-linear-to-r from-lime to-dark-accent' 
                    : 'bg-linear-to-r from-asu-maroon to-asu-gold'
                }`}>
                  Tech Leaders
                </span>
                Today
              </Typography>
              
              <Typography 
                variant="h5" 
                className={`mb-8 leading-relaxed font-normal ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}
              >
                Connect with AUT's top computer science, engineering, and business students. 
                Access pre-vetted talent with cutting-edge skills and proven academic excellence.
              </Typography>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => console.log('Start hiring')}
                  className="group px-8 py-4 text-lg transform hover:scale-105 transition-all duration-300"
                  endIcon={<ArrowRight className="group-hover:translate-x-1 transition-transform" />}
                >
                  Start Hiring Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => setIsVideoPlaying(true)}
                  className="group px-8 py-4 text-lg"
                  startIcon={<Play className="group-hover:scale-110 transition-transform" />}
                >
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-300 overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/photo-${1494790108755 + i}-2616b612b734?w=40&h=40&fit=crop&crop=face`}
                        alt="Employer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <Typography variant="body2" className={isDark ? 'text-dark-muted' : 'text-gray-600'}>
                  Join 500+ companies already hiring with us
                </Typography>
              </div>
            </div>
            
            <div className="relative">
              <Card className="overflow-hidden" elevation={4}>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                    alt="AUT Students"
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <Typography variant="h6" className="text-white font-bold mb-2">
                      Meet AUT's Top Talent
                    </Typography>
                    <Typography variant="body2" className="text-white/90">
                      Students ready to make an impact at your company
                    </Typography>
                  </div>
                </div>
              </Card>
              
              {/* Floating stats cards */}
              <Card className="absolute -top-4 -left-4 p-4 shadow-xl" elevation={3}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-lime/10' : 'bg-asu-maroon/10'}`}>
                    <Trophy className={`h-6 w-6 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
                  </div>
                  <div>
                    <Typography variant="h6" className="font-bold">95%</Typography>
                    <Typography variant="caption">Graduate Success</Typography>
                  </div>
                </div>
              </Card>
              
              <Card className="absolute -bottom-4 -right-4 p-4 shadow-xl" elevation={3}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-lime/10' : 'bg-asu-maroon/10'}`}>
                    <Users className={`h-6 w-6 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
                  </div>
                  <div>
                    <Typography variant="h6" className="font-bold">2.5M+</Typography>
                    <Typography variant="caption">Active Students</Typography>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section ref={statsRef} className={`py-20 px-4 sm:px-6 lg:px-8 ${
        isDark ? 'bg-dark-surface' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Typography variant="h2" className={`text-4xl font-bold mb-4 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}>
              Why Top Companies Choose AUT CareerHub
            </Typography>
            <Typography variant="h6" className={`font-normal ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}>
              Join the leading companies already building their teams with our talent
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className="stats-card text-center group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2" 
                elevation={2}
              >
                <div className="p-8">
                  <Typography 
                    variant="h2" 
                    className={`text-4xl font-bold mb-2 ${
                      isDark 
                        ? 'bg-linear-to-r from-lime to-dark-accent bg-clip-text text-transparent' 
                        : 'bg-linear-to-r from-asu-maroon to-asu-gold bg-clip-text text-transparent'
                    }`}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" className={`font-bold mb-2 ${
                    isDark ? 'text-dark-text' : 'text-gray-900'
                  }`}>
                    {stat.label}
                  </Typography>
                  <Typography variant="body2" className={`leading-relaxed ${
                    isDark ? 'text-dark-muted' : 'text-gray-600'
                  }`}>
                    {stat.subtitle}
                  </Typography>
                </div>
              </Card>
            ))}
          </div>

          {/* Partner logos */}
          <Card className="text-center" elevation={1}>
            <div className="p-12">
              <Typography variant="h5" className={`font-bold mb-8 ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}>
                Trusted by industry leaders across Uzbekistan and beyond
              </Typography>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                {['Microsoft', 'Google', 'Samsung', 'EPAM', 'Uzcard', 'Click'].map(company => (
                  <Typography key={company} variant="h6" className="font-bold">
                    {company}
                  </Typography>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section ref={featuresRef} className={`py-24 px-4 sm:px-6 lg:px-8 ${
        isDark ? 'bg-dark-bg' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Typography variant="h2" className={`text-4xl font-bold mb-6 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}>
              Everything you need to hire exceptional talent
            </Typography>
            <Typography variant="h6" className={`font-normal max-w-3xl mx-auto ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}>
              Our platform combines cutting-edge technology with deep university partnerships 
              to deliver the best hiring experience for both employers and students.
            </Typography>
          </div>

          <div className="space-y-32">
            {features.map((feature, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <Card className="feature-card p-8" elevation={2}>
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br ${feature.color} mb-8 shadow-lg`}>
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                    
                    <Typography variant="h3" className={`text-3xl font-bold mb-6 ${
                      isDark ? 'text-dark-text' : 'text-gray-900'
                    }`}>
                      {feature.title}
                    </Typography>
                    
                    <Typography variant="body1" className={`text-xl leading-relaxed mb-8 ${
                      isDark ? 'text-dark-muted' : 'text-gray-600'
                    }`}>
                      {feature.description}
                    </Typography>

                    <div className="space-y-3">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <CheckCircle className={`h-5 w-5 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
                          <Typography variant="body1" className={isDark ? 'text-dark-text' : 'text-gray-900'}>
                            {benefit}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <Card className="overflow-hidden group" elevation={3}>
                    <div className="relative overflow-hidden">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Testimonials Section */}
      <section ref={testimonialsRef} className={`py-24 px-4 sm:px-6 lg:px-8 ${
        isDark ? 'bg-dark-surface' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Typography variant="h2" className={`text-4xl font-bold mb-6 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}>
              What our partners say
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 group hover:shadow-xl transition-all duration-500" elevation={2}>
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 fill-current ${
                      isDark ? 'text-lime' : 'text-asu-gold'
                    }`} />
                  ))}
                </div>
                
                <Typography variant="body1" className={`italic mb-6 leading-relaxed ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>
                  "{testimonial.quote}"
                </Typography>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <Typography variant="h6" className={`font-bold ${
                      isDark ? 'text-dark-text' : 'text-gray-900'
                    }`}>
                      {testimonial.author}
                    </Typography>
                    <Typography variant="body2" className={`${
                      isDark ? 'text-dark-muted' : 'text-gray-600'
                    }`}>
                      {testimonial.role}, {testimonial.company}
                    </Typography>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* New Pricing Section */}
      <section ref={pricingRef} className={`py-24 px-4 sm:px-6 lg:px-8 ${
        isDark ? 'bg-dark-bg' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Typography variant="h2" className={`text-4xl font-bold mb-6 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}>
              Simple, transparent pricing
            </Typography>
            <Typography variant="h6" className={`font-normal ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}>
              Choose the plan that fits your hiring needs
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative p-8 ${plan.popular ? 'scale-105' : ''}`}
                elevation={plan.popular ? 4 : 2}
              >
                <div className="text-center mb-8">
                  <Typography variant="h5" className={`font-bold mb-2 ${
                    isDark ? 'text-dark-text' : 'text-gray-900'
                  }`}>
                    {plan.name}
                  </Typography>
                  <div className="flex items-baseline justify-center mb-4">
                    <Typography variant="h2" className={`text-4xl font-bold ${
                      isDark ? 'text-dark-text' : 'text-gray-900'
                    }`}>
                      {plan.price}
                    </Typography>
                    <Typography variant="body1" className={`ml-1 ${
                      isDark ? 'text-dark-muted' : 'text-gray-600'
                    }`}>
                      {plan.period}
                    </Typography>
                  </div>
                  <Typography variant="body2" className={isDark ? 'text-dark-muted' : 'text-gray-600'}>
                    {plan.description}
                  </Typography>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className={`h-5 w-5 mr-3 shrink-0 ${
                        isDark ? 'text-lime' : 'text-asu-maroon'
                      }`} />
                      <Typography variant="body2" className={isDark ? 'text-dark-text' : 'text-gray-900'}>
                        {feature}
                      </Typography>
                    </li>
                  ))}
                </ul>
                
                <Button
                  variant={plan.popular ? "contained" : "outlined"}
                  size="large"
                  className="w-full"
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Case Studies */}
      <section ref={caseStudiesRef} className={`py-24 px-4 sm:px-6 lg:px-8 ${
        isDark ? 'bg-dark-surface' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Typography variant="h2" className={`text-4xl font-bold mb-6 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}>
              Success stories from our partners
            </Typography>
            <Typography variant="h6" className={`font-normal ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}>
              See how companies are transforming their hiring with AUT CareerHub
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {caseStudies.map((study, index) => (
              <Card 
                key={index} 
                className="case-study-card group hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
                elevation={2}
              >
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden mr-4 shadow-md">
                      <img 
                        src={study.logo} 
                        alt={study.company}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <Typography variant="h6" className={`font-bold ${
                        isDark ? 'text-dark-text' : 'text-gray-900'
                      }`}>
                        {study.company}
                      </Typography>
                      <Typography variant="caption" className={`${
                        isDark ? 'text-dark-muted' : 'text-gray-600'
                      }`}>
                        {study.industry}
                      </Typography>
                    </div>
                  </div>
                  
                  <Typography variant="h5" className={`font-bold mb-4 group-hover:text-opacity-80 transition-all ${
                    isDark ? 'text-dark-text' : 'text-gray-900'
                  }`}>
                    {study.title}
                  </Typography>
                  
                  <Typography variant="body1" className={`leading-relaxed mb-4 ${
                    isDark ? 'text-dark-muted' : 'text-gray-600'
                  }`}>
                    {study.description}
                  </Typography>

                  <Typography variant="body2" className={`font-medium mb-6 ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`}>
                    Result: {study.results}
                  </Typography>
                  
                  <div className="flex items-center">
                    <Button
                      variant="text"
                      endIcon={<ChevronRight className="group-hover:translate-x-1 transition-transform duration-200" />}
                    >
                      Read success story
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section ref={ctaRef} className={`py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
        isDark ? 'bg-linear-to-br from-dark-surface to-dark-bg' : 'bg-linear-to-br from-gray-900 to-gray-800'
      }`}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent transform -skew-y-12"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Card className="cta-content p-16 bg-transparent border-0 shadow-none" elevation={0}>
            <Typography variant="h2" className="text-4xl font-bold mb-6 text-white">
              Ready to find your next hire?
            </Typography>
            <Typography variant="h6" className="mb-12 font-normal text-white/80 max-w-2xl mx-auto">
              Join hundreds of companies already building their teams with AUT's exceptional talent. 
              Start your free trial today and see the difference quality makes.
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Button
                variant="contained"
                size="large"
                className="px-8 py-4 text-lg bg-white text-gray-900 hover:bg-gray-100"
                endIcon={<ArrowRight />}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outlined"
                size="large"
                className="px-8 py-4 text-lg border-white text-white hover:bg-white/10"
                startIcon={<Calendar />}
              >
                Schedule Demo
              </Button>
            </div>
            
            <Typography variant="body2" className="text-white/60">
              No credit card required • Setup in under 5 minutes • Cancel anytime
            </Typography>
          </Card>
        </div>
      </section>

      {/* Material Design Footer */}
      <footer className={`py-20 px-4 sm:px-6 lg:px-8 ${
        isDark ? 'bg-dark-surface' : 'bg-gray-900'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <Typography variant="h6" className="font-bold text-white mb-6">Students</Typography>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Find your next job</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">How it works</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Who's hiring</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Career tips</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Companies</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Job roles</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help center</a></li>
              </ul>
            </div>
            <div>
              <Typography variant="h6" className="font-bold text-white mb-6">Employers</Typography>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Hire top talent</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Solutions</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Products</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Customers</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Resources</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Request demo</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help center</a></li>
              </ul>
            </div>
            <div>
              <Typography variant="h6" className="font-bold text-white mb-6">Career centers</Typography>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Support students</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Marketing toolkit</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Resources</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Events</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Request demo</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help center</a></li>
              </ul>
            </div>
            <div>
              <Typography variant="h6" className="font-bold text-white mb-6">Company</Typography>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Handshake AI</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Join us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Brand guidelines</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <Typography variant="body2" className="text-gray-400 mb-4 md:mb-0">
                ©2024 Handshake. All rights reserved
              </Typography>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Accessibility</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}