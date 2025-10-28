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

export function ProfileHeaderSkeleton() {
  return (
    <div className="space-y-4">
      {/* Cover Photo Skeleton */}
      <Skeleton width="100%" height={192} className="rounded-none" />
      
      {/* Profile Info Section */}
      <div className="px-4 pb-4 space-y-4">
        {/* Avatar and Edit Button */}
        <div className="flex justify-between items-start -mt-16 mb-4">
          <Skeleton variant="circular" width={128} height={128} />
          <Skeleton width={120} height={36} className="rounded-full mt-4" />
        </div>
        
        {/* Name and Username */}
        <div className="space-y-2">
          <Skeleton width="40%" height={28} />
          <Skeleton width="30%" height={20} />
        </div>
        
        {/* Bio */}
        <div className="space-y-2">
          <Skeleton width="100%" height={16} />
          <Skeleton width="90%" height={16} />
        </div>
        
        {/* Metadata (Location, Join Date) */}
        <div className="flex gap-4">
          <Skeleton width={150} height={16} />
          <Skeleton width={150} height={16} />
        </div>
        
        {/* Following/Followers Stats */}
        <div className="flex gap-5">
          <Skeleton width={100} height={16} />
          <Skeleton width={100} height={16} />
        </div>
        
        {/* Verification Banner */}
        <Skeleton width="100%" height={100} className="rounded-xl" />
      </div>
    </div>
  );
}

export function ProfileTabsSkeleton() {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <div className="flex">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-1 px-4 py-4">
            <Skeleton width="70%" height={16} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfilePostsSkeleton() {
  return (
    <div className="space-y-0">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border-b border-gray-200 dark:border-gray-800 p-4">
          <div className="flex gap-3">
            {/* Avatar */}
            <Skeleton variant="circular" width={40} height={40} />
            
            {/* Content */}
            <div className="flex-1 space-y-3">
              {/* Header */}
              <div className="flex items-center gap-2">
                <Skeleton width="25%" height={16} />
                <Skeleton width="15%" height={14} />
                <Skeleton width="15%" height={14} />
              </div>
              
              {/* Post Text */}
              <div className="space-y-2">
                <Skeleton width="100%" height={16} />
                <Skeleton width="95%" height={16} />
                <Skeleton width="70%" height={16} />
              </div>
              
              {/* Image Placeholder */}
              <Skeleton width="100%" height={200} className="rounded-2xl" />
              
              {/* Action Buttons */}
              <div className="flex justify-between max-w-md">
                <Skeleton width={60} height={32} className="rounded-full" />
                <Skeleton width={60} height={32} className="rounded-full" />
                <Skeleton width={60} height={32} className="rounded-full" />
                <Skeleton width={60} height={32} className="rounded-full" />
                <Skeleton width={60} height={32} className="rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProfileSidebarSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Skeleton width="100%" height={40} className="rounded-full" />
      
      {/* "You might like" Section */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <Skeleton width="40%" height={20} />
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 space-y-2">
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1 space-y-2">
                  <Skeleton width="60%" height={14} />
                  <Skeleton width="40%" height={12} />
                </div>
              </div>
              <Skeleton width="30%" height={12} />
            </div>
          ))}
        </div>
      </div>
      
      {/* "What's Happening" Section */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <Skeleton width="50%" height={20} />
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 space-y-2">
              <Skeleton width="30%" height={12} />
              <Skeleton width="70%" height={14} />
              <Skeleton width="40%" height={12} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Industry Pulse Section */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <Skeleton width="40%" height={20} />
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 space-y-2">
              <div className="flex justify-between">
                <Skeleton width="40%" height={14} />
                <Skeleton width="20%" height={14} />
              </div>
              <Skeleton width="60%" height={12} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Profile Completion Card */}
      <Skeleton width="100%" height={140} className="rounded-2xl" />
    </div>
  );
}

