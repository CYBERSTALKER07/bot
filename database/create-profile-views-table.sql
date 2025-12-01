-- Create profile_views table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profile_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    viewer_id UUID REFERENCES auth.users(id) ON DELETE
    SET NULL,
        viewed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        ip_address INET,
        user_agent TEXT,
        referrer TEXT
);
-- Add RLS policies for profile_views
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;
-- Policy: Users can see who viewed their profile
CREATE POLICY "Users can see who viewed their profile" ON public.profile_views FOR
SELECT USING (auth.uid() = profile_id);
-- Policy: Anyone can insert a view (handled by RPC usually, but good to have)
CREATE POLICY "Anyone can log a view" ON public.profile_views FOR
INSERT WITH CHECK (true);
-- Grant permissions
GRANT SELECT,
    INSERT ON public.profile_views TO authenticated;
GRANT SELECT,
    INSERT ON public.profile_views TO anon;