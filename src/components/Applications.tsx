import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { 
  Search, 
  Filter, 
  Eye, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Building2, 
  Star, 
  Heart, 
  Coffee, 
  Sparkles, 
  ChevronRight,
  Clock,
  User,
  Briefcase,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

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
  cover_letter?: string;
  resume_url?: string;
  last_updated: string;
}

export default function Applications() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'internship' | 'full-time' | 'part-time'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'company'>('date');

  useEffect(() => {
    // Mock applications data - replace with Supabase fetch
    const mockApplications: Application[] = [
      {
        id: '1',
        job_id: '1',
        job_title: 'Software Engineering Intern',
        company_name: 'Tech Corp',
        company_logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
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
        company_logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150',
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
        company_logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150',
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
        company_logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=150',
        location: 'Phoenix, AZ',
        type: 'internship',
        status: 'rejected',
        applied_date: '2024-01-08T11:30:00Z',
        salary_range: '$20-28/hour',
        description: 'Analyze large datasets and build predictive models.',
        requirements: ['Python', 'R', 'SQL', 'Machine Learning'],
        last_updated: '2024-01-16T09:00:00Z'
      },
      {
        id: '5',
        job_id: '5',
        job_title: 'Marketing Coordinator',
        company_name: 'Brand Agency',
        company_logo: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=150',
        location: 'New York, NY',
        type: 'full-time',
        status: 'reviewed',
        applied_date: '2024-01-14T13:45:00Z',
        salary_range: '$45,000-55,000',
        description: 'Execute marketing campaigns and analyze performance metrics.',
        requirements: ['Social Media', 'Google Analytics', 'Content Creation', 'SEO'],
        last_updated: '2024-01-19T10:15:00Z'
      }
    ];

    setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.applications-header', {
        y: -50,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.fromTo('.applications-filters', {
        y: 30,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
      });

      gsap.fromTo('.application-card', {
        y: 30,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.4
      });

      // Floating decorations
      gsap.to('.applications-decoration', {
        y: -20,
        x: 15,
        rotation: 360,
        duration: 25,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, [applications]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'interview':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'reviewed':
        return <Eye className="h-4 w-4" />;
      case 'interview':
        return <MessageSquare className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'internship':
        return 'bg-blue-100 text-blue-800';
      case 'full-time':
        return 'bg-green-100 text-green-800';
      case 'part-time':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesType = typeFilter === 'all' || app.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.applied_date).getTime() - new Date(a.applied_date).getTime();
      case 'status':
        return a.status.localeCompare(b.status);
      case 'company':
        return a.company_name.localeCompare(b.company_name);
      default:
        return 0;
    }
  });

  const getStatusStats = () => {
    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      reviewed: applications.filter(app => app.status === 'reviewed').length,
      interview: applications.filter(app => app.status === 'interview').length,
      accepted: applications.filter(app => app.status === 'accepted').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };
    return stats;
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-asu-maroon" />
          <span className="text-gray-700 font-medium">Loading your applications...</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`min-h-screen relative ${
      isDark ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      {/* Remove decorative elements */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div ref={headerRef} className="mb-12">
          <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4 relative">
                My Applications 📋
                <div className="absolute -top-3 -right-8 w-6 h-6 bg-asu-gold rounded-full"></div>
              </h1>
              <p className="text-xl text-white/90 mb-6 max-w-3xl">
                Track your job applications and stay updated on your application status ✨
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Briefcase className="h-5 w-5" />
                  <span>{applications.length} total applications 📊</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Clock className="h-5 w-5" />
                  <span>{applications.filter(app => app.status === 'pending').length} pending applications ⏳</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>{applications.filter(app => app.status === 'accepted').length} accepted applications 🎉</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {Object.entries(statusCounts).map(([status, count], index) => (
            <div 
              key={status} 
              className={`stat-card ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 cursor-pointer`}
              // ...existing mouse events...
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-asu-maroon/20 to-asu-gold/20 rounded-full flex items-center justify-center">
                  {getStatusIcon(status)}
                </div>
                <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>{count}</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium capitalize`}>
                  {status === 'all' ? 'Total 📋' : status + ' ' + (status === 'pending' ? '⏳' : status === 'accepted' ? '🎉' : status === 'rejected' ? '❌' : '👀')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Filters */}
        <div ref={filtersRef} className={`${isDark ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' : 'bg-gradient-to-r from-white to-gray-50 border-gray-100'} rounded-3xl shadow-lg border p-8 mb-12`}>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications... 🔍"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 border-2 ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-900'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent shadow-inner transition-all duration-200 hover:shadow-md`}
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-4 border-2 ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-900'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent shadow-inner cursor-pointer hover:shadow-md transition-all duration-200`}
              >
                <option value="all">All Status 📋</option>
                <option value="pending">Pending ⏳</option>
                <option value="accepted">Accepted 🎉</option>
                <option value="rejected">Rejected ❌</option>
                <option value="interview">Interview 👀</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-4 py-4 border-2 ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-900'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent shadow-inner cursor-pointer hover:shadow-md transition-all duration-200`}
              >
                <option value="date">Sort by Date 📅</option>
                <option value="company">Sort by Company 🏢</option>
                <option value="status">Sort by Status 📊</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Applications List */}
        <div ref={contentRef} className="space-y-6">
          {filteredApplications.map((application, index) => (
            <div
              key={application.id}
              className={`application-card ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl shadow-lg border hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer`}
              // ...existing mouse events...
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {application.company.charAt(0)}
                    </div>
                    <div>
                      <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>{application.job_title}</h3>
                      <p className="text-asu-maroon font-semibold text-lg">{application.company_name}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{application.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Applied {new Date(application.applied_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`status-badge px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(application.status)}
                        <span className="capitalize">{application.status}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewApplication(application)}
                      className={`p-3 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-full transition-colors duration-200`}
                    >
                      <Eye className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-6 mb-6`}>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                    {application.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {application.requirements.slice(0, 4).map((req, reqIndex) => (
                    <span
                      key={reqIndex}
                      className="requirement-tag px-4 py-2 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white rounded-full text-sm font-medium shadow-md"
                    >
                      {req}
                    </span>
                  ))}
                  {application.requirements.length > 4 && (
                    <span className={`px-4 py-2 ${isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'} rounded-full text-sm font-medium`}>
                      +{application.requirements.length - 4} more
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{application.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{application.salary_range}</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleViewApplication(application)}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white rounded-full hover:shadow-lg transition-all duration-200 font-semibold"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => handleMessage(application)}
                      className={`flex items-center space-x-2 px-6 py-3 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-full transition-all duration-200 font-semibold`}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`modal-content ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="p-8">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {selectedApplication.company.charAt(0)}
                  </div>
                  <div>
                    <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>{selectedApplication.job_title}</h2>
                    <p className="text-asu-maroon font-semibold text-xl">{selectedApplication.company_name}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{selectedApplication.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Applied {new Date(selectedApplication.applied_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`status-badge px-6 py-3 rounded-full text-sm font-semibold ${getStatusColor(selectedApplication.status)}`}>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedApplication.status)}
                      <span className="capitalize">{selectedApplication.status}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className={`p-3 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-full transition-colors duration-200`}
                  >
                    <XCircle className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Job Description</h3>
                  <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-6 mb-6`}>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                      {selectedApplication.description}
                    </p>
                  </div>

                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Requirements</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedApplication.requirements.map((req, reqIndex) => (
                      <span
                        key={reqIndex}
                        className="requirement-tag px-4 py-2 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white rounded-full text-sm font-medium shadow-md"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Application Details</h3>
                  <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-6 space-y-4`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Job Type:</span>
                      <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedApplication.type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Salary:</span>
                      <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedApplication.salary_range}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Application Date:</span>
                      <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>{new Date(selectedApplication.applied_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Status:</span>
                      <span className="capitalize">{selectedApplication.status}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <button
                      onClick={() => handleMessage(selectedApplication)}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white rounded-full hover:shadow-lg transition-all duration-200 font-semibold"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>Send Message</span>
                    </button>
                    <button
                      onClick={handleCloseModal}
                      className={`w-full flex items-center justify-center space-x-2 px-6 py-4 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-full transition-all duration-200 font-semibold`}
                    >
                      <span>Close</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}