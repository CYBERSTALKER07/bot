import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Mail,
  MoreHorizontal,
  MessageCircle,
  Bell,
  User,
  TrendingUp,
  Heart,
  Share,
  Search,
  X,
  Verified,
  BarChart3,
  Home,
  Hash,
  Bookmark,
  Users,
  Settings,
  LogOut,
  Plus,
  Briefcase,
  Award,
  Target,
  Repeat2,
  Feather
} from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import FollowButton from '../FollowButton';
import { cn } from '../../lib/cva';
import { useRecommendedUsers, useMatchedJobs } from '../../hooks/useOptimizedQuery';
import WhoToFollowItem from '../WhoToFollowItem';
import { ProfileHeaderSkeleton, ProfileTabsSkeleton, ProfilePostsSkeleton, ProfileSidebarSkeleton, LeftSidebarSkeleton } from '../ui/Skeleton';

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

interface SuggestedUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  verified?: boolean;
}

interface TrendingTopic {
  category: string;
  topic: string;
  posts: string;
  trending?: boolean;
  hashtag?: string;
  engagement?: number;
}

interface IndustryInsight {
  title: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
  count?: number;
}

interface Post {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  likes_count: number;
  shares_count: number;
  comments_count: number;
  media_type?: 'text' | 'image' | 'video';
  image_url?: string;
  video_url?: string;
  visibility: 'public' | 'connections' | 'private';
  author?: {
    id: string;
    name: string;
    username: string;
    avatar_url?: string;
    verified?: boolean;
  };
}

