-- ============================================
-- RETWEETS TABLE MIGRATION
-- ============================================
-- This migration adds retweet functionality with proper UUID support
-- Run this in your Supabase SQL Editor

-- Drop the old incorrect table if it exists
DROP TABLE IF EXISTS post_retweets CASCADE;

-- Create the retweets table with proper UUID types
CREATE TABLE post_retweets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_quote_retweet BOOLEAN DEFAULT FALSE,
  quote_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_post_retweets_post_id ON post_retweets(post_id);
CREATE INDEX IF NOT EXISTS idx_post_retweets_user_id ON post_retweets(user_id);
CREATE INDEX IF NOT EXISTS idx_post_retweets_created_at ON post_retweets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_retweets_is_quote ON post_retweets(is_quote_retweet);

-- Enable Row Level Security
ALTER TABLE post_retweets ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES FOR RETWEETS
-- ============================================

-- Anyone can view retweets
DROP POLICY IF EXISTS "Anyone can view retweets" ON post_retweets;
CREATE POLICY "Anyone can view retweets"
  ON post_retweets FOR SELECT
  USING (true);

-- Users can create retweets
DROP POLICY IF EXISTS "Users can create retweets" ON post_retweets;
CREATE POLICY "Users can create retweets"
  ON post_retweets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own retweets
DROP POLICY IF EXISTS "Users can delete their own retweets" ON post_retweets;
CREATE POLICY "Users can delete their own retweets"
  ON post_retweets FOR DELETE
  USING (auth.uid() = user_id);

-- Users can update their own retweets (for quote content)
DROP POLICY IF EXISTS "Users can update their own retweets" ON post_retweets;
CREATE POLICY "Users can update their own retweets"
  ON post_retweets FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- TRIGGER FOR RETWEET COUNT
-- ============================================

-- Function to update retweet count on posts table
CREATE OR REPLACE FUNCTION update_post_retweets_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET retweets_count = retweets_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET retweets_count = GREATEST(0, retweets_count - 1) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_post_retweets_count ON post_retweets;
CREATE TRIGGER trigger_update_post_retweets_count
  AFTER INSERT OR DELETE ON post_retweets
  FOR EACH ROW 
  EXECUTE FUNCTION update_post_retweets_count();

-- ============================================
-- ENSURE POSTS TABLE HAS retweets_count COLUMN
-- ============================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'posts' AND column_name = 'retweets_count') THEN
    ALTER TABLE posts ADD COLUMN retweets_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ RETWEETS TABLE CREATED SUCCESSFULLY!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ post_retweets table created (UUID support)';
  RAISE NOTICE '✅ Proper foreign key constraints added';
  RAISE NOTICE '✅ RLS policies configured';
  RAISE NOTICE '✅ Automatic retweet count trigger enabled';
  RAISE NOTICE '✅ All indexes created for performance';
  RAISE NOTICE '';
  RAISE NOTICE 'Retweet feature is ready to use! 🚀';
  RAISE NOTICE '========================================';
END $$;
