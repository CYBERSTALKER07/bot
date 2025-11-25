import React, { useState, useRef, useEffect } from 'react';
import { X, Image as ImageIcon, Smile, MapPin } from 'lucide-react';
import { cn } from '../lib/cva';
import Avatar from './ui/Avatar';
import Button from './ui/Button';
import QuoteTweetCard from './QuoteTweetCard';

interface QuoteTweetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
  quotedPost: {
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
  currentUser: {
    name: string;
    username: string;
    avatar_url?: string;
  };
  isDark?: boolean;
  isSubmitting?: boolean;
}

export default function QuoteTweetModal({
  isOpen,
  onClose,
  onSubmit,
  quotedPost,
  currentUser,
  isDark,
  isSubmitting = false
}: QuoteTweetModalProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxCharacters = 280;

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setContent('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (content.trim() && !isSubmitting) {
      onSubmit(content.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  const charactersRemaining = maxCharacters - content.length;
  const isOverLimit = charactersRemaining < 0;
  const isNearLimit = charactersRemaining <= 20 && charactersRemaining >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className={cn(
          'relative w-full max-w-[600px] rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col',
          isDark ? 'bg-black border border-gray-800' : 'bg-white'
        )}
      >
        {/* Header */}
        <div className={cn(
          'flex items-center justify-between px-4 py-3 border-b',
          isDark ? 'border-gray-800' : 'border-gray-200'
        )}>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className={cn(
              'p-2 rounded-full transition-colors',
              isDark 
                ? 'hover:bg-gray-900 text-white' 
                : 'hover:bg-gray-100 text-gray-900'
            )}
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-bold">Quote</h2>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* User Input Section */}
          <div className="flex space-x-3 mb-4">
            <Avatar
              src={currentUser.avatar_url}
              alt={currentUser.name}
              name={currentUser.name}
              size="md"
            />
            
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a comment..."
                disabled={isSubmitting}
                className={cn(
                  'w-full resize-none border-none outline-hidden text-lg placeholder-gray-500 bg-transparent min-h-[100px]',
                  isDark ? 'text-white' : 'text-gray-900'
                )}
                maxLength={maxCharacters + 50} // Allow typing over limit but show error
              />
            </div>
          </div>

          {/* Quoted Tweet Card */}
          <div className="ml-12">
            <QuoteTweetCard 
              post={quotedPost} 
              isDark={isDark}
              onClick={() => {}}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={cn(
          'border-t px-4 py-3',
          isDark ? 'border-gray-800' : 'border-gray-200'
        )}>
          <div className="flex items-center justify-between">
            {/* Action Buttons - Hidden for now */}
            <div className="flex items-center space-x-2 opacity-50">
              <button
                disabled
                className={cn(
                  'p-2 rounded-full transition-colors',
                  isDark 
                    ? 'hover:bg-gray-900 text-info-500' 
                    : 'hover:bg-gray-100 text-info-500'
                )}
              >
                <ImageIcon className="h-5 w-5" />
              </button>
              <button
                disabled
                className={cn(
                  'p-2 rounded-full transition-colors',
                  isDark 
                    ? 'hover:bg-gray-900 text-info-500' 
                    : 'hover:bg-gray-100 text-info-500'
                )}
              >
                <Smile className="h-5 w-5" />
              </button>
            </div>

            {/* Character Count & Submit */}
            <div className="flex items-center space-x-3">
              {/* Character Counter */}
              {content.length > 0 && (
                <div className="flex items-center space-x-2">
                  {/* Circular Progress */}
                  <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className={isDark ? 'stroke-gray-800' : 'stroke-gray-200'}
                      strokeWidth="2"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className={cn(
                        isOverLimit 
                          ? 'stroke-red-500' 
                          : isNearLimit 
                            ? 'stroke-yellow-500' 
                            : 'stroke-info-500'
                      )}
                      strokeWidth="2"
                      strokeDasharray={`${(content.length / maxCharacters) * 100} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Character Count Text */}
                  {(isNearLimit || isOverLimit) && (
                    <span className={cn(
                      'text-xs font-medium',
                      isOverLimit ? 'text-red-500' : 'text-yellow-500'
                    )}>
                      {charactersRemaining}
                    </span>
                  )}
                </div>
              )}

              {/* Quote Button */}
              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || isOverLimit || isSubmitting}
                className={cn(
                  'rounded-full px-6 py-2 font-bold text-sm transition-all',
                  !content.trim() || isOverLimit || isSubmitting
                    ? isDark
                      ? 'bg-info-500/50 text-white/50 cursor-not-allowed'
                      : 'bg-info-400/50 text-white/70 cursor-not-allowed'
                    : 'bg-info-500 hover:bg-info-600 text-white'
                )}
              >
                {isSubmitting ? 'Posting...' : 'Quote'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
