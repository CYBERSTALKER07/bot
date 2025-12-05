import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Hash, TrendingUp, Share2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/cva';
import {
    useHashtag,
    useHashtagPosts,
    useIsFollowingHashtag,
    useToggleHashtagFollow,
    useRelatedHashtags
} from '../hooks/useHashtags';
import { formatHashtagCount, formatTimeSinceUse } from '../lib/hashtagService';
import Button from './ui/Button';
import Avatar from './ui/Avatar';
import PageLayout from './ui/PageLayout';
import EnhancedPostCardInteractions from './ui/EnhancedPostCardInteractions';

type TabType = 'top' | 'latest' | 'media' | 'people';

export default function HashtagDetailPage() {
    const { hashtagName } = useParams<{ hashtagName: string }>();
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState<TabType>('top');

    // Fetch hashtag data
    const { data: hashtag, isLoading: hashtagLoading } = useHashtag(hashtagName);
    const { data: isFollowing, isLoading: followLoading } = useIsFollowingHashtag(user?.id, hashtag?.id);
    const { data: relatedHashtags = [] } = useRelatedHashtags(hashtag?.id, 5);

    // Fetch posts
    const {
        data: postsData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: postsLoading
    } = useHashtagPosts(hashtag?.id, 20);

    const posts = postsData?.pages.flat() || [];

    // Follow/unfollow mutation
    const { mutate: toggleFollow, isPending: isTogglingFollow } = useToggleHashtagFollow();

    const handleFollow = () => {
        if (!user?.id || !hashtag?.id) return;
        toggleFollow({ userId: user.id, hashtagId: hashtag.id });
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `#${hashtagName}`,
                    text: `Check out #${hashtagName} on LinkedIn Killer`,
                    url
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(url);
            // Show toast notification (you can implement this)
            alert('Link copied to clipboard!');
        }
    };

    if (hashtagLoading) {
        return (
            <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'}>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-info-500"></div>
                </div>
            </PageLayout>
        );
    }

    if (!hashtag) {
        return (
            <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'}>
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <Hash className="w-16 h-16 text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Hashtag not found</h2>
                    <p className="text-gray-500 mb-6">#{hashtagName} doesn't exist yet</p>
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'} padding="none">
            <div className="max-w-2xl mx-auto">
                <div className={cn(
                    'border-x min-h-screen',
                    isDark ? 'border-gray-800' : 'border-gray-200'
                )}>
                    {/* Header */}
                    <div className={cn(
                        'sticky top-0 z-10 backdrop-blur-xl border-b',
                        isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
                    )}>
                        <div className="flex items-center gap-4 px-4 py-3">
                            <button
                                onClick={() => navigate(-1)}
                                className={cn(
                                    'p-2 rounded-full transition-colors',
                                    isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-100'
                                )}
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="flex-1">
                                <h1 className="text-xl font-bold">#{hashtag.name}</h1>
                                <p className={cn(
                                    'text-sm',
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                )}>
                                    {formatHashtagCount(hashtag.usage_count)} posts
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Hashtag Info Section */}
                    <div className={cn(
                        'p-6 border-b',
                        isDark ? 'border-gray-800' : 'border-gray-200'
                    )}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={cn(
                                        'w-16 h-16 rounded-2xl flex items-center justify-center',
                                        'bg-linear-to-br from-info-500 to-purple-600'
                                    )}>
                                        <Hash className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">#{hashtag.name}</h2>
                                        {hashtag.category && (
                                            <span className={cn(
                                                'inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium',
                                                isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
                                            )}>
                                                {hashtag.category}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {hashtag.description && (
                                    <p className={cn(
                                        'text-base mb-4',
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    )}>
                                        {hashtag.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                                <div className="text-2xl font-bold">
                                    {formatHashtagCount(hashtag.usage_count)}
                                </div>
                                <div className={cn(
                                    'text-sm',
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                )}>
                                    Posts
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">
                                    {formatHashtagCount(hashtag.follower_count)}
                                </div>
                                <div className={cn(
                                    'text-sm',
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                )}>
                                    Followers
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold flex items-center gap-1">
                                    {hashtag.trending_rank || '-'}
                                    {hashtag.trending_rank && hashtag.trending_rank <= 10 && (
                                        <TrendingUp className="w-5 h-5 text-orange-500" />
                                    )}
                                </div>
                                <div className={cn(
                                    'text-sm',
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                )}>
                                    Trending Rank
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <Button
                                onClick={handleFollow}
                                disabled={isTogglingFollow || followLoading}
                                className={cn(
                                    'flex-1 rounded-full font-bold transition-all',
                                    isFollowing
                                        ? isDark
                                            ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                                            : 'bg-white text-black hover:bg-gray-100 border border-gray-300'
                                        : 'bg-[#BCE953] text-black hover:bg-[#BCE953]/90'
                                )}
                            >
                                {isTogglingFollow ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
                            </Button>
                            <button
                                onClick={handleShare}
                                className={cn(
                                    'p-3 rounded-full border transition-colors',
                                    isDark
                                        ? 'border-gray-700 hover:bg-gray-800'
                                        : 'border-gray-300 hover:bg-gray-100'
                                )}
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Related Hashtags */}
                    {relatedHashtags.length > 0 && (
                        <div className={cn(
                            'p-4 border-b',
                            isDark ? 'border-gray-800' : 'border-gray-200'
                        )}>
                            <h3 className="text-sm font-bold mb-3">Related hashtags</h3>
                            <div className="flex flex-wrap gap-2">
                                {relatedHashtags.map((related) => (
                                    <Link
                                        key={related.id}
                                        to={`/hashtag/${related.name}`}
                                        className={cn(
                                            'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                                            isDark
                                                ? 'bg-gray-900 text-info-400 hover:bg-gray-800'
                                                : 'bg-info-50 text-info-600 hover:bg-info-100'
                                        )}
                                    >
                                        #{related.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className={cn(
                        'flex border-b',
                        isDark ? 'border-gray-800' : 'border-gray-200'
                    )}>
                        {[
                            { id: 'top', label: 'Top' },
                            { id: 'latest', label: 'Latest' },
                            { id: 'media', label: 'Media' },
                            { id: 'people', label: 'People' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={cn(
                                    'flex-1 py-4 text-sm font-medium relative transition-colors',
                                    activeTab === tab.id
                                        ? 'font-bold'
                                        : isDark
                                            ? 'text-gray-500 hover:bg-gray-900/50'
                                            : 'text-gray-600 hover:bg-gray-50'
                                )}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-info-500 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Posts Feed */}
                    <div>
                        {postsLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-info-500"></div>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-12">
                                <Hash className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className={cn(
                                    'text-lg font-medium mb-1',
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                )}>
                                    No posts yet
                                </p>
                                <p className={cn(
                                    'text-sm',
                                    isDark ? 'text-gray-500' : 'text-gray-600'
                                )}>
                                    Be the first to post with #{hashtag.name}
                                </p>
                            </div>
                        ) : (
                            <>
                                {posts.map((post: any) => (
                                    <div
                                        key={post.id}
                                        className={cn(
                                            'border-b p-4 hover:bg-gray-50/5 transition-colors cursor-pointer',
                                            isDark ? 'border-gray-800' : 'border-gray-200'
                                        )}
                                        onClick={() => navigate(`/post/${post.id}`)}
                                    >
                                        <div className="flex gap-3">
                                            <Avatar
                                                src={post.author.avatar_url}
                                                alt={post.author.name}
                                                size="md"
                                                className="shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold">{post.author.name}</span>
                                                    {post.author.verified && (
                                                        <span className="text-info-500">
                                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                    <span className="text-gray-500 text-sm">@{post.author.username}</span>
                                                    <span className="text-gray-500 text-sm">·</span>
                                                    <span className="text-gray-500 text-sm">{formatTimeSinceUse(post.created_at)}</span>
                                                </div>
                                                <p className="mb-3 whitespace-pre-wrap">{post.content}</p>
                                                {post.media && post.media.length > 0 && (
                                                    <div className="mb-3 rounded-2xl overflow-hidden">
                                                        {post.media[0].type === 'image' ? (
                                                            <img
                                                                src={post.media[0].url}
                                                                alt={post.media[0].alt || ''}
                                                                className="w-full h-auto max-h-96 object-cover"
                                                            />
                                                        ) : (
                                                            <video
                                                                src={post.media[0].url}
                                                                controls
                                                                className="w-full h-auto max-h-96"
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                                <EnhancedPostCardInteractions
                                                    postId={post.id}
                                                    initialLikes={post.likes_count}
                                                    initialRetweets={post.retweets_count}
                                                    initialReplies={post.replies_count}
                                                    isLiked={post.has_liked}
                                                    isRetweeted={post.has_retweeted}
                                                    onLike={() => { }}
                                                    onRetweet={() => { }}
                                                    onComment={() => navigate(`/post/${post.id}`)}
                                                    onReply={() => navigate(`/post/${post.id}`)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Load More */}
                                {hasNextPage && (
                                    <div className="p-4 text-center">
                                        <Button
                                            onClick={() => fetchNextPage()}
                                            disabled={isFetchingNextPage}
                                            variant="outlined"
                                            className="rounded-full"
                                        >
                                            {isFetchingNextPage ? 'Loading...' : 'Load more'}
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
