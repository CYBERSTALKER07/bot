-- Enhanced Supabase Schema for Profile Data Storage
-- This includes all fields needed for the Twitter/X-style profile system

-- Drop existing table to recreate with all necessary fields
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create comprehensive profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  
  -- Basic Identity Fields
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  full_name TEXT,
  bio TEXT CHECK (LENGTH(bio) <= 160), -- Twitter-style bio limit
  
  -- Media Fields
  avatar_url TEXT,
  cover_image_url TEXT,
  
  -- Contact Information
  email TEXT, -- Cached from auth.users for easier queries
  phone TEXT,
  website TEXT,
  location TEXT,
  
  -- Role and Verification
  role TEXT NOT NULL CHECK (role IN ('student', 'employer', 'admin')) DEFAULT 'student',
  verified BOOLEAN DEFAULT FALSE,
  
  -- Social Media Links
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  
  -- Student-Specific Fields
  major TEXT,
  graduation_year INTEGER,
  university TEXT,
  degree TEXT,
  gpa DECIMAL(3,2) CHECK (gpa >= 0 AND gpa <= 4.0),
  student_id TEXT,
  year_of_study INTEGER CHECK (year_of_study BETWEEN 1 AND 7),
  
  -- Professional Fields (Students & Employers)
  skills TEXT[],
  industry TEXT,
  experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive', 'student')),
  
  -- Employer-Specific Fields
  company_name TEXT,
  company_description TEXT,
  company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')),
  company_logo_url TEXT,
  company_website TEXT,
  employee_count TEXT,
  title TEXT, -- Job title
  
  -- Twitter/X-Style Features
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  
  -- Privacy & Visibility Settings
  is_private BOOLEAN DEFAULT FALSE,
  show_email BOOLEAN DEFAULT FALSE,
  show_phone BOOLEAN DEFAULT FALSE,
  show_birth_date BOOLEAN DEFAULT FALSE,
  show_followers BOOLEAN DEFAULT TRUE,
  show_following BOOLEAN DEFAULT TRUE,
  show_location BOOLEAN DEFAULT TRUE,
  
  -- Personal Information
  birth_date DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'non-binary', 'prefer-not-to-say')),
  pronouns TEXT,
  
  -- Profile Customization
  profile_theme TEXT DEFAULT 'default' CHECK (profile_theme IN ('default', 'blue', 'purple', 'green', 'orange', 'pink', 'dark')),
  profile_color TEXT DEFAULT '#1DA1F2', -- Custom hex color
  banner_text TEXT,
  
  -- Content & Engagement
  pinned_post_id UUID,
  status_message TEXT CHECK (LENGTH(status_message) <= 100),
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'away', 'do-not-disturb')),
  
  -- Professional Status
  looking_for_job BOOLEAN DEFAULT FALSE,
  open_to_opportunities BOOLEAN DEFAULT TRUE,
  hiring BOOLEAN DEFAULT FALSE, -- For employers
  
  -- Analytics & Insights
  profile_views_count INTEGER DEFAULT 0,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_profile_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Additional Metadata
  languages TEXT[], -- Spoken languages
  interests TEXT[], -- Personal interests/hobbies
  certifications TEXT[], -- Professional certifications
  achievements TEXT[], -- Notable achievements
  
  -- System Fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', 
      COALESCE(full_name, '') || ' ' ||
      COALESCE(bio, '') || ' ' ||
      COALESCE(company_name, '') || ' ' ||
      COALESCE(major, '') || ' ' ||
      COALESCE(university, '') || ' ' ||
      COALESCE(array_to_string(skills, ' '), '') || ' ' ||
      COALESCE(industry, '')
    )
  ) STORED
);

-- Create follows table for Twitter-style following system
CREATE TABLE public.follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create profile_views table for analytics
CREATE TABLE public.profile_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT
);

-- Create profile_activity table for activity tracking
CREATE TABLE public.profile_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('profile_update', 'avatar_change', 'cover_change', 'post_created', 'follow', 'unfollow')),
  activity_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create user_preferences table for app settings
