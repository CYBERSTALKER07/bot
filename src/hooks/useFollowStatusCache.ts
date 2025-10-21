import { useState, useEffect, useCallback } from 'react';

const FOLLOW_STATUS_CACHE_KEY = 'follow_status_cache';

interface FollowStatusCache {
  [userId: string]: boolean;
}

export function useFollowStatusCache(userId?: string) {
  const [followStatus, setFollowStatus] = useState<Record<string, boolean>>({});
  const [hoveredFollowId, setHoveredFollowId] = useState<string | null>(null);

  // Initialize follow status from local storage on mount
  useEffect(() => {
    const cachedStatus = localStorage.getItem(FOLLOW_STATUS_CACHE_KEY);
    if (cachedStatus) {
      try {
        const parsed = JSON.parse(cachedStatus) as FollowStatusCache;
        setFollowStatus(parsed);
      } catch (error) {
        console.error('Error parsing follow status cache:', error);
      }
    }
  }, []);

  // Update follow status and persist to local storage
  const updateFollowStatus = useCallback((targetUserId: string, isFollowing: boolean) => {
    setFollowStatus(prev => {
      const updated = { ...prev, [targetUserId]: isFollowing };
      // Persist to local storage
      localStorage.setItem(FOLLOW_STATUS_CACHE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Get follow status for a specific user
  const getFollowStatus = useCallback((targetUserId: string): boolean => {
    return followStatus[targetUserId] || false;
  }, [followStatus]);

  // Clear all follow status cache (useful for logout)
  const clearFollowStatusCache = useCallback(() => {
    setFollowStatus({});
    localStorage.removeItem(FOLLOW_STATUS_CACHE_KEY);
  }, []);

  return {
    followStatus,
    hoveredFollowId,
    setHoveredFollowId,
    updateFollowStatus,
    getFollowStatus,
    clearFollowStatusCache
  };
}
