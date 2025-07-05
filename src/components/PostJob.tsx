import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  Save, 
  Add, 
  Visibility, 
  LocationOn, 
  Business, 
  AttachMoney, 
  CalendarToday, 
  Description, 
  People, 
  CheckCircle,
  AutoAwesome,
  LocalCafe,
  Favorite,
  Bolt,
  Star,
  TrendingUp,
  EmojiEvents,
  Close,
  Work
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Typography from './ui/Typography';
import Input from './ui/Input';
import Button from './ui/Button';
import { Card } from './ui/Card';
import Badge from './ui/Badge';
import Select from './ui/Select';

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
      // Material Design entrance animations
      gsap.fromTo('.post-job-header', {
        opacity: 0,
        y: -30,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out'
      });

      gsap.fromTo('.form-section', {
        opacity: 0,
        y: 20,
        scale: 0.98
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        delay: 0.3
      });

      gsap.fromTo('.skill-chip', {
        opacity: 0,
        scale: 0.8,
        y: 10
      }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: 'back.out(1.7)',
        stagger: 0.05,
        delay: 0.6
      });

      // Floating decorations
      gsap.to('.post-job-decoration', {
        y: -10,
        x: 5,
        rotation: 180,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

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
    console.log('Job posted:', formData);
    navigate('/dashboard');
  };

  const jobTypeOptions = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'internship', label: 'Internship' },
    { value: 'contract', label: 'Contract' }
  ];

  const experienceLevelOptions = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' }
  ];

  return (
    <div ref={containerRef} className={`min-h-screen relative ${
      isDark ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      {/* Decorative elements */}
      <div className={`post-job-decoration absolute top-16 right-24 w-4 h-4 rounded-full ${
        isDark ? 'bg-lime/30' : 'bg-asu-gold/40'
      }`}></div>
      <AutoAwesome className={`post-job-decoration absolute top-24 left-1/4 h-5 w-5 ${
        isDark ? 'text-lime/60' : 'text-asu-gold/60'
      }`} />
      <LocalCafe className={`post-job-decoration absolute bottom-32 right-1/4 h-4 w-4 ${
        isDark ? 'text-dark-accent/50' : 'text-asu-maroon/50'
      }`} />
      <Favorite className={`post-job-decoration absolute bottom-20 left-1/3 h-4 w-4 ${
        isDark ? 'text-lime/70' : 'text-asu-gold/70'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="post-job-header mb-12">
          <Card className="overflow-hidden" elevation={2}>
            <div className={`p-8 text-white relative ${
              isDark 
                ? 'bg-gradient-to-r from-dark-surface to-dark-bg' 
                : 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark'
            }`}>
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl ${
                isDark ? 'bg-lime/10' : 'bg-white/10'
              }`}></div>
              <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full blur-xl ${
                isDark ? 'bg-dark-accent/20' : 'bg-asu-gold/20'
              }`}></div>
              
              <div className="relative z-10">
                <Typography variant="h3" className="font-bold mb-4 text-white">
                  Post a New Job
                </Typography>
                <Typography variant="subtitle1" className={`max-w-3xl ${
                  isDark ? 'text-dark-muted' : 'text-white/90'
                }`}>
                  Find the perfect candidates for your team. Create a compelling job posting that attracts top talent
                </Typography>
                
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-sm">95% job fill rate</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <People className="h-5 w-5" />
                    <span className="text-sm">50,000+ active students</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Star className="h-5 w-5" />
                    <span className="text-sm">Top quality candidates</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              {/* Job Details Section */}
              <Card className="form-section p-8" elevation={2}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-lime/20' : 'bg-asu-maroon/10'
                  }`}>
                    <Description className={`h-5 w-5 ${
                      isDark ? 'text-lime' : 'text-asu-maroon'
                    }`} />
                  </div>
                  <Typography variant="h5" color="textPrimary" className="font-bold">
                    Job Details
                  </Typography>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Job Title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Software Engineering Intern"
                    variant="outlined"
                    fullWidth
                  />
                  
                  <Input
                    label="Company"
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    placeholder="Your Company Name"
                    variant="outlined"
                    fullWidth
                    startIcon={<Business />}
                  />
                  
                  <Input
                    label="Location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Phoenix, AZ or Remote"
                    variant="outlined"
                    fullWidth
                    startIcon={<LocationOn />}
                  />
                  
                  <Select
                    label="Job Type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    options={jobTypeOptions}
                    required
                    variant="outlined"
                    fullWidth
                  />
                  
                  <Select
                    label="Experience Level"
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleInputChange}
                    options={experienceLevelOptions}
                    variant="outlined"
                    fullWidth
                  />
                  
                  <Input
                    label="Salary Range"
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g., $60,000 - $80,000 or $25/hour"
                    variant="outlined"
                    fullWidth
                    startIcon={<AttachMoney />}
                  />
                </div>
                
                <div className="mt-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
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
                    <Typography variant="body2" color="textPrimary" className="font-medium">
                      Remote work available
                    </Typography>
                  </label>
                </div>
              </Card>

              {/* Description Section */}
              <Card className="form-section p-8" elevation={2}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-lime/20' : 'bg-asu-maroon/10'
                  }`}>
                    <Description className={`h-5 w-5 ${
                      isDark ? 'text-lime' : 'text-asu-maroon'
                    }`} />
                  </div>
                  <Typography variant="h5" color="textPrimary" className="font-bold">
                    Job Description
                  </Typography>
                </div>
                
                <div className="space-y-6">
                  <Input
                    label="Job Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    multiline
                    rows={6}
                    placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                    variant="outlined"
                    fullWidth
                  />
                  
                  <Input
                    label="Requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    required
                    multiline
                    rows={4}
                    placeholder="List the required qualifications, skills, and experience..."
                    variant="outlined"
                    fullWidth
                  />
                  
                  <Input
                    label="Benefits & Perks"
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    placeholder="Health insurance, flexible hours, learning opportunities..."
                    variant="outlined"
                    fullWidth
                  />
                </div>
              </Card>

              {/* Skills Section */}
              <Card className="form-section p-8" elevation={2}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-lime/20' : 'bg-asu-maroon/10'
                  }`}>
                    <Bolt className={`h-5 w-5 ${
                      isDark ? 'text-lime' : 'text-asu-maroon'
                    }`} />
                  </div>
                  <Typography variant="h5" color="textPrimary" className="font-bold">
                    Required Skills
                  </Typography>
                </div>
                
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="Add a skill (e.g., JavaScript, Python, React...)"
                      variant="outlined"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={addSkill}
                      size="large"
                      className="px-6"
                    >
                      <Add />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        className="skill-chip cursor-pointer"
                        variant="filled"
                        color="primary"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Additional Details */}
              <Card className="form-section p-8" elevation={2}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-lime/20' : 'bg-asu-maroon/10'
                  }`}>
                    <CalendarToday className={`h-5 w-5 ${
                      isDark ? 'text-lime' : 'text-asu-maroon'
                    }`} />
                  </div>
                  <Typography variant="h5" color="textPrimary" className="font-bold">
                    Additional Details
                  </Typography>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Application Deadline"
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                  />
                  
                  <Input
                    label="Contact Email"
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    required
                    placeholder="hiring@company.com"
                    variant="outlined"
                    fullWidth
                  />
                  
                  <Input
                    label="Department"
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g., Engineering, Marketing, Sales..."
                    variant="outlined"
                    fullWidth
                    className="md:col-span-2"
                  />
                </div>
              </Card>

              {/* Submit Buttons */}
              <div className="flex justify-center space-x-4">
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={Visibility}
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-8"
                >
                  {showPreview ? 'Hide Preview' : 'Preview Job'}
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={Save}
                  className="px-8"
                >
                  Post Job
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Tips Card */}
            <Card className="p-6" elevation={2}>
              <div className="flex items-center space-x-3 mb-6">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-lime/20' : 'bg-asu-maroon/10'
                }`}>
                  <EmojiEvents className={`h-5 w-5 ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`} />
                </div>
                <Typography variant="h6" color="textPrimary" className="font-bold">
                  Tips for Success
                </Typography>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                    isDark ? 'text-lime' : 'text-green-500'
                  }`} />
                  <Typography variant="body2" color="textSecondary">
                    Write a clear, compelling job title that accurately reflects the role
                  </Typography>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                    isDark ? 'text-lime' : 'text-green-500'
                  }`} />
                  <Typography variant="body2" color="textSecondary">
                    Include salary range to attract quality candidates
                  </Typography>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                    isDark ? 'text-lime' : 'text-green-500'
                  }`} />
                  <Typography variant="body2" color="textSecondary">
                    Be specific about required skills and experience
                  </Typography>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                    isDark ? 'text-lime' : 'text-green-500'
                  }`} />
                  <Typography variant="body2" color="textSecondary">
                    Highlight unique benefits and company culture
                  </Typography>
                </div>
              </div>
            </Card>

            {/* Stats Card */}
            <Card className="p-6" elevation={2}>
              <Typography variant="h6" color="textPrimary" className="font-bold mb-6">
                Platform Stats
              </Typography>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Typography variant="body2" color="textSecondary">
                    Active Students
                  </Typography>
                  <Typography variant="body2" color="primary" className="font-bold">
                    50,000+
                  </Typography>
                </div>
                <div className="flex justify-between items-center">
                  <Typography variant="body2" color="textSecondary">
                    Companies Hiring
                  </Typography>
                  <Typography variant="body2" color="primary" className="font-bold">
                    2,500+
                  </Typography>
                </div>
                <div className="flex justify-between items-center">
                  <Typography variant="body2" color="textSecondary">
                    Jobs Posted
                  </Typography>
                  <Typography variant="body2" color="primary" className="font-bold">
                    15,000+
                  </Typography>
                </div>
                <div className="flex justify-between items-center">
                  <Typography variant="body2" color="textSecondary">
                    Success Rate
                  </Typography>
                  <Typography variant="body2" color="primary" className="font-bold">
                    95%
                  </Typography>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card ref={previewRef} className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8" elevation={4}>
              <div className="flex justify-between items-center mb-6">
                <Typography variant="h4" color="textPrimary" className="font-bold">
                  Job Preview
                </Typography>
                <Button
                  variant="text"
                  onClick={() => setShowPreview(false)}
                  size="small"
                  className="p-2"
                >
                  <Close />
                </Button>
              </div>
              
              {/* Job Preview Content */}
              <div className="space-y-6">
                <div className={`border-b pb-6 ${
                  isDark ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <Typography variant="h3" color="textPrimary" className="font-bold mb-2">
                    {formData.title || 'Job Title'}
                  </Typography>
                  <div className="flex flex-wrap gap-4">
                    {formData.company && (
                      <div className="flex items-center space-x-1">
                        <Business className="h-4 w-4" />
                        <Typography variant="body2" color="textSecondary">
                          {formData.company}
                        </Typography>
                      </div>
                    )}
                    {formData.location && (
                      <div className="flex items-center space-x-1">
                        <LocationOn className="h-4 w-4" />
                        <Typography variant="body2" color="textSecondary">
                          {formData.location}
                        </Typography>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Work className="h-4 w-4" />
                      <Typography variant="body2" color="textSecondary">
                        {formData.type}
                      </Typography>
                    </div>
                    {formData.salary && (
                      <div className="flex items-center space-x-1">
                        <AttachMoney className="h-4 w-4" />
                        <Typography variant="body2" color="textSecondary">
                          {formData.salary}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>
                
                {formData.description && (
                  <div>
                    <Typography variant="h6" color="textPrimary" className="font-semibold mb-3">
                      Job Description
                    </Typography>
                    <Typography variant="body1" color="textSecondary" className="whitespace-pre-wrap">
                      {formData.description}
                    </Typography>
                  </div>
                )}
                
                {formData.requirements && (
                  <div>
                    <Typography variant="h6" color="textPrimary" className="font-semibold mb-3">
                      Requirements
                    </Typography>
                    <Typography variant="body1" color="textSecondary" className="whitespace-pre-wrap">
                      {formData.requirements}
                    </Typography>
                  </div>
                )}
                
                {formData.skills.length > 0 && (
                  <div>
                    <Typography variant="h6" color="textPrimary" className="font-semibold mb-3">
                      Required Skills
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="filled"
                          color="primary"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {formData.benefits && (
                  <div>
                    <Typography variant="h6" color="textPrimary" className="font-semibold mb-3">
                      Benefits
                    </Typography>
                    <Typography variant="body1" color="textSecondary" className="whitespace-pre-wrap">
                      {formData.benefits}
                    </Typography>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}