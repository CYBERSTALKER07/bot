import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save,
  Eye,
  MapPin,
  DollarSign,
  Briefcase,
  Building2,
  Users,
  Clock,
  Mail,
  TrendingUp,
  Hash,
  X as XIcon,
  Plus,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Image as ImageIcon,
  Video,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useJobManagement } from '../hooks/useJobManagement';
import { supabase } from '../lib/supabase';
import Button from './ui/Button';
import Avatar from './ui/Avatar';
import PageLayout from './ui/PageLayout';
import Stepper, { Step } from './ui/Stepper';
import { cn } from '../lib/cva';

export default function PostJob() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { postJob, loading, error, success, clearMessages } = useJobManagement();
  
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    company: user?.profile?.company_name || '',
    location: '',
    type: 'full-time' as const,
    salary: '',
    description: '',
    requirements: '',
    benefits: '',
    skills: [] as string[],
    deadline: '',
    contact_email: user?.email || '',
    is_remote: false,
    experience_level: 'entry',
    department: ''
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Check if user is employer
  useEffect(() => {
    if (user && user.role !== 'employer') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const uploadMedia = async (file: File): Promise<string> => {
    try {
      setUploadingMedia(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const userId = user?.id;
      
      const isVideo = file.type.startsWith('video/');
      const bucketName = isVideo ? 'videos' : 'post-images';
      const filePath = `${userId}/jobs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw new Error('Failed to upload media');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleMediaSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedMedia(file);
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);
      
      // Auto-upload media
      try {
        await uploadMedia(file);
      } catch (err) {
        console.error('Failed to upload media:', err);
        alert('Failed to upload media. Please try again.');
      }
    }
  };

  const removeMedia = () => {
    setSelectedMedia(null);
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaPreview(null);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) fileInputRef.current.value = '';
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) errors.title = 'Job title is required';
    if (!formData.company.trim()) errors.company = 'Company name is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.description.trim()) errors.description = 'Job description is required';
    if (!formData.requirements.trim()) errors.requirements = 'Requirements are required';
    if (!formData.contact_email.trim()) errors.contact_email = 'Contact email is required';
    if (formData.skills.length === 0) errors.skills = 'At least one skill is required';
    if (formData.deadline && new Date(formData.deadline) < new Date()) {
      errors.deadline = 'Deadline must be in the future';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
      if (validationErrors.skills) {
        const newErrors = { ...validationErrors };
        delete newErrors.skills;
        setValidationErrors(newErrors);
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await postJob(formData);
      
      if (result) {
        setTimeout(() => {
          clearMessages();
          navigate('/dashboard');
        }, 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout 
      className={cn(isDark ? 'bg-black text-white' : 'bg-white text-black')}
      maxWidth="7xl"
      padding="none"
    >
      {/* Header */}
      <div className={cn("sticky top-0 z-10 backdrop-blur-xl border-b", isDark ? 'bg-black text-white bordbg-black' : 'bg-white text-black border-gray-300')}>
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className={cn("p-2 rounded-full transition-colors", isDark ? 'hover:bg-black' : 'hover:bg-gray-200')}
              title="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Post a Job</h1>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="p-2"
            title="Close"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className={cn("border-b p-4", isDark ? 'bordbg-black bg-red-950/30' : 'border-gray-300 bg-red-50')}>
          <div className="flex items-start space-x-3 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <AlertCircle className={cn("h-5 w-5 flex-shrink-0 mt-0.5", isDark ? 'text-red-400' : 'text-red-600')} />
            <div className="flex-1">
              <p className={cn("font-semibold text-sm sm:text-base", isDark ? 'text-red-400' : 'text-red-800')}>{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className={cn("border-b p-4", isDark ? 'bordbg-black bg-green-950/30' : 'border-gray-300 bg-green-50')}>
          <div className="flex items-start space-x-3 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <CheckCircle className={cn("h-5 w-5 flex-shrink-0 mt-0.5", isDark ? 'text-green-400' : 'text-green-600')} />
            <div className="flex-1">
              <p className={cn("font-semibold text-sm sm:text-base", isDark ? 'text-green-400' : 'text-green-800')}>{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Full Width */}
      <div className={cn("w-full", isDark ? 'bg-black' : 'bg-white')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">
          <form onSubmit={handleSubmit} className="w-full">
            <Stepper
              initialStep={1}
              onStepChange={() => {
                // Step change handler
              }}
              backButtonText="← Previous"
              nextButtonText="Next →"
              stepCircleContainerClassName={cn(
                isDark ? 'bg-black bordbg-black' : 'bg-gray-50 border-gray-300',
                'border rounded-xl'
              )}
              stepContainerClassName={cn(isDark ? '' : '')}
              contentClassName={cn(
                'py-8 sm:py-10',
                isDark ? 'bg-gray-900/50' : 'bg-gray-50/50'
              )}
              footerClassName={cn(isDark ? '' : '')}
            >
              {/* Step 1: Basic Information */}
              <Step>
                <div className="space-y-6 bg-black">
                  <div>
                    <h2 className={cn("text-2xl font-bold mb-2", isDark ? 'text-white' : 'text-black')}>
                      Job Basics
                    </h2>
                    <p className={cn("text-sm", isDark ? 'text-gray-400' : 'text-gray-600')}>
                      Tell us about the position
                    </p>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Avatar 
                      src={user?.profile.avatar_url || ''} 
                      alt={user?.profile.full_name || 'User'} 
                      size="lg"
                      className="flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className={cn("font-bold text-lg", isDark ? 'text-white' : 'text-black')}>{user?.profile?.full_name || 'Your Company'}</div>
                      <div className={cn("text-sm", isDark ? 'text-gray-400' : 'text-gray-600')}>{user?.profile?.company_name || 'Company Name'}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={cn("font-semibold text-base", isDark ? 'text-white' : 'text-black')}>
                      Job Title *
                    </label>
                    <textarea
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Senior Product Manager, Frontend Engineer..."
                      rows={2}
                      className={cn("w-full text-lg font-semibold bg-transparent border rounded-lg px-4 py-3 outline-none focus:border-2 resize-none", isDark ? 'border-gray-700 placeholder-gray-500 text-white focus:border-info-500' : 'border-gray-300 placeholder-gray-400 text-black focus:bg-white focus:border-black')}
                    />
                    {validationErrors.title && (
                      <p className="text-red-600 text-sm">{validationErrors.title}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={cn("font-semibold flex items-center space-x-2", isDark ? 'text-white' : 'text-black')}>
                        <Building2 className="h-4 w-4" />
                        <span>Company *</span>
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Company name"
                        className={cn("w-full border rounded-lg px-4 py-2 outline-none focus:border-2", isDark ? 'bg-black border-gray-700 text-white focus:border-info-500' : 'bg-white border-gray-300 text-black focus:bg-white focus:border-black')}
                      />
                      {validationErrors.company && (
                        <p className="text-red-600 text-sm">{validationErrors.company}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className={cn("font-semibold flex items-center space-x-2", isDark ? 'text-white' : 'text-black')}>
                        <MapPin className="h-4 w-4" />
                        <span>Location *</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City, State or Remote"
                        className={cn("w-full border rounded-lg px-4 py-2 outline-none focus:border-2", isDark ? 'bg-black border-gray-700 text-white focus:border-info-500' : 'bg-white border-gray-300 text-black focus:bg-white focus:border-black')}
                      />
                      {validationErrors.location && (
                        <p className="text-red-600 text-sm">{validationErrors.location}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={cn("font-semibold flex items-center space-x-2", isDark ? 'text-white' : 'text-black')}>
                        <Clock className="h-4 w-4" />
                        <span>Job Type</span>
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className={cn("w-full border rounded-lg px-4 py-2 outline-none focus:border-2", isDark ? 'bg-black border-gray-700 text-white focus:border-info-500' : 'bg-white border-gray-300 text-black focus:bg-white focus:border-black')}
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="internship">Internship</option>
                        <option value="contract">Contract</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className={cn("font-semibold flex items-center space-x-2", isDark ? 'text-white' : 'text-black')}>
                        <DollarSign className="h-4 w-4" />
                        <span>Salary Range</span>
                      </label>
                      <input
                        type="text"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        placeholder="e.g., $60k-80k or $25/hour"
                        className={cn("w-full border rounded-lg px-4 py-2 outline-none focus:border-2", isDark ? 'bg-black border-gray-700 text-white focus:border-info-500' : 'bg-white border-gray-300 text-black focus:bg-white focus:border-black')}
                      />
                    </div>
                  </div>

                  <label className={cn("flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2", isDark ? 'border-gray-700 hover:bg-black' : 'border-gray-300 hover:bg-gray-100', formData.is_remote ? (isDark ? 'bg-info-600/10 border-info-500' : 'bg-info-50 border-info-500') : '')}>
                    <input
                      type="checkbox"
                      name="is_remote"
                      checked={formData.is_remote}
                      onChange={handleInputChange}
                      className={cn("w-5 h-5 rounded border-2 focus:ring-2", isDark ? 'border-gray-600 bg-black focus:ring-info-500' : 'border-gray-400 focus:ring-black')}
                    />
                    <span className="font-semibold">🌍 Remote work available</span>
                  </label>
                </div>
              </Step>

              {/* Step 2: Description & Media */}
              <Step>
                <div className="space-y-6 bg-black">
                  <div>
                    <h2 className={cn("text-2xl font-bold mb-2", isDark ? 'text-white' : 'text-black')}>
                      Job Description
                    </h2>
                    <p className={cn("text-sm", isDark ? 'text-gray-400' : 'text-gray-600')}>
                      Add details and media about the role
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className={cn("font-semibold flex items-center space-x-2", isDark ? 'text-white' : 'text-black')}>
                      <TrendingUp className="h-4 w-4" />
                      <span>Description *</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                      rows={5}
                      className={cn("w-full border rounded-lg px-4 py-2 outline-none focus:border-2 resize-none", isDark ? 'bg-black border-gray-700 text-white focus:border-info-500' : 'bg-white border-gray-300 text-black focus:bg-white focus:border-black')}
                    />
                    {validationErrors.description && (
                      <p className="text-red-600 text-sm">{validationErrors.description}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className={cn("font-semibold flex items-center space-x-2", isDark ? 'text-white' : 'text-black')}>
                      <ImageIcon className="h-4 w-4" />
                      <span>Add Media (optional)</span>
                    </div>
                    
                    {!mediaPreview ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className={cn("flex-1 border-2 border-dashed rounded-lg p-6 transition-colors text-center", isDark ? 'border-gray-700 hover:border-info-500 hover:bg-black/50' : 'border-gray-400 hover:border-black hover:bg-gray-100')}
                          title="Upload image"
                        >
                          <ImageIcon className={cn("h-8 w-8 mx-auto mb-2", isDark ? 'text-gray-400' : 'text-gray-600')} />
                          <div className={cn("font-semibold text-sm", isDark ? 'text-white' : 'text-black')}>Add Image</div>
                          <div className={cn("text-xs", isDark ? 'text-gray-400' : 'text-gray-600')}>JPG, PNG up to 5MB</div>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => videoInputRef.current?.click()}
                          className={cn("flex-1 border-2 border-dashed rounded-lg p-6 transition-colors text-center", isDark ? 'border-gray-700 hover:border-info-500 hover:bg-black/50' : 'border-gray-400 hover:border-black hover:bg-gray-100')}
                          title="Upload video"
                        >
                          <Video className={cn("h-8 w-8 mx-auto mb-2", isDark ? 'text-gray-400' : 'text-gray-600')} />
                          <div className={cn("font-semibold text-sm", isDark ? 'text-white' : 'text-black')}>Add Video</div>
                          <div className={cn("text-xs", isDark ? 'text-gray-400' : 'text-gray-600')}>MP4 up to 50MB</div>
                        </button>
                      </div>
                    ) : (
                      <div className={cn("relative rounded-lg overflow-hidden", isDark ? 'bg-black' : 'bg-gray-100')}>
                        {selectedMedia?.type.startsWith('image/') ? (
                          <img 
                            src={mediaPreview} 
                            alt="Preview" 
                            className="w-full h-auto max-h-96 object-cover"
                          />
                        ) : (
                          <video 
                            src={mediaPreview} 
                            controls 
                            className="w-full h-auto max-h-96"
                          />
                        )}
                        <button
                          type="button"
                          onClick={removeMedia}
                          className={cn("absolute top-3 right-3 rounded-full p-2 transition-colors", isDark ? 'bg-black text-white hover:bg-black' : 'bg-black text-white hover:bg-black')}
                          title="Remove media"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {uploadingMedia && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className={cn("font-semibold flex items-center space-x-2", isDark ? 'text-white' : 'text-black')}>
                      <TrendingUp className="h-4 w-4" />
                      <span>Benefits & Perks</span>
                    </label>
                    <textarea
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleInputChange}
                      placeholder="Health insurance, flexible hours, learning opportunities, stock options..."
                      rows={3}
                      className={cn("w-full border rounded-lg px-4 py-2 outline-none focus:border-2 resize-none", isDark ? 'bg-black border-gray-700 text-white focus:border-info-500' : 'bg-white border-gray-300 text-black focus:bg-white focus:border-black')}
                    />
                  </div>
                </div>
              </Step>

              {/* Step 3: Requirements & Skills */}
              <Step>
                <div className="space-y-6 bg-black">
                  <div>
                    <h2 className={cn("text-2xl font-bold mb-2", isDark ? 'text-white' : 'text-black')}>
                      Requirements & Skills
                    </h2>
                    <p className={cn("text-sm", isDark ? 'text-gray-400' : 'text-gray-600')}>
                      What should candidates have?
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className={cn("font-semibold flex items-center space-x-2", isDark ? 'text-white' : 'text-black')}>
                      <Hash className="h-4 w-4" />
                      <span>Requirements *</span>
                    </label>
                    <textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      placeholder="List the required qualifications, skills, and experience (one per line)..."
                      rows={4}
                      className={cn("w-full border rounded-lg px-4 py-2 outline-none focus:border-2 resize-none", isDark ? 'bg-black border-gray-700 text-white focus:border-info-500' : 'bg-white border-gray-300 text-black focus:bg-white focus:border-black')}
                    />
                    {validationErrors.requirements && (
                      <p className="text-red-600 text-sm">{validationErrors.requirements}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className={cn("font-semibold flex items-center space-x-2", isDark ? 'text-white' : 'text-black')}>
                      <Users className="h-4 w-4" />
                      <span>Required Skills * ({formData.skills.length})</span>
                    </label>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        placeholder="Add a skill..."
                        className={cn("flex-1 border rounded-lg px-4 py-2 outline-none focus:border-2", isDark ? 'bg-black border-gray-700 text-white focus:border-info-500' : 'bg-white border-gray-300 text-black focus:bg-white focus:border-black')}
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className={cn("px-6 py-2 rounded-lg font-bold transition-colors flex items-center justify-center", isDark ? 'bg-info-600 text-white hover:bg-info-700' : 'bg-black text-white hover:bg-black')}
                        title="Add skill"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className={cn("px-3 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-colors", isDark ? 'bg-info-600 text-white hover:bg-info-700' : 'bg-black text-white hover:bg-black')}
                          title={`Remove ${skill}`}
                        >
                          <span>{skill}</span>
                          <XIcon className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                    {validationErrors.skills && (
                      <p className="text-red-600 text-sm">{validationErrors.skills}</p>
                    )}
                  </div>
                </div>
              </Step>

              {/* Step 4: Additional Details */}
              <Step>
                <div className="space-y-6 bg-black">
                  <div>
                    <h2 className={cn("text-2xl font-bold mb-2", isDark ? 'text-white' : 'text-black')}>
                      Final Details
                    </h2>
                    <p className={cn("text-sm", isDark ? 'text-gray-400' : 'text-gray-600')}>
                      Complete your job posting
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={cn("font-semibold flex items-center space-x-2", isDark ? 'text-white' : 'text-black')}>
                        <Calendar className="h-4 w-4" />
                        <span>Application Deadline</span>
                      </label>
                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        className={cn("w-full border rounded-lg px-4 py-2 outline-none focus:border-2", isDark ? 'bg-black border-gray-700 text-white focus:border-info-500' : 'bg-white border-gray-300 text-black focus:bg-white focus:border-black')}
                      />
                      {validationErrors.deadline && (
                        <p className="text-red-600 text-sm">{validationErrors.deadline}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className={cn("font-semibold flex items-center space-x-2", isDark ? 'text-white' : 'text-black')}>
                        <Mail className="h-4 w-4" />
                        <span>Contact Email *</span>
                      </label>
                      <input
                        type="email"
                        name="contact_email"
                        value={formData.contact_email}
                        onChange={handleInputChange}
                        placeholder="hiring@company.com"
                        className={cn("w-full border rounded-lg px-4 py-2 outline-none focus:border-2", isDark ? 'bg-black border-gray-700 text-white focus:border-info-500' : 'bg-white border-gray-300 text-black focus:bg-white focus:border-black')}
                      />
                      {validationErrors.contact_email && (
                        <p className="text-red-600 text-sm">{validationErrors.contact_email}</p>
                      )}
                    </div>
                  </div>

                  <div className={cn("rounded-lg border p-4 sm:p-6 space-y-4", isDark ? 'bg-black border-gray-700' : 'bg-gray-50 border-gray-300')}>
                    <h3 className={cn("font-bold flex items-center space-x-2", isDark ? 'text-white' : 'text-black')}>
                      <CheckCircle className="h-5 w-5" />
                      <span>Tips for Success</span>
                    </h3>
                    <ul className={cn("space-y-2 text-sm", isDark ? 'text-gray-300' : 'text-gray-700')}>
                      <li className="flex items-start space-x-2">
                        <span className="font-bold">•</span>
                        <span>Include salary range to attract quality candidates</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="font-bold">•</span>
                        <span>Be specific about required skills and experience</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="font-bold">•</span>
                        <span>Add images or videos to showcase company culture</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="font-bold">•</span>
                        <span>Highlight unique benefits and perks</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className={cn("flex-1 border-2 py-3 rounded-lg font-bold transition-colors flex items-center justify-center", isDark ? 'border-info-600 text-info-400 bg-transparent hover:bg-info-600/10' : 'border-black text-black bg-white hover:bg-gray-100')}
                      disabled={isSubmitting || loading}
                      title="Preview job posting"
                    >
                      <Eye className="h-5 w-5 mr-2" />
                      Preview
                    </button>
                    <button
                      type="submit"
                      className={cn("flex-1 py-3 rounded-lg font-bold transition-colors flex items-center justify-center disabled:opacity-50", isDark ? 'bg-info-600 text-white hover:bg-info-700' : 'bg-black text-white hover:bg-black')}
                      disabled={isSubmitting || loading}
                      title="Submit and post job"
                    >
                      {isSubmitting || loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          Post Job
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Step>
            </Stepper>
          </form>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={cn("max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border-2", isDark ? 'bg-black border-info-600 text-white' : 'bg-white border-black text-black')}>
            
            {/* Preview Header */}
            <div className={cn("sticky top-0 backdrop-blur-xl border-b-2 p-4 flex items-center justify-between", isDark ? 'bg-black/80 bordbg-black' : 'bg-white/80 border-gray-200')}>
              <h2 className="text-xl font-bold">Job Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2"
                title="Close preview"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Preview Content */}
            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className={cn("flex items-start space-x-4 pb-4 border-b-2", isDark ? 'bordbg-black' : 'border-gray-300')}>
                <Avatar 
                  src={user?.profile.avatar_url || ''} 
                  alt={user?.profile.full_name || 'User'} 
                  size="lg"
                />
                <div>
                  <div className="font-bold text-lg">{user?.profile?.full_name || 'Company'}</div>
                  <div className={cn(isDark ? 'text-gray-400' : 'text-gray-600')}>{user?.profile?.company_name || 'Company Name'}</div>
                </div>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-3xl font-bold mb-4">
                  {formData.title || 'Job Title'}
                </h1>
                
                {/* Quick Info */}
                <div className="flex flex-wrap gap-4 text-sm font-semibold mb-4">
                  {formData.company && (
                    <div className={cn("flex items-center space-x-2 px-3 py-2 rounded-lg", isDark ? 'bg-black text-gray-300' : 'bg-gray-100 text-gray-700')}>
                      <Building2 className="h-4 w-4" />
                      <span>{formData.company}</span>
                    </div>
                  )}
                  {formData.location && (
                    <div className={cn("flex items-center space-x-2 px-3 py-2 rounded-lg", isDark ? 'bg-black text-gray-300' : 'bg-gray-100 text-gray-700')}>
                      <MapPin className="h-4 w-4" />
                      <span>{formData.location}</span>
                    </div>
                  )}
                  <div className={cn("flex items-center space-x-2 px-3 py-2 rounded-lg", isDark ? 'bg-black text-gray-300' : 'bg-gray-100 text-gray-700')}>
                    <Briefcase className="h-4 w-4" />
                    <span className="capitalize">{formData.type.replace('-', ' ')}</span>
                  </div>
                  {formData.salary && (
                    <div className={cn("flex items-center space-x-2 px-3 py-2 rounded-lg", isDark ? 'bg-black text-gray-300' : 'bg-gray-100 text-gray-700')}>
                      <DollarSign className="h-4 w-4" />
                      <span>{formData.salary}</span>
                    </div>
                  )}
                </div>

                {formData.is_remote && (
                  <div className={cn("inline-block px-3 py-1 rounded-full text-sm font-bold", isDark ? 'bg-info-600/20 text-info-400' : 'bg-black text-white')}>
                    🌍 Remote Available
                  </div>
                )}
              </div>

              {/* Media Preview */}
              {mediaPreview && (
                <div className={cn("rounded-lg overflow-hidden border-2", isDark ? 'bordbg-black' : 'border-gray-300')}>
                  {selectedMedia?.type.startsWith('image/') ? (
                    <img src={mediaPreview} alt="Job posting" className="w-full h-auto" />
                  ) : (
                    <video src={mediaPreview} controls className="w-full h-auto" />
                  )}
                </div>
              )}
              
              {/* Description */}
              {formData.description && (
                <div>
                  <h3 className="font-bold text-lg mb-2">About the Role</h3>
                  <p className={cn("whitespace-pre-wrap leading-relaxed", isDark ? 'text-gray-300' : 'text-gray-700')}>
                    {formData.description}
                  </p>
                </div>
              )}
              
              {/* Requirements */}
              {formData.requirements && (
                <div>
                  <h3 className="font-bold text-lg mb-2">What We're Looking For</h3>
                  <p className={cn("whitespace-pre-wrap leading-relaxed", isDark ? 'text-gray-300' : 'text-gray-700')}>
                    {formData.requirements}
                  </p>
                </div>
              )}
              
              {/* Skills */}
              {formData.skills.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className={cn("px-3 py-2 rounded-lg text-sm font-semibold", isDark ? 'bg-info-600 text-white' : 'bg-black text-white')}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Benefits */}
              {formData.benefits && (
                <div>
                  <h3 className="font-bold text-lg mb-2">Benefits & Perks</h3>
                  <p className={cn("whitespace-pre-wrap leading-relaxed", isDark ? 'text-gray-300' : 'text-gray-700')}>
                    {formData.benefits}
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className={cn("border-t-2 pt-6 mt-6", isDark ? 'bordbg-black' : 'border-gray-300')}>
                <button
                  type="button"
                  className={cn("w-full py-3 rounded-lg font-bold text-lg transition-colors", isDark ? 'bg-info-600 text-white hover:bg-info-700' : 'bg-black text-white hover:bg-black')}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleMediaSelect}
      />
      <input
        type="file"
        accept="video/*"
        ref={videoInputRef}
        className="hidden"
        onChange={handleMediaSelect}
      />
    </PageLayout>
  );
}