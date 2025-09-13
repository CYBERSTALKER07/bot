-- Migration to add cover_image_url column to profiles table
-- Run this in your Supabase SQL editor or migration tool

ALTER TABLE profiles 
ADD COLUMN cover_image_url VARCHAR(512);

-- Add an index for better performance if needed
CREATE INDEX idx_profiles_cover_image ON profiles(cover_image_url) WHERE cover_image_url IS NOT NULL;

-- Update any existing profiles to have NULL cover_image_url (this is automatic with ADD COLUMN)
-- The column will be NULL by default for existing records