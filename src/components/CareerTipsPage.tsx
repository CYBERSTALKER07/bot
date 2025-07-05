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
  Camera
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
  
  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const articlesRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enhanced animations
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo('.hero-content', {
        opacity: 0,
        y: 80,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.2
      });

      // Featured articles
      gsap.fromTo('.featured-article', {
        opacity: 0,
        y: 60,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: featuredRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      // Category cards
      gsap.fromTo('.category-card', {
        opacity: 0,
        y: 40,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: categoriesRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });

      // Article cards
      gsap.fromTo('.article-card', {
        opacity: 0,
        y: 30,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.05,
        scrollTrigger: {
          trigger: articlesRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const featuredArticles = [
    {
      id: 1,
      title: "Bringing more buzz to grad season—reliving our senior celebration pop-ups",
      excerpt: "This spring, class of '25 grads at Howard, SDSU, IU Bloomington, and more got free coffee on Handshake",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop",
      readTime: "2 min read",
      category: "Student Events",
      isVideo: false,
      featured: true
    },
    {
      id: 2,
      title: "How to secure the bag for your senior summer",
      excerpt: "You got your diploma, now it's time to get paid—get details on our class of '25 sweepstakes.",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop",
      readTime: "2 min read",
      category: "Using Handshake",
      isVideo: false,
      featured: true
    },
    {
      id: 3,
      title: "Mastercard's tips for making the most of your internship this summer",
      excerpt: "Get real-world tips on how to stand out, build connections, and set yourself up for future opportunities.",
      image: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&h=400&fit=crop",
      readTime: "2 min read",
      category: "Student Events",
      isVideo: false,
      featured: true
    }
  ];

  const categories = [
    { name: 'Student Events', count: 25, icon: Calendar, color: 'bg-purple-100 text-purple-800' },
    { name: 'Using Handshake', count: 18, icon: Smartphone, color: 'bg-blue-100 text-blue-800' },
    { name: 'Content and Community', count: 12, icon: Users, color: 'bg-green-100 text-green-800' },
    { name: 'Discovering Your Career', count: 22, icon: BookOpen, color: 'bg-orange-100 text-orange-800' },
    { name: 'Find a Job', count: 31, icon: Briefcase, color: 'bg-pink-100 text-pink-800' },
    { name: 'Get Hired Remotely', count: 15, icon: Globe, color: 'bg-indigo-100 text-indigo-800' },
    { name: 'Handshake Student Stories', count: 8, icon: Heart, color: 'bg-red-100 text-red-800' },
    { name: 'Interview Tips', count: 19, icon: MessageSquare, color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Job Roles', count: 35, icon: Award, color: 'bg-teal-100 text-teal-800' },
    { name: 'Life After Graduation', count: 14, icon: GraduationCap, color: 'bg-cyan-100 text-cyan-800' },
    { name: 'Resumes and Cover Letters', count: 16, icon: FileText, color: 'bg-lime-100 text-lime-800' },
    { name: 'The Internship Series', count: 11, icon: TrendingUp, color: 'bg-amber-100 text-amber-800' },
    { name: 'Videos', count: 7, icon: Video, color: 'bg-violet-100 text-violet-800' }
  ];

  const allArticles = [
    {
      id: 4,
      title: "Your profile, your story—now shareable with the world",
      excerpt: "Start building a better network by sharing your Handshake profile, all on your terms.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop",
      readTime: "4 min read",
      category: "Content and Community",
      isVideo: false
    },
    {
      id: 5,
      title: "Post about your internship to build your brand (and score brownie points)",
      excerpt: "Use Handshake to show future employers who you are, what you value, and where you're headed.",
      image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=200&fit=crop",
      readTime: "3 min read",
      category: "Content and Community",
      isVideo: false
    },
    {
      id: 6,
      title: "Real talk, real experts—check out Communities before they're gone",
      excerpt: "Introducing Handshake Communities. Find the one for you!",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop",
      readTime: "3 min read",
      category: "Content and Community",
      isVideo: false
    },
    {
      id: 7,
      title: "A product manager answers your burning questions about the career path",
      excerpt: "Get the inside scoop on what life's really like as a product manager in tech—and how to get hired.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=200&fit=crop",
      readTime: "1 min read",
      category: "Discovering Your Career",
      isVideo: false
    },
    {
      id: 8,
      title: "Activision Blizzard King's guide to leveling up your gaming career",
      excerpt: "Tips from the pros for scoring your dream career, no cheat codes required.",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=200&fit=crop",
      readTime: "2 min read",
      category: "Student Events",
      isVideo: false
    },
    {
      id: 9,
      title: "How your TikTok skills can get you hired",
      excerpt: "What are employers actually looking for when they ask for TikTok skills?",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=200&fit=crop",
      readTime: "3 min read",
      category: "Discovering Your Career",
      isVideo: false
    },
    {
      id: 10,
      title: "Your guide to getting hired this spring, even if you've been procrastinating",
      excerpt: "Handshake career experts share their pro tips for succeeding in the spring job search.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
      readTime: "2 min read",
      category: "Find a Job",
      isVideo: false
    },
    {
      id: 11,
      title: "Your guide to navigating the job search with a disability",
      excerpt: "Experts from Lime Connect share advice about handling disclosure, requesting accommodations, and more.",
      image: "https://images.unsplash.com/photo-1594824862107-962d29e2fc7b?w=400&h=200&fit=crop",
      readTime: "2 min read",
      category: "Find a Job",
      isVideo: false
    },
    {
      id: 12,
      title: "Average Data Analyst Salaries by Levels, Cities, & Career Opportunities (2024)",
      excerpt: "In the United States, data analysts enjoy a competitive average salary, reflecting the high demand and diverse opportunities.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
      readTime: "9 min read",
      category: "Find a Job",
      isVideo: false
    },
    {
      id: 13,
      title: "5 steps to success for your first 5 days on Handshake",
      excerpt: "A guide for your first days on Handshake that will help you get hired.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop",
      readTime: "4 min read",
      category: "Using Handshake",
      isVideo: false
    },
    {
      id: 14,
      title: "How to Use the STAR Method in an Interview",
      excerpt: "Learn how to use the STAR interview method in less than one minute!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
      readTime: "2 min read",
      category: "Interview Tips",
      isVideo: true
    },
    {
      id: 15,
      title: "How to prepare for an interview (steps & tips)",
      excerpt: "Get ready to ace your next job interview with these essential tips! Learn how to research the company and more.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=200&fit=crop",
      readTime: "5 min read",
      category: "Interview Tips",
      isVideo: false
    },
    {
      id: 16,
      title: "How to write an internship resume (+ an example)",
      excerpt: "Your resume is an important part of securing your dream internship. See how to write an amazing internship resume.",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=200&fit=crop",
      readTime: "8 min read",
      category: "The Internship Series",
      isVideo: false
    },
    {
      id: 17,
      title: "20 good skills to put on resume for new grads",
      excerpt: "Looking for the top skills to include on your resume as a new grad? This guide highlights 20 essential skills.",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=200&fit=crop",
      readTime: "11 min read",
      category: "Resumes and Cover Letters",
      isVideo: false
    },
    {
      id: 18,
      title: "How this student athlete builds his personal brand on Handshake",
      excerpt: "Content creator Giles Nitunga shares how he's making the job search journey less lonely on the Handshake feed.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop",
      readTime: "3 min read",
      category: "Handshake Student Stories",
      isVideo: false
    }
  ];

  const filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const topics = [
    'Interview Tips',
    'Resume Writing',
    'Job Search',
    'Career Development',
    'Networking',
    'Salary Negotiation',
    'Remote Work',
    'Internships',
    'Personal Branding',
    'Industry Insights'
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full backdrop-blur-xl z-50 bg-white/95 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <Link to="/" className="text-2xl font-bold text-gray-900">
                Handshake
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/whos-hiring" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Who's hiring
              </Link>
              <Link to="/career-tips" className="text-purple-600 font-bold">
                Career tips
              </Link>
              <Link to="/login" className="px-6 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Sign in
              </Link>
              <Link to="/register" className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all duration-200 shadow-lg hover:shadow-xl">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-6 lg:px-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="max-w-7xl mx-auto">
          <div className="hero-content text-center mb-16">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-orange-500 mb-8"
                style={{ 
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 900,
                  letterSpacing: '-0.02em'
                }}>
              Career tips
            </h1>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">
              Find the information you're looking for.
            </h2>
            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-12">
              Relevant to your career search, right now.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 p-3 bg-white rounded-2xl shadow-2xl">
                <Input
                  type="text"
                  placeholder="Search career tips..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 border-0 text-lg"
                  startIcon={<Search className="h-5 w-5 text-gray-400" />}
                />
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="md:w-64"
                >
                  <option value="all">All categories</option>
                  {categories.map(category => (
                    <option key={category.name} value={category.name}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section ref={featuredRef} className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <Card key={article.id} className={`featured-article group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
                <div className="relative overflow-hidden rounded-t-xl">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${index === 0 ? 'h-80' : 'h-48'}`}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${categories.find(cat => cat.name === article.category)?.color || 'bg-gray-100 text-gray-800'}`}>
                      {article.category.toUpperCase()}
                    </Badge>
                  </div>
                  {article.isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="p-4 bg-white/90 rounded-full">
                        <Play className="h-8 w-8 text-purple-600 ml-1" />
                      </div>
                    </div>
                  )}
                </div>
                <div className={`p-6 ${index === 0 ? 'lg:p-8' : ''}`}>
                  <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors ${index === 0 ? 'text-2xl lg:text-3xl' : 'text-xl'}`}>
                    {article.title}
                  </h3>
                  <p className={`text-gray-600 mb-4 ${index === 0 ? 'text-lg' : ''}`}>
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{article.readTime}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      endIcon={<ArrowRight className="h-4 w-4" />}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      Read More
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section ref={categoriesRef} className="py-24 px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Browse by <span className="text-orange-500">category</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find career advice tailored to your specific needs and interests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="category-card group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-purple-200 group-hover:to-purple-300 transition-all">
                      <IconComponent className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {category.count} articles
                    </p>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      className="group-hover:bg-purple-600 group-hover:text-white transition-colors"
                    >
                      Explore
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section ref={articlesRef} className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6 md:mb-0">
              Latest <span className="text-orange-500">articles</span>
            </h2>
            <div className="flex items-center space-x-4">
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-64"
              >
                <option value="all">All categories</option>
                {categories.map(category => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Select>
              <Button 
                variant="outlined" 
                startIcon={<Filter className="h-4 w-4" />}
              >
                Filter
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <Card key={article.id} className="article-card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative overflow-hidden rounded-t-xl">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${categories.find(cat => cat.name === article.category)?.color || 'bg-gray-100 text-gray-800'} text-xs`}>
                      {article.category.toUpperCase()}
                    </Badge>
                  </div>
                  {article.isVideo && (
                    <div className="absolute top-4 right-4">
                      <div className="p-2 bg-white/90 rounded-full">
                        <Play className="h-4 w-4 text-purple-600" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{article.readTime}</span>
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
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button 
              variant="contained" 
              size="large"
              className="px-12 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg"
            >
              Load more articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <Coffee className="h-10 w-10 text-white" />
            </div>
            
            <h2 className="text-4xl font-black text-white mb-6">
              Stay updated with the latest career tips
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get weekly insights, job search strategies, and career advice delivered to your inbox
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex gap-4 p-2 bg-white/20 backdrop-blur-sm rounded-2xl">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 text-lg text-white placeholder-white/60 border-0 bg-transparent rounded-xl focus:outline-none focus:ring-0"
                />
                <button className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Students</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Find your next job</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">How it works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Who's hiring</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Career tips</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Employers</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Hire top talent</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Solutions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Products</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Request demo</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Career centers</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support students</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Marketing toolkit</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resources</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Events</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Join us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                ©2024 Handshake. All rights reserved
              </p>
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