CREATE TABLE public.user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Notification Preferences
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  
  -- Privacy Preferences
  discoverable BOOLEAN DEFAULT TRUE,
  show_online_status BOOLEAN DEFAULT TRUE,
  allow_direct_messages BOOLEAN DEFAULT TRUE,
  
  -- Content Preferences
  content_language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  date_format TEXT DEFAULT 'MM/DD/YYYY',
  
  -- Theme Preferences
  dark_mode BOOLEAN DEFAULT FALSE,
  reduced_motion BOOLEAN DEFAULT FALSE,
  high_contrast BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enhanced Posts table with better media support
CREATE TABLE public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  
  -- Media Fields
  media_urls TEXT[], -- Array of media URLs
  media_types TEXT[], -- Array corresponding to media types
  thumbnail_url TEXT,
  
  -- Post Metadata
  post_type TEXT DEFAULT 'text' CHECK (post_type IN ('text', 'image', 'video', 'article', 'poll', 'event', 'job_post', 'achievement')),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'private', 'unlisted')),
  
  -- Engagement
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  
  -- Location and Tags
  location TEXT,
  tags TEXT[],
  mentions UUID[], -- Array of user IDs mentioned
  
  -- Content Organization
  category TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table with enhanced fields
CREATE TABLE public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic Job Information
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company_name TEXT,
  
  -- Location and Remote Options
  location TEXT,
  is_remote BOOLEAN DEFAULT FALSE,
  remote_type TEXT CHECK (remote_type IN ('fully_remote', 'hybrid', 'on_site')),
  
  -- Employment Details
  job_type TEXT CHECK (job_type IN ('full-time', 'part-time', 'internship', 'contract', 'freelance', 'volunteer')),
  experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive', 'internship')),
  
  -- Compensation
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  salary_period TEXT DEFAULT 'yearly' CHECK (salary_period IN ('hourly', 'weekly', 'monthly', 'yearly')),
  equity_offered BOOLEAN DEFAULT FALSE,
  
  -- Requirements and Skills
  requirements TEXT[],
  required_skills TEXT[],
  preferred_skills TEXT[],
  education_requirement TEXT,
  
  -- Application Process
  application_deadline DATE,
  application_url TEXT,
  application_email TEXT,
  application_instructions TEXT,
  
  -- Job Status and Metadata
  status TEXT DEFAULT 'open' CHECK (status IN ('draft', 'open', 'paused', 'closed', 'filled')),
  featured BOOLEAN DEFAULT FALSE,
  urgent BOOLEAN DEFAULT FALSE,
  
  -- Analytics
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  
  -- Content
  benefits TEXT[],
  company_culture TEXT,
  growth_opportunities TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Applications table with enhanced tracking
CREATE TABLE public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Application Content
  cover_letter TEXT,
  resume_url TEXT,
  portfolio_url TEXT,
  
  -- Application Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'screening', 'interviewing', 'offer', 'rejected', 'withdrawn', 'hired')),
  
  -- Interview Process
  interview_scheduled_at TIMESTAMP WITH TIME ZONE,
  interview_notes TEXT,
  
  -- Feedback and Communication
  employer_notes TEXT,
  rejection_reason TEXT,
  feedback TEXT,
  
  -- Tracking
  viewed_by_employer BOOLEAN DEFAULT FALSE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  UNIQUE(job_id, student_id)
);

-- Comments table for posts with threading support
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  
  -- Comment Content
  content TEXT NOT NULL CHECK (LENGTH(content) <= 500),
  
  -- Engagement
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  
  -- Metadata
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Comment likes table
CREATE TABLE public.comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(comment_id, user_id)
);

-- Create comprehensive indexes for performance
CREATE INDEX profiles_username_idx ON profiles(username);
CREATE INDEX profiles_email_idx ON profiles(email);
CREATE INDEX profiles_role_idx ON profiles(role);
CREATE INDEX profiles_verified_idx ON profiles(verified);
CREATE INDEX profiles_location_idx ON profiles(location);
CREATE INDEX profiles_company_idx ON profiles(company_name);
CREATE INDEX profiles_skills_idx ON profiles USING GIN(skills);
CREATE INDEX profiles_search_idx ON profiles USING GIN(search_vector);
CREATE INDEX profiles_last_active_idx ON profiles(last_active_at DESC);

