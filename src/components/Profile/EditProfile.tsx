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
    // Remove fields that don't exist in the database
    display_name: ''
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
          display_name: profile.display_name || profile.full_name || ''
        };
        setProfileData(extendedProfile);
        setOriginalData(extendedProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!profileData.full_name?.trim()) {
      newErrors.full_name = 'Display name is required';
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
      
      // Prepare data for saving - only include fields that exist in database
      const saveData = {
        full_name: profileData.full_name,
        username: profileData.display_name || profileData.username, // Use display_name as username
        bio: profileData.bio,
        location: profileData.location,
        avatar_url: profileData.avatar_url,
        cover_image_url: profileData.cover_image_url, // ✅ Add cover_image_url to save data
        website: profileData.website,
        role: profileData.role,
        company_name: profileData.company_name,
        title: profileData.title
      };
      
      await ProfileService.updateProfile(user.id, saveData);
      setOriginalData(profileData);
      setHasChanges(false);
      
      if (isModal && onClose) {
        onClose();
      } else {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ general: 'Failed to save profile. Please try again.' });
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
    maxLength?: number
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900 dark:text-white">
        {label}
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
      'flex flex-col',
      isModal ? 'h-full' : 'min-h-screen',
      isDark ? 'bg-black text-white' : 'bg-white text-black'
    )}>
      {/* Header */}
      <div className={cn(
        'sticky top-0 z-10 backdrop-blur-md border-b',
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
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
              {renderField('Display Name', 'full_name', 'Your display name', 'text', <User className="w-4 h-4" />, 50)}
              {renderField('Username', 'display_name', 'Your username', 'text', <User className="w-4 h-4" />, 30)}
            </div>
            {renderField('Bio', 'bio', 'Tell the world about yourself', 'textarea', <Award className="w-4 h-4" />, 160)}
            {renderField('Location', 'location', 'Where are you located?', 'text', <MapPin className="w-4 h-4" />)}
            {renderField('Website', 'website', 'https://yourwebsite.com', 'url', <Globe className="w-4 h-4" />)}
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('Company', 'company_name', 'Your company name', 'text', <Building2 className="w-4 h-4" />)}
              {renderField('Job Title', 'title', 'Your job title', 'text', <Briefcase className="w-4 h-4" />)}
            </div>
            
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Role
              </label>
              <select
                value={profileData.role || 'student'}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className={cn(
                  'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg',
                  'bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
                  'focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500'
                )}
              >
                <option value="student">Student</option>
                <option value="employer">Employer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
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