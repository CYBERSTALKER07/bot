import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Briefcase,
  Share2,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  Building2,
  Clock,
  X,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useJobDetail } from '../hooks/useOptimizedQuery';
import Button from './ui/Button';
import { cn } from '../lib/cva';

export default function JobDetails() {
  const { jobId } = useParams<{ jobId: string }>();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { data: job, isLoading: loading, error: jobError } = useJobDetail(jobId);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  if (loading) {
    return (
      <div className={cn(
        'min-h-screen flex items-center justify-center p-4',
        isDark ? 'bg-black' : 'bg-gray-50'
      )}>
        <div className={cn(
          'rounded-3xl p-8 text-center max-w-md w-full',
          isDark ? 'bg-black border border-gray-800' : 'bg-white border border-gray-200'
        )}>
          <p className={cn('font-semibold mb-2', isDark ? 'text-gray-300' : 'text-gray-600')}>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job || jobError) {
    return (
      <div className={cn(
        'min-h-screen flex items-center justify-center p-4',
        isDark ? 'bg-black' : 'bg-gray-50'
      )}>
        <div className={cn(
          'rounded-3xl p-8 text-center max-w-md w-full',
          isDark ? 'bg-black border border-gray-800' : 'bg-white border border-gray-200'
        )}>
          <p className="text-red-600 font-semibold mb-2">Job Not Found</p>
          <p className={cn('text-sm mb-6', isDark ? 'text-gray-400' : 'text-gray-600')}>
            {jobError instanceof Error ? jobError.message : 'The job you are looking for could not be found.'}
          </p>
          <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
        </div>
      </div>
    );
  }

  const handleApply = async () => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    setShowApplyModal(true);
  };

  const handleSubmitApplication = async () => {
    try {
      // Handle application submission
      console.log('Application submitted for job:', job.id);
      console.log('Cover letter:', coverLetter);
      setShowApplyModal(false);
      setCoverLetter('');
    } catch (err) {
      console.error('Error submitting application:', err);
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return 'TBA';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={cn(
      'min-h-screen',
      isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'
    )}>
      {/* Back Button */}
      <div className={cn(
        'sticky top-0 z-39 border-b',
        isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/jobs"
            className={cn(
              'inline-flex items-center space-x-2 transition-colors',
              isDark
                ? 'text-info-400 hover:text-info-300'
                : 'text-info-600 hover:text-info-700'
            )}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Jobs</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
        {/* Job Header - Title & Info Section */}
        <div className={cn(
          'rounded-3xl overflow-hidden mb-8 p-8',
          isDark
            ? 'bg-black border border-gray-800 shadow-2xl shadow-black/50'
            : 'bg-white border border-gray-200 shadow-lg'
        )}>
          {/* Job Type Badge */}
          <div className="flex items-center space-x-2 mb-4 w-fit">
            <span className={cn(
              'px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center space-x-2',
              isDark
                ? 'bg-info-900/30 text-info-300 border border-info-700'
                : 'bg-info-50 text-info-700 border border-info-200'
            )}>
              <Briefcase className="h-4 w-4" />
              <span>{job.type || 'Full-time'}</span>
            </span>
          </div>

          {/* Title and Company */}
          <h1 className={cn(
            'text-4xl font-bold mb-2',
            isDark ? 'text-white' : 'text-gray-900'
          )}>{job.title}</h1>
          <p className={cn(
            'text-lg mb-6',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            {job.company}
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Location */}
            <div className={cn(
              'flex items-start space-x-4 p-4 rounded-xl',
              isDark
                ? 'bg-gray-900 border border-gray-700'
                : 'bg-gray-50 border border-gray-200'
            )}>
              <MapPin className={cn(
                'h-6 w-6 flex-shrink-0 mt-1',
                isDark ? 'text-red-400' : 'text-red-500'
              )} />
              <div>
                <p className={cn('text-sm mb-1', isDark ? 'text-gray-400' : 'text-gray-600')}>Location</p>
                <p className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>{job.location}</p>
              </div>
            </div>

            {/* Salary */}
            <div className={cn(
              'flex items-start space-x-4 p-4 rounded-xl',
              isDark
                ? 'bg-gray-900 border border-gray-700'
                : 'bg-gray-50 border border-gray-200'
            )}>
              <DollarSign className={cn(
                'h-6 w-6 flex-shrink-0 mt-1',
                isDark ? 'text-green-400' : 'text-green-500'
              )} />
              <div>
                <p className={cn('text-sm mb-1', isDark ? 'text-gray-400' : 'text-gray-600')}>Salary</p>
                <p className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>{job.salary_range || 'Competitive'}</p>
              </div>
            </div>

            {/* Posted Date */}
            <div className={cn(
              'flex items-start space-x-4 p-4 rounded-xl',
              isDark
                ? 'bg-gray-900 border border-gray-700'
                : 'bg-gray-50 border border-gray-200'
            )}>
              <Calendar className={cn(
                'h-6 w-6 flex-shrink-0 mt-1',
                isDark ? 'text-yellow-400' : 'text-yellow-500'
              )} />
              <div>
                <p className={cn('text-sm mb-1', isDark ? 'text-gray-400' : 'text-gray-600')}>Posted</p>
                <p className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>{formatDate(job.posted_at)}</p>
              </div>
            </div>

            {/* Job Type */}
            <div className={cn(
              'flex items-start space-x-4 p-4 rounded-xl',
              isDark
                ? 'bg-gray-900 border border-gray-700'
                : 'bg-gray-50 border border-gray-200'
            )}>
              <Clock className={cn(
                'h-6 w-6 flex-shrink-0 mt-1',
                isDark ? 'text-info-400' : 'text-info-500'
              )} />
              <div>
                <p className={cn('text-sm mb-1', isDark ? 'text-gray-400' : 'text-gray-600')}>Type</p>
                <p className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>{job.type || 'Full-time'}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 mb-6">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark job"}
              className={cn(
                'p-3 rounded-full transition-all',
                isBookmarked
                  ? 'bg-yellow-400 text-black'
                  : isDark
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              )}
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-5 w-5" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </button>

            <button
              aria-label="Share job"
              className={cn(
                'p-3 rounded-full transition-all',
                isDark
                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              )}
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          {/* Apply Button */}
          <div>
            <button
              onClick={handleApply}
              className={cn(
                'w-full px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105',
                isDark
                  ? 'bg-info-600 text-white hover:bg-info-700'
                  : 'bg-info-600 text-white hover:bg-info-700'
              )}
            >
              Apply Now 🚀
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <div className={cn(
              'rounded-3xl p-8',
              isDark ? 'bg-black border border-gray-800 shadow-2xl shadow-black/50' : 'bg-white border border-gray-200 shadow-lg'
            )}>
              <h2 className={cn(
                'text-2xl font-bold mb-6',
                isDark ? 'text-white' : 'text-gray-900'
              )}>About This Job</h2>
              <p className={cn(
                'text-lg leading-relaxed whitespace-pre-line',
                isDark ? 'text-gray-400' : 'text-gray-700'
              )}>
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className={cn(
                'rounded-3xl p-8',
                isDark ? 'bg-black border border-gray-800 shadow-2xl shadow-black/50' : 'bg-white border border-gray-200 shadow-lg'
              )}>
                <h3 className={cn(
                  'text-2xl font-bold mb-6',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>Requirements</h3>
                <ul className="space-y-3">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className={cn(
                        'h-5 w-5 mt-1 flex-shrink-0',
                        isDark ? 'text-green-400' : 'text-green-600'
                      )} />
                      <span className={cn(
                        'text-lg',
                        isDark ? 'text-gray-400' : 'text-gray-700'
                      )}>
                        {req}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className={cn(
                'rounded-3xl p-8',
                isDark ? 'bg-black border border-gray-800 shadow-2xl shadow-black/50' : 'bg-white border border-gray-200 shadow-lg'
              )}>
                <h3 className={cn(
                  'text-2xl font-bold mb-6',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>Required Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className={cn(
                        'px-4 py-2 rounded-full text-sm font-medium',
                        isDark
                          ? 'bg-gray-800 text-gray-300 border border-gray-700'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      )}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className={cn(
                'rounded-3xl p-8',
                isDark ? 'bg-black border border-gray-800 shadow-2xl shadow-black/50' : 'bg-white border border-gray-200 shadow-lg'
              )}>
                <h3 className={cn(
                  'text-2xl font-bold mb-6',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>Benefits & Perks</h3>
                <ul className="space-y-3">
                  {Array.isArray(job.benefits) ? job.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Heart className={cn(
                        'h-5 w-5 mt-1 flex-shrink-0',
                        isDark ? 'text-pink-400' : 'text-pink-600'
                      )} />
                      <span className={cn(
                        'text-lg',
                        isDark ? 'text-gray-400' : 'text-gray-700'
                      )}>
                        {benefit}
                      </span>
                    </li>
                  )) : (
                    <li className="flex items-start gap-3">
                      <Heart className={cn(
                        'h-5 w-5 mt-1 flex-shrink-0',
                        isDark ? 'text-pink-400' : 'text-pink-600'
                      )} />
                      <span className={cn(
                        'text-lg',
                        isDark ? 'text-gray-400' : 'text-gray-700'
                      )}>
                        {job.benefits}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Employer Info & Sidebar */}
          <div className="space-y-8">
            {/* Employer Card */}
            {job.employer && (
              <div className={cn(
                'rounded-3xl p-8 sticky top-24',
                isDark ? 'bg-black border border-gray-800 shadow-2xl shadow-black/50' : 'bg-white border border-gray-200 shadow-lg'
              )}>
                <h3 className={cn(
                  'text-xl font-bold mb-6',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>About the Company</h3>

                <div className="flex flex-col items-center text-center mb-6">
                  {job.employer.avatar_url ? (
                    <img 
                      src={job.employer.avatar_url}
                      alt={job.employer.name}
                      className="w-16 h-16 rounded-full object-cover mb-4 border-4 border-info-400"
                    />
                  ) : (
                    <div className={cn(
                      'w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 border-4',
                      isDark
                        ? 'bg-gradient-to-br from-info-600 to-purple-600 text-white border-info-500'
                        : 'bg-gradient-to-br from-blue-400 to-purple-500 text-white border-info-400'
                    )}>
                      {job.employer.name?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <p className={cn(
                    'text-lg font-bold',
                    isDark ? 'text-white' : 'text-gray-900'
                  )}>
                    {job.employer.name}
                  </p>
                  <p className={cn(
                    'text-sm',
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {job.employer.company_name}
                  </p>
                  {job.employer.verified && (
                    <div className="mt-2 flex items-center space-x-1 text-info-500">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs font-semibold">Verified</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Users className={cn(
                      'h-5 w-5',
                      isDark ? 'text-info-400' : 'text-info-600'
                    )} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      View employer profile
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className={cn(
                      'h-5 w-5',
                      isDark ? 'text-info-400' : 'text-info-600'
                    )} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      {job.location}
                    </span>
                  </div>
                </div>

                <button className={cn(
                  'w-full px-4 py-2 rounded-lg font-semibold transition-all',
                  isDark
                    ? 'bg-info-900/20 text-info-400 hover:bg-info-900/30'
                    : 'bg-info-50 text-info-600 hover:bg-info-100'
                )}>
                  View Employer Profile
                </button>
              </div>
            )}

            {/* Quick Apply Card */}
            <div className={cn(
              'rounded-3xl p-8',
              isDark ? 'bg-black border border-gray-800 shadow-2xl shadow-black/50' : 'bg-white border border-gray-200 shadow-lg'
            )}>
              <h3 className={cn(
                'text-xl font-bold mb-4',
                isDark ? 'text-white' : 'text-gray-900'
              )}>Ready to Apply?</h3>
              <p className={cn(
                'text-sm mb-4',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                Submit your application and let the employer know why you're a great fit!
              </p>
              <button
                onClick={handleApply}
                className={cn(
                  'w-full px-6 py-3 rounded-lg font-semibold transition-all',
                  isDark
                    ? 'bg-info-600 text-white hover:bg-info-700'
                    : 'bg-info-600 text-white hover:bg-info-700'
                )}
              >
                Start Application
              </button>
              <p className={cn(
                'text-center text-sm mt-3',
                isDark ? 'text-gray-500' : 'text-gray-500'
              )}>
                Join other applicants
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={cn(
            'rounded-3xl p-8 max-w-md w-full',
            isDark ? 'bg-black border border-gray-800' : 'bg-white'
          )}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={cn(
                'text-2xl font-bold',
                isDark ? 'text-white' : 'text-gray-900'
              )}>Apply for Position</h3>
              <button
                onClick={() => setShowApplyModal(false)}
                aria-label="Close application modal"
                className={cn(
                  'p-2 rounded-full transition-colors',
                  isDark
                    ? 'hover:bg-gray-800 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-500'
                )}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className={cn(
                'font-semibold text-lg mb-1',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                {job.title}
              </p>
              <p className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {job.company} • {job.location}
              </p>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmitApplication(); }}>
              <div>
                <label className={cn(
                  'block text-sm font-medium mb-2',
                  isDark ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className={cn(
                    'w-full p-3 border rounded-lg focus:ring-2 focus:ring-info-500 focus:border-transparent outline-none',
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  )}
                  rows={4}
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className={cn(
                    'flex-1 px-6 py-3 border rounded-lg font-medium transition-colors',
                    isDark
                      ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  )}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={cn(
                    'flex-1 px-6 py-3 rounded-lg font-medium text-white transition-all',
                    isDark
                      ? 'bg-info-600 hover:bg-info-700'
                      : 'bg-info-600 hover:bg-info-700'
                  )}
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}