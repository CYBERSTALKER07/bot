-- ============================================================================
-- FIX: Posts Table RLS Policies
-- Run this in Supabase SQL Editor if you're getting 404 errors when creating posts
-- ============================================================================

-- First, check if the posts table exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts') THEN
    RAISE EXCEPTION 'Posts table does not exist! Please run the posts-table-setup.sql first.';
  END IF;
END $$;

-- Enable RLS on posts table
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view public posts" ON public.posts;
DROP POLICY IF EXISTS "Users can view their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can create their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;

-- Create comprehensive RLS policies for posts

-- 1. SELECT: Users can view public posts and their own posts
CREATE POLICY "Users can view public posts"
  ON public.posts FOR SELECT
  USING (
    visibility = 'public' 
    OR user_id = auth.uid()
    OR (visibility = 'connections' AND EXISTS (
      SELECT 1 FROM public.follows 
      WHERE follower_id = auth.uid() AND following_id = posts.user_id
    ))
  );

-- 2. INSERT: Authenticated users can create posts
CREATE POLICY "Users can create their own posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. UPDATE: Users can update their own posts
CREATE POLICY "Users can update their own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. DELETE: Users can delete their own posts
CREATE POLICY "Users can delete their own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Posts RLS policies updated successfully!';
  RAISE NOTICE 'Users can now create, view, update, and delete posts.';
END $$;
