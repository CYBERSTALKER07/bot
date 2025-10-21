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
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  
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
        const url = await uploadMedia(file);
        setMediaUrl(url);
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
    setMediaUrl(null);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
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
      className="bg-white text-black"
      maxWidth="3xl"
      padding="none"
    >
      {/* Black & White Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl border-b border-gray-300 bg-white/95">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              size="sm"
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-black">Post a Job</h1>
              <p className="text-xs text-gray-600">Create a professional job posting</p>
            </div>
          </div>
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <XIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex bg-white">
        {/* Main Content */}
        <div className="flex-1 max-w-2xl mx-auto border-l border-r border-gray-300">
          
          {/* Error and Success Messages */}
          {error && (
            <div className="border-b border-gray-300 p-4 bg-red-50">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="border-b border-gray-300 p-4 bg-green-50">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-green-800">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Job Posting Form - Like a Post */}
          <form onSubmit={handleSubmit} className="divide-y divide-gray-300">
            
            {/* User Info & Title */}
            <div className="p-4 space-y-4">
              <div className="flex items-start space-x-4">
                <Avatar 
                  src={user?.profile.avatar_url} 
                  alt={user?.profile.full_name} 
                  size="lg"
                  className="flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="font-bold text-black">{user?.profile?.full_name || 'Your Company'}</div>
                  <div className="text-sm text-gray-600">{user?.profile?.company_name || 'Company Name'}</div>
                </div>
              </div>

              {/* Job Title - Main */}
              <textarea
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="What's the job title?"
                rows={2}
                className="w-full text-2xl font-bold bg-transparent border-none outline-none resize-none placeholder-gray-400 text-black"
              />
              {validationErrors.title && (
                <p className="text-red-600 text-sm">{validationErrors.title}</p>
              )}
            </div>

            {/* Company & Location */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-semibold text-black flex items-center space-x-2">
                    <Building2 className="h-4 w-4" />
                    <span>Company</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Company name"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-black text-black"
                  />
                  {validationErrors.company && (
                    <p className="text-red-600 text-sm">{validationErrors.company}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-black flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Location</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State or Remote"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-black text-black"
                  />
                  {validationErrors.location && (
                    <p className="text-red-600 text-sm">{validationErrors.location}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Job Type, Salary & Remote */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-semibold text-black flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Job Type</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-black text-black"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-black flex items-center space-x-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Salary Range</span>
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g., $60k-80k or $25/hour"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-black text-black"
                  />
                </div>
              </div>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_remote"
                  checked={formData.is_remote}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-2 border-gray-400 text-black focus:ring-2 focus:ring-black"
                />
                <span className="font-semibold text-black">Remote work available</span>
              </label>
            </div>

            {/* Description */}
            <div className="p-4 space-y-2">
              <label className="font-semibold text-black flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Job Description *</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                rows={5}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-black resize-none text-black"
              />
              {validationErrors.description && (
                <p className="text-red-600 text-sm">{validationErrors.description}</p>
              )}
            </div>

            {/* Media Upload Section */}
            <div className="p-4 space-y-4 border-t border-gray-300">
              <div className="font-semibold text-black flex items-center space-x-2">
                <ImageIcon className="h-4 w-4" />
                <span>Add Media (optional)</span>
              </div>
              
              {!mediaPreview ? (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 border-2 border-dashed border-gray-400 rounded-lg p-4 hover:border-black hover:bg-gray-50 transition-colors text-center"
                  >
                    <ImageIcon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold text-black text-sm">Add Image</div>
                    <div className="text-xs text-gray-600">JPG, PNG up to 5MB</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="flex-1 border-2 border-dashed border-gray-400 rounded-lg p-4 hover:border-black hover:bg-gray-50 transition-colors text-center"
                  >
                    <Video className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold text-black text-sm">Add Video</div>
                    <div className="text-xs text-gray-600">MP4 up to 50MB</div>
                  </button>
                </div>
              ) : (
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
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
                    className="absolute top-3 right-3 bg-black text-white rounded-full p-2 hover:bg-gray-800 transition-colors"
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

            {/* Requirements */}
            <div className="p-4 space-y-2 border-t border-gray-300">
              <label className="font-semibold text-black flex items-center space-x-2">
                <Hash className="h-4 w-4" />
                <span>Requirements *</span>
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder="List the required qualifications, skills, and experience (one per line)..."
                rows={4}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-black resize-none text-black"
              />
              {validationErrors.requirements && (
                <p className="text-red-600 text-sm">{validationErrors.requirements}</p>
              )}
            </div>

            {/* Required Skills */}
            <div className="p-4 space-y-3 border-t border-gray-300">
              <label className="font-semibold text-black flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Required Skills * ({formData.skills.length})</span>
              </label>
              
              <div className="flex space-x-2">
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
                  className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-black text-black"
                />
                <Button
                  type="button"
                  onClick={addSkill}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors flex items-center space-x-1"
                  >
                    <span>{skill}</span>
                    <XIcon className="h-3 w-3" />
                  </button>
                ))}
              </div>
              {validationErrors.skills && (
                <p className="text-red-600 text-sm">{validationErrors.skills}</p>
              )}
            </div>

            {/* Benefits */}
            <div className="p-4 space-y-2 border-t border-gray-300">
              <label className="font-semibold text-black flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Benefits & Perks</span>
              </label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleInputChange}
                placeholder="Health insurance, flexible hours, learning opportunities, stock options..."
                rows={3}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-black resize-none text-black"
              />
            </div>

            {/* Additional Details */}
            <div className="p-4 space-y-4 border-t border-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-semibold text-black flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Application Deadline</span>
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-black text-black"
                  />
                  {validationErrors.deadline && (
                    <p className="text-red-600 text-sm">{validationErrors.deadline}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-black flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Contact Email *</span>
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    placeholder="hiring@company.com"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-black text-black"
                  />
                  {validationErrors.contact_email && (
                    <p className="text-red-600 text-sm">{validationErrors.contact_email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="p-4 border-t border-gray-300">
              <div className="rounded-lg bg-gray-50 border border-gray-300 p-4 space-y-3">
                <h3 className="font-bold text-black flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Tips for Success</span>
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
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
            </div>

            {/* Submit Buttons */}
            <div className="p-4 border-t border-gray-300 space-y-3">
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex-1 border-2 border-black text-black bg-white hover:bg-gray-100 py-3 rounded-lg font-bold transition-colors flex items-center justify-center"
                  disabled={isSubmitting || loading}
                >
                  <Eye className="h-5 w-5 mr-2" />
                  Preview
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-black text-white hover:bg-gray-800 py-3 rounded-lg font-bold transition-colors flex items-center justify-center disabled:bg-gray-400"
                  disabled={isSubmitting || loading}
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
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white border-2 border-black">
            
            {/* Preview Header */}
            <div className="sticky top-0 backdrop-blur-xl border-b-2 border-black p-4 flex items-center justify-between bg-white">
              <h2 className="text-xl font-bold text-black">Job Preview</h2>
              <Button
                onClick={() => setShowPreview(false)}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                <XIcon className="h-5 w-5" />
              </Button>
            </div>

            {/* Preview Content */}
            <div className="p-6 space-y-6 text-black">
              {/* Header Info */}
              <div className="flex items-start space-x-4 pb-4 border-b-2 border-gray-300">
                <Avatar 
                  src={user?.profile.avatar_url} 
                  alt={user?.profile.full_name} 
                  size="lg"
                />
                <div>
                  <div className="font-bold text-lg">{user?.profile?.full_name || 'Company'}</div>
                  <div className="text-gray-600">{user?.profile?.company_name || 'Company Name'}</div>
                </div>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-3xl font-bold mb-4 text-black">
                  {formData.title || 'Job Title'}
                </h1>
                
                {/* Quick Info */}
                <div className="flex flex-wrap gap-4 text-sm font-semibold text-gray-700 mb-4">
                  {formData.company && (
                    <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                      <Building2 className="h-4 w-4" />
                      <span>{formData.company}</span>
                    </div>
                  )}
                  {formData.location && (
                    <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                      <MapPin className="h-4 w-4" />
                      <span>{formData.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                    <Briefcase className="h-4 w-4" />
                    <span className="capitalize">{formData.type.replace('-', ' ')}</span>
                  </div>
                  {formData.salary && (
                    <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                      <DollarSign className="h-4 w-4" />
                      <span>{formData.salary}</span>
                    </div>
                  )}
                </div>

                {formData.is_remote && (
                  <div className="inline-block bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
                    🌍 Remote Available
                  </div>
                )}
              </div>

              {/* Media Preview */}
              {mediaPreview && (
                <div className="rounded-lg overflow-hidden border-2 border-gray-300">
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
                  <h3 className="font-bold text-lg mb-2 text-black">About the Role</h3>
                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {formData.description}
                  </p>
                </div>
              )}
              
              {/* Requirements */}
              {formData.requirements && (
                <div>
                  <h3 className="font-bold text-lg mb-2 text-black">What We're Looking For</h3>
                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {formData.requirements}
                  </p>
                </div>
              )}
              
              {/* Skills */}
              {formData.skills.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-3 text-black">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 rounded-lg text-sm font-semibold bg-black text-white"
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
                  <h3 className="font-bold text-lg mb-2 text-black">Benefits & Perks</h3>
                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {formData.benefits}
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="border-t-2 border-gray-300 pt-6 mt-6">
                <Button className="w-full bg-black text-white hover:bg-gray-800 py-3 rounded-lg font-bold text-lg">
                  Apply Now
                </Button>
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