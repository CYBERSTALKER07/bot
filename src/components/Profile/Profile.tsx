import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  LinkIcon,
  Mail,
  Building2,
  GraduationCap,
  MoreHorizontal,
  MessageCircle,
  Bell,
  Settings,
  User,
  Award,
  Briefcase,
  Code,
  Zap,
  Plus,
  X as XIcon,
  Edit3,
  Save,
  Phone,
  Globe,
  FileText,
  ExternalLink,
  Github,
  Linkedin,
  Eye,
  TrendingUp,
  Users,
  Heart,
  Share,
  Camera,
  Upload,
  UserCheck,
  UserPlus,
  UserX,
  Home,
  Search,
  BookOpen,
  BarChart3,
  LogOut,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { Card } from '../ui/Card';
import Badge from '../ui/Badge';
import { cn } from '../../lib/cva';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  experience: Experience[];
  education: Education[]; 
  projects: Project[];
  certifications: Certification[];
  portfolio_url?: string;
  linkedin_url?: string;
  github_url?: string;
  company_name?: string;
  company_description?: string;
  company_size?: string;
  industry?: string;
  website?: string;
  joined_date?: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date?: string;
  gpa?: string;
  current: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  url?: string;
  github_url?: string;
  image_url?: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiry_date?: string;
  credential_id?: string;
  url?: string;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'highlights' | 'articles' | 'media' | 'likes'>('posts');
  
  // Enhanced responsive breakpoints
  const [screenSize, setScreenSize] = useState(() => {
    const width = window.innerWidth;
    if (width < 480) return 'xs'; // Extra small phones
    if (width < 640) return 'sm'; // Small phones
    if (width < 768) return 'md'; // Large phones/small tablets
    if (width < 1024) return 'lg'; // Tablets
    return 'xl'; // Desktop
  });
  
  const isMobile = screenSize === 'xs' || screenSize === 'sm';
  const isTablet = screenSize === 'md' || screenSize === 'lg';
  const isDesktop = screenSize === 'xl';

  const [profileStats, setProfileStats] = useState({
    following: 1247,
    followers: 342,
    posts: 42
  });
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || 'User',
    email: user?.email || '',
    phone: '',
    location: 'Phoenix, AZ',
    bio: 'Software Engineer @TechCorp 🚀\nBuilding the future one line of code at a time 💻\n#React #TypeScript #AI',
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    portfolio_url: 'https://johndoe.dev',
    linkedin_url: 'https://linkedin.com/in/johndoe',
    github_url: 'https://github.com/johndoe',
    company_name: '',
    company_description: '',
    company_size: '',
    industry: '',
    website: '',
    joined_date: 'January 2020'
  });

  // Mock posts data for X-style layout
  const mockPosts = [
    {
      id: '1',
      content: "Just shipped a new feature that I'm really excited about! The team worked incredibly hard on this one. 🚀",
      timestamp: '2h',
      likes: 24,
      retweets: 8,
      replies: 3,
      images: []
    },
    {
      id: '2', 
      content: "Working on some exciting AI projects lately. The future of technology is here and it's incredible what we can build now. What are your thoughts on AI in software development?",
      timestamp: '5h',
      likes: 42,
      retweets: 12,
      replies: 7,
      images: []
    },
    {
      id: '3',
      content: "Beautiful sunset today! Sometimes you need to step away from the code and appreciate the world around you. 🌅",
      timestamp: '1d',
      likes: 156,
      retweets: 23,
      replies: 18,
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop']
    }
  ];

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

  const formatJoinDate = (dateString: string) => {
    if (!dateString) return 'Joined January 2024';
    const date = new Date(dateString);
    return `Joined ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  };

  const handleSave = () => {
    // Save logic here
    setShowEditModal(false);
  };

  const addSkill = (skill: string) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const PostCard = ({ post }: { post: any }) => (
    <div className={cn(
      'border-b border-gray-200 dark:border-gray-800 px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer',
      isMobile ? 'px-4 py-3' : 'px-6 py-4'
    )}>
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className={cn(
            'w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold',
            isDark ? 'border-black' : 'border-white',
            isMobile ? 'w-8 h-8 text-sm' : 'w-10 h-10'
          )}>
            {user?.avatar_url ? (
              <img 
                src={user.avatar_url}
                alt={profileData.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              profileData.name.charAt(0)
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className={cn('font-bold text-gray-900 dark:text-white', isMobile ? 'text-sm' : 'text-base')}>
              {profileData.name}
            </span>
            <span className={cn('text-gray-500', isMobile ? 'text-xs' : 'text-sm')}>
              @{profileData.name.toLowerCase().replace(/\s/g, '')}
            </span>
            <span className="text-gray-500">·</span>
            <span className={cn('text-gray-500', isMobile ? 'text-xs' : 'text-sm')}>{post.timestamp}</span>
          </div>
          <div className={cn('mt-1', isMobile ? 'text-sm' : 'text-base')}>
            <p className="text-gray-900 dark:text-white whitespace-pre-line">{post.content}</p>
            {post.images?.length > 0 && (
              <div className="mt-3">
                <img 
                  src={post.images[0]} 
                  alt="Post image"
                  className="rounded-2xl max-w-full h-auto border border-gray-200 dark:border-gray-700"
                />
              </div>
            )}
          </div>
          <div className={cn('flex items-center justify-between mt-3 max-w-md', isMobile ? 'text-xs' : 'text-sm')}>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                <MessageCircle className={cn(isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
              </div>
              <span>{post.replies}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20">
                <TrendingUp className={cn(isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
              </div>
              <span>{post.retweets}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20">
                <Heart className={cn(isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
              </div>
              <span>{post.likes}</span>
            </button>
            <button className="text-gray-500 hover:text-blue-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                <Share className={cn(isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, isActive, onClick }: { id: string; label: string; isActive: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={cn(
        'relative px-4 py-4 font-medium text-center transition-colors hover:bg-gray-50/50 dark:hover:bg-white/[0.02] flex-1',
        isMobile ? 'text-sm px-2 py-3' : 'text-base',
        isActive
          ? 'text-gray-900 dark:text-white'
          : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
      )}
    >
      {label}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full"></div>
      )}
    </button>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div>
            {mockPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        );

      case 'replies':
        return (
          <div className="text-center py-16">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No replies yet</h3>
            <p className="text-gray-500">When @{profileData.name.toLowerCase().replace(/\s/g, '')} replies to posts, they'll show up here.</p>
          </div>
        );

      case 'highlights':
        return (
          <div className="text-center py-16">
            <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Nothing to see here — yet</h3>
            <p className="text-gray-500">Highlights from this account will show up here.</p>
          </div>
        );

      case 'articles':
        return (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No articles yet</h3>
            <p className="text-gray-500">Articles written by @{profileData.name.toLowerCase().replace(/\s/g, '')} will appear here.</p>
          </div>
        );

      case 'media':
        return (
          <div className="text-center py-16">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No photos or videos yet</h3>
            <p className="text-gray-500">When @{profileData.name.toLowerCase().replace(/\s/g, '')} posts photos or videos, they'll show up here.</p>
          </div>
        );

      case 'likes':
        return (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No likes yet</h3>
            <p className="text-gray-500">When @{profileData.name.toLowerCase().replace(/\s/g, '')} likes a post, it'll show up here.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn(
      'min-h-screen',
      isDark ? 'bg-black text-white' : 'bg-white text-black',
      // Add safe area padding for mobile devices
      isMobile && 'pb-safe-area-inset-bottom pt-safe-area-inset-top'
    )}>
      {/* X-Style Header - Enhanced Mobile Responsiveness */}
      <div className={cn(
        'sticky backdrop-blur-md border-b z-20',
        isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200',
        // Responsive positioning
        isMobile ? 'top-0' : 'top-0'
      )}>
        <div className={cn(
          'flex items-center py-3',
          // Responsive padding
          screenSize === 'xs' ? 'px-3' : 'px-4'
        )}>
          <button 
            onClick={() => navigate(-1)}
            className={cn(
              'p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors',
              // Enhanced touch targets for mobile
              isMobile ? 'p-3 -ml-1 mr-4' : 'mr-8'
            )}
          >
            <ArrowLeft className={cn(isMobile ? 'w-5 h-5' : 'w-5 h-5')} />
          </button>
          <div className="flex-1">
            <h1 className={cn(
              'font-bold truncate',
              screenSize === 'xs' ? 'text-lg' : 'text-xl'
            )}>
              {profileData.name}
            </h1>
            <p className={cn(
              'text-gray-500 truncate',
              screenSize === 'xs' ? 'text-xs' : 'text-sm'
            )}>
              {profileStats.posts} posts
            </p>
          </div>
          <button className={cn(
            'p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors',
            isMobile && 'p-3'
          )}>
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className={cn(
        'mx-auto',
        // Responsive max widths
        screenSize === 'xs' ? 'max-w-full' : 
        screenSize === 'sm' ? 'max-w-full' : 
        screenSize === 'md' ? 'max-w-full' : 
        'max-w-2xl'
      )}>
        {/* Cover Photo - Enhanced Mobile Sizes */}
        <div className={cn(
          'relative',
          // Responsive cover photo heights
          screenSize === 'xs' ? 'h-40' :
          screenSize === 'sm' ? 'h-44' :
          screenSize === 'md' ? 'h-48' :
          'h-52'
        )}>
          <div className={cn(
            'absolute inset-0',
            isDark 
              ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600' 
              : 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500'
          )}></div>
          <button className={cn(
            'absolute bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors',
            // Responsive positioning and sizing
            screenSize === 'xs' ? 'top-2 right-2 p-1.5' : 'top-4 right-4 p-2'
          )}>
            <Camera className={cn(screenSize === 'xs' ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
          </button>
        </div>

        {/* Profile Section - Enhanced Mobile Layout */}
        <div className={cn(
          screenSize === 'xs' ? 'px-3' :
          screenSize === 'sm' ? 'px-3' : 
          'px-4'
        )}>
          <div className={cn(
            'flex justify-between items-start mb-4',
            // Responsive avatar positioning
            screenSize === 'xs' ? '-mt-12' :
            screenSize === 'sm' ? '-mt-14' :
            '-mt-16'
          )}>
            {/* Avatar - Responsive Sizing */}
            <div className="relative">
              <div className={cn(
                'rounded-full border-4 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold',
                isDark ? 'border-black' : 'border-white',
                // Responsive avatar sizes
                screenSize === 'xs' ? 'w-24 h-24 text-2xl' :
                screenSize === 'sm' ? 'w-28 h-28 text-3xl' :
                screenSize === 'md' ? 'w-32 h-32 text-4xl' :
                'w-32 h-32 text-4xl'
              )}>
                {user?.avatar_url ? (
                  <img 
                    src={user.avatar_url}
                    alt={profileData.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  profileData.name.charAt(0)
                )}
              </div>
            </div>

            {/* Action Buttons - Mobile Optimized */}
            <div className={cn(
              'flex mt-4',
              // Responsive button layouts
              screenSize === 'xs' ? 'flex-col space-y-2 w-full ml-4' :
              screenSize === 'sm' ? 'flex-wrap gap-2 ml-4' :
              'space-x-2'
            )}>
              {screenSize === 'xs' ? (
                // Extra small screens - stacked buttons
                <>
                  <Button
                    variant="outlined"
                    onClick={() => setShowEditModal(true)}
                    className="w-full rounded-full font-bold border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm"
                    size="sm"
                  >
                    Edit profile
                  </Button>
                  <div className="flex space-x-2">
                    <button className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <Mail className="w-4 h-4 mx-auto" />
                    </button>
                    <button className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <Bell className="w-4 h-4 mx-auto" />
                    </button>
                    <button className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <MoreHorizontal className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </>
              ) : isMobile ? (
                // Small screens - compact layout
                <>
                  <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <Bell className="w-4 h-4" />
                  </button>
                  <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  <Button
                    variant="outlined"
                    onClick={() => setShowEditModal(true)}
                    className="rounded-full px-4 font-bold border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm"
                    size="sm"
                  >
                    Edit
                  </Button>
                </>
              ) : (
                // Desktop layout
                <>
                  <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <Mail className="w-5 h-5" />
                  </button>
                  <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <Bell className="w-5 h-5" />
                  </button>
                  <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  <Button
                    variant="outlined"
                    onClick={() => setShowEditModal(true)}
                    className="rounded-full px-6 font-bold border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    Edit profile
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Profile Info - Enhanced Mobile Typography */}
          <div className="mb-4">
            <h1 className={cn(
              'font-bold mb-1',
              screenSize === 'xs' ? 'text-xl' :
              screenSize === 'sm' ? 'text-2xl' :
              'text-2xl'
            )}>
              {profileData.name}
            </h1>
            <p className={cn(
              'text-gray-500 mb-3',
              screenSize === 'xs' ? 'text-sm' : 'text-base'
            )}>
              @{profileData.name.toLowerCase().replace(/\s/g, '')}
            </p>
            
            <div className="mb-3">
              <p className={cn(
                'whitespace-pre-line leading-relaxed',
                screenSize === 'xs' ? 'text-sm' : 'text-base'
              )}>
                {profileData.bio}
              </p>
            </div>

            {/* Metadata - Responsive Layout */}
            <div className={cn(
              'flex flex-wrap items-center mb-4 text-gray-500',
              screenSize === 'xs' ? 'gap-3 text-xs' :
              screenSize === 'sm' ? 'gap-3 text-sm' :
              'gap-4 text-sm'
            )}>
              {profileData.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className={cn(screenSize === 'xs' ? 'w-3 h-3' : 'w-4 h-4')} />
                  <span className="truncate max-w-32">{profileData.location}</span>
                </div>
              )}
              {profileData.portfolio_url && (
                <div className="flex items-center space-x-1 min-w-0">
                  <LinkIcon className={cn(screenSize === 'xs' ? 'w-3 h-3' : 'w-4 h-4')} />
                  <a 
                    href={profileData.portfolio_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:underline truncate max-w-32"
                  >
                    {profileData.portfolio_url.replace('https://', '')}
                  </a>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className={cn(screenSize === 'xs' ? 'w-3 h-3' : 'w-4 h-4')} />
                <span>Joined {profileData.joined_date}</span>
              </div>
            </div>

            {/* Following/Followers - Enhanced Mobile Layout */}
            <div className={cn(
              'flex',
              screenSize === 'xs' ? 'space-x-4' : 'space-x-6'
            )}>
              <button className="hover:underline">
                <span className={cn(
                  'font-bold',
                  screenSize === 'xs' ? 'text-sm' : 'text-base'
                )}>
                  {profileStats.following.toLocaleString()}
                </span>
                <span className={cn(
                  'text-gray-500 ml-1',
                  screenSize === 'xs' ? 'text-xs' : 'text-sm'
                )}>
                  Following
                </span>
              </button>
              <button className="hover:underline">
                <span className={cn(
                  'font-bold',
                  screenSize === 'xs' ? 'text-sm' : 'text-base'
                )}>
                  {profileStats.followers.toLocaleString()}
                </span>
                <span className={cn(
                  'text-gray-500 ml-1',
                  screenSize === 'xs' ? 'text-xs' : 'text-sm'
                )}>
                  Followers
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Enhanced Mobile Scrolling */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className={cn(
            'flex overflow-x-auto scrollbar-hide',
            // Mobile tab optimizations
            isMobile && 'snap-x snap-mandatory'
          )}>
            <TabButton
              id="posts"
              label="Posts"
              isActive={activeTab === 'posts'}
              onClick={() => setActiveTab('posts')}
            />
            <TabButton
              id="replies"
              label="Replies"
              isActive={activeTab === 'replies'}
              onClick={() => setActiveTab('replies')}
            />
            <TabButton
              id="highlights"
              label="Highlights"
              isActive={activeTab === 'highlights'}
              onClick={() => setActiveTab('highlights')}
            />
            <TabButton
              id="articles"
              label="Articles"
              isActive={activeTab === 'articles'}
              onClick={() => setActiveTab('articles')}
            />
            <TabButton
              id="media"
              label="Media"
              isActive={activeTab === 'media'}
              onClick={() => setActiveTab('media')}
            />
            <TabButton
              id="likes"
              label="Likes"
              isActive={activeTab === 'likes'}
              onClick={() => setActiveTab('likes')}
            />
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Enhanced Edit Profile Modal */}
      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile"
        maxWidth="lg"
      >
        <div className="space-y-6">
          {/* Cover Photo Section */}
          <div className="relative">
            <div className={cn(
              'rounded-lg flex items-center justify-center group',
              isDark ? 'bg-gray-800' : 'bg-gray-200',
              isMobile ? 'h-32' : 'h-40'
            )}>
              <button className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full text-white">
                <Upload className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Avatar Section */}
          <div className={cn('flex justify-center mb-8', isMobile ? '-mt-16 mb-6' : '-mt-20')}>
            <div className="relative group">
              <div className={cn(
                'rounded-full border-4 flex items-center justify-center text-white font-bold',
                isDark ? 'border-black bg-gray-700' : 'border-white bg-gray-400',
                isMobile ? 'w-20 h-20 text-xl' : 'w-24 h-24 text-2xl'
              )}>
                {profileData.name.charAt(0)}
              </div>
              <button className={cn(
                'absolute bottom-0 right-0 p-1 bg-blue-500 rounded-full text-white',
                isMobile ? 'p-1' : 'p-1'
              )}>
                <Camera className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Enhanced Form Fields */}
          <div className={cn('grid gap-4', isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 gap-4')}>
            <div className={cn(isMobile ? '' : 'md:col-span-2')}>
              <label className={cn('block font-medium mb-2', isMobile ? 'text-sm' : 'text-sm')}>Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))}
                className={cn(
                  'w-full p-3 border rounded-lg',
                  isDark 
                    ? 'border-gray-600 bg-gray-800 text-white' 
                    : 'border-gray-300 bg-white text-black',
                  isMobile ? 'p-2 text-sm' : 'p-3'
                )}
              />
            </div>

            <div className={cn(isMobile ? '' : 'md:col-span-2')}>
              <label className={cn('block font-medium mb-2', isMobile ? 'text-sm' : 'text-sm')}>Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                rows={isMobile ? 3 : 4}
                className={cn(
                  'w-full border rounded-lg resize-none',
                  isDark 
                    ? 'border-gray-600 bg-gray-800 text-white' 
                    : 'border-gray-300 bg-white text-black',
                  isMobile ? 'p-2 text-sm' : 'p-3'
                )}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className={cn('block font-medium mb-2', isMobile ? 'text-sm' : 'text-sm')}>Location</label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => setProfileData(prev => ({...prev, location: e.target.value}))}
                className={cn(
                  'w-full border rounded-lg',
                  isDark 
                    ? 'border-gray-600 bg-gray-800 text-white' 
                    : 'border-gray-300 bg-white text-black',
                  isMobile ? 'p-2 text-sm' : 'p-3'
                )}
                placeholder="City, State"
              />
            </div>

            <div>
              <label className={cn('block font-medium mb-2', isMobile ? 'text-sm' : 'text-sm')}>Phone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({...prev, phone: e.target.value}))}
                className={cn(
                  'w-full border rounded-lg',
                  isDark 
                    ? 'border-gray-600 bg-gray-800 text-white' 
                    : 'border-gray-300 bg-white text-black',
                  isMobile ? 'p-2 text-sm' : 'p-3'
                )}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className={cn(isMobile ? '' : 'md:col-span-2')}>
              <label className={cn('block font-medium mb-2', isMobile ? 'text-sm' : 'text-sm')}>Website/Portfolio</label>
              <input
                type="url"
                value={profileData.portfolio_url || profileData.website || ''}
                onChange={(e) => setProfileData(prev => ({
                  ...prev, 
                  [user?.role === 'employer' ? 'website' : 'portfolio_url']: e.target.value
                }))}
                className={cn(
                  'w-full border rounded-lg',
                  isDark 
                    ? 'border-gray-600 bg-gray-800 text-white' 
                    : 'border-gray-300 bg-white text-black',
                  isMobile ? 'p-2 text-sm' : 'p-3'
                )}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <label className={cn('block font-medium mb-2', isMobile ? 'text-sm' : 'text-sm')}>LinkedIn</label>
              <input
                type="url"
                value={profileData.linkedin_url || ''}
                onChange={(e) => setProfileData(prev => ({...prev, linkedin_url: e.target.value}))}
                className={cn(
                  'w-full border rounded-lg',
                  isDark 
                    ? 'border-gray-600 bg-gray-800 text-white' 
                    : 'border-gray-300 bg-white text-black',
                  isMobile ? 'p-2 text-sm' : 'p-3'
                )}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>

          {/* Enhanced Skills Section */}
          <div>
            <label className={cn('block font-medium mb-2', isMobile ? 'text-sm' : 'text-sm')}>Skills</label>
            <div className={cn('flex flex-wrap gap-2 mb-3', isMobile ? 'gap-1.5 mb-2' : 'gap-2')}>
              {profileData.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={cn('flex items-center space-x-2', isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1')}
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => removeSkill(skill)}
                    className="hover:text-red-500"
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Button
              variant="outlined"
              onClick={() => {
                const skill = prompt('Enter a skill:');
                if (skill) addSkill(skill);
              }}
              className={cn(isMobile ? 'w-full text-sm' : 'w-full md:w-auto')}
              size={isMobile ? 'sm' : 'md'}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </div>

          {/* Action Buttons */}
          <div className={cn(
            'flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700',
            isMobile ? 'flex-col space-y-2 space-x-0' : ''
          )}>
            <Button
              variant="outlined"
              onClick={() => setShowEditModal(false)}
              className={cn(isMobile ? 'w-full order-2' : '')}
              size={isMobile ? 'sm' : 'md'}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              className={cn('bg-blue-500 hover:bg-blue-600', isMobile ? 'w-full order-1' : '')}
              size={isMobile ? 'sm' : 'md'}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}