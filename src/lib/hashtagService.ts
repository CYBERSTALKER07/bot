import { supabase } from './supabase';

/**
 * Hashtag Service
 * Provides utility functions for hashtag extraction, highlighting, and management
 */

// ============================================================================
// HASHTAG EXTRACTION & PARSING
// ============================================================================

/**
 * Extracts hashtags from text content
 * @param content - Text content to extract hashtags from
 * @returns Array of hashtag strings (without # symbol)
 */
export function extractHashtags(content: string): string[] {
    if (!content) return [];

    // Regex pattern: # followed by letters, numbers, underscores
    // Matches: #AI, #JavaScript, #Web3_0
    // Doesn't match: #123 (numbers only), # (just symbol)
    const hashtagRegex = /#([A-Za-z][A-Za-z0-9_]*)/g;
    const matches = content.match(hashtagRegex);

    if (!matches) return [];

    // Remove # symbol and convert to lowercase for consistency
    // Remove duplicates using Set
    const hashtags = [...new Set(matches.map(tag => tag.slice(1)))];

    return hashtags;
}

/**
 * Validates if a string is a valid hashtag
 * @param hashtag - Hashtag string (with or without #)
 * @returns Boolean indicating validity
 */
export function isValidHashtag(hashtag: string): boolean {
    const cleaned = hashtag.startsWith('#') ? hashtag.slice(1) : hashtag;

    // Must start with letter, can contain letters, numbers, underscores
    // Length between 1 and 50 characters
    const validPattern = /^[A-Za-z][A-Za-z0-9_]{0,49}$/;

    return validPattern.test(cleaned);
}

/**
 * Normalizes hashtag for database storage (lowercase, trimmed)
 * @param hashtag - Hashtag string
 * @returns Normalized hashtag
 */
export function normalizeHashtag(hashtag: string): string {
    const cleaned = hashtag.startsWith('#') ? hashtag.slice(1) : hashtag;
    return cleaned.toLowerCase().trim();
}

// ============================================================================
// HASHTAG HIGHLIGHTING & RENDERING
// ============================================================================

/**
 * Highlights hashtags in text content for display
 * Returns array of text segments and hashtag objects for rendering
 * @param content - Text content with hashtags
 * @returns Array of content segments
 */
