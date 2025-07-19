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
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import Button from './ui/Button';
import { Card } from './ui/Card';
import Avatar from './ui/Avatar';
import Input from './ui/Input';
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
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPosts();
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
          content: 'Career tip: Always follow up after an interview with a personalized thank you note. It shows professionalism and keeps you top of mind.',
          author: {
            id: '2',
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
          id: '3',
          content: "We're hiring! Looking for talented software engineers to join our growing team. Remote-friendly, competitive salary, and amazing benefits. DM me for details! #hiring #jobs #tech",
          author: {
            id: '3',
            name: 'Tech Startup Inc.',
            username: 'techstartup',
            verified: true,
            avatar_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=center'
          },
          created_at: '2024-01-15T08:45:00Z',
          likes_count: 67,
          retweets_count: 34,
          replies_count: 28,
          has_liked: false,
          has_retweeted: true,
          has_bookmarked: false
        }
      ];
      
      setPosts(mockPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!newPostContent.trim() || isPosting) return;
    
    setIsPosting(true);
    try {
      // Mock posting - replace with actual Supabase mutation
      const newPost: Post = {
        id: Date.now().toString(),
        content: newPostContent,
        author: {
          id: user?.id || '0',
          name: user?.name || 'You',
          username: user?.email?.split('@')[0] || 'you',
          avatar_url: user?.avatar_url
        },
        created_at: new Date().toISOString(),
        likes_count: 0,
        retweets_count: 0,
        replies_count: 0,
        has_liked: false,
        has_retweeted: false,
        has_bookmarked: false
      };
      
      setPosts([newPost, ...posts]);
      setNewPostContent('');
    } catch (error) {
      console.error('Error posting:', error);
    } finally {
      setIsPosting(false);
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
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="flex justify-center items-center min-h-screen">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
            isDark ? 'border-white' : 'border-black'
          }`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${
          isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
        }`}>
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-bold">Home</h1>
            <Button variant="ghost" size="sm" className="p-2">
              <Sparkles className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Compose Tweet */}
        <div className={`border-b p-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isDark ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <span className="text-xl">👤</span>
            </div>
            <div className="flex-1">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's happening?"
                className={`w-full text-xl placeholder-gray-500 bg-transparent border-none outline-none resize-none ${
                  isDark ? 'text-white' : 'text-black'
                }`}
                rows={3}
              />
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-full">
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-full">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-full">
                    <Calendar className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-full">
                    <MapPin className="h-5 w-5" />
                  </Button>
                </div>
                
                <Button
                  onClick={handlePost}
                  disabled={!newPostContent.trim() || isPosting}
                  className={`px-6 py-2 rounded-full font-bold ${
                    newPostContent.trim()
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div ref={timelineRef}>
          {posts.map((post, index) => (
            <article
              key={post.id}
              className={`border-b p-4 hover:bg-gray-50/5 transition-colors cursor-pointer ${
                isDark ? 'border-gray-800' : 'border-gray-200'
              }`}
              onClick={() => navigate(`/post/${post.id}`)}
            >
              <div className="flex space-x-3">
                <Link to={`/profile/${post.author.username}`} onClick={(e) => e.stopPropagation()}>
                  <img
                    src={post.author.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=random`}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </Link>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Link 
                      to={`/profile/${post.author.username}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-bold hover:underline"
                    >
                      {post.author.name}
                    </Link>
                    {post.author.verified && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    <span className={`text-gray-500`}>@{post.author.username}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500">{formatTime(post.created_at)}</span>
                  </div>
                  
                  <p className="text-base leading-normal mb-3 whitespace-pre-wrap">
                    {post.content}
                  </p>
                  
                  {/* Post Actions */}
                  <div className="flex items-center justify-between max-w-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/post/${post.id}`);
                      }}
                      className="flex items-center space-x-2 p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full group"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm">{post.replies_count}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRetweet(post.id);
                      }}
                      className={`flex items-center space-x-2 p-2 rounded-full group ${
                        post.has_retweeted
                          ? 'text-green-500'
                          : 'text-gray-500 hover:text-green-500 hover:bg-green-500/10'
                      }`}
                    >
                      <Repeat2 className="h-5 w-5" />
                      <span className="text-sm">{post.retweets_count}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post.id);
                      }}
                      className={`flex items-center space-x-2 p-2 rounded-full group ${
                        post.has_liked
                          ? 'text-red-500'
                          : 'text-gray-500 hover:text-red-500 hover:bg-red-500/10'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${post.has_liked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.likes_count}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center space-x-2 p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full group"
                    >
                      <Share className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-500/10 rounded-full"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* Loading More */}
        <div className="p-8 text-center">
          <Button
            variant="ghost"
            className="text-blue-500 hover:bg-blue-500/10"
          >
            Show more posts
          </Button>
        </div>
      </div>
    </div>
  );
}