import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  Star, 
  Eye,
  MessageCircle,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Mail,
  Phone,
  ExternalLink,
  Award,
  Target,
  TrendingUp,
  Sparkles,
  Coffee,
  Heart,
  BookOpen,
  Code,
  Palette,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  university: string;
  major: string;
  graduationYear: number;
  gpa: number;
  appliedDate: string;
  status: 'new' | 'reviewed' | 'interview' | 'hired' | 'rejected';
  jobTitle: string;
  resumeUrl: string;
  portfolioUrl?: string;
  skills: string[];
  experience: string[];
  avatar: string;
  matchScore: number;
  notes: string;
  interviewDate?: string;
  rating: number;
  coverLetter: string;
}

export default function Applicants() {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const applicantsRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedJob, setSelectedJob] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

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

      // Applicant cards entrance
      gsap.fromTo('.applicant-card', {
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
      gsap.to('.applicant-decoration', {
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

  const mockApplicants: Applicant[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      university: 'Stanford University',
      major: 'Computer Science',
      graduationYear: 2024,
      gpa: 3.8,
      appliedDate: '2024-02-01',
      status: 'interview',
      jobTitle: 'Software Engineer Intern',
      resumeUrl: '/resume-sarah.pdf',
      portfolioUrl: 'https://sarah-portfolio.com',
      skills: ['React', 'Node.js', 'Python', 'AWS', 'MongoDB'],
      experience: ['Internship at Meta', 'TA for CS106A', 'Hackathon Winner'],
      avatar: '👩‍💻',
      matchScore: 95,
      notes: 'Excellent technical skills and strong communication.',
      interviewDate: '2024-02-15',
      rating: 5,
      coverLetter: 'I am excited to apply for the Software Engineer Intern position...'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '(555) 987-6543',
      location: 'Seattle, WA',
      university: 'University of Washington',
      major: 'Data Science',
      graduationYear: 2024,
      gpa: 3.9,
      appliedDate: '2024-01-28',
      status: 'reviewed',
      jobTitle: 'Data Analyst',
      resumeUrl: '/resume-michael.pdf',
      skills: ['Python', 'SQL', 'Tableau', 'Machine Learning', 'Statistics'],
      experience: ['Research Assistant', 'Data Science Bootcamp', 'Kaggle Competitions'],
      avatar: '👨‍🔬',
      matchScore: 92,
      notes: 'Strong analytical skills and research background.',
      rating: 4,
      coverLetter: 'As a passionate data scientist, I am thrilled to apply...'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '(555) 456-7890',
      location: 'Los Angeles, CA',
      university: 'UCLA',
      major: 'Design',
      graduationYear: 2024,
      gpa: 3.7,
      appliedDate: '2024-01-30',
      status: 'new',
      jobTitle: 'UX Designer',
      resumeUrl: '/resume-emily.pdf',
      portfolioUrl: 'https://emily-design.com',
      skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
      experience: ['Design Intern at Adobe', 'Freelance UI/UX', 'Design Competition Winner'],
      avatar: '🎨',
      matchScore: 88,
      notes: 'Creative portfolio with strong user-centered design approach.',
      rating: 5,
      coverLetter: 'I am passionate about creating intuitive user experiences...'
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david.kim@email.com',
      phone: '(555) 321-0987',
      location: 'Austin, TX',
      university: 'UT Austin',
      major: 'Business Administration',
      graduationYear: 2024,
      gpa: 3.6,
      appliedDate: '2024-01-25',
      status: 'hired',
      jobTitle: 'Marketing Intern',
      resumeUrl: '/resume-david.pdf',
      skills: ['Marketing', 'Analytics', 'Social Media', 'Content Creation'],
      experience: ['Marketing Club President', 'Social Media Manager', 'Startup Intern'],
      avatar: '📈',
      matchScore: 85,
      notes: 'Great leadership experience and marketing acumen.',
      rating: 4,
      coverLetter: 'With my background in marketing and leadership...'
    },
    {
      id: '5',
      name: 'Jessica Wang',
      email: 'jessica.wang@email.com',
      phone: '(555) 654-3210',
      location: 'Boston, MA',
      university: 'MIT',
      major: 'Electrical Engineering',
      graduationYear: 2024,
      gpa: 3.9,
      appliedDate: '2024-01-20',
      status: 'rejected',
      jobTitle: 'Hardware Engineer',
      resumeUrl: '/resume-jessica.pdf',
      skills: ['Circuit Design', 'MATLAB', 'PCB Design', 'Embedded Systems'],
      experience: ['Research Lab Assistant', 'IEEE Member', 'Robotics Team'],
      avatar: '⚡',
      matchScore: 78,
      notes: 'Strong technical background but looking for different role focus.',
      rating: 3,
      coverLetter: 'As an electrical engineering student with passion for hardware...'
    }
  ];

  const statusConfig = {
    new: { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'New' },
    reviewed: { color: 'bg-yellow-100 text-yellow-800', icon: Eye, label: 'Reviewed' },
    interview: { color: 'bg-purple-100 text-purple-800', icon: Users, label: 'Interview' },
    hired: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Hired' },
    rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' }
  };

  const jobTitles = Array.from(new Set(mockApplicants.map(app => app.jobTitle)));

  const filteredApplicants = mockApplicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'all' || applicant.status === selectedStatus;
    const matchesJob = selectedJob === 'all' || applicant.jobTitle === selectedJob;
    
    return matchesSearch && matchesStatus && matchesJob;
  });

  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'match':
        return b.matchScore - a.matchScore;
      case 'gpa':
        return b.gpa - a.gpa;
      default:
        return 0;
    }
  });

  // Statistics
  const stats = {
    total: mockApplicants.length,
    new: mockApplicants.filter(app => app.status === 'new').length,
    interviews: mockApplicants.filter(app => app.status === 'interview').length,
    hired: mockApplicants.filter(app => app.status === 'hired').length,
    avgMatchScore: Math.round(mockApplicants.reduce((sum, app) => sum + app.matchScore, 0) / mockApplicants.length)
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
    const Icon = config?.icon || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const handleStatusChange = (applicantId: string, newStatus: string) => {
    // Animation for status change
    gsap.to(`.applicant-card-${applicantId}`, {
      scale: 1.05,
      duration: 0.2,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative">
      {/* Decorative elements */}
      <div className="applicant-decoration absolute top-20 right-20 w-4 h-4 bg-asu-gold/40 rounded-full"></div>
      <div className="applicant-decoration absolute top-40 left-20 w-3 h-3 bg-asu-maroon/30 rounded-full"></div>
      <Sparkles className="applicant-decoration absolute top-32 left-1/4 h-5 w-5 text-asu-gold/60" />
      <Coffee className="applicant-decoration absolute bottom-32 right-1/3 h-4 w-4 text-asu-maroon/50" />
      <TrendingUp className="applicant-decoration absolute bottom-20 left-1/4 h-4 w-4 text-asu-gold/70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4 relative">
                Job Applicants 👥
                <div className="absolute -top-3 -right-8 w-6 h-6 bg-asu-gold rounded-full"></div>
              </h1>
              <p className="text-xl text-white/90 mb-6 max-w-3xl">
                Review and manage candidates for your posted positions ✨
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Candidate tracking 📊</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Target className="h-5 w-5" />
                  <span>Smart matching 🎯</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Award className="h-5 w-5" />
                  <span>Talent assessment 🏆</span>
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
                  <p className="text-sm text-gray-600 mb-1">Total Applicants</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-asu-maroon/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-asu-maroon" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">New Applications</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.new}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
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
                  <p className="text-sm text-gray-600 mb-1">Hired</p>
                  <p className="text-3xl font-bold text-green-600">{stats.hired}</p>
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
                <h3 className="text-lg font-semibold text-gray-900">Filter Applicants</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">View:</span>
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
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applicants... 🔍"
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
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="interview">Interview</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Job Filter */}
              <div>
                <select
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                >
                  <option value="all">All Positions</option>
                  {jobTitles.map(job => (
                    <option key={job} value={job}>{job}</option>
                  ))}
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
                  <option value="name">Sort by Name</option>
                  <option value="status">Sort by Status</option>
                  <option value="match">Sort by Match Score</option>
                  <option value="gpa">Sort by GPA</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Applicants Grid/List */}
        <div ref={applicantsRef} className="space-y-6">
          {sortedApplicants.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {sortedApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className={`applicant-card applicant-card-${applicant.id} bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Applicant Content */}
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-asu-maroon/20 to-asu-gold/20 rounded-full flex items-center justify-center text-xl">
                          {applicant.avatar}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {applicant.name}
                          </h3>
                          <p className="text-asu-maroon font-semibold">{applicant.jobTitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">{applicant.matchScore}%</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <GraduationCap className="h-4 w-4 text-asu-maroon" />
                        <span>{applicant.university} • {applicant.major}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-asu-maroon" />
                        <span>Class of {applicant.graduationYear} • GPA: {applicant.gpa}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-asu-maroon" />
                        <span>{applicant.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-asu-maroon" />
                        <span>Applied: {formatDate(applicant.appliedDate)}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {applicant.skills.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-asu-maroon/10 text-asu-maroon text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {applicant.skills.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{applicant.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Experience</h4>
                      <div className="space-y-1">
                        {applicant.experience.slice(0, 2).map((exp, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <Building2 className="h-3 w-3 text-asu-maroon" />
                            <span>{exp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < applicant.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`status-indicator flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium ${statusConfig[applicant.status].color}`}>
                        {getStatusIcon(applicant.status)}
                        <span>{statusConfig[applicant.status].label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-500 hover:text-asu-maroon hover:bg-asu-maroon/10 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-asu-maroon hover:bg-asu-maroon/10 rounded-lg transition-colors">
                          <MessageCircle className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-asu-maroon hover:bg-asu-maroon/10 rounded-lg transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-asu-maroon" />
                        <span>{applicant.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-asu-maroon" />
                        <span>{applicant.phone}</span>
                      </div>
                      {applicant.portfolioUrl && (
                        <div className="flex items-center space-x-2">
                          <ExternalLink className="h-4 w-4 text-asu-maroon" />
                          <a href={applicant.portfolioUrl} className="text-asu-maroon hover:underline">
                            Portfolio
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Interview Date */}
                    {applicant.interviewDate && (
                      <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center space-x-2 text-purple-700">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Interview: {formatDate(applicant.interviewDate)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {applicant.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 italic">
                          "{applicant.notes}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-asu-maroon/20 to-asu-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-asu-maroon" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No applicants found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your search criteria or check back later for new applications! 🔍
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}