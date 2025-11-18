import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
    getTrendingHashtags,
    searchHashtags,
    getHashtagByName,
    getHashtagPosts,
    toggleHashtagFollow,
    getUserFollowedHashtags,
    getUserInterests,
    getPersonalizedHashtagSuggestions,
    getRelatedHashtags,
    type Hashtag,
    type UserInterest
} from '../lib/hashtagService';
import { supabase } from '../lib/supabase';

/**
 * Custom React Query hooks for hashtag functionality
 */

// ============================================================================
// TRENDING HASHTAGS
// ============================================================================

/**
 * Hook to fetch trending hashtags
 * @param limit - Number of trending hashtags to fetch
 * @param refetchInterval - Auto-refetch interval in ms (default: 5 minutes)
 */
export function useTrendingHashtags(limit: number = 10, refetchInterval: number = 5 * 60 * 1000) {
    return useQuery({
        queryKey: ['trending-hashtags', limit],
        queryFn: () => getTrendingHashtags(limit),
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchInterval,
        refetchOnWindowFocus: true
    });
}

// ============================================================================
// HASHTAG SEARCH & AUTOCOMPLETE
// ============================================================================

/**
 * Hook for hashtag search with autocomplete
 * @param query - Search query
 * @param enabled - Whether to enable the query
 */
