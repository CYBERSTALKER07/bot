import { useCallback, useEffect, useRef } from 'react';
import {
  profileCache,
  postsCache,
  followCache,
  searchCache,
  jobsCache,
  companiesCache,
  notificationsCache
} from '../lib/cacheManager';

interface ProfileData {
  [key: string]: unknown;
}

interface PostData {
  [key: string]: unknown;
}

interface SearchResult {
  [key: string]: unknown;
}

interface JobData {
  [key: string]: unknown;
}

interface CompanyData {
  [key: string]: unknown;
}

interface NotificationData {
  [key: string]: unknown;
}

/**
 * Hook for aggressive profile caching with automatic sync
 */
export function useProfileCache(userId: string | undefined) {
  const cacheKeyRef = useRef<string>('');

  const getCachedProfile = useCallback(() => {
    if (!userId) return null;
    cacheKeyRef.current = `profile_${userId}`;
    return profileCache.get<ProfileData>(cacheKeyRef.current);
  }, [userId]);

  const setCachedProfile = useCallback((data: ProfileData) => {
    if (cacheKeyRef.current) {
      profileCache.set(cacheKeyRef.current, data);
    }
  }, []);

  const clearCachedProfile = useCallback(() => {
    if (cacheKeyRef.current) {
      profileCache.clear(cacheKeyRef.current);
    }
  }, []);

  return { getCachedProfile, setCachedProfile, clearCachedProfile };
}

/**
 * Hook for aggressive posts caching with pagination support
 */
export function usePostsCache(limit: number = 20) {
  const cacheKeyRef = useRef<string>(`posts_${limit}`);

  const getCachedPosts = useCallback(() => {
    return postsCache.get<PostData[]>(cacheKeyRef.current) || [];
  }, []);

  const setCachedPosts = useCallback((data: PostData[]) => {
    postsCache.set(cacheKeyRef.current, data);
  }, []);

  const appendCachedPosts = useCallback((newPosts: PostData[]) => {
    const existing = postsCache.get<PostData[]>(cacheKeyRef.current) || [];
    const merged = [...existing, ...newPosts];
    postsCache.set(cacheKeyRef.current, merged);
  }, []);

  const invalidatePosts = useCallback(() => {
    postsCache.clear(cacheKeyRef.current);
  }, []);

  return { getCachedPosts, setCachedPosts, appendCachedPosts, invalidatePosts };
}

/**
 * Hook for aggressive follow status caching
 */
export function useFollowStatusCache() {
  const cacheKey = 'follow_statuses';

  const getFollowStatus = useCallback((targetUserId: string): boolean | null => {
    const followMap = followCache.get<Record<string, boolean>>(cacheKey) || {};
    return followMap[targetUserId] ?? null;
  }, []);

  const setFollowStatus = useCallback((targetUserId: string, isFollowing: boolean) => {
    const followMap = followCache.get<Record<string, boolean>>(cacheKey) || {};
    followMap[targetUserId] = isFollowing;
    followCache.set(cacheKey, followMap);
  }, []);

  const getAllFollowStatus = useCallback((): Record<string, boolean> => {
    return followCache.get<Record<string, boolean>>(cacheKey) || {};
  }, []);

  const clearFollowStatus = useCallback(() => {
    followCache.clear(cacheKey);
  }, []);

  return { getFollowStatus, setFollowStatus, getAllFollowStatus, clearFollowStatus };
}

/**
 * Hook for aggressive search caching with query results
 */
export function useSearchCache() {
  const getCachedSearch = useCallback((query: string) => {
    if (!query || query.length < 2) return null;
    return searchCache.get<SearchResult>(`search_${query}`);
  }, []);

  const setCachedSearch = useCallback((query: string, results: SearchResult) => {
    if (query && query.length >= 2) {
      searchCache.set(`search_${query}`, results);
    }
  }, []);

  const clearSearchCache = useCallback(() => {
    searchCache.clearAll();
  }, []);

  return { getCachedSearch, setCachedSearch, clearSearchCache };
}

