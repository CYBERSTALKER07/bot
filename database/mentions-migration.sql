-- Add mentions column to posts and post_comments
ALTER TABLE posts ADD COLUMN IF NOT EXISTS mentions UUID[] DEFAULT ARRAY[]::UUID[];
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS mentions UUID[] DEFAULT ARRAY[]::UUID[];

-- Function to handle new mentions
CREATE OR REPLACE FUNCTION handle_new_mention()
RETURNS TRIGGER AS $$
DECLARE
  mentioned_user_id UUID;
BEGIN
  -- Check if there are mentions
  IF NEW.mentions IS NOT NULL AND array_length(NEW.mentions, 1) > 0 THEN
    FOREACH mentioned_user_id IN ARRAY NEW.mentions
    LOOP
      -- Don't notify if user mentions themselves
      IF mentioned_user_id != NEW.user_id THEN
        -- Determine the type and resource ID based on the table
        IF TG_TABLE_NAME = 'posts' THEN
          INSERT INTO notifications (user_id, actor_id, type, title, post_id, message, created_at)
          VALUES (mentioned_user_id, NEW.user_id, 'mention_post', 'New Mention', NEW.id, 'mentioned you in a post', NOW());
        ELSIF TG_TABLE_NAME = 'post_comments' THEN
          INSERT INTO notifications (user_id, actor_id, type, title, post_id, comment_id, message, created_at)
          VALUES (mentioned_user_id, NEW.user_id, 'mention_comment', 'New Mention', NEW.post_id, NEW.id, 'mentioned you in a comment', NOW());
        END IF;
      END IF;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers if they exist to avoid duplication
DROP TRIGGER IF EXISTS on_post_mention ON posts;
DROP TRIGGER IF EXISTS on_comment_mention ON post_comments;

-- Create triggers
CREATE TRIGGER on_post_mention
  AFTER INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_mention();

CREATE TRIGGER on_comment_mention
  AFTER INSERT ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_mention();

-- Update check constraint to allow new mention types
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
  CHECK (type IN ('like', 'comment', 'follow', 'mention', 'post', 'system', 'mention_post', 'mention_comment', 'job_match', 'application_update', 'message', 'event'));


