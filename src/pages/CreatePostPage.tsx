import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Users, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/cva';
import { supabase } from '../lib/supabase';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import PostUserSidebar from '../components/PostUserSidebar';
import PostCompanySidebar from '../components/PostCompanySidebar';
import { useTrendingHashtags } from '../hooks/useHashtags';
import { parseContentWithHashtagsAndMentions, extractHashtags, extractMentions } from '../lib/hashtagService';
import { Textarea } from '@openai/apps-sdk-ui/components/Textarea';

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
    const extractedMentions = extractMentions(content);
    const contentSegments = parseContentWithHashtagsAndMentions(content);

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

    // Mention handlers
    const handleMentionUser = (username: string) => {
        setContent(prev => `${prev}@${username} `);
    };

    const handleMentionCompany = (companyId: string) => {
        setContent(prev => `${prev}@${companyId} `);
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

            {/* Main Content with Sidebars */}
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-nowrap gap-4">
                {/* Left Sidebar (User suggestions) */}
                <PostUserSidebar isDark={isDark} postContent={content} currentUserId={user?.id} onMentionUser={handleMentionUser} />

                {/* Center Column */}
                <div className="flex-1 min-w-0">
                    <div className="flex gap-4">
                        {/* Avatar */}
                        <Avatar
                            src={user?.profile?.avatar_url ?? undefined}
                            alt={user?.profile?.full_name || user?.email || 'User'}
                            size="lg"
                            className="shrink-0"
                        />

                        {/* Post Creation Area */}
                        <div className="flex-1 min-w-0">
                            {/* Textarea using OpenAI Apps SDK UI */}
                            <div className="mb-4">
                                <Textarea
                                    autoResize
                                    placeholder="What's on your mind?"
                                    rows={8}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="text-xl"
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
                                        <video src={mediaPreview} controls className="w-full h-auto max-h-96" />
                                    )}
                                    <button
                                        onClick={removeMedia}
                                        className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-2 hover:bg-opacity-80 transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}

                            {/* Media Upload and Actions Bar */}
                            <div className={cn(
                                'flex items-center w-full justify-between p-4 rounded-2xl border mb-4',
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
                                    <label htmlFor="media-upload" className="cursor-pointer">
                                        <div className={cn(
                                            'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors',
                                            isDark
                                                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                                        )}>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Add Media
                                        </div>
                                    </label>

                                    {/* Visibility Selector */}
                                    <select
                                        value={visibility}
                                        onChange={(e) => setVisibility(e.target.value as any)}
                                        className={cn(
                                            'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors',
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
                <PostCompanySidebar isDark={isDark} postContent={content} currentUserId={user?.id} onMentionCompany={handleMentionCompany} />

            </div>

            {/* Right Sidebar (Company suggestions) */}
        </div>

    );
}
