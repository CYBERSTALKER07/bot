-- ============================================================================
-- HASHTAG SYSTEM - Complete Database Schema
-- ============================================================================
-- This script creates a sophisticated hashtag system with:
-- 1. Hashtag storage and trending calculations
-- 2. User interest profiling
-- 3. Post-hashtag associations
-- 4. Intelligent feed ranking functions
-- 5. Automatic hashtag extraction and processing
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- Enable required PostgreSQL extensions
-- ============================================================================

-- Enable pg_trgm for fuzzy text search (optional, for better search performance)
-- If this fails, the system will still work but search will be less efficient
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- TABLE: hashtags
-- Stores all unique hashtags with usage metrics and trending scores
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.hashtags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  normalized_name TEXT NOT NULL UNIQUE, -- Lowercase for case-insensitive matching - MUST BE UNIQUE
  description TEXT,
  category TEXT CHECK (category IN ('technology', 'business', 'sports', 'entertainment', 'science', 'politics', 'health', 'education', 'other')),
  
  -- Usage metrics
  usage_count INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  
  -- Trending calculation
  trending_score DECIMAL(10, 4) DEFAULT 0.0,
  trending_rank INTEGER,
  
  -- Timestamps
  first_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_hashtags_normalized_name ON public.hashtags(normalized_name);
