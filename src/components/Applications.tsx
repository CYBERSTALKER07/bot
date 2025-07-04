import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  FileText, 
  Calendar, 
  MapPin, 
  Building2, 
  Eye, 
  Users, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Filter, 
  Search, 
  TrendingUp, 
  Star, 
  Sparkles, 
  Coffee, 
  Heart, 
  ExternalLink 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

interface Application {
  id: string;
  job_title: string;
  company: string;
  location: string;
  applied_date: string;
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  salary_range: string;
  job_type: string;
  notes?: string;
}

export default function Applications() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance animation
      gsap.fromTo(headerRef.current, {
        opacity: 0,
        y: -50,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.3,
        ease: 'power3.out'
      });

      // Stats cards with staggered entrance
      gsap.fromTo('.stat-card', {
        opacity: 0,
        y: 40,
        scale: 0.8,
        rotation: 2
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.8)',
        stagger: 0.12,
        delay: 0.3
      });

      // Application cards entrance
      gsap.fromTo('.application-card', {
        opacity: 0,
        y: 50,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.6
      });

      // Status badges animation
      gsap.fromTo('.status-badge', {
        scale: 0,
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
        stagger: 0.05,
        delay: 1
      });

      // Floating decorations
      gsap.to('.application-decoration', {
        y: -10,
        x: 5,
        rotation: 360,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Progress indicators
      gsap.fromTo('.progress-indicator', {
        scaleX: 0,
        opacity: 0
      }, {
        scaleX: 1,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.1,
        delay: 1.2
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const { user } = useAuth();

  // Mock applications data
  const applications: Application[] = [
    {
      id: '1',
      job_title: 'Software Engineering Intern',
      company: 'Google',
      location: 'Mountain View, CA',
      applied_date: '2024-01-15',
      status: 'interview',
      salary_range: '$8,000 - $10,000/month',
      job_type: 'Internship',
      notes: 'Technical interview scheduled for next week'
    },
    {
      id: '2',
      job_title: 'Frontend Developer',
      company: 'Microsoft',
      location: 'Seattle, WA',
      applied_date: '2024-01-10',
      status: 'reviewing',
      salary_range: '$120,000 - $150,000',
      job_type: 'Full-time',
      notes: 'Application under review by hiring team.'
    },
    {
      id: '3',
      job_title: 'Data Scientist',
      company: 'Meta',
      location: 'Menlo Park, CA',
      applied_date: '2024-01-12',
      status: 'pending',
      salary_range: '$130,000 - $180,000',
      job_type: 'Full-time',
      notes: 'Recently submitted application.'
    },
    {
      id: '4',
      job_title: 'Product Manager Intern',
      company: 'Apple',
      location: 'Cupertino, CA',
      applied_date: '2024-01-08',
      status: 'accepted',
      salary_range: '$7,500 - $9,000/month',
      job_type: 'Internship',
      notes: 'Congratulations! Start date: June 1st'
    },
    {
      id: '5',
      job_title: 'Backend Engineer',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      applied_date: '2024-01-05',
      status: 'rejected',
      salary_range: '$140,000 - $200,000',
      job_type: 'Full-time',
      notes: 'Thank you for your interest. We encourage you to apply again in the future.'
    }
  ];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'interview':
        return 'bg-purple-100 text-purple-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'reviewing':
        return <Eye className="h-4 w-4" />;
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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Application submitted ⏳';
      case 'reviewing':
        return 'Under review 👀';
      case 'interview':
        return 'Interview scheduled 🎯';
      case 'accepted':
        return 'Congratulations! 🎉';
      case 'rejected':
        return 'Not selected 💪';
      default:
        return 'Status unknown';
    }
  };

  const applicationStats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    reviewing: applications.filter(app => app.status === 'reviewing').length,
    interview: applications.filter(app => app.status === 'interview').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative">
      {/* Decorative elements */}
      <div className="application-decoration absolute top-16 right-24 w-4 h-4 bg-asu-gold/40 rounded-full"></div>
      <div className="application-decoration absolute top-32 left-16 w-3 h-3 bg-asu-maroon/30 rounded-full"></div>
      <Sparkles className="application-decoration absolute top-24 left-1/4 h-5 w-5 text-asu-gold/60" />
      <Coffee className="application-decoration absolute bottom-32 right-1/4 h-4 w-4 text-asu-maroon/50" />
      <Heart className="application-decoration absolute bottom-20 left-1/3 h-4 w-4 text-asu-gold/70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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
                Track your application progress and stay organized in your job search journey ✨
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>{applicationStats.total} applications submitted 📈</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Users className="h-5 w-5" />
                  <span>{applicationStats.interview} interviews scheduled 🎯</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Star className="h-5 w-5" />
                  <span>{applicationStats.accepted} offers received 🌟</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-12">
          <div className="stat-card bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{applicationStats.total}</p>
              <p className="text-sm font-medium text-gray-600">Total 📋</p>
            </div>
          </div>

          <div className="stat-card bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{applicationStats.pending}</p>
              <p className="text-sm font-medium text-gray-600">Pending ⏳</p>
            </div>
          </div>

          <div className="stat-card bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{applicationStats.reviewing}</p>
              <p className="text-sm font-medium text-gray-600">Reviewing 👀</p>
            </div>
          </div>

          <div className="stat-card bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{applicationStats.interview}</p>
              <p className="text-sm font-medium text-gray-600">Interview 🎯</p>
            </div>
          </div>

          <div className="stat-card bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{applicationStats.accepted}</p>
              <p className="text-sm font-medium text-gray-600">Accepted 🎉</p>
            </div>
          </div>

          <div className="stat-card bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{applicationStats.rejected}</p>
              <p className="text-sm font-medium text-gray-600">Rejected 💪</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div ref={filtersRef} className="bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100 p-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications... 🔍"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner transition-all duration-200 hover:shadow-md"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner cursor-pointer hover:shadow-md transition-all duration-200"
              >
                <option value="all">All Status 📋</option>
                <option value="pending">Pending ⏳</option>
                <option value="reviewing">Reviewing 👀</option>
                <option value="interview">Interview 🎯</option>
                <option value="accepted">Accepted 🎉</option>
                <option value="rejected">Rejected 💪</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Grid */}
        <div className="space-y-6">
          {filteredApplications.map((application) => (
            <div key={application.id} className="application-card bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 hover:text-asu-maroon transition-colors cursor-pointer">
                          {application.job_title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4" />
                            <span className="font-medium">{application.company}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">{application.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">Applied {new Date(application.applied_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className={`status-badge flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span>{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 mb-1">{application.salary_range}</p>
                      <p className="text-sm text-gray-600">{application.job_type}</p>
                    </div>
                  </div>
                </div>

                {/* Status Update Section */}
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-asu-maroon" />
                    <span className="font-semibold text-gray-900">Status Update</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    {getStatusMessage(application.status)}
                  </p>
                  {application.notes && (
                    <p className="text-gray-600 text-sm leading-relaxed italic">
                      "{application.notes}"
                    </p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <Link
                    to={`/job/${application.id}`}
                    className="flex items-center space-x-2 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Job Details</span>
                  </Link>
                  {application.status === 'interview' && (
                    <button className="flex items-center space-x-2 border-2 border-purple-500 text-purple-600 px-6 py-3 rounded-2xl hover:bg-purple-500 hover:text-white transition-all duration-300 font-semibold">
                      <Users className="h-4 w-4" />
                      <span>Interview Details</span>
                    </button>
                  )}
                  <button className="flex items-center space-x-2 border-2 border-gray-300 text-gray-600 px-6 py-3 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-semibold">
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