export function useHashtagSearch(query: string, enabled: boolean = true) {
    return useQuery({
        queryKey: ['hashtag-search', query],
        queryFn: () => searchHashtags(query, 20),
        enabled: enabled && query.length > 0,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}

/**
 * Hook for hashtag autocomplete suggestions
 * Optimized for real-time typing with debouncing
 * @param query - Search query
 * @param enabled - Whether to enable the query
 */
export function useHashtagSuggestions(query: string, enabled: boolean = true) {
    return useQuery({
        queryKey: ['hashtag-suggestions', query],
        queryFn: async () => {
            if (!query || query.length === 0) {
                // Return trending hashtags when no query
                return getTrendingHashtags(10);
            }
            return searchHashtags(query, 10);
        },
        enabled,
        staleTime: 30 * 1000, // 30 seconds
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
}

// ============================================================================
// HASHTAG DETAILS
// ============================================================================

/**
 * Hook to fetch hashtag details by name
 * @param hashtagName - Hashtag name (without #)
 */
export function useHashtag(hashtagName: string | undefined) {
    return useQuery({
        queryKey: ['hashtag', hashtagName],
        queryFn: () => getHashtagByName(hashtagName!),
        enabled: !!hashtagName,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to fetch posts for a specific hashtag with infinite scroll
 * @param hashtagId - Hashtag ID
 * @param limit - Posts per page
 */
export function useHashtagPosts(hashtagId: string | undefined, limit: number = 20) {
    return useInfiniteQuery({
        queryKey: ['hashtag-posts', hashtagId, limit],
        queryFn: async ({ pageParam = 0 }) => {
            if (!hashtagId) return [];

            const postIds = await getHashtagPosts(hashtagId, limit, pageParam * limit);

            // Fetch full post data
            if (postIds.length === 0) return [];

            const { data: posts, error } = await supabase
                .from('posts')
                .select(`
          id,
          content,
          user_id,
          created_at,
          likes_count,
          comments_count,
          shares_count,
          retweets_count,
          media_type,
          image_url,
          video_url,
          visibility
        `)
                .in('id', postIds)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Fetch user profiles
            const userIds = [...new Set(posts?.map(p => p.user_id) || [])];
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, full_name, username, avatar_url, verified')
                .in('id', userIds);

            const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);

            // Transform posts
            return posts?.map(post => {
                const profile = profilesMap.get(post.user_id);
                return {
                    id: post.id,
                    content: post.content,
                    author: {
                        id: post.user_id,
                        name: profile?.full_name || 'User',
                        username: profile?.username || `user${post.user_id}`,
                        avatar_url: profile?.avatar_url,
                        verified: profile?.verified || false
                    },
                    created_at: post.created_at,
                    likes_count: post.likes_count || 0,
                    retweets_count: post.retweets_count || 0,
                    replies_count: post.comments_count || 0,
                    has_liked: false,
                    has_retweeted: false,
                    has_bookmarked: false,
                    media: post.image_url || post.video_url ? [{
                        type: post.media_type === 'video' ? 'video' as const : 'image' as const,
                        url: post.image_url || post.video_url || '',
                        alt: 'Post media'
                    }] : undefined,
                    visibility: post.visibility
                };
            }) || [];
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === limit ? allPages.length : undefined;
        },
        enabled: !!hashtagId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

// ============================================================================
// USER INTERESTS & FOLLOWING
// ============================================================================

/**
 * Hook to fetch user's followed hashtags
 * @param userId - User ID
 */
export function useFollowedHashtags(userId: string | undefined) {
    return useQuery({
        queryKey: ['followed-hashtags', userId],
        queryFn: () => getUserFollowedHashtags(userId!),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to fetch user's interest profile
 * @param userId - User ID
 * @param limit - Number of interests
 */
export function useUserInterests(userId: string | undefined, limit: number = 50) {
    return useQuery({
        queryKey: ['user-interests', userId, limit],
        queryFn: () => getUserInterests(userId!, limit),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to check if user is following a hashtag
 * @param userId - User ID
 * @param hashtagId - Hashtag ID
 */
export function useIsFollowingHashtag(userId: string | undefined, hashtagId: string | undefined) {
    return useQuery({
        queryKey: ['is-following-hashtag', userId, hashtagId],
        queryFn: async () => {
            if (!userId || !hashtagId) return false;

            const { data, error } = await supabase
                .from('user_interests')
                .select('is_following')
                .eq('user_id', userId)
                .eq('hashtag_id', hashtagId)
                .single();

            if (error) return false;
            return data?.is_following || false;
        },
        enabled: !!userId && !!hashtagId,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}

/**
 * Mutation hook to follow/unfollow a hashtag
 */
export function useToggleHashtagFollow() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, hashtagId }: { userId: string; hashtagId: string }) =>
            toggleHashtagFollow(userId, hashtagId),
        onSuccess: (_, variables) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['followed-hashtags', variables.userId] });
            queryClient.invalidateQueries({ queryKey: ['is-following-hashtag', variables.userId, variables.hashtagId] });
            queryClient.invalidateQueries({ queryKey: ['user-interests', variables.userId] });
            queryClient.invalidateQueries({ queryKey: ['hashtag', variables.hashtagId] });
        }
    });
}

// ============================================================================
// PERSONALIZED SUGGESTIONS
// ============================================================================

/**
 * Hook to fetch personalized hashtag suggestions
 * @param userId - User ID
 * @param limit - Number of suggestions
 */
export function usePersonalizedHashtags(userId: string | undefined, limit: number = 10) {
    return useQuery({
        queryKey: ['personalized-hashtags', userId, limit],
        queryFn: () => getPersonalizedHashtagSuggestions(userId!, limit),
        enabled: !!userId,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

/**
 * Hook to fetch related hashtags
 * @param hashtagId - Hashtag ID
 * @param limit - Number of related hashtags
 */
export function useRelatedHashtags(hashtagId: string | undefined, limit: number = 10) {
    return useQuery({
        queryKey: ['related-hashtags', hashtagId, limit],
        queryFn: () => getRelatedHashtags(hashtagId!, limit),
        enabled: !!hashtagId,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

// ============================================================================
// HASHTAG ANALYTICS
// ============================================================================

/**
 * Hook to fetch hashtag analytics/statistics
 * @param hashtagId - Hashtag ID
 */
export function useHashtagAnalytics(hashtagId: string | undefined) {
    return useQuery({
        queryKey: ['hashtag-analytics', hashtagId],
        queryFn: async () => {
            if (!hashtagId) return null;

            // Fetch hashtag data
            const { data: hashtag, error: hashtagError } = await supabase
                .from('hashtags')
                .select('*')
                .eq('id', hashtagId)
                .single();

            if (hashtagError) throw hashtagError;

            // Fetch recent usage (last 7 days)
            const { count: recentUsage, error: usageError } = await supabase
                .from('post_hashtags')
                .select('*', { count: 'exact', head: true })
                .eq('hashtag_id', hashtagId)
                .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

            if (usageError) throw usageError;

            // Fetch total engagement
            const { data: posts, error: postsError } = await supabase
                .from('post_hashtags')
                .select(`
          post_id,
          posts (
            likes_count,
            retweets_count,
            comments_count
          )
        `)
                .eq('hashtag_id', hashtagId)
                .limit(100);

            if (postsError) throw postsError;

            const totalEngagement = posts?.reduce((sum, item: any) => {
                const post = item.posts;
                return sum + (post?.likes_count || 0) + (post?.retweets_count || 0) + (post?.comments_count || 0);
            }, 0) || 0;

            return {
                hashtag,
                recentUsage: recentUsage || 0,
                totalEngagement,
                avgEngagementPerPost: posts && posts.length > 0 ? totalEngagement / posts.length : 0
            };
        },
        enabled: !!hashtagId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

// ============================================================================
// HASHTAG CATEGORIES
// ============================================================================

/**
 * Hook to fetch hashtags by category
 * @param category - Hashtag category
 * @param limit - Number of hashtags
 */
export function useHashtagsByCategory(
    category: string | undefined,
    limit: number = 20
) {
    return useQuery({
        queryKey: ['hashtags-by-category', category, limit],
        queryFn: async () => {
            if (!category) return [];

            const { data, error } = await supabase
                .from('hashtags')
                .select('*')
                .eq('category', category)
                .order('trending_score', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data || [];
        },
        enabled: !!category,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

// ============================================================================
// INTELLIGENT FEED
// ============================================================================

/**
 * Hook for intelligent/personalized feed based on user interests
 * @param userId - User ID
 * @param limit - Posts per page
 */
export function useIntelligentFeed(userId: string | undefined, limit: number = 20) {
    return useInfiniteQuery({
        queryKey: ['intelligent-feed', userId, limit],
        queryFn: async ({ pageParam = 0 }) => {
            if (!userId) return [];

            // Call database function for personalized feed
            const { data: rankedPosts, error } = await supabase
                .rpc('get_personalized_feed', {
                    p_user_id: userId,
                    p_limit: limit,
                    p_offset: pageParam * limit
                });

            if (error) throw error;

            if (!rankedPosts || rankedPosts.length === 0) return [];

            const postIds = rankedPosts.map((rp: any) => rp.post_id);

            // Fetch full post data
            const { data: posts, error: postsError } = await supabase
                .from('posts')
                .select(`
          id,
          content,
          user_id,
          created_at,
          likes_count,
          comments_count,
          shares_count,
          retweets_count,
          media_type,
          image_url,
          video_url,
          visibility
        `)
                .in('id', postIds);

            if (postsError) throw postsError;

            // Fetch user profiles
            const userIds = [...new Set(posts?.map(p => p.user_id) || [])];
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, full_name, username, avatar_url, verified')
                .in('id', userIds);

            const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);

            // Create post map for ordering
            const postsMap = new Map(posts?.map(p => [p.id, p]) || []);

            // Return posts in ranked order
            return rankedPosts.map((rp: any) => {
                const post = postsMap.get(rp.post_id);
                if (!post) return null;

                const profile = profilesMap.get(post.user_id);
                return {
                    id: post.id,
                    content: post.content,
                    author: {
                        id: post.user_id,
                        name: profile?.full_name || 'User',
                        username: profile?.username || `user${post.user_id}`,
                        avatar_url: profile?.avatar_url,
                        verified: profile?.verified || false
                    },
                    created_at: post.created_at,
                    likes_count: post.likes_count || 0,
                    retweets_count: post.retweets_count || 0,
                    replies_count: post.comments_count || 0,
                    has_liked: false,
                    has_retweeted: false,
                    has_bookmarked: false,
                    media: post.image_url || post.video_url ? [{
                        type: post.media_type === 'video' ? 'video' as const : 'image' as const,
                        url: post.image_url || post.video_url || '',
                        alt: 'Post media'
                    }] : undefined,
                    visibility: post.visibility,
                    relevance_score: rp.relevance_score
                };
            }).filter(Boolean);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === limit ? allPages.length : undefined;
        },
        enabled: !!userId,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}
