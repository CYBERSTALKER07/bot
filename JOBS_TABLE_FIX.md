# Fix for "relation 'jobs' does not exist" Error

## Problem
You were getting the error: `ERROR: 42P01: relation "jobs" does not exist`

This happens because the jobs table hasn't been created in your Supabase database yet.

## Solution

### Step 1: Run the Database Migration

1. Go to your **Supabase Dashboard** → **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `/database/supabase-jobs-setup.sql`
4. Paste it into the SQL Editor
5. Click **"Run"** button

This will:
- Create the `jobs` table with proper UUID support
- Create the `applications` table
- Add all necessary indexes for performance
- Set up automatic triggers for application counting
- Enable Row Level Security (RLS) policies

### Step 2: Verify the Tables Were Created

Run this query to verify:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('jobs', 'applications');
```

You should see both `jobs` and `applications` tables listed.

### Step 3: Update Your Components (Already Done)

The following files have been updated to use the correct schema:
- ✅ `/src/hooks/useJobManagement.ts` - Fixed to use UUIDs and proper field names
- ✅ `/src/components/PostJob.tsx` - Ready to use
- ✅ `/src/components/EmployerJobsManagement.tsx` - Ready to use

## Key Changes Made

### Database Schema (UUID-based for Supabase)
```sql
jobs table:
- id: UUID (primary key)
- employer_id: UUID (references auth.users)
- title, company, description, location, type, salary_range
- requirements: TEXT[] (array)
- skills: TEXT[] (array)
- benefits, is_remote, experience_level, department, contact_email
- status: open/closed/draft
- applications_count, views_count (auto-updated)
- posted_at, updated_at (timestamps)
- deadline (optional application deadline)

applications table:
- id: UUID (primary key)
- job_id: UUID (references jobs)
- student_id: UUID (references auth.users)
- cover_letter, status, applied_at
- UNIQUE constraint on (job_id, student_id)
```

### What the Migration Does

1. **Creates Tables**: Uses `CREATE TABLE IF NOT EXISTS` so it's safe to run multiple times
2. **Sets Up Indexes**: For fast querying on:
   - `employer_id` - find jobs by employer
   - `status` - filter jobs by status
   - `posted_at` - sort by date
   - `job_id`, `student_id` - join applications

3. **Auto-Updates Counts**: 
   - When an application is created/deleted, `applications_count` updates automatically
   - When a job is modified, `updated_at` is set automatically

4. **Row Level Security (RLS)**:
   - Employers can only see/edit/delete their own jobs
   - Students can only see applications they created or jobs (all jobs readable)
   - Employers can manage applications for their jobs

## Testing After Setup

1. **Log in as an Employer**
2. Navigate to `/post-job`
3. Fill out the form:
   - Title: "Senior React Developer"
   - Company: "Your Company"
   - Location: "San Francisco, CA"
   - Type: "Full-time"
   - Salary: "$120k-150k"
   - Description: "Looking for experienced React developers..."
   - Requirements: "5+ years experience\nStrong TypeScript knowledge"
   - Skills: Add "React", "TypeScript", "Node.js"
   - Contact Email: "jobs@company.com"
4. Click "Post job"
5. You should see a success message
6. Navigate to `/employer/jobs` to see your posted job

## Troubleshooting

### Still Getting "relation 'jobs' does not exist"?

**Check 1**: Verify the migration ran successfully
- Go to Supabase SQL Editor
- Run: `SELECT * FROM jobs LIMIT 1;`
- If it errors, the table doesn't exist

**Check 2**: Make sure you're in the right database
- Supabase → Project Settings → Database
- Verify you're querying the correct database

**Check 3**: Try running the migration again
- Sometimes RLS policies prevent reads until they're set up
- Run the entire migration script from `supabase-jobs-setup.sql` again

### Getting "permission denied" errors?

This is likely an RLS (Row Level Security) issue.
- Make sure you're logged in as an employer
- Check that `auth.uid()` returns a value
- Verify RLS policies are enabled and correct

### Applications not counting?

- Check if the trigger is created: `SELECT * FROM pg_trigger WHERE tgname = 'trigger_update_job_applications_count';`
- If missing, rerun the migration

## File Locations

- **Migration SQL**: `/database/supabase-jobs-setup.sql`
- **Hook**: `/src/hooks/useJobManagement.ts`
- **Components**: 
  - `/src/components/PostJob.tsx`
  - `/src/components/EmployerJobsManagement.tsx`
- **Documentation**: `/POST_JOB_IMPLEMENTATION.md`

## Next Steps

After running the migration:

1. Add routes to your `App.tsx`:
```tsx
<Route path="/post-job" element={<PostJob />} />
<Route path="/employer/jobs" element={<EmployerJobsManagement />} />
```

2. Add navigation links to your Navigation component:
```tsx
<Link to="/post-job">Post a Job</Link>
<Link to="/employer/jobs">My Jobs</Link>
```

3. Test by posting a job and verifying it appears in your jobs dashboard

## Support

If you still have issues:
1. Check browser console for error messages
2. Look at Supabase logs for database errors
3. Verify your Supabase API keys are correct
4. Make sure your auth user has the "employer" role
