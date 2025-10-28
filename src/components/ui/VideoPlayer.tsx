import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/cva';
import { createVideoErrorHandler, getVideoAttributes, isSafari, transformUrlForSafari } from '../../lib/mediaService';

interface VideoPlayerProps {
  src: string;
  alt?: string;
  className?: string;
  onError?: (error: Event) => void;
  isDark?: boolean;
  showErrorUI?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  alt = 'Video',
  className,
  onError,
  isDark = false,
  showErrorUI = true,
  autoPlay = true,
  muted = true,
  loop = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string>(src);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoAttributes = getVideoAttributes();
  const isSafariBrowser = isSafari();

  const handleVideoError = (error: Event) => {
    console.error('Video player error:', error);
    setHasError(true);
    setIsLoading(false);
    onError?.(error);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setHasError(false);
      setIsLoading(true);
      if (videoRef.current) {
        // For Safari, add cache busting on retry
        const retryUrl = isSafariBrowser 
          ? transformUrlForSafari(src) 
          : src;
        setVideoUrl(retryUrl);
        videoRef.current.src = retryUrl;
        videoRef.current.load();
      }
    }
  };

  // Handle URL transformation for Safari on mount and when src changes
  useEffect(() => {
    let finalUrl = src;
    
    if (isSafariBrowser) {
      finalUrl = transformUrlForSafari(src);
      console.log('Safari detected: transforming URL', { original: src, transformed: finalUrl });
    }
    
    setVideoUrl(finalUrl);
  }, [src, isSafariBrowser]);

  // Add CORS header to video requests
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.crossOrigin = 'anonymous';
      // Safari specific: Set media group to allow cross-origin playback
      if (isSafariBrowser) {
        videoRef.current.setAttribute('webkit-playsinline', 'true');
      }
    }
  }, [isSafariBrowser]);

  return (
    <div className={cn('relative w-full bg-black rounded-lg overflow-hidden', className)}>
      {/* Video Element */}
      <video
        ref={videoRef}
        key={videoUrl} // Force remount on URL change for Safari
        src={videoUrl}
        {...videoAttributes}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        onError={handleVideoError}
        onCanPlay={handleCanPlay}
        className={cn(
          'w-full h-full object-cover',
          isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'
        )}
        // Safari requires webkit prefixes
        data-testid="video-player"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Loading State */}
      {isLoading && !hasError && (
        <div className={cn(
          'absolute inset-0 flex items-center justify-center',
          isDark ? 'bg-black/50' : 'bg-gray-900/50'
        )}>
          <div className="animate-spin">
            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full" />
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && showErrorUI && (
        <div className={cn(
          'absolute inset-0 flex flex-col items-center justify-center gap-3 p-4',
          isDark ? 'bg-black/70' : 'bg-gray-900/70'
        )}>
          <AlertCircle className="w-8 h-8 text-red-400" />
          <div className="text-center">
            <p className="text-white text-sm font-medium mb-2">
              Unable to load video
            </p>
            <p className="text-white/60 text-xs mb-3">
              {isSafariBrowser && 'Safari browser detected. '}
              {retryCount > 0 ? `Retry attempt ${retryCount}/3` : 'Check your connection'}
            </p>
          </div>
          {retryCount < 3 && (
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs rounded-full transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          )}
        </div>
      )}

      {/* Retry exhausted message */}
      {hasError && retryCount >= 3 && showErrorUI && (
        <div className={cn(
          'absolute inset-0 flex items-center justify-center',
          isDark ? 'bg-black/70' : 'bg-gray-900/70'
        )}>
          <p className="text-white text-sm text-center px-4">
            Video unavailable. Please try again later or refresh the page.
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
