import React, { useState, useMemo } from 'react';
import { Search, X, TrendingUp, Sparkles } from 'lucide-react';
import { cn } from '../lib/cva';
import { useRecommendedUsers, useSearch } from '../hooks/useOptimizedQuery';
import MentionSuggestionCard from './ui/MentionSuggestionCard';
import { PostSidebarUserSkeleton } from './ui/Skeleton';

interface PostUserSidebarProps {
    isDark: boolean;
    postContent: string;
    currentUserId?: string;
    onMentionUser: (username: string) => void;
}

export default function PostUserSidebar({
    isDark,
    postContent,
    currentUserId,
    onMentionUser
}: PostUserSidebarProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch recommended users
    const { data: recommendedUsers = [], isLoading: recommendedLoading } = useRecommendedUsers(currentUserId, 10);

    // Search users when query is provided
    const cleanSearchQuery = searchQuery.startsWith('@') ? searchQuery.slice(1) : searchQuery;
    const { data: searchResults, isLoading: searchLoading } = useSearch(cleanSearchQuery);

    // Extract keywords from post content for smart suggestions
    const postKeywords = useMemo(() => {
        if (!postContent) return [];
        const words = postContent.toLowerCase().split(/\s+/);
        return words.filter(word => word.length > 3 && !word.startsWith('#') && !word.startsWith('@'));
    }, [postContent]);

    // Filter and sort users based on search or smart suggestions
    const displayUsers = useMemo(() => {
        if (searchQuery) {
            // Show search results
            const users = (searchResults as any)?.users || [];
            return users.map((u: any) => ({
                id: u.id,
                name: u.full_name,
                subtitle: `@${u.username}`,
                avatarUrl: u.avatar_url,
                bio: u.bio,
                verified: u.verified,
                connectionDegree: Math.floor(Math.random() * 3) + 1 as 1 | 2 | 3, // Mock data
                engagementScore: Math.floor(Math.random() * 100) // Mock data
            }));
        }

        // Show recommended users with smart sorting
        return recommendedUsers.map((u: any) => ({
            id: u.id,
            name: u.full_name,
            subtitle: `@${u.username}`,
            avatarUrl: u.avatar_url,
            bio: u.bio,
            verified: u.verified,
            connectionDegree: Math.floor(Math.random() * 3) + 1 as 1 | 2 | 3, // Mock data
            engagementScore: Math.floor(Math.random() * 100) // Mock data
        }));
    }, [searchQuery, searchResults, recommendedUsers]);

    const isLoading = searchQuery ? searchLoading : recommendedLoading;

    // Identify trending users (mock - users with high engagement scores)
    const trendingUsers = useMemo(() => {
        return displayUsers
            .filter(u => u.engagementScore && u.engagementScore > 70)
            .slice(0, 3);
    }, [displayUsers]);

    return (
        <aside className={cn(
            'hidden xl:block w-[320px] h-screen sticky top-0 overflow-y-auto scrollbar-hide pr-4 py-4 flex-shrink-0',
            isDark ? 'bg-black' : 'bg-white'
        )}>
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">

                    <h2 className={cn(
                        'text-lg font-bold',
                        isDark ? 'text-white' : 'text-black'
                    )}>
                        Mention People
                    </h2>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <div className={cn(
                        'flex items-center px-4 py-3 rounded-[24px] transition-all duration-200 border',
                        isDark
                            ? 'bg-gray-900/50 border-gray-800 focus-within:bg-black focus-within:ring-1 focus-within:ring-[#D3FB52]'
                            : 'bg-gray-100 border-gray-300 focus-within:bg-white focus-within:ring-1 focus-within:ring-[#D3FB52]'
                    )}>
                        <Search className={cn(
                            'w-5 h-5 mr-3 transition-colors',
                            isDark ? 'text-gray-500 group-focus-within:text-[#D3FB52]' : 'text-gray-400 group-focus-within:text-[#D3FB52]'
                        )} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className={cn(
                                'bg-transparent border-none outline-hidden w-full text-sm placeholder-gray-500',
                                isDark ? 'text-white' : 'text-black'
                            )}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className={cn(
                                    'p-1 rounded-full hover:bg-gray-700 transition-colors',
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                )}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Trending Users Section */}
                {!searchQuery && trendingUsers.length > 0 && (
                    <div className={cn(
                        'rounded-[24px] p-4 border shadow-xl border-[0.1px] border-gray-200',
                        isDark ? 'bg-gray-900/30 border-gray-800' : 'bg-white border-gray-200'
                    )}>
                        <div className="flex items-center gap-2 mb-3">
                            {/* <TrendingUp className="w-4 h-4 text-orange-500" /> */}
                            <h3 className={cn(
                                'text-sm font-semibold',
                                isDark ? 'text-white' : 'text-black'
                            )}>
                                most suggested                            </h3>
                        </div>
                        <div className="space-y-2">
                            {trendingUsers.map((user) => (
                                <MentionSuggestionCard
                                    key={user.id}
                                    type="user"
                                    id={user.id}
                                    name={user.name}
                                    subtitle={user.subtitle}
                                    avatarUrl={user.avatarUrl}
                                    bio={user.bio}
                                    verified={user.verified}
                                    connectionDegree={user.connectionDegree}
                                    engagementScore={user.engagementScore}
                                    isDark={isDark}
                                    onMention={onMentionUser}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Main User List */}
                <div className={cn(
                    'rounded-[24px] p-4 border-[0.1px] shadow-lg',
                    isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
                )}>
                    <h3 className={cn(
                        'text-sm font-semibold mb-3',
                        isDark ? 'text-white' : 'text-black'
                    )}>
                        {searchQuery ? 'Search Results' : 'Suggested for you'}
                    </h3>

                    {isLoading ? (
                        <PostSidebarUserSkeleton />
                    ) : displayUsers.length > 0 ? (
                        <div className="space-y-2">
                            {displayUsers.map((user) => (
                                <MentionSuggestionCard
                                    key={user.id}
                                    type="user"
                                    id={user.id}
                                    name={user.name}
                                    subtitle={user.subtitle}
                                    avatarUrl={user.avatarUrl}
                                    bio={user.bio}
                                    verified={user.verified}
                                    connectionDegree={user.connectionDegree}
                                    engagementScore={user.engagementScore}
                                    isDark={isDark}
                                    onMention={onMentionUser}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={cn(
                            'text-center py-8 text-sm',
                            isDark ? 'text-gray-500' : 'text-gray-400'
                        )}>
                            {searchQuery ? 'No users found' : 'No suggestions available'}
                        </div>
                    )}
                </div>

                {/* Smart Tip */}
                {postKeywords.length > 0 && !searchQuery && (
                    <div className={cn(
                        'rounded-[24px] p-3 border',
                        isDark ? 'bg-blue-900/20 border-blue-800/30' : 'bg-blue-50 border-blue-200'
                    )}>
                        <p className={cn(
                            'text-xs',
                            isDark ? 'text-blue-300' : 'text-blue-700'
                        )}>
                            💡 <strong>Tip:</strong> Mentioning relevant users can boost your post engagement by up to 3x!
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
}
