import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, ArrowRight, Sparkles, Briefcase, Building2 } from 'lucide-react';
import { cn } from '../lib/cva';
import Button from './ui/Button';
import Avatar from './ui/Avatar';
import { Card } from './ui/Card';

interface ExploreFeedProps {
    isDark: boolean;
    jobs: any[];
    recommendedUsers: any[];
    recommendedCompanies: any[];
    matchedJobs: any[];
}

export default function ExploreFeed({
    isDark,
    jobs,
    recommendedUsers,
    recommendedCompanies,
    matchedJobs
}: ExploreFeedProps) {
    const navigate = useNavigate();

    return (
        <div className="pb-24 space-y-8 p-4 md:p-6 animate-fade-in">
            {/* 1. Hero Section */}
            <div className={cn(
                "rounded-[32px] p-8 md:p-10 relative overflow-hidden transition-all duration-500 hover:shadow-2xl",
                isDark
                    ? "bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-black border border-white/10 shadow-lg shadow-purple-900/20"
                    : "bg-gradient-to-br from-indigo-50 via-purple-50 to-white border border-gray-100 shadow-xl shadow-indigo-100"
            )}>
                <div className="relative z-10 max-w-2xl">
                    <h1 className={cn(
                        "text-3xl md:text-4xl font-serif font-bold mb-3 tracking-tight",
                        isDark ? "text-white" : "text-gray-900"
                    )}>
                        Discover Your Next Opportunity
                    </h1>
                    <p className={cn(
                        "text-lg mb-8 leading-relaxed",
                        isDark ? "text-gray-300" : "text-gray-600"
                    )}>
                        Explore tailored jobs, connect with industry leaders, and find companies that match your values.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            className={cn("rounded-full px-8 py-3 font-bold text-base  text-black hover:bg-gray-100 hover:scale-105 transition-all shadow-lg", isDark ? "bg-white text-black" : "bg-black text-gray-900")}
                            onClick={() => navigate('/jobs')}
                        >
                            Browse Jobs
                        </Button>
                        <Button
                            variant="ghost"
                            className={cn(
                                "rounded-full px-8 py-3 font-bold text-base border backdrop-blur-sm transition-all hover:scale-105",
                                isDark
                                    ? "border-white/20 text-white hover:bg-white/10"
                                    : "border-gray-300 text-gray-900 hover:bg-white/50"
                            )}
                            onClick={() => navigate('/companies')}
                        >
                            View Companies
                        </Button>
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />
            </div>

            {/* 2. Featured Jobs - Horizontal Scroll */}
            <div>
                <div className="flex items-center justify-between mb-6 px-2">
                    <h2 className={cn(
                        "text-2xl font-bold flex items-center gap-2",
                        isDark ? "text-white" : "text-gray-900"
                    )}>
                        <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />
                        Top Picks for You
                    </h2>
                    <button
                        onClick={() => navigate('/jobs')}
                        className={cn("text-sm font-bold hover:underline", isDark ? "text-indigo-400" : "text-indigo-600")}
                    >
                        See all
                    </button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-hide -mx-4 px-4 snap-x">
                    {(matchedJobs.length > 0 ? matchedJobs : jobs.slice(0, 5)).map((job, index) => (
                        <div
                            key={job.id || index}
                            onClick={() => navigate(`/job/${job.id}`)}
                            className={cn(
                                "min-w-[300px] max-w-[300px] p-6 rounded-[24px] border cursor-pointer transition-all duration-300 hover:-translate-y-1 snap-center",
                                isDark
                                    ? "bg-gray-900/60 border-white/5 hover:border-white/10 hover:shadow-xl hover:shadow-black/50"
                                    : "bg-white border-gray-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/50"
                            )}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-xl shadow-md",
                                    "bg-gradient-to-br from-indigo-500 to-purple-600"
                                )}>
                                    {job.company?.charAt(0) || '💼'}
                                </div>
                                {job.matchPercentage && (
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-xs font-bold border",
                                        isDark
                                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                                            : "bg-green-50 text-green-600 border-green-200"
                                    )}>
                                        {job.matchPercentage}% Match
                                    </span>
                                )}
                            </div>

                            <h3 className={cn("font-bold text-xl mb-1 truncate", isDark ? "text-white" : "text-gray-900")}>
                                {job.title}
                            </h3>
                            <p className={cn("text-sm font-medium mb-4 truncate", isDark ? "text-gray-400" : "text-gray-500")}>
                                {job.company}
                            </p>

                            <div className="space-y-2.5">
                                <div className={cn("flex items-center text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
                                    <MapPin className="w-4 h-4 mr-2.5 opacity-70" />
                                    {job.location}
                                </div>
                                <div className={cn("flex items-center text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
                                    <DollarSign className="w-4 h-4 mr-2.5 opacity-70" />
                                    {job.salary_range || 'Competitive'}
                                </div>
                                <div className={cn("flex items-center text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
                                    <Briefcase className="w-4 h-4 mr-2.5 opacity-70" />
                                    {job.type}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Recommended People */}
            <div className={cn(
                "rounded-[32px] p-6 md:p-8 border relative overflow-hidden",
                isDark ? "bg-[#0C0C0E] border-white/5" : "bg-white border-gray-100 shadow-sm"
            )}>
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <h2 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                        People You Should Know
                    </h2>
                    <button
                        className={cn("p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors")}
                    >
                        <ArrowRight className={cn("w-5 h-5", isDark ? "text-gray-400" : "text-gray-600")} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                    {recommendedUsers.slice(0, 4).map((user) => (
                        <div
                            key={user.id}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer border",
                                isDark
                                    ? "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
                                    : "bg-gray-50 border-transparent hover:bg-white hover:border-gray-200 hover:shadow-md"
                            )}
                            onClick={() => navigate(`/profile/${user.id}`)}
                        >
                            <Avatar
                                src={user.avatar_url}
                                alt={user.full_name}
                                size="md"
                                className="ring-2 ring-transparent group-hover:ring-offset-2 transition-all"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <h4 className={cn("font-bold text-base truncate", isDark ? "text-white" : "text-gray-900")}>
                                        {user.full_name}
                                    </h4>
                                    {user.verified && (
                                        <span className="text-blue-500 text-xs bg-blue-500/10 rounded-full px-1">✓</span>
                                    )}
                                </div>
                                <p className={cn("text-xs truncate font-medium", isDark ? "text-gray-400" : "text-gray-500")}>
                                    @{user.username}
                                </p>
                                {user.bio && (
                                    <p className={cn("text-xs truncate mt-1 opacity-80", isDark ? "text-gray-500" : "text-gray-600")}>
                                        {user.bio}
                                    </p>
                                )}
                            </div>
                            <Button
                                size="small"
                                variant="outlined"
                                className={cn(
                                    "rounded-full px-4 font-bold text-xs h-8",
                                    isDark ? "border-gray-600 text-gray-300 hover:text-white hover:border-white" : "border-gray-300 hover:border-black hover:bg-black hover:text-white"
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle follow
                                }}
                            >
                                Follow
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Trending Companies */}
            <div>
                <div className="flex items-center justify-between mb-6 px-2">
                    <h2 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                        Trending Companies
                    </h2>
                    <button
                        onClick={() => navigate('/companies')}
                        className={cn("text-sm font-bold hover:underline", isDark ? "text-gray-400" : "text-gray-600")}
                    >
                        View all
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {recommendedCompanies.slice(0, 3).map((company, index) => (
                        <div
                            key={company.id || index}
                            onClick={() => navigate(`/company/${company.id}`)}
                            className={cn(
                                "group p-5 rounded-[24px] border text-center cursor-pointer transition-all duration-300 hover:-translate-y-1",
                                isDark
                                    ? "bg-gray-900/40 border-white/5 hover:border-white/10 hover:shadow-xl hover:shadow-black/40"
                                    : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/50"
                            )}
                        >
                            <div className={cn(
                                "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110",
                                "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 shadow-sm overflow-hidden"
                            )}>
                                {company.logo_url ? (
                                    <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Building2 className="w-8 h-8 opacity-50" />
                                )}
                            </div>
                            <h3 className={cn("font-bold text-lg mb-1 group-hover:text-blue-500 transition-colors", isDark ? "text-white" : "text-gray-900")}>
                                {company.name}
                            </h3>
                            <p className={cn("text-xs font-medium uppercase tracking-wider mb-4 opacity-60", isDark ? "text-gray-400" : "text-gray-600")}>
                                {company.industry || 'Technology'}
                            </p>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full rounded-xl text-sm font-bold h-10",
                                    isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-50 hover:bg-gray-100"
                                )}
                            >
                                View Profile
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. Latest Vacancies Feed */}
            <div>
                <h2 className={cn("text-2xl font-bold mb-6 px-2", isDark ? "text-white" : "text-gray-900")}>
                    Latest Vacancies
                </h2>
                <div className={cn(
                    "rounded-[24px] overflow-hidden border divide-y transition-shadow hover:shadow-lg",
                    isDark ? "bg-[#0C0C0E] border-white/5 divide-white/5" : "bg-white border-gray-100 divide-gray-50"
                )}>
                    {jobs.map((job, index) => (
                        <div
                            key={job.id || index}
                            onClick={() => navigate(`/job/${job.id}`)}
                            className={cn(
                                "p-5 flex items-center gap-5 cursor-pointer transition-colors group",
                                isDark ? "hover:bg-white/[0.02]" : "hover:bg-gray-50/50"
                            )}
                        >
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white text-xl shrink-0 shadow-md group-hover:scale-105 transition-transform",
                                "bg-gradient-to-br from-blue-500 to-indigo-600"
                            )}>
                                {job.company?.charAt(0) || 'J'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={cn("font-bold text-lg truncate group-hover:text-blue-500 transition-colors", isDark ? "text-white" : "text-gray-900")}>
                                    {job.title}
                                </h3>
                                <div className={cn("flex items-center gap-2 text-sm mt-1", isDark ? "text-gray-400" : "text-gray-500")}>
                                    <span className="font-semibold text-gray-900 dark:text-gray-200">{job.company}</span>
                                    <span className="opacity-50">•</span>
                                    <span>{job.location}</span>
                                    <span className="opacity-50">•</span>
                                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">{job.type}</span>
                                </div>
                            </div>
                            <Button
                                className={cn(
                                    "rounded-full px-5 h-9 text-sm font-bold shadow-none opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0",
                                    isDark ? "bg-white text-black" : "bg-black text-white"
                                )}
                            >
                                Apply
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}