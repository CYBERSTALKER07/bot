import { Job } from '../types';

export interface UserProfile {
  id: string;
  skills: string[];
  experience_level: string;
  preferred_locations: string[];
  preferred_job_types: ('full-time' | 'part-time' | 'internship' | 'contract')[];
  salary_range: { min: number; max: number };
  industries: string[];
  education_level: string;
  career_interests: string[];
  work_preferences: {
    remote: boolean;
    hybrid: boolean;
    on_site: boolean;
  };
  career_stage: 'student' | 'new_grad' | 'experienced' | 'senior';
  resume_keywords: string[];
  viewed_jobs: string[];
  applied_jobs: string[];
  saved_jobs: string[];
  interaction_history: JobInteraction[];
}

export interface JobInteraction {
  job_id: string;
  action: 'view' | 'save' | 'apply' | 'share' | 'skip';
  timestamp: Date;
  time_spent: number; // seconds
  source: string;
}

export interface JobRecommendation {
  job: Job;
  match_score: number;
  match_reasons: string[];
  recommendation_type: 'skills_match' | 'experience_match' | 'location_match' | 'industry_match' | 'trending' | 'similar_users';
  confidence_score: number;
  personalization_factors: {
    skills_alignment: number;
    experience_fit: number;
    location_preference: number;
    salary_match: number;
    industry_interest: number;
    career_progression: number;
  };
}

export interface TrendingJobInsight {
  skill: string;
  demand_growth: number;
  average_salary: number;
  job_count: number;
  trending_companies: string[];
}

class AIJobMatchingEngine {
  private skillsDatabase: Map<string, string[]> = new Map();
  private jobTrends: Map<string, TrendingJobInsight> = new Map();
  
  constructor() {
    this.initializeSkillsDatabase();
    this.initializeJobTrends();
  }

