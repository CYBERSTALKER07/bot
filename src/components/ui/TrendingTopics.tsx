import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '../../lib/cva';

interface TrendingTopicsProps {
  topics: Array<{
    id: string;
    title: string;
    count: number;
    category?: string;
  }>;
  isDark?: boolean;
  onTopicClick?: (topicId: string) => void;
}

/**
 * Trending Topics with Sparkle Animations
 * Features:
 * - Sparkle effects on hover
 * - Smooth expand/collapse transitions
 * - Animated count updates
 * - Mobile-optimized
 */
export const TrendingTopics: React.FC<TrendingTopicsProps> = ({
  topics,
  isDark = false,
  onTopicClick,
}) => {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  return (
    <div className={cn(
      'rounded-3xl border overflow-hidden',
      isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
    )}>
      <div className="p-4 border-b border-gray-800">
        <h3 className={cn(
          'font-serif text-lg font-bold flex items-center gap-2',
          isDark ? 'text-white' : 'text-gray-900'
        )}>
          <Sparkles className="w-5 h-5" />
          Trending Now
        </h3>
      </div>

      <div className="divide-y divide-gray-800">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
            }}
            onHoverStart={() => setHoveredTopic(topic.id)}
            onHoverEnd={() => setHoveredTopic(null)}
            onClick={() => {
              setExpandedTopic(expandedTopic === topic.id ? null : topic.id);
              onTopicClick?.(topic.id);
            }}
            className={cn(
              'p-4 cursor-pointer transition-all duration-200 relative overflow-hidden',
              hoveredTopic === topic.id
                ? isDark
                  ? 'bg-gray-900/50'
                  : 'bg-gray-50'
                : 'hover:bg-opacity-50'
            )}
          >
            {/* Sparkle Background Effect */}
            {hoveredTopic === topic.id && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [1, 0.5, 0],
                      x: Math.cos((i / 3) * Math.PI * 2) * 30,
                      y: Math.sin((i / 3) * Math.PI * 2) * 30,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.1,
                      repeat: Infinity,
                    }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <span className="text-lg">✨</span>
                  </motion.div>
                ))}
              </>
            )}

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1">
                  <motion.h4
                    animate={{
                      fontWeight: hoveredTopic === topic.id ? 600 : 500,
                    }}
                    className={cn(
                      'font-medium truncate transition-colors',
                      hoveredTopic === topic.id
                        ? isDark
                          ? 'text-info-400'
                          : 'text-info-600'
                        : isDark
                          ? 'text-white'
                          : 'text-gray-900'
                    )}
                  >
                    {topic.title}
                  </motion.h4>
                  {topic.category && (
                    <p className={cn(
                      'text-xs mt-0.5',
                      isDark ? 'text-gray-500' : 'text-gray-500'
                    )}>
                      {topic.category}
                    </p>
                  )}
                </div>

                {/* Count Badge */}
                <motion.span
                  animate={{
                    scale: hoveredTopic === topic.id ? 1.1 : 1,
                  }}
                  className={cn(
                    'ml-2 px-2 py-1 rounded-full text-xs font-bold shrink-0 flex items-center gap-1',
                    hoveredTopic === topic.id
                      ? isDark
                        ? 'bg-info-500/20 text-info-400'
                        : 'bg-info-500/20 text-info-600'
                      : isDark
                        ? 'bg-gray-800 text-gray-400'
                        : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {hoveredTopic === topic.id && <span>⚡</span>}
                  {topic.count.toLocaleString()}
                </motion.span>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedTopic === topic.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      'mt-3 pt-3 border-t',
                      isDark ? 'border-gray-800' : 'border-gray-200'
                    )}
                  >
                    <p className={cn(
                      'text-xs leading-relaxed',
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      {topic.count.toLocaleString()} people are talking about {topic.title.toLowerCase()}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrendingTopics;
