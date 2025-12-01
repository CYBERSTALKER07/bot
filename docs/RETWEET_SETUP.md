# Retweet Feature Setup Guide

## 🔧 Database Migration - IMPORTANT

Your application uses Supabase with UUID-based IDs for posts and auth users. The previous retweets table definition had incompatible integer types.

### Step 1: Run the Migration

Copy and run the contents of `/database/retweets-migration.sql` in your Supabase SQL Editor:

1. Go to your Supabase Dashboard
2. Open **SQL Editor**
3. Create a new query
4. Copy the entire contents of `database/retweets-migration.sql`
5. Click **Run**

The migration will:
- ✅ Drop any existing incorrect retweets table
- ✅ Create `post_retweets` table with proper UUID support
- ✅ Add proper foreign key constraints to `posts` and `auth.users`
- ✅ Create performance indexes
- ✅ Enable Row Level Security (RLS) policies
- ✅ Set up automatic retweet count triggers
- ✅ Add `retweets_count` column to posts table if missing

### Step 2: Verify the Migration

After running the migration, verify it worked by running this query in Supabase:

```sql
SELECT * FROM post_retweets LIMIT 1;
```

You should see the table structure with these columns:
- `id` (UUID)
- `post_id` (UUID)
- `user_id` (UUID)
- `is_quote_retweet` (BOOLEAN)
- `quote_content` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Step 3: Check for Errors

The most common errors and their solutions:

#### Error: "Column 'post_id' does not exist"
- **Solution**: Your posts table might not have the correct schema. Ensure you've run COMPLETE_SETUP.sql first.

#### Error: "Cannot create foreign key to auth.users"
- **Solution**: Check that your auth.users table exists in the auth schema.

#### Error: "Table already exists"
- **Solution**: The migration includes `DROP TABLE IF EXISTS`, so this shouldn't happen. If it does, run the migration again.

## 📱 React Component Integration

### Step 1: Import Components

In your Feed or post-related components, import the retweet components:

```tsx
import RetweetButton from './RetweetButton';
import RetweetHeader from './RetweetHeader';
import QuoteRetweetModal from './QuoteRetweetModal';
import { useCreateRetweet, useRemoveRetweet } from '../hooks/useRetweet';
```

### Step 2: Add State Management

```tsx
const [showQuoteModal, setShowQuoteModal] = useState(false);
const [selectedPostForQuote, setSelectedPostForQuote] = useState<Post | null>(null);
const createRetweetMutation = useCreateRetweet();
const removeRetweetMutation = useRemoveRetweet();
```

### Step 3: Handle Retweet Actions

```tsx
const handleRetweet = async (postId: string, withComment: boolean) => {
  if (!user) return;

  if (withComment) {
    // Show quote retweet modal
    const post = posts.find(p => p.id === postId);
    setSelectedPostForQuote(post || null);
    setShowQuoteModal(true);
  } else {
    // Simple retweet
    try {
      await createRetweetMutation.mutateAsync({
        postId,
        userId: user.id,
        isQuoteRetweet: false
      });
      
      // Update UI - optional if using React Query invalidation
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, has_retweeted: true, retweets_count: post.retweets_count + 1 }
          : post
      ));
    } catch (error) {
      console.error('Failed to retweet:', error);
      // Show error toast
    }
  }
};

const handleQuoteSubmit = async (content: string) => {
  if (!user || !selectedPostForQuote) return;

  try {
    // Create a quote retweet (which also creates a new post)
    await createRetweetMutation.mutateAsync({
      postId: selectedPostForQuote.id,
      userId: user.id,
      isQuoteRetweet: true,
      quoteContent: content
    });
    
    setShowQuoteModal(false);
    setSelectedPostForQuote(null);
    
    // Refresh posts list
    // await queryClient.invalidateQueries({ queryKey: ['posts'] });
  } catch (error) {
    console.error('Failed to quote retweet:', error);
  }
};
```

### Step 4: Render in Post Component

```tsx
{posts.map(post => (
  <div key={post.id} className="post-item">
    {/* Show retweet header if this is a retweet */}
    {post.is_retweet && post.retweeted_by && (
      <RetweetHeader
        retweetedByName={post.retweeted_by.name}
        retweetedById={post.retweeted_by.id}
        isMobile={isMobile}
      />
    )}
    
    {/* Post content */}
    <div>
      {/* ... post header, content, media ... */}
    </div>

    {/* Action buttons including retweet */}
    <div className="post-actions">
      {/* ... other buttons ... */}
      
      <RetweetButton
        postId={post.id}
        retweetsCount={post.retweets_count}
        hasRetweeted={post.has_retweeted}
        onRetweet={handleRetweet}
        isMobile={isMobile}
      />
      
      {/* ... other buttons ... */}
    </div>
  </div>
))}

{/* Quote retweet modal */}
{selectedPostForQuote && (
  <QuoteRetweetModal
    post={selectedPostForQuote}
    isOpen={showQuoteModal}
    onClose={() => {
      setShowQuoteModal(false);
      setSelectedPostForQuote(null);
    }}
    onSubmit={handleQuoteSubmit}
    isSubmitting={createRetweetMutation.isPending}
  />
)}
```

