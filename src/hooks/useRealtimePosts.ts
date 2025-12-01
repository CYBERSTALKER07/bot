import { useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface Post {
    id: string;
    content: string;
    user_id: string;
    created_at: string;
    likes_count: number;
    comments_count: number;
    shares_count: number;
    visibility: 'public' | 'followers' | 'private';
    [key: string]: any;
}

interface UseRealtimePostsOptions {
    onNewPost?: (post: Post) => void;
    onUpdatePost?: (post: Post) => void;
    onDeletePost?: (postId: string) => void;
    enabled?: boolean;
}

/**
 * Real-time hook for posts using Supabase Realtime
 * Provides instant updates when posts are created, updated, or deleted
 * 
 * @example
 * useRealtimePosts({
 *   onNewPost: (post) => setPosts(prev => [post, ...prev]),
 *   onUpdatePost: (post) => setPosts(prev => prev.map(p => p.id === post.id ? post : p)),
 *   onDeletePost: (id) => setPosts(prev => prev.filter(p => p.id !== id))
 * });
 */
export function useRealtimePosts({
    onNewPost,
    onUpdatePost,
    onDeletePost,
    enabled = true
}: UseRealtimePostsOptions) {
    const handleInsert = useCallback((payload: any) => {
        console.log('🆕 New post received:', payload.new);
        onNewPost?.(payload.new);
    }, [onNewPost]);

    const handleUpdate = useCallback((payload: any) => {
        console.log('✏️ Post updated:', payload.new);
        onUpdatePost?.(payload.new);
    }, [onUpdatePost]);

    const handleDelete = useCallback((payload: any) => {
        console.log('🗑️ Post deleted:', payload.old.id);
        onDeletePost?.(payload.old.id);
    }, [onDeletePost]);

    useEffect(() => {
        if (!enabled) return;

        let channel: RealtimeChannel;

        const setupRealtimeSubscription = async () => {
            channel = supabase
                .channel('posts-realtime-channel')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'posts',
                        filter: 'visibility=eq.public'
                    },
                    handleInsert
                )
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'posts'
                    },
                    handleUpdate
                )
                .on(
                    'postgres_changes',
                    {
                        event: 'DELETE',
                        schema: 'public',
                        table: 'posts'
                    },
                    handleDelete
                )
                .subscribe((status) => {
                    if (status === 'SUBSCRIBED') {
                        console.log('✅ Real-time posts subscription active');
                    } else if (status === 'CHANNEL_ERROR') {
                        console.error('❌ Real-time subscription error');
                    }
                });
        };

        setupRealtimeSubscription();

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
                console.log('🔌 Real-time posts subscription closed');
            }
        };
    }, [enabled, handleInsert, handleUpdate, handleDelete]);
}

/**
 * Real-time hook for profile views
 * Provides instant updates when someone views your profile
 */
export function useRealtimeProfileViews(
    profileId: string | undefined,
    onNewView: (view: any) => void,
    enabled: boolean = true
) {
    useEffect(() => {
        if (!enabled || !profileId) return;

        const channel = supabase
            .channel(`profile-views-${profileId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'profile_views',
                    filter: `profile_id=eq.${profileId}`
                },
                (payload) => {
                    console.log('👀 New profile view:', payload.new);
                    onNewView(payload.new);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [profileId, onNewView, enabled]);
}

/**
 * Real-time hook for notifications
 * Provides instant notification updates
 */
export function useRealtimeNotifications(
    userId: string | undefined,
    onNewNotification: (notification: any) => void,
    enabled: boolean = true
) {
    useEffect(() => {
        if (!enabled || !userId) return;

        const channel = supabase
            .channel(`notifications-${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    console.log('🔔 New notification:', payload.new);
                    onNewNotification(payload.new);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, onNewNotification, enabled]);
}
