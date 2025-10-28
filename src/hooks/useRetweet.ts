import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

interface RetweetData {
  postId: string;
  userId: string;
  isQuoteRetweet?: boolean;
  quoteContent?: string;
}

/**
 * Hook to create a retweet
 */
export const useCreateRetweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RetweetData) => {
      try {
        // Check if already retweeted - use maybeSingle() instead of single()
        const { data: existing, error: checkError } = await supabase
          .from('post_retweets')
          .select('id')
          .eq('post_id', data.postId)
          .eq('user_id', data.userId)
          .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('Error checking retweet status:', checkError);
          throw checkError;
        }

        if (existing) {
          throw new Error('Already retweeted this post');
        }

        // Create retweet
        const { data: retweet, error } = await supabase
          .from('post_retweets')
          .insert({
            post_id: data.postId,
            user_id: data.userId,
            is_quote_retweet: data.isQuoteRetweet || false,
            quote_content: data.quoteContent || null,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating retweet:', error);
          console.error('Error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          throw error;
        }

        console.log('✅ Retweet created successfully:', retweet);
        return retweet;
      } catch (error) {
        console.error('Retweet mutation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['retweets'] });
    },
    onError: (error: Error) => {
      console.error('Retweet failed:', error.message);
    }
  });
};

/**
 * Hook to remove a retweet
 */
export const useRemoveRetweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: string; userId: string }) => {
      try {
        const { error } = await supabase
          .from('post_retweets')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (error) {
          console.error('Error removing retweet:', error);
          throw error;
        }

        console.log('✅ Retweet removed successfully');
      } catch (error) {
        console.error('Remove retweet error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['retweets'] });
    },
    onError: (error: Error) => {
      console.error('Remove retweet failed:', error.message);
    }
  });
};

/**
 * Hook to check if a user has retweeted a post
 */
export const useRetweetStatus = (postId: string, userId: string | undefined) => {
  return useQuery({
    queryKey: ['retweet-status', postId, userId],
    queryFn: async () => {
      if (!userId) return false;

      try {
        const { data, error } = await supabase
          .from('post_retweets')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', userId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking retweet status:', error);
          throw error;
        }

        return !!data;
      } catch (error) {
        console.error('Retweet status check error:', error);
        return false;
      }
    },
    enabled: !!userId,
  });
};

/**
 * Hook to get all retweets for a post
 */
export const usePostRetweets = (postId: string) => {
  return useQuery({
    queryKey: ['post-retweets', postId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('post_retweets')
          .select(`
            *,
            user:user_id(id, full_name, username, avatar_url)
          `)
          .eq('post_id', postId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching post retweets:', error);
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Post retweets fetch error:', error);
        return [];
      }
    },
  });
};

/**
 * Hook to get quote retweets for a post
 */
export const useQuoteRetweets = (postId: string) => {
  return useQuery({
    queryKey: ['quote-retweets', postId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('post_retweets')
          .select(`
            *,
            user:user_id(id, full_name, username, avatar_url)
          `)
          .eq('post_id', postId)
          .eq('is_quote_retweet', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching quote retweets:', error);
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Quote retweets fetch error:', error);
        return [];
      }
    },
  });
};

/**
 * Hook to get all posts retweeted by a user
 */
export const useUserRetweets = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user-retweets', userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        const { data, error } = await supabase
          .from('post_retweets')
          .select('post_id')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching user retweets:', error);
          throw error;
        }

        return data?.map(r => r.post_id) || [];
      } catch (error) {
        console.error('User retweets fetch error:', error);
        return [];
      }
    },
    enabled: !!userId,
  });
};
