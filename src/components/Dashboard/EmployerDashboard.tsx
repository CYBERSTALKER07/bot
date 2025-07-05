import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  Add,
  TrendingUp,
  People,
  Work,
  Visibility,
  Edit,
  Delete,
  MoreVert,
  CheckCircle,
  Schedule,
  Star,
  AutoAwesome,
  LocalCafe,
  Favorite
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useJobs } from '../../hooks/useJobs';
import Typography from '../ui/Typography';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import Badge from '../ui/Badge';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { jobs } = useJobs();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const employerJobs = jobs.filter(job => job.employer_id === user?.id);
  const activeJobs = employerJobs.filter(job => job.status === 'active');
  const totalViews = employerJobs.reduce((sum, job) => sum + (job.views || 0), 0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Material Design entrance animations
      gsap.fromTo('.dashboard-header', {
        opacity: 0,
        y: -30,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out'
      });

      gsap.fromTo('.stat-card', {
        opacity: 0,
        y: 20,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        delay: 0.3
      });

      gsap.fromTo('.dashboard-content', {
        opacity: 0,
        y: 20
      }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.5
      });

      // Floating decorations
      gsap.to('.dashboard-decoration', {
        y: -8,
        x: 4,
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handlePostJob = () => {
    navigate('/post-job');
  };

  const handleViewApplicants = (jobId: string) => {
    navigate(`/applicants?job=${jobId}`);
  };

  const handleEditJob = (jobId: string) => {
    navigate(`/job/${jobId}/edit`);
  };

  return (
    <div ref={containerRef} className={`min-h-screen relative ${
      isDark ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      {/* Remove decorative elements */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="dashboard-header mb-12">
          <Card className="overflow-hidden" elevation={2}>
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <Typography variant="h3" className="font-bold mb-2 text-white">
                      Welcome back, {user?.name}!
                    </Typography>
                    <Typography variant="subtitle1" className={`${
                      isDark ? 'text-dark-muted' : 'text-white/90'
                    }`}>
                      Manage your job postings and find the perfect candidates
                    </Typography>
                  </div>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={handlePostJob}
                    className="mt-4 sm:mt-0 bg-white text-asu-maroon hover:bg-gray-100"
                  >
                    <Add className="mr-2" />
                    Post New Job
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-sm">{totalViews} total views</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Work className="h-5 w-5" />
                    <span className="text-sm">{activeJobs.length} active jobs</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <People className="h-5 w-5" />
                    <span className="text-sm">Premium employer</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="stat-card p-6" elevation={2}>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h4" color="primary" className="font-bold">
                  {employerJobs.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Jobs Posted
                </Typography>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isDark ? 'bg-lime/20' : 'bg-asu-maroon/10'
              }`}>
                <Work className={`h-6 w-6 ${
                  isDark ? 'text-lime' : 'text-asu-maroon'
                }`} />
              </div>
            </div>
          </Card>

          <Card className="stat-card p-6" elevation={2}>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h4" color="primary" className="font-bold">
                  {activeJobs.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Active Jobs
                </Typography>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isDark ? 'bg-lime/20' : 'bg-green-100'
              }`}>
                <CheckCircle className={`h-6 w-6 ${
                  isDark ? 'text-lime' : 'text-green-600'
                }`} />
              </div>
            </div>
          </Card>

          <Card className="stat-card p-6" elevation={2}>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h4" color="primary" className="font-bold">
                  {totalViews}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Views
                </Typography>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isDark ? 'bg-lime/20' : 'bg-blue-100'
              }`}>
                <Visibility className={`h-6 w-6 ${
                  isDark ? 'text-lime' : 'text-blue-600'
                }`} />
              </div>
            </div>
          </Card>

          <Card className="stat-card p-6" elevation={2}>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h4" color="primary" className="font-bold">
                  0
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Applications
                </Typography>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isDark ? 'bg-lime/20' : 'bg-purple-100'
              }`}>
                <People className={`h-6 w-6 ${
                  isDark ? 'text-lime' : 'text-purple-600'
                }`} />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Jobs */}
          <div className="lg:col-span-2">
            <Card className="dashboard-content p-8" elevation={2}>
              <div className="flex items-center justify-between mb-6">
                <Typography variant="h5" color="textPrimary" className="font-bold">
                  Recent Job Postings
                </Typography>
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  onClick={handlePostJob}
                >
                  <Add className="mr-1" />
                  Post Job
                </Button>
              </div>
              
              {employerJobs.length === 0 ? (
                <div className="text-center py-12">
                  <Work className={`h-16 w-16 mx-auto mb-4 ${
                    isDark ? 'text-dark-muted' : 'text-gray-400'
                  }`} />
                  <Typography variant="h6" color="textSecondary" className="mb-2">
                    No jobs posted yet
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className="mb-6">
                    Start by posting your first job to attract top talent
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handlePostJob}
                  >
                    <Add className="mr-2" />
                    Post Your First Job
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {employerJobs.slice(0, 5).map((job) => (
                    <div
                      key={job.id}
                      className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                        isDark 
                          ? 'border-dark-accent/20 bg-dark-surface hover:border-lime/30' 
                          : 'border-gray-200 bg-white hover:border-asu-maroon/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Typography variant="h6" color="textPrimary" className="font-semibold">
                              {job.title}
                            </Typography>
                            <Badge 
                              variant="standard" 
                              color={job.status === 'active' ? 'primary' : 'secondary'}
                            >
                              {job.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm mb-3">
                            <span className={isDark ? 'text-dark-muted' : 'text-gray-600'}>
                              {job.location}
                            </span>
                            <span className={isDark ? 'text-dark-muted' : 'text-gray-600'}>
                              {job.type}
                            </span>
                            <span className={isDark ? 'text-dark-muted' : 'text-gray-600'}>
                              {job.applicants_count || 0} applicants
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Button
                              variant="text"
                              color="primary"
                              size="small"
                              onClick={() => handleViewApplicants(job.id)}
                            >
                              View Applicants
                            </Button>
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => handleEditJob(job.id)}
                              className={isDark ? 'text-dark-muted' : 'text-gray-600'}
                            >
                              <Edit className="mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <Typography variant="body2" color="textSecondary">
                              {job.views || 0} views
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {new Date(job.posted_date).toLocaleDateString()}
                            </Typography>
                          </div>
                          <Button
                            variant="text"
                            size="small"
                            className="p-2"
                          >
                            <MoreVert />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {employerJobs.length > 5 && (
                    <div className="text-center pt-4">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate('/jobs')}
                      >
                        View All Jobs
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-8">
            <Card className="dashboard-content p-6" elevation={2}>
              <Typography variant="h6" color="textPrimary" className="font-bold mb-6">
                Quick Actions
              </Typography>
              <div className="space-y-4">
                <Link 
                  to="/post-job"
                  className={`block p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    isDark 
                      ? 'border-dark-accent/20 bg-dark-surface hover:border-lime/30' 
                      : 'border-gray-200 bg-white hover:border-asu-maroon/30'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-lime/20' : 'bg-asu-maroon/10'
                    }`}>
                      <Add className={`h-5 w-5 ${
                        isDark ? 'text-lime' : 'text-asu-maroon'
                      }`} />
                    </div>
                    <div>
                      <Typography variant="body1" color="textPrimary" className="font-medium">
                        Post New Job
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Create a new job posting
                      </Typography>
                    </div>
                  </div>
                </Link>

                <Link 
                  to="/applicants"
                  className={`block p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    isDark 
                      ? 'border-dark-accent/20 bg-dark-surface hover:border-lime/30' 
                      : 'border-gray-200 bg-white hover:border-asu-maroon/30'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-lime/20' : 'bg-blue-100'
                    }`}>
                      <People className={`h-5 w-5 ${
                        isDark ? 'text-lime' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <Typography variant="body1" color="textPrimary" className="font-medium">
                        View Applicants
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Review job applications
                      </Typography>
                    </div>
                  </div>
                </Link>

                <Link 
                  to="/messages"
                  className={`block p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    isDark 
                      ? 'border-dark-accent/20 bg-dark-surface hover:border-lime/30' 
                      : 'border-gray-200 bg-white hover:border-asu-maroon/30'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-lime/20' : 'bg-green-100'
                    }`}>
                      <Star className={`h-5 w-5 ${
                        isDark ? 'text-lime' : 'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <Typography variant="body1" color="textPrimary" className="font-medium">
                        Messages
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Chat with candidates
                      </Typography>
                    </div>
                  </div>
                </Link>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6" elevation={2}>
              <Typography variant="h6" color="textPrimary" className="font-bold mb-4">
                Hiring Tips
              </Typography>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                    isDark ? 'text-lime' : 'text-green-500'
                  }`} />
                  <Typography variant="body2" color="textSecondary">
                    Post detailed job descriptions to attract qualified candidates
                  </Typography>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                    isDark ? 'text-lime' : 'text-green-500'
                  }`} />
                  <Typography variant="body2" color="textSecondary">
                    Include salary ranges to increase application rates
                  </Typography>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                    isDark ? 'text-lime' : 'text-green-500'
                  }`} />
                  <Typography variant="body2" color="textSecondary">
                    Respond quickly to applications to secure top talent
                  </Typography>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}