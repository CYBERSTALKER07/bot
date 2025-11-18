-- ============================================================================
-- SIMPLE RLS FIX - Run this in Supabase SQL Editor
-- ============================================================================

-- Temporarily disable RLS to test if that's the issue
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;

-- Test message
DO $$
BEGIN
  RAISE NOTICE '✅ RLS temporarily disabled on posts table for testing';
  RAISE NOTICE 'Try creating a post now. If it works, the issue is RLS policies.';
  RAISE NOTICE 'After testing, re-enable RLS with proper policies.';
END $$;
