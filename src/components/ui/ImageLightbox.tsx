import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Share2 } from 'lucide-react';
import { cn } from '../../lib/cva';
import { useTheme } from '../../context/ThemeContext';

interface ImageLightboxProps {
  images: Array<{ url: string; alt?: string }>;
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onShare?: (imageUrl: string) => void;
}

export default function ImageLightbox({ 
  images, 
  initialIndex = 0, 
  isOpen, 
  onClose,
  onShare 
}: ImageLightboxProps) {
  const { isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [currentIndex, images.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [currentIndex]);

  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.5, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.5, 1));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          resetZoom();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrevious, handleZoomIn, handleZoomOut, resetZoom, onClose]);

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



  const handleDownload = useCallback(async () => {
    const image = images[currentIndex];
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, [images, currentIndex]);

  const handleDragEnd = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    // If zoomed out, detect swipe to change images
    if (scale === 1) {
      const threshold = 100;
      if (Math.abs(info.offset.x) > threshold) {
        if (info.offset.x > 0 && currentIndex > 0) {
          handlePrevious();
        } else if (info.offset.x < 0 && currentIndex < images.length - 1) {
          handleNext();
        }
      }
      // Reset position if not changing images
      setPosition({ x: 0, y: 0 });
    }
  }, [scale, currentIndex, images.length, handleNext, handlePrevious]);

  // Pinch-to-zoom for touch devices
  useEffect(() => {
    if (!isOpen || !imageRef.current) return;

    let initialDistance = 0;
    let initialScale = 1;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        initialScale = scale;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        const newScale = (currentDistance / initialDistance) * initialScale;
        setScale(Math.max(1, Math.min(4, newScale)));
      }
    };

    const element = imageRef.current;
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isOpen, scale]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop with blur */}
          <div 
            className={cn(
              'absolute inset-0 backdrop-blur-xl',
              isDark ? 'bg-black/95' : 'bg-black/90'
            )}
          />

          {/* Close Button */}
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={onClose}
            className={cn(
              'absolute top-4 right-4 z-10 p-3 rounded-full transition-all duration-200',
              'hover:scale-110 active:scale-95',
              isDark 
                ? 'bg-white/10 hover:bg-white/20 text-white' 
                : 'bg-black/20 hover:bg-black/30 text-white'
            )}
          >
            <X className="w-6 h-6" />
          </motion.button>

          {/* Top Controls Bar */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-4 left-4 right-20 z-10 flex items-center gap-3"
          >
            {/* Image Counter */}
            {images.length > 1 && (
              <div className={cn(
                'px-4 py-2 rounded-full text-sm font-medium backdrop-blur-xl',
                isDark ? 'bg-white/10 text-white' : 'bg-black/20 text-white'
              )}>
                {currentIndex + 1} / {images.length}
              </div>
            )}

            {/* Zoom Controls */}
            <div className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-xl',
              isDark ? 'bg-white/10' : 'bg-black/20'
            )}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                disabled={scale <= 1}
                title="Zoom out"
                aria-label="Zoom out"
                className={cn(
                  'p-2 rounded-full transition-all',
                  scale <= 1 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-white/20 active:scale-95'
                )}
              >
                <ZoomOut className="w-4 h-4 text-white" />
              </button>
              
              <span className="text-white text-sm font-medium min-w-12 text-center">
                {Math.round(scale * 100)}%
              </span>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                disabled={scale >= 4}
                title="Zoom in"
                aria-label="Zoom in"
                className={cn(
                  'p-2 rounded-full transition-all',
                  scale >= 4 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-white/20 active:scale-95'
                )}
              >
                <ZoomIn className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="ml-auto flex items-center gap-2">
              {onShare && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(currentImage.url);
                  }}
                  title="Share image"
                  aria-label="Share image"
                  className={cn(
                    'p-3 rounded-full backdrop-blur-xl transition-all',
                    'hover:scale-110 active:scale-95',
                    isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/20 hover:bg-black/30'
                  )}
                >
                  <Share2 className="w-5 h-5 text-white" />
                </button>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                title="Download image"
                aria-label="Download image"
                className={cn(
                  'p-3 rounded-full backdrop-blur-xl transition-all',
                  'hover:scale-110 active:scale-95',
                  isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/20 hover:bg-black/30'
                )}
              >
                <Download className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              {/* Previous Button */}
              <AnimatePresence>
                {currentIndex > 0 && (
                  <motion.button
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevious();
                    }}
                    title="Previous image"
                    aria-label="Previous image"
                    className={cn(
                      'absolute left-4 z-10 p-4 rounded-full backdrop-blur-xl transition-all',
                      'hover:scale-110 active:scale-95',
                      isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/20 hover:bg-black/30'
                    )}
                  >
                    <ChevronLeft className="w-8 h-8 text-white" />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Next Button */}
              <AnimatePresence>
                {currentIndex < images.length - 1 && (
                  <motion.button
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    title="Next image"
                    aria-label="Next image"
                    className={cn(
                      'absolute right-4 z-10 p-4 rounded-full backdrop-blur-xl transition-all',
                      'hover:scale-110 active:scale-95',
                      isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/20 hover:bg-black/30'
                    )}
                  >
                    <ChevronRight className="w-8 h-8 text-white" />
                  </motion.button>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Image Container */}
          <motion.div
            drag={scale > 1}
            dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
            dragElastic={0.1}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            className="relative max-w-[90vw] max-h-[90vh] cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
            style={{
              scale,
              x: position.x,
              y: position.y,
            }}
            animate={{
              scale,
              x: position.x,
              y: position.y,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <motion.img
              ref={imageRef}
              key={currentIndex}
              src={currentImage.url}
              alt={currentImage.alt || `Image ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg select-none"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              draggable={false}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (scale === 1) {
                  handleZoomIn();
                } else {
                  resetZoom();
                }
              }}
            />
          </motion.div>

          {/* Bottom Thumbnails (if multiple images) */}
          {images.length > 1 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={cn(
                'absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-3 rounded-2xl backdrop-blur-xl overflow-x-auto max-w-[90vw]',
                isDark ? 'bg-white/10' : 'bg-black/20'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setScale(1);
                    setPosition({ x: 0, y: 0 });
                  }}
                  title={`View image ${index + 1}`}
                  aria-label={`View image ${index + 1}`}
                  className={cn(
                    'relative w-16 h-16 rounded-lg overflow-hidden shrink-0 transition-all',
                    index === currentIndex
                      ? 'ring-2 ring-white scale-110'
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={image.url}
                    alt={image.alt || `Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Swipe Hint (mobile) */}
          {images.length > 1 && !isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/60 text-sm pointer-events-none"
            >
              Swipe to navigate
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
