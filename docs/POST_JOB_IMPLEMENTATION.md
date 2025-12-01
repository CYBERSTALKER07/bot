# Post Job Feature for Employers - Implementation Guide

## Overview

This implementation provides a complete job posting system for employers with full database integration. Employers can create, edit, delete, and manage their job postings with real-time tracking of applications and views.

## Features Implemented

### 1. **Job Posting Form** (`PostJob.tsx`)
- User-friendly form to create new job listings
- Real-time form validation with error messages
- Fields include:
  - Job title
  - Company name
  - Location (with remote option)
  - Job type (Full-time, Part-time, Internship, Contract)
  - Salary range
  - Job description
  - Requirements
  - Required skills (with tag management)
  - Benefits & perks
  - Application deadline
  - Contact email

### 2. **Job Management Hook** (`useJobManagement.ts`)
Complete hook for all job-related operations:
- **`postJob(formData)`** - Create a new job posting
- **`updateJob(jobId, formData)`** - Edit existing job
- **`deleteJob(jobId)`** - Remove a job posting
- **`fetchJob(jobId)`** - Get single job details
- **`fetchEmployerJobs()`** - Get all jobs by employer
- **`updateJobStatus(jobId, status)`** - Change job status (open/closed/draft)
- **`getJobApplicants(jobId)`** - Retrieve applications for a job

### 3. **Jobs Management Dashboard** (`EmployerJobsManagement.tsx`)
Comprehensive dashboard for employers to manage all their postings:
- View all job postings with filters (All, Open, Closed, Draft)
- Real-time statistics:
  - Total jobs posted
  - Active jobs
  - Total applications
  - Total views
- Job cards showing:
  - Job title and status badge
  - Company, location, salary, deadline
  - Application count and views
  - Posted date
- Quick actions:
  - Edit job
  - Change job status
  - Delete job with confirmation
  - View applicants

### 4. **Database Schema & Migrations** (`jobs-table-enhancement.sql`)
Enhanced jobs table with:
- Core fields: title, description, company, location, type, salary_range
- Job metadata: employer_id, status, posted_at, updated_at, deadline
- Additional fields: is_remote, department, contact_email
- Tracking: applications_count, views_count
- Automatic triggers for:
  - Updating application count
  - Updating job timestamp on modifications

## Database Structure

### Jobs Table
```sql
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  employer_id UUID NOT NULL REFERENCES auth.users(id),
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  type VARCHAR(50), -- 'full-time', 'part-time', 'internship', 'contract'
  salary_range VARCHAR(100),
  description TEXT NOT NULL,
  requirements TEXT[],
  skills TEXT[],
  benefits TEXT,
  is_remote BOOLEAN DEFAULT FALSE,
  experience_level VARCHAR(50), -- 'entry', 'mid', 'senior'
  department VARCHAR(255),
  contact_email VARCHAR(255),
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'closed', 'draft'
  applications_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Applications Table
```sql
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id),
  cover_letter TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'reviewed', 'accepted', 'rejected'
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Setup Instructions

### 1. Apply Database Migration
Run the migration file to enhance your jobs table:
```bash
# Using Supabase SQL Editor
psql -U postgres -h your-db-host -d your-db-name -f database/jobs-table-enhancement.sql

# Or copy-paste the SQL from jobs-table-enhancement.sql into Supabase SQL Editor
```

### 2. Add Routes to App.tsx
```tsx
// Add to your routes in App.tsx
<Route path="/post-job" element={
  <ProtectedRoute>
    <Suspense fallback={<LoadingFallback message="Loading job posting..." />}>
      <PostJob />
    </Suspense>
  </ProtectedRoute>
} />

<Route path="/employer/jobs" element={
  <ProtectedRoute>
    <Suspense fallback={<LoadingFallback message="Loading jobs..." />}>
      <EmployerJobsManagement />
    </Suspense>
  </ProtectedRoute>
} />
```

### 3. Add Navigation Links
Update your Navigation component or dashboard to include:
```tsx
<Link to="/post-job">Post a Job</Link>
<Link to="/employer/jobs">Manage Jobs</Link>
```

## Usage Examples

### Creating a Job
```tsx
import { useJobManagement } from '../hooks/useJobManagement';

function MyComponent() {
  const { postJob, loading, error, success } = useJobManagement();

  const handlePostJob = async () => {
    const result = await postJob({
      title: 'Senior React Developer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary: '$120k-150k',
      description: 'We are looking for...',
      requirements: 'Requirement 1\nRequirement 2',
      skills: ['React', 'TypeScript', 'Node.js'],
      contact_email: 'jobs@techcorp.com',
      is_remote: true,
      experience_level: 'senior'
    });

    if (result) {
      console.log('Job posted successfully!', result);
    }
  };

  return (
    <button onClick={handlePostJob} disabled={loading}>
      {loading ? 'Posting...' : 'Post Job'}
    </button>
  );
}
```

