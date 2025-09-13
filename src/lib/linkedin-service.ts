import { Job } from '../types';

// LinkedIn API Configuration
const LINKEDIN_CONFIG = {
  CLIENT_ID: process.env.REACT_APP_LINKEDIN_CLIENT_ID || '',
  CLIENT_SECRET: process.env.REACT_APP_LINKEDIN_CLIENT_SECRET || '',
  REDIRECT_URI: process.env.REACT_APP_LINKEDIN_REDIRECT_URI || `${window.location.origin}/linkedin-callback`,
  SCOPE: 'r_liteprofile r_emailaddress w_member_social rw_organization_admin r_organization_social w_organization_social',
  API_BASE_URL: 'https://api.linkedin.com/v2',
  JOBS_API_URL: 'https://api.linkedin.com/rest/jobs',
  APPLY_API_URL: 'https://api.linkedin.com/rest/applications'
};

export interface LinkedInProfile {
  id: string;
  firstName: {
    localized: { [key: string]: string };
    preferredLocale: { country: string; language: string };
  };
  lastName: {
    localized: { [key: string]: string };
    preferredLocale: { country: string; language: string };
  };
  profilePicture?: {
    displayImage: string;
    'displayImage~': {
      elements: Array<{
        identifiers: Array<{ identifier: string }>;
      }>;
    };
  };
  emailAddress?: string;
}

export interface LinkedInJob {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    universalName?: string;
    logo?: string;
  };
  location: {
    country: string;
    region?: string;
    city?: string;
  };
  description: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'INTERNSHIP' | 'VOLUNTEER' | 'OTHER';
  experienceLevel: 'INTERNSHIP' | 'ENTRY_LEVEL' | 'ASSOCIATE' | 'MID_SENIOR_LEVEL' | 'DIRECTOR' | 'EXECUTIVE';
  jobFunction: string[];
  industries: string[];
  skills?: string[];
  salaryRange?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  workRemoteAllowed?: boolean;
  postedAt: number;
  expiresAt?: number;
  applicationUrl?: string;
  companyApplyUrl?: string;
  easyApplyEnabled?: boolean;
  applicationInstructions?: string;
}

export interface LinkedInApplication {
  jobId: string;
  candidateId: string;
  resumeUrl?: string;
  coverLetter?: string;
  answers?: Array<{
    question: string;
    answer: string;
  }>;
  appliedAt: number;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED' | 'WITHDRAWN';
}

export interface JobImportSettings {
  keywords?: string[];
  locations?: string[];
  companies?: string[];
  jobTypes?: string[];
  experienceLevels?: string[];
  salaryMin?: number;
  salaryMax?: number;
  remoteOnly?: boolean;
  datePosted?: 'past24Hours' | 'pastWeek' | 'pastMonth' | 'anytime';
  limit?: number;
}

