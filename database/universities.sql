-- Create universities table
CREATE TABLE IF NOT EXISTS public.universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) NOT NULL UNIQUE,
  logo_url VARCHAR(512),
  location VARCHAR(255),
  subscription_tier VARCHAR(50) DEFAULT 'free', -- 'free', 'premium', 'enterprise'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add university_id and subscription_tier to profiles if they don't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'university_id') THEN
    ALTER TABLE public.profiles ADD COLUMN university_id UUID REFERENCES public.universities(id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_tier') THEN
    ALTER TABLE public.profiles ADD COLUMN subscription_tier VARCHAR(50) DEFAULT 'free'; -- 'free', 'student_premium', 'university_premium'
  END IF;
END $$;

-- Enable RLS on universities
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;

-- Policies for universities
CREATE POLICY "Universities are viewable by everyone" ON public.universities
  FOR SELECT USING (true);

-- Update profiles policies to allow university admins to view their students
CREATE POLICY "University admins can view their students" ON public.profiles
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE university_id = profiles.university_id 
      AND role = 'university_admin'
    )
  );

-- Insert sample universities
INSERT INTO public.universities (name, domain, location, subscription_tier)
VALUES 
  ('Harvard University', 'harvard.edu', 'Cambridge, MA', 'enterprise'),
  ('Stanford University', 'stanford.edu', 'Stanford, CA', 'premium'),
  ('MIT', 'mit.edu', 'Cambridge, MA', 'premium')
ON CONFLICT (domain) DO NOTHING;
