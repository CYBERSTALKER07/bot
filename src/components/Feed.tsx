import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Bookmark,
  MoreHorizontal,
  Image as ImageIcon,
  Smile,
  Calendar,
  MapPin,
  TrendingUp,
  Users,
  Sparkles,
  User,
  FileText,
  Edit3,
  MessageSquare,
  Plus,
  X,
  Camera,
  Video,
  Send,
  Globe,
  Lock,
  Users2,
  // New imports for left sidebar
  Target,
  Briefcase,
  GraduationCap,
  Award,
  Home,
  Hash,
  Bell,
  Mail,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import Button from './ui/Button';
import { Card } from './ui/Card';
import Avatar from './ui/Avatar';
import Input from './ui/Input';
import PageLayout from './ui/PageLayout';
import { cn } from '../lib/cva';
import AnimatedSearchButton from './AnimatedSearchButton';

interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar_url?: string;
    verified?: boolean;
  };
  created_at: string;
  likes_count: number;
  retweets_count: number;
  replies_count: number;
  has_liked: boolean;
  has_retweeted: boolean;
  has_bookmarked: boolean;
  media?: { type: 'image' | 'video'; url: string; alt?: string }[];
  reply_to?: { id: string; author: { name: string; username: string } };
  // New fields for retweets
  is_retweet?: boolean;
  original_post?: {
    id: string;
    content: string;
    author: {
      id: string;
      name: string;
      username: string;
      avatar_url?: string;
      verified?: boolean;
    };
    created_at: string;
    media?: { type: 'image' | 'video'; url: string; alt?: string }[];
  };
  retweeted_by?: {
    id: string;
    name: string;
    username: string;
    avatar_url?: string;
  };
}

interface NewPost {
  content: string;
  media_type: 'text' | 'image' | 'video';
  visibility: 'public' | 'connections' | 'private';
  location?: string;
  tags?: string[];
  image_url?: string;
  video_url?: string;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_comment_id?: string;
  content: string;
  likes_count: number;
  replies_count: number;
  has_liked: boolean;
  is_edited: boolean;
  edited_at?: string;
  created_at: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar_url?: string;
    verified?: boolean;
  };
  replies?: Comment[];
}

interface ProfileData {
  id?: string;
  username?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  cover_image_url?: string;
  website?: string;
  role?: 'student' | 'employer' | 'admin';
  company_name?: string;
  location?: string;
  created_at?: string;
  skills?: string[];
  portfolio_url?: string;
}

interface ProfileStats {
  following: number;
  followers: number;
  posts: number;
}

