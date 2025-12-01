# Component Reference Guide

Complete API documentation for all X-Style Feed Enhancement components.

## 1. EnhancedPostCardInteractions

**Location**: `src/components/EnhancedPostCardInteractions.tsx`

### Purpose
Provides X-style button interactions with ripple effects, spring animations, haptic feedback, and micro-interactions for post actions.

### Props Interface
```typescript
interface EnhancedPostCardInteractionsProps {
  postId: string;
  initialLikes: number;
  initialRetweets: number;
  initialReplies: number;
  initialBookmarks: number;
  isLiked?: boolean;
  isRetweeted?: boolean;
  isBookmarked?: boolean;
  onLike: (postId: string) => Promise<void>;
  onRetweet: (postId: string) => Promise<void>;
  onReply: (postId: string) => void;
  onShare: (postId: string) => void;
  onBookmark: (postId: string) => Promise<void>;
}
```

### Sub-Components

#### RippleEffect
```typescript
interface RippleEffectProps {
  x: number;
  y: number;
  size?: number;  // Default: 60
  duration?: number;  // Default: 600ms
}
```
- Creates expanding circular ripple from click point
- Automatic cleanup after animation completes
- Maximum 5 concurrent ripples

#### FloatingParticle
```typescript
interface FloatingParticleProps {
  x: number;
  y: number;
  emoji?: string;  // Default: "❤️"
  duration?: number;  // Default: 800ms
}
```
- Animates floating particles on like action
- Randomized horizontal drift (±20px)
- Fades out as it rises

#### EnhancedActionButton
```typescript
interface EnhancedActionButtonProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  isActive?: boolean;
  color?: string;  // Default: currentColor
  hoverColor?: string;  // Default: theme-based
  activeColor?: string;  // Default: action-specific
  onClick: () => void;
  onLongPress?: () => void;
  hapticPattern?: 'tap' | 'success' | 'warning';  // Default: 'tap'
  showCount?: boolean;  // Default: true
}
```
- Spring-based scale animation on press
- Color transition on state change
- Count increment with pop animation
- Long-press support for additional actions

### Usage Example
```tsx
<EnhancedPostCardInteractions
  postId={post.id}
  initialLikes={post.likes}
  initialRetweets={post.retweets}
  initialReplies={post.replies}
  initialBookmarks={post.bookmarks}
  isLiked={post.isLiked}
  isRetweeted={post.isRetweeted}
  isBookmarked={post.isBookmarked}
  onLike={async (id) => {
    await likePost(id);
    triggerHaptic('success');
  }}
  onRetweet={async (id) => {
    await retweetPost(id);
    triggerHaptic('success');
  }}
  onReply={(id) => navigateToReply(id)}
  onShare={(id) => sharePost(id)}
  onBookmark={async (id) => {
    await bookmarkPost(id);
    triggerHaptic('success');
  }}
/>
```

### Animation Configuration
```typescript
// Spring physics for button press
const springConfig = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
  mass: 0.8,
};

// Press state: 0.98 scale
// Hover state: 1.05 scale
// Idle state: 1.0 scale
```

### Events Emitted
- `onLike`: When like button pressed, returns `{ success: boolean, count: number }`
- `onRetweet`: When retweet button pressed
- `onReply`: When reply button pressed
- `onShare`: When share button pressed
- `onBookmark`: When bookmark button pressed

---

## 2. EnhancedVideoPlayer

**Location**: `src/components/EnhancedVideoPlayer.tsx`

### Purpose
Professional video player with custom controls, playback speed, volume control, and progress preview.

### Props Interface
```typescript
interface EnhancedVideoPlayerProps {
  src: string;
  poster?: string;  // Thumbnail URL
  title?: string;
  width?: number | string;  // Default: '100%'
  height?: number | string;  // Default: 'auto'
  autoplay?: boolean;  // Default: false
  loop?: boolean;  // Default: false
  muted?: boolean;  // Default: false
  controls?: boolean;  // Default: true
  preload?: 'none' | 'metadata' | 'auto';  // Default: 'metadata'
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onError?: (error: Error) => void;
  onLoadedMetadata?: (duration: number) => void;
}
```

