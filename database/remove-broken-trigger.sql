-- ============================================================================
-- FIX: Remove Broken Hashtag Trigger
-- This fixes the "substring(text[], integer) does not exist" error
-- ============================================================================

-- Drop the broken trigger if it exists
DROP TRIGGER IF EXISTS trigger_process_post_hashtags ON public.posts;

-- Drop the broken function if it exists
DROP FUNCTION IF EXISTS public.process_post_hashtags();

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Broken hashtag trigger removed!';
  RAISE NOTICE 'You can now create posts without errors.';
  RAISE NOTICE '';
  RAISE NOTICE 'To re-enable hashtag functionality later:';
  RAISE NOTICE '1. Run the complete hashtag_system.sql migration';
  RAISE NOTICE '2. This will install the correct trigger';
END $$;
