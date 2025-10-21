# Follow Functionality Implementation Guide

## Overview

The follow functionality is fully implemented with Supabase backend integration. Users can follow/unfollow other users, with real-time follower/following counts and proper RLS (Row Level Security) policies.

## Database Schema

### Follows Table
```sql
CREATE TABLE public.follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);
```

### Profiles Table Enhancements
- `followers_count INTEGER DEFAULT 0` - Number of followers
- `following_count INTEGER DEFAULT 0` - Number of following

### Key Indexes for Performance
```sql
CREATE INDEX follows_follower_id_idx ON follows(follower_id);
CREATE INDEX follows_following_id_idx ON follows(following_id);
CREATE INDEX follows_created_at_idx ON follows(created_at DESC);
```

## Database Triggers

### Auto-update Follower/Following Counts
```sql
CREATE OR REPLACE FUNCTION public.update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    UPDATE public.profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
    INSERT INTO public.profile_activity (user_id, activity_type, activity_data)
    VALUES (NEW.follower_id, 'follow', jsonb_build_object('followed_user', NEW.following_id));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET following_count = GREATEST(following_count - 1, 0) WHERE id = OLD.follower_id;
    UPDATE public.profiles SET followers_count = GREATEST(followers_count - 1, 0) WHERE id = OLD.following_id;
    INSERT INTO public.profile_activity (user_id, activity_type, activity_data)
    VALUES (OLD.follower_id, 'unfollow', jsonb_build_object('unfollowed_user', OLD.following_id));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## RLS Policies

### Follows Table Policies
```sql
-- Users can view follows
CREATE POLICY "Users can view follows." ON follows FOR SELECT USING (true);

-- Users can follow others
CREATE POLICY "Users can follow others." ON follows FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = follower_id);

-- Users can unfollow others
CREATE POLICY "Users can unfollow others." ON follows FOR DELETE 
  USING (auth.uid() IS NOT NULL AND auth.uid() = follower_id);
```

## Backend Hooks

### 1. useFollowStatus
Check if current user follows a target user.

```typescript
const { data: isFollowing } = useFollowStatus(currentUserId, targetUserId);
```

**Features:**
- Returns boolean indicating follow status
- 5-minute cache with 15-minute garbage collection
- Only enabled when both IDs are provided

### 2. useFollowUser
Create a follow relationship.

```typescript
const followMutation = useFollowUser();
await followMutation.mutateAsync({
  followerId: currentUserId,
  followingId: targetUserId
});
```

**Features:**
- Automatic query invalidation for related data
- Invalidates: `followStatus`, `recommendedUsers`, `mostFollowedUsers`, `profile`
- Error handling built-in

### 3. useUnfollowUser
Remove a follow relationship.

```typescript
const unfollowMutation = useUnfollowUser();
await unfollowMutation.mutateAsync({
  followerId: currentUserId,
  followingId: targetUserId
});
```

**Features:**
- Same query invalidation as follow
- Automatic count updates

### 4. useMostFollowedUsers
Fetch the most popular users by follower count.

```typescript
const { data: topUsers } = useMostFollowedUsers(limit);
```

**Features:**
- Returns array of users with follower counts
- 30-minute cache, 1-hour garbage collection
- Sorted by follower count descending

## Frontend Components

### FollowButton Component

Reusable button component for follow/unfollow functionality.

```typescript
import FollowButton from '../components/FollowButton';

<FollowButton 
  targetUserId="user-id"
  variant="filled" // 'filled' | 'outlined' | 'text'
  size="medium" // 'small' | 'medium' | 'large'
  showLabel={true}
  onFollowChange={(isFollowing) => console.log(isFollowing)}
/>
```

**Props:**
- `targetUserId` (string, required) - ID of user to follow
- `variant` (string) - Button style variant
- `size` (string) - Button size
- `className` (string) - Additional CSS classes
- `showLabel` (boolean) - Show or hide follow/unfollow text
- `onFollowChange` (function) - Callback when follow status changes

**Features:**
- Displays "Follow" or "Following" state
- Loading state with spinner
- Auto-hides if viewing own profile
- Click event propagation handled
- Dark/light theme support

## Usage Examples

### Example 1: Profile Page
```typescript
import FollowButton from '../components/FollowButton';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage({ userId }) {
  const { user } = useAuth();
  
  return (
    <div>
      {/* Profile info */}
      <FollowButton 
        targetUserId={userId}
        onFollowChange={(isFollowing) => {
          // Refresh follower counts or other UI
        }}
      />
    </div>
  );
}
```

### Example 2: User Card Component
```typescript
export default function UserCard({ user }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3>{user.full_name}</h3>
        <p>{user.followers_count} followers</p>
      </div>
      <FollowButton 
        targetUserId={user.id}
        variant="outlined"
        size="small"
      />
    </div>
  );
}
```

### Example 3: Search Results
```typescript
import FollowButton from '../components/FollowButton';

