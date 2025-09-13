-- Create Storage Buckets for Application
-- Run this script in your Supabase SQL Editor to create all necessary storage buckets

-- 1. AVATARS BUCKET
-- For user profile pictures
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true, -- Public bucket so avatars can be viewed by anyone
  5242880, -- 5MB limit for avatars
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- 2. COVER PHOTOS BUCKET
-- For user profile cover images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'covers',
  'covers',
  true, -- Public bucket
  10485760, -- 10MB limit for cover photos
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 3. POST IMAGES BUCKET
-- For images in posts, job postings, company galleries, etc.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-images',
  'post-images',
  true, -- Public bucket
  15728640, -- 15MB limit for post images
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- 4. VIDEOS BUCKET
-- For video content in posts, tutorials, company videos, etc.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  true, -- Public bucket
  104857600, -- 100MB limit for videos
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo']
) ON CONFLICT (id) DO NOTHING;

-- 5. DOCUMENTS BUCKET (Optional - for resumes, portfolios, etc.)
-- For PDF resumes, portfolio documents, company documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false, -- Private bucket for sensitive documents
  52428800, -- 50MB limit for documents
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- 6. COMPANY ASSETS BUCKET
-- For company logos, banners, etc.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-assets',
  'company-assets',
  true, -- Public bucket
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- AVATARS BUCKET POLICIES
-- Users can upload, update, and delete their own avatars
CREATE POLICY "Users can upload their own avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- COVER PHOTOS BUCKET POLICIES
CREATE POLICY "Users can upload their own covers" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'covers' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own covers" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'covers' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own covers" ON storage.objects
FOR DELETE USING (
  bucket_id = 'covers' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view covers" ON storage.objects
FOR SELECT USING (bucket_id = 'covers');

-- POST IMAGES BUCKET POLICIES
CREATE POLICY "Users can upload post images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'post-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own post images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'post-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own post images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'post-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view post images" ON storage.objects
FOR SELECT USING (bucket_id = 'post-images');

-- VIDEOS BUCKET POLICIES
CREATE POLICY "Users can upload videos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own videos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own videos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view videos" ON storage.objects
FOR SELECT USING (bucket_id = 'videos');

-- DOCUMENTS BUCKET POLICIES (Private)
CREATE POLICY "Users can upload their own documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can only view their own documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- COMPANY ASSETS BUCKET POLICIES
CREATE POLICY "Users can upload company assets" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'company-assets' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own company assets" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'company-assets' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own company assets" ON storage.objects
FOR DELETE USING (
  bucket_id = 'company-assets' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view company assets" ON storage.objects
FOR SELECT USING (bucket_id = 'company-assets');

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to get the file extension from a filename
CREATE OR REPLACE FUNCTION get_file_extension(filename text)
RETURNS text AS $$
BEGIN
  RETURN lower(split_part(filename, '.', -1));
END;
$$ LANGUAGE plpgsql;

-- Function to validate file size (for use in policies)
CREATE OR REPLACE FUNCTION validate_file_size(bucket_name text, file_size bigint)
RETURNS boolean AS $$
BEGIN
  CASE bucket_name
    WHEN 'avatars' THEN RETURN file_size <= 5242880; -- 5MB
    WHEN 'covers' THEN RETURN file_size <= 10485760; -- 10MB
    WHEN 'post-images' THEN RETURN file_size <= 15728640; -- 15MB
    WHEN 'videos' THEN RETURN file_size <= 104857600; -- 100MB
    WHEN 'documents' THEN RETURN file_size <= 52428800; -- 50MB
    WHEN 'company-assets' THEN RETURN file_size <= 10485760; -- 10MB
    ELSE RETURN false;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Verify all buckets were created
SELECT 
  id,
  name,
  public,
  file_size_limit / 1048576 as size_limit_mb,
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE id IN ('avatars', 'covers', 'post-images', 'videos', 'documents', 'company-assets')
ORDER BY id;

-- Check policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
ORDER BY policyname;