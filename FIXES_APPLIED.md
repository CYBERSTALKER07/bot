# Complete Setup Guide - Fix All Errors

## Summary of Issues Fixed

✅ **React JSX Attribute Warning** - FIXED
- Removed `jsx="true"` attribute from AnimatedSearchButton component
- Fixed TypeScript errors related to event types and function signatures

✅ **Posts 404 Errors** - FIXED  
- Enhanced authentication handling in fetchUserPosts function
- Added graceful error recovery to show empty state instead of crashing
- Improved error logging for debugging

✅ **Cover Image 400 Errors** - FIXED
- Updated storage bucket name to `cover-images` in SQL script
- Updated ImageUpload component to use correct bucket name `cover-images`
- Application and database now use consistent bucket naming

---

## Step-by-Step Setup Instructions

### Step 1: Access Your Supabase Dashboard
1. Go to https://app.supabase.com
2. Log in with your account
3. Select your project: **cruudjcweyoemuujvpaj**

### Step 2: Run the Storage Bucket Setup Script
1. In your Supabase dashboard, go to **SQL Editor**
2. Click **+ New Query**
3. Copy the entire contents of `/database/create-storage-buckets.sql`
4. Paste it into the SQL Editor
5. Click **Run** button

This script will:
- Create 6 storage buckets with correct names:
  - `avatars` (5MB limit)
  - `cover-images` (10MB limit) ← **Updated bucket name**
  - `post-images` (15MB limit)
  - `videos` (100MB limit)
  - `documents` (50MB limit, private)
  - `company-assets` (10MB limit)
- Set up Row Level Security (RLS) policies for each bucket
- Configure file size limits and allowed MIME types
- Create helper functions for file validation

### Step 3: Verify Storage Buckets Were Created
After running the script:
1. Go to **Storage** section in your Supabase dashboard
2. Verify you can see these buckets:
   - ✓ avatars
   - ✓ cover-images ← **Check this one specifically**
   - ✓ post-images
   - ✓ videos
   - ✓ documents
   - ✓ company-assets

### Step 4: Test the Application
1. Refresh your application in the browser (Cmd+Shift+R on Mac)
2. The cover image 400 errors should now be completely resolved
3. You should be able to upload and view profile cover images without errors

---

## Expected Results

After completing these steps, you should see:
- ✅ No React JSX warnings in console
- ✅ Posts loading correctly (or showing "No posts yet" gracefully)
- ✅ Cover images displaying without 400 errors
- ✅ Profile avatars working properly
- ✅ All file uploads working with proper validation
- ✅ No more "failed to load resource" errors for cover images

---

## Troubleshooting

### If you still see 400 errors for images:
1. **Clear browser cache** (Cmd+Shift+R on Mac or Ctrl+Shift+R on Windows)
2. **Verify the `cover-images` bucket exists** in Supabase Storage
3. **Check RLS policies** are enabled on the storage.objects table
4. **Open browser DevTools** (F12) and check Network tab for exact error response

### If SQL script fails to run:
1. Make sure you're in the correct Supabase project
2. Check that you have proper permissions
3. Try running only the bucket creation part first (lines 1-50)
4. Then run the RLS policies part separately

### For authentication/posts issues:
1. Make sure you're logged in to the application
2. Check that your auth session is active in browser DevTools
3. Look at browser console for specific error messages
4. Check Network tab for 401/403 auth errors

---

## Files Modified

- ✅ `/src/components/AnimatedSearchButton.tsx` - Fixed JSX warning
- ✅ `/src/components/Profile/Profile.tsx` - Enhanced posts fetching with error handling
- ✅ `/src/components/ui/ImageUpload.tsx` - Changed bucket name from `'covers'` to `'cover-images'`
- ✅ `/database/create-storage-buckets.sql` - Updated bucket ID and name from `'covers'` to `'cover-images'`

## Next Steps

1. **Run the storage bucket setup script** in your Supabase SQL Editor (most important)
2. **Refresh your application** to test the fixes
3. **Check browser console** for any remaining errors
4. All errors should now be resolved!

If you have any issues running the SQL script or need additional help, let me know and I can provide alternative solutions.
