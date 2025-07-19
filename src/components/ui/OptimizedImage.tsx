import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  blurDataURL?: string;
  priority?: boolean;
  quality?: number;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  fallback,
  blurDataURL,
  priority = false,
  quality = 75,
  className = '',
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before the image is visible
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  // Generate optimized image URL (placeholder for actual CDN implementation)
  const getOptimizedSrc = (originalSrc: string, width?: number) => {
    // In a real app, you'd use a service like Cloudinary, ImageKit, or similar
    if (originalSrc.includes('clearbit.com') || originalSrc.includes('logo.clearbit.com')) {
      return `${originalSrc}?size=${width || 128}&format=webp&quality=${quality}`;
    }
    return originalSrc;
  };

  return (
    <div 
      ref={imgRef}
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      {/* Blur placeholder while loading */}
      {isLoading && blurDataURL && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110"
          aria-hidden="true"
        />
      )}

      {/* Loading skeleton */}
      {isLoading && !blurDataURL && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      )}

      {/* Main image */}
      {isInView && !hasError && (
        <img
          src={getOptimizedSrc(src)}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Fallback image */}
      {hasError && fallback && (
        <img
          src={fallback}
          alt={alt}
          className="w-full h-full object-cover opacity-75"
          loading="lazy"
        />
      )}

      {/* Error state */}
      {hasError && !fallback && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Failed to load</div>
        </div>
      )}
    </div>
  );
}