  /**
   * Get personalized job recommendations for a user
   */
  async getJobRecommendations(
    userProfile: UserProfile,
    availableJobs: Job[],
    limit: number = 20
  ): Promise<JobRecommendation[]> {
    const recommendations: JobRecommendation[] = [];
    
    for (const job of availableJobs) {
      // Skip already applied/viewed jobs based on user preference
      if (userProfile.applied_jobs.includes(job.id)) continue;
      
      const matchScore = this.calculateMatchScore(userProfile, job);
      const matchReasons = this.generateMatchReasons(userProfile, job);
      const recommendationType = this.determineRecommendationType(userProfile, job);
      const confidenceScore = this.calculateConfidenceScore(userProfile, job);
      const personalizationFactors = this.calculatePersonalizationFactors(userProfile, job);
      
      if (matchScore > 0.3) { // Minimum threshold
        recommendations.push({
          job,
          match_score: matchScore,
          match_reasons: matchReasons,
          recommendation_type: recommendationType,
          confidence_score: confidenceScore,
          personalization_factors: personalizationFactors
        });
      }
    }
    
    // Sort by match score and apply diversity
    return this.diversifyRecommendations(recommendations)
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, limit);
  }

  /**
   * Calculate overall match score between user and job
   */
  private calculateMatchScore(user: UserProfile, job: Job): number {
    const weights = {
      skills: 0.3,
      experience: 0.25,
      location: 0.15,
      job_type: 0.1,
      salary: 0.1,
      industry: 0.1
    };

    const skillsScore = this.calculateSkillsMatch(user.skills, job.skills || []);
    const experienceScore = this.calculateExperienceMatch(user.experience_level, job.experience_level || 'entry');
    const locationScore = this.calculateLocationMatch(user.preferred_locations, job.location);
    const jobTypeScore = user.preferred_job_types.includes(job.type) ? 1 : 0.5;
    const salaryScore = this.calculateSalaryMatch(user.salary_range, job.salary);
    const industryScore = this.calculateIndustryMatch(user.industries, job.title, job.description);

    return (
      skillsScore * weights.skills +
      experienceScore * weights.experience +
      locationScore * weights.location +
      jobTypeScore * weights.job_type +
      salaryScore * weights.salary +
      industryScore * weights.industry
    );
  }

  /**
   * Calculate skills matching score using semantic similarity
   */
  private calculateSkillsMatch(userSkills: string[], jobSkills: string[]): number {
    if (jobSkills.length === 0) return 0.5; // Neutral score if no skills specified
    
    let totalMatch = 0;
    let skillsChecked = 0;
    
    for (const jobSkill of jobSkills) {
      const normalizedJobSkill = jobSkill.toLowerCase().trim();
      let bestMatch = 0;
      
      for (const userSkill of userSkills) {
        const normalizedUserSkill = userSkill.toLowerCase().trim();
        
        // Exact match
        if (normalizedJobSkill === normalizedUserSkill) {
          bestMatch = 1;
          break;
        }
        
        // Partial match
        if (normalizedJobSkill.includes(normalizedUserSkill) || 
            normalizedUserSkill.includes(normalizedJobSkill)) {
          bestMatch = Math.max(bestMatch, 0.8);
        }
        
        // Semantic similarity (simplified)
        const similarity = this.calculateSemanticSimilarity(normalizedJobSkill, normalizedUserSkill);
        bestMatch = Math.max(bestMatch, similarity);
      }
      
      totalMatch += bestMatch;
      skillsChecked++;
    }
    
    return skillsChecked > 0 ? totalMatch / skillsChecked : 0;
  }

  /**
   * Calculate semantic similarity between skills
   */
  private calculateSemanticSimilarity(skill1: string, skill2: string): number {
    // Simplified semantic matching - in production, use ML models
    const skillSynonyms: Record<string, string[]> = {
      'javascript': ['js', 'ecmascript', 'node.js', 'nodejs'],
      'python': ['py', 'django', 'flask', 'pandas'],
      'react': ['reactjs', 'react.js', 'jsx'],
      'typescript': ['ts'],
      'machine learning': ['ml', 'artificial intelligence', 'ai', 'deep learning'],
      'data science': ['data analysis', 'analytics', 'statistics'],
      'ui/ux': ['user experience', 'user interface', 'design', 'figma'],
      'project management': ['pm', 'scrum', 'agile', 'kanban']
    };
    
    for (const [key, synonyms] of Object.entries(skillSynonyms)) {
      if ((key === skill1 && synonyms.includes(skill2)) ||
          (key === skill2 && synonyms.includes(skill1)) ||
          (synonyms.includes(skill1) && synonyms.includes(skill2))) {
        return 0.9;
      }
    }
    
    // Basic string similarity
    const similarity = this.calculateStringSimilarity(skill1, skill2);
    return similarity > 0.7 ? similarity * 0.6 : 0;
  }

  /**
   * Calculate string similarity using Levenshtein distance
   */
  private calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * Calculate experience level match
   */
  private calculateExperienceMatch(userLevel: string, jobLevel: string): number {
    const experienceLevels = ['entry', 'junior', 'mid', 'senior', 'executive'];
    const userIndex = experienceLevels.indexOf(userLevel);
    const jobIndex = experienceLevels.indexOf(jobLevel);
    
    if (userIndex === -1 || jobIndex === -1) return 0.5;
    
    const difference = Math.abs(userIndex - jobIndex);
    if (difference === 0) return 1;
    if (difference === 1) return 0.8;
    if (difference === 2) return 0.5;
    return 0.2;
  }

  /**
   * Calculate location preference match
   */
  private calculateLocationMatch(preferredLocations: string[], jobLocation: string): number {
    if (preferredLocations.length === 0) return 0.5; // Neutral if no preference
    
    const jobLocationLower = jobLocation.toLowerCase();
    
    for (const location of preferredLocations) {
      const locationLower = location.toLowerCase();
      if (jobLocationLower.includes(locationLower) || locationLower.includes(jobLocationLower)) {
        return 1;
      }
    }
    
    // Check for remote work
    if (jobLocationLower.includes('remote') && preferredLocations.some(loc => 
        loc.toLowerCase().includes('remote'))) {
      return 1;
    }
    
    return 0.2;
  }

  /**
   * Calculate salary range match
   */
  private calculateSalaryMatch(userRange: { min: number; max: number }, jobSalary?: string): number {
    if (!jobSalary) return 0.5; // Neutral if no salary info
    
    const salaryNumbers = jobSalary.match(/\d+,?\d*/g);
    if (!salaryNumbers || salaryNumbers.length === 0) return 0.5;
    
    const salaryValues = salaryNumbers.map(s => parseInt(s.replace(',', '')));
    const jobMin = Math.min(...salaryValues);
    const jobMax = Math.max(...salaryValues);
    
    // Check overlap
    if (jobMax < userRange.min || jobMin > userRange.max) return 0.1;
    
    const overlapStart = Math.max(jobMin, userRange.min);
    const overlapEnd = Math.min(jobMax, userRange.max);
    const overlapSize = overlapEnd - overlapStart;
    const userRangeSize = userRange.max - userRange.min;
    
    return Math.min(1, overlapSize / userRangeSize);
  }

  /**
   * Calculate industry interest match
   */
  private calculateIndustryMatch(userIndustries: string[], jobTitle: string, jobDescription: string): number {
    if (userIndustries.length === 0) return 0.5;
    
    const jobText = (jobTitle + ' ' + jobDescription).toLowerCase();
    
    let bestMatch = 0;
    for (const industry of userIndustries) {
      const industryLower = industry.toLowerCase();
      if (jobText.includes(industryLower)) {
        bestMatch = Math.max(bestMatch, 1);
      } else {
        // Check for related terms
        const relatedTerms = this.getIndustryRelatedTerms(industryLower);
        for (const term of relatedTerms) {
          if (jobText.includes(term)) {
            bestMatch = Math.max(bestMatch, 0.7);
          }
        }
      }
    }
    
    return bestMatch;
  }

  /**
   * Generate human-readable match reasons
   */
  private generateMatchReasons(user: UserProfile, job: Job): string[] {
    const reasons: string[] = [];
    
    // Skills match
    const matchingSkills = job.skills?.filter(jobSkill => 
      user.skills.some(userSkill => 
        userSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(userSkill.toLowerCase())
      )
    ) || [];
    
    if (matchingSkills.length > 0) {
      reasons.push(`Strong match for your ${matchingSkills.slice(0, 3).join(', ')} skills`);
    }
    
    // Experience level
    if (user.experience_level === job.experience_level) {
      reasons.push(`Perfect fit for your ${user.experience_level} experience level`);
    }
    
    // Location
    if (user.preferred_locations.some(loc => 
        job.location.toLowerCase().includes(loc.toLowerCase()))) {
      reasons.push(`Located in your preferred area: ${job.location}`);
    }
    
    // Job type
    if (user.preferred_job_types.includes(job.type)) {
      reasons.push(`Matches your ${job.type} preference`);
    }
    
    // Company size or industry
    if (user.industries.some(industry => 
        job.title.toLowerCase().includes(industry.toLowerCase()) ||
        job.description.toLowerCase().includes(industry.toLowerCase()))) {
      reasons.push(`Aligns with your interest in the industry`);
    }
    
    // Trending opportunity
    if (this.isJobTrending(job)) {
      reasons.push('High-demand role with growing opportunities');
    }
    
    return reasons;
  }

  /**
   * Determine recommendation type
   */
  private determineRecommendationType(user: UserProfile, job: Job): JobRecommendation['recommendation_type'] {
    const skillsMatch = this.calculateSkillsMatch(user.skills, job.skills || []);
    const experienceMatch = this.calculateExperienceMatch(user.experience_level, job.experience_level || 'entry');
    
    if (skillsMatch > 0.8) return 'skills_match';
    if (experienceMatch > 0.8) return 'experience_match';
    if (user.preferred_locations.some(loc => job.location.toLowerCase().includes(loc.toLowerCase()))) {
      return 'location_match';
    }
    if (this.isJobTrending(job)) return 'trending';
    
    return 'industry_match';
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidenceScore(user: UserProfile, job: Job): number {
    const factors = [
      user.skills.length > 3 ? 0.2 : 0.1,
      user.interaction_history.length > 10 ? 0.3 : 0.15,
      user.preferred_locations.length > 0 ? 0.2 : 0.1,
      job.skills && job.skills.length > 2 ? 0.3 : 0.15
    ];
    
    return Math.min(1, factors.reduce((sum, factor) => sum + factor, 0));
  }

  /**
   * Calculate personalization factors
   */
  private calculatePersonalizationFactors(user: UserProfile, job: Job) {
    return {
      skills_alignment: this.calculateSkillsMatch(user.skills, job.skills || []),
      experience_fit: this.calculateExperienceMatch(user.experience_level, job.experience_level || 'entry'),
      location_preference: this.calculateLocationMatch(user.preferred_locations, job.location),
      salary_match: this.calculateSalaryMatch(user.salary_range, job.salary),
      industry_interest: this.calculateIndustryMatch(user.industries, job.title, job.description),
      career_progression: this.calculateCareerProgression(user, job)
    };
  }

  /**
   * Calculate career progression score
   */
  private calculateCareerProgression(user: UserProfile, job: Job): number {
    const currentLevel = user.experience_level;
    const jobLevel = job.experience_level || 'entry';
    
    const progressionMap: Record<string, string[]> = {
      'student': ['entry', 'junior'],
      'entry': ['entry', 'junior', 'mid'],
      'junior': ['junior', 'mid', 'senior'],
      'mid': ['mid', 'senior'],
      'senior': ['senior', 'executive']
    };
    
    const validProgressions = progressionMap[currentLevel] || [];
    return validProgressions.includes(jobLevel) ? 1 : 0.3;
  }

  /**
   * Diversify recommendations to avoid too much similarity
   */
  private diversifyRecommendations(recommendations: JobRecommendation[]): JobRecommendation[] {
    const diversified: JobRecommendation[] = [];
    const companySeen = new Set<string>();
    const typeSeen = new Set<string>();
    
    // First pass: high-scoring diverse recommendations
    for (const rec of recommendations) {
      if (rec.match_score > 0.7 && 
          !companySeen.has(rec.job.company) && 
          diversified.length < 10) {
        diversified.push(rec);
        companySeen.add(rec.job.company);
        typeSeen.add(rec.job.type);
      }
    }
    
    // Second pass: fill remaining slots
    for (const rec of recommendations) {
      if (!diversified.includes(rec) && diversified.length < 20) {
        diversified.push(rec);
      }
    }
    
    return diversified;
  }

  /**
   * Get trending job insights
   */
  async getTrendingJobInsights(): Promise<TrendingJobInsight[]> {
    return Array.from(this.jobTrends.values())
      .sort((a, b) => b.demand_growth - a.demand_growth)
      .slice(0, 10);
  }

  /**
   * Update user profile based on interactions
   */
  async updateUserProfileFromInteraction(
    userId: string, 
    interaction: JobInteraction,
    job: Job
  ): Promise<void> {
    // In a real implementation, this would update the database
    // Here we simulate learning from user behavior
    
    if (interaction.action === 'apply' || interaction.action === 'save') {
      // Positive signal - boost similar job recommendations
      console.log(`User ${userId} showed interest in ${job.title} at ${job.company}`);
    } else if (interaction.action === 'skip' && interaction.time_spent < 5) {
      // Negative signal - reduce weight for similar jobs
      console.log(`User ${userId} quickly skipped ${job.title} - reduce similar recommendations`);
    }
  }

  /**
   * Initialize skills database with related skills
   */
  private initializeSkillsDatabase(): void {
    const skillRelations = {
      'javascript': ['react', 'node.js', 'typescript', 'vue', 'angular'],
      'python': ['django', 'flask', 'pandas', 'numpy', 'machine learning'],
      'react': ['javascript', 'typescript', 'redux', 'next.js'],
      'data science': ['python', 'r', 'sql', 'machine learning', 'statistics'],
      'machine learning': ['python', 'tensorflow', 'pytorch', 'data science'],
      'ui/ux': ['figma', 'sketch', 'adobe xd', 'prototyping', 'user research']
    };
    
    for (const [skill, related] of Object.entries(skillRelations)) {
      this.skillsDatabase.set(skill, related);
    }
  }

  /**
   * Initialize job trends data
   */
  private initializeJobTrends(): void {
    const trends: TrendingJobInsight[] = [
      {
        skill: 'AI/Machine Learning',
        demand_growth: 45,
        average_salary: 120000,
        job_count: 1250,
        trending_companies: ['Google', 'Microsoft', 'OpenAI', 'Anthropic']
      },
      {
        skill: 'React Development',
        demand_growth: 32,
        average_salary: 95000,
        job_count: 2100,
        trending_companies: ['Meta', 'Netflix', 'Airbnb', 'Uber']
      },
      {
        skill: 'Data Science',
        demand_growth: 28,
        average_salary: 110000,
        job_count: 1800,
        trending_companies: ['Amazon', 'Tesla', 'Spotify', 'LinkedIn']
      },
      {
        skill: 'Cybersecurity',
        demand_growth: 38,
        average_salary: 105000,
        job_count: 950,
        trending_companies: ['CrowdStrike', 'Palo Alto Networks', 'Okta']
      }
    ];
    
    trends.forEach(trend => {
      this.jobTrends.set(trend.skill, trend);
    });
  }

  /**
   * Get industry related terms
   */
  private getIndustryRelatedTerms(industry: string): string[] {
    const industryMap: Record<string, string[]> = {
      'technology': ['tech', 'software', 'developer', 'engineer', 'programming'],
      'healthcare': ['medical', 'health', 'clinical', 'patient', 'hospital'],
      'finance': ['financial', 'banking', 'investment', 'trading', 'fintech'],
      'marketing': ['advertising', 'brand', 'campaign', 'digital marketing', 'social media'],
      'education': ['teaching', 'academic', 'learning', 'training', 'curriculum']
    };
    
    return industryMap[industry] || [];
  }

  /**
   * Check if job is trending
   */
  private isJobTrending(job: Job): boolean {
    const trendingKeywords = ['ai', 'machine learning', 'react', 'python', 'data science', 'cybersecurity'];
    const jobText = (job.title + ' ' + job.description).toLowerCase();
    
    return trendingKeywords.some(keyword => jobText.includes(keyword));
  }
}

// Export singleton instance
export const aiJobMatchingEngine = new AIJobMatchingEngine();