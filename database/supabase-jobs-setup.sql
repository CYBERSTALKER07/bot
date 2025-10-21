-- Create Jobs table with Supabase/UUID support
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  employer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255),
  type VARCHAR(50), -- 'full-time', 'part-time', 'internship', 'contract'
  salary_range VARCHAR(100),
  requirements TEXT[],
  skills TEXT[],
  benefits TEXT,
  is_remote BOOLEAN DEFAULT FALSE,
  experience_level VARCHAR(50) DEFAULT 'entry', -- 'entry', 'mid', 'senior'
  department VARCHAR(255),
  contact_email VARCHAR(255),
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'closed', 'draft'
  applications_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deadline DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cover_letter TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'reviewed', 'accepted', 'rejected'
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(job_id, student_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON jobs(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON jobs(deadline);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_at ON applications(applied_at DESC);

-- Function to update job applications count
CREATE OR REPLACE FUNCTION update_job_applications_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE jobs SET applications_count = applications_count + 1 WHERE id = NEW.job_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE jobs SET applications_count = applications_count - 1 WHERE id = OLD.job_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update applications count
DROP TRIGGER IF EXISTS trigger_update_job_applications_count ON applications;
CREATE TRIGGER trigger_update_job_applications_count
  AFTER INSERT OR DELETE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_job_applications_count();

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamp
DROP TRIGGER IF EXISTS trigger_update_jobs_timestamp ON jobs;
CREATE TRIGGER trigger_update_jobs_timestamp
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_jobs_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Employers can view all jobs (read)
CREATE POLICY "Employers can view jobs"
  ON jobs FOR SELECT
  USING (true);

-- RLS Policy: Employers can only insert their own jobs
CREATE POLICY "Employers can create jobs"
  ON jobs FOR INSERT
  WITH CHECK (employer_id = auth.uid());

-- RLS Policy: Employers can only update their own jobs
CREATE POLICY "Employers can update their own jobs"
  ON jobs FOR UPDATE
  USING (employer_id = auth.uid())
  WITH CHECK (employer_id = auth.uid());

-- RLS Policy: Employers can only delete their own jobs
CREATE POLICY "Employers can delete their own jobs"
  ON jobs FOR DELETE
  USING (employer_id = auth.uid());

-- RLS Policy: Students can view applications they created
CREATE POLICY "Students can view their applications"
  ON applications FOR SELECT
  USING (student_id = auth.uid() OR 
         job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid()));

-- RLS Policy: Students can create applications
CREATE POLICY "Students can create applications"
  ON applications FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- RLS Policy: Employers can view applications for their jobs
CREATE POLICY "Employers can view job applications"
  ON applications FOR SELECT
  USING (job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid()));

-- RLS Policy: Employers can update applications for their jobs
CREATE POLICY "Employers can update applications"
  ON applications FOR UPDATE
  USING (job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid()))
  WITH CHECK (job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid()));
