import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import {
  FolderOpenIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  TrophyIcon,
  PlusIcon
} from '../lib/icons';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  entryType?: string;
  action?: () => void;
}

interface FloatingActionButtonProps {
  onAddEntry?: (entryType: string) => void;
}

export function FloatingActionButton({ onAddEntry }: FloatingActionButtonProps) {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [pressedFabItem, setPressedFabItem] = useState<string | null>(null);
  const [hoveredFabItem, setHoveredFabItem] = useState<string | null>(null);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isFabPressed, setIsFabPressed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const [isGliding, setIsGliding] = useState(false);
  const [glideTarget, setGlideTarget] = useState<string | null>(null);
  const [startTouchPosition, setStartTouchPosition] = useState<{ x: number; y: number } | null>(null);
  
  const fabMenuRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fabButtonRef = useRef<HTMLButtonElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // FAB Quick Actions
  const quickActions: QuickAction[] = [
    {
      id: 'add-skill-assessment',
      label: 'Skills Assessment',
      icon: AcademicCapIcon,
      color: 'bg-emerald-500',
      description: 'Take skills assessment',
      action: () => navigate('/skills/add')
    },
    {
      id: 'add-portfolio-entry',
      label: 'Add Activity',
      icon: FolderOpenIcon,
      color: 'bg-info-500',
      description: 'Add portfolio entry',
      entryType: 'academic'
    },
    {
      id: 'view-badges',
      label: 'Digital Badges',
      icon: TrophyIcon,
      color: 'bg-amber-500',
      description: 'View digital badges',
      action: () => navigate('/badges')
    },
    {
      id: 'passport',
      label: 'Digital Passport',
      icon: DocumentTextIcon,
      color: 'bg-purple-500',
      description: 'View digital passport',
      action: () => navigate('/digital-passport')
    }
  ];

  // Close FAB menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (fabMenuRef.current && !fabMenuRef.current.contains(target)) {
        setIsFabOpen(false);
      }
    };

    if (isFabOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isFabOpen]);

  // Handle FAB action
  const handleFabAction = (action: QuickAction) => {
    if (action.action) {
      action.action();
    } else if (action.entryType && onAddEntry) {
      onAddEntry(action.entryType);
    }
    setIsFabOpen(false);
  };

  // Handle long press for FAB
  const handleFabPressStart = (e: React.TouchEvent | React.MouseEvent) => {
    // Only handle if it's a touch event on mobile, or if we're on desktop (for backward compatibility)
    if ('touches' in e || !isMobile) {
      setIsFabPressed(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      setStartTouchPosition({ x: clientX, y: clientY });
      longPressTimerRef.current = setTimeout(() => {
        setIsFabOpen(true);
        setIsFabPressed(false);
      }, 500);
    }
  };

  const handleFabPressEnd = () => {
    setIsFabPressed(false);
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (isGliding && glideTarget) {
      const action = quickActions.find((action) => action.id === glideTarget);
      if (action) {
        handleFabAction(action);
      }
    }
    setIsGliding(false);
    setGlideTarget(null);
    setStartTouchPosition(null);
  };

  // Handle touch move for glide gesture
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isFabPressed && startTouchPosition && isFabOpen) {
      const touch = e.touches[0];
      setIsGliding(true);
      
      const elementFromPoint = document.elementFromPoint(touch.clientX, touch.clientY);
      const actionButton = elementFromPoint?.closest('button[data-action-id]');
      
      if (actionButton) {
        const actionId = actionButton.getAttribute('data-action-id');
        setGlideTarget(actionId);
        setHoveredFabItem(actionId);
      } else {
        setGlideTarget(null);
        setHoveredFabItem(null);
      }
    }
  };

  // Get fan position for FAB menu items - curved upward pattern
  const getFabMenuPosition = (index: number, total: number) => {
    const radius = 100;
    const startAngle = 225; // Start from bottom-left
    const endAngle = 315; // End at bottom-right
    const angleSpread = endAngle - startAngle;
    const step = total > 1 ? angleSpread / (total - 1) : 0;
    const angle = startAngle + (index * step);
    const rad = (angle * Math.PI) / 180;
    const x = Math.cos(rad) * radius;
    const y = Math.sin(rad) * radius;
    return {
      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      transitionDelay: `${index * 75}ms`
    };
  };

  return (
    <>
      {/* Dark Overlay for FAB Menu */}
      {isFabOpen && (
        <div
          className={`lg:hidden fixed inset-0 ${isDark ? 'bg-black/50' : 'bg-black/50'} z-40 transition-opacity duration-300`}
          onClick={() => setIsFabOpen(false)}
          onTouchStart={(e) => {
            e.preventDefault();
            setIsFabOpen(false);
          }}
        />
      )}

      {/* FAB positioned at bottom right */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        {/* FAB Menu Items */}
        <div ref={fabMenuRef} className="relative z-[60]">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const isPressed = pressedFabItem === action.id;
            const isHovered = hoveredFabItem === action.id;
            
            // Touch event handlers - always present for mobile compatibility
            const touchProps = {
              onTouchStart: () => setPressedFabItem(action.id),
              onTouchEnd: (e: React.TouchEvent) => {
                e.preventDefault();
                setPressedFabItem(null);
                setHoveredFabItem(null);
                handleFabAction(action);
              },
              onTouchCancel: () => {
                setPressedFabItem(null);
                setHoveredFabItem(null);
              },
              onTouchMove: (e: React.TouchEvent) => {
                const touch = e.touches[0];
                const elementFromPoint = document.elementFromPoint(touch.clientX, touch.clientY);
                const currentButton = e.currentTarget;
                
                if (elementFromPoint === currentButton || currentButton.contains(elementFromPoint)) {
                  setHoveredFabItem(action.id);
                } else {
                  setHoveredFabItem(null);
                }
              }
            };

            // Mouse event handlers - only on desktop
            const mouseProps = !isMobile ? {
              onMouseDown: () => setPressedFabItem(action.id),
              onMouseUp: () => {
                setPressedFabItem(null);
                handleFabAction(action);
              },
              onMouseEnter: () => setHoveredFabItem(action.id),
              onMouseLeave: () => {
                setPressedFabItem(null);
                setHoveredFabItem(null);
              }
            } : {};
            
            return (
              <button
                key={action.id}
                data-action-id={action.id}
                {...touchProps}
                {...mouseProps}
                className={`
                  absolute w-14 h-14 rounded-full shadow-xl flex items-center justify-center
                  transition-all duration-300 ease-out text-white border ${isDark ? 'border-white/20' : 'border-white/20'}
                  ${isFabOpen ? 'opacity-100 scale-100 pointer-events-auto visible' : 'opacity-0 scale-0 pointer-events-none invisible'}
                  ${action.color} touch-manipulation select-none z-61
                  ${isPressed ? 'scale-150 h-16 w-16 brightness-125 shadow-2xl ring-4 ring-white/30' : 
                    isHovered ? 'scale-125  w-[70px] h-[70px] brightness-110 shadow-xl' : 
                    'scale-100 brightness-100'}
                `}
                style={{
                  ...getFabMenuPosition(index, quickActions.length),
                  display: 'flex'
                }}
                aria-label={action.description}
              >
                <Icon className={`transition-all duration-200 ${isPressed || isHovered ? 'h-8 w-8' : 'h-6 w-6'}`} />
                
                {isPressed && (
                  <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-white rounded-full opacity-40 animate-ping" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Main FAB Button */}
        <button
          ref={fabButtonRef}
          onTouchStart={handleFabPressStart}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleFabPressEnd();
          }}
          onTouchMove={handleTouchMove}
          {...(!isMobile ? {
            onMouseDown: handleFabPressStart,
            onMouseUp: handleFabPressEnd,
            onMouseLeave: handleFabPressEnd
          } : {})}
          onClick={(e) => {
            e.stopPropagation();
            if (!isFabOpen && !isFabPressed) {
              setIsFabOpen(!isFabOpen);
            }
          }}
          className={`
            relative w-14 h-14 rounded-full flex items-center justify-center
            shadow-2xl transition-all duration-300 ease-out focus:outline-hidden focus:ring-4 focus:ring-white/20
            ${isFabOpen 
              ? 'bg-white text-black rotate-45 scale-110 shadow-white/20'
              : isFabPressed 
                ? 'bg-white text-black scale-125 shadow-white/40 ring-4 ring-white/30'
                : 'bg-white text-black hover:scale-105 hover:shadow-white/30'
            }
            touch-manipulation z-55
          `}
          aria-label={isFabOpen ? 'Close menu' : 'Open quick actions'}
        >
          <PlusIcon className="h-6 w-6" />
          
          {/* FAB glow effect */}
          <div className={`
            absolute inset-0 rounded-full bg-white transition-all duration-300 pointer-events-none
            ${isFabOpen 
              ? 'opacity-20 scale-150' 
              : isFabPressed 
                ? 'opacity-30 scale-175 animate-pulse' 
                : 'opacity-0 scale-100'
            }
          `} />
          
          {/* Progress ring for long press */}
          {isFabPressed && !isFabOpen && (
            <div className="absolute inset-0 rounded-full pointer-events-none">
              <svg 
                className="w-full h-full -rotate-90" 
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="white"
                  strokeWidth="3"
                  fill="transparent"
                  className="opacity-30"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="white"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray="283"
                  strokeDashoffset="283"
                  className="opacity-80"
                  style={{
                    strokeDashoffset: isFabPressed ? '0' : '283',
                    transition: 'stroke-dashoffset 500ms linear'
                  }}
                />
              </svg>
            </div>
          )}
        </button>
      </div>
    </>
  );
}