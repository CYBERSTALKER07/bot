import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

// Optimized column selection - only fetch what's needed
const PROFILE_COLUMNS = 'id,full_name,avatar_url,username,bio,verified,role,company_name,location,website,created_at,cover_image_url';
const POST_COLUMNS = 'id,content,user_id,created_at,likes_count,comments_count,shares_count,media_type,image_url,video_url';
const COMPANY_COLUMNS = 'id,name,logo_url,description,website,industry,size';

// Hook for fetching posts with optimized caching
export function usePosts(limit = 20, currentUserId?: string) {
  return useQuery({
    queryKey: ['posts', limit, currentUserId],
    queryFn: async () => {
      try {
        // STEP 1: Fetch posts WITHOUT the likes subquery join (much faster)
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('id,content,user_id,created_at,likes_count,comments_count,shares_count,media_type,image_url,video_url,visibility')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (postsError) {
          console.error('Error fetching posts:', postsError);
          throw postsError;
        }

        if (!postsData || postsData.length === 0) {
          return [];
        }

        // STEP 2: Get unique user IDs and fetch all profiles in parallel
        const userIds = [...new Set(postsData.map(post => post.user_id))];
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id,full_name,avatar_url,username,verified')
          .in('id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }

        const profilesMap = new Map(
          profilesData?.map(p => [p.id, p]) || []
        );

        // STEP 3: Fetch likes separately if we have a current user (for faster post loading)
        let likesMap = new Map<string, boolean>();
        if (currentUserId) {
          try {
            const { data: likesData, error: likesError } = await supabase
              .from('likes')
              .select('post_id,user_id')
              .eq('user_id', currentUserId)
              .in('post_id', postsData.map(p => p.id));

            if (!likesError && likesData) {
              likesMap = new Map(likesData.map(like => [like.post_id, true]));
            }
          } catch (error) {
            console.warn('Error fetching likes:', error);
            // Continue without likes data - not critical
          }
        }

        // STEP 4: Transform and return posts with minimal processing
        return postsData.map((post: any) => {
          const profile = profilesMap.get(post.user_id);
          return {
            id: post.id.toString(),
            content: post.content || '',
            author: {
              id: post.user_id.toString(),
              name: profile?.full_name || 'User',
              username: profile?.username || `user${post.user_id}`,
              avatar_url: profile?.avatar_url,
              verified: profile?.verified || false
            },
            created_at: post.created_at,
            likes_count: post.likes_count || 0,
            retweets_count: post.shares_count || 0,
            replies_count: post.comments_count || 0,
            has_liked: likesMap.has(post.id),
            has_retweeted: false,
            has_bookmarked: false,
            media: post.image_url || post.video_url ? [{
              type: (post.media_type === 'video' || post.video_url) ? 'video' : 'image',
              url: post.image_url || post.video_url || '',
              alt: 'Post media'
            }] : undefined,
            visibility: post.visibility
          };
        });
      } catch (error) {
        console.error('usePosts error:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // Reduced from 10 to 5 minutes for fresher data
    gcTime: 15 * 60 * 1000, // Reduced from 30 to 15 minutes
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

// Hook for fetching jobs that match user preferences - ENHANCED
export function useMatchedJobs(userId?: string, limit = 5) {
  return useQuery({
    queryKey: ['matchedJobs', userId, limit],
    queryFn: async () => {
      try {
        if (!userId) {
          // If no user, return trending jobs
          const { data, error } = await supabase
            .from('jobs')
            .select('id,title,company,location,type,salary_range,description,skills,is_remote,created_at,employer_id')
            .eq('status', 'open')
            .order('created_at', { ascending: false })
            .limit(limit);

          if (error) throw error;
          return (data || []).map(job => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location || 'Not specified',
            type: job.type || 'Full-time',
            salary_range: job.salary_range,
            description: job.description,
            skills: Array.isArray(job.skills) ? job.skills : [],
            is_remote: job.is_remote || false,
            created_at: job.created_at,
            employer_id: job.employer_id,
            matchScore: 0,
            matchReasons: []
          }));
        }

        // STEP 1: Fetch user's profile to get their skills and preferences
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id,full_name,skills,bio,role,title,company_name,location,university,major,graduation_year,experience_level')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.warn('Error fetching user profile:', profileError);
          return [];
        }

        // STEP 2: Extract keywords from user's profile
        const userSkills = (userProfile?.skills || []) as string[];
        const userTitle = userProfile?.title?.toLowerCase() || '';
        const userBio = userProfile?.bio?.toLowerCase() || '';
        const userRole = userProfile?.role?.toLowerCase() || '';
        const userMajor = userProfile?.major?.toLowerCase() || '';
        const userUniversity = userProfile?.university?.toLowerCase() || '';
        const userLocation = userProfile?.location?.toLowerCase() || '';
        
        // Combine all user preferences into searchable keywords
        const userKeywords = [
          ...userSkills.map(s => s.toLowerCase()),
          ...userTitle.split(/\s+/).filter(w => w.length > 2),
          ...userBio.split(/\s+/).filter(w => w.length > 3),
          ...userMajor.split(/\s+/).filter(w => w.length > 3),
          userRole
        ].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates

        // STEP 3: Fetch all open jobs
        const { data: allJobs, error: jobsError } = await supabase
          .from('jobs')
          .select('id,title,company,location,type,salary_range,description,skills,is_remote,created_at,employer_id,requirements,experience_level')
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(limit * 10); // Fetch more to score and filter

        if (jobsError) {
          console.error('Error fetching jobs:', jobsError);
          return [];
        }

        if (!allJobs || allJobs.length === 0) {
          return [];
        }

        // STEP 4: Score jobs based on match with user profile
        const scoredJobs = allJobs.map(job => {
          let matchScore = 0;
          const matchReasons: string[] = [];

          // Normalize job data
          const jobTitle = job.title?.toLowerCase() || '';
          const jobDescription = job.description?.toLowerCase() || '';
          const jobCompany = job.company?.toLowerCase() || '';
          const jobSkills = (Array.isArray(job.skills) ? job.skills : []).map(s => s.toLowerCase());
          const jobLocation = job.location?.toLowerCase() || '';
          const jobRequirements = Array.isArray(job.requirements) ? job.requirements.join(' ').toLowerCase() : '';
          const jobExperienceLevel = job.experience_level?.toLowerCase() || '';

          // 1. Skill match (highest weight: 50 points per match)
          let skillMatches = 0;
          userSkills.forEach(userSkill => {
            const skillLower = userSkill.toLowerCase();
            if (jobSkills.some(js => js.includes(skillLower) || skillLower.includes(js))) {
              matchScore += 50;
              skillMatches++;
            }
          });
          if (skillMatches > 0) {
            matchReasons.push(`${skillMatches} skill${skillMatches > 1 ? 's' : ''} match`);
          }

          // 2. Job title keyword match (30 points per keyword match)
          let titleMatches = 0;
          userKeywords.forEach(keyword => {
            if (jobTitle.includes(keyword) && keyword.length > 2) {
              matchScore += 30;
              titleMatches++;
            }
          });
          if (titleMatches > 0) {
            matchReasons.push(`Title matches your profile`);
          }

          // 3. Major/Education match (25 points if major mentioned in job)
          if (userMajor && (jobDescription.includes(userMajor) || jobRequirements.includes(userMajor))) {
            matchScore += 25;
            matchReasons.push(`Matches your major (${userProfile?.major})`);
          }

          // 4. Experience level match (20 points)
          if (userProfile?.experience_level && jobExperienceLevel === userProfile.experience_level.toLowerCase()) {
            matchScore += 20;
            matchReasons.push(`Right experience level`);
          }

          // 5. Location match (15 points if same location or remote)
          if (userLocation && jobLocation.includes(userLocation)) {
            matchScore += 15;
            matchReasons.push(`Located in ${userProfile?.location}`);
          }

          // 6. Remote work preference (10 points if user might prefer remote)
          if (job.is_remote) {
            matchScore += 10;
            matchReasons.push(`Remote work available`);
          }

          // 7. Description mentions user's skills/interests (15 points per mention, max 3)
          let descriptionMatches = 0;
          userKeywords.slice(0, 10).forEach(keyword => {
            if (keyword.length > 3 && jobDescription.includes(keyword)) {
              matchScore += 15;
              descriptionMatches++;
            }
          });
          if (descriptionMatches > 0) {
            matchReasons.push(`${descriptionMatches} interest${descriptionMatches > 1 ? 's' : ''} mentioned`);
          }

          // 8. University/Career goals alignment (10 points)
          if (userUniversity && jobDescription.includes(userUniversity)) {
            matchScore += 10;
            matchReasons.push(`Values ${userProfile?.university} background`);
          }

          // 9. Recent jobs get recency bonus (10 points if < 3 days)
          const daysSincePosted = (Date.now() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24);
          if (daysSincePosted < 3) {
            matchScore += 10;
            matchReasons.push(`Posted recently`);
          } else if (daysSincePosted < 7) {
            matchScore += 5;
          }

          // 10. Salary range match (bonus if specified)
          if (job.salary_range) {
            matchScore += 5;
            matchReasons.push(`Salary disclosed`);
          }

          return {
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location || 'Not specified',
            type: job.type || 'Full-time',
            salary_range: job.salary_range,
            description: job.description,
            skills: jobSkills,
            is_remote: job.is_remote || false,
            created_at: job.created_at,
            employer_id: job.employer_id,
            matchScore,
            matchReasons: matchReasons.slice(0, 3), // Show top 3 reasons
            matchPercentage: Math.min(100, Math.round((matchScore / 200) * 100)) // Cap at 100%
          };
        });

        // STEP 5: Filter and sort by match score (only jobs with score > 0)
        const matchedJobs = scoredJobs
          .filter(job => job.matchScore > 0)
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, limit);

        // If no matched jobs found with scoring, return top recent jobs
        if (matchedJobs.length === 0) {
          return scoredJobs
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, limit)
            .map(job => ({
              ...job,
              matchReasons: ['Recent posting']
            }));
        }

        return matchedJobs;
      } catch (error) {
        console.error('Error in useMatchedJobs:', error);
        return [];
      }
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes cache
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

// Hook for fetching the most liked posts - NEW for Industry Pulse
export function useMostLikedPosts(limit = 5, currentUserId?: string) {
  return useQuery({
    queryKey: ['mostLikedPosts', limit, currentUserId],
    queryFn: async () => {
      try {
        // STEP 1: Fetch most liked posts (posts with highest likes_count)
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('id,content,user_id,created_at,likes_count,comments_count,shares_count,media_type,image_url,video_url,visibility')
          .order('likes_count', { ascending: false }) // Sort by likes descending
          .eq('visibility', 'public') // Only public posts
          .limit(limit);

        if (postsError) {
          console.error('Error fetching most liked posts:', postsError);
          throw postsError;
        }

        if (!postsData || postsData.length === 0) {
          return [];
        }

        // STEP 2: Get unique user IDs and fetch all profiles in parallel
        const userIds = [...new Set(postsData.map(post => post.user_id))];
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id,full_name,avatar_url,username,verified')
          .in('id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }

        const profilesMap = new Map(
          profilesData?.map(p => [p.id, p]) || []
        );

        // STEP 3: Fetch likes separately if we have a current user
        let likesMap = new Map<string, boolean>();
        if (currentUserId) {
          try {
            const { data: likesData, error: likesError } = await supabase
              .from('likes')
              .select('post_id,user_id')
              .eq('user_id', currentUserId)
              .in('post_id', postsData.map(p => p.id));

            if (!likesError && likesData) {
              likesMap = new Map(likesData.map(like => [like.post_id, true]));
            }
          } catch (error) {
            console.warn('Error fetching likes:', error);
          }
        }

        // STEP 4: Transform and return posts with minimal processing
        return postsData.map((post: any) => {
          const profile = profilesMap.get(post.user_id);
          return {
            id: post.id.toString(),
            content: post.content || '',
            author: {
              id: post.user_id.toString(),
              name: profile?.full_name || 'User',
              username: profile?.username || `user${post.user_id}`,
              avatar_url: profile?.avatar_url,
              verified: profile?.verified || false
            },
            created_at: post.created_at,
            likes_count: post.likes_count || 0,
            retweets_count: post.shares_count || 0,
            replies_count: post.comments_count || 0,
            has_liked: likesMap.has(post.id),
            has_retweeted: false,
            has_bookmarked: false,
            media: post.image_url || post.video_url ? [{
              type: (post.media_type === 'video' || post.video_url) ? 'video' : 'image',
              url: post.image_url || post.video_url || '',
              alt: 'Post media'
            }] : undefined,
            visibility: post.visibility
          };
        });
      } catch (error) {
        console.error('useMostLikedPosts error:', error);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for trend data
    gcTime: 30 * 60 * 1000, // 30 minutes cache
  });
}

// Hook for fetching applicants (for employers) - OPTIMIZED
export function useApplicants(jobId?: string) {
  return useQuery({
    queryKey: ['applicants', jobId],
    queryFn: async () => {
      try {
        // First fetch applications
        let query = supabase
          .from('applications')
          .select('id, job_id, student_id, applied_date, status')
          .order('applied_date', { ascending: false });

        if (jobId) {
          query = query.eq('job_id', jobId);
        }

        const { data: applications, error: appError } = await query;
        
        if (appError) {
          console.error('Error fetching applications:', appError);
          throw appError;
        }

        if (!applications || applications.length === 0) {
          return [];
        }

        // Get unique student IDs
        const studentIds = [...new Set(applications.map(app => app.student_id))];

        // Fetch profiles separately
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url, university, major, graduation_year, skills, portfolio_url, phone')
          .in('id', studentIds);

        if (profileError) {
          console.warn('Error fetching profiles:', profileError);
        }

        const profileMap = new Map(
          profiles?.map(p => [p.id, p]) || []
        );

        // Combine applications with profiles
        return applications.map(app => ({
          ...app,
          profile: profileMap.get(app.student_id)
        }));
      } catch (error) {
        console.error('useApplicants error:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
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
      try {
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

        // If table doesn't exist or is not accessible, return empty array
        if (error) {
          console.warn('Error fetching companies:', error.message);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error('Exception fetching companies:', error);
        return [];
      }
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
      
      try {
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

        if (error) {
          console.warn('Error fetching company:', error.message);
          return null;
        }
        return data;
      } catch (error) {
        console.error('Exception fetching company:', error);
        return null;
      }
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

      try {
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

        // Search companies - only needed columns (with error handling)
        let companies: any[] = [];
        try {
          const { data: companiesData, error: companiesError } = await supabase
            .from('companies')
            .select('id,name,logo_url,description,website')
            .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
            .limit(10);

          if (!companiesError) {
            companies = companiesData || [];
          }
        } catch (error) {
          console.warn('Companies search failed:', error);
          companies = [];
        }

        return {
          jobs: jobs || [],
          users: users || [],
          posts: posts || [],
          companies: companies
        };
      } catch (error) {
        console.error('Search query failed:', error);
        return { jobs: [], users: [], posts: [], companies: [] };
      }
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
          title,
          location
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
          title,
          location,
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
            currentUser?.title &&
            user.title &&
            user.title.toLowerCase().includes(currentUser.title.toLowerCase())
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

          // Match location
          if (currentUser?.location && user.location === currentUser.location) {
            score += 15;
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
    staleTime: Infinity, // Never mark as stale - keep cache forever
    gcTime: Infinity, // Never garbage collect - keep cache forever
    refetchInterval: 30 * 1000, // Refetch every 30 seconds in the background
    refetchIntervalInBackground: true, // Continue refetching even when tab is not focused
  });
}

// Hook for checking if current user follows another user
export function useFollowStatus(currentUserId: string | undefined, targetUserId: string | undefined) {
  return useQuery({
    queryKey: ['followStatus', currentUserId, targetUserId],
    queryFn: async () => {
      if (!currentUserId || !targetUserId) throw new Error('User IDs required');

      try {
        // Check if a follow relationship exists - fetch the actual record
        const { data, error } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', currentUserId)
          .eq('following_id', targetUserId)
          .maybeSingle();

        if (error) {
          console.error('Follow status check error:', error);
          throw error;
        }
        
        // Return true if a follow record exists, false otherwise
        return !!data;
      } catch (error) {
        console.error('useFollowStatus error:', error);
        return false;
      }
    },
    enabled: !!currentUserId && !!targetUserId,
    staleTime: 0, // Always refetch to get latest status
    gcTime: 5 * 60 * 1000, // 5 minutes cache
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
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate specific follow status for this user pair
      queryClient.invalidateQueries({ 
        queryKey: ['followStatus', variables.followerId, variables.followingId] 
      });
      // Also invalidate all follow-related queries
      queryClient.invalidateQueries({ queryKey: ['followStatus'] });
      queryClient.invalidateQueries({ queryKey: ['recommendedUsers'] });
      queryClient.invalidateQueries({ queryKey: ['mostFollowedUsers'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      console.error('Follow mutation error:', error);
    }
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
    onSuccess: (data, variables) => {
      // Invalidate specific follow status for this user pair
      queryClient.invalidateQueries({ 
        queryKey: ['followStatus', variables.followerId, variables.followingId] 
      });
      // Also invalidate all follow-related queries
      queryClient.invalidateQueries({ queryKey: ['followStatus'] });
      queryClient.invalidateQueries({ queryKey: ['recommendedUsers'] });
      queryClient.invalidateQueries({ queryKey: ['mostFollowedUsers'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      console.error('Unfollow mutation error:', error);
    }
  });
}

// Hook for fetching most followed users - OPTIMIZED
export function useMostFollowedUsers(limit = 5) {
  return useQuery({
    queryKey: ['mostFollowedUsers', limit],
    queryFn: async () => {
      try {
        // Use a single efficient query with SQL to get follower counts
        const { data: mostFollowedData, error } = await supabase
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
            follower_count:follows!following_id(count)
          `)
          .not('id', 'is', null)
          .order('created_at', { ascending: false })
          .limit(limit * 10); // Fetch more to sort by follower count

        if (error) {
          console.error('Error fetching most followed users:', error);
          throw error;
        }

        if (!mostFollowedData || mostFollowedData.length === 0) {
          return [];
        }

        // Transform the data to include proper follower count
        const usersWithCounts = mostFollowedData.map(user => ({
          id: user.id,
          full_name: user.full_name,
          username: user.username,
          avatar_url: user.avatar_url,
          bio: user.bio,
          verified: user.verified,
          role: user.role,
          company_name: user.company_name,
          location: user.location,
          followerCount: Array.isArray(user.follower_count) ? user.follower_count.length : 0
        }));

        // Sort by follower count descending and take the top users
        return usersWithCounts
          .sort((a, b) => b.followerCount - a.followerCount)
          .slice(0, limit);

      } catch (error) {
        console.error('Error in useMostFollowedUsers:', error);
        
        // Fallback: Return recent users if the optimized query fails
        try {
          const { data: fallbackUsers, error: fallbackError } = await supabase
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
            .not('avatar_url', 'is', null) // Prioritize users with avatars
            .eq('verified', true) // Show verified users first
            .order('created_at', { ascending: false })
            .limit(limit);

          if (fallbackError) throw fallbackError;

          return (fallbackUsers || []).map(user => ({
            ...user,
            followerCount: 0 // Unknown follower count in fallback
          }));
        } catch (fallbackError) {
          console.error('Fallback query also failed:', fallbackError);
          return [];
        }
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour cache
    retry: (failureCount, error: any) => {
      if (failureCount < 2) {
        console.log(`Retrying useMostFollowedUsers (attempt ${failureCount + 1})`);
        return true;
      }
      return false;
    }
  });
}

// Hook for fetching recommended companies/employers - OPTIMIZED
export function useRecommendedCompanies(limit = 3) {
  return useQuery({
    queryKey: ['recommendedCompanies', limit],
    queryFn: async () => {
      try {
        // Fetch companies with employer profiles
        const { data: companies, error } = await supabase
          .from('companies')
          .select(`
            id,
            name,
            logo_url,
            industry,
            location,
            size,
            is_hiring
          `)
          .eq('is_hiring', true)
          .order('created_at', { ascending: false })
          .limit(limit * 2);

        if (error) {
          console.warn('Error fetching recommended companies:', error.message);
          return [];
        }

        // Filter to only return companies that are actively hiring
        const hiringCompanies = (companies || [])
          .filter(company => company.is_hiring)
          .slice(0, limit)
          .map(company => ({
            id: company.id,
            name: company.name,
            logo_url: company.logo_url,
            industry: company.industry || 'Technology',
            location: company.location,
            size: company.size
          }));

        return hiringCompanies;
      } catch (error) {
        console.error('Exception fetching recommended companies:', error);
        return [];
      }
    },
    staleTime: 20 * 60 * 1000, // 20 minutes
    gcTime: 60 * 60 * 1000, // 1 hour cache
  });
}

// Hook for fetching employer events - OPTIMIZED
export function useEmployerEvents(limit = 12, status = 'upcoming') {
  return useQuery({
    queryKey: ['employerEvents', limit, status],
    queryFn: async () => {
      try {
        // First, fetch events without the problematic join
        let query = supabase
          .from('employer_events')
          .select(`
            id,
            employer_id,
            title,
            description,
            event_date,
            event_end_date,
            location,
            virtual_link,
            event_type,
            banner_image_url,
            capacity,
            attendees_count,
            is_featured,
            status,
            tags,
            created_at
          `)
          .order('is_featured', { ascending: false })
          .order('event_date', { ascending: true });

        if (status !== 'all') {
          query = query.eq('status', status);
        }

        const { data: events, error } = await query.limit(limit);

        // If table doesn't exist, return empty array
        if (error && error.code === 'PGRST116') {
          console.warn('employer_events table not found. Please run the migration.');
          return [];
        }

        if (error) {
          console.error('Error fetching events:', error);
          return [];
        }

        if (!events || events.length === 0) return [];

        // Now fetch employer profiles separately
        const employerIds = [...new Set(events.map(e => e.employer_id))];
        
        const { data: employers, error: employerError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, username, company_name, verified')
          .in('id', employerIds);

        if (employerError) {
          console.warn('Error fetching employer profiles:', employerError);
        }

        // Create a map of employers for quick lookup
        const employerMap = new Map(
          employers?.map(emp => [emp.id, emp]) || []
        );

        // Combine events with employer data
        return events.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          event_date: event.event_date,
          event_end_date: event.event_end_date,
          location: event.location,
          virtual_link: event.virtual_link,
          event_type: event.event_type,
          banner_image_url: event.banner_image_url,
          capacity: event.capacity,
          attendees_count: event.attendees_count || 0,
          is_featured: event.is_featured,
          status: event.status,
          tags: event.tags || [],
          created_at: event.created_at,
          employer: employerMap.get(event.employer_id) ? {
            id: employerMap.get(event.employer_id)!.id,
            name: employerMap.get(event.employer_id)!.full_name,
            username: employerMap.get(event.employer_id)!.username,
            avatar_url: employerMap.get(event.employer_id)!.avatar_url,
            company_name: employerMap.get(event.employer_id)!.company_name,
            verified: employerMap.get(event.employer_id)!.verified
          } : null
        }));
      } catch (error: any) {
        console.error('Error fetching employer events:', error);
        // Return empty array on error instead of throwing
        return [];
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute (shows new events faster)
    gcTime: 10 * 60 * 1000, // 10 minutes cache
  });
}

// Hook for fetching a single employer event
export function useEmployerEvent(eventId: string | undefined) {
  return useQuery({
    queryKey: ['employerEvent', eventId],
    queryFn: async () => {
      if (!eventId) throw new Error('Event ID required');

      try {
        // First fetch the event data without the join
        const { data: eventData, error: eventError } = await supabase
          .from('employer_events')
          .select(`
            id,
            employer_id,
            title,
            description,
            event_date,
            event_end_date,
            location,
            virtual_link,
            event_type,
            banner_image_url,
            capacity,
            attendees_count,
            event_end_date,
            location,
            virtual_link,
            event_type,
            banner_image_url,
            capacity,
            attendees_count,
            is_featured,
            status,
            tags,
            created_at,
            updated_at
          `)
          .eq('id', eventId)
          .single();

        if (eventError) {
          console.error('Error fetching event:', eventError);
          throw eventError;
        }

        if (!eventData) {
          throw new Error('Event not found');
        }

        // Then fetch the employer profile separately
        const { data: employerData, error: employerError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, username, company_name, verified, bio')
          .eq('id', eventData.employer_id)
          .single();

        if (employerError) {
          console.warn('Error fetching employer profile:', employerError);
        }

        // Combine the data
        return {
          id: eventData.id,
          employer_id: eventData.employer_id,
          title: eventData.title,
          description: eventData.description,
          event_date: eventData.event_date,
          event_end_date: eventData.event_end_date,
          location: eventData.location,
          virtual_link: eventData.virtual_link,
          event_type: eventData.event_type,
          banner_image_url: eventData.banner_image_url,
          capacity: eventData.capacity,
          attendees_count: eventData.attendees_count || 0,
          is_featured: eventData.is_featured,
          status: eventData.status,
          tags: eventData.tags || [],
          created_at: eventData.created_at,
          updated_at: eventData.updated_at,
          employer: employerData ? {
            id: employerData.id,
            name: employerData.full_name,
            avatar_url: employerData.avatar_url,
            username: employerData.username,
            company_name: employerData.company_name,
            verified: employerData.verified,
            bio: employerData.bio
          } : null
        };
      } catch (error: any) {
        console.error('Error in useEmployerEvent:', error);
        throw error;
      }
    },
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

// Hook for creating an employer event
export function useCreateEmployerEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEvent: any) => {
      const { data, error } = await supabase
        .from('employer_events')
        .insert([newEvent])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerEvents'] });
    },
  });
}

// Hook for updating an employer event
export function useUpdateEmployerEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, updates }: { eventId: string; updates: any }) => {
      const { data, error } = await supabase
        .from('employer_events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerEvents'] });
      queryClient.invalidateQueries({ queryKey: ['employerEvent'] });
    },
  });
}

// Hook for registering for an event
export function useRegisterForEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, userId }: { eventId: string; userId: string }) => {
      const { data, error } = await supabase
        .from('event_attendees')
        .insert([{
          event_id: eventId,
          user_id: userId,
          status: 'registered'
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Update attendees count
      await supabase
        .from('employer_events')
        .update({ attendees_count: supabase.rpc('increment_attendees', { event_id: eventId }) })
        .eq('id', eventId);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerEvents'] });
      queryClient.invalidateQueries({ queryKey: ['employerEvent'] });
      queryClient.invalidateQueries({ queryKey: ['eventAttendees'] });
    },
  });
}

// Hook for unregistering from an event
export function useUnregisterFromEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, userId }: { eventId: string; userId: string }) => {
      const { error } = await supabase
        .from('event_attendees')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId);

      if (error) throw error;

      // Update attendees count
      await supabase
        .from('employer_events')
        .update({ attendees_count: supabase.rpc('decrement_attendees', { event_id: eventId }) })
        .eq('id', eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerEvents'] });
      queryClient.invalidateQueries({ queryKey: ['employerEvent'] });
      queryClient.invalidateQueries({ queryKey: ['eventAttendees'] });
    },
  });
}

// Hook for fetching event attendees
export function useEventAttendees(eventId: string | undefined) {
  return useQuery({
    queryKey: ['eventAttendees', eventId],
    queryFn: async () => {
      if (!eventId) throw new Error('Event ID required');

      const { data, error } = await supabase
        .from('event_attendees')
        .select(`
          id,
          user_id,
          status,
          created_at,
          profiles:user_id (
            id,
            full_name,
            avatar_url,
            username,
            bio
          )
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

// Hook for checking if user is registered for event
export function useEventRegistrationStatus(eventId: string | undefined, userId: string | undefined) {
  return useQuery({
    queryKey: ['eventRegistration', eventId, userId],
    queryFn: async () => {
      if (!eventId || !userId) throw new Error('Event ID and User ID required');

      const { data, error } = await supabase
        .from('event_attendees')
        .select('id, status')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return data ? { isRegistered: true, status: data.status } : { isRegistered: false, status: null };
    },
    enabled: !!eventId && !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

// Hook for liking a post
export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: string; userId: string }) => {
      try {
        // Insert a like record into the likes table
        const { data, error } = await supabase
          .from('likes')
          .insert([
            {
              post_id: postId,
              user_id: userId,
              comment_id: null
            }
          ])
          .select()
          .single();

        if (error) {
          console.error('Like error details:', {
            code: error.code,
            message: error.message,
            details: error.details
          });
          throw error;
        }

        return data;
      } catch (error: any) {
        console.error('Failed to like post:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('✅ Post liked successfully');
      // Refetch posts to get updated like counts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: any) => {
      console.error('Like mutation error:', error?.message || error);
    }
  });
}

// Hook for unliking a post
export function useUnlikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: string; userId: string }) => {
      try {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (error) {
          console.error('Unlike error details:', {
            code: error.code,
            message: error.message,
            details: error.details
          });
          throw error;
        }
      } catch (error: any) {
        console.error('Failed to unlike post:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('✅ Post unliked successfully');
      // Refetch posts to get updated like counts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: any) => {
      console.error('Unlike mutation error:', error?.message || error);
    }
  });
}

// Hook for fetching a single post with full details
export function usePostDetail(postId: string | undefined, currentUserId?: string) {
  return useQuery({
    queryKey: ['postDetail', postId, currentUserId],
    queryFn: async () => {
      if (!postId) throw new Error('Post ID required');

      try {
        // Fetch post data with likes
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select(`
            id,
            content,
            user_id,
            created_at,
            updated_at,
            likes_count,
            comments_count,
            shares_count,
            media_type,
            image_url,
            video_url,
            visibility,
            location,
            tags,
            likes:likes!post_id (
              user_id
            )
          `)
          .eq('id', postId)
          .single();

        if (postError) throw postError;

        // Fetch author profile
        const { data: authorData, error: authorError } = await supabase
          .from('profiles')
          .select(PROFILE_COLUMNS)
          .eq('id', postData.user_id)
          .single();

        if (authorError) {
          console.warn('Error fetching author profile:', authorError);
        }

        // Calculate if current user has liked this post
        const hasLiked = currentUserId && postData.likes
          ? (postData.likes as Array<{ user_id: string }>).some(like => like.user_id === currentUserId)
          : false;

        return {
          id: postData.id,
          user_id: postData.user_id,
          content: postData.content || '',
          image_url: postData.image_url,
          video_url: postData.video_url,
          post_type: postData.media_type || 'text',
          visibility: postData.visibility || 'public',
          likes_count: postData.likes_count || 0,
          comments_count: postData.comments_count || 0,
          shares_count: postData.shares_count || 0,
          created_at: postData.created_at,
          updated_at: postData.updated_at,
          tags: postData.tags,
          location: postData.location,
          has_liked: hasLiked,
          has_bookmarked: false,
          author: {
            id: postData.user_id,
            full_name: authorData?.full_name || 'User',
            avatar_url: authorData?.avatar_url,
            role: authorData?.role || 'student',
            company: authorData?.company_name,
            title: authorData?.title,
            verified: authorData?.verified || false,
            bio: authorData?.bio,
            location: authorData?.location
          }
        };
      } catch (error: any) {
        console.error('Error fetching post detail:', error);
        throw error;
      }
    },
    enabled: !!postId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes cache
  });
}

// Hook for fetching a single job with employer details
export function useJobDetail(jobId: string | undefined) {
  return useQuery({
    queryKey: ['jobDetail', jobId],
    queryFn: async () => {
      if (!jobId) throw new Error('Job ID required');

      try {
        // First fetch the job data
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select(`
            id,
            employer_id,
            title,
            company,
            location,
            type,
            salary_range,
            description,
            requirements,
            skills,
            benefits,
            experience_level,
            status,
            posted_at,
            deadline,
            company_id
          `)
          .eq('id', jobId)
          .single();

        if (jobError) {
          console.error('Error fetching job:', jobError);
          throw jobError;
        }

        if (!jobData) {
          throw new Error('Job not found');
        }

        // Then fetch the employer profile separately
        const { data: employerData, error: employerError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, username, company_name, verified, bio')
          .eq('id', jobData.employer_id)
          .single();

        if (employerError) {
          console.warn('Error fetching employer profile:', employerError);
        }

        // Combine the data
        return {
          id: jobData.id,
          employer_id: jobData.employer_id,
          company_id: jobData.company_id,
          title: jobData.title,
          company: jobData.company,
          location: jobData.location,
          type: jobData.type,
          salary_range: jobData.salary_range,
          description: jobData.description,
          requirements: Array.isArray(jobData.requirements) ? jobData.requirements : [],
          skills: Array.isArray(jobData.skills) ? jobData.skills : [],
          benefits: jobData.benefits,
          experience_level: jobData.experience_level,
          status: jobData.status,
          posted_at: jobData.posted_at,
          deadline: jobData.deadline,
          employer: employerData ? {
            id: employerData.id,
            name: employerData.full_name,
            avatar_url: employerData.avatar_url,
            username: employerData.username,
            company_name: employerData.company_name,
            verified: employerData.verified,
            bio: employerData.bio
          } : null
        };
      } catch (error: any) {
        console.error('Error in useJobDetail:', error);
        throw error;
      }
    },
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}