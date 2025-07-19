import React, { useEffect, useState } from 'react';
import { useAnimationPerformance, useReducedMotion } from '../../hooks/useScrollTrigger';

interface PerformanceMonitorProps {
  showInDev?: boolean;
  onPerformanceIssue?: (fps: number) => void;
}

export default function PerformanceMonitor({ 
  showInDev = true, 
  onPerformanceIssue 
}: PerformanceMonitorProps) {
  const { fps, shouldReduceAnimations } = useAnimationPerformance();
  const prefersReducedMotion = useReducedMotion();
  const [showMonitor, setShowMonitor] = useState(false);
  const [performanceIssues, setPerformanceIssues] = useState(0);

  // Show monitor only in development
  useEffect(() => {
    setShowMonitor(showInDev && process.env.NODE_ENV === 'development');
  }, [showInDev]);

  // Track performance issues
  useEffect(() => {
    if (shouldReduceAnimations) {
      setPerformanceIssues(prev => prev + 1);
      onPerformanceIssue?.(fps);
      
      // Reduce animation complexity globally
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
      document.documentElement.style.setProperty('--animation-easing', 'linear');
    } else {
      // Reset to normal animations
      document.documentElement.style.removeProperty('--animation-duration');
      document.documentElement.style.removeProperty('--animation-easing');
    }
  }, [shouldReduceAnimations, fps, onPerformanceIssue]);

  // Apply reduced motion preferences
  useEffect(() => {
    if (prefersReducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      document.documentElement.style.setProperty('--animation-delay', '0.01ms');
    }
  }, [prefersReducedMotion]);

  if (!showMonitor) return null;

  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white p-3 rounded-lg text-xs font-mono backdrop-blur-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span>FPS:</span>
          <span className={getPerformanceColor(fps)}>{fps}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Reduced:</span>
          <span className={prefersReducedMotion ? 'text-yellow-500' : 'text-gray-400'}>
            {prefersReducedMotion ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>Issues:</span>
          <span className={performanceIssues > 0 ? 'text-red-500' : 'text-green-500'}>
            {performanceIssues}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>Mode:</span>
          <span className={shouldReduceAnimations ? 'text-red-500' : 'text-green-500'}>
            {shouldReduceAnimations ? 'Low' : 'Normal'}
          </span>
        </div>
      </div>
    </div>
  );
}