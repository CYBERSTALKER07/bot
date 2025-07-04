import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function ProfileSetup() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [studentProfile, setStudentProfile] = useState({
    full_name: '',
    bio: '',
    major: '',
    graduation_year: new Date().getFullYear() + 1,
    gpa: '',
    skills: [] as string[],
    website: ''
  });

  const [employerProfile, setEmployerProfile] = useState({
    full_name: '',
    bio: '',
    website: '',
    company_name: '',
    industry: '',
    company_size: '',
    contact_title: ''
  });

  const [skillInput, setSkillInput] = useState('');

  const addSkill = () => {
    if (skillInput.trim() && !studentProfile.skills.includes(skillInput.trim())) {
      setStudentProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setStudentProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const profile = user?.role === 'student' ? studentProfile : employerProfile;
      
      // First, try to update the profile
      try {
        await updateProfile(profile);
        navigate('/dashboard');
      } catch (updateError: any) {
        // If update fails because profile doesn't exist, create it
        if (updateError.code === 'PGRST116' || updateError.message?.includes('No rows found')) {
          console.log('Profile not found, creating new profile...');
          
          // Create the profile directly
          const { error: createError } = await supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
            if (!authUser) throw new Error('No authenticated user');
            
            const username = authUser.email?.split('@')[0] || '';
            return await supabase
              .from('profiles')
              .insert({
                id: authUser.id,
                username,
                ...profile
              });
          });
          
          if (createError) {
            throw createError;
          }
          
          navigate('/dashboard');
        } else {
          throw updateError;
        }
      }
    } catch (err) {
      console.error('Profile setup error:', err);
      setError(err instanceof Error ? err.message : 'Profile setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const majors = [
    'Computer Science',
    'Business',
    'Engineering',
    'Marketing',
    'Finance',
    'Data Science',
    'Psychology',
    'Communications',
    'Other'
  ];

  const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Consulting',
    'Manufacturing',
    'Education',
    'Government',
    'Non-profit',
    'Other'
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-1000 employees',
    '1000+ employees'
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
            <p className="text-gray-600 mt-2">
              Help us personalize your experience by completing your profile information.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {user.role === 'student' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentProfile.full_name}
                    onChange={(e) => setStudentProfile(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aut-maroon focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Major *
                    </label>
                    <select
                      required
                      value={studentProfile.major}
                      onChange={(e) => setStudentProfile(prev => ({ ...prev, major: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aut-maroon focus:border-transparent"
                    >
                      <option value="">Select your major</option>
                      {majors.map(major => (
                        <option key={major} value={major}>{major}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Graduation Year *
                    </label>
                    <select
                      required
                      value={studentProfile.graduation_year}
                      onChange={(e) => setStudentProfile(prev => ({ ...prev, graduation_year: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aut-maroon focus:border-transparent"
                    >
                      {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GPA (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={studentProfile.gpa}
                    onChange={(e) => setStudentProfile(prev => ({ ...prev, gpa: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aut-maroon focus:border-transparent"
                    placeholder="3.50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aut-maroon focus:border-transparent"
                      placeholder="Add a skill (e.g., JavaScript, Python)"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2 bg-aut-maroon text-white rounded-md hover:bg-aut-maroon-dark transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {studentProfile.skills.map(skill => (
                      <span
                        key={skill}
                        className="bg-aut-maroon/10 text-aut-maroon px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-aut-maroon hover:text-aut-maroon-dark"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    value={studentProfile.bio}
                    onChange={(e) => setStudentProfile(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aut-maroon focus:border-transparent"
                    placeholder="Tell employers about yourself, your interests, and career goals..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website/Portfolio (Optional)
                  </label>
                  <input
                    type="url"
                    value={studentProfile.website}
                    onChange={(e) => setStudentProfile(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aut-maroon focus:border-transparent"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={employerProfile.company_name}
                      onChange={(e) => setEmployerProfile(prev => ({ ...prev, company_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aut-maroon focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={employerProfile.full_name}
                      onChange={(e) => setEmployerProfile(prev => ({ ...prev, full_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aut-maroon focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry *
                    </label>
                    <select
                      required
                      value={employerProfile.industry}
                      onChange={(e) => setEmployerProfile(prev => ({ ...prev, industry: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aut-maroon focus:border-transparent"
                    >
                      <option value="">Select industry</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Size *
                    </label>
                    <select
                      required
                      value={employerProfile.company_size}
                      onChange={(e) => setEmployerProfile(prev => ({ ...prev, company_size: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aut-maroon focus:border-transparent"
                    >
                      <option value="">Select company size</option>
                      {companySizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={employerProfile.contact_title}
                      onChange={(e) => setEmployerProfile(prev => ({ ...prev, contact_title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aut-maroon focus:border-transparent"
                      placeholder="e.g., Talent Acquisition Manager"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={employerProfile.website}
                      onChange={(e) => setEmployerProfile(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aut-maroon focus:border-transparent"
                      placeholder="https://company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={employerProfile.bio}
                    onChange={(e) => setEmployerProfile(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aut-maroon focus:border-transparent"
                    placeholder="Describe your company, culture, and what makes it a great place to work..."
                  />
                </div>
              </>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-aut-maroon text-white px-8 py-3 rounded-md hover:bg-aut-maroon-dark focus:outline-none focus:ring-2 focus:ring-aut-maroon focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Complete Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}