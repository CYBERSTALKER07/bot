import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    // Performance optimizations
    global: {
      headers: {
        'x-client-info': 'supabase-js-web'
      }
    },
    db: {
      schema: 'public'
    },
    // Realtime optimizations
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

// Query cache helper
const queryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedQuery = <T>(key: string): T | null => {
  const cached = queryCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  return null;
};

export const setCachedQuery = (key: string, data: any) => {
  queryCache.set(key, { data, timestamp: Date.now() });
};

export const clearQueryCache = (key?: string) => {
  if (key) {
    queryCache.delete(key);
  } else {
    queryCache.clear();
  }
};