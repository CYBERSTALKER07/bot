import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Add,
  People,
  Visibility,
  Message,
  TrendingUp,
  CalendarToday,
  LocationOn,
  AccessTime,
  Refresh,
  Work,
  Assessment,
  Event,
  Dashboard,
  Business,
  Assignment
} from '@mui/icons-material';
import { useJobs } from '../../hooks/useJobs';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
// import { Badge } from '../ui/Badge';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { jobs, loading, error } = useJobs();
  
  // Filter jobs for current employer
  const myJobs = jobs.filter(job => job.employer_id === user?.id);
  const totalApplications = 0; // Would come from applications table
  const pendingApplications = 0; // Would come from applications table

  const stats = [
    { 
      title: 'Active Jobs', 
      value: myJobs.length.toString(), 
      change: '+2 this week', 
      icon: <Work className="w-6 h-6" />,
      color: 'primary'
    },
    { 
      title: 'Total Applicants', 
      value: '248', 
      change: '+15 this week', 
      icon: <People className="w-6 h-6" />,
      color: 'success'
    },
    { 
      title: 'Interviews Scheduled', 
      value: '8', 
      change: '+3 this week', 
      icon: <Event className="w-6 h-6" />,
      color: 'info'
    },
    { 
      title: 'Hires Made', 
      value: '5', 
      change: '+1 this month', 
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'warning'
    },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className={`animate-spin rounded-full h-12 w-12 border-4 border-t-transparent ${
              isDark ? 'border-lime' : 'border-asu-maroon'
            }`}></div>
            <p className={`text-lg font-medium ${
              isDark ? 'text-dark-text' : 'text-gray-700'
            }`}>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`p-6 rounded-2xl border-l-4 ${
          isDark 
            ? 'bg-red-900/20 border-red-500 text-red-300' 
            : 'bg-red-50 border-red-400 text-red-800'
        }`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${
              isDark ? 'bg-red-500/20' : 'bg-red-100'
            }`}>
              <Assessment className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium">Error Loading Dashboard</h3>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}>
              Employer Dashboard
            </h1>
            <p className={`text-lg ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}>
              Manage your job postings and connect with talented ASU students
            </p>
          </div>
          <Link
            to="/post-job"
            className={`mt-4 sm:mt-0 inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg ${
              isDark 
                ? 'bg-lime text-dark-surface hover:bg-lime/90 shadow-lg' 
                : 'bg-asu-maroon text-white hover:bg-asu-maroon/90 shadow-lg'
            }`}
          >
            <Add className="w-5 h-5 mr-2" />
            Post New Job
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}>
                  {stat.title}
                </p>
                <p className={`text-3xl font-bold mt-1 ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>
                  {stat.value}
                </p>
                <p className={`text-sm mt-1 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                isDark 
                  ? 'bg-lime/20 text-lime' 
                  : 'bg-asu-maroon/10 text-asu-maroon'
              }`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Job Postings */}
        <Card className="overflow-hidden">
          <div className={`p-6 border-b ${
            isDark ? 'border-lime/20' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-semibold ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}>
                Your Job Postings
              </h2>
              <Link
                to="/post-job"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isDark ? 'text-lime hover:text-lime/80' : 'text-asu-maroon hover:text-asu-maroon/80'
                }`}
              >
                Post New Job
              </Link>
            </div>
          </div>
          <div className="p-6">
            {myJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-lime/20' : 'bg-asu-maroon/10'
                }`}>
                  <Work className={`w-8 h-8 ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`} />
                </div>
                <h3 className={`text-xl font-medium mb-2 ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>
                  No job postings yet
                </h3>
                <p className={`text-base mb-6 ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}>
                  Start by posting your first job opportunity
                </p>
                <Link
                  to="/post-job"
                  className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                    isDark 
                      ? 'bg-lime text-dark-surface hover:bg-lime/90' 
                      : 'bg-asu-maroon text-white hover:bg-asu-maroon/90'
                  }`}
                >
                  <Add className="w-5 h-5 mr-2" />
                  Post Your First Job
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myJobs.map((job) => (
                  <div key={job.id} className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-md ${
                    isDark 
                      ? 'border-lime/20 bg-dark-surface hover:border-lime/40' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className={`text-lg font-semibold ${
                        isDark ? 'text-dark-text' : 'text-gray-900'
                      }`}>
                        {job.title}
                      </h3>
                      <Badge 
                        variant={job.type === 'internship' ? 'info' : job.type === 'full-time' ? 'success' : 'warning'}
                        className="capitalize"
                      >
                        {job.type.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className={`flex items-center space-x-4 text-sm mb-4 ${
                      isDark ? 'text-dark-muted' : 'text-gray-600'
                    }`}>
                      <div className="flex items-center space-x-1">
                        <LocationOn className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarToday className="w-4 h-4" />
                        <span>Posted {new Date(job.posted_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center space-x-1 text-sm ${
                        isDark ? 'text-dark-muted' : 'text-gray-600'
                      }`}>
                        <People className="w-4 h-4" />
                        <span>{job.applicants_count || 0} applicants</span>
                      </div>
                      <div className="flex space-x-3">
                        <Link
                          to={`/applicants?job=${job.id}`}
                          className={`text-sm font-medium transition-colors duration-200 ${
                            isDark ? 'text-lime hover:text-lime/80' : 'text-asu-maroon hover:text-asu-maroon/80'
                          }`}
                        >
                          View Applicants
                        </Link>
                        <Link
                          to={`/job/${job.id}/edit`}
                          className={`text-sm font-medium transition-colors duration-200 ${
                            isDark ? 'text-dark-muted hover:text-dark-text' : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="overflow-hidden">
          <div className={`p-6 border-b ${
            isDark ? 'border-lime/20' : 'border-gray-200'
          }`}>
            <h2 className={`text-xl font-semibold ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}>
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isDark ? 'bg-lime/20' : 'bg-asu-maroon/10'
              }`}>
                <Assessment className={`w-8 h-8 ${
                  isDark ? 'text-lime' : 'text-asu-maroon'
                }`} />
              </div>
              <h3 className={`text-xl font-medium mb-2 ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}>
                No recent activity
              </h3>
              <p className={`text-base ${
                isDark ? 'text-dark-muted' : 'text-gray-600'
              }`}>
                Activity will appear here as students interact with your job postings
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <div className="p-6">
          <h2 className={`text-xl font-semibold mb-6 ${
            isDark ? 'text-dark-text' : 'text-gray-900'
          }`}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/post-job"
              className={`group flex items-center space-x-4 p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                isDark 
                  ? 'border-lime/20 hover:border-lime/40 bg-dark-surface' 
                  : 'border-gray-200 hover:border-asu-maroon/30 bg-white'
              }`}
            >
              <div className={`p-3 rounded-full ${
                isDark ? 'bg-lime/20 text-lime' : 'bg-asu-maroon/10 text-asu-maroon'
              }`}>
                <Add className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`font-semibold ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>
                  Post a Job
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}>
                  Create a new job posting
                </p>
              </div>
            </Link>
            
            <Link
              to="/applicants"
              className={`group flex items-center space-x-4 p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                isDark 
                  ? 'border-lime/20 hover:border-lime/40 bg-dark-surface' 
                  : 'border-gray-200 hover:border-asu-maroon/30 bg-white'
              }`}
            >
              <div className={`p-3 rounded-full ${
                isDark ? 'bg-lime/20 text-lime' : 'bg-asu-maroon/10 text-asu-maroon'
              }`}>
                <People className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`font-semibold ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>
                  Review Applicants
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}>
                  Manage applications
                </p>
              </div>
            </Link>
            
            <Link
              to="/messages"
              className={`group flex items-center space-x-4 p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                isDark 
                  ? 'border-lime/20 hover:border-lime/40 bg-dark-surface' 
                  : 'border-gray-200 hover:border-asu-maroon/30 bg-white'
              }`}
            >
              <div className={`p-3 rounded-full ${
                isDark ? 'bg-lime/20 text-lime' : 'bg-asu-maroon/10 text-asu-maroon'
              }`}>
                <Message className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`font-semibold ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>
                  Messages
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}>
                  Connect with students
                </p>
              </div>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}