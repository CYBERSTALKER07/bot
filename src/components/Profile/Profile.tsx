import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, useNavigate } from 'react-router-dom';
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
  TrendingUp,
  Menu,
  Search,
  MessageSquare,
  Calendar as CalendarIcon,
  Settings,
  Rss,
  Home,
  Users,
  Globe,
  BookMarked,
  Smartphone,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

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
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
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

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance animation
      gsap.fromTo(headerRef.current, {
        opacity: 0,
        y: -60,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: 'power3.out'
      });

      // Profile avatar animation
      gsap.fromTo('.profile-avatar', {
        scale: 0,
        rotation: -180,
        opacity: 0
      }, {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'elastic.out(1, 0.8)',
        delay: 0.3
      });

      // Tabs entrance
      gsap.fromTo('.profile-tab', {
        opacity: 0,
        y: 30,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.6
      });

      // Main content entrance
      gsap.fromTo(contentRef.current, {
        opacity: 0,
        x: -50,
        scale: 0.95
      }, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        delay: 0.8
      });

      // Sidebar entrance
      gsap.fromTo(sidebarRef.current, {
        opacity: 0,
        x: 50,
        scale: 0.95
      }, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        delay: 1
      });

      // Skills animation
      gsap.fromTo('.skill-tag', {
        opacity: 0,
        scale: 0,
        y: 20
      }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        stagger: 0.05,
        delay: 1.2
      });

      // Floating decorations
      gsap.to('.profile-decoration', {
        y: -15,
        x: 8,
        rotation: 360,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Stats counter animation
      gsap.fromTo('.stat-number', {
        textContent: 0,
        opacity: 0
      }, {
        textContent: (i, target) => target.getAttribute('data-value'),
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out',
        delay: 1.5,
        snap: { textContent: 1 }
      });

      // Contact links hover animation
      gsap.set('.contact-link', {
        transformOrigin: 'center'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Add edit mode toggle animation
  useEffect(() => {
    if (isEditing) {
      gsap.fromTo('.edit-field', {
        opacity: 0,
        scale: 0.95
      }, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
        stagger: 0.05
      });
    }
  }, [isEditing]);

  // Add tab change animation
  useEffect(() => {
    gsap.fromTo('.tab-content', {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power3.out'
    });
  }, [activeTab]);

  const handleSave = () => {
    // Save animation
    gsap.to('.save-button', {
      scale: 1.1,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
      onComplete: () => setIsEditing(false)
    });
  };

  const addSkill = (skill: string) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      
      // Animate new skill
      setTimeout(() => {
        gsap.fromTo('.skill-tag:last-child', {
          scale: 0,
          opacity: 0,
          y: 20
        }, {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'back.out(1.7)'
        });
      }, 10);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const skillElement = document.querySelector(`[data-skill="${skillToRemove}"]`);
    if (skillElement) {
      gsap.to(skillElement, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          setProfileData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
          }));
        }
      });
    }
  };

  const handleTabChange = (tabId: string) => {
    // Tab change animation
    gsap.to('.tab-content', {
      opacity: 0,
      y: -20,
      duration: 0.2,
      ease: 'power2.out',
      onComplete: () => {
        setActiveTab(tabId);
      }
    });
  };

  const isStudent = user?.role === 'student';
  const isEmployer = user?.role === 'employer';

  // Mobile Navigation Menu Items
  const getMobileNavigationItems = () => {
    const baseItems = [
      { icon: Rss, label: 'Feed', path: '/feed', description: 'Latest updates and posts' },
      { icon: Search, label: 'Find Jobs', path: '/jobs', description: 'Browse available positions' },
      { icon: Building2, label: 'Companies', path: '/companies', description: 'Explore company profiles' },
      { icon: MessageSquare, label: 'Messages', path: '/messages', description: 'Chat with recruiters' },
      { icon: CalendarIcon, label: 'Events', path: '/events', description: 'Career fairs and workshops' },
      { icon: BookOpen, label: 'Resources', path: '/resources', description: 'Career development tools' },
      { icon: Settings, label: 'Settings', path: '/profile-setup', description: 'Account preferences' },
    ];

    if (user?.role === 'student') {
      return [
        ...baseItems,
        { icon: FileText, label: 'Learning Passport', path: '/digital-learning-passport', description: 'Track your learning journey' },
        { icon: Target, label: 'Skills Audit', path: '/skills-audit-system', description: 'Assess your capabilities' },
        { icon: Globe, label: 'Career Tips', path: '/career-tips', description: 'Professional advice' },
        { icon: Users, label: 'Who\'s Hiring', path: '/whos-hiring', description: 'Active recruiters' },
        { icon: Smartphone, label: 'Mobile App', path: '/mobile-app', description: 'Download our app' },
      ];
    }

    if (user?.role === 'employer') {
      return [
        ...baseItems,
        { icon: Briefcase, label: 'Post Jobs', path: '/post-job', description: 'Create job listings' },
        { icon: Users, label: 'Applicants', path: '/applicants', description: 'Manage applications' },
        { icon: Globe, label: 'For Employers', path: '/for-employers', description: 'Employer resources' },
      ];
    }

    return baseItems;
  };

  // Mobile menu navigation handler
  const handleMobileMenuItemClick = (path: string) => {
    setShowMobileMenu(false);
    navigate(path);
  };

  return (
    <div ref={containerRef} className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-dark-bg to-dark-surface' 
        : 'bg-gradient-to-br from-gray-50 to-white'
    }`}>
      {/* Decorative elements */}
      <div className={`profile-decoration absolute top-20 right-20 w-4 h-4 rounded-full transition-colors ${
        isDark ? 'bg-lime/40' : 'bg-asu-gold/40'
      }`}></div>
      <div className={`profile-decoration absolute top-40 left-20 w-3 h-3 rounded-full transition-colors ${
        isDark ? 'bg-dark-accent/30' : 'bg-asu-maroon/30'
      }`}></div>
      <Sparkles className={`profile-decoration absolute top-32 left-1/4 h-5 w-5 transition-colors ${
        isDark ? 'text-lime/60' : 'text-asu-gold/60'
      }`} />
      <Coffee className={`profile-decoration absolute bottom-32 right-1/3 h-4 w-4 transition-colors ${
        isDark ? 'text-dark-accent/50' : 'text-asu-maroon/50'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        {/* Enhanced Mobile Header */}
        <div ref={headerRef} className={`rounded-3xl p-4 sm:p-8 text-white mb-6 sm:mb-8 relative overflow-hidden transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-r from-dark-surface to-lime' 
            : 'bg-gradient-to-r from-asu-maroon to-asu-maroon'
        }`}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setShowMobileMenu(true)}
              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-300"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full blur-xl transition-colors ${
            isDark ? 'bg-lime/20' : 'bg-asu-gold/20'
          }`}></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className={`profile-avatar w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl transition-colors ${
                  isDark 
                    ? 'bg-gradient-to-br from-lime to-dark-accent text-dark-surface' 
                    : 'bg-gradient-to-br from-asu-gold to-yellow-300 text-asu-maroon'
                }`}>
                  {profileData.name.charAt(0) || '👤'}
                </div>
                <button 
                  className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isDark ? 'bg-dark-surface' : 'bg-white'
                  }`}
                  onClick={() => {
                    gsap.to('.profile-avatar', {
                      scale: 1.1,
                      duration: 0.2,
                      yoyo: true,
                      repeat: 1,
                      ease: 'power2.out'
                    });
                  }}
                >
                  <Camera className={`h-4 w-4 ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`} />
                </button>
              </div>
              
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {profileData.name || 'Your Name'} 
                  {isStudent && ' 🎓'}
                  {isEmployer && ' 🏢'}
                </h1>
                <p className="text-xl text-white/90 mb-2">
                  {isStudent && 'ASU Student'}
                  {isEmployer && (profileData.company_name || 'Company Representative')}
                </p>
                <div className="flex items-center space-x-4 text-white/80">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.location || 'Phoenix, AZ'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{profileData.email}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="mt-4 md:mt-0 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-6 py-3 rounded-2xl hover:bg-white/30 transition-all duration-300 flex items-center space-x-2"
            >
              {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div ref={tabsRef} className={`rounded-2xl shadow-lg border mb-8 overflow-hidden transition-colors duration-300 ${
          isDark ? 'bg-dark-surface border-lime/20' : 'bg-white border-gray-200'
        }`}>
          <div className="flex flex-wrap border-b border-inherit">
            {[
              { id: 'overview', label: 'Overview', icon: User, emoji: '👤' },
              { id: 'experience', label: 'Experience', icon: Briefcase, emoji: '💼' },
              { id: 'education', label: 'Education', icon: GraduationCap, emoji: '🎓' },
              ...(isStudent ? [{ id: 'projects', label: 'Projects', icon: Code, emoji: '💻' }] : []),
              { id: 'skills', label: 'Skills', icon: Zap, emoji: '⚡' },
              { id: 'certifications', label: 'Certifications', icon: Award, emoji: '🏆' }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`profile-tab flex items-center space-x-3 px-6 py-4 font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? isDark 
                        ? 'bg-gradient-to-r from-lime to-dark-accent text-dark-surface shadow-lg' 
                        : 'bg-gradient-to-r from-asu-maroon to-asu-maroon text-white shadow-lg'
                      : isDark 
                        ? 'text-dark-muted' 
                        : 'text-gray-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden md:inline">{tab.label}</span>
                  <span>{tab.emoji}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div ref={contentRef} className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className={`tab-content rounded-2xl shadow-lg border p-8 transition-colors duration-300 ${
                isDark ? 'bg-dark-surface border-lime/20' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold flex items-center transition-colors ${
                    isDark ? 'text-dark-text' : 'text-gray-900'
                  }`}>
                    <User className="h-6 w-6 mr-2" />
                    About Me 👋
                  </h2>
                </div>
                
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                    placeholder="Tell us about yourself..."
                    className={`edit-field w-full h-32 p-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-colors ${
                      isDark 
                        ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                        : 'border-gray-200 focus:ring-asu-maroon focus:border-transparent bg-white text-gray-900'
                    }`}
                  />
                ) : (
                  <p className={`leading-relaxed text-lg transition-colors ${
                    isDark ? 'text-dark-muted' : 'text-gray-600'
                  }`}>
                    {profileData.bio || 'Passionate ASU student pursuing excellence in technology and innovation. Always eager to learn new skills and take on challenging projects that make a real impact! ✨'}
                  </p>
                )}

                {isEmployer && (
                  <div className={`mt-8 p-6 rounded-2xl transition-colors ${
                    isDark 
                      ? 'bg-gradient-to-r from-lime/5 to-dark-accent/5' 
                      : 'bg-gradient-to-r from-asu-maroon/5 to-asu-gold/5'
                  }`}>
                    <h3 className={`text-xl font-bold mb-4 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-900'
                    }`}>Company Information 🏢</h3>
                    {isEditing ? (
                      <div className="space-y-4">
                        <input
                          value={profileData.company_name}
                          onChange={(e) => setProfileData(prev => ({...prev, company_name: e.target.value}))}
                          placeholder="Company Name"
                          className={`edit-field w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                            isDark 
                              ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                              : 'border-gray-200 focus:ring-asu-maroon bg-white text-gray-900'
                          }`}
                        />
                        <textarea
                          value={profileData.company_description}
                          onChange={(e) => setProfileData(prev => ({...prev, company_description: e.target.value}))}
                          placeholder="Company Description"
                          className={`edit-field w-full h-24 p-4 border-2 rounded-xl focus:outline-none focus:ring-2 resize-none transition-colors ${
                            isDark 
                              ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                              : 'border-gray-200 focus:ring-asu-maroon bg-white text-gray-900'
                          }`}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <select
                            value={profileData.company_size}
                            onChange={(e) => setProfileData(prev => ({...prev, company_size: e.target.value}))}
                            className={`edit-field p-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                              isDark 
                                ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text' 
                                : 'border-gray-200 focus:ring-asu-maroon bg-white text-gray-900'
                            }`}
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
                            className={`edit-field p-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                              isDark 
                                ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                                : 'border-gray-200 focus:ring-asu-maroon bg-white text-gray-900'
                            }`}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className={`space-y-3 transition-colors ${
                        isDark ? 'text-dark-text' : 'text-gray-900'
                      }`}>
                        <p><strong>Company:</strong> {profileData.company_name || 'Tech Solutions Inc.'}</p>
                        <p><strong>Description:</strong> {profileData.company_description || 'Leading technology company'}</p>
                        <p><strong>Size:</strong> {profileData.company_size || '51-200 employees'}</p>
                        <p><strong>Industry:</strong> {profileData.industry || 'Technology'}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'skills' && (
              <div className={`tab-content rounded-2xl shadow-lg border p-8 transition-colors duration-300 ${
                isDark ? 'bg-dark-surface border-lime/20' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold flex items-center transition-colors ${
                    isDark ? 'text-dark-text' : 'text-gray-900'
                  }`}>
                    <Zap className="h-6 w-6 mr-2" />
                    Skills & Expertise ⚡
                  </h2>
                  {isEditing && (
                    <button
                      onClick={() => {
                        const skill = prompt('Enter a skill:');
                        if (skill) addSkill(skill);
                      }}
                      className={`px-4 py-2 rounded-xl transition-colors flex items-center space-x-2 ${
                        isDark 
                          ? 'bg-lime text-dark-surface hover:bg-dark-accent' 
                          : 'bg-asu-maroon text-white hover:bg-asu-maroon-dark'
                      }`}
                      onMouseEnter={() => {
                        gsap.to(event?.currentTarget, {
                          scale: 1.05,
                          duration: 0.2,
                          ease: 'power2.out'
                        });
                      }}
                      onMouseLeave={() => {
                        gsap.to(event?.currentTarget, {
                          scale: 1,
                          duration: 0.2,
                          ease: 'power2.out'
                        });
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Skill</span>
                    </button>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {profileData.skills.length === 0 ? (
                    <p className={`text-center w-full py-8 transition-colors ${
                      isDark ? 'text-dark-muted' : 'text-gray-500'
                    }`}>
                      No skills added yet. {isEditing && "Click 'Add Skill' to get started! 🚀"}
                    </p>
                  ) : (
                    profileData.skills.map((skill, index) => (
                      <div
                        key={index}
                        data-skill={skill}
                        className={`skill-tag text-white px-4 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center space-x-2 ${
                          isDark 
                            ? 'bg-gradient-to-r from-lime to-dark-accent' 
                            : 'bg-gradient-to-r from-asu-maroon to-asu-maroon'
                        }`}
                        onMouseEnter={() => {
                          gsap.to(event?.currentTarget, {
                            scale: 1.05,
                            duration: 0.2,
                            ease: 'power2.out'
                          });
                        }}
                        onMouseLeave={() => {
                          gsap.to(event?.currentTarget, {
                            scale: 1,
                            duration: 0.2,
                            ease: 'power2.out'
                          });
                        }}
                      >
                        <span>{skill}</span>
                        {isEditing && (
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-2 hover:text-red-200 transition-colors"
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
              <div className={`tab-content rounded-2xl shadow-lg border p-8 transition-colors duration-300 ${
                isDark ? 'bg-dark-surface border-lime/20' : 'bg-white border-gray-200'
              }`}>
                <div className="text-center py-12">
                  <h3 className={`text-2xl font-bold mb-4 transition-colors ${
                    isDark ? 'text-dark-text' : 'text-gray-900'
                  }`}>
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
                  </h3>
                  <p className={`mb-6 transition-colors ${
                    isDark ? 'text-dark-muted' : 'text-gray-600'
                  }`}>
                    This section is under development. Coming soon! 🚀
                  </p>
                  <div className="flex justify-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                      isDark ? 'bg-lime/10' : 'bg-asu-maroon/10'
                    }`}>
                      <Award className={`h-8 w-8 ${
                        isDark ? 'text-lime' : 'text-asu-maroon'
                      }`} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div ref={sidebarRef} className="space-y-6">
            {/* Contact Information */}
            <div className={`rounded-2xl shadow-lg border p-6 transition-colors duration-300 ${
              isDark ? 'bg-dark-surface border-lime/20' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-xl font-bold mb-4 flex items-center transition-colors ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}>
                <Phone className="h-5 w-5 mr-2" />
                Contact Info 📞
              </h3>
              <div className="space-y-3">
                <div className="contact-link flex items-center space-x-3">
                  <Mail className={`h-4 w-4 ${
                    isDark ? 'text-dark-muted' : 'text-gray-400'
                  }`} />
                  <span className={`transition-colors ${
                    isDark ? 'text-dark-muted' : 'text-gray-600'
                  }`}>{profileData.email}</span>
                </div>
                <div className="contact-link flex items-center space-x-3">
                  <Phone className={`h-4 w-4 ${
                    isDark ? 'text-dark-muted' : 'text-gray-400'
                  }`} />
                  <span className={`transition-colors ${
                    isDark ? 'text-dark-muted' : 'text-gray-600'
                  }`}>{profileData.phone || '(480) 555-0123'}</span>
                </div>
                <div className="contact-link flex items-center space-x-3">
                  <MapPin className={`h-4 w-4 ${
                    isDark ? 'text-dark-muted' : 'text-gray-400'
                  }`} />
                  <span className={`transition-colors ${
                    isDark ? 'text-dark-muted' : 'text-gray-600'
                  }`}>{profileData.location || 'Phoenix, AZ'}</span>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className={`rounded-2xl shadow-lg border p-6 transition-colors duration-300 ${
              isDark ? 'bg-dark-surface border-lime/20' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-xl font-bold mb-4 flex items-center transition-colors ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}>
                <LinkIcon className="h-5 w-5 mr-2" />
                Links 🔗
              </h3>
              <div className="space-y-3">
                {isStudent && (
                  <>
                    <a 
                      href={profileData.portfolio_url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`contact-link flex items-center space-x-3 transition-colors ${
                        isDark ? 'text-lime hover:text-dark-accent' : 'text-asu-maroon hover:text-asu-maroon-dark'
                      }`}
                      onMouseEnter={() => {
                        gsap.to(event?.currentTarget, {
                          x: 5,
                          duration: 0.2,
                          ease: 'power2.out'
                        });
                      }}
                      onMouseLeave={() => {
                        gsap.to(event?.currentTarget, {
                          x: 0,
                          duration: 0.2,
                          ease: 'power2.out'
                        });
                      }}
                    >
                      <FileText className="h-4 w-4" />
                      <span>Portfolio</span>
                    </a>
                    <a 
                      href={profileData.github_url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`contact-link flex items-center space-x-3 transition-colors ${
                        isDark ? 'text-lime hover:text-dark-accent' : 'text-asu-maroon hover:text-asu-maroon-dark'
                      }`}
                      onMouseEnter={() => {
                        gsap.to(event?.currentTarget, {
                          x: 5,
                          duration: 0.2,
                          ease: 'power2.out'
                        });
                      }}
                      onMouseLeave={() => {
                        gsap.to(event?.currentTarget, {
                          x: 0,
                          duration: 0.2,
                          ease: 'power2.out'
                        });
                      }}
                    >
                      <Code className="h-4 w-4" />
                      <span>GitHub</span>
                    </a>
                  </>
                )}
                <a 
                  href={profileData.linkedin_url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`contact-link flex items-center space-x-3 transition-colors ${
                    isDark ? 'text-lime hover:text-dark-accent' : 'text-asu-maroon hover:text-asu-maroon-dark'
                  }`}
                  onMouseEnter={() => {
                    gsap.to(event?.currentTarget, {
                      x: 5,
                      duration: 0.2,
                      ease: 'power2.out'
                    });
                  }}
                  onMouseLeave={() => {
                    gsap.to(event?.currentTarget, {
                      x: 0,
                      duration: 0.2,
                      ease: 'power2.out'
                    });
                  }}
                >
                  <Building2 className="h-4 w-4" />
                  <span>LinkedIn</span>
                </a>
                {isEmployer && (
                  <a 
                    href={profileData.website || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`contact-link flex items-center space-x-3 transition-colors ${
                      isDark ? 'text-lime hover:text-dark-accent' : 'text-asu-maroon hover:text-asu-maroon-dark'
                    }`}
                    onMouseEnter={() => {
                      gsap.to(event?.currentTarget, {
                        x: 5,
                        duration: 0.2,
                        ease: 'power2.out'
                      });
                    }}
                    onMouseLeave={() => {
                      gsap.to(event?.currentTarget, {
                        x: 0,
                        duration: 0.2,
                        ease: 'power2.out'
                      });
                    }}
                  >
                    <LinkIcon className="h-4 w-4" />
                    <span>Company Website</span>
                  </a>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className={`rounded-2xl p-6 text-white transition-colors duration-300 ${
              isDark 
                ? 'bg-gradient-to-br from-dark-surface to-lime' 
                : 'bg-gradient-to-br from-asu-maroon to-asu-maroon'
            }`}>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Profile Stats 📊
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Profile Views</span>
                  <span className="stat-number font-bold" data-value="42">0</span>
                </div>
                <div className="flex justify-between">
                  <span>Connections</span>
                  <span className="stat-number font-bold" data-value="18">0</span>
                </div>
                {isStudent && (
                  <div className="flex justify-between">
                    <span>Applications</span>
                    <span className="stat-number font-bold" data-value="7">0</span>
                  </div>
                )}
                {isEmployer && (
                  <div className="flex justify-between">
                    <span>Job Posts</span>
                    <span className="stat-number font-bold" data-value="3">0</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="fixed bottom-8 right-8 z-50">
            <button
              onClick={handleSave}
              className="save-button bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-shadow flex items-center space-x-3"
            >
              <Save className="h-5 w-5" />
              <span className="font-semibold">Save Changes</span>
            </button>
          </div>
        )}

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col md:hidden`}>
            <div className={`bg-white rounded-t-3xl p-6 shadow-xl transition-transform ${
              isDark ? 'bg-dark-surface' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-bold transition-colors ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>
                  Menu
                </h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col space-y-4">
                {getMobileNavigationItems().map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleMobileMenuItemClick(item.path)}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isDark 
                        ? 'hover:bg-dark-accent/30' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`} />
                    <div className="flex-1">
                      <p className={`font-medium transition-colors ${
                        isDark ? 'text-dark-text' : 'text-gray-900'
                      }`}>{item.label}</p>
                      <p className={`text-sm transition-colors ${
                        isDark ? 'text-dark-muted' : 'text-gray-500'
                      }`}>{item.description}</p>
                    </div>
                    <ChevronRight className={`h-5 w-5 transition-colors ${
                      isDark ? 'text-dark-muted' : 'text-gray-400'
                    }`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}