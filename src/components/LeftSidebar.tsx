import React from 'react';
import {
    Search,
    MapPin,
    TrendingUp,
    Briefcase,
    Sparkles
} from 'lucide-react';
import { cn } from '../lib/cva';

interface ProfileData {
    id?: string;
    username?: string;
    full_name?: string;
    bio?: string;
    avatar_url?: string;
    cover_image_url?: string;
    website?: string;
    role?: 'student' | 'employer' | 'admin';
    company_name?: string;
    location?: string;
    created_at?: string;
    skills?: string[];
    portfolio_url?: string;
}

interface ProfileStats {
    following: number;
    followers: number;
    posts: number;
}

interface LeftSidebarProps {
    isDark: boolean;
    user: any;
    profileData: ProfileData;
    profileStats: ProfileStats;
    mostLikedPosts: any[];
    mostLikedPostsLoading: boolean;
    matchedJobs: any[];
    matchedJobsLoading: boolean;
    navigate: (path: string) => void;
}

export const LeftSidebarSkeleton = () => (
    <div className="space-y-6 hidden lg:block w-[300px]">
        <div className="rounded-3xl p-4 border border-gray-200 dark:border-[#1C1F20] h-48 animate-pulse bg-gray-100 dark:bg-gray-900" />
        <div className="rounded-3xl p-4 border border-gray-200 dark:border-[#1C1F20] h-24 animate-pulse bg-gray-100 dark:bg-gray-900" />
        <div className="rounded-3xl p-4 border border-gray-200 dark:border-[#1C1F20] h-64 animate-pulse bg-gray-100 dark:bg-gray-900" />
    </div>
);

