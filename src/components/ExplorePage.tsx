import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Bookmark,
  MapPin,
  DollarSign,
  Briefcase,
  Users,
  Calendar,
  Building2,
  AtSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  useRecommendedUsers,
  useRecommendedCompanies,
  useEmployerEvents,
  useFollowUser,
  useUnfollowUser
} from '../hooks/useOptimizedQuery';
import { useJobs } from '../hooks/useJobs';
import Button from './ui/Button';
import PageLayout from './ui/PageLayout';
import AnimatedList from './AnimatedList';
import { cn } from '../lib/cva';

interface JobPost {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary_range?: string;
  description: string;
  skills: string[];
  is_remote: boolean;
  created_at: string;
  employer_id: string;
  has_liked: boolean;
  likes_count: number;
  has_bookmarked: boolean;
  employer?: {
    id: string;
    name: string;
    avatar_url?: string;
    company_name?: string;
    verified?: boolean;
  };
}

interface CompanyData {
  id: string;
  name: string;
  logo_url?: string;
  industry?: string;
  location?: string;
  description?: string;
  website?: string;
  size?: string;
}

interface ProfileData {
  id: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  verified?: boolean;
  bio?: string;
  is_following?: boolean;
}

interface EventData {
  id: string;
  title: string;
  event_date?: string;
  event_type?: string;
  employer?: {
    id: string;
    name: string;
    company_name?: string;
    avatar_url?: string;
  };
  attendees_count?: number;
  description?: string;
}

interface RawJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary_range?: string;
  description: string;
  skills?: string[];
  is_remote: boolean;
  created_at: string;
  employer_id: string;
  employer?: {
    id: string;
    name: string;
    avatar_url?: string;
    company_name?: string;
    verified?: boolean;
  };
}

