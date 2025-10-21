import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

// Optimized column selection - only fetch what's needed
const PROFILE_COLUMNS = 'id,full_name,avatar_url,username,bio,verified,role,company_name,location,website,created_at,cover_image_url';
const POST_COLUMNS = 'id,content,user_id,created_at,likes_count,comments_count,shares_count,media_type,image_url,video_url';
const COMPANY_COLUMNS = 'id,name,logo_url,description,website,industry,size';

// Hook for fetching posts with optimized caching
export function usePosts(limit = 20) {
  return useQuery({
    queryKey: ['posts', limit],
    queryFn: async () => {
      // Only select necessary columns instead of *
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(POST_COLUMNS)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (postsError) throw postsError;

      // Fetch profiles in parallel - only needed columns
      if (postsData && postsData.length > 0) {
        const userIds = [...new Set(postsData.map(post => post.user_id))];
        
        const { data: profilesData } = await supabase
          .from('profiles')
          .select(PROFILE_COLUMNS)
          .in('id', userIds);

        const profilesMap = new Map(
          profilesData?.map(p => [p.id, p]) || []
        );

        return postsData.map(post => ({
          id: post.id.toString(),
          content: post.content || '',
          author: {
            id: post.user_id.toString(),
            name: profilesMap.get(post.user_id)?.full_name || 'User',
            username: profilesMap.get(post.user_id)?.username || `user${post.user_id}`,
            avatar_url: profilesMap.get(post.user_id)?.avatar_url,
            verified: profilesMap.get(post.user_id)?.verified || false
          },
          created_at: post.created_at,
          likes_count: post.likes_count || 0,
          retweets_count: post.shares_count || 0,
          replies_count: post.comments_count || 0,
          has_liked: false,
          has_retweeted: false,
          has_bookmarked: false,
          media: post.image_url || post.video_url ? [{
            type: (post.media_type === 'video' || post.video_url) ? 'video' : 'image',
            url: post.image_url || post.video_url || '',
            alt: 'Post media'
          }] : undefined
        }));
      }

      return [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes cache
  });
}

// Hook for fetching user profile - OPTIMIZED
export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');
      
      // Only select necessary columns
      const { data, error } = await supabase
        .from('profiles')
        .select(PROFILE_COLUMNS)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 15 * 60 * 1000, // 15 minutes for profile (less volatile)
    gcTime: 60 * 60 * 1000, // 1 hour cache
  });
}

// Hook for fetching jobs - OPTIMIZED
export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('id,title,company,location,type,salary_range,created_at,employer_id')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 45 * 60 * 1000, // 45 minutes cache
  });
}

