import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users,
  Eye,
  Star,
  Plus,
  Calendar,
  ArrowUpRight,
  Play,
  Pause,
  X,
  Bell,
  MapPin,
  Heart
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useJobManagement } from '../../hooks/useJobManagement';
import Button from '../ui/Button';
import { cn } from '../../lib/cva';
import PageLayout from '../ui/PageLayout';
import PostEventForm from '../PostEventForm';
import PostJob from '../PostJob';
import { supabase } from '../../lib/supabase';

interface Metric {
  value: number;
  label: string;
  color: string;
  bgColor: string;
}

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  status?: string;
  applications_count?: number;
  views_count?: number;
}

interface EventData {
  id: string;
  title: string;
  event_date: string;
  status: string;
  attendees_count: number;
  location?: string;
}

interface Applicant {
  id: string;
  profiles?: {
    full_name: string;
  };
}

interface Follower {
  id: string;
  follower?: {
    full_name: string;
    avatar_url?: string;
  };
}

export default function EmployerDashboard() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { fetchEmployerJobs, getJobApplicants } = useJobManagement();
  
  const [showPostEventModal, setShowPostEventModal] = useState(false);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  
  // Data states
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [recentApplicants, setRecentApplicants] = useState<Applicant[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeTracking, setTimeTracking] = useState({ hours: 1, minutes: 24, seconds: 8, isRunning: false });

  // Fetch all employer data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      if (!user || user.role !== 'employer') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch posted jobs
        const jobsData = await fetchEmployerJobs();
        setJobPostings(jobsData as JobPosting[]);

        // Fetch events
        const { data: eventsData, error: eventsError } = await supabase
          .from('employer_events')
          .select('*')
          .eq('employer_id', user.id)
          .order('event_date', { ascending: true });

        if (!eventsError && eventsData) {
          setEvents(eventsData as EventData[]);
        }

        // Fetch followers
        const { data: followersData, error: followersError } = await supabase
          .from('follows')
          .select(`
            *,
            follower:follower_id(id, full_name, avatar_url)
          `)
          .eq('following_id', user.id)
          .limit(5);

        if (!followersError && followersData) {
          setFollowers(followersData as Follower[]);
        }

        // Fetch all applicants for employer's jobs
        if (jobsData.length > 0) {
          const allApplicants: Applicant[] = [];
          
          for (const job of jobsData.slice(0, 10)) {
            const applicants = await getJobApplicants(job.id);
            allApplicants.push(...(applicants || []));
          }

          setRecentApplicants(allApplicants.slice(0, 5));

          // Calculate metrics
          const totalApplicants = allApplicants.length;
          const activeJobs = jobsData.filter(j => j.status === 'active' || j.status === 'open' || j.status === 'inactive').length;
          const closedJobs = jobsData.filter(j => j.status === 'closed').length;
          const followerCount = followersData?.length || 0;

          setMetrics([
            {
              value: activeJobs,
              label: 'Active Jobs',
              color: 'text-black dark:text-white',
              bgColor: 'bg-white dark:bg-black'
              
            },
            {
              value: closedJobs,
              label: 'Closed Jobs',
              color: 'text-black dark:text-white',
              bgColor: 'bg-white dark:bg-black'
              
            },
            {
              value: totalApplicants,
              label: 'Total Applicants',
              color: 'text-black dark:text-white',
              bgColor: 'bg-white dark:bg-black'
              
            },
           
          ]);
        }

      } catch (err) {
        console.error('Error fetching employer data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'employer') {
      fetchAllData();
    }
  }, [user, fetchEmployerJobs, getJobApplicants]);

  // Timer effect
  useEffect(() => {
    if (!timeTracking.isRunning) return;

    const interval = setInterval(() => {
      setTimeTracking(prev => {
        let { hours, minutes, seconds } = prev;
        seconds += 1;
        if (seconds === 60) {
          seconds = 0;
          minutes += 1;
          if (minutes === 60) {
            minutes = 0;
            hours += 1;
          }
        }
        return { ...prev, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeTracking.isRunning]);

  if (loading) {
    return (
      <PageLayout className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}
      maxWidth="full"
      padding="none"
    >
      {/* Mobile Header */}
      <div className={cn(
        'sticky top-0 z-50 backdrop-blur-xl border-b lg:hidden ios-header-safe',
        isDark ? 'bg-black/95 border-gray-800' : 'bg-white/95 border-gray-200'
      )}>
        <div className="flex items-center justify-between px-4 py-4 ios-nav-spacing">
          <div>
            <h1 className="text-lg font-thin">Dashboard</h1>
            <p className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-600')}>
              Welcome back!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button className="p-2" title="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <Button 
              className={cn(
                'rounded-full px-3 py-2 font-thin text-sm',
                isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
              )}
              onClick={() => setShowPostJobModal(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-20 lg:pb-0 pt-16 lg:pt-20">
        <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-thin mb-2">Dashboard</h1>
              <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                Manage your jobs, events, and applicants
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                className={cn(
                  'rounded-full px-6 py-2 font-thin',
                  isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                )}
                onClick={() => setShowPostJobModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </Button>
              <Button 
                className={cn(
                  'rounded-full px-6 py-2 font-thin',
                  isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
                )}
                onClick={() => setShowPostEventModal(true)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Post Event
              </Button>
            </div>
          </div>

          {/* Mobile: Title + Filters (if needed) */}
          <div className="lg:hidden mb-4">
            <h2 className="text-xl font-thin mb-3 text-white">Dashboard</h2>
          </div>

          {/* Top Metrics Cards - 4 columns on desktop, 2 on mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 lg:mb-8">
            {metrics.map((metric, index) => (
              <div 
                key={index}
                className={cn(
                  'rounded-3xl p-3 sm:p-4 lg:p-6 transition-all hover:shadow-lg',
                  metric.bgColor,
                  isDark ? 'border border-gray-800' : 'border border-gray-200'
                )}
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-1">
                    <p className={cn('text-xs lg:text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-600')}>
                      {metric.label}
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-thin mt-1 sm:mt-2">{metric.value}</p>
                  </div>
                </div>
               
              </div>
            ))}
          </div>

          {/* Main Grid - Jobs & Events: Desktop 2/3 & 1/3, Mobile stacked */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            {/* Posted Jobs - Takes 2/3 on desktop */}
            <div className={cn(
              'lg:col-span-2 rounded-3xl p-4 lg:p-6',
              isDark ? 'bg-black border border-gray-800' : 'bg-white border border-gray-200'
            )}>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-thin">Your Posted Jobs</h2>
                <Link to="/posted-jobs" className="text-blue-500 hover:underline text-xs sm:text-sm whitespace-nowrap">
                  View all
                </Link>
              </div>
              <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
                {jobPostings.length > 0 ? (
                  jobPostings.slice(0, 4).map((job) => (
                    <div
                      key={job.id}
                      className={cn(
                        'p-3 sm:p-4 rounded-xl transition-colors hover:bg-gray-50/5',
                        isDark ? 'bg-black border-[0.5px] border-gray-800' : 'bg-white'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base truncate">{job.title}</h3>
                          <p className={cn('text-xs mt-1 truncate', isDark ? 'text-gray-400' : 'text-gray-600')}>
                            {job.company} • {job.location}
                          </p>
                        </div>
                        {/* <span className={cn(
                          'text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0',
                          job.status === 'open' || job.status === 'active' ? (isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') :
                          job.status === 'closed' ? (isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800') :
                          isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                        )}>
                          {job.status || 'draft'}
                        </span> */}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{job.applications_count || 0} applicants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{job.views_count || 0} views</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                      No jobs posted yet
                    </p>
                    <Button
                      className="mt-3 text-blue-500 text-sm"
                      onClick={() => setShowPostJobModal(true)}
                    >
                      Post your first job
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Events - Takes 1/3 on desktop */}
            <div className={cn(
              'lg:col-span-1 rounded-3xl p-4 lg:p-6',
              isDark ? 'bg-black border border-gray-800' : 'bg-white border border-gray-200'
            )}>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-thin">Your Events</h2>
                <Link to="/events" className="text-blue-500 hover:underline text-xs sm:text-sm whitespace-nowrap">
                  View all
                </Link>
              </div>
              <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
                {events.length > 0 ? (
                  events.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        'p-3 sm:p-4 rounded-xl transition-colors hover:bg-gray-50/5',
                        isDark ? 'bg-black border-[0.7px] border-gray-900' : 'bg-gray-100/50'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base truncate">{event.title}</h3>
                          <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">
                              {new Date(event.event_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        <span className={cn(
                          'text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0',
                          event.status === 'upcoming' ? (isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800') :
                          event.status === 'ongoing' ? (isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') :
                          isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
                        )}>
                          {event.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        <span>{event.attendees_count || 0} attendees</span>
                        {event.location && (
                          <>
                            <span>•</span>
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{event.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                      No events posted yet
                    </p>
                    <Button
                      className="mt-3 text-blue-500 text-sm"
                      onClick={() => setShowPostEventModal(true)}
                    >
                      Create your first event
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section - Recent Applicants (2/3), Followers (1/3) on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
            {/* Recent Applicants - Takes 2/3 on desktop */}
            <div className={cn(
              'lg:col-span-2 rounded-3xl p-4 lg:p-6',
              isDark ? 'bg-black border border-gray-800' : 'bg-white border border-gray-200'
            )}>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-thin">Recent Applicants</h2>
                <Link to="/applicants" className="text-blue-500 hover:underline text-xs sm:text-sm whitespace-nowrap">
                  View all
                </Link>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {recentApplicants.length > 0 ? (
                  recentApplicants.slice(0, 4).map((applicant) => (
                    <div key={applicant.id} className={cn(
                      'flex items-center justify-between p-3 sm:p-4 rounded-xl transition-colors',
                      isDark ? 'hover:bg-black border-[0.7px] border-slate-50' : 'hover:bg-gray-50'
                    )}>
                      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl flex-shrink-0 bg-gradient-to-br from-green-400 to-blue-500">
                          👤
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">{applicant.profiles?.full_name || 'Applicant'}</p>
                          <div className="flex items-center space-x-1 mt-0.5">
                            <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />
                            <span className="text-xs text-yellow-500">{(Math.random() * 2 + 3).toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1 sm:space-x-2 flex-shrink-0 ml-2">
                        <Button 
                          className={cn(
                            'rounded-lg text-xs px-2 sm:px-3 py-1 sm:py-2',
                            isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'
                          )}
                        >
                          View
                        </Button>
                        <Button 
                          className={cn(
                            'rounded-lg text-xs px-2 sm:px-3 py-1 sm:py-2',
                            isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600',
                            'text-white'
                          )}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                      No applicants yet
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Followers - Takes 1/3 on desktop */}
            <div className={cn(
              'lg:col-span-1 rounded-3xl p-4 lg:p-6',
              isDark ? 'bg-black border border-gray-800' : 'bg-white border border-gray-200'
            )}>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-thin">Followers</h2>
                <Link to="/followers" className="text-blue-500 hover:underline text-xs sm:text-sm whitespace-nowrap">
                  View all
                </Link>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {followers.length > 0 ? (
                  followers.slice(0, 5).map((follow) => (
                    <div key={follow.id} className={cn(
                      'flex items-center justify-between p-2 sm:p-3 rounded-xl transition-colors',
                      isDark ? 'hover:bg-black border-[0.7px] border-slate-50' : 'hover:bg-gray-50'
                    )}>
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0">
                          👤
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs sm:text-sm truncate">{follow.follower?.full_name || 'User'}</p>
                          <p className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-500')}>
                            Recently
                          </p>
                        </div>
                      </div>
                      <Heart className="h-4 w-4 text-red-500 fill-current flex-shrink-0" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <p className={cn('text-xs sm:text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                      No followers yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* Post Job Modal */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <PostJob />
          </div>
        </div>
      )}

      {/* Post Event Modal */}
      {showPostEventModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <PostEventForm
              onClose={() => setShowPostEventModal(false)}
            />
          </div>
        </div>
      )}
    </PageLayout>
  );
}