export default function Feed() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isFabPressed, setIsFabPressed] = useState(false);
  const [pressedFabItem, setPressedFabItem] = useState<string | null>(null);
  const [hoveredFabItem, setHoveredFabItem] = useState<string | null>(null);
  const [draggedOverItem, setDraggedOverItem] = useState<string | null>(null);
  
  // Post creation state
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState<NewPost>({
    content: '',
    media_type: 'text',
    visibility: 'public',
    tags: []
  });
  const [isPosting, setIsPosting] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  
  // Profile data for left sidebar
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: user?.name || 'User',
    bio: '',
    location: '',
    avatar_url: '',
    cover_image_url: '',
    skills: [],
    portfolio_url: '',
    website: ''
  });

  // Profile stats
  const [profileStats] = useState<ProfileStats>({
    following: 247,
    followers: 342,
    posts: 42
  });
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    fetchPosts();
    loadProfileData();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadProfileData = async () => {
    if (!user) return;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error loading profile:', error);
        return;
      }

      if (profile) {
        setProfileData({
          ...profile,
          skills: profile.skills || []
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      // First, try to fetch posts with a simple query
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (postsError) {
        console.error('Error fetching posts:', postsError);
        setMockPosts();
        return;
      }

      if (postsData && postsData.length > 0) {
        // Fetch user profiles separately for each post
        const userIds = [...new Set(postsData.map(post => post.user_id))];
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, username')
          .in('id', userIds);

        if (profilesError) {
          console.warn('Error fetching profiles, using basic user data:', profilesError);
        }

        // Create a map of user profiles for quick lookup
        const profilesMap = new Map();
        if (profilesData) {
          profilesData.forEach(profile => {
            profilesMap.set(profile.id, profile);
          });
        }

        // Transform posts with proper profile data including avatars
        const transformedPosts: Post[] = postsData.map(post => {
          const userProfile = profilesMap.get(post.user_id);
          
          return {
            id: post.id.toString(),
            content: post.content || '',
            author: {
              id: post.user_id.toString(),
              name: userProfile?.full_name || 'User',
              username: userProfile?.username || `user${post.user_id}`,
              avatar_url: userProfile?.avatar_url || undefined,
              verified: false
            },
            created_at: post.created_at,
            likes_count: post.likes_count || 0,
            retweets_count: post.shares_count || 0,
            replies_count: post.comments_count || 0,
            has_liked: false,
            has_retweeted: false,
            has_bookmarked: false,
            media: post.image_url || post.video_url ? [{
              type: post.media_type === 'video' || post.video_url ? 'video' : 'image',
              url: post.image_url || post.video_url || '',
              alt: 'Post media'
            }] : undefined
          };
        });

        setPosts(transformedPosts);
      } else {
        // If no posts in database, show mock data
        setMockPosts();
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setMockPosts();
      setLoading(false);
    }
  };

  const setMockPosts = () => {
    const mockPosts: Post[] = [
      {
        id: '1',
        content: 'Just landed my dream job at Google! The interview process was challenging but worth it. Thanks to everyone who supported me during this journey 🚀',
        author: {
          id: '1',
          name: 'Sarah Johnson',
          username: 'sarahj',
          verified: true,
          avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b278?w=40&h=40&fit=crop&crop=face'
        },
        created_at: '2024-01-15T10:30:00Z',
        likes_count: 124,
        retweets_count: 23,
        replies_count: 15,
        has_liked: false,
        has_retweeted: false,
        has_bookmarked: false,
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=600&h=400&fit=crop',
            alt: 'Google office celebration'
          }
        ]
      },
      {
        id: '2',
        content: 'Excited to announce our new startup has raised $2M in seed funding! 🎉 Building the future of remote work collaboration tools. DM me if you\'re interested in joining our team!',
        author: {
          id: '2',
          name: 'Alex Rodriguez',
          username: 'alexr_startup',
          verified: false,
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
        },
        created_at: '2024-01-15T08:15:00Z',
        likes_count: 89,
        retweets_count: 34,
        replies_count: 28,
        has_liked: true,
        has_retweeted: false,
        has_bookmarked: true
      },
      {
        id: '3',
        content: 'Pro tip for job seekers: Always research the company culture before your interview. It shows genuine interest and helps you ask better questions! #CareerAdvice #JobSearch',
        author: {
          id: '3',
          name: 'Career Coach Pro',
          username: 'careercoachpro',
          verified: true,
          avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face'
        },
        created_at: '2024-01-15T06:45:00Z',
        likes_count: 256,
        retweets_count: 89,
        replies_count: 45,
        has_liked: false,
        has_retweeted: true,
        has_bookmarked: false
      },
      {
        id: '4',
        content: 'Working on an exciting AI project that could revolutionize how we approach data analysis. Can\'t share details yet, but stay tuned! 🤖',
        author: {
          id: '4',
          name: 'Dr. Maya Patel',
          username: 'mayapatel_ai',
          verified: true,
          avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&crop=face'
        },
        created_at: '2024-01-14T22:30:00Z',
        likes_count: 178,
        retweets_count: 56,
        replies_count: 32,
        has_liked: false,
        has_retweeted: false,
        has_bookmarked: true
      },
      {
        id: '5',
        content: 'Amazing networking event tonight! Met so many talented developers and entrepreneurs. The tech community here is incredible 💪',
        author: {
          id: '5',
          name: 'Jessica Wong',
          username: 'jessicaw_tech',
          verified: false,
          avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
        },
        created_at: '2024-01-14T20:15:00Z',
        likes_count: 67,
        retweets_count: 12,
        replies_count: 18,
        has_liked: true,
        has_retweeted: false,
        has_bookmarked: false,
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop',
            alt: 'Networking event'
          }
        ]
      }
    ];
    setPosts(mockPosts);
  };

  const uploadMedia = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const userId = user?.id;
      
      // Use appropriate bucket based on file type
      const isVideo = file.type.startsWith('video/');
      const bucketName = isVideo ? 'videos' : 'post-images';
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw new Error('Failed to upload media');
    }
  };

  const createPost = async () => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    if (!newPost.content.trim() && !selectedMedia) {
      return; // Don't post empty content
    }

    setIsPosting(true);
    try {
      let mediaUrl = '';
      let mediaType = newPost.media_type;

      // Upload media if selected
      if (selectedMedia) {
        mediaUrl = await uploadMedia(selectedMedia);
        mediaType = selectedMedia.type.startsWith('video/') ? 'video' : 'image';
      }

      // Extract hashtags from content
      const hashtags = newPost.content.match(/#[\w]+/g)?.map(tag => tag.slice(1)) || [];

      // Create post in database
      const postData = {
        user_id: user.id,
        content: newPost.content.trim(),
        media_type: mediaType,
        visibility: newPost.visibility,
        location: newPost.location || null,
        tags: hashtags.length > 0 ? hashtags : null,
        image_url: mediaType === 'image' ? mediaUrl : null,
        video_url: mediaType === 'video' ? mediaUrl : null,
        likes_count: 0,
        comments_count: 0,
        shares_count: 0
      };

      const { data, error } = await supabase
        .from('posts')
        .insert([postData])
        .select(`
          *,
          profiles!posts_user_id_fkey (
            username,
            full_name,
            avatar_url,
            verified
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      // Transform and add the new post to the feed
      const newPostData: Post = {
        id: data.id,
        content: data.content || '',
        author: {
          id: data.user_id,
          name: data.profiles?.full_name || user.profile.full_name || 'Unknown User',
          username: data.profiles?.username || user.profile.username,
          avatar_url: data.profiles?.avatar_url || user.profile.avatar_url || undefined,
          verified: data.profiles?.verified || user.profile.verified || false
        },
        created_at: data.created_at,
        likes_count: 0,
        retweets_count: 0,
        replies_count: 0,
        has_liked: false,
        has_retweeted: false,
        has_bookmarked: false,
        media: mediaUrl ? [{
          type: mediaType === 'video' ? 'video' : 'image',
          url: mediaUrl,
          alt: 'Post media'
        }] : undefined
      };

      // Add new post to the beginning of the feed
      setPosts(prevPosts => [newPostData, ...prevPosts]);

      // Reset form
      setNewPost({
        content: '',
        media_type: 'text',
        visibility: 'public',
        tags: []
      });
      setSelectedMedia(null);
      setMediaPreview(null);
      setShowPostModal(false);

    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedMedia(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);
      
      // Update media type
      setNewPost(prev => ({
        ...prev,
        media_type: file.type.startsWith('video/') ? 'video' : 'image'
      }));
    }
  };

  const removeMedia = () => {
    setSelectedMedia(null);
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaPreview(null);
    setNewPost(prev => ({ ...prev, media_type: 'text' }));
    
    // Reset file inputs
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) fileInputRef.current.value = '';
  };

  // Enhanced engagement functions
  const handleLike = async (postId: string) => {
    if (!user) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newLikedState = !post.has_liked;
        return {
          ...post,
          has_liked: newLikedState,
          likes_count: newLikedState ? post.likes_count + 1 : post.likes_count - 1
        };
      }
      return post;
    }));

    // Add haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleRetweet = async (postId: string, withComment = false) => {
    if (!user) return;

    const originalPost = posts.find(p => p.id === postId);
    if (!originalPost) return;

    if (withComment) {
      // Navigate to create post with retweet context
      navigate('/create-post', { 
        state: { 
          retweetPost: originalPost,
          mode: 'quote' 
        } 
      });
      return;
    }

    // Simple retweet - create a retweet post
    const retweetPost: Post = {
      id: `retweet-${Date.now()}`,
      content: '',
      is_retweet: true,
      original_post: {
        id: originalPost.id,
        content: originalPost.content,
        author: originalPost.author,
        created_at: originalPost.created_at,
        media: originalPost.media
      },
      retweeted_by: {
        id: user.id,
        name: user.profile?.full_name || user.name || 'You',
        username: user.profile?.username || 'you',
        avatar_url: user.profile?.avatar_url
      },
      author: user.profile || {
        id: user.id,
        name: user.name || 'You',
        username: 'you',
        verified: false
      },
      created_at: new Date().toISOString(),
      likes_count: 0,
      retweets_count: 0,
      replies_count: 0,
      has_liked: false,
      has_retweeted: false,
      has_bookmarked: false
    };

    // Add retweet to feed and update original post
    setPosts(prevPosts => [
      retweetPost,
      ...prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              has_retweeted: !post.has_retweeted,
              retweets_count: post.has_retweeted ? post.retweets_count - 1 : post.retweets_count + 1
            }
          : post
      )
    ]);

    // Add haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50, 100, 50]);
    }
  };

  const handleShare = async (post: Post) => {
    const shareData = {
      title: `${post.author.name} on TalentLink`,
      text: post.content.slice(0, 100) + (post.content.length > 100 ? '...' : ''),
      url: `${window.location.origin}/#/post/${post.id}`
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareData.url);
      // TODO: Show toast notification
      alert('Link copied to clipboard!');
    }
  };

  const handleBookmark = async (postId: string) => {
    if (!user) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          has_bookmarked: !post.has_bookmarked
        };
      }
      return post;
    }));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'now';
    if (hours < 24) return `${hours}h`;
    return date.toLocaleDateString();
  };

  const handleFabPressStart = () => {
    setIsFabPressed(true);
  };

  const handleFabPressEnd = () => {
    setIsFabPressed(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element instanceof HTMLElement) {
      const actionId = element.getAttribute('data-action-id');
      if (actionId) {
        setDraggedOverItem(actionId);
      } else {
        setDraggedOverItem(null);
      }
    }
  };

  const getFabMenuPosition = (index: number, totalItems: number) => {
    const angle = (index / (totalItems - 1)) * Math.PI - Math.PI / 2;
    const radius = 80;
    const startAngle = 225; // Start from bottom-left
    const endAngle = 315; // End at bottom-right
    const angleSpread = endAngle - startAngle;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    
    return {
      transform: `translate(${x}px, ${y}px)`
    };
  };

  if (loading) {
    return (
      <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'}>
        <div className={cn(
          'flex justify-center items-center min-h-screen',
          isMobile ? 'pt-16 pb-20' : ''
        )}>
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
            isDark ? 'border-white' : 'border-black'
          }`}></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <div className={cn(
      'min-h-screen w-full',
      isDark ? 'bg-black text-white' : 'bg-white text-black',
      isMobile ? 'pb-20' : 'flex'
    )}>
      {/* Left Sidebar - Hidden on mobile */}
      <div className="hidden lg:block w-80 p-4 space-y-6 bg-white border-r border-gray-200 ml-20 sticky top-0 h-screen overflow-y-auto">
        {/* User Profile Quick View */}
        <div className="relative rounded-2xl p-4 text-white overflow-hidden">
          {/* Cover Photo Background */}
          {profileData.cover_image_url ? (
            <img
              src={profileData.cover_image_url}
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl" />
          )}
          
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40 rounded-2xl" />
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              {profileData.avatar_url ? (
                <img
                  src={profileData.avatar_url}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-white object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full border-2 border-white bg-white/20 flex items-center justify-center text-white font-bold">
                  {(profileData.full_name || user?.name || 'U').charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-sm">
                  {profileData.full_name || user?.name || 'User'}
                </h3>
                <p className="text-white/80 text-xs">
                  @{profileData.username || 'username'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <div className="font-bold">{profileStats.followers}</div>
                <div className="text-white/80">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{profileStats.following}</div>
                <div className="text-white/80">Following</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Career Assistant - Unique Feature */}
        <div className="bg-primary rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-3">
            {/* <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            </div> */}
            <h3 className="font-bold text-lg">AI search</h3>
          </div>
          <p className="text-sm text-white/90 mb-3">
            Get personalized career guidance based on your profile and goals
          </p>
          <div className="space-y-2">
            <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-2 text-xs text-left transition-colors">
              Daily Career Tip: "Network authentically, not just for opportunities"
            </button>
            <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-2 text-xs text-left transition-colors">
              Next Goal: Complete 3 skill assessments this week
            </button>
          </div>
        </div>

        {/* Skills Development Tracker */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Skill Progress</h3>
              <button className="text-[#7BA805] text-sm hover:underline">View All</button>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {[
              { skill: 'React', level: 85, trending: true },
              { skill: 'TypeScript', level: 72, trending: false },
              { skill: 'Node.js', level: 68, trending: true }
            ].map((skill, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{skill.skill}</span>
                  </div>
                  <span className="text-xs text-gray-600">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-[#BCE953] h-1.5 rounded-full transition-all duration-300"
                    style={{width: `${skill.level}%`}}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Insights */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Industry Pulse</h3>
            <p className="text-xs text-gray-600">Real-time market insights</p>
          </div>
          <div className="divide-y divide-gray-200">
            {[
              { 
                title: 'AI/ML Engineers', 
                change: '+23%', 
                trend: 'up',
                description: 'Demand surge this month'
              },
              { 
                title: 'Full-Stack Developers', 
                change: '+15%', 
                trend: 'up',
                description: 'Remote opportunities rising'
              },
              { 
                title: 'UX Designers', 
                change: '+8%', 
                trend: 'up',
                description: 'Fintech sector leading'
              }
            ].map((insight, index) => (
              <div key={index} className="p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{insight.title}</span>
                </div>
                <p className="text-xs text-gray-600">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mentorship Marketplace */}
        {/* <div className="bg-blue-950 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5" />
            <h3 className="font-bold">Find a Mentor</h3>
          </div>
          <p className="text-sm text-white/90 mb-3">
            Connect with industry professionals for 1-on-1 guidance
          </p>
          <div className="flex -space-x-2 mb-3">
            {[1,2,3,4].map((i) => (
              <div key={i} className="w-8 h-8 bg-white/20 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold">
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            <div className="w-8 h-8 bg-white/30 rounded-full border-2 border-white flex items-center justify-center text-xs">
              +12
            </div>
          </div>
          <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg py-2 text-sm font-medium transition-colors">
            Browse Mentors
          </button>
        </div> */}

        {/* Career Opportunities Scanner */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <h3 className="font-bold text-gray-900">jobs that mtach your interest</h3>
            </div>
            <p className="text-xs text-gray-600">Matching your profile in real-time</p>
          </div>
          <div className="p-4 space-y-3">
            {[
              { 
                company: 'Google', 
                role: 'Frontend Developer',
                match: 94,
                timeLeft: '2 days',
                applicants: 23
              },
              { 
                company: 'Meta', 
                role: 'Product Manager',
                match: 87,
                timeLeft: '5 days',
                applicants: 45
              }
            ].map((opp, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">{opp.role}</h4>
                    <p className="text-xs text-gray-600">{opp.company}</p>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      'text-xs px-2 py-1 rounded-full font-medium',
                      opp.match >= 90 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    )}>
                      {opp.match}% match
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{opp.applicants} applied</span>
                  <span>Closes in {opp.timeLeft}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Post Button */}
        {/* <Button
          onClick={() => navigate('/create-post')}
          className="w-full bg-[#BCE953] hover:bg-[#A8D543] text-black font-bold py-3 rounded-full flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Post
        </Button> */}

        {/* Recent Connections */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Recent Connections</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {[
              { name: 'Alex Chen', role: 'Software Engineer', avatar: '' },
              { name: 'Sarah Johnson', role: 'Product Manager', avatar: '' },
              { name: 'Mike Rodriguez', role: 'Designer', avatar: '' }
            ].map((connection, index) => (
              <div key={index} className="p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-sm">
                    {connection.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {connection.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {connection.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings and Logout */}
        <div className="space-y-2">
          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => {/* handle logout */}}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className={cn(
        'flex-1',
        isMobile 
          ? 'pt-16 px-0' 
          : 'lg:ml-0 max-w-2xl mx-auto'
      )}>
        {/* Mobile/Desktop Header */}
        <div className={cn(
          'sticky top-0 z-10 backdrop-blur-xl border-none',
          isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200',
          isMobile ? 'top-16' : 'top-0'
        )}>
          
          {/* Mobile Create Post Button */}
       
        </div>

        {/* Posts Feed */}
        <div className={cn(
          'border-[0.5px] divide-y',
          isDark ? 'border-gray-800 divide-gray-800' : 'divide-gray-200'
        )}>
          {posts.map((post) => (
            <div 
              key={post.id} 
              className={cn(
                'transition-colors cursor-pointer',
                isDark ? 'hover:bg-gray-950/50' : 'hover:bg-gray-50/50',
                isMobile ? 'p-3' : 'p-4'
              )}
              onClick={() => navigate(`/post/${post.original_post?.id || post.id}`)}
            >
              {/* Retweet Header - Shows when this is a retweet */}
              {post.is_retweet && post.retweeted_by && (
                <div className={cn(
                  'flex items-center space-x-2 mb-3 text-gray-500',
                  isMobile ? 'text-xs' : 'text-sm'
                )}>
                  <Repeat2 className={cn(isMobile ? 'h-3 w-3' : 'h-4 w-4')} />
                  <Link 
                    to={`/profile/${post.retweeted_by.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="hover:underline font-medium"
                  >
                    {post.retweeted_by.name} retweeted
                  </Link>
                </div>
              )}

              <div className={cn('flex space-x-3', isMobile ? 'space-x-2' : 'space-x-3')}>
                {/* Display original author avatar for retweets, otherwise current author */}
                <Link 
                  to={`/profile/${post.is_retweet ? post.original_post?.author.id : post.author.id}`} 
                  onClick={(e) => e.stopPropagation()}
                  className="flex-shrink-0 hover:opacity-80 transition-opacity"
                >
                  <Avatar
                    src={post.is_retweet ? post.original_post?.author.avatar_url : post.author.avatar_url}
                    alt={post.is_retweet ? post.original_post?.author.name : post.author.name}
                    name={post.is_retweet ? post.original_post?.author.name : post.author.name}
                    size={isMobile ? 'sm' : 'md'}
                    className="cursor-pointer"
                  />
                </Link>
                
                <div className="flex-1 min-w-0">
                  {/* Author Info - Shows original author for retweets */}
                  <div className={cn(
                    'flex items-center mb-1',
                    isMobile ? 'flex-col items-start space-y-1' : 'space-x-2'
                  )}>
                    <div className="flex items-center space-x-2">
                      <Link 
                        to={`/profile/${post.is_retweet ? post.original_post?.author.id : post.author.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                          'font-bold hover:underline cursor-pointer',
                          isMobile ? 'text-sm' : 'text-base'
                        )}
                      >
                        {post.is_retweet ? post.original_post?.author.name : post.author.name}
                      </Link>
                      {(post.is_retweet ? post.original_post?.author.verified : post.author.verified) && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div className={cn(
                      'flex items-center space-x-1 text-gray-500',
                      isMobile ? 'text-xs' : 'text-sm'
                    )}>
                      <span>@{post.is_retweet ? post.original_post?.author.username : post.author.username}</span>
                      <span>·</span>
                      <span>{formatTime(post.is_retweet ? post.original_post?.created_at || post.created_at : post.created_at)}</span>
                    </div>
                  </div>
                  
                  {/* Post Content - Shows original content for retweets */}
                  <p className={cn(
                    'leading-normal mb-3 whitespace-pre-wrap',
                    isMobile ? 'text-sm' : 'text-base'
                  )}>
                    {post.is_retweet ? post.original_post?.content : post.content}
                  </p>

                  {/* Media Content - Shows original media for retweets */}
                  {(post.is_retweet ? post.original_post?.media : post.media) && (
                    <div className="grid grid-cols-1 gap-2 mb-3">
                      {(post.is_retweet ? post.original_post?.media : post.media)?.map((media, index) => (
                        <div key={index} className="relative">
                          {media.type === 'image' ? (
                            <img
                              src={media.url}
                              alt={media.alt || ''}
                              className="rounded-lg object-cover w-full"
                            />
                          ) : (
                            <video
                              autoPlay
                              muted
                              loop
                              playsInline
                              className="rounded-lg w-full"
                            >
                              <source src={media.url} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Post Actions - Enhanced with dropdown for retweet options */}
                  <div className={cn(
                    'flex items-center justify-between',
                    isMobile ? 'max-w-full' : 'max-w-md'
                  )}>
                    {/* Reply Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/post/${post.original_post?.id || post.id}`);
                      }}
                      className={cn(
                        'flex items-center space-x-2 rounded-full group transition-colors',
                        isDark 
                          ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-500/10',
                        isMobile ? 'p-1' : 'p-2'
                      )}
                    >
                      <MessageCircle className={cn(isMobile ? 'h-4 w-4' : 'h-5 w-5')} />
                      <span className={cn(isMobile ? 'text-xs' : 'text-sm')}>{post.replies_count}</span>
                    </Button>
                    
                    {/* Retweet Button with Dropdown */}
                    <div className="relative group">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetweet(post.original_post?.id || post.id);
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Show retweet options menu
                        }}
                        className={cn(
                          'flex items-center space-x-2 rounded-full group transition-colors',
                          post.has_retweeted
                            ? 'text-green-500 hover:text-green-400'
                            : isDark 
                              ? 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
                              : 'text-gray-600 hover:text-green-600 hover:bg-green-500/10',
                          isMobile ? 'p-1' : 'p-2'
                        )}
                      >
                        <Repeat2 className={cn(isMobile ? 'h-4 w-4' : 'h-5 w-5')} />
                        <span className={cn(isMobile ? 'text-xs' : 'text-sm')}>{post.retweets_count}</span>
                      </Button>
                      
                      {/* Retweet Options Dropdown */}
                      <div className={cn(
                        'absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-1 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10'
                      )}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRetweet(post.original_post?.id || post.id, false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-sm"
                        >
                          <Repeat2 className="h-4 w-4" />
                          <span>Retweet</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRetweet(post.original_post?.id || post.id, true);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-sm"
                        >
                          <Edit3 className="h-4 w-4" />
                          <span>Quote Retweet</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Like Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post.original_post?.id || post.id);
                      }}
                      className={cn(
                        'flex items-center space-x-2 rounded-full group transition-colors',
                        post.has_liked
                          ? 'text-red-500 hover:text-red-400'
                          : isDark 
                            ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                            : 'text-gray-600 hover:text-red-600 hover:bg-red-500/10',
                        isMobile ? 'p-1' : 'p-2'
                      )}
                    >
                      <Heart className={cn(
                        post.has_liked ? 'fill-current' : '',
                        isMobile ? 'h-4 w-4' : 'h-5 w-5'
                      )} />
                      <span className={cn(isMobile ? 'text-xs' : 'text-sm')}>{post.likes_count}</span>
                    </Button>
                    
                    {/* Share Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(post.original_post || post);
                      }}
                      className={cn(
                        'flex items-center space-x-2 rounded-full group transition-colors',
                        isDark 
                          ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-500/10',
                        isMobile ? 'p-1' : 'p-2'
                      )}
                    >
                      <Share className={cn(isMobile ? 'h-4 w-4' : 'h-5 w-5')} />
                    </Button>
                    
                    {/* Bookmark Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmark(post.original_post?.id || post.id);
                      }}
                      className={cn(
                        'flex items-center space-x-2 rounded-full group transition-colors',
                        post.has_bookmarked
                          ? 'text-yellow-500 hover:text-yellow-400'
                          : isDark 
                            ? 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10'
                            : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-500/10',
                        isMobile ? 'p-1' : 'p-2'
                      )}
                    >
                      <Bookmark className={cn(
                        post.has_bookmarked ? 'fill-current' : '',
                        isMobile ? 'h-4 w-4' : 'h-5 w-5'
                      )} />
                    </Button>
                  </div>
                </div>
                
                {!isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-white hover:text-gray-700 hover:bg-gray-500/10 rounded-full"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Loading More */}
        <div className={cn('text-center', isMobile ? 'p-4' : 'p-8')}>
          <Button
            variant="ghost"
            className="text-blue-500 hover:bg-blue-500/10"
          >
            Show more posts
          </Button>
        </div>
      </main>

      {/* Right Sidebar - Desktop Only */}
      {!isMobile && (
        <aside className={cn(
          'hidden xl:block w-[400px] border-l sticky top-0 h-screen mr-0 overflow-y-auto',
          isDark ? 'border-gray-800' : 'border-gray-200'
        )}>
          <div className="p-4 space-y-6">
            {/* Job Recommendations */}
            <div className={cn(
              'rounded-xl p-4 border',
              isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
            )}>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Bookmark className="h-5 w-5 mr-2" />
                Jobs For You
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: 'Frontend Developer',
                    company: 'Google',
                    location: 'Remote',
                    salary: '$120k - $180k',
                    logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=40&h=40&fit=crop&crop=center'
                  },
                  {
                    title: 'Product Manager',
                    company: 'Meta',
                    location: 'San Francisco',
                    salary: '$150k - $200k',
                    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=40&h=40&fit=crop&crop=center'
                  },
                  {
                    title: 'Data Scientist',
                    company: 'Netflix',
                    location: 'Los Angeles',
                    salary: '$140k - $190k',
                    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=40&h=40&fit=crop&crop=center'
                  }
                ].map((job, index) => (
                  <div key={index} className={cn(
                    'p-3 rounded-xl bg-[#8056E6] hover:bg-gray-800/30 cursor-pointer transition-colors',
                    isDark ? 'hover:bg-gray-800/30' : 'hover:bg-[#8056E6]/90'
                  )}>
                    <div className="flex items-center space-x-3 mb-2">
                      <img src={job.logo} alt={job.company} className="w-10 h-10 rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm">{job.title}</h4>
                        <p className={cn('text-xs', isDark ? 'text-white' : 'text-white')}>
                          {job.company} • {job.location}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-green-500">{job.salary}</p>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-black">
                View All Jobs
              </Button>
            </div>

            {/* Who to Follow */}
            <div className={cn(
              'rounded-xl p-4 border',
              isDark ? 'bg-black border-gray-800' : 'bg-lime border-gray-200'
            )}>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Who to Follow
              </h3>
              <div className="space-y-4">
                {[
                  {
                    name: 'Emily Chen',
                    username: 'emilychen_dev',
                    title: 'Senior Engineer at Apple',
                    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b278?w=40&h=40&fit=crop&crop=face',
                    verified: true
                  },
                  {
                    name: 'Marcus Johnson',
                    username: 'marcusj_pm',
                    title: 'Product Lead at Stripe',
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
                    verified: false
                  },
                  {
                    name: 'Tesla Careers',
                    username: 'teslacareers',
                    title: 'Official Tesla Recruiting',
                    avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=center',
                    verified: true
                  }
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <div className="flex items-center space-x-1">
                          <h4 className="font-semibold text-sm">{user.name}</h4>
                          {user.verified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <p className={cn('text-xs', isDark ? 'text-white' : 'text-balance')}>
                          @{user.username}
                        </p>
                        <p className={cn('text-xs', isDark ? 'text-white' : 'text-balance')}>
                          {user.title}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" className="rounded-xl w-[70px] h-[30px] bg-[#000000] text-white hover:bg-[#8056E6]">
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-black">
                Show More
              </Button>
            </div>

            {/* Recent Activity */}
            <div className={cn(
              'rounded-xl p-4 border',
              isDark ? 'bg-black border-gray-800' : 'bg-[#800020] border-gray-200'
            )}>
              <h3 className="font-bold text-lg mb-4 text-white">Recent Activity</h3>
              <div className="space-y-3 text-white">
                {[
                  { action: 'New job posted', detail: 'Senior Developer at Spotify', time: '2h ago' },
                  { action: 'Event reminder', detail: 'Tech Networking Meetup', time: '4h ago' },
                  { action: 'Profile view', detail: '12 people viewed your profile', time: '6h ago' },
                  { action: 'Application update', detail: 'Your Netflix application is under review', time: '1d ago' }
                ].map((activity, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">{activity.action}</p>
                    <p className={cn('text-xs', isDark ? 'text-white' : 'text-white')}>
                      {activity.detail}
                    </p>
                    <p className={cn('text-xs', isDark ? 'text-white' : 'text-white')}>
                      {activity.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            <div className={cn('text-xs space-y-2', isDark ? 'text-white' : 'text-white')}>
              <div className="flex flex-wrap gap-2">
                <a href="/about" className="hover:underline">About</a>
                <a href="/privacy" className="hover:underline">Privacy</a>
                <a href="/terms" className="hover:underline">Terms</a>
                <a href="/help" className="hover:underline">Help</a>
              </div>
              <p>© 2025 TalentLink. All rights reserved.</p>
            </div>
            <AnimatedSearchButton />
          </div>
        </aside>
      )}

      {/* Floating Action Button - Using Mobile Curved Animation Patterns for Desktop */}
      {!isMobile && (
        <div className="fixed bottom-6 right-6 z-50">
          {/* Enhanced backdrop with blur like mobile */}
          {isFabOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-1 transition-all duration-300 ease-out"
              onClick={() => setIsFabOpen(false)}
              style={{
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}
            />
          )}

          {/* FAB Menu Items - Using mobile curved positioning and animations */}
          <div className="relative">
            {[
              { id: 'post', icon: Edit3, label: 'Create Post', color: 'bg-blue-500 hover:bg-blue-600', action: () => navigate('/create-post') },
              { id: 'message', icon: MessageSquare, label: 'Messages', color: 'bg-green-500 hover:bg-green-600', action: () => navigate('/messages') },
              { id: 'share', icon: Share, label: 'Share', color: 'bg-purple-500 hover:bg-purple-600', action: () => console.log('Share') },
              { id: 'bookmark', icon: Bookmark, label: 'Bookmarks', color: 'bg-orange-500 hover:bg-orange-600', action: () => navigate('/bookmarks') }
            ].map((action, index) => {
              const IconComponent = action.icon;
              const isPressed = pressedFabItem === action.id;
              const isHovered = hoveredFabItem === action.id;
              const isDraggedOver = draggedOverItem === action.id;

              // Mobile-style curved positioning function
              const getFabMenuPosition = (index: number, total: number) => {
                const baseRadius = 100;
                const radiusAdjustment = Math.min(15, total * 3);
                const radius = baseRadius + radiusAdjustment;
                
                const maxAngleSpread = 135;
                const minAngleSpread = 50;
                const angleSpread = Math.max(minAngleSpread, Math.min(maxAngleSpread, total * 18));
                
                const centerAngle = 225; // Curve to the left like mobile
                const startAngle = centerAngle - (angleSpread / 2);
                const endAngle = centerAngle + (angleSpread / 2);
                
                const step = total > 1 ? angleSpread / (total - 1) : 0;
                const angle = startAngle + (index * step);
                const rad = (angle * Math.PI) / 180;
                
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;
                
                const curveOffset = Math.sin((index / Math.max(total - 1, 1)) * Math.PI) * 8;
                const adjustedY = y + curveOffset;
                
                return {
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${adjustedY}px))`,
                  transitionDelay: `${index * 50}ms`,
                  transitionDuration: '350ms',
                  transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                };
              };
              
              return (
                <button
                  key={action.id}
                  data-action-id={action.id}
                  onMouseDown={() => {
                    setPressedFabItem(action.id);
                    setHoveredFabItem(action.id);
                  }}
                  onMouseUp={() => {
                    setPressedFabItem(null);
                    action.action();
                  }}
                  onMouseEnter={() => setHoveredFabItem(action.id)}
                  onMouseLeave={() => {
                    setPressedFabItem(null);
                    setHoveredFabItem(null);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.action();
                  }}
                  className={`
                    absolute w-14 h-14 rounded-full shadow-xl flex items-center justify-center
                    transition-all duration-300 ease-out text-white border-2 border-white/20
                    touch-manipulation select-none transform-gpu
                    ${isFabOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-0 pointer-events-none'}
                    ${isPressed || isDraggedOver
                      ? 'scale-150 shadow-2xl ring-4 ring-white/30 border-white/40' 
                      : isHovered 
                        ? 'scale-125 shadow-xl border-white/30' 
                        : 'scale-100 hover:scale-110 active:scale-95'
                    }
                    ${action.color}
                  `}
                  style={isFabOpen ? getFabMenuPosition(index, 4) : { 
                    transform: 'translate(-50%, -50%) scale(0)',
                    opacity: 0
                  }}
                  aria-label={action.label}
                >
                  <IconComponent className={`transition-all duration-200 ${
                    isPressed || isDraggedOver || isHovered ? 'h-8 w-8' : 'h-6 w-6'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Main FAB Button - Using mobile styling and animations */}
          <button
            onMouseDown={handleFabPressStart}
            onMouseUp={handleFabPressEnd}
            onMouseLeave={handleFabPressEnd}
            onClick={(e) => {
              e.stopPropagation();
              if (!isFabOpen && !isFabPressed) {
                setIsFabOpen(!isFabOpen);
              }
            }}
            className={`
              relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center
              transition-all duration-300 ease-out border-2 border-white/20
              touch-manipulation select-none transform-gpu
              ${isFabOpen 
                ? 'bg-red-500 rotate-45 scale-110 shadow-red-500/30' 
                : isFabPressed 
                  ? 'bg-[#BCE953] text-black scale-125 shadow-[#BCE953]/40 ring-4 ring-[#BCE953]/30'
                  : 'bg-[#BCE953] text-black hover:scale-105 active:scale-95'
              }
              text-black font-bold z-50
            `}
            style={{
              boxShadow: isFabPressed 
                ? '0 8px 20px rgba(0, 0, 0, 0.25)' 
                : isFabOpen
                  ? '0 15px 35px rgba(0, 0, 0, 0.3), 0 0 30px rgba(239, 68, 68, 0.4)'
                  : '0 10px 25px rgba(0, 0, 0, 0.2), 0 0 20px rgba(188, 233, 83, 0.3)'
            }}
            aria-label={isFabOpen ? "Close menu" : "Open menu"}
            aria-expanded={isFabOpen ? 'true' : 'false'}
          >
            <Plus className={`h-8 w-8 transition-transform duration-300 ${isFabOpen ? 'rotate-45' : 'rotate-0'}`} />
          </button>
        </div>
      )}

      {/* Post Creation Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg mx-4 p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setShowPostModal(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Create Post</h2>
            <div className="flex items-start space-x-4">
              <Avatar src={user?.profile.avatar_url} alt={user?.profile.full_name} size="lg" />
              <div className="flex-1">
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={4}
                  placeholder="What's on your mind?"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
                {mediaPreview && (
                  <div className="relative mt-4">
                    {newPost.media_type === 'image' ? (
                      <img src={mediaPreview} alt="Selected media" className="w-full h-auto rounded-lg" />
                    ) : (
                      <video src={mediaPreview} controls className="w-full h-auto rounded-lg" />
                    )}
                    <button
                      className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1"
                      onClick={removeMedia}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <div className="flex items-center space-x-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-5 h-5" />
                    <span>Photo</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <Video className="w-5 h-5" />
                    <span>Video</span>
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleMediaSelect}
                  />
                  <input
                    type="file"
                    accept="video/*"
                    ref={videoInputRef}
                    className="hidden"
                    onChange={handleMediaSelect}
                  />
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => setNewPost({ ...newPost, visibility: 'public' })}
                  >
                    <Globe className="w-5 h-5" />
                    <span>Public</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => setNewPost({ ...newPost, visibility: 'connections' })}
                  >
                    <Users2 className="w-5 h-5" />
                    <span>Connections</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => setNewPost({ ...newPost, visibility: 'private' })}
                  >
                    <Lock className="w-5 h-5" />
                    <span>Private</span>
                  </Button>
                </div>
                <Button
                  className="mt-4 w-full"
                  onClick={createPost}
                  disabled={isPosting}
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}