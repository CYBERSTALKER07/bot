import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { useScrollTrigger, useScrollTriggerStagger } from '../hooks/useScrollTrigger';
import { 
  GraduationCap,
  Users,
  MapPin,
  Calendar,
  MessageCircle,
  Download,
  Star,
  ArrowRight,
  CheckCircle,
  Search,
  Filter,
  Bell,
  TrendingUp,
  Award,
  Building2,
  Heart,
  Play,
  Sparkles,
  Coffee,
  Target,
  Eye,
  Globe,
  Briefcase,
  Network,
  BookOpen,
  Video,
  FileText,
  QrCode,
  ChevronRight,
  UserCheck,
  Mail,
  Phone,
  Lightbulb,
  Rocket,
  Shield,
  Zap,
  Smartphone,
  MessageSquare,
  Calendar as CalendarIcon,
  BookOpen as BookIcon
} from 'lucide-react';

// Material Design UI Components
import { Card, StatsCard } from './ui/Card';
import Button from './ui/Button';
import Typography from './ui/Typography';
import Input from './ui/Input';

gsap.registerPlugin(ScrollTrigger);

export default function ForStudentsPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  
  // Refs for different sections
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const companiesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const appDemoRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enhanced entrance animations with Handshake-style motion
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Hero entrance with dramatic scale
      gsap.fromTo('.hero-content', {
        opacity: 0,
        y: 120,
        scale: 0.8
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.8,
        ease: 'power3.out',
        delay: 0.2
      });

      // Staggered feature animations
      gsap.fromTo('.feature-card', {
        opacity: 0,
        y: 100,
        scale: 0.8
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      // Company logos with bounce
      gsap.fromTo('.company-logo', {
        opacity: 0,
        scale: 0.5,
        y: 50
      }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        scrollTrigger: {
          trigger: companiesRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });

      // Content sections with slide-in
      gsap.fromTo('.content-section', {
        opacity: 0,
        x: -80,
        scale: 0.9
      }, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.3,
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      // App demo with elastic entrance
      gsap.fromTo('.app-demo', {
        opacity: 0,
        scale: 0.6,
        rotation: -15,
        y: 150
      }, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        y: 0,
        duration: 2.5,
        ease: 'elastic.out(1, 0.8)',
        scrollTrigger: {
          trigger: appDemoRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      // Testimonials with wave effect
      gsap.fromTo('.testimonial-card', {
        opacity: 0,
        y: 80,
        scale: 0.85
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });

      // Floating decorative elements
      gsap.to('.floating-decoration', {
        y: -20,
        x: 15,
        rotation: 180,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 2
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <Heart className="h-16 w-16" />,
      title: "Real",
      description: "The authentic and helpful place where 18M students get guidance, inspo, info, and connections straight from the source.",
      gradient: "from-pink-500 via-rose-500 to-red-500"
    },
    {
      icon: <Target className="h-16 w-16" />,
      title: "Relevant", 
      description: "Built just for you with personalized content from your school, experts, and 1M companies.",
      gradient: "from-blue-500 via-indigo-500 to-purple-500"
    },
    {
      icon: <Rocket className="h-16 w-16" />,
      title: "Future-focused",
      description: "The career platform you'll actually use with jobs, internships, and opportunities you won't find anywhere else.",
      gradient: "from-green-500 via-teal-500 to-blue-500"
    }
  ];

  const companies = [
    { name: 'Google', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg' },
    { name: 'Microsoft', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoft/microsoft-original.svg' },
    { name: 'Apple', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg' },
    { name: 'Amazon', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg' },
    { name: 'Meta', logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop' },
    { name: 'Netflix', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&h=100&fit=crop' },
    { name: 'Tesla', logo: 'https://images.unsplash.com/photo-1560472354-a40ab98e3025?w=100&h=100&fit=crop' },
    { name: 'Spotify', logo: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=100&h=100&fit=crop' },
    { name: 'Airbnb', logo: 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=100&h=100&fit=crop' },
    { name: 'Uber', logo: 'https://images.unsplash.com/photo-1599305445411-b615a88b7a5d?w=100&h=100&fit=crop' },
    { name: 'Stripe', logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop' },
    { name: 'Slack', logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop' }
  ];

  const contentFeatures = [
    {
      title: "Inspiring career content",
      description: "Broaden your search with posts, videos, and articles highlighting career paths you might not have considered.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
      icon: <BookIcon className="h-8 w-8" />
    },
    {
      title: "Personalized job recs",
      description: "Get recommendations for jobs, opportunities, and events based on your profile, interests, and what's best for you.",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop",
      icon: <Target className="h-8 w-8" />
    },
    {
      title: "Events to strengthen your search",
      description: "Make face-to-face connections at career fairs, networking sessions, resume workshops, and more.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
      icon: <CalendarIcon className="h-8 w-8" />
    },
    {
      title: "Message with recruiters",
      description: "Get the upper hand in interviews, answers to your career questions, and build your network.",
      image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&h=400&fit=crop",
      icon: <MessageSquare className="h-8 w-8" />
    }
  ];

  const testimonials = [
    {
      name: "Amanda",
      role: "Software Engineering Student",
      quote: "Handshake provides all the jobs you could want in one place, and allows you to be super organized with due dates and searches. It makes the entire process easier.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b278?w=150&h=150&fit=crop&crop=face",
      company: "Interned at Google"
    },
    {
      name: "Dremere",
      role: "Business Major",
      quote: "I've had five internships, this will be my fifth one... four opportunities came directly from Handshake.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      company: "Interned at Microsoft"
    },
    {
      name: "Anson",
      role: "International Student",
      quote: "You're able to filter for visa status restrictions and it saves international students so much time because we don't want to be applying for jobs we know we're never going to get.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      company: "Interned at Amazon"
    },
    {
      name: "Emma",
      role: "Marketing Student",
      quote: "Handshake is a great way to find jobs and internships. It's really easy to use and it's really easy to find what you're looking for.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      company: "Interned at Meta"
    }
  ];

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup with email:', email);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-white">
      {/* Enhanced Navigation Bar */}
      <nav className="fixed top-0 w-full backdrop-blur-xl z-50 bg-white/95 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <Link to="/" className="text-2xl font-bold text-gray-900">
                Handshake
              </Link>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/whos-hiring" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Who's hiring
              </Link>
              <Link to="/career-tips" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Career tips
              </Link>
              <Link to="/login" className="px-6 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Log in
              </Link>
              <Link to="/register" className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all duration-200 shadow-lg hover:shadow-xl">
                Sign up
              </Link>
              <button className="flex items-center space-x-2 px-6 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors">
                <Smartphone className="h-5 w-5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Handshake Style */}
      <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 min-h-screen flex items-center">
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Curved Lines */}
          <svg className="absolute top-16 left-16 w-48 h-24 opacity-60" viewBox="0 0 200 100">
            <path d="M10 50 Q60 20 120 40 T200 30" stroke="#fbbf24" strokeWidth="3" fill="none" />
            <path d="M0 60 Q50 30 110 50 T190 40" stroke="#fbbf24" strokeWidth="2" fill="none" />
          </svg>
          <svg className="absolute top-32 right-16 w-64 h-48 opacity-60" viewBox="0 0 260 200">
            <path d="M260 30 Q220 70 160 50 T60 90" stroke="#fbbf24" strokeWidth="3" fill="none" />
            <path d="M250 50 Q210 90 150 70 T50 110" stroke="#fbbf24" strokeWidth="2" fill="none" />
          </svg>
          <svg className="absolute bottom-48 left-32 w-56 h-32 opacity-60" viewBox="0 0 230 130">
            <path d="M10 90 Q70 50 140 80 T230 60" stroke="#fbbf24" strokeWidth="3" fill="none" />
          </svg>
          
          {/* Floating Decorations */}
          <div className="floating-decoration absolute top-24 right-1/3 w-4 h-4 bg-yellow-400 rounded-full opacity-60"></div>
          <div className="floating-decoration absolute top-64 left-1/4 w-6 h-6 bg-yellow-400 rounded-full opacity-40"></div>
          <div className="floating-decoration absolute bottom-96 right-1/4 w-3 h-3 bg-yellow-400 rounded-full opacity-70"></div>
          
          {/* Wave Bottom */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 320" className="w-full h-auto">
              <path 
                d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" 
                fill="white" 
                fillOpacity="0.1"
              />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <div className="hero-content">
            {/* QR Code Badge */}
            <div className="mb-12">
              <div className="inline-flex items-center space-x-3 px-8 py-4 bg-yellow-400/10 backdrop-blur-sm rounded-full border border-yellow-400/20">
                <QrCode className="h-6 w-6 text-yellow-400" />
                <span className="text-yellow-400 font-medium">QR code to download Handshake mobile app</span>
              </div>
            </div>
            
            {/* Main Headline */}
            <div className="mb-12">
              <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-black leading-none text-orange-500 mb-6" 
                  style={{ 
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontWeight: 900,
                    letterSpacing: '-0.03em'
                  }}>
                Your career
              </h1>
              <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-black leading-none text-orange-500" 
                  style={{ 
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontWeight: 900,
                    letterSpacing: '-0.03em'
                  }}>
                starts here
              </h1>
            </div>
            
            {/* Subtitle */}
            <p className="text-2xl md:text-3xl text-white/90 max-w-5xl mx-auto mb-16 leading-relaxed">
              Find your first, second, and third job on the career network built just for you.
            </p>

            {/* Email Signup */}
            <div className="max-w-lg mx-auto mb-16">
              <div className="flex gap-4 p-2 bg-white rounded-2xl shadow-2xl">
                <input
                  type="email"
                  placeholder="Type email here"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-6 py-4 text-lg text-gray-900 placeholder-gray-500 border-0 rounded-xl focus:outline-none focus:ring-0"
                />
                <button 
                  onClick={handleSignup}
                  className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition-colors shadow-lg hover:shadow-xl"
                >
                  Sign up
                </button>
              </div>
            </div>
            
            {/* QR Code Card */}
            <div className="absolute bottom-32 right-16 hidden xl:block">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center">
                    <QrCode className="h-20 w-20 text-gray-600" />
                  </div>
                  <p className="text-gray-800 font-bold text-lg">Download</p>
                  <p className="text-gray-800 font-bold text-lg">Handshake</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-32 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-6xl font-black text-gray-900 mb-8">
              Create a profile, find your community, 
              <span className="text-orange-500"> build your career</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="feature-card group">
                <div className="bg-white rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 border border-gray-100">
                  <div className={`inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-gradient-to-br ${feature.gradient} mb-10 group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-4xl font-black text-gray-900 mb-8">
                    {feature.title}
                  </h3>
                  
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section ref={companiesRef} className="py-32 px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-black text-gray-900 mb-20">
            These companies and more want to 
            <span className="text-orange-500"> hire people like you</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {companies.map((company, index) => (
              <div key={index} className="company-logo group">
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="w-20 h-20 mx-auto bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                    <img 
                      src={company.logo} 
                      alt={company.name}
                      className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <p className="mt-4 text-gray-700 font-semibold">{company.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Features */}
      <section ref={contentRef} className="py-32 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-40">
            {contentFeatures.map((feature, index) => (
              <div key={index} className={`content-section grid grid-cols-1 lg:grid-cols-2 gap-20 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 mb-8`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-5xl font-black text-gray-900 mb-8">
                    {feature.title}
                  </h3>
                  
                  <p className="text-2xl text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl transform rotate-3"></div>
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="relative w-full h-96 object-cover rounded-3xl shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Demo Section */}
      <section ref={appDemoRef} className="py-32 px-6 lg:px-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-6xl font-black text-white mb-8">
                Launch your
                <span className="text-orange-500"> career</span>
              </h2>
              
              <p className="text-2xl text-white/80 mb-12 leading-relaxed">
                Download Handshake and never miss a message, event, or job.
              </p>
              
              <div className="max-w-md">
                <div className="flex gap-4 p-2 bg-white rounded-2xl shadow-2xl">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-6 py-4 text-lg text-gray-900 placeholder-gray-500 border-0 rounded-xl focus:outline-none focus:ring-0"
                  />
                  <button 
                    onClick={handleSignup}
                    className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition-colors"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="app-demo relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl transform rotate-6 scale-105"></div>
                <div className="relative w-80 h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Your Dashboard</h3>
                        <p className="text-gray-600">5 new opportunities</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                        <Bell className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {[
                        { company: 'Google', role: 'Software Engineer', time: '2 hours ago' },
                        { company: 'Microsoft', role: 'Product Manager', time: '1 day ago' },
                        { company: 'Apple', role: 'UX Designer', time: '3 days ago' },
                        { company: 'Meta', role: 'Data Scientist', time: '1 week ago' }
                      ].map((job, i) => (
                        <div key={i} className="bg-gray-50 rounded-2xl p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-gray-900">{job.role}</h4>
                              <p className="text-gray-600">{job.company}</p>
                              <p className="text-sm text-gray-500">{job.time}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-32 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black text-gray-900 mb-8">
              What students are saying about
              <span className="text-orange-500"> Handshake</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-center mb-8">
                    <div className="w-20 h-20 rounded-full overflow-hidden mr-6 ring-4 ring-purple-200">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-600 font-medium">{testimonial.role}</p>
                      <p className="text-purple-600 font-semibold text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                  
                  <p className="text-xl text-gray-700 leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section ref={ctaRef} className="py-32 px-6 lg:px-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-16 border border-white/20">
            <h2 className="text-6xl font-black text-white mb-8">
              Ready to launch your
              <span className="text-orange-500"> career?</span>
            </h2>
            
            <p className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join millions of students who have found their dream jobs through Handshake
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="px-12 py-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-2xl transition-colors shadow-2xl hover:shadow-3xl text-xl">
                Download App
              </button>
              <button className="px-12 py-6 bg-white/20 hover:bg-white/30 text-white font-bold rounded-2xl transition-colors backdrop-blur-sm border border-white/30 text-xl">
                Create Profile
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="text-xl font-bold text-white mb-8">Students</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Find your next job</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">How it works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Who's hiring</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Career tips</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-8">Employers</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Hire top talent</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Solutions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Products</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Request demo</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-8">Career centers</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Support students</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Marketing toolkit</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Resources</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Events</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-8">Company</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Join us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Blog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0 text-lg">
                ©2024 Handshake. All rights reserved
              </p>
              <div className="flex space-x-8">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Privacy policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Accessibility</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Terms of service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}