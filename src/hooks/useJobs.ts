import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Job } from '../types';

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      // Since we don't have a jobs table in the schema, we'll use posts as a placeholder
      // In a real implementation, you'd create a proper jobs table
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey(username, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform posts data to job format for demo purposes
      const transformedJobs: Job[] = data?.map(post => ({
        id: post.id,
        title: post.title || 'Job Opportunity',
        company: post.profiles?.full_name || 'Company Name',
        type: 'internship' as const,
        location: 'Phoenix, AZ',
        description: post.caption || 'Job description not available',
        requirements: [],
        skills: post.tags || [],
        posted_date: post.created_at,
        employer_id: post.user_id,
        created_at: post.created_at,
        updated_at: post.updated_at
      })) || [];

      setJobs(transformedJobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { jobs, loading, error, refetch: fetchJobs };
}