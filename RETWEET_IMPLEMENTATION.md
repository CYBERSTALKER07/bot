# X/Twitter-Style Retweet Implementation Guide

## Overview
This document describes the complete retweet feature implementation with X/Twitter-like design patterns, including simple retweets and quote retweets.

## Features Implemented

### 1. **Simple Retweet**
- One-click retweet functionality
- Shares the original post with your followers
- Updates retweet count in real-time
- Green highlight when retweeted

### 2. **Quote Retweet**
- Add your own comment to the original post
- Shows both your comment and the original post
- Creates a visual card displaying the original post
- Useful for adding context or commentary

### 3. **Retweet Header**
- Shows "User retweeted" above posts
- Helps users understand where posts came from
- Clickable link to the retweeting user's profile

### 4. **X-Like Design Elements**
- Hover dropdowns with options
- Green color for retweets (matching X/Twitter)
- Smooth animations and transitions
- Mobile and desktop responsive design

## Database Schema

### New Table: `post_retweets`
```sql
CREATE TABLE post_retweets (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_quote_retweet BOOLEAN DEFAULT FALSE,
  quote_content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id)
);
```

**Fields:**
- `post_id`: References the original post being retweeted
- `user_id`: The user who performed the retweet
- `is_quote_retweet`: Boolean flag for quote retweets
- `quote_content`: Optional text for quote retweets
- `UNIQUE(post_id, user_id)`: Ensures one retweet per user per post

## Components Created

### 1. **RetweetButton** (`src/components/RetweetButton.tsx`)
Main button component with dropdown menu for retweet options.

**Props:**
```typescript
interface RetweetButtonProps {
  postId: string;
  retweetsCount: number;
  hasRetweeted: boolean;
  onRetweet: (postId: string, withComment: boolean) => void;
  isMobile?: boolean;
}
```

**Features:**
- Dropdown menu on hover (desktop)
- Simple tap on mobile
- Shows retweet count
- Color changes when retweeted

### 2. **RetweetHeader** (`src/components/RetweetHeader.tsx`)
Displays retweet attribution above posts.

**Props:**
```typescript
interface RetweetHeaderProps {
  retweetedByName: string;
  retweetedById: string;
  isMobile?: boolean;
}
```

**Usage:**
```tsx
{post.is_retweet && post.retweeted_by && (
  <RetweetHeader
    retweetedByName={post.retweeted_by.name}
    retweetedById={post.retweeted_by.id}
    isMobile={isMobile}
  />
)}
```

### 3. **QuoteRetweetModal** (`src/components/QuoteRetweetModal.tsx`)
Modal for composing quote retweets with a preview of the original post.

**Props:**
```typescript
interface QuoteRetweetModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
  isSubmitting?: boolean;
}
```

**Features:**
- Original post preview in modal
- Character counter (280 max)
- Media attachment support
- User profile display

## Hooks Created

### `useRetweet.ts` - Custom React Query Hooks

#### `useCreateRetweet()`
Creates a new retweet.
```typescript
const mutation = useCreateRetweet();
await mutation.mutateAsync({
  postId: '123',
  userId: 'user-456',
  isQuoteRetweet: false
});
```

#### `useRemoveRetweet()`
Removes a retweet.
```typescript
const mutation = useRemoveRetweet();
await mutation.mutateAsync({
  postId: '123',
  userId: 'user-456'
});
```

#### `useRetweetStatus(postId, userId)`
Checks if user has retweeted a post.
```typescript
const { data: retweetStatus } = useRetweetStatus(postId, userId);
```

#### `usePostRetweets(postId)`
Gets all retweets for a post.
```typescript
const { data: retweets } = usePostRetweets(postId);
```

#### `useQuoteRetweets(postId)`
Gets only quote retweets for a post.
```typescript
const { data: quoteRetweets } = useQuoteRetweets(postId);
```

#### `useUserRetweets(userId)`
Gets all posts retweeted by a user.
```typescript
const { data: retweetedPostIds } = useUserRetweets(userId);
```

## Usage Examples

### Basic Integration in Feed Component

```tsx
import RetweetButton from './RetweetButton';
import RetweetHeader from './RetweetHeader';
import QuoteRetweetModal from './QuoteRetweetModal';

export default function Feed() {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const handleRetweet = (postId: string, withComment: boolean) => {
    if (withComment) {
      // Show quote retweet modal
      const post = posts.find(p => p.id === postId);
      setSelectedPost(post || null);
      setShowQuoteModal(true);
    } else {
      // Simple retweet
      createRetweet(postId);
    }
  };

  const handleQuoteSubmit = (content: string) => {
    createQuoteRetweet(selectedPost!.id, content);
    setShowQuoteModal(false);
  };

  return (
    <>
      {posts.map(post => (
        <div key={post.id}>
          {post.is_retweet && post.retweeted_by && (
            <RetweetHeader
              retweetedByName={post.retweeted_by.name}
              retweetedById={post.retweeted_by.id}
            />
          )}
          
          {/* Post content */}
          
          <RetweetButton
            postId={post.id}
            retweetsCount={post.retweets_count}
            hasRetweeted={post.has_retweeted}
            onRetweet={handleRetweet}
          />
        </div>
      ))}

      <QuoteRetweetModal
        post={selectedPost!}
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        onSubmit={handleQuoteSubmit}
      />
    </>
  );
}
```

