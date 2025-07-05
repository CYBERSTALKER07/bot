import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  LocationOn, 
  AttachMoney, 
  CalendarToday, 
  People, 
  AccessTime,
  Business,
  ArrowBack,
  Send,
  BookmarkAdd,
  Bookmark,
  OpenInNew,
  AutoAwesome,
  LocalCafe,
  Favorite,
  Star,
  Flash,
  GpsFixed,
  Work
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Job } from '../types';
import Typography from './ui/Typography';
import Button from './ui/Button';
import Input from './ui/Input';
import { Card } from './ui/Card';
import Badge from './ui/Badge';

gsap.registerPlugin(ScrollTrigger);

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { isDark } = useTheme();
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
        // Material Design entrance animations
        gsap.fromTo('.job-header', {
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

        gsap.fromTo('.job-content', {
          opacity: 0,
          y: 20
        }, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.2
        });

        gsap.fromTo('.skill-chip', {
          opacity: 0,
          scale: 0.8,
          y: 10
        }, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: 'back.out(1.7)',
          stagger: 0.05,
          delay: 0.4
        });

        // Floating decorations
        gsap.to('.job-decoration', {
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
    }
  }, [loading, job]);

  const handleApply = async () => {
    setApplying(true);
    
    // Simulate API call
    setTimeout(() => {
      setApplying(false);
      setShowApplyModal(false);
      alert('Application submitted successfully!');
    }, 2000);
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8">
          <div className="animate-pulse space-y-4">
            <div className={`h-8 rounded w-3/4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-6 rounded w-1/2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className="space-y-2">
              <div className={`h-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-4 rounded w-3/4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 text-center">
          <Typography variant="h4" color="textPrimary" className="font-bold mb-4">
            Job Not Found
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`min-h-screen relative ${
      isDark ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      {/* Decorative elements */}
      <div className={`job-decoration absolute top-20 right-20 w-4 h-4 rounded-full ${
        isDark ? 'bg-lime/30' : 'bg-asu-gold/40'
      }`}></div>
      <AutoAwesome className={`job-decoration absolute top-32 left-1/4 h-5 w-5 ${
        isDark ? 'text-lime/60' : 'text-asu-gold/60'
      }`} />
      <LocalCafe className={`job-decoration absolute bottom-32 right-1/3 h-4 w-4 ${
        isDark ? 'text-dark-accent/50' : 'text-asu-maroon/50'
      }`} />
      <Favorite className={`job-decoration absolute bottom-20 left-1/4 h-4 w-4 ${
        isDark ? 'text-lime/70' : 'text-asu-gold/70'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="text"
            startIcon={ArrowBack}
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <Card className="job-header overflow-hidden" elevation={3}>
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
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                    <div className="flex-1">
                      <Typography variant="h3" className="font-bold mb-4 text-white">
                        {job.title}
                      </Typography>
                      <div className="flex items-center space-x-3 mb-6">
                        <Business className={`h-6 w-6 ${isDark ? 'text-lime' : 'text-asu-gold'}`} />
                        <Typography variant="h5" className="font-semibold text-white/95">
                          {job.company}
                        </Typography>
                      </div>
                    </div>

                    {user?.role === 'student' && (
                      <div className="flex flex-col space-y-3 mt-6 lg:mt-0 lg:ml-8">
                        <Button
                          variant="contained"
                          color="secondary"
                          size="large"
                          startIcon={Send}
                          onClick={() => setShowApplyModal(true)}
                          className="px-8 py-3"
                        >
                          Apply Now
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          startIcon={bookmarked ? Bookmark : BookmarkAdd}
                          onClick={toggleBookmark}
                          className="text-white border-white/30 hover:bg-white/10"
                        >
                          {bookmarked ? 'Saved' : 'Save Job'}
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Job Details */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                      <LocationOn className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                        <AttachMoney className="h-4 w-4" />
                        <span>{job.salary}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                      <CalendarToday className="h-4 w-4" />
                      <span>Posted {new Date(job.posted_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                      <People className="h-4 w-4" />
                      <span>{job.applicants_count} applicants</span>
                    </div>
                    {job.deadline && (
                      <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                        <AccessTime className="h-4 w-4" />
                        <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Job Type Badge */}
                  <Badge 
                    color={job.type === 'internship' ? 'info' : job.type === 'full-time' ? 'success' : 'warning'}
                    variant="standard"
                    className="capitalize px-4 py-2 text-sm font-bold"
                  >
                    {job.type.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Description Card */}
            <Card className="job-content p-8" elevation={2}>
              <Typography variant="h5" color="textPrimary" className="font-bold mb-6 flex items-center">
                <GpsFixed className={`h-6 w-6 mr-3 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
                Job Description
              </Typography>
              <div className="prose max-w-none">
                {job.description.split('\n').map((paragraph, index) => (
                  <Typography key={index} variant="body1" color="textSecondary" className="mb-4 leading-relaxed">
                    {paragraph}
                  </Typography>
                ))}
              </div>
            </Card>

            {/* Requirements Card */}
            <Card className="job-content p-8" elevation={2}>
              <Typography variant="h5" color="textPrimary" className="font-bold mb-6 flex items-center">
                <Flash className={`h-6 w-6 mr-3 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
                Requirements
              </Typography>
              <ul className="space-y-3">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className={`mt-1 text-xl ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>•</span>
                    <Typography variant="body1" color="textSecondary" className="font-medium">
                      {requirement}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Sidebar */}
          <div ref={sidebarRef} className="space-y-6">
            {/* Skills Card */}
            <Card className="p-6" elevation={2}>
              <Typography variant="h6" color="textPrimary" className="font-bold mb-4 flex items-center">
                <Star className={`h-5 w-5 mr-2 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
                Required Skills
              </Typography>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge
                    key={skill}
                    className="skill-chip"
                    variant="outlined"
                    color="primary"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Company Info Card */}
            <Card className="p-6" elevation={2}>
              <Typography variant="h6" color="textPrimary" className="font-bold mb-4 flex items-center">
                <Business className={`h-5 w-5 mr-2 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
                About {job.company}
              </Typography>
              <Typography variant="body2" color="textSecondary" className="leading-relaxed mb-4">
                Intel Corporation is a world leader in computing innovation. For over 50 years, 
                Intel has created computing and communications technologies that power the world's 
                innovations.
              </Typography>
              <Button
                variant="text"
                endIcon={OpenInNew}
                color="primary"
                size="small"
              >
                Learn more about Intel
              </Button>
            </Card>

            {/* Similar Jobs Card */}
            <Card className="p-6" elevation={2}>
              <Typography variant="h6" color="textPrimary" className="font-bold mb-4 flex items-center">
                <Work className={`h-5 w-5 mr-2 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
                Similar Jobs
              </Typography>
              <div className="space-y-3">
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" variant="outlined">
                  <Typography variant="subtitle2" color="textPrimary" className="font-bold mb-1">
                    Frontend Developer Intern
                  </Typography>
                  <Typography variant="caption" color="primary" className="font-semibold">
                    Microsoft
                  </Typography>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" variant="outlined">
                  <Typography variant="subtitle2" color="textPrimary" className="font-bold mb-1">
                    Data Science Intern
                  </Typography>
                  <Typography variant="caption" color="primary" className="font-semibold">
                    Apple
                  </Typography>
                </Card>
              </div>
            </Card>
          </div>
        </div>

        {/* Apply Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full p-8" elevation={4}>
              <Typography variant="h5" color="textPrimary" className="font-bold mb-6 flex items-center">
                <Send className={`h-6 w-6 mr-3 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
                Apply for {job.title}
              </Typography>
              <div className="space-y-6">
                <Input
                  label="Cover Letter (Optional)"
                  multiline
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the employer why you're interested in this position..."
                  variant="outlined"
                  fullWidth
                />
                <Card className={`p-4 ${
                  isDark ? 'bg-dark-bg' : 'bg-gray-50'
                }`} variant="outlined">
                  <Typography variant="body2" color="textSecondary">
                    📄 Your resume and profile information will be automatically included with your application.
                  </Typography>
                </Card>
              </div>
              <div className="flex space-x-4 mt-8">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleApply}
                  loading={applying}
                  fullWidth
                  size="large"
                >
                  Submit Application
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setShowApplyModal(false)}
                  fullWidth
                  size="large"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}