import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ThumbUp,
  ChatBubbleOutline,
  Share,
  MoreVert,
  Add,
  Image as ImageIcon,
  VideoLibrary,
  Description,
  TrendingUp,
  Public,
  Lock,
  Group,
  LocationOn,
  Work,
  School,
  Verified,
  Bookmark,
  BookmarkBorder,
  FavoriteBorder,
  Favorite,
  Send,
  EmojiEmotions,
  AttachFile,
  Poll,
  Event,
  Article
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
import Badge from './ui/Badge';

interface Post {
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
  };
  has_liked: boolean;
  has_bookmarked: boolean;
  tags?: string[];
  location?: string;
  poll_options?: PollOption[];
  event_details?: EventDetails;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface EventDetails {
  title: string;
  date: string;
  location: string;
  description: string;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  author: {
    full_name: string;
    avatar_url?: string;
    role: string;
  };
}

export default function Feed() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'text' | 'image' | 'video' | 'article' | 'poll' | 'event'>('text');
  const [newPostVisibility, setNewPostVisibility] = useState<'public' | 'connections' | 'private'>('public');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey(
            full_name,
            avatar_url,
            role,
            company_name,
            title,
            verified
          ),
          post_likes!left(user_id),
          post_bookmarks!left(user_id)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedPosts: Post[] = data?.map(post => ({
        id: post.id,
        user_id: post.user_id,
        content: post.content || post.caption,
        image_url: post.image_url,
        video_url: post.video_url,
        post_type: post.media_type || 'text',
        visibility: 'public',
        likes_count: post.likes_count || 0,
        comments_count: post.comments_count || 0,
        shares_count: post.shares_count || 0,
        created_at: post.created_at,
        updated_at: post.updated_at,
        author: {
          id: post.user_id,
          full_name: post.profiles?.full_name || 'Unknown User',
          avatar_url: post.profiles?.avatar_url,
          role: post.profiles?.role || 'student',
          company: post.profiles?.company_name,
          title: post.profiles?.title,
          verified: post.profiles?.verified || false
        },
        has_liked: post.post_likes?.some((like: any) => like.user_id === user?.id) || false,
        has_bookmarked: post.post_bookmarks?.some((bookmark: any) => bookmark.user_id === user?.id) || false,
        tags: post.tags,
        location: post.location
      })) || [];

      setPosts(formattedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user?.id,
            content: newPostContent,
            post_type: newPostType,
            visibility: newPostVisibility,
            image_url: selectedImage ? URL.createObjectURL(selectedImage) : null
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setNewPostContent('');
      setSelectedImage(null);
      setShowCreatePost(false);
      fetchPosts(); // Refresh posts
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.has_liked) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user?.id);
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert([{ post_id: postId, user_id: user?.id }]);
      }

      // Update local state
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              has_liked: !p.has_liked,
              likes_count: p.has_liked ? p.likes_count - 1 : p.likes_count + 1
            }
          : p
      ));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleBookmarkPost = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.has_bookmarked) {
        await supabase
          .from('post_bookmarks')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user?.id);
      } else {
        await supabase
          .from('post_bookmarks')
          .insert([{ post_id: postId, user_id: user?.id }]);
      }

      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, has_bookmarked: !p.has_bookmarked }
          : p
      ));
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const toggleComments = async (postId: string) => {
    if (!showComments[postId]) {
      // Fetch comments for this post
      try {
        const { data, error } = await supabase
          .from('post_comments')
          .select(`
            *,
            profiles!post_comments_user_id_fkey(
              full_name,
              avatar_url,
              role
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
          created_at: comment.created_at,
          author: {
            full_name: comment.profiles?.full_name || 'Unknown User',
            avatar_url: comment.profiles?.avatar_url,
            role: comment.profiles?.role || 'student'
          }
        })) || [];

        setComments(prev => ({ ...prev, [postId]: formattedComments }));
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    }

    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = async (postId: string) => {
    const content = newComment[postId];
    if (!content?.trim()) return;

    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert([
          {
            post_id: postId,
            user_id: user?.id,
            content: content.trim()
          }
        ])
        .select(`
          *,
          profiles!post_comments_user_id_fkey(
            full_name,
            avatar_url,
            role
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
        created_at: data.created_at,
        author: {
          full_name: data.profiles?.full_name || user?.name || 'You',
          avatar_url: data.profiles?.avatar_url,
          role: data.profiles?.role || 'student'
        }
      };

      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newCommentObj]
      }));

      setNewComment(prev => ({ ...prev, [postId]: '' }));

      // Update comments count
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, comments_count: p.comments_count + 1 }
          : p
      ));
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
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return date.toLocaleDateString();
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
              Loading feed...
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <Typography variant="h4" className="font-medium mb-2">
            Home Feed
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Stay connected with your professional network and discover opportunities.
          </Typography>
        </div>

        {/* Create Post Card */}
        <Card className="p-6 mb-6" elevation={1}>
          <div className="flex items-start space-x-4">
            <Avatar
              src={user?.avatar_url}
              alt={user?.name || 'You'}
              size="md"
              fallback={user?.name?.[0] || 'U'}
            />
            <div className="flex-1">
              <Button
                variant="outlined"
                fullWidth
                className="justify-start h-12 text-left"
                onClick={() => setShowCreatePost(true)}
              >
                <Typography variant="body1" color="textSecondary">
                  Share your thoughts, achievements, or opportunities...
                </Typography>
              </Button>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-2">
                  <Button
                    variant="text"
                    size="small"
                    startIcon={<ImageIcon />}
                    onClick={() => {
                      setNewPostType('image');
                      setShowCreatePost(true);
                    }}
                  >
                    Photo
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    startIcon={<VideoLibrary />}
                    onClick={() => {
                      setNewPostType('video');
                      setShowCreatePost(true);
                    }}
                  >
                    Video
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    startIcon={<Event />}
                    onClick={() => {
                      setNewPostType('event');
                      setShowCreatePost(true);
                    }}
                  >
                    Event
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    startIcon={<Article />}
                    onClick={() => {
                      setNewPostType('article');
                      setShowCreatePost(true);
                    }}
                  >
                    Article
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden" elevation={1}>
              {/* Post Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Avatar
                      src={post.author.avatar_url}
                      alt={post.author.full_name}
                      size="md"
                      fallback={post.author.full_name[0]}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <Typography variant="subtitle1" className="font-medium">
                          {post.author.full_name}
                        </Typography>
                        {post.author.verified && (
                          <Verified className={`h-4 w-4 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
                        )}
                        <div className={`flex items-center space-x-1 ${getRoleColor(post.author.role)}`}>
                          {getRoleIcon(post.author.role)}
                        </div>
                      </div>
                      <Typography variant="body2" color="textSecondary">
                        {post.author.title && `${post.author.title} • `}
                        {post.author.company && `${post.author.company} • `}
                        {formatTimeAgo(post.created_at)}
                      </Typography>
                      {post.location && (
                        <div className="flex items-center space-x-1 mt-1">
                          <LocationOn className="h-3 w-3 text-gray-400" />
                          <Typography variant="caption" color="textSecondary">
                            {post.location}
                          </Typography>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button variant="text" size="small" className="min-w-0 p-1">
                    <MoreVert className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-6 pb-4">
                <Typography variant="body1" className="whitespace-pre-wrap mb-4">
                  {post.content}
                </Typography>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <Badge 
                        key={index}
                        variant="outlined"
                        className={`text-sm ${
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
                    alt="Post image"
                    className="w-full h-auto max-h-96 object-cover cursor-pointer"
                    onClick={() => {
                      // Open image in modal/lightbox
                    }}
                  />
                </div>
              )}

              {/* Engagement Stats */}
              <div className={`px-6 py-3 border-t border-b ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    {post.likes_count > 0 && (
                      <div className="flex items-center space-x-1">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          isDark ? 'bg-lime' : 'bg-asu-maroon'
                        }`}>
                          <ThumbUp className="h-3 w-3 text-white" />
                        </div>
                        <Typography variant="body2" color="textSecondary">
                          {post.likes_count}
                        </Typography>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    {post.comments_count > 0 && (
                      <Typography variant="body2" color="textSecondary" className="cursor-pointer hover:underline">
                        {post.comments_count} comments
                      </Typography>
                    )}
                    {post.shares_count > 0 && (
                      <Typography variant="body2" color="textSecondary">
                        {post.shares_count} shares
                      </Typography>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-3">
                <div className="flex items-center justify-between">
                  <Button
                    variant="text"
                    size="small"
                    startIcon={post.has_liked ? <ThumbUp /> : <ThumbUp />}
                    onClick={() => handleLikePost(post.id)}
                    className={`${
                      post.has_liked 
                        ? isDark ? 'text-lime' : 'text-asu-maroon'
                        : ''
                    }`}
                  >
                    Like
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    startIcon={<ChatBubbleOutline />}
                    onClick={() => toggleComments(post.id)}
                  >
                    Comment
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    startIcon={<Share />}
                  >
                    Share
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    startIcon={post.has_bookmarked ? <Bookmark /> : <BookmarkBorder />}
                    onClick={() => handleBookmarkPost(post.id)}
                    className={`${
                      post.has_bookmarked 
                        ? isDark ? 'text-lime' : 'text-asu-maroon'
                        : ''
                    }`}
                  >
                    Save
                  </Button>
                </div>
              </div>

              {/* Comments Section */}
              {showComments[post.id] && (
                <div className={`border-t px-6 py-4 ${
                  isDark ? 'border-gray-700 bg-dark-surface/50' : 'border-gray-200 bg-gray-50'
                }`}>
                  {/* Add Comment */}
                  <div className="flex items-start space-x-3 mb-4">
                    <Avatar
                      src={user?.avatar_url}
                      alt={user?.name || 'You'}
                      size="sm"
                      fallback={user?.name?.[0] || 'U'}
                    />
                    <div className="flex-1">
                      <Input
                        placeholder="Write a comment..."
                        value={newComment[post.id] || ''}
                        onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                        variant="outlined"
                        multiline
                        rows={1}
                        fullWidth
                        endIcon={
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => handleAddComment(post.id)}
                            disabled={!newComment[post.id]?.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-3">
                    {comments[post.id]?.map((comment) => (
                      <div key={comment.id} className="flex items-start space-x-3">
                        <Avatar
                          src={comment.author.avatar_url}
                          alt={comment.author.full_name}
                          size="sm"
                          fallback={comment.author.full_name[0]}
                        />
                        <div className="flex-1">
                          <div className={`px-3 py-2 rounded-2xl ${
                            isDark ? 'bg-dark-bg' : 'bg-white'
                          }`}>
                            <div className="flex items-center space-x-2 mb-1">
                              <Typography variant="subtitle2" className="font-medium">
                                {comment.author.full_name}
                              </Typography>
                              <div className={`flex items-center space-x-1 ${getRoleColor(comment.author.role)}`}>
                                {getRoleIcon(comment.author.role)}
                              </div>
                            </div>
                            <Typography variant="body2">
                              {comment.content}
                            </Typography>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 ml-3">
                            <Typography variant="caption" color="textSecondary">
                              {formatTimeAgo(comment.created_at)}
                            </Typography>
                            <Button variant="text" size="small" className="text-xs">
                              Like
                            </Button>
                            <Button variant="text" size="small" className="text-xs">
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Create Post Modal */}
        <Modal
          open={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          title="Create a post"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Avatar
                src={user?.avatar_url}
                alt={user?.name || 'You'}
                size="md"
                fallback={user?.name?.[0] || 'U'}
              />
              <div>
                <Typography variant="subtitle1" className="font-medium">
                  {user?.name || 'You'}
                </Typography>
                <select
                  value={newPostVisibility}
                  onChange={(e) => setNewPostVisibility(e.target.value as any)}
                  className={`text-sm border-none bg-transparent focus:outline-none ${
                    isDark ? 'text-dark-muted' : 'text-gray-600'
                  }`}
                >
                  <option value="public">🌍 Public</option>
                  <option value="connections">👥 Connections only</option>
                  <option value="private">🔒 Only me</option>
                </select>
              </div>
            </div>

            <Input
              placeholder="What do you want to talk about?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              variant="outlined"
              multiline
              rows={4}
              fullWidth
            />

            {newPostType === 'image' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <Typography variant="body2" color="textSecondary">
                  Click to add an image or drag and drop
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <div className="flex space-x-2">
                <Button
                  variant="text"
                  size="small"
                  startIcon={<ImageIcon />}
                  onClick={() => setNewPostType('image')}
                  className={newPostType === 'image' ? (isDark ? 'text-lime' : 'text-asu-maroon') : ''}
                >
                  Photo
                </Button>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<VideoLibrary />}
                  onClick={() => setNewPostType('video')}
                  className={newPostType === 'video' ? (isDark ? 'text-lime' : 'text-asu-maroon') : ''}
                >
                  Video
                </Button>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<Poll />}
                  onClick={() => setNewPostType('poll')}
                  className={newPostType === 'poll' ? (isDark ? 'text-lime' : 'text-asu-maroon') : ''}
                >
                  Poll
                </Button>
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
              >
                Post
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}