### Sub-Components

#### PlaybackSpeedButton
```typescript
interface PlaybackSpeedButtonProps {
  currentSpeed: number;
  onChange: (speed: number) => void;
  speeds?: number[];  // Default: [0.5, 0.75, 1, 1.25, 1.5, 2]
}
```
- Dropdown menu with speed presets
- Shows current speed with checkmark
- Live playback speed adjustment

#### VolumeControl
```typescript
interface VolumeControlProps {
  volume: number;  // 0-1
  onChange: (volume: number) => void;
  isMuted?: boolean;
  onMuteToggle?: () => void;
}
```
- Slider with 0-100% range
- Mute/unmute toggle
- Volume icon changes based on level

#### ProgressBar
```typescript
interface ProgressBarProps {
  currentTime: number;
  duration: number;
  bufferedTime?: number;
  onSeek: (time: number) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  showPreview?: boolean;  // Default: true
}
```
- Scrubbing support on click/drag
- Hover preview shows seek time
- Buffered progress indicator
- Duration display

### Usage Example
```tsx
<EnhancedVideoPlayer
  src="https://example.com/video.mp4"
  poster="https://example.com/thumbnail.jpg"
  title="Video Title"
  width="100%"
  height={400}
  controls
  autoplay={false}
  onPlay={() => console.log('Playing')}
  onPause={() => console.log('Paused')}
  onTimeUpdate={(time) => console.log('Current:', time)}
  onError={(error) => console.error('Error:', error)}
/>
```

### Control Behavior
- **Auto-hide**: Controls hide after 3 seconds of inactivity
- **Show on hover**: Move mouse over video to reveal controls
- **Show on pause**: Always visible when video is paused
- **Mobile**: Controls always visible with larger touch targets

### Supported Formats
- MP4 (H.264 video codec)
- WebM (VP8/VP9 video codec)
- Ogg (Theora video codec)

### Error Handling
- Auto-retry: Up to 3 attempts with exponential backoff (1s, 2s, 5s)
- Safari URL transformation for CORS issues
- Network error detection and user notification
- Fallback to native controls if customization fails

---

## 3. ImageLightbox (Enhanced)

**Location**: `src/components/ImageLightbox.tsx`

### Purpose
Advanced image gallery with pinch-to-zoom, swipe navigation, and lightbox modal.

### Props Interface
```typescript
interface ImageLightboxProps {
  images: ImageItem[];
  initialIndex?: number;  // Default: 0
  isOpen: boolean;
  onClose: () => void;
  onImageChange?: (index: number) => void;
  allowDownload?: boolean;  // Default: true
  allowZoom?: boolean;  // Default: true
  maxZoom?: number;  // Default: 4
  minZoom?: number;  // Default: 1
  showThumbnails?: boolean;  // Default: true
}

interface ImageItem {
  src: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}
```

### Gestures Supported

#### Pinch-to-Zoom
- **Threshold**: > 1.5x pinch distance from previous
- **Range**: 1x (original) to 4x (max)
- **Center**: Zooms around finger center point
- **Momentum**: Zoom stops at next 0.5x increment

#### Swipe Navigation
- **Distance**: > 50px horizontal movement
- **Velocity**: > 0.1 px/ms considered as swipe
- **Direction**: Left swipe = next, Right swipe = previous
- **Wraps around**: Last image → first image

#### Mouse Wheel Zoom
- **Scroll up**: Zoom in
- **Scroll down**: Zoom out
- **Modifier**: Ctrl/Cmd + scroll for finer control
- **Increments**: 0.1x per wheel tick

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| Escape | Close lightbox |
| ArrowLeft | Previous image |
| ArrowRight | Next image |
| ArrowUp | Zoom in |
| ArrowDown | Zoom out |
| Home | First image |
| End | Last image |
| Ctrl/Cmd + S | Save/download image |