export function LeftSidebarSkeleton() {
  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Skeleton width="100%" height={180} className="rounded-2xl" />
      
      {/* AI Career Coach */}
      <Skeleton width="100%" height={160} className="rounded-2xl" />
      
      {/* Industry Insights */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <Skeleton width="40%" height={20} />
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-3 space-y-2">
              <Skeleton width="60%" height={14} />
              <Skeleton width="70%" height={12} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Connections */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <Skeleton width="50%" height={20} />
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-3 flex items-center gap-3">
              <Skeleton variant="circular" width={32} height={32} />
              <div className="flex-1 space-y-1">
                <Skeleton width="60%" height={12} />
                <Skeleton width="40%" height={10} />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Settings and Logout Buttons */}
      <div className="space-y-2">
        <Skeleton width="100%" height={40} className="rounded-lg" />
        <Skeleton width="100%" height={40} className="rounded-lg" />
      </div>
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="p-3 rounded-3xl border border-gray-200 dark:border-gray-800">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Skeleton variant="circular" width={48} height={48} />
        
        {/* Content */}
        <div className="flex-1 space-y-2 min-w-0">
          <Skeleton width="70%" height={16} />
          <Skeleton width="50%" height={14} />
          <Skeleton width="40%" height={12} />
          <div className="flex gap-2 mt-2">
            <Skeleton width={60} height={20} className="rounded-full" />
            <Skeleton width={60} height={20} className="rounded-full" />
          </div>
        </div>
        
        {/* Attendees Count */}
        <Skeleton width={50} height={24} className="rounded-full flex-shrink-0" />
      </div>
    </div>
  );
}

export function EventDetailsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Banner Image */}
      <Skeleton width="100%" height={300} className="rounded-lg" />
      
      {/* Event Header */}
      <div className="px-4 space-y-4">
        {/* Title */}
        <Skeleton width="80%" height={32} />
        
        {/* Organizer Info */}
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="space-y-2 flex-1">
            <Skeleton width="40%" height={16} />
            <Skeleton width="50%" height={12} />
          </div>
        </div>
        
        {/* Event Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton width="50%" height={12} />
            <Skeleton width="70%" height={16} />
          </div>
          <div className="space-y-2">
            <Skeleton width="50%" height={12} />
            <Skeleton width="70%" height={16} />
          </div>
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton width="100%" height={16} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="70%" height={16} />
        </div>
        
        {/* Buttons */}
        <div className="flex gap-3">
          <Skeleton width="50%" height={44} className="rounded-lg" />
          <Skeleton width="50%" height={44} className="rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function CompanyCardSkeleton() {
  return (
    <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-800">
      <div className="flex items-start gap-3">
        {/* Logo */}
        <Skeleton variant="rectangular" width={48} height={48} className="rounded-lg flex-shrink-0" />
        
        {/* Company Info */}
        <div className="flex-1 space-y-2 min-w-0">
          <Skeleton width="60%" height={16} />
          <Skeleton width="70%" height={12} />
          <Skeleton width="50%" height={12} />
        </div>
      </div>
    </div>
  );
}

export function CompanyDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <Skeleton width="100%" height={200} className="rounded-lg" />
      
      {/* Company Header */}
      <div className="px-4 space-y-4">
        {/* Logo and Title */}
        <div className="flex items-start gap-4">
          <Skeleton variant="rectangular" width={80} height={80} className="rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton width="60%" height={28} />
            <Skeleton width="40%" height={16} />
            <div className="flex gap-2">
              <Skeleton width={80} height={24} className="rounded-full" />
              <Skeleton width={80} height={24} className="rounded-full" />
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton width="100%" height={12} />
              <Skeleton width="80%" height={16} />
            </div>
          ))}
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton width="30%" height={16} />
          <Skeleton width="100%" height={14} />
          <Skeleton width="100%" height={14} />
          <Skeleton width="60%" height={14} />
        </div>
      </div>
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-2 max-h-80 overflow-y-auto">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50">
          {/* Avatar */}
          <Skeleton variant="circular" width={40} height={40} />
          
          {/* Content */}
          <div className="flex-1 space-y-2 min-w-0">
            <Skeleton width="50%" height={14} />
            <Skeleton width="70%" height={12} />
            <Skeleton width="40%" height={11} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NotificationsSkeleton() {
  return (
    <div className="space-y-0">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex gap-3">
            {/* Avatar */}
            <Skeleton variant="circular" width={40} height={40} />
            
            {/* Content */}
            <div className="flex-1 space-y-2">
              <Skeleton width="60%" height={14} />
              <Skeleton width="100%" height={12} />
              <Skeleton width="80%" height={12} />
              <Skeleton width="30%" height={10} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MessagesSkeleton() {
  return (
    <div className="flex gap-4 h-full">
      {/* Conversations List */}
      <div className="w-72 border-r border-gray-200 dark:border-gray-800 space-y-2 p-4 overflow-y-auto">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-3 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex gap-3">
              <Skeleton variant="circular" width={40} height={40} />
              <div className="flex-1 space-y-2">
                <Skeleton width="60%" height={14} />
                <Skeleton width="100%" height={12} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex gap-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton width="40%" height={16} />
            <Skeleton width="30%" height={12} />
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={cn('flex', i % 2 === 0 ? 'justify-start' : 'justify-end')}>
              <Skeleton width="40%" height={32} className="rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function JobDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <Skeleton variant="rectangular" width={80} height={80} className="rounded-lg" />
          <div className="flex-1 space-y-3">
            <Skeleton width="70%" height={28} />
            <Skeleton width="50%" height={16} />
            <div className="flex gap-2">
              <Skeleton width={100} height={24} className="rounded-full" />
              <Skeleton width={100} height={24} className="rounded-full" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Details */}
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton width="60%" height={12} />
            <Skeleton width="100%" height={16} />
          </div>
        ))}
      </div>
      
      {/* Description */}
      <div className="space-y-3">
        <Skeleton width="30%" height={18} />
        <div className="space-y-2">
          <Skeleton width="100%" height={14} />
          <Skeleton width="100%" height={14} />
          <Skeleton width="100%" height={14} />
          <Skeleton width="70%" height={14} />
        </div>
      </div>
      
      {/* Requirements */}
      <div className="space-y-3">
        <Skeleton width="40%" height={18} />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} width="80%" height={12} />
          ))}
        </div>
      </div>
      
      {/* Action Button */}
      <Skeleton width="100%" height={48} className="rounded-lg" />
    </div>
  );
}

