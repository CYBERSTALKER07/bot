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
import { useAuth } from '../../context/AuthContext';
import {
  useRecommendedUsers,
  useMostLikedPosts,
  useBookmarks,
  useFollowUser,
  useUnfollowUser
} from '../../hooks/useOptimizedQuery';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card } from '../ui/Card';
import PageLayout from '../ui/PageLayout';
import { cn } from '../../lib/cva';
import { supabase } from '../../lib/supabase';

export default function StudentDashboard() {
  const { jobs, loading, error } = useJobs();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    trending: false,
    suggestions: false,
    actions: false
  });

  // Fetch real data from Supabase
  const { data: recommendedUsers = [], isLoading: usersLoading } = useRecommendedUsers(user?.id, 5);
  const { data: trendingPosts = [], isLoading: postsLoading } = useMostLikedPosts(5, user?.id);
  const { data: bookmarksData = [], isLoading: bookmarksLoading } = useBookmarks(user?.id);
  const followUserMutation = useFollowUser();
  const unfollowUserMutation = useUnfollowUser();

  // Applications statistics (fetch from Supabase)
  const [applicationsStats, setApplicationsStats] = useState({
    applied: 0,
    interviews: 0,
    saved: 0
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    // Fetch applications count
    const fetchApplicationsStats = async () => {
      try {
        const { count: appliedCount } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('student_id', user.id);

        const { count: interviewsCount } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('student_id', user.id)
          .eq('status', 'interview');

        const savedCount = bookmarksData?.filter((b: any) => b.jobs)?.length || 0;

        setApplicationsStats({
          applied: appliedCount || 0,
          interviews: interviewsCount || 0,
          saved: savedCount
        });
      } catch (error) {
        console.error('Error fetching application stats:', error);
      }
    };

    // Fetch recent activity
    const fetchRecentActivity = async () => {
      try {
        // Get recent applications
        const { data: applications } = await supabase
          .from('applications')
          .select('id, job_id, applied_date, status, jobs(title, company)')
          .eq('student_id', user.id)
          .order('applied_date', { ascending: false })
          .limit(3);

        if (applications) {
          const activity = applications.map((app: any) => {
            const now = new Date();
            const appliedDate = new Date(app.applied_date);
            const diffTime = Math.abs(now.getTime() - appliedDate.getTime());
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let timeString = '';
            if (diffHours < 1) timeString = 'now';
            else if (diffHours < 24) timeString = `${diffHours}h`;
            else timeString = `${diffDays}d`;

            return {
              type: 'application',
              company: app.jobs?.company || 'Unknown Company',
              position: app.jobs?.title || 'Unknown Position',
              time: timeString
            };
          });

          setRecentActivity(activity);
        }
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      }
    };

    fetchApplicationsStats();
    fetchRecentActivity();
  }, [user?.id, bookmarksData]);

  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .slice(0, 6);

  // Extract trending topics from most liked posts
  const trendingTopics = trendingPosts.map((post: any, index: number) => {
    const content = post.content || '';
    const hashtags = content.match(/#\w+/g) || [];
    const mainHashtag = hashtags[0] || `#Post${index + 1}`;

    return {
      tag: mainHashtag,
      posts: `${post.likes_count || 0} likes`,
      author: post.author?.name || 'Unknown'
    };
  }).slice(0, 5);

  // Transform recommended users for suggestions
  const suggestedUsers = recommendedUsers.map((user: any) => ({
    id: user.id,
    name: user.full_name || 'Unknown User',
    handle: user.username ? `@${user.username}` : '@user',
    verified: user.verified || false,
    avatar_url: user.avatar_url,
    bio: user.bio,
    is_following: user.is_following || false
  }));

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
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDark ? 'border-white' : 'border-black'
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
                      'w-full pl-12 pr-4 py-3 rounded-2xl bg-transparent border-none outline-hidden',
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
                      <Briefcase className={cn('h-5 w-5', isDark ? 'text-white' : 'text-black')} />
                      <span>View Applications</span>
                    </Link>
                    <Link
                      to="/events"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors ios-nav-item"
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      <Calendar className={cn('h-5 w-5', isDark ? 'text-white' : 'text-black')} />
                      <span>Career Events</span>
                    </Link>
                    <Link
                      to="/companies"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors ios-nav-item"
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      <Building2 className={cn('h-5 w-5', isDark ? 'text-white' : 'text-black')} />
                      <span>Browse Companies</span>
                    </Link>
                    <Link
                      to="/resources"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors ios-nav-item"
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      <BookOpen className={cn('h-5 w-5', isDark ? 'text-white' : 'text-black')} />
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
                    {postsLoading ? (
                      <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>Loading...</p>
                    ) : trendingTopics.length > 0 ? (
                      trendingTopics.slice(0, 3).map((topic: any, index: number) => (
                        <div key={index} className="p-2 rounded-lg hover:bg-gray-500/10 cursor-pointer transition-colors">
                          <p className="font-bold text-sm">{topic.tag}</p>
                          <p className={cn(
                            'text-xs',
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          )}>
                            {topic.posts}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-500')}>No trending topics yet</p>
                    )}
                    <Link to="/explore">
                      <Button
                        variant="ghost"
                        className={cn('w-full justify-start p-2 text-sm', isDark ? 'text-white' : 'text-black')}
                        onClick={() => setShowMobileSidebar(false)}
                      >
                        Show more trending
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Who to Follow */}
              <div className={cn(
                'rounded-2xl p-4',
                isDark ? 'bg-black' : 'bg-white'
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
                    {usersLoading ? (
                      <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>Loading...</p>
                    ) : suggestedUsers.length > 0 ? (
                      suggestedUsers.slice(0, 2).map((suggestedUser: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2">
                          <div className="flex items-center space-x-3 flex-1">
                            {suggestedUser.avatar_url ? (
                              <img
                                src={suggestedUser.avatar_url}
                                alt={suggestedUser.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center font-bold',
                                isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
                              )}>
                                {suggestedUser.name.charAt(0)}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-1">
                                <p className="font-bold text-sm truncate">{suggestedUser.name}</p>
                                {suggestedUser.verified && (
                                  <svg className="w-4 h-4 text-[#D3FB52] fill-current" viewBox="0 0 24 24">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                              </div>
                              <p className={cn(
                                'text-xs truncate',
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              )}>
                                {suggestedUser.handle}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              if (suggestedUser.is_following) {
                                unfollowUserMutation.mutate({
                                  followerId: user?.id || '',
                                  followingId: suggestedUser.id
                                });
                              } else {
                                followUserMutation.mutate({
                                  followerId: user?.id || '',
                                  followingId: suggestedUser.id
                                });
                              }
                            }}
                            className={cn(
                              'rounded-full px-3 py-1 text-xs font-bold ml-2',
                              suggestedUser.is_following
                                ? isDark
                                  ? 'bg-transparent border border-gray-700 text-white hover:bg-gray-900'
                                  : 'bg-transparent border border-gray-300 text-black hover:bg-gray-100'
                                : isDark
                                  ? 'bg-[#D3FB52] text-black hover:bg-[#D3FB52]/90'
                                  : 'bg-[#D3FB52] text-black hover:bg-[#D3FB52]/90'
                            )}
                          >
                            {suggestedUser.is_following ? 'Following' : 'Follow'}
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-500')}>No suggestions available</p>
                    )}
                    <Link to="/people">
                      <Button
                        variant="ghost"
                        className={cn('w-full justify-start p-2 text-sm', isDark ? 'text-white' : 'text-black')}
                        onClick={() => setShowMobileSidebar(false)}
                      >
                        Show more suggestions
                      </Button>
                    </Link>
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
              applicationsStats={applicationsStats}
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
            applicationsStats={applicationsStats}
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
            postsLoading={postsLoading}
            usersLoading={usersLoading}
            user={user}
            followUserMutation={followUserMutation}
          />
        </div>
      </div>
    </PageLayout>
  );
}

// Extracted Main Content Component for reusability
const MainContent = ({ isDark, jobs, filteredJobs, recentActivity, applicationsStats }: {
  isDark: boolean;
  jobs: any[];
  filteredJobs: any[];
  recentActivity: any[];
  applicationsStats: { applied: number; interviews: number; saved: number };
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
          <div className={cn('text-lg sm:text-2xl font-bold mb-1', isDark ? 'text-white' : 'text-black')}>
            {jobs.length}
          </div>
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
          <div className={cn('text-lg sm:text-2xl font-bold mb-1', isDark ? 'text-white' : 'text-black')}>
            {applicationsStats.applied}
          </div>
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
          <div className={cn('text-lg sm:text-2xl font-bold mb-1', isDark ? 'text-white' : 'text-black')}>
            {applicationsStats.interviews}
          </div>
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
          <div className={cn('text-lg sm:text-2xl font-bold mb-1', isDark ? 'text-white' : 'text-black')}>
            {applicationsStats.saved}
          </div>
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
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    activity.type === 'application' ? isDark ? 'bg-white' : 'bg-black' :
                      activity.type === 'saved' ? isDark ? 'bg-white' : 'bg-black' : 'bg-gray-500'
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
                  'text-xs sm:text-sm shrink-0',
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {activity.time}
                </span>
              </div>
            ))
          ) : (
            <p className={cn('text-sm text-center py-4', isDark ? 'text-gray-500' : 'text-gray-500')}>
              No recent activity yet
            </p>
          )}
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
            className={cn('hover:underline text-sm ios-touch-target', isDark ? 'text-white' : 'text-black')}
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
                  <p className={cn('font-medium mb-2 text-sm sm:text-base', isDark ? 'text-white' : 'text-black')}>
                    {job.company}
                  </p>
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
                    className={cn(
                      'flex items-center space-x-2 p-2 rounded-full ios-touch-target',
                      isDark ? 'text-gray-400 hover:text-white hover:bg-gray-900' : 'text-gray-600 hover:text-black hover:bg-gray-100'
                    )}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'flex items-center space-x-2 p-2 rounded-full ios-touch-target',
                      isDark ? 'text-gray-400 hover:text-white hover:bg-gray-900' : 'text-gray-600 hover:text-black hover:bg-gray-100'
                    )}
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outlined"
                    size="sm"
                    className={cn(
                      'rounded-full flex-1 sm:flex-none ios-touch-target border',
                      isDark ? 'border-gray-700 hover:bg-gray-900' : 'border-gray-300 hover:bg-gray-100'
                    )}
                  >
                    Save
                  </Button>
                  <Link to={`/job/${job.id}`} className="flex-1 sm:flex-none">
                    <Button
                      className={cn(
                        'w-full rounded-full px-4 sm:px-6 ios-touch-target font-bold',
                        isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'
                      )}
                    >
                      Apply
                    </Button>
                  </Link>
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
const DesktopSidebar = ({ isDark, searchTerm, setSearchTerm, trendingTopics, suggestedUsers, postsLoading, usersLoading, user, followUserMutation }: {
  isDark: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  trendingTopics: any[];
  suggestedUsers: any[];
  postsLoading: boolean;
  usersLoading: boolean;
  user: any;
  followUserMutation: any;
}) => (
  <>
    {/* Search */}
    <div className={cn(
      'sticky top-0 p-4 rounded-[24px] border shadow-lg',
      isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
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
            'w-full pl-12 pr-4 py-3 rounded-2xl bg-transparent border-none outline-hidden',
            isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
          )}
        />
      </div>
    </div>

    {/* Trending */}
    <div className={cn(
      'rounded-[24px] p-4 border shadow-lg',
      isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
    )}>
      <h2 className="text-xl font-bold mb-4">What's trending</h2>
      <div className="space-y-3">
        {postsLoading ? (
          <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>Loading...</p>
        ) : trendingTopics.length > 0 ? (
          trendingTopics.map((topic: any, index: number) => (
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
          ))
        ) : (
          <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-500')}>No trending topics yet</p>
        )}
      </div>
      <Link to="/explore">
        <Button variant="ghost" className={cn('w-full mt-3 justify-start p-2', isDark ? 'text-white' : 'text-black')}>
          Show more
        </Button>
      </Link>
    </div>

    {/* Who to follow */}
    <div className={cn(
      'rounded-3xl border-[0.1px] border-gray-200 p-4',
      isDark ? 'bg-black' : 'bg-white'
    )}>
      <h2 className="text-xl font-bold mb-4"></h2>
      <div className="space-y-3">
        {usersLoading ? (
          <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>Loading...</p>
        ) : suggestedUsers.length > 0 ? (
          suggestedUsers.map((suggestedUser: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {suggestedUser.avatar_url ? (
                  <img
                    src={suggestedUser.avatar_url}
                    alt={suggestedUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                    isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
                  )}>
                    {suggestedUser.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <p className="font-bold text-sm truncate">{suggestedUser.name}</p>
                    {suggestedUser.verified && (
                      <svg className="w-4 h-4 text-[#D3FB52] fill-current" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <p className={cn(
                    'text-sm truncate',
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {suggestedUser.handle}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  followUserMutation.mutate({
                    followerId: user?.id || '',
                    followingId: suggestedUser.id
                  });
                }}
                className={cn(
                  'rounded-full px-4 py-1 text-sm font-bold',
                  isDark ? 'bg-[#D3FB52] text-black hover:bg-[#D3FB52]/90' : 'bg-[#D3FB52] text-black hover:bg-[#D3FB52]/90'
                )}
              >
                Follow
              </Button>
            </div>
          ))
        ) : (
          <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-500')}>No suggestions available</p>
        )}
      </div>
      <Link to="/people">
        <Button variant="ghost" className={cn('w-full mt-3 justify-start p-2', isDark ? 'text-white' : 'text-black')}>
          Show more
        </Button>
      </Link>
    </div>

    {/* Quick Actions */}
    <div className={cn(
      'rounded-3xl border-[0.1px] border-gray-200 p-4',
      isDark ? 'bg-black' : 'bg-white'
    )}>
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="space-y-2">
        <Link to="/applications" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
          <Briefcase className={cn('h-5 w-5', isDark ? 'text-white' : 'text-black')} />
          <span>View Applications</span>
        </Link>
        <Link to="/events" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
          <Calendar className={cn('h-5 w-5', isDark ? 'text-white' : 'text-black')} />
          <span>Career Events</span>
        </Link>
        <Link to="/companies" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
          <Building2 className={cn('h-5 w-5', isDark ? 'text-white' : 'text-black')} />
          <span>Browse Companies</span>
        </Link>
        <Link to="/resources" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
          <BookOpen className={cn('h-5 w-5', isDark ? 'text-white' : 'text-black')} />
          <span>Career Resources</span>
        </Link>
      </div>
    </div>
  </>
);