export default function Profile() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'highlights' | 'media' | 'likes'>('posts');

  // Determine if viewing own profile or another user's profile
  const isOwnProfile = !userId || userId === user?.id;

  // Enhanced responsive breakpoints
  const [screenSize, setScreenSize] = useState(() => {
    const width = window.innerWidth;
    if (width < 480) return 'xs';
    if (width < 640) return 'sm';
    if (width < 768) return 'md';
    if (width < 1024) return 'lg';
    return 'xl';
  });

  const isMobile = screenSize === 'xs' || screenSize === 'sm';

  // Profile stats
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    following: 247,
    followers: 342,
    posts: 0
  });

  // Track follow status for recommended users - now with processing state
  const [followStatus, setFollowStatus] = useState<Record<string, boolean>>({});
  const [processingFollowId, setProcessingFollowId] = useState<string | null>(null);
  const [hoveredFollowId, setHoveredFollowId] = useState<string | null>(null);

  // Profile data
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

  // Posts state
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Suggested users data
  const { data: recommendedUsers } = useRecommendedUsers(user?.id);

  // Fetch matched jobs with intelligent matching
  const { data: matchedJobs = [], isLoading: matchedJobsLoading } = useMatchedJobs(user?.id, 2);

  // Trending topics data - now dynamic
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  // Industry insights data - now dynamic
  const [industryInsights, setIndustryInsights] = useState<IndustryInsight[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(true);

  // Navigation items for left sidebar
  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
    { id: 'explore', label: 'Explore', icon: Hash, path: '/explore' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
    { id: 'messages', label: 'Messages', icon: Mail, path: '/messages' },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark, path: '/bookmarks' },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/jobs' },
    { id: 'communities', label: 'Communities', icon: Users, path: '/communities' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
    { id: 'more', label: 'More', icon: MoreHorizontal, path: '#' }
  ];

  // Quick stats for left sidebar
  const quickStats = [
    { label: 'Profile Views', value: '1,247', icon: Target },
    { label: 'Applications', value: '23', icon: Briefcase },
    { label: 'Connections', value: '589', icon: Users },
    { label: 'Achievements', value: '12', icon: Award }
  ];

  // Handle responsive resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) setScreenSize('xs');
      else if (width < 640) setScreenSize('sm');
      else if (width < 768) setScreenSize('md');
      else if (width < 1024) setScreenSize('lg');
      else setScreenSize('xl');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load profile data
  useEffect(() => {
    if (isOwnProfile && user) {
      loadProfileData();
      fetchUserPosts();
    } else if (userId) {
      loadOtherUserProfile(userId);
      fetchUserPosts(userId);
    }
  }, [user?.id, userId]);

  // Fetch follower/following counts
  useEffect(() => {
    if (profileData.id) {
      fetchFollowerCounts(profileData.id);
    }
  }, [profileData.id]);

  // Fetch dynamic trending topics based on hashtags and engagement
  useEffect(() => {
    fetchTrendingTopics();
    fetchIndustryInsights();
  }, []);

  const loadProfileData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (profile) {
        console.log('✅ Own profile loaded:', {
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          cover_image_url: profile.cover_image_url
        });
        setProfileData({
          ...profile,
          skills: profile.skills || []
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const loadOtherUserProfile = async (targetUserId: string) => {
    try {
      setLoading(true);
      console.log('👥 Fetching other user profile:', targetUserId);

      // Fetch real profile data from the database
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('ℹ️ Profile not found');
        } else {
          console.error('Error fetching profile:', error);
        }
        // Fallback profile
        setProfileData({
          id: targetUserId,
          full_name: 'User',
          bio: 'Welcome to their profile!',
          avatar_url: '',
          cover_image_url: '',
          skills: [],
          portfolio_url: '',
          website: '',
          location: '',
          username: `user_${targetUserId.slice(0, 8)}`
        });
      } else if (profile) {
        console.log('✅ Other user profile loaded:', {
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          cover_image_url: profile.cover_image_url
        });
        setProfileData({
          ...profile,
          skills: profile.skills || []
        });
      }
    } catch (error) {
      console.error('Error in loadOtherUserProfile:', error);
      setProfileData({
        id: targetUserId,
        full_name: 'User',
        bio: 'Welcome to their profile!',
        avatar_url: '',
        cover_image_url: '',
        skills: [],
        portfolio_url: '',
        website: '',
        location: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async (targetUserId?: string) => {
    const userIdToFetch = targetUserId || user?.id;
    if (!userIdToFetch) return;

    try {
      setPostsLoading(true);

      // First, check if user is authenticated
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        console.log('User not authenticated for posts fetch');
        setPosts([]);
        return;
      }

      // Fetch posts for the user with proper error handling
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          user_id,
          created_at,
          likes_count,
          comments_count,
          shares_count,
          media_type,
          image_url,
          video_url,
          visibility
        `)
        .eq('user_id', userIdToFetch)
        .order('created_at', { ascending: false })
        .limit(50);

      if (postsError) {
        console.error('Error fetching posts:', postsError);
        // Don't throw error, just log it and show empty state
        setPosts([]);
        return;
      }

      // Fetch profile data for the user with better error handling
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, verified')
        .eq('id', userIdToFetch)
        .single();

      if (profileError) {
        console.warn('Error fetching profile for posts:', profileError);
        // Use fallback data if profile fetch fails
      }

      // Transform posts with author information
      const transformedPosts: Post[] = (postsData || []).map(post => ({
        ...post,
        author: {
          id: userIdToFetch,
          name: profileData?.full_name || user?.user_metadata?.full_name || 'User',
          username: profileData?.username || user?.user_metadata?.username || 'user',
          avatar_url: profileData?.avatar_url,
          verified: profileData?.verified || false
        }
      }));

      setPosts(transformedPosts);

      // Update profile stats with actual post count
      setProfileStats(prev => ({
        ...prev,
        posts: transformedPosts.length
      }));

    } catch (error) {
      console.error('Error in fetchUserPosts:', error);
      // Set empty posts array on error instead of crashing
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchTrendingTopics = async () => {
    try {
      setTrendingLoading(true);

      // Fetch recent posts with tags (last 7 days for relevance)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: postsWithTags, error } = await supabase
        .from('posts')
        .select('id, tags, likes_count, comments_count, shares_count, created_at')
        .not('tags', 'is', null)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) {
        console.error('Error fetching trending topics:', error);
        setTrendingTopics([]);
        return;
      }

      // Process hashtags and calculate engagement
      const hashtagStats = new Map<string, { count: number; engagement: number }>();

      postsWithTags?.forEach(post => {
        const engagement = (post.likes_count || 0) + (post.comments_count || 0) + (post.shares_count || 0);
        post.tags?.forEach((tag: string) => {
          const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
          const current = hashtagStats.get(cleanTag) || { count: 0, engagement: 0 };
          hashtagStats.set(cleanTag, {
            count: current.count + 1,
            engagement: current.engagement + engagement
          });
        });
      });

      // Sort by engagement and post count
      const sortedTopics = Array.from(hashtagStats.entries())
        .sort((a, b) => {
          const scoreA = a[1].engagement * 2 + a[1].count;
          const scoreB = b[1].engagement * 2 + b[1].count;
          return scoreB - scoreA;
        })
        .slice(0, 5)
        .map(([hashtag, stats]) => ({
          category: stats.engagement > 50 ? 'Trending · Hot' : 'Trending',
          topic: hashtag,
          posts: `${stats.count.toLocaleString()} post${stats.count !== 1 ? 's' : ''}`,
          trending: stats.engagement > 30,
          hashtag: hashtag,
          engagement: stats.engagement
        }));

      // If we don't have enough trending topics, add some based on recent activity
      if (sortedTopics.length < 3) {
        // Fetch recent jobs data
        const { data: recentJobs } = await supabase
          .from('jobs')
          .select('title, company')
          .eq('status', 'open')
          .order('posted_at', { ascending: false })
          .limit(5);

        // Fetch recent events
        const { data: recentEvents } = await supabase
          .from('employer_events')
          .select('title, attendees_count')
          .eq('status', 'upcoming')
          .order('created_at', { ascending: false })
          .limit(3);

        // Add job-related trending topics
        if (recentJobs && recentJobs.length > 0) {
          sortedTopics.push({
            category: 'Jobs · Trending',
            topic: `${recentJobs[0].title}`,
            posts: `${recentJobs.length} new opening${recentJobs.length !== 1 ? 's' : ''}`,
            trending: true
          });
        }

        // Add event-related trending topics
        if (recentEvents && recentEvents.length > 0) {
          const totalAttendees = recentEvents.reduce((sum, evt) => sum + (evt.attendees_count || 0), 0);
          sortedTopics.push({
            category: 'Events · Live',
            topic: recentEvents[0].title,
            posts: `${totalAttendees} interested`,
            trending: true
          });
        }
      }

      setTrendingTopics(sortedTopics);
    } catch (error) {
      console.error('Error in fetchTrendingTopics:', error);
      setTrendingTopics([]);
    } finally {
      setTrendingLoading(false);
    }
  };

  const fetchIndustryInsights = async () => {
    try {
      setInsightsLoading(true);

      // Get current date and 30 days ago for comparison
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      // Fetch recent jobs (last 30 days)
      const { data: recentJobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id, title, skills, type, posted_at, status')
        .gte('posted_at', thirtyDaysAgo.toISOString())
        .eq('status', 'open');

      // Fetch previous period jobs (30-60 days ago) for comparison
      const { data: previousJobs } = await supabase
        .from('jobs')
        .select('id, title, skills, type, posted_at, status')
        .gte('posted_at', sixtyDaysAgo.toISOString())
        .lt('posted_at', thirtyDaysAgo.toISOString())
        .eq('status', 'open');

      if (jobsError) {
        console.error('Error fetching jobs for insights:', jobsError);
        setIndustryInsights([]);
        return;
      }

      // Analyze job titles to find trending roles
      const roleCounts = new Map<string, { current: number; previous: number }>();

      // Count current period jobs
      recentJobs?.forEach(job => {
        const role = job.title.toLowerCase();
        const current = roleCounts.get(role) || { current: 0, previous: 0 };
        roleCounts.set(role, { ...current, current: current.current + 1 });
      });

      // Count previous period jobs
      previousJobs?.forEach(job => {
        const role = job.title.toLowerCase();
        const current = roleCounts.get(role) || { current: 0, previous: 0 };
        roleCounts.set(role, { ...current, previous: current.previous + 1 });
      });

      // Analyze skills demand
      const skillCounts = new Map<string, { current: number; previous: number }>();

      recentJobs?.forEach(job => {
        job.skills?.forEach((skill: string) => {
          const current = skillCounts.get(skill) || { current: 0, previous: 0 };
          skillCounts.set(skill, { ...current, current: current.current + 1 });
        });
      });

      previousJobs?.forEach(job => {
        job.skills?.forEach((skill: string) => {
          const current = skillCounts.get(skill) || { current: 0, previous: 0 };
          skillCounts.set(skill, { ...current, previous: current.previous + 1 });
        });
      });

      // Calculate percentage changes and create insights
      const insights: IndustryInsight[] = [];

      // Top trending roles
      const topRoles = Array.from(roleCounts.entries())
        .map(([role, counts]) => {
          const change = counts.previous > 0
            ? ((counts.current - counts.previous) / counts.previous) * 100
            : counts.current > 0 ? 100 : 0;
          return { role, counts, change };
        })
        .filter(item => item.counts.current > 0)
        .sort((a, b) => b.change - a.change)
        .slice(0, 2);

      topRoles.forEach(item => {
        insights.push({
          title: item.role.split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          change: item.change > 0 ? `+${Math.round(item.change)}%` : `${Math.round(item.change)}%`,
          trend: item.change > 0 ? 'up' : item.change < 0 ? 'down' : 'stable',
          description: `${item.counts.current} new opening${item.counts.current !== 1 ? 's' : ''} this month`,
          count: item.counts.current
        });
      });

      // Top trending skills
      const topSkills = Array.from(skillCounts.entries())
        .map(([skill, counts]) => {
          const change = counts.previous > 0
            ? ((counts.current - counts.previous) / counts.previous) * 100
            : counts.current > 0 ? 100 : 0;
          return { skill, counts, change };
        })
        .filter(item => item.counts.current > 0)
        .sort((a, b) => b.change - a.change)
        .slice(0, 1);

      topSkills.forEach(item => {
        insights.push({
          title: item.skill,
          change: item.change > 0 ? `+${Math.round(item.change)}%` : `${Math.round(item.change)}%`,
          trend: item.change > 0 ? 'up' : item.change < 0 ? 'down' : 'stable',
          description: `Required in ${item.counts.current} job${item.counts.current !== 1 ? 's' : ''}`,
          count: item.counts.current
        });
      });

      // If no insights yet, add general market insights
      if (insights.length === 0 && recentJobs && recentJobs.length > 0) {
        insights.push({
          title: 'Job Market',
          change: `${recentJobs.length} openings`,
          trend: 'up',
          description: 'Active opportunities available',
          count: recentJobs.length
        });
      }

      // Fallback: If still no insights, show static helpful data
      if (insights.length === 0) {
        insights.push(
          {
            title: 'Growing Demand',
            change: 'Trending',
            trend: 'up',
            description: 'Complete your profile to see personalized insights',
            count: 0
          },
          {
            title: 'Remote Work',
            change: 'Popular',
            trend: 'up',
            description: 'Many remote positions available',
            count: 0
          }
        );
      }

      setIndustryInsights(insights);
    } catch (error) {
      console.error('Error in fetchIndustryInsights:', error);
      setIndustryInsights([]);
    } finally {
      setInsightsLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return 'Joined recently';
    const date = new Date(dateString);
    return ` ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  };

  // Fetch real follower and following counts from database
  const fetchFollowerCounts = async (userId: string) => {
    try {
      // Fetch follower count
      const { count: followersCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);

      // Fetch following count
      const { count: followingCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);

      setProfileStats(prev => ({
        ...prev,
        followers: followersCount || 0,
        following: followingCount || 0
      }));
    } catch (error) {
      console.error('Error fetching follower counts:', error);
    }
  };

  // Sample post data
  const samplePost = {
    id: '1',
    content: 'Just shipped a new feature for our automation platform! Excited to see how it helps businesses streamline their workflows. 🚀 #automation #business',
    timestamp: 'Aug 28',
    likes: 12,
    retweets: 3,
    replies: 5,
    image: '/api/placeholder/400/300'
  };

  if (loading) {
    return (
      <div className={cn(
        "min-h-screen",
        isDark ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      )}>
        <div className="max-w-7xl mx-auto flex">
          {/* Left Sidebar Skeleton */}
          <div className={cn(
            "hidden lg:block w-80 p-4 space-y-6 border-r sticky top-0 h-screen overflow-y-auto",
            isDark ? "bg-black border-gray-800" : "bg-white border-gray-200"
          )}>
            <LeftSidebarSkeleton />
          </div>

          {/* Main Content Skeleton */}
          <div className={cn('flex-1 max-w-2xl border-x', isDark ? "bg-black border-gray-800" : "bg-gray-50 border-gray-200")}>
            <ProfileHeaderSkeleton />
            <ProfileTabsSkeleton />
            <ProfilePostsSkeleton />
          </div>

          {/* Right Sidebar Skeleton */}
          <div className={cn("w-80 p-4 space-y-4", isDark ? "bg-black" : "bg-gray-50")}>
            <ProfileSidebarSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cn(
        "flex items-center justify-center min-h-screen",
        isDark ? "bg-black" : "bg-white"
      )}>
        <div className="text-center">
          <h2 className={cn(
            "text-xl font-semibold mb-2",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Profile not found
          </h2>
          <p className={cn(
            isDark ? "text-gray-400" : "text-gray-600"
          )}>
            Please complete your profile setup.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen",
      isDark ? "bg-black text-white" : "bg-gray-50 text-gray-900"
    )}>
      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar - Hidden on mobile */}
        <div className={cn(
          "hidden lg:block w-80 p-4 space-y-6 border-r sticky top-0 h-screen overflow-y-auto",
          isDark ? "bg-black border-gray-800" : "bg-white border-gray-200"
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
              <div className="absolute inset-0 bg-gradient-to-r from-info-500 to-purple-600 rounded-2xl" />
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
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-lg">AI Career Coach</h3>
            </div>
            <p className="text-sm text-white/90 mb-3">
              Get personalized career guidance based on your profile and goals
            </p>

          </div>

          {/* Skills Development Tracker */}


          {/* Industry Insights */}
          <div className={cn("rounded-2xl border overflow-hidden", isDark ? "bg-black border-gray-800" : "bg-white border-gray-200")}>
            <div className={cn("p-4 border-b", isDark ? "border-gray-800" : "border-gray-200")}>
              <h3 className={cn("font-bold", isDark ? "text-gray-300" : "text-gray-900")}>Industry Pulse</h3>
              <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-600")}>Real-time market insights</p>
            </div>
            <div className={cn("divide-y", isDark ? "divide-gray-800" : "divide-gray-200")}>
              {industryInsights.map((insight, index) => (
                <div key={index} className={cn("p-3 transition-colors", isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50")}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-900")}>{insight.title}</span>
                  </div>
                  <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-600")}>{insight.description}</p>
                </div>
              ))}
            </div>
          </div>



          {/* Career Opportunities Scanner */}

          {/* Create Post Button */}
          <Button
            onClick={() => navigate('/create-post')}
            className={cn(
              "w-full font-bold py-3 rounded-full flex items-center justify-center gap-2",
              isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
            )}
          >
            <Plus className="w-5 h-5" />
            Create Post
          </Button>

          {/* Recent Connections */}
          <div className={cn("rounded-2xl border overflow-hidden", isDark ? "bg-black border-gray-800" : "bg-white border-gray-200")}>
            <div className={cn("p-4 border-b", isDark ? "border-gray-800" : "border-gray-200")}>
              <h3 className={cn("font-bold", isDark ? "text-gray-300" : "text-gray-900")}>Recent Connections</h3>
            </div>
            <div className={cn("divide-y", isDark ? "divide-gray-800" : "divide-gray-200")}>
              {[
                { name: 'Alex Chen', role: 'Software Engineer', avatar: '' },
                { name: 'Sarah Johnson', role: 'Product Manager', avatar: '' },
                { name: 'Mike Rodriguez', role: 'Designer', avatar: '' }
              ].map((connection, index) => (
                <div key={index} className={cn("p-3 transition-colors", isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50")}>
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm", isDark ? "bg-gray-700 text-gray-200" : "bg-gray-300 text-gray-700")}>
                      {connection.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("font-medium text-sm truncate", isDark ? "text-gray-300" : "text-gray-900")}>
                        {connection.name}
                      </p>
                      <p className={cn("text-xs truncate", isDark ? "text-gray-400" : "text-gray-600")}>
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
              className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors", isDark ? "text-gray-400 hover:bg-gray-900" : "text-gray-700 hover:bg-gray-100")}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => {/* handle logout */ }}
              className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors", isDark ? "text-red-400 hover:bg-red-950" : "text-red-600 hover:bg-red-50")}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={cn('flex-1 max-w-2xl border-x', isDark ? "bg-black border-gray-800" : "bg-gray-50 border-gray-200")}>
          {/* Header */}
          <div className={cn("sticky top-0 backdrop-blur-md z-20 border-b", isDark ? "bg-black/80 border-gray-800" : "bg-white/80 border-gray-200")}>
            <div className="flex items-center py-3 px-4">
              <button
                onClick={() => navigate(-1)}
                className={cn("p-2 rounded-full transition-colors mr-4", isDark ? "hover:bg-gray-900" : "hover:bg-gray-100")}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <h1 className="font-bold text-xl">
                  {profileData.full_name || user?.name || 'User'}
                </h1>
                <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                  {profileStats.posts} posts
                </p>
              </div>
              <button className={cn("p-2 rounded-full transition-colors", isDark ? "hover:bg-gray-900" : "hover:bg-gray-100")}>
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cover Photo */}
          <div className={cn("relative h-48 bg-gradient-to-r from-blue-400 to-purple-500")}>
            {profileData.cover_image_url ? (
              <img
                src={profileData.cover_image_url}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400" />
            )}
          </div>

          {/* Profile Info */}
          <div className={cn("px-4 pb-4", isDark ? "bg-black" : "bg-white")}>
            <div className="flex justify-between items-start -mt-16 mb-4">
              {/* Avatar */}
              <div className="relative">
                {profileData.avatar_url ? (
                  <img
                    src={profileData.avatar_url}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-black object-cover shadow-lg"
                  />
                ) : (
                  <div className={cn("w-32 h-32 rounded-full border-4 flex items-center justify-center font-bold text-4xl shadow-lg", isDark ? "bg-gray-900 border-black text-gray-400" : "bg-gray-300 border-white text-gray-700")}>
                    {(profileData.full_name || user?.name || 'U').charAt(0)}
                  </div>
                )}
              </div>

              {/* Edit Profile Button */}
              {isOwnProfile ? (
                <div className="mt-4 group">
                  <Button
                    variant="outlined"
                    onClick={handleEditProfile}
                    className={cn(
                      "rounded-3xl px-6 py-1.5 font-thin transition-all duration-300 flex items-center gap-2 overflow-hidden relative",
                      isDark
                        ? "border-none text-white hover:bg-black/90 bg-black"
                        : "border-none text-black hover:bg-gray-100 hover:border-gray-400"
                    )}
                    onMouseEnter={(e) => {
                      const span = e.currentTarget.querySelector('.edit-text');
                      if (span) {
                        // Animate text transformation
                        gsap.to(span, {
                          scale: 0.8,
                          opacity: 0,
                          duration: 0.2,
                          ease: "power2.in",
                          onComplete: () => {
                            span.textContent = "Profile";
                            gsap.to(span, {
                              scale: 1,
                              opacity: 1,
                              duration: 0.2,
                              ease: "power2.out"
                            });
                          }
                        });
                      }
                    }}
                    onMouseLeave={(e) => {
                      const span = e.currentTarget.querySelector('.edit-text');
                      if (span) {
                        gsap.to(span, {
                          scale: 0.8,
                          opacity: 0,
                          duration: 0.2,
                          ease: "power2.in",
                          onComplete: () => {
                            span.textContent = "Edit";
                            gsap.to(span, {
                              scale: 1,
                              opacity: 1,
                              duration: 0.2,
                              ease: "power2.out"
                            });
                          }
                        });
                      }
                    }}
                  >
                    <Feather className="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                    <span className="edit-text inline-block">Edit</span>
                  </Button>
                </div>
              ) : (
                <FollowButton targetUserId={userId} />
              )}
            </div>

            {/* User Info */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">
                  {profileData.full_name || user?.name || 'User'}
                </h1>
                {user?.profile?.verified && (
                  <Verified className="w-5 h-5 text-info-500" />
                )}
              </div>
              <p className={cn("text-base mb-3", isDark ? "text-gray-400" : "text-gray-600")}>
                @{(profileData.username || (profileData.full_name || user?.name || 'user').toLowerCase().replace(/\s/g, ''))}
              </p>

              {/* Bio */}
              <div className="mb-3">
                <p className={cn("leading-relaxed", isDark ? "text-gray-300" : "text-gray-900")}>
                  {profileData.bio || 'The Lab Business automation company'}
                </p>
              </div>

              {/* Metadata */}
              <div className={cn("flex flex-wrap items-center gap-4 text-sm mb-3", isDark ? "text-gray-400" : "text-gray-600")}>
                {profileData.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profileData.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatJoinDate(profileData.created_at) || 'January 2025'}</span>
                </div>
              </div>

              {/* Following/Followers */}
              <div className="flex gap-5">
                <button className={cn("hover:underline", isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900")}>
                  <span className={cn("font-bold", isDark ? "text-white" : "text-gray-900")}>
                    {profileStats.following}
                  </span>
                  <span className="ml-1">
                    Following
                  </span>
                </button>
                <button className={cn("hover:underline", isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900")}>
                  <span className={cn("font-bold", isDark ? "text-white" : "text-gray-900")}>
                    {profileStats.followers}
                  </span>
                  <span className="ml-1">
                    Followers
                  </span>
                </button>
              </div>
            </div>

            {/* Verification Banner */}
            <div className={cn("rounded-xl p-4 mb-4 border", isDark ? "bg-black border-gray-700" : "bg-[#BCE953]/10 border-[#BCE953]")}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn("font-bold", isDark ? "text-gray-300" : "text-[#7BA805]")}>You aren't verified yet</span>
                    <Verified className={cn("w-5 h-5", isDark ? "text-gray-400" : "text-[#7BA805]")} />
                  </div>
                  <p className={cn("text-sm mb-3", isDark ? "text-gray-400" : "text-gray-700")}>
                    Get verified for boosted replies, analytics, ad-free browsing, and more.
                    Upgrade your profile now.
                  </p>
                  <Button
                    variant="filled"
                    className="bg-[#BCE953] hover:bg-[#A8D543] text-black font-bold px-4 py-1.5 rounded-full text-sm"
                  >
                    Get verified
                  </Button>
                </div>
                <button className={cn("transition-colors", isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900")}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className={cn("border-b", isDark ? "bg-black border-gray-800" : "bg-white border-gray-200")}>
            <div className="flex">
              {[
                { id: 'posts', label: 'Posts' },
                { id: 'replies', label: 'Replies' },
                { id: 'highlights', label: 'Highlights' },
                { id: 'articles', label: 'Articles' },
                { id: 'media', label: 'Media' },
                { id: 'likes', label: 'Likes' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'relative px-4 py-4 text-center font-medium transition-colors flex-1',
                    activeTab === tab.id
                      ? isDark ? "text-white" : "text-gray-900"
                      : isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <span className="text-sm">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#BCE953] rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Content */}
          <div className={cn("min-h-screen", isDark ? "bg-black" : "bg-gray-50")}>
            {postsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BCE953]"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <div className={cn("w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center", isDark ? "bg-gray-900" : "bg-gray-100")}>
                  <MessageCircle className={cn("w-8 h-8", isDark ? "text-gray-700" : "text-gray-400")} />
                </div>
                <h3 className={cn("text-lg font-semibold mb-2", isDark ? "text-white" : "text-gray-900")}>No posts yet</h3>
                <p className={cn("mb-4", isDark ? "text-gray-400" : "text-gray-600")}>
                  {isOwnProfile ? "You haven't posted anything yet." : "This user hasn't posted anything yet."}
                </p>
                {isOwnProfile && (
                  <Button
                    onClick={() => navigate('/create-post')}
                    className="bg-[#BCE953] hover:bg-[#A8D543] text-black font-bold px-6 py-2 rounded-full"
                  >
                    Create your first post
                  </Button>
                )}
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className={cn("border-b p-4 transition-colors cursor-pointer", isDark ? "border-gray-800 hover:bg-black" : "border-gray-200 hover:bg-gray-50")} onClick={() => navigate(`/post/${post.id}`)}>
                  <div className="flex gap-3">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0", isDark ? "bg-gray-900" : "bg-white")}>
                      {post.author?.avatar_url ? (
                        <img
                          src={post.author.avatar_url}
                          alt={post.author.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className={isDark ? "text-gray-400" : "text-gray-700"}>
                          {(post.author?.name || 'U').charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("font-bold", isDark ? "text-white" : "text-gray-900")}>
                          {post.author?.name || 'User'}
                        </span>
                        <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                          @{post.author?.username || 'user'}
                        </span>
                        <span className={isDark ? "text-gray-600" : "text-gray-600"}>·</span>
                        <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                          {new Date(post.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <button className={cn("ml-auto transition-colors", isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900")}>
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      <p className={cn("mb-3 leading-relaxed whitespace-pre-wrap", isDark ? "text-gray-300" : "text-gray-900")}>
                        {post.content}
                      </p>

                      {/* Media Content */}
                      {post.image_url && (
                        <div className={cn("rounded-2xl overflow-hidden mb-3 border", isDark ? "border-gray-700" : "border-gray-300")}>
                          <img
                            src={post.image_url}
                            alt="Post image"
                            className="w-full h-auto max-h-96 object-cover"
                          />
                        </div>
                      )}

                      {post.video_url && (
                        <div className={cn("rounded-2xl overflow-hidden mb-3 border", isDark ? "border-gray-700" : "border-gray-300")}>
                          <video
                            src={post.video_url}
                            controls
                            className="w-full h-auto max-h-96"
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}

                      <div className={cn("flex items-center justify-between max-w-md", isDark ? "text-gray-400" : "text-gray-600")}>
                        <button
                          className={cn("flex items-center gap-2 transition-colors group", isDark ? "hover:text-info-400" : "hover:text-info-500")}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/post/${post.id}`);
                          }}
                        >
                          <div className={cn("p-2 rounded-full", isDark ? "group-hover:bg-info-500/10" : "group-hover:bg-info-50")}>
                            <MessageCircle className="w-4 h-4" />
                          </div>
                          <span className="text-sm">{post.comments_count || 0}</span>
                        </button>
                        <button className={cn("flex items-center gap-2 transition-colors group", isDark ? "hover:text-green-400" : "hover:text-green-500")}>
                          <div className={cn("p-2 rounded-full", isDark ? "group-hover:bg-green-500/10" : "group-hover:bg-green-50")}>
                            <Repeat2 className="w-4 h-4" />
                          </div>
                          <span className="text-sm">{post.shares_count || 0}</span>
                        </button>
                        <button className={cn("flex items-center gap-2 transition-colors group", isDark ? "hover:text-red-400" : "hover:text-red-500")}>
                          <div className={cn("p-2 rounded-full", isDark ? "group-hover:bg-red-500/10" : "group-hover:bg-red-50")}>
                            <Heart className="w-4 h-4" />
                          </div>
                          <span className="text-sm">{post.likes_count || 0}</span>
                        </button>
                        <button className={cn("flex items-center gap-2 transition-colors group", isDark ? "hover:text-info-400" : "hover:text-info-500")}>
                          <div className={cn("p-2 rounded-full", isDark ? "group-hover:bg-info-500/10" : "group-hover:bg-info-50")}>
                            <BarChart3 className="w-4 h-4" />
                          </div>
                        </button>
                        <button className={cn("transition-colors group", isDark ? "hover:text-info-400" : "hover:text-info-500")}>
                          <div className={cn("p-2 rounded-full", isDark ? "group-hover:bg-info-500/10" : "group-hover:bg-info-50")}>
                            <Share className="w-4 h-4" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className={cn("w-80 p-4 space-y-4", isDark ? "bg-black" : "bg-gray-50")}>
          {/* Search Bar */}
          <div className={cn("relative rounded-full overflow-hidden", isDark ? "bg-black border-white" : "bg-white border border-gray-300")}>
            <div className={cn("absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", isDark ? "text-gray-400" : "text-gray-500")}>
              <Search className="w-5 h-5 " />
            </div>
            <input
              type="text"
              placeholder="Search"
              className={cn("w-full py-2 pl-10 pr-4 rounded-full focus:outline-none border-1 border-white", isDark ? "bg-black text-white placeholder-white focus:bg-black" : "bg-white text-gray-900 placeholder-gray-400 focus:bg-gray-100")}
            />
          </div>

          {/* You might like */}
          <div className={cn("rounded-2xl overflow-hidden border shadow-sm", isDark ? "bg-black border-gray-800" : "bg-white border-gray-200")}>
            <div className={cn("p-4 border-b", isDark ? "border-gray-800" : "border-gray-200")}>
              <h2 className="text-xl font-serif">You might like</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recommendedUsers && recommendedUsers.length > 0 ? (
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
                    onNavigate={() => { }}
                  />
                ))
              ) : (
                <div className={cn("p-4 text-center", isDark ? "text-gray-400" : "text-gray-600")}>
                  <p className="text-sm">Loading recommendations...</p>
                </div>
              )}
            </div>
            <div className="p-4">
              <button
                className="text-[#7BA805] hover:underline text-sm"
                onClick={() => navigate('/explore')}
              >
                Show more
              </button>
            </div>
          </div>

          {/* What's happening */}
          <div className={cn("rounded-2xl overflow-hidden border shadow-sm", isDark ? "bg-black border-gray-800" : "bg-white border-gray-200")}>
            <div className={cn("p-4 border-b", isDark ? "border-gray-800" : "border-gray-200")}>
              <h2 className="text-xl font-extralight ">What's happening</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {trendingTopics.map((topic, index) => (
                <div key={index} className={cn("p-4 transition-colors cursor-pointer", isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50")}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className={cn("text-xs mb-1", isDark ? "text-gray-400" : "text-gray-600")}>
                        {topic.category}
                      </p>
                      <p className={cn("font-sans mb-1", isDark ? "text-white" : "text-gray-900")}>
                        {topic.topic}
                      </p>
                      <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-600")}>
                        {topic.posts}
                      </p>
                    </div>
                    <button className={cn("transition-colors", isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900")}>
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4">
              <button className="text-[#7BA805] hover:underline text-sm">
                Show more
              </button>
            </div>
          </div>

          {/* Industry Insights */}
          <div className={cn("rounded-2xl border overflow-hidden", isDark ? "bg-black border-gray-800" : "bg-white border-gray-200")}>
            <div className={cn("p-4 border-b", isDark ? "border-gray-800" : "border-gray-200")}>
              <h3 className="font-bold">Industry Pulse</h3>
              <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-600")}>Real-time market insights</p>
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
                <div key={index} className={cn("p-3 transition-colors", isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50")}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>{insight.title}</span>
                    <div className={cn(
                      'flex items-center gap-1 text-xs px-2 py-1 rounded-full',
                      insight.trend === 'up' ? 'bg-green-100/20 text-green-400' : 'bg-red-100/20 text-red-400'
                    )}>
                      <TrendingUp className="w-3 h-3" />
                      {insight.change}
                    </div>
                  </div>
                  <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-600")}>{insight.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Career Opportunities Scanner */}
          <div className={cn("rounded-2xl border overflow-hidden", isDark ? "bg-black border-gray-800" : "bg-white border-gray-200")}>
            <div className={cn("p-4 border-b", isDark ? "border-gray-800" : "border-gray-200")}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="font-bold">Live Opportunities</h3>
              </div>
              <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-600")}>Matching your profile in real-time</p>
            </div>
            <div className="p-4 space-y-3">
              {matchedJobsLoading ? (
                <div className="text-center py-4 text-gray-400">Loading opportunities...</div>
              ) : matchedJobs && matchedJobs.length > 0 ? (
                matchedJobs.map((job: any, index: number) => (
                  <div
                    key={job.id || index}
                    className={cn("border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md", isDark ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-400")}
                    onClick={() => navigate(`/job/${job.id}`)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className={cn("font-medium text-sm truncate", isDark ? "text-white" : "text-gray-900")}>{job.title}</h4>
                        <p className={cn("text-xs truncate", isDark ? "text-gray-400" : "text-gray-600")}>{job.company}</p>
                      </div>
                      <div className="text-right ml-2">
                        <div className={cn(
                          'text-xs px-2 py-1 rounded-full font-medium',
                          job.matchPercentage >= 70
                            ? 'bg-green-100/20 text-green-400'
                            : job.matchPercentage >= 50
                              ? 'bg-yellow-100/20 text-yellow-400'
                              : 'bg-info-100/20 text-info-400'
                        )}>
                          {job.matchPercentage}% match
                        </div>
                      </div>
                    </div>

                    {/* Match Reasons */}
                    {job.matchReasons && job.matchReasons.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {job.matchReasons.slice(0, 2).map((reason: string, idx: number) => (
                          <span
                            key={idx}
                            className={cn(
                              'text-xs px-2 py-0.5 rounded-full',
                              isDark
                                ? 'bg-info-900/30 text-info-300'
                                : 'bg-info-50 text-info-600'
                            )}
                          >
                            ✓ {reason}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className={cn("flex items-center justify-between text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                      <span>{job.location || 'Remote'}</span>
                      <span>{job.type || 'Full-time'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-400 text-sm">
                  <p className="mb-2">No matched opportunities yet</p>
                  <p className="text-xs">Complete your profile to get personalized recommendations</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Links */}
          <div className={cn("text-xs space-y-2 p-3 rounded-2xl", isDark ? "bg-gray-900/50 text-gray-500" : "bg-gray-100 text-gray-600")}>
            <div className="flex flex-wrap gap-2">
              <button className="hover:underline">Privacy Policy</button>
              <button className="hover:underline">Cookie Policy</button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="hover:underline">Accessibility</button>
              <button className="hover:underline">Ads info</button>
              <button className="hover:underline">More</button>
              <span>© 2025 X Corp.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}