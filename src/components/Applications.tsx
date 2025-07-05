import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Assignment,
  Work,
  Business,
  LocationOn,
  AccessTime,
  TrendingUp,
  Search,
  FilterList,
  Bookmark,
  Share,
  Visibility,
  Apply as ApplyIcon,
  CheckCircle,
  Schedule
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import Typography from './ui/Typography';
import Button from './ui/Button';
import Input from './ui/Input';
import { Card } from './ui/Card';

interface Application {
  id: string;
  job_id: string;
  job_title: string;
  company_name: string;
  company_logo?: string;
  location: string;
  type: 'internship' | 'full-time' | 'part-time';
  status: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
  applied_date: string;
  salary_range?: string;
  description?: string;
  requirements?: string[];
  last_updated: string;
}

export default function Applications() {
  const { isDark } = useTheme();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    // Mock applications data
    const mockApplications: Application[] = [
      {
        id: '1',
        job_id: '1',
        job_title: 'Software Engineering Intern',
        company_name: 'Tech Corp',
        location: 'San Francisco, CA',
        type: 'internship',
        status: 'interview',
        applied_date: '2024-01-15T08:00:00Z',
        salary_range: '$25-35/hour',
        description: 'Join our dynamic development team and work on cutting-edge projects.',
        requirements: ['React', 'Node.js', 'TypeScript', 'Git'],
        last_updated: '2024-01-18T14:30:00Z'
      },
      {
        id: '2',
        job_id: '2',
        job_title: 'Full Stack Developer',
        company_name: 'Innovation Labs',
        location: 'Remote',
        type: 'full-time',
        status: 'accepted',
        applied_date: '2024-01-10T09:15:00Z',
        salary_range: '$80,000-100,000',
        description: 'Build scalable web applications with modern technologies.',
        requirements: ['JavaScript', 'Python', 'AWS', 'Docker'],
        last_updated: '2024-01-20T11:45:00Z'
      },
      {
        id: '3',
        job_id: '3',
        job_title: 'UX Designer',
        company_name: 'Creative Studio',
        location: 'Los Angeles, CA',
        type: 'part-time',
        status: 'pending',
        applied_date: '2024-01-12T16:20:00Z',
        salary_range: '$30-40/hour',
        description: 'Design intuitive user experiences for mobile and web applications.',
        requirements: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
        last_updated: '2024-01-12T16:20:00Z'
      },
      {
        id: '4',
        job_id: '4',
        job_title: 'Data Science Intern',
        company_name: 'Analytics Plus',
        location: 'Phoenix, AZ',
        type: 'internship',
        status: 'rejected',
        applied_date: '2024-01-08T11:30:00Z',
        salary_range: '$20-28/hour',
        description: 'Analyze large datasets and build predictive models.',
        requirements: ['Python', 'R', 'SQL', 'Machine Learning'],
        last_updated: '2024-01-16T09:00:00Z'
      }
    ];

    setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    const matchesType = typeFilter === 'all' || application.type === typeFilter;
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
      case 'pending': return <Schedule className="h-4 w-4" />;
      case 'reviewed': return <Visibility className="h-4 w-4" />;
      case 'interview': return <Assignment className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <Assignment className="h-4 w-4" />;
      default: return <Schedule className="h-4 w-4" />;
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
          <div className="flex items-center justify-center h-64">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
              isDark ? 'border-lime' : 'border-asu-maroon'
            }`}></div>
          </div>
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
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startIcon={<Search />}
                variant="outlined"
                fullWidth
              />
            </div>
            <div className="flex gap-4">
              <select
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
              </select>
              <select
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
              </select>
            </div>
          </div>
        </Card>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <Card className="p-12 text-center" elevation={1}>
            <Assignment className={`h-16 w-16 mx-auto mb-4 ${
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
                            <LocationOn className={`h-4 w-4 ${isDark ? 'text-dark-muted' : 'text-gray-400'}`} />
                            <Typography variant="body2" color="textSecondary">
                              {application.location}
                            </Typography>
                          </div>
                          <div className="flex items-center space-x-1">
                            <AccessTime className={`h-4 w-4 ${isDark ? 'text-dark-muted' : 'text-gray-400'}`} />
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
                      <Business className={`h-4 w-4 ${isDark ? 'text-dark-muted' : 'text-gray-400'}`} />
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