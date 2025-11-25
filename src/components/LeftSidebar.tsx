import React from 'react';
import {
    Search,
    MapPin,
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
    <div className="space-y-6">
        <div className="rounded-3xl p-4 border border-gray-200 dark:border-[#1C1F20] h-64 animate-pulse bg-gray-100 dark:bg-gray-900" />
        <div className="rounded-3xl p-4 border border-gray-200 dark:border-[#1C1F20] h-32 animate-pulse bg-gray-100 dark:bg-gray-900" />
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
            "hidden lg:block w-[300px] pr-6 py-4 h-screen sticky top-0 overflow-y-auto scrollbar-hide",
            isDark ? 'bg-black border-r border-[#1C1F20]' : 'bg-white border-r border-gray-200'
        )}>
            <div className="space-y-6">
                {/* User Profile Quick View */}
                <div className="relative rounded-3xl p-4 text-white overflow-hidden group cursor-pointer transition-all hover:opacity-95">
                    {/* Cover Photo Background */}
                    {profileData.cover_image_url ? (
                        <img
                            src={profileData.cover_image_url}
                            alt="Cover"
                            className="absolute inset-0 w-full h-full object-cover rounded-3xl"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-linear-to-r from-gray-900 to-info-600 rounded-3xl" />
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

                {/* AI Career Assistant */}
                <div className={cn(
                    "rounded-3xl border p-4 transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900",
                    isDark ? 'bg-black border-[#1C1F20] text-white' : 'bg-white border-gray-200 text-black shadow-lg'
                )}>
                    <div className="flex items-center gap-2 mb-3">
                        <Search className="w-5 h-5 text-info-500" />
                        <h3 className="font-bold text-lg">WorkX AI Assistant</h3>
                    </div>
                    <p className={cn("text-sm mb-3", isDark ? "text-gray-400" : "text-gray-600")}>
                        Get personalized career guidance with the help of AI powered by Grok
                    </p>
                </div>

                {/* Trending Topics */}
                <div className={cn(
                    "rounded-3xl border overflow-hidden",
                    isDark ? 'bg-black border-[#1C1F20] text-white' : 'bg-white border-gray-200 text-black shadow-lg'
                )}>
                    <div className={cn("p-4 border-b", isDark ? "border-[#1C1F20]" : "border-gray-200")}>
                        <h3 className="font-bold text-xl">Trending</h3>
                    </div>
                    <div className={cn("divide-y", isDark ? "divide-gray-800" : "divide-gray-200")}>
                        {mostLikedPostsLoading ? (
                            <div className="text-center py-4 text-gray-500">Loading...</div>
                        ) : mostLikedPosts && mostLikedPosts.length > 0 ? (
                            mostLikedPosts.map((post, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "p-3 transition-colors cursor-pointer",
                                        isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-50'
                                    )}
                                    onClick={() => navigate(`/post/${post.id}`)}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-bold text-gray-500">Trending in Tech</span>
                                    </div>
                                    <p className="text-sm font-bold mb-1">{post.author.name}</p>
                                    <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-600")}>
                                        {post.content.slice(0, 60)}...
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500">No trending posts</div>
                        )}
                    </div>
                </div>

                {/* Matched Jobs */}
                <div className={cn(
                    "rounded-3xl border overflow-hidden",
                    isDark ? 'bg-black border-[#1C1F20] text-white' : 'bg-white border-gray-200 text-black shadow-xs'
                )}>
                    <div className={cn("p-4 border-b", isDark ? "border-[#1C1F20]" : "border-gray-200")}>
                        <h3 className="font-bold text-xl">Jobs for you</h3>
                    </div>
                    <div className="p-0">
                        {matchedJobsLoading ? (
                            <div className="text-center py-4 text-gray-500">Loading...</div>
                        ) : matchedJobs && matchedJobs.length > 0 ? (
                            matchedJobs.slice(0, 3).map((job: any, index: number) => (
                                <div
                                    key={job.id || index}
                                    className={cn(
                                        'p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all cursor-pointer border-b last:border-0',
                                        isDark ? 'border-[#1C1F20]' : 'border-gray-200'
                                    )}
                                    onClick={() => navigate(`/job/${job.id}`)}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-sm truncate">{job.title}</h4>
                                        {job.matchPercentage > 0 && (
                                            <span className="text-xs font-medium text-info-500">
                                                {job.matchPercentage}% match
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">{job.company}</p>

                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {job.location}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                <p className="text-sm">No matched jobs yet</p>
                            </div>
                        )}
                    </div>
                    <div className={cn("p-3 text-center hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors", isDark ? "border-t border-[#1C1F20]" : "border-t border-gray-200")}>
                        <button
                            onClick={() => navigate('/jobs')}
                            className="text-info-500 text-sm font-medium"
                        >
                            Show more
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default LeftSidebar;
