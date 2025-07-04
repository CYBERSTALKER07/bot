import { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Edit3, 
  Camera, 
  Save, 
  X, 
  Plus, 
  Trash2,
  Award,
  Building2,
  GraduationCap,
  Star,
  Heart,
  Coffee,
  Sparkles,
  Briefcase,
  BookOpen,
  Link as LinkIcon,
  Upload,
  FileText,
  Code,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoaded, setIsLoaded] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || 'User',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
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
    website: ''
  });

  useEffect(() => {
    // Smooth entrance animation
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    setIsEditing(false);
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

  const isStudent = user?.role === 'student';
  const isEmployer = user?.role === 'employer';

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-white ${isLoaded ? 'animate-fade-in' : ''}`}>
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-asu-gold/40 rounded-full animate-float"></div>
      <div className="absolute top-40 left-20 w-3 h-3 bg-asu-maroon/30 rounded-full animate-float animate-delay-200"></div>
      <Sparkles className="absolute top-32 left-1/4 h-5 w-5 text-asu-gold/60 animate-bounce-gentle" />
      <Coffee className="absolute bottom-32 right-1/3 h-4 w-4 text-asu-maroon/50 animate-float animate-delay-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-3xl p-8 text-white mb-8 relative overflow-hidden animate-slide-up hover-glow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse-gentle"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl animate-pulse-gentle animate-delay-200"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative animate-scale-in">
                <div className="w-24 h-24 bg-gradient-to-br from-asu-gold to-yellow-300 rounded-full flex items-center justify-center text-4xl font-bold text-asu-maroon shadow-2xl hover-scale">
                  {profileData.name.charAt(0) || '👤'}
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
                  <Camera className="h-4 w-4 text-asu-maroon" />
                </button>
              </div>
              
              <div className="animate-slide-left">
                <h1 className="text-4xl font-bold mb-2 relative">
                  {profileData.name || 'Your Name'} 
                  {isStudent && ' 🎓'}
                  {isEmployer && ' 🏢'}
                  <div className="absolute -top-2 -right-4 w-3 h-3 bg-asu-gold rounded-full animate-pulse-gentle"></div>
                </h1>
                <p className="text-xl text-white/90 mb-2">
                  {isStudent && 'ASU Student'}
                  {isEmployer && (profileData.company_name || 'Company Representative')}
                </p>
                <div className="flex items-center space-x-4 text-white/80">
                  <div className="flex items-center space-x-2 animate-slide-right animate-delay-100">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.location || 'Phoenix, AZ'}</span>
                  </div>
                  <div className="flex items-center space-x-2 animate-slide-right animate-delay-200">
                    <Mail className="h-4 w-4" />
                    <span>{profileData.email}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="mt-4 md:mt-0 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-6 py-3 rounded-2xl hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 interactive-button animate-slide-up animate-delay-300"
            >
              {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border mb-8 overflow-hidden animate-slide-up animate-delay-400">
          <div className="flex flex-wrap border-b">
            {[
              { id: 'overview', label: 'Overview', icon: User, emoji: '👤' },
              { id: 'experience', label: 'Experience', icon: Briefcase, emoji: '💼' },
              { id: 'education', label: 'Education', icon: GraduationCap, emoji: '🎓' },
              ...(isStudent ? [{ id: 'projects', label: 'Projects', icon: Code, emoji: '💻' }] : []),
              { id: 'skills', label: 'Skills', icon: Zap, emoji: '⚡' },
              { id: 'certifications', label: 'Certifications', icon: Award, emoji: '🏆' }
            ].map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-6 py-4 font-medium transition-all duration-300 relative animate-slide-right ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white shadow-lg'
                      : 'text-gray-600 hover:text-asu-maroon hover:bg-asu-maroon/5'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon className="h-5 w-5 icon-bounce" />
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="animate-bounce-gentle">{tab.emoji}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-asu-gold animate-scale-in"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="bg-white rounded-2xl shadow-lg border p-8 animate-slide-up animate-delay-500">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <User className="h-6 w-6 mr-2 icon-bounce" />
                    About Me 👋
                  </h2>
                </div>
                
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                    placeholder="Tell us about yourself..."
                    className="w-full h-32 p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent resize-none input-focus"
                  />
                ) : (
                  <p className="text-gray-600 leading-relaxed text-lg animate-fade-in">
                    {profileData.bio || 'Passionate ASU student pursuing excellence in technology and innovation. Always eager to learn new skills and take on challenging projects that make a real impact! ✨'}
                  </p>
                )}

                {isEmployer && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-asu-maroon/5 to-asu-gold/5 rounded-2xl animate-slide-up animate-delay-600">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Company Information 🏢</h3>
                    {isEditing ? (
                      <div className="space-y-4">
                        <input
                          value={profileData.company_name}
                          onChange={(e) => setProfileData(prev => ({...prev, company_name: e.target.value}))}
                          placeholder="Company Name"
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon input-focus"
                        />
                        <textarea
                          value={profileData.company_description}
                          onChange={(e) => setProfileData(prev => ({...prev, company_description: e.target.value}))}
                          placeholder="Company Description"
                          className="w-full h-24 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon resize-none input-focus"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <select
                            value={profileData.company_size}
                            onChange={(e) => setProfileData(prev => ({...prev, company_size: e.target.value}))}
                            className="p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon input-focus"
                          >
                            <option value="">Company Size</option>
                            <option value="1-10">1-10 employees</option>
                            <option value="11-50">11-50 employees</option>
                            <option value="51-200">51-200 employees</option>
                            <option value="201-500">201-500 employees</option>
                            <option value="500+">500+ employees</option>
                          </select>
                          <input
                            value={profileData.industry}
                            onChange={(e) => setProfileData(prev => ({...prev, industry: e.target.value}))}
                            placeholder="Industry"
                            className="p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon input-focus"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="animate-slide-up animate-delay-700"><strong>Company:</strong> {profileData.company_name || 'Tech Solutions Inc.'}</p>
                        <p className="animate-slide-up animate-delay-800"><strong>Description:</strong> {profileData.company_description || 'Leading technology company'}</p>
                        <p className="animate-slide-up animate-delay-900"><strong>Size:</strong> {profileData.company_size || '51-200 employees'}</p>
                        <p className="animate-slide-up animate-delay-1000"><strong>Industry:</strong> {profileData.industry || 'Technology'}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="bg-white rounded-2xl shadow-lg border p-8 animate-slide-up animate-delay-500">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Zap className="h-6 w-6 mr-2 icon-bounce" />
                    Skills & Expertise ⚡
                  </h2>
                  {isEditing && (
                    <button
                      onClick={() => {
                        const skill = prompt('Enter a skill:');
                        if (skill) addSkill(skill);
                      }}
                      className="interactive-button bg-asu-maroon text-white px-4 py-2 rounded-xl hover:bg-asu-maroon-dark transition-colors flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Skill</span>
                    </button>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {profileData.skills.length === 0 ? (
                    <p className="text-gray-500 text-center w-full py-8 animate-fade-in">
                      No skills added yet. {isEditing && "Click 'Add Skill' to get started! 🚀"}
                    </p>
                  ) : (
                    profileData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-4 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center space-x-2 animate-slide-up hover-scale"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <span>{skill}</span>
                        {isEditing && (
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-2 hover:text-red-200 transition-colors interactive-button"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Placeholder for other tabs */}
            {activeTab !== 'overview' && activeTab !== 'skills' && (
              <div className="bg-white rounded-2xl shadow-lg border p-8 animate-slide-up animate-delay-500">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-asu-maroon/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-gentle">
                    <Award className="h-8 w-8 text-asu-maroon" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 animate-slide-up animate-delay-600">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
                  </h3>
                  <p className="text-gray-600 mb-6 animate-slide-up animate-delay-700">
                    This section is under development. Coming soon! 🚀
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg border p-6 interactive-card animate-slide-left animate-delay-600">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2 icon-bounce" />
                Contact Info 📞
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 animate-slide-right animate-delay-700">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profileData.email}</span>
                </div>
                <div className="flex items-center space-x-3 animate-slide-right animate-delay-800">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profileData.phone || '(480) 555-0123'}</span>
                </div>
                <div className="flex items-center space-x-3 animate-slide-right animate-delay-900">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profileData.location || 'Phoenix, AZ'}</span>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="bg-white rounded-2xl shadow-lg border p-6 interactive-card animate-slide-left animate-delay-700">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <LinkIcon className="h-5 w-5 mr-2 icon-bounce" />
                Links 🔗
              </h3>
              <div className="space-y-3">
                {isStudent && (
                  <>
                    <a href={profileData.portfolio_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-asu-maroon hover:text-asu-maroon-dark transition-colors hover-scale animate-slide-right animate-delay-800">
                      <FileText className="h-4 w-4" />
                      <span>Portfolio</span>
                    </a>
                    <a href={profileData.github_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-asu-maroon hover:text-asu-maroon-dark transition-colors hover-scale animate-slide-right animate-delay-900">
                      <Code className="h-4 w-4" />
                      <span>GitHub</span>
                    </a>
                  </>
                )}
                <a href={profileData.linkedin_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-asu-maroon hover:text-asu-maroon-dark transition-colors hover-scale animate-slide-right animate-delay-1000">
                  <Building2 className="h-4 w-4" />
                  <span>LinkedIn</span>
                </a>
                {isEmployer && (
                  <a href={profileData.website || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-asu-maroon hover:text-asu-maroon-dark transition-colors hover-scale animate-slide-right animate-delay-1100">
                    <LinkIcon className="h-4 w-4" />
                    <span>Company Website</span>
                  </a>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-2xl p-6 text-white hover-glow animate-slide-left animate-delay-800">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 icon-bounce" />
                Profile Stats 📊
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between animate-slide-right animate-delay-900">
                  <span>Profile Views</span>
                  <span className="font-bold">42</span>
                </div>
                <div className="flex justify-between animate-slide-right animate-delay-1000">
                  <span>Connections</span>
                  <span className="font-bold">18</span>
                </div>
                {isStudent && (
                  <div className="flex justify-between animate-slide-right animate-delay-1100">
                    <span>Applications</span>
                    <span className="font-bold">7</span>
                  </div>
                )}
                {isEmployer && (
                  <div className="flex justify-between animate-slide-right animate-delay-1100">
                    <span>Job Posts</span>
                    <span className="font-bold">3</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="fixed bottom-8 right-8 z-50 animate-scale-in">
            <button
              onClick={handleSave}
              className="interactive-button bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center space-x-3 animate-bounce-gentle"
            >
              <Save className="h-5 w-5" />
              <span className="font-semibold">Save Changes</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}