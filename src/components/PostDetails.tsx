import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ThumbUp,
  ChatBubbleOutline,
  Share,
  MoreVert,
  ArrowBack,
  LocationOn,
  Work,
  School,
  Verified,
  Bookmark,
  BookmarkBorder,
  Send,
  Reply,
  FavoriteBorder,
  Favorite,
  Report,
  Block,
  Link as LinkIcon,
  Download,
  Fullscreen,
  Close,
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import Typography from './ui/Typography';
import Button from './ui/Button';
import { Card } from './ui/Card';
import Avatar from './ui/Avatar';
import Input from './ui/Input';
import Modal from './ui/Modal';

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
    title?: string;
    verified: boolean;
    bio?: string;
    location?: string;
  };
  has_liked: boolean;
  has_bookmarked: boolean;
  tags?: string[];
  location?: string;
  poll_options?: PollOption[];
  event_details?: EventDetails;
  article_link?: string;
  media_description?: string;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
  has_voted: boolean;
}

interface EventDetails {
  title: string;
  date: string;
  location: string;
  description: string;
  attendees_count: number;
  is_attending: boolean;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  likes_count: number;
  replies_count: number;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    full_name: string;
    avatar_url?: string;
    role: string;
    verified: boolean;
  };
  has_liked: boolean;
  replies?: Reply[];
}

interface Reply {
  id: string;
  comment_id: string;
  user_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  author: {
    id: string;
    full_name: string;
    avatar_url?: string;
    role: string;
  };
  has_liked: boolean;
}

