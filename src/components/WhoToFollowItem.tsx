import React, { useState } from 'react';
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFollowUser, useUnfollowUser, useFollowStatus } from '../hooks/useOptimizedQuery';
import { cn } from '../lib/cva';
import { useNavigate } from 'react-router-dom';

interface WhoToFollowItemProps {
  user: {
    id: string;
    full_name: string;
    username: string;
    avatar_url?: string;
    verified?: boolean;
    bio?: string;
  };
  onNavigate?: (userId: string) => void;
}

export default function WhoToFollowItem({ user, onNavigate }: WhoToFollowItemProps) {
  const { user: currentUser } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [hoveredFollowId, setHoveredFollowId] = useState<string | null>(null);
  const [processingFollowId, setProcessingFollowId] = useState<string | null>(null);

  // Get actual follow status from database
  const { data: isFollowing = false, isLoading: statusLoading, refetch } = useFollowStatus(
    currentUser?.id,
    user.id
  );

  const followUserMutation = useFollowUser();
  const unfollowUserMutation = useUnfollowUser();

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (processingFollowId === user.id) {
      return;
    }

    if (!currentUser?.id) return;

    setProcessingFollowId(user.id);

    if (isFollowing) {
      // Unfollow
      unfollowUserMutation.mutate(
        {
          followerId: currentUser.id,
          followingId: user.id
        },
        {
          onSuccess: () => {
            setProcessingFollowId(null);
            // Refetch to get the latest status
            refetch();
          },
          onError: () => {
            setProcessingFollowId(null);
          }
        }
      );
    } else {
      // Follow
      followUserMutation.mutate(
        {
          followerId: currentUser.id,
          followingId: user.id
        },
        {
          onSuccess: () => {
            setProcessingFollowId(null);
            // Refetch to get the latest status
            refetch();
          },
          onError: () => {
            setProcessingFollowId(null);
          }
        }
      );
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between cursor-pointer p-2 rounded-lg ",
        isDark ? 'hover:bg-gray-900/50' : 'hover:bg-gray-100'
      )}
      onMouseEnter={() => setHoveredFollowId(user.id)}
      onMouseLeave={() => setHoveredFollowId(null)}
    >
      {/* User Info - Clickable to navigate to profile */}
      <div
        className="flex items-center space-x-3 flex-1"
        onClick={() => {
          onNavigate?.(user.id);
          navigate(`/profile/${user.id}`);
        }}
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.full_name}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-2xl",
            isDark ? 'bg-gray-700' : 'bg-white text-gray-300 font-serif  border-gray-200 border-[0.1px]'
          )}>
            {user.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <h4 className={cn(
              "font-bold text-sm  truncate",
              isDark ? 'text-white' : 'text-black'
            )}>
              {user.full_name}
            </h4>
            {user.verified && (
              <div className="w-4 h-4 bg-info-500 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          <p className={cn(
            "text-xs truncate",
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            @{user.username}
          </p>
          {user.bio && (
            <p className={cn(
              "text-xs line-clamp-1",
              isDark ? 'text-gray-500' : 'text-gray-600'
            )}>
              {user.bio}
            </p>
          )}
        </div>
      </div>

      {/* Follow Button */}
      <Button
        size="xl"
        color={isFollowing ? "secondary" : "primary"}
        variant={isFollowing ? "soft" : "solid"}
        onClick={handleFollowClick}
        disabled={processingFollowId === user.id || statusLoading}
        className={cn(
          "w-[80px] rounded-3xl  shrink-0 ml-2 text-md font-bold",
          isFollowing && hoveredFollowId === user.id && 'hover:!bg-red-500 hover:!text-white'
        )}
      >
        <span className={cn(
          "inline-block transition-all duration-0 ease-in-out",
          hoveredFollowId === user.id && isFollowing ? "scale-95 opacity-70" : "scale-100 opacity-100"
        )}>
          {statusLoading
            ? 'Loading...'
            : processingFollowId === user.id
              ? 'Loading...'
              : isFollowing
                ? hoveredFollowId === user.id
                  ? 'Unfollow'
                  : 'Following'
                : 'Follow'}
        </span>
      </Button>
    </div>
  );
}
