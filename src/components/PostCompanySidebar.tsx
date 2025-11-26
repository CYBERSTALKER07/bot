import React, { useState, useMemo } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { cn } from '../lib/cva';
import { useRecommendedCompanies, useSearch } from '../hooks/useOptimizedQuery';
import MentionSuggestionCard from './ui/MentionSuggestionCard';
import { PostSidebarCompanySkeleton } from './ui/Skeleton';

interface PostCompanySidebarProps {
    isDark: boolean;
    postContent: string;
    currentUserId?: string;
    onMentionCompany: (companyId: string) => void;
}

export default function PostCompanySidebar({
    isDark,
    postContent,
    currentUserId,
    onMentionCompany,
}: PostCompanySidebarProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch recommended companies
    const { data: recommendedCompanies = [], isLoading: recommendedLoading } = useRecommendedCompanies(10);

    // Search companies when query is provided
    const cleanSearchQuery = searchQuery.startsWith('@') ? searchQuery.slice(1) : searchQuery;
    const { data: searchResults, isLoading: searchLoading } = useSearch(cleanSearchQuery);

    // Extract keywords from post content for smart suggestions (simple split)
    const postKeywords = useMemo(() => {
        if (!postContent) return [];
        const words = postContent.toLowerCase().split(/\s+/);
        return words.filter(word => word.length > 3 && !word.startsWith('#') && !word.startsWith('@'));
    }, [postContent]);

    // Build display list
    const displayCompanies = useMemo(() => {
        if (searchQuery) {
            const companies = (searchResults as any)?.companies || [];
            return companies.map((c: any) => ({
                id: c.id,
                name: c.name,
                subtitle: c.industry || '',
                logoUrl: c.logo_url,
                description: c.description,
                verified: c.verified,
                engagementScore: Math.floor(Math.random() * 100) // mock
            }));
        }
        return recommendedCompanies.map((c: any) => ({
            id: c.id,
            name: c.name,
            subtitle: c.industry || '',
            logoUrl: c.logo_url,
            description: c.description,
            verified: c.verified,
            engagementScore: Math.floor(Math.random() * 100) // mock
        }));
    }, [searchQuery, searchResults, recommendedCompanies]);

    const isLoading = searchQuery ? searchLoading : recommendedLoading;

    // Trending companies based on engagementScore mock
    const trendingCompanies = useMemo(() => {
        return displayCompanies
            .filter(c => c.engagementScore && c.engagementScore > 70)
            .slice(0, 3);
    }, [displayCompanies]);

    return (
        <aside className={cn(
            'hidden xl:block w-[400px] h-screen sticky top-0 overflow-y-auto scrollbar-hide pl-24 py-4 flex-shrink-0',
            isDark ? 'bg-black' : 'bg-white'
        )}>
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <h2 className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-black')}>Mention Companies</h2>
                </div>
                {/* Search Bar */}
                <div className="relative group">
                    <div className={cn(
                        'flex items-center px-4 py-3 rounded-2xl transition-all duration-200 border',
                        isDark
                            ? 'bg-gray-900/50 border-gray-800 focus-within:bg-black focus-within:ring-1 focus-within:ring-[#D3FB52]'
                            : 'bg-gray-100 border-gray-300 focus-within:bg-white focus-within:ring-1 focus-within:ring-[#D3FB52]'
                    )}>
                        <Search className={cn('w-5 h-5 mr-3 transition-colors', isDark ? 'text-gray-500 group-focus-within:text-[#D3FB52]' : 'text-gray-400 group-focus-within:text-[#D3FB52]')} />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            className={cn('bg-transparent border-none outline-hidden w-full text-sm placeholder-gray-500', isDark ? 'text-white' : 'text-black')}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className={cn('p-1 rounded-full hover:bg-gray-700 transition-colors', isDark ? 'text-gray-400' : 'text-gray-5')}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
                {/* Trending Companies */}
                {!searchQuery && trendingCompanies.length > 0 && (
                    <div className={cn('rounded-2xl p-4 border', isDark ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200')}>
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-4 h-4 text-orange-500" />
                            <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-black')}>Trending Companies</h3>
                        </div>
                        <div className="space-y-2">
                            {trendingCompanies.map((c: any) => (
                                <MentionSuggestionCard
                                    key={c.id}
                                    type="company"
                                    id={c.id}
                                    name={c.name}
                                    subtitle={c.subtitle}
                                    avatarUrl={c.logoUrl}
                                    verified={c.verified}
                                    engagementScore={c.engagementScore}
                                    isDark={isDark}
                                    onMention={onMentionCompany}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {/* Main Company List */}
                <div className={cn('rounded-[24px] p-4 shadow-lg border', isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200')}>
                    <h3 className={cn('text-sm font-semibold mb-3', isDark ? 'text-white' : 'text-black')}> {searchQuery ? 'Search Results' : 'Suggested Companies'} </h3>
                    {isLoading ? (
                        <PostSidebarCompanySkeleton />
                    ) : displayCompanies.length > 0 ? (
                        <div className="space-y-2">
                            {displayCompanies.map(c => (
                                <MentionSuggestionCard
                                    key={c.id}
                                    type="company"
                                    id={c.id}
                                    name={c.name}
                                    subtitle={c.subtitle}
                                    avatarUrl={c.logoUrl}
                                    description={c.description}
                                    verified={c.verified}
                                    engagementScore={c.engagementScore}
                                    isDark={isDark}
                                    onMention={onMentionCompany}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={cn('text-center py-8 text-sm', isDark ? 'text-gray-500' : 'text-gray-400')}>
                            {searchQuery ? 'No companies found' : 'No suggestions available'}
                        </div>
                    )}
                </div>
                {/* Smart Tip */}
                {postKeywords.length > 0 && !searchQuery && (
                    <div className={cn('rounded-2xl p-3 border', isDark ? 'bg-blue-900/20 border-blue-800/30' : 'bg-blue-50 border-blue-200')}>
                        <p className={cn('text-xs', isDark ? 'text-blue-300' : 'text-blue-700')}>
                            💡 <strong>Tip:</strong> Mentioning relevant companies can increase post reach and attract recruiters!
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
}