-- Follows table indexes
CREATE INDEX follows_follower_id_idx ON follows(follower_id);
CREATE INDEX follows_following_id_idx ON follows(following_id);
CREATE INDEX follows_created_at_idx ON follows(created_at DESC);

-- Profile views indexes
CREATE INDEX profile_views_profile_id_idx ON profile_views(profile_id);
CREATE INDEX profile_views_viewer_id_idx ON profile_views(viewer_id);
CREATE INDEX profile_views_viewed_at_idx ON profile_views(viewed_at DESC);

-- Posts indexes
CREATE INDEX posts_user_id_idx ON posts(user_id);
CREATE INDEX posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX posts_visibility_idx ON posts(visibility);
CREATE INDEX posts_post_type_idx ON posts(post_type);
CREATE INDEX posts_tags_idx ON posts USING GIN(tags);

-- Jobs indexes
CREATE INDEX jobs_employer_id_idx ON jobs(employer_id);
CREATE INDEX jobs_status_idx ON jobs(status);
CREATE INDEX jobs_location_idx ON jobs(location);
CREATE INDEX jobs_job_type_idx ON jobs(job_type);
CREATE INDEX jobs_experience_level_idx ON jobs(experience_level);
CREATE INDEX jobs_skills_idx ON jobs USING GIN(required_skills);
CREATE INDEX jobs_created_at_idx ON jobs(created_at DESC);

-- Applications indexes
CREATE INDEX applications_job_id_idx ON applications(job_id);
CREATE INDEX applications_student_id_idx ON applications(student_id);
CREATE INDEX applications_status_idx ON applications(status);
CREATE INDEX applications_applied_at_idx ON applications(applied_at DESC);

-- Create indexes for comments
CREATE INDEX comments_post_id_idx ON comments(post_id);
CREATE INDEX comments_user_id_idx ON comments(user_id);
CREATE INDEX comments_parent_comment_id_idx ON comments(parent_comment_id);
CREATE INDEX comments_created_at_idx ON comments(created_at DESC);

-- Comment likes indexes
CREATE INDEX comment_likes_comment_id_idx ON comment_likes(comment_id);
CREATE INDEX comment_likes_user_id_idx ON comment_likes(user_id);

-- Create Row Level Security (RLS) policies

-- Profiles policies (enhanced for privacy)
-- Fixed to handle unauthenticated users and NULL auth.uid()
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (
  NOT is_private OR 
  (auth.uid() IS NOT NULL AND auth.uid() = id) OR 
  (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM follows WHERE following_id = profiles.id AND follower_id = auth.uid()))
);

DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() IS NOT NULL AND auth.uid() = id);

DROP POLICY IF EXISTS "Users can delete own profile." ON profiles;
CREATE POLICY "Users can delete own profile." ON profiles FOR DELETE USING (auth.uid() IS NOT NULL AND auth.uid() = id);

-- User preferences policies
DROP POLICY IF EXISTS "Users can view their own preferences." ON user_preferences;
CREATE POLICY "Users can view their own preferences." ON user_preferences FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own preferences." ON user_preferences;
CREATE POLICY "Users can insert their own preferences." ON user_preferences FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own preferences." ON user_preferences;
CREATE POLICY "Users can update their own preferences." ON user_preferences FOR UPDATE USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Follows policies
DROP POLICY IF EXISTS "Users can view follows." ON follows;
CREATE POLICY "Users can view follows." ON follows FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can follow others." ON follows;
CREATE POLICY "Users can follow others." ON follows FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can unfollow others." ON follows;
CREATE POLICY "Users can unfollow others." ON follows FOR DELETE USING (auth.uid() IS NOT NULL AND auth.uid() = follower_id);

-- Profile views policies
DROP POLICY IF EXISTS "Users can view profile views of their own profile." ON profile_views;
CREATE POLICY "Users can view profile views of their own profile." ON profile_views FOR SELECT USING (auth.uid() IS NOT NULL AND profile_id = auth.uid());

