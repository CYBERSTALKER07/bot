import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  LinkIcon,
  Mail,
  MoreHorizontal,
  MessageCircle,
  Bell,
  User,
  TrendingUp,
  Heart,
  Share,
  Edit,
  Search,
  X,
  Verified,
  Smartphone,
  BarChart3,
  Home,
  Hash,
  Bookmark,
  Users,
  Settings,
  LogOut,
  Plus,
  Briefcase,
  GraduationCap,
  Award,
  Target,
  Repeat2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { cn } from '../../lib/cva';
import AnimatedSearchButton from '../AnimatedSearchButton';

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
  const [suggestedUsers] = useState<SuggestedUser[]>([
    {
      id: '1',
      name: 'kurbonov',
      username: '@thekurbonov',
      avatar: '',
      verified: false
    },
    {
      id: '2',
      name: 'Sadriddin',
      username: '@abdoorakhimov',
      avatar: '',
      verified: false
    },
    {
      id: '3',
      name: 'The Economist',
      username: '@TheEconomist',
      avatar: '',
      verified: true
    }
  ]);

  // Trending topics data
  const [trendingTopics] = useState<TrendingTopic[]>([
    {
      category: 'Only on X · Trending',
      topic: '#KengNamping',
      posts: '96.6K posts'
    },
    {
      category: 'Entertainment · Trending',
      topic: 'Brand New Day',
      posts: '4,533 posts'
    },
    {
      category: 'Politics · Trending',
      topic: 'North Korea',
      posts: '37.7K posts'
    },
    {
      category: 'Politics · Trending',
      topic: 'Hegseth',
      posts: '43.3K posts'
    }
  ]);

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
  }, [user, userId, isOwnProfile]);

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
      // Mock data for other user's profile
      const mockProfile: ProfileData = {
        full_name: 'Other User',
        bio: 'This is another user\'s profile.',
        location: 'Remote',
        avatar_url: '',
        cover_image_url: '',
        skills: ['React', 'TypeScript', 'Node.js'],
        portfolio_url: '',
        website: ''
      };
      setProfileData(mockProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async (targetUserId?: string) => {
    const userIdToFetch = targetUserId || user?.id;
    if (!userIdToFetch) return;

    try {
      setPostsLoading(true);
      
      // Fetch posts for the user
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          user_id,
          created_at,
          likes_count,
          shares_count,
          comments_count,
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
        return;
      }

      // Fetch profile data for the user
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .eq('id', userIdToFetch)
        .single();

      if (profileError) {
        console.warn('Error fetching profile for posts:', profileError);
      }

      // Transform posts with author information
      const transformedPosts: Post[] = (postsData || []).map(post => ({
        ...post,
        author: {
          id: userIdToFetch,
          name: profileData?.full_name || 'User',
          username: profileData?.username || 'user',
          avatar_url: profileData?.avatar_url,
          verified: false
        }
      }));

      setPosts(transformedPosts);
      
      // Update profile stats with actual post count
      setProfileStats(prev => ({
        ...prev,
        posts: transformedPosts.length
      }));

    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return 'Joined recently';
    const date = new Date(dateString);
    return `Joined ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
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
        "flex items-center justify-center min-h-screen",
        isDark ? "bg-black" : "bg-white"
      )}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BCE953]"></div>
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
              <div className="w-8 h-8 bg-white-/90 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-lg">AI Career Coach</h3>
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
                    {/* <div className={cn(
                      'flex items-center gap-1 text-xs px-2 py-1 rounded-full',
                      insight.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    )}>
                      <TrendingUp className="w-3 h-3" />
                      {insight.change}
                    </div> */}
                  </div>
                  <p className="text-xs text-gray-600">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mentorship Marketplace */}
          <div className="bg-blue-950 rounded-2xl p-4 text-white">
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
          </div>

          {/* Career Opportunities Scanner */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="font-bold text-gray-900">Live Opportunities</h3>
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
          <Button
            onClick={() => navigate('/create-post')}
            className="w-full bg-[#BCE953] hover:bg-[#A8D543] text-black font-bold py-3 rounded-full flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Post
          </Button>

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
        <div className={cn('flex-1 max-w-2xl border-x border-gray-200 bg-white', isDark ? "bg-black text-white" : "bg-gray-50 text-gray-900")}>
          {/* Header */}
          <div className="sticky top-0 backdrop-blur-md bg-white/80 border-b border-gray-200 z-20">
            <div className="flex items-center py-3 px-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-4"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <h1 className="font-bold text-xl text-gray-900">
                  {profileData.full_name || user?.name || 'User'}
                </h1>
                <p className="text-gray-600 text-sm">
                  {profileStats.posts} posts
                </p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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
          <div className="px-4 pb-4 bg-white">
            <div className="flex justify-between items-start -mt-16 mb-4">
              {/* Avatar */}
              <div className="relative">
                {profileData.avatar_url ? (
                  <img
                    src={profileData.avatar_url}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-4xl shadow-lg">
                    {(profileData.full_name || user?.name || 'U').charAt(0)}
                  </div>
                )}
              </div>

              {/* Edit Profile Button */}
              <div className="mt-4">
                <Button
                  variant="outlined"
                  onClick={handleEditProfile}
                  className="rounded-full px-6 py-1.5 border-gray-300 text-black hover:bg-transparent font-bold"
                >
                  Edit profile
                </Button>
              </div>
            </div>

            {/* User Info */}
            <div className={cn("mb-4", isDark ? "bg-black text-white" : "text-gray-900")}>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profileData.full_name || user?.name || 'User'}
                </h1>
                {user?.profile?.verified && (
                  <Verified className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <p className="text-gray-600 text-base mb-3">
                @{(profileData.username || (profileData.full_name || user?.name || 'user').toLowerCase().replace(/\s/g, ''))}
              </p>

              {/* Bio */}
              <div className="mb-3">
                <p className="text-gray-900 leading-relaxed">
                  {profileData.bio || 'The Lab Business automation company'}
                </p>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-3">
                {profileData.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>Mobile Application</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatJoinDate(profileData.created_at) || 'January 2025'}</span>
                </div>
              </div>

              {/* Following/Followers */}
              <div className="flex gap-5">
                <button className="hover:underline">
                  <span className="font-bold text-gray-900">
                    {profileStats.following}
                  </span>
                  <span className="text-gray-600 ml-1">
                    Following
                  </span>
                </button>
                <button className="hover:underline">
                  <span className="font-bold text-gray-900">
                    {profileStats.followers}
                  </span>
                  <span className="text-gray-600 ml-1">
                    Followers
                  </span>
                </button>
              </div>
            </div>

            {/* Verification Banner */}
            <div className="bg-[#BCE953]/10 border border-[#BCE953] rounded-xl p-4 mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#7BA805] font-bold">You aren't verified yet</span>
                    <Verified className="w-5 h-5 text-[#7BA805]" />
                  </div>
                  <p className="text-gray-700 text-sm mb-3">
                    Get verified for boosted replies, analytics, ad-free browsing, and more. 
                    Upgrade your profile now.
                  </p>
                  <Button
                    variant="primary"
                    className="bg-[#BCE953] hover:bg-[#A8D543] text-black font-bold px-4 py-1.5 rounded-full text-sm"
                  >
                    Get verified
                  </Button>
                </div>
                <button className="text-gray-600 hover:text-gray-900">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 bg-white">
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
                      ? 'text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
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
          <div className={cn("min-h-screen", isDark ? "bg-black text-white" : "bg-gray-50 text-gray-900")}>
            {postsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BCE953]"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-4">
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
                <div key={post.id} className={cn("border-b border-gray-200 p-4 transition-colors cursor-pointe")} onClick={() => navigate(`/post/${post.id}`)}>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold flex-shrink-0">
                      {post.author?.avatar_url ? (
                        <img
                          src={post.author.avatar_url}
                          alt={post.author.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        (post.author?.name || 'U').charAt(0)
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">
                          {post.author?.name || 'User'}
                        </span>
                        <span className="text-gray-600 text-sm">
                          @{post.author?.username || 'user'}
                        </span>
                        <span className="text-gray-600">·</span>
                        <span className="text-gray-600 text-sm">
                          {new Date(post.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <button className="ml-auto text-gray-600 hover:text-gray-900">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-900 mb-3 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                      </p>
                      
                      {/* Media Content */}
                      {post.image_url && (
                        <div className="rounded-2xl overflow-hidden mb-3 border border-gray-300">
                          <img 
                            src={post.image_url} 
                            alt="Post image"
                            className="w-full h-auto max-h-96 object-cover"
                          />
                        </div>
                      )}
                      
                      {post.video_url && (
                        <div className="rounded-2xl overflow-hidden mb-3 border border-gray-300">
                          <video 
                            src={post.video_url}
                            controls
                            className="w-full h-auto max-h-96"
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between max-w-md text-gray-600">
                        <button 
                          className="flex items-center gap-2 hover:text-blue-500 transition-colors group"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/post/${post.id}`);
                          }}
                        >
                          <div className="p-2 rounded-full group-hover:bg-blue-50">
                            <MessageCircle className="w-4 h-4" />
                          </div>
                          <span className="text-sm">{post.comments_count || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-green-500 transition-colors group">
                          <div className="p-2 rounded-full group-hover:bg-green-50">
                            <Repeat2 className="w-4 h-4" />
                          </div>
                          <span className="text-sm">{post.shares_count || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-red-500 transition-colors group">
                          <div className="p-2 rounded-full group-hover:bg-red-50">
                            <Heart className="w-4 h-4" />
                          </div>
                          <span className="text-sm">{post.likes_count || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors group">
                          <div className="p-2 rounded-full group-hover:bg-blue-50">
                            <BarChart3 className="w-4 h-4" />
                          </div>
                        </button>
                        <button className="hover:text-blue-500 transition-colors group">
                          <div className="p-2 rounded-full group-hover:bg-blue-50">
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
        <div className="w-80 p-4 space-y-4 bg-gray-50">
          {/* Search Bar */}
          <AnimatedSearchButton className="fixed top-4 right-4" />

          {/* You might like */}
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">You might like</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {suggestedUsers.map((suggestedUser) => (
                <div key={suggestedUser.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
                        {suggestedUser.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-gray-900 text-sm">
                            {suggestedUser.name}
                          </span>
                          {suggestedUser.verified && (
                            <Verified className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <span className="text-gray-600 text-sm">
                          {suggestedUser.username}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      className="bg-gray-900 text-white hover:bg-gray-800 font-bold px-4 py-1.5 rounded-full text-sm"
                    >
                      Follow
                    </Button>
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

          {/* What's happening */}
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">What's happening</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-gray-600 text-xs mb-1">
                        {topic.category}
                      </p>
                      <p className="font-bold text-gray-900 mb-1">
                        {topic.topic}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {topic.posts}
                      </p>
                    </div>
                    <button className="text-gray-600 hover:text-gray-900">
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
            <div className="space-y-2">
              <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-2 text-xs text-left transition-colors">
                💡 Daily Career Tip: "Network authentically, not just for opportunities"
              </button>
              <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-2 text-xs text-left transition-colors">
                🎯 Next Goal: Complete 3 skill assessments this week
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
                      {skill.trending && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-500">+5%</span>
                        </div>
                      )}
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
                    <div className={cn(
                      'flex items-center gap-1 text-xs px-2 py-1 rounded-full',
                      insight.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    )}>
                      <TrendingUp className="w-3 h-3" />
                      {insight.change}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mentorship Marketplace */}
          <div className="bg-lime rounded-2xl p-4 text-black">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5" />
              <h3 className="font-bold">Find a Mentor</h3>
            </div>
            <p className="text-sm text-black mb-3">
              Connect with industry professionals for 1-on-1 guidance
            </p>
            {/* <div className="flex -space-x-2 mb-3">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-8 h-8 bg-white/20 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold">
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              <div className="w-8 h-8 bg-white/30 rounded-full border-2 border-white flex items-center justify-center text-xs">
                +12
              </div> */}
            <button className="w-full bg-primary hover:text-black hover:bg-white text-white rounded-lg py-2 text-sm font-medium transition-colors">
              Browse Mentors
            </button>
          </div>

          {/* Career Opportunities Scanner */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="font-bold text-gray-900">Live Opportunities</h3>
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

          {/* Career Growth Card */}
          <div className="bg-[#8056E6] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[#8056E6]/30">
              <h2 className="text-xl font-bold text-white">Career Growth</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-white">
                <p className="font-semibold mb-2">Complete your profile</p>
                <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                  <div className="bg-[#BCE953] h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
                <p className="text-sm text-white/90">75% complete</p>
              </div>
              <div className="text-white">
                <p className="font-semibold mb-1">Skills to add</p>
                <p className="text-sm text-white/90">Add 3 more skills to boost your profile visibility</p>
              </div>
            </div>
            <div className="p-4">
              <button className="text-[#BCE953] hover:underline text-sm font-medium">
                View recommendations
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-xs text-gray-600 space-y-2">
            <div className="flex flex-wrap gap-3">
              <button className="hover:underline">Terms of Service</button>
              <button className="hover:underline">Privacy Policy</button>
              <button className="hover:underline">Cookie Policy</button>
            </div>
            <div className="flex flex-wrap gap-3">
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