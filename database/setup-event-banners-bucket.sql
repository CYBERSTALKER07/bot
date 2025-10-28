-- Setup Event Banners Storage Bucket
-- Run this in your Supabase SQL Editor to create the event-banners bucket
-- This simplified version only creates the bucket without policy modifications

BEGIN;

-- Create the event-banners bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-banners',
  'event-banners',
  true, -- Public bucket so anyone can view banners
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

COMMIT;

-- Verify the bucket was created
SELECT 
  id,
  name,
  public,
  file_size_limit / 1048576 as size_limit_mb,
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE id = 'event-banners';
