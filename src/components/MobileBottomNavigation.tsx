/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddEntryModal } from './AddEntryModal';
import {
  AcademicCapIcon,
  FolderOpenIcon,
  TrophyIcon,
  DocumentTextIcon,
  BriefcaseIcon
} from '../lib/icons';

interface FloatingActionMenuProps {
  className?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  hoverColor: string;
  description: string;
  entryType?: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'skills-assessment',
    label: 'Skills Assessment',
    icon: AcademicCapIcon,
    color: 'bg-emerald-500',
    hoverColor: 'hover:bg-emerald-600',
    description: 'Take skills assessment',
    entryType: 'skill'
  },
  {
    id: 'portfolio-entry',
    label: 'Add Activity',
    icon: FolderOpenIcon,
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    description: 'Add portfolio entry',
    entryType: 'academic'
  },
  {
    id: 'digital-badges',
    label: 'Digital Badges',
    icon: TrophyIcon,
    color: 'bg-amber-500',
    hoverColor: 'hover:bg-amber-600',
    description: 'View digital badges',
    entryType: 'badge'
  },
  {
    id: 'passport',
    label: 'Digital Passport',
    icon: DocumentTextIcon,
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
    description: 'View digital passport',
    entryType: 'certification'
  },
  {
    id: 'work-experience',
    label: 'Work Experience',
    icon: BriefcaseIcon,
    color: 'bg-teal-500',
    hoverColor: 'hover:bg-teal-600',
    description: 'Add work experience',
    entryType: 'work'
  }
];

export function FloatingActionMenu({ 
  className = ''
}: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEntryType, setSelectedEntryType] = useState<string | undefined>(undefined);
  const [pressedItem, setPressedItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on outside click / escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Disable body scroll when FAB menu is open
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      
      // Disable scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling and restore position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Get fan position for FAB menu items - curved upward pattern (same as mobile)
  const getFabMenuPosition = (index: number, total: number) => {
    const radius = 120; // Slightly larger radius for desktop
    const startAngle = 150; // Start from bottom-left
    const endAngle = 280; // End at bottom-right
    const angleSpread = endAngle - startAngle; // 90 degrees spread upward
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

  const handleActionClick = (action: QuickAction) => {
    if (action.id === 'digital-badges') {
      navigate('/badges');
      setIsOpen(false);
    } else if (action.id === 'passport') {
      navigate('/digital-passport');
      setIsOpen(false);
    } else if (action.id === 'skills-assessment') {
      navigate('/skills/add');
      setIsOpen(false);
    } else {
      // For other actions, open the add entry modal
      setSelectedEntryType(action.entryType);
      setShowAddModal(true);
      setIsOpen(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedEntryType(undefined);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="hidden lg:block fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          role="presentation"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Desktop FAB Container - Bottom Center */}
      <div ref={menuRef} className={`hidden lg:flex fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 ${className}`}>
        {/* FAB Menu Items - Fan out in curved pattern */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const isPressed = pressedItem === action.id;
            const isHovered = hoveredItem === action.id;
            
            return (
              <button
                key={action.id}
                onTouchStart={() => setPressedItem(action.id)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  setPressedItem(null);
                  setHoveredItem(null);
                  handleActionClick(action);
                }}
                onTouchCancel={() => {
                  setPressedItem(null);
                  setHoveredItem(null);
                }}
                onTouchMove={(e) => {
                  // Detect if finger is still over this element during touch move
                  const touch = e.touches[0];
                  const elementFromPoint = document.elementFromPoint(touch.clientX, touch.clientY);
                  const currentButton = e.currentTarget;
                  
                  if (elementFromPoint === currentButton || currentButton.contains(elementFromPoint)) {
                    setHoveredItem(action.id);
                  } else {
                    setHoveredItem(null);
                  }
                }}
                onMouseDown={() => setPressedItem(action.id)}
                onMouseUp={() => {
                  setPressedItem(null);
                  handleActionClick(action);
                }}
                onMouseEnter={() => setHoveredItem(action.id)}
                onMouseLeave={() => {
                  setPressedItem(null);
                  setHoveredItem(null);
                }}
                className={`
                  absolute w-16 h-16 rounded-full shadow-xl flex items-center justify-center
                  transition-all duration-300 ease-out text-white border-2 border-white/20
                  ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-0 pointer-events-none'}
                  ${action.color} touch-manipulation select-none
                  ${isPressed ? 'scale-150 brightness-125 shadow-2xl ring-4 ring-white/30' : 
                    isHovered ? 'scale-125 brightness-110 shadow-xl' : 
                    'scale-100 brightness-100'}
                `}
                style={isOpen ? getFabMenuPosition(index, quickActions.length) : { transform: 'translate(-50%, -50%)' }}
                aria-label={action.description}
                title={action.label}
              >
                <Icon className={`transition-all duration-200 ${isPressed || isHovered ? 'h-8 w-8' : 'h-7 w-7'}`} />
                
                {/* Enhanced glow effect for hover/press states */}
                <div className={`
                  absolute inset-0 rounded-full transition-all duration-300 pointer-events-none
                  ${isPressed ? 'bg-white opacity-30 scale-150 animate-pulse' : 
                    isHovered ? 'bg-white opacity-20 scale-125' : 
                    'bg-white opacity-0 scale-100'}
                `} />
                
                {/* Ripple effect on press */}
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
          aria-label="Open quick actions"
          aria-expanded={isOpen ? 'true' : 'false'}
          className={`
            relative w-16 h-16 rounded-full flex items-center justify-center
            shadow-2xl transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-blue-300
            ${isOpen 
              ? 'bg-blue-700 text-white rotate-45 scale-110 shadow-blue-400/30' 
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-blue-400/20'
            }
          `}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className="relative block w-6 h-6">
            <span className="absolute left-1/2 top-0 -translate-x-1/2 w-0.5 h-6 bg-white rounded" />
            <span className="absolute top-1/2 left-0 -translate-y-1/2 w-6 h-0.5 bg-white rounded" />
          </span>
          
          {/* FAB glow effect */}
          <div className={`
            absolute inset-0 rounded-full bg-blue-400 transition-all duration-300 pointer-events-none
            ${isOpen ? 'opacity-20 scale-150' : 'opacity-0 scale-100'}
          `} />
        </button>
      </div>

      {/* Add Entry Modal */}
      <AddEntryModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        preselectedType={selectedEntryType}
      />
    </>
  );
}