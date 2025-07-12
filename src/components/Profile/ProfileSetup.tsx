import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, ArrowRight, User, Building2, Link, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card } from '../ui/Card';
import Stepper from '../ui/Stepper';
import { cn } from '../../lib/cva';

interface ProfileData {
  // Common fields
  full_name: string;
  bio: string;
  phone: string;
  location: string;
  
  // Student fields
  major?: string;
  graduation_year?: number;
  skills?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  github_url?: string;
  
  // Employer fields
  company_name?: string;
  job_title?: string;
  industry?: string;
  company_size?: string;
  company_description?: string;
  website?: string;
}

const steps = [
  {
    id: 'basic',
    title: 'Basic Info',
    description: 'Tell us about yourself',
  },
  {
    id: 'details',
    title: 'Professional Details',
    description: 'Academic or work information',
  },
  {
    id: 'links',
    title: 'Social Links',
    description: 'Portfolio and social profiles',
    optional: true,
  },
];

export default function ProfileSetup() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    bio: '',
    phone: '',
    location: '',
    major: '',
    graduation_year: new Date().getFullYear() + 1,
    skills: '',
    portfolio_url: '',
    linkedin_url: '',
    github_url: '',
    company_name: '',
    job_title: '',
    industry: '',
    company_size: '',
    company_description: '',
    website: '',
  });

  const updateField = (field: keyof ProfileData, value: string | number) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1: // Basic Info
        return !!(profileData.full_name && profileData.bio);
      case 2: // Professional Details
        if (user?.role === 'student') {
          return !!(profileData.major && profileData.graduation_year);
        }
        return !!(profileData.company_name && profileData.job_title && profileData.industry && profileData.company_size);
      case 3: // Social Links (optional)
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length && isStepValid(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      // Clean up data based on user role
      const cleanData = user?.role === 'student' 
        ? {
            full_name: profileData.full_name,
            bio: profileData.bio,
            phone: profileData.phone,
            location: profileData.location,
            major: profileData.major,
            graduation_year: profileData.graduation_year,
            skills: profileData.skills,
            portfolio_url: profileData.portfolio_url,
            linkedin_url: profileData.linkedin_url,
            github_url: profileData.github_url,
          }
        : {
            full_name: profileData.full_name,
            bio: profileData.bio,
            phone: profileData.phone,
            location: profileData.location,
            company_name: profileData.company_name,
            job_title: profileData.job_title,
            industry: profileData.industry,
            company_size: profileData.company_size,
            company_description: profileData.company_description,
            website: profileData.website,
          };

      try {
        await updateProfile(cleanData);
        navigate('/dashboard');
      } catch (updateError: any) {
        if (updateError.code === 'PGRST116' || updateError.message?.includes('No rows found')) {
          console.log('Profile not found, creating new profile...');
          
          const { error: createError } = await supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
            if (!authUser) throw new Error('No authenticated user');
            
            const username = authUser.email?.split('@')[0] || '';
            return await supabase
              .from('profiles')
              .insert({
                id: authUser.id,
                username,
                ...cleanData
              });
          });
          
          if (createError) throw createError;
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
    'Computer Science', 'Business', 'Engineering', 'Marketing', 'Finance',
    'Data Science', 'Psychology', 'Communications', 'Other'
  ];

  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Consulting', 'Manufacturing',
    'Education', 'Government', 'Non-profit', 'Other'
  ];

  if (!user) return null;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="h-12 w-12 text-brand-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>
              <p className="text-neutral-600">Let's start with the basics</p>
            </div>

            <Input
              label="Full Name"
              value={profileData.full_name}
              onChange={(e) => updateField('full_name', e.target.value)}
              required
              startIcon={<User className="h-4 w-4" />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                value={profileData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
              <Input
                label="Location"
                value={profileData.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="City, State"
              />
            </div>

            <Input
              label="Bio"
              multiline
              rows={4}
              value={profileData.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              placeholder="Tell us about yourself, your interests, and goals..."
              required
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              {user.role === 'student' ? (
                <>
                  <Briefcase className="h-12 w-12 text-brand-primary mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-foreground">Academic Details</h2>
                  <p className="text-neutral-600">Tell us about your studies</p>
                </>
              ) : (
                <>
                  <Building2 className="h-12 w-12 text-brand-primary mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-foreground">Company Information</h2>
                  <p className="text-neutral-600">Tell us about your company</p>
                </>
              )}
            </div>

            {user.role === 'student' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Major *
                    </label>
                    <select
                      required
                      value={profileData.major}
                      onChange={(e) => updateField('major', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="">Select your major</option>
                      {majors.map(major => (
                        <option key={major} value={major}>{major}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Graduation Year *
                    </label>
                    <select
                      required
                      value={profileData.graduation_year}
                      onChange={(e) => updateField('graduation_year', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="">Select graduation year</option>
                      {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Input
                  label="Skills"
                  value={profileData.skills}
                  onChange={(e) => updateField('skills', e.target.value)}
                  placeholder="e.g., JavaScript, Python, React, Data Analysis"
                  helperText="Separate skills with commas"
                />
              </>
            ) : (
              <>
                <Input
                  label="Company Name"
                  value={profileData.company_name}
                  onChange={(e) => updateField('company_name', e.target.value)}
                  required
                  startIcon={<Building2 className="h-4 w-4" />}
                />

                <Input
                  label="Your Job Title"
                  value={profileData.job_title}
                  onChange={(e) => updateField('job_title', e.target.value)}
                  required
                  startIcon={<Briefcase className="h-4 w-4" />}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Industry *
                    </label>
                    <select
                      required
                      value={profileData.industry}
                      onChange={(e) => updateField('industry', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="">Select industry</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Company Size *
                    </label>
                    <select
                      required
                      value={profileData.company_size}
                      onChange={(e) => updateField('company_size', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
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

                <Input
                  label="Company Description"
                  multiline
                  rows={4}
                  value={profileData.company_description}
                  onChange={(e) => updateField('company_description', e.target.value)}
                  placeholder="Tell us about your company, culture, and what makes it special..."
                />
              </>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Link className="h-12 w-12 text-brand-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground">Social Links</h2>
              <p className="text-neutral-600">Connect your professional profiles (optional)</p>
            </div>

            {user.role === 'student' ? (
              <>
                <Input
                  label="Portfolio URL"
                  type="url"
                  value={profileData.portfolio_url}
                  onChange={(e) => updateField('portfolio_url', e.target.value)}
                  placeholder="https://yourportfolio.com"
                />

                <Input
                  label="LinkedIn Profile"
                  type="url"
                  value={profileData.linkedin_url}
                  onChange={(e) => updateField('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/in/yourname"
                />

                <Input
                  label="GitHub Profile"
                  type="url"
                  value={profileData.github_url}
                  onChange={(e) => updateField('github_url', e.target.value)}
                  placeholder="https://github.com/yourusername"
                />
              </>
            ) : (
              <Input
                label="Company Website"
                type="url"
                value={profileData.website}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="https://yourcompany.com"
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card variant="elevated" padding="lg" className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Profile</h1>
            <p className="text-neutral-600">
              Help us match you with the right opportunities
            </p>
          </div>

          {/* Progress Stepper */}
          <div className="mb-8">
            <Stepper
              steps={steps}
              currentStep={currentStep}
              orientation="horizontal"
            />
          </div>

          {error && (
            <div className="mb-6 border border-error/20 bg-error/5 text-error px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Step Content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Previous
            </Button>

            <div className="flex gap-3">
              {currentStep < steps.length ? (
                <Button
                  variant="primary"
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  loading={loading}
                  leftIcon={<Save className="h-4 w-4" />}
                >
                  Complete Profile
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}