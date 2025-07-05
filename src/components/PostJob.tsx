import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Close,
  Work,
  Schedule
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Typography from './ui/Typography';
import Input from './ui/Input';
import Button from './ui/Button';
import { Card } from './ui/Card';
import Select from './ui/Select';

export default function PostJob() {
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
    <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <Typography variant="h4" className="font-medium mb-2">
            Post a Job
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Create a compelling job posting to attract top talent from ASU's student body.
          </Typography>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6" elevation={1}>
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-lime/10 text-lime' : 'bg-asu-maroon/10 text-asu-maroon'
              }`}>
                <People className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <Typography variant="h5" className="font-semibold">
                  50,000+
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Active Students
                </Typography>
              </div>
            </div>
          </Card>

          <Card className="p-6" elevation={1}>
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
              }`}>
                <Business className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <Typography variant="h5" className="font-semibold">
                  2,500+
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Companies
                </Typography>
              </div>
            </div>
          </Card>

          <Card className="p-6" elevation={1}>
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'
              }`}>
                <Work className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <Typography variant="h5" className="font-semibold">
                  15,000+
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Jobs Posted
                </Typography>
              </div>
            </div>
          </Card>

          <Card className="p-6" elevation={1}>
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'
              }`}>
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <Typography variant="h5" className="font-semibold">
                  95%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Success Rate
                </Typography>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Job Details Section */}
              <Card className="p-6" elevation={1}>
                <Typography variant="h6" className="font-medium mb-6">
                  Job Details
                </Typography>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                
                <div className="mt-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_remote"
                      checked={formData.is_remote}
                      onChange={handleInputChange}
                      className={`w-4 h-4 rounded border-2 focus:ring-2 ${
                        isDark 
                          ? 'text-lime border-lime/30 focus:ring-lime' 
                          : 'text-asu-maroon border-gray-300 focus:ring-asu-maroon'
                      }`}
                    />
                    <Typography variant="body2" className="font-medium">
                      Remote work available
                    </Typography>
                  </label>
                </div>
              </Card>

              {/* Description Section */}
              <Card className="p-6" elevation={1}>
                <Typography variant="h6" className="font-medium mb-6">
                  Job Description
                </Typography>
                
                <div className="space-y-4">
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
              <Card className="p-6" elevation={1}>
                <Typography variant="h6" className="font-medium mb-6">
                  Required Skills
                </Typography>
                
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
                      className="px-4"
                    >
                      <Add className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        onClick={() => removeSkill(skill)}
                        className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                          isDark 
                            ? 'bg-lime/10 text-lime hover:bg-lime/20' 
                            : 'bg-asu-maroon/10 text-asu-maroon hover:bg-asu-maroon/20'
                        }`}
                      >
                        {skill} ×
                      </span>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Additional Details */}
              <Card className="p-6" elevation={1}>
                <Typography variant="h6" className="font-medium mb-6">
                  Additional Details
                </Typography>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Card className="p-6" elevation={1}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="button"
                    variant="outlined"
                    color="primary"
                    size="large"
                    startIcon={<Visibility />}
                    onClick={() => setShowPreview(!showPreview)}
                    fullWidth
                  >
                    {showPreview ? 'Hide Preview' : 'Preview Job'}
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<Save />}
                    fullWidth
                  >
                    Post Job
                  </Button>
                </div>
              </Card>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Tips Card */}
            <Card className="p-6" elevation={1}>
              <Typography variant="h6" className="font-medium mb-4">
                Tips for Success
              </Typography>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`} />
                  <Typography variant="body2" color="textSecondary">
                    Write a clear, compelling job title that accurately reflects the role
                  </Typography>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`} />
                  <Typography variant="body2" color="textSecondary">
                    Include salary range to attract quality candidates
                  </Typography>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`} />
                  <Typography variant="body2" color="textSecondary">
                    Be specific about required skills and experience
                  </Typography>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`} />
                  <Typography variant="body2" color="textSecondary">
                    Highlight unique benefits and company culture
                  </Typography>
                </div>
              </div>
            </Card>

            {/* Platform Stats */}
            <Card className="p-6" elevation={1}>
              <Typography variant="h6" className="font-medium mb-4">
                Platform Reach
              </Typography>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Typography variant="body2" color="textSecondary">
                    Active Students
                  </Typography>
                  <Typography variant="body2" className="font-semibold">
                    50,000+
                  </Typography>
                </div>
                <div className="flex justify-between items-center">
                  <Typography variant="body2" color="textSecondary">
                    Companies Hiring
                  </Typography>
                  <Typography variant="body2" className="font-semibold">
                    2,500+
                  </Typography>
                </div>
                <div className="flex justify-between items-center">
                  <Typography variant="body2" color="textSecondary">
                    Average Applications
                  </Typography>
                  <Typography variant="body2" className="font-semibold">
                    47 per job
                  </Typography>
                </div>
                <div className="flex justify-between items-center">
                  <Typography variant="body2" color="textSecondary">
                    Hire Success Rate
                  </Typography>
                  <Typography variant="body2" className="font-semibold">
                    95%
                  </Typography>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" elevation={3}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <Typography variant="h5" className="font-medium">
                    Job Preview
                  </Typography>
                  <Button
                    variant="text"
                    onClick={() => setShowPreview(false)}
                    className="min-w-0 p-2"
                  >
                    <Close className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Job Preview Content */}
                <div className="space-y-6">
                  <div className={`border-b pb-6 ${
                    isDark ? 'border-gray-600' : 'border-gray-200'
                  }`}>
                    <Typography variant="h4" className="font-medium mb-3">
                      {formData.title || 'Job Title'}
                    </Typography>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {formData.company && (
                        <div className="flex items-center space-x-1">
                          <Business className="h-4 w-4" />
                          <span>{formData.company}</span>
                        </div>
                      )}
                      {formData.location && (
                        <div className="flex items-center space-x-1">
                          <LocationOn className="h-4 w-4" />
                          <span>{formData.location}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Work className="h-4 w-4" />
                        <span className="capitalize">{formData.type.replace('-', ' ')}</span>
                      </div>
                      {formData.salary && (
                        <div className="flex items-center space-x-1">
                          <AttachMoney className="h-4 w-4" />
                          <span>{formData.salary}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {formData.description && (
                    <div>
                      <Typography variant="h6" className="font-medium mb-3">
                        Job Description
                      </Typography>
                      <Typography variant="body1" color="textSecondary" className="whitespace-pre-wrap">
                        {formData.description}
                      </Typography>
                    </div>
                  )}
                  
                  {formData.requirements && (
                    <div>
                      <Typography variant="h6" className="font-medium mb-3">
                        Requirements
                      </Typography>
                      <Typography variant="body1" color="textSecondary" className="whitespace-pre-wrap">
                        {formData.requirements}
                      </Typography>
                    </div>
                  )}
                  
                  {formData.skills.length > 0 && (
                    <div>
                      <Typography variant="h6" className="font-medium mb-3">
                        Required Skills
                      </Typography>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              isDark ? 'bg-lime/10 text-lime' : 'bg-asu-maroon/10 text-asu-maroon'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {formData.benefits && (
                    <div>
                      <Typography variant="h6" className="font-medium mb-3">
                        Benefits
                      </Typography>
                      <Typography variant="body1" color="textSecondary" className="whitespace-pre-wrap">
                        {formData.benefits}
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}