import { cn } from '../../lib/cva';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({ 
  className, 
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-800',
        animation === 'pulse' && 'animate-pulse',
        animation === 'wave' && 'animate-shimmer',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded',
        variant === 'rectangular' && 'rounded-lg',
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}

export function PostCardSkeleton() {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex space-x-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <Skeleton width="40%" height={16} />
            <Skeleton width="30%" height={14} />
          </div>
          <div className="space-y-2">
            <Skeleton width="100%" height={14} />
            <Skeleton width="90%" height={14} />
            <Skeleton width="60%" height={14} />
          </div>
          <Skeleton width="100%" height={200} className="rounded-xl" />
          <div className="flex space-x-4">
            <Skeleton width={80} height={32} />
            <Skeleton width={80} height={32} />
            <Skeleton width={80} height={32} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
      <div className="flex items-start space-x-3 mb-3">
        <Skeleton variant="rectangular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" height={20} />
          <Skeleton width="40%" height={16} />
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <Skeleton width="100%" height={14} />
        <Skeleton width="80%" height={14} />
      </div>
      <div className="flex space-x-2">
        <Skeleton width={60} height={24} />
        <Skeleton width={60} height={24} />
        <Skeleton width={60} height={24} />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Skeleton width="100%" height={200} />
        <div className="absolute bottom-0 left-4 transform translate-y-1/2">
          <Skeleton variant="circular" width={120} height={120} />
        </div>
      </div>
      <div className="mt-16 space-y-3">
        <Skeleton width="40%" height={32} />
        <Skeleton width="60%" height={20} />
        <Skeleton width="80%" height={16} />
      </div>
    </div>
  );
}