DROP POLICY IF EXISTS "Anyone can log profile views." ON profile_views;
CREATE POLICY "Anyone can log profile views." ON profile_views FOR INSERT WITH CHECK (true);

-- Posts policies (enhanced)
DROP POLICY IF EXISTS "Posts are viewable based on visibility." ON posts;
CREATE POLICY "Posts are viewable based on visibility." ON posts FOR SELECT USING (
  visibility = 'public' OR 
  (visibility = 'followers' AND auth.uid() IS NOT NULL AND (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM follows WHERE following_id = posts.user_id AND follower_id = auth.uid())
  )) OR
  (visibility = 'private' AND auth.uid() IS NOT NULL AND auth.uid() = user_id)
);

DROP POLICY IF EXISTS "Users can insert their own posts." ON posts;
CREATE POLICY "Users can insert their own posts." ON posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own posts." ON posts;
CREATE POLICY "Users can update own posts." ON posts FOR UPDATE USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own posts." ON posts;
CREATE POLICY "Users can delete own posts." ON posts FOR DELETE USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Jobs policies (enhanced)
CREATE POLICY "Open jobs are viewable by everyone." ON jobs FOR SELECT USING (
  status IN ('open', 'featured') OR auth.uid() = employer_id
);
CREATE POLICY "Employers can manage their jobs." ON jobs FOR ALL USING (auth.uid() = employer_id);
CREATE POLICY "Employers can insert jobs." ON jobs FOR INSERT WITH CHECK (
  auth.uid() = employer_id AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('employer', 'admin'))
);

-- Applications policies (enhanced)
CREATE POLICY "Users can view relevant applications." ON applications FOR SELECT USING (
  auth.uid() = student_id OR 
  auth.uid() IN (SELECT employer_id FROM jobs WHERE id = job_id)
);
CREATE POLICY "Students can apply for jobs." ON applications FOR INSERT WITH CHECK (
  auth.uid() = student_id AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('student', 'admin'))
);
CREATE POLICY "Students can update their applications." ON applications FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Employers can update application status." ON applications FOR UPDATE USING (
  auth.uid() IN (SELECT employer_id FROM jobs WHERE id = job_id)
);

-- RLS policies for comments
CREATE POLICY "Comments are viewable based on post visibility." ON comments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM posts 
    WHERE id = comments.post_id 
    AND (
      visibility = 'public' OR 
      (visibility = 'followers' AND auth.uid() IS NOT NULL AND (
        user_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM follows WHERE following_id = posts.user_id AND follower_id = auth.uid())
      )) OR
      (visibility = 'private' AND auth.uid() IS NOT NULL AND user_id = auth.uid())
    )
  )
);

CREATE POLICY "Users can insert comments on viewable posts." ON comments FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM posts 
    WHERE id = comments.post_id 
    AND (
      visibility = 'public' OR 
      (visibility = 'followers' AND auth.uid() IS NOT NULL AND (
        user_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM follows WHERE following_id = posts.user_id AND follower_id = auth.uid())
      )) OR
      (visibility = 'private' AND auth.uid() IS NOT NULL AND user_id = auth.uid())
    )
  )
);

CREATE POLICY "Users can update their own comments." ON comments FOR UPDATE USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments." ON comments FOR DELETE USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Comment likes policies
CREATE POLICY "Comment likes are viewable by everyone." ON comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can like comments." ON comment_likes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);
CREATE POLICY "Users can unlike comments." ON comment_likes FOR DELETE USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Create enhanced functions for profile operations

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, username, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  
  -- Create user preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update follower counts
