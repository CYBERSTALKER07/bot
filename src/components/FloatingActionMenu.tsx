import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Share2, Bookmark, Edit3, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface FloatingActionMenuProps {
  className?: string;
}

interface QuickAction {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  action: () => void;
}

const GrokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="square"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17 3L7 21" />
  </svg>
);

import { useBreakpoint } from '@openai/apps-sdk-ui/hooks/useBreakpoints';

export function FloatingActionMenu({
  className = ''
}: FloatingActionMenuProps) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [pressedItem, setPressedItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isFabPressed, setIsFabPressed] = useState(false);

  const isMd = useBreakpoint('md');
  const isLg = useBreakpoint('lg');

  const [isMobile, setIsMobile] = useState(!isMd);
  const [isTablet, setIsTablet] = useState(isMd && !isLg);

  // Enhanced state for slide gesture functionality
  const [isDragging, setIsDragging] = useState(false);
  const [draggedOverItem, setDraggedOverItem] = useState<string | null>(null);
  const [startTouchPosition, setStartTouchPosition] = useState<{ x: number; y: number } | null>(null);

  // iPad gesture states
  const [isSwipeGestureActive, setIsSwipeGestureActive] = useState(false);
  const [swipeStartPosition, setSwipeStartPosition] = useState<{ x: number; y: number } | null>(null);
  const [showCenterMenu, setShowCenterMenu] = useState(false);

  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Detect device type
  useEffect(() => {
    setIsMobile(!isMd);
    setIsTablet(isMd && !isLg);

    // iPad specific detection
    const isIPad = /iPad|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;
    if (isIPad) {
      setIsTablet(true);
    }
  }, [isMd, isLg]);

  // iPad two-finger swipe gesture detection
  useEffect(() => {
    if (!isTablet) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        setIsSwipeGestureActive(true);
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;
        setSwipeStartPosition({ x: centerX, y: centerY });

        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && isSwipeGestureActive && swipeStartPosition) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;

        const deltaX = centerX - swipeStartPosition.x;
        const deltaY = centerY - swipeStartPosition.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Check if swipe is towards top-right (positive X, negative Y)
        if (distance > 50 && deltaX > 30 && deltaY < -30) {
          setShowCenterMenu(true);
          setIsSwipeGestureActive(false);

          if (navigator.vibrate) {
            navigator.vibrate([15, 50, 15]);
          }
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        setIsSwipeGestureActive(false);
        setSwipeStartPosition(null);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isTablet, isSwipeGestureActive, swipeStartPosition]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  const quickActions: QuickAction[] = [
    {
      id: 'post',
      icon: Edit3,
      label: 'Create Post',
      description: 'Create a new post',
      color: 'bg-[#D3FB52] hover:bg-[#D3FB52]/90 text-black',
      action: () => navigate('/create-post')
    },
    {
      id: 'message',
      icon: MessageSquare,
      label: 'Messages',
      description: 'View your messages',
      color: 'bg-white hover:bg-gray-100 text-black',
      action: () => navigate('/messages')
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Share',
      description: 'Share content',
      color: 'bg-black hover:bg-gray-900 text-white border-white',
      action: () => console.log('Share')
    },
    {
      id: 'bookmark',
      icon: Bookmark,
      label: 'Bookmarks',
      description: 'View bookmarked items',
      color: 'bg-[#D3FB52] hover:bg-[#D3FB52]/90 text-black',
      action: () => navigate('/bookmarks')
    }
  ];

  const handleActionClick = (action: QuickAction) => {
    setIsOpen(false);
    setShowCenterMenu(false);
    setIsFabPressed(false);
    setIsDragging(false);
    setDraggedOverItem(null);
    setHoveredItem(null);
    action.action();
  };

  // Circle position for center menu (iPad)
  const getCircleMenuPosition = (index: number, total: number) => {
    const radius = 120;
    const angleStep = (2 * Math.PI) / total;
    const angle = index * angleStep - Math.PI / 2; // Start from top

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    return {
      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      transitionDelay: `${index * 100}ms`,
      transitionDuration: '400ms',
      transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    };
  };

  // Optimized fan position for FAB menu items - enhanced curved pattern
  const getFabMenuPosition = (index: number, total: number) => {
    const baseRadius = 100;
    const radiusAdjustment = Math.min(15, total * 3);
    const radius = baseRadius + radiusAdjustment;

    const maxAngleSpread = 135;
    const minAngleSpread = 50;
    const angleSpread = Math.max(minAngleSpread, Math.min(maxAngleSpread, total * 18));

    const centerAngle = 225;
    const startAngle = centerAngle - (angleSpread / 2);

    const step = total > 1 ? angleSpread / (total - 1) : 0;
    const angle = startAngle + (index * step);
    const rad = (angle * Math.PI) / 180;

    const x = Math.cos(rad) * radius;
    const y = Math.sin(rad) * radius;

    const curveOffset = Math.sin((index / Math.max(total - 1, 1)) * Math.PI) * 8;
    const adjustedY = y + curveOffset;

    return {
      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${adjustedY}px))`,
      transitionDelay: `${index * 50}ms`,
      transitionDuration: '350ms',
      transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    };
  };

  // Enhanced touch event handlers for 0.5s press and hold with slide navigation
  const handleFabPressStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();

    if ('touches' in e) {
      // Mobile touch - only open on long press
      setIsFabPressed(true);
      setIsDragging(false);
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      setStartTouchPosition({ x: clientX, y: clientY });

      if (navigator.vibrate) {
        navigator.vibrate(15);
      }

      // Clear any existing timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }

      // Set 0.5 second timer for long press
      longPressTimerRef.current = setTimeout(() => {
        setIsOpen(true);
        setIsFabPressed(false);
        if (navigator.vibrate) {
          navigator.vibrate([10, 50, 10]); // Success haptic pattern
        }
      }, 500);
    } else if (!isMobile) {
      // Desktop - immediate response
      setIsFabPressed(true);
      setIsOpen(!isOpen);
    }
  };

  const handleFabPressEnd = (e?: React.TouchEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Clear the long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Handle slide gesture completion
    if (isDragging && draggedOverItem) {
      const action = quickActions.find((action) => action.id === draggedOverItem);
      if (action) {
        if (navigator.vibrate) {
          navigator.vibrate([20, 100, 20]); // Action haptic pattern
        }
        handleActionClick(action);
        return;
      }
    }

    // Reset states
    setIsFabPressed(false);
    setIsDragging(false);
    setStartTouchPosition(null);
    setDraggedOverItem(null);
    setHoveredItem(null);
  };

  const handleFabTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();

    if (isFabPressed && startTouchPosition) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - startTouchPosition.x;
      const deltaY = touch.clientY - startTouchPosition.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Start dragging if moved more than 20px
      if (distance > 20) {
        setIsDragging(true);

        // If menu is open, detect which action button is under finger
        if (isOpen) {
          const elementFromPoint = document.elementFromPoint(touch.clientX, touch.clientY);
          const actionButton = elementFromPoint?.closest('button[data-action-id]');

          if (actionButton) {
            const actionId = actionButton.getAttribute('data-action-id');

            if (actionId && actionId !== draggedOverItem) {
              setDraggedOverItem(actionId);
              setHoveredItem(actionId);

              if (navigator.vibrate) {
                navigator.vibrate(5); // Light haptic for hover
              }
            }
          } else {
            setDraggedOverItem(null);
            setHoveredItem(null);
          }
        } else {
          // If menu is not open but user is dragging, cancel long press and open menu
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
          setIsOpen(true);
          setIsFabPressed(false);

          if (navigator.vibrate) {
            navigator.vibrate([10, 50, 10]);
          }
        }
      }
    }
  };

  // Handle click - only for desktop
  const handleFabClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Only allow click on desktop, mobile uses touch events
    if (!isMobile) {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if ((isOpen || showCenterMenu) && !(event.target as Element)?.closest('.floating-action-menu')) {
        setIsOpen(false);
        setShowCenterMenu(false);
      }
    };

    if (isOpen || showCenterMenu) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [isOpen, showCenterMenu]);

  const backdropStyle = {
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)'
  };

  return (
    <>
      {/* Backdrop for both mobile FAB and center menu */}
      {(isOpen || showCenterMenu) && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 ease-out"
          onClick={() => {
            setIsOpen(false);
            setShowCenterMenu(false);
          }}
          style={backdropStyle}
        />
      )}

      {/* iPad Center Menu */}
      {isTablet && showCenterMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center floating-action-menu">
          <div className="relative">
            {/* Center close button */}
            <button
              onClick={() => setShowCenterMenu(false)}
              className="w-16 h-16 rounded-full bg-black text-[#D3FB52] shadow-2xl shadow-[#D3FB52]/20 flex items-center justify-center border-2 border-[#D3FB52] transform transition-all duration-300 hover:scale-110"
              aria-label="Close menu"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Circle menu items */}
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const isHovered = hoveredItem === action.id;
              const isPressed = pressedItem === action.id;

              return (
                <button
                  key={action.id}
                  data-action-id={action.id}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    setPressedItem(action.id);
                    setHoveredItem(action.id);
                    if (navigator.vibrate) navigator.vibrate(5);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    setPressedItem(null);
                    setHoveredItem(null);
                    handleActionClick(action);
                  }}
                  onMouseEnter={() => setHoveredItem(action.id)}
                  onMouseLeave={() => {
                    setPressedItem(null);
                    setHoveredItem(null);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick(action);
                  }}
                  className={`
                    absolute w-16 h-16 rounded-full shadow-xl flex items-center justify-center
                    transition-all duration-400 ease-out border-2
                    touch-manipulation select-none transform-gpu
                    opacity-100 scale-100 pointer-events-auto
                    ${isPressed
                      ? 'scale-125 shadow-2xl ring-4 ring-[#D3FB52]/30 border-[#D3FB52]'
                      : isHovered
                        ? 'scale-110 shadow-xl border-[#D3FB52]/50'
                        : 'scale-100 hover:scale-105 active:scale-95 border-white/20'
                    }
                    ${action.color}
                  `}
                  style={getCircleMenuPosition(index, quickActions.length)}
                  aria-label={action.description}
                >
                  <Icon className={`transition-all duration-200 ${isPressed || isHovered ? 'h-8 w-8' : 'h-6 w-6'
                    }`} />
                </button>
              );
            })}

            {/* Action labels */}
            {quickActions.map((action, index) => {
              const isHovered = hoveredItem === action.id;
              const position = getCircleMenuPosition(index, quickActions.length);

              return (
                <div
                  key={`label-${action.id}`}
                  className={`
                    absolute text-sm font-medium px-3 py-2 rounded-lg shadow-lg border pointer-events-none
                    transition-all duration-400 ease-out
                    ${isDark
                      ? 'bg-gray-800 text-white border-gray-700'
                      : 'bg-white text-gray-900 border-gray-200'
                    }
                    ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                  `}
                  style={{
                    ...position,
                    transform: `${position.transform} translateY(-40px)`,
                    transitionDelay: isHovered ? '0ms' : '200ms'
                  }}
                >
                  {action.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FAB Menu */}
      <div className={`fixed bottom-6 right-6 z-50 floating-action-menu ${className}`}>
        <div className="relative">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const isHovered = hoveredItem === action.id;
            const isPressed = pressedItem === action.id;
            const isDraggedOver = draggedOverItem === action.id;

            const touchProps = isMobile ? {
              onTouchStart: (e: React.TouchEvent) => {
                e.preventDefault();
                e.stopPropagation();
                setPressedItem(action.id);
                setHoveredItem(action.id);
                if (navigator.vibrate) navigator.vibrate(5);
              },
              onTouchEnd: (e: React.TouchEvent) => {
                e.preventDefault();
                e.stopPropagation();
                setPressedItem(null);
                setHoveredItem(null);
                if (!isDragging) {
                  handleActionClick(action);
                }
              },
              onTouchCancel: () => {
                setPressedItem(null);
                setHoveredItem(null);
              }
            } : {};

            const mouseProps = !isMobile ? {
              onMouseDown: () => {
                setPressedItem(action.id);
                setHoveredItem(action.id);
              },
              onMouseUp: () => {
                setPressedItem(null);
                handleActionClick(action);
              },
              onMouseEnter: () => setHoveredItem(action.id),
              onMouseLeave: () => {
                setPressedItem(null);
                setHoveredItem(null);
              }
            } : {};

            const buttonStyle = isOpen ? getFabMenuPosition(index, quickActions.length) : {
              transform: 'translate(-50%, -50%) scale(0)',
              opacity: 0
            };

            return (
              <button
                key={action.id}
                data-action-id={action.id}
                {...touchProps}
                {...mouseProps}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isMobile) {
                    handleActionClick(action);
                  }
                }}
                className={`
                  absolute w-14 h-14 rounded-full shadow-xl flex items-center justify-center
                  transition-all duration-300 ease-out border-2
                  touch-manipulation select-none transform-gpu
                  ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-0 pointer-events-none'}
                  ${isPressed || isDraggedOver
                    ? 'scale-150 shadow-2xl ring-4 ring-[#D3FB52]/30 border-[#D3FB52]'
                    : isHovered
                      ? 'scale-125 shadow-xl border-[#D3FB52]/50'
                      : 'scale-100 hover:scale-110 active:scale-95 border-white/20'
                  }
                  ${action.color}
                `}
                style={buttonStyle}
                aria-label={action.description}
              >
                <Icon className={`transition-all duration-200 ${isPressed || isDraggedOver || isHovered ? 'h-8 w-8' : 'h-6 w-6'
                  }`} />
              </button>
            );
          })}
        </div>

        <button
          onTouchStart={isMobile ? handleFabPressStart : undefined}
          onTouchEnd={isMobile ? handleFabPressEnd : undefined}
          onTouchCancel={isMobile ? handleFabPressEnd : undefined}
          onTouchMove={isMobile ? handleFabTouchMove : undefined}
          onMouseDown={!isMobile ? handleFabPressStart : undefined}
          onMouseUp={!isMobile ? handleFabPressEnd : undefined}
          onClick={handleFabClick}
          className={`
            relative w-16 h-16 rounded-full flex items-center justify-center
            transition-all duration-300 ease-out border-2
            touch-manipulation select-none transform-gpu
            ${isOpen
              ? 'bg-black text-[#D3FB52] rotate-45 scale-110 shadow-lg shadow-[#D3FB52]/50 border-[#D3FB52]'
              : isFabPressed
                ? 'bg-black text-[#D3FB52] scale-125 shadow-lg shadow-[#D3FB52]/50 ring-4 ring-[#D3FB52]/20 border-[#D3FB52]'
                : 'bg-black text-[#D3FB52] hover:scale-105 active:scale-95 shadow-lg shadow-[#D3FB52]/20 border-[#D3FB52]'
            }
            z-50
          `}
          aria-label={isOpen ? "Close menu" : "Press and hold to open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="h-8 w-8 transition-transform duration-300" />
          ) : (
            <GrokIcon className="h-8 w-8 transition-transform duration-300" />
          )}
        </button>
      </div>

      {/* iPad Gesture Indicator */}
      {isTablet && !showCenterMenu && (
        <div className="fixed top-4 right-4 z-30 opacity-50 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm border border-white/20">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span>Swipe ↗️ for quick actions</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}