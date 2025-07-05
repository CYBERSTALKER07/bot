import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Description, 
  VideoLibrary, 
  GetApp, 
  Search, 
  FilterList,
  Visibility,
  MenuBook,
  HelpOutline,
  Star,
  AccessTime,
  TrendingUp,
  People,
  EmojiEvents,
  Share,
  BookmarkAdd,
  Bookmark,
  OpenInNew,
  FileDownload,
  PlayCircle,
  Article,
  School
} from '@mui/icons-material';
import { Resource } from '../types';
import { useTheme } from '../context/ThemeContext';
import Typography from './ui/Typography';
import Button from './ui/Button';
import Input from './ui/Input';
import { Card, StatsCard } from './ui/Card';
import Badge from './ui/Badge';

export default function ResourceCenter() {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [bookmarkedResources, setBookmarkedResources] = useState<Set<string>>(new Set());

  // Mock resources data
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

  const resourceStats = [
    { 
      title: 'Total Resources', 
      value: resources.length.toString(), 
      subtitle: 'Available resources',
      icon: MenuBook,
      color: 'primary' as const,
      trend: 'up' as const,
      trendValue: 'Available resources'
    },
    { 
      title: 'Popular', 
      value: '4', 
      subtitle: 'Most viewed',
      icon: TrendingUp,
      color: 'success' as const,
      trend: 'up' as const,
      trendValue: 'Most viewed'
    },
    { 
      title: 'This Week', 
      value: '2', 
      subtitle: 'New additions',
      icon: AccessTime,
      color: 'info' as const,
      trend: 'up' as const,
      trendValue: 'New additions'
    },
    { 
      title: 'Downloads', 
      value: '1,247', 
      subtitle: 'Total downloads',
      icon: GetApp,
      color: 'warning' as const,
      trend: 'up' as const,
      trendValue: 'Total downloads'
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <Typography variant="h4" className="font-medium mb-2">
            Resource Center
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Comprehensive career resources to help you succeed in your professional journey.
          </Typography>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {resourceStats.map((stat, index) => (
            <Card key={index} className="p-6" elevation={1}>
              <div className="flex items-center">
                <div className={`p-3 rounded-xl ${
                  stat.color === 'primary' 
                    ? isDark ? 'bg-lime/10 text-lime' : 'bg-asu-maroon/10 text-asu-maroon'
                    : stat.color === 'success'
                    ? isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'
                    : stat.color === 'info'
                    ? isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                    : isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600'
                }`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <Typography variant="h5" className="font-semibold">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {stat.subtitle}
                  </Typography>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8" elevation={1}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startIcon={<Search />}
                variant="outlined"
                fullWidth
              />
            </div>
            <div className="flex gap-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  isDark 
                    ? 'border-gray-600 bg-dark-surface text-dark-text focus:ring-lime' 
                    : 'border-gray-300 bg-white text-gray-900 focus:ring-asu-maroon'
                }`}
              >
                <option value="all">All Categories</option>
                <option value="resume">Resume & Cover Letter</option>
                <option value="interview">Interview Prep</option>
                <option value="networking">Networking</option>
                <option value="career_planning">Career Planning</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  isDark 
                    ? 'border-gray-600 bg-dark-surface text-dark-text focus:ring-lime' 
                    : 'border-gray-300 bg-white text-gray-900 focus:ring-asu-maroon'
                }`}
              >
                <option value="all">All Types</option>
                <option value="article">Articles</option>
                <option value="video">Videos</option>
                <option value="template">Templates</option>
                <option value="guide">Guides</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <Typography variant="body2" color="textSecondary">
            Showing {filteredResources.length} of {resources.length} resources
          </Typography>
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <Card className="p-12 text-center" elevation={1}>
            <MenuBook className={`h-16 w-16 mx-auto mb-4 ${
              isDark ? 'text-dark-muted' : 'text-gray-400'
            }`} />
            <Typography variant="h6" className="mb-2">
              No resources found
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-4">
              Try adjusting your search criteria or check back later for new resources!
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="contained"
                color="primary"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setTypeFilter('all');
                }}
              >
                Clear Filters
              </Button>
              <Button 
                variant="outlined"
                color="primary"
              >
                Browse All Resources
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="p-6 hover:shadow-lg transition-shadow" elevation={1}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getResourceTypeColor(resource.type)}`}>
                    {getResourceTypeIcon(resource.type)}
                    <span className="capitalize">{resource.type}</span>
                  </div>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => toggleBookmark(resource.id)}
                    className="min-w-0 p-2"
                  >
                    {bookmarkedResources.has(resource.id) ? 
                      <Bookmark className={`h-5 w-5 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} /> : 
                      <BookmarkAdd className={`h-5 w-5 ${isDark ? 'text-dark-muted' : 'text-gray-400'}`} />
                    }
                  </Button>
                </div>

                <Typography variant="h6" className="font-medium mb-3">
                  {resource.title}
                </Typography>
                
                <Typography variant="body2" color="textSecondary" className="mb-4 line-clamp-3">
                  {resource.description}
                </Typography>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                    isDark ? 'bg-lime/10 text-lime' : 'bg-asu-maroon/10 text-asu-maroon'
                  }`}>
                    {resource.category.replace('_', ' ')}
                  </span>
                  {resource.tags && resource.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                  {resource.tags && resource.tags.length > 2 && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      +{resource.tags.length - 2} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <AccessTime className={`h-4 w-4 ${isDark ? 'text-dark-muted' : 'text-gray-400'}`} />
                      <Typography variant="caption" color="textSecondary">
                        {new Date(resource.created_at).toLocaleDateString()}
                      </Typography>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Visibility className={`h-4 w-4 ${isDark ? 'text-dark-muted' : 'text-gray-400'}`} />
                      <Typography variant="caption" color="textSecondary">
                        145
                      </Typography>
                    </div>
                  </div>
                  <Button
                    variant="text"
                    size="small"
                    className="min-w-0 p-2"
                  >
                    <Share className={`h-4 w-4 ${isDark ? 'text-dark-muted' : 'text-gray-400'}`} />
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    fullWidth
                    startIcon={resource.type === 'video' ? <PlayCircle /> : <FileDownload />}
                    component={Link}
                    to={`/resources/${resource.id}`}
                  >
                    {resource.type === 'video' ? 'Watch' : 'Download'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    endIcon={<OpenInNew />}
                    component={Link}
                    to={`/resources/${resource.id}`}
                  >
                    View
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions
const getResourceTypeColor = (type: string) => {
  switch (type) {
    case 'article': return 'bg-blue-100 text-blue-800';
    case 'video': return 'bg-red-100 text-red-800';
    case 'template': return 'bg-green-100 text-green-800';
    case 'guide': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getResourceTypeIcon = (type: string) => {
  switch (type) {
    case 'article': return <Article className="h-4 w-4" />;
    case 'video': return <VideoLibrary className="h-4 w-4" />;
    case 'template': return <GetApp className="h-4 w-4" />;
    case 'guide': return <MenuBook className="h-4 w-4" />;
    default: return <Description className="h-4 w-4" />;
  }
};