import { QueryClient } from '@tanstack/react-query';

/**
 * Aggressive performance configuration for React Query
 * Maximizes caching to reduce API calls and improve perceived performance
 */

export const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Aggressive stale time configuration
        staleTime: 5 * 60 * 1000, // 5 minutes default
        gcTime: 60 * 60 * 1000, // 1 hour garbage collection (previously cacheTime)
        
        // Network optimization
        retry: 2, // Retry failed requests twice
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Performance optimization
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
        refetchOnReconnect: true, // Refetch when connection restored
        refetchOnMount: false, // Only refetch if data is stale
        
        // UX improvements
        throwOnError: false, // Don't throw errors, let components handle them
      },
      mutations: {
        retry: 1,
        retryDelay: 1000,
      },
    },
  });
};

/**
 * Query configuration templates for different data types
 */
export const queryConfigs = {
  // High-frequency, volatile data
  realtime: {
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  },
  
  // Medium-frequency data
  standard: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  },
  
  // Low-frequency, stable data
  stable: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  },
  
  // Rarely changes data
  static: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  },
};

/**
 * Query key factory for consistent, type-safe query keys
 */
export const queryKeys = {
  all: () => ['app'] as const,
  
  // Profiles
  profiles: () => [...queryKeys.all(), 'profiles'] as const,
  profile: (userId: string) => [...queryKeys.profiles(), userId] as const,
  profileByUsername: (username: string) => [...queryKeys.profiles(), 'username', username] as const,
  
  // Posts
  posts: () => [...queryKeys.all(), 'posts'] as const,
  postsList: (limit: number, offset: number) => [...queryKeys.posts(), 'list', limit, offset] as const,
  post: (id: string) => [...queryKeys.posts(), id] as const,
  postsByUser: (userId: string) => [...queryKeys.posts(), 'user', userId] as const,
  
  // Following/Followers
  follows: () => [...queryKeys.all(), 'follows'] as const,
  followStatus: (followerId: string, followingId: string) => 
    [...queryKeys.follows(), followerId, followingId] as const,
  followers: (userId: string) => [...queryKeys.follows(), 'followers', userId] as const,
  following: (userId: string) => [...queryKeys.follows(), 'following', userId] as const,
  recommendedUsers: (userId: string) => [...queryKeys.follows(), 'recommended', userId] as const,
  
  // Jobs
  jobs: () => [...queryKeys.all(), 'jobs'] as const,
  jobsList: (limit: number) => [...queryKeys.jobs(), 'list', limit] as const,
  job: (id: string) => [...queryKeys.jobs(), id] as const,
  jobsByCompany: (companyId: string) => [...queryKeys.jobs(), 'company', companyId] as const,
  
  // Companies
  companies: () => [...queryKeys.all(), 'companies'] as const,
  companiesList: () => [...queryKeys.companies(), 'list'] as const,
  company: (id: string) => [...queryKeys.companies(), id] as const,
  
  // Search
  search: () => [...queryKeys.all(), 'search'] as const,
  searchQuery: (query: string) => [...queryKeys.search(), query] as const,
  
  // Notifications
  notifications: () => [...queryKeys.all(), 'notifications'] as const,
  notificationsList: (userId: string) => [...queryKeys.notifications(), userId] as const,
  
  // Applications
  applications: () => [...queryKeys.all(), 'applications'] as const,
  applicationsByUser: (userId: string) => [...queryKeys.applications(), 'user', userId] as const,
  applicationsByJob: (jobId: string) => [...queryKeys.applications(), 'job', jobId] as const,
};
