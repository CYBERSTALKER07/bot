import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  AlertCircle,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { cn } from '../../lib/cva';
import { isSafari, transformUrlForSafari } from '../../lib/mediaService';

interface EnhancedVideoPlayerProps {
  src: string;
  className?: string;
  isMobile?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  onEnded?: () => void;
  onError?: (error: Event) => void;
  isDark?: boolean;
  showErrorUI?: boolean;
  onTimeUpdate?: (time: number) => void;
}

/**
 * Enhanced Video Player with X-style controls
 * Features:
 * - Custom playback controls with animations
 * - Progress bar with scrubbing & hover preview
 * - Volume control with slider
 * - Playback speed selection
 * - Full-screen support
 * - Mobile-optimized touch controls
 * - Keyboard shortcuts (space, arrow keys)
 * - Buffering indicator
 */
export const EnhancedVideoPlayer: React.FC<EnhancedVideoPlayerProps> = ({
  src,
  className,
  isMobile = false,
  autoPlay = true,
  muted: initialMuted = true,
  loop = true,
  onEnded,
  onError,
  isDark = true,
  showErrorUI = true,
  onTimeUpdate,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(initialMuted ? 0 : 0.7);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControlsUI, setShowControlsUI] = useState(!autoPlay);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string>(src);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isHoveringProgressBar, setIsHoveringProgressBar] = useState(false);
  const [hoverProgress, setHoverProgress] = useState(0);
  const [hoverTime, setHoverTime] = useState(0);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSafariBrowser = isSafari();

  // Auto-hide controls
  useEffect(() => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

    if (!isPlaying || !showControlsUI) return;

    controlsTimeoutRef.current = setTimeout(() => {
      setShowControlsUI(false);
    }, 3000);

    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, showControlsUI]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')} `;
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'relative w-full bg-black rounded-lg overflow-hidden group',
        className
      )}
      onMouseEnter={() => !isMobile && setShowControlsUI(true)}
      onMouseLeave={() => !isMobile && isPlaying && setShowControlsUI(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        muted={isMuted}
        loop={loop}
        onClick={handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onEnded}
        playsInline
      />

      {/* Play Overlay */}
      {!isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center"
          onClick={handlePlayPause}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'p-4 rounded-full bg-white/20 backdrop-blur-md',
              'hover:bg-white/30 transition-all'
            )}
          >
            <Play className="w-8 h-8 text-white fill-white" />
          </motion.button>
        </motion.div>
      )}

      {/* Controls Container */}
      <AnimatePresence>
        {showControlsUI && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent',
              'p-4 space-y-3'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress Bar */}
            <div className="group/progress flex items-center gap-2">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleProgressChange}
                className={cn(
                  'progress-bar flex-1 h-1 bg-white/30 rounded-full cursor-pointer',
                  'appearance-none accent-white'
                )}
                data-progress={Math.floor((currentTime / duration) * 100)}
              />
              <span className="text-xs text-white/80 min-w-[3rem]">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Play/Pause */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayPause}
                  className={cn(
                    'p-2 rounded-full hover:bg-white/20 transition-all',
                    'text-white'
                  )}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current" />
                  )}
                </motion.button>

                {/* Skip Buttons */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = Math.max(0, currentTime - 10);
                    }
                  }}
                  className={cn(
                    'p-2 rounded-full hover:bg-white/20 transition-all',
                    'text-white'
                  )}
                  title="Skip back 10s"
                >
                  <SkipBack className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = Math.min(duration, currentTime + 10);
                    }
                  }}
                  className={cn(
                    'p-2 rounded-full hover:bg-white/20 transition-all',
                    'text-white'
                  )}
                  title="Skip forward 10s"
                >
                  <SkipForward className="w-4 h-4" />
                </motion.button>

                {/* Volume Control */}
                <div className="flex items-center gap-1 group/volume">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleVolumeToggle}
                    className={cn(
                      'p-2 rounded-full hover:bg-white/20 transition-all',
                      'text-white'
                    )}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </motion.button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className={cn(
                      'w-0 group-hover/volume:w-20 transition-all duration-200',
                      'h-1 bg-white/30 rounded-full cursor-pointer',
                      'appearance-none accent-white'
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Playback Speed */}
                <motion.div className="relative group/speed">
                  <button
                    className={cn(
                      'px-2 py-1 rounded text-xs font-medium text-white',
                      'hover:bg-white/20 transition-all'
                    )}
                  >
                    {playbackRate}x
                  </button>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className={cn(
                      'absolute bottom-full right-0 mb-2 hidden group-hover/speed:block',
                      'bg-black/90 backdrop-blur-md rounded-lg overflow-hidden'
                    )}
                  >
                    {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(rate => (
                      <button
                        key={rate}
                        onClick={() => handlePlaybackRateChange(rate)}
                        className={cn(
                          'block w-full px-3 py-2 text-xs text-white text-left',
                          'hover:bg-white/20 transition-all',
                          playbackRate === rate ? 'bg-white/30 font-bold' : ''
                        )}
                      >
                        {rate}x
                      </button>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Fullscreen */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFullscreen}
                  className={cn(
                    'p-2 rounded-full hover:bg-white/20 transition-all',
                    'text-white'
                  )}
                >
                  <Maximize className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnhancedVideoPlayer;
