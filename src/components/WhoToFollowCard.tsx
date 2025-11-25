import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFollowUser, useUnfollowUser, useFollowStatus } from '../hooks/useOptimizedQuery';
import { cn } from '../lib/cva';

interface WhoToFollowCardProps {
    user: {
        id: string;
        full_name: string;
        username: string;
        avatar_url?: string;
        verified?: boolean;
        bio?: string;
    };
}

export default function WhoToFollowCard({ user }: WhoToFollowCardProps) {
    const { user: currentUser } = useAuth();
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const [hoveredFollow, setHoveredFollow] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Get actual follow status from database
    const { data: isFollowing = false, isLoading: statusLoading, refetch } = useFollowStatus(
        currentUser?.id,
        user.id
    );

    const followUserMutation = useFollowUser();
    const unfollowUserMutation = useUnfollowUser();

    const handleFollowClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (processing || !currentUser?.id) return;

        setProcessing(true);

        const mutation = isFollowing ? unfollowUserMutation : followUserMutation;

        mutation.mutate(
            {
                followerId: currentUser.id,
                followingId: user.id
            },
            {
                onSuccess: () => {
                    setProcessing(false);
                    refetch();
                },
                onError: () => {
                    setProcessing(false);
                }
            }
        );
    };

    return (
        <button
            onClick={() => navigate(`/profile/${user.id}`)}
            className={cn(
                'flex-shrink-0 w-48 p-4 rounded-2xl text-center transition-all border group relative',
                isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-800' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
            )}
        >
            <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                alt={user.full_name}
                className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
            />
            <div className="mb-2">
                <div className="flex items-center justify-center gap-1">
                    <p className="font-bold text-sm truncate">{user.full_name}</p>
                    {user.verified && (
                        <span className="text-info-500 text-xs">✓</span>
                    )}
                </div>
                <p className={cn('text-xs truncate', isDark ? 'text-gray-400' : 'text-gray-600')}>
                    @{user.username}
                </p>
            </div>
            {user.bio && (
                <p className={cn('text-xs line-clamp-2 mb-3 h-8', isDark ? 'text-gray-500' : 'text-gray-600')}>
                    {user.bio}
                </p>
            )}
            <div
                onClick={handleFollowClick}
                onMouseEnter={() => setHoveredFollow(true)}
                onMouseLeave={() => setHoveredFollow(false)}
                className={cn(
                    'text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200',
                    isFollowing
                        ? isDark
                            ? 'bg-transparent border border-gray-600 text-white hover:border-red-500 hover:text-red-500'
                            : 'bg-transparent border border-gray-300 text-black hover:border-red-500 hover:text-red-500'
                        : isDark
                            ? 'bg-white text-black hover:bg-gray-200'
                            : 'bg-black text-white hover:bg-gray-800',
                    processing || statusLoading && 'opacity-50 cursor-not-allowed'
                )}
            >
                {processing || statusLoading
                    ? 'Loading...'
                    : isFollowing
                        ? (hoveredFollow ? 'Unfollow' : 'Following')
                        : 'Follow'}
            </div>
        </button>
    );
}
