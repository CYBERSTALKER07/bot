import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Eye,
  Plus,
  Calendar,
  ArrowUpRight,
  X,
  Bell,
  MapPin,
  Briefcase,
  TrendingUp,
  Clock
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
  icon: any;
  trend?: string;
}

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  status?: string;
  applications_count?: number;
  views_count?: number;
  created_at?: string;
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
    avatar_url?: string;
    headline?: string;
  };
  status?: string;
  applied_at?: string;
}

interface Follower {
  id: string;
  follower?: {
    full_name: string;
    avatar_url?: string;
    headline?: string;
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
          const activeJobs = jobsData.filter(j => j.status === 'active' || j.status === 'open').length;
          const totalViews = jobsData.reduce((acc, job) => acc + (job.views_count || 0), 0);

          setMetrics([
            {
              value: activeJobs,
              label: 'Active Jobs',
              icon: Briefcase,
              trend: '+2 this week'
            },
            {
              value: totalApplicants,
              label: 'Total Applicants',
              icon: Users,
              trend: '+12% vs last month'
            },
            {
              value: totalViews,
              label: 'Total Views',
              icon: Eye,
              trend: '+5% vs last week'
            },
          ]);
        } else {
          setMetrics([
            { value: 0, label: 'Active Jobs', icon: Briefcase },
            { value: 0, label: 'Total Applicants', icon: Users },
            { value: 0, label: 'Total Views', icon: Eye },
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

  if (loading) {
    return (
      <PageLayout className={cn(
        "min-h-screen",
        isDark ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      )}
        maxWidth="full"
        padding="none"
      >
        {/* Mobile Header Skeleton */}
        <div className={cn(
          "sticky top-0 z-50 backdrop-blur-xl border-b lg:hidden",
          isDark ? "bg-black/80 border-white/10" : "bg-white/80 border-gray-200"
        )}>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="space-y-2">
              <div className={cn(
                "h-5 w-24 rounded animate-pulse",
                isDark ? "bg-white/10" : "bg-gray-200"
              )}></div>
              <div className={cn(
                "h-3 w-16 rounded animate-pulse",
                isDark ? "bg-white/5" : "bg-gray-100"
              )}></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={cn(
                "h-8 w-8 rounded-full animate-pulse",
                isDark ? "bg-white/10" : "bg-gray-200"
              )}></div>
              <div className={cn(
                "h-8 w-8 rounded-full animate-pulse",
                isDark ? "bg-lime-400/20" : "bg-lime-200"
              )}></div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="pb-24 lg:pb-8 pt-4 lg:pt-12">
          <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

            {/* Desktop Header Skeleton */}
            <div className="hidden lg:flex items-end justify-between mb-8">
              <div className="space-y-3">
                <div className={cn(
                  "h-10 w-48 rounded animate-pulse",
                  isDark ? "bg-white/10" : "bg-gray-200"
                )}></div>
                <div className={cn(
                  "h-4 w-64 rounded animate-pulse",
                  isDark ? "bg-white/5" : "bg-gray-100"
                )}></div>
              </div>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-11 w-36 rounded-2xl animate-pulse",
                  isDark ? "bg-white/10" : "bg-gray-200"
                )}></div>
                <div className={cn(
                  "h-11 w-40 rounded-2xl animate-pulse",
                  isDark ? "bg-lime-400/20" : "bg-lime-200"
                )}></div>
              </div>
            </div>

            {/* Bento Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">

              {/* Metric Cards Skeleton */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "p-5 rounded-2xl lg:rounded-3xl",
                    isDark ? "bg-zinc-900/50 border border-white/5" : "bg-white border border-gray-200 shadow-sm"
                  )}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn(
                      "h-11 w-11 rounded-xl animate-pulse",
                      isDark ? "bg-white/10" : "bg-gray-200"
                    )}></div>
                    <div className={cn(
                      "h-6 w-20 rounded-full animate-pulse",
                      isDark ? "bg-lime-400/10" : "bg-lime-100"
                    )}></div>
                  </div>
                  <div className="space-y-2">
                    <div className={cn(
                      "h-9 w-16 rounded animate-pulse",
                      isDark ? "bg-white/10" : "bg-gray-200"
                    )}></div>
                    <div className={cn(
                      "h-3 w-24 rounded animate-pulse",
                      isDark ? "bg-white/5" : "bg-gray-100"
                    )}></div>
                  </div>
                </div>
              ))}

              {/* Main Content Area Skeleton */}
              <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">

                {/* Jobs Section Skeleton */}
                <div className={cn(
                  "lg:col-span-2 p-5 lg:p-6 rounded-2xl lg:rounded-3xl",
                  isDark ? "bg-zinc-900/50 border border-white/5" : "bg-white border border-gray-200 shadow-sm"
                )}>
                  <div className="flex items-center justify-between mb-5">
                    <div className={cn(
                      "h-6 w-40 rounded animate-pulse",
                      isDark ? "bg-white/10" : "bg-gray-200"
                    )}></div>
                    <div className={cn(
                      "h-4 w-16 rounded animate-pulse",
                      isDark ? "bg-white/5" : "bg-gray-100"
                    )}></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "p-4 rounded-3xl",
                          isDark ? "bg-black border border-white/5" : "bg-white border border-gray-200 shadow-lg"
                        )}
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <div className="space-y-2 flex-1">
                              <div className={cn(
                                "h-5 w-32 rounded animate-pulse",
                                isDark ? "bg-white/10" : "bg-gray-200"
                              )}></div>
                              <div className={cn(
                                "h-3 w-24 rounded animate-pulse",
                                isDark ? "bg-white/5" : "bg-gray-100"
                              )}></div>
                            </div>
                            <div className={cn(
                              "h-6 w-12 rounded-md animate-pulse",
                              isDark ? "bg-white/5" : "bg-gray-100"
                            )}></div>
                          </div>
                          <div className={cn(
                            "pt-3 border-t flex gap-4",
                            isDark ? "border-white/5" : "border-gray-200"
                          )}>
                            <div className={cn(
                              "h-3 w-20 rounded animate-pulse",
                              isDark ? "bg-white/5" : "bg-gray-100"
                            )}></div>
                            <div className={cn(
                              "h-3 w-16 rounded animate-pulse",
                              isDark ? "bg-white/5" : "bg-gray-100"
                            )}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Applicants Skeleton */}
                <div className={cn(
                  "p-5 lg:p-6 rounded-2xl lg:rounded-3xl",
                  isDark ? "bg-zinc-900/50 border border-white/5" : "bg-white border border-gray-200 shadow-sm"
                )}>
                  <div className="flex items-center justify-between mb-5">
                    <div className={cn(
                      "h-6 w-36 rounded animate-pulse",
                      isDark ? "bg-white/10" : "bg-gray-200"
                    )}></div>
                    <div className={cn(
                      "h-4 w-16 rounded animate-pulse",
                      isDark ? "bg-white/5" : "bg-gray-100"
                    )}></div>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl",
                          isDark ? "bg-black border border-white/5" : "bg-gray-50 border border-gray-200"
                        )}
                      >
                        <div className={cn(
                          "h-10 w-10 rounded-full animate-pulse",
                          isDark ? "bg-white/10" : "bg-gray-200"
                        )}></div>
                        <div className="flex-1 space-y-2">
                          <div className={cn(
                            "h-4 w-24 rounded animate-pulse",
                            isDark ? "bg-white/10" : "bg-gray-200"
                          )}></div>
                          <div className={cn(
                            "h-3 w-32 rounded animate-pulse",
                            isDark ? "bg-white/5" : "bg-gray-100"
                          )}></div>
                        </div>
                        <div className={cn(
                          "h-8 w-8 rounded-full animate-pulse",
                          isDark ? "bg-white/5" : "bg-gray-100"
                        )}></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Events Skeleton */}
                <div className={cn(
                  "p-5 lg:p-6 rounded-2xl lg:rounded-3xl",
                  isDark ? "bg-zinc-900/50 border border-white/5" : "bg-white border border-gray-200 shadow-sm"
                )}>
                  <div className="flex items-center justify-between mb-5">
                    <div className={cn(
                      "h-6 w-24 rounded animate-pulse",
                      isDark ? "bg-white/10" : "bg-gray-200"
                    )}></div>
                    <div className={cn(
                      "h-4 w-16 rounded animate-pulse",
                      isDark ? "bg-white/5" : "bg-gray-100"
                    )}></div>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "relative p-4 rounded-xl overflow-hidden",
                          isDark ? "bg-black border border-white/5" : "bg-gray-50 border border-gray-200"
                        )}
                      >
                        <div className={cn(
                          "absolute top-0 left-0 w-1 h-full",
                          isDark ? "bg-lime-400/50" : "bg-lime-500/50"
                        )} />
                        <div className="pl-3 space-y-2">
                          <div className={cn(
                            "h-4 w-32 rounded animate-pulse",
                            isDark ? "bg-white/10" : "bg-gray-200"
                          )}></div>
                          <div className="flex gap-3">
                            <div className={cn(
                              "h-3 w-20 rounded animate-pulse",
                              isDark ? "bg-white/5" : "bg-gray-100"
                            )}></div>
                            <div className={cn(
                              "h-3 w-16 rounded animate-pulse",
                              isDark ? "bg-white/5" : "bg-gray-100"
                            )}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Sidebar Skeleton */}
              <div className="lg:col-span-1 space-y-4 lg:space-y-6">

                {/* Quick Actions Skeleton */}
                <div className={cn(
                  "p-5 lg:p-6 rounded-2xl lg:rounded-3xl",
                  isDark
                    ? "bg-gradient-to-br from-lime-400/20 to-lime-600/20"
                    : "bg-gradient-to-br from-lime-500/20 to-lime-600/20"
                )}>
                  <div className={cn(
                    "h-6 w-28 rounded animate-pulse mb-4",
                    isDark ? "bg-white/20" : "bg-white/40"
                  )}></div>
                  <div className="space-y-2">
                    <div className={cn(
                      "h-12 w-full rounded-xl animate-pulse",
                      "bg-black/10"
                    )}></div>
                    <div className={cn(
                      "h-12 w-full rounded-xl animate-pulse",
                      "bg-black/10"
                    )}></div>
                  </div>
                </div>

                {/* Followers Skeleton */}
                <div className={cn(
                  "p-5 lg:p-6 rounded-2xl lg:rounded-3xl",
                  isDark ? "bg-zinc-900/50 border border-white/5" : "bg-white border border-gray-200 shadow-sm"
                )}>
                  <div className="flex items-center justify-between mb-5">
                    <div className={cn(
                      "h-5 w-20 rounded animate-pulse",
                      isDark ? "bg-white/10" : "bg-gray-200"
                    )}></div>
                    <div className={cn(
                      "h-3 w-12 rounded animate-pulse",
                      isDark ? "bg-white/5" : "bg-gray-100"
                    )}></div>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={cn(
                          "h-8 w-8 rounded-full animate-pulse",
                          isDark ? "bg-white/10" : "bg-gray-200"
                        )}></div>
                        <div className={cn(
                          "h-4 w-24 rounded animate-pulse flex-1",
                          isDark ? "bg-white/10" : "bg-gray-200"
                        )}></div>
                        <div className={cn(
                          "h-3 w-10 rounded animate-pulse",
                          isDark ? "bg-white/5" : "bg-gray-100"
                        )}></div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </main>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      className={cn(
        "min-h-screen",
        isDark ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      )}
      maxWidth="full"
      padding="none"
    >
      {/* Mobile Header */}
      <div className={cn(
        "sticky top-0 z-50 backdrop-blur-xl border-b lg:hidden",
        isDark ? "bg-black/80 border-white/10" : "bg-white/80 border-gray-200"
      )}>
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Dashboard</h1>
            <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-600")}>
              Overview
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button className={cn(
              "p-2 transition-colors",
              isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
            )} title="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              className={cn(
                "rounded-full h-8 w-8 flex items-center justify-center transition-colors",
                isDark ? "bg-lime-400 text-black hover:bg-lime-300" : "bg-lime-500 text-white hover:bg-lime-600"
              )}
              onClick={() => setShowPostJobModal(true)}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content with Safe Area Padding */}
      <div className="pb-24 lg:pb-8 pt-4 lg:pt-12">
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header Section */}
          <div className="hidden lg:flex items-end justify-between mb-8">
            <div>
              <h1 className={cn(
                "text-4xl font-bold tracking-tight mb-2",
                isDark ? "text-white" : "text-gray-900"
              )}>
                Dashboard
              </h1>
              <p className={cn(
                "font-light",
                isDark ? "text-gray-400" : "text-gray-600"
              )}>
                Manage your recruitment pipeline and company events
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                className={cn(
                  "px-5 py-2.5 rounded-2xl font-medium transition-all duration-300",
                  isDark
                    ? "bg-zinc-900 border border-zinc-800 text-white hover:border-lime-400/50"
                    : "bg-white border border-gray-200 text-gray-900 hover:border-lime-500/50 shadow-sm"
                )}
                onClick={() => setShowPostEventModal(true)}
              >
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Create Event
                </span>
              </Button>
              <Button
                className={cn(
                  "px-5 py-2.5 rounded-2xl font-bold transition-all duration-300",
                  isDark
                    ? "bg-lime-400 text-black hover:bg-lime-300 shadow-[0_0_20px_-5px_rgba(163,230,53,0.4)]"
                    : "bg-lime-500 text-white hover:bg-lime-600 shadow-lg shadow-lime-500/30"
                )}
                onClick={() => setShowPostJobModal(true)}
              >
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Post New Job
                </span>
              </Button>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">

            {/* Metrics Cards - Responsive Bento Style */}
            {metrics.map((metric, index) => (
              <div
                key={index}
                className={cn(
                  "group relative p-5 rounded-2xl lg:rounded-3xl transition-all duration-300 overflow-hidden",
                  isDark
                    ? "bg-zinc-900/50 border border-white/5 hover:border-lime-400/30"
                    : "bg-white border border-gray-200 hover:border-lime-500/30 shadow-sm hover:shadow-md"
                )}
              >
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  isDark ? "from-lime-400/5 via-transparent to-transparent" : "from-lime-500/5 via-transparent to-transparent"
                )} />

                <div className="relative z-10 flex justify-between items-start mb-6">
                  <div className={cn(
                    "p-2.5 rounded-xl transition-colors",
                    isDark
                      ? "bg-black border border-white/10 group-hover:border-lime-400/30"
                      : "bg-gray-50 border border-gray-200 group-hover:border-lime-500/30"
                  )}>
                    <metric.icon className={cn(
                      "h-5 w-5 transition-colors",
                      isDark
                        ? "text-white group-hover:text-lime-400"
                        : "text-gray-700 group-hover:text-lime-600"
                    )} />
                  </div>
                  {metric.trend && (
                    <span className={cn(
                      "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                      isDark
                        ? "text-lime-400 bg-lime-400/10"
                        : "text-lime-600 bg-lime-50"
                    )}>
                      <TrendingUp className="h-3 w-3" />
                      {metric.trend}
                    </span>
                  )}
                </div>

                <div className="relative z-10">
                  <h3 className={cn(
                    "text-3xl font-bold mb-1 tracking-tight",
                    isDark ? "text-white" : "text-gray-900"
                  )}>{metric.value}</h3>
                  <p className={cn(
                    "text-xs font-medium uppercase tracking-wider",
                    isDark ? "text-gray-400" : "text-gray-600"
                  )}>{metric.label}</p>
                </div>
              </div>
            ))}

            {/* Main Content Area - Bento Grid */}
            <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">

              {/* Active Jobs Section */}
              <div className={cn(
                "lg:col-span-2 p-5 lg:p-6 rounded-2xl lg:rounded-3xl",
                isDark ? "bg-zinc-900/50 border border-white/5" : "bg-white border border-gray-200 shadow-sm"
              )}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className={cn(
                    "text-lg font-bold flex items-center gap-2",
                    isDark ? "text-white" : "text-gray-900"
                  )}>
                    <Briefcase className={cn(
                      "h-5 w-5",
                      isDark ? "text-lime-400" : "text-lime-600"
                    )} />
                    Active Positions
                  </h2>
                  <Link to="/posted-jobs" className={cn(
                    "text-sm transition-colors flex items-center gap-1 group",
                    isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  )}>
                    View All <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                  {jobPostings.length > 0 ? (
                    jobPostings.slice(0, 4).map((job) => (
                      <div
                        key={job.id}
                        className={cn(
                          "group p-4 rounded-3xl transition-all duration-300 hover:-translate-y-1",
                          isDark
                            ? "bg-black border border-white/5 hover:border-lime-400/30"
                            : "bg-white  border-gray-200 hover:border-lime-500/30 shadow-lg hover:shadow-md"
                        )}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className={cn(
                              "font-bold truncate transition-colors",
                              isDark
                                ? "text-white group-hover:text-lime-400"
                                : "text-gray-900 group-hover:text-lime-600"
                            )}>
                              {job.title}
                            </h3>
                            <p className={cn(
                              "text-xs mt-1",
                              isDark ? "text-gray-500" : "text-gray-600"
                            )}>{job.location}</p>
                          </div>
                          <span className={cn(
                            "px-2 py-1 rounded-md text-xs font-medium ml-2",
                            isDark
                              ? "bg-white/5 text-gray-300 border border-white/5"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          )}>
                            {job.status || 'Draft'}
                          </span>
                        </div>

                        <div className={cn(
                          "flex items-center gap-4 mt-4 pt-4 border-t",
                          isDark ? "border-white/5" : "border-gray-200"
                        )}>
                          <div className={cn(
                            "flex items-center gap-1.5 text-xs",
                            isDark ? "text-gray-400" : "text-gray-600"
                          )}>
                            <Users className="h-3.5 w-3.5" />
                            <span className={cn(
                              "font-medium",
                              isDark ? "text-white" : "text-gray-900"
                            )}>{job.applications_count || 0}</span>
                            <span>Applicants</span>
                          </div>
                          <div className={cn(
                            "flex items-center gap-1.5 text-xs",
                            isDark ? "text-gray-400" : "text-gray-600"
                          )}>
                            <Eye className="h-3.5 w-3.5" />
                            <span className={cn(
                              "font-medium",
                              isDark ? "text-white" : "text-gray-900"
                            )}>{job.views_count || 0}</span>
                            <span>Views</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={cn(
                      "col-span-2 py-12 text-center border border-dashed rounded-2xl",
                      isDark ? "border-white/10" : "border-gray-300"
                    )}>
                      <p className={cn(
                        "mb-4",
                        isDark ? "text-gray-500" : "text-gray-600"
                      )}>No active job postings</p>
                      <Button onClick={() => setShowPostJobModal(true)} className={cn(
                        "text-sm hover:underline",
                        isDark ? "text-lime-400" : "text-lime-600"
                      )}>
                        Create your first job posting
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Applicants */}
              <div className={cn(
                "p-5 lg:p-6 rounded-2xl lg:rounded-3xl h-full",
                isDark ? "bg-zinc-900/50 border border-white/5" : "bg-white border border-gray-200 shadow-sm"
              )}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className={cn(
                    "text-lg font-bold flex items-center gap-2",
                    isDark ? "text-white" : "text-gray-900"
                  )}>
                    <Users className={cn(
                      "h-5 w-5",
                      isDark ? "text-lime-400" : "text-lime-600"
                    )} />
                    Recent Applicants
                  </h2>
                  <Link to="/applicants" className={cn(
                    "text-sm transition-colors",
                    isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  )}>
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {recentApplicants.length > 0 ? (
                    recentApplicants.slice(0, 5).map((applicant) => (
                      <div key={applicant.id} className={cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-colors group",
                        isDark
                          ? "bg-black border border-white/5 hover:border-lime-400/30"
                          : "bg-gray-50 border border-gray-200 hover:border-lime-500/30"
                      )}>
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center text-sm border transition-colors",
                          isDark
                            ? "bg-zinc-800 border-white/5 group-hover:border-lime-400/50"
                            : "bg-gray-100 border-gray-200 group-hover:border-lime-500/50"
                        )}>
                          {applicant.profiles?.avatar_url ? (
                            <img src={applicant.profiles.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
                          ) : (
                            <span className={cn(
                              "transition-colors",
                              isDark
                                ? "text-gray-400 group-hover:text-white"
                                : "text-gray-600 group-hover:text-gray-900"
                            )}>
                              {applicant.profiles?.full_name?.[0] || 'A'}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={cn(
                            "text-sm font-medium truncate transition-colors",
                            isDark
                              ? "text-white group-hover:text-lime-400"
                              : "text-gray-900 group-hover:text-lime-600"
                          )}>
                            {applicant.profiles?.full_name || 'Unknown Applicant'}
                          </h4>
                          <p className={cn(
                            "text-xs truncate",
                            isDark ? "text-gray-500" : "text-gray-600"
                          )}>
                            {applicant.profiles?.headline || 'Software Engineer'}
                          </p>
                        </div>
                        <Button className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center transition-all",
                          isDark
                            ? "bg-white/5 hover:bg-lime-400 hover:text-black"
                            : "bg-gray-100 hover:bg-lime-500 hover:text-white"
                        )}>
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <p className={cn(
                        "text-sm",
                        isDark ? "text-gray-500" : "text-gray-600"
                      )}>No new applicants yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className={cn(
                "p-5 lg:p-6 rounded-2xl lg:rounded-3xl h-full",
                isDark ? "bg-zinc-900/50 border border-white/5" : "bg-white border border-gray-200 shadow-sm"
              )}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className={cn(
                    "text-lg font-bold flex items-center gap-2",
                    isDark ? "text-white" : "text-gray-900"
                  )}>
                    <Calendar className={cn(
                      "h-5 w-5",
                      isDark ? "text-lime-400" : "text-lime-600"
                    )} />
                    Events
                  </h2>
                  <Link to="/events" className={cn(
                    "text-sm transition-colors",
                    isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  )}>
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {events.length > 0 ? (
                    events.slice(0, 3).map((event) => (
                      <div key={event.id} className={cn(
                        "relative p-4 rounded-3xl overflow-hidden group",
                        isDark ? "bg-black shadow-lg border-white/5" : "bg-white border border-gray-200"
                      )}>
                        {/* <div className={cn(
                          "absolute top-0 left-0 w-1 h-full transition-colors",
                          isDark
                            ? "bg-lime-400/50 group-hover:bg-lime-400"
                            : "bg-lime-500/50 group-hover:bg-lime-500"
                        )} /> */}
                        <div className="pl-3">
                          <h4 className={cn(
                            "text-sm font-bold truncate mb-1",
                            isDark ? "text-white" : "text-gray-900"
                          )}>{event.title}</h4>
                          <div className={cn(
                            "flex items-center gap-3 text-xs",
                            isDark ? "text-gray-500" : "text-gray-600"
                          )}>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(event.event_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location || 'Remote'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <p className={cn(
                        "text-sm mb-2",
                        isDark ? "text-gray-500" : "text-gray-600"
                      )}>No upcoming events</p>
                      <Button onClick={() => setShowPostEventModal(true)} className={cn(
                        "text-xs hover:underline",
                        isDark ? "text-lime-400" : "text-lime-600"
                      )}>
                        Schedule an event
                      </Button>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Sidebar - Quick Actions & Followers */}
            <div className="lg:col-span-1 space-y-4 lg:space-y-6">

              {/* Quick Actions */}
              <div className={cn(
                "p-5 lg:p-6 rounded-2xl lg:rounded-3xl",
                isDark
                  ? "bg-gradient-to-br from-lime-400 to-lime-600 text-black"
                  : "bg-gradient-to-br from-lime-500 to-lime-600 text-white shadow-lg shadow-lime-500/30"
              )}>
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowPostJobModal(true)}
                    className="w-full p-3 rounded-xl bg-black/10 hover:bg-black/20 transition-colors flex items-center justify-between font-medium"
                  >
                    <span>Post a Job</span>
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setShowPostEventModal(true)}
                    className="w-full p-3 rounded-xl bg-black/10 hover:bg-black/20 transition-colors flex items-center justify-between font-medium"
                  >
                    <span>Create Event</span>
                    <Calendar className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Followers */}
              <div className={cn(
                "p-5 lg:p-6 rounded-2xl lg:rounded-3xl",
                isDark ? "bg-zinc-900/50 border border-white/5" : "bg-white border border-gray-200 shadow-sm"
              )}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className={cn(
                    "text-base font-bold",
                    isDark ? "text-white" : "text-gray-900"
                  )}>Followers</h2>
                  <Link to="/followers" className={cn(
                    "text-xs hover:underline",
                    isDark ? "text-lime-400 hover:text-lime-300" : "text-lime-600 hover:text-lime-700"
                  )}>
                    See All
                  </Link>
                </div>
                <div className="space-y-3">
                  {followers.length > 0 ? (
                    followers.slice(0, 5).map((follow) => (
                      <div key={follow.id} className="flex items-center gap-3">
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center text-xs border",
                          isDark
                            ? "bg-zinc-800 text-white border-white/10"
                            : "bg-gray-100 text-gray-900 border-gray-200"
                        )}>
                          {follow.follower?.full_name?.[0] || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm font-medium truncate",
                            isDark ? "text-white" : "text-gray-900"
                          )}>{follow.follower?.full_name}</p>
                        </div>
                        <Button className={cn(
                          "text-xs",
                          isDark ? "text-gray-500 hover:text-white" : "text-gray-600 hover:text-gray-900"
                        )}>
                          View
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className={cn(
                      "text-xs text-center py-4",
                      isDark ? "text-gray-500" : "text-gray-600"
                    )}>No followers yet</p>
                  )}
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>

      {/* Modals */}
      {showPostJobModal && (
        <div className={cn(
          "fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm p-4",
          isDark ? "bg-black/80" : "bg-black/60"
        )}>
          <div className={cn(
            "relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl",
            isDark ? "bg-zinc-900 border border-white/10" : "bg-white border border-gray-200"
          )}>
            <PostJob />
            <button
              onClick={() => setShowPostJobModal(false)}
              className={cn(
                "absolute top-4 right-4 p-2 rounded-full transition-colors",
                isDark
                  ? "bg-black/50 text-white hover:bg-white hover:text-black"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              )}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {showPostEventModal && (
        <div className={cn(
          "fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm p-4",
          isDark ? "bg-black/80" : "bg-black/60"
        )}>
          <div className={cn(
            "w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl",
            isDark ? "bg-zinc-900 border border-white/10" : "bg-white border border-gray-200"
          )}>
            <PostEventForm onClose={() => setShowPostEventModal(false)} />
          </div>
        </div>
      )}
    </PageLayout>
  );
}