// Hook for creating a post with optimistic updates
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPost: any) => {
      const { data, error } = await supabase
        .from('posts')
        .insert([newPost])
        .select(POST_COLUMNS)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// Hook for fetching applicants (for employers) - OPTIMIZED
export function useApplicants(jobId?: string) {
  return useQuery({
    queryKey: ['applicants', jobId],
    queryFn: async () => {
      let query = supabase
        .from('applications')
        .select(`
          id,
          job_id,
          student_id,
          applied_date,
          status,
          profiles!student_id (
            id,
            full_name,
            email,
            avatar_url,
            university,
            major,
            graduation_year,
            skills,
            portfolio_url,
            phone
          ),
          jobs!job_id (
            id,
            title,
            company,
            location,
            type
          )
        `)
        .order('applied_date', { ascending: false });

      if (jobId) {
        query = query.eq('job_id', jobId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes cache
  });
}

// Hook for fetching notifications - OPTIMIZED
export function useNotifications(userId: string | undefined) {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');
      
      const { data, error } = await supabase
        .from('notifications')
        .select('id,user_id,type,content,read,created_at,related_user_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache
  });
}

// Hook for fetching conversations/messages - OPTIMIZED
export function useConversations(userId: string | undefined) {
  return useQuery({
    queryKey: ['conversations', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');
      
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          participant1_id,
          participant2_id,
          updated_at,
          participant1:participant1_id (id, full_name, avatar_url, username),
          participant2:participant2_id (id, full_name, avatar_url, username),
          messages!conversations_id_fkey (
            id,
            content,
            created_at,
            sender_id
          )
        `)
        .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute (messages are real-time sensitive)
    gcTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

// Hook for fetching bookmarks - OPTIMIZED
export function useBookmarks(userId: string | undefined) {
  return useQuery({
    queryKey: ['bookmarks', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');
      
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          id,
          created_at,
          jobs (id, title, company, location, type, salary_range, created_at),
          posts (id, content, created_at, author:user_id(full_name, username, avatar_url))
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes cache
  });
}

// Hook for fetching companies - OPTIMIZED
export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          id,
          name,
          logo_url,
          cover_image_url,
          description,
          website,
          industry,
          size,
          location,
          rating,
          reviews_count,
          is_verified,
          is_hiring,
          employee_count,
          founded_year,
          featured_benefits,
          growth_rate
        `)
        .order('name');

      if (error) throw error;
      return data || [];
    },
    staleTime: 30 * 60 * 1000, // 30 minutes (companies change slowly)
    gcTime: 60 * 60 * 1000, // 1 hour cache
  });
}

// Hook for fetching a single company - OPTIMIZED
export function useCompany(companyId: string | undefined) {
  return useQuery({
    queryKey: ['company', companyId],
    queryFn: async () => {
      if (!companyId) throw new Error('Company ID required');
      
      const { data, error } = await supabase
        .from('companies')
        .select(`
          id,
          name,
          logo_url,
          cover_image_url,
          description,
          website,
          industry,
          size,
          location,
          rating,
          reviews_count,
          is_verified,
          is_hiring,
          employee_count,
          founded_year,
          featured_benefits,
          growth_rate
        `)
        .eq('id', companyId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
    staleTime: 20 * 60 * 1000, // 20 minutes
    gcTime: 60 * 60 * 1000, // 1 hour cache
  });
}

// Hook for fetching jobs by company
export function useCompanyJobs(companyId: string | undefined) {
  return useQuery({
    queryKey: ['companyJobs', companyId],
    queryFn: async () => {
      if (!companyId) throw new Error('Company ID required');
      
      const { data, error } = await supabase
        .from('jobs')
        .select('id,title,description,location,type,salary_range,status,posted_at')
        .eq('company_id', companyId)
        .eq('status', 'open')
        .order('posted_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
    staleTime: 15 * 60 * 1000,
    gcTime: 45 * 60 * 1000,
  });
}

// Hook for search with debouncing handled at component level - OPTIMIZED
export function useSearch(query: string, filters?: any) {
  return useQuery({
    queryKey: ['search', query, filters],
    queryFn: async () => {
      if (!query || query.length < 2) return { jobs: [], users: [], posts: [], companies: [] };

      // Search jobs - only needed columns
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id,title,company,location,type,salary_range,created_at')
        .or(`title.ilike.%${query}%,company.ilike.%${query}%`)
        .limit(10);

      // Search users/profiles - only needed columns
      const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, bio, verified')
        .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
        .limit(10);

      // Search posts - only needed columns
      const { data: posts } = await supabase
        .from('posts')
        .select('id,content,created_at,user_id,profiles!posts_user_id_fkey(full_name, username, avatar_url)')
        .ilike('content', `%${query}%`)
        .limit(10);

      // Search companies - only needed columns
      const { data: companies } = await supabase
        .from('companies')
        .select('id,name,logo_url,description,website')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(10);

      return {
        jobs: jobs || [],
        users: users || [],
        posts: posts || [],
        companies: companies || []
      };
    },
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes cache
  });
}

// Hook for employer dashboard stats - OPTIMIZED
export function useEmployerStats(employerId: string | undefined) {
  return useQuery({
    queryKey: ['employerStats', employerId],
    queryFn: async () => {
      if (!employerId) throw new Error('Employer ID required');
      
      // Get jobs count
      const { count: jobsCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('employer_id', employerId);

      // Get applications count - more efficient query
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id')
        .eq('employer_id', employerId);

      const jobIds = jobs?.map(j => j.id) || [];
      
      const { count: applicationsCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .in('job_id', jobIds);

      // Get active jobs
      const { count: activeJobsCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('employer_id', employerId)
        .eq('status', 'active');

      return {
        totalJobs: jobsCount || 0,
        totalApplications: applicationsCount || 0,
        activeJobs: activeJobsCount || 0,
      };
    },
    enabled: !!employerId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes cache
  });
}

// Hook for fetching recommended users to follow - OPTIMIZED
// Now fetches based on job title, role, and company preferences
export function useRecommendedUsers(currentUserId?: string, limit = 6) {
  return useQuery({
    queryKey: ['recommendedUsers', currentUserId, limit],
    queryFn: async () => {
      // If no current user, return empty array
      if (!currentUserId) {
        // Fallback: get random popular users
        const { data: users, error } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            username,
            avatar_url,
            bio,
            verified,
            role,
            company_name,
            location,
            created_at
          `)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        return users || [];
      }

      // 1. Fetch current user's profile to get their preferences
      const { data: currentUser, error: userError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          role,
          company_name,
          job_title,
          skills,
          preferences
        `)
        .eq('id', currentUserId)
        .single();

      if (userError) throw userError;

      // 2. Build query based on user preferences
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          username,
          avatar_url,
          bio,
          verified,
          role,
          company_name,
          job_title,
          location,
          skills,
          created_at
        `)
        .neq('id', currentUserId); // Exclude current user

      // 3. Filter by role if user has a role preference
      if (currentUser?.role) {
        // For students, show employers and other students
        // For employers, show students primarily
        if (currentUser.role === 'student') {
          query = query.or(`role.eq.employer,role.eq.student`);
        } else if (currentUser.role === 'employer') {
          query = query.eq('role', 'student');
        }
      }

      // 4. Fetch users and sort by relevance
      const { data: recommendedUsers, error } = await query
        .order('verified', { ascending: false }) // Verified users first
        .order('created_at', { ascending: false }) // Then by recency
        .limit(limit * 2); // Fetch more to filter

      if (error) throw error;

      // 5. Score and filter users based on relevance
      const scoredUsers = (recommendedUsers || [])
        .map((user) => {
          let score = 0;

          // Prefer verified users
          if (user.verified) score += 100;

          // Match job title
          if (
            currentUser?.job_title &&
            user.job_title &&
            user.job_title.toLowerCase().includes(currentUser.job_title.toLowerCase())
          ) {
            score += 50;
          }

          // Match company
          if (currentUser?.company_name && user.company_name === currentUser.company_name) {
            score += 30;
          }

          // Match role
          if (currentUser?.role && user.role === currentUser.role) {
            score += 20;
          }

          // Match skills (if current user has skills array)
          if (currentUser?.skills && Array.isArray(currentUser.skills) && user.skills && Array.isArray(user.skills)) {
            const commonSkills = currentUser.skills.filter((skill) =>
              user.skills.some((userSkill) =>
                userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(userSkill.toLowerCase())
              )
            );
            score += commonSkills.length * 15;
          }

          // Recency bonus (newer profiles)
          const daysSinceCreated = (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24);
          if (daysSinceCreated < 7) score += 40;
          if (daysSinceCreated < 30) score += 20;

          return { ...user, _score: score };
        })
        .sort((a, b) => b._score - a._score) // Sort by relevance score
        .slice(0, limit) // Take only the top results
        .map(({ _score, ...user }) => user); // Remove score from result

      return scoredUsers;
    },
    enabled: !!currentUserId,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 45 * 60 * 1000, // 45 minutes cache
  });
}

// Hook for checking if current user follows another user
export function useFollowStatus(currentUserId: string | undefined, targetUserId: string | undefined) {
  return useQuery({
    queryKey: ['followStatus', currentUserId, targetUserId],
    queryFn: async () => {
      if (!currentUserId || !targetUserId) throw new Error('User IDs required');

      // Check if a follow relationship exists
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', currentUserId)
        .eq('following_id', targetUserId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return !!data; // Returns true if following, false otherwise
    },
    enabled: !!currentUserId && !!targetUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes cache
  });
}

// Hook for creating a follow relationship
export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ followerId, followingId }: { followerId: string; followingId: string }) => {
      const { data, error } = await supabase
        .from('follows')
        .insert([{ follower_id: followerId, following_id: followingId }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followStatus'] });
      queryClient.invalidateQueries({ queryKey: ['recommendedUsers'] });
      queryClient.invalidateQueries({ queryKey: ['mostFollowedUsers'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// Hook for unfollowing a user
export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ followerId, followingId }: { followerId: string; followingId: string }) => {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followStatus'] });
      queryClient.invalidateQueries({ queryKey: ['recommendedUsers'] });
      queryClient.invalidateQueries({ queryKey: ['mostFollowedUsers'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// Hook for fetching most followed users - OPTIMIZED
export function useMostFollowedUsers(limit = 5) {
  return useQuery({
    queryKey: ['mostFollowedUsers', limit],
    queryFn: async () => {
      // Fetch all profiles with follower counts
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          username,
          avatar_url,
          bio,
          verified,
          role,
          company_name,
          location
        `)
        .order('created_at', { ascending: false })
        .limit(limit * 3); // Fetch more to filter

      if (error) throw error;

      // Get follower counts for each profile
      if (!profiles || profiles.length === 0) return [];

      const profilesWithFollowers = await Promise.all(
        profiles.map(async (profile) => {
          const { count: followerCount } = await supabase
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('following_id', profile.id);

          return {
            ...profile,
            followerCount: followerCount || 0
          };
        })
      );

      // Sort by follower count descending
      return profilesWithFollowers
        .sort((a, b) => b.followerCount - a.followerCount)
        .slice(0, limit);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour cache
  });
}