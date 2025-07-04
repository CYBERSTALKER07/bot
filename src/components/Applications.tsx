import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Calendar,
  MapPin,
  Building2,
  Filter,
  Search,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Application, Job } from '../types';

interface ApplicationWithJob extends Application {
  job: Job;
}

export default function Applications() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock applications data
  const applications: ApplicationWithJob[] = [
    {
      id: '1',
      job_id: '1',
      student_id: 'student-1',
      status: 'reviewed',
      applied_date: '2024-01-10',
      cover_letter: 'I am very interested in this position...',
      created_at: '2024-01-10',
      updated_at: '2024-01-12',
      job: {
        id: '1',
        title: 'Software Engineering Intern',
        company: 'Intel Corporation',
        type: 'internship',
        location: 'Phoenix, AZ',
        salary: '$25-30/hour',
        description: 'Join our software engineering team...',
        requirements: [],
        skills: ['Python', 'Java', 'React'],
        posted_date: '2024-01-05',
        deadline: '2024-03-01',
        applicants_count: 127,
        employer_id: 'employer-1',
        created_at: '2024-01-05',
        updated_at: '2024-01-05'
      }
    },
    {
      id: '2',
      job_id: '2',
      student_id: 'student-1',
      status: 'pending',
      applied_date: '2024-01-12',
      created_at: '2024-01-12',
      updated_at: '2024-01-12',
      job: {
        id: '2',
        title: 'Frontend Developer Intern',
        company: 'Microsoft',
        type: 'internship',
        location: 'Remote',
        salary: '$28-32/hour',
        description: 'Work on modern web applications...',
        requirements: [],
        skills: ['React', 'TypeScript', 'CSS'],
        posted_date: '2024-01-08',
        deadline: '2024-02-28',
        applicants_count: 89,
        employer_id: 'employer-2',
        created_at: '2024-01-08',
        updated_at: '2024-01-08'
      }
    },
    {
      id: '3',
      job_id: '3',
      student_id: 'student-1',
      status: 'accepted',
      applied_date: '2024-01-08',
      created_at: '2024-01-08',
      updated_at: '2024-01-15',
      job: {
        id: '3',
        title: 'Data Science Intern',
        company: 'Apple',
        type: 'internship',
        location: 'Cupertino, CA',
        salary: '$30-35/hour',
        description: 'Analyze user behavior data...',
        requirements: [],
        skills: ['Python', 'Machine Learning', 'SQL'],
        posted_date: '2024-01-03',
        deadline: '2024-02-15',
        applicants_count: 156,
        employer_id: 'employer-3',
        created_at: '2024-01-03',
        updated_at: '2024-01-03'
      }
    },
    {
      id: '4',
      job_id: '4',
      student_id: 'student-1',
      status: 'rejected',
      applied_date: '2024-01-05',
      created_at: '2024-01-05',
      updated_at: '2024-01-14',
      job: {
        id: '4',
        title: 'Marketing Intern',
        company: 'Google',
        type: 'internship',
        location: 'Mountain View, CA',
        salary: '$26-30/hour',
        description: 'Support digital marketing campaigns...',
        requirements: [],
        skills: ['Marketing', 'Analytics', 'Communication'],
        posted_date: '2024-01-01',
        deadline: '2024-02-01',
        applicants_count: 203,
        employer_id: 'employer-4',
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }
    }
  ];

  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.job.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'reviewed':
        return <Eye className="h-5 w-5 text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Under Review';
      case 'reviewed':
        return 'Reviewed';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Not Selected';
      default:
        return status;
    }
  };

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    reviewed: applications.filter(app => app.status === 'reviewed').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">Track the status of your job applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{statusCounts.all}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.reviewed}</div>
            <div className="text-sm text-gray-600">Reviewed</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.accepted}</div>
            <div className="text-sm text-gray-600">Accepted</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
            <div className="text-sm text-gray-600">Not Selected</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Not Selected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {filteredApplications.map((application) => (
          <div key={application.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        <Link 
                          to={`/job/${application.job.id}`}
                          className="hover:text-asu-maroon transition-colors"
                        >
                          {application.job.title}
                        </Link>
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span className="text-lg text-gray-700 font-medium">{application.job.company}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(application.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {getStatusText(application.status)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{application.job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Applied {new Date(application.applied_date).toLocaleDateString()}</span>
                    </div>
                    {application.job.salary && (
                      <div className="flex items-center space-x-1">
                        <span>{application.job.salary}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      application.job.type === 'internship' ? 'bg-blue-100 text-blue-800' :
                      application.job.type === 'full-time' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application.job.type.replace('-', ' ').toUpperCase()}
                    </span>
                    {application.job.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                    {application.job.skills.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        +{application.job.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  {application.status === 'accepted' && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <h4 className="font-medium text-green-900">Congratulations!</h4>
                          <p className="text-sm text-green-700">
                            Your application has been accepted. Check your email for next steps.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {application.status === 'rejected' && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <div>
                          <h4 className="font-medium text-red-900">Application Not Selected</h4>
                          <p className="text-sm text-red-700">
                            Thank you for your interest. We encourage you to apply for other positions.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 lg:ml-6 mt-4 lg:mt-0">
                  <Link
                    to={`/job/${application.job.id}`}
                    className="border border-asu-maroon text-asu-maroon px-4 py-2 rounded-md hover:bg-asu-maroon hover:text-white transition-colors text-center flex items-center justify-center space-x-2"
                  >
                    <span>View Job</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  {(application.status === 'reviewed' || application.status === 'accepted') && (
                    <Link
                      to="/messages"
                      className="bg-asu-maroon text-white px-4 py-2 rounded-md hover:bg-asu-maroon-dark transition-colors text-center flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Message</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600 mb-4">
            {statusFilter === 'all' 
              ? "You haven't applied to any jobs yet. Start exploring opportunities!"
              : `No applications with ${getStatusText(statusFilter).toLowerCase()} status found.`
            }
          </p>
          <Link
            to="/dashboard"
            className="bg-asu-maroon text-white px-6 py-2 rounded-md hover:bg-asu-maroon-dark transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      )}
    </div>
  );
}