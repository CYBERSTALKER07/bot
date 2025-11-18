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
        'flex items-center gap-2 mb-2',
        isDark ? 'text-gray-500' : 'text-gray-600',
        isMobile ? 'text-xs pl-3' : 'text-sm pl-12'
      )}
    >
      <Repeat2 className={cn(isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
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
