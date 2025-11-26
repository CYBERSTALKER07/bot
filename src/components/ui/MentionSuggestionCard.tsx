import React from 'react';
import { Button } from '@openai/apps-sdk-ui/components/Button';
import { cn } from '../../lib/cva';
import { Skeleton } from './Skeleton';

interface MentionSuggestionCardProps {
    type: 'user' | 'company';
    id: string;
    name: string;
    subtitle?: string;
    avatarUrl?: string;
    bio?: string;
    verified?: boolean;
    connectionDegree?: 1 | 2 | 3;
    engagementScore?: number;
    isLoading?: boolean;
    isDark: boolean;
    onMention: (identifier: string) => void;
    onClick?: () => void;
}

export default function MentionSuggestionCard({
    type,
    id,
    name,
    subtitle,
    avatarUrl,
    bio,
    verified,
    connectionDegree,
    engagementScore,
    isLoading = false,
    isDark,
    onMention,
    onClick
}: MentionSuggestionCardProps) {
    if (isLoading) {
        return (
            <div className={cn(
                'p-3 rounded-xl border',
                isDark ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
            )}>
                <div className="flex items-center gap-3">
                    <Skeleton
                        variant={type === 'user' ? 'circular' : 'rectangular'}
                        width={48}
                        height={48}
                        className={type === 'company' ? 'rounded-lg' : ''}
                    />
                    <div className="flex-1 space-y-2">
                        <Skeleton width="70%" height={16} />
                        <Skeleton width="50%" height={12} />
                    </div>
                    <Skeleton width={80} height={32} className="rounded-full" />
                </div>
            </div>
        );
    }

    const handleMentionClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onMention(type === 'user' ? subtitle?.replace('@', '') || name : name);
    };

    return (
        <div
            className={cn(
                'group p-3 rounded-[24px] border-none cursor-pointer transition-all duration-200',
                'hover:shadow-2xl shadow-lg hover:-translate-y-0.5',
                isDark
                    ? 'bg-gray-900/30 border-gray-800 hover:bg-gray-900/50 hover:border-gray-700'
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            )}
            onClick={onClick}
        >
            <div className="flex items-center gap-3">
                {/* Avatar/Logo */}
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={name}
                        className={cn(
                            'w-12 h-12 object-cover shrink-0',
                            type === 'user' ? 'rounded-full' : 'rounded-lg'
                        )}
                    />
                ) : (
                    <div
                        className={cn(
                            'w-12 h-12 flex items-center justify-center shrink-0 font-bold text-white',
                            type === 'user' ? 'rounded-full bg-gray-200' : 'rounded - lg bg - gradient - to - br from - blue - 500 to - cyan - 500'
                        )}
                    >
                        {name.charAt(0).toUpperCase()}
                    </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <h4 className={cn(
                            'font-semibold text-sm truncate',
                            isDark ? 'text-white' : 'text-gray-900'
                        )}>
                            {name}
                        </h4>
                        {verified && (
                            <span className="text-info-500 shrink-0">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                                </svg>
                            </span>
                        )}

                    </div>
                    {subtitle && (
                        <p className={cn(
                            'text-xs truncate',
                            isDark ? 'text-gray-400' : 'text-gray-600'
                        )}>
                            {subtitle}
                        </p>
                    )}
                    {bio && (
                        <p className={cn(
                            'text-xs line-clamp-1 mt-0.5',
                            isDark ? 'text-gray-500' : 'text-gray-500'
                        )}>
                            {bio}
                        </p>
                    )}
                </div>

                {/* Mention Button */}
                <Button
                    size="sm"
                    color="primary"
                    variant="soft"
                    onClick={handleMentionClick}
                    className="shrink-0 ml-2"
                >
                    Mention
                </Button>
            </div>


        </div>
    );
}
