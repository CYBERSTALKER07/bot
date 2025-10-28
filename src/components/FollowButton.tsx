import React, { useState } from 'react';
import { UserPlus, UserCheck, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFollowUser, useUnfollowUser, useFollowStatus } from '../hooks/useOptimizedQuery';
import { cn } from '../lib/cva';
import Button from './ui/Button';

interface FollowButtonProps {
  targetUserId: string;
  onFollowChange?: (isFollowing: boolean) => void;
  variant?: 'filled' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showLabel?: boolean;
}

export default function FollowButton({
  targetUserId,
  onFollowChange,
  variant = 'filled',
  size = 'medium',
  className = '',
  showLabel = true,
}: FollowButtonProps) {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  // Check if current user follows target user
  const { data: followStatus = false, isLoading: statusLoading, refetch } = useFollowStatus(
    user?.id,
    targetUserId
  );

  // Follow/unfollow mutations
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  // Handle follow/unfollow
  const handleToggleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    // Prevent double-clicking
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (followStatus) {
        // Unfollow
        await unfollowMutation.mutateAsync({
          followerId: user.id,
          followingId: targetUserId,
        });
        onFollowChange?.(false);
      } else {
        // Follow
        await followMutation.mutateAsync({
          followerId: user.id,
          followingId: targetUserId,
        });
        onFollowChange?.(true);
      }
      // Refetch to get the latest status
      refetch();
    } catch (error) {
      console.error('Error toggling follow status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show button if loading or user is viewing their own profile
  if (statusLoading) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled
      >
        <Loader className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  if (user?.id === targetUserId) {
    return null;
  }

  return (
    <Button
      onClick={handleToggleFollow}
      disabled={isLoading}
      variant={followStatus ? 'outlined' : variant}
      size={size}
      className={cn(
        'transition-all duration-200',
        followStatus && isDark
          ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-900/50'
          : followStatus && !isDark
            ? 'border-gray-400 text-gray-700 hover:border-gray-300 hover:bg-gray-100/50'
            : '',
        className
      )}
      startIcon={followStatus ? UserCheck : UserPlus}
    >
      {isLoading ? (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          {showLabel && <span>{followStatus ? 'Unfollowing...' : 'Following...'}</span>}
        </>
      ) : (
        showLabel && <span>{followStatus ? 'Following' : 'Follow'}</span>
      )}
    </Button>
  );
}
