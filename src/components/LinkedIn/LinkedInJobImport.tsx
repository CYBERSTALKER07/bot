import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Filter,
  Search,
  Building2,
  MapPin,
  Clock,
  Briefcase
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import PageLayout from '../ui/PageLayout';
import { cn } from '../../lib/cva';
import { linkedInJobService } from '../../lib/linkedin-api';
import { Job } from '../../types';

interface ImportStats {
  total: number;
  imported: number;
  failed: number;
  duplicates: number;
}

export default function LinkedInJobImport() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Authentication state
  const [isLinkedInConnected, setIsLinkedInConnected] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Import settings
  const [importSettings, setImportSettings] = useState({
    keywords: '',
    location: '',
    experienceLevel: 'all',
    jobType: 'all',
    company: '',
    maxJobs: 50,
  });

  // Import state
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStats, setImportStats] = useState<ImportStats>({
    total: 0,
    imported: 0,
    failed: 0,
    duplicates: 0,
  });

  // Job preview
  const [previewJobs, setPreviewJobs] = useState<Partial<Job>[]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  useEffect(() => {
    // Check if returning from LinkedIn OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (code) {
      handleLinkedInCallback(code);
    } else if (error) {
      console.error('LinkedIn OAuth error:', error);
    }

    // Check for existing token in localStorage
    const savedToken = localStorage.getItem('linkedin_access_token');
    if (savedToken) {
      setAccessToken(savedToken);
      setIsLinkedInConnected(true);
    }
  }, []);

  const handleLinkedInCallback = async (code: string) => {
    try {
      const tokenResponse = await linkedInJobService.getAccessToken(code);
      setAccessToken(tokenResponse.access_token);
      setIsLinkedInConnected(true);
      
      // Save token (in production, use secure storage)
      localStorage.setItem('linkedin_access_token', tokenResponse.access_token);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error('Error getting LinkedIn access token:', error);
    }
  };

  const connectToLinkedIn = () => {
    const authUrl = linkedInJobService.generateAuthUrl();
    window.location.href = authUrl;
  };

  const disconnectLinkedIn = () => {
    setAccessToken(null);
    setIsLinkedInConnected(false);
    localStorage.removeItem('linkedin_access_token');
  };

  const loadJobPreview = async () => {
    if (!accessToken) return;

    setIsLoadingPreview(true);
    try {
      const searchParams = {
        keywords: importSettings.keywords || undefined,
        location: importSettings.location || undefined,
        experienceLevel: importSettings.experienceLevel !== 'all' ? importSettings.experienceLevel : undefined,
        jobType: importSettings.jobType !== 'all' ? importSettings.jobType : undefined,
        company: importSettings.company || undefined,
        count: Math.min(importSettings.maxJobs, 10), // Preview limit
        start: 0,
      };

      const linkedInJobs = await linkedInJobService.searchJobs(accessToken, searchParams);
      const transformedJobs = linkedInJobs.map(job => linkedInJobService.transformLinkedInJob(job));
      setPreviewJobs(transformedJobs);
    } catch (error) {
      console.error('Error loading job preview:', error);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const startImport = async () => {
    if (!accessToken) return;

    setIsImporting(true);
    setImportProgress(0);
    setImportStats({ total: 0, imported: 0, failed: 0, duplicates: 0 });

    try {
      const searchParams = {
        keywords: importSettings.keywords || undefined,
        location: importSettings.location || undefined,
        experienceLevel: importSettings.experienceLevel !== 'all' ? importSettings.experienceLevel : undefined,
        jobType: importSettings.jobType !== 'all' ? importSettings.jobType : undefined,
        company: importSettings.company || undefined,
        count: importSettings.maxJobs,
      };

      const jobs = await linkedInJobService.importJobs(
        accessToken,
        searchParams,
        (imported, total) => {
          setImportProgress((imported / total) * 100);
        }
      );

      // Here you would save the jobs to your database
      // For now, we'll simulate the process
      const stats: ImportStats = {
        total: jobs.length,
        imported: Math.floor(jobs.length * 0.85), // Simulate some success
        failed: Math.floor(jobs.length * 0.1),
        duplicates: Math.floor(jobs.length * 0.05),
      };

      setImportStats(stats);
      
      // In a real implementation, you'd save to your backend:
      // await saveJobsToDatabase(jobs);

      console.log('Imported jobs:', jobs);
    } catch (error) {
      console.error('Error importing jobs:', error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <PageLayout 
      className={isDark ? 'bg-black text-white' : 'bg-white text-black'}
      maxWidth="4xl"
      padding="none"
    >
      {/* Header */}
      <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${
        isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-xl font-bold">LinkedIn Job Import</h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Import job listings from LinkedIn
            </p>
          </div>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            ←
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* LinkedIn Connection Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                isLinkedInConnected ? 'bg-green-500' : 'bg-gray-400'
              }`} />
              <h2 className="text-lg font-semibold">LinkedIn Connection</h2>
            </div>
            {isLinkedInConnected && (
              <Button variant="ghost" size="sm" onClick={disconnectLinkedIn}>
                Disconnect
              </Button>
            )}
          </div>

          {isLinkedInConnected ? (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>Connected to LinkedIn</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-yellow-600">
                <AlertCircle className="h-4 w-4" />
                <span>Connect to LinkedIn to import job data</span>
              </div>
              <Button onClick={connectToLinkedIn} className="flex items-center space-x-2">
                <ExternalLink className="h-4 w-4" />
                <span>Connect to LinkedIn</span>
              </Button>
            </div>
          )}
        </Card>

        {/* Import Settings */}
        {isLinkedInConnected && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Import Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                placeholder="Keywords (e.g., Software Engineer)"
                value={importSettings.keywords}
                onChange={(e) => setImportSettings(prev => ({
                  ...prev,
                  keywords: e.target.value
                }))}
                icon={<Search className="h-4 w-4" />}
              />
              
              <Input
                placeholder="Location (e.g., Auckland, NZ)"
                value={importSettings.location}
                onChange={(e) => setImportSettings(prev => ({
                  ...prev,
                  location: e.target.value
                }))}
                icon={<MapPin className="h-4 w-4" />}
              />
              
              <Select
                value={importSettings.experienceLevel}
                onChange={(e) => setImportSettings(prev => ({
                  ...prev,
                  experienceLevel: e.target.value
                }))}
              >
                <option value="all">All Experience Levels</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="ENTRY_LEVEL">Entry Level</option>
                <option value="ASSOCIATE">Associate</option>
                <option value="MID_SENIOR">Mid-Senior</option>
                <option value="DIRECTOR">Director</option>
                <option value="EXECUTIVE">Executive</option>
              </Select>
              
              <Select
                value={importSettings.jobType}
                onChange={(e) => setImportSettings(prev => ({
                  ...prev,
                  jobType: e.target.value
                }))}
              >
                <option value="all">All Job Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </Select>
              
              <Input
                placeholder="Company name (optional)"
                value={importSettings.company}
                onChange={(e) => setImportSettings(prev => ({
                  ...prev,
                  company: e.target.value
                }))}
                icon={<Building2 className="h-4 w-4" />}
              />
              
              <Input
                type="number"
                placeholder="Max jobs to import"
                min="1"
                max="100"
                value={importSettings.maxJobs}
                onChange={(e) => setImportSettings(prev => ({
                  ...prev,
                  maxJobs: parseInt(e.target.value) || 50
                }))}
              />
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={loadJobPreview}
                disabled={isLoadingPreview}
                variant="outlined"
                className="flex items-center space-x-2"
              >
                {isLoadingPreview ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Filter className="h-4 w-4" />
                )}
                <span>Preview Jobs</span>
              </Button>
              
              <Button 
                onClick={startImport}
                disabled={isImporting || previewJobs.length === 0}
                className="flex items-center space-x-2"
              >
                {isImporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>Start Import</span>
              </Button>
            </div>
          </Card>
        )}

        {/* Import Progress */}
        {isImporting && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Import Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{Math.round(importProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${importProgress}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Total</span>
                  <div className="font-semibold">{importStats.total}</div>
                </div>
                <div>
                  <span className="text-green-500">Imported</span>
                  <div className="font-semibold">{importStats.imported}</div>
                </div>
                <div>
                  <span className="text-red-500">Failed</span>
                  <div className="font-semibold">{importStats.failed}</div>
                </div>
                <div>
                  <span className="text-yellow-500">Duplicates</span>
                  <div className="font-semibold">{importStats.duplicates}</div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Job Preview */}
        {previewJobs.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Job Preview ({previewJobs.length} jobs found)
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {previewJobs.map((job, index) => (
                <div 
                  key={index}
                  className={cn(
                    'p-4 rounded-lg border',
                    isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <span className={cn(
                      'px-2 py-1 rounded text-xs font-medium',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    )}>
                      {job.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center space-x-1">
                      <Building2 className="h-4 w-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(job.posted_date!).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {job.description}
                  </p>
                  
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {job.skills.slice(0, 3).map((skill, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded">
                          +{job.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Important Notes */}
        <Card className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <h3 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
            Important Notes
          </h3>
          <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
            <li>• LinkedIn API access requires approval through their Partner Program</li>
            <li>• Rate limits apply: 500 requests per hour for most endpoints</li>
            <li>• Job data is subject to LinkedIn's terms of service</li>
            <li>• Consider implementing data deduplication to avoid duplicate listings</li>
            <li>• Store imported jobs with proper attribution to LinkedIn</li>
          </ul>
        </Card>
      </div>
    </PageLayout>
  );
}