-- Fix the likes table CHECK constraint issue
-- This trigger ensures comment_id is NULL for post likes

-- Create a BEFORE INSERT trigger to normalize the likes table
CREATE OR REPLACE FUNCTION normalize_like_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- If post_id is provided, ensure comment_id is NULL
  IF NEW.post_id IS NOT NULL THEN
    NEW.comment_id := NULL;
  END IF;
  
  -- If comment_id is provided, ensure post_id is NULL
  IF NEW.comment_id IS NOT NULL THEN
    NEW.post_id := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS trigger_normalize_like_insert ON likes;

-- Create the trigger
CREATE TRIGGER trigger_normalize_like_insert
  BEFORE INSERT ON likes
  FOR EACH ROW
  EXECUTE FUNCTION normalize_like_insert();

-- Add a trigger to update post likes count
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.post_id IS NOT NULL THEN
      UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.post_id IS NOT NULL THEN
      UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_post_like_count ON likes;
CREATE TRIGGER trigger_update_post_like_count
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW
  EXECUTE FUNCTION update_post_like_count();

-- Update RLS policies to be more explicit
DROP POLICY IF EXISTS "Users can create likes" ON likes;
CREATE POLICY "Users can create likes"
  ON likes FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND 
    (post_id IS NOT NULL OR comment_id IS NOT NULL)
  );

DROP POLICY IF EXISTS "Users can delete their own likes" ON likes;
CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

RAISE NOTICE '✅ Likes table triggers and policies updated!';
