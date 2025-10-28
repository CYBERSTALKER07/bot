-- Drop all existing policies on jobs table
DROP POLICY IF EXISTS "Employers can view jobs" ON jobs;
DROP POLICY IF EXISTS "Employers can create jobs" ON jobs;
DROP POLICY IF EXISTS "Employers can update their own jobs" ON jobs;
DROP POLICY IF EXISTS "Employers can delete their own jobs" ON jobs;
DROP POLICY IF EXISTS "Anyone can view public jobs" ON jobs;
DROP POLICY IF EXISTS "Public read access for jobs" ON jobs;
DROP POLICY IF EXISTS "Authenticated users can create jobs" ON jobs;
DROP POLICY IF EXISTS "Job owners can update their jobs" ON jobs;
DROP POLICY IF EXISTS "Everyone can view jobs" ON jobs;
DROP POLICY IF EXISTS "Anyone can view all jobs" ON jobs;

-- Enable RLS on jobs table
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create permissive SELECT policy - BOTH students AND employers (everyone) can view all jobs
CREATE POLICY "Students and employers can view all jobs"
  ON jobs
  FOR SELECT
  USING (true);

-- Create INSERT policy - Only authenticated users (employers) can create jobs
CREATE POLICY "Employers can create jobs"
  ON jobs
  FOR INSERT
  WITH CHECK (employer_id = auth.uid());

-- Create UPDATE policy - Job owners can update their own jobs
CREATE POLICY "Employers can update their own jobs"
  ON jobs
  FOR UPDATE
  USING (employer_id = auth.uid())
  WITH CHECK (employer_id = auth.uid());

-- Create DELETE policy - Job owners can delete their own jobs
CREATE POLICY "Employers can delete their own jobs"
  ON jobs
  FOR DELETE
  USING (employer_id = auth.uid());

-- Grant access to everyone - anonymous and authenticated users
GRANT SELECT ON jobs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON jobs TO authenticated;

-- Similarly, ensure profiles table has proper access for employer data
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
GRANT SELECT ON profiles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON profiles TO authenticated;
