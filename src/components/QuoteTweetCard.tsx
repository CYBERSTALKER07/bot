import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/cva';
import Avatar from './ui/Avatar';
import VideoPlayer from './ui/VideoPlayer';

interface QuoteTweetCardProps {
  post: {
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
  isDark?: boolean;
  onClick?: () => void;
}

/**
 * X/Twitter-style quoted post card
 * Shows the original post in a bordered container with proper media sizing
 * The border contains ONLY the original post (author, content, media)
 * Recommended media sizes: 1200x1200 (square), 1200x675 (landscape), 1080x1350 (vertical)
 */
export default function QuoteTweetCard({ post, isDark, onClick }: QuoteTweetCardProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'now';
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        'mt-3 border rounded-2xl overflow-hidden cursor-pointer transition-all',
        isDark 
          ? 'border-gray-700 hover:bg-gray-900/20' 
          : 'border-gray-300 hover:bg-gray-50'
      )}
    >
      {/* Header with original author info - INSIDE THE BORDER */}
      <div className="p-3 pb-2">
        <div className="flex items-center gap-2">
          <Link 
            to={`/profile/${post.author.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0"
          >
            <Avatar
              src={post.author.avatar_url}
              alt={post.author.name}
              name={post.author.name}
              size="xs"
            />
          </Link>
          
          <div className="flex items-center gap-1 min-w-0 flex-1">
            <Link
              to={`/profile/${post.author.id}`}
              onClick={(e) => e.stopPropagation()}
              className="font-bold text-sm hover:underline truncate"
            >
              {post.author.name}
            </Link>
            {post.author.verified && (
              <div className="w-4 h-4 bg-info-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px]">✓</span>
              </div>
            )}
            <span className={cn(
              'text-xs truncate',
              isDark ? 'text-gray-500' : 'text-gray-600'
            )}>
              @{post.author.username}
            </span>
            <span className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-600')}>·</span>
            <span className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-600')}>
              {formatTime(post.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Original Post Content - INSIDE THE BORDER */}
      {post.content && (
        <p className={cn(
          'px-3 pb-2 text-sm line-clamp-4',
          isDark ? 'text-gray-300' : 'text-gray-800'
        )}>
          {post.content}
        </p>
      )}

      {/* Original Post Media with X/Twitter sizing - INSIDE THE BORDER */}
      {post.media && post.media.length > 0 && (
        <div className="w-full">
          {post.media[0].type === 'image' ? (
            <img
              src={post.media[0].url}
              alt={post.media[0].alt || 'Post image'}
              className={cn(
                'w-full object-cover',
                // X/Twitter style: max height for images in quoted posts
                'max-h-[280px]'
              )}
              loading="lazy"
            />
          ) : (
            <div className="relative w-full h-[280px]">
              <VideoPlayer
                src={post.media[0].url}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
