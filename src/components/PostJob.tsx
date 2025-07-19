import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save,
  Eye,
  MapPin,
  DollarSign,
  Briefcase,
  Building2,
  Users,
  Clock,
  Mail,
  TrendingUp,
  Hash,
  X as XIcon,
  Plus,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';
import Input from './ui/Input';
import PageLayout from './ui/PageLayout';
import { cn } from '../lib/cva';

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

  return (
    <PageLayout 
      className={isDark ? 'bg-black text-white' : 'bg-white text-black'}
      maxWidth="4xl"
      padding="none"
    >
      {/* X-Style Header */}
      <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${
        isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-xl font-bold">Post a Job</h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Reach 50,000+ talented students
            </p>
          </div>
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <XIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 max-w-2xl mx-auto border-x border-gray-800 dark:border-gray-200">
          {/* Stats Banner */}
          <div className={`border-b p-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-500">50K+</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Students</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">2.5K+</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Companies</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-500">47</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Apps</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">92%</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Success</div>
              </div>
            </div>
          </div>

          {/* Job Form */}
          <form onSubmit={handleSubmit} className="divide-y divide-gray-800 dark:divide-gray-200">
            
            {/* Job Title */}
            <div className={`border-b p-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-blue-500" />
                  <label className="font-medium">Job Title</label>
                </div>
                <textarea
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="What's the role?"
                  rows={1}
                  className={`w-full text-xl font-semibold bg-transparent border-none outline-none resize-none placeholder-gray-400 ${
                    isDark ? 'text-white' : 'text-black'
                  }`}
                  style={{ minHeight: '28px' }}
                />
              </div>
            </div>

            {/* Company & Location */}
            <div className={`border-b p-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-green-500" />
                    <label className="font-medium">Company</label>
                  </div>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    placeholder="Company name"
                    className={`w-full bg-transparent border-none outline-none text-lg ${
                      isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
                    }`}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-red-500" />
                    <label className="font-medium">Location</label>
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="City, State or Remote"
                    className={`w-full bg-transparent border-none outline-none text-lg ${
                      isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Job Type & Salary */}
            <div className={`border-b p-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <label className="font-medium">Job Type</label>
                  </div>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`w-full bg-transparent border-none outline-none text-lg ${
                      isDark ? 'text-white' : 'text-black'
                    }`}
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-yellow-500" />
                    <label className="font-medium">Salary</label>
                  </div>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="$60k-80k or $25/hour"
                    className={`w-full bg-transparent border-none outline-none text-lg ${
                      isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
                    }`}
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_remote"
                    checked={formData.is_remote}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-2 text-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="font-medium">Remote work available</span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className={`border-b p-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-pink-500" />
                  <label className="font-medium">What makes this role exciting?</label>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                  rows={4}
                  className={`w-full bg-transparent border-none outline-none resize-none text-lg ${
                    isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
                  }`}
                />
              </div>
            </div>

            {/* Requirements */}
            <div className={`border-b p-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Hash className="h-5 w-5 text-orange-500" />
                  <label className="font-medium">Requirements</label>
                </div>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  required
                  placeholder="List the required qualifications, skills, and experience..."
                  rows={4}
                  className={`w-full bg-transparent border-none outline-none resize-none text-lg ${
                    isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
                  }`}
                />
              </div>
            </div>

            {/* Skills */}
            <div className={`border-b p-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-indigo-500" />
                  <label className="font-medium">Required Skills</label>
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add a skill..."
                    className={`flex-1 bg-transparent border-none outline-none text-lg ${
                      isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
                    }`}
                  />
                  <Button
                    type="button"
                    onClick={addSkill}
                    variant="ghost"
                    size="sm"
                    className="p-2"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        isDark 
                          ? 'bg-blue-900 text-blue-200 hover:bg-blue-800' 
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      {skill} ×
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className={`border-b p-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  <label className="font-medium">Benefits & Perks</label>
                </div>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  placeholder="Health insurance, flexible hours, learning opportunities..."
                  rows={3}
                  className={`w-full bg-transparent border-none outline-none resize-none text-lg ${
                    isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
                  }`}
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className={`border-b p-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-cyan-500" />
                      <label className="font-medium">Application Deadline</label>
                    </div>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className={`w-full bg-transparent border-none outline-none text-lg ${
                        isDark ? 'text-white' : 'text-black'
                      }`}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-pink-500" />
                      <label className="font-medium">Contact Email</label>
                    </div>
                    <input
                      type="email"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleInputChange}
                      required
                      placeholder="hiring@company.com"
                      className={`w-full bg-transparent border-none outline-none text-lg ${
                        isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="p-4">
              <div className="space-y-4">
                
                {/* Tips */}
                <div className={`rounded-2xl p-4 ${
                  isDark ? 'bg-gray-900' : 'bg-gray-100'
                }`}>
                  <h3 className="font-bold mb-3 flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Tips for Success</span>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className={`flex items-start space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span>•</span>
                      <span>Include salary range to attract quality candidates</span>
                    </div>
                    <div className={`flex items-start space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span>•</span>
                      <span>Be specific about required skills and experience</span>
                    </div>
                    <div className={`flex items-start space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span>•</span>
                      <span>Highlight unique benefits and company culture</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex-1 py-3 rounded-full font-bold"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Preview
                  </Button>
                  <Button
                    type="submit"
                    className={`flex-1 py-3 rounded-full font-bold ${
                      isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Post job
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl ${
            isDark ? 'bg-black border border-gray-800' : 'bg-white border border-gray-200'
          }`}>
            
            {/* Preview Header */}
            <div className={`sticky top-0 backdrop-blur-xl border-b p-4 flex items-center justify-between ${
              isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
            }`}>
              <h2 className="text-xl font-bold">Preview</h2>
              <Button
                onClick={() => setShowPreview(false)}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                <XIcon className="h-5 w-5" />
              </Button>
            </div>

            {/* Preview Content */}
            <div className="p-6 space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-3">
                  {formData.title || 'Job Title'}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  {formData.company && (
                    <div className="flex items-center space-x-1">
                      <Building2 className="h-4 w-4" />
                      <span>{formData.company}</span>
                    </div>
                  )}
                  {formData.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{formData.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Briefcase className="h-4 w-4" />
                    <span className="capitalize">{formData.type.replace('-', ' ')}</span>
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
                  <h3 className="font-bold mb-2">Job Description</h3>
                  <p className={`whitespace-pre-wrap ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {formData.description}
                  </p>
                </div>
              )}
              
              {formData.requirements && (
                <div>
                  <h3 className="font-bold mb-2">Requirements</h3>
                  <p className={`whitespace-pre-wrap ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {formData.requirements}
                  </p>
                </div>
              )}
              
              {formData.skills.length > 0 && (
                <div>
                  <h3 className="font-bold mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
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
                  <h3 className="font-bold mb-2">Benefits</h3>
                  <p className={`whitespace-pre-wrap ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {formData.benefits}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}