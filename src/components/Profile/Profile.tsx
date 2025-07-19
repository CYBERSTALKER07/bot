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
  FileText,
  ExternalLink,
  Github,
  Linkedin,
  Eye,
  TrendingUp,
  Users,
  Heart,
  Share,
  Camera,
  Upload
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { Card } from '../ui/Card';
import Badge from '../ui/Badge';

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
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'experience' | 'projects'>('posts');
  const [profileStats, setProfileStats] = useState({
    views: 1247,
    connections: 342,
    posts: 42,
    following: 128,
    followers: 156
  });
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

  // Mock data for demonstration
  const mockExperience: Experience[] = [
    {
      id: '1',
      company: 'Google',
      position: 'Software Engineer Intern',
      location: 'Mountain View, CA',
      start_date: '2023-06-01',
      end_date: '2023-08-31',
      current: false,
      description: 'Developed scalable web applications using React and TypeScript. Collaborated with cross-functional teams to deliver high-quality software solutions.'
    },
    {
      id: '2',
      company: 'Microsoft',
      position: 'Frontend Developer',
      location: 'Seattle, WA',
      start_date: '2024-01-15',
      current: true,
      description: 'Building modern user interfaces with React, implementing responsive designs, and optimizing application performance.'
    }
  ];

  const mockEducation: Education[] = [
    {
      id: '1',
      institution: 'Arizona State University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      start_date: '2020-08-01',
      end_date: '2024-05-15',
      gpa: '3.8',
      current: false
    }
  ];

  const mockProjects: Project[] = [
    {
      id: '1',
      title: 'Task Management App',
      description: 'A full-stack web application for managing tasks and projects with real-time collaboration features.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
      url: 'https://taskmanager.example.com',
      github_url: 'https://github.com/user/task-manager',
      image_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop'
    },
    {
      id: '2',
      title: 'E-commerce Platform',
      description: 'Modern e-commerce solution with payment integration and admin dashboard.',
      technologies: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
      github_url: 'https://github.com/user/ecommerce-platform'
    }
  ];

  const mockCertifications: Certification[] = [
    {
      id: '1',
      name: 'AWS Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: '2023-10-15',
      expiry_date: '2026-10-15',
      credential_id: 'AWS-CCP-2023-001',
      url: 'https://aws.amazon.com/certification/'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const TabButton = ({ id, label, isActive, onClick }: { id: string; label: string; isActive: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`py-4 px-6 font-medium transition-colors border-b-2 ${
        isActive
          ? 'border-blue-500 text-blue-500'
          : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
      }`}
    >
      {label}
    </button>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className="py-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-4">Share your thoughts and connect with others</p>
              <Button variant="contained" className="bg-blue-500 hover:bg-blue-600">
                Create your first post
              </Button>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="py-6 space-y-8">
            {/* Professional Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                About
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {profileData.bio}
              </p>
            </Card>

            {/* Skills */}
            {profileData.skills.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Skills & Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Contact & Links */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Contact & Links
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{profileData.email}</span>
                </div>
                {profileData.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{profileData.phone}</span>
                  </div>
                )}
                {profileData.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{profileData.location}</span>
                  </div>
                )}
                {profileData.portfolio_url && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a href={profileData.portfolio_url} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-500 hover:underline flex items-center">
                      Portfolio <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
                {profileData.linkedin_url && (
                  <div className="flex items-center space-x-3">
                    <Linkedin className="h-4 w-4 text-gray-500" />
                    <a href={profileData.linkedin_url} target="_blank" rel="noopener noreferrer"
                       className="text-blue-500 hover:underline flex items-center">
                      LinkedIn <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
                {profileData.github_url && (
                  <div className="flex items-center space-x-3">
                    <Github className="h-4 w-4 text-gray-500" />
                    <a href={profileData.github_url} target="_blank" rel="noopener noreferrer"
                       className="text-blue-500 hover:underline flex items-center">
                      GitHub <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </Card>
          </div>
        );

      case 'experience':
        return (
          <div className="py-6 space-y-8">
            {/* Experience */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Experience
                </h3>
                <Button variant="outlined" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>
              <div className="space-y-6">
                {mockExperience.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-blue-500 pl-4 relative">
                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1"></div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{exp.position}</h4>
                        <p className="text-blue-600 dark:text-blue-400">{exp.company}</p>
                        <p className="text-sm text-gray-500">{exp.location}</p>
                      </div>
                      <Badge variant={exp.current ? 'default' : 'secondary'}>
                        {exp.current ? 'Current' : 'Past'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {formatDate(exp.start_date)} - {exp.current ? 'Present' : formatDate(exp.end_date!)}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">{exp.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Education */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Education
                </h3>
                <Button variant="outlined" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </div>
              <div className="space-y-6">
                {mockEducation.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-green-500 pl-4 relative">
                    <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1"></div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{edu.degree} in {edu.field}</h4>
                        <p className="text-green-600 dark:text-green-400">{edu.institution}</p>
                      </div>
                      {edu.gpa && (
                        <Badge variant="secondary">
                          GPA: {edu.gpa}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDate(edu.start_date)} - {formatDate(edu.end_date!)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Certifications */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Certifications
                </h3>
                <Button variant="outlined" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certification
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockCertifications.map((cert) => (
                  <div key={cert.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold">{cert.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Issued: {formatDate(cert.date)}
                      {cert.expiry_date && ` • Expires: ${formatDate(cert.expiry_date)}`}
                    </p>
                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer"
                         className="text-blue-500 hover:underline text-sm inline-flex items-center mt-2">
                        View Certificate <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'projects':
        return (
          <div className="py-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Projects
                </h3>
                <Button variant="outlined" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockProjects.map((project) => (
                  <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    {project.image_url && (
                      <img src={project.image_url} alt={project.title} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-4">
                      <h4 className="font-semibold text-lg mb-2">{project.title}</h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.technologies.map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-3">
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer"
                             className="text-blue-500 hover:underline text-sm inline-flex items-center">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Live Demo
                          </a>
                        )}
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                             className="text-blue-500 hover:underline text-sm inline-flex items-center">
                            <Github className="h-3 w-3 mr-1" />
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header with Back Button */}
        <div className="sticky top-0 backdrop-blur-md bg-white/90 dark:bg-black/90 border-b border-gray-200 dark:border-gray-800 p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/feed')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold">{profileData.name}</h1>
                <p className="text-sm text-gray-500">{profileStats.posts} Posts • {profileStats.views} Profile Views</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Cover Photo Area */}
        <div className="relative h-64 group">
          <div className={`absolute inset-0 ${
            isDark 
              ? 'bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900' 
              : 'bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600'
          }`}></div>
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Cover Photo Edit Button */}
          <button className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-4 w-4" />
          </button>
        </div>

        {/* Enhanced Profile Info */}
        <div className="px-6">
          {/* Avatar and Action Buttons */}
          <div className="flex justify-between items-end -mt-20 mb-6">
            <div className="relative group">
              <div className={`w-36 h-36 rounded-full border-4 ${
                isDark ? 'border-black' : 'border-white'
              } bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl`}>
                {user?.avatar_url ? (
                  <Avatar
                    src={user.avatar_url}
                    alt={profileData.name}
                    size="2xl"
                    className="border-4 border-white dark:border-black"
                  />
                ) : (
                  profileData.name.charAt(0)
                )}
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="flex space-x-3 mb-4">
              <Button variant="ghost" size="sm" className="rounded-full">
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                variant="contained"
                onClick={() => setShowEditModal(true)}
                className="bg-blue-500 hover:bg-blue-600 px-6"
              >
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Enhanced Profile Details */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold">{profileData.name}</h1>
              {user?.role === 'employer' && (
                <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <Building2 className="h-3 w-3 mr-1" />
                  Employer
                </Badge>
              )}
              {user?.role === 'student' && (
                <Badge variant="default" className="bg-blue-100 text-transparent dark:bg-transparent dark:text-blue-200">
                  {/* <GraduationCap className="h-3 w-3 mr-1" /> */}
                  Student
                </Badge>
              )}
            </div>
            
            <p className="text-gray-500 text-lg mb-4">@{profileData.name.toLowerCase().replace(/\s/g, '')}</p>
            
            <p className="text-base leading-relaxed mb-4">{profileData.bio}</p>

            {/* Enhanced Metadata */}
            <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-500">
              {profileData.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{profileData.location}</span>
                </div>
              )}
              
              {(profileData.portfolio_url || profileData.website) && (
                <div className="flex items-center space-x-2">
                  <LinkIcon className="h-4 w-4" />
                  <a 
                    href={profileData.portfolio_url || profileData.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center"
                  >
                    {profileData.portfolio_url ? 'Portfolio' : 'Website'}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatJoinDate(profileData.joined_date)}</span>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{profileStats.posts}</div>
                <div className="text-sm text-gray-500">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{profileStats.followers}</div>
                <div className="text-sm text-gray-500">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">{profileStats.following}</div>
                <div className="text-sm text-gray-500">Following</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{profileStats.connections}</div>
                <div className="text-sm text-gray-500">Connections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{profileStats.views}</div>
                <div className="text-sm text-gray-500">Profile Views</div>
              </div>
            </div>
          </div>

          {/* Enhanced Navigation Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-800 mb-0">
            <nav className="flex space-x-8 overflow-x-auto">
              <TabButton
                id="posts"
                label="Posts"
                isActive={activeTab === 'posts'}
                onClick={() => setActiveTab('posts')}
              />
              <TabButton
                id="about"
                label="About"
                isActive={activeTab === 'about'}
                onClick={() => setActiveTab('about')}
              />
              <TabButton
                id="experience"
                label="Experience"
                isActive={activeTab === 'experience'}
                onClick={() => setActiveTab('experience')}
              />
              <TabButton
                id="projects"
                label="Projects"
                isActive={activeTab === 'projects'}
                onClick={() => setActiveTab('projects')}
              />
            </nav>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>

        {/* Enhanced Edit Profile Modal */}
        <Modal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Profile"
          maxWidth="lg"
        >
          <div className="space-y-6">
            {/* Cover Photo Section */}
            <div className="relative">
              <div className={`h-40 rounded-lg ${
                isDark ? 'bg-gray-800' : 'bg-gray-200'
              } flex items-center justify-center group`}>
                <button className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full text-white">
                  <Upload className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Avatar Section */}
            <div className="flex justify-center -mt-20 mb-8">
              <div className="relative group">
                <div className={`w-24 h-24 rounded-full border-4 ${
                  isDark ? 'border-black bg-gray-700' : 'border-white bg-gray-400'
                } flex items-center justify-center text-white text-2xl font-bold`}>
                  {profileData.name.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 p-1 bg-blue-500 rounded-full text-white">
                  <Camera className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Enhanced Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Full Name</label>
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                  rows={4}
                  className={`w-full p-3 border rounded-lg resize-none ${
                    isDark 
                      ? 'border-gray-600 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-white text-black'
                  }`}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData(prev => ({...prev, location: e.target.value}))}
                  className={`w-full p-3 border rounded-lg ${
                    isDark 
                      ? 'border-gray-600 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-white text-black'
                  }`}
                  placeholder="City, State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({...prev, phone: e.target.value}))}
                  className={`w-full p-3 border rounded-lg ${
                    isDark 
                      ? 'border-gray-600 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-white text-black'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Website/Portfolio</label>
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
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={profileData.linkedin_url || ''}
                  onChange={(e) => setProfileData(prev => ({...prev, linkedin_url: e.target.value}))}
                  className={`w-full p-3 border rounded-lg ${
                    isDark 
                      ? 'border-gray-600 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-white text-black'
                  }`}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>

            {/* Enhanced Skills Section */}
            <div>
              <label className="block text-sm font-medium mb-2">Skills</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {profileData.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 flex items-center space-x-2"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => removeSkill(skill)}
                      className="hover:text-red-500"
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Button
                variant="outlined"
                onClick={() => {
                  const skill = prompt('Enter a skill:');
                  if (skill) addSkill(skill);
                }}
                className="w-full md:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outlined"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}