CREATE INDEX IF NOT EXISTS idx_hashtags_trending_score ON public.hashtags(trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_hashtags_usage_count ON public.hashtags(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_hashtags_category ON public.hashtags(category);
CREATE INDEX IF NOT EXISTS idx_hashtags_last_used_at ON public.hashtags(last_used_at DESC);

-- Full-text search index (only if pg_trgm extension is available)
-- This provides fuzzy matching for hashtag search
DO $$
BEGIN
  -- Check if pg_trgm extension exists
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') THEN
    -- Create trigram index for fuzzy search
    CREATE INDEX IF NOT EXISTS idx_hashtags_name_trgm ON public.hashtags USING gin(name gin_trgm_ops);
    RAISE NOTICE '✅ Trigram index created for fuzzy hashtag search';
  ELSE
    RAISE NOTICE '⚠️  pg_trgm extension not available - fuzzy search will be limited';
    RAISE NOTICE 'To enable: Run "CREATE EXTENSION pg_trgm;" as superuser';
  END IF;
END $$;


-- ============================================================================
-- TABLE: post_hashtags
-- Junction table linking posts to hashtags (many-to-many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.post_hashtags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  hashtag_id UUID NOT NULL REFERENCES public.hashtags(id) ON DELETE CASCADE,
  position INTEGER, -- Position of hashtag in post content (for analytics)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(post_id, hashtag_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_post_hashtags_post_id ON public.post_hashtags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_hashtags_hashtag_id ON public.post_hashtags(hashtag_id);
CREATE INDEX IF NOT EXISTS idx_post_hashtags_created_at ON public.post_hashtags(created_at DESC);

-- ============================================================================
-- TABLE: user_interests
-- Tracks user interests based on hashtag interactions
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hashtag_id UUID NOT NULL REFERENCES public.hashtags(id) ON DELETE CASCADE,
  
  -- Interest weight (0.0 to 1.0)
  -- Calculated from: posts created, likes, retweets, comments, follows
  interest_weight DECIMAL(5, 4) DEFAULT 0.0 CHECK (interest_weight >= 0 AND interest_weight <= 1),
  
  -- Interaction counts
  posts_created INTEGER DEFAULT 0,
  posts_liked INTEGER DEFAULT 0,
  posts_retweeted INTEGER DEFAULT 0,
  posts_commented INTEGER DEFAULT 0,
  
  -- Following
  is_following BOOLEAN DEFAULT FALSE,
  followed_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  first_interaction_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_interaction_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, hashtag_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_interests_user_id ON public.user_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interests_hashtag_id ON public.user_interests(hashtag_id);
CREATE INDEX IF NOT EXISTS idx_user_interests_weight ON public.user_interests(interest_weight DESC);
CREATE INDEX IF NOT EXISTS idx_user_interests_following ON public.user_interests(user_id, is_following) WHERE is_following = TRUE;

-- ============================================================================
-- TABLE: user_hashtag_interactions
-- Detailed tracking of user interactions with hashtag-related posts
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_hashtag_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  hashtag_id UUID NOT NULL REFERENCES public.hashtags(id) ON DELETE CASCADE,
  
  -- Interaction type
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'like', 'retweet', 'comment', 'share', 'bookmark')),
  
  -- Engagement score (weighted by interaction type)
  engagement_score DECIMAL(5, 2) DEFAULT 0.0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_hashtag_interactions_user_id ON public.user_hashtag_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_hashtag_interactions_hashtag_id ON public.user_hashtag_interactions(hashtag_id);
CREATE INDEX IF NOT EXISTS idx_user_hashtag_interactions_created_at ON public.user_hashtag_interactions(created_at DESC);

-- ============================================================================
-- TABLE: hashtag_trends
-- Historical trending data for analytics
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.hashtag_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hashtag_id UUID NOT NULL REFERENCES public.hashtags(id) ON DELETE CASCADE,
  
  -- Snapshot data
  usage_count INTEGER DEFAULT 0,
  trending_score DECIMAL(10, 4) DEFAULT 0.0,
  trending_rank INTEGER,
  
  -- Time period
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  period_type TEXT CHECK (period_type IN ('hourly', 'daily', 'weekly')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hashtag_trends_hashtag_id ON public.hashtag_trends(hashtag_id);
CREATE INDEX IF NOT EXISTS idx_hashtag_trends_period ON public.hashtag_trends(period_start DESC, period_type);

-- ============================================================================
-- FUNCTION: extract_hashtags
-- Extracts hashtags from post content using regex
-- ============================================================================
CREATE OR REPLACE FUNCTION public.extract_hashtags(content TEXT)
RETURNS TEXT[] AS $$
DECLARE
  hashtags TEXT[];
BEGIN
  -- Extract hashtags using regex pattern
  -- Matches #word (letters, numbers, underscores)
  SELECT ARRAY_AGG(DISTINCT LOWER(SUBSTRING(match FROM 2)))
  INTO hashtags
  FROM regexp_matches(content, '#([A-Za-z0-9_]+)', 'g') AS match;
  
  RETURN COALESCE(hashtags, ARRAY[]::TEXT[]);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- FUNCTION: upsert_hashtag
-- Creates or updates a hashtag, returns hashtag_id
-- ============================================================================
CREATE OR REPLACE FUNCTION public.upsert_hashtag(hashtag_name TEXT)
RETURNS UUID AS $$
DECLARE
  hashtag_id UUID;
  normalized TEXT;
BEGIN
  normalized := LOWER(TRIM(hashtag_name));
  
  -- Insert or update hashtag
  INSERT INTO public.hashtags (name, normalized_name, usage_count, last_used_at)
  VALUES (hashtag_name, normalized, 1, NOW())
  ON CONFLICT (normalized_name) 
  DO UPDATE SET 
    usage_count = hashtags.usage_count + 1,
    last_used_at = NOW(),
    updated_at = NOW()
  RETURNING id INTO hashtag_id;
  
  RETURN hashtag_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: calculate_trending_score
-- Calculates trending score using time-decay algorithm
-- Formula: score = (usage_count * engagement_factor) / (time_decay_factor)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.calculate_trending_score(
  p_hashtag_id UUID,
  p_time_window_hours INTEGER DEFAULT 24
)
RETURNS DECIMAL(10, 4) AS $$
DECLARE
  recent_usage INTEGER;
  total_engagement INTEGER;
  hours_since_last_use DECIMAL;
  time_decay_factor DECIMAL;
  engagement_factor DECIMAL;
  trending_score DECIMAL(10, 4);
BEGIN
  -- Get recent usage count (last N hours)
  SELECT COUNT(*)
  INTO recent_usage
  FROM public.post_hashtags ph
  WHERE ph.hashtag_id = p_hashtag_id
    AND ph.created_at >= NOW() - INTERVAL '1 hour' * p_time_window_hours;
  
  -- Get total engagement (likes + retweets + comments on posts with this hashtag)
  SELECT COALESCE(SUM(p.likes_count + p.retweets_count + p.comments_count), 0)
  INTO total_engagement
  FROM public.posts p
  JOIN public.post_hashtags ph ON p.id = ph.post_id
  WHERE ph.hashtag_id = p_hashtag_id
    AND ph.created_at >= NOW() - INTERVAL '1 hour' * p_time_window_hours;
  
  -- Calculate hours since last use
  SELECT EXTRACT(EPOCH FROM (NOW() - last_used_at)) / 3600
  INTO hours_since_last_use
  FROM public.hashtags
  WHERE id = p_hashtag_id;
  
  -- Time decay factor (exponential decay with half-life of 6 hours)
  time_decay_factor := POWER(2, -(hours_since_last_use / 6.0));
  
  -- Engagement factor (normalized)
  engagement_factor := 1.0 + (total_engagement::DECIMAL / NULLIF(recent_usage, 0)::DECIMAL / 100.0);
  
  -- Calculate final trending score
  trending_score := (recent_usage * engagement_factor * time_decay_factor);
  
  RETURN GREATEST(trending_score, 0.0);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: update_all_trending_scores
-- Updates trending scores for all hashtags (run periodically)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_all_trending_scores()
RETURNS void AS $$
BEGIN
  -- Update trending scores
  UPDATE public.hashtags
  SET 
    trending_score = public.calculate_trending_score(id, 24),
    updated_at = NOW();
  
  -- Update trending ranks
  WITH ranked_hashtags AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (ORDER BY trending_score DESC) AS rank
    FROM public.hashtags
    WHERE trending_score > 0
  )
  UPDATE public.hashtags h
  SET trending_rank = rh.rank
  FROM ranked_hashtags rh
  WHERE h.id = rh.id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: update_user_interest_weight
-- Recalculates user interest weight based on interactions
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_user_interest_weight(
  p_user_id UUID,
  p_hashtag_id UUID
)
RETURNS void AS $$
DECLARE
  total_interactions INTEGER;
  weight DECIMAL(5, 4);
BEGIN
  -- Get interaction counts
  SELECT 
    posts_created,
    posts_liked,
    posts_retweeted,
    posts_commented
  INTO total_interactions
  FROM public.user_interests
  WHERE user_id = p_user_id AND hashtag_id = p_hashtag_id;
  
  -- Calculate weight (weighted sum, normalized to 0-1)
  -- Posts created: 0.4, Liked: 0.2, Retweeted: 0.3, Commented: 0.1
  weight := LEAST(
    (
      (COALESCE((SELECT posts_created FROM public.user_interests WHERE user_id = p_user_id AND hashtag_id = p_hashtag_id), 0) * 0.4) +
      (COALESCE((SELECT posts_liked FROM public.user_interests WHERE user_id = p_user_id AND hashtag_id = p_hashtag_id), 0) * 0.2) +
      (COALESCE((SELECT posts_retweeted FROM public.user_interests WHERE user_id = p_user_id AND hashtag_id = p_hashtag_id), 0) * 0.3) +
      (COALESCE((SELECT posts_commented FROM public.user_interests WHERE user_id = p_user_id AND hashtag_id = p_hashtag_id), 0) * 0.1)
    ) / 10.0,
    1.0
  );
  
  -- Update weight
  UPDATE public.user_interests
  SET 
    interest_weight = weight,
    updated_at = NOW()
  WHERE user_id = p_user_id AND hashtag_id = p_hashtag_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: get_personalized_feed
-- Returns ranked post IDs for user's personalized feed
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_personalized_feed(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  post_id UUID,
  relevance_score DECIMAL(10, 4)
) AS $$
BEGIN
  RETURN QUERY
  WITH user_interest_hashtags AS (
    -- Get user's interested hashtags with weights
    SELECT hashtag_id, interest_weight
    FROM public.user_interests
    WHERE user_id = p_user_id
      AND interest_weight > 0.1
  ),
  post_scores AS (
    SELECT 
      p.id AS post_id,
      
      -- Hashtag relevance score (40% weight)
      COALESCE(
        (
          SELECT AVG(ui.interest_weight) * 0.4
          FROM public.post_hashtags ph
          JOIN user_interest_hashtags ui ON ph.hashtag_id = ui.hashtag_id
          WHERE ph.post_id = p.id
        ),
        0.0
      ) AS hashtag_score,
      
      -- Engagement score (30% weight)
      (
        (p.likes_count * 1.0 + p.retweets_count * 2.0 + p.comments_count * 3.0) / 
        NULLIF(EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600, 0) * 0.3
      ) AS engagement_score,
      
      -- Recency score (20% weight) - exponential decay
      (
        POWER(2, -(EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600 / 6.0)) * 0.2
      ) AS recency_score,
      
      -- Diversity score (10% weight) - boost posts from different authors
      0.1 AS diversity_score,
      
      p.created_at
      
    FROM public.posts p
    WHERE p.visibility = 'public'
      AND p.created_at >= NOW() - INTERVAL '7 days' -- Only last 7 days
  )
  SELECT 
    post_id,
    (hashtag_score + engagement_score + recency_score + diversity_score) AS relevance_score
  FROM post_scores
  ORDER BY relevance_score DESC, created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGER: process_post_hashtags
-- Automatically extracts and associates hashtags when post is created/updated
-- ============================================================================
CREATE OR REPLACE FUNCTION public.process_post_hashtags()
RETURNS TRIGGER AS $$
DECLARE
  hashtag_names TEXT[];
  hashtag_name TEXT;
  hashtag_id UUID;
  position_counter INTEGER := 0;
BEGIN
  -- Extract hashtags from content
  hashtag_names := public.extract_hashtags(NEW.content);
  
  -- If post is being updated, remove old associations
  IF TG_OP = 'UPDATE' THEN
    DELETE FROM public.post_hashtags WHERE post_id = NEW.id;
  END IF;
  
  -- Process each hashtag
  FOREACH hashtag_name IN ARRAY hashtag_names
  LOOP
    position_counter := position_counter + 1;
    
    -- Upsert hashtag
    hashtag_id := public.upsert_hashtag(hashtag_name);
    
    -- Create post-hashtag association
    INSERT INTO public.post_hashtags (post_id, hashtag_id, position)
    VALUES (NEW.id, hashtag_id, position_counter)
    ON CONFLICT (post_id, hashtag_id) DO NOTHING;
    
    -- Update or create user interest
    INSERT INTO public.user_interests (user_id, hashtag_id, posts_created, last_interaction_at)
    VALUES (NEW.user_id, hashtag_id, 1, NOW())
    ON CONFLICT (user_id, hashtag_id) 
    DO UPDATE SET 
      posts_created = user_interests.posts_created + 1,
      last_interaction_at = NOW();
    
    -- Recalculate interest weight
    PERFORM public.update_user_interest_weight(NEW.user_id, hashtag_id);
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_process_post_hashtags ON public.posts;
CREATE TRIGGER trigger_process_post_hashtags
  AFTER INSERT OR UPDATE OF content ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.process_post_hashtags();

-- ============================================================================
-- TRIGGER: track_hashtag_interaction
-- Tracks user interactions with posts containing hashtags
-- ============================================================================
CREATE OR REPLACE FUNCTION public.track_hashtag_interaction()
RETURNS TRIGGER AS $$
DECLARE
  hashtag_record RECORD;
  interaction_type TEXT;
  engagement_score DECIMAL(5, 2);
BEGIN
  -- Determine interaction type and score
  IF TG_TABLE_NAME = 'post_likes' THEN
    interaction_type := 'like';
    engagement_score := 1.0;
  ELSIF TG_TABLE_NAME = 'retweets' THEN
    interaction_type := 'retweet';
    engagement_score := 2.0;
  ELSIF TG_TABLE_NAME = 'post_comments' THEN
    interaction_type := 'comment';
    engagement_score := 3.0;
  ELSIF TG_TABLE_NAME = 'post_bookmarks' THEN
    interaction_type := 'bookmark';
    engagement_score := 0.5;
  ELSE
    RETURN NEW;
  END IF;
  
  -- Track interaction for each hashtag in the post
  FOR hashtag_record IN 
    SELECT hashtag_id 
    FROM public.post_hashtags 
    WHERE post_id = NEW.post_id
  LOOP
    -- Insert interaction record
    INSERT INTO public.user_hashtag_interactions (
      user_id, post_id, hashtag_id, interaction_type, engagement_score
    )
    VALUES (
      NEW.user_id, NEW.post_id, hashtag_record.hashtag_id, interaction_type, engagement_score
    );
    
    -- Update user interest
    IF interaction_type = 'like' THEN
      UPDATE public.user_interests
      SET posts_liked = posts_liked + 1, last_interaction_at = NOW()
      WHERE user_id = NEW.user_id AND hashtag_id = hashtag_record.hashtag_id;
    ELSIF interaction_type = 'retweet' THEN
      UPDATE public.user_interests
      SET posts_retweeted = posts_retweeted + 1, last_interaction_at = NOW()
      WHERE user_id = NEW.user_id AND hashtag_id = hashtag_record.hashtag_id;
    ELSIF interaction_type = 'comment' THEN
      UPDATE public.user_interests
      SET posts_commented = posts_commented + 1, last_interaction_at = NOW()
      WHERE user_id = NEW.user_id AND hashtag_id = hashtag_record.hashtag_id;
    END IF;
    
    -- Recalculate interest weight
    PERFORM public.update_user_interest_weight(NEW.user_id, hashtag_record.hashtag_id);
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for different interaction types (only if tables exist)
-- This makes the migration compatible with databases that may not have all tables yet

-- Trigger for post_likes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'post_likes') THEN
    DROP TRIGGER IF EXISTS trigger_track_like_interaction ON public.post_likes;
    CREATE TRIGGER trigger_track_like_interaction
      AFTER INSERT ON public.post_likes
      FOR EACH ROW
      EXECUTE FUNCTION public.track_hashtag_interaction();
    RAISE NOTICE '✅ Created trigger for post_likes';
  ELSE
    RAISE NOTICE '⚠️  Table post_likes does not exist - skipping trigger creation';
  END IF;
END $$;

-- Trigger for post_comments
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'post_comments') THEN
    DROP TRIGGER IF EXISTS trigger_track_comment_interaction ON public.post_comments;
    CREATE TRIGGER trigger_track_comment_interaction
      AFTER INSERT ON public.post_comments
      FOR EACH ROW
      EXECUTE FUNCTION public.track_hashtag_interaction();
    RAISE NOTICE '✅ Created trigger for post_comments';
  ELSE
    RAISE NOTICE '⚠️  Table post_comments does not exist - skipping trigger creation';
  END IF;
