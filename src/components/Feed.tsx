import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Camera,
  Video,
  MapPin,
  Globe,
  Users2,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import Button from './ui/Button';
import Avatar from './ui/Avatar';
import PageLayout from './ui/PageLayout';
import { cn } from '../lib/cva';
import { usePosts, useCreatePost, useProfile, useRecommendedUsers, useRecommendedCompanies, useLikePost, useMatchedJobs, useMostLikedPosts, useBookmarkPost, useSearch } from '../hooks/useOptimizedQuery';
import { useJobs } from '../hooks/useJobs';
import { useCreateRetweet } from '../hooks/useRetweet';
import RetweetHeader from './RetweetHeader';
import QuoteTweetCard from './QuoteTweetCard';
import EnhancedPostCardInteractions from './ui/EnhancedPostCardInteractions';
import EnhancedVideoPlayer from './ui/EnhancedVideoPlayer';
import ImageLightbox from './ui/ImageLightbox';
import { FloatingActionMenu } from './FloatingActionMenu';
import ExploreFeed from './ExploreFeed';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import { useInfiniteScroll, usePullToRefresh } from '../hooks/useScrollOptimizations';


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
  // Retweet fields
  is_retweet?: boolean;
  is_quote_retweet?: boolean;
  quote_content?: string;
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // State
  const [activeTab, setActiveTab] = useState<'for-you' | 'explore'>('for-you');
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

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<{ url: string; type: 'image' | 'video'; alt?: string }[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Sidebar Search State
  const [sidebarSearchInput, setSidebarSearchInput] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // FAB State
  // Removed unused FAB state variables

  // Data Fetching Hooks
  const {
    data: posts,
    isLoading: loading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = usePosts(20, user?.id);

  const allPosts = useMemo(() => {
    if (!posts || !posts.pages || !Array.isArray(posts.pages)) {
      return [];
    }
    return posts.pages.flat() || [];
  }, [posts]);

  const { mutate: createPostMutation } = useCreatePost();
  const { mutate: likePostMutation } = useLikePost();
  const { mutate: retweetPostMutation } = useCreateRetweet();
  const { mutate: bookmarkPostMutation } = useBookmarkPost();

  // Sidebar Data Hooks
  const { data: profileData } = useProfile(user?.id);
  const { data: recommendedUsers = [], isLoading: recommendedUsersLoading } = useRecommendedUsers(user?.id, 6);
  const { jobs = [], loading: jobsLoading } = useJobs();
  const { data: recommendedCompanies = [], isLoading: companiesLoading } = useRecommendedCompanies(3);
  const { data: matchedJobs = [], isLoading: matchedJobsLoading } = useMatchedJobs(user?.id);
  const { data: mostLikedPosts = [], isLoading: mostLikedPostsLoading } = useMostLikedPosts(3);

  // Profile Stats
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    following: 0,
    followers: 0,
    posts: 0
  });

  useEffect(() => {
    const fetchProfileStats = async () => {
      if (!user?.id) return;
      try {
        const [followers, following, posts] = await Promise.all([
          supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', user.id),
          supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', user.id),
          supabase.from('posts').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
        ]);

        setProfileStats({
          followers: followers.count || 0,
          following: following.count || 0,
          posts: posts.count || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchProfileStats();
  }, [user?.id]);

  // Search Logic
  const isUsernameSearch = sidebarSearchInput.startsWith('@');
  const cleanSearchQuery = isUsernameSearch ? sidebarSearchInput.slice(1) : sidebarSearchInput;
  const { data: searchResults, isLoading: searchLoading } = useSearch(cleanSearchQuery);

  const userSearchResults: SearchResult[] = useMemo(() => {
    const typedResults = searchResults as SearchResultData | undefined;
    if (!typedResults?.users) return [];

    const users = typedResults.users.map(u => ({
      id: u.id,
      type: 'user' as const,
      title: u.full_name,
      subtitle: `@${u.username} `,
      description: u.bio || '',
      avatar: u.avatar_url,
      verified: u.verified
    }));

    if (isUsernameSearch && cleanSearchQuery) {
      users.sort((a, b) => {
        const aUsername = a.subtitle?.slice(1).toLowerCase() || '';
        const bUsername = b.subtitle?.slice(1).toLowerCase() || '';
        const query = cleanSearchQuery.toLowerCase();

        if (aUsername === query) return -1;
        if (bUsername === query) return 1;
        if (aUsername.startsWith(query)) return -1;
        if (bUsername.startsWith(query)) return 1;
        return 0;
      });
    }
    return users;
  }, [searchResults, isUsernameSearch, cleanSearchQuery]);

  // Scroll & Resize Handlers
  const { isPulling } = usePullToRefresh(async () => {
    // Invalidate queries if needed
  });

  const { sentinelRef } = useInfiniteScroll(
    () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    { rootMargin: '200px' }
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(e.target as Node) &&
        searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper Functions
  const uploadMedia = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt} `;
    const userId = user?.id;
    const bucketName = file.type.startsWith('video/') ? 'videos' : 'post-images';
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedMedia(file);
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
      setNewPost({
        ...newPost,
        media_type: file.type.startsWith('image/') ? 'image' : 'video'
      });
    }
  };

  const removeMedia = () => {
    setMediaPreview(null);
    setSelectedMedia(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
    setNewPost(prev => ({ ...prev, media_type: 'text' }));
  };

  const createPost = async () => {
    if (!newPost.content.trim() && !selectedMedia) return;

    setIsPosting(true);
    try {
      let mediaUrl: string | undefined;
      let mediaType: 'image' | 'video' | undefined;

      if (selectedMedia) {
        mediaUrl = await uploadMedia(selectedMedia);
        mediaType = selectedMedia.type.startsWith('image/') ? 'image' : 'video';
      }

      createPostMutation({
        content: newPost.content,
        media_url: mediaUrl,
        media_type: mediaType,
        visibility: newPost.visibility as 'public' | 'connections' | 'private'
      });

      setNewPost({ content: '', media_type: 'text', visibility: 'public' });
      removeMedia();
      setShowPostModal(false);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = (postId: string) => likePostMutation({ postId, userId: user?.id || '' });
  const handleRetweet = (postId: string, content?: string) => retweetPostMutation({ postId, userId: user?.id || '', quoteContent: content });
  const handleBookmark = (postId: string) => bookmarkPostMutation({ postId, userId: user?.id || '' });

  const handleShare = async (post: Post) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${post.author.name}`,
          text: post.content,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return date.toLocaleDateString();
  };

  const handleAtSymbolClick = () => {
    setSidebarSearchInput('@');
    searchInputRef.current?.focus();
    setShowSearchDropdown(true);
  };



  if (loading) {
    return (
      <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-info-500"></div>
        </div>
      </PageLayout>
    );
  }

  if (!posts) {
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
      'min-h-screen',
      isDark ? 'bg-black text-white' : 'bg-white text-black'
    )}>
      <div className="max-w-[1400px] mx-auto flex justify-center">
        {/* Left Sidebar - Hidden on mobile */}
        {!isMobile && (
          <LeftSidebar
            isDark={isDark}
            user={user}
            profileData={profileData || {}}
            profileStats={profileStats}
            mostLikedPosts={mostLikedPosts}
            mostLikedPostsLoading={mostLikedPostsLoading}
            matchedJobs={matchedJobs}
            matchedJobsLoading={matchedJobsLoading}
            navigate={navigate}
          />
        )}

        {/* Main Feed Content */}
        <div className={cn(
          'flex-1 max-w-[650px]   min-h-screen',
          isDark ? '' : 'border-gray-200'
        )}>
          {/* Header */}
          <div className={cn(
            'sticky top-0 z-10 backdrop-blur-xl border-b transition-colors duration-200',
            isDark ? 'bg-black/80 border-[#1C1F20] ' : 'bg-white/80 border-gray-200',
            isMobile ? 'top-16' : 'top-0'
          )}>
            <div className="flex items-center justify-around h-[53px]">
              <button
                onClick={() => setActiveTab('for-you')}
                className={cn(
                  'flex-1 h-full flex items-center justify-center relative hover:bg-gray-200/10 transition-colors',
                  activeTab === 'for-you' ? 'font-bold' : 'font-medium text-gray-500'
                )}
              >
                <span>For you</span>
                {activeTab === 'for-you' && (
                  <div className="absolute bottom-0 w-14 h-1 bg-info-500 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('explore')}
                className={cn(
                  'flex-1 h-full flex items-center justify-center relative hover:bg-gray-200/10 transition-colors',
                  activeTab === 'explore' ? 'font-bold' : 'font-medium text-gray-500'
                )}
              >
                <span>Explore</span>
                {activeTab === 'explore' && (
                  <div className="absolute bottom-0 w-16 h-1 bg-info-500 rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Create Post Input (Desktop) */}
          {!isMobile && (
            <div className={cn(
              'p-4 border-b',
              isDark ? 'border-[#1C1F20]' : 'border-gray-200'
            )}>
              <div className="flex gap-3">
                <Avatar src={user?.profile?.avatar_url || undefined} alt={user?.profile?.full_name || undefined} size="md" />
                <div className="flex-1">
                  <div
                    className={cn(
                      'w-full py-3 text-xl bg-transparent border-none outline-none placeholder-gray-500 cursor-text',
                      isDark ? 'text-white' : 'text-black'
                    )}
                    onClick={() => navigate('/create-post')}
                  >
                    What is happening?!
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1C1F20]/50">
                    <div className="flex gap-1 text-info-500">
                      <button className="p-2 rounded-full text-[#000000] hover:bg-black/10 transition-colors" onClick={() => navigate('/create-post')}>
                        <Camera className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-full text-[#000000] hover:bg-black/10 transition-colors" onClick={() => navigate('/create-post')}>
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-full text-[#000000] hover:bg-black/10 transition-colors" onClick={() => navigate('/create-post')}>
                        <MapPin className="w-5 h-5" />
                      </button>
                    </div>
                    <Button
                      onClick={() => navigate('/create-post')}
                      className="bg-[#  D3FB52] hover:bg-[#D3FB52]/80 text-black font-bold rounded-full px-5 py-1.5"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feed Content */}
          <div ref={timelineRef} className="pb-20 min-h-screen">
            {/* Pull to Refresh Indicator */}
            {isPulling && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-info-500"></div>
              </div>
            )}

            {activeTab === 'explore' ? (
              <ExploreFeed
                isDark={isDark}
                jobs={jobs}
                recommendedUsers={recommendedUsers}
                recommendedCompanies={recommendedCompanies}
                matchedJobs={matchedJobs}
              />
            ) : (
              <div>
                {allPosts.map((post: Post) => (
                  <div
                    key={post.id}
                    className={cn(
                      'border-b hover:bg-[#1C1F20]/30 transition-colors cursor-pointer',
                      isDark ? 'border-[#1C1F20]' : 'border-gray-200 shadow-sm hover:shadow-md'
                    )}
                    onClick={() => navigate(`/post/${post.id}`)}
                  >
                    {/* Retweet Header */}
                    {post.is_retweet && post.retweeted_by && (
                      <RetweetHeader
                        retweetedByName={post.retweeted_by.name}
                        retweetedById={post.retweeted_by.id}
                        isMobile={isMobile}
                      />
                    )}

                    <div className="p-4 flex gap-3">
                      {/* Author Avatar */}
                      <div className="flex-shrink-0" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/${post.author.id}`);
                      }}>
                        <Avatar
                          src={post.author.avatar_url}
                          alt={post.author.name}
                          size="md"
                          className="hover:opacity-90 transition-opacity"
                        />
                      </div>

                      {/* Post Content */}
                      <div className="flex-1 min-w-0">
                        {/* Header: Name, Username, Time, More */}
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1 overflow-hidden">
                            <Link
                              to={`/profile/${post.author.id}`}
                              className="font-bold hover:underline truncate text-base"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {post.author.name}
                            </Link>
                            {post.author.verified && (
                              <span className="text-info-500 flex-shrink-0">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" /></g></svg>
                              </span>
                            )}
                            <span className="text-gray-500 text-sm truncate">@{post.author.username}</span>
                            <span className="text-gray-500 text-sm">·</span>
                            <span className="text-gray-500 text-sm hover:underline">{formatTime(post.created_at)}</span>
                          </div>
                          <button className="text-gray-500 hover:text-info-500 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                            <span className="sr-only">More</span>
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg>
                          </button>
                        </div>

                        {/* Text Content */}
                        {post.content && (
                          <div
                            className={cn(
                              'text-[15px] leading-normal mb-3 whitespace-pre-wrap break-words',
                              isDark ? 'text-white' : 'text-gray-900'
                            )}
                          >
                            {post.content.split(/(\s+)/).map((word, index) => {
                              // Check if word is a hashtag
                              const hashtagMatch = word.match(/^#(\w+)/);
                              if (hashtagMatch) {
                                const hashtagName = hashtagMatch[1];
                                return (
                                  <span key={index}>
                                    <Link
                                      to={`/hashtag/${hashtagName}`}
                                      className="text-info-500 hover:underline font-medium"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      #{hashtagName}
                                    </Link>
                                    {word.substring(hashtagMatch[0].length)}
                                  </span>
                                );
                              }

                              // Check if word is a mention
                              const mentionMatch = word.match(/^@(\w+)/);
                              if (mentionMatch) {
                                const username = mentionMatch[1];
                                return (
                                  <span key={index}>
                                    <Link
                                      to={`/profile/${username}`} // Note: This assumes we can route by username or we need to look up ID. 
                                      // If routing by username is not supported, we might need a different approach or just link to search.
                                      // However, usually mentions link to profile. Let's assume /profile/username or search.
                                      // Given the current app structure, /profile/:id is used. 
                                      // We might not have the ID here easily unless we parse it from a rich text format or look it up.
                                      // For now, let's link to a search for that username or a specific route if it exists.
                                      // Actually, better to link to a search page or handle it if we can't resolve ID.
                                      // But wait, we stored mentions as UUIDs in the DB. 
                                      // The frontend text just has @username. 
                                      // To link correctly to ID, we'd need the ID.
                                      // But for now, let's link to /profile/username and ensure the router handles it or use search.
                                      // Let's try linking to search for now as a safe fallback if we don't have ID map.
                                      to={`/search?q=@${username}`}
                                      className="text-info-500 hover:underline font-medium"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      @{username}
                                    </Link>
                                    {word.substring(mentionMatch[0].length)}
                                  </span>
                                );
                              }

                              return <span key={index}>{word}</span>;
                            })}
                          </div>
                        )}

                        {/* Quote Retweet: Show original post in container */}
                        {post.is_quote_retweet && post.original_post && (
                          <QuoteTweetCard
                            post={post.original_post}
                            isDark={isDark}
                            onClick={() => navigate(`/post/${post.original_post?.id}`)}
                          />
                        )}

                        {/* Media Content - Only for non-quote retweets */}
                        {!post.is_quote_retweet && post.media && post.media.length > 0 && (
                          <div className={cn(
                            "grid gap-1 rounded-2xl overflow-hidden mb-3 border",
                            isDark ? 'border-[#1C1F20]' : 'border-gray-200',
                            post.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                          )}>
                            {post.media.map((media: { type: 'image' | 'video'; url: string; alt?: string }, index: number) => (
                              <div
                                key={index}
                                className="relative cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (media.type === 'image') {
                                    setLightboxImages(post.media || []);
                                    setSelectedImageIndex(index);
                                    setLightboxOpen(true);
                                  }
                                }}
                              >
                                {media.type === 'image' ? (
                                  <img
                                    src={media.url}
                                    alt={media.alt || ''}
                                    className="w-full h-full object-cover max-h-[500px]"
                                  />
                                ) : (
                                  <EnhancedVideoPlayer
                                    src={media.url}
                                    className="w-full h-full max-h-[500px]"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Post Actions */}
                        <EnhancedPostCardInteractions
                          postId={post.id}
                          initialLikes={post.likes_count}
                          initialRetweets={post.retweets_count}
                          initialReplies={post.replies_count}
                          isLiked={post.has_liked}
                          isRetweeted={post.has_retweeted}
                          isBookmarked={post.has_bookmarked}
                          onLike={() => handleLike(post.id)}
                          onRetweet={() => handleRetweet(post.id)}
                          onReply={() => navigate(`/post/${post.id}`)}
                          onShare={() => handleShare(post)}
                          onBookmark={() => handleBookmark(post.id)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div ref={sentinelRef} className="h-10" />
          </div>
        </div>

        {/* Right Sidebar - Desktop Only */}
        {!isMobile && (
          <RightSidebar
            isDark={isDark}
            sidebarSearchInput={sidebarSearchInput}
            setSidebarSearchInput={setSidebarSearchInput}
            showSearchDropdown={showSearchDropdown}
            setShowSearchDropdown={setShowSearchDropdown}
            searchDropdownRef={searchDropdownRef}
            searchInputRef={searchInputRef}
            userSearchResults={userSearchResults}
            searchLoading={searchLoading}
            companiesLoading={companiesLoading}
            recommendedCompanies={recommendedCompanies}
            recommendedUsersLoading={recommendedUsersLoading}
            recommendedUsers={recommendedUsers}
            jobsLoading={jobsLoading}
            jobs={jobs}
            navigate={navigate}
            formatTime={formatTime}
            handleAtSymbolClick={handleAtSymbolClick}
          />
        )}

      </div>

      {/* Grok Floating Action Menu */}
      <div className="fixed bottom-4 right-4 z-40">      <FloatingActionMenu />
      </div>


      {/* Image Lightbox Modal */}
      <ImageLightbox
        images={lightboxImages}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        initialIndex={selectedImageIndex}
      />


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
              <Avatar src={user?.profile?.avatar_url || undefined} alt={user?.profile?.full_name || undefined} size="lg" />
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
                    variant="outlined"
                    className="flex items-center space-x-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-5 h-5" />
                    <span>Photo</span>
                  </Button>
                  <Button
                    variant="outlined"
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
                    variant="outlined"
                    className="flex items-center space-x-2"
                    onClick={() => setNewPost({ ...newPost, visibility: 'public' })}
                  >
                    <Globe className="w-5 h-5" />
                    <span>Public</span>
                  </Button>
                  <Button
                    variant="outlined"
                    className="flex items-center space-x-2"
                    onClick={() => setNewPost({ ...newPost, visibility: 'connections' })}
                  >
                    <Users2 className="w-5 h-5" />
                    <span>Connections</span>
                  </Button>
                  <Button
                    variant="outlined"
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
