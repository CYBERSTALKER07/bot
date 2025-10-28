# Skeleton Loaders Implementation Guide

This guide explains how to use the comprehensive skeleton loader system implemented in your application.

## Overview

The skeleton loader system provides lightweight, placeholder UI components that display while data is loading. This improves perceived performance and creates a better user experience.

## Available Skeleton Components

### Base Skeleton Component

```typescript
import { Skeleton } from './components/ui';

// Basic usage
<Skeleton width={200} height={40} variant="rectangular" />
<Skeleton width={48} height={48} variant="circular" />
<Skeleton height={16} variant="text" />

// Props
- variant: 'text' | 'circular' | 'rectangular' (default: 'rectangular')
- width: string | number (e.g., "100%" or 200)
- height: string | number (e.g., "auto" or 40)
- animation: 'pulse' | 'wave' | 'none' (default: 'pulse')
- className: additional Tailwind classes
```

### Component-Specific Skeletons

#### Feed & Posts
- `PostCardSkeleton()` - Single post/retweet card
- `FeedPageSkeleton()` - Multiple posts (entire feed)
- `PostDetailSkeleton()` - Full post details page

#### Jobs
- `JobCardSkeleton()` - Individual job listing
- `JobDetailsSkeleton()` - Detailed job view
- `ApplicationsSkeleton()` - List of applications
- `ApplicantCardSkeleton()` - Applicant profile card

#### Profiles
- `ProfileSkeleton()` - Basic profile placeholder
- `ProfileHeaderSkeleton()` - Cover photo + profile header
- `ProfileTabsSkeleton()` - Profile navigation tabs
- `ProfilePostsSkeleton()` - User's posts list
- `ProfileSidebarSkeleton()` - Sidebar recommendations

#### Companies
- `CompanyCardSkeleton()` - Company listing card
- `CompanyDetailsSkeleton()` - Full company profile

#### Events
- `EventCardSkeleton()` - Event card (sidebar)
- `EventDetailsSkeleton()` - Full event details page

#### Other Features
- `SearchResultsSkeleton()` - Search dropdown results
- `NotificationsSkeleton()` - Notifications list
- `MessagesSkeleton()` - Chat interface
- `WhoToFollowItemSkeleton()` - Single recommendation
- `LeftSidebarSkeleton()` - Left sidebar content
- `ExploreSidebarSkeleton()` - Explore page sidebar
- `ResumeBuildeSkeleton()` - Resume builder form
- `SettingsPageSkeleton()` - Settings page sections

#### Utility
- `SkeletonListContainer()` - Generate multiple skeletons
  ```typescript
  <SkeletonListContainer count={5} variant="post" />
  <SkeletonListContainer count={3} variant="job" />
  <SkeletonListContainer count={4} variant="event" />
  ```

## Usage Patterns

### Pattern 1: Simple Loading State

```typescript
import { usePosts } from '../hooks/useOptimizedQuery';
import { PostCardSkeleton, FeedPageSkeleton } from './ui';

export function Feed() {
  const { data: posts, isLoading } = usePosts();

  if (isLoading) {
    return <FeedPageSkeleton />;
  }

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### Pattern 2: Incremental Loading

```typescript
import { PostCardSkeleton } from './ui';

