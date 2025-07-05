import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase';

export default function ProfileSetup() {
  const { user, updateProfile } = useAuth();
  const { isDark } = useTheme();
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
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-dark-bg to-dark-surface' : 'bg-gradient-to-br from-gray-50 to-white'
    }`}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className={`rounded-3xl shadow-lg border p-8 transition-colors duration-300 ${
          isDark ? 'bg-dark-surface border-lime/20' : 'bg-white border-gray-100'
        }`}>
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold mb-2 transition-colors ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}>Complete Your Profile</h1>
            <p className={`transition-colors ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}>
              Tell us about yourself to help us match you with the right opportunities
            </p>
          </div>

          {error && (
            <div className={`mb-6 border px-4 py-3 rounded-md transition-colors ${
              isDark 
                ? 'bg-red-900/20 border-red-500/30 text-red-300' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {user.role === 'student' ? (
              <>
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors ${
                    isDark ? 'text-dark-text' : 'text-gray-700'
                  }`}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentProfile.full_name}
                    onChange={(e) => setStudentProfile(prev => ({ ...prev, full_name: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                      isDark 
                        ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                        : 'border-gray-300 focus:ring-asu-maroon bg-white text-gray-900'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={studentProfile.phone}
                      onChange={(e) => setStudentProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                        isDark 
                          ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                          : 'border-gray-300 focus:ring-asu-maroon bg-white text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Location
                    </label>
                    <input
                      type="text"
                      value={studentProfile.location}
                      onChange={(e) => setStudentProfile(prev => ({ ...prev, location: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                        isDark 
                          ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                          : 'border-gray-300 focus:ring-asu-maroon bg-white text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Major *
                    </label>
                    <select
                      required
                      value={studentProfile.major}
                      onChange={(e) => setStudentProfile(prev => ({ ...prev, major: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                        isDark 
                          ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text' 
                          : 'border-gray-300 focus:ring-asu-maroon bg-white text-gray-900'
                      }`}
                    >
                      <option value="">Select your major</option>
                      {majors.map(major => (
                        <option key={major} value={major}>{major}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Graduation Year *
                    </label>
                    <select
                      required
                      value={studentProfile.graduation_year}
                      onChange={(e) => setStudentProfile(prev => ({ ...prev, graduation_year: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                        isDark 
                          ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text' 
                          : 'border-gray-300 focus:ring-asu-maroon bg-white text-gray-900'
                      }`}
                    >
                      <option value="">Select graduation year</option>
                      {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors ${
                    isDark ? 'text-dark-text' : 'text-gray-700'
                  }`}>
                    Bio
                  </label>
                  <textarea
                    value={studentProfile.bio}
                    onChange={(e) => setStudentProfile(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                      isDark 
                        ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                        : 'border-gray-300 focus:ring-asu-maroon bg-white text-gray-900'
                    }`}
                    placeholder="Tell us about yourself, your interests, and career goals..."
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors ${
                    isDark ? 'text-dark-text' : 'text-gray-700'
                  }`}>
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={studentProfile.skills}
                    onChange={(e) => setStudentProfile(prev => ({ ...prev, skills: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                      isDark 
                        ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                        : 'border-gray-300 focus:ring-asu-maroon bg-white text-gray-900'
                    }`}
                    placeholder="e.g., JavaScript, Python, React, Data Analysis"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Portfolio URL
                    </label>
                    <input
                      type="url"
                      value={studentProfile.portfolio_url}
                      onChange={(e) => setStudentProfile(prev => ({ ...prev, portfolio_url: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                        isDark 
                          ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                          : 'border-gray-300 focus:ring-asu-maroon bg-white text-gray-900'
                      }`}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={studentProfile.linkedin_url}
                      onChange={(e) => setStudentProfile(prev => ({ ...prev, linkedin_url: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                        isDark 
                          ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                          : 'border-gray-300 focus:ring-asu-maroon bg-white text-gray-900'
                      }`}
                      placeholder="https://linkedin.com/in/yourname"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={studentProfile.github_url}
                      onChange={(e) => setStudentProfile(prev => ({ ...prev, github_url: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                        isDark 
                          ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                          : 'border-gray-300 focus:ring-asu-maroon bg-white text-gray-900'
                      }`}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors ${
                    isDark ? 'text-dark-text' : 'text-gray-700'
                  }`}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={employerProfile.company_name}
                    onChange={(e) => setEmployerProfile(prev => ({ ...prev, company_name: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                      isDark 
                        ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                        : 'border-gray-300 focus:ring-asu-maroon bg-white text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors ${
                    isDark ? 'text-dark-text' : 'text-gray-700'
                  }`}>
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={employerProfile.full_name}
                    onChange={(e) => setEmployerProfile(prev => ({ ...prev, full_name: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                      isDark 
                        ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                        : 'border-gray-300 focus:ring-asu-maroon bg-white text-gray-900'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={employerProfile.job_title}
                      onChange={(e) => setEmployerProfile(prev => ({ ...prev, job_title: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                        isDark 
                          ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                          : 'border-gray-300 focus:ring-asu-maroon bg-white text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={employerProfile.phone}
                      onChange={(e) => setEmployerProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                        isDark 
                          ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                          : 'border-gray-300 focus:ring-asu-maroon bg-white text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Industry *
                    </label>
                    <select
                      required
                      value={employerProfile.industry}
                      onChange={(e) => setEmployerProfile(prev => ({ ...prev, industry: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                        isDark 
                          ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text' 
                          : 'border-gray-300 focus:ring-asu-maroon bg-white text-gray-900'
                      }`}
                    >
                      <option value="">Select industry</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      Company Size *
                    </label>
                    <select
                      required
                      value={employerProfile.company_size}
                      onChange={(e) => setEmployerProfile(prev => ({ ...prev, company_size: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                        isDark 
                          ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text' 
                          : 'border-gray-300 focus:ring-asu-maroon bg-white text-gray-900'
                      }`}
                    >
                      <option value="">Select company size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors ${
                    isDark ? 'text-dark-text' : 'text-gray-700'
                  }`}>
                    Company Description
                  </label>
                  <textarea
                    value={employerProfile.company_description}
                    onChange={(e) => setEmployerProfile(prev => ({ ...prev, company_description: e.target.value }))}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                      isDark 
                        ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                        : 'border-gray-300 focus:ring-asu-maroon bg-white text-gray-900'
                    }`}
                    placeholder="Tell us about your company, culture, and what makes it special..."
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors ${
                    isDark ? 'text-dark-text' : 'text-gray-700'
                  }`}>
                    Company Website
                  </label>
                  <input
                    type="url"
                    value={employerProfile.website}
                    onChange={(e) => setEmployerProfile(prev => ({ ...prev, website: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                      isDark 
                        ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                        : 'border-gray-300 focus:ring-asu-maroon bg-white text-gray-900'
                    }`}
                    placeholder="https://yourcompany.com"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 ${
                  isDark 
                    ? 'bg-lime text-dark-surface hover:bg-dark-accent focus:ring-lime' 
                    : 'bg-asu-maroon text-white hover:bg-asu-maroon-dark focus:ring-asu-maroon'
                }`}
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
          </form 
          >
        </div>
      </div>
    </div>
  );
}