## 🚀 Testing the Feature

### Manual Testing

1. **Create a post** as User A
2. **Log in as User B**
3. **Click the retweet button** - should show green and count increases
4. **Click again** - should remove retweet (count decreases)
5. **Click retweet → Quote Retweet** - modal should open
6. **Add a comment** and submit - new post created with original quoted
7. **Check in database** - verify entries in `post_retweets` table

### Database Verification

Check retweets for a specific post:
```sql
SELECT pr.*, u.full_name, u.email
FROM post_retweets pr
LEFT JOIN auth.users u ON pr.user_id = u.id
WHERE pr.post_id = 'your-post-uuid'
ORDER BY pr.created_at DESC;
```

Check if user has retweeted a post:
```sql
SELECT EXISTS(
  SELECT 1 FROM post_retweets 
  WHERE post_id = 'post-uuid' 
  AND user_id = 'user-uuid'
) as has_retweeted;
```

## 📊 Troubleshooting

### Issue: Retweet count not updating
**Causes & Solutions:**
- Trigger not firing: Check that trigger `trigger_update_post_retweets_count` exists
  ```sql
  SELECT * FROM pg_trigger WHERE tgname = 'trigger_update_post_retweets_count';
  ```
- Column doesn't exist: Verify `retweets_count` column exists in posts table
  ```sql
  SELECT column_name FROM information_schema.columns 
  WHERE table_name='posts' AND column_name='retweets_count';
  ```

### Issue: RLS policy blocking retweet creation
**Solution:**
- Check RLS is enabled: `ALTER TABLE post_retweets ENABLE ROW LEVEL SECURITY;`
- Verify user ID is correct in policy
- Check auth context is passing correct user.id

### Issue: Cannot create retweet - "Foreign key violation"
**Solution:**
- Verify post exists: `SELECT id FROM posts WHERE id = 'your-post-id';`
- Verify user exists: `SELECT id FROM auth.users WHERE id = 'your-user-id';`
- Ensure correct UUID format (32 characters with hyphens)

### Issue: Quote retweet content not saving
**Solution:**
- Ensure `quote_content` is being passed to mutation
- Check TEXT column isn't being truncated (no length limit set, so shouldn't be an issue)

## 📚 API Reference

### useCreateRetweet()
```typescript
const mutation = useCreateRetweet();

await mutation.mutateAsync({
  postId: 'uuid-here',
  userId: 'uuid-here',
  isQuoteRetweet: false,
  quoteContent: 'Optional comment for quote retweet'
});
```

### useRemoveRetweet()
```typescript
const mutation = useRemoveRetweet();

await mutation.mutateAsync({
  postId: 'uuid-here',
  userId: 'uuid-here'
});
```

### useRetweetStatus(postId, userId)
```typescript
const { data: hasRetweeted, isLoading } = useRetweetStatus(postId, userId);
```

### usePostRetweets(postId)
```typescript
const { data: retweets } = usePostRetweets(postId);
// Returns array of all retweets for a post
```

## 🔒 RLS Security

The migration sets up these RLS policies:

| Action | Policy | Who Can |
|--------|--------|---------|
| SELECT | "Anyone can view retweets" | Everyone (public) |
| INSERT | "Users can create retweets" | Authenticated users (own ID) |
| DELETE | "Users can delete their own retweets" | Owner only |
| UPDATE | "Users can update their own retweets" | Owner only |

## �� Data Consistency

- **Unique constraint**: One user can only retweet a post once (`UNIQUE(post_id, user_id)`)
- **Cascade delete**: If a post is deleted, all its retweets are deleted
- **Cascade delete**: If a user is deleted, all their retweets are deleted
- **Automatic counts**: `retweets_count` on posts table is automatically maintained by triggers

## 🎨 Styling Customization

Edit the color scheme in RetweetButton component:
```tsx
// Current green theme (X/Twitter style)
text-green-500, text-green-400, bg-green-500/10

// To customize, change to your brand colors
text-[#YOUR_COLOR], bg-[#YOUR_COLOR]/10
```

## 📖 Related Files

- Components: `/src/components/RetweetButton.tsx`, `/src/components/RetweetHeader.tsx`, `/src/components/QuoteRetweetModal.tsx`
- Hooks: `/src/hooks/useRetweet.ts`
- Database: `/database/retweets-migration.sql`
- Documentation: `/RETWEET_IMPLEMENTATION.md`

## ✅ Checklist

- [ ] Migration file created
- [ ] Migration executed in Supabase
- [ ] `post_retweets` table verified
- [ ] Components imported in Feed
- [ ] State management added
- [ ] Handler functions implemented
- [ ] Components rendered in JSX
- [ ] Tested simple retweet
- [ ] Tested quote retweet
- [ ] Verified database entries
- [ ] Error handling tested
- [ ] RLS policies verified

## 🎉 You're Ready!

Your retweet feature is now fully integrated and ready to use!

