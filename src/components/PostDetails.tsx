import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Bookmark,
  X,
  MapPin,
  Copy,
  ExternalLink,
  Clock,
  Eye,
  CheckCircle,
  Flag,
  UserX
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';
import { Card } from './ui/Card';
import Avatar from './ui/Avatar';
import PageLayout from './ui/PageLayout';
import Comments from './ui/Comments';
import { cn } from '../lib/cva';
import { usePostDetail, useLikePost, useUnlikePost } from '../hooks/useOptimizedQuery';
import { PostDetailsPageSkeleton } from './ui/Skeleton';

interface PostDetail {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  video_url?: string;
  post_type: 'text' | 'image' | 'video' | 'article' | 'poll' | 'event';
  visibility: 'public' | 'connections' | 'private';
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    full_name: string;
    avatar_url?: string;
    role: 'student' | 'employer' | 'admin';
    company?: string;
    verified: boolean;
    bio?: string;
    location?: string;
  };
  has_liked: boolean;
  has_bookmarked: boolean;
  tags?: string[];
  location?: string;
  media_description?: string;
}

export default function PostDetails() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  
  const [post, setPost] = useState<PostDetail | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // Use the new usePostDetail hook
  const { data: postData, isLoading: loading, error } = usePostDetail(postId, user?.id);
  const likePostMutation = useLikePost();
  const unlikePostMutation = useUnlikePost();

  // Update local post state when hook data changes
  useEffect(() => {
    if (postData) {
      setPost(postData as PostDetail);
    }
  }, [postData]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle like/unlike post
  const handleLikePost = async () => {
    if (!post || !user?.id) return;

    setIsLikeLoading(true);
    try {
      setPost(prev => prev ? {
        ...prev,
        has_liked: !prev.has_liked,
        likes_count: prev.has_liked ? prev.likes_count - 1 : prev.likes_count + 1
      } : null);

      // Make the API call
      if (post.has_liked) {
        // Unlike the post
        await unlikePostMutation.mutateAsync({
          postId: post.id,
          userId: user.id
        });
      } else {
        // Like the post
        await likePostMutation.mutateAsync({
          postId: post.id,
          userId: user.id
        });
      }

      // Add haptic feedback for mobile
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      // Revert optimistic update on error
      setPost(prev => prev ? {
        ...prev,
        has_liked: !prev.has_liked,
        likes_count: prev.has_liked ? prev.likes_count - 1 : prev.likes_count + 1
      } : null);
      alert('Failed to update like. Please try again.');
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleBookmarkPost = async () => {
    if (!post || !user?.id) return;

    try {
      setPost(prev => prev ? {
        ...prev,
        has_bookmarked: !prev.has_bookmarked
      } : null);
      
      // TODO: Implement actual bookmark logic with database
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const copyPostLink = () => {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url);
    // TODO: Show toast notification
  };

  const formatEngagementNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <PostDetailsPageSkeleton isDark={isDark} />
    );
  }

  if (error || !post) {
    return (
      <PageLayout 
        className={cn(
          'min-h-screen',
          isDark ? 'bg-black text-white' : 'bg-white text-black'
        )}
        maxWidth="md"
      >
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-500 mb-2">
            Post Not Found
          </h2>
          <p className={cn('mb-4', isDark ? 'text-gray-400' : 'text-gray-600')}>
            {error ? (error as Error).message : 'The post you are looking for does not exist or has been removed.'}
          </p>
          <Button 
            onClick={() => navigate('/feed')}
            className="px-6 py-2"
          >
            Back to Feed
          </Button>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      className={cn(
        'min-h-screen',
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      )}
      maxWidth="full"
      padding="none"
    >
      {/* X/Twitter-Style Header */}
      <div className={cn(
        'sticky top-0 z-10 backdrop-blur-xl border-b',
        isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200',
        isMobile ? 'top-16' : 'top-0'
      )}>
        <div className="flex items-center justify-between px-24 py-3">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Post</h1>
              {post && (
                <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                  Thread
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container - Split Layout for Desktop */}
      <div className="flex ml-36 mr-auto max-w-7xl">
        {/* Left Side - Post Content */}
        <div className="flex-1 max-w-2xl">
          <div className={cn(
            'border-x min-h-screen',
            isDark ? 'border-gray-800' : 'border-gray-200'
          )}>
            
            {/* Main Post */}
            <div className={cn(
              'p-4 border-b',
              isDark ? 'border-gray-800' : 'border-gray-200'
            )}>
              <div className="flex space-x-3">
                {/* Author Avatar */}
                <Link to={`/profile/${post.author.id}`} onClick={(e) => e.stopPropagation()}>
                  <Avatar
                    src={post.author.avatar_url}
                    alt={post.author.full_name}
                    name={post.author.full_name}
                    size="lg"
                    className="shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </Link>
                
                {/* Post Content */}
                <div className="flex-1 min-w-0">
                  
                  {/* Author Info */}
                  <div className="flex items-center space-x-2 mb-2">
                    <Link 
                      to={`/profile/${post.author.id}`}
                      className="font-bold hover:underline text-lg"
                    >
                      {post.author.full_name}
                    </Link>
                    {post.author.verified && (
                      <CheckCircle className="w-5 h-5 text-info-500" />
                    )}
                    <span className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                      @{post.author.full_name.toLowerCase().replace(/\s+/g, '')}
                    </span>
                  </div>
                  
                  {/* Post Text */}
                  <div className="mb-4">
                    <p className="text-xl leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className={cn(
                            'text-sm px-2 py-1 rounded-full border cursor-pointer hover:bg-opacity-80',
                            isDark 
                              ? 'text-info-400 border-info-400/30 hover:bg-info-400/10' 
                              : 'text-info-600 border-info-600/30 hover:bg-info-600/10'
                          )}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Media */}
                  {post.image_url && (
                    <div className="mb-4 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img
                        src={post.image_url}
                        alt={post.media_description || "Post image"}
                        className="w-full h-auto max-h-[500px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => setShowImageModal(true)}
                      />
                    </div>
                  )}

                  {post.video_url && (
                    <div className="mb-4 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      <video
                        controls
                        className="w-full h-auto max-h-[500px] object-cover"
                        src={post.video_url}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}

                  {/* Post Metadata */}
                  <div className={cn(
                    'flex items-center space-x-4 text-sm py-3 border-t border-b',
                    isDark ? 'text-gray-400 border-gray-800' : 'text-gray-600 border-gray-200'
                  )}>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(post.created_at).toLocaleString()}</span>
                    </div>
                    {post.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{post.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{Math.floor(Math.random() * 1000)} views</span>
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  {(post.likes_count > 0 || post.comments_count > 0 || post.shares_count > 0) && (
                    <div className={cn(
                      'py-3 border-b',
                      isDark ? 'border-gray-800' : 'border-gray-200'
                    )}>
                      <div className="flex items-center space-x-6 text-sm">
                        {post.likes_count > 0 && (
                          <span className={cn(isDark ? 'text-gray-400' : 'text-gray-600')}>
                            <strong className={cn(isDark ? 'text-white' : 'text-black')}>
                              {formatEngagementNumber(post.likes_count)}
                            </strong> {post.likes_count === 1 ? 'Like' : 'Likes'}
                          </span>
                        )}
                        {post.comments_count > 0 && (
                          <span className={cn(isDark ? 'text-gray-400' : 'text-gray-600')}>
                            <strong className={cn(isDark ? 'text-white' : 'text-black')}>
                              {formatEngagementNumber(post.comments_count)}
                            </strong> {post.comments_count === 1 ? 'Reply' : 'Replies'}
                          </span>
                        )}
                        {post.shares_count > 0 && (
                          <span className={cn(isDark ? 'text-gray-400' : 'text-gray-600')}>
                            <strong className={cn(isDark ? 'text-white' : 'text-black')}>
                              {formatEngagementNumber(post.shares_count)}
                            </strong> {post.shares_count === 1 ? 'Repost' : 'Reposts'}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className={cn(
                    'flex items-center justify-around py-3 border-b',
                    isDark ? 'border-gray-800' : 'border-gray-200'
                  )}>
                    <Button
                      onClick={() => document.getElementById('comment-input')?.focus()}
                      className={cn(
                        'flex items-center space-x-2 px-4 py-2 rounded-full transition-colors',
                        isDark 
                          ? 'text-gray-400 hover:text-info-400 hover:bg-info-500/10' 
                          : 'text-gray-600 hover:text-info-600 hover:bg-info-500/10'
                      )}
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments_count || ''}</span>
                    </Button>
                    
                    <Button
                      className={cn(
                        'flex items-center space-x-2 px-4 py-2 rounded-full transition-colors',
                        isDark 
                          ? 'text-gray-400 hover:text-green-400 hover:bg-green-500/10' 
                          : 'text-gray-600 hover:text-green-600 hover:bg-green-500/10'
                      )}
                    >
                      <Repeat2 className="w-5 h-5" />
                      <span className="text-sm">{post.shares_count || ''}</span>
                    </Button>
                    
                    <Button
                      onClick={handleLikePost}
                      disabled={isLikeLoading}
                      className={cn(
                        'flex items-center space-x-2 px-4 py-2 rounded-full transition-colors',
                        post.has_liked
                          ? 'text-red-500 hover:text-red-400'
                          : isDark 
                            ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                            : 'text-gray-600 hover:text-red-600 hover:bg-red-500/10'
                      )}
                    >
                      <Heart className={cn('w-5 h-5', post.has_liked && 'fill-current')} />
                      <span className="text-sm">{post.likes_count || ''}</span>
                    </Button>
                    
                    <Button
                      onClick={handleBookmarkPost}
                      className={cn(
                        'flex items-center space-x-2 px-4 py-2 rounded-full transition-colors',
                        post.has_bookmarked
                          ? 'text-info-500 hover:text-info-400'
                          : isDark 
                            ? 'text-gray-400 hover:text-info-400 hover:bg-info-500/10'
                            : 'text-gray-600 hover:text-info-600 hover:bg-info-500/10'
                      )}
                    >
                      <Bookmark className={cn('w-5 h-5', post.has_bookmarked && 'fill-current')} />
                    </Button>
                    
                    <div className="relative">
                      <Button
                        onClick={() => setShowMoreOptions(!showMoreOptions)}
                        className={cn(
                          'p-2 rounded-full transition-colors',
                          isDark 
                            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800' 
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        )}
                      >
                        <Share className="w-5 h-5" />
                      </Button>
                      
                      {showMoreOptions && (
                        <div className={cn(
                          'absolute right-0 top-full mt-2 w-48 rounded-xl shadow-lg border z-50 py-2',
                          isDark ? 'bg-black border-gray-700' : 'bg-white border-gray-200'
                        )}>
                          <Button
                            onClick={copyPostLink}
                            className="w-full justify-start px-4 py-2 text-sm"
                          >
                            <Copy className="w-4 h-4 mr-3" />
                            Copy link to post
                          </Button>
                          <Button
                            className="w-full justify-start px-4 py-2 text-sm"
                          >
                            <ExternalLink className="w-4 h-4 mr-3" />
                            Share via...
                          </Button>
                          <Button
                            className="w-full justify-start px-4 py-2 text-sm text-red-500"
                          >
                            <Flag className="w-4 h-4 mr-3" />
                            Report post
                          </Button>
                          {post.user_id !== user?.id && (
                            <Button
                              className="w-full justify-start px-4 py-2 text-sm text-red-500"
                            >
                              <UserX className="w-4 h-4 mr-3" />
                              Block @{post.author.full_name.toLowerCase().replace(/\s+/g, '')}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section - Mobile/Tablet */}
            {isMobile && (
              <Comments postId={postId!} className={cn('border-t', isDark ? 'border-gray-800' : 'border-gray-200')} />
            )}
          </div>
        </div>

        {/* Right Sidebar - Comments (Desktop Only) */}
        {!isMobile && (
          <aside className={cn(
            'hidden lg:block w-128 border-l ml-3 rounded-2xl sticky top-0 h-screen overflow-y-auto',
            isDark ? 'border-gray-800' : 'border-gray-200'
          )}>
            <Comments postId={postId!} className="h-full" />  
          </aside>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && post.image_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm">
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <Button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full p-2"
            >
              <X className="h-6 w-6" />
            </Button>
            <img
              src={post.image_url}
              alt={post.media_description || "Post image"}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            {post.media_description && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded-lg">
                <p className="text-sm">{post.media_description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}