### Fetching Employer Jobs
```tsx
const { fetchEmployerJobs } = useJobManagement();

useEffect(() => {
  const loadJobs = async () => {
    const jobs = await fetchEmployerJobs();
    console.log('My jobs:', jobs);
  };
  loadJobs();
}, []);
```

## Security Features

1. **Role-based Access**: Only employers can post jobs
2. **User Verification**: Jobs can only be modified by their creator
3. **Row-level Security**: Implement RLS policies in Supabase:

```sql
-- Enable RLS on jobs table
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Employers can see their own jobs
CREATE POLICY "Employers can view their own jobs"
  ON jobs FOR SELECT
  USING (employer_id = auth.uid());

-- Only job owner can update their jobs
CREATE POLICY "Employers can update their own jobs"
  ON jobs FOR UPDATE
  USING (employer_id = auth.uid());

-- Only job owner can delete their jobs
CREATE POLICY "Employers can delete their own jobs"
  ON jobs FOR DELETE
  USING (employer_id = auth.uid());
```

## File Structure

```
src/
├── components/
│   ├── PostJob.tsx                    # Job posting form
│   └── EmployerJobsManagement.tsx     # Jobs management dashboard
├── hooks/
│   └── useJobManagement.ts            # Job operations hook
└── types/
    └── index.ts                       # TypeScript interfaces

database/
└── jobs-table-enhancement.sql         # Database migration
```

## Component Props & State

### PostJob Component
- **Props**: None (uses hooks internally)
- **Internal State**:
  - `formData`: Job form fields
  - `validationErrors`: Form validation errors
  - `showPreview`: Preview modal visibility
  - `isSubmitting`: Loading state

### EmployerJobsManagement Component
- **Props**: None (uses hooks internally)
- **Internal State**:
  - `jobs`: Array of job listings
  - `statusFilter`: Filter by job status
  - `showDeleteConfirm`: Delete confirmation modal

## API Endpoints Used

All operations go through Supabase:
- `INSERT` - Create new job
- `SELECT` - Fetch jobs
- `UPDATE` - Modify job details or status
- `DELETE` - Remove job

## Error Handling

The implementation includes comprehensive error handling:
- Validation errors displayed in form
- API errors shown in alert modals
- Loading states during operations
- Success confirmations

## Validation Rules

1. **Job Title**: Required, non-empty
2. **Company**: Required, non-empty
3. **Location**: Required, non-empty
4. **Description**: Required, non-empty
5. **Requirements**: Required, non-empty
6. **Skills**: At least one skill required
7. **Deadline**: Must be in the future (if provided)
8. **Email**: Valid email format required

## Performance Optimizations

1. **Lazy Loading**: Jobs only fetched when needed
2. **Caching**: Profile cache in AuthContext
3. **Indexed Queries**: Database indexes on employer_id, status, posted_at
4. **Pagination Ready**: Query structure supports pagination

## Future Enhancements

1. **Bulk Actions**: Edit/delete multiple jobs at once
2. **Analytics**: Track job performance metrics
3. **Applicant Screening**: AI-powered candidate matching
4. **Job Templates**: Save common job descriptions as templates
5. **Scheduled Publishing**: Schedule job postings for future dates
6. **Integration**: LinkedIn job auto-posting
7. **Email Notifications**: Alert employers of new applications
8. **Advanced Filtering**: Filter jobs by various criteria

## Troubleshooting

### Jobs not appearing
- Check if user role is set to 'employer'
- Verify employer_id is correctly set in auth context
- Check database connection in Supabase

### Cannot delete jobs
- Verify you're the job creator (employer_id matches user id)
- Check if applications exist (may need cascade delete)
- Verify RLS policies are correctly set

### Validation errors not clearing
- Ensure field name in validationErrors matches input name attribute
- Check if error clearing logic in handleInputChange is working

### Skills not being saved
- Verify skills array is properly formatted
- Check if requirements are split correctly by newlines

## Testing

To test the implementation:

1. **Create Job Test**:
   - Log in as employer
   - Navigate to /post-job
   - Fill form with valid data
   - Click "Post job"
   - Verify success message

2. **View Jobs Test**:
   - Navigate to /employer/jobs
   - Verify all posted jobs appear
   - Check statistics are correct

3. **Edit Job Test**:
   - Click more options on a job
   - Select "Edit"
   - Modify fields
   - Verify changes saved

4. **Delete Job Test**:
   - Click more options on a job
   - Select "Delete"
   - Confirm deletion
   - Verify job removed from list

## Support & Maintenance

For issues or questions:
1. Check error messages in browser console
2. Review Supabase logs
3. Verify database schema with `jobs-table-enhancement.sql`
4. Test with sample data
