import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  LocationOn,
  Work,
  AccessTime,
  AttachMoney,
  Business,
  School,
  Person,
  Email,
  Phone,
  Language,
  Bookmark,
  BookmarkBorder,
  Share,
  ArrowBack,
  Groups,
  WorkOutline,
  CalendarMonth
} from '@mui/icons-material';
import { useJobs } from '../hooks/useJobs';
import { useTheme } from '../context/ThemeContext';
import Typography from './ui/Typography';
import Button from './ui/Button';
import { Card } from './ui/Card';
import Badge from './ui/Badge';
import Modal from './ui/Modal';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs } = useJobs();
  const { isDark } = useTheme();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const job = jobs.find(j => j.id === id);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Material Design entrance animations
      gsap.fromTo(heroRef.current, {
        opacity: 0,
        y: -50,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power2.out'
      });

      gsap.fromTo(contentRef.current, {
        opacity: 0,
        y: 30
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.3
      });

      // Floating decorations
      gsap.to('.job-decoration', {
        y: -10,
        x: 5,
        rotation: 360,
        duration: 15,
        repeat: -1,
        ease: 'none'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Typography variant="h4" color="textSecondary" className="mb-4">
            Job not found
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/jobs')}
          >
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    setShowApplyModal(true);
  };

  const handleSubmitApplication = async () => {
    // Handle application submission
    console.log('Application submitted for job:', job.id);
    console.log('Cover letter:', coverLetter);
    setShowApplyModal(false);
    setCoverLetter('');
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job opportunity: ${job.title} at ${job.company}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div ref={containerRef} className={`min-h-screen relative ${
      isDark ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      {/* Remove decorative elements */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div ref={heroRef} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="text"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowBack className="h-5 w-5" />
              <span>Back</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                variant="text"
                onClick={handleBookmark}
                className={`p-2 ${isBookmarked ? 'text-yellow-500' : ''}`}
              >
                {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
              </Button>
              <Button
                variant="text"
                onClick={handleShare}
                className="p-2"
              >
                <Share />
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden" elevation={3}>
            <div className={`rounded-3xl p-8 text-white mb-8 relative overflow-hidden transition-colors duration-300 ${
              isDark 
                ? 'bg-gradient-to-r from-dark-surface to-lime' 
                : 'bg-gradient-to-r from-asu-maroon to-asu-maroon'
            }`}>
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${
                isDark ? 'bg-lime/20' : 'bg-white/20'
              }`}></div>
              <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full blur-xl ${
                isDark ? 'bg-dark-accent/30' : 'bg-asu-gold/30'
              }`}></div>
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 mb-6 lg:mb-0">
                    <div className="flex items-center space-x-3 mb-4">
                      <Badge variant="standard" color="secondary" className="bg-white/20 text-white">
                        {job.type}
                      </Badge>
                      <span className={`text-sm ${
                        isDark ? 'text-dark-muted' : 'text-white/80'
                      }`}>
                        Posted {new Date(job.posted_date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <Typography variant="h3" className="font-bold mb-3 text-white">
                      {job.title}
                    </Typography>
                    
                    <div className="flex items-center space-x-6 mb-4">
                      <div className="flex items-center space-x-2">
                        <Business className="h-5 w-5" />
                        <span className="text-lg">{job.company}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <LocationOn className="h-5 w-5" />
                        <span>{job.location}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center space-x-2">
                          <AttachMoney className="h-5 w-5" />
                          <span>{job.salary}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {job.skills.slice(0, 6).map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="standard" 
                          className="bg-white/20 text-white"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Groups className="h-4 w-4" />
                        <span>{job.applicants_count || 0} applicants</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <WorkOutline className="h-4 w-4" />
                        <span>{job.experience_level || 'Entry Level'}</span>
                      </div>
                      {job.deadline && (
                        <div className="flex items-center space-x-2">
                          <CalendarMonth className="h-4 w-4" />
                          <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="lg:ml-8">
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      onClick={handleApply}
                      className="w-full lg:w-auto bg-white text-asu-maroon hover:bg-gray-100"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Content */}
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <Card className="p-8" elevation={2}>
              <Typography variant="h5" color="textPrimary" className="font-bold mb-6">
                Job Description
              </Typography>
              <div className={`prose max-w-none ${
                isDark ? 'prose-dark' : 'prose-gray'
              }`}>
                <Typography variant="body1" color="textSecondary" className="leading-relaxed">
                  {job.description}
                </Typography>
              </div>
            </Card>

            {/* Requirements */}
            <Card className="p-8" elevation={2}>
              <Typography variant="h5" color="textPrimary" className="font-bold mb-6">
                Requirements
              </Typography>
              <ul className="space-y-3">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      isDark ? 'bg-lime' : 'bg-asu-maroon'
                    }`}></div>
                    <Typography variant="body1" color="textSecondary">
                      {req}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Skills */}
            <Card className="p-8" elevation={2}>
              <Typography variant="h5" color="textPrimary" className="font-bold mb-6">
                Required Skills
              </Typography>
              <div className="flex flex-wrap gap-3">
                {job.skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="standard" 
                    color="primary"
                    className="px-4 py-2 text-sm"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Benefits */}
            {job.benefits && (
              <Card className="p-8" elevation={2}>
                <Typography variant="h5" color="textPrimary" className="font-bold mb-6">
                  Benefits & Perks
                </Typography>
                <Typography variant="body1" color="textSecondary" className="leading-relaxed">
                  {job.benefits}
                </Typography>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Job Details */}
            <Card className="p-6" elevation={2}>
              <Typography variant="h6" color="textPrimary" className="font-bold mb-6">
                Job Details
              </Typography>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Work className={`h-5 w-5 ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`} />
                  <div>
                    <Typography variant="body2" color="textSecondary">
                      Job Type
                    </Typography>
                    <Typography variant="body1" color="textPrimary" className="font-medium">
                      {job.type}
                    </Typography>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <LocationOn className={`h-5 w-5 ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`} />
                  <div>
                    <Typography variant="body2" color="textSecondary">
                      Location
                    </Typography>
                    <Typography variant="body1" color="textPrimary" className="font-medium">
                      {job.location}
                    </Typography>
                  </div>
                </div>

                {job.salary && (
                  <div className="flex items-center space-x-3">
                    <AttachMoney className={`h-5 w-5 ${
                      isDark ? 'text-lime' : 'text-asu-maroon'
                    }`} />
                    <div>
                      <Typography variant="body2" color="textSecondary">
                        Salary
                      </Typography>
                      <Typography variant="body1" color="textPrimary" className="font-medium">
                        {job.salary}
                      </Typography>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <AccessTime className={`h-5 w-5 ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`} />
                  <div>
                    <Typography variant="body2" color="textSecondary">
                      Posted
                    </Typography>
                    <Typography variant="body1" color="textPrimary" className="font-medium">
                      {new Date(job.posted_date).toLocaleDateString()}
                    </Typography>
                  </div>
                </div>

                {job.deadline && (
                  <div className="flex items-center space-x-3">
                    <CalendarMonth className={`h-5 w-5 ${
                      isDark ? 'text-lime' : 'text-asu-maroon'
                    }`} />
                    <div>
                      <Typography variant="body2" color="textSecondary">
                        Deadline
                      </Typography>
                      <Typography variant="body1" color="textPrimary" className="font-medium">
                        {new Date(job.deadline).toLocaleDateString()}
                      </Typography>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Company Info */}
            <Card className="p-6" elevation={2}>
              <Typography variant="h6" color="textPrimary" className="font-bold mb-4">
                About {job.company}
              </Typography>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Business className={`h-5 w-5 ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`} />
                  <Typography variant="body2" color="textSecondary">
                    Technology Company
                  </Typography>
                </div>
                <div className="flex items-center space-x-3">
                  <Groups className={`h-5 w-5 ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`} />
                  <Typography variant="body2" color="textSecondary">
                    500+ employees
                  </Typography>
                </div>
                <div className="flex items-center space-x-3">
                  <Language className={`h-5 w-5 ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`} />
                  <Typography variant="body2" color="textSecondary">
                    www.{job.company.toLowerCase().replace(/\s+/g, '')}.com
                  </Typography>
                </div>
              </div>
            </Card>

            {/* Apply Button */}
            <Card className="p-6" elevation={2}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleApply}
                className="w-full"
              >
                Apply for this Position
              </Button>
              <Typography variant="body2" color="textSecondary" className="text-center mt-3">
                Join {job.applicants_count || 0} other applicants
              </Typography>
            </Card>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <Modal
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          title="Apply for Position"
        >
          <div className="space-y-6">
            <div>
              <Typography variant="h6" color="textPrimary" className="mb-2">
                {job.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {job.company} • {job.location}
              </Typography>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Cover Letter
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={6}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark 
                    ? 'bg-dark-surface border-dark-accent text-dark-text' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Tell us why you're interested in this position..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outlined"
                onClick={() => setShowApplyModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitApplication}
              >
                Submit Application
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}