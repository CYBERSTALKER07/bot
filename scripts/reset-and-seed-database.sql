-- Reset Database and Create Comprehensive Test Data
-- WARNING: This will delete ALL existing data!

-- 1. Delete all existing data (in correct order to respect foreign keys)
DELETE FROM comment_replies WHERE true;
DELETE FROM comment_likes WHERE true;
DELETE FROM post_comments WHERE true;
DELETE FROM comments WHERE true;
DELETE FROM post_likes WHERE true;
DELETE FROM likes WHERE true;
DELETE FROM post_bookmarks WHERE true;
DELETE FROM post_shares WHERE true;
DELETE FROM post_retweets WHERE true;
DELETE FROM post_hashtags WHERE true;
DELETE FROM hashtag_trends WHERE true;
DELETE FROM user_hashtag_interactions WHERE true;
DELETE FROM hashtags WHERE true;
DELETE FROM notifications WHERE true;
DELETE FROM event_attendees WHERE true;
DELETE FROM employer_events WHERE true;
DELETE FROM applications WHERE true;
DELETE FROM jobs WHERE true;
DELETE FROM posts WHERE true;
DELETE FROM user_interests WHERE true;
DELETE FROM user_preferences WHERE true;
DELETE FROM follows WHERE true;
DELETE FROM profiles WHERE true;
DELETE FROM companies WHERE true;

-- 2. Create Test Companies with logos
INSERT INTO companies (name, industry, size, location, website, logo_url, description, created_at)
VALUES
  ('TechCorp Solutions', 'Technology', '1000-5000', 'Auckland, New Zealand', 'https://techcorp.example.com', 
   'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=400&fit=crop',
   'Leading technology solutions provider specializing in cloud computing and AI', NOW()),
  
  ('DataVision Analytics', 'Data Science', '100-500', 'Wellington, New Zealand', 'https://datavision.example.com',
   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop',
   'Data analytics and business intelligence consultancy', NOW()),
  
  ('GreenEnergy NZ', 'Renewable Energy', '500-1000', 'Christchurch, New Zealand', 'https://greenenergy.example.com',
   'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=400&fit=crop',
   'Sustainable energy solutions for a greener future', NOW()),
  
  ('FinTech Innovations', 'Financial Technology', '50-100', 'Auckland, New Zealand', 'https://fintech.example.com',
   'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=400&fit=crop',
   'Revolutionary financial technology and payment solutions', NOW()),
  
  ('HealthTech Plus', 'Healthcare Technology', '200-500', 'Hamilton, New Zealand', 'https://healthtech.example.com',
   'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop',
   'Digital health solutions and medical software', NOW());

-- 3. Create Test Users (Students and Employers) with avatars
-- Note: You'll need to create these users through the auth system first
-- This is just for reference - actual user creation happens through Supabase Auth

-- Sample user IDs (replace with actual auth.users IDs after creating them)
-- Student users: student1@test.com, student2@test.com, student3@test.com
-- Employer users: employer1@test.com, employer2@test.com

-- 4. Create User Profiles (run after creating auth users)
-- INSERT INTO profiles (id, full_name, avatar_url, bio, role, skills, location)
-- VALUES
--   ('student-uuid-1', 'Alex Johnson', 'https://i.pravatar.cc/150?img=1', 'Computer Science student passionate about AI and ML', 'student', ARRAY['Python', 'JavaScript', 'React', 'Machine Learning'], 'Auckland'),
--   ('student-uuid-2', 'Sarah Williams', 'https://i.pravatar.cc/150?img=2', 'Data Science enthusiast with strong analytics background', 'student', ARRAY['Python', 'R', 'SQL', 'Data Visualization'], 'Wellington'),
--   ('student-uuid-3', 'Michael Chen', 'https://i.pravatar.cc/150?img=3', 'Full-stack developer interested in cloud technologies', 'student', ARRAY['Java', 'Spring Boot', 'AWS', 'Docker'], 'Christchurch'),
--   ('employer-uuid-1', 'Emma Davis', 'https://i.pravatar.cc/150?img=4', 'HR Manager at TechCorp Solutions', 'employer', NULL, 'Auckland'),
--   ('employer-uuid-2', 'James Wilson', 'https://i.pravatar.cc/150?img=5', 'Talent Acquisition Lead at DataVision', 'employer', NULL, 'Wellington');