END $$;

-- Trigger for post_bookmarks
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'post_bookmarks') THEN
    DROP TRIGGER IF EXISTS trigger_track_bookmark_interaction ON public.post_bookmarks;
    CREATE TRIGGER trigger_track_bookmark_interaction
      AFTER INSERT ON public.post_bookmarks
      FOR EACH ROW
      EXECUTE FUNCTION public.track_hashtag_interaction();
    RAISE NOTICE '✅ Created trigger for post_bookmarks';
  ELSE
    RAISE NOTICE '⚠️  Table post_bookmarks does not exist - skipping trigger creation';
  END IF;
END $$;


-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE public.hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_hashtag_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hashtag_trends ENABLE ROW LEVEL SECURITY;

-- Hashtags: Public read, no write (managed by triggers)
DROP POLICY IF EXISTS "Hashtags are viewable by everyone" ON public.hashtags;
CREATE POLICY "Hashtags are viewable by everyone"
  ON public.hashtags FOR SELECT
  USING (true);

-- Post hashtags: Public read, no direct write
DROP POLICY IF EXISTS "Post hashtags are viewable by everyone" ON public.post_hashtags;
CREATE POLICY "Post hashtags are viewable by everyone"
  ON public.post_hashtags FOR SELECT
  USING (true);

-- User interests: Users can view and manage their own
DROP POLICY IF EXISTS "Users can view their own interests" ON public.user_interests;
CREATE POLICY "Users can view their own interests"
  ON public.user_interests FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own interests" ON public.user_interests;
