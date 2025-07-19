import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building2,
  GraduationCap,
  User,
  Mail,
  Phone,
  Globe,
  Bookmark,
  Share,
  ArrowLeft,
  Users,
  Calendar,
  Heart,
  MessageCircle,
  Repeat2,
  MoreHorizontal,
  CheckCircle
} from 'lucide-react';
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
    <div className={`min-h-screen ${
      isDark ? 'bg-black text-white' : 'bg-white text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* X-style Header */}
        <div ref={heroRef} className={`sticky top-0 z-50 backdrop-blur-xl ${
          isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
        } border-b`}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <Typography variant="h6" className="font-bold">
                  Job Details
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  {job?.company}
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 ${
                  isBookmarked ? 'text-blue-500' : ''
                }`}
              >
                <Bookmark className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <Share className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="px-4 py-6">
          {/* Job Header - Twitter Post Style */}
          <Card className={`p-6 mb-6 ${
            isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          } border rounded-2xl hover:bg-opacity-80 transition-all duration-200`}>
            <div className="flex gap-4">
              <div className={`w-12 h-12 rounded-full ${
                isDark ? 'bg-blue-600' : 'bg-blue-500'
              } flex items-center justify-center flex-shrink-0`}>
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Typography variant="h5" className="font-bold truncate">
                    {job?.title}
                  </Typography>
                  <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                </div>
                <div className="flex items-center gap-4 mb-3 text-gray-500">
                  <span className="font-medium">{job?.company}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job?.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDate(job?.postedAt)}
                  </span>
                </div>
                
                {/* Job Type & Salary */}
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="rounded-full">
                    {job?.type}
                  </Badge>
                  <Badge variant="outline" className="rounded-full text-green-600">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {job?.salary}
                  </Badge>
                </div>

                {/* Job Description Preview */}
                <Typography variant="body1" className="mb-4 line-clamp-3">
                  {job?.description}
                </Typography>

                {/* Engagement Actions - Twitter Style */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-8">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">12</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 text-gray-500 hover:text-green-600"
                    >
                      <Repeat2 className="h-4 w-4" />
                      <span className="text-sm">8</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 text-gray-500 hover:text-red-500"
                    >
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">24</span>
                    </Button>
                  </div>
                  <Button
                    className={`px-8 py-2 rounded-full font-semibold ${
                      isDark 
                        ? 'bg-white text-black hover:bg-gray-200' 
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                    onClick={handleApply}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Job Details Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Full Description */}
              <Card className={`p-6 ${
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
              } border rounded-2xl`}>
                <Typography variant="h6" className="font-bold mb-4">
                  Job Description
                </Typography>
                <div className="prose dark:prose-invert max-w-none">
                  <Typography variant="body1" className="whitespace-pre-wrap leading-relaxed">
                    {job?.description}
                  </Typography>
                </div>
              </Card>

              {/* Requirements */}
              <Card className={`p-6 ${
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
              } border rounded-2xl`}>
                <Typography variant="h6" className="font-bold mb-4">
                  Requirements
                </Typography>
                <ul className="space-y-3">
                  {job?.requirements?.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 ${
                        isDark ? 'bg-blue-400' : 'bg-blue-600'
                      }`}></div>
                      <Typography variant="body1" className="flex-1">
                        {req}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Skills */}
              <Card className={`p-6 ${
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
              } border rounded-2xl`}>
                <Typography variant="h6" className="font-bold mb-4">
                  Required Skills
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {job?.skills?.map((skill, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Benefits */}
              {job?.benefits && (
                <Card className={`p-6 ${
                  isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                } border rounded-2xl`}>
                  <Typography variant="h6" className="font-bold mb-4">
                    Benefits & Perks
                  </Typography>
                  <ul className="space-y-3">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className={`h-5 w-5 mt-0.5 ${
                          isDark ? 'text-green-400' : 'text-green-600'
                        }`} />
                        <Typography variant="body1" className="flex-1">
                          {benefit}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Info */}
              <Card className={`p-6 ${
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
              } border rounded-2xl`}>
                <Typography variant="h6" className="font-bold mb-4">
                  About the Company
                </Typography>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className={`h-5 w-5 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <Typography variant="body2" className="font-medium">
                      {job?.company}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className={`h-5 w-5 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <Typography variant="body2" className="text-gray-500">
                      500+ employees
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className={`h-5 w-5 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <Typography variant="body2" className="text-gray-500">
                      www.{job?.company.toLowerCase().replace(/\s+/g, '')}.com
                    </Typography>
                  </div>
                </div>
              </Card>

              {/* Job Details */}
              <Card className={`p-6 ${
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
              } border rounded-2xl`}>
                <Typography variant="h6" className="font-bold mb-4">
                  Job Details
                </Typography>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Briefcase className={`h-5 w-5 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <div>
                      <Typography variant="body2" className="font-medium">
                        {job?.type}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        Employment Type
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className={`h-5 w-5 ${
                      isDark ? 'text-green-400' : 'text-green-600'
                    }`} />
                    <div>
                      <Typography variant="body2" className="font-medium">
                        {job?.salary}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        Salary Range
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className={`h-5 w-5 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <div>
                      <Typography variant="body2" className="font-medium">
                        {formatDate(job?.postedAt)}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        Posted Date
                      </Typography>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Apply */}
              <Card className={`p-6 ${
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
              } border rounded-2xl`}>
                <Button
                  className={`w-full py-3 rounded-full font-semibold ${
                    isDark 
                      ? 'bg-white text-black hover:bg-gray-200' 
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                  onClick={handleApply}
                >
                  Apply for this Position
                </Button>
                <Typography variant="body2" className="text-center mt-3 text-gray-500">
                  Join 24 other applicants
                </Typography>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
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
    </div>
  );
}