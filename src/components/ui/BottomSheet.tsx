import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/cva';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  isDark?: boolean;
  height?: 'auto' | 'medium' | 'large' | 'full';
  showDragHandle?: boolean;
  onDragEnd?: () => void;
}

/**
 * Bottom Sheet Modal with Drag Support
 * Features:
 * - Spring-based animations
 * - Swipe-to-dismiss gesture
 * - Touch-friendly
 * - Mobile-optimized
 * - Haptic feedback
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  isDark = false,
  height = 'medium',
  showDragHandle = true,
  onDragEnd,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const getHeightClass = () => {
    switch (height) {
      case 'auto':
        return 'max-h-96';
      case 'medium':
        return 'max-h-96';
      case 'large':
        return 'max-h-[80vh]';
      case 'full':
        return 'max-h-[95vh]';
      default:
        return 'max-h-96';
    }
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const shouldClose = info.velocity.y > 20 || info.offset.y > 100;
    
    if (shouldClose) {
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
      onClose();
    }

    onDragEnd?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={cn(
              'fixed inset-0 z-40',
              isDark ? 'bg-black/40' : 'bg-black/40'
            )}
          />

          {/* Sheet Container */}
          <motion.div
            ref={containerRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              mass: 1,
            }}
            drag="y"
            dragElastic={0.2}
            dragConstraints={{ top: 0 }}
            onDragEnd={handleDragEnd}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50',
              'rounded-t-3xl border-t',
              'flex flex-col',
              getHeightClass(),
              isDark
                ? 'bg-gray-900 border-gray-800'
                : 'bg-white border-gray-200'
            )}
          >
            {/* Drag Handle */}
            {showDragHandle && (
              <motion.div
                className={cn(
                  'flex items-center justify-center py-2 px-4',
                  'cursor-grab active:cursor-grabbing'
                )}
              >
                <div className={cn(
                  'w-12 h-1 rounded-full',
                  isDark ? 'bg-gray-700' : 'bg-gray-300'
                )} />
              </motion.div>
            )}

            {/* Header */}
            {title && (
              <div className={cn(
                'flex items-center justify-between px-6 py-4 border-b',
                isDark ? 'border-gray-800' : 'border-gray-200'
              )}>
                <h2 className={cn(
                  'text-lg font-bold',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  {title}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className={cn(
                    'p-2 rounded-full transition-all',
                    isDark
                      ? 'hover:bg-gray-800'
                      : 'hover:bg-gray-100'
                  )}
                >
                  <X className={cn(
                    'w-5 h-5',
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  )} />
                </motion.button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