export function ApplicationsSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
          <div className="flex gap-3">
            {/* Avatar */}
            <Skeleton variant="circular" width={48} height={48} />
            
            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <Skeleton width="40%" height={16} />
                <Skeleton width={80} height={20} className="rounded-full" />
              </div>
              <Skeleton width="60%" height={12} />
              <Skeleton width="70%" height={12} />
              <div className="flex gap-2 mt-3">
                <Skeleton width={80} height={32} className="rounded-lg" />
                <Skeleton width={80} height={32} className="rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ApplicantCardSkeleton() {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
      <div className="flex gap-4">
        {/* Large Avatar */}
        <Skeleton variant="circular" width={80} height={80} />
        
        {/* Info */}
        <div className="flex-1 space-y-3">
          <Skeleton width="50%" height={18} />
          <Skeleton width="40%" height={14} />
          <div className="flex gap-2">
            <Skeleton width={70} height={20} className="rounded-full" />
            <Skeleton width={70} height={20} className="rounded-full" />
          </div>
          <Skeleton width="80%" height={12} />
        </div>
        
        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Skeleton width={100} height={36} className="rounded-lg" />
          <Skeleton width={100} height={36} className="rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function WhoToFollowItemSkeleton() {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Avatar */}
        <Skeleton variant="circular" width={40} height={40} />
        
        {/* Info */}
        <div className="flex-1 space-y-2 min-w-0">
          <Skeleton width="60%" height={14} />
          <Skeleton width="70%" height={12} />
        </div>
      </div>
      
      {/* Follow Button */}
      <Skeleton width={80} height={32} className="rounded-full flex-shrink-0 ml-2" />
    </div>
  );
}

