-- ============================================
-- PERFORMANCE OPTIMIZATION INDEXES
-- Enterprise-level database optimization
-- ============================================
-- 1. Optimize feed queries (most common query)
-- This is the most critical index for performance
CREATE INDEX IF NOT EXISTS idx_posts_feed_optimized ON posts(visibility, created_at DESC)
WHERE visibility = 'public';
-- 2. Optimize user posts lookup
CREATE INDEX IF NOT EXISTS idx_posts_user_timeline ON posts(user_id, created_at DESC);
-- 3. Optimize profile views queries
CREATE INDEX IF NOT EXISTS idx_profile_views_recent ON profile_views(profile_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewer ON profile_views(viewer_id, viewed_at DESC);
-- 4. Optimize follows queries (who to follow, followers list)
CREATE INDEX IF NOT EXISTS idx_follows_composite ON follows(follower_id, following_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_follows_reverse ON follows(following_id, follower_id, created_at DESC);
-- 5. Optimize likes queries
CREATE INDEX IF NOT EXISTS idx_likes_post_user ON likes(post_id, user_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_recent ON likes(user_id, created_at DESC);
-- 6. Optimize comments queries
CREATE INDEX IF NOT EXISTS idx_comments_post_recent ON comments(post_id, created_at DESC);
-- 7. Optimize jobs queries
CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(status, posted_at DESC)
WHERE status = 'open';
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company_id, status, posted_at DESC);
-- 8. Optimize applications queries
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id, status, applied_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id, status, applied_at DESC);
-- ============================================
-- QUERY PERFORMANCE OPTIMIZATION
-- ============================================
-- Analyze tables for better query planning
ANALYZE posts;
ANALYZE profiles;
ANALYZE follows;
ANALYZE likes;
ANALYZE comments;
ANALYZE jobs;
ANALYZE applications;
ANALYZE profile_views;
-- Vacuum commands removed as they cannot run in transaction blocks
-- You can run VACUUM ANALYZE separately if needed
-- ============================================
-- INDEX COMMENTS
-- ============================================
COMMENT ON INDEX idx_posts_feed_optimized IS 'Optimizes main feed query - most critical index for performance';
COMMENT ON INDEX idx_profile_views_recent IS 'Optimizes profile viewers feature';
COMMENT ON INDEX idx_follows_composite IS 'Optimizes follow/unfollow operations';
COMMENT ON INDEX idx_jobs_active IS 'Optimizes active jobs listing';