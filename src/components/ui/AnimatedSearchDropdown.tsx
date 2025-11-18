import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Search, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/cva';

interface SearchSuggestion {
  id: string;
  title: string;
  subtitle?: string;
  type: 'recent' | 'trending' | 'user' | 'hashtag';
  icon?: React.ReactNode;
}

interface AnimatedSearchDropdownProps {
  suggestions: SearchSuggestion[];
  isOpen: boolean;
  isDark?: boolean;
  onSuggestionClick?: (suggestion: SearchSuggestion) => void;
  isLoading?: boolean;
  searchQuery?: string;
}

/**
 * Animated Search Suggestions Dropdown
 * Features:
 * - Staggered entrance animations
 * - Smooth scrolling
 * - Type-specific icons
 * - Mobile-optimized
 */
export const AnimatedSearchDropdown: React.FC<AnimatedSearchDropdownProps> = ({
  suggestions,
  isOpen,
  isDark = false,
  onSuggestionClick,
  isLoading = false,
  searchQuery = '',
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'recent':
        return <Clock className="w-4 h-4" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4" />;
      case 'user':
        return <div className="w-4 h-4 rounded-full bg-info-500" />;
      case 'hashtag':
        return <span className="text-sm font-bold">#</span>;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'recent':
        return isDark ? 'text-gray-400' : 'text-gray-600';
      case 'trending':
        return isDark ? 'text-red-400' : 'text-red-600';
      case 'user':
        return isDark ? 'text-info-400' : 'text-info-600';
      case 'hashtag':
        return isDark ? 'text-purple-400' : 'text-purple-600';
      default:
        return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
          className={cn(
            'absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl border',
            'max-h-96 overflow-y-auto',
            isDark
              ? 'bg-black/95 border-gray-700 backdrop-blur-xl'
              : 'bg-white/95 border-gray-200 backdrop-blur-xl'
          )}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className={cn(
                  'w-6 h-6 border-2 border-transparent rounded-full',
                  isDark
                    ? 'border-t-info-500 border-r-info-500'
                    : 'border-t-info-600 border-r-info-600'
                )}
              />
            </div>
          ) : suggestions.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-gray-700"
            >
              {suggestions.map((suggestion) => (
                <motion.button
                  key={suggestion.id}
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSuggestionClick?.(suggestion)}
                  className={cn(
                    'w-full px-4 py-3 flex items-center gap-3 transition-all',
                    'hover:bg-opacity-50',
                    isDark
                      ? 'hover:bg-gray-900/50'
                      : 'hover:bg-gray-50'
                  )}
                >
                  {/* Icon */}
                  <span className={cn(
                    'flex-shrink-0',
                    getTypeColor(suggestion.type)
                  )}>
                    {getIcon(suggestion.type)}
                  </span>

                  {/* Content */}
                  <div className="flex-1 text-left min-w-0">
                    <div className={cn(
                      'text-sm font-medium truncate',
                      isDark ? 'text-white' : 'text-gray-900'
                    )}>
                      {suggestion.title}
                    </div>
                    {suggestion.subtitle && (
                      <div className={cn(
                        'text-xs truncate',
                        isDark ? 'text-gray-500' : 'text-gray-600'
                      )}>
                        {suggestion.subtitle}
                      </div>
                    )}
                  </div>

                  {/* Type Badge */}
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className={cn(
                      'text-xs px-2 py-1 rounded-full flex-shrink-0',
                      suggestion.type === 'trending'
                        ? isDark
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-red-500/10 text-red-600'
                        : suggestion.type === 'user'
                          ? isDark
                            ? 'bg-info-500/20 text-info-400'
                            : 'bg-info-500/10 text-info-600'
                          : suggestion.type === 'hashtag'
                            ? isDark
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-purple-500/10 text-purple-600'
                            : isDark
                              ? 'bg-gray-800 text-gray-400'
                              : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {suggestion.type}
                  </motion.span>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                'px-4 py-8 text-center',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}
            >
              <p className="text-sm font-medium">
                {searchQuery ? 'No results found' : 'Start typing to search'}
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedSearchDropdown;