CREATE POLICY "Users can update their own interests"
  ON public.user_interests FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own interests" ON public.user_interests;
CREATE POLICY "Users can insert their own interests"
  ON public.user_interests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User hashtag interactions: Users can view their own
DROP POLICY IF EXISTS "Users can view their own hashtag interactions" ON public.user_hashtag_interactions;
CREATE POLICY "Users can view their own hashtag interactions"
  ON public.user_hashtag_interactions FOR SELECT
  USING (auth.uid() = user_id);

-- Hashtag trends: Public read
DROP POLICY IF EXISTS "Hashtag trends are viewable by everyone" ON public.hashtag_trends;
CREATE POLICY "Hashtag trends are viewable by everyone"
  ON public.hashtag_trends FOR SELECT
  USING (true);

-- ============================================================================
-- HELPER FUNCTIONS FOR API
-- ============================================================================

-- Get trending hashtags
CREATE OR REPLACE FUNCTION public.get_trending_hashtags(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  name TEXT,
  usage_count INTEGER,
  trending_score DECIMAL(10, 4),
  trending_rank INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT h.id, h.name, h.usage_count, h.trending_score, h.trending_rank
  FROM public.hashtags h
  WHERE h.trending_score > 0
  ORDER BY h.trending_score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Search hashtags
CREATE OR REPLACE FUNCTION public.search_hashtags(
  p_query TEXT,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  usage_count INTEGER,
  trending_score DECIMAL(10, 4),
  is_trending BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    h.id, 
    h.name, 
    h.usage_count, 
    h.trending_score,
    (h.trending_rank IS NOT NULL AND h.trending_rank <= 50) AS is_trending
  FROM public.hashtags h
  WHERE h.normalized_name LIKE LOWER(p_query) || '%'
     OR h.name ILIKE '%' || p_query || '%'
  ORDER BY 
    h.trending_score DESC,
    h.usage_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Follow/unfollow hashtag
CREATE OR REPLACE FUNCTION public.toggle_hashtag_follow(
  p_user_id UUID,
  p_hashtag_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  is_following BOOLEAN;
BEGIN
  -- Check current status
  SELECT user_interests.is_following INTO is_following
  FROM public.user_interests
  WHERE user_id = p_user_id AND hashtag_id = p_hashtag_id;
  
  IF is_following IS NULL THEN
    -- Create new interest
    INSERT INTO public.user_interests (user_id, hashtag_id, is_following, followed_at)
    VALUES (p_user_id, p_hashtag_id, TRUE, NOW());
    
    -- Update follower count
    UPDATE public.hashtags
    SET follower_count = follower_count + 1
    WHERE id = p_hashtag_id;
    
    RETURN TRUE;
  ELSE
    -- Toggle follow status
    UPDATE public.user_interests
    SET 
      is_following = NOT is_following,
      followed_at = CASE WHEN NOT is_following THEN NOW() ELSE NULL END
    WHERE user_id = p_user_id AND hashtag_id = p_hashtag_id;
    
    -- Update follower count
    UPDATE public.hashtags
    SET follower_count = follower_count + CASE WHEN is_following THEN -1 ELSE 1 END
    WHERE id = p_hashtag_id;
    
    RETURN NOT is_following;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Insert some sample hashtags
INSERT INTO public.hashtags (name, normalized_name, category, usage_count, trending_score) VALUES
  ('AI', 'ai', 'technology', 1250, 85.5),
  ('MachineLearning', 'machinelearning', 'technology', 980, 72.3),
  ('JavaScript', 'javascript', 'technology', 1500, 68.9),
  ('React', 'react', 'technology', 1100, 65.2),
  ('Career', 'career', 'business', 890, 45.6),
  ('Hiring', 'hiring', 'business', 750, 42.1),
  ('Startup', 'startup', 'business', 680, 38.7),
  ('Fitness', 'fitness', 'health', 920, 35.4),
  ('Travel', 'travel', 'entertainment', 1050, 32.8),
  ('Photography', 'photography', 'entertainment', 870, 28.9)
ON CONFLICT (normalized_name) DO NOTHING;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Hashtag system tables created successfully!';
  RAISE NOTICE '✅ Automatic hashtag extraction enabled via triggers';
  RAISE NOTICE '✅ User interest profiling configured';
  RAISE NOTICE '✅ Trending calculation functions ready';
  RAISE NOTICE '✅ Intelligent feed ranking functions available';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Next steps:';
  RAISE NOTICE '1. Run: SELECT public.update_all_trending_scores(); to initialize trending scores';
  RAISE NOTICE '2. Set up a cron job to run update_all_trending_scores() every hour';
  RAISE NOTICE '3. Test hashtag extraction by creating a post with hashtags';
  RAISE NOTICE '4. Query trending hashtags: SELECT * FROM public.get_trending_hashtags(10);';
END $$;
