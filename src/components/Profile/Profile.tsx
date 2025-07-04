import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
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

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Decorative elements */}
      <div className="profile-decoration absolute top-20 right-20 w-4 h-4 bg-asu-gold/40 rounded-full"></div>
      <div className="profile-decoration absolute top-40 left-20 w-3 h-3 bg-asu-maroon/30 rounded-full"></div>
      <Sparkles className="profile-decoration absolute top-32 left-1/4 h-5 w-5 text-asu-gold/60" />
      <Coffee className="profile-decoration absolute bottom-32 right-1/3 h-4 w-4 text-asu-maroon/50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div ref={headerRef} className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="profile-avatar w-24 h-24 bg-gradient-to-br from-asu-gold to-yellow-300 rounded-full flex items-center justify-center text-4xl font-bold text-asu-maroon shadow-2xl">
                  {profileData.name.charAt(0) || '👤'}
                </div>
                <button 
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
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
                  <Camera className="h-4 w-4 text-asu-maroon" />
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
              {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div ref={tabsRef} className="bg-white rounded-2xl shadow-lg border mb-8 overflow-hidden">
          <div className="flex flex-wrap border-b">
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
                      ? 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white shadow-lg'
                      : 'text-gray-600 hover:text-asu-maroon hover:bg-asu-maroon/5'
                  }`}
                  onMouseEnter={() => {
                    if (activeTab !== tab.id) {
                      gsap.to(event?.currentTarget, {
                        scale: 1.02,
                        duration: 0.2,
                        ease: 'power2.out'
                      });
                    }
                  }}
                  onMouseLeave={() => {
                    if (activeTab !== tab.id) {
                      gsap.to(event?.currentTarget, {
                        scale: 1,
                        duration: 0.2,
                        ease: 'power2.out'
                      });
                    }
                  }}
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
              <div className="tab-content bg-white rounded-2xl shadow-lg border p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <User className="h-6 w-6 mr-2" />
                    About Me 👋
                  </h2>
                </div>
                
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                    placeholder="Tell us about yourself..."
                    className="edit-field w-full h-32 p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent resize-none"
                  />
                ) : (
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {profileData.bio || 'Passionate ASU student pursuing excellence in technology and innovation. Always eager to learn new skills and take on challenging projects that make a real impact! ✨'}
                  </p>
                )}

                {isEmployer && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-asu-maroon/5 to-asu-gold/5 rounded-2xl">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Company Information 🏢</h3>
                    {isEditing ? (
                      <div className="space-y-4">
                        <input
                          value={profileData.company_name}
                          onChange={(e) => setProfileData(prev => ({...prev, company_name: e.target.value}))}
                          placeholder="Company Name"
                          className="edit-field w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon"
                        />
                        <textarea
                          value={profileData.company_description}
                          onChange={(e) => setProfileData(prev => ({...prev, company_description: e.target.value}))}
                          placeholder="Company Description"
                          className="edit-field w-full h-24 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon resize-none"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <select
                            value={profileData.company_size}
                            onChange={(e) => setProfileData(prev => ({...prev, company_size: e.target.value}))}
                            className="edit-field p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon"
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
                            className="edit-field p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
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
              <div className="tab-content bg-white rounded-2xl shadow-lg border p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Zap className="h-6 w-6 mr-2" />
                    Skills & Expertise ⚡
                  </h2>
                  {isEditing && (
                    <button
                      onClick={() => {
                        const skill = prompt('Enter a skill:');
                        if (skill) addSkill(skill);
                      }}
                      className="bg-asu-maroon text-white px-4 py-2 rounded-xl hover:bg-asu-maroon-dark transition-colors flex items-center space-x-2"
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
                    <p className="text-gray-500 text-center w-full py-8">
                      No skills added yet. {isEditing && "Click 'Add Skill' to get started! 🚀"}
                    </p>
                  ) : (
                    profileData.skills.map((skill, index) => (
                      <div
                        key={index}
                        data-skill={skill}
                        className="skill-tag bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-4 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center space-x-2"
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
              <div className="tab-content bg-white rounded-2xl shadow-lg border p-8">
                <div className="text-center py-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
                  </h3>
                  <p className="text-gray-600 mb-6">
                    This section is under development. Coming soon! 🚀
                  </p>
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-asu-maroon/10 rounded-full flex items-center justify-center">
                      <Award className="h-8 w-8 text-asu-maroon" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div ref={sidebarRef} className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Contact Info 📞
              </h3>
              <div className="space-y-3">
                <div className="contact-link flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profileData.email}</span>
                </div>
                <div className="contact-link flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profileData.phone || '(480) 555-0123'}</span>
                </div>
                <div className="contact-link flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profileData.location || 'Phoenix, AZ'}</span>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
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
                      className="contact-link flex items-center space-x-3 text-asu-maroon hover:text-asu-maroon-dark transition-colors"
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
                      className="contact-link flex items-center space-x-3 text-asu-maroon hover:text-asu-maroon-dark transition-colors"
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
                  className="contact-link flex items-center space-x-3 text-asu-maroon hover:text-asu-maroon-dark transition-colors"
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
                    className="contact-link flex items-center space-x-3 text-asu-maroon hover:text-asu-maroon-dark transition-colors"
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
            <div className="bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-2xl p-6 text-white">
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
      </div>
    </div>
  );
}