-- RPC Function to fetch profile viewers with full profile information
-- This allows users to see who has viewed their profile
CREATE OR REPLACE FUNCTION public.get_profile_viewers(
        p_limit INTEGER DEFAULT 10,
        p_offset INTEGER DEFAULT 0
    ) RETURNS TABLE (
        viewer_id UUID,
        viewer_username TEXT,
        viewer_full_name TEXT,
        viewer_avatar_url TEXT,
        viewer_role TEXT,
        viewer_company_name TEXT,
        viewer_verified BOOLEAN,
        viewed_at TIMESTAMP WITH TIME ZONE,
        view_count BIGINT
    ) AS $$ BEGIN RETURN QUERY
SELECT p.id as viewer_id,
    p.username as viewer_username,
    p.full_name as viewer_full_name,
    p.avatar_url as viewer_avatar_url,
    p.role as viewer_role,
    p.company_name as viewer_company_name,
    p.verified as viewer_verified,
    MAX(pv.viewed_at) as viewed_at,
    COUNT(pv.id) as view_count
FROM profile_views pv
    INNER JOIN profiles p ON pv.viewer_id = p.id
WHERE pv.profile_id = auth.uid()
    AND pv.viewer_id IS NOT NULL
    AND pv.viewer_id != auth.uid()
GROUP BY p.id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.role,
    p.company_name,
    p.verified
ORDER BY viewed_at DESC
LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_profile_viewers(INTEGER, INTEGER) TO authenticated;
COMMENT ON FUNCTION public.get_profile_viewers IS 'Fetches profile viewers for the authenticated user with aggregated view counts';