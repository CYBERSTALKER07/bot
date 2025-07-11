import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Filter,
  Search,
  Building2,
  FileText,
  CheckCircle,
  Clock as PendingIcon,
  X,
  MessageSquare,
  Eye,
  Share,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Application } from '../types';
import { supabase } from '../lib/supabase';
import Typography from './ui/Typography';
import Button from './ui/Button';
import { Card } from './ui/Card';
import SearchBox from './ui/SearchBox';
import Select from './ui/Select';
import StatusBadge from './ui/StatusBadge';

export default function Applications() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetchApplications();
  }, [user?.id]);

  const fetchApplications = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs!inner(
            title,
            company,
            location,
            type,
            salary_range,
            description,
            requirements
          )
        `)
        .eq('student_id', user.id)
        .order('applied_date', { ascending: false });

      if (error) throw error;

      const formattedApplications: Application[] = data?.map(app => ({
        id: app.id,
        job_id: app.job_id,
        job_title: app.jobs.title,
        company_name: app.jobs.company,
        location: app.jobs.location,
        type: app.jobs.type,
        status: app.status,
        applied_date: app.applied_date,
        salary_range: app.jobs.salary_range,
        description: app.jobs.description,
        requirements: app.jobs.requirements,
        last_updated: app.updated_at
      })) || [];

      setApplications(formattedApplications);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err instanceof Error ? err.message : 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesType = typeFilter === 'all' || app.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return isDark ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-50 text-yellow-600';
      case 'reviewed': return isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600';
      case 'interview': return isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600';
      case 'accepted': return isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600';
      case 'rejected': return isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600';
      default: return isDark ? 'bg-gray-500/10 text-gray-400' : 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'reviewed': return <Eye className="h-4 w-4" />;
      case 'interview': return <FileText className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <FileText className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    reviewed: applications.filter(a => a.status === 'reviewed').length,
    interview: applications.filter(a => a.status === 'interview').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length
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
              Loading your applications...
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
              Error Loading Applications
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-4">
              {error}
            </Typography>
            <Button onClick={fetchApplications} variant="outlined">
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
            My Applications
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Track your job applications and stay updated on your application status.
          </Typography>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {Object.entries(statusCounts).map(([status, count], index) => (
            <Card key={status} className="p-4" elevation={1}>
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                  status === 'all' 
                    ? isDark ? 'bg-lime/10 text-lime' : 'bg-asu-maroon/10 text-asu-maroon'
                    : getStatusColor(status)
                }`}>
                  {getStatusIcon(status)}
                </div>
                <Typography variant="h6" className="font-semibold mb-1">
                  {count}
                </Typography>
                <Typography variant="body2" color="textSecondary" className="capitalize text-sm">
                  {status === 'all' ? 'Total' : status}
                </Typography>
              </div>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8" elevation={1}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBox
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </div>
            <div className="flex gap-4">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  isDark 
                    ? 'border-gray-600 bg-dark-surface text-dark-text focus:ring-lime' 
                    : 'border-gray-300 bg-white text-gray-900 focus:ring-asu-maroon'
                }`}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="interview">Interview</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </Select>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  isDark 
                    ? 'border-gray-600 bg-dark-surface text-dark-text focus:ring-lime' 
                    : 'border-gray-300 bg-white text-gray-900 focus:ring-asu-maroon'
                }`}
              >
                <option value="all">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <Card className="p-12 text-center" elevation={1}>
            <FileText className={`h-16 w-16 mx-auto mb-4 ${
              isDark ? 'text-dark-muted' : 'text-gray-400'
            }`} />
            <Typography variant="h6" className="mb-2">
              No applications found
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'Try adjusting your search criteria'
                : 'Start applying to jobs to see your applications here'
              }
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ? (
                <Button 
                  variant="outlined"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setTypeFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              ) : (
                <Link to="/jobs">
                  <Button variant="contained" color="primary">
                    Browse Jobs
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="p-6 hover:shadow-lg transition-shadow" elevation={1}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white ${
                        isDark ? 'bg-lime' : 'bg-asu-maroon'
                      }`}>
                        {application.company_name.charAt(0)}
                      </div>
                      <div>
                        <Typography variant="h6" className="font-medium">
                          {application.job_title}
                        </Typography>
                        <Typography variant="subtitle1" color="primary" className="font-medium">
                          {application.company_name}
                        </Typography>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1">
                            <MapPin className={`h-4 w-4 ${isDark ? 'text-dark-muted' : 'text-gray-400'}`} />
                            <Typography variant="body2" color="textSecondary">
                              {application.location}
                            </Typography>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className={`h-4 w-4 ${isDark ? 'text-dark-muted' : 'text-gray-400'}`} />
                            <Typography variant="body2" color="textSecondary">
                              Applied {new Date(application.applied_date).toLocaleDateString()}
                            </Typography>
                          </div>
                          {application.salary_range && (
                            <div className="flex items-center space-x-1">
                              <TrendingUp className={`h-4 w-4 ${isDark ? 'text-dark-muted' : 'text-gray-400'}`} />
                              <Typography variant="body2" color="textSecondary">
                                {application.salary_range}
                              </Typography>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="capitalize">{application.status}</span>
                    </div>
                    <Button variant="text" size="small" className="min-w-0 p-2">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {application.description && (
                  <div className={`p-4 rounded-lg mb-4 ${
                    isDark ? 'bg-dark-surface' : 'bg-gray-50'
                  }`}>
                    <Typography variant="body2" color="textSecondary">
                      {application.description}
                    </Typography>
                  </div>
                )}

                {application.requirements && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {application.requirements.slice(0, 4).map((req, reqIndex) => (
                      <span
                        key={reqIndex}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isDark ? 'bg-lime/10 text-lime' : 'bg-asu-maroon/10 text-asu-maroon'
                        }`}
                      >
                        {req}
                      </span>
                    ))}
                    {application.requirements.length > 4 && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        +{application.requirements.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Building2 className={`h-4 w-4 ${isDark ? 'text-dark-muted' : 'text-gray-400'}`} />
                      <Typography variant="body2" color="textSecondary" className="capitalize">
                        {application.type.replace('-', ' ')}
                      </Typography>
                    </div>
                    <Typography variant="body2" color="textSecondary">
                      Updated {new Date(application.last_updated).toLocaleDateString()}
                    </Typography>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outlined" size="small">
                      View Details
                    </Button>
                    <Button variant="text" size="small">
                      Contact
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}