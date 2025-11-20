import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Image, Globe, Users, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/cva';
import { supabase } from '../lib/supabase';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { useTrendingHashtags } from '../hooks/useHashtags';
import { parseContentWithHashtags, extractHashtags } from '../lib/hashtagService';

const MAX_CHARACTERS = 280;

export default function CreatePostPage() {
    const { user } = useAuth();
    const { isDark } = useTheme();
    const navigate = useNavigate();

    const [content, setContent] = useState('');
    const [visibility, setVisibility] = useState<'public' | 'connections' | 'private'>('public');
    const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: trendingHashtags = [] } = useTrendingHashtags(8);

    const characterCount = content.length;
    const isOverLimit = characterCount > MAX_CHARACTERS;
    const canPost = content.trim().length > 0 && !isOverLimit && !isSubmitting;
    const extractedHashtags = extractHashtags(content);
    const contentSegments = parseContentWithHashtags(content);

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
    };

    const handleSubmit = async () => {
        if (!canPost || !user) return;

        setIsSubmitting(true);
        try {
            let mediaUrl: string | undefined;
            let mediaType: 'image' | 'video' | 'text' = 'text';

            // Upload media if present
            if (selectedMedia) {
                console.log('📤 Uploading media...', {
                    fileName: selectedMedia.name,
                    fileType: selectedMedia.type,
                    fileSize: selectedMedia.size
                });

                const fileExt = selectedMedia.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const bucket = selectedMedia.type.startsWith('image/') ? 'post-images' : 'videos';
                const filePath = `${user.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from(bucket)
                    .upload(filePath, selectedMedia);

                if (uploadError) {
                    console.error('❌ Upload error:', uploadError);
                    throw new Error(`Media upload failed: ${uploadError.message}`);
                }

                const { data: { publicUrl } } = supabase.storage
                    .from(bucket)
                    .getPublicUrl(filePath);

                mediaUrl = publicUrl;
                mediaType = selectedMedia.type.startsWith('image/') ? 'image' : 'video';
                console.log('✅ Media uploaded:', { mediaUrl, mediaType });
            }

            // Create post
            const postData: any = {
                user_id: user.id,
                content,
                media_type: mediaType,
                visibility
            };

            // Add media URLs if present
            if (mediaType === 'image' && mediaUrl) {
                postData.image_url = mediaUrl;
            } else if (mediaType === 'video' && mediaUrl) {
                postData.video_url = mediaUrl;
            }

            // NOTE: Don't send tags field until hashtag system is fully set up
            // The hashtag trigger will extract them from content automatically
            // if (extractedHashtags.length > 0) {
            //     postData.tags = extractedHashtags;
            // }

            console.log('📝 Creating post...', postData);

            const { data: insertedPost, error: postError } = await supabase
                .from('posts')
                .insert(postData)
                .select();

            if (postError) {
                console.error('❌ Post creation error:', {
                    error: postError,
                    message: postError.message,
                    details: postError.details,
                    hint: postError.hint,
                    code: postError.code
                });
                throw new Error(`Post creation failed: ${postError.message}`);
            }

            console.log('✅ Post created successfully:', insertedPost);

            // Success! Navigate back to feed
            navigate('/feed');
        } catch (error: any) {
            console.error('❌ Error creating post:', error);
            alert(`Failed to create post: ${error.message || 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={cn(
            'min-h-screen',
            isDark ? 'bg-black text-white' : 'bg-white text-black'
        )}>
            {/* Header */}
            <div className={cn(
                'sticky top-0 z-10 backdrop-blur-xl border-b',
                isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
            )}>
                <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className={cn(
                            'p-2 rounded-full transition-colors',
                            isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-100'
                        )}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <h1 className="text-xl font-bold">Create Post</h1>

                    <Button
                        onClick={handleSubmit}
                        disabled={!canPost}
                        className={cn(
                            'rounded-full px-6 py-2 font-bold transition-all shadow-lg',
                            canPost
                                ? 'bg-[#D3FB52] text-black hover:bg-[#D3FB52]/90 shadow-[#D3FB52]/20'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                        )}
                    >
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-4 py-6">
                <div className="flex gap-4">
                    {/* Avatar */}
                    <Avatar
                        src={(user as any)?.user_metadata?.avatar_url}
                        alt={(user as any)?.user_metadata?.full_name}
                        size="lg"
                        className="flex-shrink-0"
                    />

                    {/* Post Creation Area */}
                    <div className="flex-1 min-w-0">
                        {/* Textarea with hashtag highlighting */}
                        <div className="relative mb-4">
                            {/* Highlighted overlay */}
                            <div
                                className={cn(
                                    'absolute inset-0 px-3 py-2 text-xl leading-relaxed whitespace-pre-wrap pointer-events-none overflow-hidden',
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
                                        className={segment.type === 'hashtag' ? 'text-[#D3FB52] font-medium' : ''}
                                    >
                                        {segment.value}
                                    </span>
                                ))}
                            </div>

                            {/* Actual textarea */}
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What's on your mind?"
                                className={cn(
                                    'relative w-full px-3 py-2 text-xl bg-transparent border-none resize-none',
                                    'focus:outline-none min-h-[200px] placeholder-gray-500',
                                    'caret-info-500 leading-relaxed',
                                    isDark ? 'text-white' : 'text-black'
                                )}
                                style={{
                                    color: 'transparent',
                                    caretColor: isDark ? 'white' : 'black'
                                }}
                                autoFocus
                            />
                        </div>

                        {/* Media Preview */}
                        {mediaPreview && (
                            <div className="mb-4 relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
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
                                    ×
                                </button>
                            </div>
                        )}

                        {/* Trending Hashtags Suggestions */}
                        {content.length === 0 && trendingHashtags.length > 0 && (
                            <div className={cn(
                                'mb-6 p-4 rounded-2xl',
                                isDark ? 'bg-gray-900/50' : 'bg-gray-50'
                            )}>
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="w-4 h-4 text-[#D3FB52]" />
                                    <span className="text-sm font-medium">Trending topics</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {trendingHashtags.map((hashtag) => (
                                        <button
                                            key={hashtag.id}
                                            onClick={() => setContent(prev => prev + `#${hashtag.name} `)}
                                            className={cn(
                                                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors border',
                                                isDark
                                                    ? 'bg-black text-[#D3FB52] hover:bg-gray-900 border-[#D3FB52]'
                                                    : 'bg-white text-black hover:bg-gray-50 border-[#D3FB52]'
                                            )}
                                        >
                                            #{hashtag.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions Bar */}
                        <div className={cn(
                            'flex items-center justify-between p-4 rounded-2xl border',
                            isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'
                        )}>
                            <div className="flex items-center gap-2">
                                {/* Media Upload */}
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleMediaSelect}
                                    className="hidden"
                                    id="media-upload"
                                />
                                <label
                                    htmlFor="media-upload"
                                    className={cn(
                                        'px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors',
                                        isDark
                                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                    )}
                                >
                                    <Image className="w-4 h-4 inline-block mr-2" />
                                    Add Media
                                </label>

                                {/* Visibility Selector */}
                                <select
                                    value={visibility}
                                    onChange={(e) => setVisibility(e.target.value as any)}
                                    className={cn(
                                        'px-4 py-2 rounded-full text-sm font-medium border-none outline-none cursor-pointer',
                                        isDark
                                            ? 'bg-gray-800 text-gray-300'
                                            : 'bg-white text-gray-700 border border-gray-300'
                                    )}
                                >
                                    <option value="public">Public</option>
                                    <option value="connections">Connections</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>

                            {/* Character Counter */}
                            <div className="flex items-center gap-3">
                                {extractedHashtags.length > 0 && (
                                    <span className={cn(
                                        'text-sm font-medium',
                                        isDark ? 'text-[#D3FB52]' : 'text-[#D3FB52]'
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
                                                        : 'text-[#D3FB52]'
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
        </div>
    );
}
