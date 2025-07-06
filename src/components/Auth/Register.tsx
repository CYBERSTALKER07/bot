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
  EmojiEvents
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
      isDark ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              isDark ? 'bg-lime/20' : 'bg-asu-maroon/10'
            }`}>
              <School className={`h-8 w-8 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
            </div>
            <Typography variant="h3" color="textPrimary" className="font-bold mb-3">
              Join AUT Handshake
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Create your account and start your career journey
            </Typography>
          </div>

          {/* Role Selection Card */}
          <Card className="p-2 mb-8" variant="outlined">
            <div className="flex">
              <Button
                variant={formData.role === 'student' ? 'contained' : 'text'}
                color="primary"
                startIcon={Person}
                fullWidth
                onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
                className="flex-1 mr-1"
              >
                Student
              </Button>
              <Button
                variant={formData.role === 'employer' ? 'contained' : 'text'}
                color="primary"
                startIcon={Business}
                fullWidth
                onClick={() => setFormData(prev => ({ ...prev, role: 'employer' }))}
                className="flex-1 ml-1"
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
              variant="outlined"
              fullWidth
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="Enter your email"
              variant="outlined"
              fullWidth
            />

            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={handleChange('phone')}
              placeholder="Enter your phone number"
              variant="outlined"
              fullWidth
            />

            {formData.role === 'employer' && (
              <Input
                label="Company Name"
                type="text"
                required
                value={formData.companyName}
                onChange={handleChange('companyName')}
                placeholder="Enter your company name"
                variant="outlined"
                fullWidth
              />
            )}

            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="Create a password"
              variant="outlined"
              fullWidth
              showPasswordToggle
              helperText="Password must be at least 6 characters"
            />

            <Input
              label="Confirm Password"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder="Confirm your password"
              variant="outlined"
              fullWidth
              showPasswordToggle
            />

            {error && (
              <Card className={`p-4 border-l-4 ${
                isDark 
                  ? 'bg-red-900/20 border-red-500 text-red-300' 
                  : 'bg-red-50 border-red-400 text-red-800'
              }`}>
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              </Card>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              loading={loading}
              className="py-4"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className={`font-medium transition-colors duration-300 ${
                  isDark ? 'text-lime hover:text-dark-accent' : 'text-asu-maroon hover:text-asu-maroon/80'
                }`}
              >
                Sign in
              </Link>
            </Typography>
          </div>
        </div>
      </div>

      {/* Right Side - Hero */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className={`absolute inset-0 transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-br from-dark-surface via-dark-bg to-dark-surface' 
            : 'bg-gradient-to-br from-asu-maroon via-asu-maroon-dark to-asu-maroon'
        }`}>
          <div className={`absolute inset-0 ${
            isDark ? 'bg-lime/5' : 'bg-black/20'
          } flex flex-col justify-center items-center p-12`}>
            <div className="text-center max-w-md">
              <Typography 
                variant="h3" 
                className={`font-bold mb-6 leading-tight ${
                  isDark ? 'text-dark-text' : 'text-white'
                }`}
              >
                Start Your <span className={`${
                  isDark ? 'text-lime' : 'text-asu-gold'
                }`}>Career Journey</span>
              </Typography>
              <Typography 
                variant="subtitle1" 
                className={`mb-8 leading-relaxed ${
                  isDark ? 'text-dark-muted' : 'text-white/90'
                }`}
              >
                Join thousands of AUT American University of Technology in Tashkent students and top employers building successful careers together
              </Typography>

              {/* Benefits Cards */}
              <div className="space-y-4">
                <Card className={`backdrop-blur-xl border ${
                  isDark 
                    ? 'bg-dark-surface/15 border-lime/30' 
                    : 'bg-white/15 border-white/30'
                }`}>
                  <div className="flex items-center space-x-4 p-6">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-lime' : 'bg-asu-gold'
                    }`}>
                      <CheckCircle className={`h-8 w-8 ${
                        isDark ? 'text-dark-surface' : 'text-asu-maroon'
                      }`} />
                    </div>
                    <div className="text-left">
                      <Typography 
                        variant="h6" 
                        className={`font-bold ${
                          isDark ? 'text-dark-text' : 'text-white'
                        }`}
                      >
                        Free to Join
                      </Typography>
                      <Typography 
                        variant="caption" 
                        className={isDark ? 'text-dark-muted' : 'text-white/70'}
                      >
                        No hidden fees or charges
                      </Typography>
                    </div>
                  </div>
                </Card>

                <Card className={`backdrop-blur-xl border ${
                  isDark 
                    ? 'bg-dark-surface/15 border-lime/30' 
                    : 'bg-white/15 border-white/30'
                }`}>
                  <div className="flex items-center space-x-4 p-6">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-lime' : 'bg-asu-gold'
                    }`}>
                      <TrendingUp className={`h-8 w-8 ${
                        isDark ? 'text-dark-surface' : 'text-asu-maroon'
                      }`} />
                    </div>
                    <div className="text-left">
                      <Typography 
                        variant="h6" 
                        className={`font-bold ${
                          isDark ? 'text-dark-text' : 'text-white'
                        }`}
                      >
                        Career Growth
                      </Typography>
                      <Typography 
                        variant="caption" 
                        className={isDark ? 'text-dark-muted' : 'text-white/70'}
                      >
                        Track your progress
                      </Typography>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Achievement Badge */}
            <Card className={`absolute bottom-8 left-8 shadow-xl ${
              isDark ? 'bg-dark-surface/98' : 'bg-white/95'
            }`}>
              <div className="flex items-center space-x-3 p-4">
                <EmojiEvents className={`h-6 w-6 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
                <Typography variant="body2" className="font-bold">
                  #1 Career Platform at AUT
                </Typography>
              </div>
            </Card>

            {/* Floating badge */}
            <div className={`absolute top-8 right-8 rounded-full p-3 shadow-lg ${
              isDark ? 'bg-lime/90' : 'bg-asu-gold/90'
            }`}>
              <AutoAwesome className={`h-6 w-6 ${
                isDark ? 'text-dark-surface' : 'text-asu-maroon'
              }`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}