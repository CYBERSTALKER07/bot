import React from 'react';
import { Repeat2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/cva';
import { useTheme } from '../context/ThemeContext';

interface RetweetHeaderProps {
  retweetedByName: string;
  retweetedById: string;
  isMobile?: boolean;
}

/**
 * X/Twitter-style retweet header
 * Shows "User retweeted" above the original post
 */
export default function RetweetHeader({
  retweetedByName,
  retweetedById,
  isMobile = false
}: RetweetHeaderProps) {
  const { isDark } = useTheme();

  return (
    <div
      className={cn(
        'flex items-center space-x-2 mb-3',
        isDark ? 'text-gray-500' : 'text-gray-600',
        isMobile ? 'text-xs px-3' : 'text-sm px-4'
      )}
    >
      <Repeat2 className={cn(isMobile ? 'h-3 w-3' : 'h-4 w-4')} />
      <Link
        to={`/profile/${retweetedById}`}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'hover:underline font-medium transition-colors',
          isDark ? 'hover:text-gray-300' : 'hover:text-gray-800'
        )}
      >
        {retweetedByName} retweeted
      </Link>
    </div>
  );
}
