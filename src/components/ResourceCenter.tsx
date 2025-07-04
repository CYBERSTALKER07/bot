import React, { useState } from 'react';
import { 
  FileText, 
  Video, 
  Download, 
  Search, 
  Filter,
  Eye,
  BookOpen,
  HelpCircle,
  Star,
  Clock,
  TrendingUp,
  Users,
  Award,
  Sparkles,
  Coffee,
  Heart,
  Zap,
  Share2,
  Bookmark,
  BookmarkPlus
} from 'lucide-react';
import { Resource } from '../types';

export default function ResourceCenter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [bookmarkedResources, setBookmarkedResources] = useState<Set<string>>(new Set());

  // Mock resources data with enhanced content
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Ultimate Resume Template for Tech Students',
      description: 'A comprehensive, ATS-friendly resume template specifically designed for computer science and engineering students. Includes sections for projects, technical skills, and internships with examples.',
      type: 'template',
      category: 'resume',
      file_url: '/templates/tech-resume-template.pdf',
      author_id: 'admin-1',
      published: true,
      tags: ['resume', 'template', 'technology', 'students', 'ATS'],
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      title: 'How to Ace Your Technical Interview',
      description: 'Complete 50-page guide covering data structures, algorithms, system design, and behavioral questions. Includes 100+ practice problems with detailed solutions.',
      type: 'article',
      category: 'interview',
      content: 'Technical interviews can be challenging...',
      author_id: 'admin-2',
      published: true,
      tags: ['interview', 'technical', 'algorithms', 'preparation', 'coding'],
      created_at: '2024-01-20T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z'
    },
    {
      id: '3',
      title: 'Networking for Introverts: A Student\'s Guide',
      description: 'Practical strategies for building meaningful professional relationships. Features real student success stories and actionable networking scripts.',
      type: 'video',
      category: 'networking',
      file_url: 'https://youtube.com/watch?v=example',
      author_id: 'admin-3',
      published: true,
      tags: ['networking', 'career development', 'communication', 'introverts'],
      created_at: '2024-02-01T00:00:00Z',
      updated_at: '2024-02-01T00:00:00Z'
    },
    {
      id: '4',
      title: 'Cover Letter Templates by Industry',
      description: 'Professional cover letter templates tailored for 15+ industries including tech, finance, healthcare, and consulting. Includes customization tips.',
      type: 'template',
      category: 'resume',
      file_url: '/templates/cover-letter-templates.zip',
      author_id: 'admin-1',
      published: true,
      tags: ['cover letter', 'template', 'industry specific', 'professional'],
      created_at: '2024-02-05T00:00:00Z',
      updated_at: '2024-02-05T00:00:00Z'
    },
    {
      id: '5',
      title: 'Career Planning Roadmap for College Students',
      description: 'Step-by-step 4-year career planning guide from freshman to graduation. Includes timeline, action items, and milestone checkpoints.',
      type: 'guide',
      category: 'career_planning',
      content: 'Career planning is essential...',
      author_id: 'admin-2',
      published: true,
      tags: ['career planning', 'students', 'roadmap', 'timeline', 'goals'],
      created_at: '2024-02-10T00:00:00Z',
      updated_at: '2024-02-10T00:00:00Z'
    },
    {
      id: '6',
      title: 'Master Class: Salary Negotiation for New Grads',
      description: 'Learn how to negotiate your first job offer confidently. Includes scripts, research methods, and real negotiation examples.',
      type: 'video',
      category: 'career_planning',
      file_url: 'https://youtube.com/watch?v=salary-negotiation',
      author_id: 'admin-3',
      published: true,
      tags: ['salary', 'negotiation', 'new grad', 'job offer', 'compensation'],
      created_at: '2024-02-12T00:00:00Z',
      updated_at: '2024-02-12T00:00:00Z'
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter;
    const matchesType = typeFilter === 'all' || resource.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType && resource.published;
  });

  const toggleBookmark = (resourceId: string) => {
    setBookmarkedResources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId);
      } else {
        newSet.add(resourceId);
      }
      return newSet;
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'template':
        return <Download className="h-5 w-5" />;
      case 'guide':
        return <BookOpen className="h-5 w-5" />;
      case 'faq':
        return <HelpCircle className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article':
        return 'bg-blue-100 text-blue-800';
      case 'video':
        return 'bg-red-100 text-red-800';
      case 'template':
        return 'bg-green-100 text-green-800';
      case 'guide':
        return 'bg-purple-100 text-purple-800';
      case 'faq':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'resume':
        return 'bg-blue-50 text-blue-700';
      case 'interview':
        return 'bg-green-50 text-green-700';
      case 'career_planning':
        return 'bg-purple-50 text-purple-700';
      case 'networking':
        return 'bg-pink-50 text-pink-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const formatType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatCategory = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleResourceClick = (resource: Resource) => {
    if (resource.file_url) {
      if (resource.type === 'video') {
        window.open(resource.file_url, '_blank');
      } else {
        // For downloads, trigger download
        const link = document.createElement('a');
        link.href = resource.file_url;
        link.download = resource.title;
        link.click();
      }
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories 📋' },
    { value: 'resume', label: 'Resume & CV 📄' },
    { value: 'interview', label: 'Interview Prep 🎯' },
    { value: 'career_planning', label: 'Career Planning 🚀' },
    { value: 'networking', label: 'Networking 🤝' },
    { value: 'general', label: 'General 📚' }
  ];

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'article', label: 'Articles 📰' },
    { value: 'video', label: 'Videos 🎬' },
    { value: 'template', label: 'Templates 📋' },
    { value: 'guide', label: 'Guides 📖' },
    { value: 'faq', label: 'FAQs ❓' }
  ];

  const resourceStats = {
    total: resources.length,
    popular: 4,
    thisWeek: 2,
    downloads: 1247
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative">
      {/* Decorative elements */}
      <div className="absolute top-16 right-24 w-4 h-4 bg-asu-gold/40 rounded-full"></div>
      <div className="absolute top-32 left-16 w-3 h-3 bg-asu-maroon/30 rounded-full"></div>
      <Sparkles className="absolute top-24 left-1/4 h-5 w-5 text-asu-gold/60" />
      <Coffee className="absolute bottom-32 right-1/4 h-4 w-4 text-asu-maroon/50" />
      <Heart className="absolute bottom-20 left-1/3 h-4 w-4 text-asu-gold/70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="relative inline-block">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 relative">
              Resource Center 📚
              <div className="absolute -top-3 -right-8 w-6 h-6 bg-gradient-to-r from-asu-gold to-yellow-400 rounded-full"></div>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-asu-maroon to-asu-gold mx-auto mb-6 rounded-full"></div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Unlock your career potential with our curated collection of guides, templates, and expert resources 🚀
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Resources</p>
                <p className="text-3xl font-bold text-gray-900">{resourceStats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-blue-600 text-sm bg-blue-50 rounded-full px-3 py-1 w-fit">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>Always growing 📈</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Popular This Week</p>
                <p className="text-3xl font-bold text-gray-900">{resourceStats.popular}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-red-600 text-sm bg-red-50 rounded-full px-3 py-1 w-fit">
              <Zap className="h-4 w-4 mr-1" />
              <span>Trending 🔥</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">New This Week</p>
                <p className="text-3xl font-bold text-gray-900">{resourceStats.thisWeek}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600 text-sm bg-green-50 rounded-full px-3 py-1 w-fit">
              <Sparkles className="h-4 w-4 mr-1" />
              <span>Fresh content ✨</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Downloads</p>
                <p className="text-3xl font-bold text-gray-900">{resourceStats.downloads.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-purple-600 text-sm bg-purple-50 rounded-full px-3 py-1 w-fit">
              <Users className="h-4 w-4 mr-1" />
              <span>Students helped 🎉</span>
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-3xl p-8 mb-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                    🌟 Featured Resource
                  </div>
                  <div className="px-3 py-1 bg-asu-gold rounded-full text-asu-maroon text-sm font-bold">
                    Most Popular
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-3">Ultimate Resume Template for Tech Students</h2>
                <p className="text-gray-200 mb-6 text-lg leading-relaxed max-w-2xl">
                  Get started with our most popular resume template, specifically designed for ASU students in technology fields. 
                  Downloaded by 500+ students and proven to get interviews! ⚡
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-sm bg-white/10 rounded-full px-3 py-1">
                    <Download className="h-4 w-4" />
                    <span>500+ downloads</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm bg-white/10 rounded-full px-3 py-1">
                    <Star className="h-4 w-4" />
                    <span>4.9/5 rating</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm bg-white/10 rounded-full px-3 py-1">
                    <Users className="h-4 w-4" />
                    <span>ATS-friendly</span>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleResourceClick(resources[0])}
                    className="bg-white text-asu-maroon px-8 py-3 rounded-2xl hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download Template</span>
                  </button>
                  <button className="border-2 border-white text-white px-6 py-3 rounded-2xl hover:bg-white hover:text-asu-maroon transition-all duration-300 flex items-center space-x-2 font-semibold">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
              <div className="hidden lg:block ml-8">
                <div className="w-48 h-48 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <FileText className="h-24 w-24 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100 p-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for career resources... 🔍"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner transition-all duration-200 hover:shadow-md"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner cursor-pointer hover:shadow-md transition-all duration-200"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner cursor-pointer hover:shadow-md transition-all duration-200"
              >
                {types.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow overflow-hidden">
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-2xl ${getTypeColor(resource.type)}`}>
                      {getTypeIcon(resource.type)}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTypeColor(resource.type)}`}>
                      {formatType(resource.type)}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleBookmark(resource.id)}
                    className={`p-3 rounded-full transition-colors ${
                      bookmarkedResources.has(resource.id)
                        ? 'bg-asu-maroon text-white'
                        : 'bg-gray-100 text-gray-400 hover:text-asu-maroon'
                    }`}
                  >
                    {bookmarkedResources.has(resource.id) ? (
                      <Bookmark className="h-5 w-5" />
                    ) : (
                      <BookmarkPlus className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight hover:text-asu-maroon transition-colors cursor-pointer">
                  {resource.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                  {resource.description}
                </p>

                <div className="flex items-center justify-between mb-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(resource.category)}`}>
                    {formatCategory(resource.category)}
                  </span>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {resource.tags && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-full text-xs font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-200 cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                        +{resource.tags.length - 3} more ✨
                      </span>
                    )}
                  </div>
                )}

                <div className="flex space-x-3">
                  {resource.content ? (
                    <button className="flex-1 border-2 border-asu-maroon text-asu-maroon px-6 py-3 rounded-2xl hover:bg-asu-maroon hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-sm hover:shadow-md">
                      <Eye className="h-4 w-4" />
                      <span>Read Guide</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleResourceClick(resource)}
                      className="flex-1 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-md"
                    >
                      {resource.type === 'video' ? (
                        <>
                          <Video className="h-4 w-4" />
                          <span>Watch Video</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  )}
                  <button className="px-4 py-3 border border-gray-300 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No resources found</h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Try adjusting your search criteria or explore our featured resources! 🔍
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setTypeFilter('all');
                }}
                className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-8 py-4 rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold shadow-lg"
              >
                Clear Filters 🔄
              </button>
              <button className="border-2 border-asu-maroon text-asu-maroon px-8 py-4 rounded-2xl hover:bg-asu-maroon hover:text-white transition-all duration-300 font-semibold shadow-sm hover:shadow-md">
                Browse All Resources 📚
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}