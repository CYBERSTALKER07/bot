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
import { useTheme } from '../context/ThemeContext';

export default function ResourceCenter() {
  const { theme } = useTheme();
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
    if (theme === 'dark') {
      switch (type) {
        case 'article':
          return 'bg-blue-900 text-blue-300';
        case 'video':
          return 'bg-red-900 text-red-300';
        case 'template':
          return 'bg-green-900 text-green-300';
        case 'guide':
          return 'bg-purple-900 text-purple-300';
        case 'faq':
          return 'bg-yellow-900 text-yellow-300';
        default:
          return 'bg-gray-700 text-gray-300';
      }
    } else {
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
    }
  };

  const getCategoryColor = (category: string) => {
    if (theme === 'dark') {
      switch (category) {
        case 'resume':
          return 'bg-blue-900 text-blue-300';
        case 'interview':
          return 'bg-green-900 text-green-300';
        case 'career_planning':
          return 'bg-purple-900 text-purple-300';
        case 'networking':
          return 'bg-pink-900 text-pink-300';
        default:
          return 'bg-gray-700 text-gray-300';
      }
    } else {
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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Decorative elements */}
      <div className="absolute top-16 right-24 w-4 h-4 bg-asu-gold/40 rounded-full"></div>
      <div className="absolute top-32 left-16 w-3 h-3 bg-asu-maroon/30 rounded-full"></div>
      <Sparkles className="absolute top-24 left-1/4 h-5 w-5 text-asu-gold/60" />
      <Coffee className="absolute bottom-32 right-1/4 h-4 w-4 text-asu-maroon/50" />
      <Heart className="absolute bottom-20 left-1/3 h-4 w-4 text-asu-gold/70" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
            Resource Center
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Comprehensive career resources to help you succeed
          </p>
        </div>

        {/* Search and Filters */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 mb-8`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-3 h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border ${
                  theme === 'dark' 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            <div className="flex gap-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`px-4 py-2 border ${
                  theme === 'dark' 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="all">All Categories</option>
                <option value="resume">Resume & CV</option>
                <option value="interview">Interview Prep</option>
                <option value="career_planning">Career Planning</option>
                <option value="networking">Networking</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`px-4 py-2 border ${
                  theme === 'dark' 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="all">All Types</option>
                <option value="article">Articles</option>
                <option value="video">Videos</option>
                <option value="template">Templates</option>
                <option value="guide">Guides</option>
                <option value="faq">FAQs</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {filteredResources.length} of {resources.length} resources
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                      {getTypeIcon(resource.type)}
                    </div>
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(resource.type)}`}>
                        {formatType(resource.type)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBookmark(resource.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      bookmarkedResources.has(resource.id)
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Bookmark className={`h-5 w-5 ${bookmarkedResources.has(resource.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {resource.title}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4 line-clamp-3`}>
                  {resource.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(resource.category)}`}>
                    {resource.category.replace('_', ' ')}
                  </span>
                  {resource.tags && resource.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        theme === 'dark' 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                  {resource.tags && resource.tags.length > 2 && (
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      +{resource.tags.length - 2} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>145</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark' 
                        ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}>
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      {resource.type === 'video' ? 'Watch' : 'View'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            } flex items-center justify-center`}>
              <Search className={`h-8 w-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
            </div>
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
              No resources found
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}