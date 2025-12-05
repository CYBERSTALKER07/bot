import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Bookmark,
  MapPin,
  Briefcase,
  Users,
  Calendar,
  Building2,
  ArrowRight,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Hash,
  Search,
  Zap,
  DollarSign,
  Clock,
  MoreHorizontal
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
import { cn } from '../lib/cva';

// --- Types ---
interface JobPost {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  skills: string[];
  employer_id: string;
  created_at: string;
  salary_range?: string; // Added for UI
  match_score?: number;  // Added for UI
  logo_bg?: string;
}

// --- Loading Skeletons ---

const JobSkeleton = ({ isDark }: { isDark: boolean }) => (
  <div className={cn(
    "p-5 rounded-[24px] border animate-pulse h-full",
    isDark ? "bg-[#121212] border-white/5" : "bg-white border-black/5"
  )}>
    <div className="flex justify-between items-start mb-4">
      <div className="flex gap-3 w-full">
        <div className={cn("w-12 h-12 rounded-2xl shrink-0", isDark ? "bg-zinc-800" : "bg-gray-200")} />
        <div className="w-full space-y-2">
          <div className={cn("h-4 w-3/4 rounded", isDark ? "bg-zinc-800" : "bg-gray-200")} />
          <div className={cn("h-3 w-1/3 rounded", isDark ? "bg-zinc-800" : "bg-gray-200")} />
        </div>
      </div>
    </div>
    <div className={cn("h-3 w-1/2 rounded mb-6", isDark ? "bg-zinc-800" : "bg-gray-200")} />
    <div className="flex gap-2 mt-auto">
      <div className={cn("h-6 w-16 rounded-lg", isDark ? "bg-zinc-800" : "bg-gray-200")} />
      <div className={cn("h-6 w-16 rounded-lg", isDark ? "bg-zinc-800" : "bg-gray-200")} />
    </div>
  </div>
);

// --- Sub-Components ---

const StickyFilterBar = ({ isDark }: { isDark: boolean }) => {
  const filters = ["For you", "Remote", "Engineering", "Design", "Product", "Startups", "High Salary", "Contract"];
  const [active, setActive] = useState("For you");

  return (
    <div className={cn(
      "sticky top-[64px] z-30 py-4 -mx-4 px-4 sm:mx-0 sm:px-0 transition-all",
      // Glassmorphism effect that adapts to theme
      isDark
        ? "bg-black/80 backdrop-blur-xl border-b border-white/5"
        : "bg-[#FAFAFA]/80 backdrop-blur-xl border-b border-gray-200/50"
    )}>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border active:scale-95",
              active === filter
                ? "bg-[#D3FB52] text-black border-[#D3FB52] shadow-[0_0_15px_rgba(211,251,82,0.4)]"
                : isDark
                  ? "bg-zinc-900 border-white/10 text-gray-400 hover:text-white hover:bg-zinc-800"
                  : "bg-white border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50"
            )}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

const SpotlightCard = ({ job, isDark, navigate }: { job: JobPost, isDark: boolean, navigate: any }) => (
  <div
    onClick={() => navigate(`/job/${job.id}`)}
    className="relative w-full overflow-hidden rounded-[32px] p-1 mb-8 cursor-pointer group"
  >
    {/* Animated Border Gradient */}
    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 opacity-70 blur-xl group-hover:opacity-100 transition-opacity duration-500" />

    {/* Inner Card Content */}
    <div className={cn(
      "relative h-full w-full rounded-[30px] p-6 sm:p-8 overflow-hidden",
      isDark ? "bg-[#0f0f0f]" : "bg-white"
    )}>
      {/* Background decoration */}
      <div className={cn(
        "absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-20",
        isDark ? "bg-indigo-600" : "bg-blue-400"
      )} />

      <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D3FB52] text-black text-xs font-bold uppercase tracking-wider mb-5 shadow-lg shadow-[#D3FB52]/20">
            <Zap className="w-3 h-3 fill-current" /> Spotlight Opportunity
          </div>

          <h2 className={cn("text-3xl sm:text-4xl font-black mb-3 tracking-tight", isDark ? "text-white" : "text-gray-900")}>
            {job.title}
          </h2>

          <div className={cn("flex flex-wrap items-center gap-4 text-sm font-medium mb-8", isDark ? "text-gray-400" : "text-gray-600")}>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg">
              <Building2 className="w-4 h-4" /> {job.company}
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg">
              <MapPin className="w-4 h-4" /> {job.location}
            </div>
            <div className="flex items-center gap-2 bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-lg">
              <DollarSign className="w-4 h-4" /> {job.salary_range || "$120k - $160k"}
            </div>
          </div>

          <div className="flex gap-3">
            <button className={cn(
              "px-8 py-3.5 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg",
              isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
            )}>
              Apply Now
            </button>
            <button className={cn(
              "p-3.5 rounded-xl backdrop-blur-md transition-colors border",
              isDark ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-gray-50 border-gray-200 text-black hover:bg-gray-100"
            )}>
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Large Logo */}
        <div className={cn(
          "hidden md:flex w-28 h-28 rounded-[2rem] items-center justify-center text-5xl font-bold shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 border-4",
          isDark ? "bg-zinc-900 text-white border-zinc-800" : "bg-white text-black border-gray-50"
        )}>
          {job.company.charAt(0)}
        </div>
      </div>
    </div>
  </div>
);

