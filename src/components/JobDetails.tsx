import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  Clock,
  Building2,
  ArrowLeft,
  Send,
  BookmarkPlus,
  Bookmark,
  ExternalLink,
  Sparkles,
  Coffee,
  Heart,
  Star,
  Zap,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Job } from '../types';

gsap.registerPlugin(ScrollTrigger);

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    // Mock job data - in real app, fetch from Supabase
    const mockJob: Job = {
      id: id || '1',
      title: 'Software Engineering Intern',
      company: 'Intel Corporation',
      type: 'internship',
      location: 'Phoenix, AZ',
      salary: '$25-30/hour',
      description: `Join Intel's dynamic software engineering team as an intern! You'll work on cutting-edge projects involving processor architecture, AI acceleration, and cloud computing solutions.

Key Responsibilities:
• Develop and optimize software applications for Intel processors
• Collaborate with senior engineers on machine learning inference engines
• Participate in code reviews and agile development processes
• Contribute to open-source projects and technical documentation
• Work with cross-functional teams on product development

What You'll Learn:
• Advanced software architecture patterns
• Performance optimization techniques
• Modern development tools and practices
• Professional software development lifecycle`,
      requirements: [
        'Currently pursuing BS/MS in Computer Science or related field',
        'Strong programming skills in C++, Python, or Java',
        'Understanding of computer architecture and algorithms',
        'GPA of 3.0 or higher',
        'Available for 3-month summer internship'
      ],
      skills: ['C++', 'Python', 'Java', 'Git', 'Linux', 'Machine Learning'],
      posted_date: '2024-01-15',
      deadline: '2024-03-01',
      applicants_count: 127,
      employer_id: 'employer-1',
      created_at: '2024-01-15',
      updated_at: '2024-01-15'
    };

    setJob(mockJob);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (!loading && job) {
      const ctx = gsap.context(() => {
        // Header entrance animation
        gsap.fromTo(headerRef.current, {
          opacity: 0,
          y: -50,
          scale: 0.95
        }, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out'
        });

        // Content entrance with stagger
        gsap.fromTo(contentRef.current, {
          opacity: 0,
          y: 50,
          scale: 0.95
        }, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          delay: 0.2
        });

        // Sidebar entrance
        gsap.fromTo(sidebarRef.current, {
          opacity: 0,
          x: 50,
          scale: 0.95
        }, {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          delay: 0.4
        });

        // Skills animation
        gsap.fromTo('.skill-badge', {
          opacity: 0,
          scale: 0,
          y: 20
        }, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
          stagger: 0.1,
          delay: 0.8
        });

        // Requirements animation
        gsap.fromTo('.requirement-item', {
          opacity: 0,
          x: -30
        }, {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          delay: 1
        });

        // Floating decorations
        gsap.to('.job-decoration', {
          y: -12,
          x: 8,
          rotation: 360,
          duration: 12,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });

        // Apply button hover effect
        gsap.set('.apply-button', {
          transformOrigin: 'center'
        });

        // Bookmark animation
        gsap.set('.bookmark-icon', {
          transformOrigin: 'center'
        });

        // Similar jobs animation
        gsap.fromTo('.similar-job', {
          opacity: 0,
          y: 20
        }, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.1,
          delay: 1.2
        });

      }, containerRef);

      return () => ctx.revert();
    }
  }, [loading, job]);

  const handleApply = async () => {
    setApplying(true);
    
    // Apply button animation
    gsap.to('.apply-button', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out'
    });

    // Simulate API call
    setTimeout(() => {
      setApplying(false);
      setShowApplyModal(false);
      
      // Success animation
      gsap.fromTo('.success-message', {
        opacity: 0,
        y: 20,
        scale: 0.8
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.7)'
      });
      
      alert('Application submitted successfully!');
    }, 2000);
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
    
    // Bookmark animation
    gsap.to('.bookmark-icon', {
      scale: bookmarked ? 1.2 : 1.5,
      rotation: bookmarked ? 0 : 360,
      duration: 0.3,
      ease: 'back.out(1.7)',
      onComplete: () => {
        gsap.to('.bookmark-icon', {
          scale: 1,
          duration: 0.2,
          ease: 'power2.out'
        });
      }
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <Link to="/dashboard" className="text-asu-maroon hover:text-asu-maroon-dark">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative">
      {/* Decorative elements */}
      <div className="job-decoration absolute top-20 right-20 w-4 h-4 bg-asu-gold/40 rounded-full"></div>
      <div className="job-decoration absolute top-40 left-20 w-3 h-3 bg-asu-maroon/30 rounded-full"></div>
      <Sparkles className="job-decoration absolute top-32 left-1/4 h-5 w-5 text-asu-gold/60" />
      <Coffee className="job-decoration absolute bottom-32 right-1/3 h-4 w-4 text-asu-maroon/50" />
      <Heart className="job-decoration absolute bottom-20 left-1/4 h-4 w-4 text-asu-gold/70" />
      <Star className="job-decoration absolute top-1/2 right-12 h-3 w-3 text-asu-maroon/40" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            onMouseEnter={() => {
              gsap.to(event?.currentTarget, {
                x: -5,
                duration: 0.2,
                ease: 'power2.out'
              });
            }}
            onMouseLeave={() => {
              gsap.to(event?.currentTarget, {
                x: 0,
                duration: 0.2,
                ease: 'power2.out'
              });
            }}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Job Header */}
          <div ref={headerRef} className="p-8 border-b border-gray-100 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4">{job.title} ✨</h1>
                <div className="flex items-center space-x-3 mb-6">
                  <Building2 className="h-6 w-6 text-asu-gold" />
                  <span className="text-2xl font-semibold text-white/95">{job.company}</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 text-white/90">
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  {job.salary && (
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Calendar className="h-4 w-4" />
                    <span>Posted {new Date(job.posted_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Users className="h-4 w-4" />
                    <span>{job.applicants_count} applicants</span>
                  </div>
                  {job.deadline && (
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                      <Clock className="h-4 w-4" />
                      <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {user?.role === 'student' && (
                <div className="flex flex-col space-y-4 mt-8 lg:mt-0 lg:ml-8">
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="apply-button bg-asu-gold text-asu-maroon px-8 py-4 rounded-2xl hover:bg-yellow-300 transition-all duration-300 flex items-center justify-center space-x-3 font-bold text-lg shadow-lg"
                    onMouseEnter={() => {
                      gsap.to(event?.currentTarget, {
                        scale: 1.05,
                        duration: 0.2,
                        ease: 'power2.out'
                      });
                    }}
                    onMouseLeave={() => {
                      gsap.to(event?.currentTarget, {
                        scale: 1,
                        duration: 0.2,
                        ease: 'power2.out'
                      });
                    }}
                  >
                    <Send className="h-5 w-5" />
                    <span>Apply Now</span>
                  </button>
                  <button
                    onClick={toggleBookmark}
                    className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-2xl hover:bg-white/30 transition-all duration-300 flex items-center justify-center space-x-3 font-semibold"
                    onMouseEnter={() => {
                      gsap.to(event?.currentTarget, {
                        scale: 1.05,
                        duration: 0.2,
                        ease: 'power2.out'
                      });
                    }}
                    onMouseLeave={() => {
                      gsap.to(event?.currentTarget, {
                        scale: 1,
                        duration: 0.2,
                        ease: 'power2.out'
                      });
                    }}
                  >
                    {bookmarked ? <Bookmark className="bookmark-icon h-5 w-5" /> : <BookmarkPlus className="bookmark-icon h-5 w-5" />}
                    <span>{bookmarked ? 'Saved ❤️' : 'Save Job'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Job Type Badge */}
            <div className="relative z-10 mt-6">
              <span className={`px-6 py-3 rounded-full text-sm font-bold shadow-lg ${
                job.type === 'internship' ? 'bg-blue-500 text-white' :
                job.type === 'full-time' ? 'bg-green-500 text-white' :
                'bg-yellow-500 text-white'
              }`}>
                {job.type.replace('-', ' ').toUpperCase()} 🚀
              </span>
            </div>
          </div>

          {/* Job Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div ref={contentRef} className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Target className="h-6 w-6 mr-3 text-asu-maroon" />
                    Job Description 📝
                  </h2>
                  <div className="prose max-w-none">
                    {job.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-700 leading-relaxed text-lg">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-gradient-to-r from-asu-maroon/5 to-asu-gold/5 rounded-2xl p-6 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Zap className="h-6 w-6 mr-3 text-asu-maroon" />
                    Requirements ⚡
                  </h2>
                  <ul className="space-y-3">
                    {job.requirements.map((requirement, index) => (
                      <li key={index} className="requirement-item flex items-start space-x-3">
                        <span className="text-asu-maroon mt-1 text-xl">•</span>
                        <span className="text-gray-700 font-medium">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sidebar */}
              <div ref={sidebarRef} className="space-y-6">
                {/* Skills */}
                <div className="bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-2xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Required Skills ⭐
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="skill-badge px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Company Info */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-asu-maroon" />
                    About {job.company} 🏢
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Intel Corporation is a world leader in computing innovation. For over 50 years, 
                    Intel has created computing and communications technologies that power the world's 
                    innovations. ✨
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center space-x-2 text-asu-maroon hover:text-asu-maroon-dark font-semibold transition-colors"
                    onMouseEnter={() => {
                      gsap.to(event?.currentTarget, {
                        x: 5,
                        duration: 0.2,
                        ease: 'power2.out'
                      });
                    }}
                    onMouseLeave={() => {
                      gsap.to(event?.currentTarget, {
                        x: 0,
                        duration: 0.2,
                        ease: 'power2.out'
                      });
                    }}
                  >
                    <span>Learn more about Intel</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                {/* Similar Jobs */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-asu-maroon" />
                    Similar Jobs 💼
                  </h3>
                  <div className="space-y-3">
                    <Link
                      to="/job/2"
                      className="similar-job block p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300"
                      onMouseEnter={() => {
                        gsap.to(event?.currentTarget, {
                          scale: 1.02,
                          duration: 0.2,
                          ease: 'power2.out'
                        });
                      }}
                      onMouseLeave={() => {
                        gsap.to(event?.currentTarget, {
                          scale: 1,
                          duration: 0.2,
                          ease: 'power2.out'
                        });
                      }}
                    >
                      <h4 className="font-bold text-gray-900 mb-1">Frontend Developer Intern</h4>
                      <p className="text-asu-maroon font-semibold text-sm">Microsoft</p>
                    </Link>
                    <Link
                      to="/job/3"
                      className="similar-job block p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300"
                      onMouseEnter={() => {
                        gsap.to(event?.currentTarget, {
                          scale: 1.02,
                          duration: 0.2,
                          ease: 'power2.out'
                        });
                      }}
                      onMouseLeave={() => {
                        gsap.to(event?.currentTarget, {
                          scale: 1,
                          duration: 0.2,
                          ease: 'power2.out'
                        });
                      }}
                    >
                      <h4 className="font-bold text-gray-900 mb-1">Data Science Intern</h4>
                      <p className="text-asu-maroon font-semibold text-sm">Apple</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Send className="h-6 w-6 mr-3 text-asu-maroon" />
                Apply for {job.title} 🚀
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Cover Letter (Optional) ✍️
                  </label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent transition-all duration-200"
                    placeholder="Tell the employer why you're interested in this position..."
                  />
                </div>
                <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
                  📄 Your resume and profile information will be automatically included with your application.
                </div>
              </div>
              <div className="flex space-x-4 mt-8">
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="flex-1 bg-asu-maroon text-white py-4 px-6 rounded-xl hover:bg-asu-maroon-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold"
                >
                  {applying ? 'Submitting... ⏳' : 'Submit Application 🚀'}
                </button>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}