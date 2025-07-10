import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Work,
  People,
  TrendingUp,
  Visibility,
  Add,
  Search,
  FilterList,
  Business,
  Assignment,
  BarChart,
  Timeline
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase';
import Typography from '../ui/Typography';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card } from '../ui/Card';

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
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4 ${
              isDark ? 'border-lime' : 'border-asu-maroon'
            }`}></div>
            <Typography variant="body1" color="textSecondary">
              Loading dashboard...
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center">
            <Typography variant="h6" className="text-red-600 mb-2">
              Error Loading Dashboard
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-4">
              {error}
            </Typography>
            <Button onClick={fetchDashboardData} variant="outlined">
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
          <Typography variant="h4" className="font-medium mb-2">
            Employer Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage your job postings and track candidate applications.
          </Typography>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6" elevation={1}>
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-lime/10 text-lime' : 'bg-asu-maroon/10 text-asu-maroon'
              }`}>
                <Work className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <Typography variant="h5" className="font-semibold">
                  {dashboardData.activeJobs}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Active Jobs
                </Typography>
              </div>
            </div>
          </Card>

          <Card className="p-6" elevation={1}>
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
              }`}>
                <People className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <Typography variant="h5" className="font-semibold">
                  {dashboardData.totalApplicants}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Applicants
                </Typography>
              </div>
            </div>
          </Card>

          <Card className="p-6" elevation={1}>
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600'
              }`}>
                <Timeline className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <Typography variant="h5" className="font-semibold">
                  {dashboardData.interviewsScheduled}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Interviews Scheduled
                </Typography>
              </div>
            </div>
          </Card>

          <Card className="p-6" elevation={1}>
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'
              }`}>
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <Typography variant="h5" className="font-semibold">
                  {dashboardData.hiredCandidates}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Hired This Month
                </Typography>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mb-8" elevation={1}>
          <Typography variant="h6" className="font-medium mb-4">
            Quick Actions
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link to="/post-job">
              <Button 
                variant="contained" 
                fullWidth 
                startIcon={<Add />}
                className="h-12"
              >
                Post New Job
              </Button>
            </Link>
            <Link to="/applicants">
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<People />}
                className="justify-start h-12"
              >
                View Applicants
              </Button>
            </Link>
            <Link to="/messages">
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<Assignment />}
                className="justify-start h-12"
              >
                Messages
              </Button>
            </Link>
            <Link to="/analytics">
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<BarChart />}
                className="justify-start h-12"
              >
                Analytics
              </Button>
            </Link>
          </div>
        </Card>

        {/* Recent Jobs */}
        <Card className="mb-8" elevation={1}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Typography variant="h6" className="font-medium">
                Recent Job Postings
              </Typography>
              <Link to="/jobs">
                <Button variant="text" color="primary">
                  View All Jobs
                </Button>
              </Link>
            </div>

            <div className="mb-4">
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startIcon={<Search />}
                variant="outlined"
                fullWidth
              />
            </div>

            <div className="space-y-4">
              {dashboardData.recentJobs.map((job) => (
                <Card key={job.id} className="p-4 hover:shadow-md transition-shadow" elevation={0}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <Typography variant="h6" className="font-medium">
                            {job.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {job.department} • Posted {new Date(job.posted).toLocaleDateString()}
                          </Typography>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <Typography variant="h6" className="font-semibold">
                          {job.applicants}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Applicants
                        </Typography>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        job.status === 'Active' 
                          ? isDark 
                            ? 'bg-green-500/10 text-green-400' 
                            : 'bg-green-50 text-green-600'
                          : isDark
                            ? 'bg-gray-500/10 text-gray-400'
                            : 'bg-gray-50 text-gray-600'
                      }`}>
                        {job.status}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outlined" size="small">
                          <Visibility className="h-4 w-4" />
                        </Button>
                        <Button variant="text" size="small">
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

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6" elevation={1}>
            <Typography variant="h6" className="font-medium mb-4">
              Application Activity
            </Typography>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body1" className="font-medium">
                    New Applications Today
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Software Engineer position
                  </Typography>
                </div>
                <Typography variant="h6" className="font-semibold">
                  8
                </Typography>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body1" className="font-medium">
                    Interviews This Week
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Various positions
                  </Typography>
                </div>
                <Typography variant="h6" className="font-semibold">
                  12
                </Typography>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body1" className="font-medium">
                    Offers Extended
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    This month
                  </Typography>
                </div>
                <Typography variant="h6" className="font-semibold">
                  5
                </Typography>
              </div>
            </div>
          </Card>

          <Card className="p-6" elevation={1}>
            <Typography variant="h6" className="font-medium mb-4">
              Top Performing Jobs
            </Typography>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body1" className="font-medium">
                    Software Engineer
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    45 applications
                  </Typography>
                </div>
                <div className={`w-16 h-2 rounded-full ${
                  isDark ? 'bg-lime/20' : 'bg-asu-maroon/20'
                }`}>
                  <div className={`h-full w-4/5 rounded-full ${
                    isDark ? 'bg-lime' : 'bg-asu-maroon'
                  }`}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body1" className="font-medium">
                    Product Manager
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    32 applications
                  </Typography>
                </div>
                <div className={`w-16 h-2 rounded-full ${
                  isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                }`}>
                  <div className={`h-full w-3/5 rounded-full ${
                    isDark ? 'bg-blue-400' : 'bg-blue-600'
                  }`}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body1" className="font-medium">
                    Data Scientist
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    28 applications
                  </Typography>
                </div>
                <div className={`w-16 h-2 rounded-full ${
                  isDark ? 'bg-green-500/20' : 'bg-green-100'
                }`}>
                  <div className={`h-full w-1/2 rounded-full ${
                    isDark ? 'bg-green-400' : 'bg-green-600'
                  }`}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}