import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Download, 
  ExternalLink, 
  Search, 
  Filter, 
  Star, 
  Heart, 
  Eye, 
  Clock, 
  User, 
  Calendar, 
  Tag, 
  TrendingUp, 
  Award, 
  FileText, 
  Video, 
  Headphones, 
  Image, 
  Coffee, 
  Sparkles, 
  Zap, 
  Target, 
  Bookmark, 
  Share2, 
  ThumbsUp, 
  MessageCircle,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  PenTool,
  Code,
  BarChart3,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Resource } from '../types';

export default function ResourceCenter() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [savedResources, setSavedResources] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Smooth entrance animation
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Mock resources data with enhanced content
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Complete Guide to Technical Interviews',
      description: 'Master data structures, algorithms, and system design questions with this comprehensive guide.',
      category: 'interview',
      type: 'guide',
      author: 'ASU Career Services',
      date: '2024-01-15',
      rating: 4.9,
      views: 1250,
      likes: 89,
      comments: 15,
      downloadUrl: '/resources/tech-interview-guide.pdf',
      tags: ['technical', 'algorithms', 'coding', 'preparation'],
      featured: true,
      duration: '45 min read'
    },
    {
      id: '2',
      title: 'Resume Templates for Computer Science Students',
      description: 'Professional resume templates specifically designed for CS students and new graduates.',
      category: 'resume',
      type: 'template',
      author: 'Design Team',
      date: '2024-01-12',
      rating: 4.7,
      views: 2100,
      likes: 156,
      comments: 23,
      downloadUrl: '/resources/cs-resume-templates.zip',
      tags: ['resume', 'template', 'design', 'computer science'],
      featured: false,
      duration: '10 min setup'
    },
    {
      id: '3',
      title: 'Salary Negotiation Workshop',
      description: 'Learn effective strategies for negotiating your first job offer and maximizing your compensation.',
      category: 'career',
      type: 'video',
      author: 'Sarah Johnson',
      date: '2024-01-10',
      rating: 4.8,
      views: 890,
      likes: 67,
      comments: 8,
      downloadUrl: '/resources/salary-negotiation-workshop.mp4',
      tags: ['salary', 'negotiation', 'career', 'tips'],
      featured: true,
      duration: '32 min video'
    },
    {
      id: '4',
      title: 'Industry Trends Report 2024',
      description: 'Comprehensive analysis of current tech industry trends and future opportunities.',
      category: 'industry',
      type: 'report',
      author: 'Research Team',
      date: '2024-01-08',
      rating: 4.6,
      views: 567,
      likes: 34,
      comments: 12,
      downloadUrl: '/resources/industry-trends-2024.pdf',
      tags: ['industry', 'trends', 'analysis', 'future'],
      featured: false,
      duration: '20 min read'
    },
    {
      id: '5',
      title: 'LinkedIn Profile Optimization',
      description: 'Step-by-step guide to creating a compelling LinkedIn profile that attracts recruiters.',
      category: 'networking',
      type: 'guide',
      author: 'Marketing Team',
      date: '2024-01-05',
      rating: 4.9,
      views: 1800,
      likes: 142,
      comments: 31,
      downloadUrl: '/resources/linkedin-optimization.pdf',
      tags: ['linkedin', 'networking', 'profile', 'social media'],
      featured: true,
      duration: '25 min read'
    },
    {
      id: '6',
      title: 'Mock Interview Practice Sessions',
      description: 'Audio recordings of common interview questions with expert feedback and tips.',
      category: 'interview',
      type: 'audio',
      author: 'Interview Coaches',
      date: '2024-01-03',
      rating: 4.7,
      views: 654,
      likes: 48,
      comments: 9,
      downloadUrl: '/resources/mock-interviews.zip',
      tags: ['interview', 'practice', 'audio', 'feedback'],
      featured: false,
      duration: '60 min audio'
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter;
    const matchesType = typeFilter === 'all' || resource.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const toggleSaved = (resourceId: string) => {
    setSavedResources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId);
      } else {
        newSet.add(resourceId);
      }
      return newSet;
    });
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'guide':
        return <BookOpen className="h-5 w-5" />;
      case 'template':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'audio':
        return <Headphones className="h-5 w-5" />;
      case 'report':
        return <BarChart3 className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'interview':
        return 'bg-blue-100 text-blue-800';
      case 'resume':
        return 'bg-green-100 text-green-800';
      case 'career':
        return 'bg-purple-100 text-purple-800';
      case 'industry':
        return 'bg-orange-100 text-orange-800';
      case 'networking':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: resources.length,
    saved: savedResources.size,
    featured: resources.filter(r => r.featured).length,
    downloads: resources.reduce((acc, r) => acc + r.views, 0)
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-white relative ${isLoaded ? 'animate-fade-in' : ''}`}>
      {/* Decorative elements */}
      <div className="absolute top-16 right-24 w-4 h-4 bg-asu-gold/40 rounded-full animate-float"></div>
      <div className="absolute top-32 left-16 w-3 h-3 bg-asu-maroon/30 rounded-full animate-float animate-delay-200"></div>
      <Sparkles className="absolute top-24 left-1/4 h-5 w-5 text-asu-gold/60 animate-bounce-gentle" />
      <Coffee className="absolute bottom-32 right-1/4 h-4 w-4 text-asu-maroon/50 animate-float animate-delay-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12 animate-slide-up">
          <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-3xl p-8 text-white relative overflow-hidden hover-glow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4 relative">
                Resource Center 📚
                <div className="absolute -top-3 -right-8 w-6 h-6 bg-asu-gold rounded-full animate-pulse-gentle"></div>
              </h1>
              <p className="text-xl text-white/90 mb-6 max-w-3xl">
                Your one-stop destination for career resources, guides, templates, and expert advice to accelerate your success! 🚀
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover-scale">
                  <BookOpen className="h-5 w-5" />
                  <span>{stats.total} resources available 📈</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover-scale">
                  <Download className="h-5 w-5" />
                  <span>{stats.downloads.toLocaleString()} downloads 🎯</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover-scale">
                  <Star className="h-5 w-5" />
                  <span>Expert-curated content 🌟</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 interactive-card animate-slide-up animate-delay-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Resources</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center icon-bounce">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-blue-600 text-sm bg-blue-50 rounded-full px-3 py-1 w-fit">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>Growing library 📚</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 interactive-card animate-slide-up animate-delay-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Saved Items</p>
                <p className="text-3xl font-bold text-gray-900">{stats.saved}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center icon-bounce">
                <Bookmark className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-red-600 text-sm bg-red-50 rounded-full px-3 py-1 w-fit">
              <Heart className="h-4 w-4 mr-1" />
              <span>Your favorites ❤️</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 interactive-card animate-slide-up animate-delay-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Featured</p>
                <p className="text-3xl font-bold text-gray-900">{stats.featured}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center icon-bounce">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-yellow-600 text-sm bg-yellow-50 rounded-full px-3 py-1 w-fit">
              <Sparkles className="h-4 w-4 mr-1" />
              <span>Must-read content ⭐</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 interactive-card animate-slide-up animate-delay-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Downloads</p>
                <p className="text-3xl font-bold text-gray-900">{Math.floor(stats.downloads / 1000)}K</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center icon-bounce">
                <Download className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600 text-sm bg-green-50 rounded-full px-3 py-1 w-fit">
              <Award className="h-4 w-4 mr-1" />
              <span>Popular resources 🔥</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100 p-8 mb-12 animate-slide-left">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources, guides, templates... 🔍"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner transition-all duration-200 hover:shadow-md input-focus"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner cursor-pointer hover:shadow-md transition-all duration-200 input-focus"
                >
                  <option value="all">All Categories 📋</option>
                  <option value="interview">Interview Prep 💼</option>
                  <option value="resume">Resume Building 📄</option>
                  <option value="career">Career Development 🚀</option>
                  <option value="industry">Industry Insights 📊</option>
                  <option value="networking">Networking 🤝</option>
                </select>
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner cursor-pointer hover:shadow-md transition-all duration-200 input-focus"
              >
                <option value="all">All Types</option>
                <option value="guide">Guides 📚</option>
                <option value="template">Templates 📋</option>
                <option value="video">Videos 🎥</option>
                <option value="audio">Audio 🎧</option>
                <option value="report">Reports 📊</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((resource, index) => (
            <div 
              key={resource.id} 
              className={`bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden interactive-card animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-asu-maroon to-asu-gold rounded-2xl flex items-center justify-center text-white shadow-lg">
                      {getResourceIcon(resource.type)}
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
                        {resource.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {resource.featured && (
                      <span className="bg-gradient-to-r from-asu-gold to-yellow-400 text-asu-maroon px-2 py-1 rounded-full text-xs font-bold animate-bounce-gentle">
                        ⭐ Featured
                      </span>
                    )}
                    <button
                      onClick={() => toggleSaved(resource.id)}
                      className={`p-2 rounded-full transition-all duration-200 ${
                        savedResources.has(resource.id)
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${savedResources.has(resource.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-asu-maroon transition-colors cursor-pointer">
                  {resource.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {resource.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{resource.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{resource.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{resource.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{resource.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{resource.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{resource.comments}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(resource.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-full text-xs font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-200 cursor-pointer hover-scale"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 interactive-button bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-4 py-3 rounded-2xl hover:shadow-lg font-semibold shadow-md flex items-center justify-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  
                  <button className="interactive-button border-2 border-asu-maroon text-asu-maroon px-4 py-3 rounded-2xl hover:bg-asu-maroon hover:text-white font-semibold shadow-sm hover:shadow-md flex items-center justify-center">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  
                  <button className="interactive-button border border-gray-300 text-gray-600 px-4 py-3 rounded-2xl hover:bg-gray-50 flex items-center justify-center">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100 animate-scale-in">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce-gentle">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No resources found</h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              {searchTerm || categoryFilter !== 'all' || typeFilter !== 'all' 
                ? "Try adjusting your search criteria to find relevant resources! 🔍"
                : "New resources are added regularly. Check back soon for more career-boosting content! 🚀"
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {(searchTerm || categoryFilter !== 'all' || typeFilter !== 'all') ? (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setTypeFilter('all');
                  }}
                  className="interactive-button bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-8 py-4 rounded-2xl hover:shadow-xl font-semibold shadow-lg"
                >
                  Clear Filters 🔄
                </button>
              ) : (
                <button className="interactive-button bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-8 py-4 rounded-2xl hover:shadow-xl font-semibold shadow-lg">
                  Request Resource 📝
                </button>
              )}
              <button className="interactive-button border-2 border-asu-maroon text-asu-maroon px-8 py-4 rounded-2xl hover:bg-asu-maroon hover:text-white font-semibold shadow-sm hover:shadow-md">
                Browse All Resources 📚
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}