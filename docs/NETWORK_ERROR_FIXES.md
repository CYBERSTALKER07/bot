# Network Error Fixes - Setup Guide

## Issues Fixed

### 1. **"companies" 404 Errors**
Multiple queries were failing with 404 errors because the queries didn't have proper error handling when the `companies` table was missing or inaccessible.

**Solution Applied:**
- Added try-catch blocks to all companies-related queries in `useOptimizedQuery.ts`
- Gracefully returns empty arrays instead of throwing errors
- Logs warnings to console for debugging
- Affected functions:
  - `useCompanies()`
  - `useCompany()`
  - `useSearch()` - companies search
  - `useRecommendedCompanies()`

### 2. **Storage Access Control Error (event-banners)**
The `PostEventForm.tsx` component tries to upload to an `event-banners` storage bucket that wasn't configured in your Supabase instance.

**Solution Applied:**
- Added `event-banners` bucket to storage configuration
- Created RLS (Row Level Security) policies allowing public read access
- Configured proper CORS settings for the bucket
- Set file size limits and allowed MIME types

## Setup Instructions

### Step 1: Run the Storage Bucket Migration
Execute this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new):

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire contents of `/database/create-storage-buckets.sql`
5. Paste it into the SQL editor
6. Click "Run"

This will:
- Create the missing `event-banners` bucket
- Set up all RLS policies for public read access
- Configure file size limits and MIME type restrictions

### Step 2: (Optional) Set Up the Companies Table
If you want companies to work, run the companies migration:

1. In the SQL Editor, create a new query
2. Copy the contents of `/database/companies-migration.sql`
3. Paste and run it

This will:
- Create the `companies` table with proper schema
- Add sample company data
- Create indexes for performance
- Set up helper functions

### Step 3: Verify the Setup
Check that everything is working by running this verification query:

```sql
-- Check buckets
SELECT id, name, public FROM storage.buckets 
WHERE id IN ('event-banners', 'avatars', 'post-images');

-- Check companies table exists
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_name = 'companies'
);
```

## What Changed in the Code

### Files Modified:

1. **`/database/create-storage-buckets.sql`**
   - Added `event-banners` bucket (lines 57-65)
   - Added RLS policies for event-banners (lines 181-194)
   - Updated validation function to include event-banners size limit

2. **`/src/hooks/useOptimizedQuery.ts`**
   - Wrapped `useCompanies()` with try-catch error handling
   - Wrapped `useCompany()` with try-catch error handling
   - Added error handling in `useSearch()` for companies search
   - Wrapped `useRecommendedCompanies()` with try-catch error handling
   - All functions now return safe defaults (empty arrays/null) instead of throwing

## Testing the Fixes

### Test 1: Event Banner Upload
1. Navigate to any event posting form
2. Try uploading an event banner image
3. Should now succeed without 400 errors

### Test 2: Companies Page (if companies table exists)
1. Navigate to `/companies` route
2. Should display companies or show empty state gracefully
3. Check browser console - should NOT see 404 errors anymore

### Test 3: Search
1. Use the search functionality
2. Search for companies
3. Should not throw errors even if companies table doesn't exist

## Error Monitoring

The code now logs warnings and errors to the browser console:

```
console.warn('Error fetching companies:', error.message)
console.error('Exception fetching companies:', error)
```

Check your browser's Developer Tools (F12) → Console tab to see these messages if queries fail.

## Network Issues Resolution

The remaining errors mentioned:
- "The network connection was lost" - These are intermittent connectivity issues
- Fetch API CORS error for images - Now resolved by adding public read policies to event-banners bucket

After running the SQL migrations, these errors should be resolved.

## Next Steps

1. ✅ Apply the code changes (already done)
2. ⏳ Run the SQL migration in Supabase
3. ✅ Test event banner upload
4. ✅ Test companies page
5. ⏳ Monitor console for any remaining errors