CREATE OR REPLACE FUNCTION public.update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment following count for follower
    UPDATE public.profiles 
    SET following_count = following_count + 1 
    WHERE id = NEW.follower_id;
    
    -- Increment followers count for following
    UPDATE public.profiles 
    SET followers_count = followers_count + 1 
    WHERE id = NEW.following_id;
    
    -- Log activity
    INSERT INTO public.profile_activity (user_id, activity_type, activity_data)
    VALUES (NEW.follower_id, 'follow', jsonb_build_object('followed_user', NEW.following_id));
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement following count for follower
    UPDATE public.profiles 
    SET following_count = GREATEST(following_count - 1, 0)
    WHERE id = OLD.follower_id;
    
    -- Decrement followers count for following
    UPDATE public.profiles 
    SET followers_count = GREATEST(followers_count - 1, 0)
    WHERE id = OLD.following_id;
    
    -- Log activity
    INSERT INTO public.profile_activity (user_id, activity_type, activity_data)
    VALUES (OLD.follower_id, 'unfollow', jsonb_build_object('unfollowed_user', OLD.following_id));
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update post counts
CREATE OR REPLACE FUNCTION public.update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles 
    SET posts_count = posts_count + 1,
        last_active_at = NOW()
    WHERE id = NEW.user_id;
    
    -- Log activity
    INSERT INTO public.profile_activity (user_id, activity_type, activity_data)
    VALUES (NEW.user_id, 'post_created', jsonb_build_object('post_id', NEW.id, 'post_type', NEW.post_type));
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles 
    SET posts_count = GREATEST(posts_count - 1, 0)
    WHERE id = OLD.user_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update comment counts
CREATE OR REPLACE FUNCTION public.update_comment_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update post comments count
    UPDATE public.posts 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.post_id;
    
    -- Update parent comment replies count if this is a reply
    IF NEW.parent_comment_id IS NOT NULL THEN
      UPDATE public.comments 
      SET replies_count = replies_count + 1 
      WHERE id = NEW.parent_comment_id;
    END IF;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update post comments count
    UPDATE public.posts 
    SET comments_count = GREATEST(comments_count - 1, 0)
    WHERE id = OLD.post_id;
    
    -- Update parent comment replies count if this was a reply
    IF OLD.parent_comment_id IS NOT NULL THEN
      UPDATE public.comments 
      SET replies_count = GREATEST(replies_count - 1, 0)
      WHERE id = OLD.parent_comment_id;
    END IF;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update comment like counts
CREATE OR REPLACE FUNCTION public.update_comment_like_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.comments 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.comments 
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  
  -- Update last_profile_update for profiles table
  IF TG_TABLE_NAME = 'profiles' THEN
    NEW.last_profile_update = TIMEZONE('utc'::text, NOW());
    
    -- Log profile update activity
    INSERT INTO public.profile_activity (user_id, activity_type, activity_data)
    VALUES (NEW.id, 'profile_update', jsonb_build_object('updated_fields', 'general'));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE TRIGGER update_follower_counts_trigger
  AFTER INSERT OR DELETE ON follows
  FOR EACH ROW EXECUTE PROCEDURE public.update_follower_counts();

CREATE TRIGGER update_post_counts_trigger
  AFTER INSERT OR DELETE ON posts
  FOR EACH ROW EXECUTE PROCEDURE public.update_post_counts();

CREATE TRIGGER update_comment_counts_trigger
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE PROCEDURE public.update_comment_counts();

CREATE TRIGGER update_comment_like_counts_trigger
  AFTER INSERT OR DELETE ON comment_likes
  FOR EACH ROW EXECUTE PROCEDURE public.update_comment_like_counts();

