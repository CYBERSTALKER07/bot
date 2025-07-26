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
  Filter
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
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [salaryFilter, setSalaryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  // Mock jobs data
  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'Tech Innovations Ltd',
        location: 'Auckland, NZ',
        type: 'full-time',
        salary: '$90,000 - $120,000',
        description: 'Join our team building next-generation web applications using modern technologies like React, TypeScript, and Node.js...',
        requirements: ['React', 'TypeScript', 'Node.js', '5+ years experience'],
        benefits: ['Health Insurance', 'Flexible Hours', 'Remote Work'],
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isRemote: true,
        experienceLevel: 'senior',
        industry: 'Technology',
        featured: true,
        applicants: 23,
        companyLogo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=80&h=80&fit=crop'
      },
      {
        id: '2',
        title: 'Marketing Coordinator',
        company: 'Creative Agency Co',
        location: 'Wellington, NZ',
        type: 'full-time',
        salary: '$55,000 - $70,000',
        description: 'Support our marketing team with campaign management and creative content development...',
        requirements: ['Marketing experience', 'Adobe Creative Suite', 'Communication skills'],
        benefits: ['Training budget', 'Team events', 'Career development'],
        postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isRemote: false,
        experienceLevel: 'mid',
        industry: 'Marketing',
        applicants: 15
      },
      {
        id: '3',
        title: 'Data Science Intern',
        company: 'Analytics Pro',
        location: 'Christchurch, NZ',
        type: 'internship',
        salary: '$25/hour',
        description: 'Learn data science in a real-world environment with hands-on projects...',
        requirements: ['Python', 'Statistics', 'Machine learning basics'],
        benefits: ['Mentorship', 'Learning opportunities', 'Future employment'],
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        isRemote: false,
        experienceLevel: 'entry',
        industry: 'Data Science'
      },
      {
        id: '4',
        title: 'UX/UI Designer',
        company: 'Design Studio',
        location: 'Auckland, NZ',
        type: 'full-time',
        salary: '$70,000 - $85,000',
        description: 'Create exceptional user experiences for web and mobile applications...',
        requirements: ['Figma', 'UI/UX Design', 'User Research', '3+ years experience'],
        benefits: ['Creative freedom', 'Latest tools', 'Design conferences'],
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        isRemote: true,
        experienceLevel: 'mid',
        industry: 'Design',
        applicants: 31
      }
    ];
    
    setJobs(mockJobs);
    setFilteredJobs(mockJobs);
    setLoading(false);
  }, []);

  // Filter and search functionality
  useEffect(() => {
    const filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = !locationFilter || 
                             job.location.toLowerCase().includes(locationFilter.toLowerCase());
      
      const matchesType = typeFilter === 'all' || job.type === typeFilter;
      const matchesExperience = experienceFilter === 'all' || job.experienceLevel === experienceFilter;
      
      return matchesSearch && matchesLocation && matchesType && matchesExperience;
    });

    // Sort jobs
    if (sortBy === 'newest') {
      filtered.sort((a, b) => b.postedDate.getTime() - a.postedDate.getTime());
    } else if (sortBy === 'salary') {
      filtered.sort((a, b) => b.salary.localeCompare(a.salary));
    } else if (sortBy === 'applicants') {
      filtered.sort((a, b) => (b.applicants || 0) - (a.applicants || 0));
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, locationFilter, typeFilter, experienceFilter, salaryFilter, sortBy]);

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
        <div className="flex justify-center items-center h-64">
          <div className={cn(
            'animate-spin rounded-full h-8 w-8 border-b-2',
            isDark ? 'border-white' : 'border-black'
          )}></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className={cn(
      'min-h-screen',
      isDark ? 'bg-black text-white' : 'bg-white text-black'
    )} maxWidth="7xl">
      {/* Enhanced responsive header */}
      <div className="mb-6 lg:mb-8">
        <Typography variant="h4" className="text-responsive-2xl font-bold mb-2">
          Find Your Dream Job
        </Typography>
        <Typography variant="body1" color="textSecondary" className="text-responsive">
          Discover {jobs.length} opportunities waiting for you
        </Typography>
      </div>

      {/* Enhanced responsive search and filters */}
      <Card className="p-responsive mb-6 lg:mb-8">
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
                className="w-full pl-10 min-h-[48px] text-responsive"
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
              className="w-full pl-10 min-h-[48px] text-responsive"
            />
          </div>
          
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full min-h-[48px] text-responsive"
          >
            <option value="newest">Newest First</option>
            <option value="salary">Salary</option>
            <option value="applicants">Most Applied</option>
          </Select>
        </div>

        {/* Enhanced filters toggle section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Button
            variant="text"
            size="small"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 touch-target text-responsive"
          >
            <Filter className="h-4 w-4" />
            <span>Advanced Filters</span>
            <ChevronDown className={cn(
              'h-4 w-4 transition-transform duration-200',
              showFilters ? 'rotate-180' : ''
            )} />
          </Button>

          <div className="text-responsive-sm text-gray-500 dark:text-gray-400">
            {filteredJobs.length} of {jobs.length} jobs
          </div>
        </div>

        {/* Enhanced responsive advanced filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full min-h-[48px] text-responsive"
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
              className="w-full min-h-[48px] text-responsive"
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
              className="w-full min-h-[48px] text-responsive sm:col-span-2 lg:col-span-1"
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

      {/* Enhanced responsive job listings */}
      <div className="space-y-4 lg:space-y-6">
        {filteredJobs.length === 0 ? (
          <Card className="p-8 text-center">
            <Briefcase className={cn(
              'h-12 w-12 mx-auto mb-4',
              isDark ? 'text-gray-600' : 'text-gray-400'
            )} />
            <Typography variant="h6" className="mb-2 text-responsive-lg">
              No jobs found
            </Typography>
            <Typography variant="body2" color="textSecondary" className="text-responsive">
              Try adjusting your search criteria or filters
            </Typography>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card
              key={job.id}
              className={cn(
                'p-responsive transition-all duration-200 hover:shadow-lg cursor-pointer',
                job.featured && 'ring-2 ring-blue-200 dark:ring-blue-800',
                'hover:scale-[1.01] transform'
              )}
            >
              {/* Enhanced responsive job header */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
                <div className="flex items-start space-x-3 lg:space-x-4 flex-1">
                  {job.companyLogo && (
                    <img 
                      src={job.companyLogo} 
                      alt={job.company} 
                      className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={`/job/${job.id}`}
                          className="hover:underline block"
                        >
                          <Typography variant="h6" className="font-bold mb-1 text-responsive-lg">
                            <span className="line-clamp-2">{job.title}</span>
                            {job.featured && (
                              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded">
                                Featured
                              </span>
                            )}
                          </Typography>
                        </Link>
                        <Typography variant="body1" className="text-blue-600 dark:text-blue-400 font-medium mb-2 text-responsive">
                          {job.company}
                        </Typography>
                      </div>
                      
                      {/* Enhanced responsive action buttons */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => toggleSaveJob(job.id)}
                          className={cn(
                            'touch-target p-2',
                            savedJobs.has(job.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                          )}
                        >
                          <Bookmark className={cn(
                            'h-4 w-4 lg:h-5 lg:w-5',
                            savedJobs.has(job.id) ? 'fill-current' : ''
                          )} />
                        </Button>
                        <Button variant="text" size="small" className="touch-target p-2 text-gray-500 hover:text-blue-500">
                          <Share2 className="h-4 w-4 lg:h-5 lg:w-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Enhanced responsive job details */}
                    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-responsive-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                        {job.isRemote && (
                          <span className="ml-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded flex-shrink-0">
                            Remote
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{job.salary}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span>{formatPostedDate(job.postedDate)}</span>
                      </div>
                      {job.applicants && (
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span>{job.applicants} applicants</span>
                        </div>
                      )}
                    </div>

                    <Typography variant="body2" color="textSecondary" className="mb-3 line-clamp-2 lg:line-clamp-3 text-responsive">
                      {job.description}
                    </Typography>

                    {/* Enhanced responsive tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={cn(
                        getJobTypeColor(job.type),
                        'px-2 py-1 rounded text-xs font-medium'
                      )}>
                        {job.type.replace('-', ' ')}
                      </span>
                      <span className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded text-xs font-medium">
                        {job.experienceLevel} level
                      </span>
                      <span className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded text-xs font-medium">
                        {job.industry}
                      </span>
                    </div>

                    {job.applicationDeadline && (
                      <div className="text-responsive-sm text-orange-600 dark:text-orange-400 mb-3 font-medium">
                        Application deadline: {job.applicationDeadline.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced responsive footer */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pt-4 border-t border-gray-200 dark:border-gray-700 gap-4">
                <div className="flex flex-wrap gap-2">
                  {job.requirements.slice(0, window.innerWidth < 768 ? 2 : 3).map((req, index) => (
                    <span key={index} className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded">
                      {req}
                    </span>
                  ))}
                  {job.requirements.length > (window.innerWidth < 768 ? 2 : 3) && (
                    <span className="bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-xs px-2 py-1 rounded">
                      +{job.requirements.length - (window.innerWidth < 768 ? 2 : 3)} more
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                  <Link to={`/job/${job.id}`} className="flex-1 sm:flex-none">
                    <Button variant="outlined" size="small" className="w-full sm:w-auto touch-target text-responsive-sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  <Button variant="filled" size="small" className="w-full sm:w-auto touch-target text-responsive-sm">
                    Apply Now
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Enhanced responsive load more button */}
      {filteredJobs.length > 0 && (
        <div className="text-center mt-6 lg:mt-8">
          <Button variant="outlined" size="large" className="w-full sm:w-auto touch-target text-responsive">
            Load More Jobs
          </Button>
        </div>
      )}
    </PageLayout>
  );
}