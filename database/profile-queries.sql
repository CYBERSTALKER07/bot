-- Useful SQL Queries for Profile Data Operations in Supabase

-- 1. Get Complete User Profile with Privacy Checks
SELECT 
  p.*,
  up.email_notifications,
  up.dark_mode,
  (SELECT COUNT(*) FROM follows WHERE following_id = p.id) as actual_followers,
  (SELECT COUNT(*) FROM follows WHERE follower_id = p.id) as actual_following
FROM profiles p
LEFT JOIN user_preferences up ON p.id = up.user_id
WHERE p.id = auth.uid();

-- 2. Update Profile Data (matching your EditProfile form)
UPDATE profiles SET
  full_name = $1,
  display_name = $2,
  bio = $3,
  location = $4,
  birth_date = $5,
  is_private = $6,
  show_birth_date = $7,
  phone = $8,
  website = $9,
  linkedin_url = $10,
  github_url = $11,
  portfolio_url = $12,
  company_name = $13,
  industry = $14,
  company_description = $15,
  university = $16,
  degree = $17,
  major = $18,
  gpa = $19,
  skills = $20,
  profile_theme = $21,
  avatar_url = $22,
  cover_image_url = $23
WHERE id = auth.uid()
RETURNING *;

-- 3. Search Profiles (for discovery)
SELECT * FROM search_profiles(
  'software engineer',  -- search query
  'student',           -- filter by role (optional)
  'New York',          -- filter by location (optional)
  10                   -- limit results
);

-- 4. Get User's Network Activity
SELECT 
  f.following_id,
  p.full_name,
  p.username,
  p.avatar_url,
  p.bio,
  p.verified,
  f.created_at as followed_at
FROM follows f
JOIN profiles p ON f.following_id = p.id
WHERE f.follower_id = auth.uid()
ORDER BY f.created_at DESC;

-- 5. Profile Analytics for Current User
SELECT 
  p.profile_views_count,
  p.followers_count,
  p.following_count,
  p.posts_count,
  COUNT(DISTINCT pv.viewer_id) as unique_viewers_last_30_days,
  COUNT(DISTINCT CASE WHEN pv.viewed_at >= NOW() - INTERVAL '7 days' THEN pv.viewer_id END) as weekly_viewers
FROM profiles p
LEFT JOIN profile_views pv ON p.id = pv.profile_id AND pv.viewed_at >= NOW() - INTERVAL '30 days'
WHERE p.id = auth.uid()
GROUP BY p.id;

-- 6. Get Profile Activity Timeline
SELECT 
  pa.activity_type,
  pa.activity_data,
  pa.created_at,
  CASE 
    WHEN pa.activity_type = 'follow' THEN 
      (SELECT full_name FROM profiles WHERE id = (pa.activity_data->>'followed_user')::uuid)
    WHEN pa.activity_type = 'post_created' THEN 'Created a new post'
    ELSE pa.activity_type
  END as activity_description
FROM profile_activity pa
WHERE pa.user_id = auth.uid()
ORDER BY pa.created_at DESC
LIMIT 20;

-- 7. Job Recommendations Based on Skills
SELECT 
  j.*,
  p.full_name as employer_name,
  p.company_name,
  p.avatar_url as employer_avatar,
  (
    SELECT COUNT(*) 
    FROM unnest(j.required_skills) as job_skill
    WHERE job_skill = ANY(
      SELECT unnest(skills) FROM profiles WHERE id = auth.uid()
    )
  ) as skills_match_count,
  CASE 
    WHEN j.salary_min IS NOT NULL AND j.salary_max IS NOT NULL 
    THEN CONCAT('$', j.salary_min, ' - $', j.salary_max, ' ', j.salary_period)
    ELSE 'Salary not specified'
  END as salary_display
FROM jobs j
JOIN profiles p ON j.employer_id = p.id
WHERE j.status = 'open'
  AND j.expires_at > NOW()
ORDER BY skills_match_count DESC, j.created_at DESC
LIMIT 10;

-- 8. People You May Know (mutual connections)
SELECT DISTINCT
  p.id,
  p.username,
  p.full_name,
  p.avatar_url,
  p.bio,
  p.verified,
  COUNT(DISTINCT mutual.following_id) as mutual_connections
FROM profiles p
JOIN follows mutual_follower ON p.id = mutual_follower.following_id
JOIN follows mutual ON mutual_follower.follower_id = mutual.follower_id
WHERE mutual.following_id IN (
  SELECT following_id FROM follows WHERE follower_id = auth.uid()
)
AND p.id != auth.uid()
AND p.id NOT IN (
  SELECT following_id FROM follows WHERE follower_id = auth.uid()
)
AND NOT p.is_private
GROUP BY p.id, p.username, p.full_name, p.avatar_url, p.bio, p.verified
HAVING COUNT(DISTINCT mutual.following_id) >= 2
ORDER BY mutual_connections DESC, p.followers_count DESC
LIMIT 5;

-- 9. Update User Preferences
UPDATE user_preferences SET
  email_notifications = $1,
  push_notifications = $2,
  dark_mode = $3,
  discoverable = $4,
  show_online_status = $5,
  content_language = $6,
  timezone = $7
WHERE user_id = auth.uid()
RETURNING *;

