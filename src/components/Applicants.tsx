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
      // Header animation - scale from small to big
      gsap.from(headerRef.current, {
        duration: 1.5,
        scale: 0.8,
        opacity: 0,
        y: -30,
        ease: 'elastic.out(1, 0.8)',
        rotation: 0.8
      });

      // Applicant cards animation - scale from small
      gsap.from('.applicant-card', {
        duration: 0.8,
        scale: 0.9,
        opacity: 0,
        y: 20,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        delay: 0.5
      });

      // Stats animation - scale from small
      gsap.from('.stat-card', {
        duration: 0.8,
        scale: 0.8,
        opacity: 0,
        y: 15,
        ease: 'back.out(1.7)',
        stagger: 0.15,
        delay: 0.3
      });

      // Floating elements - always visible
      gsap.to('.applicant-decoration', {
        y: -6,
        x: 3,
        rotation: 180,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

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
    // Update applicant status
    gsap.to(`#applicant-${applicantId}`, {
      scale: 1.05,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out'
    });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Decorative elements - Fixed colors */}
      <div className="applicant-decoration absolute top-16 right-24 w-4 h-4 bg-asu-gold/30 rounded-full"></div>
      <div className="applicant-decoration absolute top-32 left-16 w-3 h-3 bg-asu-maroon/20 rounded-full"></div>
      <Sparkles className="applicant-decoration absolute top-24 left-1/4 h-5 w-5 text-asu-gold/50" />
      <Coffee className="applicant-decoration absolute bottom-32 right-1/4 h-4 w-4 text-asu-maroon/40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-3xl p-8 text-white relative overflow-hidden transform -rotate-0.5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">Applicant Management 👥</h1>
              <p className="text-xl text-gray-200">Review and manage job applications from talented students</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {Object.entries(statusCounts).map(([status, count], index) => (
            <div key={status} className="stat-card bg-white rounded-2xl shadow-lg border p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                <div className="text-sm text-gray-600 font-medium capitalize">
                  {status === 'all' ? 'Total' : status}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search applicants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
              </select>
              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon"
              >
                <option value="all">All Jobs</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
              <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-3 ${viewMode === 'grid' ? 'bg-asu-maroon text-white' : 'bg-white text-gray-600'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-3 ${viewMode === 'list' ? 'bg-asu-maroon text-white' : 'bg-white text-gray-600'}`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Applicants Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplicants.map((applicant, index) => (
              <div
                key={applicant.id}
                id={`applicant-${applicant.id}`}
                className="applicant-card bg-white rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-full flex items-center justify-center text-white font-bold">
                        {applicant.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{applicant.name}</h3>
                        <p className="text-sm text-gray-600">{applicant.job_title}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(applicant.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{applicant.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Applied {new Date(applicant.applied_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      <span>{applicant.experience_years} years experience</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {applicant.skills.slice(0, 3).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {applicant.skills.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">
                        +{applicant.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(applicant.status)}`}>
                      {getStatusIcon(applicant.status)}
                      <span className="capitalize">{applicant.status}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedApplicant(applicant)}
                      className="flex-1 bg-asu-maroon text-white px-4 py-2 rounded-xl hover:bg-asu-maroon-dark transition-colors flex items-center justify-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button className="px-4 py-2 border-2 border-asu-maroon text-asu-maroon rounded-xl hover:bg-asu-maroon hover:text-white transition-colors">
                      <MessageSquare className="h-4 w-4" />
                    </button>
                    <button className="px-4 py-2 border-2 border-asu-maroon text-asu-maroon rounded-xl hover:bg-asu-maroon hover:text-white transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplicants.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-full flex items-center justify-center text-white font-bold">
                            {applicant.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{applicant.name}</div>
                            <div className="text-sm text-gray-500">{applicant.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {applicant.job_title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(applicant.applied_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(applicant.status)}`}>
                          {getStatusIcon(applicant.status)}
                          <span className="ml-1 capitalize">{applicant.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(applicant.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedApplicant(applicant)}
                            className="text-asu-maroon hover:text-asu-maroon-dark"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-asu-maroon hover:text-asu-maroon-dark">
                            <MessageSquare className="h-4 w-4" />
                          </button>
                          <button className="text-asu-maroon hover:text-asu-maroon-dark">
                            <Download className="h-4 w-4" />
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

        {filteredApplicants.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No applicants found</h3>
            <p className="text-gray-600 mb-6">No applicants match your current filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setJobFilter('all');
              }}
              className="bg-asu-maroon text-white px-6 py-3 rounded-xl hover:bg-asu-maroon-dark transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Applicant Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {selectedApplicant.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedApplicant.name}</h2>
                    <p className="text-gray-600">{selectedApplicant.job_title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="h-6 w-6 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Cover Letter</h3>
                      <p className="text-gray-600 leading-relaxed">{selectedApplicant.cover_letter}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplicant.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedApplicant.email}</span>
                      </div>
                      {selectedApplicant.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{selectedApplicant.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedApplicant.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Education</h3>
                    <p className="text-sm text-gray-600">{selectedApplicant.education}</p>
                    {selectedApplicant.gpa && (
                      <p className="text-sm text-gray-600 mt-1">GPA: {selectedApplicant.gpa}</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors">
                      Accept
                    </button>
                    <button className="flex-1 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors">
                      Reject
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