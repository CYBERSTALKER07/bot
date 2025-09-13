import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search,
  TrendingUp,
  Users,
  Briefcase,
  Eye,
  MessageCircle,
  Star,
  Plus,
  Filter,
  MoreHorizontal,
  Sparkles,
  Building2,
  Calendar,
  BookOpen,
  BarChart3,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import { cn } from '../../lib/cva';
import PageLayout from '../ui/PageLayout';

export default function EmployerDashboard() {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    skills: false,
    actions: false,
    tips: false
  });
  
  // Mock data
  const jobPostings = [
    { id: 1, title: 'Senior Software Engineer', applicants: 24, views: 156, posted: '2d', status: 'active' },
    { id: 2, title: 'Product Manager', applicants: 18, views: 89, posted: '5d', status: 'active' },
    { id: 3, title: 'UX Designer', applicants: 31, views: 203, posted: '1w', status: 'paused' },
  ];

  const recentApplicants = [
    { name: 'Sarah Johnson', position: 'Senior Software Engineer', time: '2h', rating: 4.8 },
    { name: 'Mike Chen', position: 'Product Manager', time: '4h', rating: 4.6 },
    { name: 'Emily Davis', position: 'UX Designer', time: '6h', rating: 4.9 },
  ];

  const metrics = [
    { label: 'Active Jobs', value: '8', change: '+2', color: 'text-blue-500' },
    { label: 'Total Applicants', value: '147', change: '+23', color: 'text-green-500' },
    { label: 'Interviews Scheduled', value: '12', change: '+5', color: 'text-yellow-500' },
    { label: 'Hired This Month', value: '3', change: '+1', color: 'text-purple-500' },
  ];

  const trendingSkills = [
    { skill: 'React', demand: '95%' },
    { skill: 'Python', demand: '88%' },
    { skill: 'AWS', demand: '76%' },
    { skill: 'TypeScript', demand: '72%' },
    { skill: 'Node.js', demand: '68%' },
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
              <h1 className="text-lg sm:text-xl font-bold">Employer Hub</h1>
              <p className={cn(
                'text-xs sm:text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                Manage your hiring pipeline
              </p>
            </div>
          </div>
          <Button 
            className={cn(
              'rounded-full px-3 sm:px-4 py-2 font-bold text-sm ios-touch-target',
              isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
            )}
            onClick={() => window.location.href = '/post-job'}
          >
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Post Job</span>
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
                isDark ? 'bg-gray-900' : 'bg-gray-100'
              )}>
                <div className="relative">
                  <Search className={cn(
                    'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5',
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  )} />
                  <input
                    type="text"
                    placeholder="Search candidates..."
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
                isDark ? 'bg-gray-900' : 'bg-gray-100'
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
                      to="/post-job" 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors ios-nav-item"
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      <Plus className="h-5 w-5 text-blue-500" />
                      <span>Post New Job</span>
                    </Link>
                    <Link 
                      to="/applicants" 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors ios-nav-item"
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      <Users className="h-5 w-5 text-green-500" />
                      <span>Review Applicants</span>
                    </Link>
                    <Link 
                      to="/linkedin-job-import" 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors ios-nav-item"
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      <Download className="h-5 w-5 text-blue-500" />
                      <span>Import LinkedIn Jobs</span>
                    </Link>
                    <Link 
                      to="/analytics" 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors ios-nav-item"
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      <BarChart3 className="h-5 w-5 text-purple-500" />
                      <span>View Analytics</span>
                    </Link>
                    <Link 
                      to="/messages" 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors ios-nav-item"
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      <MessageCircle className="h-5 w-5 text-yellow-500" />
                      <span>Messages</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Trending Skills */}
              <div className={cn(
                'rounded-2xl p-4',
                isDark ? 'bg-gray-900' : 'bg-gray-100'
              )}>
                <button
                  className="flex items-center justify-between w-full mb-3 ios-nav-item"
                  onClick={() => toggleSection('skills')}
                >
                  <h2 className="text-lg font-bold">Trending Skills</h2>
                  {expandedSections.skills ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                {expandedSections.skills && (
                  <div className="space-y-3">
                    {trendingSkills.slice(0, 3).map((skill, index) => (
                      <div key={index} className="p-2 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{skill.skill}</p>
                          <span className={cn(
                            'text-xs',
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          )}>
                            {skill.demand}
                          </span>
                        </div>
                        <div className={cn(
                          'h-2 w-full rounded-full overflow-hidden',
                          isDark ? 'bg-gray-700' : 'bg-gray-200'
                        )}>
                          <div 
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: skill.demand }}
                          />
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="ghost" 
                      className="w-full text-blue-500 justify-start p-2 text-sm"
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      View all skills
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile Hiring Tips */}
              <div className={cn(
                'rounded-2xl p-4',
                isDark ? 'bg-gray-900' : 'bg-gray-100'
              )}>
                <button
                  className="flex items-center justify-between w-full mb-3 ios-nav-item"
                  onClick={() => toggleSection('tips')}
                >
                  <h2 className="text-lg font-bold">Hiring Tips</h2>
                  {expandedSections.tips ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                {expandedSections.tips && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg hover:bg-gray-500/10 cursor-pointer transition-colors">
                      <p className="font-medium text-sm">Write clear job descriptions</p>
                      <p className={cn(
                        'text-xs mt-1',
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        Get 30% more applications
                      </p>
                    </div>
                    <div className="p-3 rounded-lg hover:bg-gray-500/10 cursor-pointer transition-colors">
                      <p className="font-medium text-sm">Respond quickly</p>
                      <p className={cn(
                        'text-xs mt-1',
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        Improve candidate experience
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        
        {/* Desktop Header - Hidden on Mobile */}
        <div className="hidden lg:flex flex-1 max-w-4xl mx-auto">
          <div className="w-full border-x border-gray-800 dark:border-gray-200">
            {/* Desktop Header */}
            <div className={cn(
              'sticky top-0 z-10 backdrop-blur-xl border-b',
              isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
            )}>
              <div className="flex items-center justify-between px-4 lg:px-6 py-3">
                <div>
                  <h1 className="text-xl font-bold">Employer Hub</h1>
                  <p className={cn(
                    'text-sm',
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    Manage your hiring pipeline
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="p-2">
                    <Sparkles className="h-5 w-5" />
                  </Button>
                  <Button 
                    className={cn(
                      'rounded-full px-4 py-2 font-bold',
                      isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                    )}
                    onClick={() => window.location.href = '/post-job'}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Post Job
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <MainContent 
              isDark={isDark}
              metrics={metrics}
              recentApplicants={recentApplicants}
              jobPostings={jobPostings}
            />
          </div>
        </div>

        {/* Mobile Main Content */}
        <div className="lg:hidden w-full">
          <MainContent 
            isDark={isDark}
            metrics={metrics}
            recentApplicants={recentApplicants}
            jobPostings={jobPostings}
          />
        </div>

        {/* Desktop Right Sidebar */}
        <div className="hidden lg:block w-80 xl:w-96 p-4 space-y-4">
          <DesktopSidebar 
            isDark={isDark}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            trendingSkills={trendingSkills}
          />
        </div>
      </div>
    </PageLayout>
  );
}

// Extracted Main Content Component for reusability
const MainContent = ({ isDark, metrics, recentApplicants, jobPostings }: {
  isDark: boolean;
  metrics: any[];
  recentApplicants: any[];
  jobPostings: any[];
}) => (
  <>
    {/* Metrics Overview */}
    <div className={cn(
      'border-b p-4 sm:p-6',
      isDark ? 'border-gray-800' : 'border-gray-200'
    )}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((metric, index) => (
          <div 
            key={index} 
            className={cn(
              'text-center p-3 sm:p-4 rounded-lg hover:bg-gray-50/5 transition-colors ios-touch-target',
              'min-h-[80px] sm:min-h-[90px] flex flex-col justify-center'
            )}
          >
            <div className={cn(
              'text-lg sm:text-2xl font-bold mb-1',
              metric.color
            )}>
              {metric.value}
            </div>
            <div className={cn(
              'text-xs sm:text-sm mb-1 line-clamp-2',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>
              {metric.label}
            </div>
            <div className="text-xs text-green-500">{metric.change}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Recent Applicants */}
    <div className={cn(
      'border-b',
      isDark ? 'border-gray-800' : 'border-gray-200'
    )}>
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg sm:text-xl">Recent Applicants</h2>
          <Link 
            to="/applicants" 
            className="text-blue-500 hover:underline text-sm ios-touch-target"
          >
            View all
          </Link>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {recentApplicants.map((applicant, index) => (
            <div 
              key={index} 
              className={cn(
                'flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg',
                'hover:bg-gray-50/5 transition-colors cursor-pointer space-y-3 sm:space-y-0'
              )}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={cn(
                  'w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0',
                  isDark ? 'bg-gray-800' : 'bg-gray-200'
                )}>
                  <span className="text-base sm:text-lg">👤</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base truncate">{applicant.name}</p>
                  <p className={cn(
                    'text-xs sm:text-sm truncate',
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    Applied for {applicant.position}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-yellow-500">{applicant.rating}</span>
                    </div>
                    <span className={cn(
                      'text-xs',
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      {applicant.time} ago
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 flex-shrink-0">
                <Button 
                  variant="outlined" 
                  size="sm" 
                  className="rounded-full text-sm flex-1 sm:flex-none ios-touch-target"
                >
                  View
                </Button>
                <Button 
                  className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-3 sm:px-4 text-sm flex-1 sm:flex-none ios-touch-target"
                >
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Job Postings */}
    <div className="ios-bottom-safe">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg sm:text-xl">Your Job Postings</h2>
          <Button variant="ghost" size="sm" className="p-2 ios-touch-target">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          {jobPostings.map((job) => (
            <Card 
              key={job.id} 
              className={cn(
                'p-4 sm:p-6 transition-colors cursor-pointer hover:bg-gray-50/5',
                isDark ? 'border-gray-800' : 'border-gray-200'
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 space-y-3 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                    <h3 className="font-bold text-base sm:text-lg truncate">{job.title}</h3>
                    <span className={cn(
                      'px-2 py-1 text-xs rounded-full font-medium self-start',
                      job.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    )}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{job.applicants} applicants</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{job.views} views</span>
                    </div>
                    <span>Posted {job.posted}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="self-start p-2 ios-touch-target">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center space-x-2 p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full ios-touch-target"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">Messages</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center space-x-2 p-2 text-gray-500 hover:text-green-500 hover:bg-green-500/10 rounded-full ios-touch-target"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-sm">Analytics</span>
                  </Button>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outlined" 
                    size="sm" 
                    className="rounded-full flex-1 sm:flex-none ios-touch-target"
                  >
                    Edit
                  </Button>
                  <Button 
                    className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-3 sm:px-4 flex-1 sm:flex-none ios-touch-target"
                  >
                    View Applicants
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
const DesktopSidebar = ({ isDark, searchTerm, setSearchTerm, trendingSkills }: {
  isDark: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  trendingSkills: any[];
}) => (
  <>
    {/* Search */}
    <div className={cn(
      'sticky top-4 p-3 rounded-2xl',
      isDark ? 'bg-gray-900' : 'bg-gray-100'
    )}>
      <div className="relative">
        <Search className={cn(
          'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5',
          isDark ? 'text-gray-400' : 'text-gray-500'
        )} />
        <input
          type="text"
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={cn(
            'w-full pl-12 pr-4 py-3 rounded-2xl bg-transparent border-none outline-none text-lg',
            isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
          )}
        />
      </div>
    </div>

    {/* Trending Skills */}
    <div className={cn(
      'rounded-2xl p-4',
      isDark ? 'bg-gray-900' : 'bg-gray-100'
    )}>
      <h2 className="text-xl font-bold mb-4">Trending Skills</h2>
      <div className="space-y-3">
        {trendingSkills.map((skill, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-500/10 cursor-pointer transition-colors">
            <div className="flex-1">
              <p className="font-medium">{skill.skill}</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className={cn(
                  'h-2 w-16 rounded-full overflow-hidden',
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                )}>
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: skill.demand }}
                  />
                </div>
                <span className={cn(
                  'text-xs',
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {skill.demand}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button variant="ghost" className="w-full mt-3 text-blue-500 justify-start p-2">
        View skill insights
      </Button>
    </div>

    {/* Quick Actions */}
    <div className={cn(
      'rounded-2xl p-4',
      isDark ? 'bg-gray-900' : 'bg-gray-100'
    )}>
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="space-y-2">
        <Link to="/post-job" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
          <Plus className="h-5 w-5 text-blue-500" />
          <span>Post New Job</span>
        </Link>
        <Link to="/applicants" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
          <Users className="h-5 w-5 text-green-500" />
          <span>Review Applicants</span>
        </Link>
        <Link to="/linkedin-job-import" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
          <Download className="h-5 w-5 text-blue-500" />
          <span>Import LinkedIn Jobs</span>
        </Link>
        <Link to="/analytics" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
          <BarChart3 className="h-5 w-5 text-purple-500" />
          <span>View Analytics</span>
        </Link>
        <Link to="/messages" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
          <MessageCircle className="h-5 w-5 text-yellow-500" />
          <span>Messages</span>
        </Link>
      </div>
    </div>

    {/* Hiring Tips */}
    <div className={cn(
      'rounded-2xl p-4',
      isDark ? 'bg-gray-900' : 'bg-gray-100'
    )}>
      <h2 className="text-xl font-bold mb-4">Hiring Tips</h2>
      <div className="space-y-3">
        <div className="p-3 rounded-lg hover:bg-gray-500/10 cursor-pointer transition-colors">
          <p className="font-medium text-sm">Write clear job descriptions</p>
          <p className={cn(
            'text-xs mt-1',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            Jobs with detailed descriptions get 30% more applications
          </p>
        </div>
        <div className="p-3 rounded-lg hover:bg-gray-500/10 cursor-pointer transition-colors">
          <p className="font-medium text-sm">Respond to candidates quickly</p>
          <p className={cn(
            'text-xs mt-1',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            Fast responses improve candidate experience
          </p>
        </div>
        <div className="p-3 rounded-lg hover:bg-gray-500/10 cursor-pointer transition-colors">
          <p className="font-medium text-sm">Use skill assessments</p>
          <p className={cn(
            'text-xs mt-1',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            Better evaluate candidate capabilities
          </p>
        </div>
      </div>
      <Button variant="ghost" className="w-full mt-3 text-blue-500 justify-start p-2">
        More hiring tips
      </Button>
    </div>
  </>
);