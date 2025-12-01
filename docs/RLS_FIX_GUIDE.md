# RLS Policies Fix - Access Control Errors

## Problem
You're seeing 400 errors with "access control checks" failing:
```
Fetch API cannot load https://wmpbjarrhbnvjzlszscc.supabase.co/rest/v1/jobs...
due to access control checks.
```

This happens when Row Level Security (RLS) policies are missing or incorrect.

## Solution - Apply RLS Policies

### Step 1: Open Supabase SQL Editor
1. Go to your **Supabase Dashboard**
2. Click **SQL Editor**
3. Click **New Query**

### Step 2: Run the RLS Policy Fix
1. Copy the entire contents of `/database/fix-rls-policies.sql`
2. Paste into the SQL Editor
3. Click **Run**

This will:
- ✅ Drop old/conflicting policies
- ✅ Enable RLS on all tables
- ✅ Create new, correct policies for:
  - `jobs` - Everyone can view, only employers can edit their own
  - `applications` - Students see own apps, employers see their job apps
  - `notifications` - Users only see their own
  - `follows` - Anyone can view, users control their own follows
  - `profiles` - Anyone can view, users edit their own
  - `posts` - Anyone can view public posts
  - `post_likes` - Anyone can view
  - `post_comments` - Anyone can view
  - `messages` - Users see messages they're involved in

### Step 3: Verify the Fix
Run this query to confirm policies are created:
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('jobs', 'applications', 'notifications', 'follows', 'profiles', 'posts')
ORDER BY tablename;
```

You should see multiple policies per table.

### Step 4: Test in Your App
1. Refresh your app
2. Navigate to `/employer/jobs`
3. Post a new job - should work now!
4. Check your feed - notifications should load

## If You Still See Errors

**Check 1: Network Connection**
- The errors mention "network connection was lost"
- This could be temporary - try refreshing the page

**Check 2: User ID Format**
- Make sure your user ID is a valid UUID
- Should look like: `44314a9f-be02-4a65-83b1-78b9a201f7b0`

**Check 3: Tables Exist**
- Verify all tables exist in Supabase:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Check 4: RLS Is Enabled**
- Verify RLS is enabled on each table:
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

## File Location
- **RLS Fix SQL**: `/database/fix-rls-policies.sql`

## What Changed

### Before (Broken)
```
jobs table - Missing "anyone can view jobs" policy
→ 400 error when fetching jobs
```

### After (Fixed)
```
jobs table - Has explicit SELECT policy allowing everyone to view
→ Jobs load successfully
```

The key change is making SELECT policies permissive while keeping INSERT/UPDATE/DELETE restrictive to owners.

## Next Steps

1. ✅ Apply the SQL from `/database/fix-rls-policies.sql`
2. ✅ Refresh your app
3. ✅ Try posting a job
4. ✅ Check if errors are gone

Let me know if you still see any 400 errors after applying this!