-- Updated_at triggers
CREATE TRIGGER handle_updated_at_profiles BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_posts BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_jobs BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_applications BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_preferences BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_comments BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Profile utility functions
CREATE OR REPLACE FUNCTION public.follow_user(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO public.follows (follower_id, following_id)
  VALUES (auth.uid(), target_user_id)
  ON CONFLICT (follower_id, following_id) DO NOTHING;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.unfollow_user(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM public.follows 
  WHERE follower_id = auth.uid() AND following_id = target_user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_following(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.follows 
    WHERE follower_id = auth.uid() AND following_id = target_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log profile views
CREATE OR REPLACE FUNCTION public.log_profile_view(target_profile_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Only log if viewer is different from profile owner
  IF auth.uid() != target_profile_id THEN
    INSERT INTO public.profile_views (profile_id, viewer_id)
    VALUES (target_profile_id, auth.uid());
    
    -- Update profile views count
    UPDATE public.profiles 
    SET profile_views_count = profile_views_count + 1
    WHERE id = target_profile_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user activity
CREATE OR REPLACE FUNCTION public.update_user_activity()
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles 
  SET last_active_at = NOW()
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search profiles
CREATE OR REPLACE FUNCTION public.search_profiles(
  search_query TEXT,
  filter_role TEXT DEFAULT NULL,
  filter_location TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  username TEXT,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT,
  location TEXT,
  verified BOOLEAN,
  followers_count INTEGER,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.username,
    p.full_name,
    p.bio,
    p.avatar_url,
    p.role,
    p.location,
    p.verified,
    p.followers_count,
    ts_rank(p.search_vector, plainto_tsquery('english', search_query)) as rank
  FROM profiles p
  WHERE 
    (search_query = '' OR p.search_vector @@ plainto_tsquery('english', search_query))
    AND (filter_role IS NULL OR p.role = filter_role)
    AND (filter_location IS NULL OR p.location ILIKE '%' || filter_location || '%')
    AND (NOT p.is_private OR p.id = auth.uid() OR 
         EXISTS (SELECT 1 FROM follows WHERE following_id = p.id AND follower_id = auth.uid()))
  ORDER BY 
    CASE WHEN search_query = '' THEN p.followers_count ELSE NULL END DESC,
    CASE WHEN search_query != '' THEN ts_rank(p.search_vector, plainto_tsquery('english', search_query)) ELSE NULL END DESC,
    p.verified DESC,
    p.last_active_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create storage buckets and policies
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', true),
  ('covers', 'covers', true),
  ('profile-images', 'profile-images', true),
  ('resumes', 'resumes', false),
  ('portfolios', 'portfolios', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible." ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar." ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar." ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar." ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for cover images
CREATE POLICY "Cover images are publicly accessible." ON storage.objects
  FOR SELECT USING (bucket_id = 'covers');

CREATE POLICY "Users can upload their own cover." ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own cover." ON storage.objects
  FOR UPDATE USING (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own cover." ON storage.objects
  FOR DELETE USING (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for resumes (private)
CREATE POLICY "Users can view their own resumes." ON storage.objects
  FOR SELECT USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Employers can view resumes from applications." ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resumes' AND 
    EXISTS (
      SELECT 1 FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE j.employer_id = auth.uid() 
      AND a.resume_url LIKE '%' || name || '%'
    )
  );

CREATE POLICY "Users can upload their own resumes." ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own resumes." ON storage.objects
  FOR UPDATE USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Useful views for common queries

-- Create view for user feed
CREATE OR REPLACE VIEW user_feed AS
SELECT 
  p.*,
  pr.username,
  pr.full_name,
  pr.avatar_url,
  pr.verified,
  (
    SELECT COUNT(*) FROM follows 
    WHERE following_id = p.user_id AND follower_id = auth.uid()
  ) > 0 as is_following
FROM posts p
JOIN profiles pr ON p.user_id = pr.id
WHERE 
  p.visibility = 'public' OR
  (p.visibility = 'followers' AND (
    p.user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM follows WHERE following_id = p.user_id AND follower_id = auth.uid())
  )) OR
  (p.visibility = 'private' AND p.user_id = auth.uid())
ORDER BY p.created_at DESC;

-- Create view for job recommendations
CREATE OR REPLACE VIEW job_recommendations AS
SELECT 
  j.*,
  p.full_name as employer_name,
  p.avatar_url as employer_avatar,
  p.company_name,
  (
    SELECT COUNT(*) 
    FROM unnest(j.required_skills) as job_skill
    WHERE job_skill = ANY(
      SELECT unnest(skills) FROM profiles WHERE id = auth.uid()
    )
  ) as skills_match_count
FROM jobs j
JOIN profiles p ON j.employer_id = p.id
WHERE j.status = 'open'
ORDER BY skills_match_count DESC, j.created_at DESC;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;