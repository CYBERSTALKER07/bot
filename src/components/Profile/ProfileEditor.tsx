import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  User, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Github, 
  Linkedin,
  Plus,
  X,
  AlertCircle,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ProfileService, ProfileData } from '../../lib/profileService';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card } from '../ui/Card';
import ImageUpload from '../ui/ImageUpload';
import Badge from '../ui/Badge';

export default function ProfileEditor() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    skills: [],
    major: '',
    graduation_year: new Date().getFullYear(),
    company_name: '',
    title: '',
    industry: '',
    company_size: '',
    company_description: ''
  });
  const [newSkill, setNewSkill] = useState('');

  // Load current profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const profile = await ProfileService.getCurrentProfile();
        if (profile) {
          setProfileData(profile);
        }
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user]);

  const updateField = (field: keyof ProfileData, value: string | number | string[]) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills?.includes(newSkill.trim())) {
      updateField('skills', [...(profileData.skills || []), newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateField('skills', profileData.skills?.filter(skill => skill !== skillToRemove) || []);
  };

  const handleAvatarUpload = async (imageUrl: string) => {
    try {
      updateField('avatar_url', imageUrl);
      setSuccess('Avatar updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update avatar');
    }
  };

  const handleCoverUpload = async (imageUrl: string) => {
    try {
      updateField('cover_image_url', imageUrl);
      setSuccess('Cover image updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update cover image');
    }
  };

  const handleImageUploadError = (error: string) => {
    setError(error);
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError('');

      // Clean data based on user role
      const cleanData = user.role === 'student' 
        ? {
            full_name: profileData.full_name,
            bio: profileData.bio,
            location: profileData.location,
            phone: profileData.phone,
            avatar_url: profileData.avatar_url,
            cover_image_url: profileData.cover_image_url,
            linkedin_url: profileData.linkedin_url,
            github_url: profileData.github_url,
            portfolio_url: profileData.portfolio_url,
            major: profileData.major,
            graduation_year: profileData.graduation_year,
            skills: profileData.skills
          }
        : {
            full_name: profileData.full_name,
            bio: profileData.bio,
            location: profileData.location,
            phone: profileData.phone,
            avatar_url: profileData.avatar_url,
            cover_image_url: profileData.cover_image_url,
            website: profileData.website,
            company_name: profileData.company_name,
            title: profileData.title,
            industry: profileData.industry,
            company_size: profileData.company_size,
            company_description: profileData.company_description
          };

      await ProfileService.updateProfile(user.id, cleanData);
      setSuccess('Profile updated successfully!');
      
      // Redirect to profile page after a delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-black' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-info-500 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 border-b backdrop-blur-md ${
        isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Edit Profile</h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Update your profile information
              </p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-info-500 hover:bg-info-600 text-white"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg flex items-center space-x-2">
            <Check className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}

        <div className="space-y-8">
          {/* Cover Photo Section */}
          <Card className={`overflow-hidden ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="relative">
              <ImageUpload
                type="cover"
                currentImageUrl={profileData.cover_image_url}
                onUploadSuccess={handleCoverUpload}
                onUploadError={handleImageUploadError}
                className="w-full"
              />
              
              {/* Avatar positioned over cover */}
              <div className="absolute -bottom-12 left-6">
                <ImageUpload
                  type="avatar"
                  currentImageUrl={profileData.avatar_url}
                  onUploadSuccess={handleAvatarUpload}
                  onUploadError={handleImageUploadError}
                  size="lg"
                  className="ring-4 ring-white dark:ring-gray-900"
                />
              </div>
            </div>
            <div className="pt-16 pb-6 px-6">
              <h2 className="text-lg font-semibold mb-2">Profile Images</h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Upload a profile picture and cover photo to personalize your profile
              </p>
            </div>
          </Card>

          {/* Basic Information */}
          <Card className={`p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <h2 className="text-lg font-semibold mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={profileData.full_name || ''}
                onChange={(e) => updateField('full_name', e.target.value)}
                startIcon={<User className="w-4 h-4" />}
                required
              />
              
              <Input
                label="Location"
                value={profileData.location || ''}
                onChange={(e) => updateField('location', e.target.value)}
                startIcon={<MapPin className="w-4 h-4" />}
                placeholder="City, State"
              />
              
              <Input
                label="Phone"
                type="tel"
                value={profileData.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                startIcon={<Phone className="w-4 h-4" />}
                placeholder="+1 (555) 123-4567"
              />
              
              <Input
                label="Email"
                type="email"
                value={user?.email || ''}
                disabled
                startIcon={<Mail className="w-4 h-4" />}
                helperText="Email cannot be changed"
              />
            </div>
            
            <div className="mt-6">
              <Input
                label="Bio"
                multiline
                rows={4}
                value={profileData.bio || ''}
                onChange={(e) => updateField('bio', e.target.value)}
                placeholder="Tell us about yourself, your interests, and goals..."
                maxLength={500}
              />
            </div>
          </Card>

          {/* Role-specific Information */}
          {user?.role === 'student' ? (
            <Card className={`p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h2 className="text-lg font-semibold mb-6">Academic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Major</label>
                  <select
                    value={profileData.major || ''}
                    onChange={(e) => updateField('major', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDark 
                        ? 'bg-gray-800 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-black'
                    }`}
                    aria-label="Select your major"
                  >
                    <option value="">Select your major</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Business">Business</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Psychology">Psychology</option>
                    <option value="Communications">Communications</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Graduation Year</label>
                  <select
                    value={profileData.graduation_year || ''}
                    onChange={(e) => updateField('graduation_year', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDark 
                        ? 'bg-gray-800 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-black'
                    }`}
                    aria-label="Select graduation year"
                  >
                    <option value="">Select graduation year</option>
                    {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          ) : (
            <Card className={`p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h2 className="text-lg font-semibold mb-6">Company Information</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Company Name"
                    value={profileData.company_name || ''}
                    onChange={(e) => updateField('company_name', e.target.value)}
                    startIcon={<Building2 className="w-4 h-4" />}
                    required
                  />
                  
                  <Input
                    label="Your Job Title"
                    value={profileData.title || ''}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="e.g., Software Engineer, Product Manager"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Industry</label>
                    <select
                      value={profileData.industry || ''}
                      onChange={(e) => updateField('industry', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDark 
                          ? 'bg-gray-800 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-black'
                      }`}
                      aria-label="Select industry"
                    >
                      <option value="">Select industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Education">Education</option>
                      <option value="Government">Government</option>
                      <option value="Non-profit">Non-profit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Size</label>
                    <select
                      value={profileData.company_size || ''}
                      onChange={(e) => updateField('company_size', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDark 
                          ? 'bg-gray-800 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-black'
                      }`}
                      aria-label="Select company size"
                    >
                      <option value="">Select company size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                </div>
                
                <Input
                  label="Company Description"
                  multiline
                  rows={4}
                  value={profileData.company_description || ''}
                  onChange={(e) => updateField('company_description', e.target.value)}
                  placeholder="Tell us about your company, culture, and what makes it special..."
                />
              </div>
            </Card>
          )}

          {/* Skills Section (for students) */}
          {user?.role === 'student' && (
            <Card className={`p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h2 className="text-lg font-semibold mb-6">Skills</h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {profileData.skills?.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="tonal"
                    className="flex items-center space-x-2"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => removeSkill(skill)}
                      className="hover:text-red-500"
                      aria-label={`Remove ${skill} skill`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addSkill();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={addSkill}
                  variant="outlined"
                  disabled={!newSkill.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </Card>
          )}

          {/* Social Links */}
          <Card className={`p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <h2 className="text-lg font-semibold mb-6">Social Links</h2>
            <div className="space-y-6">
              {user?.role === 'student' ? (
                <>
                  <Input
                    label="Portfolio URL"
                    type="url"
                    value={profileData.portfolio_url || ''}
                    onChange={(e) => updateField('portfolio_url', e.target.value)}
                    startIcon={<Globe className="w-4 h-4" />}
                    placeholder="https://yourportfolio.com"
                  />
                  
                  <Input
                    label="LinkedIn Profile"
                    type="url"
                    value={profileData.linkedin_url || ''}
                    onChange={(e) => updateField('linkedin_url', e.target.value)}
                    startIcon={<Linkedin className="w-4 h-4" />}
                    placeholder="https://linkedin.com/in/yourname"
                  />
                  
                  <Input
                    label="GitHub Profile"
                    type="url"
                    value={profileData.github_url || ''}
                    onChange={(e) => updateField('github_url', e.target.value)}
                    startIcon={<Github className="w-4 h-4" />}
                    placeholder="https://github.com/yourusername"
                  />
                </>
              ) : (
                <>
                  <Input
                    label="Company Website"
                    type="url"
                    value={profileData.website || ''}
                    onChange={(e) => updateField('website', e.target.value)}
                    startIcon={<Globe className="w-4 h-4" />}
                    placeholder="https://yourcompany.com"
                  />
                  
                  <Input
                    label="LinkedIn Profile"
                    type="url"
                    value={profileData.linkedin_url || ''}
                    onChange={(e) => updateField('linkedin_url', e.target.value)}
                    startIcon={<Linkedin className="w-4 h-4" />}
                    placeholder="https://linkedin.com/in/yourname"
                  />
                </>
              )}
            </div>
          </Card>

          {/* Save Button (Mobile) */}
          <div className="md:hidden">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-info-500 hover:bg-info-600 text-white py-3"
              size="large"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}