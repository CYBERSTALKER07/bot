import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Briefcase, User, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/cva';

interface ProfileViewer {
    viewer_id: string;
    viewer_username: string;
    viewer_full_name: string;
    viewer_avatar_url: string | null;
    viewer_role: 'student' | 'employer' | 'admin';
    viewer_company_name: string | null;
    viewer_verified: boolean;
    viewed_at: string;
    view_count: number;
}

interface ProfileViewersProps {
    limit?: number;
    showViewAll?: boolean;
    className?: string;
}

export default function ProfileViewers({
    limit = 5,
    showViewAll = true,
    className = ''
}: ProfileViewersProps) {
    const { user } = useAuth();
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const [viewers, setViewers] = useState<ProfileViewer[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalViewers, setTotalViewers] = useState(0);

    const fetchProfileViewers = useCallback(async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            const { data, error } = await supabase.rpc('get_profile_viewers', {
                p_limit: limit,
                p_offset: 0
            });

            if (error) {
                console.error('Error fetching profile viewers:', error);
                return;
            }

            setViewers(data || []);

            // Get total count for "View All" link
            if (data && data.length > 0) {
                const { count } = await supabase
                    .from('profile_views')
                    .select('*', { count: 'exact', head: true })
                    .eq('profile_id', user.id)
                    .neq('viewer_id', user.id);

                setTotalViewers(count || 0);
            }
        } catch (error) {
            console.error('Error in fetchProfileViewers:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.id, limit]);

    useEffect(() => {
        fetchProfileViewers();
    }, [fetchProfileViewers]);

    // Periodic auto-refresh every 60 seconds
    useEffect(() => {
        const refreshInterval = setInterval(() => {
            fetchProfileViewers();
        }, 60000); // 60 seconds

        // Cleanup interval on unmount
        return () => clearInterval(refreshInterval);
    }, [fetchProfileViewers]);

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const handleViewerClick = (viewerId: string) => {
        navigate(`/profile/${viewerId}`);
    };

    const handleViewAll = () => {
        // TODO: Navigate to full profile viewers page
        console.log('View all profile viewers');
    };

    if (loading) {
        return (
            <div className={cn(
                'rounded-2xl p-6 backdrop-blur-xl border',
                isDark
                    ? 'bg-gray-900/50 border-gray-800'
                    : 'bg-white/80 border-gray-200',
                className
            )}>
                <div className="flex items-center gap-2 mb-4">
                    <Eye className={cn('w-5 h-5', isDark ? 'text-blue-400' : 'text-blue-600')} />
                    <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                        Who Viewed Your Profile
                    </h3>
                </div>
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                            <div className={cn(
                                'w-12 h-12 rounded-full',
                                isDark ? 'bg-[#2C2C2E]' : 'bg-gray-200'
                            )} />
                            <div className="flex-1 space-y-2">
                                <div className={cn(
                                    'h-4 rounded w-3/4',
                                    isDark ? 'bg-[#2C2C2E]' : 'bg-gray-200'
                                )} />
                                <div className={cn(
                                    'h-3 rounded w-1/2',
                                    isDark ? 'bg-[#2C2C2E]' : 'bg-gray-200'
                                )} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (viewers.length === 0) {
        return (
            <div className={cn(
                'rounded-2xl p-6 backdrop-blur-xl border',
                isDark
                    ? 'bg-gray-900/50 border-gray-800'
                    : 'bg-white/80 border-gray-200',
                className
            )}>
                <div className="flex items-center gap-2 mb-4">
                    <Eye className={cn('w-5 h-5', isDark ? 'text-blue-400' : 'text-blue-600')} />
                    <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                        Who Viewed Your Profile
                    </h3>
                </div>
                <div className="text-center py-8">
                    <div className={cn(
                        'w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center',
                        isDark ? 'bg-gray-800' : 'bg-gray-100'
                    )}>
                        <Eye className={cn('w-8 h-8', isDark ? 'text-gray-600' : 'text-gray-400')} />
                    </div>
                    <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                        No one has viewed your profile yet
                    </p>
                    <p className={cn('text-xs mt-1', isDark ? 'text-gray-500' : 'text-gray-500')}>
                        Share your profile to get more visibility
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn(
            'rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300',
            isDark
                ? 'bg-gray-900/50 border-gray-800 hover:bg-gray-900/60'
                : 'bg-white/80 border-gray-200 hover:bg-white/90',
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Eye className={cn('w-5 h-5', isDark ? 'text-blue-400' : 'text-blue-600')} />
                    <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                        Who Viewed Your Profile
                    </h3>
                </div>
                {totalViewers > limit && (
                    <span className={cn(
                        'text-xs px-2 py-1 rounded-full',
                        isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                    )}>
                        {totalViewers}
                    </span>
                )}
            </div>

            {/* Viewers List */}
            <div className="space-y-3">
                {viewers.map((viewer) => (
                    <div
                        key={viewer.viewer_id}
                        onClick={() => handleViewerClick(viewer.viewer_id)}
                        className={cn(
                            'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200',
                            isDark
                                ? 'hover:bg-gray-800/50'
                                : 'hover:bg-gray-50'
                        )}
                    >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            {viewer.viewer_avatar_url ? (
                                <img
                                    src={viewer.viewer_avatar_url}
                                    alt={viewer.viewer_full_name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className={cn(
                                    'w-12 h-12 rounded-full flex items-center justify-center',
                                    isDark ? 'bg-gray-800' : 'bg-gray-200'
                                )}>
                                    <User className={cn('w-6 h-6', isDark ? 'text-gray-600' : 'text-gray-400')} />
                                </div>
                            )}

                            {/* Role Badge */}
                            <div className={cn(
                                'absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2',
                                isDark ? 'border-gray-900' : 'border-white',
                                viewer.viewer_role === 'employer'
                                    ? 'bg-blue-500'
                                    : viewer.viewer_role === 'admin'
                                        ? 'bg-purple-500'
                                        : 'bg-green-500'
                            )}>
                                {viewer.viewer_role === 'employer' ? (
                                    <Briefcase className="w-3 h-3 text-white" />
                                ) : (
                                    <User className="w-3 h-3 text-white" />
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                                <p className={cn(
                                    'font-medium text-sm truncate',
                                    isDark ? 'text-white' : 'text-gray-900'
                                )}>
                                    {viewer.viewer_full_name || viewer.viewer_username}
                                </p>
                                {viewer.viewer_verified && (
                                    <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                {viewer.viewer_company_name && (
                                    <p className={cn(
                                        'text-xs truncate',
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    )}>
                                        {viewer.viewer_company_name}
                                    </p>
                                )}
                                {!viewer.viewer_company_name && (
                                    <p className={cn(
                                        'text-xs capitalize',
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    )}>
                                        {viewer.viewer_role}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Time & View Count */}
                        <div className="flex flex-col items-end gap-1">
                            <span className={cn(
                                'text-xs',
                                isDark ? 'text-gray-500' : 'text-gray-500'
                            )}>
                                {getTimeAgo(viewer.viewed_at)}
                            </span>
                            {viewer.view_count > 1 && (
                                <div className="flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 text-blue-500" />
                                    <span className={cn(
                                        'text-xs font-medium',
                                        isDark ? 'text-blue-400' : 'text-blue-600'
                                    )}>
                                        {viewer.view_count}x
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* View All Link */}
            {showViewAll && totalViewers > limit && (
                <button
                    onClick={handleViewAll}
                    className={cn(
                        'w-full mt-4 py-2 px-4 rounded-lg text-sm font-medium transition-colors',
                        isDark
                            ? 'bg-gray-800 hover:bg-gray-700 text-blue-400'
                            : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
                    )}
                >
                    View all {totalViewers} viewers
                </button>
            )}
        </div>
    );
}