export function Feed() {
  const { data: posts, isLoading } = usePosts();

  return (
    <div className="divide-y">
      {isLoading && <PostCardSkeleton />}
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### Pattern 3: Page Loading

```typescript
import { ProfileHeaderSkeleton, ProfilePostsSkeleton } from './ui';

export function ProfilePage() {
  const { data: profile, isLoading } = useProfile(userId);

  if (isLoading) {
    return (
      <div>
        <ProfileHeaderSkeleton />
        <ProfilePostsSkeleton />
      </div>
    );
  }

  return (
    <div>
      <ProfileHeader profile={profile} />
      <ProfilePosts posts={profile.posts} />
    </div>
  );
}
```

### Pattern 4: Sidebar Loading

```typescript
import { LeftSidebarSkeleton, FeedPageSkeleton } from './ui';

export function FeedWithSidebar() {
  const { isLoading: feedLoading } = usePosts();
  const { isLoading: sidebarLoading } = useRecommendedUsers();

  return (
    <div className="grid grid-cols-3">
      <aside>
        {sidebarLoading ? <LeftSidebarSkeleton /> : <Sidebar />}
      </aside>
      <main>
        {feedLoading ? <FeedPageSkeleton /> : <Feed />}
      </main>
    </div>
  );
}
```

### Pattern 5: Multiple Content Types

```typescript
import { JobDetailsSkeleton, ApplicationsSkeleton } from './ui';

export function JobApplications() {
  const { data: job, isLoading: jobLoading } = useJob(jobId);
  const { data: applications, isLoading: appLoading } = useApplications(jobId);

  return (
    <div className="grid grid-cols-2">
      <div>
        {jobLoading ? <JobDetailsSkeleton /> : <JobDetails job={job} />}
      </div>
      <div>
        {appLoading ? <ApplicationsSkeleton /> : <ApplicationList apps={applications} />}
      </div>
    </div>
  );
}
```

## Best Practices

### 1. Match Skeleton to Real Component
```typescript
// ✅ Good - skeleton matches card layout exactly
<PostCardSkeleton />
<PostCard post={post} />

// ❌ Avoid - skeleton doesn't match layout
<Skeleton width="100%" height={100} />
<PostCard post={post} />
```

### 2. Use Appropriate Variants
```typescript
// ✅ Good - correct variants used
<Skeleton variant="circular" width={40} height={40} /> {/* Avatar */}
<Skeleton variant="text" width="100%" height={16} /> {/* Title */}
<Skeleton variant="rectangular" width="100%" height={200} /> {/* Image */}

// ❌ Avoid - wrong variants
<Skeleton width={40} height={40} /> {/* Should be circular */}
```

### 3. Group Related Skeletons
```typescript
// ✅ Good - group header and content
<ProfileHeaderSkeleton />
<ProfilePostsSkeleton />

// ❌ Avoid - scattered unrelated skeletons
<Skeleton width="100%" height={40} />
<Skeleton width={80} height={20} />
```

### 4. Show Skeletons Only While Loading
```typescript
// ✅ Good - only show skeletons during loading
if (isLoading) return <PostCardSkeleton />;
return <PostCard post={post} />;

// ❌ Avoid - showing both
{isLoading && <PostCardSkeleton />}
{post && <PostCard post={post} />}
```

### 5. Respect Animation Settings
```typescript
// ✅ Good - animation consistent with theme
<Skeleton animation="pulse" /> {/* Default, smooth */}
<Skeleton animation="wave" /> {/* Shimmer effect */}
<Skeleton animation="none" /> {/* Static */}
```

## Dark Mode Support

All skeleton components automatically support dark mode through Tailwind classes:

```typescript
// Automatically adapts to light/dark theme
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-800', // Light gray in light mode, dark gray in dark mode
        animation === 'pulse' && 'animate-pulse',
        className
      )}
      {...props}
    />
  );
}
```

## Performance Considerations

1. **Lightweight** - Skeleton components are simple divs with minimal CSS
2. **No External Dependencies** - Uses only Tailwind CSS and built-in animations
3. **CSS Animations** - Uses performant CSS animations instead of JavaScript
4. **Memory Efficient** - Skeletons are replaced with real content immediately when loaded

## Customization

### Create Custom Skeleton

```typescript
import { Skeleton } from './ui';

export function CustomComponentSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* Your specific layout */}
      <Skeleton width="60%" height={20} />
      <Skeleton width="100%" height={16} />
      <Skeleton width="80%" height={16} />
    </div>
  );
}
```

### Add to Skeleton.tsx

```typescript
export function MyFeatureSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton width="100%" height={40} />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} width="100%" height={100} />
        ))}
      </div>
    </div>
  );
}
```

## Testing

When testing components with skeleton loaders:

```typescript
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

test('shows skeleton while loading', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  });

  render(
    <QueryClientProvider client={queryClient}>
      <Feed />
    </QueryClientProvider>
  );

  // Skeleton should be visible
  expect(screen.getByTestId('post-skeleton')).toBeInTheDocument();
});
```

## Migration Checklist

Use this checklist to add skeleton loaders to your pages:

- [ ] Feed page - `FeedPageSkeleton`
- [ ] Profile pages - `ProfileHeaderSkeleton` + `ProfilePostsSkeleton`
- [ ] Job listings - `JobCardSkeleton` with `SkeletonListContainer`
- [ ] Company details - `CompanyDetailsSkeleton`
- [ ] Event pages - `EventCardSkeleton` + `EventDetailsSkeleton`
- [ ] Search results - `SearchResultsSkeleton`
- [ ] Notifications - `NotificationsSkeleton`
- [ ] Messages - `MessagesSkeleton`
- [ ] Sidebars - `LeftSidebarSkeleton` / `ExploreSidebarSkeleton`
- [ ] Settings - `SettingsPageSkeleton`
- [ ] Resume builder - `ResumeBuildeSkeleton`

## Troubleshooting

### Skeletons not showing animation
- Check if CSS animations are enabled
- Ensure `animation` prop is set correctly
- Verify dark mode class names match your theme

### Skeleton size doesn't match content
- Compare skeleton layout to actual component
- Use `ProfileHeaderSkeleton` example as reference
- Test with actual data to compare heights

### Performance issues
- Reduce number of skeletons displayed
- Use `SkeletonListContainer` instead of individual loaders
- Check if CSS is being parsed correctly

## Examples by Feature

### Feed
```typescript
import { FeedPageSkeleton } from './ui';

const { data: posts, isLoading } = usePosts();
return isLoading ? <FeedPageSkeleton /> : <Feed posts={posts} />;
```

### Profile
```typescript
import { ProfileHeaderSkeleton, ProfilePostsSkeleton } from './ui';

const { data: profile, isLoading } = useProfile(userId);
return isLoading ? (
  <>
    <ProfileHeaderSkeleton />
    <ProfilePostsSkeleton />
  </>
) : (
  <Profile profile={profile} />
);
```

### Jobs
```typescript
import { SkeletonListContainer } from './ui';

const { data: jobs, isLoading } = useJobs();
return isLoading ? (
  <SkeletonListContainer count={5} variant="job" />
) : (
  <JobsList jobs={jobs} />
);
```

### Search
```typescript
import { SearchResultsSkeleton } from './ui';

const { data: results, isLoading } = useSearch(query);
return isLoading ? (
  <SearchResultsSkeleton />
) : (
  <SearchResults results={results} />
);
```

## Summary

The skeleton loader system provides:
- ✅ 25+ pre-built skeleton components
- ✅ Automatic dark mode support
- ✅ Performant CSS animations
- ✅ Easy customization
- ✅ Lightweight and no dependencies
- ✅ Improved user experience

Start using skeleton loaders to improve your app's perceived performance!
