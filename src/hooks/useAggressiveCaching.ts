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
 * Hook for posts caching with fallback mechanisms
 */
export function usePostsCache(limit: number = 20) {
  const cacheKeyRef = useRef<string>(`posts_${limit}`);

  const getCachedPosts = useCallback(() => {
    try {
      return postsCache.get<PostData[]>(cacheKeyRef.current) || [];
    } catch (error) {
      console.warn('Failed to get cached posts, returning empty array:', error);
      return [];
    }
  }, []);

  const setCachedPosts = useCallback((data: PostData[]) => {
    try {
      if (data && Array.isArray(data)) {
        postsCache.set(cacheKeyRef.current, data);
      }
    } catch (error) {
      console.warn('Failed to cache posts:', error);
    }
  }, []);

  const appendCachedPosts = useCallback((newPosts: PostData[]) => {
    try {
      if (!newPosts || !Array.isArray(newPosts)) return;
      
      const existing = postsCache.get<PostData[]>(cacheKeyRef.current) || [];
      const existingIds = new Set(existing.map(post => post.id));
      
      // Filter out duplicates before merging
      const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post.id));
      const merged = [...existing, ...uniqueNewPosts];
      
      postsCache.set(cacheKeyRef.current, merged);
    } catch (error) {
      console.warn('Failed to append cached posts:', error);
    }
  }, []);

  const invalidatePosts = useCallback(() => {
    try {
      postsCache.clear(cacheKeyRef.current);
    } catch (error) {
      console.warn('Failed to invalidate posts cache:', error);
    }
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
    try {
      return searchCache.get<SearchResult>(`search_${query}`);
    } catch (error) {
      console.warn('Failed to get cached search results:', error);
      return null;
    }
  }, []);

  const setCachedSearch = useCallback((query: string, results: SearchResult) => {
    try {
      if (query && query.length >= 2 && results) {
        searchCache.set(`search_${query}`, results);
      }
    } catch (error) {
      console.warn('Failed to cache search results:', error);
    }
  }, []);

  const clearSearchCache = useCallback(() => {
    try {
      searchCache.clearAll();
    } catch (error) {
      console.warn('Failed to clear search cache:', error);
    }
  }, []);

  return { getCachedSearch, setCachedSearch, clearSearchCache };
}

/**
 * Hook for jobs caching with fallback mechanisms
 */
export function useJobsCache() {
  const cacheKey = 'jobs_list';

  const getCachedJobs = useCallback(() => {
    try {
      return jobsCache.get<JobData[]>(cacheKey) || [];
    } catch (error) {
      console.warn('Failed to get cached jobs, returning empty array:', error);
      return [];
    }
  }, []);

  const setCachedJobs = useCallback((data: JobData[]) => {
    try {
      if (data && Array.isArray(data)) {
        jobsCache.set(cacheKey, data);
      }
    } catch (error) {
      console.warn('Failed to cache jobs:', error);
    }
  }, []);

  const getCachedJob = useCallback((jobId: string) => {
    try {
      return jobsCache.get<JobData>(`job_${jobId}`);
    } catch (error) {
      console.warn('Failed to get cached job:', error);
      return null;
    }
  }, []);

  const setCachedJob = useCallback((jobId: string, data: JobData) => {
    try {
      if (data && jobId) {
        jobsCache.set(`job_${jobId}`, data);
      }
    } catch (error) {
      console.warn('Failed to cache job:', error);
    }
  }, []);

  const invalidateJobs = useCallback(() => {
    try {
      jobsCache.clearAll();
    } catch (error) {
      console.warn('Failed to invalidate jobs cache:', error);
    }
  }, []);

  return { getCachedJobs, setCachedJobs, getCachedJob, setCachedJob, invalidateJobs };
}

/**
 * Hook for companies caching with fallback mechanisms
 */
export function useCompaniesCache() {
  const cacheKey = 'companies_list';

  const getCachedCompanies = useCallback(() => {
    try {
      return companiesCache.get<CompanyData[]>(cacheKey) || [];
    } catch (error) {
      console.warn('Failed to get cached companies, returning empty array:', error);
      return [];
    }
  }, []);

  const setCachedCompanies = useCallback((data: CompanyData[]) => {
    try {
      if (data && Array.isArray(data)) {
        companiesCache.set(cacheKey, data);
      }
    } catch (error) {
      console.warn('Failed to cache companies:', error);
    }
  }, []);

  const getCachedCompany = useCallback((companyId: string) => {
    try {
      return companiesCache.get<CompanyData>(`company_${companyId}`);
    } catch (error) {
      console.warn('Failed to get cached company:', error);
      return null;
    }
  }, []);

  const setCachedCompany = useCallback((companyId: string, data: CompanyData) => {
    try {
      if (data && companyId) {
        companiesCache.set(`company_${companyId}`, data);
      }
    } catch (error) {
      console.warn('Failed to cache company:', error);
    }
  }, []);

  const invalidateCompanies = useCallback(() => {
    try {
      companiesCache.clearAll();
    } catch (error) {
      console.warn('Failed to invalidate companies cache:', error);
    }
  }, []);

  return { getCachedCompanies, setCachedCompanies, getCachedCompany, setCachedCompany, invalidateCompanies };
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
