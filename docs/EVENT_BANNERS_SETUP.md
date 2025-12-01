e# Event Banners Storage Fix

## Problem
Event banners are not being stored in the `event-banners` bucket because the bucket hasn't been created in your Supabase instance yet.

## Solution

### Step 1: Create the event-banners bucket in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Storage** section
3. Run the SQL script to create the bucket:
   - Open your Supabase SQL Editor
   - Copy and paste the contents of `database/setup-event-banners-bucket.sql`
   - Click **Run**

### Step 2: Verify the bucket was created

After running the SQL, you should see output showing:
```
id: event-banners
name: event-banners
public: true
size_limit_mb: 10
```

### Step 3: Configure RLS Policies in Supabase Dashboard

Since you may not have direct policy modification permissions, configure these policies through the Supabase Dashboard:

1. Go to **Storage** → **Policies** (in the event-banners bucket)
2. Click **New Policy**
3. Add these four policies:

**Policy 1: Users can upload**
```
INSERT
Condition: bucket_id = 'event-banners' AND auth.uid()::text = (storage.foldername(name))[1]
```

**Policy 2: Users can update their own**
```
UPDATE
Condition: bucket_id = 'event-banners' AND auth.uid()::text = (storage.foldername(name))[1]
```

**Policy 3: Users can delete their own**
```
DELETE
Condition: bucket_id = 'event-banners' AND auth.uid()::text = (storage.foldername(name))[1]
```

**Policy 4: Anyone can view**
```
SELECT
Condition: bucket_id = 'event-banners'
```

### Step 4: Test event banner upload

1. Go to your event creation form
2. Upload a test event banner image
3. The image should now upload successfully to the `event-banners` bucket

## What the configuration does

- **Creates the bucket**: `event-banners` with 10MB size limit
- **Sets it to public**: Anyone can view uploaded banners
- **Sets RLS policies**: 
  - Users can only upload to their own folder (`{user_id}/...`)
  - Users can update/delete their own uploads
  - Public can view all banners

## File Path Structure

Event banners are stored with this path:
```
event-banners/{user_id}/events/{timestamp}-{filename}
```

Example:
```
event-banners/550e8400-e29b-41d4-a716-446655440000/events/1761244199695-banner.jpg
```

The user ID must be the first folder level to pass the RLS security checks.
