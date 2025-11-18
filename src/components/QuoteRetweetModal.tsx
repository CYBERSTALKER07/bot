import React, { useState, useRef } from 'react';
import {
  X,
  Image as ImageIcon,
  Video,
  Smile,
  MapPin,
  Globe,
  Lock,
  Users2,
  Send
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import Avatar from './ui/Avatar';
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
  media?: { type: 'image' | 'video'; url: string; alt?: string }[];
}

interface QuoteRetweetModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
  isSubmitting?: boolean;
}

export default function QuoteRetweetModal({
  post,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false
}: QuoteRetweetModalProps) {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const MAX_CHARACTERS = 280;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
      setCharacterCount(0);
    }
  };

  const handleClose = () => {
    setContent('');
    setCharacterCount(0);
    onClose();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARACTERS) {
      setContent(text);
      setCharacterCount(text.length);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className={cn(
          'bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden',
          'animate-in fade-in duration-200'
        )}
      >
        {/* Modal Header */}
        <div
          className={cn(
            'px-6 py-4 border-b flex items-center justify-between',
            isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
          )}
        >
          <h2 className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-black')}>
            Quote Retweet
          </h2>
          <button
            onClick={handleClose}
            className={cn(
              'p-2 rounded-full transition-colors',
              isDark
                ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            <Avatar
              src={user?.profile?.avatar_url}
              alt={user?.profile?.full_name || 'User'}
              size="md"
              className="flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className={cn(
                'font-bold',
                isDark ? 'text-white' : 'text-black'
              )}>
                {user?.profile?.full_name || user?.name || 'You'}
              </div>
              <div className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                @{user?.profile?.username || 'user'}
              </div>
            </div>
          </div>

          {/* Content Input */}
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Add a comment..."
            className={cn(
              'w-full text-lg placeholder-gray-400 bg-transparent border-none resize-none',
              'focus:outline-none min-h-[100px]',
              isDark ? 'text-white' : 'text-black'
            )}
          />

          {/* Character Count */}
          <div className="flex justify-end">
            <span
              className={cn(
                'text-sm font-medium',
                characterCount > MAX_CHARACTERS * 0.9
                  ? 'text-red-500'
                  : characterCount > MAX_CHARACTERS * 0.8
                  ? 'text-yellow-500'
                  : isDark
                  ? 'text-gray-400'
                  : 'text-gray-600'
              )}
            >
              {characterCount}/{MAX_CHARACTERS}
            </span>
          </div>

          {/* Original Post Preview */}
          <div
            className={cn(
              'p-4 rounded-xl border-2 mt-4',
              isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-gray-50 border-gray-200'
            )}
          >
            <div className="flex items-start space-x-3">
              <Avatar
                src={post.author.avatar_url}
                alt={post.author.name}
                size="sm"
                className="flex-shrink-0 mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={cn(
                    'font-bold text-sm',
                    isDark ? 'text-white' : 'text-black'
                  )}>
                    {post.author.name}
                  </span>
                  {post.author.verified && (
                    <div className="w-4 h-4 bg-info-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <span className={cn(
                  'text-xs',
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}>
                  @{post.author.username}
                </span>
                <p className={cn(
                  'text-sm mt-2 line-clamp-3',
                  isDark ? 'text-gray-300' : 'text-gray-700'
                )}>
                  {post.content}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t"
            style={isDark ? { borderColor: '#374151' } : { borderColor: '#e5e7eb' }}>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                className={cn(
                  'p-2 rounded-full transition-colors',
                  isDark
                    ? 'text-info-400 hover:bg-info-500/10'
                    : 'text-info-600 hover:bg-info-500/10'
                )}
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                className={cn(
                  'p-2 rounded-full transition-colors',
                  isDark
                    ? 'text-info-400 hover:bg-info-500/10'
                    : 'text-info-600 hover:bg-info-500/10'
                )}
              >
                <Video className="w-5 h-5" />
              </button>
              <button
                type="button"
                className={cn(
                  'p-2 rounded-full transition-colors',
                  isDark
                    ? 'text-info-400 hover:bg-info-500/10'
                    : 'text-info-600 hover:bg-info-500/10'
                )}
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>

            <Button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className={cn(
                'rounded-full px-6 py-2 font-bold transition-all flex items-center space-x-2',
                content.trim() && !isSubmitting
                  ? 'bg-[#BCE953] text-black hover:bg-[#BCE953]/90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
              )}
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