-- 5. Create Job Postings with images
-- INSERT INTO jobs (id, employer_id, company_id, title, description, requirements, location, salary_range, job_type, experience_level, skills_required, image_url, created_at)
-- VALUES
--   ('job-001', 'employer-uuid-1', 'comp-001', 'Senior Software Engineer', 
--    'Join our team to build cutting-edge cloud solutions...', 
--    'Bachelor''s degree in CS, 5+ years experience', 
--    'Auckland, NZ', '$120k-$150k', 'full-time', 'senior',
--    ARRAY['Python', 'AWS', 'Docker', 'Kubernetes'],
--    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
--    NOW()),
--   
--   ('job-002', 'employer-uuid-2', 'comp-002', 'Data Analyst', 
--    'Analyze complex datasets and provide actionable insights...', 
--    'Degree in Statistics or related field, 2+ years experience', 
--    'Wellington, NZ', '$80k-$100k', 'full-time', 'mid-level',
--    ARRAY['SQL', 'Python', 'Tableau', 'Excel'],
--    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
--    NOW());

-- 6. Create Events with banner images
-- INSERT INTO employer_events (id, employer_id, company_id, title, description, event_date, location, event_type, capacity, banner_image_url, created_at)
-- VALUES
--   ('event-001', 'employer-uuid-1', 'comp-001', 'Tech Career Fair 2024',
--    'Meet leading tech companies and explore career opportunities',
--    NOW() + INTERVAL '30 days', 'Auckland Convention Centre', 'recruiting', 500,
--    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=400&fit=crop',
--    NOW()),
--   
--   ('event-002', 'employer-uuid-2', 'comp-002', 'Data Science Workshop',
--    'Hands-on workshop on machine learning and data analytics',
--    NOW() + INTERVAL '15 days', 'Wellington Tech Hub', 'workshop', 50,
--    'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1200&h=400&fit=crop',
--    NOW());

-- 7. Create Posts with images
-- INSERT INTO posts (id, user_id, content, image_url, created_at, likes_count, comments_count)
-- VALUES
--   ('post-001', 'student-uuid-1', 'Just completed my Machine Learning certification! Excited to apply these skills in real-world projects. #MachineLearning #AI',
--    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
--    NOW(), 15, 3),
--   
--   ('post-002', 'employer-uuid-1', 'We''re hiring! TechCorp is looking for talented developers to join our team. Check out our open positions! #Hiring #TechJobs',
--    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
--    NOW(), 28, 5),
--   
--   ('post-003', 'student-uuid-2', 'Amazing data visualization workshop today! Thanks @DataVision for the insights. #DataScience',
--    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
--    NOW(), 12, 2);

-- 8. Create User Follows (for recommendations)
-- INSERT INTO follows (follower_id, following_id, created_at)
-- VALUES
--   ('student-uuid-1', 'student-uuid-2', NOW()),
--   ('student-uuid-1', 'employer-uuid-1', NOW()),
--   ('student-uuid-2', 'student-uuid-3', NOW()),
--   ('student-uuid-3', 'student-uuid-1', NOW());

-- 9. Create Post Likes
-- INSERT INTO post_likes (post_id, user_id, created_at)
-- VALUES
--   ('post-001', 'student-uuid-2', NOW()),
--   ('post-001', 'student-uuid-3', NOW()),
--   ('post-002', 'student-uuid-1', NOW());

-- 10. Create Post Comments with mentions
-- INSERT INTO post_comments (id, post_id, user_id, content, created_at)
-- VALUES
--   ('comment-001', 'post-001', 'student-uuid-2', 'Congratulations @Alex! Well deserved! 🎉', NOW()),
--   ('comment-002', 'post-003', 'employer-uuid-2', 'Glad you enjoyed it @Sarah! Hope to see you at future events.', NOW());

-- 11. Create Notifications (mentions, likes, follows)
-- INSERT INTO notifications (id, user_id, type, title, message, link, created_at, read)
-- VALUES
--   ('notif-001', 'student-uuid-1', 'mention', 'You were mentioned', '@Sarah mentioned you in a comment', '/post/comment-001', NOW(), false),
--   ('notif-002', 'student-uuid-1', 'like', 'New like on your post', 'Your post received a new like', '/post/post-001', NOW(), false),
--   ('notif-003', 'student-uuid-2', 'follow', 'New follower', 'Alex Johnson started following you', '/profile/student-uuid-1', NOW(), false);

-- Success message
SELECT 'Database reset complete! Test data created successfully.' as message;
