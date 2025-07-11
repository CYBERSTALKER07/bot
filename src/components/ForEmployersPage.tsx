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
  ThumbsUp
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
  
  // Refs for different sections
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const integrationRef = useRef<HTMLDivElement>(null);
  const caseStudiesRef = useRef<HTMLDivElement>(null);
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
    { number: '18M', label: 'active college students and recent alumni' },
    { number: '90%', label: 'top ranked institutions in the US' },
    { number: '1M', label: 'employers' },
    { number: '1,500+', label: 'official partnerships with colleges and universities' }
  ];

  const features = [
    {
      icon: <Award className="h-12 w-12" />,
      title: "Build your brand",
      description: "Stay top of mind for 18M+ verified candidates and drive consistent touch points to boost engagement.",
      image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: <Target className="h-12 w-12" />,
      title: "Find the right candidates",
      description: "Refine your talent pool using enhanced filtering and targeting capabilities.",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <MessageCircle className="h-12 w-12" />,
      title: "Connect with Gen Z",
      description: "Build meaningful relationships by posting and engaging with candidates on the feed.",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Clock className="h-12 w-12" />,
      title: "Reduce time to hire",
      description: "Create a seamless hiring experience for your team with tools for end-to-end recruiting.",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop",
      color: "from-orange-500 to-red-600"
    }
  ];

  const caseStudies = [
    {
      company: "KraftHeinz",
      title: "Why Handshake is the official system of record for Kraft Heinz",
      logo: "https://images.unsplash.com/photo-1560472354-a40ab98e3025?w=100&h=100&fit=crop",
      description: "See how Kraft Heinz streamlined their early talent recruiting process."
    },
    {
      company: "McDonald's",
      title: "McDonald's launches their early talent program with Handshake",
      logo: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&h=100&fit=crop",
      description: "Learn how McDonald's built a successful early talent pipeline."
    },
    {
      company: "Comcast",
      title: "Comcast's winning early talent strategy is an engine for growth",
      logo: "https://images.unsplash.com/photo-1599305445411-b615a88b7a5d?w=100&h=100&fit=crop",
      description: "Discover Comcast's approach to building a strong talent pipeline."
    },
    {
      company: "Manassas",
      title: "Manassas City Public Schools got a 25x boost in applicants with Handshake",
      logo: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=100&h=100&fit=crop",
      description: "See the dramatic increase in quality applicants achieved."
    }
  ];

  const handleDemoRequest = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Demo request with email:', email);
  };

  return (
    <div ref={containerRef} className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      {/* Material Design App Bar */}
      <nav className={`fixed top-0 w-full backdrop-blur-xl z-50 border-b shadow-lg transition-colors duration-300 ${
        isDark ? 'bg-dark-surface/95 border-lime/20' : 'bg-white/95 border-gray-200'
      }`} style={{ backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Material Design Logo */}
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-2xl ${
                isDark ? 'bg-lime/10' : 'bg-asu-maroon/10'
              }`}>
                <Building2 className={`h-8 w-8 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
              </div>
              <Typography variant="h6" className="font-bold">
                Handshake
              </Typography>
            </div>
            
            {/* Material Design Navigation */}
            <div className="flex items-center space-x-2">
              <Button variant="text" size="small">
                Products
              </Button>
              <Button variant="text" size="small">
                Resources
              </Button>
              <Button variant="text" size="small">
                Pricing
              </Button>
              <Button variant="outlined" size="small">
                Sign up
              </Button>
              <Button variant="contained" size="small">
                Contact sales
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Material Design Hero Section */}
      <section ref={heroRef} className={`pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
        isDark ? 'bg-gradient-to-br from-dark-surface via-dark-bg to-dark-surface' : 'bg-gradient-to-br from-white via-gray-50 to-white'
      }`}>
        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`floating-element absolute top-20 left-10 w-6 h-6 rounded-full ${
            isDark ? 'bg-lime/20' : 'bg-asu-maroon/20'
          }`} />
          <div className={`floating-element absolute top-40 right-20 w-8 h-8 rounded-full ${
            isDark ? 'bg-dark-accent/30' : 'bg-asu-gold/30'
          }`} />
          <div className={`floating-element absolute bottom-32 left-1/4 w-4 h-4 rounded-full ${
            isDark ? 'bg-lime/25' : 'bg-asu-maroon/25'
          }`} />
        </div>

        <div className="max-w-6xl mx-auto text-center relative">
          <div className="hero-content">
            <Typography 
              variant="h1" 
              className={`text-6xl md:text-7xl font-bold mb-8 leading-tight ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}
            >
              Hire fast
            </Typography>
            
            <Typography 
              variant="h5" 
              className={`mb-12 max-w-4xl mx-auto leading-relaxed font-normal ${
                isDark ? 'text-dark-muted' : 'text-gray-600'
              }`}
            >
              Streamline your recruiting with advanced tools to improve candidate quality and reduce time to hire. 
              Experience the future of hiring.
            </Typography>

            <div className="hero-cta">
              <Button
                variant="contained"
                size="large"
                onClick={() => console.log('Request demo')}
                className="group px-12 py-4 text-lg transform hover:scale-105 transition-all duration-300"
                startIcon={Play}
              >
                Request a demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Material Design Stats Section */}
      <section ref={statsRef} className={`py-20 px-4 sm:px-6 lg:px-8 ${
        isDark ? 'bg-dark-surface' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className="stats-card text-center group hover:shadow-xl transition-all duration-500" 
                elevation={2}
                animated
                delay={index * 0.1}
              >
                <div className="p-8">
                  <Typography 
                    variant="h2" 
                    className={`text-5xl font-bold mb-4 ${
                      isDark 
                        ? 'bg-gradient-to-r from-lime to-dark-accent bg-clip-text text-transparent' 
                        : 'bg-gradient-to-r from-asu-maroon to-asu-gold bg-clip-text text-transparent'
                    }`}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" className={`leading-relaxed ${
                    isDark ? 'text-dark-muted' : 'text-gray-600'
                  }`}>
                    {stat.label}
                  </Typography>
                </div>
              </Card>
            ))}
          </div>

          {/* Fortune 100 Banner */}
          <Card className="text-center" elevation={3}>
            <div className="p-12">
              <Typography variant="h4" className={`font-bold mb-4 ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}>
                100% of Fortune 100 companies use Handshake to find their next generation of talent
              </Typography>
            </div>
          </Card>
        </div>
      </section>

      {/* Material Design Features Section */}
      <section ref={featuresRef} className={`py-24 px-4 sm:px-6 lg:px-8 ${
        isDark ? 'bg-dark-bg' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Typography variant="h2" className={`text-4xl font-bold mb-6 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}>
              Everything you need to hire top talent
            </Typography>
          </div>

          <div className="space-y-32">
            {features.map((feature, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <Card className="feature-card p-8" elevation={2}>
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.color} mb-8 shadow-lg`}>
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                    
                    <Typography variant="h3" className={`text-3xl font-bold mb-6 ${
                      isDark ? 'text-dark-text' : 'text-gray-900'
                    }`}>
                      {feature.title}
                    </Typography>
                    
                    <Typography variant="body1" className={`text-xl leading-relaxed ${
                      isDark ? 'text-dark-muted' : 'text-gray-600'
                    }`}>
                      {feature.description}
                    </Typography>
                  </Card>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <Card className="overflow-hidden" elevation={3}>
                    <div className="relative">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-80 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Material Design Integration Section */}
      <section ref={integrationRef} className={`py-24 px-4 sm:px-6 lg:px-8 ${
        isDark ? 'bg-dark-surface' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="integration-content">
              <Typography variant="h2" className={`text-4xl font-bold mb-6 ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}>
                Seamlessly integrate your ATS with Handshake
              </Typography>
              <Typography variant="h6" className={`mb-8 leading-relaxed font-normal ${
                isDark ? 'text-dark-muted' : 'text-gray-600'
              }`}>
                Increase efficiency for your hiring teams and streamline day-to-day work
              </Typography>
              <Button
                variant="outlined"
                size="large"
                endIcon={ChevronRight}
                className="group"
              >
                Learn more
              </Button>
            </div>
            
            <div className="flex justify-center">
              <Card className="relative overflow-hidden" elevation={4}>
                <div className="p-8">
                  <div className="flex items-center justify-center w-64 h-64">
                    <div className={`w-32 h-32 rounded-3xl ${
                      isDark ? 'bg-lime/10' : 'bg-asu-maroon/10'
                    } flex items-center justify-center`}>
                      <Settings className={`h-16 w-16 ${
                        isDark ? 'text-lime' : 'text-asu-maroon'
                      }`} />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Material Design Case Studies Section */}
      <section ref={caseStudiesRef} className={`py-24 px-4 sm:px-6 lg:px-8 ${
        isDark ? 'bg-dark-bg' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Typography variant="h2" className={`text-4xl font-bold mb-6 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}>
              Case studies
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {caseStudies.map((study, index) => (
              <Card 
                key={index} 
                className="case-study-card group hover:shadow-2xl transition-all duration-500 cursor-pointer"
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
                    </div>
                  </div>
                  
                  <Typography variant="h5" className={`font-bold mb-4 group-hover:text-opacity-80 transition-all ${
                    isDark ? 'text-dark-text' : 'text-gray-900'
                  }`}>
                    {study.title}
                  </Typography>
                  
                  <Typography variant="body1" className={`leading-relaxed mb-6 ${
                    isDark ? 'text-dark-muted' : 'text-gray-600'
                  }`}>
                    {study.description}
                  </Typography>
                  
                  <div className="flex items-center">
                    <Button
                      variant="text"
                      endIcon={ChevronRight}
                      className="group-hover:translate-x-1 transition-transform duration-200"
                    >
                      Read case study
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="outlined"
              size="large"
              endIcon={ExternalLink}
              className="group"
            >
              Explore all case studies
            </Button>
          </div>
        </div>
      </section>

      {/* Material Design CTA Section */}
      <section ref={ctaRef} className={`py-24 px-4 sm:px-6 lg:px-8 ${
        isDark ? 'bg-gradient-to-br from-dark-surface to-dark-bg' : 'bg-gradient-to-br from-gray-50 to-white'
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <Card className="cta-content p-16" elevation={3}>
            <Typography variant="h2" className={`text-4xl font-bold mb-6 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}>
              Ready to transform your hiring?
            </Typography>
            <Typography variant="h6" className={`mb-8 font-normal ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}>
              Join thousands of companies using Handshake to build their teams
            </Typography>
            
            <Card className="max-w-md mx-auto mb-8" elevation={2}>
              <form onSubmit={handleDemoRequest} className="p-6">
                <div className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                    variant="outlined"
                  />
                  <Button type="submit" variant="contained" size="large">
                    Get Demo
                  </Button>
                </div>
              </form>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="contained"
                size="large"
                startIcon={Play}
                className="group"
              >
                Request Demo
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={Phone}
                className="group"
              >
                Contact Sales
              </Button>
            </div>
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