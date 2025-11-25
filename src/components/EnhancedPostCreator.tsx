import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, Image as ImageIcon, Video, Smile, MapPin, Globe, Users2, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/cva';
import Avatar from './ui/Avatar';
import Button from './ui/Button';
import { useHashtagSuggestions } from '../hooks/useHashtags';
import { parseContentWithHashtags, extractHashtags } from '../lib/hashtagService';
import { useTrendingHashtags } from '../hooks/useHashtags';

interface EnhancedPostCreatorProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        content: string;
        media_url?: string;
        media_type?: 'image' | 'video';
        visibility: 'public' | 'connections' | 'private';
        hashtags: string[];
    }) => Promise<void>;
    initialContent?: string;
}

const MAX_CHARACTERS = 280;

export default function EnhancedPostCreator({
    isOpen,
    onClose,
    onSubmit,
    initialContent = ''
}: EnhancedPostCreatorProps) {
    const { user } = useAuth();
    const { isDark } = useTheme();

    // State
    const [content, setContent] = useState(initialContent);
    const [visibility, setVisibility] = useState<'public' | 'connections' | 'private'>('public');
    const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Hashtag autocomplete state
    const [showHashtagSuggestions, setShowHashtagSuggestions] = useState(false);
    const [hashtagQuery, setHashtagQuery] = useState('');
    const [, setCursorPosition] = useState(0);
    const [suggestionIndex, setsuggestionIndex] = useState(0);

    // Refs
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Hooks
    const { data: hashtagSuggestions = [], isLoading: suggestionsLoading } = useHashtagSuggestions(
        hashtagQuery,
        showHashtagSuggestions && hashtagQuery.length > 0
    );
    const { data: trendingHashtags = [] } = useTrendingHashtags(5);

    // Calculate character count
    const characterCount = content.length;
    const isOverLimit = characterCount > MAX_CHARACTERS;
    const canPost = content.trim().length > 0 && !isOverLimit && !isSubmitting;

    // Extract hashtags from content
    const extractedHashtags = useMemo(() => extractHashtags(content), [content]);

    // Parse content for rendering with highlighted hashtags
    const contentSegments = useMemo(() => parseContentWithHashtags(content), [content]);

    // Detect hashtag typing
    useEffect(() => {
        if (!textareaRef.current) return;

        const cursorPos = textareaRef.current.selectionStart;
        const textBeforeCursor = content.slice(0, cursorPos);

        // Check if we're typing a hashtag
        const hashtagMatch = textBeforeCursor.match(/#([A-Za-z0-9_]*)$/);

        if (hashtagMatch) {
            const query = hashtagMatch[1];
            setHashtagQuery(query);
            setShowHashtagSuggestions(true);
            setCursorPosition(cursorPos);
            setsuggestionIndex(0);
        } else {
            setShowHashtagSuggestions(false);
            setHashtagQuery('');
        }
    }, [content]);

    // Handle hashtag suggestion selection
    const selectHashtagSuggestion = (hashtag: string) => {
        if (!textareaRef.current) return;

        const cursorPos = textareaRef.current.selectionStart;
        const textBeforeCursor = content.slice(0, cursorPos);
        const textAfterCursor = content.slice(cursorPos);

        // Find the start of the current hashtag
        const hashtagMatch = textBeforeCursor.match(/#([A-Za-z0-9_]*)$/);
        if (!hashtagMatch) return;

        const hashtagStart = textBeforeCursor.length - hashtagMatch[0].length;
        const newContent =
            content.slice(0, hashtagStart) +
            `#${hashtag} ` +
            textAfterCursor;

        setContent(newContent);
        setShowHashtagSuggestions(false);
        setHashtagQuery('');

        // Set cursor position after the inserted hashtag
        setTimeout(() => {
            if (textareaRef.current) {
                const newCursorPos = hashtagStart + hashtag.length + 2; // +2 for # and space
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
                textareaRef.current.focus();
            }
        }, 0);
    };

    // Keyboard navigation for suggestions
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!showHashtagSuggestions || hashtagSuggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setsuggestionIndex(prev =>
                prev < hashtagSuggestions.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setsuggestionIndex(prev =>
                prev > 0 ? prev - 1 : hashtagSuggestions.length - 1
            );
        } else if (e.key === 'Enter' && hashtagSuggestions[suggestionIndex]) {
            e.preventDefault();
            selectHashtagSuggestion(hashtagSuggestions[suggestionIndex].name);
        } else if (e.key === 'Escape') {
            setShowHashtagSuggestions(false);
        }
    };

    // Handle media selection
    const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedMedia(file);
            const url = URL.createObjectURL(file);
            setMediaPreview(url);
        }
    };

    const removeMedia = () => {
        if (mediaPreview) {
            URL.revokeObjectURL(mediaPreview);
        }
        setMediaPreview(null);
        setSelectedMedia(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (videoInputRef.current) videoInputRef.current.value = '';
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!canPost) return;

        setIsSubmitting(true);
        try {
            let mediaUrl: string | undefined;
            let mediaType: 'image' | 'video' | undefined;

            if (selectedMedia) {
                // Upload media (you'll need to implement this)
                // For now, we'll use the preview URL
                mediaUrl = mediaPreview || undefined;
                mediaType = selectedMedia.type.startsWith('image/') ? 'image' : 'video';
            }

            await onSubmit({
                content,
                media_url: mediaUrl,
                media_type: mediaType,
                visibility,
                hashtags: extractedHashtags
            });

            // Reset form
            setContent('');
            setVisibility('public');
            removeMedia();
            onClose();
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [content]);

    // Visibility icon
    const getVisibilityIcon = () => {
        switch (visibility) {
            case 'public': return <Globe className="w-4 h-4" />;
            case 'connections': return <Users2 className="w-4 h-4" />;
            case 'private': return <Lock className="w-4 h-4" />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-12 sm:pt-20">
            <div
                className={cn(
                    'w-full max-w-2xl mx-4 rounded-2xl shadow-2xl overflow-hidden',
                    'animate-in zoom-in-95 fade-in duration-200',
                    isDark ? 'bg-black border border-gray-800' : 'bg-white border border-gray-200'
                )}
            >
                {/* Header */}
                <div className={cn(
                    'flex items-center justify-between px-4 py-3 border-b',
                    isDark ? 'border-gray-800' : 'border-gray-200'
                )}>
                    <button
                        onClick={onClose}
                        className={cn(
                            'p-2 rounded-full transition-colors',
                            isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-100'
                        )}
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <Button
                        onClick={handleSubmit}
                        disabled={!canPost}
                        className={cn(
                            'rounded-full px-6 py-2 font-bold transition-all',
                            canPost
                                ? 'bg-[#BCE953] text-black hover:bg-[#BCE953]/90'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                        )}
                    >
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </Button>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="flex gap-3">
                        {/* Avatar */}
                        <Avatar
                            src={(user as any)?.user_metadata?.avatar_url}
                            alt={(user as any)?.user_metadata?.full_name}
                            size="lg"
                            className="shrink-0"
                        />

                        {/* Input Area */}
                        <div className="flex-1 min-w-0">
                            {/* Textarea with hashtag highlighting overlay */}
                            <div className="relative">
                                {/* Hidden div for hashtag highlighting */}
                                <div
                                    className={cn(
                                        'absolute inset-0 px-3 py-2 text-xl leading-normal whitespace-pre-wrap pointer-events-none overflow-hidden',
                                        isDark ? 'text-white' : 'text-black'
                                    )}
                                    style={{
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word'
                                    }}
                                >
                                    {contentSegments.map((segment, index) => (
                                        <span
                                            key={index}
                                            className={segment.type === 'hashtag' ? 'text-info-500 font-medium' : ''}
                                        >
                                            {segment.value}
                                        </span>
                                    ))}
                                </div>

                                {/* Actual textarea (transparent text) */}
                                <textarea
                                    ref={textareaRef}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="What's happening?!"
                                    className={cn(
                                        'relative w-full px-3 py-2 text-xl bg-transparent border-none resize-none',
                                        'focus:outline-hidden min-h-[120px] placeholder-gray-500',
                                        'caret-info-500',
                                        isDark ? 'text-white' : 'text-black'
                                    )}
                                    style={{
                                        color: 'transparent',
                                        caretColor: isDark ? 'white' : 'black'
                                    }}
                                />
                            </div>

                            {/* Hashtag Autocomplete Dropdown */}
                            {showHashtagSuggestions && (
                                <div
                                    ref={suggestionsRef}
                                    className={cn(
                                        'mt-2 rounded-xl shadow-lg border overflow-hidden max-h-64 overflow-y-auto',
                                        isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
                                    )}
                                >
                                    {suggestionsLoading ? (
                                        <div className="p-4 text-center text-gray-500">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-info-500 mx-auto"></div>
                                        </div>
                                    ) : hashtagSuggestions.length > 0 ? (
                                        <div>
                                            {hashtagSuggestions.map((hashtag, index) => (
                                                <button
                                                    key={hashtag.id}
                                                    onClick={() => selectHashtagSuggestion(hashtag.name)}
                                                    className={cn(
                                                        'w-full px-4 py-3 flex items-center justify-between transition-colors text-left',
                                                        index === suggestionIndex
                                                            ? isDark ? 'bg-gray-900' : 'bg-gray-100'
                                                            : isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-50'
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-info-500 font-bold text-lg">
                                                            #{hashtag.name}
                                                        </span>
                                                        {hashtag.trending_rank && hashtag.trending_rank <= 10 && (
                                                            <span className="text-xs">🔥</span>
                                                        )}
                                                    </div>
                                                    <span className={cn(
                                                        'text-sm',
                                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                                    )}>
                                                        {hashtag.usage_count >= 1000
                                                            ? `${(hashtag.usage_count / 1000).toFixed(1)}K posts`
                                                            : `${hashtag.usage_count} posts`}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    ) : hashtagQuery.length > 0 ? (
                                        <div className="p-4 text-center text-gray-500">
                                            No hashtags found. Be the first to use #{hashtagQuery}!
                                        </div>
                                    ) : null}
                                </div>
                            )}

                            {/* Trending Hashtags Suggestions */}
                            {!showHashtagSuggestions && content.length === 0 && trendingHashtags.length > 0 && (
                                <div className="mt-3">
                                    <div className={cn(
                                        'text-sm font-medium mb-2 flex items-center gap-2',
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    )}>
                                        <Sparkles className="w-4 h-4" />
                                        Trending now
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {trendingHashtags.map((hashtag) => (
                                            <button
                                                key={hashtag.id}
                                                onClick={() => setContent(prev => prev + `#${hashtag.name} `)}
                                                className={cn(
                                                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                                                    isDark
                                                        ? 'bg-gray-900 text-info-400 hover:bg-gray-800'
                                                        : 'bg-info-50 text-info-600 hover:bg-info-100'
                                                )}
                                            >
                                                #{hashtag.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Media Preview */}
                            {mediaPreview && (
                                <div className="mt-4 relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                    {selectedMedia?.type.startsWith('image/') ? (
                                        <img
                                            src={mediaPreview}
                                            alt="Preview"
                                            className="w-full h-auto max-h-96 object-cover"
                                        />
                                    ) : (
                                        <video
                                            src={mediaPreview}
                                            controls
                                            className="w-full h-auto max-h-96"
                                        />
                                    )}
                                    <button
                                        onClick={removeMedia}
                                        className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-2 hover:bg-opacity-80 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* Character Count */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800/50">
                                <div className="flex items-center gap-2">
                                    {/* Media Buttons */}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 text-info-500 hover:bg-info-500/10 rounded-full transition-colors"
                                        title="Add image"
                                    >
                                        <ImageIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => videoInputRef.current?.click()}
                                        className="p-2 text-info-500 hover:bg-info-500/10 rounded-full transition-colors"
                                        title="Add video"
                                    >
                                        <Video className="w-5 h-5" />
                                    </button>
                                    <button
                                        className="p-2 text-info-500 hover:bg-info-500/10 rounded-full transition-colors"
                                        title="Add emoji"
                                    >
                                        <Smile className="w-5 h-5" />
                                    </button>
                                    <button
                                        className="p-2 text-info-500 hover:bg-info-500/10 rounded-full transition-colors"
                                        title="Add location"
                                    >
                                        <MapPin className="w-5 h-5" />
                                    </button>

                                    {/* Visibility Selector */}
                                    <div className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-700">
                                        {getVisibilityIcon()}
                                        <select
                                            value={visibility}
                                            onChange={(e) => setVisibility(e.target.value as any)}
                                            className="bg-transparent text-sm font-medium border-none outline-hidden cursor-pointer"
                                        >
                                            <option value="public">Public</option>
                                            <option value="connections">Connections</option>
                                            <option value="private">Private</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Character Counter */}
                                <div className="flex items-center gap-3">
                                    {extractedHashtags.length > 0 && (
                                        <span className={cn(
                                            'text-sm font-medium',
                                            isDark ? 'text-info-400' : 'text-info-600'
                                        )}>
                                            {extractedHashtags.length} {extractedHashtags.length === 1 ? 'hashtag' : 'hashtags'}
                                        </span>
                                    )}
                                    <div className="relative w-8 h-8">
                                        <svg className="transform -rotate-90 w-8 h-8">
                                            <circle
                                                cx="16"
                                                cy="16"
                                                r="14"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                fill="none"
                                                className={isDark ? 'text-gray-700' : 'text-gray-300'}
                                            />
                                            <circle
                                                cx="16"
                                                cy="16"
                                                r="14"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                fill="none"
                                                strokeDasharray={`${2 * Math.PI * 14}`}
                                                strokeDashoffset={`${2 * Math.PI * 14 * (1 - characterCount / MAX_CHARACTERS)}`}
                                                className={cn(
                                                    'transition-all',
                                                    isOverLimit
                                                        ? 'text-red-500'
                                                        : characterCount > MAX_CHARACTERS * 0.9
                                                            ? 'text-yellow-500'
                                                            : 'text-info-500'
                                                )}
                                            />
                                        </svg>
                                        {characterCount > MAX_CHARACTERS * 0.8 && (
                                            <span className={cn(
                                                'absolute inset-0 flex items-center justify-center text-xs font-bold',
                                                isOverLimit ? 'text-red-500' : 'text-gray-500'
                                            )}>
                                                {MAX_CHARACTERS - characterCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hidden File Inputs */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleMediaSelect}
                />
                <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleMediaSelect}
                />
            </div>
        </div>
    );
}
