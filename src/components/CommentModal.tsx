import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import Comments from './Comments';

interface Post {
  id: string;
  content: string;
  user_id: string;
  image_urls?: string[];
  like_count: number;
  comment_count: number;
  share_count: number;
  created_at: string;
  profiles: {
    username: string;
    full_name: string;
    avatar_url?: string;
    is_verified: boolean;
  };
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  currentUserId: string;
}

export default function CommentModal({ isOpen, onClose, post, currentUserId }: CommentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center p-4">
        <div className="relative bg-white rounded-2xl w-full max-w-2xl mt-8 mb-8 shadow-xl">
          {/* Header */}
          <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">Post</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Original Post */}
          <div className="border-b border-gray-100 p-4">
            <div className="flex space-x-3">
              {/* Avatar */}
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  {post.profiles.avatar_url ? (
                    <img
                      src={post.profiles.avatar_url}
                      alt={post.profiles.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-blue-400 to-info-600 flex items-center justify-center text-white font-semibold">
                      {post.profiles.full_name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {post.profiles.full_name}
                  </h3>
                  {post.profiles.is_verified && (
                    <div className="w-5 h-5 bg-info-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <span className="text-gray-500">@{post.profiles.username}</span>
                </div>

                {/* Post Text */}
                <div className="mb-3">
                  <p className="text-gray-900 leading-relaxed text-lg">{post.content}</p>
                </div>

                {/* Post Images */}
                {post.image_urls && post.image_urls.length > 0 && (
                  <div className="mb-3 rounded-2xl overflow-hidden">
                    <img
                      src={post.image_urls[0]}
                      alt="Post image"
                      className="w-full h-auto"
                    />
                  </div>
                )}

                {/* Post Stats */}
                <div className="flex items-center space-x-6 text-gray-500 text-sm border-t border-gray-100 pt-3 mt-3">
                  <span><span className="font-semibold text-gray-900">{post.comment_count}</span> replies</span>
                  <span><span className="font-semibold text-gray-900">{post.like_count}</span> likes</span>
                  <span><span className="font-semibold text-gray-900">{post.share_count}</span> reposts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="max-h-96 overflow-y-auto">
            <Comments postId={post.id} currentUserId={currentUserId} />
          </div>
        </div>
      </div>
    </div>
  );
}