export default function PostDetails() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  
  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
  const [newReply, setNewReply] = useState<Record<string, string>>({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  useEffect(() => {
    if (postId) {
      fetchPostDetails();
      fetchComments();
    }
  }, [postId]);

  const fetchPostDetails = async () => {
    if (!postId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey(
            id,
            full_name,
            avatar_url,
            role,
            company_name,
            title,
            verified,
            bio,
            location
          ),
          post_likes!left(user_id),
          post_bookmarks!left(user_id)
        `)
        .eq('id', postId)
        .single();

      if (error) throw error;

      const postDetail: PostDetail = {
        id: data.id,
        user_id: data.user_id,
        content: data.content || data.caption,
        image_url: data.image_url,
        video_url: data.video_url,
        post_type: data.media_type || 'text',
        visibility: 'public',
        likes_count: data.likes_count || 0,
        comments_count: data.comments_count || 0,
        shares_count: data.shares_count || 0,
        created_at: data.created_at,
        updated_at: data.updated_at,
        author: {
          id: data.profiles?.id || data.user_id,
          full_name: data.profiles?.full_name || 'Unknown User',
          avatar_url: data.profiles?.avatar_url,
          role: data.profiles?.role || 'student',
          company: data.profiles?.company_name,
          title: data.profiles?.title,
          verified: data.profiles?.verified || false,
          bio: data.profiles?.bio,
          location: data.profiles?.location
        },
        has_liked: data.post_likes?.some((like: any) => like.user_id === user?.id) || false,
        has_bookmarked: data.post_bookmarks?.some((bookmark: any) => bookmark.user_id === user?.id) || false,
        tags: data.tags,
        location: data.location,
        article_link: data.article_link,
        media_description: data.media_description
      };

      setPost(postDetail);
    } catch (err) {
      console.error('Error fetching post details:', err);
      setError(err instanceof Error ? err.message : 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!postId) return;

    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          *,
          profiles!post_comments_user_id_fkey(
            id,
            full_name,
            avatar_url,
            role,
            verified
          ),
          comment_likes!left(user_id),
          comment_replies(
            *,
            profiles!comment_replies_user_id_fkey(
              id,
              full_name,
              avatar_url,
              role
            )
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedComments: Comment[] = data?.map(comment => ({
        id: comment.id,
        post_id: comment.post_id,
        user_id: comment.user_id,
        content: comment.content,
        likes_count: comment.likes_count || 0,
        replies_count: comment.replies_count || 0,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
        author: {
          id: comment.profiles?.id || comment.user_id,
          full_name: comment.profiles?.full_name || 'Unknown User',
          avatar_url: comment.profiles?.avatar_url,
          role: comment.profiles?.role || 'student',
          verified: comment.profiles?.verified || false
        },
        has_liked: comment.comment_likes?.some((like: any) => like.user_id === user?.id) || false,
        replies: comment.comment_replies?.map((reply: any) => ({
          id: reply.id,
          comment_id: reply.comment_id,
          user_id: reply.user_id,
          content: reply.content,
          likes_count: reply.likes_count || 0,
          created_at: reply.created_at,
          author: {
            id: reply.profiles?.id || reply.user_id,
            full_name: reply.profiles?.full_name || 'Unknown User',
            avatar_url: reply.profiles?.avatar_url,
            role: reply.profiles?.role || 'student'
          },
          has_liked: false
        })) || []
      })) || [];

      setComments(formattedComments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleLikePost = async () => {
    if (!post || !user?.id) return;

    try {
      if (post.has_liked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('post_likes')
          .insert([{ post_id: post.id, user_id: user.id }]);
      }

      setPost(prev => prev ? {
        ...prev,
        has_liked: !prev.has_liked,
        likes_count: prev.has_liked ? prev.likes_count - 1 : prev.likes_count + 1
      } : null);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleBookmarkPost = async () => {
    if (!post || !user?.id) return;

    try {
      if (post.has_bookmarked) {
        await supabase
          .from('post_bookmarks')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('post_bookmarks')
          .insert([{ post_id: post.id, user_id: user.id }]);
      }

      setPost(prev => prev ? {
        ...prev,
        has_bookmarked: !prev.has_bookmarked
      } : null);
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !post || !user?.id) return;

    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert([
          {
            post_id: post.id,
            user_id: user.id,
            content: newComment.trim()
          }
        ])
        .select(`
          *,
          profiles!post_comments_user_id_fkey(
            id,
            full_name,
            avatar_url,
            role,
            verified
          )
        `)
        .single();

      if (error) throw error;

      const newCommentObj: Comment = {
        id: data.id,
        post_id: data.post_id,
        user_id: data.user_id,
        content: data.content,
        likes_count: 0,
        replies_count: 0,
        created_at: data.created_at,
        updated_at: data.updated_at,
        author: {
          id: data.profiles?.id || user.id,
          full_name: data.profiles?.full_name || user.name || 'You',
          avatar_url: data.profiles?.avatar_url,
          role: data.profiles?.role || 'student',
          verified: data.profiles?.verified || false
        },
        has_liked: false,
        replies: []
      };

      setComments(prev => [...prev, newCommentObj]);
      setNewComment('');

      // Update post comments count
      setPost(prev => prev ? {
        ...prev,
        comments_count: prev.comments_count + 1
      } : null);
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <School className="h-4 w-4" />;
      case 'employer': return <Work className="h-4 w-4" />;
      case 'admin': return <Verified className="h-4 w-4" />;
      default: return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return isDark ? 'text-blue-400' : 'text-blue-600';
      case 'employer': return isDark ? 'text-green-400' : 'text-green-600';
      case 'admin': return isDark ? 'text-purple-400' : 'text-purple-600';
      default: return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4 ${
              isDark ? 'border-lime' : 'border-asu-maroon'
            }`}></div>
            <Typography variant="body1" color="textSecondary">
              Loading post...
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <Typography variant="h6" className="text-red-600 mb-2">
              Post Not Found
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-4">
              {error || 'The post you are looking for does not exist or has been removed.'}
            </Typography>
            <Button onClick={() => navigate('/feed')} variant="outlined">
              Back to Feed
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header with Back Button */}
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="text"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Typography variant="h5" className="font-medium">
            Post Details
          </Typography>
        </div>

        {/* Main Post Card */}
        <Card className="mb-6 overflow-hidden" elevation={2}>
          {/* Post Header */}
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <Avatar
                  src={post.author.avatar_url}
                  alt={post.author.full_name}
                  size="lg"
                  fallback={post.author.full_name[0]}
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <Typography variant="h6" className="font-medium">
                      {post.author.full_name}
                    </Typography>
                    {post.author.verified && (
                      <Verified className={`h-5 w-5 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
                    )}
                    <div className={`flex items-center space-x-1 ${getRoleColor(post.author.role)}`}>
                      {getRoleIcon(post.author.role)}
                    </div>
                  </div>
                  <Typography variant="body1" color="textSecondary">
                    {post.author.title && `${post.author.title}`}
                    {post.author.company && ` at ${post.author.company}`}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {formatTimeAgo(post.created_at)}
                    {post.location && (
                      <>
                        {' • '}
                        <LocationOn className="h-3 w-3 inline" />
                        {' '}{post.location}
                      </>
                    )}
                  </Typography>
                  {post.author.bio && (
                    <Typography variant="body2" color="textSecondary" className="mt-1 italic">
                      "{post.author.bio}"
                    </Typography>
                  )}
                </div>
              </div>
              <div className="relative">
                <Button 
                  variant="text" 
                  size="small" 
                  className="min-w-0 p-2"
                  onClick={() => setShowMoreOptions(!showMoreOptions)}
                >
                  <MoreVert className="h-5 w-5" />
                </Button>
                {showMoreOptions && (
                  <div className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border z-50 ${
                    isDark ? 'bg-dark-surface border-gray-600' : 'bg-white border-gray-200'
                  }`}>
                    <div className="py-2">
                      <Button variant="text" size="small" startIcon={<LinkIcon />} className="w-full justify-start px-4">
                        Copy link
                      </Button>
                      <Button variant="text" size="small" startIcon={<Report />} className="w-full justify-start px-4">
                        Report post
                      </Button>
                      {post.user_id !== user?.id && (
                        <Button variant="text" size="small" startIcon={<Block />} className="w-full justify-start px-4">
                          Block user
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="px-6 pb-4">
            <Typography variant="body1" className="whitespace-pre-wrap mb-4 text-lg leading-relaxed">
              {post.content}
            </Typography>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <Badge 
                    key={index}
                    variant="outlined"
                    className={`text-sm cursor-pointer hover:opacity-80 ${
                      isDark ? 'text-lime border-lime/30' : 'text-asu-maroon border-asu-maroon/30'
                    }`}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Post Media */}
          {post.image_url && (
            <div className="mb-4">
              <img
                src={post.image_url}
                alt={post.media_description || "Post image"}
                className="w-full h-auto max-h-[600px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => setShowImageModal(true)}
              />
              {post.media_description && (
                <div className="px-6 py-2">
                  <Typography variant="caption" color="textSecondary">
                    {post.media_description}
                  </Typography>
                </div>
              )}
            </div>
          )}

          {post.video_url && (
            <div className="mb-4 relative">
              <video
                controls
                className="w-full h-auto max-h-[600px] object-cover"
                src={post.video_url}
                poster={post.image_url}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Article Link */}
          {post.article_link && (
            <div className="mx-6 mb-4">
              <Card className={`p-4 border ${
                isDark ? 'border-gray-600 bg-dark-bg' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <Typography variant="subtitle2" className="font-medium">
                      External Article
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="truncate">
                      {post.article_link}
                    </Typography>
                  </div>
                  <Button
                    variant="outlined"
                    size="small"
                    href={post.article_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read More
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Engagement Stats */}
          <div className={`px-6 py-4 border-t border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {post.likes_count > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-lime' : 'bg-asu-maroon'
                    }`}>
                      <ThumbUp className="h-3 w-3 text-white" />
                    </div>
                    <Typography variant="body2" color="textSecondary">
                      {post.likes_count} {post.likes_count === 1 ? 'like' : 'likes'}
                    </Typography>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-6">
                {post.comments_count > 0 && (
                  <Typography variant="body2" color="textSecondary">
                    {post.comments_count} {post.comments_count === 1 ? 'comment' : 'comments'}
                  </Typography>
                )}
                {post.shares_count > 0 && (
                  <Typography variant="body2" color="textSecondary">
                    {post.shares_count} {post.shares_count === 1 ? 'share' : 'shares'}
                  </Typography>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="text"
                startIcon={<ThumbUp />}
                onClick={handleLikePost}
                className={`${
                  post.has_liked 
                    ? isDark ? 'text-lime' : 'text-asu-maroon'
                    : ''
                }`}
              >
                {post.has_liked ? 'Liked' : 'Like'}
              </Button>
              <Button
                variant="text"
                startIcon={<ChatBubbleOutline />}
                onClick={() => document.getElementById('comment-input')?.focus()}
              >
                Comment
              </Button>
              <Button
                variant="text"
                startIcon={<Share />}
              >
                Share
              </Button>
              <Button
                variant="text"
                startIcon={post.has_bookmarked ? <Bookmark /> : <BookmarkBorder />}
                onClick={handleBookmarkPost}
                className={`${
                  post.has_bookmarked 
                    ? isDark ? 'text-lime' : 'text-asu-maroon'
                    : ''
                }`}
              >
                {post.has_bookmarked ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Add Comment Section */}
        <Card className="p-6 mb-6" elevation={1}>
          <div className="flex items-start space-x-4">
            <Avatar
              src={user?.avatar_url}
              alt={user?.name || 'You'}
              size="md"
              fallback={user?.name?.[0] || 'U'}
            />
            <div className="flex-1">
              <Input
                id="comment-input"
                placeholder="Write a thoughtful comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleAddComment();
                  }
                }}
                variant="outlined"
                multiline
                rows={3}
                fullWidth
              />
              <div className="flex items-center justify-between mt-3">
                <Typography variant="caption" color="textSecondary">
                  Press Cmd/Ctrl + Enter to post
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  startIcon={<Send />}
                >
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Comments Section */}
        <div className="space-y-4">
          <Typography variant="h6" className="font-medium">
            Comments ({comments.length})
          </Typography>
          
          {comments.length === 0 ? (
            <Card className="p-8 text-center" elevation={1}>
              <ChatBubbleOutline className={`h-12 w-12 mx-auto mb-4 ${
                isDark ? 'text-dark-muted' : 'text-gray-400'
              }`} />
              <Typography variant="body1" color="textSecondary">
                No comments yet. Be the first to share your thoughts!
              </Typography>
            </Card>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id} className="p-6" elevation={1}>
                <div className="flex items-start space-x-4">
                  <Avatar
                    src={comment.author.avatar_url}
                    alt={comment.author.full_name}
                    size="md"
                    fallback={comment.author.full_name[0]}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Typography variant="subtitle1" className="font-medium">
                        {comment.author.full_name}
                      </Typography>
                      {comment.author.verified && (
                        <Verified className={`h-4 w-4 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
                      )}
                      <div className={`flex items-center space-x-1 ${getRoleColor(comment.author.role)}`}>
                        {getRoleIcon(comment.author.role)}
                      </div>
                      <Typography variant="caption" color="textSecondary">
                        {formatTimeAgo(comment.created_at)}
                      </Typography>
                    </div>
                    
                    <Typography variant="body1" className="mb-3 leading-relaxed">
                      {comment.content}
                    </Typography>
                    
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<FavoriteBorder />}
                        className={`text-sm ${
                          comment.has_liked 
                            ? isDark ? 'text-lime' : 'text-asu-maroon'
                            : ''
                        }`}
                      >
                        {comment.likes_count > 0 ? comment.likes_count : ''} Like
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<Reply />}
                        className="text-sm"
                      >
                        Reply
                      </Button>
                      {comment.replies && comment.replies.length > 0 && (
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => setShowReplies(prev => ({
                            ...prev,
                            [comment.id]: !prev[comment.id]
                          }))}
                          className="text-sm"
                        >
                          {showReplies[comment.id] ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                        </Button>
                      )}
                    </div>

                    {/* Replies */}
                    {showReplies[comment.id] && comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start space-x-3">
                            <Avatar
                              src={reply.author.avatar_url}
                              alt={reply.author.full_name}
                              size="sm"
                              fallback={reply.author.full_name[0]}
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Typography variant="subtitle2" className="font-medium">
                                  {reply.author.full_name}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {formatTimeAgo(reply.created_at)}
                                </Typography>
                              </div>
                              <Typography variant="body2">
                                {reply.content}
                              </Typography>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Image Modal */}
        <Modal
          open={showImageModal}
          onClose={() => setShowImageModal(false)}
          maxWidth="xl"
          className="flex items-center justify-center"
        >
          <div className="relative max-w-full max-h-full">
            <Button
              variant="text"
              className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
              onClick={() => setShowImageModal(false)}
            >
              <Close className="h-6 w-6" />
            </Button>
            {post.image_url && (
              <img
                src={post.image_url}
                alt={post.media_description || "Post image"}
                className="max-w-full max-h-[90vh] object-contain"
              />
            )}
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-4 rounded-lg">
              <Typography variant="body2">
                {post.media_description || 'Image from post'}
              </Typography>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}