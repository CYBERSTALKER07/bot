import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  LinkIcon,
  Mail,
  Building2,
  GraduationCap,
  MoreHorizontal,
  MessageCircle,
  Bell,
  Settings,
  User,
  Award,
  Briefcase,
  Code,
  Zap,
  Plus,
  X as XIcon,
  Edit3,
  Save,
  Phone,
  Globe,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  portfolio_url?: string;
  linkedin_url?: string;
  github_url?: string;
  company_name?: string;
  company_description?: string;
  company_size?: string;
  industry?: string;
  website?: string;
  joined_date?: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date?: string;
  gpa?: string;
  current: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  url?: string;
  github_url?: string;
  image_url?: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiry_date?: string;
  credential_id?: string;
  url?: string;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || 'User',
    email: user?.email || '',
    phone: '',
    location: 'Phoenix, AZ',
    bio: 'Passionate about technology and innovation. Always eager to learn and grow!',
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    portfolio_url: '',
    linkedin_url: '',
    github_url: '',
    company_name: '',
    company_description: '',
    company_size: '',
    industry: '',
    website: '',
    joined_date: 'Joined January 2024'
  });

  const formatJoinDate = (dateString: string) => {
    if (!dateString) return 'Joined January 2024';
    const date = new Date(dateString);
    return `Joined ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  };

  const handleSave = () => {
    // Save logic here
    setShowEditModal(false);
  };

  const addSkill = (skill: string) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header with Back Button */}
        <div className="sticky top-0 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-800 p-4 z-10 flex items-center space-x-4">
          <button 
            onClick={() => navigate('/feed')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">{profileData.name}</h1>
            <p className="text-sm text-gray-500">42 Posts</p>
          </div>
        </div>

        {/* Cover Photo Area */}
        <div className={`h-48 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} relative`}>
          {/* Gradient background instead of image */}
          <div className={`absolute inset-0 ${
            isDark 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
              : 'bg-gradient-to-br from-blue-100 to-purple-100'
          }`}></div>
        </div>

        {/* Profile Info */}
        <div className="px-4">
          {/* Avatar and Edit Button Row */}
          <div className="flex justify-between items-start -mt-16 mb-4">
            <div className={`w-32 h-32 rounded-full border-4 ${
              isDark ? 'border-black' : 'border-white'
            } bg-gray-500 flex items-center justify-center text-4xl font-bold`}>
              {user?.avatar_url ? (
                <Avatar
                  src={user.avatar_url}
                  alt={profileData.name}
                  size="2xl"
                  className="border-4 border-white dark:border-black"
                />
              ) : (
                <div className={`w-32 h-32 rounded-full ${
                  isDark ? 'bg-gray-700' : 'bg-gray-400'
                } flex items-center justify-center text-white text-4xl font-bold`}>
                  {profileData.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex space-x-2 mt-4">
              <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <MoreHorizontal className="h-5 w-5" />
              </button>
              <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <MessageCircle className="h-5 w-5" />
              </button>
              <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <Bell className="h-5 w-5" />
              </button>
              <Button
                variant="outlined"
                onClick={() => setShowEditModal(true)}
                className="rounded-full px-4"
              >
                Edit profile
              </Button>
            </div>
          </div>

          {/* Name and Username */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold">{profileData.name}</h1>
            <p className="text-gray-500">@{profileData.name.toLowerCase().replace(' ', '')}</p>
          </div>

          {/* Bio */}
          <div className="mb-4">
            <p className="text-base leading-normal">
              {profileData.bio}
              {user?.role === 'employer' && profileData.company_name && (
                <span className="block mt-2">
                  🏢 {profileData.company_name} • {profileData.industry}
                </span>
              )}
            </p>
          </div>

          {/* Location, Link, Join Date */}
          <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-500">
            {profileData.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{profileData.location}</span>
              </div>
            )}
            
            {(profileData.portfolio_url || profileData.website || profileData.linkedin_url) && (
              <div className="flex items-center space-x-1">
                <LinkIcon className="h-4 w-4" />
                <a 
                  href={profileData.portfolio_url || profileData.website || profileData.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {profileData.portfolio_url ? 'Portfolio' : 
                   profileData.website ? 'Website' : 'LinkedIn'}
                </a>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatJoinDate(profileData.joined_date)}</span>
            </div>
          </div>

          {/* Following/Followers */}
          <div className="flex space-x-6 mb-6">
            <div>
              <span className="font-bold">42</span>{' '}
              <span className="text-gray-500">Following</span>
            </div>
            <div>
              <span className="font-bold">128</span>{' '}
              <span className="text-gray-500">Followers</span>
            </div>
          </div>

          {/* Skills Section */}
          {profileData.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      isDark 
                        ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-gray-500">
                <Mail className="h-4 w-4" />
                <span>{profileData.email}</span>
              </div>
              {profileData.phone && (
                <div className="flex items-center space-x-3 text-gray-500">
                  <Phone className="h-4 w-4" />
                  <span>{profileData.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-800">
            <nav className="flex space-x-8">
              <button className="py-4 px-1 border-b-2 border-blue-500 font-medium text-blue-500">
                Posts
              </button>
              <button className="py-4 px-1 font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                Replies
              </button>
              <button className="py-4 px-1 font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                Media
              </button>
              <button className="py-4 px-1 font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                Likes
              </button>
            </nav>
          </div>

          {/* Posts Content */}
          <div className="py-4">
            <div className="text-center py-12">
              <p className="text-gray-500">No posts yet</p>
              <p className="text-gray-400 text-sm mt-2">When you post something, it will show up here.</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <Modal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit profile"
          maxWidth="md"
        >
          <div className="space-y-4">
            {/* Cover Photo */}
            <div className={`h-32 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-200'} relative flex items-center justify-center`}>
              <button className="p-2 bg-black/50 rounded-full text-white">
                <Edit3 className="h-5 w-5" />
              </button>
            </div>

            {/* Avatar */}
            <div className="flex justify-center -mt-16 mb-4">
              <div className="relative">
                <div className={`w-24 h-24 rounded-full border-4 ${
                  isDark ? 'border-black bg-gray-700' : 'border-white bg-gray-400'
                } flex items-center justify-center text-white text-2xl font-bold`}>
                  {profileData.name.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 p-1 bg-black rounded-full text-white">
                  <Edit3 className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))}
                  className={`w-full p-3 border rounded-lg ${
                    isDark 
                      ? 'border-gray-600 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-white text-black'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                  rows={3}
                  className={`w-full p-3 border rounded-lg resize-none ${
                    isDark 
                      ? 'border-gray-600 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-white text-black'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData(prev => ({...prev, location: e.target.value}))}
                  className={`w-full p-3 border rounded-lg ${
                    isDark 
                      ? 'border-gray-600 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-white text-black'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Website</label>
                <input
                  type="url"
                  value={profileData.portfolio_url || profileData.website || ''}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev, 
                    [user?.role === 'employer' ? 'website' : 'portfolio_url']: e.target.value
                  }))}
                  className={`w-full p-3 border rounded-lg ${
                    isDark 
                      ? 'border-gray-600 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-white text-black'
                  }`}
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium mb-1">Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${
                        isDark 
                          ? 'bg-gray-800 text-gray-300' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-500"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => {
                    const skill = prompt('Enter a skill:');
                    if (skill) addSkill(skill);
                  }}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full border-2 border-dashed ${
                    isDark 
                      ? 'border-gray-600 text-gray-400 hover:border-gray-500' 
                      : 'border-gray-300 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add skill</span>
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outlined"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}