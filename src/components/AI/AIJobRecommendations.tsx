import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  Target,
  MapPin,
  Briefcase,
  Clock,
  Users,
  Star,
  Bookmark,
  Share2,
  Eye,
  ChevronRight,
  Brain,
  Zap,
  Filter,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import PageLayout from '../ui/PageLayout';
import { cn } from '../../lib/cva';
import { 
  aiJobMatchingEngine, 
  UserProfile, 
  JobRecommendation, 
  TrendingJobInsight,
  JobInteraction 
} from '../../lib/ai-job-matching';
import { Job } from '../../types';

export default function AIJobRecommendations() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [trendingInsights, setTrendingInsights] = useState<TrendingJobInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    recommendation_type: 'all',
    min_match_score: 0.5,
    job_type: 'all'
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      loadRecommendations();
      loadTrendingInsights();
    }
  }, [user]);

  const loadRecommendations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Create user profile from current user data
      const profile: UserProfile = createUserProfile(user);
      setUserProfile(profile);
      
      // Get available jobs (in a real app, this would fetch from your API)
      const availableJobs = await getMockJobs();
      
      // Get AI recommendations
      const recs = await aiJobMatchingEngine.getJobRecommendations(profile, availableJobs, 20);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingInsights = async () => {
    try {
      const insights = await aiJobMatchingEngine.getTrendingJobInsights();
      setTrendingInsights(insights);
    } catch (error) {
      console.error('Error loading trending insights:', error);
    }
  };

  const createUserProfile = (userData: any): UserProfile => {
    return {
      id: userData.id,
      skills: userData.skills || ['JavaScript', 'React', 'Node.js'],
      experience_level: userData.experience_level || 'entry',
      preferred_locations: ['Auckland, NZ', 'Wellington, NZ', 'Remote'],
      preferred_job_types: ['full-time', 'internship'],
      salary_range: { min: 50000, max: 100000 },
      industries: ['technology', 'software'],
      education_level: userData.education_level || 'bachelor',
      career_interests: ['software development', 'web development', 'mobile development'],
      work_preferences: {
        remote: true,
        hybrid: true,
        on_site: false
      },
      career_stage: userData.career_stage || 'student',
      resume_keywords: [],
      viewed_jobs: [],
      applied_jobs: [],
      saved_jobs: [],
      interaction_history: []
    };
  };

  const getMockJobs = async (): Promise<Job[]> => {
    // Mock job data - in a real app, this would come from your API
    return [
      {
        id: '1',
        title: 'Frontend React Developer',
        company: 'TechCorp NZ',
        type: 'full-time',
        location: 'Auckland, NZ',
        salary: '$70,000 - $90,000',
        description: 'Join our dynamic team building next-generation web applications using React, TypeScript, and modern development practices.',
        requirements: ['React', 'JavaScript', 'TypeScript', 'CSS'],
        skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'Node.js'],
        posted_date: new Date().toISOString(),
        status: 'active',
        employer_id: '1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        experience_level: 'entry'
      },
      {
        id: '2',
        title: 'Machine Learning Engineer',
        company: 'AI Innovations Ltd',
        type: 'full-time',
        location: 'Wellington, NZ',
        salary: '$90,000 - $120,000',
        description: 'Work on cutting-edge AI projects using Python, TensorFlow, and cloud technologies.',
        requirements: ['Python', 'Machine Learning', 'TensorFlow', 'Data Science'],
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Science', 'AWS'],
        posted_date: new Date().toISOString(),
        status: 'active',
        employer_id: '2',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        experience_level: 'mid'
      },
      {
        id: '3',
        title: 'Software Engineering Intern',
        company: 'StartupHub',
        type: 'internship',
        location: 'Remote',
        salary: '$25/hour',
        description: 'Great opportunity to learn and grow in a fast-paced startup environment.',
        requirements: ['Programming', 'Problem Solving', 'Learning Mindset'],
        skills: ['JavaScript', 'Python', 'Git', 'Agile'],
        posted_date: new Date().toISOString(),
        status: 'active',
        employer_id: '3',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        experience_level: 'entry'
      }
    ];
  };

  const handleJobInteraction = async (job: Job, action: JobInteraction['action'], timeSpent: number = 0) => {
    if (!user || !userProfile) return;
    
    const interaction: JobInteraction = {
      job_id: job.id,
      action,
      timestamp: new Date(),
      time_spent: timeSpent,
      source: 'ai_recommendations'
    };
    
    // Update AI engine with user interaction
    await aiJobMatchingEngine.updateUserProfileFromInteraction(user.id, interaction, job);
    
    // Update local state if needed
    if (action === 'apply') {
      setUserProfile(prev => prev ? {
        ...prev,
        applied_jobs: [...prev.applied_jobs, job.id]
      } : null);
    } else if (action === 'save') {
      setUserProfile(prev => prev ? {
        ...prev,
        saved_jobs: [...prev.saved_jobs, job.id]
      } : null);
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (selectedFilters.recommendation_type !== 'all' && 
        rec.recommendation_type !== selectedFilters.recommendation_type) {
      return false;
    }
    if (rec.match_score < selectedFilters.min_match_score) {
      return false;
    }
    if (selectedFilters.job_type !== 'all' && 
        rec.job.type !== selectedFilters.job_type) {
      return false;
    }
    return true;
  });

  const getRecommendationTypeIcon = (type: string) => {
    switch (type) {
      case 'skills_match': return <Target className="h-4 w-4" />;
      case 'experience_match': return <Star className="h-4 w-4" />;
      case 'location_match': return <MapPin className="h-4 w-4" />;
      case 'trending': return <TrendingUp className="h-4 w-4" />;
      default: return <Briefcase className="h-4 w-4" />;
    }
  };

  const getRecommendationTypeColor = (type: string) => {
    switch (type) {
      case 'skills_match': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'experience_match': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'location_match': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'trending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'} maxWidth="4xl">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center space-y-4">
            <Brain className="h-12 w-12 animate-pulse mx-auto text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold">AI is analyzing your profile...</h3>
              <p className="text-gray-600 dark:text-gray-400">Finding the perfect job matches for you</p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'} maxWidth="full" padding="none">
      {/* Header */}
      <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${
        isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Job Recommendations</h1>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Personalized matches based on your skills and preferences
                </p>
              </div>
            </div>
            <Button
              onClick={loadRecommendations}
              variant="outlined"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Insights */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-semibold">Trending Skills</h2>
              </div>
              <div className="space-y-4">
                {trendingInsights.slice(0, 4).map((insight, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{insight.skill}</span>
                      <span className="text-xs text-green-600 font-medium">
                        +{insight.demand_growth}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>{insight.job_count} jobs</span>
                      <span>${(insight.average_salary / 1000).toFixed(0)}k avg</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-orange-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, insight.demand_growth * 2)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Filters */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Recommendation Type</label>
                  <select
                    value={selectedFilters.recommendation_type}
                    onChange={(e) => setSelectedFilters(prev => ({
                      ...prev,
                      recommendation_type: e.target.value
                    }))}
                    className={cn(
                      'w-full p-2 rounded-lg border',
                      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                    )}
                  >
                    <option value="all">All Types</option>
                    <option value="skills_match">Skills Match</option>
                    <option value="experience_match">Experience Match</option>
                    <option value="location_match">Location Match</option>
                    <option value="trending">Trending</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Min Match Score: {(selectedFilters.min_match_score * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={selectedFilters.min_match_score}
                    onChange={(e) => setSelectedFilters(prev => ({
                      ...prev,
                      min_match_score: parseFloat(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Job Type</label>
                  <select
                    value={selectedFilters.job_type}
                    onChange={(e) => setSelectedFilters(prev => ({
                      ...prev,
                      job_type: e.target.value
                    }))}
                    className={cn(
                      'w-full p-2 rounded-lg border',
                      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                    )}
                  >
                    <option value="all">All Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="internship">Internship</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Matches</p>
                    <p className="text-2xl font-bold text-blue-600">{recommendations.length}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-blue-500" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Match Score</p>
                    <p className="text-2xl font-bold text-green-600">
                      {recommendations.length > 0 
                        ? `${(recommendations.reduce((sum, r) => sum + r.match_score, 0) / recommendations.length * 100).toFixed(0)}%`
                        : '0%'
                      }
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">High Matches</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {recommendations.filter(r => r.match_score > 0.8).length}
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-purple-500" />
                </div>
              </Card>
            </div>

            {/* Job Recommendations */}
            <div className="space-y-4">
              {filteredRecommendations.length === 0 ? (
                <Card className="p-12 text-center">
                  <Brain className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No matches found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Try adjusting your filters or update your profile for better recommendations
                  </p>
                  <Button onClick={loadRecommendations} className="flex items-center space-x-2 mx-auto">
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh Recommendations</span>
                  </Button>
                </Card>
              ) : (
                filteredRecommendations.map((recommendation) => (
                  <JobRecommendationCard
                    key={recommendation.job.id}
                    recommendation={recommendation}
                    onInteraction={handleJobInteraction}
                    isDark={isDark}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

// Job Recommendation Card Component
const JobRecommendationCard: React.FC<{
  recommendation: JobRecommendation;
  onInteraction: (job: Job, action: JobInteraction['action'], timeSpent?: number) => void;
  isDark: boolean;
}> = ({ recommendation, onInteraction, isDark }) => {
  const { job, match_score, match_reasons, recommendation_type, personalization_factors } = recommendation;
  const [startTime] = useState(Date.now());

  const handleCardClick = () => {
    const timeSpent = (Date.now() - startTime) / 1000;
    onInteraction(job, 'view', timeSpent);
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    onInteraction(job, 'apply');
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onInteraction(job, 'save');
  };

  const getRecommendationTypeIcon = (type: string) => {
    switch (type) {
      case 'skills_match': return <Target className="h-4 w-4" />;
      case 'experience_match': return <Star className="h-4 w-4" />;
      case 'location_match': return <MapPin className="h-4 w-4" />;
      case 'trending': return <TrendingUp className="h-4 w-4" />;
      default: return <Briefcase className="h-4 w-4" />;
    }
  };

  const getRecommendationTypeColor = (type: string) => {
    switch (type) {
      case 'skills_match': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'experience_match': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'location_match': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'trending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <Card 
      className={cn(
        'p-6 transition-all duration-200 cursor-pointer hover:shadow-lg border-l-4',
        match_score > 0.8 ? 'border-l-green-500' : 
        match_score > 0.6 ? 'border-l-blue-500' : 'border-l-gray-400'
      )}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <Link 
              to={`/jobs/${job.id}`}
              className="text-xl font-bold hover:text-blue-600 dark:hover:text-blue-400"
              onClick={(e) => e.stopPropagation()}
            >
              {job.title}
            </Link>
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1',
              getRecommendationTypeColor(recommendation_type)
            )}>
              {getRecommendationTypeIcon(recommendation_type)}
              <span>{recommendation_type.replace('_', ' ')}</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <span className="font-medium">{job.company}</span>
            <span className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Briefcase className="h-4 w-4" />
              <span>{job.type}</span>
            </span>
            {job.salary && (
              <span className="text-green-600 font-medium">{job.salary}</span>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {(match_score * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500">Match Score</div>
        </div>
      </div>

      {/* Match Reasons */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {match_reasons.slice(0, 3).map((reason, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs"
            >
              {reason}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
        {job.description}
      </p>

      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {job.skills?.slice(0, 6).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
            >
              {skill}
            </span>
          ))}
          {job.skills && job.skills.length > 6 && (
            <span className="px-2 py-1 text-gray-500 text-xs">
              +{job.skills.length - 6} more
            </span>
          )}
        </div>
      </div>

      {/* Personalization Factors */}
      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">
            {(personalization_factors.skills_alignment * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Skills</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">
            {(personalization_factors.experience_fit * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Experience</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600">
            {(personalization_factors.location_preference * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Location</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4" />
          <span>Posted {new Date(job.posted_date).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="p-2"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outlined"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            View Details
          </Button>
          
          <Button
            size="sm"
            onClick={handleApply}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </Card>
  );
};