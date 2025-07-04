import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Building2, 
  Clock, 
  Eye, 
  FileText, 
  Download,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  MessageSquare,
  ArrowRight,
  Briefcase,
  TrendingUp,
  Award,
  BookOpen,
  Target,
  Users,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative">
      {/* Decorative elements */}
      <div className="applications-decoration absolute top-20 right-20 w-4 h-4 bg-asu-gold/40 rounded-full"></div>
      <div className="applications-decoration absolute top-40 left-20 w-3 h-3 bg-asu-maroon/30 rounded-full"></div>
      <Briefcase className="applications-decoration absolute top-32 right-1/4 h-6 w-6 text-asu-gold/60" />
      <Target className="applications-decoration absolute bottom-40 left-1/4 h-5 w-5 text-asu-maroon/50" />
      <Award className="applications-decoration absolute bottom-32 right-1/3 h-5 w-5 text-asu-gold/70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="applications-header mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Applications 📋</h1>
          <p className="text-gray-600">Track your job applications and their status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-asu-maroon" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reviewed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.reviewed}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Interview</p>
                <p className="text-2xl font-bold text-purple-600">{stats.interview}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="applications-filters bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 mb-8 relative overflow-hidden"
             style={{
               background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)',
               borderRadius: `${24 + Math.random() * 8}px ${28 + Math.random() * 6}px ${26 + Math.random() * 10}px ${22 + Math.random() * 8}px`
             }}>
          <div className="absolute inset-0 bg-gradient-to-br from-asu-maroon/3 via-transparent to-asu-gold/3" />
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search applications... 🔍"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent shadow-inner transition-all duration-200 hover:shadow-md"
                    style={{
                      borderRadius: `${16 + Math.random() * 4}px ${20 + Math.random() * 4}px ${18 + Math.random() * 6}px ${14 + Math.random() * 4}px`
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent shadow-inner cursor-pointer hover:shadow-md transition-all duration-200"
                  style={{
                    borderRadius: `${16 + Math.random() * 4}px ${20 + Math.random() * 4}px ${18 + Math.random() * 6}px ${14 + Math.random() * 4}px`
                  }}
                >
                  <option value="all">All Status 📋</option>
                  <option value="pending">Pending ⏳</option>
                  <option value="reviewed">Reviewed 👀</option>
                  <option value="interview">Interview 💬</option>
                  <option value="accepted">Accepted ✅</option>
                  <option value="rejected">Rejected ❌</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent shadow-inner cursor-pointer hover:shadow-md transition-all duration-200"
                  style={{
                    borderRadius: `${16 + Math.random() * 4}px ${20 + Math.random() * 4}px ${18 + Math.random() * 6}px ${14 + Math.random() * 4}px`
                  }}
                >
                  <option value="all">All Types 📝</option>
                  <option value="internship">Internship 🎓</option>
                  <option value="full-time">Full-time 💼</option>
                  <option value="part-time">Part-time ⏰</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent shadow-inner cursor-pointer hover:shadow-md transition-all duration-200"
                  style={{
                    borderRadius: `${16 + Math.random() * 4}px ${20 + Math.random() * 4}px ${18 + Math.random() * 6}px ${14 + Math.random() * 4}px`
                  }}
                >
                  <option value="date">Sort by Date 📅</option>
                  <option value="status">Sort by Status 🔄</option>
                  <option value="company">Sort by Company 🏢</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {sortedApplications.map((application, index) => (
            <div key={application.id} className="application-card bg-white/85 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative group"
                 style={{
                   background: 'linear-gradient(150deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)',
                   borderRadius: `${20 + Math.random() * 10}px ${25 + Math.random() * 8}px ${22 + Math.random() * 12}px ${18 + Math.random() * 10}px`,
                   transform: `rotate(${(index % 3 - 1) * 0.3}deg)`
                 }}>
              <div className="absolute inset-0 bg-gradient-to-br from-asu-maroon/3 via-transparent to-asu-gold/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="p-8 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-16 h-16 bg-gradient-to-br from-asu-maroon/80 to-asu-maroon-dark shadow-lg flex items-center justify-center text-white font-bold text-xl"
                          style={{
                            borderRadius: `${15 + Math.random() * 8}px ${20 + Math.random() * 6}px ${18 + Math.random() * 10}px ${14 + Math.random() * 8}px`,
                            transform: `rotate(${index % 2 === 0 ? 3 : -3}deg)`
                          }}
                        >
                          {application.company_name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 hover:text-asu-maroon transition-colors cursor-pointer">
                            {application.job_title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4" />
                              <span className="font-medium">{application.company_name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{application.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Applied {new Date(application.applied_date).toLocaleDateString()}</span>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getTypeColor(application.type)} backdrop-blur-sm`}>
                        {application.type} {application.type === 'internship' ? '🎓' : application.type === 'full-time' ? '💼' : '⏰'}
                      </span>
                    </div>

                    {application.description && (
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2 leading-relaxed opacity-90">
                        {application.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-sm ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span>{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                      </span>
                    </div>
                    <div className="text-right">
                      {application.salary_range && (
                        <p className="text-lg font-bold text-gray-900 mb-1">{application.salary_range}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        Updated {new Date(application.last_updated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <Link
                    to={`/job/${application.job_id}`}
                    className="flex items-center space-x-2 bg-gradient-to-r from-asu-maroon/90 to-asu-maroon-dark/90 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md backdrop-blur-sm"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Job Details</span>
                  </Link>
                  {application.status === 'interview' && (
                    <button className="flex items-center space-x-2 border-2 border-purple-500 text-purple-600 px-6 py-3 rounded-2xl hover:bg-purple-500 hover:text-white transition-all duration-300 font-semibold backdrop-blur-sm">
                      <Users className="h-4 w-4" />
                      <span>Interview Details</span>
                    </button>
                  )}
                  <button className="flex items-center space-x-2 border-2 border-gray-300 text-gray-600 px-6 py-3 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-semibold backdrop-blur-sm">
                    <FileText className="h-4 w-4" />
                    <span>Add Notes</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No applications found</h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Try adjusting your search criteria or start applying to more positions! 🚀
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-8 py-4 rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold shadow-lg"
              >
                Clear Filters 🔄
              </button>
              <Link
                to="/jobs"
                className="border-2 border-asu-maroon text-asu-maroon px-8 py-4 rounded-2xl hover:bg-asu-maroon hover:text-white transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
              >
                Browse Jobs 🔍
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}