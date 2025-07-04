import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Heart, 
  Building2, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Star, 
  Coffee, 
  Sparkles, 
  TrendingUp, 
  Award, 
  Send, 
  FileText, 
  Download,
  ExternalLink,
  Bookmark,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Application {
  id: string;
  job_title: string;
  company: string;
  location: string;
  applied_date: string;
  status: 'pending' | 'reviewing' | 'interview' | 'rejected' | 'accepted';
  type: 'internship' | 'full-time' | 'part-time';
  salary?: string;
  notes?: string;
}

export default function Applications() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading with smooth entrance
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const applications = [
    {
      id: '1',
      job_title: 'Software Engineering Intern',
      company: 'Google',
      company_logo: '/logos/google.png',
      location: 'Mountain View, CA',
      salary_range: '$8,000 - $10,000/month',
      type: 'internship',
      applied_date: '2024-01-15',
      status: 'interview',
      deadline: '2024-02-15',
      description: 'Join our world-class engineering team...',
      tags: ['React', 'Python', 'Machine Learning']
    },
    {
      id: '2',
      job_title: 'Product Marketing Intern',
      company: 'Microsoft',
      company_logo: '/logos/microsoft.png',
      location: 'Seattle, WA',
      salary_range: '$7,500 - $9,000/month',
      type: 'internship',
      applied_date: '2024-01-20',
      status: 'pending',
      deadline: '2024-02-20',
      description: 'Drive product strategy and marketing...',
      tags: ['Marketing', 'Analytics', 'Strategy']
    },
    // ...more applications
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'interview':
        return 'bg-blue-100 text-blue-800 border-blue-200';
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
      case 'interview':
        return <Users className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesType = typeFilter === 'all' || app.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    interviews: applications.filter(app => app.status === 'interview').length,
    accepted: applications.filter(app => app.status === 'accepted').length
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-white relative ${isLoaded ? 'animate-fade-in' : ''}`}>
      {/* Decorative elements with animations */}
      <div className="absolute top-16 right-24 w-4 h-4 bg-asu-gold/40 rounded-full animate-float"></div>
      <div className="absolute top-32 left-16 w-3 h-3 bg-asu-maroon/30 rounded-full animate-float animate-delay-200"></div>
      <Sparkles className="absolute top-24 left-1/4 h-5 w-5 text-asu-gold/60 animate-bounce-gentle" />
      <Coffee className="absolute bottom-32 right-1/4 h-4 w-4 text-asu-maroon/50 animate-float animate-delay-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with slide animation */}
        <div className="mb-12 animate-slide-up">
          <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-3xl p-8 text-white relative overflow-hidden hover-glow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4 relative">
                My Applications 📋
                <div className="absolute -top-3 -right-8 w-6 h-6 bg-asu-gold rounded-full animate-pulse-gentle"></div>
              </h1>
              <p className="text-xl text-white/90 mb-6 max-w-3xl">
                Track your internship and job applications in one place. Stay organized and never miss an opportunity! 🚀
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover-scale">
                  <Briefcase className="h-5 w-5" />
                  <span>{stats.total} total applications 📈</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover-scale">
                  <Users className="h-5 w-5" />
                  <span>{stats.interviews} interviews scheduled 🎯</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover-scale">
                  <Star className="h-5 w-5" />
                  <span>Track your progress 📊</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard with staggered animations */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 interactive-card animate-slide-up animate-delay-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center icon-bounce">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-blue-600 text-sm bg-blue-50 rounded-full px-3 py-1 w-fit">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>Keep applying! 📈</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 interactive-card animate-slide-up animate-delay-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Review</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center icon-bounce">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-yellow-600 text-sm bg-yellow-50 rounded-full px-3 py-1 w-fit">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>In review ⏳</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 interactive-card animate-slide-up animate-delay-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Interviews</p>
                <p className="text-3xl font-bold text-gray-900">{stats.interviews}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center icon-bounce">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-purple-600 text-sm bg-purple-50 rounded-full px-3 py-1 w-fit">
              <Star className="h-4 w-4 mr-1" />
              <span>Great progress! 🌟</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 interactive-card animate-slide-up animate-delay-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Accepted</p>
                <p className="text-3xl font-bold text-gray-900">{stats.accepted}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center icon-bounce">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600 text-sm bg-green-50 rounded-full px-3 py-1 w-fit">
              <Award className="h-4 w-4 mr-1" />
              <span>Congratulations! 🎉</span>
            </div>
          </div>
        </div>

        {/* Filters with slide animation */}
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100 p-8 mb-12 animate-slide-left">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications... 🔍"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner transition-all duration-200 hover:shadow-md input-focus"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner cursor-pointer hover:shadow-md transition-all duration-200 input-focus"
                >
                  <option value="all">All Status 📋</option>
                  <option value="pending">Pending ⏳</option>
                  <option value="interview">Interview 💼</option>
                  <option value="accepted">Accepted ✅</option>
                  <option value="rejected">Rejected ❌</option>
                </select>
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner cursor-pointer hover:shadow-md transition-all duration-200 input-focus"
              >
                <option value="all">All Types</option>
                <option value="internship">Internships 🎓</option>
                <option value="fulltime">Full-time 💼</option>
                <option value="parttime">Part-time ⏰</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List with staggered animations */}
        <div className="space-y-6">
          {filteredApplications.map((application, index) => (
            <div 
              key={application.id} 
              className={`bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden interactive-card animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg hover-scale">
                      <Building2 className="h-8 w-8 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900 hover:text-asu-maroon transition-colors cursor-pointer">
                          {application.job_title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(application.status)}
                            <span className="capitalize">{application.status}</span>
                          </div>
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-asu-maroon mb-2">{application.company}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 hover-scale">
                          <MapPin className="h-4 w-4" />
                          <span>{application.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 hover-scale">
                          <DollarSign className="h-4 w-4" />
                          <span>{application.salary_range}</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 hover-scale">
                          <Calendar className="h-4 w-4" />
                          <span>Applied {new Date(application.applied_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 hover-scale">
                          <Clock className="h-4 w-4" />
                          <span>Deadline {new Date(application.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 leading-relaxed">{application.description}</p>
                      
                      {application.tags && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {application.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-3 py-1 bg-gradient-to-r from-asu-maroon/10 to-asu-gold/10 text-asu-maroon rounded-full text-xs font-medium hover:from-asu-maroon/20 hover:to-asu-gold/20 transition-all duration-200 cursor-pointer hover-scale"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-2">Days since applied</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.floor((new Date().getTime() - new Date(application.applied_date).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="interactive-button bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-6 py-3 rounded-2xl hover:shadow-lg font-semibold shadow-md flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  
                  <button className="interactive-button border-2 border-asu-maroon text-asu-maroon px-6 py-3 rounded-2xl hover:bg-asu-maroon hover:text-white font-semibold shadow-sm hover:shadow-md flex items-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>Follow Up</span>
                  </button>
                  
                  <button className="interactive-button border border-gray-300 text-gray-600 px-4 py-3 rounded-2xl hover:bg-gray-50 flex items-center justify-center">
                    <FileText className="h-4 w-4" />
                  </button>
                  
                  <button className="interactive-button border border-gray-300 text-gray-600 px-4 py-3 rounded-2xl hover:bg-gray-50 flex items-center justify-center">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100 animate-scale-in">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce-gentle">
              <Briefcase className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {applications.length === 0 ? 'No applications yet' : 'No matching applications'}
            </h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              {applications.length === 0 
                ? "Ready to start your career journey? Browse available opportunities and apply today! 🚀"
                : "Try adjusting your search criteria to find your applications! 🔍"
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {applications.length === 0 ? (
                <button className="interactive-button bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-8 py-4 rounded-2xl hover:shadow-xl font-semibold shadow-lg">
                  Browse Jobs 🔍
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setTypeFilter('all');
                  }}
                  className="interactive-button bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-8 py-4 rounded-2xl hover:shadow-xl font-semibold shadow-lg"
                >
                  Clear Filters 🔄
                </button>
              )}
              <button className="interactive-button border-2 border-asu-maroon text-asu-maroon px-8 py-4 rounded-2xl hover:bg-asu-maroon hover:text-white font-semibold shadow-sm hover:shadow-md">
                View All Applications 📋
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}