const JobCard = ({ job, isDark, navigate }: { job: JobPost, isDark: boolean, navigate: any }) => (
  <div
    onClick={() => navigate(`/job/${job.id}`)}
    className={cn(
      "group relative p-5 rounded-[24px] border transition-all duration-300 cursor-pointer",
      "hover:-translate-y-1 hover:shadow-xl",
      isDark
        ? "bg-[#121212] border-white/5 hover:border-white/10 hover:shadow-black/50"
        : "bg-white border-black/5 hover:border-black/10 hover:shadow-gray-200/50"
    )}
  >
    {/* Top Row */}
    <div className="flex justify-between items-start mb-4">
      <div className="flex gap-3">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner transition-transform group-hover:scale-105",
          isDark ? "bg-zinc-800 text-white" : "bg-gray-50 text-gray-900 border border-gray-100"
        )}>
          {job.company.charAt(0)}
        </div>
        <div>
          <h3 className={cn("font-bold text-lg leading-tight line-clamp-1 group-hover:text-[#D3FB52] transition-colors", isDark ? "text-white" : "text-gray-900")}>
            {job.title}
          </h3>
          <p className={cn("text-xs font-medium", isDark ? "text-gray-500" : "text-gray-500")}>
            {job.company}
          </p>
        </div>
      </div>

      {/* Match Score Badge (New) */}
      <div className="flex flex-col items-end">
        <span className={cn(
          "text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1",
          (job.match_score || 0) > 80
            ? "bg-green-500/10 text-green-500"
            : "bg-yellow-500/10 text-yellow-500"
        )}>
          <Sparkles className="w-3 h-3 fill-current" />
          {job.match_score || 92}% Match
        </span>
      </div>
    </div>

    {/* Salary Info (Crucial UX) */}
    <div className="flex items-center gap-1.5 text-sm font-semibold mb-4">
      <DollarSign className={cn("w-4 h-4", isDark ? "text-gray-400" : "text-gray-400")} />
      <span className={cn(isDark ? "text-gray-200" : "text-gray-700")}>
        {job.salary_range || "$100k - $140k"}
      </span>
      <span className="text-gray-500 font-normal text-xs">/ year</span>
    </div>

    {/* Tags */}
    <div className="flex flex-wrap gap-2 mb-4">
      {[job.type, job.location].map((tag, i) => (
        <span key={i} className={cn(
          "px-2.5 py-1 rounded-lg text-xs font-medium border",
          isDark ? "bg-white/5 border-white/5 text-gray-400" : "bg-black/5 border-black/5 text-gray-600"
        )}>
          {tag}
        </span>
      ))}
    </div>

    {/* Footer */}
    <div className="pt-4 border-t border-dashed border-gray-200 dark:border-gray-800 flex justify-between items-center">
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
      </div>

      {/* Quick Actions on Hover */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className={cn("p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800", isDark ? "text-white" : "text-black")}>
          <Bookmark className="w-4 h-4" />
        </button>
        <button className={cn("p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800", isDark ? "text-white" : "text-black")}>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

const CompanyRow = ({ company, isDark, navigate }: any) => (
  <div
    onClick={() => navigate(`/company/${company.id}`)}
    className={cn(
      "flex items-center gap-4 p-3 rounded-2xl transition-all cursor-pointer group border border-transparent",
      isDark ? "hover:bg-white/5 hover:border-white/5" : "hover:bg-black/5 hover:border-black/5"
    )}
  >
    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold bg-white shadow-sm border border-gray-100 overflow-hidden")}>
      {company.logo_url ? <img src={company.logo_url} className="w-full h-full object-cover" /> : <span className="text-black">{company.name.charAt(0)}</span>}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className={cn("font-bold text-sm truncate group-hover:text-blue-500 transition-colors", isDark ? "text-white" : "text-gray-900")}>{company.name}</h4>
      <p className={cn("text-xs truncate", isDark ? "text-gray-500" : "text-gray-500")}>{company.industry || 'Technology'}</p>
    </div>
    <button className={cn(
      "px-3 py-1.5 rounded-full text-xs font-bold border transition-colors opacity-0 group-hover:opacity-100",
      isDark ? "border-gray-700 bg-white text-black" : "border-gray-200 bg-black text-white"
    )}>
      View
    </button>
  </div>
);

const TrendingTopic = ({ topic, count, isDark }: { topic: string, count: string, isDark: boolean }) => (
  <div className={cn("flex justify-between items-center py-3 border-b border-dashed last:border-0 group cursor-pointer", isDark ? "border-gray-800" : "border-gray-200")}>
    <div className="flex items-center gap-3">
      <div className={cn("p-2 rounded-lg transition-colors group-hover:bg-[#D3FB52] group-hover:text-black", isDark ? "bg-white/5 text-gray-400" : "bg-black/5 text-gray-600")}>
        <Hash className="w-4 h-4" />
      </div>
      <div>
        <p className={cn("text-sm font-bold group-hover:underline", isDark ? "text-white" : "text-gray-900")}>{topic}</p>
        <p className="text-xs text-gray-500">Trending in Tech</p>
      </div>
    </div>
    <div className="flex items-center gap-1 text-xs font-medium text-green-500">
      <TrendingUp className="w-3 h-3" />
      {count}
    </div>
  </div>
);

// --- Main Page Component ---

export default function ExplorePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();

  // Fetch Data
  const { jobs: jobsData = [], loading: jobsLoading } = useJobs();
  const { data: companiesData = [], isLoading: companiesLoading } = useRecommendedCompanies(6);
  const { data: profilesData = [], isLoading: profilesLoading } = useRecommendedUsers(user?.id, 3);
  const followUserMutation = useFollowUser();
  const unfollowUserMutation = useUnfollowUser();

  // Transform Jobs & Isolate Spotlight
  const { spotlightJob, otherJobs } = useMemo(() => {
    // In a real app, 'match_score' would come from backend. Here we mock it.
    const all = (jobsData as any[]).map((job) => ({
      ...job,
      has_liked: false,
      match_score: Math.floor(Math.random() * (99 - 80 + 1) + 80),
      salary_range: "$120k - $160k"
    }));

    if (all.length === 0) return { spotlightJob: null, otherJobs: [] };
    return { spotlightJob: all[0], otherJobs: all.slice(1, 7) }; // 1 spotlight + 6 grid items
  }, [jobsData]);

  return (
    <PageLayout className={cn(isDark ? 'bg-black text-white' : 'bg-gray-50 text-black')} maxWidth="full" padding="none">
      <div className={cn("min-h-screen w-full pb-20 pt-[80px] px-4 sm:px-6 lg:px-8 lg:pl-24", isDark ? "bg-black" : "bg-[#FAFAFA]")}>
        <div className="max-w-[1600px] mx-auto">

          {/* Page Header */}
          <div className="mb-2">
            <h1 className={cn("text-4xl font-black mb-2 tracking-tight", isDark ? "text-white" : "text-gray-900")}>Explore Opportunities</h1>
            <p className={cn("text-lg mb-6", isDark ? "text-gray-400" : "text-gray-500")}>
              Hand-picked jobs and companies based on your profile
            </p>

            {/* Sticky Filters */}
            <StickyFilterBar isDark={isDark} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">

            {/* === LEFT COLUMN: CONTENT (8 cols) === */}
            <div className="lg:col-span-8 space-y-10">

              {/* 1. Spotlight Hero */}
              {!jobsLoading && spotlightJob && (
                <SpotlightCard job={spotlightJob} isDark={isDark} navigate={navigate} />
              )}
              {jobsLoading && <div className="h-96 rounded-[32px] bg-gray-200 dark:bg-zinc-900 animate-pulse w-full mb-8" />}

              {/* 2. Recommended Jobs Grid */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={cn("text-2xl font-bold flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                    <Briefcase className="h-6 w-6 text-[#D3FB52]" />
                    Recommended Jobs
                  </h2>
                  <button onClick={() => navigate('/jobs')} className={cn("text-sm font-semibold hover:underline", isDark ? "text-gray-400" : "text-gray-600")}>
                    See all
                  </button>
                </div>

                {jobsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => <JobSkeleton key={i} isDark={isDark} />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {otherJobs.map((job) => (
                      <JobCard key={job.id} job={job} isDark={isDark} navigate={navigate} />
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Top Companies Section */}
              <div className={cn("p-8 rounded-[32px] border", isDark ? "bg-[#0A0A0A] border-white/5" : "bg-white border-black/5")}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={cn("text-xl font-bold flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                    <Building2 className="h-5 w-5 text-blue-500" />
                    Top Companies to Watch
                  </h2>
                  <button onClick={() => navigate('/companies')} className={cn("text-sm font-semibold hover:underline", isDark ? "text-gray-400" : "text-gray-600")}>
                    View directory
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {companiesLoading ? (
                    [...Array(6)].map((_, i) => <div key={i} className="h-16 bg-gray-100 dark:bg-zinc-900 rounded-2xl animate-pulse" />)
                  ) : (
                    companiesData && (companiesData as any[]).map((company) => (
                      <CompanyRow key={company.id} company={company} isDark={isDark} navigate={navigate} />
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* === RIGHT COLUMN: SIDEBAR (4 cols) === */}
            <div className="lg:col-span-4 space-y-6">

              {/* Premium Promo Card */}
              <div className="relative overflow-hidden rounded-[32px] p-8 group cursor-pointer" onClick={() => navigate('/premium')}>
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FF8C42] to-[#FF3C83] transition-transform duration-700 group-hover:scale-105" />
                <div className="relative z-10 text-white">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <Sparkles className="w-6 h-6 fill-white" />
                    </div>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase backdrop-blur-md">
                      Pro
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Upgrade to Pro</h3>
                  <p className="text-sm opacity-90 mb-6 font-medium leading-relaxed">
                    Get 3x more profile views and see who viewed your application.
                  </p>
                  <button className="w-full bg-white text-[#FF3C83] py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95">
                    Start Free Trial
                  </button>
                </div>
              </div>

              {/* Trending Topics Widget */}
              <div className={cn("p-6 rounded-[32px] border", isDark ? "bg-[#0A0A0A] border-white/5" : "bg-white border-black/5")}>
                <h3 className={cn("text-lg font-bold mb-4 flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                  <TrendingUp className="w-5 h-5 text-green-500" /> Trending Now
                </h3>
                <div>
                  <TrendingTopic topic="RemoteWork" count="12.5k" isDark={isDark} />
                  <TrendingTopic topic="AIJobs" count="8.2k" isDark={isDark} />
                  <TrendingTopic topic="Web3" count="5.1k" isDark={isDark} />
                  <TrendingTopic topic="DesignSystems" count="3.4k" isDark={isDark} />
                </div>
              </div>

              {/* Connect Widget */}
              <div className={cn("p-6 rounded-[32px] border", isDark ? "bg-[#0A0A0A] border-white/5" : "bg-white border-black/5")}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={cn("text-lg font-bold flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                    <Users className="w-5 h-5 text-purple-500" /> Who to follow
                  </h3>
                  <MoreHorizontal className="text-gray-400 w-5 h-5 cursor-pointer" />
                </div>

                <div className="space-y-4">
                  {profilesData && (profilesData as any[]).map((profile) => (
                    <div key={profile.id} className="flex items-center gap-3 group cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border-2 border-transparent group-hover:border-[#D3FB52] transition-colors">
                        <img src={profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("font-bold text-sm truncate group-hover:underline", isDark ? "text-white" : "text-gray-900")}>{profile.full_name}</p>
                        <p className="text-xs text-gray-500 truncate">@{profile.username}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (profile.is_following) unfollowUserMutation.mutate({ followingId: profile.id, followerId: user?.id || '' });
                          else followUserMutation.mutate({ followingId: profile.id, followerId: user?.id || '' });
                        }}
                        className={cn(
                          "p-2 rounded-full transition-all duration-200",
                          profile.is_following
                            ? (isDark ? "bg-white/10 text-white" : "bg-black/5 text-black")
                            : "bg-[#D3FB52] text-black hover:scale-110 shadow-lg shadow-[#D3FB52]/20"
                        )}
                      >
                        {profile.is_following ? <CheckCircle className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </PageLayout>
  );
}