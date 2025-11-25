import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Link as LinkIcon, Calendar } from 'lucide-react';
import { cn } from '../../lib/cva';

interface ProfileHoverCardProps {
  user: {
    id: string;
    name: string;
    username: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    website?: string;
    created_at?: string;
    followers?: number;
    following?: number;
    verified?: boolean;
  };
  isDark?: boolean;
  onFollow?: () => void;
  isFollowing?: boolean;
  children: React.ReactNode;
}

/**
 * Profile Hover Card with Animation
 * Features:
 * - Smooth entrance/exit animations
 * - Spring physics for natural motion
 * - Profile information preview
 * - Interactive follow button
 * - Mobile-friendly
 */
export const ProfileHoverCard: React.FC<ProfileHoverCardProps> = ({
  user,
  isDark = false,
  onFollow,
  isFollowing = false,
  children,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative w-fit"
    >
      {children}

      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            className={cn(
              'absolute top-full left-0 mt-2 w-80 rounded-2xl shadow-2xl border z-50',
              'backdrop-blur-xl',
              isDark
                ? 'bg-black/95 border-gray-700'
                : 'bg-white/95 border-gray-200'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cover Photo */}
            <div className="h-20 bg-linear-to-r from-info-500/30 to-purple-500/30" />

            {/* Content */}
            <div className="p-4 pt-2">
              {/* Avatar */}
              <div className="flex items-start justify-between -mt-10 mb-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="shrink-0"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-16 h-16 rounded-full border-4 border-black dark:border-black object-cover"
                    />
                  ) : (
                    <div className={cn(
                      'w-16 h-16 rounded-full border-4 flex items-center justify-center text-xl font-bold',
                      isDark
                        ? 'bg-gray-800 border-black text-white'
                        : 'bg-gray-200 border-white text-gray-900'
                    )}>
                      {user.name.charAt(0)}
                    </div>
                  )}
                </motion.div>

                {/* Follow Button */}
                {onFollow && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onFollow}
                    className={cn(
                      'px-4 py-2 rounded-full font-bold text-sm transition-all',
                      isFollowing
                        ? isDark
                          ? 'bg-gray-800 text-white border border-gray-700 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200'
                        : 'bg-info-500 text-white hover:bg-info-600'
                    )}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </motion.button>
                )}
              </div>

              {/* Name and Username */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
                <div className="flex items-center gap-1">
                  <h3 className={cn(
                    'font-bold text-lg',
                    isDark ? 'text-white' : 'text-gray-900'
                  )}>
                    {user.name}
                  </h3>
                  {user.verified && (
                    <span className="inline-flex items-center justify-center w-4 h-4 bg-info-500 rounded-full">
                      <span className="text-xs text-white font-bold">✓</span>
                    </span>
                  )}
                </div>
                <p className={cn(
                  'text-sm',
                  isDark ? 'text-gray-500' : 'text-gray-600'
                )}>
                  @{user.username}
                </p>
              </motion.div>

              {/* Bio */}
              {user.bio && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className={cn(
                    'text-sm mt-2 leading-relaxed line-clamp-2',
                    isDark ? 'text-gray-400' : 'text-gray-700'
                  )}
                >
                  {user.bio}
                </motion.p>
              )}

              {/* Location */}
              {user.location && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className={cn(
                    'flex items-center gap-1 text-xs mt-2',
                    isDark ? 'text-gray-500' : 'text-gray-600'
                  )}
                >
                  <MapPin className="w-3 h-3" />
                  {user.location}
                </motion.div>
              )}

              {/* Website */}
              {user.website && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={cn(
                    'flex items-center gap-1 text-xs mt-1',
                    isDark ? 'text-info-400' : 'text-info-600'
                  )}
                >
                  <LinkIcon className="w-3 h-3" />
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    {user.website}
                  </a>
                </motion.div>
              )}

              {/* Join Date */}
              {user.created_at && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className={cn(
                    'flex items-center gap-1 text-xs mt-2',
                    isDark ? 'text-gray-500' : 'text-gray-600'
                  )}
                >
                  <Calendar className="w-3 h-3" />
                  Joined {formatDate(user.created_at)}
                </motion.div>
              )}

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex gap-4 mt-3 pt-3 border-t border-gray-700"
              >
                <div className="flex flex-col">
                  <span className={cn(
                    'font-bold text-sm',
                    isDark ? 'text-white' : 'text-gray-900'
                  )}>
                    {(user.followers || 0).toLocaleString()}
                  </span>
                  <span className={cn(
                    'text-xs',
                    isDark ? 'text-gray-500' : 'text-gray-600'
                  )}>
                    Followers
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    'font-bold text-sm',
                    isDark ? 'text-white' : 'text-gray-900'
                  )}>
                    {(user.following || 0).toLocaleString()}
                  </span>
                  <span className={cn(
                    'text-xs',
                    isDark ? 'text-gray-500' : 'text-gray-600'
                  )}>
                    Following
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileHoverCard;
