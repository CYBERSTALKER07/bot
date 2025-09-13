-- Comments System Migration for Supabase
-- Run this after the main schema to add comments functionality

-- Comments table for posts with threading support
CREATE TABLE IF NOT EXISTS public.comments (
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
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(comment_id, user_id)
);

-- Create indexes for comments
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON comments(post_id);
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON comments(user_id);
CREATE INDEX IF NOT EXISTS comments_parent_comment_id_idx ON comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments(created_at DESC);

-- Comment likes indexes
CREATE INDEX IF NOT EXISTS comment_likes_comment_id_idx ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS comment_likes_user_id_idx ON comment_likes(user_id);

-- RLS policies for comments
DROP POLICY IF EXISTS "Comments are viewable based on post visibility." ON comments;
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

DROP POLICY IF EXISTS "Users can insert comments on viewable posts." ON comments;
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

DROP POLICY IF EXISTS "Users can update their own comments." ON comments;
CREATE POLICY "Users can update their own comments." ON comments FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own comments." ON comments;
CREATE POLICY "Users can delete their own comments." ON comments FOR DELETE USING (auth.uid() = user_id);

-- Comment likes policies
DROP POLICY IF EXISTS "Comment likes are viewable by everyone." ON comment_likes;
CREATE POLICY "Comment likes are viewable by everyone." ON comment_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can like comments." ON comment_likes;
CREATE POLICY "Users can like comments." ON comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unlike comments." ON comment_likes;
CREATE POLICY "Users can unlike comments." ON comment_likes FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

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

-- Create triggers for comment counts
DROP TRIGGER IF EXISTS update_comment_counts_trigger ON comments;
CREATE TRIGGER update_comment_counts_trigger
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE PROCEDURE public.update_comment_counts();

DROP TRIGGER IF EXISTS update_comment_like_counts_trigger ON comment_likes;
CREATE TRIGGER update_comment_like_counts_trigger
  AFTER INSERT OR DELETE ON comment_likes
  FOR EACH ROW EXECUTE PROCEDURE public.update_comment_like_counts();

-- Updated_at trigger for comments
DROP TRIGGER IF EXISTS handle_updated_at_comments ON comments;
CREATE TRIGGER handle_updated_at_comments BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();