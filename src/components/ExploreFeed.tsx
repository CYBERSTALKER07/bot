import React from 'react';
// Force rebuild
import { useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, ArrowRight, Sparkles, Briefcase } from 'lucide-react';
import { cn } from '../lib/cva';
import Button from './ui/Button';
import Avatar from './ui/Avatar';

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
        <div className="pb-20 space-y-6 p-4">
            {/* Hero Section */}
            <div className={cn(
                "rounded-3xl p-8 relative overflow-hidden",
                isDark
                    ? "bg-linear-to-br from-info-900/40 via-purple-900/40 to-black border border-[#1C1F20]"
                    : "bg-linear-to-br from-info-50 via-purple-50 to-white border border-gray-200"
            )}>
                <div className="relative z-10">
                    <h1 className={cn(
                        "text-3xl font-serif font-bold mb-2",
                        isDark ? "text-white" : "text-gray-900"
                    )}>
                        Discover Your Next Opportunity
                    </h1>
                    <p className={cn(
                        "text-lg mb-6 max-w-xl",
                        isDark ? "text-gray-300" : "text-gray-600"
                    )}>
                        Explore tailored jobs, connect with industry leaders, and find companies that match your values.
                    </p>
                    <div className="flex gap-3">
                        <Button
                            className="rounded-full px-6 py-2.5 font-semibold bg-white text-black hover:bg-gray-100"
                            onClick={() => navigate('/jobs')}
                        >
                            Browse Jobs
                        </Button>
                        <Button
                            variant="ghost"
                            className={cn(
                                "rounded-full px-6 py-2.5 font-semibold border",
                                isDark ? "border-gray-700 text-white hover:bg-white/10" : "border-gray-300 text-gray-900 hover:bg-gray-100"
                            )}
                            onClick={() => navigate('/companies')}
                        >
                            View Companies
                        </Button>
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-info-500/20 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -ml-16 -mb-16" />
            </div>

            {/* Featured Jobs - Horizontal Scroll */}
            <div>
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className={cn(
                        "text-xl font-bold flex items-center gap-2",
                        isDark ? "text-white" : "text-gray-900"
                    )}>
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        Top Picks for You
                    </h2>
                    <button
                        onClick={() => navigate('/jobs')}
                        className={cn("text-sm font-medium hover:underline", isDark ? "text-info-400" : "text-info-600")}
                    >
                        See all
                    </button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                    {(matchedJobs.length > 0 ? matchedJobs : jobs.slice(0, 5)).map((job, index) => (
                        <div
                            key={job.id || index}
                            onClick={() => navigate(`/job/${job.id}`)}
                            className={cn(
                                "min-w-[280px] max-w-[280px] p-5 rounded-3xl border cursor-pointer transition-all hover:scale-[1.02]",
                                isDark
                                    ? "bg-gray-900/40 border-[#1C1F20] hover:border-gray-700"
                                    : "bg-white border-gray-200 hover:border-info-200 hover:shadow-md"
                            )}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white",
                                    "bg-linear-to-br from-info-600 to-purple-600"
                                )}>
                                    {job.company?.charAt(0) || '💼'}
                                </div>
                                {job.matchPercentage && (
                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-500">
                                        {job.matchPercentage}% Match
                                    </span>
                                )}
                            </div>

                            <h3 className={cn("font-bold text-lg mb-1 truncate", isDark ? "text-white" : "text-gray-900")}>
                                {job.title}
                            </h3>
                            <p className={cn("text-sm mb-3 truncate", isDark ? "text-gray-400" : "text-gray-600")}>
                                {job.company}
                            </p>

                            <div className="space-y-2">
                                <div className={cn("flex items-center text-xs", isDark ? "text-gray-300" : "text-gray-700")}>
                                    <MapPin className="w-3.5 h-3.5 mr-2 opacity-70" />
                                    {job.location}
                                </div>
                                <div className={cn("flex items-center text-xs", isDark ? "text-gray-300" : "text-gray-700")}>
                                    <DollarSign className="w-3.5 h-3.5 mr-2 opacity-70" />
                                    {job.salary_range || 'Competitive'}
                                </div>
                                <div className={cn("flex items-center text-xs", isDark ? "text-gray-300" : "text-gray-700")}>
                                    <Briefcase className="w-3.5 h-3.5 mr-2 opacity-70" />
                                    {job.type}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommended People */}
            <div className={cn(
                "rounded-3xl p-6 border",
                isDark ? "bg-black border-[#1C1F20]" : "bg-white border-gray-200"
            )}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                        People You Should Know
                    </h2>
                    <button
                        className={cn("p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors")}
                    >
                        <ArrowRight className={cn("w-5 h-5", isDark ? "text-gray-400" : "text-gray-600")} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendedUsers.slice(0, 4).map((user) => (
                        <div
                            key={user.id}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-2xl transition-colors cursor-pointer",
                                isDark ? "hover:bg-gray-900" : "hover:bg-gray-50"
                            )}
                            onClick={() => navigate(`/profile/${user.id}`)}
                        >
                            <Avatar
                                src={user.avatar_url}
                                alt={user.full_name}
                                size="md"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                    <h4 className={cn("font-bold text-sm truncate", isDark ? "text-white" : "text-gray-900")}>
                                        {user.full_name}
                                    </h4>
                                    {user.verified && (
                                        <span className="text-info-500 text-xs">✓</span>
                                    )}
                                </div>
                                <p className={cn("text-xs truncate", isDark ? "text-gray-400" : "text-gray-500")}>
                                    @{user.username}
                                </p>
                                {user.bio && (
                                    <p className={cn("text-xs truncate mt-0.5", isDark ? "text-gray-500" : "text-gray-600")}>
                                        {user.bio}
                                    </p>
                                )}
                            </div>
                            <Button
                                size="small"
                                className={cn(
                                    "rounded-full px-4",
                                    isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
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

            {/* Trending Companies */}
            <div>
                <h2 className={cn("text-xl font-bold mb-4 px-2", isDark ? "text-white" : "text-gray-900")}>
                    Trending Companies
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {recommendedCompanies.slice(0, 3).map((company, index) => (
                        <div
                            key={company.id || index}
                            onClick={() => navigate(`/company/${company.id}`)}
                            className={cn(
                                "p-4 rounded-3xl border text-center cursor-pointer transition-all hover:-translate-y-1",
                                isDark
                                    ? "bg-gray-900/20 border-[#1C1F20] hover:bg-gray-900/40"
                                    : "bg-white border-gray-200 hover:shadow-md"
                            )}
                        >
                            <div className={cn(
                                "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl mb-3",
                                "bg-linear-to-br from-gray-700 to-gray-900 text-white shadow-lg"
                            )}>
                                {company.logo_url ? (
                                    <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover rounded-2xl" />
                                ) : (
                                    company.name?.charAt(0) || '🏢'
                                )}
                            </div>
                            <h3 className={cn("font-bold text-base mb-1", isDark ? "text-white" : "text-gray-900")}>
                                {company.name}
                            </h3>
                            <p className={cn("text-xs mb-3", isDark ? "text-gray-400" : "text-gray-500")}>
                                {company.industry || 'Technology'}
                            </p>
                            <Button
                                variant="ghost"
                                className="w-full rounded-xl text-xs h-8"
                            >
                                View Profile
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Latest Vacancies Feed */}
            <div>
                <h2 className={cn("text-xl font-bold mb-4 px-2", isDark ? "text-white" : "text-gray-900")}>
                    Latest Vacancies
                </h2>
                <div className={cn(
                    "rounded-3xl overflow-hidden border divide-y",
                    isDark ? "bg-black border-[#1C1F20] divide-[#1C1F20]" : "bg-white border-gray-200 divide-gray-100"
                )}>
                    {jobs.map((job, index) => (
                        <div
                            key={job.id || index}
                            onClick={() => navigate(`/job/${job.id}`)}
                            className={cn(
                                "p-4 flex items-center gap-4 cursor-pointer transition-colors",
                                isDark ? "hover:bg-gray-900/30" : "hover:bg-gray-50"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shrink-0",
                                "bg-linear-to-br from-info-500 to-indigo-600"
                            )}>
                                {job.company?.charAt(0) || 'J'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={cn("font-bold text-base truncate", isDark ? "text-white" : "text-gray-900")}>
                                    {job.title}
                                </h3>
                                <div className={cn("flex items-center gap-2 text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                                    <span className="font-medium">{job.company}</span>
                                    <span>•</span>
                                    <span>{job.location}</span>
                                    <span>•</span>
                                    <span>{job.type}</span>
                                </div>
                            </div>
                            <div className={cn(
                                "text-xs font-medium px-3 py-1 rounded-full",
                                isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                            )}>
                                Apply
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
