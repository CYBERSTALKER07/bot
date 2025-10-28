import React, { useState, useEffect } from 'react';
import { X, Camera, Save, Loader2, MapPin, LinkIcon, Calendar, Building2, GraduationCap, Award, Globe, Github, Linkedin, Phone, Eye, EyeOff, User, Briefcase, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import ImageUpload from '../ui/ImageUpload';
import { ProfileService, ProfileData } from '../../lib/profileService';
import { cn } from '../../lib/cva';

interface EditProfileProps {
  isModal?: boolean;
  onClose?: () => void;
}

export default function EditProfile({ isModal = false, onClose }: EditProfileProps) {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Screen size detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [profileData, setProfileData] = useState<ProfileData & {
    display_name?: string;
    school?: string;
    major?: string;
    graduation_year?: number;
    gpa?: number;
    skills?: string[];
    interests?: string[];
  }>({
    full_name: '',
    username: '',
    bio: '',
    location: '',
    avatar_url: '',
    website: '',
    role: 'student',
    company_name: '',
    title: '',
    verified: false,
    display_name: '',
    school: '',
    major: '',
    graduation_year: undefined,
    gpa: undefined,
    skills: [],
    interests: []
  });

  const [originalData, setOriginalData] = useState<typeof profileData>(profileData);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  useEffect(() => {
    // Check if there are any changes
    const hasChanged = JSON.stringify(profileData) !== JSON.stringify(originalData);
    setHasChanges(hasChanged);
  }, [profileData, originalData]);

  const loadProfileData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const profile = await ProfileService.getCurrentProfile();
      if (profile) {
        const extendedProfile = {
          ...profile,
          display_name: profile.username || profile.full_name || ''
        };
        setProfileData(extendedProfile);
        setOriginalData(extendedProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setErrors({ general: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!profileData.full_name?.trim()) {
      newErrors.full_name = 'Display name is required';
    }

    if (!profileData.username?.trim()) {
      newErrors.username = 'Username is required';
    } else if (!/^[a-z0-9_]+$/.test(profileData.username)) {
      newErrors.username = 'Username can only contain lowercase letters, numbers, and underscores';
    } else if (profileData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    }

    if (profileData.bio && profileData.bio.length > 160) {
      newErrors.bio = 'Bio must be 160 characters or less';
    }

    if (profileData.website && !isValidUrl(profileData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    if (profileData.linkedin_url && !isValidUrl(profileData.linkedin_url)) {
      newErrors.linkedin_url = 'Please enter a valid LinkedIn URL';
    }

    if (profileData.github_url && !isValidUrl(profileData.github_url)) {
      newErrors.github_url = 'Please enter a valid GitHub URL';
    }

    if (profileData.portfolio_url && !isValidUrl(profileData.portfolio_url)) {
      newErrors.portfolio_url = 'Please enter a valid portfolio URL';
    }

    // Validate GPA
    if (profileData.gpa !== undefined && profileData.gpa !== null && profileData.gpa !== 0) {
      if (profileData.gpa < 0 || profileData.gpa > 4.0) {
        newErrors.gpa = 'GPA must be between 0.0 and 4.0';
      }
    }

    // Validate graduation year
    if (profileData.graduation_year) {
      const currentYear = new Date().getFullYear();
      if (profileData.graduation_year < 1950 || profileData.graduation_year > currentYear + 10) {
        newErrors.graduation_year = 'Please enter a valid graduation year';
      }
    }

    // Role-specific validation
    if (user?.role === 'employer') {
      if (!profileData.company_name?.trim()) {
        newErrors.company_name = 'Company name is required for employers';
      }
      if (!profileData.title?.trim()) {
        newErrors.title = 'Job title is required for employers';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (field: keyof typeof profileData, value: string | boolean | number | string[]) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSkillsChange = (skillsString: string) => {
    const skills = skillsString.split(',').map(s => s.trim()).filter(Boolean);
    handleInputChange('skills', skills);
  };

  const handleSave = async () => {
    if (!user || !validateForm()) return;

    try {
      setSaving(true);
      
      // Prepare data for saving - include all new fields
      const saveData: Partial<ProfileData> = {
        full_name: profileData.full_name?.trim(),
        username: profileData.username?.toLowerCase().trim(),
        bio: profileData.bio?.trim(),
        location: profileData.location?.trim(),
        avatar_url: profileData.avatar_url,
        cover_image_url: profileData.cover_image_url,
        website: profileData.website?.trim(),
        role: profileData.role,
        school: profileData.school?.trim(),
        major: profileData.major?.trim(),
        graduation_year: profileData.graduation_year,
        gpa: profileData.gpa,
        skills: profileData.skills,
        interests: profileData.interests
      };

      // Add role-specific fields
      if (user.role === 'employer') {
        saveData.company_name = profileData.company_name?.trim();
        saveData.title = profileData.title?.trim();
      }
      
      await ProfileService.updateProfile(user.id, saveData);
      setOriginalData(profileData);
      setHasChanges(false);
      
      if (isModal && onClose) {
        onClose();
      } else {
        navigate('/profile');
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      
      // Provide specific error messages based on error type
      if (error.message?.includes('duplicate') || error.message?.includes('409')) {
        setErrors({ general: 'Username is already taken. Please choose a different username.' });
      } else if (error.message?.includes('permission') || error.message?.includes('403')) {
        setErrors({ general: 'You do not have permission to edit this profile.' });
      } else if (error.message?.includes('400')) {
        setErrors({ general: 'Invalid data format. Please check your entries and try again.' });
      } else {
        setErrors({ general: 'Failed to save profile. Please try again.' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) return;
    }
    
    if (isModal && onClose) {
      onClose();
    } else {
      navigate('/profile');
    }
  };

  const handleImageUpload = async (type: 'avatar' | 'cover', imageUrl: string) => {
    handleInputChange(type === 'avatar' ? 'avatar_url' : 'cover_image_url', imageUrl);
  };

  const handleImageUploadError = (error: string) => {
    setErrors({ general: error });
  };

  const renderField = (
    label: string,
    field: keyof typeof profileData,
    placeholder: string,
    type: 'text' | 'textarea' | 'number' | 'date' | 'email' | 'url' = 'text',
    icon?: React.ReactNode,
    maxLength?: number,
    required?: boolean
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900 dark:text-white">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        {type === 'textarea' ? (
          <textarea
            value={profileData[field] as string || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={placeholder}
            className={cn(
              'w-full px-3 py-2 border rounded-lg resize-none transition-colors',
              icon ? 'pl-10' : '',
              errors[field]
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500',
              'bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
              'focus:outline-none focus:ring-2'
            )}
            rows={3}
            maxLength={maxLength}
          />
        ) : (
          <input
            type={type}
            value={profileData[field] as string || ''}
            onChange={(e) => handleInputChange(field, type === 'number' ? Number(e.target.value) : e.target.value)}
            placeholder={placeholder}
            className={cn(
              'w-full px-3 py-2 border rounded-lg transition-colors',
              icon ? 'pl-10' : '',
              errors[field]
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500',
              'bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
              'focus:outline-none focus:ring-2'
            )}
            maxLength={maxLength}
          />
        )}
        {maxLength && type === 'textarea' && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {(profileData[field] as string || '').length}/{maxLength}
          </div>
        )}
      </div>
      {errors[field] && (
        <p className="text-sm text-red-500">{errors[field]}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className={cn(
        'flex items-center justify-center',
        isModal ? 'h-96' : 'min-h-screen',
        isDark ? 'bg-black' : 'bg-white'
      )}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  const content = (
    <div className={cn(
      'flex flex-col h-screen',
      isDark ? 'bg-black text-white' : 'bg-white text-black'
    )}>
      {/* Header */}
      <div className={cn(
        'sticky top-0 z-10 backdrop-blur-md border-b flex-shrink-0',
        isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
      )}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Edit profile</h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="rounded-full px-6 font-bold"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </div>

      {/* Content - Scrollable Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-2xl mx-auto p-4 space-y-6">
          {/* Error Messages */}
          {errors.general && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Cover Photo Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Cover Photo</h2>
            <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              {profileData.cover_image_url ? (
                <img
                  src={profileData.cover_image_url}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500" />
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <ImageUpload
                  type="cover"
                  currentImageUrl={profileData.cover_image_url}
                  onUploadSuccess={(url) => handleImageUpload('cover', url)}
                  onUploadError={handleImageUploadError}
                  className="p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Avatar Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Profile Photo</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                {profileData.avatar_url ? (
                  <img
                    src={profileData.avatar_url}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-800"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl border-4 border-white dark:border-gray-800">
                    {(profileData.full_name || 'U').charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <ImageUpload
                    type="avatar"
                    currentImageUrl={profileData.avatar_url}
                    onUploadSuccess={(url) => handleImageUpload('avatar', url)}
                    onUploadError={handleImageUploadError}
                    className="text-white"
                  />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">
                  Upload a new avatar. It will be visible to everyone.
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('Display Name', 'full_name', 'Your display name', 'text', <User className="w-4 h-4" />, 50, true)}
              {renderField('Username', 'username', 'your_username', 'text', <User className="w-4 h-4" />, 30, true)}
            </div>
            {renderField('Bio', 'bio', 'Tell the world about yourself', 'textarea', <Award className="w-4 h-4" />, 160)}
            {renderField('Location', 'location', 'Where are you located?', 'text', <MapPin className="w-4 h-4" />)}
            {renderField('Website', 'website', 'https://yourwebsite.com', 'url', <Globe className="w-4 h-4" />)}
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.role === 'employer' 
                ? renderField('Company', 'company_name', 'Your company name', 'text', <Building2 className="w-4 h-4" />, undefined, true)
                : renderField('Company', 'company_name', 'Your company name', 'text', <Building2 className="w-4 h-4" />)
              }
              {user?.role === 'employer' 
                ? renderField('Job Title', 'title', 'Your job title', 'text', <Briefcase className="w-4 h-4" />, undefined, true)
                : renderField('Job Title', 'title', 'Your job title', 'text', <Briefcase className="w-4 h-4" />)
              }
            </div>
            
            {/* Role Selection - Read Only */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Role
              </label>
              <div className={cn(
                'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg',
                'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white',
                'text-sm'
              )}>
                {profileData.role === 'employer' ? 'Employer' : profileData.role === 'admin' ? 'Admin' : 'Student'}
              </div>
              <p className="text-xs text-gray-500">Role cannot be changed after account creation</p>
            </div>
          </div>

          {/* Education & Skills Section */}
          {user?.role === 'student' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Education & Skills</h2>
              
              {/* Education Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('School/University', 'school', 'e.g., Stanford University', 'text', <GraduationCap className="w-4 h-4" />)}
                {renderField('Major', 'major', 'e.g., Computer Science', 'text', <BookOpen className="w-4 h-4" />)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('Graduation Year', 'graduation_year', '2025', 'number', <Calendar className="w-4 h-4" />)}
                {renderField('GPA', 'gpa', '3.5 (out of 4.0)', 'number', <Award className="w-4 h-4" />)}
              </div>
              
              {/* Skills Array Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Skills
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <textarea
                    value={profileData.skills?.join(', ') || ''}
                    onChange={(e) => handleSkillsChange(e.target.value)}
                    placeholder="e.g., JavaScript, React, Python, SQL (comma-separated)"
                    className={cn(
                      'w-full px-3 py-2 pl-10 border rounded-lg resize-none transition-colors',
                      'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500',
                      'bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
                      'focus:outline-none focus:ring-2'
                    )}
                    rows={2}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Separate skills with commas. These help match you with relevant opportunities.
                </p>
              </div>
              
              {/* Interests Array Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Interests
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <textarea
                    value={profileData.interests?.join(', ') || ''}
                    onChange={(e) => {
                      const interests = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      handleInputChange('interests', interests);
                    }}
                    placeholder="e.g., Artificial Intelligence, Web Development, Data Science (comma-separated)"
                    className={cn(
                      'w-full px-3 py-2 pl-10 border rounded-lg resize-none transition-colors',
                      'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500',
                      'bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
                      'focus:outline-none focus:ring-2'
                    )}
                    rows={2}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  What are you passionate about? Separate interests with commas.
                </p>
              </div>
            </div>
          )}

          {/* Bottom padding for scrolling space */}
          <div className="pb-8" />
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50">
      {content}
    </div>
  );
}