export function parseContentWithHashtags(content: string): Array<{
    type: 'text' | 'hashtag';
    value: string;
    hashtag?: string;
}> {
    if (!content) return [];

    const segments: Array<{ type: 'text' | 'hashtag'; value: string; hashtag?: string }> = [];
    const hashtagRegex = /(#[A-Za-z][A-Za-z0-9_]*)/g;

    let lastIndex = 0;
    let match;

    while ((match = hashtagRegex.exec(content)) !== null) {
        // Add text before hashtag
        if (match.index > lastIndex) {
            segments.push({
                type: 'text',
                value: content.slice(lastIndex, match.index)
            });
        }

        // Add hashtag
        segments.push({
            type: 'hashtag',
            value: match[0],
            hashtag: match[0].slice(1) // Without # symbol
        });

        lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
        segments.push({
            type: 'text',
            value: content.slice(lastIndex)
        });
    }

    return segments;
}

// ============================================================================
// MENTION EXTRACTION & PARSING
// ============================================================================

/**
 * Extracts mentions from text content
 * @param content - Text content to extract mentions from
 * @returns Array of mention strings (without @ symbol)
 */
export function extractMentions(content: string): string[] {
    if (!content) return [];

    // Regex pattern: @ followed by letters, numbers, underscores
    // Matches: @username, @john_doe, @user123
    // Doesn't match: @123 (numbers only), @ (just symbol)
    const mentionRegex = /@([A-Za-z][A-Za-z0-9_]*)/g;
    const matches = content.match(mentionRegex);

    if (!matches) return [];

    // Remove @ symbol and remove duplicates using Set
    const mentions = [...new Set(matches.map(mention => mention.slice(1)))];

    return mentions;
}

/**
 * Parses content with both hashtags and mentions for highlighting
 * Returns array of text segments, hashtag objects, and mention objects for rendering
 * @param content - Text content with hashtags and mentions
 * @returns Array of content segments
 */
export function parseContentWithHashtagsAndMentions(content: string): Array<{
    type: 'text' | 'hashtag' | 'mention';
    value: string;
    hashtag?: string;
    mention?: string;
}> {
    if (!content) return [];

    const segments: Array<{ type: 'text' | 'hashtag' | 'mention'; value: string; hashtag?: string; mention?: string }> = [];
    // Combined regex to match both hashtags and mentions
    const combinedRegex = /(#[A-Za-z][A-Za-z0-9_]*|@[A-Za-z][A-Za-z0-9_]*)/g;

    let lastIndex = 0;
    let match;

    while ((match = combinedRegex.exec(content)) !== null) {
        // Add text before hashtag/mention
        if (match.index > lastIndex) {
            segments.push({
                type: 'text',
                value: content.slice(lastIndex, match.index)
            });
        }

        // Determine if it's a hashtag or mention
        if (match[0].startsWith('#')) {
            segments.push({
                type: 'hashtag',
                value: match[0],
                hashtag: match[0].slice(1) // Without # symbol
            });
        } else if (match[0].startsWith('@')) {
            segments.push({
                type: 'mention',
                value: match[0],
                mention: match[0].slice(1) // Without @ symbol
            });
        }

        lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
        segments.push({
            type: 'text',
            value: content.slice(lastIndex)
        });
    }

    return segments;
}

// ============================================================================
// TRENDING CALCULATIONS
// ============================================================================

/**
 * Calculates trending score for a hashtag (client-side approximation)
 * Server-side calculation is more accurate and done via SQL function
 * @param usageCount - Number of times hashtag was used
 * @param lastUsedAt - Last time hashtag was used
 * @param engagementCount - Total engagement (likes + retweets + comments)
 * @returns Trending score
 */
export function calculateTrendingScore(
    usageCount: number,
    lastUsedAt: Date,
    engagementCount: number = 0
): number {
    const now = new Date();
    const hoursSinceLastUse = (now.getTime() - lastUsedAt.getTime()) / (1000 * 60 * 60);

    // Time decay factor (exponential decay with half-life of 6 hours)
    const timeDecayFactor = Math.pow(2, -(hoursSinceLastUse / 6.0));

    // Engagement factor (normalized)
    const engagementFactor = 1.0 + (engagementCount / Math.max(usageCount, 1) / 100.0);

    // Calculate final trending score
    const trendingScore = usageCount * engagementFactor * timeDecayFactor;

    return Math.max(trendingScore, 0);
}

/**
 * Determines if a hashtag is trending based on its score and rank
 * @param trendingRank - Hashtag's trending rank
 * @param trendingScore - Hashtag's trending score
 * @returns Boolean indicating if trending
 */
export function isTrending(trendingRank?: number | null, trendingScore?: number | null): boolean {
    if (!trendingRank || !trendingScore) return false;
    return trendingRank <= 50 && trendingScore > 10;
}

// ============================================================================
// HASHTAG FORMATTING
// ============================================================================

/**
 * Formats hashtag usage count for display
 * @param count - Usage count
 * @returns Formatted string (e.g., "1.2K", "45.3M")
 */
export function formatHashtagCount(count: number): string {
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
}

/**
 * Formats time since last hashtag use
 * @param lastUsedAt - Last used timestamp
 * @returns Formatted string (e.g., "2h ago", "3d ago")
 */
export function formatTimeSinceUse(lastUsedAt: Date | string): string {
    const date = typeof lastUsedAt === 'string' ? new Date(lastUsedAt) : lastUsedAt;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

export interface Hashtag {
    id: string;
    name: string;
    normalized_name: string;
    description?: string;
    category?: string;
    usage_count: number;
    follower_count: number;
    trending_score: number;
    trending_rank?: number;
    first_used_at: string;
    last_used_at: string;
    created_at: string;
    updated_at: string;
}

export interface UserInterest {
    id: string;
    user_id: string;
    hashtag_id: string;
    interest_weight: number;
    posts_created: number;
    posts_liked: number;
    posts_retweeted: number;
    posts_commented: number;
    is_following: boolean;
    followed_at?: string;
    first_interaction_at: string;
    last_interaction_at: string;
}

/**
 * Fetches trending hashtags from database
 * @param limit - Number of hashtags to fetch
 * @returns Array of trending hashtags
 */
export async function getTrendingHashtags(limit: number = 10): Promise<Hashtag[]> {
    try {
        const { data, error } = await supabase
            .rpc('get_trending_hashtags', { p_limit: limit });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching trending hashtags:', error);
        return [];
    }
}

/**
 * Searches for hashtags matching query
 * @param query - Search query
 * @param limit - Number of results
 * @returns Array of matching hashtags
 */
export async function searchHashtags(query: string, limit: number = 20): Promise<Hashtag[]> {
    try {
        const { data, error } = await supabase
            .rpc('search_hashtags', {
                p_query: query,
                p_limit: limit
            });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error searching hashtags:', error);
        return [];
    }
}

/**
 * Fetches hashtag details by name
 * @param hashtagName - Hashtag name (without #)
 * @returns Hashtag object or null
 */
export async function getHashtagByName(hashtagName: string): Promise<Hashtag | null> {
    try {
        const normalized = normalizeHashtag(hashtagName);

        const { data, error } = await supabase
            .from('hashtags')
            .select('*')
            .eq('normalized_name', normalized)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching hashtag:', error);
        return null;
    }
}

/**
 * Fetches posts for a specific hashtag
 * @param hashtagId - Hashtag ID
 * @param limit - Number of posts
 * @param offset - Pagination offset
 * @returns Array of post IDs
 */
export async function getHashtagPosts(
    hashtagId: string,
    limit: number = 20,
    offset: number = 0
): Promise<string[]> {
    try {
        const { data, error } = await supabase
            .from('post_hashtags')
            .select('post_id')
            .eq('hashtag_id', hashtagId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        return data?.map(item => item.post_id) || [];
    } catch (error) {
        console.error('Error fetching hashtag posts:', error);
        return [];
    }
}

/**
 * Toggles follow status for a hashtag
 * @param userId - User ID
 * @param hashtagId - Hashtag ID
 * @returns New follow status
 */
export async function toggleHashtagFollow(
    userId: string,
    hashtagId: string
): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .rpc('toggle_hashtag_follow', {
                p_user_id: userId,
                p_hashtag_id: hashtagId
            });

        if (error) throw error;
        return data || false;
    } catch (error) {
        console.error('Error toggling hashtag follow:', error);
        return false;
    }
}

/**
 * Fetches user's followed hashtags
 * @param userId - User ID
 * @returns Array of followed hashtags
 */
export async function getUserFollowedHashtags(userId: string): Promise<Hashtag[]> {
    try {
        const { data, error } = await supabase
            .from('user_interests')
            .select(`
        hashtag_id,
        hashtags (*)
      `)
            .eq('user_id', userId)
            .eq('is_following', true);

        if (error) throw error;
        return data?.map((item: any) => item.hashtags).filter(Boolean) || [];
    } catch (error) {
        console.error('Error fetching followed hashtags:', error);
        return [];
    }
}

/**
 * Fetches user's interest profile
 * @param userId - User ID
 * @param limit - Number of interests
 * @returns Array of user interests with hashtag data
 */
export async function getUserInterests(
    userId: string,
    limit: number = 50
): Promise<Array<UserInterest & { hashtag: Hashtag }>> {
    try {
        const { data, error } = await supabase
            .from('user_interests')
            .select(`
        *,
        hashtag:hashtags (*)
      `)
            .eq('user_id', userId)
            .order('interest_weight', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching user interests:', error);
        return [];
    }
}

/**
 * Updates trending scores for all hashtags
 * Should be called periodically (e.g., every hour via cron job)
 */
export async function updateTrendingScores(): Promise<void> {
    try {
        const { error } = await supabase.rpc('update_all_trending_scores');
        if (error) throw error;
    } catch (error) {
        console.error('Error updating trending scores:', error);
    }
}

// ============================================================================
// HASHTAG SUGGESTIONS
// ============================================================================

/**
 * Gets personalized hashtag suggestions for user
 * Based on user's interests and trending topics
 * @param userId - User ID
 * @param limit - Number of suggestions
 * @returns Array of suggested hashtags
 */
export async function getPersonalizedHashtagSuggestions(
    userId: string,
    limit: number = 10
): Promise<Hashtag[]> {
    try {
        // Get user's top interests
        const { data: interests, error: interestsError } = await supabase
            .from('user_interests')
            .select('hashtag_id, interest_weight')
            .eq('user_id', userId)
            .order('interest_weight', { ascending: false })
            .limit(5);

        if (interestsError) throw interestsError;

        if (!interests || interests.length === 0) {
            // No interests yet, return trending hashtags
            return getTrendingHashtags(limit);
        }

        // Get related hashtags based on category and trending score
        const interestHashtagIds = interests.map(i => i.hashtag_id);

        const { data: suggestions, error: suggestionsError } = await supabase
            .from('hashtags')
            .select('*')
            .not('id', 'in', `(${interestHashtagIds.join(',')})`)
            .order('trending_score', { ascending: false })
            .limit(limit);

        if (suggestionsError) throw suggestionsError;
        return suggestions || [];
    } catch (error) {
        console.error('Error getting personalized suggestions:', error);
        return getTrendingHashtags(limit);
    }
}

/**
 * Gets related hashtags for a given hashtag
 * Based on co-occurrence in posts
 * @param hashtagId - Hashtag ID
 * @param limit - Number of related hashtags
 * @returns Array of related hashtags
 */
export async function getRelatedHashtags(
    hashtagId: string,
    limit: number = 10
): Promise<Hashtag[]> {
    try {
        // Find posts with this hashtag
        const { data: postHashtags, error: postError } = await supabase
            .from('post_hashtags')
            .select('post_id')
            .eq('hashtag_id', hashtagId)
            .limit(100);

        if (postError) throw postError;

        if (!postHashtags || postHashtags.length === 0) return [];

        const postIds = postHashtags.map(ph => ph.post_id);

        // Find other hashtags in those posts
        const { data: relatedHashtagIds, error: relatedError } = await supabase
            .from('post_hashtags')
            .select('hashtag_id')
            .in('post_id', postIds)
            .neq('hashtag_id', hashtagId);

        if (relatedError) throw relatedError;

        if (!relatedHashtagIds || relatedHashtagIds.length === 0) return [];

        // Count occurrences and get top hashtags
        const hashtagCounts = relatedHashtagIds.reduce((acc, item) => {
            acc[item.hashtag_id] = (acc[item.hashtag_id] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topHashtagIds = Object.entries(hashtagCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([id]) => id);

        // Fetch hashtag details
        const { data: hashtags, error: hashtagsError } = await supabase
            .from('hashtags')
            .select('*')
            .in('id', topHashtagIds);

        if (hashtagsError) throw hashtagsError;
        return hashtags || [];
    } catch (error) {
        console.error('Error getting related hashtags:', error);
        return [];
    }
}
