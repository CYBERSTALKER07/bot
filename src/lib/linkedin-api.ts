import { Job } from '../types';
import { fetchWithSafariHeaders } from './supabase';

interface LinkedInConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
}

interface LinkedInJobData {
  id: string;
  title: string;
  company: {
    name: string;
    id: string;
  };
  location: {
    country: string;
    region: string;
    postalCode?: string;
  };
  description: string;
  employmentType: string;
  experienceLevel: string;
  jobFunctions: string[];
  industries: string[];
  postedDate: number;
  expiresAt?: number;
  applyUrl?: string;
}

interface LinkedInAccessToken {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export class LinkedInJobService {
  private config: LinkedInConfig;
  private baseUrl = 'https://api.linkedin.com/v2';

  constructor(config: LinkedInConfig) {
    this.config = config;
  }

  /**
   * Generate LinkedIn OAuth authorization URL
   */
  generateAuthUrl(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope.join(' '),
      state: this.generateState(), // CSRF protection
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(code: string): Promise<LinkedInAccessToken> {
    try {
      const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit', // LinkedIn token endpoint doesn't need credentials
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          redirect_uri: this.config.redirectUri,
        }).toString(),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('LinkedIn OAuth error response:', errorData);
        throw new Error(`LinkedIn OAuth error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error getting LinkedIn access token:', error);
      throw error;
    }
  }

  /**
   * Search for job postings using LinkedIn's Job Search API
   * Note: This requires LinkedIn Partner Program access
   */
  async searchJobs(
    accessToken: string,
    params: {
      keywords?: string;
      location?: string;
      company?: string;
      experienceLevel?: string;
      jobType?: string;
      count?: number;
      start?: number;
    }
  ): Promise<LinkedInJobData[]> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.keywords) searchParams.set('keywords', params.keywords);
      if (params.location) searchParams.set('location', params.location);
      if (params.company) searchParams.set('company', params.company);
      if (params.experienceLevel) searchParams.set('experienceLevel', params.experienceLevel);
      if (params.jobType) searchParams.set('jobType', params.jobType);
      if (params.count) searchParams.set('count', params.count.toString());
      if (params.start) searchParams.set('start', params.start.toString());

      const response = await fetch(
        `${this.baseUrl}/jobSearch?${searchParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
            'Accept': 'application/json',
          },
          mode: 'cors',
          credentials: 'omit',
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error('LinkedIn API error response:', errorData);
        throw new Error(`LinkedIn API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.elements || [];
    } catch (error) {
      console.error('Error searching LinkedIn jobs:', error);
      throw error;
    }
  }

  /**
   * Get job details by job ID
   */
  async getJobDetails(accessToken: string, jobId: string): Promise<LinkedInJobData> {
    try {
      const response = await fetch(`${this.baseUrl}/jobs/${jobId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('LinkedIn API error response:', errorData);
        throw new Error(`LinkedIn API error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching LinkedIn job details:', error);
      throw error;
    }
  }

  /**
   * Transform LinkedIn job data to our internal Job format
   */
  transformLinkedInJob(linkedInJob: LinkedInJobData): Partial<Job> {
    return {
      id: `linkedin_${linkedInJob.id}`,
      title: linkedInJob.title,
      company: linkedInJob.company.name,
      location: `${linkedInJob.location.region}, ${linkedInJob.location.country}`,
      description: linkedInJob.description,
      type: this.mapEmploymentType(linkedInJob.employmentType),
      experience_level: this.mapExperienceLevel(linkedInJob.experienceLevel),
      skills: linkedInJob.jobFunctions,
      posted_date: new Date(linkedInJob.postedDate).toISOString(),
      deadline: linkedInJob.expiresAt ? new Date(linkedInJob.expiresAt).toISOString() : undefined,
      status: 'active',
      employer_id: `linkedin_${linkedInJob.company.id}`,
    };
  }

  /**
   * Bulk import jobs from LinkedIn
   */
  async importJobs(
    accessToken: string,
    searchParams: Parameters<typeof this.searchJobs>[1],
    onProgress?: (imported: number, total: number) => void
  ): Promise<Partial<Job>[]> {
    const jobs: Partial<Job>[] = [];
    let start = 0;
    const batchSize = 25; // LinkedIn API limit
    let hasMore = true;

    while (hasMore) {
      try {
        const linkedInJobs = await this.searchJobs(accessToken, {
          ...searchParams,
          count: batchSize,
          start,
        });

        if (linkedInJobs.length === 0) {
          hasMore = false;
          break;
        }

        // Transform and add jobs
        const transformedJobs = linkedInJobs.map(job => this.transformLinkedInJob(job));
        jobs.push(...transformedJobs);

        // Update progress
        onProgress?.(jobs.length, jobs.length + batchSize);

        // Prepare for next batch
        start += batchSize;

        // Rate limiting - LinkedIn allows 500 requests per hour for most endpoints
        await this.delay(100);

      } catch (error) {
        console.error('Error importing LinkedIn jobs:', error);
        break;
      }
    }

    return jobs;
  }

  private mapEmploymentType(linkedInType: string): Job['type'] {
    const typeMap: Record<string, Job['type']> = {
      'FULL_TIME': 'full-time',
      'PART_TIME': 'part-time',
      'CONTRACT': 'part-time',
      'TEMPORARY': 'part-time',
      'INTERNSHIP': 'internship',
    };

    return typeMap[linkedInType] || 'full-time';
  }

  private mapExperienceLevel(linkedInLevel: string): string {
    const levelMap: Record<string, string> = {
      'INTERNSHIP': 'entry',
      'ENTRY_LEVEL': 'entry',
      'ASSOCIATE': 'mid',
      'MID_SENIOR': 'senior',
      'DIRECTOR': 'senior',
      'EXECUTIVE': 'executive',
    };

    return levelMap[linkedInLevel] || 'entry';
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Environment configuration
export const linkedInConfig: LinkedInConfig = {
  clientId: import.meta.env.REACT_APP_LINKEDIN_CLIENT_ID || '',
  clientSecret: import.meta.env.REACT_APP_LINKEDIN_CLIENT_SECRET || '',
  redirectUri: import.meta.env.REACT_APP_LINKEDIN_REDIRECT_URI || `${window.location.origin}/auth/linkedin/callback`,
  scope: [
    'r_liteprofile',
    'r_emailaddress',
    'w_member_social', // Required for job search API
  ],
};

// Export singleton instance
export const linkedInJobService = new LinkedInJobService(linkedInConfig);