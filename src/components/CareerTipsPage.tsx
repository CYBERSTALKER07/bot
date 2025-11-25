import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  GraduationCap,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Users,
  Briefcase,
  Heart,
  Star,
  Play,
  ExternalLink,
  ChevronDown,
  Tag,
  Eye,
  Coffee,
  Smartphone,
  Award,
  Globe,
  MessageSquare,
  FileText,
  Video,
  Mic,
  Camera,
  Bookmark,
  Share2,
  ThumbsUp,
  MessageCircle,
  Zap,
  Target,
  Lightbulb,
  CheckCircle,
  Download,
  BookmarkPlus,
  TrendingDown,
  BarChart3,
  Users2,
  Headphones,
  PenTool,
  Menu,
  X,
  Bell,
  Settings,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from 'lucide-react';

// Material Design UI Components
import { Card } from './ui/Card';
import Button from './ui/Button';
import Typography from './ui/Typography';
import Badge from './ui/Badge';
import Input from './ui/Input';
import Select from './ui/Select';

gsap.registerPlugin(ScrollTrigger);

export default function CareerTipsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest');
  const [bookmarkedArticles, setBookmarkedArticles] = useState<number[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedReadTime, setSelectedReadTime] = useState('all');
  const [showNewsletter, setShowNewsletter] = useState(false);
  
  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const articlesRef = useRef<HTMLDivElement>(null);
  const trendsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enhanced animations
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Hero animations with enhanced effects
      gsap.fromTo('.hero-content', {
        opacity: 0,
        y: 100,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.2
      });

      // Stats section animation with enhanced bounce effect
      gsap.fromTo('.stats-item', {
        opacity: 0,
        y: 50,
        scale: 0.8,
        rotation: -10
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      // Featured articles with enhanced stagger and parallax
      gsap.fromTo('.featured-article', {
        opacity: 0,
        y: 80,
        scale: 0.9,
        rotation: -2
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: featuredRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      // Category cards with wave animation
      gsap.fromTo('.category-card', {
        opacity: 0,
        y: 60,
        scale: 0.8,
        x: (index) => (index % 2 === 0 ? -30 : 30)
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        x: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        scrollTrigger: {
          trigger: categoriesRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });

      // Article cards with enhanced animation
      gsap.fromTo('.article-card', {
        opacity: 0,
        y: 40,
        scale: 0.95,
        filter: 'blur(5px)'
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.05,
        scrollTrigger: {
          trigger: articlesRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      });

      // Trends section with slide animation
      gsap.fromTo('.trend-item', {
        opacity: 0,
        x: -50,
        scale: 0.9
      }, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: trendsRef.current,
          start: 'top 80%',   
          toggleActions: 'play none none reverse'
        } 
      });

      // Floating animation for decorative elements
      gsap.to('.floating-element', {
        y: -20,
        x: 10,
        rotation: 5,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 1
      });

      // Parallax effect for hero background
      gsap.to('.hero-bg-element', {
        y: -100,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 2
      });

      // Magnetic effect for CTA buttons
      const buttons = document.querySelectorAll('.magnetic-button');
      buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
        });
        button.addEventListener('mouseleave', () => {
          gsap.to(button, { scale: 1, duration: 0.3, ease: 'power2.out' });
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    {
      number: '500+',
      label: 'Career Articles',
      description: 'Expert insights',
      icon: <BookOpen className="h-8 w-8" />,
      color: 'from-info-500 to-cyan-500'
    },
    {
      number: '2M+',
      label: 'Students Helped',
      description: 'Career success stories',
      icon: <Users className="h-8 w-8" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      number: '50+',
      label: 'Industry Experts',
      description: 'Professional contributors',
      icon: <Award className="h-8 w-8" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      number: '95%',
      label: 'Success Rate',
      description: 'Career goal achievement',
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const featuredArticles = [
    {
      id: 1,
      title: "The Complete Guide to Landing Your Dream Tech Job in 2025",
      excerpt: "Navigate the evolving tech landscape with insider tips from hiring managers at top companies. Learn the skills that matter most.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop",
      readTime: "12 min read",
      category: "Tech Careers",
      isVideo: false,
      featured: true,
      author: "Sarah Chen",
      authorRole: "Senior Tech Recruiter at Google",
      likes: 234,
      comments: 45,
      publishedDate: "2 days ago",
      trending: true
    },
    {
      id: 2,
      title: "Remote Work Mastery: Building Your Career from Anywhere",
      excerpt: "Master the art of remote work with strategies that help you stand out, stay productive, and advance your career.",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop",
      readTime: "8 min read",
      category: "Remote Work",
      isVideo: true,
      featured: true,
      author: "Marcus Johnson",
      authorRole: "Remote Work Consultant",
      likes: 189,
      comments: 32,
      publishedDate: "1 week ago",
      trending: false
    },
    {
      id: 3,
      title: "Salary Negotiation Secrets: Get Paid What You're Worth",
      excerpt: "Learn proven negotiation strategies that have helped thousands of professionals increase their salaries by 20-40%.",
      image: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&h=400&fit=crop",
      readTime: "15 min read",
      category: "Salary & Benefits",
      isVideo: false,
      featured: true,
      author: "Dr. Emily Rodriguez",
      authorRole: "Career Coach & Negotiation Expert",
      likes: 456,
      comments: 78,
      publishedDate: "3 days ago",
      trending: true
    }
  ];

  const categories = [
    { name: 'Interview Tips', count: 45, icon: MessageSquare, color: 'bg-info-100 text-info-800', gradient: 'from-info-500 to-cyan-500' },
    { name: 'Resume Writing', count: 38, icon: FileText, color: 'bg-green-100 text-green-800', gradient: 'from-green-500 to-emerald-500' },
    { name: 'Career Development', count: 52, icon: TrendingUp, color: 'bg-purple-100 text-purple-800', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Networking', count: 29, icon: Users2, color: 'bg-orange-100 text-orange-800', gradient: 'from-orange-500 to-red-500' },
    { name: 'Tech Careers', count: 41, icon: Zap, color: 'bg-indigo-100 text-indigo-800', gradient: 'from-indigo-500 to-purple-500' },
    { name: 'Remote Work', count: 33, icon: Globe, color: 'bg-teal-100 text-teal-800', gradient: 'from-teal-500 to-cyan-500' },
    { name: 'Salary & Benefits', count: 27, icon: Target, color: 'bg-pink-100 text-pink-800', gradient: 'from-pink-500 to-rose-500' },
    { name: 'Personal Branding', count: 24, icon: Star, color: 'bg-yellow-100 text-yellow-800', gradient: 'from-yellow-500 to-orange-500' },
    { name: 'Industry Insights', count: 36, icon: BarChart3, color: 'bg-cyan-100 text-cyan-800', gradient: 'from-cyan-500 to-info-500' },
    { name: 'Skill Development', count: 42, icon: PenTool, color: 'bg-lime-100 text-lime-800', gradient: 'from-lime-500 to-green-500' },
    { name: 'Work-Life Balance', count: 19, icon: Heart, color: 'bg-rose-100 text-rose-800', gradient: 'from-rose-500 to-pink-500' },
    { name: 'Leadership', count: 31, icon: Award, color: 'bg-amber-100 text-amber-800', gradient: 'from-amber-500 to-yellow-500' }
  ];

  const trendingTopics = [
    { name: 'AI in Career Development', growth: '+45%', articles: 12 },
    { name: 'Hybrid Work Strategies', growth: '+32%', articles: 18 },
    { name: 'Gen Z Career Expectations', growth: '+28%', articles: 9 },
    { name: 'Digital Marketing Skills', growth: '+24%', articles: 15 },
    { name: 'Sustainable Careers', growth: '+21%', articles: 7 }
  ];

  const allArticles = [
    {
      id: 4,
      title: "Building Your Personal Brand on LinkedIn: A Step-by-Step Guide",
      excerpt: "Transform your LinkedIn profile into a powerful career tool that attracts opportunities and builds meaningful connections.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop",
      readTime: "10 min read",
      category: "Personal Branding",
      isVideo: false,
      author: "Alex Kim",
      authorRole: "LinkedIn Strategy Expert",
      likes: 156,
      comments: 23,
      publishedDate: "1 day ago",
      trending: false
    },
    {
      id: 5,
      title: "The Future of Work: Skills You Need for 2025 and Beyond",
      excerpt: "Stay ahead of the curve with insights into emerging skills, industry trends, and the evolving job market landscape.",
      image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=200&fit=crop",
      readTime: "14 min read",
      category: "Skill Development",
      isVideo: true,
      author: "Dr. Patricia Wong",
      authorRole: "Future of Work Researcher",
      likes: 289,
      comments: 67,
      publishedDate: "4 days ago",
      trending: true
    },
    {
      id: 6,
      title: "Mastering Virtual Interviews: Tips from Top Recruiters",
      excerpt: "Excel in virtual interviews with insider tips on technology setup, body language, and making memorable impressions.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop",
      readTime: "7 min read",
      category: "Interview Tips",
      isVideo: true,
      author: "James Chen",
      authorRole: "Senior Recruiter at Meta",
      likes: 178,
      comments: 34,
      publishedDate: "5 days ago",
      trending: false
    },
    {
      id: 7,
      title: "Career Pivoting: How to Successfully Change Industries",
      excerpt: "Navigate career transitions with confidence. Learn strategies for transferring skills and making compelling cases to new employers.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=200&fit=crop",
      readTime: "11 min read",
      category: "Career Development",
      isVideo: false,
      author: "Maria Santos",
      authorRole: "Career Transition Coach",
      likes: 234,
      comments: 45,
      publishedDate: "1 week ago",
      trending: false
    },
    {
      id: 8,
      title: "Data Science Career Path: From Beginner to Expert",
      excerpt: "Complete roadmap for breaking into data science, including skills, projects, and networking strategies that work.",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=200&fit=crop",
      readTime: "16 min read",
      category: "Tech Careers",
      isVideo: false,
      author: "Dr. Raj Patel",
      authorRole: "Lead Data Scientist at Netflix",
      likes: 345,
      comments: 89,
      publishedDate: "2 weeks ago",
      trending: true
    },
    {
      id: 9,
      title: "Building Resilience: Overcoming Career Setbacks",
      excerpt: "Turn career challenges into growth opportunities with proven resilience strategies from successful professionals.",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=200&fit=crop",
      readTime: "9 min read",
      category: "Work-Life Balance",
      isVideo: false,
      author: "Lisa Thompson",
      authorRole: "Executive Coach",
      likes: 167,
      comments: 28,
      publishedDate: "3 days ago",
      trending: false
    }
  ];

  const filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      case 'popular':
        return b.likes - a.likes;
      case 'trending':
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      default:
        return 0;
    }
  });

  const toggleBookmark = (articleId: number) => {
    setBookmarkedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full backdrop-blur-sm z-50 bg-white/90 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-purple-600" />
              <span className="font-bold text-xl text-gray-900">
                AUTHandshake
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/for-students" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                For Students
              </Link>
              <Link to="/whos-hiring" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Who's hiring
              </Link>
              <Link to="/career-tips" className="text-purple-600 font-bold relative">
                Career tips
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600"></span>
              </Link>
              <Link to="/login" className="px-6 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Sign in
              </Link>
              <Link to="/register" className="magnetic-button px-8 py-3 bg-linear-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all duration-200 shadow-lg hover:shadow-xl">
                Get Started
              </Link>
            </div>

            {/* Mobile Avatar Button */}
            <div className="md:hidden">
              <button 
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                aria-expanded={showMobileMenu}
                aria-label="Toggle menu"
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-600/10 text-purple-600 flex items-center justify-center text-sm font-medium">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Backdrop */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setShowMobileMenu(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Left Sidebar */}
      <div
        className="fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 z-50 shadow-xl md:hidden"
        style={{
          transform: showMobileMenu ? 'translateX(0px)' : 'translateX(-100%)',
          transition: 'transform 300ms ease-out',
          willChange: 'transform'
        }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-6 w-6 text-purple-600" />
            <span className="font-semibold text-gray-900">Navigation</span>
          </div>
          <button
            onClick={() => setShowMobileMenu(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            <Link
              to="/for-students"
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-all duration-200 hover:translate-x-1"
            >
              <GraduationCap className="h-5 w-5" />
              <span className="font-medium">For Students</span>
            </Link>
            
            <Link
              to="/whos-hiring"
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-all duration-200 hover:translate-x-1"
            >
              <Building2 className="h-5 w-5" />
              <span className="font-medium">Who's Hiring</span>
            </Link>
            
            <Link
              to="/career-tips"
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center space-x-3 px-3 py-3 rounded-xl bg-purple-600/10 text-purple-600 shadow-xs"
            >
              <BookOpen className="h-5 w-5" />
              <span className="font-medium">Career Tips</span>
            </Link>
            
            <div className="border-t border-gray-200 mt-4 pt-4">
              <Link
                to="/login"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:translate-x-1"
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Sign In</span>
              </Link>
              
              <Link
                to="/register"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-xl bg-linear-to-r from-purple-600 to-purple-800 text-white shadow-xs mt-2 hover:from-purple-700 hover:to-purple-900 transition-all duration-200"
              >
                <span className="font-medium">Get Started</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Enhanced Hero Section with Advanced Search */}
      <section ref={heroRef} className="pt-32 pb-20 px-6 lg:px-8 bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
        {/* Enhanced floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-element hero-bg-element absolute top-20 left-20 w-6 h-6 bg-yellow-400 rounded-full opacity-60"></div>
          <div className="floating-element hero-bg-element absolute top-40 right-32 w-4 h-4 bg-pink-400 rounded-full opacity-40"></div>
          <div className="floating-element hero-bg-element absolute bottom-32 left-16 w-8 h-8 bg-cyan-400 rounded-full opacity-50"></div>
          <div className="floating-element hero-bg-element absolute top-60 right-20 w-3 h-3 bg-green-400 rounded-full opacity-30"></div>
          <div className="floating-element hero-bg-element absolute bottom-40 right-40 w-5 h-5 bg-purple-400 rounded-full opacity-45"></div>
          
          {/* Enhanced gradient orbs with animations */}
          <div className="hero-bg-element absolute top-10 right-10 w-80 h-80 bg-linear-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
          <div className="hero-bg-element absolute bottom-10 left-10 w-96 h-96 bg-linear-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
          <div className="hero-bg-element absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-linear-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="hero-content text-center mb-16">
            <div className="inline-flex items-center space-x-3 px-6 py-3 bg-yellow-400/10 backdrop-blur-sm rounded-full border border-yellow-400/20 mb-8">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Expert career guidance at your fingertips</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-orange-500 mb-8 tracking-tight"
                style={{ 
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 900,
                  letterSpacing: '-0.02em'
                }}>
              Career Hub
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-8">
              Your pathway to career success
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-white/80 max-w-4xl mx-auto mb-12 leading-relaxed">
              Discover expert insights, proven strategies, and actionable advice to accelerate your career growth
            </p>

            {/* Enhanced Search Bar with Advanced Filters */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6">
                <div className="flex flex-col lg:flex-row gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search career tips, interview advice, resume help..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="lg:w-64 px-4 py-4 border-0 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category.name} value={category.name}>
                        {category.name} ({category.count})
                      </option>
                    ))}
                  </select>
                  <button className="magnetic-button px-8 py-4 bg-linear-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl">
                    Search
                  </button>
                </div>

                {/* Advanced Filters Toggle */}
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-3">
                    {['Interview Tips', 'Resume Writing', 'Salary Negotiation', 'Remote Work', 'Career Change'].map((topic) => (
                      <button
                        key={topic}
                        onClick={() => setSelectedCategory(topic)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === topic 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Advanced</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Advanced Filters Panel */}
                {showAdvancedFilters && (
                  <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    <select
                      value={selectedReadTime}
                      onChange={(e) => setSelectedReadTime(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">Any Read Time</option>
                      {/* <option value="quick">Quick Read (&lt; 5 min)</option> */}
                      {/* <option value="medium">Medium Read (5-15 min)</option> */}
                      <option value="long">Long Read </option>
                    </select>
                    <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 px-6 lg:px-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="stats-item text-center group">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-r ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
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

      {/* Enhanced Featured Articles */}
      <section ref={featuredRef} className="py-32 px-6 lg:px-8 bg-linear-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">
              <span className="text-orange-500">Featured</span> career insights
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hand-picked articles from industry experts to accelerate your career growth
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <div key={article.id} className={`featured-article group ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-4 border border-gray-100 overflow-hidden h-full">
                  <div className="relative overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${index === 0 ? 'h-80' : 'h-48'}`}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className={`${categories.find(cat => cat.name === article.category)?.color || 'bg-gray-100 text-gray-800'}`}>
                        {article.category.toUpperCase()}
                      </Badge>
                      {article.trending && (
                        <Badge className="bg-red-100 text-red-800">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          TRENDING
                        </Badge>
                      )}
                    </div>
                    
                    <div className="absolute top-4 right-4 flex gap-2">
                      {article.isVideo && (
                        <div className="p-2 bg-white/90 backdrop-blur-sm rounded-full">
                          <Play className="h-5 w-5 text-purple-600" />
                        </div>
                      )}
                      <button
                        onClick={() => toggleBookmark(article.id)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        {bookmarkedArticles.includes(article.id) ? (
                          <Bookmark className="h-5 w-5 text-purple-600 fill-current" />
                        ) : (
                          <BookmarkPlus className="h-5 w-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className={`p-6 ${index === 0 ? 'lg:p-8' : ''}`}>
                    <h3 className={`font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors line-clamp-2 ${index === 0 ? 'text-2xl lg:text-3xl' : 'text-xl'}`}>
                      {article.title}
                    </h3>
                    <p className={`text-gray-600 mb-6 line-clamp-3 ${index === 0 ? 'text-lg' : ''}`}>
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-linear-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {article.author.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{article.author}</p>
                          <p className="text-xs text-gray-500">{article.authorRole}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{article.readTime}</span>
                        </div>
                        <p className="text-xs text-gray-400">{article.publishedDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{article.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{article.comments}</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        endIcon={<ArrowRight className="h-4 w-4" />}
                        className="text-purple-600 hover:text-purple-700 font-semibold"
                      >
                        Read More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section ref={categoriesRef} className="py-32 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">
              Explore by <span className="text-orange-500">category</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find career advice tailored to your specific needs and career stage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="category-card group cursor-pointer">
                  <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-4 border border-gray-100 h-full">
                    <div className={`w-20 h-20 bg-linear-to-br ${category.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-purple-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-center text-gray-600 mb-6">
                      {category.count} expert articles
                    </p>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      fullWidth
                      className="group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all"
                    >
                      Explore Category
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending Topics Sidebar */}
      <section ref={trendsRef} className="py-32 px-6 lg:px-8 bg-linear-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                <h2 className="text-4xl font-black text-gray-900">
                  Latest <span className="text-orange-500">articles</span>
                </h2>
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="trending">Trending</option>
                  </select>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                    >
                      <BarChart3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {sortedArticles.map((article, index) => (
                  <div key={article.id} className="article-card group">
                    <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 overflow-hidden">
                      {viewMode === 'grid' ? (
                        <>
                          <div className="relative overflow-hidden">
                            <img 
                              src={article.image} 
                              alt={article.title}
                              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                            />  
                            <div className="absolute top-4 left-4">
                              <Badge className={`${categories.find(cat => cat.name === article.category)?.color || 'bg-gray-100 text-gray-800'} text-xs`}>
                                {article.category.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="absolute top-4 right-4 flex gap-2">
                              {article.isVideo && (
                                <div className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full">
                                  <Play className="h-4 w-4 text-purple-600" />
                                </div>
                              )}
                              {article.trending && (
                                <div className="p-1.5 bg-red-100 rounded-full">
                                  <TrendingUp className="h-4 w-4 text-red-600" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {article.excerpt}
                            </p>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-linear-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {article.author.charAt(0)}
                                </div>
                                <span className="text-sm font-medium text-gray-700">{article.author}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span>{article.readTime}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <ThumbsUp className="h-4 w-4" />
                                  <span>{article.likes}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{article.comments}</span>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                endIcon={<ArrowRight className="h-4 w-4" />}
                                className="text-purple-600 hover:text-purple-700"
                              >
                                Read
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="p-6 flex items-center space-x-6">
                          <img 
                            src={article.image} 
                            alt={article.title}
                            className="w-32 h-24 object-cover rounded-xl shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={`${categories.find(cat => cat.name === article.category)?.color || 'bg-gray-100 text-gray-800'} text-xs`}>
                                {article.category}
                              </Badge>
                              {article.trending && (
                                <Badge className="bg-red-100 text-red-800 text-xs">
                                  TRENDING
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {article.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>{article.author}</span>
                                <span>•</span>
                                <span>{article.readTime}</span>
                                <span>•</span>
                                <span>{article.publishedDate}</span>
                              </div>
                              <Button variant="ghost" size="small" className="text-purple-600">
                                Read
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-16">
                <Button 
                  variant="contained" 
                  size="large"
                  className="px-12 py-4 bg-linear-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  Load More Articles
                </Button>
              </div>
            </div>

            {/* Trending Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-32">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <TrendingUp className="h-6 w-6 text-orange-500 mr-3" />
                  Trending Topics
                </h3>
                <div className="space-y-6">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="trend-item group cursor-pointer">
                      <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-purple-50 transition-colors">
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {topic.name}
                          </h4>
                          <p className="text-sm text-gray-500">{topic.articles} articles</p>
                        </div>
                        <div className="text-right">
                          <div className="text-green-600 font-bold text-sm">{topic.growth}</div>
                          <TrendingUp className="h-4 w-4 text-green-600 ml-auto mt-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4">Popular Resources</h4>
                  <div className="space-y-3">
                    {[
                      { title: 'Resume Templates', icon: FileText },
                      { title: 'Interview Guide', icon: MessageSquare },
                      { title: 'Salary Calculator', icon: Target },
                      { title: 'Career Assessment', icon: Award }
                    ].map((resource, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer group">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                          <resource.icon className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
                          {resource.title}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 ml-auto group-hover:text-purple-600 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Newsletter CTA with Modal */}
      <section className="py-32 px-6 lg:px-8 bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-purple-900/50 to-indigo-900/50"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-8 left-8 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-16 left-32 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-24 left-16 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-2000"></div>
          <div className="absolute top-32 right-16 w-2 h-2 bg-white rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-white rounded-full animate-pulse delay-1500"></div>
          <div className="absolute bottom-16 left-24 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-3000"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-16 border border-white/20 shadow-2xl">
            <div className="w-24 h-24 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl hover:scale-110 transition-transform duration-300">
              <Mail className="h-12 w-12 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-8">
              Never miss a career opportunity
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Get weekly career insights, job search strategies, and expert advice delivered straight to your inbox
            </p>
            
            <div className="max-w-lg mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/20 backdrop-blur-sm rounded-2xl">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 text-lg text-white placeholder-white/60 border-0 bg-transparent rounded-xl focus:outline-hidden focus:ring-2 focus:ring-white/30"
                />
                <button className="magnetic-button px-8 py-4 bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold rounded-xl transition-all shadow-lg hover:shadow-xl">
                  Subscribe
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white/60 text-sm">
              <div className="flex flex-col items-center space-y-2">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span>Weekly career tips</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span>Job market insights</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span>Expert interviews</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span>Unsubscribe anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer with Social Links */}
      <footer className="py-24 px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-xl bg-linear-to-br from-purple-600 to-purple-800">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CareerConnect</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Empowering the next generation of professionals with expert career guidance and opportunities.
              </p>
              
              {/* Social Media Links */}
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors">
                  <Facebook className="h-5 w-5 text-white" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors">
                  <Twitter className="h-5 w-5 text-white" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors">
                  <Linkedin className="h-5 w-5 text-white" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors">
                  <Instagram className="h-5 w-5 text-white" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors">
                  <Youtube className="h-5 w-5 text-white" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Career Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Resume Writing</span>
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Interview Preparation</span>
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Salary Negotiation</span>
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Career Development</span>
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Industry Insights</span>
                </a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Popular Categories</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tech Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Remote Work</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Personal Branding</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Leadership</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Networking</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Contact Info</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>hello@careerconnect.com</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>San Francisco, CA</span>
                </li>
              </ul>
              
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-white mb-3">Quick Newsletter Signup</h4>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                ©2025 CareerConnect. All rights reserved
              </p>
              <div className="flex flex-wrap gap-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Accessibility</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}