import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import PageLayout from '../components/ui/PageLayout';
import { cn } from '../lib/cva';
import { supabase } from '../lib/supabase';
import { useBreakpoint } from '@openai/apps-sdk-ui/hooks/useBreakpoints';

interface Answer {
    id: string;
    post_id: string;
    user_id: string;
    parent_id?: string;
    content: string;
    like_count: number;
    reply_count: number;
    has_liked: boolean;
    created_at: string;
    author: {
        id: string;
        name: string;
        username: string;
        avatar_url?: string;
        verified?: boolean;
    };
    replies?: Answer[];
}

interface Post {
    id: string;
    user_id: string;
    content: string;
    image_url?: string;
    video_url?: string;
    likes_count: number;
    comments_count: number;
    shares_count: number;
    created_at: string;
    author: {
        id: string;
        full_name: string;
        avatar_url?: string;
        verified: boolean;
    };
}

export default function AnswersPage() {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isDark } = useTheme();
    const isLg = useBreakpoint('lg');
    const isMobile = !isLg;

    const [post, setPost] = useState<Post | null>(null);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (postId) {
            fetchPostAndAnswers();
        }
    }, [postId]);

    const fetchPostAndAnswers = async () => {
        try {
            setLoading(true);

            // Fetch post
            const { data: postData, error: postError } = await supabase
                .from('posts')
                .select(`
          *,
          author:profiles!posts_user_id_fkey(
            id,
            full_name,
            avatar_url,
            verified
          )
        `)
                .eq('id', postId)
                .single();

            if (postError) throw postError;
            setPost(postData);

            // Fetch all top-level answers (comments without parent_id)
            const { data: answersData, error: answersError } = await supabase
                .from('comments')
                .select('*')
                .eq('post_id', postId)
                .is('parent_id', null)
                .order('created_at', { ascending: false });

            if (answersError) throw answersError;

            // Fetch author profiles for each answer
            const transformedAnswers: Answer[] = await Promise.all(
                (answersData || []).map(async (answer) => {
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('full_name, username, avatar_url, verified')
                        .eq('id', answer.user_id)
                        .single();

                    return {
                        id: answer.id,
                        post_id: answer.post_id,
                        user_id: answer.user_id,
                        parent_id: answer.parent_id,
                        content: answer.content,
                        like_count: answer.like_count || 0,
                        reply_count: answer.reply_count || 0,
                        has_liked: false,
                        created_at: answer.created_at,
                        author: {
                            id: answer.user_id,
                            name: profileData?.full_name || 'User',
                            username: profileData?.username || `user${answer.user_id.slice(-4)}`,
                            avatar_url: profileData?.avatar_url,
                            verified: profileData?.verified || false
                        },
                        replies: []
                    };
                })
            );

            setAnswers(transformedAnswers);
        } catch (error) {
            console.error('Error fetching post and answers:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
        return date.toLocaleDateString();
    };

    const AnswerCard = ({ answer }: { answer: Answer }) => (
        <div
            className={cn(
                'p-4 border-b transition-colors',
                isDark ? 'border-gray-800 hover:bg-gray-900/30' : 'border-gray-200 hover:bg-gray-50'
            )}
        >
            <div className="flex gap-3">
                <Link to={`/profile/${answer.author.id}`}>
                    <Avatar
                        src={answer.author.avatar_url}
                        alt={answer.author.name}
                        name={answer.author.name}
                        size="md"
                        className="shrink-0"
                    />
                </Link>

                <div className="flex-1 min-w-0">
                    {/* Author Info */}
                    <div className="flex items-center gap-1.5 mb-2">
                        <Link to={`/profile/${answer.author.id}`} className="font-bold text-sm hover:underline">
                            {answer.author.name}
                        </Link>
                        {answer.author.verified && (
                            <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 24 24">
                                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                            </svg>
                        )}
                        <span className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                            @{answer.author.username}
                        </span>
                        <span className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>·</span>
                        <span className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                            {formatTimeAgo(answer.created_at)}
                        </span>
                    </div>

                    {/* Answer Content */}
                    <p className={cn('text-base mb-3 whitespace-pre-wrap', isDark ? 'text-white' : 'text-black')}>
                        {answer.content}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-6">
                        <Button
                            variant="ghost"
                            size="small"
                            className={cn(
                                'flex items-center gap-2 px-0 py-1 text-sm transition-colors',
                                isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'
                            )}
                        >
                            <Heart className="w-4 h-4" />
                            <span>{answer.like_count || ''}</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="small"
                            className={cn(
                                'flex items-center gap-2 px-0 py-1 text-sm transition-colors',
                                isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
                            )}
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>{answer.reply_count || ''}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <PageLayout className={cn('min-h-screen', isDark ? 'bg-black' : 'bg-white')} maxWidth="full" padding="none">
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                </div>
            </PageLayout>
        );
    }

    if (!post) {
        return (
            <PageLayout className={cn('min-h-screen', isDark ? 'bg-black' : 'bg-white')} maxWidth="md">
                <div className="text-center py-12">
                    <h2 className="text-xl font-bold mb-4">Post Not Found</h2>
                    <Button onClick={() => navigate('/feed')}>Back to Feed</Button>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout
            className={cn('min-h-screen', isDark ? 'bg-black text-white' : 'bg-white text-black')}
            maxWidth="full"
            padding="none"
        >
            {/* Header */}
            <div
                className={cn(
                    'sticky top-0 z-10 backdrop-blur-xl border-b',
                    isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200',
                    isMobile ? 'top-16' : 'top-0'
                )}
            >
                <div className="flex items-center gap-4 px-4 py-3">
                    <Button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">Answers</h1>
                        <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                            {answers.length} {answers.length === 1 ? 'answer' : 'answers'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-2xl mx-auto">
                <div className={cn('border-x', isDark ? 'border-gray-800' : 'border-gray-200')}>
                    {/* Original Post (Compact) */}
                    <div className={cn('p-4 border-b', isDark ? 'border-gray-800' : 'border-gray-200')}>
                        <div className="flex gap-3">
                            <Link to={`/profile/${post.author.id}`}>
                                <Avatar
                                    src={post.author.avatar_url}
                                    alt={post.author.full_name}
                                    name={post.author.full_name}
                                    size="md"
                                    className="shrink-0"
                                />
                            </Link>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Link to={`/profile/${post.author.id}`} className="font-bold hover:underline">
                                        {post.author.full_name}
                                    </Link>
                                    {post.author.verified && (
                                        <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 24 24">
                                            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                                        </svg>
                                    )}
                                </div>
                                <p className={cn('text-base mb-3', isDark ? 'text-white' : 'text-black')}>{post.content}</p>
                                {post.image_url && (
                                    <img src={post.image_url} alt="Post" className="rounded-2xl mb-3 max-h-96 w-full object-cover" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Answers List */}
                    {answers.length === 0 ? (
                        <div className="p-12 text-center">
                            <MessageCircle className={cn('w-12 h-12 mx-auto mb-3', isDark ? 'text-gray-700' : 'text-gray-300')} />
                            <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                No answers yet. Be the first to answer!
                            </p>
                        </div>
                    ) : (
                        <div>
                            {answers.map((answer) => (
                                <AnswerCard key={answer.id} answer={answer} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}