export default function SearchResults({ users }) {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="flex justify-between items-center p-4">
          <div className="flex items-center gap-3">
            <img src={user.avatar_url} className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-semibold">{user.full_name}</p>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
          </div>
          <FollowButton targetUserId={user.id} />
        </div>
      ))}
    </div>
  );
}
```

### Example 4: Direct Hook Usage
```typescript
import { useFollowUser, useUnfollowUser, useFollowStatus } from '../hooks/useOptimizedQuery';

export default function AdvancedFollowButton({ targetUserId }) {
  const { user } = useAuth();
  const { data: isFollowing } = useFollowStatus(user?.id, targetUserId);
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  const handleToggle = async () => {
    if (isFollowing) {
      await unfollowMutation.mutateAsync({
        followerId: user.id,
        followingId: targetUserId
      });
    } else {
      await followMutation.mutateAsync({
        followerId: user.id,
        followingId: targetUserId
      });
    }
  };

  return (
    <button onClick={handleToggle}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}
```

## Query Invalidation Strategy

When a follow relationship changes, the following queries are automatically invalidated:

1. **followStatus** - Check if user follows another user
2. **recommendedUsers** - User recommendations may change
3. **mostFollowedUsers** - User ranks may change
4. **profile** - Follower/following counts update

This ensures all UI elements reflecting follow data stay in sync.

## Error Handling

### Try-Catch Example
```typescript
try {
  await followMutation.mutateAsync({
    followerId: userId,
    followingId: targetId
  });
} catch (error) {
  console.error('Failed to follow user:', error);
  // Show error message to user
  toast.error('Failed to follow user. Please try again.');
}
```

### Loading States
```typescript
const { isPending: isFollowing } = followMutation;

<Button disabled={isFollowing}>
  {isFollowing ? 'Following...' : 'Follow'}
</Button>
```

## Performance Considerations

1. **Indexed Queries** - Follower/following lookups use indexed columns for O(1) performance
2. **Query Caching** - 5-minute cache on follow status checks
3. **Batch Operations** - Most followed users query fetches multiple records efficiently
4. **Trigger-based Updates** - Automatic count updates via database triggers
5. **RLS Policies** - Efficient row-level security without extra queries

## Privacy & Security

- **RLS Policies** - Only authenticated users can follow
- **Self-follow Prevention** - Database constraint prevents self-follows
- **Duplicate Prevention** - Unique constraint prevents duplicate follows
- **Cascade Delete** - Follows deleted when users are deleted
- **Activity Logging** - All follow actions logged in profile_activity table

## Testing

### Test Follow Functionality
```typescript
// Test: User can follow another user
const { result } = renderHook(() => useFollowUser());
await act(async () => {
  await result.current.mutateAsync({
    followerId: 'user1',
    followingId: 'user2'
  });
});

// Test: Follow status is checked correctly
const { data: isFollowing } = useFollowStatus('user1', 'user2');
expect(isFollowing).toBe(true);

// Test: User can unfollow
const unfollow = renderHook(() => useUnfollowUser());
await act(async () => {
  await unfollow.result.current.mutateAsync({
    followerId: 'user1',
    followingId: 'user2'
  });
});
```

## Troubleshooting

### Issue: Follow button not updating
- Check if `onFollowChange` callback is being called
- Verify `useFollowStatus` hook is re-rendering
- Check browser console for errors

### Issue: Follower counts not syncing
- Verify database triggers are created
- Check RLS policies are enabled on profiles table
- Confirm `followers_count` and `following_count` columns exist

### Issue: Self-follow allowed
- Ensure CHECK constraint exists: `CHECK (follower_id != following_id)`
- Verify FollowButton hides when user views own profile

### Issue: Performance issues
- Check follows table indexes are created
- Monitor query performance in Supabase dashboard
- Consider caching follow lists if needed

## Future Enhancements

1. **Follow Recommendations** - ML-based user suggestions
2. **Mutual Follows** - Show when both users follow each other
3. **Block Users** - Prevent specific users from following
4. **Private Accounts** - Require approval to follow
5. **Follow Notifications** - Notify users of new followers
6. **Follow Requests** - For private accounts
7. **Follower Lists** - Export follower/following lists
8. **Analytics** - Track follow growth over time
