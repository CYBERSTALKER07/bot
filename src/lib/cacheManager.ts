/**
 * Comprehensive caching utility with multiple storage strategies
 * Supports: localStorage, sessionStorage, memory cache, and IndexedDB
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl?: number; // Time to live in milliseconds
}

interface CacheConfig {
  storage?: 'localStorage' | 'sessionStorage' | 'memory' | 'indexeddb';
  ttl?: number; // Default TTL in milliseconds
  prefix?: string;
}

class CacheManager {
  private memoryCache = new Map<string, CacheEntry<unknown>>();
  private config: CacheConfig;

  constructor(config: CacheConfig = {}) {
    this.config = {
      storage: 'localStorage',
      ttl: 24 * 60 * 60 * 1000, // 24 hours default
      prefix: 'app_cache_',
      ...config
    };
  }

  /**
   * Get item from cache with automatic expiration handling
   */
  get<T>(key: string): T | null {
    const fullKey = `${this.config.prefix}${key}`;

    // Check memory cache first (fastest)
    if (this.memoryCache.has(fullKey)) {
      const entry = this.memoryCache.get(fullKey)!;
      if (!this.isExpired(entry)) {
        return entry.data as T;
      } else {
        this.memoryCache.delete(fullKey);
      }
    }

    // Check storage based on config
    if (this.config.storage === 'localStorage' || this.config.storage === 'sessionStorage') {
      const storage = this.config.storage === 'localStorage' ? localStorage : sessionStorage;
      try {
        const item = storage.getItem(fullKey);
        if (item) {
          const entry: CacheEntry<T> = JSON.parse(item);
          if (!this.isExpired(entry)) {
            // Promote to memory cache for faster future access
            this.memoryCache.set(fullKey, entry);
            return entry.data;
          } else {
            storage.removeItem(fullKey);
          }
        }
      } catch (error) {
        console.error(`Error reading from ${this.config.storage}:`, error);
      }
    }

    return null;
  }

  /**
   * Set item in cache with TTL support
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const fullKey = `${this.config.prefix}${key}`;
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.ttl
    };

    // Always store in memory cache
    this.memoryCache.set(fullKey, entry);

    // Store in persistent storage if configured
    if (this.config.storage === 'localStorage' || this.config.storage === 'sessionStorage') {
      const storage = this.config.storage === 'localStorage' ? localStorage : sessionStorage;
      try {
        storage.setItem(fullKey, JSON.stringify(entry));
      } catch (error) {
        console.error(`Error writing to ${this.config.storage}:`, error);
      }
    }
  }

  /**
   * Check if cache entry has expired
   */
  private isExpired(entry: CacheEntry<unknown>): boolean {
    if (!entry.ttl) return false;
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Clear specific key from cache
   */
  clear(key: string): void {
    const fullKey = `${this.config.prefix}${key}`;
    this.memoryCache.delete(fullKey);

    if (this.config.storage === 'localStorage' || this.config.storage === 'sessionStorage') {
      const storage = this.config.storage === 'localStorage' ? localStorage : sessionStorage;
      try {
        storage.removeItem(fullKey);
      } catch (error) {
        console.error(`Error clearing ${this.config.storage}:`, error);
      }
    }
  }

  /**
   * Clear all cache entries with the prefix
   */
  clearAll(): void {
    // Clear memory cache
    this.memoryCache.clear();

    // Clear persistent storage
    if (this.config.storage === 'localStorage' || this.config.storage === 'sessionStorage') {
      const storage = this.config.storage === 'localStorage' ? localStorage : sessionStorage;
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key && key.startsWith(this.config.prefix!)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => storage.removeItem(key));
      } catch (error) {
        console.error(`Error clearing ${this.config.storage}:`, error);
      }
    }
  }

  /**
   * Get cache stats for debugging
   */
  getStats(): { memoryCacheSize: number; storageSize: number } {
    let storageSize = 0;
    const storage = this.config.storage === 'localStorage' ? localStorage : sessionStorage;
    
    try {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.startsWith(this.config.prefix!)) {
          const item = storage.getItem(key);
          if (item) {
            storageSize += item.length;
          }
        }
      }
    } catch (error) {
      console.error('Error calculating storage size:', error);
    }

    return {
      memoryCacheSize: this.memoryCache.size,
      storageSize
    };
  }
}

// Create singleton instances for different cache types
export const profileCache = new CacheManager({
  storage: 'localStorage',
  ttl: 60 * 60 * 1000, // 1 hour
  prefix: 'profile_'
});

export const postsCache = new CacheManager({
  storage: 'localStorage',
  ttl: 10 * 60 * 1000, // 10 minutes
  prefix: 'posts_'
});

export const followCache = new CacheManager({
  storage: 'localStorage',
  ttl: 30 * 60 * 1000, // 30 minutes
  prefix: 'follow_'
});

export const searchCache = new CacheManager({
  storage: 'sessionStorage', // Session-only for search
  ttl: 15 * 60 * 1000, // 15 minutes
  prefix: 'search_'
});

export const jobsCache = new CacheManager({
  storage: 'localStorage',
  ttl: 30 * 60 * 1000, // 30 minutes
  prefix: 'jobs_'
});

export const companiesCache = new CacheManager({
  storage: 'localStorage',
  ttl: 60 * 60 * 1000, // 1 hour - companies change slowly
  prefix: 'companies_'
});

export const notificationsCache = new CacheManager({
  storage: 'sessionStorage',
  ttl: 5 * 60 * 1000, // 5 minutes - notifications should be fresh
  prefix: 'notifications_'
});

export default CacheManager;
