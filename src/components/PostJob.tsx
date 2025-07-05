import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  Save, 
  X, 
  Plus, 
  MapPin, 
  Building2, 
  DollarSign, 
  Calendar, 
  FileText, 
  Users, 
  Eye, 
  CheckCircle,
  Sparkles,
  Coffee,
  Heart,
  Zap,
  Star,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function PostJob() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: user?.company || '',
    location: '',
    type: 'full-time',
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation - scale from small to big
      gsap.fromTo(headerRef.current, {
        scale: 0.3,
        opacity: 0,
        y: -50,
        rotation: -2
      }, {
        scale: 1,
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 1.8,
        ease: 'elastic.out(1, 0.6)'
      });

      // Form animation - scale from small and slide up
      gsap.fromTo(formRef.current, {
        scale: 0.5,
        opacity: 0,
        y: 60
      }, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: 'back.out(1.7)',
        delay: 0.3
      });

      // Form sections stagger animation - grow from tiny
      gsap.fromTo('.form-section', {
        scale: 0.2,
        opacity: 0,
        y: 30
      }, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.8)',
        stagger: 0.15,
        delay: 0.8
      });

      // Skill tags animation - grow from tiny
      gsap.fromTo('.skill-tag', {
        scale: 0.1,
        opacity: 0,
        rotation: 180
      }, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.7)',
        stagger: 0.08,
        delay: 1.5
      });

      // Floating decorations - always visible with proper opacity
      gsap.set('.post-job-decoration', { opacity: 1 });
      gsap.to('.post-job-decoration', {
        y: -12,
        x: 6,
        rotation: 360,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });

      // Preview animation when toggled
      if (showPreview && previewRef.current) {
        gsap.fromTo(previewRef.current, {
          scale: 0.7,
          opacity: 0,
          x: 30
        }, {
          scale: 1,
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'back.out(1.7)'
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, [showPreview]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Job posted:', formData);
    
    // Show success animation
    gsap.to('.submit-btn', {
      scale: 1.1,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out'
    });
    
    // Navigate after delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div ref={containerRef} className={`min-h-screen bg-gradient-to-br ${isDark ? 'from-gray-900 to-black' : 'from-gray-50 to-white'} relative`}>
      {/* Decorative elements - Fixed colors with proper opacity */}
      <div className="post-job-decoration absolute top-16 right-24 w-4 h-4 bg-asu-gold rounded-full opacity-40"></div>
      <div className="post-job-decoration absolute top-32 left-16 w-3 h-3 bg-asu-maroon rounded-full opacity-30"></div>
      <Sparkles className="post-job-decoration absolute top-24 left-1/4 h-5 w-5 text-asu-gold opacity-60" />
      <Coffee className="post-job-decoration absolute bottom-32 right-1/4 h-4 w-4 text-asu-maroon opacity-50" />
      <Heart className="post-job-decoration absolute bottom-20 left-1/3 h-4 w-4 text-asu-gold opacity-70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div ref={headerRef} className="mb-12">
          <div className={`bg-gradient-to-r ${isDark ? 'from-asu-maroon-dark to-asu-maroon' : 'from-asu-maroon to-asu-maroon-dark'} rounded-3xl p-8 text-white relative overflow-hidden transform`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4 relative">
                Post a New Job 
                <div className="absolute -top-3 -right-8 w-6 h-6 bg-asu-gold rounded-full animate-pulse"></div>
              </h1>
              <p className="text-xl text-white/90 mb-6 max-w-3xl">
                Find the perfect candidates for your team. Create a compelling job posting that attracts top talent ✨
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 transform rotate-1">
                  <TrendingUp className="h-5 w-5" />
                  <span>95% job fill rate 📈</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 transform -rotate-1">
                  <Users className="h-5 w-5" />
                  <span>50,000+ active students 👥</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 transform rotate-0.5">
                  <Star className="h-5 w-5" />
                  <span>Top quality candidates 🌟</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              {/* Job Details Section */}
              <div className={`form-section rounded-3xl shadow-lg border p-8 transition-colors duration-300 ${
                isDark ? 'bg-dark-surface border-lime/20' : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h2 className={`text-2xl font-bold transition-colors ${
                    isDark ? 'text-dark-text' : 'text-gray-900'
                  }`}>Job Details 📋</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent shadow-inner transition-all duration-200 hover:shadow-md ${
                        isDark 
                          ? 'border-lime/30 bg-dark-bg text-dark-text placeholder-dark-muted focus:ring-lime' 
                          : 'border-gray-200 bg-white text-gray-900 focus:ring-asu-maroon'
                      }`}
                      placeholder="e.g., Software Engineering Intern"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Company *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent shadow-inner transition-all duration-200 hover:shadow-md ${
                        isDark 
                          ? 'border-lime/30 bg-dark-bg text-dark-text placeholder-dark-muted focus:ring-lime' 
                          : 'border-gray-200 bg-white text-gray-900 focus:ring-asu-maroon'
                      }`}
                      placeholder="Your Company Name"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent shadow-inner transition-all duration-200 hover:shadow-md ${
                        isDark 
                          ? 'border-lime/30 bg-dark-bg text-dark-text placeholder-dark-muted focus:ring-lime' 
                          : 'border-gray-200 bg-white text-gray-900 focus:ring-asu-maroon'
                      }`}
                      placeholder="e.g., Phoenix, AZ or Remote"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Job Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent shadow-inner cursor-pointer hover:shadow-md transition-all duration-200 ${
                        isDark 
                          ? 'border-lime/30 bg-dark-bg text-dark-text focus:ring-lime' 
                          : 'border-gray-200 bg-white text-gray-900 focus:ring-asu-maroon'
                      }`}
                    >
                      <option value="full-time">Full-time 💼</option>
                      <option value="part-time">Part-time ⏰</option>
                      <option value="internship">Internship 🎓</option>
                      <option value="contract">Contract 📝</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Experience Level
                    </label>
                    <select
                      name="experience_level"
                      value={formData.experience_level}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent shadow-inner cursor-pointer hover:shadow-md transition-all duration-200 ${
                        isDark 
                          ? 'border-lime/30 bg-dark-bg text-dark-text focus:ring-lime' 
                          : 'border-gray-200 bg-white text-gray-900 focus:ring-asu-maroon'
                      }`}
                    >
                      <option value="entry">Entry Level 🌱</option>
                      <option value="mid">Mid Level 📈</option>
                      <option value="senior">Senior Level 🏆</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Salary Range
                    </label>
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent shadow-inner transition-all duration-200 hover:shadow-md ${
                        isDark 
                          ? 'border-lime/30 bg-dark-bg text-dark-text placeholder-dark-muted focus:ring-lime' 
                          : 'border-gray-200 bg-white text-gray-900 focus:ring-asu-maroon'
                      }`}
                      placeholder="e.g., $60,000 - $80,000 or $25/hour"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="is_remote"
                      checked={formData.is_remote}
                      onChange={handleInputChange}
                      className={`w-5 h-5 rounded border-2 focus:ring-2 ${
                        isDark 
                          ? 'text-lime border-lime/30 focus:ring-lime' 
                          : 'text-asu-maroon border-gray-300 focus:ring-asu-maroon'
                      }`}
                    />
                    <span className={`text-sm font-medium transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Remote work available 💻
                    </span>
                  </label>
                </div>
              </div>

              {/* Description Section */}
              <div className={`form-section rounded-3xl shadow-lg border p-8 transition-colors duration-300 ${
                isDark ? 'bg-dark-surface border-lime/20' : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h2 className={`text-2xl font-bold transition-colors ${
                    isDark ? 'text-dark-text' : 'text-gray-900'
                  }`}>Job Description 📝</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Job Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent shadow-inner transition-all duration-200 hover:shadow-md resize-none ${
                        isDark 
                          ? 'border-lime/30 bg-dark-bg text-dark-text placeholder-dark-muted focus:ring-lime' 
                          : 'border-gray-200 bg-white text-gray-900 focus:ring-asu-maroon'
                      }`}
                      placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Requirements *
                    </label>
                    <textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent shadow-inner transition-all duration-200 hover:shadow-md resize-none ${
                        isDark 
                          ? 'border-lime/30 bg-dark-bg text-dark-text placeholder-dark-muted focus:ring-lime' 
                          : 'border-gray-200 bg-white text-gray-900 focus:ring-asu-maroon'
                      }`}
                      placeholder="List the required qualifications, skills, and experience..."
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Benefits & Perks
                    </label>
                    <textarea
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent shadow-inner transition-all duration-200 hover:shadow-md resize-none ${
                        isDark 
                          ? 'border-lime/30 bg-dark-bg text-dark-text placeholder-dark-muted focus:ring-lime' 
                          : 'border-gray-200 bg-white text-gray-900 focus:ring-asu-maroon'
                      }`}
                      placeholder="Health insurance, flexible hours, learning opportunities..."
                    />
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className={`form-section rounded-3xl shadow-lg border p-8 transition-colors duration-300 ${
                isDark ? 'bg-dark-surface border-lime/20' : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <h2 className={`text-2xl font-bold transition-colors ${
                    isDark ? 'text-dark-text' : 'text-gray-900'
                  }`}>Required Skills ⚡</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className={`flex-1 px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent shadow-inner transition-all duration-200 hover:shadow-md ${
                        isDark 
                          ? 'border-lime/30 bg-dark-bg text-dark-text placeholder-dark-muted focus:ring-lime' 
                          : 'border-gray-200 bg-white text-gray-900 focus:ring-asu-maroon'
                      }`}
                      placeholder="Add a skill (e.g., JavaScript, Python, React...)"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className={`px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md transform hover:scale-105 ${
                        isDark 
                          ? 'bg-gradient-to-r from-lime to-dark-accent text-dark-surface' 
                          : 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white'
                      }`}
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`skill-tag px-4 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 ${
                          isDark 
                            ? 'bg-gradient-to-r from-lime to-dark-accent text-dark-surface' 
                            : 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white'
                        }`}
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-red-200 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className={`form-section rounded-3xl shadow-lg border p-8 transition-colors duration-300 ${
                isDark ? 'bg-dark-surface border-lime/20' : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <h2 className={`text-2xl font-bold transition-colors ${
                    isDark ? 'text-dark-text' : 'text-gray-900'
                  }`}>Additional Details 📅</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent shadow-inner transition-all duration-200 hover:shadow-md ${
                        isDark 
                          ? 'border-lime/30 bg-dark-bg text-dark-text focus:ring-lime' 
                          : 'border-gray-200 bg-white text-gray-900 focus:ring-asu-maroon'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent shadow-inner transition-all duration-200 hover:shadow-md ${
                        isDark 
                          ? 'border-lime/30 bg-dark-bg text-dark-text placeholder-dark-muted focus:ring-lime' 
                          : 'border-gray-200 bg-white text-gray-900 focus:ring-asu-maroon'
                      }`}
                      placeholder="hiring@company.com"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-semibold mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent shadow-inner transition-all duration-200 hover:shadow-md ${
                        isDark 
                          ? 'border-lime/30 bg-dark-bg text-dark-text placeholder-dark-muted focus:ring-lime' 
                          : 'border-gray-200 bg-white text-gray-900 focus:ring-asu-maroon'
                      }`}
                      placeholder="e.g., Engineering, Marketing, Sales..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className={`flex items-center space-x-2 border-2 px-8 py-4 rounded-2xl transition-all duration-300 font-semibold shadow-sm hover:shadow-md transform hover:scale-105 ${
                    isDark 
                      ? 'border-lime text-lime hover:bg-lime hover:text-dark-surface' 
                      : 'border-asu-maroon text-asu-maroon hover:bg-asu-maroon hover:text-white'
                  }`}
                >
                  <Eye className="h-5 w-5" />
                  <span>{showPreview ? 'Hide Preview' : 'Preview Job'}</span>
                </button>
                
                <button
                  type="submit"
                  className={`submit-btn flex items-center space-x-2 px-8 py-4 rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold shadow-lg transform hover:scale-105 ${
                    isDark 
                      ? 'bg-gradient-to-r from-lime to-dark-accent text-dark-surface' 
                      : 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white'
                  }`}
                >
                  <Save className="h-5 w-5" />
                  <span>Post Job 🚀</span>
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Tips */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-[#fc8c03] rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Tips for Success 💡</h3>
              </div>
              
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Write a clear, compelling job title that accurately reflects the role</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Include salary range to attract quality candidates</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Be specific about required skills and experience</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Highlight unique benefits and company culture</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Use keywords that candidates search for</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Platform Stats 📊</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Students</span>
                  <span className="font-bold text-asu-maroon">50,000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Companies Hiring</span>
                  <span className="font-bold text-asu-maroon">2,500+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Jobs Posted</span>
                  <span className="font-bold text-asu-maroon">15,000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-bold text-asu-maroon">95%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div ref={previewRef} className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Job Preview</h2>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                {/* Job Preview Content */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{formData.title || 'Job Title'}</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Building2 className="h-4 w-4" />
                        <span>{formData.company || 'Company Name'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{formData.location || 'Location'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formData.type || 'Job Type'}</span>
                      </div>
                      {formData.salary && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{formData.salary}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {formData.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{formData.description}</p>
                    </div>
                  )}
                  
                  {formData.requirements && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{formData.requirements}</p>
                    </div>
                  )}
                  
                  {formData.skills.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-asu-maroon text-white px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {formData.benefits && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{formData.benefits}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}