-- 10. Get Profile Completion Percentage
SELECT 
  p.id,
  p.full_name,
  ROUND(
    (
      CASE WHEN p.full_name IS NOT NULL AND LENGTH(p.full_name) > 0 THEN 10 ELSE 0 END +
      CASE WHEN p.bio IS NOT NULL AND LENGTH(p.bio) > 0 THEN 10 ELSE 0 END +
      CASE WHEN p.avatar_url IS NOT NULL THEN 15 ELSE 0 END +
      CASE WHEN p.cover_image_url IS NOT NULL THEN 10 ELSE 0 END +
      CASE WHEN p.location IS NOT NULL AND LENGTH(p.location) > 0 THEN 5 ELSE 0 END +
      CASE WHEN p.phone IS NOT NULL AND LENGTH(p.phone) > 0 THEN 5 ELSE 0 END +
      CASE WHEN p.website IS NOT NULL AND LENGTH(p.website) > 0 THEN 5 ELSE 0 END +
      CASE WHEN p.linkedin_url IS NOT NULL AND LENGTH(p.linkedin_url) > 0 THEN 10 ELSE 0 END +
      CASE WHEN p.skills IS NOT NULL AND array_length(p.skills, 1) > 0 THEN 15 ELSE 0 END +
      CASE WHEN p.company_name IS NOT NULL AND LENGTH(p.company_name) > 0 THEN 5 ELSE 0 END +
      CASE WHEN p.university IS NOT NULL AND LENGTH(p.university) > 0 THEN 5 ELSE 0 END +
      CASE WHEN p.major IS NOT NULL AND LENGTH(p.major) > 0 THEN 5 ELSE 0 END
    )::DECIMAL, 0
  ) as completion_percentage
FROM profiles p
WHERE p.id = auth.uid();

-- 11. Bulk Skills Search (find users with specific skills)
SELECT 
  p.id,
  p.username,
  p.full_name,
  p.avatar_url,
  p.bio,
  p.skills,
  p.company_name,
  p.university,
  array_length(
    array(
      SELECT unnest(p.skills) 
      INTERSECT 
      SELECT unnest(ARRAY['React', 'TypeScript', 'Node.js', 'Python'])
    ), 1
  ) as matching_skills_count
FROM profiles p
WHERE p.skills && ARRAY['React', 'TypeScript', 'Node.js', 'Python']
  AND NOT p.is_private
  AND p.id != auth.uid()
ORDER BY matching_skills_count DESC, p.followers_count DESC
LIMIT 20;

-- 12. Privacy-Aware Profile View
SELECT 
  p.id,
  p.username,
  p.full_name,
  p.bio,
  p.avatar_url,
  p.cover_image_url,
  p.verified,
  p.followers_count,
  p.following_count,
  p.posts_count,
  -- Conditional fields based on privacy settings
  CASE WHEN p.show_location OR p.id = auth.uid() THEN p.location END as location,
  CASE WHEN p.show_birth_date OR p.id = auth.uid() THEN p.birth_date END as birth_date,
  CASE WHEN p.show_email OR p.id = auth.uid() THEN p.email END as email,
  CASE WHEN NOT p.is_private OR p.id = auth.uid() OR 
    EXISTS (SELECT 1 FROM follows WHERE following_id = p.id AND follower_id = auth.uid())
    THEN p.linkedin_url END as linkedin_url,
  CASE WHEN NOT p.is_private OR p.id = auth.uid() OR 
    EXISTS (SELECT 1 FROM follows WHERE following_id = p.id AND follower_id = auth.uid())
    THEN p.github_url END as github_url,
  -- Following status
  EXISTS (SELECT 1 FROM follows WHERE following_id = p.id AND follower_id = auth.uid()) as is_following,
  EXISTS (SELECT 1 FROM follows WHERE follower_id = p.id AND following_id = auth.uid()) as follows_you
FROM profiles p
WHERE p.id = $1;

-- 13. Create New Post with Profile Update
WITH new_post AS (
  INSERT INTO posts (user_id, content, post_type, visibility, tags)
  VALUES (auth.uid(), $1, $2, $3, $4)
  RETURNING id, created_at
)
SELECT 
  np.id as post_id,
  np.created_at,
  p.posts_count
FROM new_post np, profiles p 
WHERE p.id = auth.uid();

-- 14. Follow/Unfollow with Notification
-- Follow user
SELECT follow_user($1::UUID) as success;

-- Unfollow user  
SELECT unfollow_user($1::UUID) as success;

-- Check following status
SELECT is_following($1::UUID) as is_following;

-- 15. Profile Statistics Dashboard
SELECT 
  'profile_views' as metric,
  COUNT(*) as count,
  'Last 30 days' as period
FROM profile_views 
WHERE profile_id = auth.uid() 
  AND viewed_at >= NOW() - INTERVAL '30 days'

UNION ALL

SELECT 
  'new_followers' as metric,
  COUNT(*) as count,
  'Last 7 days' as period
FROM follows 
WHERE following_id = auth.uid() 
  AND created_at >= NOW() - INTERVAL '7 days'

UNION ALL

SELECT 
  'profile_completion' as metric,
  (
    CASE WHEN full_name IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN bio IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN avatar_url IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN skills IS NOT NULL AND array_length(skills, 1) > 0 THEN 1 ELSE 0 END +
    CASE WHEN location IS NOT NULL THEN 1 ELSE 0 END
  ) * 20 as count,
  'Percentage' as period
FROM profiles 
WHERE id = auth.uid();

-- 16. Export Profile Data (GDPR Compliance)
SELECT 
  p.*,
  up.*,
  array_agg(DISTINCT pa.activity_type) as activities,
  array_agg(DISTINCT f1.following_id) as following_users,
  array_agg(DISTINCT f2.follower_id) as follower_users
FROM profiles p
LEFT JOIN user_preferences up ON p.id = up.user_id
LEFT JOIN profile_activity pa ON p.id = pa.user_id
LEFT JOIN follows f1 ON p.id = f1.follower_id
LEFT JOIN follows f2 ON p.id = f2.following_id
WHERE p.id = auth.uid()
GROUP BY p.id, up.id;