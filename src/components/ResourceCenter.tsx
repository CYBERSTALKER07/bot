import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
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
  AutoAwesome,
  LocalCafe,
  Favorite,
  Bolt,
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [bookmarkedResources, setBookmarkedResources] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Material Design entrance animations
      gsap.fromTo('.header-card', {
        opacity: 0,
        y: -30,
        scale: 0.98
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out'
      });

      gsap.fromTo('.stats-card', {
        opacity: 0,
        y: 20,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        delay: 0.2
      });

      gsap.fromTo('.resource-card', {
        opacity: 0,
        y: 30,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.4
      });

      // Floating decorations
      gsap.to('.resource-decoration', {
        y: -10,
        x: 5,
        rotation: 180,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

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
    <div ref={containerRef} className={`min-h-screen relative ${
      isDark ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      {/* Decorative elements */}
      <AutoAwesome className={`resource-decoration absolute top-20 right-20 h-5 w-5 ${
        isDark ? 'text-lime/50' : 'text-asu-gold/50'
      }`} />
      <LocalCafe className={`resource-decoration absolute top-40 left-20 h-4 w-4 ${
        isDark ? 'text-dark-accent/40' : 'text-asu-maroon/40'
      }`} />
      <Favorite className={`resource-decoration absolute bottom-32 right-1/3 h-4 w-4 ${
        isDark ? 'text-lime/60' : 'text-asu-gold/60'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Card className="header-card overflow-hidden mb-8" elevation={3}>
          <div className={`p-8 text-white relative ${
            isDark 
              ? 'bg-gradient-to-r from-dark-surface to-dark-bg' 
              : 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark'
          }`}>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl ${
              isDark ? 'bg-lime/10' : 'bg-white/10'
            }`}></div>
            <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full blur-xl ${
              isDark ? 'bg-dark-accent/20' : 'bg-asu-gold/20'
            }`}></div>
            
            <div className="relative z-10">
              <Typography variant="h3" className="font-bold mb-4 text-white">
                Resource Center
              </Typography>
              <Typography variant="subtitle1" className={`mb-6 max-w-3xl ${
                isDark ? 'text-dark-muted' : 'text-white/90'
              }`}>
                Comprehensive career resources to help you succeed in your professional journey
              </Typography>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <EmojiEvents className="h-5 w-5" />
                  <span>Expert-curated content</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <People className="h-5 w-5" />
                  <span>Trusted by thousands</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Star className="h-5 w-5" />
                  <span>Regularly updated</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {resourceStats.map((stat, index) => (
            <div key={index} className="stats-card">
              <StatsCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                subtitle={stat.subtitle}
                color={stat.color}
                trend={stat.trend}
                trendValue={stat.trendValue}
                delay={index * 0.1}
                rotation={index % 2 === 0 ? -0.5 : 0.5}
              />
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8" elevation={2}>
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
              <div className="flex items-center space-x-2">
                <FilterList className={`h-5 w-5 ${
                  isDark ? 'text-dark-muted' : 'text-gray-400'
                }`} />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                    isDark 
                      ? 'border-lime/20 bg-dark-bg text-dark-text focus:ring-lime' 
                      : 'border-gray-300 bg-white text-gray-900 focus:ring-asu-maroon'
                  }`}
                >
                  <option value="all">All Categories</option>
                  <option value="resume">Resume & CV</option>
                  <option value="interview">Interview Prep</option>
                  <option value="career_planning">Career Planning</option>
                  <option value="networking">Networking</option>
                </select>
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                  isDark 
                    ? 'border-lime/20 bg-dark-bg text-dark-text focus:ring-lime' 
                    : 'border-gray-300 bg-white text-gray-900 focus:ring-asu-maroon'
                }`}
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
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <Typography variant="body2" color="textSecondary">
            Showing {filteredResources.length} of {resources.length} resources
          </Typography>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="resource-card overflow-hidden hover:shadow-lg transition-shadow" elevation={2}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl ${getResourceTypeColor(resource.type)}`}>
                      {getResourceTypeIcon(resource.type)}
                    </div>
                    <Badge 
                      color={getResourceTypeBadgeColor(resource.type)}
                      variant="standard"
                      className="capitalize"
                    >
                      {resource.type}
                    </Badge>
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

                <Typography variant="h6" color="textPrimary" className="font-bold mb-3">
                  {resource.title}
                </Typography>
                
                <Typography variant="body2" color="textSecondary" className="mb-4 line-clamp-3">
                  {resource.description}
                </Typography>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge
                    variant="outlined"
                    color="primary"
                    className="capitalize"
                  >
                    {resource.category.replace('_', ' ')}
                  </Badge>
                  {resource.tags && resource.tags.slice(0, 2).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="standard"
                      color="secondary"
                      className="text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {resource.tags && resource.tags.length > 2 && (
                    <Badge
                      variant="standard"
                      color="secondary"
                      className="text-xs"
                    >
                      +{resource.tags.length - 2} more
                    </Badge>
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
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <Card className="p-12 text-center">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isDark ? 'bg-lime/20' : 'bg-asu-maroon/10'
            }`}>
              <Search className={`w-12 h-12 ${
                isDark ? 'text-lime' : 'text-asu-maroon'
              }`} />
            </div>
            <Typography variant="h5" color="textPrimary" className="font-bold mb-4">
              No resources found
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-6 max-w-md mx-auto">
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
        )}
      </div>
    </div>
  );
}

// Helper functions
const getResourceTypeColor = (type: string) => {
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

const getResourceTypeBadgeColor = (type: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' => {
  switch (type) {
    case 'article':
      return 'info';
    case 'video':
      return 'error';
    case 'template':
      return 'success';
    case 'guide':
      return 'secondary';
    case 'faq':
      return 'warning';
    default:
      return 'primary';
  }
};

const getResourceTypeIcon = (type: string) => {
  switch (type) {
    case 'article':
      return <Article className="h-4 w-4" />;
    case 'video':
      return <VideoLibrary className="h-4 w-4" />;
    case 'template':
      return <GetApp className="h-4 w-4" />;
    case 'guide':
      return <MenuBook className="h-4 w-4" />;
    case 'faq':
      return <HelpOutline className="h-4 w-4" />;
    default:
      return <Description className="h-4 w-4" />;
  }
};