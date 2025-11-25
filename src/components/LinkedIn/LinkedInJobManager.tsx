import React, { useState, useEffect } from 'react';
import {
  Linkedin,
  Download,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  ExternalLink,
  TrendingUp
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import PageLayout from '../ui/PageLayout';
import { cn } from '../../lib/cva';
import { 
  linkedInJobService, 
  LinkedInJobPost, 
  LinkedInApplication, 
  LinkedInCompany 
} from '../../lib/linkedin-job-service';

interface ImportStats {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
}

export default function LinkedInJobManager() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  
  // State management
  const [isConnected, setIsConnected] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [companies, setCompanies] = useState<LinkedInCompany[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [linkedinJobs, setLinkedinJobs] = useState<LinkedInJobPost[]>([]);
  const [applications, setApplications] = useState<LinkedInApplication[]>([]);
  const [importStats, setImportStats] = useState<ImportStats>({ total: 0, successful: 0, failed: 0, skipped: 0 });
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    employmentType: 'all',
    experienceLevel: 'all',
    datePosted: 'all'
  });
  
  // UI states
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications' | 'analytics'>('jobs');
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    checkLinkedInConnection();
  }, []);

  useEffect(() => {
    if (isConnected && companies.length > 0 && selectedCompany) {
      loadCompanyJobs();
    }
  }, [selectedCompany, isConnected]);

  const checkLinkedInConnection = async () => {
    const token = localStorage.getItem('linkedin_access_token');
    if (token) {
      try {
        setIsLoading(true);
        linkedInJobService.setAccessToken(token);
        const profile = await linkedInJobService.getUserProfile();
        const userCompanies = await linkedInJobService.getUserOrganizations();
        
        setUserProfile(profile);
        setCompanies(userCompanies);
        setIsConnected(true);
        
        if (userCompanies.length > 0) {
          setSelectedCompany(userCompanies[0].id);
        }
      } catch (error) {
        console.error('Error checking LinkedIn connection:', error);
        localStorage.removeItem('linkedin_access_token');
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLinkedInConnect = () => {
    linkedInJobService.initiateAuth();
  };

  const loadCompanyJobs = async () => {
    if (!selectedCompany) return;
    
    try {
      setIsLoading(true);
      const jobs = await linkedInJobService.getCompanyJobs(selectedCompany, 100);
      setLinkedinJobs(jobs);
    } catch (error) {
      console.error('Error loading company jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportJobs = async () => {
    if (selectedJobs.size === 0) return;
    
    try {
      setIsImporting(true);
      const jobsToImport = linkedinJobs.filter(job => selectedJobs.has(job.id));
      
      let successful = 0;
      let failed = 0;
      
      for (const job of jobsToImport) {
        try {
          await linkedInJobService.importJobsToPlatform([job]);
          successful++;
        } catch (error) {
          failed++;
          console.error(`Failed to import job ${job.id}:`, error);
        }
      }
      
      setImportStats({
        total: jobsToImport.length,
        successful,
        failed,
        skipped: 0
      });
      
      // Clear selection after import
      setSelectedJobs(new Set());
      
      // Show success message
      alert(`Import completed! ${successful} jobs imported successfully, ${failed} failed.`);
    } catch (error) {
      console.error('Error importing jobs:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleBulkImport = async () => {
    try {
      setIsImporting(true);
      const allJobs = await linkedInJobService.importJobsToPlatform(linkedinJobs);
      
      setImportStats({
        total: linkedinJobs.length,
        successful: allJobs.length,
        failed: linkedinJobs.length - allJobs.length,
        skipped: 0
      });
      
      alert(`Bulk import completed! ${allJobs.length} jobs imported successfully.`);
    } catch (error) {
      console.error('Error bulk importing jobs:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleSyncApplications = async (jobId: string) => {
    try {
      setIsSyncing(true);
      await linkedInJobService.syncApplications(jobId);
      
      // Reload applications
      const apps = await linkedInJobService.getJobApplications(jobId);
      setApplications(apps);
      
      alert('Applications synced successfully!');
    } catch (error) {
      console.error('Error syncing applications:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleJobSelection = (jobId: string, selected: boolean) => {
    const newSelection = new Set(selectedJobs);
    if (selected) {
      newSelection.add(jobId);
    } else {
      newSelection.delete(jobId);
    }
    setSelectedJobs(newSelection);
  };

  const handleSelectAllJobs = () => {
    if (selectedJobs.size === filteredJobs.length) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(filteredJobs.map(job => job.id)));
    }
  };

  const filteredJobs = linkedinJobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEmploymentType = selectedFilters.employmentType === 'all' || 
      job.employmentType === selectedFilters.employmentType;
    
    const matchesExperience = selectedFilters.experienceLevel === 'all' || 
      job.seniorityLevel === selectedFilters.experienceLevel;
    
    return matchesSearch && matchesEmploymentType && matchesExperience;
  });

  if (!isConnected) {
    return (
      <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'} maxWidth="4xl">
        <div className="flex items-center justify-center min-h-96">
          <Card className="p-8 text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 bg-info-100 dark:bg-info-900 rounded-full flex items-center justify-center">
              <Linkedin className="h-8 w-8 text-info-600 dark:text-info-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Connect to LinkedIn</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Connect your LinkedIn account to import job postings and manage applications through your platform.
            </p>
            <Button
              onClick={handleLinkedInConnect}
              className="bg-info-600 text-white hover:bg-info-700 w-full flex items-center justify-center space-x-2"
            >
              <Linkedin className="h-5 w-5" />
              <span>Connect LinkedIn Account</span>
            </Button>
          </Card>
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
              <div className="p-2 rounded-lg bg-info-600">
                <Linkedin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">LinkedIn Job Manager</h1>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Import and manage LinkedIn job postings
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={loadCompanyJobs}
                variant="outlined"
                size="sm"
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                <span>Refresh</span>
              </Button>
              
              {selectedJobs.size > 0 && (
                <Button
                  onClick={handleImportJobs}
                  disabled={isImporting}
                  className="bg-green-600 text-white hover:bg-green-700 flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>{isImporting ? 'Importing...' : `Import ${selectedJobs.size} Jobs`}</span>
                </Button>
              )}
            </div>
          </div>
          
          {/* User Profile Banner */}
          {userProfile && (
            <div className="mt-4 flex items-center justify-between p-3 bg-info-50 dark:bg-info-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-info-600 text-white rounded-full flex items-center justify-center font-semibold">
                  {userProfile.firstName?.charAt(0)}{userProfile.lastName?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">
                    {userProfile.firstName} {userProfile.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Connected to LinkedIn • {companies.length} companies available
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className={cn(
                    'px-3 py-2 rounded-lg border',
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                  )}
                >
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {[
            { key: 'jobs', label: 'Job Postings', icon: Briefcase },
            { key: 'applications', label: 'Applications', icon: Users },
            { key: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={cn(
                  'flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200',
                  activeTab === tab.key
                    ? 'bg-white dark:bg-gray-700 text-info-600 dark:text-info-400 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Job Postings Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={cn(
                      'pl-10 pr-4 py-2 border rounded-lg w-64',
                      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                    )}
                  />
                </div>
                
                <select
                  value={selectedFilters.employmentType}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, employmentType: e.target.value }))}
                  className={cn(
                    'px-3 py-2 rounded-lg border',
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                  )}
                >
                  <option value="all">All Types</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleSelectAllJobs}
                  variant="outlined"
                  size="sm"
                >
                  {selectedJobs.size === filteredJobs.length ? 'Deselect All' : 'Select All'}
                </Button>
                
                <Button
                  onClick={handleBulkImport}
                  disabled={isImporting || filteredJobs.length === 0}
                  className="bg-info-600 text-white hover:bg-info-700"
                >
                  {isImporting ? 'Importing...' : 'Import All Visible'}
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</p>
                    <p className="text-2xl font-bold text-info-600">{linkedinJobs.length}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-info-500" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Selected</p>
                    <p className="text-2xl font-bold text-green-600">{selectedJobs.size}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last Import</p>
                    <p className="text-2xl font-bold text-purple-600">{importStats.successful}</p>
                  </div>
                  <Download className="h-8 w-8 text-purple-500" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
                    <p className="text-2xl font-bold text-red-600">{importStats.failed}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </Card>
            </div>

            {/* Job List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-info-600" />
                </div>
              ) : filteredJobs.length === 0 ? (
                <Card className="p-12 text-center">
                  <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your filters or refresh to load more jobs
                  </p>
                </Card>
              ) : (
                filteredJobs.map(job => (
                  <LinkedInJobCard
                    key={job.id}
                    job={job}
                    isSelected={selectedJobs.has(job.id)}
                    onSelect={(selected) => handleJobSelection(job.id, selected)}
                    onSync={() => handleSyncApplications(job.id)}
                    isSyncing={isSyncing}
                    isDark={isDark}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">LinkedIn Applications</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Applications will appear here when you sync them from LinkedIn job postings.
              </p>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Import Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Imported:</span>
                    <span className="font-semibold">{importStats.successful}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Failed:</span>
                    <span className="font-semibold text-red-600">{importStats.failed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-semibold text-green-600">
                      {importStats.total > 0 ? ((importStats.successful / importStats.total) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Job Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Full Time:</span>
                    <span className="font-semibold">
                      {linkedinJobs.filter(job => job.employmentType === 'FULL_TIME').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Part Time:</span>
                    <span className="font-semibold">
                      {linkedinJobs.filter(job => job.employmentType === 'PART_TIME').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contract:</span>
                    <span className="font-semibold">
                      {linkedinJobs.filter(job => job.employmentType === 'CONTRACT').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Internship:</span>
                    <span className="font-semibold">
                      {linkedinJobs.filter(job => job.employmentType === 'INTERNSHIP').length}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

// LinkedIn Job Card Component
const LinkedInJobCard: React.FC<{
  job: LinkedInJobPost;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onSync: () => void;
  isSyncing: boolean;
  isDark: boolean;
}> = ({ job, isSelected, onSelect, onSync, isSyncing, isDark }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case 'FULL_TIME': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PART_TIME': return 'bg-info-100 text-info-800 dark:bg-info-900 dark:text-info-200';
      case 'CONTRACT': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'INTERNSHIP': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <Card className={cn(
      'p-6 transition-all duration-200',
      isSelected ? 'ring-2 ring-info-500 bg-info-50 dark:bg-info-900/20' : ''
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="mt-2 h-4 w-4 text-info-600 rounded border-gray-300 focus:ring-info-500"
          />
          
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{job.title}</h3>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <span className="flex items-center space-x-1">
                <Building2 className="h-4 w-4" />
                <span>{job.company}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Posted {formatDate(job.postedAt)}</span>
              </span>
              {job.applicantCount && (
                <span className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{job.applicantCount} applicants</span>
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                getEmploymentTypeColor(job.employmentType)
              )}>
                {job.employmentType.replace('_', ' ')}
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                {job.seniorityLevel.replace('_', ' ')}
              </span>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
              {job.description}
            </p>
            
            {job.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.slice(0, 6).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-info-100 dark:bg-info-900 text-info-800 dark:text-info-200 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 6 && (
                  <span className="px-2 py-1 text-gray-500 text-xs">
                    +{job.skills.length - 6} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={onSync}
            disabled={isSyncing}
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1"
          >
            <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin")} />
            <span>Sync</span>
          </Button>
          
          {job.applicationMethod.url && (
            <Button
              as="a"
              href={job.applicationMethod.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="sm"
              className="flex items-center space-x-1"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View on LinkedIn</span>
            </Button>
          )}
        </div>
      </div>
      
      {job.salaryRange && (
        <div className="flex items-center space-x-2 text-sm">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="text-green-600 font-medium">
            {job.salaryRange.currency} {job.salaryRange.min.toLocaleString()} - {job.salaryRange.max.toLocaleString()}
          </span>
        </div>
      )}
    </Card>
  );
};