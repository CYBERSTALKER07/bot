import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PostJob() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [jobData, setJobData] = useState({
    title: '',
    type: 'internship' as 'internship' | 'full-time' | 'part-time',
    location: '',
    salary: '',
    description: '',
    requirements: [''],
    skills: [] as string[],
    deadline: ''
  });

  const [skillInput, setSkillInput] = useState('');

  const addRequirement = () => {
    setJobData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setJobData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const removeRequirement = (index: number) => {
    setJobData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !jobData.skills.includes(skillInput.trim())) {
      setJobData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setJobData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate form
    if (!jobData.title || !jobData.description || !jobData.location) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Filter out empty requirements
    const filteredRequirements = jobData.requirements.filter(req => req.trim() !== '');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, save to Supabase
      console.log('Job posting data:', {
        ...jobData,
        requirements: filteredRequirements,
        employer_id: user?.id
      });

      alert('Job posted successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const jobTypes = [
    { value: 'internship', label: 'Internship' },
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' }
  ];

  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'Git',
    'TypeScript', 'HTML/CSS', 'AWS', 'Docker', 'Machine Learning',
    'Data Analysis', 'Project Management', 'Communication', 'Leadership'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
        <p className="text-gray-600">Create a job posting to attract talented ASU students</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-8 space-y-8">
        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={jobData.title}
                onChange={(e) => setJobData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                placeholder="e.g., Software Engineering Intern"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type *
              </label>
              <select
                required
                value={jobData.type}
                onChange={(e) => setJobData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
              >
                {jobTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={jobData.location}
                onChange={(e) => setJobData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                placeholder="e.g., Phoenix, AZ or Remote"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Range (Optional)
              </label>
              <input
                type="text"
                value={jobData.salary}
                onChange={(e) => setJobData(prev => ({ ...prev, salary: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                placeholder="e.g., $25-30/hour or $60,000-80,000/year"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Deadline (Optional)
              </label>
              <input
                type="date"
                value={jobData.deadline}
                onChange={(e) => setJobData(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Description</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              rows={8}
              required
              value={jobData.description}
              onChange={(e) => setJobData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
              placeholder="Describe the role, responsibilities, what the student will learn, and your company culture..."
            />
            <p className="text-sm text-gray-500 mt-1">
              Provide a detailed description to attract the best candidates
            </p>
          </div>
        </div>

        {/* Requirements */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Requirements</h2>
          <div className="space-y-3">
            {jobData.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => updateRequirement(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                  placeholder="Enter a requirement..."
                />
                {jobData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addRequirement}
              className="flex items-center space-x-2 text-asu-maroon hover:text-asu-maroon-dark transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Requirement</span>
            </button>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Required Skills</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                placeholder="Add a skill..."
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-asu-maroon text-white rounded-md hover:bg-asu-maroon-dark transition-colors"
              >
                Add
              </button>
            </div>
            
            {/* Common Skills */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Popular skills:</p>
              <div className="flex flex-wrap gap-2">
                {commonSkills.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      if (!jobData.skills.includes(skill)) {
                        setJobData(prev => ({
                          ...prev,
                          skills: [...prev.skills, skill]
                        }));
                      }
                    }}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                    disabled={jobData.skills.includes(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Skills */}
            {jobData.skills.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Selected skills:</p>
                <div className="flex flex-wrap gap-2">
                  {jobData.skills.map(skill => (
                    <span
                      key={skill}
                      className="bg-asu-maroon/10 text-asu-maroon px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-asu-maroon hover:text-asu-maroon-dark"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-asu-maroon text-white rounded-md hover:bg-asu-maroon-dark focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Post Job</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}