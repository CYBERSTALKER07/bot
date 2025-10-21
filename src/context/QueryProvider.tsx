import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Configure React Query with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes - increased from 5
      gcTime: 30 * 60 * 1000, // 30 minutes - increased from 10 (formerly cacheTime)
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnReconnect: 'always', // Refetch when reconnecting after offline
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

// Manual implementation of query persistence to localStorage
const QUERY_CACHE_KEY = 'aut-handshake-query-cache';

// Persist query cache to localStorage periodically
queryClient.getQueryCache().subscribe(() => {
  try {
    const cache = queryClient.getQueryCache().getAll();
    const cacheData = cache.map(query => ({
      queryKey: query.queryKey,
      state: query.state?.data
    }));
    localStorage.setItem(QUERY_CACHE_KEY, JSON.stringify(cacheData));
  } catch (e) {
    console.warn('Failed to persist query cache:', e);
  }
});

// Restore query cache from localStorage on app load
try {
  const cachedData = localStorage.getItem(QUERY_CACHE_KEY);
  if (cachedData) {
    const parsedCache = JSON.parse(cachedData) as Array<{ queryKey: unknown[]; state: unknown }>;
    parsedCache.forEach((item) => {
      if (item.state) {
        queryClient.setQueryData(item.queryKey, item.state);
      }
    });
  }
} catch (e) {
  console.warn('Failed to restore query cache:', e);
}

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}