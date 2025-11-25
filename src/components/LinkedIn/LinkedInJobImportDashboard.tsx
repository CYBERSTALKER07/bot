import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Linkedin,
  Download,
  Settings,
  Search,
  Filter,
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  Users,
  Briefcase,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  Play,
  Pause,
  BarChart3,
  TrendingUp,
  Eye,
  Send,
  Bookmark,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import PageLayout from '../ui/PageLayout';
import { cn } from '../../lib/cva';
import {
  linkedInService,
  LinkedInJob,
  JobImportSettings,
  LinkedInProfile,
  LinkedInUtils
} from '../../lib/linkedin-service';
import { Job } from '../../types';
import SegmentedControl from '../ui/SegmentedControl';

interface ImportProgress {
  current: number;
  total: number;
  isImporting: boolean;
  errors: string[];
  imported: Job[];
}

export default function LinkedInJobImport() {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const [isConnected, setIsConnected] = useState(false);
  const [linkedInProfile, setLinkedInProfile] = useState<LinkedInProfile | null>(null);
  const [importSettings, setImportSettings] = useState<JobImportSettings>({
    keywords: [],
    locations: [],
    companies: [],
    jobTypes: [],
    experienceLevels: [],
    remoteOnly: false,
    datePosted: 'pastWeek',
    limit: 50
  });
  const [previewJobs, setPreviewJobs] = useState<LinkedInJob[]>([]);
  const [importProgress, setImportProgress] = useState<ImportProgress>({
    current: 0,
    total: 0,
    isImporting: false,
    errors: [],
    imported: []
  });
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(true);

  useEffect(() => {
    checkLinkedInConnection();
    handleAuthCallback();
  }, []);

  const checkLinkedInConnection = async () => {
    try {
      const connected = linkedInService.isAuthenticated();
      setIsConnected(connected);

      if (connected) {
        const profile = await linkedInService.getUserProfile();
        setLinkedInProfile(profile);
      }
    } catch (error) {
      console.error('Error checking LinkedIn connection:', error);
      setIsConnected(false);
    }
  };

  const handleAuthCallback = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('LinkedIn auth error:', error);
      return;
    }

    if (code) {
      exchangeCodeForToken(code);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const exchangeCodeForToken = async (code: string) => {
    try {
      await linkedInService.exchangeCodeForToken(code);
      await checkLinkedInConnection();
    } catch (error) {
      console.error('Error exchanging code for token:', error);
    }
  };

  const connectToLinkedIn = () => {
    const authUrl = linkedInService.getAuthUrl();
    window.location.href = authUrl;
  };

  const disconnectFromLinkedIn = () => {
    linkedInService.logout();
    setIsConnected(false);
    setLinkedInProfile(null);
    setPreviewJobs([]);
    setSelectedJobs(new Set());
  };

  const previewJobs = async () => {
    if (!isConnected) return;

    setIsLoadingPreview(true);
    try {
      const jobs = await linkedInService.searchJobs(importSettings);
      setPreviewJobs(jobs);
      setSelectedJobs(new Set(jobs.map(job => job.id)));
    } catch (error) {
      console.error('Error previewing jobs:', error);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const startImport = async () => {
    if (!isConnected || selectedJobs.size === 0) return;

    const jobsToImport = previewJobs.filter(job => selectedJobs.has(job.id));

    setImportProgress({
      current: 0,
      total: jobsToImport.length,
      isImporting: true,
      errors: [],
      imported: []
    });

    try {
      const importedJobs = await linkedInService.importJobs(
        { ...importSettings, limit: jobsToImport.length },
        (current, total) => {
          setImportProgress(prev => ({
            ...prev,
            current,
            total
          }));
        }
      );

      setImportProgress(prev => ({
        ...prev,
        isImporting: false,
        imported: importedJobs
      }));
    } catch (error) {
      console.error('Error importing jobs:', error);
      setImportProgress(prev => ({
        ...prev,
        isImporting: false,
        errors: [...prev.errors, error.message]
      }));
    }
  };

  const toggleJobSelection = (jobId: string) => {
    const newSelection = new Set(selectedJobs);
    if (newSelection.has(jobId)) {
      newSelection.delete(jobId);
    } else {
      newSelection.add(jobId);
    }
    setSelectedJobs(newSelection);
  };

  const selectAllJobs = () => {
    setSelectedJobs(new Set(previewJobs.map(job => job.id)));
  };

  const deselectAllJobs = () => {
    setSelectedJobs(new Set());
  };

  const applyToJob = async (job: LinkedInJob) => {
    // This would open your platform's application flow
    // For now, we'll simulate the application process
    console.log('Applying to job:', job.title);
  };

  if (!isConnected) {
    return (
      <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'} maxWidth="4xl">
        <div className="text-center space-y-8 py-12">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-info-100 dark:bg-info-900/20">
              <Linkedin className="h-16 w-16 text-info-600" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Connect with LinkedIn</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Import jobs from LinkedIn and allow candidates to apply through your platform.
              Connect your LinkedIn account to get started with job importing and application management.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={connectToLinkedIn}
              className="bg-info-600 text-white hover:bg-info-700 px-8 py-3 text-lg"
            >
              <Linkedin className="h-5 w-5 mr-2" />
              Connect LinkedIn Account
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <Card className="p-6 text-center">
                <Download className="h-8 w-8 mx-auto mb-4 text-info-500" />
                <h3 className="font-semibold mb-2">Import Jobs</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically import job postings from LinkedIn with advanced filtering
                </p>
              </Card>

              <Card className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-4 text-green-500" />
                <h3 className="font-semibold mb-2">Manage Applications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Let candidates apply through your platform with integrated tracking
                </p>
              </Card>

              <Card className="p-6 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-4 text-purple-500" />
                <h3 className="font-semibold mb-2">Analytics & Insights</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track application performance and candidate engagement metrics
                </p>
              </Card>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'} maxWidth="full" padding="none">
      {/* Header */}
      <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
        }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-info-600">
                <Linkedin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">LinkedIn Job Import</h1>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Import jobs and manage applications from LinkedIn
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {linkedInProfile && (
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Connected as {LinkedInUtils.formatProfileName(linkedInProfile)}</span>
                </div>
              )}

              <Button
                onClick={disconnectFromLinkedIn}
                variant="outlined"
                size="sm"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Import Settings
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  {showSettings ? <X className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                </Button>
              </div>

              {showSettings && (
                <div className="space-y-4">
                  {/* Keywords */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Keywords</label>
                    <input
                      type="text"
                      placeholder="e.g., React, JavaScript, Product Manager"
                      className={cn(
                        'w-full p-2 rounded-lg border',
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                      )}
                      onChange={(e) => setImportSettings(prev => ({
                        ...prev,
                        keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                      }))}
                    />
                  </div>

                  {/* Locations */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Locations</label>
                    <input
                      type="text"
                      placeholder="e.g., New York, San Francisco, Remote"
                      className={cn(
                        'w-full p-2 rounded-lg border',
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                      )}
                      onChange={(e) => setImportSettings(prev => ({
                        ...prev,
                        locations: e.target.value.split(',').map(l => l.trim()).filter(Boolean)
                      }))}
                    />
                  </div>

                  {/* Job Types */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Job Types</label>
                    <div className="space-y-2">
                      {['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'].map(type => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded mr-2"
                            onChange={(e) => {
                              const newTypes = e.target.checked
                                ? [...(importSettings.jobTypes || []), type]
                                : (importSettings.jobTypes || []).filter(t => t !== type);
                              setImportSettings(prev => ({ ...prev, jobTypes: newTypes }));
                            }}
                          />
                          <span className="text-sm">{type.replace('_', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Experience Levels */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Experience Level</label>
                    <div className="overflow-x-auto">
                      <SegmentedControl
                        value={importSettings.experienceLevels?.[0] || ''}
                        onChange={(val) => setImportSettings(prev => ({
                          ...prev,
                          experienceLevels: val ? [val] : []
                        }))}
                        aria-label="Experience level"
                      >
                        <SegmentedControl.Option value="">All</SegmentedControl.Option>
                        <SegmentedControl.Option value="INTERNSHIP">Intern</SegmentedControl.Option>
                        <SegmentedControl.Option value="ENTRY_LEVEL">Entry</SegmentedControl.Option>
                        <SegmentedControl.Option value="ASSOCIATE">Assoc</SegmentedControl.Option>
                        <SegmentedControl.Option value="MID_SENIOR_LEVEL">Mid-Sr</SegmentedControl.Option>
                        <SegmentedControl.Option value="DIRECTOR">Dir</SegmentedControl.Option>
                        <SegmentedControl.Option value="EXECUTIVE">Exec</SegmentedControl.Option>
                      </SegmentedControl>
                    </div>
                  </div>

                  {/* Remote Work */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded mr-2"
                        checked={importSettings.remoteOnly}
                        onChange={(e) => setImportSettings(prev => ({
                          ...prev,
                          remoteOnly: e.target.checked
                        }))}
                      />
                      <span className="text-sm">Remote work only</span>
                    </label>
                  </div>

                  {/* Date Posted */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Date Posted</label>
                    <div className="overflow-x-auto">
                      <SegmentedControl
                        value={importSettings.datePosted}
                        onChange={(val) => setImportSettings(prev => ({
                          ...prev,
                          datePosted: val as any
                        }))}
                        aria-label="Date posted"
                      >
                        <SegmentedControl.Option value="past24Hours">24h</SegmentedControl.Option>
                        <SegmentedControl.Option value="pastWeek">Week</SegmentedControl.Option>
                        <SegmentedControl.Option value="pastMonth">Month</SegmentedControl.Option>
                        <SegmentedControl.Option value="anytime">Any</SegmentedControl.Option>
                      </SegmentedControl>
                    </div>
                  </div>

                  {/* Limit */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Import Limit</label>
                    <div className="overflow-x-auto">
                      <SegmentedControl
                        value={String(importSettings.limit)}
                        onChange={(val) => setImportSettings(prev => ({
                          ...prev,
                          limit: parseInt(val)
                        }))}
                        aria-label="Import limit"
                      >
                        <SegmentedControl.Option value="25">25</SegmentedControl.Option>
                        <SegmentedControl.Option value="50">50</SegmentedControl.Option>
                        <SegmentedControl.Option value="100">100</SegmentedControl.Option>
                        <SegmentedControl.Option value="200">200</SegmentedControl.Option>
                      </SegmentedControl>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Import Progress */}
            {importProgress.isImporting && (
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  <h3 className="font-semibold">Importing Jobs</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{importProgress.current} / {importProgress.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-info-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(importProgress.current / importProgress.total) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Import Results */}
            {importProgress.imported.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <h3 className="font-semibold">Import Complete</h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Jobs Imported:</span>
                    <span className="font-medium text-green-600">
                      {importProgress.imported.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Errors:</span>
                    <span className="font-medium text-red-600">
                      {importProgress.errors.length}
                    </span>
                  </div>
                </div>

                <Link to="/jobs" className="block mt-4">
                  <Button size="sm" className="w-full">
                    View Imported Jobs
                  </Button>
                </Link>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={previewJobs}
                  disabled={isLoadingPreview}
                  className="flex items-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                  <span>{isLoadingPreview ? 'Searching...' : 'Preview Jobs'}</span>
                </Button>

                {previewJobs.length > 0 && (
                  <>
                    <Button
                      onClick={selectAllJobs}
                      variant="outlined"
                      size="sm"
                    >
                      Select All ({previewJobs.length})
                    </Button>

                    <Button
                      onClick={deselectAllJobs}
                      variant="outlined"
                      size="sm"
                    >
                      Deselect All
                    </Button>
                  </>
                )}
              </div>

              {selectedJobs.size > 0 && (
                <Button
                  onClick={startImport}
                  disabled={importProgress.isImporting}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Import Selected ({selectedJobs.size})
                </Button>
              )}
            </div>

            {/* Jobs Preview */}
            <div className="space-y-4">
              {isLoadingPreview ? (
                <Card className="p-12 text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p>Searching LinkedIn jobs...</p>
                </Card>
              ) : previewJobs.length === 0 ? (
                <Card className="p-12 text-center">
                  <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No Jobs Found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Click "Preview Jobs" to search for jobs matching your criteria
                  </p>
                </Card>
              ) : (
                previewJobs.map((job) => (
                  <LinkedInJobCard
                    key={job.id}
                    job={job}
                    isSelected={selectedJobs.has(job.id)}
                    onToggleSelection={() => toggleJobSelection(job.id)}
                    onApply={() => applyToJob(job)}
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

// LinkedIn Job Card Component
const LinkedInJobCard: React.FC<{
  job: LinkedInJob;
  isSelected: boolean;
  onToggleSelection: () => void;
  onApply: () => void;
  isDark: boolean;
}> = ({ job, isSelected, onToggleSelection, onApply, isDark }) => {
  return (
    <Card className={cn(
      'p-6 transition-all duration-200 border-l-4',
      isSelected ? 'border-l-info-500 bg-info-50 dark:bg-info-900/10' : 'border-l-gray-200 dark:border-l-gray-700'
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelection}
            className="mt-1 rounded"
          />

          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-bold">{job.title}</h3>
              {job.easyApplyEnabled && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                  Easy Apply
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <span className="flex items-center">
                <Building2 className="h-4 w-4 mr-1" />
                {job.company.name}
              </span>
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {LinkedInUtils.formatJobLocation(job)}
              </span>
              <span className="flex items-center">
                <Briefcase className="h-4 w-4 mr-1" />
                {job.employmentType.replace('_', ' ')}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(job.postedAt).toLocaleDateString()}
              </span>
            </div>

            {LinkedInUtils.formatSalaryRange(job) && (
              <div className="flex items-center mb-3">
                <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                <span className="text-green-600 font-medium">
                  {LinkedInUtils.formatSalaryRange(job)}
                </span>
              </div>
            )}

            <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
              {job.description}
            </p>

            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.slice(0, 8).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 8 && (
                  <span className="px-2 py-1 text-gray-500 text-sm">
                    +{job.skills.length - 8} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {LinkedInUtils.isRemoteJob(job) && (
            <span className="flex items-center text-sm text-purple-600 dark:text-purple-400">
              <TrendingUp className="h-4 w-4 mr-1" />
              Remote Friendly
            </span>
          )}

          <span className="text-sm text-gray-500">
            {job.experienceLevel.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {job.applicationUrl && (
            <Button
              variant="outlined"
              size="sm"
              onClick={() => window.open(job.applicationUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View on LinkedIn
            </Button>
          )}

          <Button
            size="sm"
            onClick={onApply}
            className="bg-info-600 text-white hover:bg-info-700"
          >
            <Send className="h-4 w-4 mr-1" />
            Apply on Platform
          </Button>
        </div>
      </div>
    </Card>
  );
};