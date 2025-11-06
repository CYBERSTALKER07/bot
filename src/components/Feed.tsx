import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Bookmark,
  Users,
  Edit3,
  MessageSquare,
  Plus,
  X,
  Camera,
  Video,
  Globe,
  Lock,
  Users2,
  Settings,
  LogOut,
  Search,
  AtSign,
  MapPin,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import Button from './ui/Button';
import Avatar from './ui/Avatar';
import PageLayout from './ui/PageLayout';
import RetweetButton from './RetweetButton';
import VideoPlayer from './ui/VideoPlayer';
import { cn } from '../lib/cva';
import { usePosts, useCreatePost, useProfile, useSearch, useRecommendedUsers, useFollowUser, useUnfollowUser, useFollowStatus, useRecommendedCompanies, useEmployerEvents, useLikePost, useUnlikePost, useMatchedJobs, useMostLikedPosts } from '../hooks/useOptimizedQuery';
import { useJobs } from '../hooks/useJobs';
import { useDebounce } from '../hooks/useDebounce';
import { useFollowStatusCache } from '../hooks/useFollowStatusCache';
import { useCreateRetweet, useRemoveRetweet } from '../hooks/useRetweet';
import { PostCardSkeleton, RightSidebarSearchSkeleton, RightSidebarJobsSkeleton, RightSidebarWhoToFollowSkeleton, LeftSidebarSkeleton, RightSidebarSkeleton } from './ui/Skeleton';
import WhoToFollowItem from './WhoToFollowItem';
import AnimatedList from './AnimatedList';

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
  parent_id?: string;
  content: string;
  like_count: number;
  reply_count: number;
  has_liked: boolean;
  is_edited: boolean;
  updated_at?: string;
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

interface SearchResult {
  id: string;
  type: 'user';
  title: string;
  subtitle?: string;
  description: string;
  avatar?: string;
  verified?: boolean;
}

interface SearchResultData {
  users?: Array<{ id: string; full_name: string; username: string; bio?: string; avatar_url?: string; verified?: boolean }>;
}