### Usage Example
```tsx
const [lightboxOpen, setLightboxOpen] = useState(false);
const [selectedIndex, setSelectedIndex] = useState(0);

const images = [
  { src: 'image1.jpg', alt: 'Image 1', caption: 'First image' },
  { src: 'image2.jpg', alt: 'Image 2', caption: 'Second image' },
];

// Trigger lightbox on click
<img
  src={images[0].src}
  onClick={() => {
    setSelectedIndex(0);
    setLightboxOpen(true);
  }}
/>

// Lightbox component
<ImageLightbox
  images={images}
  isOpen={lightboxOpen}
  onClose={() => setLightboxOpen(false)}
  onImageChange={setSelectedIndex}
  initialIndex={selectedIndex}
  allowDownload
  allowZoom
  showThumbnails
/>
```

### Features
- **Zoom Display**: Shows current zoom level (1x, 1.5x, 2x, etc.)
- **Thumbnail Strip**: Horizontally scrollable image thumbnails
- **Download Button**: Saves image as filename.jpg
- **Touch Detection**: Different UX for touch vs mouse
- **Loading State**: Placeholder while image loads
- **Error State**: Fallback UI if image fails to load

---

## 4. useScrollOptimizations Hook

**Location**: `src/hooks/useScrollOptimizations.ts`

### Purpose
Collection of hooks for scroll, loading, and list optimization.

### 1. useInfiniteScroll
```typescript
interface UseInfiniteScrollOptions {
  threshold?: number;  // Default: 0.1
  rootMargin?: string;  // Default: '100px'
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => Promise<void>;
}

const {
  sentinelRef,
  isLoadingMore,
  error,
} = useInfiniteScroll(options);
```

**Usage**:
```tsx
const { sentinelRef } = useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore: async () => {
    const newPosts = await fetchMorePosts();
    setPosts(prev => [...prev, ...newPosts]);
  },
});

return (
  <div>
    {posts.map(post => <Post key={post.id} {...post} />)}
    <div ref={sentinelRef} />  {/* Loading indicator here */}
  </div>
);
```

### 2. usePullToRefresh
```typescript
interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;  // Default: 60 (px)
  haptic?: boolean;  // Default: true
}

const {
  pullDistance,
  isPulling,
  containerRef,
} = usePullToRefresh(options);
```

**Usage**:
```tsx
const { containerRef, isPulling, pullDistance } = usePullToRefresh({
  onRefresh: async () => {
    const newPosts = await fetchLatestPosts();
    setPosts(newPosts);
  },
  threshold: 60,
  haptic: true,
});

return (
  <div ref={containerRef}>
    {isPulling && (
      <RefreshIndicator distance={pullDistance} />
    )}
    {posts.map(post => <Post key={post.id} {...post} />)}
  </div>
);
```

### 3. useVirtualizedList
```typescript
interface UseVirtualizedListOptions {
  items: any[];
  itemHeight: number;  // Exact height of each item
  containerHeight: number;  // Visible container height
  bufferSize?: number;  // Default: 5 items
  overscan?: number;  // Default: 3 items
}

const {
  visibleItems,
  offsetY,
  visibleStart,
  visibleEnd,
} = useVirtualizedList(options);
```

**Usage**:
```tsx
const { visibleItems, offsetY } = useVirtualizedList({
  items: posts,
  itemHeight: 280,  // Post height
  containerHeight: window.innerHeight,
  bufferSize: 5,
});

return (
  <div style={{ height: window.innerHeight, overflow: 'auto' }}>
    <div style={{ transform: `translateY(${offsetY}px)` }}>
      {visibleItems.map(post => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  </div>
);
```

### 4. useScrollDirection
```typescript
interface UseScrollDirectionOptions {
  threshold?: number;  // Default: 10 (px)
  delay?: number;  // Default: 50 (ms)
}

const {
  direction,  // 'up' | 'down'
  scrollY,
  containerRef,
} = useScrollDirection(options);
```

**Usage**:
```tsx
const { direction, containerRef } = useScrollDirection({
  threshold: 10,
  delay: 50,
});

return (
  <div ref={containerRef}>
    {direction === 'down' && <HideHeader />}
    {direction === 'up' && <ShowHeader />}
    {posts.map(post => <Post key={post.id} {...post} />)}
  </div>
);
```

---

## 5. EnhancedFAB Component

**Location**: `src/components/EnhancedFAB.tsx`

