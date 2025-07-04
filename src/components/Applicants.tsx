import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  User, 
  Search, 
  Filter, 
  Eye, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  MapPin, 
  Building2, 
  Star, 
  Heart, 
  Coffee, 
  Sparkles, 
  Download, 
  ExternalLink, 
  Mail, 
  Phone, 
  FileText, 
  Award, 
  TrendingUp, 
  Users, 
  Briefcase 
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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
}

export default function Applicants() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data for applicants
  const applicants: Applicant[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@asu.edu',
      phone: '(480) 555-0123',
      location: 'Phoenix, AZ',
      resume_url: '/resumes/sarah-johnson.pdf',
      cover_letter: 'I am excited to apply for the Software Engineer position. My experience with React and Node.js makes me a perfect fit...',
      skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS'],
      experience_years: 2,
      education: 'Arizona State University - Computer Science',
      gpa: '3.8',
      applied_date: '2024-01-15',
      status: 'pending',
      job_id: '1',
      job_title: 'Software Engineer Intern',
      rating: 4.5
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@asu.edu',
      phone: '(480) 555-0456',
      location: 'Tempe, AZ',
      resume_url: '/resumes/michael-chen.pdf',
      cover_letter: 'As a passionate developer with experience in full-stack development, I believe I would be a valuable addition to your team...',
      skills: ['JavaScript', 'React', 'MongoDB', 'Express', 'Docker'],
      experience_years: 1,
      education: 'Arizona State University - Software Engineering',
      gpa: '3.6',
      applied_date: '2024-01-12',
      status: 'reviewed',
      job_id: '1',
      job_title: 'Software Engineer Intern',
      rating: 4.2
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@asu.edu',
      location: 'Scottsdale, AZ',
      resume_url: '/resumes/emily-rodriguez.pdf',
      cover_letter: 'I am thrilled to apply for the Marketing Intern position. My creative background and analytical skills...',
      skills: ['Marketing', 'Adobe Creative Suite', 'Social Media', 'Analytics', 'Content Creation'],
      experience_years: 1,
      education: 'Arizona State University - Marketing',
      gpa: '3.9',
      applied_date: '2024-01-10',
      status: 'shortlisted',
      job_id: '2',
      job_title: 'Marketing Intern',
      rating: 4.8
    },
    {
      id: '4',
      name: 'David Park',
      email: 'david.park@asu.edu',
      phone: '(480) 555-0789',
      location: 'Mesa, AZ',
      resume_url: '/resumes/david-park.pdf',
      cover_letter: 'With my strong background in data analysis and machine learning, I am excited to contribute to your data science team...',
      skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Tableau', 'Pandas'],
      experience_years: 2,
      education: 'Arizona State University - Data Science',
      gpa: '3.7',
      applied_date: '2024-01-08',
      status: 'hired',
      job_id: '3',
      job_title: 'Data Science Intern',
      rating: 4.6
    }
  ];

  const jobs = [
    { id: '1', title: 'Software Engineer Intern' },
    { id: '2', title: 'Marketing Intern' },
    { id: '3', title: 'Data Science Intern' }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance animation - more sophisticated
      gsap.fromTo(headerRef.current, {
        opacity: 0,
        y: -80,
        scale: 0.8,
        rotation: 2
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.8)'
      });

      // Stats cards entrance with stagger
      gsap.fromTo('.stat-card', {
        opacity: 0,
        y: 50,
        scale: 0.7,
        rotation: 5
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        stagger: 0.1,
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
        duration: 1,
        ease: 'power3.out',
        delay: 0.6
      });

      // Applicant cards entrance with advanced stagger
      gsap.fromTo('.applicant-card', {
        opacity: 0,
        y: 60,
        scale: 0.8,
        rotation: 3
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        stagger: {
          amount: 1.2,
          grid: 'auto',
          from: 'start'
        },
        delay: 0.9
      });

      // Floating decorations with different patterns
      gsap.to('.applicant-decoration', {
        y: -15,
        x: 8,
        rotation: 360,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          amount: 2,
          repeat: -1
        }
      });

      // Rating stars animation
      gsap.fromTo('.rating-star', {
        scale: 0,
        rotation: -180
      }, {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        stagger: 0.05,
        delay: 1.5
      });

      // Skills tags animation
      gsap.fromTo('.skill-tag', {
        opacity: 0,
        scale: 0,
        y: 20
      }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: 'back.out(1.7)',
        stagger: 0.03,
        delay: 1.8
      });

      // Status badges animation
      gsap.fromTo('.status-badge', {
        scale: 0,
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.8)',
        stagger: 0.1,
        delay: 2
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Animation for view mode change
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, {
        opacity: 0,
        y: 20
      }, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out'
      });
    }
  }, [viewMode]);

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.job_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter;
    const matchesJob = jobFilter === 'all' || applicant.job_id === jobFilter;
    
    return matchesSearch && matchesStatus && matchesJob;
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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const updateApplicantStatus = (applicantId: string, newStatus: string) => {
    // Enhanced status update animation
    gsap.to(`#applicant-${applicantId}`, {
      scale: 1.05,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(`#applicant-${applicantId} .status-badge`, {
          scale: 1.2,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: 'back.out(1.7)'
        });
      }
    });
  };

  const handleViewApplicant = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    
    // Modal entrance animation
    setTimeout(() => {
      gsap.fromTo('.modal-content', {
        scale: 0.8,
        opacity: 0,
        y: 50
      }, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'back.out(1.7)'
      });
    }, 10);
  };

  const handleCloseModal = () => {
    // Modal exit animation
    gsap.to('.modal-content', {
      scale: 0.8,
      opacity: 0,
      y: 50,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => setSelectedApplicant(null)
    });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative">
      {/* Enhanced decorative elements */}
      <div className="applicant-decoration absolute top-16 right-24 w-4 h-4 bg-asu-gold/50 rounded-full"></div>
      <div className="applicant-decoration absolute top-32 left-16 w-3 h-3 bg-asu-maroon/40 rounded-full"></div>
      <Sparkles className="applicant-decoration absolute top-24 left-1/4 h-5 w-5 text-asu-gold/70" />
      <Coffee className="applicant-decoration absolute bottom-32 right-1/4 h-4 w-4 text-asu-maroon/60" />
      <Heart className="applicant-decoration absolute bottom-20 left-1/3 h-4 w-4 text-asu-gold/80" />
      <Award className="applicant-decoration absolute top-1/2 right-12 h-3 w-3 text-asu-maroon/50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div ref={headerRef} className="mb-12">
          <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4 relative">
                Applicant Management 👥
                <div className="absolute -top-3 -right-8 w-6 h-6 bg-asu-gold rounded-full"></div>
              </h1>
              <p className="text-xl text-white/90 mb-6 max-w-3xl">
                Review and manage job applications from talented ASU students ✨
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>{applicants.length} total applications 📈</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Users className="h-5 w-5" />
                  <span>{statusCounts.shortlisted} shortlisted candidates 🎯</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>{statusCounts.hired} hired successfully 🌟</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-12">
          {Object.entries(statusCounts).map(([status, count], index) => (
            <div 
              key={status} 
              className="stat-card bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1.05,
                  y: -5,
                  duration: 0.3,
                  ease: 'power2.out'
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  y: 0,
                  duration: 0.3,
                  ease: 'power2.out'
                });
              }}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-asu-maroon/20 to-asu-gold/20 rounded-full flex items-center justify-center">
                  {getStatusIcon(status)}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{count}</div>
                <div className="text-sm text-gray-600 font-medium capitalize">
                  {status === 'all' ? 'Total 📋' : status + ' ' + (status === 'pending' ? '⏳' : status === 'reviewed' ? '👀' : status === 'shortlisted' ? '⭐' : status === 'hired' ? '🎉' : '❌')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Filters */}
        <div ref={filtersRef} className="bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100 p-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for amazing talent... 🔍"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner transition-all duration-200 hover:shadow-md"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner cursor-pointer hover:shadow-md transition-all duration-200"
              >
                <option value="all">All Status 📋</option>
                <option value="pending">Pending ⏳</option>
                <option value="reviewed">Reviewed 👀</option>
                <option value="shortlisted">Shortlisted ⭐</option>
                <option value="rejected">Rejected ❌</option>
                <option value="hired">Hired 🎉</option>
              </select>
              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner cursor-pointer hover:shadow-md transition-all duration-200"
              >
                <option value="all">All Jobs 💼</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
              <div className="flex border-2 border-gray-200 rounded-2xl overflow-hidden bg-white shadow-inner">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-6 py-4 font-semibold transition-all duration-300 ${viewMode === 'grid' ? 'bg-asu-maroon text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  Grid View 📊
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-6 py-4 font-semibold transition-all duration-300 ${viewMode === 'list' ? 'bg-asu-maroon text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  List View 📋
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Applicants Content */}
        <div ref={contentRef}>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredApplicants.map((applicant, index) => (
                <div
                  key={applicant.id}
                  id={`applicant-${applicant.id}`}
                  className="applicant-card bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1.02,
                      y: -5,
                      duration: 0.3,
                      ease: 'power2.out'
                    });
                    gsap.to(e.currentTarget.querySelector('.applicant-avatar'), {
                      scale: 1.1,
                      duration: 0.3,
                      ease: 'power2.out'
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1,
                      y: 0,
                      duration: 0.3,
                      ease: 'power2.out'
                    });
                    gsap.to(e.currentTarget.querySelector('.applicant-avatar'), {
                      scale: 1,
                      duration: 0.3,
                      ease: 'power2.out'
                    });
                  }}
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="applicant-avatar w-16 h-16 bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {applicant.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 mb-1">{applicant.name}</h3>
                          <p className="text-sm text-asu-maroon font-semibold">{applicant.job_title}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`rating-star h-5 w-5 ${i < Math.floor(applicant.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 font-medium">{applicant.location}</span>
                      </div>
                      <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 font-medium">Applied {new Date(applicant.applied_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 font-medium">{applicant.experience_years} years experience</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {applicant.skills.slice(0, 3).map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="skill-tag px-4 py-2 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white rounded-full text-sm font-medium shadow-md"
                        >
                          {skill}
                        </span>
                      ))}
                      {applicant.skills.length > 3 && (
                        <span className="skill-tag px-4 py-2 bg-gray-100 text-gray-500 rounded-full text-sm font-medium border border-gray-200">
                          +{applicant.skills.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div className={`status-badge flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md ${getStatusColor(applicant.status)}`}>
                        {getStatusIcon(applicant.status)}
                        <span className="capitalize">{applicant.status}</span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleViewApplicant(applicant)}
                        className="flex-1 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 font-semibold"
                        onMouseEnter={(e) => {
                          gsap.to(e.currentTarget, {
                            scale: 1.05,
                            duration: 0.2,
                            ease: 'power2.out'
                          });
                        }}
                        onMouseLeave={(e) => {
                          gsap.to(e.currentTarget, {
                            scale: 1,
                            duration: 0.2,
                            ease: 'power2.out'
                          });
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                      <button 
                        className="px-4 py-3 border-2 border-asu-maroon text-asu-maroon rounded-2xl hover:bg-asu-maroon hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                        onMouseEnter={(e) => {
                          gsap.to(e.currentTarget, {
                            scale: 1.1,
                            duration: 0.2,
                            ease: 'power2.out'
                          });
                        }}
                        onMouseLeave={(e) => {
                          gsap.to(e.currentTarget, {
                            scale: 1,
                            duration: 0.2,
                            ease: 'power2.out'
                          });
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <button 
                        className="px-4 py-3 border-2 border-asu-maroon text-asu-maroon rounded-2xl hover:bg-asu-maroon hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                        onMouseEnter={(e) => {
                          gsap.to(e.currentTarget, {
                            scale: 1.1,
                            duration: 0.2,
                            ease: 'power2.out'
                          });
                        }}
                        onMouseLeave={(e) => {
                          gsap.to(e.currentTarget, {
                            scale: 1,
                            duration: 0.2,
                            ease: 'power2.out'
                          });
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Applicant 👤</th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Job 💼</th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Applied 📅</th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status 📊</th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Rating ⭐</th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions ⚡</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplicants.map((applicant) => (
                      <tr 
                        key={applicant.id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onMouseEnter={(e) => {
                          gsap.to(e.currentTarget, {
                            backgroundColor: '#f9fafb',
                            duration: 0.2,
                            ease: 'power2.out'
                          });
                        }}
                        onMouseLeave={(e) => {
                          gsap.to(e.currentTarget, {
                            backgroundColor: '#ffffff',
                            duration: 0.2,
                            ease: 'power2.out'
                          });
                        }}
                      >
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-full flex items-center justify-center text-white font-bold">
                              {applicant.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900">{applicant.name}</div>
                              <div className="text-sm text-gray-500">{applicant.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {applicant.job_title}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-500 font-medium">
                          {new Date(applicant.applied_date).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className={`status-badge inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(applicant.status)}`}>
                            {getStatusIcon(applicant.status)}
                            <span className="ml-2 capitalize">{applicant.status}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`rating-star h-4 w-4 ${i < Math.floor(applicant.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleViewApplicant(applicant)}
                              className="text-asu-maroon hover:text-asu-maroon-dark p-2 rounded-full hover:bg-asu-maroon/10 transition-all duration-200"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button className="text-asu-maroon hover:text-asu-maroon-dark p-2 rounded-full hover:bg-asu-maroon/10 transition-all duration-200">
                              <MessageSquare className="h-5 w-5" />
                            </button>
                            <button className="text-asu-maroon hover:text-asu-maroon-dark p-2 rounded-full hover:bg-asu-maroon/10 transition-all duration-200">
                              <Download className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {filteredApplicants.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No applicants found</h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              No talented candidates match your current filters. Try adjusting your search! 🔍
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setJobFilter('all');
                }}
                className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-8 py-4 rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold shadow-lg"
              >
                Clear Filters 🔄
              </button>
              <button className="border-2 border-asu-maroon text-asu-maroon px-8 py-4 rounded-2xl hover:bg-asu-maroon hover:text-white transition-all duration-300 font-semibold shadow-sm hover:shadow-md">
                Refresh Applications 🔄
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Applicant Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="modal-content bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-asu-maroon/5 to-asu-gold/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                    {selectedApplicant.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedApplicant.name}</h2>
                    <p className="text-asu-maroon font-semibold text-lg">{selectedApplicant.job_title}</p>
                    <div className="flex items-center space-x-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(selectedApplicant.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="ml-2 text-gray-600 font-medium">({selectedApplicant.rating}/5.0)</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="h-6 w-6 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="space-y-8">
                    <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-asu-maroon" />
                        Cover Letter ✍️
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-lg">{selectedApplicant.cover_letter}</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-asu-maroon/5 to-asu-gold/5 rounded-2xl p-6 border border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Award className="h-5 w-5 mr-2 text-asu-maroon" />
                        Skills & Expertise ⚡
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {selectedApplicant.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white rounded-full text-sm font-medium shadow-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-lg">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-asu-maroon" />
                      Contact Information 📞
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 bg-white rounded-xl p-3 border border-gray-100">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 font-medium">{selectedApplicant.email}</span>
                      </div>
                      {selectedApplicant.phone && (
                        <div className="flex items-center space-x-3 bg-white rounded-xl p-3 border border-gray-100">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 font-medium">{selectedApplicant.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-3 bg-white rounded-xl p-3 border border-gray-100">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 font-medium">{selectedApplicant.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-lg">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <Building2 className="h-5 w-5 mr-2 text-asu-maroon" />
                      Education 🎓
                    </h3>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <p className="text-sm text-gray-700 font-medium">{selectedApplicant.education}</p>
                      {selectedApplicant.gpa && (
                        <p className="text-sm text-asu-maroon font-bold mt-2">GPA: {selectedApplicant.gpa}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-lg">
                    <h3 className="font-bold text-gray-900 mb-4">Experience 💼</h3>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <p className="text-sm text-gray-700 font-medium">{selectedApplicant.experience_years} years of experience</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button 
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-2xl hover:shadow-lg transition-all duration-300 font-bold text-center"
                      onClick={() => updateApplicantStatus(selectedApplicant.id, 'hired')}
                    >
                      Accept 🎉
                    </button>
                    <button 
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-2xl hover:shadow-lg transition-all duration-300 font-bold text-center"
                      onClick={() => updateApplicantStatus(selectedApplicant.id, 'rejected')}
                    >
                      Reject ❌
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