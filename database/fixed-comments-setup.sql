-- Fixed Essential tables for comments system to work
-- Run this in your Supabase SQL Editor
-- This version fixes the "generation expression is not immutable" error

-- Create follows table (required by comments RLS policies)
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create profiles table (required for user info in comments)
-- Fixed: Removed the problematic generated search_vector column
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  role TEXT NOT NULL CHECK (role IN ('student', 'employer', 'admin')) DEFAULT 'student',
  bio TEXT,
  location TEXT,
  company_name TEXT,
  website TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  skills TEXT[],
  major TEXT,
  university TEXT,
  graduation_year INTEGER,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create posts table (required for comments to reference)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  image_url TEXT,
  video_url TEXT,
  media_type TEXT DEFAULT 'text' CHECK (media_type IN ('text', 'image', 'video')),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'private')),
  tags TEXT[],
  location TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (LENGTH(content) <= 500),
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create comment likes table
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(comment_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS follows_follower_id_idx ON follows(follower_id);
CREATE INDEX IF NOT EXISTS follows_following_id_idx ON follows(following_id);
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);
CREATE INDEX IF NOT EXISTS profiles_full_name_idx ON profiles(full_name);
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts(user_id);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON comments(post_id);
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON comments(user_id);
CREATE INDEX IF NOT EXISTS comments_parent_comment_id_idx ON comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS comment_likes_comment_id_idx ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS comment_likes_user_id_idx ON comment_likes(user_id);

-- Enable RLS on all tables
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view follows." ON follows;
DROP POLICY IF EXISTS "Users can follow others." ON follows;
DROP POLICY IF EXISTS "Users can unfollow others." ON follows;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
DROP POLICY IF EXISTS "Posts are viewable based on visibility." ON posts;
DROP POLICY IF EXISTS "Users can insert their own posts." ON posts;
DROP POLICY IF EXISTS "Users can update own posts." ON posts;
DROP POLICY IF EXISTS "Users can delete own posts." ON posts;
DROP POLICY IF EXISTS "Comments are viewable based on post visibility." ON comments;
DROP POLICY IF EXISTS "Users can insert comments on viewable posts." ON comments;
DROP POLICY IF EXISTS "Users can update their own comments." ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments." ON comments;
DROP POLICY IF EXISTS "Comment likes are viewable by everyone." ON comment_likes;
DROP POLICY IF EXISTS "Users can like comments." ON comment_likes;
DROP POLICY IF EXISTS "Users can unlike comments." ON comment_likes;

-- RLS policies for follows
CREATE POLICY "Users can view follows." ON follows FOR SELECT USING (true);
CREATE POLICY "Users can follow others." ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow others." ON follows FOR DELETE USING (auth.uid() = follower_id);

-- RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- RLS policies for posts
CREATE POLICY "Posts are viewable based on visibility." ON posts FOR SELECT USING (
  visibility = 'public' OR 
  (visibility = 'followers' AND (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM follows WHERE following_id = posts.user_id AND follower_id = auth.uid())
  )) OR
  (visibility = 'private' AND auth.uid() = user_id)
);
CREATE POLICY "Users can insert their own posts." ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts." ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts." ON posts FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for comments
CREATE POLICY "Comments are viewable based on post visibility." ON comments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM posts 
    WHERE id = comments.post_id 
    AND (
      visibility = 'public' OR 
      (visibility = 'followers' AND (
        user_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM follows WHERE following_id = posts.user_id AND follower_id = auth.uid())
      )) OR
      (visibility = 'private' AND user_id = auth.uid())
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
      (visibility = 'followers' AND (
        user_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM follows WHERE following_id = posts.user_id AND follower_id = auth.uid())
      )) OR
      (visibility = 'private' AND user_id = auth.uid())
    )
  )
);

CREATE POLICY "Users can update their own comments." ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments." ON comments FOR DELETE USING (auth.uid() = user_id);

-- Comment likes policies
CREATE POLICY "Comment likes are viewable by everyone." ON comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can like comments." ON comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike comments." ON comment_likes FOR DELETE USING (auth.uid() = user_id);

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

-- Function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_comment_counts_trigger ON comments;
DROP TRIGGER IF EXISTS update_comment_like_counts_trigger ON comment_likes;
DROP TRIGGER IF EXISTS handle_updated_at_profiles ON profiles;
DROP TRIGGER IF EXISTS handle_updated_at_posts ON posts;
DROP TRIGGER IF EXISTS handle_updated_at_comments ON comments;

-- Create triggers
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

CREATE TRIGGER handle_updated_at_comments BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;