### Purpose
Floating Action Button with haptic feedback, swipe gestures, and menu animations.

### Props Interface
```typescript
interface EnhancedFABProps {
  actions: FabAction[];
  defaultAction?: FabAction;
  onActionClick: (actionId: string) => Promise<void>;
  position?: 'bottom-right' | 'bottom-left' | 'center';  // Default: 'bottom-right'
  theme?: 'light' | 'dark';  // Default: 'auto'
  hapticFeedback?: boolean;  // Default: true
  animationDuration?: number;  // Default: 300ms
}

interface FabAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color?: string;  // Default: primary
  onlyOnDesktop?: boolean;
  onClick: () => void;
}
```

### Haptic Patterns
```typescript
// Available patterns
type HapticPattern = 'tap' | 'success' | 'warning' | 'double' | 'pulse';

// Pattern vibration sequences (ms)
{
  tap: [10],
  success: [10, 20, 10],
  warning: [30, 20, 30, 20, 30],
  double: [10, 50, 10],
  pulse: [15, 15, 15],
}
```

### Gesture Recognition
```typescript
// Swipe-to-close detection
distance > 100px && direction === 'up'  // Closes menu
distance > 50px && direction === 'left'  // Navigates to tab
distance > 50px && direction === 'right'  // Navigates to previous tab

// Drag states
isDragging: boolean  // Currently being dragged
dragY: number  // Vertical offset in px
dragVelocity: number  // Pixels per millisecond
```

### Usage Example
```tsx
<EnhancedFAB
  actions={[
    {
      id: 'compose',
      label: 'Compose Post',
      icon: <PenIcon />,
      color: '#FFC627',
      onClick: () => setShowComposer(true),
    },
    {
      id: 'search',
      label: 'Search',
      icon: <SearchIcon />,
      onClick: () => navigateTo('/search'),
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: <MessageIcon />,
      onClick: () => navigateTo('/messages'),
    },
  ]}
  defaultAction={{ id: 'compose', label: 'Compose', icon: <PenIcon /> }}
  onActionClick={async (actionId) => {
    console.log('Action clicked:', actionId);
  }}
  position="bottom-right"
  hapticFeedback
/>
```

### Animation Details
```typescript
// Menu opening animation
MenuItems.staggerChildren = 50;  // 50ms between items
ScaleVariant = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
};

// Spring configuration
{
  type: 'spring',
  stiffness: 300,
  damping: 25,
  mass: 0.8,
}
```

### Events
- `onActionClick`: Action menu item clicked
- `onMenuOpen`: Menu opened (for analytics)
- `onMenuClose`: Menu closed (for analytics)
- `onDragStart`: User starts dragging FAB
- `onDragEnd`: User stops dragging FAB

---

## 6. Enhanced Skeleton Loader

**Location**: `src/components/Skeleton.tsx` (modified)

### CSS Classes Added
```css
.skeleton-wave::after {
  animation: skeleton-wave 1.5s infinite;
  background: linear-gradient(...);
}

@keyframes skeleton-wave {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### Usage
```tsx
<div className="skeleton-wave">
  {/* Placeholder content */}
</div>
```

### Customization
```css
/* Dark mode */
.dark .skeleton-wave {
  background-color: #2a2a2a;
}

/* Custom speed */
.skeleton-wave-fast::after {
  animation-duration: 1s;
}

.skeleton-wave-slow::after {
  animation-duration: 2s;
}
```

---

## Integration Checklist

- [ ] Create new component files in `/src/components/`
- [ ] Create `useScrollOptimizations.ts` in `/src/hooks/`
- [ ] Update `index.css` with animation keyframes
- [ ] Import components in Feed.tsx
- [ ] Wrap feed items with EnhancedPostCardInteractions
- [ ] Add infinite scroll sentinel with useInfiniteScroll
- [ ] Add pull-to-refresh container with usePullToRefresh
- [ ] Add EnhancedFAB at Feed page level
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Verify animations at 60 FPS
- [ ] Test accessibility (keyboard navigation, screen readers)
- [ ] Validate with reduced motion preferences

---

**Version**: 1.0.0  
**Last Updated**: November 18, 2025