export function FeedPageSkeleton() {
  return (
    <div className="space-y-0 divide-y divide-gray-200 dark:divide-gray-800">
      {[...Array(3)].map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ExploreSidebarSkeleton() {
  return (
    <div className="w-80 space-y-4">
      {/* Search */}
      <Skeleton width="100%" height={40} className="rounded-full" />
      
      {/* Companies Section */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <Skeleton width="40%" height={18} />
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {[...Array(3)].map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))}
        </div>
      </div>
      
      {/* Who to Follow Section */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <Skeleton width="50%" height={18} />
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {[...Array(3)].map((_, i) => (
            <WhoToFollowItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ResumeBuildeSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Sidebar */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} width="100%" height={44} className="rounded-lg" />
        ))}
      </div>
      
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton width="40%" height={20} />
            <Skeleton width="100%" height={16} />
            <Skeleton width="100%" height={16} />
            <Skeleton width="80%" height={16} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsPageSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton width="40%" height={20} />
          <div className="space-y-3">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                <Skeleton width="30%" height={16} />
                <Skeleton width={50} height={24} className="rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonListContainer({ count = 5, variant = 'post' }: { count?: number; variant?: 'post' | 'job' | 'company' | 'event' | 'notification' }) {
  const skeletonComponent = {
    post: PostCardSkeleton,
    job: JobCardSkeleton,
    company: CompanyCardSkeleton,
    event: EventCardSkeleton,
    notification: () => (
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <NotificationsSkeleton />
      </div>
    )
  }[variant];

  return (
    <div className="space-y-0 divide-y divide-gray-200 dark:divide-gray-800">
      {[...Array(count)].map((_, i) => (
        <div key={i}>
          {skeletonComponent && skeletonComponent()}
        </div>
      ))}
    </div>
  );
}

// Right Sidebar Search Results Skeleton
export function RightSidebarSearchSkeleton() {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg border bg-white dark:bg-black border-gray-200 dark:border-gray-700 z-50">
      <div className="divide-y max-h-80 overflow-y-auto divide-gray-200 dark:divide-gray-700">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50">
            {/* Avatar */}
            <Skeleton variant="circular" width={40} height={40} />
            
            {/* Content */}
            <div className="flex-1 space-y-2 min-w-0">
              <Skeleton width="50%" height={14} />
              <Skeleton width="70%" height={12} />
              <Skeleton width="40%" height={11} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Right Sidebar Jobs Section Skeleton
export function RightSidebarJobsSkeleton() {
  return (
    <div className="rounded-xl p-4 border bg-white dark:bg-black border-gray-200 dark:border-gray-700">
      <Skeleton width="40%" height={24} className="mb-4" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
            <div className="flex items-start space-x-3 mb-2">
              {/* Company Avatar */}
              <Skeleton variant="circular" width={40} height={40} />
              <div className="flex-1 space-y-2 min-w-0">
                <Skeleton width="70%" height={16} />
                <Skeleton width="50%" height={12} />
              </div>
            </div>
            {/* Location */}
            <Skeleton width="60%" height={12} className="mb-2" />
            {/* Tags */}
            <div className="flex gap-2">
              <Skeleton width={60} height={20} className="rounded-full" />
              <Skeleton width={60} height={20} className="rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton width="100%" height={36} className="rounded-lg mt-4" />
    </div>
  );
}

// Right Sidebar Companies Section Skeleton
export function RightSidebarCompaniesSkeleton() {
  return (
    <div className="rounded-xl p-4 border bg-white dark:bg-black border-gray-200 dark:border-gray-700">
      <Skeleton width="40%" height={24} className="mb-4" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
            <div className="flex items-start space-x-3">
              {/* Company Logo */}
              <Skeleton variant="rectangular" width={40} height={40} className="rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2 min-w-0">
                <Skeleton width="60%" height={16} />
                <Skeleton width="70%" height={12} />
                <Skeleton width="50%" height={11} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Skeleton width="100%" height={36} className="rounded-lg mt-4" />
    </div>
  );
}

// Right Sidebar Who to Follow Section Skeleton
export function RightSidebarWhoToFollowSkeleton() {
  return (
    <div className="rounded-xl p-4 border bg-black border-gray-700">
      <Skeleton width="40%" height={24} className="mb-4 bg-gray-800" />
      <div className="divide-y divide-gray-700 space-y-0">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-900/50 transition-colors">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Avatar */}
              <Skeleton variant="circular" width={40} height={40} className="bg-gray-800" />
              
              {/* Info */}
              <div className="flex-1 space-y-2 min-w-0">
                <Skeleton width="60%" height={14} className="bg-gray-800" />
                <Skeleton width="70%" height={12} className="bg-gray-800" />
              </div>
            </div>
            
            {/* Follow Button */}
            <Skeleton width={80} height={32} className="rounded-full flex-shrink-0 ml-2 bg-gray-800" />
          </div>
        ))}
      </div>
      <Skeleton width="100%" height={36} className="rounded-lg mt-4 bg-gray-800" />
    </div>
  );
}

// Combined Right Sidebar Skeleton
export function RightSidebarSkeleton() {
  return (
    <aside className="hidden xl:block w-[400px] border-l sticky top-0 h-screen mr-0 overflow-y-auto bg-white dark:bg-black border-gray-200 dark:border-gray-700">
      <div className="p-4 space-y-6">
        {/* Search Field */}
        <Skeleton width="100%" height={40} className="rounded-lg" />
        
        {/* Job Recommendations */}
        <RightSidebarJobsSkeleton />
        
        {/* Who to Follow */}
        <RightSidebarWhoToFollowSkeleton />
        
        {/* Recent Activity / Recommended Vacancies */}
        <div className="rounded-xl p-4 border bg-[#800020] border-gray-700">
          <Skeleton width="40%" height={24} className="mb-4 bg-white/20" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-2 rounded hover:bg-white/10 transition-colors">
                <Skeleton width="70%" height={16} className="mb-1 bg-white/20" />
                <Skeleton width="100%" height={12} className="mb-1 bg-white/20" />
                <Skeleton width="50%" height={11} className="bg-white/20" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} width={60} height={12} className="bg-gray-300 dark:bg-gray-700" />
            ))}
          </div>
          <Skeleton width="100%" height={11} className="bg-gray-300 dark:bg-gray-700" />
        </div>
      </div>
    </aside>
  );
}