export default function ExplorePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();

  // Fetch data
  const { jobs: jobsData = [], loading: jobsLoading } = useJobs();
  const { data: companiesData = [], isLoading: companiesLoading } = useRecommendedCompanies(100);
  const { data: profilesData = [], isLoading: profilesLoading } = useRecommendedUsers(user?.id, 50);
  const { data: eventsData = [], isLoading: eventsLoading } = useEmployerEvents();
  const followUserMutation = useFollowUser();
  const unfollowUserMutation = useUnfollowUser();

  // Transform jobs
  const jobPosts = useMemo((): JobPost[] => {
    return (jobsData as RawJob[]).map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary_range: job.salary_range,
      description: job.description,
      skills: job.skills || [],
      is_remote: job.is_remote,
      created_at: job.created_at,
      employer_id: job.employer_id,
      has_liked: false,
      likes_count: Math.floor(Math.random() * 100),
      has_bookmarked: false,
      employer: job.employer
    }));
  }, [jobsData]);

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'now';
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  return (
    <PageLayout
      className={cn(isDark ? 'bg-black text-white' : 'bg-white text-black')}
      maxWidth="full"
      padding="none"
    >
      <div className={cn(
        'min-h-screen w-full',
        isDark ? 'bg-black' : 'bg-white',
        'pb-20 lg:pb-0 pt-16 lg:pt-20'
      )}>
        <main className={cn('max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8')}>
          {/* Header */}
          {/* <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Discover</h1>
            <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
              Find opportunities, companies, people and events all in one place
            </p>
          </div> */}

          {/* Jobs For You - Grid Layout */}
          <div className={cn(
            'rounded-2xl p-4 lg:p-6 mb-6 lg:mb-8 border',
            isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
          )}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Jobs For You
              </h2>
              <button
                onClick={() => navigate('/jobs')}
                className={cn(
                  'text-xs sm:text-sm font-semibold whitespace-nowrap hover:underline',
                  isDark ? 'text-white' : 'text-black'
                )}
              >
                View all
              </button>
            </div>
            {jobsLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading jobs...</p>
              </div>
            ) : jobPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {jobPosts.slice(0, 6).map((job) => (
                  <div
                    key={job.id}
                    className={cn(
                      'rounded-xl p-3 sm:p-4 border transition-all cursor-pointer',
                      isDark
                        ? 'bg-black border-gray-800 hover:border-gray-600 hover:shadow-lg'
                        : 'bg-white border-gray-200 hover:border-gray-400 hover:shadow-lg'
                    )}
                    onClick={() => navigate(`/job/${job.id}`)}
                  >
                    {/* Card Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className={cn(
                        'w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold shrink-0',
                        isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
                      )}>
                        {job.company.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm sm:text-base truncate">{job.title}</h3>
                        <p className={cn('text-xs sm:text-sm truncate', isDark ? 'text-gray-400' : 'text-gray-600')}>
                          {job.company}
                        </p>
                      </div>
                    </div>

                    {/* Location & Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.location && (
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs flex items-center gap-1 border',
                          isDark ? 'bg-gray-900 text-gray-300 border-gray-800' : 'bg-gray-100 text-gray-700 border-gray-200'
                        )}>
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                      )}
                      {job.type && (
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-semibold border',
                          isDark ? 'bg-white/10 text-white border-gray-700' : 'bg-black/5 text-black border-gray-300'
                        )}>
                          {job.type}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className={cn('text-xs sm:text-sm line-clamp-2 mb-2', isDark ? 'text-gray-400' : 'text-gray-600')}>
                      {job.description}
                    </p>

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.skills.slice(0, 2).map((skill, i) => (
                          <span key={i} className={cn(
                            'px-2 py-0.5 rounded text-xs border',
                            isDark ? 'bg-gray-900 text-gray-300 border-gray-800' : 'bg-gray-100 text-gray-700 border-gray-200'
                          )}>
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 2 && (
                          <span className={cn('px-2 py-0.5 rounded text-xs font-medium', isDark ? 'text-gray-500' : 'text-gray-500')}>
                            +{job.skills.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 sm:pt-3 border-t" style={{ borderColor: isDark ? 'rgb(31, 41, 55)' : 'rgb(229, 231, 235)' }}>
                      <Button
                        variant="text"
                        size="small"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        title="Like this job"
                        className={cn(
                          'flex-1 flex items-center justify-center gap-1 rounded-lg text-xs transition-colors',
                          isDark ? 'text-gray-400 hover:text-white hover:bg-gray-900' : 'text-gray-600 hover:text-black hover:bg-gray-100'
                        )}
                      >
                        <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        title="Bookmark"
                        className={cn(
                          'flex-1 flex items-center justify-center gap-1 rounded-lg text-xs transition-colors',
                          isDark ? 'text-gray-400 hover:text-white hover:bg-gray-900' : 'text-gray-600 hover:text-black hover:bg-gray-100'
                        )}
                      >
                        <Bookmark className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        className={cn(
                          'flex-1 text-xs px-2 sm:px-3 py-1 sm:py-2 rounded-full font-bold transition-colors',
                          'bg-[#D3FB52] text-black hover:bg-[#D3FB52]/90'
                        )}
                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); navigate(`/job/${job.id}`); }}
                        title="View job details"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={cn('flex flex-col items-center justify-center py-8', isDark ? 'text-gray-400' : 'text-gray-600')}>
                <Briefcase className="h-8 w-8 mb-3 opacity-50" />
                <p className="font-medium text-sm mb-1">No jobs found</p>
              </div>
            )}
          </div>

          {/* Companies & Events in 2-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
            {/* Companies - 2/3 */}
            <div className={cn(
              'lg:col-span-2 rounded-2xl p-4 lg:p-6 border',
              isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
            )}>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Featured Companies
                </h2>
                <button
                  onClick={() => navigate('/companies')}
                  className={cn(
                    'text-xs sm:text-sm font-semibold whitespace-nowrap hover:underline',
                    isDark ? 'text-white' : 'text-black'
                  )}
                >
                  View all
                </button>
              </div>
              {companiesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading companies...</p>
                </div>
              ) : companiesData && companiesData.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  <AnimatedList
                    items={(companiesData as CompanyData[])}
                    maxHeight="600px"
                    width="100%"
                    showGradients={true}
                    enableArrowNavigation={true}
                    displayScrollbar={true}
                    renderItem={(company: CompanyData) => (
                      <div className={cn(
                        'rounded-xl p-3 sm:p-4 border transition-all cursor-pointer',
                        isDark ? 'bg-black border-gray-800 hover:border-gray-600 hover:shadow-lg' : 'bg-white border-gray-200 hover:border-gray-400 hover:shadow-lg'
                      )} onClick={() => navigate(`/company/${company.id}`)}>
                        <div className="flex items-start gap-3">
                          <div className="shrink-0">
                            {company.logo_url ? (
                              <img src={company.logo_url} alt={company.name} className="w-12 h-12 rounded-xl object-cover" />
                            ) : (
                              <div className={cn(
                                'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm',
                                isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
                              )}>
                                {company.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm sm:text-base truncate">{company.name}</h3>
                            {company.industry && (
                              <p className={cn('text-xs sm:text-sm truncate', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                {company.industry}
                              </p>
                            )}
                            {company.location && (
                              <p className={cn('text-xs flex items-center gap-1 mt-1', isDark ? 'text-gray-500' : 'text-gray-500')}>
                                <MapPin className="h-3 w-3" />
                                {company.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
              ) : (
                <div className={cn('flex flex-col items-center justify-center py-8', isDark ? 'text-gray-400' : 'text-gray-600')}>
                  <Building2 className="h-8 w-8 mb-3 opacity-50" />
                  <p className="font-medium text-sm mb-1">No companies found</p>
                </div>
              )}
            </div>

            {/* Upcoming Events - 1/3 */}
            <div className={cn(
              'lg:col-span-1 rounded-2xl p-4 lg:p-6 border',
              isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
            )}>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Events
                </h2>
                <button
                  onClick={() => navigate('/events')}
                  className={cn(
                    'text-xs sm:text-sm font-semibold whitespace-nowrap hover:underline',
                    isDark ? 'text-white' : 'text-black'
                  )}
                >
                  View all
                </button>
              </div>
              {eventsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading events...</p>
                </div>
              ) : eventsData && eventsData.length > 0 ? (
                <div className="space-y-3">
                  <AnimatedList
                    items={(eventsData as EventData[])}
                    maxHeight="600px"
                    width="100%"
                    showGradients={true}
                    enableArrowNavigation={true}
                    displayScrollbar={false}
                    renderItem={(event: EventData) => (
                      <div className={cn(
                        'rounded-xl p-3 sm:p-4 border transition-all cursor-pointer',
                        isDark ? 'bg-black border-gray-800 hover:border-gray-600 hover:shadow-lg' : 'bg-white border-gray-200 hover:border-gray-400 hover:shadow-lg'
                      )} onClick={() => navigate(`/event/${event.id}`)}>
                        <div className="flex items-start gap-3">
                          <div className="shrink-0">
                            {event.employer?.avatar_url ? (
                              <img src={event.employer.avatar_url} alt={event.employer.name} className="w-10 h-10 rounded-xl object-cover" />
                            ) : (
                              <div className={cn(
                                'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm',
                                isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
                              )}>
                                {event.employer?.name?.charAt(0) || '📅'}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-xs sm:text-sm truncate">{event.title}</h3>
                            <p className={cn('text-xs truncate', isDark ? 'text-gray-400' : 'text-gray-600')}>
                              {event.employer?.company_name || event.employer?.name || 'Unknown'}
                            </p>
                            {event.event_date && (
                              <p className={cn('text-xs flex items-center gap-1 mt-1', isDark ? 'text-gray-500' : 'text-gray-500')}>
                                <Calendar className="h-3 w-3" />
                                {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
              ) : (
                <div className={cn('flex flex-col items-center justify-center py-8', isDark ? 'text-gray-400' : 'text-gray-600')}>
                  <Calendar className="h-8 w-8 mb-3 opacity-50" />
                  <p className="font-medium text-sm mb-1">No events</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section - 2 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Column - Who to Follow (Smaller) */}
            <div className={cn(
              'rounded-2xl p-4 lg:p-6 border',
              isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
            )}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Who to Follow
                </h2>
                <button
                  onClick={() => navigate('/people')}
                  className={cn(
                    'text-xs font-semibold whitespace-nowrap hover:underline',
                    isDark ? 'text-white' : 'text-black'
                  )}
                >
                  View all
                </button>
              </div>
              {profilesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading...</p>
                </div>
              ) : profilesData && profilesData.length > 0 ? (
                <div className="space-y-3">
                  {(profilesData as ProfileData[]).slice(0, 4).map((profile: ProfileData) => (
                    <div key={profile.id} className={cn(
                      'p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3',
                      isDark
                        ? 'border-gray-800 hover:bg-gray-900'
                        : 'border-gray-200 hover:bg-gray-50'
                    )}>
                      {/* Avatar */}
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.full_name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0',
                          isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
                        )}>
                          {profile.full_name.charAt(0)}
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-0.5">
                          <h3 className="font-bold text-sm truncate">{profile.full_name}</h3>
                          {profile.verified && (
                            <svg className="w-3.5 h-3.5 text-[#D3FB52] fill-current shrink-0" viewBox="0 0 24 24">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <p className={cn('text-xs truncate', isDark ? 'text-gray-400' : 'text-gray-600')}>
                          @{profile.username}
                        </p>
                      </div>

                      {/* Follow Button */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (profile.is_following) {
                            unfollowUserMutation.mutate({ followingId: profile.id, followerId: user?.id || '' });
                          } else {
                            followUserMutation.mutate({ followingId: profile.id, followerId: user?.id || '' });
                          }
                        }}
                        className={cn(
                          'px-4 py-1.5 rounded-full font-bold text-xs transition-colors shrink-0',
                          profile.is_following
                            ? isDark ? 'bg-transparent text-white border border-gray-700 hover:bg-gray-900' : 'bg-transparent text-black border border-gray-300 hover:bg-gray-100'
                            : 'bg-[#D3FB52] text-black hover:bg-[#D3FB52]/90'
                        )}
                      >
                        {profile.is_following ? 'Following' : 'Follow'}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={cn('flex flex-col items-center justify-center py-8', isDark ? 'text-gray-400' : 'text-gray-600')}>
                  <Users className="h-8 w-8 mb-3 opacity-50" />
                  <p className="font-medium text-sm">No profiles found</p>
                </div>
              )}
            </div>

            {/* Right Column - Promotional Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Premium Subscription Card */}
              <div className="rounded-2xl h-[450px] p-6 bg-gradient-to-br from-[#D3FB52] via-[#FFB84D] to-[#FF8C42] text-black overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <h3 className="text-xl font-bold">Go Premium</h3>
                  </div>
                  <p className="text-sm mb-4 opacity-90">
                    Unlock exclusive features, advanced analytics, and priority support. Stand out from the crowd!
                  </p>
                  <button
                    onClick={() => navigate('/premium')}
                    className="w-full bg-black text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-900 transition-colors"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>

              {/* Another Card - Purple Gradient */}
              <div className="rounded-2xl h-[450px] p-6 bg-gradient-to-br from-[#A78BFA] via-[#C084FC] to-[#E879F9] text-white overflow-hidden relative"></div>
              {/* Upcoming Events Card */}
              <div className={cn(
                'rounded-2xl p-6 border',
                isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
              )}>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-[#FF8C42]" />
                  <h3 className="text-lg font-bold">Upcoming Events</h3>
                </div>
                <div className="space-y-3">
                  {eventsData && (eventsData as EventData[]).slice(0, 3).map((event: EventData) => (
                    <div
                      key={event.id}
                      onClick={() => navigate(`/event/${event.id}`)}
                      className={cn(
                        'p-3 rounded-xl border cursor-pointer transition-all',
                        isDark ? 'border-gray-800 hover:bg-gray-900' : 'border-gray-200 hover:bg-gray-50'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm',
                          'bg-gradient-to-br from-[#FF8C42] to-[#FFB84D] text-white'
                        )}>
                          {event.event_date ? new Date(event.event_date).getDate() : '📅'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm truncate mb-1">{event.title}</h4>
                          <p className={cn('text-xs truncate', isDark ? 'text-gray-400' : 'text-gray-600')}>
                            {event.employer?.company_name || event.employer?.name}
                          </p>
                          {event.event_date && (
                            <p className={cn('text-xs mt-1', isDark ? 'text-gray-500' : 'text-gray-500')}>
                              {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/events')}
                  className={cn(
                    'w-full mt-4 px-4 py-2 rounded-full font-bold text-sm transition-colors border',
                    isDark
                      ? 'border-gray-700 text-white hover:bg-gray-900'
                      : 'border-gray-300 text-black hover:bg-gray-100'
                  )}
                >
                  View All Events
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageLayout>
  );
}
