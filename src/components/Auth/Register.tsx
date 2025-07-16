import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Person, 
  Business, 
  Email,
  Phone,
  School,
  AutoAwesome,
  CheckCircle,
  TrendingUp,
  EmojiEvents,
  Security,
  Verified,
  Groups,
  WorkOutline
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Typography from '../ui/Typography';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Card } from '../ui/Card';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'employer',
    companyName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(formData.email, formData.password, formData.role, formData.name);
      navigate('/profile-setup');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      isDark ? 'bg-dark-bg' : 'bg-neutral-50'
    }`}>
      {/* Left Side - Registration Form */}
      <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md lg:w-96">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 ${
              isDark ? 'bg-lime/15' : 'bg-asu-maroon/10'
            }`}>
              <School className={`h-10 w-10 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
            </div>
            <Typography variant="h3" color="textPrimary" className="font-bold mb-4 tracking-tight">
              Create Your Account
            </Typography>
            <Typography variant="body1" color="textSecondary" className="max-w-sm mx-auto leading-relaxed">
              Join the AUT community and connect with thousands of students and employers
            </Typography>
          </div>

          {/* Role Selection - Material Design Segmented Button */}
          <Card className="p-1 mb-8 shadow-elevation-1" variant="outlined">
            <div className="flex rounded-xl overflow-hidden">
              <Button
                variant={formData.role === 'student' ? 'filled' : 'text'}
                color="primary"
                startIcon={Person}
                fullWidth
                onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
                className={`flex-1 rounded-r-none ${formData.role === 'student' ? 'shadow-none' : ''}`}
                size="large"
              >
                Student
              </Button>
              <Button
                variant={formData.role === 'employer' ? 'filled' : 'text'}
                color="primary"
                startIcon={Business}
                fullWidth
                onClick={() => setFormData(prev => ({ ...prev, role: 'employer' }))}
                className={`flex-1 rounded-l-none ${formData.role === 'employer' ? 'shadow-none' : ''}`}
                size="large"
              >
                Employer
              </Button>
            </div>
          </Card>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="Enter your full name"
              variant="filled"
              fullWidth
              startIcon={<Person />}
              size="large"
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="Enter your email"
              variant="filled"
              fullWidth
              startIcon={<Email />}
              size="large"
            />

            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={handleChange('phone')}
              placeholder="Enter your phone number"
              variant="filled"
              fullWidth
              startIcon={<Phone />}
              size="large"
              helperText="Optional - for account verification"
            />

            {formData.role === 'employer' && (
              <Input
                label="Company Name"
                type="text"
                required
                value={formData.companyName}
                onChange={handleChange('companyName')}
                placeholder="Enter your company name"
                variant="filled"
                fullWidth
                startIcon={<WorkOutline />}
                size="large"
              />
            )}

            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="Create a strong password"
              variant="filled"
              fullWidth
              showPasswordToggle
              size="large"
              helperText="Must be at least 6 characters long"
            />

            <Input
              label="Confirm Password"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder="Confirm your password"
              variant="filled"
              fullWidth
              showPasswordToggle
              size="large"
            />

            {error && (
              <Card className={`p-4 rounded-xl border-l-4 ${
                isDark 
                  ? 'bg-error-600/10 border-error-400 text-error-300' 
                  : 'bg-error-50 border-error-400 text-error-700'
              }`} variant="outlined">
                <Typography variant="body2" className="font-medium">
                  {error}
                </Typography>
              </Card>
            )}

            <Button
              type="submit"
              variant="filled"
              color="primary"
              size="large"
              fullWidth
              loading={loading}
              className="py-4 mt-8 font-semibold tracking-wide"
            >
              Create Account
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <Typography variant="body2" color="textSecondary" className="mb-2">
              Already have an account?
            </Typography>
            <Button
              variant="text"
              color="primary"
              component={Link}
              to="/login"
              className="font-semibold"
            >
              Sign In Instead
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 pt-6 border-t border-opacity-20">
            <div className="flex items-center justify-center space-x-6 text-xs">
              <div className={`flex items-center space-x-1 ${
                isDark ? 'text-dark-muted' : 'text-gray-500'
              }`}>
                <Security className="h-4 w-4" />
                <span>Secure</span>
              </div>
              <div className={`flex items-center space-x-1 ${
                isDark ? 'text-dark-muted' : 'text-gray-500'
              }`}>
                <Verified className="h-4 w-4" />
                <span>Verified</span>
              </div>
              <div className={`flex items-center space-x-1 ${
                isDark ? 'text-dark-muted' : 'text-gray-500'
              }`}>
                <Groups className="h-4 w-4" />
                <span>Trusted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced Hero Section */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className={`absolute inset-0 transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-br from-dark-surface via-dark-bg to-dark-surface' 
            : 'bg-gradient-to-br from-asu-maroon via-asu-maroon-dark to-asu-maroon'
        }`}>
          {/* Background Pattern */}
          <div className={`absolute inset-0 opacity-10 ${
            isDark ? 'bg-lime/5' : 'bg-white/10'
          }`}>
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute rounded-full ${
                    isDark ? 'bg-lime/20' : 'bg-white/20'
                  }`}
                  style={{
                    width: Math.random() * 4 + 2 + 'px',
                    height: Math.random() * 4 + 2 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    animationDelay: Math.random() * 3 + 's',
                    animation: 'float 6s ease-in-out infinite'
                  }}
                />
              ))}
            </div>
          </div>

          <div className="relative z-10 flex flex-col justify-center items-center h-full p-12">
            <div className="text-center max-w-lg">
              <Typography 
                variant="h2" 
                className={`font-bold mb-8 leading-tight ${
                  isDark ? 'text-dark-text' : 'text-white'
                }`}
              >
                Welcome to Your <span className={`${
                  isDark ? 'text-lime' : 'text-asu-gold'
                }`}>Future</span>
              </Typography>
              <Typography 
                variant="body1" 
                className={`mb-12 leading-relaxed ${
                  isDark ? 'text-dark-muted' : 'text-white/90'
                }`}
              >
                Connect with leading employers, discover opportunities, and build meaningful 
                relationships that will shape your career at AUT American University of Technology.
              </Typography>

              {/* Feature Highlights */}
              <div className="space-y-6">
                <Card className={`backdrop-blur-xl border ${
                  isDark 
                    ? 'bg-dark-surface/20 border-lime/20' 
                    : 'bg-white/20 border-white/20'
                }`} variant="outlined">
                  <div className="flex items-center space-x-4 p-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isDark ? 'bg-lime/20' : 'bg-asu-gold/20'
                    }`}>
                      <CheckCircle className={`h-6 w-6 ${
                        isDark ? 'text-lime' : 'text-asu-gold'
                      }`} />
                    </div>
                    <div className="text-left flex-1">
                      <Typography 
                        variant="subtitle1" 
                        className={`font-semibold mb-1 ${
                          isDark ? 'text-dark-text' : 'text-white'
                        }`}
                      >
                        Free & Secure
                      </Typography>
                      <Typography 
                        variant="body2" 
                        className={isDark ? 'text-dark-muted' : 'text-white/80'}
                      >
                        No costs, complete privacy protection
                      </Typography>
                    </div>
                  </div>
                </Card>

                <Card className={`backdrop-blur-xl border ${
                  isDark 
                    ? 'bg-dark-surface/20 border-lime/20' 
                    : 'bg-white/20 border-white/20'
                }`} variant="outlined">
                  <div className="flex items-center space-x-4 p-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isDark ? 'bg-lime/20' : 'bg-asu-gold/20'
                    }`}>
                      <TrendingUp className={`h-6 w-6 ${
                        isDark ? 'text-lime' : 'text-asu-gold'
                      }`} />
                    </div>
                    <div className="text-left flex-1">
                      <Typography 
                        variant="subtitle1" 
                        className={`font-semibold mb-1 ${
                          isDark ? 'text-dark-text' : 'text-white'
                        }`}
                      >
                        Career Growth
                      </Typography>
                      <Typography 
                        variant="body2" 
                        className={isDark ? 'text-dark-muted' : 'text-white/80'}
                      >
                        Track progress and achievements
                      </Typography>
                    </div>
                  </div>
                </Card>

                <Card className={`backdrop-blur-xl border ${
                  isDark 
                    ? 'bg-dark-surface/20 border-lime/20' 
                    : 'bg-white/20 border-white/20'
                }`} variant="outlined">
                  <div className="flex items-center space-x-4 p-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isDark ? 'bg-lime/20' : 'bg-asu-gold/20'
                    }`}>
                      <Groups className={`h-6 w-6 ${
                        isDark ? 'text-lime' : 'text-asu-gold'
                      }`} />
                    </div>
                    <div className="text-left flex-1">
                      <Typography 
                        variant="subtitle1" 
                        className={`font-semibold mb-1 ${
                          isDark ? 'text-dark-text' : 'text-white'
                        }`}
                      >
                        Network Building
                      </Typography>
                      <Typography 
                        variant="body2" 
                        className={isDark ? 'text-dark-muted' : 'text-white/80'}
                      >
                        Connect with professionals
                      </Typography>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Floating Success Badge */}
            <Card className={`absolute bottom-8 left-8 shadow-2xl ${
              isDark ? 'bg-dark-surface/95' : 'bg-white/95'
            }`} variant="elevated">
              <div className="flex items-center space-x-3 p-4">
                <EmojiEvents className={`h-5 w-5 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
                <div>
                  <Typography variant="caption" className="font-semibold">
                    #1 Student Platform
                  </Typography>
                  <Typography variant="caption" color="textSecondary" className="block">
                    at AUT University
                  </Typography>
                </div>
              </div>
            </Card>

            {/* Decorative Elements */}
            <div className={`absolute top-8 right-8 rounded-full p-3 shadow-lg ${
              isDark ? 'bg-lime/15' : 'bg-asu-gold/15'
            }`}>
              <AutoAwesome className={`h-5 w-5 ${
                isDark ? 'text-lime' : 'text-asu-gold'
              }`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}