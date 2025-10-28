-- DELETE ALL DATA FROM DATABASE (Supabase UUID-based schema)
-- This script clears all user data, posts, likes, comments, and related records
-- WARNING: This operation is irreversible. Backup your data first!

-- Disable foreign key constraints temporarily
SET session_replication_role = 'replica';

-- Delete from all tables in order of dependencies
-- Start with tables that don't have dependencies on others

-- Clear notification-related data
DELETE FROM notifications;

-- Clear like records
DELETE FROM likes;
DELETE FROM post_likes;

-- Clear retweets and shares
DELETE FROM post_retweets;
DELETE FROM post_shares;

-- Clear bookmarks
DELETE FROM post_bookmarks;

-- Clear comments
DELETE FROM comments;

-- Clear posts
DELETE FROM posts;

-- Clear job applications
DELETE FROM applications;

-- Clear jobs
DELETE FROM jobs;

-- Clear event attendees
DELETE FROM event_attendees;

-- Clear employer events
DELETE FROM employer_events;

-- Clear user follows
DELETE FROM follows;

-- Clear user preferences
DELETE FROM user_preferences;

-- Clear profiles (profiles are linked to auth.users)
DELETE FROM profiles;

-- Note: Do NOT delete from auth.users - these are managed by Supabase Auth
-- If you need to delete auth users, do it through Supabase Auth UI or auth API

-- Delete from companies table (if it has no dependencies)
DELETE FROM companies;

-- Re-enable foreign key constraints
SET session_replication_role = 'origin';

-- Verification message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ ALL USER DATA DELETED SUCCESSFULLY!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Notifications cleared';
  RAISE NOTICE '✅ Likes cleared';
  RAISE NOTICE '✅ Posts cleared';
  RAISE NOTICE '✅ Comments cleared';
  RAISE NOTICE '✅ Jobs and applications cleared';
  RAISE NOTICE '✅ Events and attendees cleared';
  RAISE NOTICE '✅ Follows cleared';
  RAISE NOTICE '✅ User preferences cleared';
  RAISE NOTICE '✅ Profiles cleared';
  RAISE NOTICE '✅ Companies cleared';
  RAISE NOTICE '';
  RAISE NOTICE 'Note: auth.users were NOT deleted.';
  RAISE NOTICE 'To delete Supabase Auth users, use the Auth UI or auth API.';
  RAISE NOTICE 'Database is now empty but schema preserved.';
  RAISE NOTICE '========================================';
END $$;
