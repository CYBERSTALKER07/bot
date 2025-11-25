import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { gsap } from 'gsap';
import { useTheme } from '../../context/ThemeContext';

interface CarouselItem {
  id: string | number;
  content: React.ReactNode;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  infinite?: boolean;
  itemsPerView?: number;
  spacing?: number;
  className?: string;
  onSlideChange?: (index: number) => void;
  animationDuration?: number;
  pauseOnHover?: boolean;
}

export default function Carousel({
  items,
  autoPlay = false,
  autoPlayInterval = 5000,
  showControls = true,
  showIndicators = true,
  infinite = true,
  itemsPerView = 1,
  spacing = 16,
  className = '',
  onSlideChange,
  animationDuration = 0.5,
  pauseOnHover = true
}: CarouselProps) {
  const { isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout>();
  const dragStartRef = useRef<number>(0);
  const dragEndRef = useRef<number>(0);

  // Calculate total slides considering items per view
  const totalSlides = Math.ceil(items.length / itemsPerView);
  const canGoNext = infinite || currentIndex < totalSlides - 1;
  const canGoPrev = infinite || currentIndex > 0;

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !isHovered && !isDragging && items.length > itemsPerView) {
      autoPlayRef.current = setInterval(() => {
        goToNext();
      }, autoPlayInterval);
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isPlaying, isHovered, isDragging, currentIndex, autoPlayInterval, items.length, itemsPerView]);

  // Animate to specific slide
  const animateToSlide = useCallback((index: number) => {
    if (!containerRef.current) return;

    const slideWidth = 100 / itemsPerView;
    const translateX = -index * slideWidth;

    gsap.to(containerRef.current, {
      x: `${translateX}%`,
      duration: animationDuration,
      ease: 'power2.out'
    });
  }, [itemsPerView, animationDuration]);

  // Navigation functions
  const goToNext = useCallback(() => {
    if (!canGoNext) return;
    
    let nextIndex = currentIndex + 1;
    if (infinite && nextIndex >= totalSlides) {
      nextIndex = 0;
    }
    
    setCurrentIndex(nextIndex);
    animateToSlide(nextIndex);
    onSlideChange?.(nextIndex);
  }, [currentIndex, totalSlides, infinite, canGoNext, animateToSlide, onSlideChange]);

  const goToPrev = useCallback(() => {
    if (!canGoPrev) return;
    
    let prevIndex = currentIndex - 1;
    if (infinite && prevIndex < 0) {
      prevIndex = totalSlides - 1;
    }
    
    setCurrentIndex(prevIndex);
    animateToSlide(prevIndex);
    onSlideChange?.(prevIndex);
  }, [currentIndex, totalSlides, infinite, canGoPrev, animateToSlide, onSlideChange]);

  const goToSlide = useCallback((index: number) => {
    if (index < 0 || index >= totalSlides) return;
    
    setCurrentIndex(index);
    animateToSlide(index);
    onSlideChange?.(index);
  }, [totalSlides, animateToSlide, onSlideChange]);

  // Touch/Mouse drag handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    dragStartRef.current = clientX;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    dragEndRef.current = clientX;
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    const dragDistance = dragStartRef.current - dragEndRef.current;
    const threshold = 50;
    
    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    
    setIsDragging(false);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      ref={carouselRef}
      className={`relative overflow-hidden rounded-lg ${className}`}
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div
        ref={containerRef}
        className="flex transition-transform duration-500 ease-out"
        style={{
          width: `${(100 * items.length) / itemsPerView}%`,
          gap: `${spacing}px`
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className="shrink-0 select-none"
            style={{ width: `${100 / items.length}%` }}
          >
            {item.content}
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {showControls && (canGoPrev || canGoNext) && (
        <>
          <button
            onClick={goToPrev}
            disabled={!canGoPrev}
            className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              isDark
                ? 'bg-dark-surface/80 text-dark-text hover:bg-dark-surface'
                : 'bg-white/80 text-gray-900 hover:bg-white'
            } ${
              !canGoPrev 
                ? 'opacity-50 cursor-not-allowed' 
                : 'opacity-80 hover:opacity-100 hover:scale-110'
            } shadow-lg`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={goToNext}
            disabled={!canGoNext}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              isDark
                ? 'bg-dark-surface/80 text-dark-text hover:bg-dark-surface'
                : 'bg-white/80 text-gray-900 hover:bg-white'
            } ${
              !canGoNext 
                ? 'opacity-50 cursor-not-allowed' 
                : 'opacity-80 hover:opacity-100 hover:scale-110'
            } shadow-lg`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Play/Pause Button */}
      {autoPlay && (
        <button
          onClick={togglePlayPause}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isDark
              ? 'bg-dark-surface/80 text-dark-text hover:bg-dark-surface'
              : 'bg-white/80 text-gray-900 hover:bg-white'
          } opacity-80 hover:opacity-100 hover:scale-110 shadow-lg`}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      )}

      {/* Indicators */}
      {showIndicators && totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? isDark
                    ? 'bg-lime scale-125'
                    : 'bg-asu-maroon scale-125'
                  : isDark
                  ? 'bg-dark-muted/50 hover:bg-dark-muted'
                  : 'bg-white/50 hover:bg-white/80'
              } backdrop-blur-sm shadow-xs`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar (for auto-play) */}
      {autoPlay && isPlaying && !isHovered && (
        <div className={`absolute bottom-0 left-0 h-1 ${
          isDark ? 'bg-dark-surface' : 'bg-white/30'
        } w-full`}>
          <div
            className={`h-full ${
              isDark ? 'bg-lime' : 'bg-asu-maroon'
            } transition-all duration-100`}
            style={{
              width: `${((Date.now() % autoPlayInterval) / autoPlayInterval) * 100}%`
            }}
          />
        </div>
      )}
    </div>
  );
}