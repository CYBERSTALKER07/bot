import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Users, 
  Eye, 
  MessageSquare, 
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  Loader2
} from 'lucide-react';
import { useJobs } from '../../hooks/useJobs';
import { useAuth } from '../../context/AuthContext';
import { StatsCard, Card } from '../ui/Card';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const { jobs, loading, error } = useJobs();
  
  // Filter jobs for current employer
  const myJobs = jobs.filter(job => job.employer_id === user?.id);
  const totalApplications = 0; // Would come from applications table
  const pendingApplications = 0; // Would come from applications table

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-asu-maroon" />
          <span className="ml-2 text-gray-700 font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-md">
          <strong>Error loading dashboard:</strong> {error}
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Employer Dashboard</h1>
            <p className="text-gray-700">Manage your job postings and connect with talented ASU students</p>
          </div>
          <Link
            to="/post-job"
            className="mt-4 sm:mt-0 bg-asu-maroon text-white px-6 py-3 rounded-md hover:bg-asu-maroon-dark transition-colors flex items-center space-x-2 font-medium"
          >
            <Plus className="h-5 w-5" />
            <span>Post New Job</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Active Jobs"
          value={myJobs.length}
          icon={Users}
          subtitle="Your job postings"
          color="blue"
          delay={0.2}
          rotation={1}
        />
        <StatsCard
          title="Total Applications"
          value={totalApplications}
          icon={Eye}
          subtitle="Candidates interested"
          color="green"
          delay={0.4}
          rotation={-1}
        />
        <StatsCard
          title="Pending Review"
          value={pendingApplications}
          icon={Clock}
          subtitle="Awaiting your response"
          color="yellow"
          delay={0.6}
          rotation={0.5}
        />
        <StatsCard
          title="Messages"
          value={0}
          icon={MessageSquare}
          subtitle="Candidate communications"
          color="purple"
          delay={0.8}
          rotation={-0.5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Job Postings */}
        <Card className="transform rotate-0.5" delay={1}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Your Job Postings</h2>
              <Link
                to="/post-job"
                className="text-asu-maroon hover:text-asu-maroon-dark text-sm font-medium"
              >
                Post New Job
              </Link>
            </div>
          </div>
          <div className="p-6">
            {myJobs.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
                <p className="text-gray-600 mb-4">Start by posting your first job opportunity</p>
                <Link
                  to="/post-job"
                  className="bg-asu-maroon text-white px-4 py-2 rounded-md hover:bg-asu-maroon-dark transition-colors font-medium"
                >
                  Post Your First Job
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myJobs.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.type === 'internship' ? 'bg-blue-100 text-blue-800' :
                        job.type === 'full-time' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {job.type.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-700 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Posted {new Date(job.posted_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{job.applicants_count || 0} applicants</span>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/applicants?job=${job.id}`}
                          className="text-asu-maroon hover:text-asu-maroon-dark text-sm font-medium"
                        >
                          View Applicants
                        </Link>
                        <Link
                          to={`/job/${job.id}/edit`}
                          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
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
        <Card className="transform -rotate-0.5" delay={1.2}>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
              <p className="text-gray-600">Activity will appear here as students interact with your job postings</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8 transform rotate-0.3" delay={1.4}>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/post-job"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-6 w-6 text-asu-maroon" />
              <div>
                <h3 className="font-medium text-gray-900">Post a Job</h3>
                <p className="text-sm text-gray-600">Create a new job posting</p>
              </div>
            </Link>
            
            <Link
              to="/applicants"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-6 w-6 text-asu-maroon" />
              <div>
                <h3 className="font-medium text-gray-900">Review Applicants</h3>
                <p className="text-sm text-gray-600">Manage applications</p>
              </div>
            </Link>
            
            <Link
              to="/messages"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="h-6 w-6 text-asu-maroon" />
              <div>
                <h3 className="font-medium text-gray-900">Messages</h3>
                <p className="text-sm text-gray-600">Connect with students</p>
              </div>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}