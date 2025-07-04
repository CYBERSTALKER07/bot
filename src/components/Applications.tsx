import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Calendar,
  MapPin,
  Building2,
  Filter,
  Search,
  ExternalLink,
  MessageSquare,
  TrendingUp,
  Users,
  Heart
} from 'lucide-react';
import { Application, Job } from '../types';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface ApplicationWithJob extends Application {
  job: Job;
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
      // More organic header animation
      gsap.from(headerRef.current, {
        duration: 1.2,
        y: -30,
        opacity: 0,
        ease: 'power2.out',
        rotation: 0.5
      });

      // Asymmetrical stats cards animation
      gsap.from('.stat-card', {
        duration: 1,
        y: (index) => 20 + (index * 5), // Varied heights
        opacity: 0,
        scale: 0.95,
        rotation: (index) => (index % 2 === 0 ? 0.5 : -0.5), // Slight rotation
        ease: 'elastic.out(1, 0.6)',
        stagger: 0.15
      });

      // Natural filters animation
      gsap.from(filtersRef.current, {
        duration: 1,
        x: -20,
        opacity: 0,
        ease: 'power2.out',
        delay: 0.3
      });

      // Organic application cards animation
      ScrollTrigger.create({
        trigger: '.applications-list',
        start: 'top 85%',
        onEnter: () => {
          gsap.from('.application-card', {
            duration: 0.8,
            y: (index) => 30 + (index * 10),
            opacity: 0,
            scale: 0.98,
            rotation: (index) => (index % 2 === 0 ? 0.3 : -0.3),
            ease: 'power2.out',
            stagger: 0.12
          });
        }
      });

      // More natural hover animations
      gsap.utils.toArray('.application-card').forEach((card: any, index) => {
        const tl = gsap.timeline({ paused: true });
        const direction = index % 2 === 0 ? 1 : -1;
        tl.to(card, {
          y: -8,
          rotation: direction * 0.5,
          scale: 1.01,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          duration: 0.4,
          ease: 'power2.out'
        });

        card.addEventListener('mouseenter', () => tl.play());
        card.addEventListener('mouseleave', () => tl.reverse());
      });

      // Floating status badges
      gsap.from('.status-badge', {
        duration: 1,
        scale: 0.8,
        opacity: 0,
        y: 10,
        ease: 'bounce.out',
        stagger: 0.08,
        delay: 0.8
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Mock applications data
  const applications: ApplicationWithJob[] = [
    {
      id: '1',
      job_id: '1',
      student_id: 'student-1',
      status: 'reviewed',
      applied_date: '2024-01-10',
      cover_letter: 'I am very interested in this position...',
      created_at: '2024-01-10',
      updated_at: '2024-01-12',
      job: {
        id: '1',
        title: 'Software Engineer Intern',
        company: 'Google',
        type: 'internship',
        location: 'Mountain View, CA',
        salary: '$25-30/hour',
        description: 'Join our team to work on cutting-edge projects...',
        requirements: [],
        skills: ['JavaScript', 'React', 'Node.js'],
        posted_date: '2024-01-05',
        deadline: '2024-02-15',
        applicants_count: 127,
        employer_id: 'employer-1',
        created_at: '2024-01-05',
        updated_at: '2024-01-05'
      }
    },
    {
      id: '2',
      job_id: '2',
      student_id: 'student-1',
      status: 'pending',
      applied_date: '2024-01-12',
      created_at: '2024-01-12',
      updated_at: '2024-01-12',
      job: {
        id: '2',
        title: 'Frontend Developer Intern',
        company: 'Microsoft',
        type: 'internship',
        location: 'Remote',
        salary: '$28-32/hour',
        description: 'Work on modern web applications...',
        requirements: [],
        skills: ['React', 'TypeScript', 'CSS'],
        posted_date: '2024-01-08',
        deadline: '2024-02-28',
        applicants_count: 89,
        employer_id: 'employer-2',
        created_at: '2024-01-08',
        updated_at: '2024-01-08'
      }
    },
    {
      id: '3',
      job_id: '3',
      student_id: 'student-1',
      status: 'accepted',
      applied_date: '2024-01-08',
      created_at: '2024-01-08',
      updated_at: '2024-01-15',
      job: {
        id: '3',
        title: 'Data Science Intern',
        company: 'Apple',
        type: 'internship',
        location: 'Cupertino, CA',
        salary: '$30-35/hour',
        description: 'Analyze user behavior data...',
        requirements: [],
        skills: ['Python', 'Machine Learning', 'SQL'],
        posted_date: '2024-01-03',
        deadline: '2024-02-15',
        applicants_count: 156,
        employer_id: 'employer-3',
        created_at: '2024-01-03',
        updated_at: '2024-01-03'
      }
    },
    {
      id: '4',
      job_id: '4',
      student_id: 'student-1',
      status: 'rejected',
      applied_date: '2024-01-05',
      created_at: '2024-01-05',
      updated_at: '2024-01-14',
      job: {
        id: '4',
        title: 'Marketing Intern',
        company: 'Google',
        type: 'internship',
        location: 'Mountain View, CA',
        salary: '$26-30/hour',
        description: 'Support digital marketing campaigns...',
        requirements: [],
        skills: ['Marketing', 'Analytics', 'Communication'],
        posted_date: '2024-01-01',
        deadline: '2024-02-01',
        applicants_count: 203,
        employer_id: 'employer-4',
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }
    }
  ];

  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'reviewed':
        return <Eye className="h-5 w-5 text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'reviewed':
        return 'Reviewed';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Not Selected';
      default:
        return 'Unknown';
    }
  };

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    reviewed: applications.filter(app => app.status === 'reviewed').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  const getRandomCardClass = (index: number) => {
    const classes = [
      'transform rotate-0.5',
      'transform -rotate-0.5',
      'transform rotate-1',
      'transform -rotate-1'
    ];
    return classes[index % classes.length];
  };

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div ref={headerRef} className="mb-12 text-center">
        <div className="inline-block relative">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 relative">
            My Applications
            <div className="absolute -top-2 -right-6 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-aut-maroon to-pink-500 mx-auto mb-4 rounded-full"></div>
        </div>
        <p className="text-gray-600 text-lg">Track your journey to success 🚀</p>
      </div>

      {/* Human-made Stats Cards */}
      <div ref={statsRef} className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="stat-card bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-center relative">
              <div className="text-3xl font-bold text-gray-900 mb-1">{statusCounts.all}</div>
              <div className="text-sm text-gray-600 font-medium">Total Applications</div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full"></div>
            </div>
          </div>
          
          <div className="stat-card bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg border border-yellow-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rotate-1">
            <div className="text-center relative">
              <div className="text-3xl font-bold text-yellow-600 mb-1">{statusCounts.pending}</div>
              <div className="text-sm text-gray-600 font-medium">Pending ⏳</div>
              <Clock className="absolute -top-2 -right-2 h-4 w-4 text-yellow-500 animate-spin" style={{animationDuration: '3s'}} />
            </div>
          </div>
          
          <div className="stat-card bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 -rotate-1">
            <div className="text-center relative">
              <div className="text-3xl font-bold text-blue-600 mb-1">{statusCounts.reviewed}</div>
              <div className="text-sm text-gray-600 font-medium">Reviewed 👀</div>
              <Eye className="absolute -top-2 -right-2 h-4 w-4 text-blue-500" />
            </div>
          </div>
          
          <div className="stat-card bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rotate-0.5">
            <div className="text-center relative">
              <div className="text-3xl font-bold text-green-600 mb-1">{statusCounts.accepted}</div>
              <div className="text-sm text-gray-600 font-medium">Accepted 🎉</div>
              <Heart className="absolute -top-2 -right-2 h-4 w-4 text-green-500 animate-pulse" />
            </div>
          </div>
          
          <div className="stat-card bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-lg border border-red-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 -rotate-0.5">
            <div className="text-center relative">
              <div className="text-3xl font-bold text-red-600 mb-1">{statusCounts.rejected}</div>
              <div className="text-sm text-gray-600 font-medium">Not Selected 💪</div>
              <TrendingUp className="absolute -top-2 -right-2 h-4 w-4 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Organic Filters */}
      <div ref={filtersRef} className="bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100 p-8 mb-12 transform -rotate-0.5">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your applications... 🔍"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aut-maroon focus:border-transparent bg-white shadow-inner transition-all duration-200 hover:shadow-md"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aut-maroon focus:border-transparent bg-white shadow-inner cursor-pointer hover:shadow-md transition-all duration-200"
            >
              <option value="all">All Status 📋</option>
              <option value="pending">Pending ⏳</option>
              <option value="reviewed">Reviewed 👀</option>
              <option value="accepted">Accepted 🎉</option>
              <option value="rejected">Not Selected 💪</option>
            </select>
          </div>
        </div>
      </div>

      {/* Organic Applications List */}
      <div className="applications-list space-y-8">
        {filteredApplications.map((application, index) => (
          <div key={application.id} className={`application-card bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden ${getRandomCardClass(index)}`}>
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 hover:text-aut-maroon transition-colors">
                        <Link 
                          to={`/job/${application.job.id}`}
                          className="relative inline-block"
                        >
                          {application.job.title}
                          <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-aut-maroon transition-all duration-300 hover:w-full"></div>
                        </Link>
                      </h3>
                      <div className="flex items-center space-x-2 mb-3">
                        <Building2 className="h-5 w-5 text-gray-500" />
                        <span className="text-xl text-gray-700 font-semibold">{application.job.company}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <div className="p-2 rounded-full bg-gray-100">
                        {getStatusIcon(application.status)}
                      </div>
                      <span className={`status-badge px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${getStatusColor(application.status)} transform hover:scale-105 transition-transform duration-200`}>
                        {getStatusText(application.status)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-full">
                      <MapPin className="h-4 w-4" />
                      <span>{application.job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-full">
                      <Calendar className="h-4 w-4" />
                      <span>Applied {new Date(application.applied_date).toLocaleDateString()}</span>
                    </div>
                    {application.job.salary && (
                      <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full text-green-700">
                        <span className="font-semibold">{application.job.salary}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm transform hover:scale-105 transition-transform duration-200 ${
                      application.job.type === 'internship' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {application.job.type} 
                      {application.job.type === 'internship' ? ' 🎓' : ' 💼'}
                    </span>
                    {application.job.skills.slice(0, 3).map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-sm font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                    {application.job.skills.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">
                        +{application.job.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Enhanced Status-specific content */}
                  {application.status === 'accepted' && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-r-2xl p-6 mb-6">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-green-900 text-lg mb-1">Congratulations! 🎉</h4>
                          <p className="text-green-700">
                            Your application has been accepted! Time to celebrate and prepare for your next adventure.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {application.status === 'rejected' && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-r-2xl p-6 mb-6">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-red-100 rounded-full">
                          <TrendingUp className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-red-900 text-lg mb-1">Keep Going! 💪</h4>
                          <p className="text-red-700">
                            This wasn't the right fit, but your perfect opportunity is out there waiting for you!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {application.status === 'reviewed' && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-r-2xl p-6 mb-6">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Eye className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-900 text-lg mb-1">Under Review 👀</h4>
                          <p className="text-blue-700">
                            Great news! Your application is being reviewed. Stay tuned for updates!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-3 lg:ml-8 mt-6 lg:mt-0">
                  <Link
                    to={`/job/${application.job.id}`}
                    className="border-2 border-aut-maroon text-aut-maroon px-6 py-3 rounded-2xl hover:bg-aut-maroon hover:text-white transition-all duration-300 text-center flex items-center justify-center space-x-2 font-semibold shadow-sm hover:shadow-md transform hover:scale-105"
                  >
                    <span>View Job</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  {(application.status === 'reviewed' || application.status === 'accepted') && (
                    <Link
                      to="/messages"
                      className="bg-gradient-to-r from-aut-maroon to-red-600 text-white px-6 py-3 rounded-2xl hover:from-red-600 hover:to-aut-maroon transition-all duration-300 text-center flex items-center justify-center space-x-2 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Message</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100 transform -rotate-0.5">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No applications found</h3>
          <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
            {statusFilter === 'all' 
              ? "Your journey starts here! 🚀 Let's find some amazing opportunities for you."
              : `No applications with ${getStatusText(statusFilter).toLowerCase()} status found. Keep exploring! 🔍`
            }
          </p>
          <Link
            to="/dashboard"
            className="bg-gradient-to-r from-aut-maroon to-red-600 text-white px-8 py-4 rounded-2xl hover:from-red-600 hover:to-aut-maroon transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Browse Jobs 🔍
          </Link>
        </div>
      )}
    </div>
  );
}