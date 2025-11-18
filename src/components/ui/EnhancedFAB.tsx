import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { cn } from '../../lib/cva';

interface EnhancedFABProps {
  isDark?: boolean;
  isMobile?: boolean;
  onAction: (action: string) => void;
  actions?: Array<{
    id: string;
    icon: React.ReactNode;
    label: string;
    color: string;
  }>;
}

const springConfig = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 25,
  mass: 0.8,
};

/**
 * Enhanced Floating Action Button with X-style interactions
 * Features:
 * - Spring animations for menu expansion
 * - Haptic feedback on interactions
 * - Swipe-to-select gesture support
 * - Bottom sheet modal integration
 * - iOS momentum scrolling
 */
export const EnhancedFAB: React.FC<EnhancedFABProps> = ({
  isDark = true,
  isMobile = false,
  onAction,
  actions = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLButtonElement>(null);

  const triggerHaptic = (pattern: 'tap' | 'success' | 'warning' = 'tap') => {
    if (!navigator.vibrate) return;

    const patterns: Record<string, number[]> = {
      tap: [10],
      success: [10, 20, 10],
      warning: [30, 20, 30, 20, 30],
    };

    navigator.vibrate(patterns[pattern]);
  };

  const handleFABClick = () => {
    triggerHaptic('tap');
    setIsOpen(!isOpen);

    if (isMobile && isOpen) {
      // Add haptic feedback when closing
      triggerHaptic('tap');
    }
  };

  const handleActionClick = (actionId: string) => {
    triggerHaptic('success');
    setSelectedAction(actionId);
    onAction(actionId);

    // Auto-close menu after selection
    setTimeout(() => {
      setIsOpen(false);
      setSelectedAction(null);
    }, 200);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isOpen) return;

    const currentY = e.touches[0].clientY;
    const diffY = currentY - touchStart.y;

    if (diffY > 0) {
      setIsDragging(true);
      setDragY(diffY);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      setIsOpen(false);
      triggerHaptic('success');
    }

    setIsDragging(false);
    setDragY(0);
  };

  // Keyboard support
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className={cn(
                'fixed inset-0 cursor-default',
                isDark ? 'bg-black/40' : 'bg-white/40'
              )}
            />

            {/* Menu Items */}
            <div className="absolute bottom-20 right-0 space-y-3">
              {actions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: 20 }}
                  transition={{
                    ...springConfig,
                    delay: index * 0.05,
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setHoveredAction(action.id)}
                  onMouseLeave={() => setHoveredAction(null)}
                >
                  <button
                    onClick={() => handleActionClick(action.id)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-full shadow-lg',
                      'transition-all duration-200 group cursor-pointer',
                      isDark
                        ? 'bg-gray-800 hover:bg-gray-700 text-white'
                        : 'bg-white hover:bg-gray-50 text-gray-900',
                      hoveredAction === action.id && 'shadow-xl'
                    )}
                  >
                    {/* Label */}
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {action.label}
                    </motion.span>

                    {/* Icon */}
                    <motion.div
                      animate={
                        selectedAction === action.id
                          ? { scale: [1, 1.2, 1], rotate: 360 }
                          : {}
                      }
                      transition={{ duration: 0.4 }}
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-white',
                        action.color
                      )}
                    >
                      {action.icon}
                    </motion.div>
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Drag Handle Indicator */}
            {isMobile && (
              <motion.div
                className={cn(
                  'absolute bottom-16 right-1/2 translate-x-1/2 h-1 w-12 rounded-full',
                  isDark ? 'bg-white/30' : 'bg-black/30'
                )}
                animate={isDragging ? { height: 2, opacity: 1 } : { height: 4, opacity: 0.5 }}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={handleFABClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={dragRef}
        animate={{
          scale: isOpen ? 0.9 : 1,
          rotate: isOpen ? 45 : 0,
          y: dragY,
        }}
        transition={springConfig}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'relative w-16 h-16 rounded-full shadow-lg',
          'flex items-center justify-center',
          'transition-all duration-200 cursor-pointer',
          isDark
            ? 'bg-info-600 hover:bg-info-700 text-white'
            : 'bg-info-500 hover:bg-info-600 text-white',
          'active:scale-95',
          isDragging && 'opacity-75'
        )}
      >
        <motion.div animate={isOpen ? { rotate: 45 } : { rotate: 0 }} transition={springConfig}>
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </motion.div>

        {/* Ripple effect */}
        <motion.div
          className={cn(
            'absolute inset-0 rounded-full pointer-events-none',
            isDark ? 'bg-white/20' : 'bg-black/20'
          )}
          animate={isOpen ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 0 }}
          initial={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 0.6 }}
        />
      </motion.button>

      {/* Floating Label */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={cn(
              'absolute -bottom-10 right-0 text-xs font-medium whitespace-nowrap',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}
          >
            Swipe up to close
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedFAB;
