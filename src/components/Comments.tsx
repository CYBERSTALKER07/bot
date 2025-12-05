import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Heart, Share, MoreHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  content: string;
  user_id: string;
  post_id: string;
  parent_id?: string;
  like_count: number;
  reply_count: number;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  profiles: {
    username: string;
    full_name: string;
    avatar_url?: string;
    verified: boolean;
  };
  user_liked?: boolean;
  replies?: Comment[];
}

interface CommentsProps {
  postId: string;
  currentUserId: string;
}

interface Like {
  user_id: string;
}

export default function Comments({ postId, currentUserId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url,
            verified
          ),
          likes:likes!comment_id (
            user_id
          )
        `)
        .eq('post_id', postId)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: replies } = await supabase
            .from('comments')
            .select(`
              *,
              profiles:user_id (
                username,
                full_name,
                avatar_url,
                verified
              ),
              likes:likes!comment_id (
                user_id
              )
            `)
            .eq('parent_comment_id', comment.id)
            .order('created_at', { ascending: true });

          return {
            ...comment,
            user_liked: (comment.likes as Like[] || []).some((like) => like.user_id === currentUserId),
            replies: (replies || []).map((reply) => ({
              ...reply,
              user_liked: (reply.likes as Like[] || []).some((like) => like.user_id === currentUserId)
            }))
          };
        })
      );

      setComments(commentsWithReplies);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [postId, currentUserId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          content: newComment.trim(),
          post_id: postId,
          user_id: currentUserId,
          parent_comment_id: null
        }])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setNewComment('');
      await fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      // Show user-friendly error message
      alert('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !replyTo || submitting) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          content: replyText.trim(),
          post_id: postId,
          parent_comment_id: replyTo,
          user_id: currentUserId
        }])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setReplyText('');
      setReplyTo(null);
      await fetchComments();
    } catch (error) {
      console.error('Error posting reply:', error);
      // Show user-friendly error message
      alert('Failed to post reply. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', currentUserId);
      } else {
        await supabase
          .from('likes')
          .insert({
            comment_id: commentId,
            user_id: currentUserId
          });
      }
      fetchComments();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`flex space-x-3 ${isReply ? 'ml-12 mt-3' : 'py-3'} border-b border-gray-100 last:border-b-0`}>
      {/* Avatar */}
      <div className="shrink-0">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
          {comment.profiles.avatar_url ? (
            <img
              src={comment.profiles.avatar_url}
              alt={comment.profiles.full_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-blue-400 to-info-600 flex items-center justify-center text-white font-semibold">
              {comment.profiles.full_name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <h4 className="font-semibold text-gray-900 text-sm">
            {comment.profiles.full_name}
          </h4>
          {comment.profiles.verified && (
            <div className="w-4 h-4 bg-info-500 rounded-full flex items-center justify-center" title="Verified">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <span className="text-gray-500 text-sm">@{comment.profiles.username}</span>
          <span className="text-gray-500 text-sm">·</span>
          <time className="text-gray-500 text-sm">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </time>
          {comment.is_edited && (
            <span className="text-gray-400 text-xs">edited</span>
          )}
        </div>

        {/* Comment Text */}
        <div className="mt-1">
          <p className="text-gray-900 text-sm leading-relaxed">{comment.content}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-3 max-w-md">
          <button
            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
            aria-label={`Reply to comment`}
            className="flex items-center space-x-2 text-gray-500 hover:text-info-600 transition-colors group"
          >
            <div className="p-2 rounded-full group-hover:bg-info-50 transition-colors">
              <MessageCircle className="w-4 h-4" />
            </div>
            {comment.reply_count > 0 && (
              <span className="text-xs">{comment.reply_count}</span>
            )}
          </button>

          <button
            onClick={() => handleLikeComment(comment.id, comment.user_liked || false)}
            aria-label={comment.user_liked ? 'Unlike comment' : 'Like comment'}
            className={`flex items-center space-x-2 transition-colors group ${comment.user_liked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}
          >
            <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
              <Heart className={`w-4 h-4 ${comment.user_liked ? 'fill-current' : ''}`} />
            </div>
            {comment.like_count > 0 && (
              <span className="text-xs">{comment.like_count}</span>
            )}
          </button>

          <button
            aria-label="Share comment"
            className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors group"
          >
            <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
              <Share className="w-4 h-4" />
            </div>
          </button>

          {comment.user_id === currentUserId && (
            <button
              aria-label="More options"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <div className="p-2 rounded-full hover:bg-gray-50 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </button>
          )}
        </div>

        {/* Reply Form */}
        {replyTo === comment.id && (
          <form onSubmit={handleSubmitReply} className="mt-3">
            <div className="flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
              <div className="flex-1">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to @${comment.profiles.username}`}
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-info-500 focus:border-transparent"
                  rows={2}
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!replyText.trim() || submitting}
                    className="px-4 py-2 bg-info-600 text-white text-sm font-medium rounded-full hover:bg-info-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Comment Form */}
      <div className="border-b border-gray-100 p-4">
        <form onSubmit={handleSubmitComment}>
          <div className="flex space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0"></div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Post your reply"
                className="w-full p-3 text-lg border-none resize-none focus:ring-0 focus:outline-hidden placeholder-gray-500"
                rows={3}
                id="comment-input"
                maxLength={280}
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-500">
                  {newComment.length}/280
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="px-6 py-2 bg-info-600 text-white font-medium rounded-full hover:bg-info-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Posting...' : 'Reply'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="divide-y divide-gray-100">
        {comments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">No replies yet</p>
            <p className="text-sm">Be the first to reply to this post.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}