export default function Feed() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const { data: posts = [], isLoading: loading, error } = usePosts(20, user?.id);
  const createPostMutation = useCreatePost();
  const { data: profileData = {}, isLoading: profileLoading } = useProfile(user?.id);
  const { data: recommendedUsers = [], isLoading: recommendedUsersLoading } = useRecommendedUsers(user?.id, 6);
  const { jobs = [], loading: jobsLoading, error: jobsError } = useJobs(); // Fix: Destructure correctly
  const { data: recommendedCompanies = [], isLoading: companiesLoading } = useRecommendedCompanies(3);
  const { data: employerEvents = [], isLoading: eventsLoading } = useEmployerEvents();
  const { data: matchedJobs = [], isLoading: matchedJobsLoading } = useMatchedJobs(user?.id);
  const { data: mostLikedPosts = [], isLoading: mostLikedPostsLoading } = useMostLikedPosts(3);
  const followUserMutation = useFollowUser();
  const unfollowUserMutation = useUnfollowUser();
  const createRetweetMutation = useCreateRetweet();
  const removeRetweetMutation = useRemoveRetweet();
  const likePostMutation = useLikePost();
  const unlikePostMutation = useUnlikePost();
  
  // Track retweet operations in progress
  const [retweetingPostIds, setRetweetingPostIds] = useState<Set<string>>(new Set());
  
  // Profile stats - fetch real data from database
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    following: 0,
    followers: 0,
    posts: 0
  });

  // Fetch profile stats when user ID changes
  useEffect(() => {
    const fetchProfileStats = async () => {
      if (!user?.id) return;

      try {
        // Fetch followers count
        const { count: followersCount } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', user.id);

        // Fetch following count
        const { count: followingCount } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', user.id);

        // Fetch posts count
        const { count: postsCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        setProfileStats({
          followers: followersCount || 0,
          following: followingCount || 0,
          posts: postsCount || 0
        });
      } catch (error) {
        console.error('Error fetching profile stats:', error);
        // Keep default stats on error
      }
    };

    fetchProfileStats();
  }, [user?.id]);

  // Search state for right sidebar
  const [sidebarSearchInput, setSidebarSearchInput] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Parse search input to detect @ symbol
  const isUsernameSearch = sidebarSearchInput.startsWith('@');
  const cleanSearchQuery = sidebarSearchInput.startsWith('@') ? sidebarSearchInput.slice(1) : sidebarSearchInput;
  
  const debouncedSearchQuery = useDebounce(cleanSearchQuery, 300);
  const { data: searchResults, isLoading: searchLoading } = useSearch(debouncedSearchQuery);

  // Filter and sort search results based on search type
  const userSearchResults: SearchResult[] = useMemo(() => {
    const typedResults = searchResults as SearchResultData | undefined;
    if (!typedResults) return [];
    
    const users: SearchResult[] = [];
    (typedResults.users || []).forEach((user) => {
      users.push({
        id: user.id,
        type: 'user',
        title: user.full_name,
        subtitle: `@${user.username}`,
        description: user.bio || '',
        avatar: user.avatar_url,
        verified: user.verified || false,
      });
    });

    // If searching by username (@), prioritize exact username matches
    if (isUsernameSearch && cleanSearchQuery) {
      users.sort((a, b) => {
        const aUsername = a.subtitle?.slice(1) || '';
        const bUsername = b.subtitle?.slice(1) || '';
        
        // Exact match first
        if (aUsername.toLowerCase() === cleanSearchQuery.toLowerCase()) return -1;
        if (bUsername.toLowerCase() === cleanSearchQuery.toLowerCase()) return 1;
        
        // Starts with query
        if (aUsername.toLowerCase().startsWith(cleanSearchQuery.toLowerCase())) return -1;
        if (bUsername.toLowerCase().startsWith(cleanSearchQuery.toLowerCase())) return 1;
        
        // Default order
        return 0;
      });
    }

    return users;
  }, [searchResults, isUsernameSearch, cleanSearchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAtSymbolClick = () => {
    setSidebarSearchInput('@');
    searchInputRef.current?.focus();
  };

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isFabPressed, setIsFabPressed] = useState(false);
  const [pressedFabItem, setPressedFabItem] = useState<string | null>(null);
  const [hoveredFabItem, setHoveredFabItem] = useState<string | null>(null);
  const [draggedOverItem, setDraggedOverItem] = useState<string | null>(null);
  
  // Tab switcher state - for jobs and vacancies feed
  const [activeTab, setActiveTab] = useState<'for-you' | 'explore'>('for-you');
  
  // Track follow status for recommended users - now with processing state
  const [followStatus, setFollowStatus] = useState<Record<string, boolean>>({});
  const [processingFollowId, setProcessingFollowId] = useState<string | null>(null);
  const [hoveredFollowId, setHoveredFollowId] = useState<string | null>(null);
  
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

  const timelineRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      return;
    }

    setIsPosting(true);
    try {
      let mediaUrl = '';
      let mediaType = newPost.media_type;

      if (selectedMedia) {
        mediaUrl = await uploadMedia(selectedMedia);
        mediaType = selectedMedia.type.startsWith('video/') ? 'video' : 'image';
      }

      const hashtags = newPost.content.match(/#[\w]+/g)?.map(tag => tag.slice(1)) || [];

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

      // Use mutation instead of manual supabase call
      await createPostMutation.mutateAsync(postData);

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
    
    // Track which posts have been liked for optimistic UI updates
    const post = posts.find(p => p.id === postId || p.original_post?.id === postId);
    if (!post) return;

    try {
      if (post.has_liked) {
        // Unlike the post
        await unlikePostMutation.mutateAsync({
          postId: postId,
          userId: user.id
        });
      } else {
        // Like the post
        await likePostMutation.mutateAsync({
          postId: postId,
          userId: user.id
        });
      }

      // Add haptic feedback for mobile
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to update like. Please try again.');
    }
  };

  const handleRetweet = async (postId: string, withComment = false) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    const originalPost = posts.find(p => p.id === postId);
    if (!originalPost) {
      console.error('Post not found');
      return;
    }

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

    // Check if already retweeting this post
    if (retweetingPostIds.has(postId)) {
      console.log('Already processing retweet for this post');
      return;
    }

    try {
      // Add to processing set
      setRetweetingPostIds(prev => new Set([...prev, postId]));

      if (originalPost.has_retweeted) {
        // Remove retweet
        await removeRetweetMutation.mutateAsync({
          postId: originalPost.id,
          userId: user.id
        });
      } else {
        // Create retweet
        await createRetweetMutation.mutateAsync({
          postId: originalPost.id,
          userId: user.id,
          isQuoteRetweet: false,
          quoteContent: undefined
        });
      }

      // Add haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([50, 100, 50]);
      }

      console.log(originalPost.has_retweeted ? '✅ Retweet removed' : '✅ Retweet added');
    } catch (error) {
      console.error('Error handling retweet:', error);
      // Show error toast or alert
      alert('Failed to retweet. Please try again.');
    } finally {
      // Remove from processing set
      setRetweetingPostIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
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
          'min-h-screen w-full',
          isDark ? 'bg-black text-white' : 'bg-white text-black',
          isMobile ? 'pb-20' : 'flex'
        )}>
          {/* Left Sidebar Skeleton - Hidden on mobile */}
          {!isMobile && (
            <div className={cn(
              "hidden lg:block ml-18 w-80 p-4 space-y-6 bg-white border-r order-blbg-black sticky top-0 h-screen overflow-y-auto scrollbar-hide",
              isDark ? 'bg-black border-blbg-black' : 'bg-white order-blbg-black'
            )}>
              <LeftSidebarSkeleton />
            </div>
          )}

          {/* Main Feed Skeleton */}
          <div className="flex-1 max-w-2xl mx-auto">
            {[...Array(5)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>

          {/* Right Sidebar Skeleton - Desktop Only */}
          {!isMobile && (
            <div className={cn(
              'hidden xl:block scrollbar-hide w-[400px] border-l sticky top-0 h-screen mr-0 overflow-y-auto',
              isDark ? 'border-blbg-black' : 'order-blbg-black'
            )}>
              <RightSidebarSkeleton />
            </div>
          )}
        </div>
      </PageLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="text-red-500 mb-4">Failed to load posts</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
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
      <div className={cn(
        "hidden lg:block ml-18 w-80 p-4 space-y-6 bg-white border-r order-blbg-black sticky top-0 h-screen overflow-y-auto scrollbar-hide",
        isDark ? 'bg-black border-blbg-black' : 'bg-white order-blbg-black'
      )}>
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
            <div className="absolute inset-0 bg-gradient-to-r from-border-gray-900 to-purple-600 rounded-2xl" />
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
        <div className="bg-black order-blbg-black border rounded-3xl p-4 text-white">
          <div className="flex items-center gap-2 mb-3">
          <Search className="w-5 h-5 inline-block mr-2" /> 

            <h3 className="font-bold text-lg">WorkX AI assistan</h3>
          </div>
          <p className="text-sm text-white/90 mb-3">
 
            Get personalized career guidance with the help of AI powered by Grok
          </p>
          
       
        </div>

        {/* Skills Development Tracker */}
     

        {/* Industry Insights */}
        <div className={cn("bg-white rounded-2xl border  overflow-hidden", isDark ? 'bg-transparent text-white border-blbg-black' : 'bg-white order-blbg-black')}>
          <div className="p-4 border-b order-blbg-black">
            <h3 className="font-serif ">TrendingUp</h3>
          </div>
          <div className="divide-y-[0.7px] order-blbg-black">
            {mostLikedPostsLoading ? (
              <div className="text-center py-4 text-gray-500">Loading trending posts...</div>
            ) : mostLikedPosts && mostLikedPosts.length > 0 ? (
              mostLikedPosts.map((post, index) => (
                <div key={index} className={cn("p-3 hover:bg-gray-50 transition-colors", isDark ? 'text-white hover:bg-black' : 'hover:bg-gray-50')}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium ">{post.author.name}</span>
                  </div>
                  <p className="text-xs text-gray-300">{post.content}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">No trending posts found</div>
            )}
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
          <button className="w-full bg-white/20 hover:bg-white/30 rounded-3xl py-2 text-sm font-medium transition-colors">
            Browse Mentors
          </button>
        </div> */}

        {/* Career Opportunities Scanner */}
        <div className={cn("bg-white rounded-2xl border order-blbg-black overflow-hidden", isDark ? 'bg-transparent text-white border-blbg-black' : 'bg-white order-blbg-black')}>
          <div className="p-4 border-b order-blbg-black">
            <div className="flex items-center gap-2">
              <h3 className="font-bold ">Jobs That Match Your Profile</h3>
            </div>
            <p className="text-xs text-gray-400">AI-powered recommendations based on your skills and interests</p>
          </div>
          <div className="p-4 space-y-3">
            {matchedJobsLoading ? (
              <div className="text-center py-4 text-gray-500">Loading matched jobs...</div>
            ) : matchedJobs && matchedJobs.length > 0 ? (
              matchedJobs.slice(0, 3).map((job: any, index: number) => (
                <div
                  key={job.id || index}
                  className={cn(
                    'border order-blbg-black rounded-3xl p-3 hover:shadow-md transition-all cursor-pointer',
                    isDark ? 'border-blbg-black text-white hover:border-blue-500/50' : 'order-blbg-black hover:border-blue-400'
                  )} 
                  onClick={() => navigate(`/job/${job.id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm truncate">{job.title}</h4>
                      <p className="text-xs text-gray-400 truncate">{job.company}</p>
                    </div>
                    {/* Match Percentage Badge */}
                    {job.matchPercentage > 0 && (
                      <div className={cn(
                        "ml-2 px-2 py-1 rounded-full text-xs font-bold flex-shrink-0",
                        job.matchPercentage >= 70 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : job.matchPercentage >= 50
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      )}>
                        {job.matchPercentage}% Match
                      </div>
                    )}
                  </div>
                  
                  {/* Match Reasons */}
                  {job.matchReasons && job.matchReasons.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {job.matchReasons.map((reason: string, idx: number) => (
                        <span
                          key={idx}
                          className={cn(
                            'text-xs px-2 py-0.5 rounded-full',
                            isDark 
                              ? 'bg-blue-900/30 text-blue-300' 
                              : 'bg-blue-50 text-blue-600'
                          )}
                        >
                          ✓ {reason}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                    {job.type && (
                      <span className={cn(
                        'px-2 py-0.5 rounded-full',
                        isDark ? 'bg-gray-800' : 'bg-gray-100'
                      )}>
                        {job.type}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm mb-2">No matched jobs yet</p>
                <p className="text-xs text-gray-400">Complete your profile to get personalized recommendations</p>
              </div>
            )}
          </div>
          <div className="p-3 border-t order-blbg-black text-center">
            <button 
              onClick={() => navigate('/jobs')}
              className={cn(
                "text-sm font-medium transition-colors",
                isDark 
                  ? 'text-blue-400 hover:text-blue-300' 
                  : 'text-blue-600 hover:text-blue-700'
              )}
            >
              View All Matched Jobs →
            </button>
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
        <div className={cn("bg-white rounded-2xl border order-blbg-black overflow-hidden", isDark ? 'bg-transparent text-white border-[0.7px] border-b border-blbg-black bg-black' : 'bg-white order-blbg-black')}>
          <div className="p-4 border-b border-gray-900">
            <h3 className={cn("font-serif ",isDark ?  'text-white' : 'text-asu-maroon' )}>Upcoming Events</h3>
          </div>
          
          {eventsLoading ? (
            <div className="p-4 text-center text-gray-500">Loading events...</div>
          ) : employerEvents && employerEvents.length > 0 ? (
            <div className="p-0 ">
              <AnimatedList
                items={employerEvents}
                maxHeight="320px"
                width="100%"
                showGradients={true}
                enableArrowNavigation={true}
                displayScrollbar={false}
                renderItem={(event, index, isSelected) => (
                  <div
                    className={cn(
                      'p-3 rounded-3xl w-full transition-all cursor-pointer border mx-2',
                      isDark
                        ? isSelected
                          ? 'bg-gray-700/25 border-none '
                          : 'bg-black border-none hover:bg-gray-900/50'
                        : isSelected
                          ? 'bg-blue-50 border-blue-400s'
                          : 'bg-gray-50 order-blbg-black hover:bg-gray-900/50'
                    )}
                    onClick={() => navigate(`/event/${event.id}`)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Employer Avatar - Fetch from employer profile */}
                      {event.employer?.avatar_url ? (
                        <img 
                          src={event.employer.avatar_url} 
                          alt={event.employer.name}
                          className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-none"
                          onError={(e) => {
                            // Fallback if image fails to load
                            const img = e.target as HTMLImageElement;
                            img.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 border",
                          isDark 
                            ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white border-purple-500' 
                            : 'bg-gradient-to-br from-blue-400 to-purple-500 text-white border-purple-400'
                        )}>
                          {event.employer?.name?.charAt(0).toUpperCase() || event.title?.charAt(0).toUpperCase() || '📅'}
                        </div>
                      )}
                      
                      <div className="flex-1  min-w-0">
                        {/* Event Title */}
                        <p className={cn(
                          "font-serif text-sm truncate font-semibold",
                          isDark ? 'text-white' : 'text-gray-900'
                        )}>
                          {event.title}
                        </p>
                        
                        {/* Employer Name */}
                        <p className={cn(
                          "text-xs truncate font-medium",
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        )}>
                          {event.employer?.company_name || event.employer?.name || 'Unknown Employer'}
                        </p>
                        
                        {/* Event Date */}
                        <p className={cn(
                          "text-xs truncate",
                          isDark ? 'text-gray-500' : 'text-gray-500'
                        )}>
                          {event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'TBA'}
                        </p>
                        
                        {/* Event Type Badge */}
                        {event.event_type && (
                          <p className={cn(
                            "text-xs mt-1 inline-block px-2 py-0.5 rounded-full font-semibold",
                            isDark 
                              ? 'bg-blue-900/30 text-blue-300' 
                              : 'bg-blue-100 text-blue-700'
                          )}>
                            {event.event_type}
                          </p>
                        )}
                      </div>
                      
                      {/* Attendees Count Badge */}
                      {event.attendees_count > 0 && (
                        <div className={cn(
                          "text-xs font-bold flex-shrink-0 px-2 py-1 rounded-full",
                          isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
                        )}>
                          {event.attendees_count} 👥
                        </div>
                      )}
                    </div>
                  </div>
                )}
                onItemSelect={(event) => navigate(`/event/${event.id}`)}
              />
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">No upcoming events</div>
          )}
          
          <div className="p-3 border-none order-blbg-black text-center">
            <button 
              onClick={() => navigate('/events')}
              className={cn(
                "text-sm font-medium transition-colors",
                isDark 
                  ? 'text-blue-400 hover:text-blue-300' 
                  : 'text-blue-600 hover:text-blue-700'
              )}
            >
              View All Events →
            </button>
          </div>
        </div>

        {/* Settings and Logout */}
        <div className="space-y-2">
          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-3xl text-white hover:bg-white hover:text-black transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => {/* handle logout */}}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-3xl bg-black text-white hover:bg-red-700 transition-colors"
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
          ? 'pt-16 p-0' 
          : 'lg:ml-5 max-w-2xl mx-auto'
      )}>
        {/* Mobile/Desktop Header with Tab Switcher */}
        <div className={cn(
          'sticky top-0 z-10 backdrop-blur-xl border-none',
          isDark ? 'bg-black/80 border-none' : 'bg-white/80 border-none',
          isMobile ? 'top-16' : 'top-0'
        )}>
          {/* Tab Switcher - Like X/Twitter */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setActiveTab('for-you')}
              className={cn(
                'flex-1 px-4 py-3 font-semibold text-center transition-all border-b-2 relative',
                activeTab === 'for-you'
                  ? isDark 
                    ? 'text-white border-gray-900' 
                    : 'text-black border-black'
                  : isDark
                    ? 'text-gray-500 border-transparent hover:text-gray-300'
                    : 'text-gray-600 border-transparent hover:text-blbg-black',
                isMobile ? 'text-sm' : 'text-base'
              )}
              title="View personalized job recommendations"
            >
              For You
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={cn(
                'flex-1 px-4 py-3 font-semibold text-center transition-all border-b-2 relative',
                activeTab === 'explore'
                  ? isDark 
                    ? 'text-white border-gray-900' 
                    : 'text-black border-black'
                  : isDark
                    ? 'text-gray-500 border-transparent hover:text-gray-300'
                    : 'text-gray-600 border-transparent hover:text-blbg-black',
                isMobile ? 'text-sm' : 'text-base'
              )}
              title="Explore all posted jobs and vacancies"
            >
              Explore
            </button>
          </div>
        </div>

        {/* Jobs Feed - Filtered by active tab - Display as Posts */}
        {activeTab === 'explore' && jobs && jobs.length > 0 ? (
          <div className={cn(
            'border-[0.5px] divide-y',
            isDark ? 'border-blbg-black divide-blbg-black' : 'divide-gray-200'
          )}>
            {jobs.map((job: any, index: number) => (
              <div
                key={job.id || index}
                className={cn(
                  'transition-colors cursor-pointer p-4',
                  isDark ? 'hover:bg-gray-950/50' : 'hover:bg-gray-50/50'
                )}
                onClick={() => navigate(`/job/${job.id}`)}
              >
                {/* Job Post Header - Like Social Post */}
                <div className="flex items-start space-x-3 mb-3">
                  {/* Company Avatar */}
                  <div className="flex-shrink-0">
                    <div className={cn(
                      'w-12 h-12 rounded-3xl flex items-center justify-center font-bold text-white text-base',
                      'bg-gradient-to-br from-border-gray-900 to-purple-600'
                    )}>
                      {job.company?.charAt(0) || '💼'}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-base">
                        {job.title}
                      </h3>
                    </div>
                    <p className={cn(
                      'text-sm mb-1',
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      <span className="font-medium">{job.company}</span>
                      <span className="mx-1">•</span>
                      <span>{formatTime(job.created_at)}</span>
                    </p>
                  </div>
                </div>

                {/* Location & Job Info */}
                <div className="space-y-2 mb-3">
                  <p className={cn(
                    'text-sm flex items-center space-x-2',
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{job.location}</span>
                  </p>

                  {/* Job Type & Salary Badges */}
                  <div className="flex flex-wrap gap-2">
                    {job.type && (
                      <span className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium',
                        isDark ? 'bg-blue-900/30 text-border-gray-900' : 'bg-blue-100 text-blue-700'
                      )}>
                        {job.type}
                      </span>
                    )}
                    {job.salary_range && (
                      <span className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1',
                        isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                      )}>
                        <DollarSign className="h-3 w-3" />
                        <span>{job.salary_range}</span>
                      </span>
                    )}
                    {job.is_remote && (
                      <span className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium',
                        isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'
                      )}>
                        🌍 Remote
                      </span>
                    )}
                  </div>
                </div>

                {/* Job Description */}
                <p className={cn(
                  'line-clamp-3 mb-3 text-sm',
                  isDark ? 'text-gray-300' : 'text-gray-700'
                )}>
                  {job.description || 'No description available'}
                </p>

                {/* Skills Tags */}
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.skills.slice(0, 5).map((skill: string, i: number) => (
                      <span
                        key={i}
                        className={cn(
                          'px-2 py-1 rounded text-xs',
                          isDark ? 'bg-black text-gray-300' : 'bg-gray-200 text-gray-700'
                        )}
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 5 && (
                      <span className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        +{job.skills.length - 5} more
                      </span>
                    )}
                  </div>
                )}

                {/* Action Buttons - Like Post Actions */}
                <div className="flex items-center justify-between pt-3 border-t">
                  {/* Like Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-full transition-colors text-sm',
                      isDark
                        ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-500/10'
                    )}
                  >
                    <Heart className="h-4 w-4" />
                    <span>Like</span>
                  </button>

                  {/* View Details Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/job/${job.id}`);
                    }}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-full transition-colors text-sm',
                      isDark
                        ? 'text-gray-400 hover:text-border-gray-900 hover:bg-border-gray-900/10'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-border-gray-900/10'
                    )}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Details</span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-full transition-colors text-sm',
                      isDark
                        ? 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-500/10'
                    )}
                  >
                    <Share className="h-4 w-4" />
                    <span>Share</span>
                  </button>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-full transition-colors text-sm',
                      isDark
                        ? 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10'
                        : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-500/10'
                    )}
                  >
                    <Bookmark className="h-4 w-4" />
                    <span>Save</span>
                  </button>

                  {/* Apply Button - Primary CTA */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/job/${job.id}`);
                    }}
                    className={cn(
                      'ml-auto px-4 py-2 rounded-full text-sm font-semibold transition-colors',
                      isDark
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-black text-white hover:bg-black'
                    )}
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'explore' && (!jobs || jobs.length === 0) ? (
          <div className={cn(
            'p-8 text-center',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            <p className="text-lg font-semibold mb-2">No jobs available</p>
            <p className="text-sm">Check back soon for new opportunities!</p>
          </div>
        ) : activeTab === 'for-you' ? (
          <>
            {/* For You Tab - Show only posts (no jobs) */}
            {/* Posts Feed */}
            <div className={cn(
              'border-[0.5px] divide-y rounded-3xl',
              isDark ? 'border-blbg-black divide-blbg-black' : 'divide-gray-200'
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
                            <div className="w-4 h-4 bg-border-gray-900 rounded-full flex items-center justify-center">
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
                        <div className="grid grid-cols-1 border-blbg-black divide-blbg-black border rounded-3xl gap-2 mb-3">
                          {(post.is_retweet ? post.original_post?.media : post.media)?.map((media, index) => (
                            <div key={index} className="relative">
                              {media.type === 'image' ? (
                                <img
                                  src={media.url}
                                  alt={media.alt || ''}
                                  className="rounded-3xl object-cover w-full"
                                />
                              ) : (
                                <VideoPlayer
                                  src={media.url}
                                  className="rounded-3xl h-[600px] w-full"
                                />
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
                              ? 'text-gray-400 hover:text-border-gray-900 hover:bg-border-gray-900/10' 
                              : 'text-gray-600 hover:text-blue-600 hover:bg-border-gray-900/10',
                            isMobile ? 'p-1' : 'p-2'
                          )}
                        >
                          <MessageCircle className={cn(isMobile ? 'h-4 w-4' : 'h-5 w-5')} />
                          <span className={cn(isMobile ? 'text-xs' : 'text-sm')}>{post.replies_count}</span>
                        </Button>
                        
                        {/* Retweet Button with Dropdown */}
                        <RetweetButton
                          postId={post.id}
                          hasRetweeted={post.has_retweeted}
                          retweetsCount={post.retweets_count}
                          onRetweet={() => handleRetweet(post.id)}
                          onQuoteRetweet={() => handleRetweet(post.id, true)}
                          isMobile={isMobile}
                          isDark={isDark}
                        />
                        
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
                              ? 'text-gray-400 hover:text-border-gray-900 hover:bg-border-gray-900/10' 
                              : 'text-gray-600 hover:text-blue-600 hover:bg-border-gray-900/10',
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
                    
                   
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {/* Loading More */}
        <div className={cn('text-center', isMobile ? 'p-4' : 'p-8')}>
          <Button
            variant="ghost"
            className="text-border-gray-900 hover:bg-border-gray-900/10"
          >
            Show more posts
          </Button>
        </div>
      </main>

      {/* Right Sidebar - Desktop Only */}
      {!isMobile && (
        <aside className={cn(
          'hidden xl:block scrollbar-hide w-[400px] border-l sticky top-0 h-screen mr-0 overflow-y-auto',
          isDark ? 'border-blbg-black' : 'order-blbg-black'
        )}>
          <div className="p-4 space-y-6">
            {/* Search Field with @ Support */}
            <div className="relative">
              <div className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-3xl border transition-all',
                showSearchDropdown
                  ? isDark
                    ? 'bg-gray-900/50 border-gray-900'
                    : 'bg-gray-50 border-gray-900'
                  : isDark
                    ? 'bg-gray-900/50 border-gray-700'
                    : 'bg-gray-100 border-gray-300'
              )}>
                <Search className={cn(
                  'w-4 h-4 flex-shrink-0 transition-colors',
                  showSearchDropdown
                    ? isDark ? 'text-border-gray-900' : 'text-blue-600'
                    : isDark ? 'text-gray-500' : 'text-gray-400'
                )} />
                
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by name or @username"
                  value={sidebarSearchInput}
                  onChange={(e) => {
                    setSidebarSearchInput(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  className={cn(
                    'flex-1 bg-transparent outline-none text-sm',
                    isDark ? 'text-white placeholder-gray-500' : 'text-black placeholder-gray-400'
                  )}
                />

                {/* @ Symbol Quick Button */}
                {!sidebarSearchInput && (
                  <button
                    onClick={handleAtSymbolClick}
                    title="Search by username"
                    className={cn(
                      'p-1 rounded transition-all flex-shrink-0',
                      isDark
                        ? 'text-gray-500 hover:text-border-gray-900 hover:bg-border-gray-900/10'
                        : 'text-gray-500 hover:text-blue-600 hover:bg-border-gray-900/10'
                    )}
                  >
                    <AtSign className="w-4 h-4" />
                  </button>
                )}

                {/* Clear Button */}
                {sidebarSearchInput && (
                  <button
                    onClick={() => {
                      setSidebarSearchInput('');
                      searchInputRef.current?.focus();
                    }}
                    title="Clear search"
                    className={cn(
                      'p-1 rounded transition-all flex-shrink-0',
                      isDark
                        ? 'text-gray-500 hover:text-white hover:bg-black'
                        : 'text-gray-500 hover:text-black hover:bg-gray-200'
                    )}
                  >
                    <span className="text-lg">×</span>
                  </button>
                )}
              </div>

              {/* Search Mode Indicator */}
              {sidebarSearchInput && (
                <div className={cn(
                  'mt-1 px-3 text-xs font-medium flex items-center gap-1',
                  isUsernameSearch
                    ? isDark ? 'text-border-gray-900' : 'text-blue-600'
                    : isDark ? 'text-gray-500' : 'text-gray-600'
                )}>
                  {isUsernameSearch ? (
                    <>
                      <AtSign className="w-3 h-3" />
                      <span>Username search</span>
                    </>
                  ) : (
                    <span>Name search</span>
                  )}
                </div>
              )}

              {/* Search Results Dropdown */}
              {showSearchDropdown && (
                <div
                  ref={searchDropdownRef}
                  className={cn(
                    'absolute top-full left-0 right-0 mt-2 rounded-3xl shadow-lg border z-50',
                    isDark
                      ? 'bg-black border-gray-700'
                      : 'bg-white order-blbg-black'
                  )}
                >
                  {searchLoading ? (
                    <div className={cn(
                      'p-4 text-center text-sm',
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      Loading...
                    </div>
                  ) : userSearchResults.length > 0 ? (
                    <div className={cn(
                      'divide-y max-h-80 overflow-y-auto',
                      isDark ? 'divide-blbg-black' : 'divide-gray-200'
                    )}>
                      {userSearchResults.map((result) => (
                        <Link
                          key={result.id}
                          to={`/profile/${result.id}`}
                          onClick={() => {
                            setShowSearchDropdown(false);
                            setSidebarSearchInput('');
                          }}
                          className={cn(
                            'flex items-center gap-3 p-3 transition-colors',
                            isDark
                              ? 'hover:bg-gray-900/50'
                              : 'hover:bg-gray-50'
                          )}
                        >
                          {/* Avatar */}
                          {result.avatar ? (
                            <img
                              src={result.avatar}
                              alt={result.title}
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold',
                              isDark ? 'bg-black' : 'bg-gray-200'
                            )}>
                              {result.title.charAt(0).toUpperCase()}
                            </div>
                          )}

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <h4 className="font-medium text-sm truncate">{result.title}</h4>
                              {result.verified && (
                                <svg className="w-3 h-3 text-border-gray-900 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                              )}
                            </div>
                            
                            <p className={cn(
                              'text-xs truncate font-medium',
                              isUsernameSearch
                                ? isDark ? 'text-border-gray-900' : 'text-blue-600'
                                : isDark ? 'text-gray-500' : 'text-gray-600'
                            )}>
                              {result.subtitle}
                            </p>

                            {result.description && (
                              <p className={cn(
                                'text-xs line-clamp-1',
                                isDark ? 'text-gray-400' : 'text-gray-700'
                              )}>
                                {result.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : sidebarSearchInput ? (
                    <div className={cn(
                      'p-4 text-center text-sm',
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      No results for "{sidebarSearchInput}"
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Job Recommendations */}
            <div className={cn(
              'rounded-3xl p-4 border',
              isDark ? 'bg-black border-blbg-black' : 'bg-white order-blbg-black'
            )}>
              <h3 className="font-bold text-2xl font-serif mb-4 flex items-center">
                <Bookmark className="h-5 w-5 mr-2" />
                Jobs For You
              </h3>
              <div className="space-y-4">
                {companiesLoading ? (
                  <div className="text-center py-4 text-gray-400">Loading companies...</div>
                ) : recommendedCompanies && recommendedCompanies.length > 0 ? (
                  recommendedCompanies.map((company: any, index: number) => (
                    <div
                      key={company.id || index}
                      className={cn(
                        'p-3 rounded-3xl hover:bg-black/30 cursor-pointer transition-colors',
                        isDark ? 'bg-gray-700/25 hover:bg-gray-900/50' : 'bg-gray-100 hover:bg-gray-200'
                      )}
                      onClick={() => navigate(`/company/${company.id}`)}
                    >
                      <div className="flex items-start space-x-3 mb-2">
                        {/* Company Avatar */}
                        {company.logo_url ? (
                          <img
                            src={company.logo_url}
                            alt={company.name}
                            className="w-10 h-10 rounded-3xl object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className={cn(
                            'w-10 h-10 rounded-3xl flex items-center justify-center flex-shrink-0 font-bold text-sm text-white',
                            'bg-gradient-to-br from-border-gray-900 to-purple-600'
                          )}>
                            {company.name?.charAt(0) || '🏢'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className={cn(
                            'font-semibold text-sm truncate',
                            isDark ? 'text-white' : 'text-gray-900'
                          )}>
                            {company.name}
                          </h4>
                          <p className={cn(
                            'text-xs truncate',
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          )}>
                            {company.industry || 'Technology'}
                          </p>
                        </div>
                      </div>
                      {company.location && (
                        <p className={cn(
                          'text-xs flex items-center gap-1',
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        )}>
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          {company.location}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    No companies hiring at the moment
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-2">
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full',
                    isDark ? 'text-border-gray-900 hover:bg-border-gray-900/10' : 'text-blue-600 hover:bg-border-gray-900/10'
                  )}
                  onClick={() => navigate('/explore')}
                  title="View all jobs, companies, profiles, and events"
                >
                  Explore All Companies
                </Button>
                {/* <Button
                  className={cn(
                    'w-full font-semibold py-2 rounded-3xl transition-colors',
                    isDark 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  )}
                  onClick={() => navigate('/explore')}
                  title="Explore all recommended jobs, companies, profiles, and events"
                >
                  Explore More →
                </Button> */}
              </div>
            </div>

            {/* Who to Follow */}
            <div className={cn(
              'rounded-3xl p-4 border',
              isDark ? 'bg-black border-blbg-black' : 'bg-black order-blbg-black'
            )}>
              <h3 className="font-serif text-lg mb-4 flex items-center text-white">
                <Users className="h-5 w-5 mr-2" />
                Who to Follow
              </h3>
              <div className="space-y-4">
                {recommendedUsersLoading ? (
                  <div className="text-center py-4 text-gray-400">Loading recommendations...</div>
                ) : recommendedUsers.length > 0 ? (
                  recommendedUsers.slice(0, 3).map((recommendedUser) => (
                    <WhoToFollowItem
                      key={recommendedUser.id}
                      user={{
                        id: recommendedUser.id,
                        full_name: recommendedUser.full_name,
                        username: recommendedUser.username,
                        avatar_url: recommendedUser.avatar_url,
                        verified: recommendedUser.verified,
                        bio: recommendedUser.bio
                      }}
                      onNavigate={() => {}}
                    />
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    No more users to recommend
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-4 text-white hover:bg-black/50"
                onClick={() => navigate('/explore')}
              >
                Show More
              </Button>
            </div>

            {/* Recent Activity */}
            <div className={cn(
              'rounded-3xl p-4 border',
              isDark ? 'bg-black border-blbg-black' : 'bg-[#800020] order-blbg-black'
            )}>
              <h3 className="font-bold text-lg mb-4 text-white">recomended vacansies</h3>
              <div className="space-y-3 text-white">
                {jobsLoading ? (
                  <div className="text-center py-4 text-gray-400">Loading jobs...</div>
                ) : jobs && jobs.length > 0 ? (
                  jobs.slice(0, 4).map((job: any, index: number) => (
                    <div 
                      key={job.id || index} 
                      className="text-sm p-2 rounded hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => navigate(`/job/${job.id}`)}
                    >
                      <p className="font-medium">{job.title}</p>
                      <p className={cn('text-xs', isDark ? 'text-gray-300' : 'text-gray-200')}>
                        {job.company} • {job.location}
                      </p>
                      <p className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-300')}>
                        Posted {formatTime(job.created_at)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    No recent jobs available
                  </div>
                )}
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
              { id: 'post', icon: Edit3, label: 'Create Post', color: 'bg-border-gray-900 hover:bg-blue-600', action: () => navigate('/create-post') },
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
                ? 'bg-black text-white rotate-45 scale-110 ' 
                : isFabPressed 
                  ? 'bg-black text-white scale-125 shadow-[#ffffff]/40 ring-4 ring-[#ffffff]/30'
                  : 'bg-black text-white hover:scale-105 active:scale-95'
              }
              text-black font-bold z-50
            `}
            style={{
              boxShadow: isFabPressed 
                ? '0 8px 20px rgba(0, 0, 0, 0.25)' 
                : isFabOpen
                  ? ''
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
          <div className="bg-white dark:bg-black rounded-3xl shadow-lg w-full max-w-lg mx-4 p-6 relative">
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
                  className="w-full p-2 border border-gray-300 rounded-3xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={4}
                  placeholder="What's on your mind?"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
                {mediaPreview && (
                  <div className="relative mt-4">
                    {newPost.media_type === 'image' ? (
                      <img src={mediaPreview} alt="Selected media" className="w-full h-auto rounded-3xl" />
                    ) : (
                      <video src={mediaPreview} controls className="w-full h-auto rounded-3xl" />
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