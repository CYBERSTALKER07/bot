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
  FileText
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
}

export default function Feed() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    fetchPosts();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchPosts = async () => {
    try {
      // Mock data for demonstration - replace with actual Supabase query
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
          has_bookmarked: false
        },
        {
          id: '2',
          content: '🔥 TRENDING: Tech salaries are up 15% this year! Software engineers are seeing the biggest increases. Now might be the perfect time to negotiate or job hunt. What\'s your experience been? #TechJobs #SalaryTrends',
          author: {
            id: '2',
            name: 'TechSalary Insights',
            username: 'techsalary',
            verified: true,
            avatar_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=40&h=40&fit=crop&crop=center'
          },
          created_at: '2024-01-15T11:15:00Z',
          likes_count: 289,
          retweets_count: 67,
          replies_count: 43,
          has_liked: true,
          has_retweeted: false,
          has_bookmarked: true
        },
        {
          id: '3',
          content: 'Career tip: Always follow up after an interview with a personalized thank you note. It shows professionalism and keeps you top of mind.',
          author: {
            id: '3',
            name: 'Career Coach Mike',
            username: 'careercoach',
            verified: true,
            avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
          },
          created_at: '2024-01-15T09:15:00Z',
          likes_count: 89,
          retweets_count: 45,
          replies_count: 12,
          has_liked: true,
          has_retweeted: false,
          has_bookmarked: true
        },
        {
          id: '4',
          content: "🎓 UPDATE: Just graduated from Stanford CS! Special thanks to @TalentLink for connecting me with amazing internship opportunities that led to my full-time offer at Meta. This platform really works! 💙",
          author: {
            id: '4',
            name: 'Alex Chen',
            username: 'alexc_dev',
            verified: false,
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
          },
          created_at: '2024-01-15T08:45:00Z',
          likes_count: 156,
          retweets_count: 34,
          replies_count: 28,
          has_liked: false,
          has_retweeted: false,
          has_bookmarked: false
        },
        {
          id: '5',
          content: "🚨 URGENT HIRING: We need 5 Frontend Developers (React/TypeScript) for our fintech startup. $120-160k + equity. Remote OK 🌍\n\nMust have:\n✅ 3+ years React\n✅ TypeScript expert\n✅ Financial systems exp\n\nDM me your portfolio!",
          author: {
            id: '5',
            name: 'FinTech Recruiting',
            username: 'fintechcareers',
            verified: true,
            avatar_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=center'
          },
          created_at: '2024-01-15T07:30:00Z',
          likes_count: 234,
          retweets_count: 89,
          replies_count: 67,
          has_liked: false,
          has_retweeted: true,
          has_bookmarked: true
        },
        {
          id: '6',
          content: "Just had the most inspiring conversation with a recent bootcamp grad who's now a senior engineer at Netflix. Your background doesn't define your potential - your dedication does! 💪 #CodingBootcamp #TechCareers",
          author: {
            id: '6',
            name: 'Lisa Rodriguez',
            username: 'lisacodes',
            verified: false,
            avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
          },
          created_at: '2024-01-15T06:20:00Z',
          likes_count: 445,
          retweets_count: 123,
          replies_count: 56,
          has_liked: true,
          has_retweeted: true,
          has_bookmarked: false
        },
        {
          id: '7',
          content: "📊 MARKET UPDATE: AI/ML roles are growing 300% faster than traditional software roles. Time to upskill?\n\nTop skills in demand:\n🔥 PyTorch/TensorFlow\n🔥 MLOps\n🔥 Computer Vision\n🔥 NLP\n\nWhat are you learning?",
          author: {
            id: '7',
            name: 'AI Career Hub',
            username: 'aicareers',
            verified: true,
            avatar_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=40&h=40&fit=crop&crop=center'
          },
          created_at: '2024-01-15T05:45:00Z',
          likes_count: 567,
          retweets_count: 234,
          replies_count: 89,
          has_liked: false,
          has_retweeted: false,
          has_bookmarked: true
        },
        {
          id: '8',
          content: "Shoutout to my mentee who just got promoted to Tech Lead! 6 months ago they were afraid to speak up in meetings. Growth mindset + consistent effort = amazing results 🎯 #Mentorship #Leadership",
          author: {
            id: '8',
            name: 'David Kim',
            username: 'davidkimtech',
            verified: false,
            avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
          },
          created_at: '2024-01-15T04:30:00Z',
          likes_count: 178,
          retweets_count: 45,
          replies_count: 23,
          has_liked: true,
          has_retweeted: false,
          has_bookmarked: false
        },
        {
          id: '9',
          content: "🎯 PRO TIP: When negotiating salary, research isn't just about the number. Consider:\n💰 Base salary\n📈 Equity/stock options\n🏥 Healthcare quality\n🏖️ PTO policy\n📚 Learning budget\n🏠 Remote flexibility\n\nTotal comp matters!",
          author: {
            id: '9',
            name: 'Salary Negotiation Pro',
            username: 'salarynegotiator',
            verified: true,
            avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face'
          },
          created_at: '2024-01-15T03:15:00Z',
          likes_count: 789,
          retweets_count: 345,
          replies_count: 123,
          has_liked: true,
          has_retweeted: true,
          has_bookmarked: true
        },
        {
          id: '10',
          content: "COMPANY SPOTLIGHT  \n\nJoin our team at @TechInnovate! We're building the future of sustainable technology.\n\n🔍 Open roles:\n• Senior Full-Stack Dev\n• Product Designer\n• DevOps Engineer\n\nGreat culture, competitive pay, full remote! Apply now 👇",
          author: {
            id: '10',
            name: 'TechInnovate',
            username: 'techinnovate',
            verified: true,
            avatar_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=40&h=40&fit=crop&crop=center'
          },
          created_at: '2024-01-15T02:00:00Z',
          likes_count: 156,
          retweets_count: 78,
          replies_count: 34,
          has_liked: false,
          has_retweeted: false,
          has_bookmarked: true
        },
        {
          id: '11',
          content: "After 200+ interviews, here's what I learned:\n\n❌ Don't: Memorize algorithms\n✅ Do: Understand problem-solving patterns\n\n❌ Don't: Rush to code\n✅ Do: Ask clarifying questions\n\n❌ Don't: Stay silent when stuck\n✅ Do: Think out loud\n\nGood luck! 🍀",
          author: {
            id: '11',
            name: 'Interview Master',
            username: 'interviewguru',
            verified: false,
            avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&crop=face'
          },
          created_at: '2024-01-15T01:30:00Z',
          likes_count: 1234,
          retweets_count: 456,
          replies_count: 234,
          has_liked: true,
          has_retweeted: false,
          has_bookmarked: true
        },
        {
          id: '12',
          content: "🎉 MILESTONE: TalentLink just hit 100K active users! Thank you to our amazing community of students, professionals, and employers. Together we're changing how talent connects with opportunity! What's been your best TalentLink moment?",
          author: {
            id: '12',
            name: 'TalentLink',
            username: 'talentlink',
            verified: true,
            avatar_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=40&h=40&fit=crop&crop=center'
          },
          created_at: '2024-01-15T00:45:00Z',
          likes_count: 2567,
          retweets_count: 678,
          replies_count: 345,
          has_liked: true,
          has_retweeted: true,
          has_bookmarked: true
        },
        {
          id: '13',
          content: "Just launched our new product! Check out this amazing dashboard we've been working on for months 🚀",
          author: {
            id: '13',
            name: 'Emma Wilson',
            username: 'emmawilson',
            verified: false,
            avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
          },
          created_at: '2024-01-15T12:00:00Z',
          likes_count: 145,
          retweets_count: 32,
          replies_count: 18,
          has_liked: false,
          has_retweeted: false,
          has_bookmarked: false,
          media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop', alt: 'Modern dashboard interface' }]
        },
        {
          id: '14',
          content: "Amazing team lunch today! Nothing beats good food and even better company 🍕👥",
          author: {
            id: '14',
            name: 'James Park',
            username: 'jamespark',
            verified: false,
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
          },
          created_at: '2024-01-15T13:30:00Z',
          likes_count: 89,
          retweets_count: 12,
          replies_count: 25,
          has_liked: true,
          has_retweeted: false,
          has_bookmarked: false,
          media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop', alt: 'Team lunch photo' }]
        },
        {
          id: '15',
          content: "Excited to share our latest office space! Modern, collaborative, and designed for innovation 💡✨",
          author: {
            id: '15',
            name: 'TechSpace Co',
            username: 'techspaceco',
            verified: true,
            avatar_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=40&h=40&fit=crop&crop=center'
          },
          created_at: '2024-01-15T14:15:00Z',
          likes_count: 234,
          retweets_count: 56,
          replies_count: 43,
          has_liked: false,
          has_retweeted: true,
          has_bookmarked: true,
          media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop', alt: 'Modern office space' }]
        }
      ];
      
      setPosts(mockPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          has_liked: !post.has_liked,
          likes_count: post.has_liked ? post.likes_count - 1 : post.likes_count + 1
        };
      }
      return post;
    }));
  };

  const handleRetweet = async (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          has_retweeted: !post.has_retweeted,
          retweets_count: post.has_retweeted ? post.retweets_count - 1 : post.retweets_count + 1
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
      {/* Main Content */}
      <main className={cn(
        'flex-1',
        isMobile 
          ? 'pt-16 px-0' 
          : 'lg:ml-80 max-w-2xl mx-auto'
      )}>
        {/* Mobile/Desktop Header */}
        <div className={cn(
          'sticky top-0 z-10 backdrop-blur-xl border-none',
          isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200',
          isMobile ? 'top-16' : 'top-0'
        )}>
          {/* <div className={cn(
            'flex items-center justify-between py-3',
            isMobile ? 'px-4' : 'px-4'
          )}>
            <div>
              <h1 className={cn(
                'font-bold',
                isMobile ? 'text-lg' : 'text-xl'
              )}>
                {isMobile ? 'Feed' : 'Home'}
              </h1>
            </div>
          </div> */}
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
              onClick={() => navigate(`/post/${post.id}`)}
            >
              <div className={cn('flex space-x-3', isMobile ? 'space-x-2' : 'space-x-3')}>
                <Link to={`/profile/${post.author.username}`} onClick={(e) => e.stopPropagation()}>
                  <img
                    src={post.author.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=random`}
                    alt={post.author.name}
                    className={cn(
                      'rounded-full object-cover',
                      isMobile ? 'w-10 h-10' : 'w-12 h-12'
                    )}
                  />
                </Link>
                
                <div className="flex-1 min-w-0">
                  {/* Author Info */}
                  <div className={cn(
                    'flex items-center mb-1',
                    isMobile ? 'flex-col items-start space-y-1' : 'space-x-2'
                  )}>
                    <div className="flex items-center space-x-2">
                      <Link 
                        to={`/profile/${post.author.username}`}
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                          'font-bold hover:underline',
                          isMobile ? 'text-sm' : 'text-base'
                        )}
                      >
                        {post.author.name}
                      </Link>
                      {post.author.verified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div className={cn(
                      'flex items-center space-x-1 text-gray-500',
                      isMobile ? 'text-xs' : 'text-sm'
                    )}>
                      <span>@{post.author.username}</span>
                      <span>·</span>
                      <span>{formatTime(post.created_at)}</span>
                    </div>
                  </div>
                  
                  {/* Post Content */}
                  <p className={cn(
                    'leading-normal mb-3 whitespace-pre-wrap',
                    isMobile ? 'text-sm' : 'text-base'
                  )}>
                    {post.content}
                  </p>
                  
                  {/* Post Media */}
                  {post.media && post.media.length > 0 && (
                    <div className="mb-3">
                      {post.media.map((mediaItem, index) => (
                        mediaItem.type === 'image' && (
                          <div key={index} className="relative">
                            <img
                              src={mediaItem.url}
                              alt={mediaItem.alt || 'Post image'}
                              className={cn(
                                'w-full h-auto max-h-96 object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity',
                                isMobile ? 'max-h-64' : 'max-h-96'
                              )}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        )
                      ))}
                    </div>
                  )}
                  
                  {/* Post Actions */}
                  <div className={cn(
                    'flex items-center justify-between',
                    isMobile ? 'max-w-full' : 'max-w-md'
                  )}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/post/${post.id}`);
                      }}
                      className={cn(
                        'flex items-center space-x-2 p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full group',
                        isMobile ? 'p-1' : 'p-2'
                      )}
                    >
                      <MessageCircle className={cn(isMobile ? 'h-4 w-4' : 'h-5 w-5')} />
                      <span className={cn(isMobile ? 'text-xs' : 'text-sm')}>{post.replies_count}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRetweet(post.id);
                      }}
                      className={cn(
                        'flex items-center space-x-2 rounded-full group',
                        post.has_retweeted
                          ? 'text-green-500'
                          : 'text-gray-500 hover:text-green-500 hover:bg-green-500/10',
                        isMobile ? 'p-1' : 'p-2'
                      )}
                    >
                      <Repeat2 className={cn(isMobile ? 'h-4 w-4' : 'h-5 w-5')} />
                      <span className={cn(isMobile ? 'text-xs' : 'text-sm')}>{post.retweets_count}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post.id);
                      }}
                      className={cn(
                        'flex items-center space-x-2 rounded-full group',
                        post.has_liked
                          ? 'text-red-500'
                          : 'text-gray-500 hover:text-red-500 hover:bg-red-500/10',
                        isMobile ? 'p-1' : 'p-2'
                      )}
                    >
                      <Heart className={cn(
                        post.has_liked ? 'fill-current' : '',
                        isMobile ? 'h-4 w-4' : 'h-5 w-5'
                      )} />
                      <span className={cn(isMobile ? 'text-xs' : 'text-sm')}>{post.likes_count}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        'flex items-center space-x-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full group',
                        isMobile ? 'p-1' : 'p-2'
                      )}
                    >
                      <Share className={cn(isMobile ? 'h-4 w-4' : 'h-5 w-5')} />
                    </Button>
                  </div>
                </div>
                
                {!isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-500/10 rounded-full"
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
          'hidden xl:block w-80 border-l sticky top-0 h-screen mr-20 overflow-y-auto',
          isDark ? 'border-gray-800' : 'border-gray-200'
        )}>
          <div className="p-4 space-y-6">
            {/* Job Recommendations */}
            <div className={cn(
              'rounded-xl p-4 border',
              isDark ? 'bg-black border-gray-800' : 'bg-gray-50 border-gray-200'
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
                    'p-3 rounded-lg hover:bg-gray-800/30 cursor-pointer transition-colors',
                    isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-100'
                  )}>
                    <div className="flex items-center space-x-3 mb-2">
                      <img src={job.logo} alt={job.company} className="w-10 h-10 rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{job.title}</h4>
                        <p className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-600')}>
                          {job.company} • {job.location}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-green-500">{job.salary}</p>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-blue-500">
                View All Jobs
              </Button>
            </div>

            {/* Who to Follow */}
            <div className={cn(
              'rounded-xl p-4 border',
              isDark ? 'bg-black border-gray-800' : 'bg-gray-50 border-gray-200'
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
                        <p className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-600')}>
                          @{user.username}
                        </p>
                        <p className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-500')}>
                          {user.title}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" className="rounded-full">
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-blue-500">
                Show More
              </Button>
            </div>

            {/* Recent Activity */}
            <div className={cn(
              'rounded-xl p-4 border',
              isDark ? 'bg-black border-gray-800' : 'bg-gray-50 border-gray-200'
            )}>
              <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: 'New job posted', detail: 'Senior Developer at Spotify', time: '2h ago' },
                  { action: 'Event reminder', detail: 'Tech Networking Meetup', time: '4h ago' },
                  { action: 'Profile view', detail: '12 people viewed your profile', time: '6h ago' },
                  { action: 'Application update', detail: 'Your Netflix application is under review', time: '1d ago' }
                ].map((activity, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">{activity.action}</p>
                    <p className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-600')}>
                      {activity.detail}
                    </p>
                    <p className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-500')}>
                      {activity.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            <div className={cn('text-xs space-y-2', isDark ? 'text-gray-500' : 'text-gray-500')}>
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
    </div>
  );
}