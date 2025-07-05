import React, { useEffect, useRef } from 'react';
import { X, LucideIcon } from 'lucide-react';
import { gsap } from 'gsap';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  icon?: LucideIcon;
  animated?: boolean;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  icon: Icon,
  animated = true,
  className = ''
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl mx-4'
  };

  useEffect(() => {
    if (!animated) return;

    if (isOpen && overlayRef.current && modalRef.current) {
      // Entrance animation
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(modalRef.current, { scale: 0.8, opacity: 0, y: 50 });

      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });

      gsap.to(modalRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'back.out(1.7)',
        delay: 0.1
      });
    }
  }, [isOpen, animated]);

  const handleClose = () => {
    if (!animated) {
      onClose();
      return;
    }

    // Exit animation
    if (overlayRef.current && modalRef.current) {
      gsap.to(modalRef.current, {
        scale: 0.8,
        opacity: 0,
        y: 50,
        duration: 0.3,
        ease: 'power2.out'
      });

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
        delay: 0.1,
        onComplete: onClose
      });
    } else {
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`modal-content bg-white rounded-3xl shadow-2xl border border-gray-100 w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden ${className}`}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className="w-10 h-10 bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-full flex items-center justify-center">
                  <Icon className="h-5 w-5 text-white" />
                </div>
              )}
              {title && (
                <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
              >
                <X className="h-6 w-6 text-gray-400 group-hover:text-gray-600" />
              </button>
            )}
          </div>
        )}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
}