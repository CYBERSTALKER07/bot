-- Companies table for storing company information
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  logo_url VARCHAR(512),
  cover_image_url VARCHAR(512),
  description TEXT,
  website VARCHAR(512),
  industry VARCHAR(255),
  size VARCHAR(100),
  -- e.g., '1-50', '51-200', '201-500', '501-1000', '1000+'
  location VARCHAR(255),
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_hiring BOOLEAN DEFAULT FALSE,
  employee_count INTEGER,
  founded_year INTEGER,
  featured_benefits TEXT [],
  growth_rate DECIMAL(5, 2),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_is_hiring ON companies(is_hiring);
CREATE INDEX IF NOT EXISTS idx_companies_rating ON companies(rating DESC);
-- Update jobs table to reference companies if not already
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES companies(id) ON DELETE
SET NULL;
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
-- Insert sample companies data
INSERT INTO companies (
    name,
    logo_url,
    cover_image_url,
    description,
    website,
    industry,
    size,
    location,
    rating,
    reviews_count,
    is_verified,
    is_hiring,
    employee_count,
    founded_year,
    featured_benefits,
    growth_rate
  )
VALUES (
    'Google',
    'https://logo.clearbit.com/google.com',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    'Search engine and tech giant',
    'google.com',
    'Technology',
    '10,000+',
    'Mountain View, CA',
    4.5,
    2345,
    true,
    true,
    190000,
    1998,
    ARRAY ['Health Insurance', 'Stock Options', 'Free Meals'],
    15.5
  ),
  (
    'Meta',
    'https://logo.clearbit.com/meta.com',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    'Social media and metaverse company',
    'meta.com',
    'Social Media',
    '5,000-10,000',
    'Menlo Park, CA',
    4.2,
    1856,
    true,
    true,
    86482,
    2004,
    ARRAY ['Remote Work', 'Wellness Program', 'Learning Budget'],
    12.3
  ),
  (
    'Apple',
    'https://logo.clearbit.com/apple.com',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    'Consumer electronics and software company',
    'apple.com',
    'Technology',
    '10,000+',
    'Cupertino, CA',
    4.6,
    3421,
    true,
    false,
    161000,
    1976,
    ARRAY ['Innovation Fund', 'Education Benefit', 'Employee Discount'],
    8.7
  ),
  (
    'Netflix',
    'https://logo.clearbit.com/netflix.com',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    'Streaming entertainment platform',
    'netflix.com',
    'Entertainment',
    '5,000-10,000',
    'Los Gatos, CA',
    4.3,
    987,
    true,
    true,
    12800,
    1997,
    ARRAY ['Flexible Time Off', 'Parental Leave', 'Stock Options'],
    18.2
  ),
  (
    'Tesla',
    'https://logo.clearbit.com/tesla.com',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    'Electric vehicle and energy company',
    'tesla.com',
    'Automotive',
    '5,000-10,000',
    'Austin, TX',
    3.8,
    654,
    true,
    true,
    127855,
    2003,
    ARRAY ['Stock Options', 'Supercharger Access', 'Vehicle Discount'],
    25.5
  ),
  (
    'Microsoft',
    'https://logo.clearbit.com/microsoft.com',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    'Software and cloud computing company',
    'microsoft.com',
    'Technology',
    '10,000+',
    'Redmond, WA',
    4.4,
    2156,
    true,
    true,
    221000,
    1975,
    ARRAY ['Azure Credits', 'Health Benefits', 'Tuition Reimbursement'],
    11.2
  ),
  (
    'Amazon',
    'https://logo.clearbit.com/amazon.com',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    'E-commerce and cloud services',
    'amazon.com',
    'Technology',
    '10,000+',
    'Seattle, WA',
    4.1,
    2890,
    true,
    true,
    1541000,
    1994,
    ARRAY ['Day 1 Benefits', 'Career Development', 'Employee Stock Purchase'],
    13.8
  ),
  (
    'Adobe',
    'https://logo.clearbit.com/adobe.com',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    'Software and digital media company',
    'adobe.com',
    'Software',
    '10,000+',
    'San Jose, CA',
    4.3,
    1245,
    true,
    true,
    25000,
    1982,
    ARRAY ['Creative Cloud Access', 'Remote Flexibility', 'Learning Programs'],
    9.4
  ) ON CONFLICT (name) DO NOTHING;
-- Add company-related functions
CREATE OR REPLACE FUNCTION get_company_hiring_jobs(company_id_param INTEGER) RETURNS TABLE(
    job_id INTEGER,
    job_title VARCHAR,
    job_type VARCHAR,
    location VARCHAR,
    posted_date TIMESTAMP
  ) AS $$ BEGIN RETURN QUERY
SELECT jobs.id,
  jobs.title,
  jobs.type,
  jobs.location,
  jobs.posted_at
FROM jobs
WHERE jobs.company_id = company_id_param
  AND jobs.status = 'open'
ORDER BY jobs.posted_at DESC;
END;
$$ LANGUAGE plpgsql;