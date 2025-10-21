import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  ChevronDown,
  Clock,
  DollarSign,
  Users,
  Eye,
  Bookmark,
  Share2,
  SlidersHorizontal,
  Filter,
  X,
  Grid3X3,
  List
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';
import { Card } from './ui/Card';
import PageLayout from './ui/PageLayout';
import Typography from './ui/Typography';
import Input from './ui/Input';
import Select from './ui/Select';
import { cn } from '../lib/cva';
import { useDebounce } from '../hooks/useDebounce';
import { JobCardSkeleton } from './ui/Skeleton';
import { useJobs } from '../hooks/useOptimizedQuery';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: Date;
  applicationDeadline?: Date;
  isRemote: boolean;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  industry: string;
  companyLogo?: string;
  featured?: boolean;
  applicants?: number;
}

export default function JobsPage() {
  const { isDark } = useTheme();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [experienceFilter, setExperienceFilter] = useState<string>('all');
  const [salaryFilter, setSalaryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Debounce search to reduce operations
  const debouncedSearch = useDebounce(searchTerm, 300);
  const debouncedLocation = useDebounce(locationFilter, 300);

  // Fetch real jobs data
  const { data: jobsData, isLoading: loading, error } = useJobs();

  // Transform to component format
  const jobs: Job[] = jobsData?.map(job => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.type,
    description: job.description || '',
    requirements: job.requirements || [],
    benefits: job.benefits || [],
    salary: job.salary_range || '',
    experienceLevel: job.experience_level || 'entry',
    postedDate: new Date(job.created_at),
    applicants: job.applicants_count || 0,
    isRemote: job.is_remote || false,
    logo: job.company_logo,
    tags: job.tags || [],
    company_id: job.company_id,
    employer_id: job.employer_id,
  })) || [];

  // Filter and search
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         job.company.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         job.description.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    const matchesLocation = !debouncedLocation || 
                           job.location.toLowerCase().includes(debouncedLocation.toLowerCase());
    
    const matchesType = typeFilter === 'all' || job.type === typeFilter;
    const matchesExperience = experienceFilter === 'all' || job.experienceLevel === experienceFilter;
    
    return matchesSearch && matchesLocation && matchesType && matchesExperience;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return b.postedDate.getTime() - a.postedDate.getTime();
    } else if (sortBy === 'salary') {
      return b.salary.localeCompare(a.salary);
    } else if (sortBy === 'applicants') {
      return (b.applicants || 0) - (a.applicants || 0);
    }
    return 0;
  });

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const getJobTypeColor = (type: Job['type']) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'part-time': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'contract': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'internship': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const formatPostedDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Posted today';
    if (diffDays === 2) return 'Posted yesterday';
    return `Posted ${diffDays - 1} days ago`;
  };

  if (loading) {
    return (
      <PageLayout className={cn(
        'min-h-screen',
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      )}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout className={cn(
        'min-h-screen',
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      )}>
        <Card className="p-8 text-center max-w-lg mx-auto mt-8">
          <p className="text-red-600 mb-4">Error loading jobs</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </PageLayout>
    );
  }

  return (
    <div className={cn(
      'min-h-screen w-full',
      isDark ? 'bg-black text-white' : 'bg-white text-black'
    )}>
      {/* Mobile Header - Sticky */}
      <div className={cn(
        'sticky top-0 z-50 backdrop-blur-xl border-b lg:hidden',
        isDark ? 'bg-black/95 border-gray-800' : 'bg-white/95 border-gray-200'
      )}>
        <div className="flex items-center justify-between px-4 py-3 safe-area-inset-top">
          <div>
            <h1 className="text-lg font-bold">Find Jobs</h1>
            <p className={cn(
              'text-sm',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>
              {filteredJobs.length} opportunities
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-3 min-h-[44px] min-w-[44px] relative"
              onClick={() => setShowMobileFilters(true)}
            >
              <SlidersHorizontal className="h-5 w-5" />
              {(searchTerm || locationFilter || typeFilter !== 'all' || experienceFilter !== 'all') && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-3 min-h-[44px] min-w-[44px]"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className={cn(
            'fixed bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-xl',
            isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200',
            'border-t safe-area-inset-bottom'
          )}>
            {/* Mobile Filter Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold">Filters & Search</h2>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 min-h-[44px] min-w-[44px]"
                onClick={() => setShowMobileFilters(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Mobile Search */}
              <div>
                <label className="block text-sm font-medium mb-2">Search Jobs</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Job title, company, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 min-h-[48px]"
                  />
                </div>
              </div>

              {/* Mobile Location */}
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="City, state, or remote"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full pl-10 min-h-[48px]"
                  />
                </div>
              </div>

              {/* Mobile Filters Grid */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Job Type</label>
                  <Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full min-h-[48px]"
                  >
                    <option value="all">All Job Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Experience Level</label>
                  <Select
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                    className="w-full min-h-[48px]"
                  >
                    <option value="all">All Experience Levels</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="executive">Executive</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sort By</label>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full min-h-[48px]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="salary">Salary</option>
                    <option value="applicants">Most Applied</option>
                  </Select>
                </div>
              </div>

              {/* Apply/Clear Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outlined"
                  className="flex-1 min-h-[48px]"
                  onClick={() => {
                    setSearchTerm('');
                    setLocationFilter('');
                    setTypeFilter('all');
                    setExperienceFilter('all');
                    setSalaryFilter('all');
                  }}
                >
                  Clear All
                </Button>
                <Button
                  variant="filled"
                  className="flex-1 min-h-[48px]"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 py-8">
        {/* Desktop Header */}
        <div className="mb-8">
          <Typography variant="h4" className="font-bold mb-2">
            Find Your Dream Job
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Discover {jobs.length} opportunities waiting for you
          </Typography>
        </div>

        {/* Desktop Search and Filters */}
        <Card className="p-6 mb-8">
          {/* Main search section */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2 xl:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search jobs, companies, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full"
            >
              <option value="newest">Newest First</option>
              <option value="salary">Salary</option>
              <option value="applicants">Most Applied</option>
            </Select>
          </div>

          {/* Desktop filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Button
              variant="text"
              size="small"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Advanced Filters</span>
              <ChevronDown className={cn(
                'h-4 w-4 transition-transform duration-200',
                showFilters ? 'rotate-180' : ''
              )} />
            </Button>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredJobs.length} of {jobs.length} jobs
            </div>
          </div>

          {/* Advanced filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full"
              >
                <option value="all">All Job Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </Select>
              
              <Select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="w-full"
              >
                <option value="all">All Experience Levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="executive">Executive</option>
              </Select>
              
              <Select
                value={salaryFilter}
                onChange={(e) => setSalaryFilter(e.target.value)}
                className="w-full sm:col-span-2 lg:col-span-1"
              >
                <option value="all">All Salary Ranges</option>
                <option value="0-50k">$0 - $50k</option>
                <option value="50k-80k">$50k - $80k</option>
                <option value="80k-120k">$80k - $120k</option>
                <option value="120k+">$120k+</option>
              </Select>
            </div>
          )}
        </Card>
      </div>

      {/* Job Listings */}
      <div className={cn(
        'px-4 pb-8 lg:max-w-7xl lg:mx-auto lg:px-6',
        'safe-area-inset-bottom'
      )}>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job) => (
              <JobCardGrid key={job.id} job={job} isDark={isDark} savedJobs={savedJobs} toggleSaveJob={toggleSaveJob} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <JobCardList key={job.id} job={job} isDark={isDark} savedJobs={savedJobs} toggleSaveJob={toggleSaveJob} />
            ))}
          </div>
        )}

        {filteredJobs.length === 0 && (
          <Card className="p-8 text-center">
            <Briefcase className={cn(
              'h-12 w-12 mx-auto mb-4',
              isDark ? 'text-gray-600' : 'text-gray-400'
            )} />
            <Typography variant="h6" className="mb-2">
              No jobs found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Try adjusting your search criteria or filters
            </Typography>
          </Card>
        )}

        {/* Load More */}
        {filteredJobs.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outlined" size="large" className="w-full sm:w-auto min-h-[48px]">
              Load More Jobs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Job Card Components
const JobCardList = ({ job, isDark, savedJobs, toggleSaveJob }: {
  job: Job;
  isDark: boolean;
  savedJobs: Set<string>;
  toggleSaveJob: (id: string) => void;
}) => {
  const formatPostedDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Posted today';
    if (diffDays === 2) return 'Posted yesterday';
    return `Posted ${diffDays - 1} days ago`;
  };

  const getJobTypeColor = (type: Job['type']) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'part-time': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'contract': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'internship': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <Card className={cn(
      'p-4 transition-all duration-200 hover:shadow-lg',
      job.featured && 'ring-2 ring-blue-200 dark:ring-blue-800'
    )}>
      {/* Job Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {job.companyLogo && (
            <img 
              src={job.companyLogo} 
              alt={job.company} 
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <Link 
                to={`/jobs/${job.id}`}
                className="font-semibold text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
              >
                {job.title}
              </Link>
              {job.featured && (
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full flex-shrink-0">
                  Featured
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span className="font-medium">{job.company}</span>
              <span className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{job.location}</span>
              </span>
              {job.isRemote && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
                  Remote
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className={cn(
                'px-2 py-1 rounded text-xs font-medium',
                getJobTypeColor(job.type)
              )}>
                {job.type.charAt(0).toUpperCase() + job.type.slice(1).replace('-', ' ')}
              </span>
              <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                <DollarSign className="h-3 w-3" />
                <span>{job.salary}</span>
              </span>
              <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{formatPostedDate(job.postedDate)}</span>
              </span>
              {job.applicants && (
                <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                  <Users className="h-3 w-3" />
                  <span>{job.applicants} applicants</span>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 min-h-[44px] min-w-[44px]"
            onClick={() => toggleSaveJob(job.id)}
          >
            <Bookmark className={cn(
              'h-4 w-4',
              savedJobs.has(job.id) ? 'fill-current text-yellow-500' : ''
            )} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 min-h-[44px] min-w-[44px]"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Job Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {job.description}
      </p>

      {/* Requirements Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.requirements.slice(0, 4).map((req, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
          >
            {req}
          </span>
        ))}
        {job.requirements.length > 4 && (
          <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
            +{job.requirements.length - 4} more
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          variant="filled"
          size="sm"
          className="flex-1 min-h-[44px]"
          asChild
        >
          <Link to={`/jobs/${job.id}`}>
            View Details
          </Link>
        </Button>
        <Button
          variant="outlined"
          size="sm"
          className="min-h-[44px] px-6"
        >
          Apply Now
        </Button>
      </div>
    </Card>
  );
};

const JobCardGrid = ({ job, isDark, savedJobs, toggleSaveJob }: {
  job: Job;
  isDark: boolean;
  savedJobs: Set<string>;
  toggleSaveJob: (id: string) => void;
}) => {
  const formatPostedDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Posted today';
    if (diffDays === 2) return 'Posted yesterday';
    return `Posted ${diffDays - 1} days ago`;
  };

  const getJobTypeColor = (type: Job['type']) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'part-time': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'contract': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'internship': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <Card className={cn(
      'p-4 transition-all duration-200 hover:shadow-lg h-full',
      job.featured && 'ring-2 ring-blue-200 dark:ring-blue-800'
    )}>
      {/* Job Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          {job.companyLogo && (
            <img 
              src={job.companyLogo} 
              alt={job.company} 
              className="w-12 h-12 rounded-lg object-cover mb-3"
            />
          )}
          <div className="flex items-center space-x-2 mb-1">
            {job.featured && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                Featured
              </span>
            )}
          </div>
          <Link 
            to={`/jobs/${job.id}`}
            className="font-semibold text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors block mb-1"
          >
            {job.title}
          </Link>
          <p className="font-medium text-gray-600 dark:text-gray-400 mb-2">{job.company}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 min-h-[44px] min-w-[44px]"
          onClick={() => toggleSaveJob(job.id)}
        >
          <Bookmark className={cn(
            'h-4 w-4',
            savedJobs.has(job.id) ? 'fill-current text-yellow-500' : ''
          )} />
        </Button>
      </div>

      {/* Job Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="h-3 w-3" />
          <span>{job.location}</span>
          {job.isRemote && (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded ml-2">
              Remote
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
          <DollarSign className="h-3 w-3" />
          <span>{job.salary}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            getJobTypeColor(job.type)
          )}>
            {job.type.charAt(0).toUpperCase() + job.type.slice(1).replace('-', ' ')}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatPostedDate(job.postedDate)}
          </span>
        </div>
      </div>

      {/* Job Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
        {job.description}
      </p>

      {/* Requirements Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.requirements.slice(0, 3).map((req, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
          >
            {req}
          </span>
        ))}
        {job.requirements.length > 3 && (
          <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
            +{job.requirements.length - 3}
          </span>
        )}
      </div>

      {/* Stats */}
      {job.applicants && (
        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <Users className="h-3 w-3" />
          <span>{job.applicants} applicants</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 mt-auto">
        <Button
          variant="filled"
          size="sm"
          className="w-full min-h-[44px]"
          asChild
        >
          <Link to={`/jobs/${job.id}`}>
            View Details
          </Link>
        </Button>
        <Button
          variant="outlined"
          size="sm"
          className="w-full min-h-[44px]"
        >
          Apply Now
        </Button>
      </div>
    </Card>
  );
};