import { supabase, getMediaUrl } from './supabase';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  alt?: string;
  bucket?: string;
  filePath?: string;
}

/**
 * Process media URLs to ensure they work with CORS
 * Converts storage paths to proper signed URLs
 */
export const processMediaUrls = async (media?: MediaItem[]): Promise<MediaItem[]> => {
  if (!media || media.length === 0) return [];

  return Promise.all(
    media.map(async (item) => {
      // If URL is already a full URL, return as is
      if (item.url && (item.url.startsWith('http://') || item.url.startsWith('https://'))) {
        return item;
      }

      // If we have bucket and filePath, get proper URL
      if (item.bucket && item.filePath) {
        try {
          const url = await getMediaUrl(item.bucket, item.filePath);
          return { ...item, url };
        } catch (error) {
          console.error('Error processing media URL:', error);
          return item;
        }
      }

      return item;
    })
  );
};

/**
 * Get video source attributes for CORS-compliant video playback
 * Safari requires specific attributes and headers
 */
export const getVideoAttributes = () => ({
  crossOrigin: 'anonymous' as const,
  controls: true,
  playsInline: true,
  preload: 'metadata' as const,
  controlsList: 'nodownload' as any, // Safari specific
});

/**
 * Safari-specific video URL handler
 * Ensures URLs work properly on Safari with CORS headers
 */
export const getSafariVideoUrl = (url: string): string => {
  try {
    // Add timestamp to prevent caching issues on Safari
    const separator = url.includes('?') ? '&' : '?';
    const timestamp = new Date().getTime();
    return `${url}${separator}t=${timestamp}`;
  } catch (error) {
    console.error('Error processing Safari video URL:', error);
    return url;
  }
};

/**
 * Validate video URL and add retry logic
 * Safari needs extra validation
 */
export const validateVideoUrl = async (url: string, maxRetries = 3): Promise<boolean> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'cors',
        headers: {
          'Accept': 'video/*',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });
      
      // Safari returns different status codes, be more lenient
      return response.ok || response.status === 206 || response.status === 304;
    } catch (error) {
      console.warn(`Video validation attempt ${i + 1} failed:`, error);
      if (i < maxRetries - 1) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  return false;
};

/**
 * Handle video loading errors gracefully
 * Safari-specific error handling
 */
export const createVideoErrorHandler = (
  onError?: (error: Event) => void,
  onFallback?: () => void
) => {
  return (error: Event) => {
    console.error('Video loading error:', error);
    
    const video = error.target as HTMLVideoElement;
    if (video && video.error) {
      const errorCode = video.error.code;
      const errorMessage = {
        1: 'MEDIA_ERR_ABORTED - Video loading aborted',
        2: 'MEDIA_ERR_NETWORK - Network error occurred (Safari: check CORS)',
        3: 'MEDIA_ERR_DECODE - Video decode error (Safari: check video format)',
        4: 'MEDIA_ERR_SRC_NOT_SUPPORTED - Video format not supported (Safari: try MP4)',
      }[errorCode] || 'Unknown video error';
      
      console.error(errorMessage);
      
      // Safari specific: Try alternate video format
      if (errorCode === 4 && video.src) {
        console.warn('Safari: Attempting to load with different format');
        onFallback?.();
      }
    }
    
    onError?.(error);
    onFallback?.();
  };
};

/**
 * Ensure image URLs work with Safari
 * Add CORS headers and handle blob URLs
 */
export const processImageUrl = (url: string): string => {
  try {
    // If it's already a blob URL or data URL, return as-is
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      return url;
    }

    // For regular URLs, ensure CORS compatibility
    if (url.includes('supabase') || url.includes('cdn')) {
      // Add cache-busting parameter for Safari
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}v=${Math.random()}`;
    }

    return url;
  } catch (error) {
    console.error('Error processing image URL:', error);
    return url;
  }
};

/**
 * Check if we're on Safari browser
 */
export const isSafari = (): boolean => {
  try {
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes('safari') && !ua.includes('chrome') && !ua.includes('android');
  } catch {
    return false;
  }
};

/**
 * Check if media URL needs transformation for Safari
 */
export const needsSafariTransform = (url: string): boolean => {
  if (!isSafari()) return false;
  
  // URLs that need transformation on Safari
  return (
    url.includes('supabase') ||
    url.includes('storage') ||
    url.includes('blob')
  );
};

/**
 * Transform media URL specifically for Safari
 */
export const transformUrlForSafari = (url: string): string => {
  if (!needsSafariTransform(url)) return url;
  
  try {
    // Remove problematic parameters for Safari
    let transformedUrl = url.split('&token=')[0];
    transformedUrl = transformedUrl.split('&download=')[0];
    
    // Add Safari-specific headers as query params when possible
    const separator = transformedUrl.includes('?') ? '&' : '?';
    return `${transformedUrl}${separator}cache_bust=${Date.now()}`;
  } catch (error) {
    console.error('Error transforming URL for Safari:', error);
    return url;
  }
};

export default {
  processMediaUrls,
  getVideoAttributes,
  getSafariVideoUrl,
  validateVideoUrl,
  createVideoErrorHandler,
  processImageUrl,
  isSafari,
  needsSafariTransform,
  transformUrlForSafari,
};