class LinkedInService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    this.loadTokensFromStorage();
  }

  /**
   * Load stored tokens from localStorage
   */
  private loadTokensFromStorage(): void {
    const tokenData = localStorage.getItem('linkedin_tokens');
    if (tokenData) {
      try {
        const parsed = JSON.parse(tokenData);
        this.accessToken = parsed.accessToken;
        this.refreshToken = parsed.refreshToken;
        this.tokenExpiry = parsed.tokenExpiry;
      } catch (error) {
        console.error('Error parsing stored LinkedIn tokens:', error);
        localStorage.removeItem('linkedin_tokens');
      }
    }
  }

  /**
   * Save tokens to localStorage
   */
  private saveTokensToStorage(): void {
    const tokenData = {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      tokenExpiry: this.tokenExpiry
    };
    localStorage.setItem('linkedin_tokens', JSON.stringify(tokenData));
  }

  /**
   * Check if current access token is valid
   */
  private isTokenValid(): boolean {
    return this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry;
  }

  /**
   * Generate LinkedIn OAuth URL
   */
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: LINKEDIN_CONFIG.CLIENT_ID,
      redirect_uri: LINKEDIN_CONFIG.REDIRECT_URI,
      scope: LINKEDIN_CONFIG.SCOPE,
      state: state || Math.random().toString(36).substring(7)
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<void> {
    try {
      const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          client_id: LINKEDIN_CONFIG.CLIENT_ID,
          client_secret: LINKEDIN_CONFIG.CLIENT_SECRET,
          redirect_uri: LINKEDIN_CONFIG.REDIRECT_URI,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await response.json();
      
      this.accessToken = tokenData.access_token;
      this.refreshToken = tokenData.refresh_token;
      this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000);
      
      this.saveTokensToStorage();
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
          client_id: LINKEDIN_CONFIG.CLIENT_ID,
          client_secret: LINKEDIN_CONFIG.CLIENT_SECRET,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh access token');
      }

      const tokenData = await response.json();
      
      this.accessToken = tokenData.access_token;
      this.refreshToken = tokenData.refresh_token || this.refreshToken;
      this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000);
      
      this.saveTokensToStorage();
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  }

  /**
   * Make authenticated API request
   */
  private async makeApiRequest(url: string, options: RequestInit = {}): Promise<Response> {
    if (!this.isTokenValid()) {
      if (this.refreshToken) {
        await this.refreshAccessToken();
      } else {
        throw new Error('Authentication required');
      }
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'LinkedIn-Version': '202309',
        'X-Restli-Protocol-Version': '2.0.0',
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token might be expired, try to refresh
      if (this.refreshToken) {
        await this.refreshAccessToken();
        return this.makeApiRequest(url, options);
      } else {
        throw new Error('Authentication expired');
      }
    }

    return response;
  }

  /**
   * Get current user's LinkedIn profile
   */
  async getUserProfile(): Promise<LinkedInProfile> {
    try {
      const response = await this.makeApiRequest(
        `${LINKEDIN_CONFIG.API_BASE_URL}/people/~:(id,firstName,lastName,profilePicture(displayImage~:playableStreams))`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const profile = await response.json();
      
      // Get email address separately
      const emailResponse = await this.makeApiRequest(
        `${LINKEDIN_CONFIG.API_BASE_URL}/emailAddress?q=members&projection=(elements*(handle~))`
      );
      
      if (emailResponse.ok) {
        const emailData = await emailResponse.json();
        profile.emailAddress = emailData.elements?.[0]?.['handle~']?.emailAddress;
      }

      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  /**
   * Search and import jobs from LinkedIn
   */
  async searchJobs(settings: JobImportSettings = {}): Promise<LinkedInJob[]> {
    try {
      const params = new URLSearchParams();
      
      // Build search parameters
      if (settings.keywords?.length) {
        params.append('keywords', settings.keywords.join(','));
      }
      
      if (settings.locations?.length) {
        params.append('locationId', settings.locations.join(','));
      }
      
      if (settings.companies?.length) {
        params.append('companyId', settings.companies.join(','));
      }
      
      if (settings.jobTypes?.length) {
        params.append('jobType', settings.jobTypes.join(','));
      }
      
      if (settings.experienceLevels?.length) {
        params.append('experienceLevel', settings.experienceLevels.join(','));
      }
      
      if (settings.salaryMin) {
        params.append('salaryMin', settings.salaryMin.toString());
      }
      
      if (settings.salaryMax) {
        params.append('salaryMax', settings.salaryMax.toString());
      }
      
      if (settings.remoteOnly) {
        params.append('remoteAllowed', 'true');
      }
      
      if (settings.datePosted) {
        params.append('datePosted', settings.datePosted);
      }
      
      params.append('count', (settings.limit || 50).toString());

      const url = `${LINKEDIN_CONFIG.JOBS_API_URL}?${params.toString()}`;
      
      const response = await this.makeApiRequest(url);

      if (!response.ok) {
        throw new Error('Failed to search jobs');
      }

      const jobsData = await response.json();
      return jobsData.elements || [];
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  }

  /**
   * Get job details by ID
   */
  async getJobById(jobId: string): Promise<LinkedInJob> {
    try {
      const response = await this.makeApiRequest(
        `${LINKEDIN_CONFIG.JOBS_API_URL}/${jobId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw error;
    }
  }

  /**
   * Apply to a job through LinkedIn
   */
  async applyToJob(
    jobId: string, 
    applicationData: {
      resumeUrl?: string;
      coverLetter?: string;
      answers?: Array<{ question: string; answer: string }>;
    }
  ): Promise<LinkedInApplication> {
    try {
      const applicationPayload = {
        job: jobId,
        candidate: 'urn:li:person:me',
        resumeUrl: applicationData.resumeUrl,
        coverLetter: applicationData.coverLetter,
        answers: applicationData.answers,
        appliedAt: Date.now()
      };

      const response = await this.makeApiRequest(
        LINKEDIN_CONFIG.APPLY_API_URL,
        {
          method: 'POST',
          body: JSON.stringify(applicationPayload)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit job application');
      }

      return await response.json();
    } catch (error) {
      console.error('Error applying to job:', error);
      throw error;
    }
  }

  /**
   * Get user's job applications
   */
  async getUserApplications(): Promise<LinkedInApplication[]> {
    try {
      const response = await this.makeApiRequest(
        `${LINKEDIN_CONFIG.APPLY_API_URL}?q=applicant&applicant=urn:li:person:me`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const applicationsData = await response.json();
      return applicationsData.elements || [];
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  /**
   * Convert LinkedIn job to internal Job format
   */
  convertLinkedInJobToInternalFormat(linkedInJob: LinkedInJob): Job {
    const experienceLevelMap: Record<string, string> = {
      'INTERNSHIP': 'entry',
      'ENTRY_LEVEL': 'entry',
      'ASSOCIATE': 'junior',
      'MID_SENIOR_LEVEL': 'mid',
      'DIRECTOR': 'senior',
      'EXECUTIVE': 'senior'
    };

    const jobTypeMap: Record<string, Job['type']> = {
      'FULL_TIME': 'full-time',
      'PART_TIME': 'part-time',
      'CONTRACT': 'contract',
      'TEMPORARY': 'contract',
      'INTERNSHIP': 'internship',
      'VOLUNTEER': 'part-time',
      'OTHER': 'contract'
    };

    return {
      id: linkedInJob.id,
      title: linkedInJob.title,
      company: linkedInJob.company.name,
      type: jobTypeMap[linkedInJob.employmentType] || 'full-time',
      location: [
        linkedInJob.location.city,
        linkedInJob.location.region,
        linkedInJob.location.country
      ].filter(Boolean).join(', '),
      salary: linkedInJob.salaryRange ? 
        `$${linkedInJob.salaryRange.min?.toLocaleString()} - $${linkedInJob.salaryRange.max?.toLocaleString()}` : 
        undefined,
      description: linkedInJob.description,
      requirements: linkedInJob.skills || [],
      skills: linkedInJob.skills || [],
      posted_date: new Date(linkedInJob.postedAt).toISOString(),
      deadline: linkedInJob.expiresAt ? new Date(linkedInJob.expiresAt).toISOString() : undefined,
      status: 'active' as const,
      employer_id: linkedInJob.company.id,
      created_at: new Date(linkedInJob.postedAt).toISOString(),
      updated_at: new Date().toISOString(),
      experience_level: experienceLevelMap[linkedInJob.experienceLevel] || 'entry',
      // Additional LinkedIn-specific fields
      linkedin_job_id: linkedInJob.id,
      linkedin_company_id: linkedInJob.company.id,
      linkedin_application_url: linkedInJob.applicationUrl,
      linkedin_easy_apply: linkedInJob.easyApplyEnabled,
      remote_allowed: linkedInJob.workRemoteAllowed,
      job_functions: linkedInJob.jobFunction,
      industries: linkedInJob.industries
    };
  }

  /**
   * Bulk import jobs and save to platform
   */
  async importJobs(
    settings: JobImportSettings,
    onProgress?: (imported: number, total: number) => void
  ): Promise<Job[]> {
    try {
      const linkedInJobs = await this.searchJobs(settings);
      const importedJobs: Job[] = [];

      for (let i = 0; i < linkedInJobs.length; i++) {
        const linkedInJob = linkedInJobs[i];
        
        try {
          // Convert to internal format
          const job = this.convertLinkedInJobToInternalFormat(linkedInJob);
          
          // Save to your platform's database
          const savedJob = await this.saveJobToPlatform(job);
          importedJobs.push(savedJob);
          
          // Report progress
          onProgress?.(i + 1, linkedInJobs.length);
        } catch (error) {
          console.error(`Error importing job ${linkedInJob.id}:`, error);
        }
      }

      return importedJobs;
    } catch (error) {
      console.error('Error importing jobs:', error);
      throw error;
    }
  }

  /**
   * Save job to platform database (implement based on your backend)
   */
  private async saveJobToPlatform(job: Job): Promise<Job> {
    try {
      // This would integrate with your existing job posting API
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}` // Your platform's auth
        },
        body: JSON.stringify(job)
      });

      if (!response.ok) {
        throw new Error('Failed to save job to platform');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving job to platform:', error);
      throw error;
    }
  }

  /**
   * Get platform auth token (implement based on your auth system)
   */
  private getAuthToken(): string {
    // Return your platform's authentication token
    return localStorage.getItem('auth_token') || '';
  }

  /**
   * Check if user is authenticated with LinkedIn
   */
  isAuthenticated(): boolean {
    return this.isTokenValid();
  }

  /**
   * Logout from LinkedIn
   */
  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    localStorage.removeItem('linkedin_tokens');
  }
}

// Export singleton instance
export const linkedInService = new LinkedInService();

// Utility functions for LinkedIn integration
export const LinkedInUtils = {
  /**
   * Format LinkedIn profile for display
   */
  formatProfileName(profile: LinkedInProfile): string {
    const firstName = profile.firstName.localized[profile.firstName.preferredLocale.language] || 
                     Object.values(profile.firstName.localized)[0] || '';
    const lastName = profile.lastName.localized[profile.lastName.preferredLocale.language] || 
                    Object.values(profile.lastName.localized)[0] || '';
    return `${firstName} ${lastName}`.trim();
  },

  /**
   * Get profile picture URL
   */
  getProfilePictureUrl(profile: LinkedInProfile): string | null {
    if (profile.profilePicture?.['displayImage~']?.elements?.length > 0) {
      const elements = profile.profilePicture['displayImage~'].elements;
      return elements[elements.length - 1].identifiers[0].identifier;
    }
    return null;
  },

  /**
   * Format job location
   */
  formatJobLocation(job: LinkedInJob): string {
    return [job.location.city, job.location.region, job.location.country]
      .filter(Boolean)
      .join(', ');
  },

  /**
   * Check if job allows remote work
   */
  isRemoteJob(job: LinkedInJob): boolean {
    return job.workRemoteAllowed === true;
  },

  /**
   * Format salary range
   */
  formatSalaryRange(job: LinkedInJob): string | null {
    if (!job.salaryRange?.min && !job.salaryRange?.max) return null;
    
    const currency = job.salaryRange.currency || 'USD';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    if (job.salaryRange.min && job.salaryRange.max) {
      return `${formatter.format(job.salaryRange.min)} - ${formatter.format(job.salaryRange.max)}`;
    } else if (job.salaryRange.min) {
      return `${formatter.format(job.salaryRange.min)}+`;
    } else if (job.salaryRange.max) {
      return `Up to ${formatter.format(job.salaryRange.max)}`;
    }

    return null;
  }
};