// Feed Right Sidebar Section Skeleton (for use in Feed component during loading)
export function FeedRightSidebarSearchSkeleton() {
  return (
    <div className="p-4 space-y-6 animate-pulse">
      {/* Search Bar */}
      <div className="relative">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-gray-100 dark:bg-gray-900/50 border-gray-300 dark:border-gray-700">
          <Skeleton variant="circular" width={16} height={16} />
          <Skeleton width="70%" height={16} />
        </div>
      </div>

      {/* Search Dropdown Loading State */}
      <div className="rounded-lg shadow-lg border bg-white dark:bg-black border-gray-200 dark:border-gray-700">
        <div className="divide-y max-h-80 overflow-y-auto divide-gray-200 dark:divide-gray-700">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton variant="circular" width={40} height={40} />
              <div className="flex-1 space-y-2">
                <Skeleton width="50%" height={14} />
                <Skeleton width="70%" height={12} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Search Results Item Skeleton
export function SearchResultSkeleton() {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex gap-4">
        {/* Avatar */}
        <Skeleton variant="circular" width={56} height={56} />
        
        {/* Content */}
        <div className="flex-1 space-y-2 py-1">
          {/* Title and verified badge */}
          <div className="flex items-center gap-2">
            <Skeleton width="40%" height={16} />
          </div>
          
          {/* Subtitle */}
          <Skeleton width="25%" height={14} />
          
          {/* Description */}
          <div className="space-y-1 mt-1.5">
            <Skeleton width="100%" height={12} />
            <Skeleton width="80%" height={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Search Results List Skeleton
export function SearchResultsListSkeleton() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {[...Array(5)].map((_, i) => (
          <div key={i}>
            <SearchResultSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

// Search Page Sidebar Skeleton - Most Followed Users
export function SearchPageSidebarSkeleton() {
  return (
    <div className="hidden lg:block w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="p-4 sticky top-0">
        {/* Most Followed Box */}
        <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Skeleton width={20} height={20} />
              <Skeleton width="50%" height={20} />
            </div>
          </div>
          
          {/* Users List */}
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Avatar */}
                  <Skeleton variant="circular" width={40} height={40} />
                  
                  {/* Info */}
                  <div className="flex-1 space-y-2 min-w-0">
                    <Skeleton width="60%" height={14} />
                    <Skeleton width="70%" height={12} />
                  </div>
                </div>
                
                {/* Follow Button */}
                <Skeleton width={80} height={32} className="rounded-full flex-shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Complete Search Page Skeleton
export function SearchPageSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-black">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-800">
        {/* Search Header */}
        <div className="sticky top-0 z-49 border-b backdrop-blur-xl bg-white/95 dark:bg-black/95 border-gray-100 dark:border-gray-800">
          <div className="max-w-2xl mx-auto w-full px-4 py-3">
            {/* Search Bar */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-gray-100 dark:bg-black border border-gray-300 dark:border-gray-700">
              <Skeleton width={20} height={20} className="rounded" />
              <Skeleton width="70%" height={20} className="rounded" />
              <Skeleton width={20} height={20} className="rounded-full" />
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto w-full">
          <SearchResultsListSkeleton />
        </div>
      </div>

      {/* Right Sidebar Skeleton */}
      <SearchPageSidebarSkeleton />
    </div>
  );
}

// Post Details Skeleton
export function PostDetailsSkeleton() {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex space-x-3">
        {/* Author Avatar */}
        <Skeleton variant="circular" width={56} height={56} />
        
        {/* Post Content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Author Info */}
          <div className="flex items-center space-x-2">
            <Skeleton width="40%" height={20} />
            <Skeleton width="25%" height={16} />
          </div>
          
          {/* Post Text */}
          <div className="space-y-2">
            <Skeleton width="100%" height={18} />
            <Skeleton width="100%" height={18} />
            <Skeleton width="80%" height={18} />
          </div>
          
          {/* Media Placeholder */}
          <Skeleton width="100%" height={300} className="rounded-2xl" />
          
          {/* Metadata */}
          <div className="flex items-center space-x-4 py-3 border-t border-b border-gray-200 dark:border-gray-800">
            <Skeleton width={150} height={14} />
            <Skeleton width={120} height={14} />
            <Skeleton width={100} height={14} />
          </div>
          
          {/* Engagement Stats */}
          <div className="flex items-center space-x-6">
            <Skeleton width={120} height={14} />
            <Skeleton width={120} height={14} />
            <Skeleton width={120} height={14} />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-around py-3 border-t border-b border-gray-200 dark:border-gray-800">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} width={60} height={40} className="rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Comments Section Skeleton
export function CommentsSectionSkeleton() {
  return (
    <div className="space-y-4">
      {/* Comment Input Area */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex space-x-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton width="100%" height={32} className="rounded-lg" />
            <div className="flex space-x-2">
              <Skeleton width={80} height={28} className="rounded-lg" />
              <Skeleton width={80} height={28} className="rounded-lg" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Comment Items */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex space-x-3">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <Skeleton width="30%" height={14} />
                <Skeleton width="20%" height={12} />
              </div>
              <Skeleton width="100%" height={14} />
              <Skeleton width="90%" height={14} />
              <div className="flex items-center space-x-4 mt-2">
                <Skeleton width={60} height={12} />
                <Skeleton width={60} height={12} />
                <Skeleton width={60} height={12} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Full Post Details Page Skeleton
export function PostDetailsPageSkeleton({ isDark = false }) {
  return (
    <div className={cn(
      'min-h-screen',
      isDark ? 'bg-black text-white' : 'bg-white text-black'
    )}>
      {/* Header */}
      <div className={cn(
        'sticky top-0 z-10 backdrop-blur-xl border-b',
        isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
      )}>
        <div className="flex items-center justify-between px-24 py-3">
          <div className="flex items-center space-x-4">
            <Skeleton width={40} height={40} className="rounded-full" />
            <div className="space-y-2">
              <Skeleton width={100} height={20} />
              <Skeleton width={80} height={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex ml-36 mr-auto max-w-7xl">
        {/* Left Side - Post Content */}
        <div className="flex-1 max-w-2xl">
          <div className={cn(
            'border-x min-h-screen',
            isDark ? 'border-gray-800' : 'border-gray-200'
          )}>
            <PostDetailsSkeleton />
          </div>
        </div>

        {/* Right Sidebar - Comments (Desktop Only) */}
        <aside className={cn(
          'hidden lg:block w-96 border-l ml-3 rounded-2xl sticky top-0 h-screen overflow-y-auto p-4 space-y-4',
          isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'
        )}>
          <CommentsSectionSkeleton />
        </aside>
      </div>
    </div>
  );
}

// Post Details Header Skeleton
export function PostDetailsHeaderSkeleton() {
  return (
    <div className={cn(
      'sticky top-0 z-10 backdrop-blur-xl border-b',
      'bg-black/80 border-gray-800'
    )}>
      <div className="flex items-center justify-between px-24 py-3">
        <div className="flex items-center space-x-4">
          <Skeleton width={40} height={40} className="rounded-full" />
          <div className="space-y-2">
            <Skeleton width={100} height={20} />
            <Skeleton width={80} height={14} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact Post Details Skeleton (for sidebars)
export function CompactPostDetailsSkeleton() {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex space-x-3">
        {/* Avatar */}
        <Skeleton variant="circular" width={48} height={48} />
        
        {/* Content */}
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="100%" height={12} />
          <Skeleton width="100%" height={12} />
          <Skeleton width="80%" height={12} />
          <div className="flex space-x-2 mt-2">
            <Skeleton width={60} height={28} className="rounded-full" />
            <Skeleton width={60} height={28} className="rounded-full" />
            <Skeleton width={60} height={28} className="rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}