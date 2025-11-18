import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Eye,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  Building2,
  Star,
  Heart,
  Download,
  ExternalLink,
  Mail,
  Phone,
  FileText,
  Award,
  TrendingUp,
  Users,
  Briefcase,
  GraduationCap,
  X as XIcon,
  ThumbsUp,
  ThumbsDown,
  StarIcon,
  MoreHorizontal,
  UserCheck,
  UserX,
  Bookmark,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';
import { Card } from './ui/Card';
import PageLayout from './ui/PageLayout';
import { cn } from '../lib/cva';
import { useApplicants } from '../hooks/useOptimizedQuery';
import { PostCardSkeleton } from './ui/Skeleton';

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  avatar?: string;
  resume_url?: string;
  cover_letter: string;
  skills: string[];
  experience_years: number;
  education: string;
  gpa?: string;
  applied_date: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  job_id: string;
  job_title: string;
  rating?: number;
  notes?: string;
  university?: string;
  major?: string;
  graduation_year?: number;
  portfolio_url?: string;
}

export default function Applicants() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'rating'>('date');

  // Fetch real applicants data
  const { data: applicantsData, isLoading: loading, error } = useApplicants(jobFilter !== 'all' ? jobFilter : undefined);

  // Transform database data to component format
  const applicants: Applicant[] = applicantsData?.map(app => ({
    id: app.id,
    name: app.profiles?.full_name || 'Unknown',
    email: app.profiles?.email || '',
    phone: app.profiles?.phone,
    location: app.jobs?.location || '',
    avatar: app.profiles?.avatar_url,
    resume_url: app.resume_url,
    cover_letter: app.cover_letter || '',
    skills: app.profiles?.skills || [],
    experience_years: 0, // Add to profiles table if needed
    education: app.profiles?.university || '',
    gpa: undefined,
    applied_date: app.applied_date,
    status: app.status,
    job_id: app.job_id,
    job_title: app.jobs?.title || '',
    rating: app.rating,
    notes: app.notes,
    university: app.profiles?.university,
    major: app.profiles?.major,
    graduation_year: app.profiles?.graduation_year,
    portfolio_url: app.profiles?.portfolio_url,
  })) || [];

  // Fetch available jobs for filtering
  const jobs = React.useMemo(() => {
    const uniqueJobs = new Map();
    applicantsData?.forEach(app => {
      if (app.jobs && !uniqueJobs.has(app.job_id)) {
        uniqueJobs.set(app.job_id, { id: app.job_id, title: app.jobs.title });
      }
    });
    return Array.from(uniqueJobs.values());
  }, [applicantsData]);

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter;
    const matchesJob = jobFilter === 'all' || applicant.job_id === jobFilter;
    
    return matchesSearch && matchesStatus && matchesJob;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'date':
      default:
        return new Date(b.applied_date).getTime() - new Date(a.applied_date).getTime();
    }
  });

  const statusCounts = {
    all: applicants.length,
    pending: applicants.filter(a => a.status === 'pending').length,
    reviewed: applicants.filter(a => a.status === 'reviewed').length,
    shortlisted: applicants.filter(a => a.status === 'shortlisted').length,
    rejected: applicants.filter(a => a.status === 'rejected').length,
    hired: applicants.filter(a => a.status === 'hired').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return isDark ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-50 text-yellow-600';
      case 'reviewed': return isDark ? 'bg-info-500/10 text-info-400' : 'bg-info-50 text-info-600';
      case 'shortlisted': return isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600';
      case 'rejected': return isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600';
      case 'hired': return isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600';
      default: return isDark ? 'bg-gray-500/10 text-gray-400' : 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'reviewed': return <Eye className="h-4 w-4" />;
      case 'shortlisted': return <Star className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'hired': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = (applicantId: string, newStatus: string) => {
    // In a real app, this would make an API call
    console.log(`Updating applicant ${applicantId} status to ${newStatus}`);
  };

  if (loading) {
    return (
      <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'} maxWidth="7xl">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'} maxWidth="7xl">
        <Card className="p-8 text-center">
          <p className="text-red-600 mb-4">Error loading applicants: {error.message}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      className={isDark ? 'bg-black text-white' : 'bg-white text-black'}
      maxWidth="7xl"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Applicant Management</h1>
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Review and manage job applications from talented students
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            className={`p-4 text-center hover:shadow-lg transition-all duration-200 cursor-pointer border-b ${
              statusFilter === status 
                ? (isDark ? 'bg-info-900 border-info-700' : 'bg-info-50 border-info-200')
                : (isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200')
            }`}
            onClick={() => setStatusFilter(status)}
          >
            <div className="text-2xl font-bold mb-1">
              {count}
            </div>
            <div className={`text-sm capitalize ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {status === 'all' ? 'Total' : status}
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className={`p-6 mb-8 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search applicants by name, email, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-black placeholder-gray-500'
                }`}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className={`px-4 py-3 rounded-lg border ${
                isDark 
                  ? 'bg-gray-900 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-black'
              }`}
            >
              <option value="all">All Jobs</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'rating')}
              className={`px-4 py-3 rounded-lg border ${
                isDark 
                  ? 'bg-gray-900 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-black'
              }`}
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
            </select>

            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 transition-colors ${
                  viewMode === 'grid' 
                    ? (isDark ? 'bg-info-600 text-white' : 'bg-info-500 text-white')
                    : (isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                }`}
              >
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-2 h-2 bg-current rounded"></div>
                  <div className="w-2 h-2 bg-current rounded"></div>
                  <div className="w-2 h-2 bg-current rounded"></div>
                  <div className="w-2 h-2 bg-current rounded"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 transition-colors ${
                  viewMode === 'list' 
                    ? (isDark ? 'bg-info-600 text-white' : 'bg-info-500 text-white')
                    : (isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                }`}
              >
                <div className="space-y-1">
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Applicants Display */}
      {viewMode === 'grid' ? (
        <div className="space-y-0">
          {filteredApplicants.map((applicant) => (
            <div
              key={applicant.id}
              className={`p-6 hover:bg-gray-50/50 transition-all duration-300 cursor-pointer border-b ${
                isDark ? 'bg-black border-gray-800 hover:bg-gray-950/50' : 'bg-white border-gray-200 hover:bg-gray-50/50'
              }`}
              onClick={() => setSelectedApplicant(applicant)}
            >
              {/* Profile Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full overflow-hidden ${
                    isDark ? 'bg-gray-800' : 'bg-gray-200'
                  }`}>
                    {applicant.avatar ? (
                      <img 
                        src={applicant.avatar} 
                        alt={applicant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg font-bold">
                        {applicant.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{applicant.name}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {applicant.major} • {applicant.university}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(applicant.rating || 0) 
                          ? 'text-yellow-400 fill-current' 
                          : (isDark ? 'text-gray-600' : 'text-gray-300')
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Job Info */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-info-500 font-medium text-sm">{applicant.job_title}</span>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                    getStatusColor(applicant.status)
                  )}>
                    {getStatusIcon(applicant.status)}
                    {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{applicant.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(applicant.applied_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {applicant.skills.slice(0, 4).map((skill, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                  {applicant.skills.length > 4 && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                    }`}>
                      +{applicant.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="outlined"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedApplicant(applicant);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View with X-style borders
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Job
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-200'}`}>
                {filteredApplicants.map((applicant) => (
                  <tr 
                    key={applicant.id} 
                    className={`hover:${isDark ? 'bg-gray-950/50' : 'bg-gray-50/50'} transition-colors cursor-pointer border-b ${
                      isDark ? 'border-gray-800' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedApplicant(applicant)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full overflow-hidden ${
                          isDark ? 'bg-gray-800' : 'bg-gray-200'
                        }`}>
                          {applicant.avatar ? (
                            <img 
                              src={applicant.avatar} 
                              alt={applicant.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold">
                              {applicant.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium">{applicant.name}</div>
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {applicant.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{applicant.job_title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{new Date(applicant.applied_date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit",
                        getStatusColor(applicant.status)
                      )}>
                        {getStatusIcon(applicant.status)}
                        {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(applicant.rating || 0) 
                                ? 'text-yellow-400 fill-current' 
                                : (isDark ? 'text-gray-600' : 'text-gray-300')
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm">{applicant.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApplicant(applicant);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredApplicants.length === 0 && (
        <Card className="text-center py-12">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isDark ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No applicants found</h3>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {searchTerm || statusFilter !== 'all' || jobFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'No applications have been received yet'
            }
          </p>
          <Button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setJobFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}

      {/* Applicant Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className={`sticky top-0 z-10 backdrop-blur-xl border-b px-6 py-4 flex items-center justify-between ${
              isDark ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full overflow-hidden ${
                  isDark ? 'bg-gray-800' : 'bg-gray-200'
                }`}>
                  {selectedApplicant.avatar ? (
                    <img 
                      src={selectedApplicant.avatar} 
                      alt={selectedApplicant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                      {selectedApplicant.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedApplicant.name}</h2>
                  <p className="text-info-500 font-medium">{selectedApplicant.job_title}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(selectedApplicant.rating || 0) 
                              ? 'text-yellow-400 fill-current' 
                              : (isDark ? 'text-gray-600' : 'text-gray-300')
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm">{selectedApplicant.rating}/5</span>
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                      getStatusColor(selectedApplicant.status)
                    )}>
                      {getStatusIcon(selectedApplicant.status)}
                      {selectedApplicant.status.charAt(0).toUpperCase() + selectedApplicant.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedApplicant(null)}
              >
                <XIcon className="h-6 w-6" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Cover Letter */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Cover Letter
                    </h3>
                    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                      <p className="leading-relaxed">{selectedApplicant.cover_letter}</p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Skills & Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplicant.skills.map((skill, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isDark ? 'bg-info-900 text-info-200' : 'bg-info-100 text-info-800'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex space-x-3">
                    <Button
                      className="flex-1 bg-green-600 text-white hover:bg-green-700"
                      onClick={() => handleStatusUpdate(selectedApplicant.id, 'shortlisted')}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      variant="outlined"
                      className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                      onClick={() => handleStatusUpdate(selectedApplicant.id, 'rejected')}
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  
                  {/* Contact Info */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <a href={`mailto:${selectedApplicant.email}`} className="text-info-500 hover:underline">
                          {selectedApplicant.email}
                        </a>
                      </div>
                      {selectedApplicant.phone && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <a href={`tel:${selectedApplicant.phone}`} className="text-info-500 hover:underline">
                            {selectedApplicant.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{selectedApplicant.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Education
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{selectedApplicant.university}</p>
                      <p>{selectedApplicant.major}</p>
                      {selectedApplicant.gpa && <p>GPA: {selectedApplicant.gpa}</p>}
                      {selectedApplicant.graduation_year && <p>Class of {selectedApplicant.graduation_year}</p>}
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Experience
                    </h4>
                    <p className="text-sm">{selectedApplicant.experience_years} years of experience</p>
                  </div>

                  {/* Links */}
                  <div className="space-y-2">
                    {selectedApplicant.resume_url && (
                      <Button variant="outlined" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download Resume
                      </Button>
                    )}
                    {selectedApplicant.portfolio_url && (
                      <Button variant="outlined" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Portfolio
                      </Button>
                    )}
                    <Button className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </PageLayout>
  );
}