import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Job } from '../types';

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Job Header */}
        <div className="p-6 border-b">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-5 w-5 text-gray-500" />
                <span className="text-xl text-gray-700 font-medium">{job.company}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Posted {new Date(job.posted_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{job.applicants_count} applicants</span>
                </div>
                {job.deadline && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {user?.role === 'student' && (
              <div className="flex flex-col space-y-3 mt-6 lg:mt-0 lg:ml-6">
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="bg-asu-maroon text-white px-6 py-3 rounded-md hover:bg-asu-maroon-dark transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Apply Now</span>
                </button>
                <button
                  onClick={toggleBookmark}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  {bookmarked ? <Bookmark className="h-5 w-5" /> : <BookmarkPlus className="h-5 w-5" />}
                  <span>{bookmarked ? 'Saved' : 'Save Job'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Job Type Badge */}
          <div className="mt-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              job.type === 'internship' ? 'bg-blue-100 text-blue-800' :
              job.type === 'full-time' ? 'bg-green-100 text-green-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {job.type.replace('-', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Job Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                <div className="prose max-w-none">
                  {job.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-asu-maroon mt-1">•</span>
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Skills */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Company Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About {job.company}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Intel Corporation is a world leader in computing innovation. For over 50 years, 
                  Intel has created computing and communications technologies that power the world's 
                  innovations.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center space-x-1 text-asu-maroon hover:text-asu-maroon-dark mt-3 text-sm"
                >
                  <span>Learn more about Intel</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              {/* Similar Jobs */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Jobs</h3>
                <div className="space-y-3">
                  <Link
                    to="/job/2"
                    className="block p-3 bg-white rounded border hover:shadow-sm transition-shadow"
                  >
                    <h4 className="font-medium text-gray-900 text-sm">Frontend Developer Intern</h4>
                    <p className="text-gray-600 text-xs">Microsoft</p>
                  </Link>
                  <Link
                    to="/job/3"
                    className="block p-3 bg-white rounded border hover:shadow-sm transition-shadow"
                  >
                    <h4 className="font-medium text-gray-900 text-sm">Data Science Intern</h4>
                    <p className="text-gray-600 text-xs">Apple</p>
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
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for {job.title}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                  placeholder="Tell the employer why you're interested in this position..."
                />
              </div>
              <div className="text-sm text-gray-600">
                Your resume and profile information will be automatically included with your application.
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 bg-asu-maroon text-white py-2 px-4 rounded-md hover:bg-asu-maroon-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}