## Styling & Design

### Color Scheme
- **Retweet Color**: `#10B981` (Green)
- **Hover State**: `#059669` (Darker Green)
- **Background Hover**: `rgba(16, 185, 129, 0.1)`

### Icons Used
- `Repeat2` - Retweet icon
- `Edit3` - Quote retweet icon
- `Send` - Submit button

### Responsive Design
- **Mobile**: Simplified single-tap button
- **Desktop**: Dropdown menu with options
- **Tablet**: Hybrid approach with larger touch targets

## Database Queries

### Get Retweet Count for a Post
```sql
SELECT COUNT(*) as retweet_count 
FROM post_retweets 
WHERE post_id = $1;
```

### Check if User Retweeted Post
```sql
SELECT EXISTS(
  SELECT 1 FROM post_retweets 
  WHERE post_id = $1 AND user_id = $2
) as has_retweeted;
```

### Get Quote Retweets for a Post
```sql
SELECT pr.*, u.full_name, u.username, up.avatar_url
FROM post_retweets pr
JOIN users u ON pr.user_id = u.id
JOIN profiles up ON u.id = up.user_id
WHERE pr.post_id = $1 
AND pr.is_quote_retweet = TRUE
ORDER BY pr.created_at DESC;
```

### Get Retweet Timeline (for user's feed)
```sql
SELECT p.*, pr.user_id as retweeted_by_id, u.full_name as retweeted_by_name
FROM posts p
JOIN post_retweets pr ON p.id = pr.post_id
JOIN users u ON pr.user_id = u.id
WHERE pr.user_id IN (SELECT following_id FROM user_connections WHERE follower_id = $1)
ORDER BY pr.created_at DESC;
```

## Animation Details

### Retweet Button Animations
```css
/* Hover effect */
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

/* Active state */
transform: scale(1.1);
box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);

/* Click state */
transform: scale(0.95);
```

### Modal Animations
```css
/* Fade in */
opacity: 0 → 1;
transform: scale(0.95) → scale(1);
duration: 200ms;

/* Dropdown animations */
opacity: 0 → 1;
transform: translateY(10px) → translateY(0);
```

## Accessibility Features

- **ARIA Labels**: `aria-label="Retweet post"`
- **Keyboard Navigation**: Tab through buttons
- **Color Contrast**: Meets WCAG AA standards
- **Haptic Feedback**: Vibration on mobile (optional)

## Performance Optimizations

1. **Query Caching**: React Query caches retweet status
2. **Debounced Updates**: Batch retweet count updates
3. **Optimistic UI**: Show changes immediately, sync with server
4. **Lazy Loading**: Load retweets on demand

## Error Handling

```typescript
try {
  await createRetweet(postId);
} catch (error) {
  if (error.code === 'UNIQUE_VIOLATION') {
    // Already retweeted
    showToast('Already retweeted this post');
  } else {
    // Network error
    showToast('Failed to retweet. Please try again.');
  }
}
```

## Testing

### Unit Tests
```typescript
describe('RetweetButton', () => {
  it('should show retweet options on hover', () => {
    // Test hover state
  });

  it('should call onRetweet with correct params', () => {
    // Test click handler
  });

  it('should display retweet count', () => {
    // Test count display
  });
});
```

### Integration Tests
```typescript
describe('Retweet Feature', () => {
  it('should create retweet and update count', async () => {
    // Test full flow
  });

  it('should remove retweet when clicked again', async () => {
    // Test toggle behavior
  });
});
```

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

1. **Retweet Analytics**: Show who retweeted and when
2. **Retweet Notifications**: Notify users when their post is retweeted
3. **Retweet Timeline**: Dedicated view for retweets
4. **Retweet Statistics**: Trending retweets
5. **Retweet Filters**: Filter posts by retweets only

## Troubleshooting

### Retweet Count Not Updating
- Check database triggers are running
- Verify React Query cache is invalidating
- Clear browser cache

### Quote Modal Not Showing
- Ensure QuoteRetweetModal is imported
- Check modal state management
- Verify z-index values

### Styling Issues
- Check Tailwind CSS is properly configured
- Verify dark mode classes are applied
- Check viewport for responsive breakpoints

## Related Documentation
- [Feed Component](./src/components/Feed.tsx)
- [Database Schema](./database/schema.sql)
- [React Query Setup](./src/hooks/useOptimizedQuery.ts)

