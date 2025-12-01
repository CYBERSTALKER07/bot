/**
 * Request Deduplication Utility
 * Prevents duplicate simultaneous API requests
 */

const pendingRequests = new Map<string, Promise<any>>();
const requestTimestamps = new Map<string, number>();

interface DedupOptions {
    ttl?: number; // Time-to-live for deduplication window (ms)
    forceRefresh?: boolean; // Force new request even if pending
}

/**
 * Deduplicate requests with the same key
 * If a request with the same key is already pending, return that promise
 * 
 * @param key - Unique identifier for the request
 * @param fetcher - Function that performs the actual request
 * @param options - Deduplication options
 * @returns Promise with the request result
 * 
 * @example
 * const data = await dedupedRequest('posts-feed', () =>
 *   supabase.from('posts').select('*')
 * );
 */
export async function dedupedRequest<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: DedupOptions = {}
): Promise<T> {
    const { ttl = 1000, forceRefresh = false } = options;
    const now = Date.now();
    const lastRequest = requestTimestamps.get(key);

    // Force refresh - clear existing request
    if (forceRefresh) {
        pendingRequests.delete(key);
        requestTimestamps.delete(key);
    }

    // If same request within TTL and pending, return existing promise
    if (
        !forceRefresh &&
        lastRequest &&
        now - lastRequest < ttl &&
        pendingRequests.has(key)
    ) {
        console.log(`🔄 Deduped request: ${key} (saved API call)`);
        return pendingRequests.get(key)!;
    }

    // Create new request
    console.log(`🌐 New request: ${key}`);
    const promise = fetcher()
        .finally(() => {
            // Clean up after request completes
            setTimeout(() => {
                pendingRequests.delete(key);
            }, ttl);
        });

    pendingRequests.set(key, promise);
    requestTimestamps.set(key, now);

    return promise;
}

/**
 * Wrapper for Supabase queries with deduplication
 * 
 * @example
 * const { data } = await dedupedQuery('user-profile', () =>
 *   supabase.from('profiles').select('*').eq('id', userId).single()
 * );
 */
export function dedupedQuery<T>(
    queryKey: string,
    queryFn: () => Promise<T>,
    options?: DedupOptions
): Promise<T> {
    return dedupedRequest(queryKey, queryFn, options);
}

/**
 * Clear all pending requests
 * Useful for logout or navigation
 */
export function clearAllPendingRequests(): void {
    const count = pendingRequests.size;
    pendingRequests.clear();
    requestTimestamps.clear();
    console.log(`🧹 Cleared ${count} pending requests`);
}

/**
 * Clear specific request by key
 */
export function clearRequest(key: string): void {
    if (pendingRequests.has(key)) {
        pendingRequests.delete(key);
        requestTimestamps.delete(key);
        console.log(`🧹 Cleared request: ${key}`);
    }
}

/**
 * Get statistics about pending requests
 */
export function getRequestStats() {
    return {
        pendingCount: pendingRequests.size,
        keys: Array.from(pendingRequests.keys()),
        oldestRequest: Math.min(
            ...Array.from(requestTimestamps.values()),
            Date.now()
        )
    };
}

/**
 * React hook for deduped requests
 * 
 * @example
 * const { fetch, isPending } = useDedupedRequest();
 * 
 * const loadData = () => {
 *   fetch('my-data', () => supabase.from('table').select('*'));
 * };
 */
export function useDedupedRequest() {
    const fetch = async <T,>(
        key: string,
        fetcher: () => Promise<T>,
        options?: DedupOptions
    ): Promise<T> => {
        return dedupedRequest(key, fetcher, options);
    };

    const isPending = (key: string): boolean => {
        return pendingRequests.has(key);
    };

    const clear = (key?: string) => {
        if (key) {
            clearRequest(key);
        } else {
            clearAllPendingRequests();
        }
    };

    return {
        fetch,
        isPending,
        clear,
        stats: getRequestStats()
    };
}
