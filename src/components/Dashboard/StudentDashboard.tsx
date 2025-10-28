import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search,
  TrendingUp,
  MapPin,
  Clock,
  Building2,
  Briefcase,
  Calendar,
  BookOpen,
  Users,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  MoreHorizontal,
  Sparkles,
  ChevronRight,
  Star,
  Menu,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useJobs } from '../../hooks/useJobs';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card } from '../ui/Card';
import PageLayout from '../ui/PageLayout';
import { cn } from '../../lib/cva';

export default function StudentDashboard() {
  const { jobs, loading, error } = useJobs();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    trending: false,
    suggestions: false,
    actions: false
  });

  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .slice(0, 6);

  // Mock trending topics and suggestions
  const trendingTopics = [
    { tag: '#TechJobs', posts: '45.2K posts' },
    { tag: '#RemoteWork', posts: '32.1K posts' },
    { tag: '#Internships', posts: '28.5K posts' },
    { tag: '#CareerTips', posts: '19.8K posts' },
    { tag: '#Networking', posts: '15.3K posts' }
  ];

  const suggestedUsers = [
    { name: 'Career Coach Pro', handle: '@careercoach', verified: true },
    { name: 'Tech Recruiter', handle: '@techrecruiter', verified: false },
    { name: 'Industry Insider', handle: '@industryexpert', verified: true }
  ];

  const recentActivity = [
    { type: 'application', company: 'Google', position: 'Software Engineer', time: '2h' },
    { type: 'saved', company: 'Microsoft', position: 'Product Manager', time: '5h' },
    { type: 'viewed', company: 'Apple', position: 'UX Designer', time: '1d' }
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMobileSidebar) {
        const sidebar = document.getElementById('mobile-sidebar');
        if (sidebar && !sidebar.contains(event.target as Node)) {
          setShowMobileSidebar(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileSidebar]);

  if (loading) {
    return (
      <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'}>
        <div className="flex justify-center items-center h-screen">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
            isDark ? 'border-white' : 'border-black'
          }`}></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}
      maxWidth="full"
      padding="none"
    >
      {/* Mobile Header with Menu Button */}
      <div className={cn(
        'sticky top-0 z-50 backdrop-blur-xl border-b lg:hidden ios-header-safe',
        isDark ? 'bg-black/95 border-gray-800' : 'bg-white/95 border-gray-200'
      )}>
        <div className="flex items-center justify-between px-4 py-3 ios-nav-spacing">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 ios-touch-target"
              onClick={() => setShowMobileSidebar(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Dashboard</h1>
              <p className={cn(
                'text-xs sm:text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                Your career hub
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="p-2 ios-touch-target">
            <Sparkles className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileSidebar(false)} />
          <div 
            id="mobile-sidebar"
            className={cn(
              'fixed left-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto ios-sidebar-fix ios-safe-area',
              isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200',
              'border-r shadow-xl'
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 ios-touch-target"
                onClick={() => setShowMobileSidebar(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Mobile Search */}
              <div className={cn(
                'p-3 rounded-2xl',
                isDark ? 'bg-black' : 'bg-gray-100'
              )}>
                <div className="relative">
                  <Search className={cn(
                    'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5',
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  )} />
                  <input
                    type="text"
                    placeholder="Search jobs, companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={cn(
                      'w-full pl-12 pr-4 py-3 rounded-2xl bg-transparent border-none outline-none',
                      isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
                    )}
                  />
                </div>
              </div>

              {/* Mobile Quick Actions */}
              <div className={cn(
                'rounded-2xl p-4',
                isDark ? 'bg-black' : 'bg-gray-100'
              )}>
                <button
                  className="flex items-center justify-between w-full mb-3 ios-nav-item"
                  onClick={() => toggleSection('actions')}
                >
                  <h2 className="text-lg font-bold">Quick Actions</h2>
                  {expandedSections.actions ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                {expandedSections.actions && (
                  <div className="space-y-2">
                    <Link 
                      to="/applications" 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors ios-nav-item"
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      <Briefcase className="h-5 w-5 text-blue-500" />
                      <span>View Applications</span>
                    </Link>
                    <Link 
                      to="/events" 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors ios-nav-item"
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      <Calendar className="h-5 w-5 text-green-500" />
                      <span>Career Events</span>
                    </Link>
                    <Link 
                      to="/companies" 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors ios-nav-item"
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      <Building2 className="h-5 w-5 text-purple-500" />
                      <span>Browse Companies</span>
                    </Link>
                    <Link 
                      to="/resources" 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors ios-nav-item"
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      <BookOpen className="h-5 w-5 text-yellow-500" />
                      <span>Career Resources</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Trending Topics */}
              <div className={cn(
                'rounded-2xl p-4',
                isDark ? 'bg-black' : 'bg-gray-100'
              )}>
                <button
                  className="flex items-center justify-between w-full mb-3 ios-nav-item"
                  onClick={() => toggleSection('trending')}
                >
                  <h2 className="text-lg font-bold">What's Trending</h2>
                  {expandedSections.trending ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                {expandedSections.trending && (
                  <div className="space-y-3">
                    {trendingTopics.slice(0, 3).map((topic, index) => (
                      <div key={index} className="p-2 rounded-lg hover:bg-gray-500/10 cursor-pointer transition-colors">
                        <p className="font-bold text-sm">{topic.tag}</p>
                        <p className={cn(
                          'text-xs',
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        )}>
                          {topic.posts}
                        </p>
                      </div>
                    ))}
                    <Button 
                      variant="ghost" 
                      className="w-full text-blue-500 justify-start p-2 text-sm"
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      Show more trending
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile Who to Follow */}
              <div className={cn(
                'rounded-2xl p-4',
                isDark ? 'bg-black' : 'bg-gray-100'
              )}>
                <button
                  className="flex items-center justify-between w-full mb-3 ios-nav-item"
                  onClick={() => toggleSection('suggestions')}
                >
                  <h2 className="text-lg font-bold">Who to Follow</h2>
                  {expandedSections.suggestions ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                {expandedSections.suggestions && (
                  <div className="space-y-3">
                    {suggestedUsers.slice(0, 2).map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-2">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center',
                            isDark ? 'bg-gray-800' : 'bg-gray-200'
                          )}>
                            <span className="text-sm">👤</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1">
                              <p className="font-bold text-sm truncate">{user.name}</p>
                              {user.verified && (
                                <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </div>
                            <p className={cn(
                              'text-xs truncate',
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            )}>
                              {user.handle}
                            </p>
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-3 py-1 text-xs font-bold ml-2"
                        >
                          Follow
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="ghost" 
                      className="w-full text-blue-500 justify-start p-2 text-sm"
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      Show more suggestions
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex flex-col lg:flex-row max-w-7xl rounded-3xl border mx-auto">
        
        {/* Desktop Header - Hidden on Mobile */}
        <div className="hidden lg:flex flex-1 max-w-4xl mx-auto">
          <div className="w-full border rounded-3xl border-gray-800 dark:border-gray-800">
            {/* Desktop Header */}
            <div className={cn(
              'sticky top-0 z-10 backdrop-blur-xl border-b ',
              isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
            )}>
              <div className="flex items-center justify-between px-4 lg:px-6 py-3">
                <div>
                  <h1 className="text-xl font-bold">Dashboard</h1>
                  <p className={cn(
                    'text-sm',
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    Your career hub
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="p-2">
                  <Sparkles className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <MainContent 
              isDark={isDark}
              jobs={jobs}
              filteredJobs={filteredJobs}
              recentActivity={recentActivity}
            />
          </div>
        </div>

        {/* Mobile Main Content */}
        <div className="lg:hidden w-full">
          <MainContent 
            isDark={isDark}
            jobs={jobs}
            filteredJobs={filteredJobs}
            recentActivity={recentActivity}
          />
        </div>

        {/* Desktop Right Sidebar */}
        <div className="hidden lg:block w-80 xl:w-96 p-4 space-y-4">
          <DesktopSidebar 
            isDark={isDark}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            trendingTopics={trendingTopics}
            suggestedUsers={suggestedUsers}
          />
        </div>
      </div>
    </PageLayout>
  );
}

// Extracted Main Content Component for reusability
const MainContent = ({ isDark, jobs, filteredJobs, recentActivity }: {
  isDark: boolean;
  jobs: any[];
  filteredJobs: any[];
  recentActivity: any[];
}) => (
  <>
    {/* Quick Stats */}
    <div className={cn(
      'border rounded-bl-3xl rounded-br-3xl p-4 sm:p-6',
      isDark ? 'border-gray-800' : 'border-gray-200'
    )}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className={cn(
          'text-center p-3 sm:p-4 rounded-lg hover:bg-gray-50/5 transition-colors ios-touch-target',
          'min-h-[70px] sm:min-h-[80px] flex flex-col justify-center'
        )}>
          <div className="text-lg sm:text-2xl font-bold text-blue-500 mb-1">{jobs.length}</div>
          <div className={cn(
            'text-xs sm:text-sm',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            Available
          </div>
        </div>
        <div className={cn(
          'text-center p-3 sm:p-4 rounded-lg hover:bg-gray-50/5 transition-colors ios-touch-target',
          'min-h-[70px] sm:min-h-[80px] flex flex-col justify-center'
        )}>
          <div className="text-lg sm:text-2xl font-bold text-green-500 mb-1">7</div>
          <div className={cn(
            'text-xs sm:text-sm',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            Applied
          </div>
        </div>
        <div className={cn(
          'text-center p-3 sm:p-4 rounded-lg hover:bg-gray-50/5 transition-colors ios-touch-target',
          'min-h-[70px] sm:min-h-[80px] flex flex-col justify-center'
        )}>
          <div className="text-lg sm:text-2xl font-bold text-yellow-500 mb-1">3</div>
          <div className={cn(
            'text-xs sm:text-sm',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            Interviews
          </div>
        </div>
        <div className={cn(
          'text-center p-3 sm:p-4 rounded-lg hover:bg-gray-50/5 transition-colors ios-touch-target',
          'min-h-[70px] sm:min-h-[80px] flex flex-col justify-center'
        )}>
          <div className="text-lg sm:text-2xl font-bold text-red-500 mb-1">12</div>
          <div className={cn(
            'text-xs sm:text-sm',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            Saved
          </div>
        </div>
      </div>
    </div>

    {/* Recent Activity */}
    <div className={cn(
      'border-b rounded-bl-3xl rounded-br-3xl ',
      isDark ? 'border-gray-800' : 'border-gray-200'
    )}>
      <div className="p-4 sm:p-6 ">
        <h2 className="font-bold  text-lg sm:text-xl mb-4">Recent Activity</h2>
        <div className="space-y-3 sm:space-y-4">
          {recentActivity.map((activity, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={cn(
                  'w-2 h-2 rounded-full flex-shrink-0',
                  activity.type === 'application' ? 'bg-blue-500' :
                  activity.type === 'saved' ? 'bg-green-500' : 'bg-gray-500'
                )} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base truncate">
                    {activity.position} at {activity.company}
                  </p>
                  <p className={cn(
                    'text-xs sm:text-sm',
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {activity.type === 'application' ? 'Applied' :
                     activity.type === 'saved' ? 'Saved job' : 'Viewed'}
                  </p>
                </div>
              </div>
              <span className={cn(
                'text-xs sm:text-sm flex-shrink-0',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Recommended Jobs */}
    <div className="ios-bottom-safe">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg sm:text-xl">Recommended for You</h2>
          <Link 
            to="/jobs"  
            className="text-blue-500 hover:underline text-sm ios-touch-target"
          >
            View all
          </Link>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          {filteredJobs.map((job) => (
            <Card 
              key={job.id} 
              className={cn(
                'p-4 sm:p-6 transition-colors rounded-br-3xl rounded-bl-3xl cursor-pointer hover:bg-gray-50/5',
                isDark ? 'border-gray-800' : 'border-gray-200'
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 space-y-3 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base sm:text-lg mb-1 truncate">{job.title}</h3>
                  <p className="text-blue-500 font-medium mb-2 text-sm sm:text-base">{job.company}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{job.type}</span>
                    </div>
                    {job.salary_range && (
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="truncate">{job.salary_range}</span>
                      </div>
                    )}
                  </div>
                  <p className={cn(
                    'text-xs sm:text-sm line-clamp-2',
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  )}>
                    {job.description}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="self-start p-2 ios-touch-target">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center space-x-2 p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full ios-touch-target"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center space-x-2 p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full ios-touch-target"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outlined" 
                    size="sm" 
                    className="rounded-full border-gray-300 hover:bg-gray-100 flex-1 sm:flex-none ios-touch-target"
                  >
                    Save
                  </Button>
                  <Button 
                    className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-4 sm:px-6 flex-1 sm:flex-none ios-touch-target"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </>
);

// Extracted Desktop Sidebar Component
const DesktopSidebar = ({ isDark, searchTerm, setSearchTerm, trendingTopics, suggestedUsers }: {
  isDark: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  trendingTopics: any[];
  suggestedUsers: any[];
}) => (
  <>
    {/* Search */}
    <div className={cn(
      'sticky top-0 p-3 backdrop-blur-3xl rounded-3xl border border-gray-800',
      isDark ? 'bg-black' : 'bg-gray-100'
    )}>
      <div className="relative border-gray-800 border rounded-3xl">
        <Search className={cn(
          'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5',
          isDark ? 'text-gray-400' : 'text-gray-500'
        )} />
        <input
          type="text"
          placeholder="Search jobs, companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={cn(
            'w-full pl-12 pr-4 py-3 rounded-2xl bg-transparent border-none outline-none text-lg',
            isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
          )}
        />
      </div>
    </div>

    {/* Trending */}
    <div className={cn(
      'rounded-3xl p-4 border border-gray-800',
      isDark ? 'bg-black' : 'bg-gray-100'
    )}>
      <h2 className="text-xl font-bold mb-4">What's trending</h2>
      <div className="space-y-3">
        {trendingTopics.map((topic, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-500/10 cursor-pointer transition-colors">
            <div className="flex-1">
              <p className="font-bold">{topic.tag}</p>
              <p className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {topic.posts}
              </p>
            </div>
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </div>
        ))}
      </div>
      <Button variant="ghost" className="w-full mt-3 text-blue-500 justify-start p-2">
        Show more
      </Button>
    </div>

    {/* Who to follow */}
    <div className={cn(
      'rounded-3xl border border-gray-800 p-4',
      isDark ? 'bg-black' : 'bg-gray-100'
    )}>
      <h2 className="text-xl font-bold mb-4">Who to follow</h2>
      <div className="space-y-3">
        {suggestedUsers.map((user, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                isDark ? 'bg-gray-800' : 'bg-gray-200'
              )}>
                <span className="text-lg">👤</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <p className="font-bold text-sm truncate">{user.name}</p>
                  {user.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <p className={cn(
                  'text-sm truncate',
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {user.handle}
                </p>
              </div>
            </div>
            <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-4 py-1 text-sm font-bold">
              Follow
            </Button>
          </div>
        ))}
      </div>
      <Button variant="ghost" className="w-full mt-3 text-blue-500 justify-start p-2">
        Show more
      </Button>
    </div>

    {/* Quick Actions */}
    <div className={cn(
      'rounded-3xl border border-gray-800 p-4',
      isDark ? 'bg-black' : 'bg-gray-100'
    )}>
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="space-y-2">
        <Link to="/applications" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
          <Briefcase className="h-5 w-5 text-blue-500" />
          <span>View Applications</span>
        </Link>
        <Link to="/events" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
          <Calendar className="h-5 w-5 text-green-500" />
          <span>Career Events</span>
        </Link>
        <Link to="/companies" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
          <Building2 className="h-5 w-5 text-purple-500" />
          <span>Browse Companies</span>
        </Link>
        <Link to="/resources" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
          <BookOpen className="h-5 w-5 text-yellow-500" />
          <span>Career Resources</span>
        </Link>
      </div>
    </div>
  </>
);