-- Comprehensive RLS Policy Fix for All Tables
-- Run this to fix access control errors

-- ============================================
-- JOBS TABLE RLS POLICIES (Fixed)
-- ============================================
DROP POLICY IF EXISTS "Employers can view jobs" ON jobs;
DROP POLICY IF EXISTS "Employers can create jobs" ON jobs;
DROP POLICY IF EXISTS "Employers can update their own jobs" ON jobs;
DROP POLICY IF EXISTS "Employers can delete their own jobs" ON jobs;

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Everyone can view all jobs (public listings)
CREATE POLICY "Anyone can view jobs"
  ON jobs FOR SELECT
  USING (true);

-- Only employers can insert jobs
CREATE POLICY "Employers can insert jobs"
  ON jobs FOR INSERT
  WITH CHECK (auth.uid() = employer_id);

-- Only job owner can update
CREATE POLICY "Employers can update own jobs"
  ON jobs FOR UPDATE
  USING (auth.uid() = employer_id)
  WITH CHECK (auth.uid() = employer_id);

-- Only job owner can delete
CREATE POLICY "Employers can delete own jobs"
  ON jobs FOR DELETE
  USING (auth.uid() = employer_id);

-- ============================================
-- APPLICATIONS TABLE RLS POLICIES (Fixed)
-- ============================================
DROP POLICY IF EXISTS "Students can view their applications" ON applications;
DROP POLICY IF EXISTS "Students can create applications" ON applications;
DROP POLICY IF EXISTS "Employers can view job applications" ON applications;
DROP POLICY IF EXISTS "Employers can update applications" ON applications;

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Students can view their own applications
CREATE POLICY "Students view own applications"
  ON applications FOR SELECT
  USING (auth.uid() = student_id);

-- Employers can view applications for their jobs
CREATE POLICY "Employers view applications"
  ON applications FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM jobs 
    WHERE jobs.id = applications.job_id 
    AND jobs.employer_id = auth.uid()
  ));

-- Students can create applications
CREATE POLICY "Students create applications"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Employers can update applications for their jobs
CREATE POLICY "Employers update applications"
  ON applications FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM jobs 
    WHERE jobs.id = applications.job_id 
    AND jobs.employer_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM jobs 
    WHERE jobs.id = applications.job_id 
    AND jobs.employer_id = auth.uid()
  ));

-- ============================================
-- NOTIFICATIONS TABLE RLS POLICIES (Fixed)
-- ============================================
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only view their own notifications
CREATE POLICY "Users view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- System/service can insert notifications
CREATE POLICY "System inserts notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Users can update their own notifications
CREATE POLICY "Users update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FOLLOWS TABLE RLS POLICIES (Fixed)
-- ============================================
DROP POLICY IF EXISTS "Users can view follows" ON follows;
DROP POLICY IF EXISTS "Users can create follows" ON follows;
DROP POLICY IF EXISTS "Users can delete follows" ON follows;

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Anyone can view all follows (public relationship data)
CREATE POLICY "Anyone can view follows"
  ON follows FOR SELECT
  USING (true);

-- Users can only follow/unfollow themselves
CREATE POLICY "Users can create follows"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- Users can only remove their own follows
CREATE POLICY "Users can delete follows"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);

-- ============================================
-- PROFILES TABLE RLS POLICIES (Fixed)
-- ============================================
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view all profiles (public profiles)
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- POSTS TABLE RLS POLICIES (Fixed)
-- ============================================
DROP POLICY IF EXISTS "Public posts are viewable" ON posts;
DROP POLICY IF EXISTS "Users can create posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Public posts are viewable by everyone
CREATE POLICY "Anyone can view public posts"
  ON posts FOR SELECT
  USING (visibility = 'public' OR auth.uid() = user_id);

-- Users can create posts
CREATE POLICY "Users create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POST_LIKES TABLE RLS POLICIES (Fixed)
-- ============================================
DROP POLICY IF EXISTS "Anyone can view likes" ON post_likes;
DROP POLICY IF EXISTS "Users can create likes" ON post_likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON post_likes;

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can view likes
CREATE POLICY "Anyone can view post likes"
  ON post_likes FOR SELECT
  USING (true);

-- Users can like posts
CREATE POLICY "Users can like posts"
  ON post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their own likes
CREATE POLICY "Users delete own likes"
  ON post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POST_COMMENTS TABLE RLS POLICIES (Fixed)
-- ============================================
DROP POLICY IF EXISTS "Anyone can view comments" ON post_comments;
DROP POLICY IF EXISTS "Users can create comments" ON post_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON post_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON post_comments;

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can view comments
CREATE POLICY "Anyone can view comments"
  ON post_comments FOR SELECT
  USING (true);

-- Users can create comments
CREATE POLICY "Users create comments"
  ON post_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users update own comments"
  ON post_comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users delete own comments"
  ON post_comments FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- MESSAGES TABLE RLS POLICIES (Fixed)
-- ============================================
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can delete own messages" ON messages;

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages where they are sender or receiver
CREATE POLICY "Users view own messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can send messages
CREATE POLICY "Users send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Users can delete their own messages
CREATE POLICY "Users delete own messages"
  ON messages FOR DELETE
  USING (auth.uid() = sender_id);
