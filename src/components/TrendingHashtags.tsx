import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Hash, Flame } from 'lucide-react';
import { useTrendingHashtags } from '../hooks/useHashtags';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/cva';
import { formatHashtagCount } from '../lib/hashtagService';

interface TrendingHashtagsProps {
    limit?: number;
    showFilters?: boolean;
    className?: string;
}

const CATEGORIES = [
    { id: 'all', label: 'All', icon: Hash },
    { id: 'technology', label: 'Tech', icon: TrendingUp },
    { id: 'business', label: 'Business', icon: TrendingUp },
    { id: 'sports', label: 'Sports', icon: TrendingUp },
    { id: 'entertainment', label: 'Entertainment', icon: TrendingUp },
];

export default function TrendingHashtags({
    limit = 10,
    showFilters = false,
    className = ''
}: TrendingHashtagsProps) {
    const { isDark } = useTheme();
    const [selectedCategory, setSelectedCategory] = useState('all');

    const { data: trendingHashtags = [], isLoading, error } = useTrendingHashtags(limit);

    // Filter by category if needed
    const filteredHashtags = selectedCategory === 'all'
        ? trendingHashtags
        : trendingHashtags.filter(h => h.category === selectedCategory);

    if (error) {
        return (
            <div className={cn(
                'rounded-2xl p-4',
                isDark ? 'bg-gray-900/50' : 'bg-gray-50',
                className
            )}>
                <p className="text-red-500 text-sm">Failed to load trending hashtags</p>
            </div>
        );
    }

    return (
        <div className={cn(
            'rounded-2xl overflow-hidden',
            isDark ? 'bg-gray-900/50' : 'bg-gray-50',
            className
        )}>
            {/* Header */}
            <div className="p-4 pb-3">
                <div className="flex items-center gap-2 mb-3">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <h2 className="text-xl font-bold">Trending Now</h2>
                </div>

                {/* Category Filters */}
                {showFilters && (
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={cn(
                                    'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
                                    selectedCategory === category.id
                                        ? isDark
                                            ? 'bg-info-600 text-white'
                                            : 'bg-info-500 text-white'
                                        : isDark
                                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                )}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Trending List */}
            {isLoading ? (
                <div className="px-4 pb-4 space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className={cn(
                                'h-4 rounded mb-2',
                                isDark ? 'bg-gray-800' : 'bg-gray-200'
                            )} style={{ width: `${60 + Math.random() * 30}%` }} />
                            <div className={cn(
                                'h-3 rounded',
                                isDark ? 'bg-gray-800' : 'bg-gray-200'
                            )} style={{ width: `${40 + Math.random() * 20}%` }} />
                        </div>
                    ))}
                </div>
            ) : filteredHashtags.length === 0 ? (
                <div className="px-4 pb-4 text-center text-gray-500">
                    <p className="text-sm">No trending hashtags right now</p>
                </div>
            ) : (
                <div>
                    {filteredHashtags.map((hashtag, index) => (
                        <Link
                            key={hashtag.id}
                            to={`/hashtag/${hashtag.name}`}
                            className={cn(
                                'block px-4 py-3 transition-colors border-b last:border-b-0',
                                isDark
                                    ? 'hover:bg-gray-800/50 border-gray-800'
                                    : 'hover:bg-gray-100 border-gray-200'
                            )}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    {/* Rank & Category */}
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={cn(
                                            'text-xs font-bold',
                                            isDark ? 'text-gray-500' : 'text-gray-400'
                                        )}>
                                            {index + 1}
                                        </span>
                                        {hashtag.category && (
                                            <span className={cn(
                                                'text-xs px-2 py-0.5 rounded-full',
                                                isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                                            )}>
                                                {hashtag.category}
                                            </span>
                                        )}
                                        {index < 3 && (
                                            <Flame className="w-3.5 h-3.5 text-orange-500" />
                                        )}
                                    </div>

                                    {/* Hashtag Name */}
                                    <div className="font-bold text-base mb-1 truncate">
                                        #{hashtag.name}
                                    </div>

                                    {/* Stats */}
                                    <div className={cn(
                                        'text-sm',
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    )}>
                                        {formatHashtagCount(hashtag.usage_count)} posts
                                    </div>
                                </div>

                                {/* Trending Indicator */}
                                {hashtag.trending_score > 50 && (
                                    <div className="flex-shrink-0">
                                        <div className={cn(
                                            'px-2 py-1 rounded-full text-xs font-bold',
                                            'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                        )}>
                                            HOT
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description (if available) */}
                            {hashtag.description && (
                                <p className={cn(
                                    'text-sm mt-2 line-clamp-2',
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                )}>
                                    {hashtag.description}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            )}

            {/* Show More Link */}
            {filteredHashtags.length >= limit && (
                <Link
                    to="/explore/trending"
                    className={cn(
                        'block px-4 py-3 text-center text-sm font-medium transition-colors',
                        isDark
                            ? 'text-info-400 hover:bg-gray-800/50'
                            : 'text-info-600 hover:bg-gray-100'
                    )}
                >
                    Show more
                </Link>
            )}
        </div>
    );
}