/**
 * Hook for aggressive jobs caching
 */
export function useJobsCache() {
  const cacheKey = 'jobs_list';

  const getCachedJobs = useCallback(() => {
    return jobsCache.get<JobData[]>(cacheKey) || [];
  }, []);

  const setCachedJobs = useCallback((data: JobData[]) => {
    jobsCache.set(cacheKey, data);
  }, []);

  const getCachedJob = useCallback((jobId: string) => {
    return jobsCache.get<JobData>(`job_${jobId}`);
  }, []);

  const setCachedJob = useCallback((jobId: string, data: JobData) => {
    jobsCache.set(`job_${jobId}`, data);
  }, []);

  const invalidateJobs = useCallback(() => {
    jobsCache.clearAll();
  }, []);

  return { getCachedJobs, setCachedJobs, getCachedJob, setCachedJob, invalidateJobs };
}

/**
 * Hook for aggressive companies caching
 */
export function useCompaniesCache() {
  const cacheKey = 'companies_list';

  const getCachedCompanies = useCallback(() => {
    return companiesCache.get<CompanyData[]>(cacheKey) || [];
  }, []);

  const setCachedCompanies = useCallback((data: CompanyData[]) => {
    companiesCache.set(cacheKey, data);
  }, []);

  const getCachedCompany = useCallback((companyId: string) => {
    return companiesCache.get<CompanyData>(`company_${companyId}`);
  }, []);

  const setCachedCompany = useCallback((companyId: string, data: CompanyData) => {
    companiesCache.set(`company_${companyId}`, data);
  }, []);

  return { getCachedCompanies, setCachedCompanies, getCachedCompany, setCachedCompany };
}

/**
 * Hook for aggressive notifications caching
 */
export function useNotificationsCache(userId: string | undefined) {
  const cacheKeyRef = useRef<string>('');

  const getCachedNotifications = useCallback(() => {
    if (!userId) return [];
    cacheKeyRef.current = `notifications_${userId}`;
    return notificationsCache.get<NotificationData[]>(cacheKeyRef.current) || [];
  }, [userId]);

  const setCachedNotifications = useCallback((data: NotificationData[]) => {
    if (cacheKeyRef.current) {
      notificationsCache.set(cacheKeyRef.current, data);
    }
  }, []);

  const addNotification = useCallback((notification: NotificationData) => {
    if (cacheKeyRef.current) {
      const existing = notificationsCache.get<NotificationData[]>(cacheKeyRef.current) || [];
      notificationsCache.set(cacheKeyRef.current, [notification, ...existing]);
    }
  }, []);

  return { getCachedNotifications, setCachedNotifications, addNotification };
}

/**
 * Master hook for managing all caches with lifecycle
 */
export function useAggressiveCaching() {
  useEffect(() => {
    // Cleanup old cache entries periodically (every 30 minutes)
    const cleanup = setInterval(() => {
      console.log('Running cache cleanup...');
      // Entries expire automatically due to TTL, this just logs
    }, 30 * 60 * 1000);

    return () => clearInterval(cleanup);
  }, []);

  const clearAllCaches = useCallback(() => {
    profileCache.clearAll();
    postsCache.clearAll();
    followCache.clearAll();
    searchCache.clearAll();
    jobsCache.clearAll();
    companiesCache.clearAll();
    notificationsCache.clearAll();
  }, []);

  const getCacheStats = useCallback(() => {
    return {
      profiles: profileCache.getStats(),
      posts: postsCache.getStats(),
      follows: followCache.getStats(),
      searches: searchCache.getStats(),
      jobs: jobsCache.getStats(),
      companies: companiesCache.getStats(),
      notifications: notificationsCache.getStats()
    };
  }, []);

  return { clearAllCaches, getCacheStats };
}
