import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase,
  Users,
  TrendingUp,
  Eye,
  Plus,
  Search,
  Filter,
  Building2,
  FileText,
  BarChart3,
  // Timeline
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, StatsCard } from '../ui/Card';
import { cn } from '../../lib/cva';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    interviewsScheduled: 0,
    hiredCandidates: 0,
    recentJobs: [],
    recentApplicants: []
  });

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  const fetchDashboardData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch jobs posted by this employer
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select(`
          *,
          applications(
            id,
            status,
            student_profiles(
              full_name,
              avatar_url
            )
          )
        `)
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      // Calculate stats
      const activeJobs = jobs?.filter(job => job.status === 'active').length || 0;
      const allApplications = jobs?.flatMap(job => job.applications || []) || [];
      const totalApplicants = allApplications.length;
      const interviewsScheduled = allApplications.filter(app => app.status === 'interview').length;
      const hiredCandidates = allApplications.filter(app => app.status === 'hired').length;

      setDashboardData({
        activeJobs,
        totalApplicants,
        interviewsScheduled,
        hiredCandidates,
        recentJobs: jobs?.slice(0, 5) || [],
        recentApplicants: allApplications.slice(0, 10)
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4 ${isDark ? 'border-lime' : 'border-asu-maroon'}`}></div>
            <p className={`${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
              Loading dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card variant="elevated" padding="lg" className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Error Loading Dashboard
            </h2>
            <p className={`mb-4 ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
              {error}
            </p>
            <Button onClick={fetchDashboardData} variant="outline">
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
            Employer Dashboard
          </h1>
          <p className={`${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
            Manage your job postings and track candidate applications.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Active Jobs"
            value={dashboardData.activeJobs.toString()}
            icon={Briefcase}
            color="primary"
            animated
            delay={0.1}
          />

          <StatsCard
            title="Total Applicants"
            value={dashboardData.totalApplicants.toString()}
            icon={Users}
            color="info"
            animated
            delay={0.2}
          />

          <StatsCard
            title="Interviews Scheduled"
            value={dashboardData.interviewsScheduled.toString()}
            icon={Timeline}
            color="warning"
            animated
            delay={0.3}
          />

          <StatsCard
            title="Hired This Month"
            value={dashboardData.hiredCandidates.toString()}
            icon={TrendingUp}
            color="success"
            animated
            delay={0.4}
          />
        </div>

        {/* Quick Actions */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link to="/post-job">
              <Button 
                variant="primary" 
                fullWidth 
                leftIcon={<Plus className="h-4 w-4" />}
                className="h-12"
              >
                Post New Job
              </Button>
            </Link>
            <Link to="/applicants">
              <Button 
                variant="outline" 
                fullWidth 
                leftIcon={<Users className="h-4 w-4" />}
                className="justify-start h-12"
              >
                View Applicants
              </Button>
            </Link>
            <Link to="/messages">
              <Button 
                variant="outline" 
                fullWidth 
                leftIcon={<FileText className="h-4 w-4" />}
                className="justify-start h-12"
              >
                Messages
              </Button>
            </Link>
            <Link to="/analytics">
              <Button 
                variant="outline" 
                fullWidth 
                leftIcon={<BarChart3 className="h-4 w-4" />}
                className="justify-start h-12"
              >
                Analytics
              </Button>
            </Link>
          </div>
        </Card>

        {/* Recent Jobs */}
        <Card variant="elevated" className="mb-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                Recent Job Postings
              </h2>
              <Link to="/jobs">
                <Button variant="ghost" className={isDark ? 'text-lime' : 'text-asu-maroon'}>
                  View All Jobs
                </Button>
              </Link>
            </div>

            <div className="mb-4">
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startIcon={<Search className="h-4 w-4" />}
                variant="default"
                fullWidth
              />
            </div>

            <div className="space-y-4">
              {dashboardData.recentJobs.map((job) => (
                <Card key={job.id} variant="outlined" padding="md" className="hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className={`text-lg font-semibold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                            {job.title}
                          </h3>
                          <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                            {job.department} • Posted {new Date(job.posted).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className={`text-xl font-semibold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                          {job.applicants}
                        </p>
                        <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                          Applicants
                        </p>
                      </div>
                      
                      <div className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        job.status === 'Active' 
                          ? "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                          : `${isDark ? 'bg-dark-surface text-dark-muted' : 'bg-gray-100 text-gray-600'}`
                      )}>
                        {job.status}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>

        {/* Activity and Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card variant="elevated" padding="lg">
            <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
              Application Activity
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                    New Applications Today
                  </p>
                  <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                    Software Engineer position
                  </p>
                </div>
                <p className={`text-2xl font-semibold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                  8
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                    Interviews This Week
                  </p>
                  <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                    Various positions
                  </p>
                </div>
                <p className={`text-2xl font-semibold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                  12
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                    Offers Extended
                  </p>
                  <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                    This month
                  </p>
                </div>
                <p className={`text-2xl font-semibold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                  5
                </p>
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="lg">
            <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
              Top Performing Jobs
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                    Software Engineer
                  </p>
                  <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                    45 applications
                  </p>
                </div>
                <div className={`w-16 h-2 rounded-full ${isDark ? 'bg-dark-border' : 'bg-gray-200'}`}>
                  <div className={`h-full w-4/5 rounded-full ${isDark ? 'bg-lime' : 'bg-asu-maroon'}`}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                    Product Manager
                  </p>
                  <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                    32 applications
                  </p>
                </div>
                <div className={`w-16 h-2 rounded-full ${isDark ? 'bg-dark-border' : 'bg-gray-200'}`}>
                  <div className="h-full w-3/5 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                    Data Scientist
                  </p>
                  <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                    28 applications
                  </p>
                </div>
                <div className={`w-16 h-2 rounded-full ${isDark ? 'bg-dark-border' : 'bg-gray-200'}`}>
                  <div className="h-full w-1/2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}