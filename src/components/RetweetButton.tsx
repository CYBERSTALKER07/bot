import React, { useState } from 'react';
import { Repeat2, Edit3, X } from 'lucide-react';
import { cn } from '../lib/cva';
import Button from './ui/Button';
import { useTheme } from '../context/ThemeContext';

interface RetweetButtonProps {
  postId: string;
  retweetsCount: number;
  hasRetweeted: boolean;
  onRetweet: () => void;
  onQuoteRetweet: () => void;
  isMobile?: boolean;
  isDark?: boolean;
}

export default function RetweetButton({
  postId,
  retweetsCount,
  hasRetweeted,
  onRetweet,
  onQuoteRetweet,
  isMobile = false,
  isDark: isDarkProp
}: RetweetButtonProps) {
  const { isDark: isDarkContext } = useTheme();
  const isDark = isDarkProp !== undefined ? isDarkProp : isDarkContext;
  const [showMenu, setShowMenu] = useState(false);

  const handleSimpleRetweet = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRetweet();
    setShowMenu(false);
  };

  const handleQuoteRetweet = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuoteRetweet();
    setShowMenu(false);
  };

  if (isMobile) {
    // Mobile version - simple button
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSimpleRetweet}
        className={cn(
          'flex items-center space-x-2 rounded-full transition-colors',
          hasRetweeted
            ? 'text-green-500 hover:text-green-400'
            : 'text-gray-600 hover:text-green-600 hover:bg-green-500/10 dark:text-gray-400 dark:hover:text-green-400'
        )}
      >
        <Repeat2 className="h-4 w-4" />
        <span className="text-xs">{retweetsCount}</span>
      </Button>
    );
  }

  // Desktop version - with dropdown menu
  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowMenu(true);
        }}
        className={cn(
          'flex items-center space-x-2 rounded-full transition-colors',
          hasRetweeted
            ? 'text-green-500 hover:text-green-400'
            : 'text-gray-600 hover:text-green-600 hover:bg-green-500/10 dark:text-gray-400 dark:hover:text-green-400'
        )}
      >
        <Repeat2 className="h-5 w-5" />
        <span className="text-sm">{retweetsCount}</span>
      </Button>

      {/* Retweet Options Dropdown */}
      {showMenu && (
        <div
          className={cn(
            'absolute bottom-full left-0 mb-2 rounded-2xl shadow-lg border py-2 min-w-[180px] z-50',
            isDark
              ? 'bg-gray-900 border-gray-700'
              : 'bg-white border-gray-200'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Simple Retweet Option */}
          <button
            onClick={handleSimpleRetweet}
            className={cn(
              'w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-3 transition-colors group/option'
            )}
          >
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 group-hover/option:bg-green-200 dark:group-hover/option:bg-green-900/50 transition-colors">
              <Repeat2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className={cn('font-semibold text-sm', isDark ? 'text-white' : 'text-black')}>
                Retweet
              </div>
              <div className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-600')}>
                Share this post to your followers
              </div>
            </div>
          </button>

          {/* Quote Retweet Option */}
          <button
            onClick={handleQuoteRetweet}
            className={cn(
              'w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-3 transition-colors group/option border-t',
              isDark ? 'border-gray-700' : 'border-gray-100'
            )}
          >
            <div className="p-2 rounded-full bg-info-100 dark:bg-info-900/30 group-hover/option:bg-info-200 dark:group-hover/option:bg-info-900/50 transition-colors">
              <Edit3 className="h-4 w-4 text-info-600 dark:text-info-400" />
            </div>
            <div>
              <div className={cn('font-semibold text-sm', isDark ? 'text-white' : 'text-black')}>
                Quote Retweet
              </div>
              <div className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-600')}>
                Add your own comment
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Close menu on click outside */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
