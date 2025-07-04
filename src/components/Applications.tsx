import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar, 
  Building2, 
  MapPin, 
  Clock, 
  Star, 
  Eye,
  Download,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Sparkles,
  Coffee,
  TrendingUp,
  Heart,
  Share2,
  ExternalLink,
  BarChart3,
  Award,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'interview' | 'offer' | 'rejected';
  jobType: 'full-time' | 'part-time' | 'internship' | 'contract';
  salary: string;
  description: string;
  requirements: string[];
  applicationNotes: string;
  interviewDate?: string;
  lastUpdate: string;
  companyLogo: string;
  priority: 'high' | 'medium' | 'low';
  matchScore: number;
}

export default function Applications() {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const applicationsRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance animation
      gsap.fromTo(headerRef.current, {
        opacity: 0,
        y: -60,
        scale: 0.8,
        rotation: -2
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 1.5,
        ease: 'power3.out'
      });

      // Stats cards entrance
      gsap.fromTo(statsRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.3
      });

      // Filters entrance
      gsap.fromTo(filtersRef.current, {
        opacity: 0,
        y: 40,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.5
      });

      // Application cards entrance
      gsap.fromTo('.application-card', {
        opacity: 0,
        y: 60,
        scale: 0.9,
        rotation: 2
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 1,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        delay: 0.7
      });

      // Floating decorations
      gsap.to('.application-decoration', {
        y: -12,
        x: 6,
        rotation: 360,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Status indicators animation
      gsap.to('.status-indicator', {
        scale: 1.1,
        opacity: 0.8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const mockApplications: Application[] = [
    {
      id: '1',
      jobTitle: 'Software Engineer Intern',
      company: 'Google',
      location: 'Mountain View, CA',
      appliedDate: '2024-01-15',
      status: 'interview',
      jobType: 'internship',
      salary: '$8,000/month',
      description: 'Join our team of world-class engineers building products used by billions of people.',
      requirements: ['Computer Science', 'Python', 'JavaScript', 'Algorithms'],
      applicationNotes: 'Applied through career fair. Had great conversation with recruiter.',
      interviewDate: '2024-02-10',
      lastUpdate: '2024-02-05',
      companyLogo: '🏢',
      priority: 'high',
      matchScore: 95
    },
    {
      id: '2',
      jobTitle: 'Data Analyst',
      company: 'Microsoft',
      location: 'Seattle, WA',
      appliedDate: '2024-01-20',
      status: 'reviewed',
      jobType: 'full-time',
      salary: '$90,000/year',
      description: 'Analyze complex data sets to drive business decisions and insights.',
      requirements: ['Statistics', 'SQL', 'Python', 'Data Visualization'],
      applicationNotes: 'Found through LinkedIn. Matches my data science background perfectly.',
      lastUpdate: '2024-02-01',
      companyLogo: '💻',
      priority: 'high',
      matchScore: 88
    },
    {
      id: '3',
      jobTitle: 'UX Designer',
      company: 'Apple',
      location: 'Cupertino, CA',
      appliedDate: '2024-01-10',
      status: 'offer',
      jobType: 'full-time',
      salary: '$110,000/year',
      description: 'Design intuitive and beautiful user experiences for millions of users.',
      requirements: ['Design', 'Figma', 'User Research', 'Prototyping'],
      applicationNotes: 'Portfolio review went well. Excited about the design culture.',
      lastUpdate: '2024-02-08',
      companyLogo: '🎨',
      priority: 'high',
      matchScore: 92
    },
    {
      id: '4',
      jobTitle: 'Marketing Intern',
      company: 'Netflix',
      location: 'Los Angeles, CA',
      appliedDate: '2024-01-25',
      status: 'pending',
      jobType: 'internship',
      salary: '$6,000/month',
      description: 'Support marketing campaigns and analyze user engagement metrics.',
      requirements: ['Marketing', 'Analytics', 'Communication', 'Creative'],
      applicationNotes: 'Interested in their content marketing strategy.',
      lastUpdate: '2024-01-25',
      companyLogo: '📺',
      priority: 'medium',
      matchScore: 78
    },
    {
      id: '5',
      jobTitle: 'Finance Analyst',
      company: 'Goldman Sachs',
      location: 'New York, NY',
      appliedDate: '2024-01-05',
      status: 'rejected',
      jobType: 'full-time',
      salary: '$120,000/year',
      description: 'Analyze financial markets and provide investment recommendations.',
      requirements: ['Finance', 'Excel', 'Bloomberg', 'Financial Modeling'],
      applicationNotes: 'Challenging interview process. Good learning experience.',
      lastUpdate: '2024-01-30',
      companyLogo: '💰',
      priority: 'medium',
      matchScore: 82
    }
  ];

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
    reviewed: { color: 'bg-blue-100 text-blue-800', icon: Eye, label: 'Reviewed' },
    interview: { color: 'bg-purple-100 text-purple-800', icon: Users, label: 'Interview' },
    offer: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Offer' },
    rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' }
  };

  const priorityConfig = {
    high: { color: 'bg-red-100 text-red-700', label: 'High' },
    medium: { color: 'bg-yellow-100 text-yellow-700', label: 'Medium' },
    low: { color: 'bg-green-100 text-green-700', label: 'Low' }
  };

  const filteredApplications = mockApplications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const matchesType = selectedType === 'all' || app.jobType === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      case 'company':
        return a.company.localeCompare(b.company);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'match':
        return b.matchScore - a.matchScore;
      default:
        return 0;
    }
  });

  // Statistics
  const stats = {
    total: mockApplications.length,
    pending: mockApplications.filter(app => app.status === 'pending').length,
    interviews: mockApplications.filter(app => app.status === 'interview').length,
    offers: mockApplications.filter(app => app.status === 'offer').length,
    avgMatchScore: Math.round(mockApplications.reduce((sum, app) => sum + app.matchScore, 0) / mockApplications.length)
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || AlertCircle;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative">
      {/* Decorative elements */}
      <div className="application-decoration absolute top-20 right-20 w-4 h-4 bg-asu-gold/40 rounded-full"></div>
      <div className="application-decoration absolute top-40 left-20 w-3 h-3 bg-asu-maroon/30 rounded-full"></div>
      <Sparkles className="application-decoration absolute top-32 left-1/4 h-5 w-5 text-asu-gold/60" />
      <Coffee className="application-decoration absolute bottom-32 right-1/3 h-4 w-4 text-asu-maroon/50" />
      <TrendingUp className="application-decoration absolute bottom-20 left-1/4 h-4 w-4 text-asu-gold/70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4 relative">
                My Applications 📝
                <div className="absolute -top-3 -right-8 w-6 h-6 bg-asu-gold rounded-full"></div>
              </h1>
              <p className="text-xl text-white/90 mb-6 max-w-3xl">
                Track your job applications and stay organized in your career journey ✨
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Application tracking 📊</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Target className="h-5 w-5" />
                  <span>Status updates 🎯</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Award className="h-5 w-5" />
                  <span>Match scoring 🏆</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div ref={statsRef} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-asu-maroon/10 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-asu-maroon" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Interviews</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.interviews}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Offers</p>
                  <p className="text-3xl font-bold text-green-600">{stats.offers}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Match</p>
                  <p className="text-3xl font-bold text-asu-maroon">{stats.avgMatchScore}%</p>
                </div>
                <div className="w-12 h-12 bg-asu-maroon/10 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-asu-maroon" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div ref={filtersRef} className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">Filter Applications</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">View:</span>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    viewMode === 'list' 
                      ? 'bg-asu-maroon text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    viewMode === 'grid' 
                      ? 'bg-asu-maroon text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Grid
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applications... 🔍"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="company">Sort by Company</option>
                  <option value="status">Sort by Status</option>
                  <option value="match">Sort by Match Score</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div ref={applicationsRef} className="space-y-6">
          {sortedApplications.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {sortedApplications.map((application) => (
                <div
                  key={application.id}
                  className={`application-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Application Content */}
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-asu-maroon/20 to-asu-gold/20 rounded-full flex items-center justify-center text-xl">
                          {application.companyLogo}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {application.jobTitle}
                          </h3>
                          <p className="text-asu-maroon font-semibold">{application.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityConfig[application.priority].color}`}>
                          {priorityConfig[application.priority].label}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">{application.matchScore}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-asu-maroon" />
                        <span>{application.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-asu-maroon" />
                        <span>Applied: {formatDate(application.appliedDate)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Building2 className="h-4 w-4 text-asu-maroon" />
                        <span>{application.jobType} • {application.salary}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {application.description}
                    </p>

                    {application.applicationNotes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700 italic">
                          "{application.applicationNotes}"
                        </p>
                      </div>
                    )}

                    {/* Status and Actions */}
                    <div className="flex items-center justify-between">
                      <div className={`status-indicator flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium ${statusConfig[application.status].color}`}>
                        {getStatusIcon(application.status)}
                        <span>{statusConfig[application.status].label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-500 hover:text-asu-maroon hover:bg-asu-maroon/10 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-asu-maroon hover:bg-asu-maroon/10 rounded-lg transition-colors">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Interview Date */}
                    {application.interviewDate && (
                      <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center space-x-2 text-purple-700">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Interview: {formatDate(application.interviewDate)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-asu-maroon/20 to-asu-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-12 w-12 text-asu-maroon" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No applications found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your search criteria or start applying to jobs! 🚀
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}