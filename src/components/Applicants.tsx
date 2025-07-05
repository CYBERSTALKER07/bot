import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  Person, 
  Search, 
  FilterList, 
  Visibility, 
  Message, 
  CheckCircle, 
  Cancel, 
  AccessTime, 
  Event, 
  LocationOn, 
  Business, 
  Star, 
  Favorite, 
  LocalCafe, 
  AutoAwesome, 
  Download, 
  OpenInNew, 
  Email, 
  Phone, 
  Description, 
  EmojiEvents, 
  TrendingUp, 
  People, 
  Work,
  School,
  Grade,
  Close,
  ThumbUp,
  ThumbDown,
  StarRate,
  WorkOutline,
  SchoolOutlined,
  LocationOnOutlined,
  EmailOutlined,
  PhoneOutlined,
  DescriptionOutlined,
  ViewList,
  ViewModule,
  Notifications,
  Forum,
  BookmarkBorder,
  Schedule
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Typography from './ui/Typography';
import Button from './ui/Button';
import Input from './ui/Input';
import { Card, StatsCard } from './ui/Card';
import Badge from './ui/Badge';
import Avatar from './ui/Avatar';

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
  const { user } = useAuth();
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
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
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      resume_url: '/resumes/sarah-johnson.pdf',
      cover_letter: 'I am excited to apply for the Software Engineer position. My experience with React and Node.js makes me a perfect fit for this role. I have worked on several projects that demonstrate my ability to create scalable web applications.',
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
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      resume_url: '/resumes/michael-chen.pdf',
      cover_letter: 'As a passionate developer with experience in full-stack development, I believe I would be a valuable addition to your team. My projects showcase my ability to work with modern technologies.',
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
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      resume_url: '/resumes/emily-rodriguez.pdf',
      cover_letter: 'I am thrilled to apply for the Marketing Intern position. My creative background and analytical skills make me an ideal candidate for this role.',
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
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      resume_url: '/resumes/david-park.pdf',
      cover_letter: 'With my strong background in data analysis and machine learning, I am excited to contribute to your data science team.',
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
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Material Design entrance animations
      gsap.fromTo('.header-card', {
        opacity: 0,
        y: -30,
        scale: 0.98
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out'
      });

      gsap.fromTo('.stats-card', {
        opacity: 0,
        y: 20,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        delay: 0.2
      });

      gsap.fromTo('.filters-card', {
        opacity: 0,
        y: 30,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power2.out',
        delay: 0.4
      });

      gsap.fromTo('.applicant-card', {
        opacity: 0,
        y: 40,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        delay: 0.6
      });

      // Floating decorations
      gsap.to('.applicant-decoration', {
        y: -10,
        x: 5,
        rotation: 180,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
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
      case 'pending': return 'warning';
      case 'reviewed': return 'info';
      case 'shortlisted': return 'success';
      case 'rejected': return 'error';
      case 'hired': return 'success';
      default: return 'standard';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AccessTime className="h-4 w-4" />;
      case 'reviewed': return <Visibility className="h-4 w-4" />;
      case 'shortlisted': return <Star className="h-4 w-4" />;
      case 'rejected': return <Cancel className="h-4 w-4" />;
      case 'hired': return <CheckCircle className="h-4 w-4" />;
      default: return <AccessTime className="h-4 w-4" />;
    }
  };

  const applicantStats = [
    { 
      title: 'Total Applications', 
      value: statusCounts.all.toString(), 
      subtitle: 'All applicants',
      icon: People,
      color: 'primary' as const,
      trend: 'up' as const,
      trendValue: 'All applicants'
    },
    { 
      title: 'Pending Review', 
      value: statusCounts.pending.toString(), 
      subtitle: 'Awaiting review',
      icon: Schedule,
      color: 'warning' as const,
      trend: 'up' as const,
      trendValue: 'Awaiting review'
    },
    { 
      title: 'Shortlisted', 
      value: statusCounts.shortlisted.toString(), 
      subtitle: 'Top candidates',
      icon: Star,
      color: 'success' as const,
      trend: 'up' as const,
      trendValue: 'Top candidates'
    },
    { 
      title: 'Hired', 
      value: statusCounts.hired.toString(), 
      subtitle: 'Successfully hired',
      icon: EmojiEvents,
      color: 'success' as const,
      trend: 'up' as const,
      trendValue: 'Successfully hired'
    },
  ];

  return (
    <div ref={containerRef} className={`min-h-screen relative ${
      isDark ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      {/* Remove decorative elements */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Card className="header-card overflow-hidden mb-8" elevation={3}>
          <div className={`p-8 text-white relative ${
            isDark 
              ? 'bg-gradient-to-r from-dark-surface to-dark-bg' 
              : 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark'
          }`}>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl ${
              isDark ? 'bg-lime/10' : 'bg-white/10'
            }`}></div>
            <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full blur-xl ${
              isDark ? 'bg-dark-accent/20' : 'bg-asu-gold/20'
            }`}></div>
            
            <div className="relative z-10">
              <Typography variant="h3" className="font-bold mb-4 text-white">
                Applicant Management
              </Typography>
              <Typography variant="subtitle1" className={`mb-6 max-w-3xl ${
                isDark ? 'text-dark-muted' : 'text-white/90'
              }`}>
                Review and manage job applications from talented students
              </Typography>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>{applicants.length} total applications</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <People className="h-5 w-5" />
                  <span>{statusCounts.shortlisted} shortlisted</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>{statusCounts.hired} hired</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {applicantStats.map((stat, index) => (
            <div key={index} className="stats-card">
              <StatsCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                subtitle={stat.subtitle}
                color={stat.color}
                trend={stat.trend}
                trendValue={stat.trendValue}
                delay={index * 0.1}
                rotation={index % 2 === 0 ? -0.5 : 0.5}
              />
            </div>
          ))}
        </div>

        {/* Filters */}
        <Card className="filters-card mb-8" elevation={2}>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startIcon={<Search />}
                  variant="outlined"
                  fullWidth
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    isDark 
                      ? 'bg-dark-surface border-lime/20 text-dark-text focus:ring-lime/50' 
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-asu-maroon/50'
                  }`}
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
                  className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    isDark 
                      ? 'bg-dark-surface border-lime/20 text-dark-text focus:ring-lime/50' 
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-asu-maroon/50'
                  }`}
                >
                  <option value="all">All Jobs</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>{job.title}</option>
                  ))}
                </select>
                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-3 transition-colors ${
                      viewMode === 'grid' 
                        ? isDark 
                          ? 'bg-lime text-dark-surface' 
                          : 'bg-asu-maroon text-white'
                        : isDark 
                          ? 'bg-dark-surface text-dark-text hover:bg-dark-bg' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <ViewModule className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-3 transition-colors ${
                      viewMode === 'list' 
                        ? isDark 
                          ? 'bg-lime text-dark-surface' 
                          : 'bg-asu-maroon text-white'
                        : isDark 
                          ? 'bg-dark-surface text-dark-text hover:bg-dark-bg' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <ViewList className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Applicants Content */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplicants.map((applicant, index) => (
              <Card key={applicant.id} className="applicant-card" elevation={2}>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar
                      src={applicant.avatar}
                      alt={applicant.name}
                      size="lg"
                      fallback={applicant.name[0]}
                    />
                    <div className="ml-4 flex-1">
                      <Typography variant="h6" color="textPrimary" className="font-semibold">
                        {applicant.name}
                      </Typography>
                      <Typography variant="subtitle2" className={`${
                        isDark ? 'text-lime' : 'text-asu-maroon'
                      } font-medium`}>
                        {applicant.job_title}
                      </Typography>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(applicant.rating || 0) 
                              ? 'text-yellow-400' 
                              : isDark ? 'text-dark-muted' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <LocationOn className={`h-4 w-4 ${
                        isDark ? 'text-dark-muted' : 'text-gray-400'
                      }`} />
                      <Typography variant="body2" color="textSecondary">
                        {applicant.location}
                      </Typography>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Event className={`h-4 w-4 ${
                        isDark ? 'text-dark-muted' : 'text-gray-400'
                      }`} />
                      <Typography variant="body2" color="textSecondary">
                        Applied {new Date(applicant.applied_date).toLocaleDateString()}
                      </Typography>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Work className={`h-4 w-4 ${
                        isDark ? 'text-dark-muted' : 'text-gray-400'
                      }`} />
                      <Typography variant="body2" color="textSecondary">
                        {applicant.experience_years} years experience
                      </Typography>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {applicant.skills.slice(0, 3).map((skill, skillIndex) => (
                      <span key={skillIndex} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                    {applicant.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                        +{applicant.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(applicant.status)}`}>
                      {getStatusIcon(applicant.status)}
                      <span className="capitalize">{applicant.status}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => setSelectedApplicant(applicant)}
                      startIcon={<Visibility />}
                      fullWidth
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      className="min-w-0"
                    >
                      <Message className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      className="min-w-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card elevation={2}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${
                  isDark ? 'bg-dark-surface' : 'bg-gray-50'
                }`}>
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
                <tbody className={`divide-y ${
                  isDark ? 'divide-lime/20' : 'divide-gray-200'
                }`}>
                  {filteredApplicants.map((applicant) => (
                    <tr key={applicant.id} className={`hover:${
                      isDark ? 'bg-dark-surface' : 'bg-gray-50'
                    } transition-colors`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar
                            src={applicant.avatar}
                            alt={applicant.name}
                            size="md"
                            fallback={applicant.name[0]}
                          />
                          <div className="ml-4">
                            <Typography variant="subtitle2" color="textPrimary" className="font-semibold">
                              {applicant.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {applicant.email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Typography variant="subtitle2" color="textPrimary" className="font-semibold">
                          {applicant.job_title}
                        </Typography>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Typography variant="body2" color="textSecondary">
                          {new Date(applicant.applied_date).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="standard" color={getStatusColor(applicant.status)} className="flex items-center gap-1">
                          {getStatusIcon(applicant.status)}
                          <span className="capitalize">{applicant.status}</span>
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(applicant.rating || 0) 
                                  ? 'text-yellow-400' 
                                  : isDark ? 'text-dark-muted' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => setSelectedApplicant(applicant)}
                            className="min-w-0"
                          >
                            <Visibility className="h-4 w-4" />
                          </Button>
                          <Button variant="text" size="small" className="min-w-0">
                            <Message className="h-4 w-4" />
                          </Button>
                          <Button variant="text" size="small" className="min-w-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {filteredApplicants.length === 0 && (
          <Card className="text-center py-16" elevation={2}>
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isDark ? 'bg-dark-surface' : 'bg-gray-100'
            }`}>
              <People className={`h-12 w-12 ${
                isDark ? 'text-dark-muted' : 'text-gray-400'
              }`} />
            </div>
            <Typography variant="h5" color="textPrimary" className="font-bold mb-4">
              No applicants found
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-6">
              No applicants match your current filters. Try adjusting your search criteria.
            </Typography>
            <Button
              variant="contained"
              color="primary"
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
      </div>

      {/* Applicant Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" elevation={4}>
            <div className={`p-6 border-b flex items-center justify-between ${
              isDark ? 'border-lime/20' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-4">
                <Avatar
                  src={selectedApplicant.avatar}
                  alt={selectedApplicant.name}
                  size="xl"
                  fallback={selectedApplicant.name[0]}
                />
                <div>
                  <Typography variant="h4" color="textPrimary" className="font-bold">
                    {selectedApplicant.name}
                  </Typography>
                  <Typography variant="subtitle1" className={`${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  } font-medium`}>
                    {selectedApplicant.job_title}
                  </Typography>
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(selectedApplicant.rating || 0) 
                            ? 'text-yellow-400' 
                            : isDark ? 'text-dark-muted' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <Typography variant="body2" color="textSecondary" className="ml-2">
                      ({selectedApplicant.rating}/5.0)
                    </Typography>
                  </div>
                </div>
              </div>
              <Button
                variant="text"
                onClick={() => setSelectedApplicant(null)}
                className="min-w-0 p-2"
              >
                <Close className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <Typography variant="h6" color="textPrimary" className="font-semibold mb-3 flex items-center">
                      <DescriptionOutlined className="h-5 w-5 mr-2" />
                      Cover Letter
                    </Typography>
                    <Typography variant="body1" color="textSecondary" className="leading-relaxed">
                      {selectedApplicant.cover_letter}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="h6" color="textPrimary" className="font-semibold mb-3 flex items-center">
                      <EmojiEvents className="h-5 w-5 mr-2" />
                      Skills & Expertise
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplicant.skills.map((skill, index) => (
                        <Badge key={index} variant="standard" color="primary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Typography variant="h6" color="textPrimary" className="font-semibold mb-3 flex items-center">
                      <EmailOutlined className="h-5 w-5 mr-2" />
                      Contact Information
                    </Typography>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Email className={`h-4 w-4 ${
                          isDark ? 'text-dark-muted' : 'text-gray-400'
                        }`} />
                        <Typography variant="body2" color="textSecondary">
                          {selectedApplicant.email}
                        </Typography>
                      </div>
                      {selectedApplicant.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className={`h-4 w-4 ${
                            isDark ? 'text-dark-muted' : 'text-gray-400'
                          }`} />
                          <Typography variant="body2" color="textSecondary">
                            {selectedApplicant.phone}
                          </Typography>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <LocationOn className={`h-4 w-4 ${
                          isDark ? 'text-dark-muted' : 'text-gray-400'
                        }`} />
                        <Typography variant="body2" color="textSecondary">
                          {selectedApplicant.location}
                        </Typography>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Typography variant="h6" color="textPrimary" className="font-semibold mb-3 flex items-center">
                      <SchoolOutlined className="h-5 w-5 mr-2" />
                      Education
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {selectedApplicant.education}
                    </Typography>
                    {selectedApplicant.gpa && (
                      <Typography variant="body2" className={`mt-1 ${
                        isDark ? 'text-lime' : 'text-asu-maroon'
                      } font-medium`}>
                        GPA: {selectedApplicant.gpa}
                      </Typography>
                    )}
                  </div>
                  
                  <div>
                    <Typography variant="h6" color="textPrimary" className="font-semibold mb-3 flex items-center">
                      <WorkOutline className="h-5 w-5 mr-2" />
                      Experience
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {selectedApplicant.experience_years} years of experience
                    </Typography>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<ThumbUp />}
                      className="flex-1"
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<ThumbDown />}
                      className="flex-1"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}