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
  Clock
} from 'lucide-react';
import { Resource } from '../types';

export default function ResourceCenter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock resources data
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Ultimate Resume Template for Tech Students',
      description: 'A comprehensive resume template specifically designed for computer science and engineering students. Includes sections for projects, technical skills, and internships.',
      type: 'template',
      category: 'resume',
      file_url: '/templates/tech-resume-template.pdf',
      author_id: 'admin-1',
      published: true,
      tags: ['resume', 'template', 'technology', 'students'],
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      title: 'How to Ace Your Technical Interview',
      description: 'Complete guide covering data structures, algorithms, system design, and behavioral questions commonly asked in tech interviews.',
      type: 'article',
      category: 'interview',
      content: 'Technical interviews can be challenging...',
      author_id: 'admin-2',
      published: true,
      tags: ['interview', 'technical', 'algorithms', 'preparation'],
      created_at: '2024-01-20T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z'
    },
    {
      id: '3',
      title: 'Networking for Introverts: A Student\'s Guide',
      description: 'Practical strategies for building professional relationships when you prefer smaller groups and meaningful conversations.',
      type: 'video',
      category: 'networking',
      file_url: 'https://youtube.com/watch?v=example',
      author_id: 'admin-3',
      published: true,
      tags: ['networking', 'career development', 'communication'],
      created_at: '2024-02-01T00:00:00Z',
      updated_at: '2024-02-01T00:00:00Z'
    },
    {
      id: '4',
      title: 'Cover Letter Templates by Industry',
      description: 'Professional cover letter templates tailored for different industries including tech, finance, healthcare, and consulting.',
      type: 'template',
      category: 'resume',
      file_url: '/templates/cover-letter-templates.zip',
      author_id: 'admin-1',
      published: true,
      tags: ['cover letter', 'template', 'industry specific'],
      created_at: '2024-02-05T00:00:00Z',
      updated_at: '2024-02-05T00:00:00Z'
    },
    {
      id: '5',
      title: 'Career Planning Roadmap for College Students',
      description: 'Step-by-step guide to planning your career from freshman year to graduation and beyond. Includes timeline and action items.',
      type: 'guide',
      category: 'career_planning',
      content: 'Career planning is essential...',
      author_id: 'admin-2',
      published: true,
      tags: ['career planning', 'students', 'roadmap', 'timeline'],
      created_at: '2024-02-10T00:00:00Z',
      updated_at: '2024-02-10T00:00:00Z'
    },
    {
      id: '6',
      title: 'Common Interview Questions and How to Answer Them',
      description: 'Frequently asked questions in job interviews with example answers and tips for crafting your own responses.',
      type: 'faq',
      category: 'interview',
      content: 'Q: Tell me about yourself...',
      author_id: 'admin-3',
      published: true,
      tags: ['interview', 'questions', 'answers', 'preparation'],
      created_at: '2024-02-15T00:00:00Z',
      updated_at: '2024-02-15T00:00:00Z'
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
    { value: 'all', label: 'All Categories' },
    { value: 'resume', label: 'Resume & CV' },
    { value: 'interview', label: 'Interview Prep' },
    { value: 'career_planning', label: 'Career Planning' },
    { value: 'networking', label: 'Networking' },
    { value: 'general', label: 'General' }
  ];

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'article', label: 'Articles' },
    { value: 'video', label: 'Videos' },
    { value: 'template', label: 'Templates' },
    { value: 'guide', label: 'Guides' },
    { value: 'faq', label: 'FAQs' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resource Center</h1>
        <p className="text-gray-600">Career guides, templates, and resources to help you succeed</p>
      </div>

      {/* Featured Section */}
      <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-lg p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Featured Resource</h2>
            <h3 className="text-xl mb-3">Ultimate Resume Template for Tech Students</h3>
            <p className="text-gray-200 mb-4">
              Get started with our most popular resume template, specifically designed for ASU students in technology fields.
            </p>
            <button
              onClick={() => handleResourceClick(resources[0])}
              className="bg-white text-asu-maroon px-6 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Template</span>
            </button>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
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
              className="px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                    {getTypeIcon(resource.type)}
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                      {formatType(resource.type)}
                    </span>
                  </div>
                </div>
                <Star className="h-5 w-5 text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{resource.description}</p>

              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm ${getCategoryColor(resource.category)}`}>
                  {formatCategory(resource.category)}
                </span>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {resource.tags && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                  {resource.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{resource.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="flex space-x-2">
                {resource.content ? (
                  <button className="flex-1 border border-asu-maroon text-asu-maroon px-4 py-2 rounded-md hover:bg-asu-maroon hover:text-white transition-colors flex items-center justify-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>Read</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleResourceClick(resource)}
                    className="flex-1 bg-asu-maroon text-white px-4 py-2 rounded-md hover:bg-asu-maroon-dark transition-colors flex items-center justify-center space-x-1"
                  >
                    {resource.type === 'video' ? (
                      <>
                        <Video className="h-4 w-4" />
                        <span>Watch</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters to find more resources
          </p>
        </div>
      )}
    </div>
  );
}