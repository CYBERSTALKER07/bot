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
  BookOpen as BookIcon,
  Megaphone,
  DollarSign,
  Clock,
  ChevronDown,
  ExternalLink,
  PlayCircle,
  TrendingDown,
  Users2
} from 'lucide-react';

// Material Design UI Components
import { Card, StatsCard } from './ui/Card';
import Button from './ui/Button';
import Typography from './ui/Typography';
import Input from './ui/Input';
import Badge from './ui/Badge';

gsap.registerPlugin(ScrollTrigger);

export default function ForStudentsPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Refs for different sections
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const companiesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const appDemoRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enhanced entrance animations
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

      // Stats cards animation
      gsap.fromTo('.stats-card', {
        opacity: 0,
        y: 60,
        scale: 0.8
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      // Feature cards with enhanced animations
      gsap.fromTo('.feature-card', {
        opacity: 0,
        y: 100,
        scale: 0.8,
        rotation: -5
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      // Company logos with enhanced bounce
      gsap.fromTo('.company-logo', {
        opacity: 0,
        scale: 0.5,
        y: 50,
        rotation: 180
      }, {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0,
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

      // Resource cards animation
      gsap.fromTo('.resource-card', {
        opacity: 0,
        y: 50,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: resourcesRef.current,
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

  const stats = [
    {
      number: '18M+',
      label: 'Students & Alumni',
      description: 'Connected worldwide',
      icon: <Users className="h-8 w-8" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: '1M+',
      label: 'Employers',
      description: 'Actively recruiting',
      icon: <Building2 className="h-8 w-8" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      number: '500K+',
      label: 'Jobs Posted',
      description: 'Every year',
      icon: <Briefcase className="h-8 w-8" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      number: '85%',
      label: 'Success Rate',
      description: 'Job placement',
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const features = [
    {
      icon: <Heart className="h-16 w-16" />,
      title: "Authentic",
      description: "The genuine place where 18M students get real guidance, inspiration, and connections straight from industry professionals.",
      gradient: "from-pink-500 via-rose-500 to-red-500",
      benefits: ['Real company reviews', 'Verified employer profiles', 'Honest career advice']
    },
    {
      icon: <Target className="h-16 w-16" />,
      title: "Personalized", 
      description: "Built specifically for you with AI-powered recommendations from your school, industry experts, and 1M+ companies.",
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      benefits: ['Custom job matches', 'School-specific content', 'Industry insights']
    },
    {
      icon: <Rocket className="h-16 w-16" />,
      title: "Future-Ready",
      description: "The career platform designed for tomorrow with exclusive opportunities you won't find anywhere else.",
      gradient: "from-green-500 via-teal-500 to-blue-500",
      benefits: ['Exclusive job postings', 'Emerging industry roles', 'Future skill development']
    }
  ];

  const companies = [
    { name: 'Google', openJobs: 234, category: 'Tech' },
    { name: 'Microsoft', openJobs: 189, category: 'Tech' },
    { name: 'Apple', openJobs: 156, category: 'Tech' },
    { name: 'Amazon', openJobs: 312, category: 'Tech' },
    { name: 'Meta', openJobs: 98, category: 'Tech' },
    { name: 'Netflix', openJobs: 67, category: 'Media' },
    { name: 'Tesla', openJobs: 145, category: 'Automotive' },
    { name: 'Spotify', openJobs: 89, category: 'Tech' },
    { name: 'Adobe', openJobs: 123, category: 'Tech' },
    { name: 'Airbnb', openJobs: 78, category: 'Travel' },
    { name: 'Uber', openJobs: 167, category: 'Tech' },
    { name: 'LinkedIn', openJobs: 134, category: 'Tech' }
  ];

  const contentFeatures = [
    {
      title: "Career Discovery Hub",
      description: "Explore career paths through immersive content including industry insights, day-in-the-life videos, and career transition stories from real professionals.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
      icon: <BookIcon className="h-8 w-8" />,
      features: ['Interactive career quizzes', 'Industry trend reports', 'Salary benchmarking tools']
    },
    {
      title: "Smart Job Matching",
      description: "Our AI analyzes your profile, preferences, and career goals to deliver personalized job recommendations that align with your aspirations.",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop",
      icon: <Target className="h-8 w-8" />,
      features: ['AI-powered matching', 'Skill gap analysis', 'Application tracking']
    },
    {
      title: "Networking Events",
      description: "Connect with industry leaders through virtual career fairs, exclusive networking sessions, workshops, and mentorship programs.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
      icon: <CalendarIcon className="h-8 w-8" />,
      features: ['Virtual career fairs', 'One-on-one mentoring', 'Industry workshops']
    },
    {
      title: "Direct Recruiter Access",
      description: "Skip the resume black hole. Message directly with hiring managers and recruiters to get insider interview tips and accelerate your application process.",
      image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&h=400&fit=crop",
      icon: <MessageSquare className="h-8 w-8" />,
      features: ['Direct messaging', 'Interview prep sessions', 'Application feedback']
    }
  ];

  const resources = [
    {
      title: 'Resume Builder',
      description: 'Create professional resumes with industry-specific templates',
      icon: <FileText className="h-12 w-12" />,
      color: 'from-blue-500 to-cyan-500',
      features: ['ATS-optimized templates', 'Real-time feedback', 'Industry examples']
    },
    {
      title: 'Interview Prep',
      description: 'Practice with AI-powered mock interviews and get personalized feedback',
      icon: <Video className="h-12 w-12" />,
      color: 'from-purple-500 to-pink-500',
      features: ['Mock interviews', 'Question bank', 'Performance analytics']
    },
    {
      title: 'Skill Assessment',
      description: 'Identify your strengths and areas for improvement with detailed assessments',
      icon: <Award className="h-12 w-12" />,
      color: 'from-green-500 to-emerald-500',
      features: ['Technical skills tests', 'Soft skills evaluation', 'Learning recommendations']
    },
    {
      title: 'Salary Insights',
      description: 'Get real-time salary data and negotiation tips for your field',
      icon: <DollarSign className="h-12 w-12" />,
      color: 'from-orange-500 to-red-500',
      features: ['Market rate data', 'Negotiation scripts', 'Benefits comparison']
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineering Student",
      school: "MIT",
      quote: "Handshake connected me directly with a Google recruiter. The personalized job recommendations were spot-on, and I landed my dream internship within two weeks!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b278?w=150&h=150&fit=crop&crop=face",
      company: "Software Engineer Intern at Google",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Business Administration",
      school: "Stanford University", 
      quote: "The networking events on Handshake are incredible. I attended a virtual career fair and ended up with three interview offers. The platform truly opens doors.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      company: "Product Manager at Microsoft",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "International Student",
      school: "UC Berkeley",
      quote: "As an international student, visa sponsorship was crucial. Handshake's filters saved me countless hours by showing only visa-friendly employers. I found my job in 3 weeks!",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      company: "Data Scientist at Amazon",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "Marketing Student",
      school: "NYU",
      quote: "The career resources on Handshake are game-changing. From resume templates to interview prep, everything I needed was in one place. Got my offer from Meta!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      company: "Marketing Associate at Meta",
      rating: 5
    }
  ];

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      navigate('/register', { state: { email, type: 'student' } });
    }
  };

  const filteredCompanies = selectedMajor 
    ? companies.filter(company => company.category.toLowerCase().includes(selectedMajor.toLowerCase()))
    : companies;

  return (
    <div ref={containerRef} className="min-h-screen bg-white">
      {/* Enhanced Navigation Bar */}
      <nav className="fixed top-0 w-full backdrop-blur-xl z-50 bg-white/95 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-purple-600 transition-colors">
                CareerConnect
              </Link>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex text-wrap items-center space-x-1">
              <Link to="/whos-hiring" className="text-gray-700 hover:text-purple-600 font-medium transition-colors relative group">
                Who's hiring
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link to="/career-tips" className="text-gray-700 hover:text-purple-600 font-medium transition-colors relative group">
                Career tips
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link to="/login" className="px-6 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Sign in
              </Link>
              <Link to="/register" className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                Get Started
              </Link>
              <button className="flex items-center space-x-2 px-6 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors group">
                <Smartphone className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 min-h-screen flex items-center">
        {/* Enhanced Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Animated gradient orbs */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Curved Lines */}
          <svg className="absolute top-16 left-16 w-48 h-24 opacity-60" viewBox="0 0 200 100">
            <path d="M10 50 Q60 20 120 40 T200 30" stroke="#fbbf24" strokeWidth="3" fill="none" />
            <path d="M0 60 Q50 30 110 50 T190 40" stroke="#fbbf24" strokeWidth="2" fill="none" />
          </svg>
          <svg className="absolute top-32 right-16 w-64 h-48 opacity-60" viewBox="0 0 260 200">
            <path d="M260 30 Q220 70 160 50 T60 90" stroke="#fbbf24" strokeWidth="3" fill="none" />
            <path d="M250 50 Q210 90 150 70 T50 110" stroke="#fbbf24" strokeWidth="2" fill="none" />
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
            {/* Enhanced QR Code Badge */}
            <div className="mb-12">
              <div className="inline-flex items-center space-x-3 px-8 py-4 bg-yellow-400/10 backdrop-blur-sm rounded-full border border-yellow-400/20 hover:bg-yellow-400/20 transition-all cursor-pointer group">
                <QrCode className="h-6 w-6 text-yellow-400 group-hover:scale-110 transition-transform" />
                <span className="text-yellow-400 font-medium">Download mobile app with QR code</span>
                <ChevronRight className="h-4 w-4 text-yellow-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            {/* Enhanced Main Headline */}
            <div className="mb-12">
              <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black leading-none text-orange-500 mb-6 tracking-tight" 
                  style={{ 
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontWeight: 900,
                    letterSpacing: '-0.03em'
                  }}>
                Launch Your
              </h1>
              <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black leading-none text-orange-500 tracking-tight" 
                  style={{ 
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontWeight: 900,
                    letterSpacing: '-0.03em'
                  }}>
                Dream Career
              </h1>
            </div>
            
            {/* Enhanced Subtitle */}
            <p className="text-2xl md:text-3xl text-white/90 max-w-5xl mx-auto mb-8 leading-relaxed">
              Connect with 1M+ employers, discover exclusive opportunities, and build your professional network.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-16 text-white/80">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Free for students</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>500K+ exclusive jobs</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Direct recruiter access</span>
              </div>
            </div>

            {/* Enhanced Email Signup */}
            <div className="max-w-lg mx-auto mb-16">
              <form onSubmit={handleSignup} className="flex gap-4 p-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow">
                <input
                  type="email"
                  placeholder="Enter your .edu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-6 py-4 text-lg text-gray-900 placeholder-gray-500 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-transparent"
                  required
                />
                <button 
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Started
                </button>
              </form>
              <p className="text-white/60 text-sm mt-3">Join 18M+ students already on the platform</p>
            </div>
            
            {/* Enhanced QR Code Card */}
            <div className="absolute bottom-32 right-16 hidden xl:block">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all hover:scale-105 cursor-pointer group">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <QrCode className="h-20 w-20 text-gray-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-gray-800 font-bold text-lg">Download</p>
                  <p className="text-gray-800 font-bold text-lg">CareerConnect</p>
                  <p className="text-gray-500 text-sm mt-2">Scan to get the app</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Stats Section */}
      <section ref={statsRef} className="py-20 px-6 lg:px-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="stats-card text-center group">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-black text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-gray-700 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-500">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section ref={featuresRef} className="py-32 px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
              Why Students Choose
              <span className="text-orange-500"> CareerConnect</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              More than just a job board - it's your complete career development platform
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="feature-card group">
                <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-6 border border-gray-100 h-full">
                  <div className={`inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-br ${feature.gradient} mb-8 group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-black text-gray-900 mb-6 group-hover:text-purple-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center space-x-3 text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Companies Section */}
      <section ref={companiesRef} className="py-32 px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">
              <span className="text-orange-500">Top employers</span> are actively hiring
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connect directly with hiring managers from the world's most innovative companies
            </p>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {['All', 'Tech', 'Finance', 'Healthcare', 'Media', 'Consulting'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedMajor(category === 'All' ? '' : category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all ${
                    (category === 'All' && !selectedMajor) || selectedMajor === category
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredCompanies.slice(0, 12).map((company, index) => (
              <div key={index} className="company-logo group">
                <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 border border-gray-100">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {company.name.charAt(0)}
                  </div>
                  <p className="mt-4 text-gray-900 font-bold text-center group-hover:text-purple-600 transition-colors">{company.name}</p>
                  <div className="mt-2 text-center">
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {company.openJobs} jobs
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              variant="contained"
              size="large"
              className="px-12 py-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105"
              endIcon={<ArrowRight className="h-5 w-5" />}
            >
              View All Companies
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Content Features */}
      <section ref={contentRef} className="py-32 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">
              Everything you need to 
              <span className="text-orange-500"> succeed</span>
            </h2>
          </div>
          
          <div className="space-y-32">
            {contentFeatures.map((feature, index) => (
              <div key={index} className={`content-section grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 mb-8 shadow-lg`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-4xl font-black text-gray-900 mb-6">
                    {feature.title}
                  </h3>
                  
                  <p className="text-xl text-gray-600 leading-relaxed mb-8">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-4">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                        <span className="text-lg text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform"></div>
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="relative w-full h-96 object-cover rounded-3xl shadow-2xl group-hover:shadow-3xl transition-shadow"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Resources Section */}
      <section ref={resourcesRef} className="py-32 px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">
              <span className="text-orange-500">Career tools</span> that actually work
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From resume building to salary negotiation, we've got you covered
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resources.map((resource, index) => (
              <div key={index} className="resource-card group">
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-4 border border-gray-100 h-full">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${resource.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <div className="text-white">
                      {resource.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center group-hover:text-purple-600 transition-colors">
                    {resource.title}
                  </h3>
                  
                  <p className="text-gray-600 text-center mb-6">
                    {resource.description}
                  </p>
                  
                  <ul className="space-y-2 text-sm">
                    {resource.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-gray-600">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant="outlined" 
                    size="small" 
                    fullWidth 
                    className="mt-6 group-hover:bg-purple-600 group-hover:text-white transition-colors"
                  >
                    Try Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced App Demo Section */}
      <section ref={appDemoRef} className="py-32 px-6 lg:px-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
                Take your career
                <span className="text-orange-500"> everywhere</span>
              </h2>
              
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Never miss an opportunity with our mobile app. Get instant notifications, apply on-the-go, and stay connected with your network.
              </p>
              
              <div className="space-y-4 mb-12">
                {[
                  'Real-time job alerts',
                  'One-tap applications', 
                  'Mobile-optimized interviews',
                  'Offline access to saved jobs'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 text-white/90">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-105">
                  Download for iOS
                </Button>
                <Button className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-2xl backdrop-blur-sm border border-white/30 text-lg">
                  Download for Android
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="app-demo relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl transform rotate-6 scale-105 blur-xl opacity-70"></div>
                <div className="relative w-80 h-[640px] bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800">
                  {/* Phone notch */}
                  <div className="bg-gray-800 h-6 w-32 mx-auto rounded-b-2xl"></div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Good morning!</h3>
                        <p className="text-gray-600 text-sm">5 new opportunities await</p>
                      </div>
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                          <Bell className="h-5 w-5 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { company: 'Google', role: 'Software Engineer', time: '2h', match: '95%' },
                        { company: 'Microsoft', role: 'Product Manager', time: '1d', match: '89%' },
                        { company: 'Apple', role: 'UX Designer', time: '3d', match: '92%' },
                        { company: 'Meta', role: 'Data Scientist', time: '1w', match: '87%' }
                      ].map((job, i) => (
                        <div key={i} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                                {job.company.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-sm">{job.role}</h4>
                                <p className="text-gray-600 text-xs">{job.company} • {job.time} ago</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-green-600 font-bold text-xs">{job.match} match</div>
                              <Button size="small" className="mt-1 text-xs px-3 py-1">Apply</Button>
                            </div>
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

      {/* Enhanced Testimonials */}
      <section ref={testimonialsRef} className="py-32 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">
              Success stories from
              <span className="text-orange-500"> real students</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of students who've launched their careers with CareerConnect
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4 ring-4 ring-purple-200">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-purple-600 font-medium text-sm">{testimonial.role}</p>
                      <p className="text-gray-500 text-sm">{testimonial.school}</p>
                    </div>
                    <div className="ml-auto">
                      <div className="flex space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed italic mb-4">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-100 text-green-800 font-medium">
                      {testimonial.company}
                    </Badge>
                    <Button variant="text" size="small" className="text-purple-600 hover:text-purple-800">
                      Read full story
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Final CTA */}
      <section ref={ctaRef} className="py-32 px-6 lg:px-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-indigo-900/50"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-8 left-8 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute top-16 left-32 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-24 left-16 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute top-32 left-48 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute top-40 left-24 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-48 left-56 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute top-56 left-40 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute top-64 left-12 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-72 left-36 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute top-80 left-20 w-2 h-2 bg-white rounded-full"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-16 border border-white/20 shadow-2xl">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
              Ready to transform your
              <span className="text-orange-500"> career journey?</span>
            </h2>
            
            <p className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join 18M+ students who have found their dream jobs, internships, and career opportunities
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Button 
                onClick={() => navigate('/register')}
                className="px-12 py-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold rounded-2xl transition-all shadow-2xl hover:shadow-3xl text-xl transform hover:scale-105"
              >
                Start Free Today
              </Button>
              <Button className="px-12 py-6 bg-white/20 hover:bg-white/30 text-white font-bold rounded-2xl transition-colors backdrop-blur-sm border border-white/30 text-xl">
                Watch Demo
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-white/60 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Free forever for students</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>No hidden fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Setup in 2 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-24 px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CareerConnect</span>
              </div>
              <p className="text-gray-400 mb-6">
                Empowering the next generation of professionals to launch their dream careers.
              </p>
              <div className="flex space-x-4">
                {/* Social media icons would go here */}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white mb-6">For Students</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Find Jobs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Career Resources</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resume Builder</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Interview Prep</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Salary Insights</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white mb-6">For Employers</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Post Jobs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Find Talent</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Campus Recruiting</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Employer Branding</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Analytics</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                ©2025 CareerConnect. All rights reserved
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}