const LeftSidebar: React.FC<LeftSidebarProps> = ({
    isDark,
    user,
    profileData,
    profileStats,
    mostLikedPosts,
    mostLikedPostsLoading,
    matchedJobs,
    matchedJobsLoading,
    navigate,
}) => {
    return (
        <aside className={cn(
            "hidden lg:block w-[300px] pr-6 py-4 h-screen sticky top-0 overflow-y-auto no-scrollbar",
            isDark ? 'bg-black border-r border-[#1C1F20]' : 'bg-white border-r border-gray-200'
        )}>
            <div className="space-y-5">

                {/* 1. User Profile Quick View (Restored) */}
                <div className="relative rounded-3xl p-4 text-white overflow-hidden group cursor-pointer transition-all hover:opacity-95">
                    {/* Cover Photo Background */}
                    {profileData.cover_image_url ? (
                        <img
                            src={profileData.cover_image_url}
                            alt="Cover"
                            className="absolute inset-0 w-full h-full object-cover rounded-3xl"
                        />
                    ) : (
                        // Fixed typo: bg-linear-to-r -> bg-gradient-to-r
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-blue-600 rounded-3xl" />
                    )}

                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/40 rounded-3xl" />

                    {/* Content */}
                    <div className="relative z-10" onClick={() => navigate(`/profile/${user?.id}`)}>
                        <div className="flex items-center gap-3 mb-4">
                            {profileData.avatar_url ? (
                                <img
                                    src={profileData.avatar_url}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full border-2 border-white object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full border-2 border-white bg-white/20 flex items-center justify-center text-white font-bold">
                                    {(profileData.full_name || user?.name || 'U').charAt(0)}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-sm truncate">
                                    {profileData.full_name || user?.name || 'User'}
                                </h3>
                                <p className="text-white/80 text-xs truncate">
                                    @{profileData.username || 'username'}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-center hover:bg-white/10 rounded p-1 transition-colors">
                                <div className="font-bold">{profileStats.followers}</div>
                                <div className="text-white/80">Followers</div>
                            </div>
                            <div className="text-center hover:bg-white/10 rounded p-1 transition-colors">
                                <div className="font-bold">{profileStats.following}</div>
                                <div className="text-white/80">Following</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. AI Career Assistant */}
                <div
                    className={cn(
                        "rounded-3xl p-5 transition-all cursor-pointer group border relative overflow-hidden",
                        isDark
                            ? 'bg-gradient-to-br from-[#1C1F20] to-black border-[#1C1F20] hover:border-gray-700'
                            : 'bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200'
                    )}
                >
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all" />

                    <div className="flex items-center gap-3 mb-2 relative z-10">
                        <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <h3 className={cn("font-bold text-base", isDark ? "text-white" : "text-gray-900")}>WorkX AI</h3>
                    </div>
                    <p className={cn("text-xs leading-relaxed relative z-10", isDark ? "text-gray-400" : "text-gray-500")}>
                        Analyze your profile and get personalized career advice powered by Grok 3.
                    </p>
                </div>

                {/* 3. Trending Topics */}
                <div className={cn(
                    "rounded-3xl border overflow-hidden",
                    isDark ? 'bg-black border-[#1C1F20]' : 'bg-white border-gray-200 shadow-sm'
                )}>
                    <div className={cn("p-4 border-b flex items-center gap-2", isDark ? "border-[#1C1F20]" : "border-gray-100")}>
                        <TrendingUp className={cn("w-4 h-4", isDark ? "text-gray-400" : "text-gray-500")} />
                        <h3 className={cn("font-bold text-sm uppercase tracking-wider", isDark ? "text-white" : "text-gray-900")}>Trending</h3>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
                        {mostLikedPostsLoading ? (
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 animate-pulse" />
                            </div>
                        ) : mostLikedPosts && mostLikedPosts.length > 0 ? (
                            mostLikedPosts.slice(0, 4).map((post, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "p-4 transition-colors cursor-pointer group",
                                        isDark ? 'hover:bg-[#1C1F20]' : 'hover:bg-gray-50'
                                    )}
                                    onClick={() => navigate(`/post/${post.id}`)}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                                            Trending in {post.topic || 'General'}
                                        </span>
                                    </div>
                                    <p className={cn("text-sm font-bold mb-1 line-clamp-2 leading-tight group-hover:underline", isDark ? "text-gray-200" : "text-gray-800")}>
                                        {post.content}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {post.likes_count || 0} likes
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-sm text-gray-500">No trending topics yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. Matched Jobs */}
                <div className={cn(
                    "rounded-3xl border overflow-hidden",
                    isDark ? 'bg-black border-[#1C1F20]' : 'bg-white border-gray-200 shadow-sm'
                )}>
                    <div className={cn("p-4 border-b flex items-center gap-2", isDark ? "border-[#1C1F20]" : "border-gray-100")}>
                        <Briefcase className={cn("w-4 h-4", isDark ? "text-gray-400" : "text-gray-500")} />
                        <h3 className={cn("font-bold text-sm uppercase tracking-wider", isDark ? "text-white" : "text-gray-900")}>Jobs for you</h3>
                    </div>

                    <div>
                        {matchedJobsLoading ? (
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 animate-pulse" />
                            </div>
                        ) : matchedJobs && matchedJobs.length > 0 ? (
                            matchedJobs.slice(0, 3).map((job: any, index: number) => (
                                <div
                                    key={job.id || index}
                                    className={cn(
                                        'p-4 hover:bg-gray-50 dark:hover:bg-[#1C1F20] transition-all cursor-pointer border-b last:border-0 border-gray-100 dark:border-gray-800',
                                    )}
                                    onClick={() => navigate(`/job/${job.id}`)}
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <h4 className={cn("font-bold text-sm truncate pr-2", isDark ? "text-gray-200" : "text-gray-800")}>
                                            {job.title}
                                        </h4>
                                        {job.matchPercentage > 0 && (
                                            <span className={cn(
                                                "text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0",
                                                job.matchPercentage >= 80
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                            )}>
                                                {job.matchPercentage}%
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2 font-medium">{job.company}</p>

                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <MapPin className="h-3 w-3" />
                                        <span className="truncate max-w-[150px]">{job.location}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-gray-500">
                                <p className="text-sm">No matched jobs found</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => navigate('/jobs')}
                        className={cn(
                            "w-full py-3 text-center text-xs font-bold uppercase tracking-wider transition-colors",
                            isDark
                                ? "text-gray-400 hover:text-white hover:bg-[#1C1F20]"
                                : "text-gray-500 hover:text-blue-600 hover:bg-gray-50"
                        )}
                    >
                        View all jobs
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default LeftSidebar;