// Core UI Components
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Select } from './Select';
export { default as Textarea } from './Textarea';
export { default as Modal } from './Modal';
export { default as Spinner, LoadingDots, LoadingPulse } from './Spinner';
export { default as SearchBox } from './SearchBox';
export { default as StatusBadge, getStatusColor, getStatusIcon, getStatusEmoji } from './StatusBadge';
export { default as Avatar, AvatarGroup } from './Avatar';
export { default as Carousel } from './Carousel';

// Existing components (re-export for consistency)
export { Card, StatsCard, JobCard } from './Card';

// Grid components
export { BentoCard, BentoGrid } from './BentoGrid';
export { BentoDemo } from './BentoDemo';

// Performance components
export { LoadingSpinner, LoadingOverlay, Skeleton, LoadingCard } from './Loading';

// Optimized Image component with lazy loading
export { default as OptimizedImage } from './OptimizedImage';

// Skeleton Loaders - Comprehensive set for all components
export {
  Skeleton,
  PostCardSkeleton,
  JobCardSkeleton,
  ProfileSkeleton,
  ProfileHeaderSkeleton,
  ProfileTabsSkeleton,
  ProfilePostsSkeleton,
  ProfileSidebarSkeleton,
  LeftSidebarSkeleton,
  EventCardSkeleton,
  EventDetailsSkeleton,
  CompanyCardSkeleton,
  CompanyDetailsSkeleton,
  SearchResultsSkeleton,
  NotificationsSkeleton,
  MessagesSkeleton,
  JobDetailsSkeleton,
  ApplicationsSkeleton,
  ApplicantCardSkeleton,
  WhoToFollowItemSkeleton,
  FeedPageSkeleton,
  ExploreSidebarSkeleton,
  ResumeBuildeSkeleton,
  SettingsPageSkeleton,
  SkeletonListContainer,
  RightSidebarSearchSkeleton,
  RightSidebarJobsSkeleton,
  RightSidebarCompaniesSkeleton,
  RightSidebarWhoToFollowSkeleton,
  RightSidebarSkeleton,
  FeedRightSidebarSearchSkeleton
} from './Skeleton';