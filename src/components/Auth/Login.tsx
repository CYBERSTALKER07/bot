import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Email,
  Lock,
  Person, 
  Business, 
  AutoAwesome,
  EmojiEvents,
  CheckCircle, 
  TrendingUp, 
  Group,
  School,
  RocketLaunch,
  ArrowForward,
  Security,
  Verified,
  Star,
  LoginOutlined,
  VpnKey,
  RememberMe,
  Help
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Typography from '../ui/Typography';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Card } from '../ui/Card';

interface FormData {
  email: string;
  password: string;
  role: 'student' | 'employer';
  rememberMe: boolean;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    role: 'student',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Set role from URL params
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'employer' || roleParam === 'student') {
      setFormData(prev => ({ ...prev, role: roleParam as 'student' | 'employer' }));
    }
  }, [searchParams]);

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'rememberMe' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    setError('');
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password, formData.role);
      
      // Save remember me preference
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('savedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('savedEmail');
      }
      
      navigate(formData.role === 'student' ? '/dashboard' : '/employer-dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string, demoRole: 'student' | 'employer') => {
    setFormData(prev => ({
      ...prev,
      email: demoEmail,
      password: demoPassword,
      role: demoRole
    }));
    setError('');
    setLoading(true);

    try {
      await login(demoEmail, demoPassword, demoRole);
      navigate(demoRole === 'student' ? '/dashboard' : '/employer-dashboard');
    } catch (err: any) {
      setError('Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load saved credentials
  useEffect(() => {
    const rememberMe = localStorage.getItem('rememberMe');
    const savedEmail = localStorage.getItem('savedEmail');
    
    if (rememberMe === 'true' && savedEmail) {
      setFormData(prev => ({
        ...prev,
        email: savedEmail,
        rememberMe: true
      }));
    }
  }, []);

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      isDark ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md lg:w-[28rem]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              isDark ? 'bg-lime/20' : 'bg-asu-maroon/10'
            }`}>
              <School className={`h-8 w-8 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
            </div>
            <Typography variant="h3" color="textPrimary" className="font-bold mb-3">
              Welcome Back
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Sign in to continue your career journey at AUT
            </Typography>
          </div>

          {/* Enhanced Role Selection */}
          <Card className="p-1 mb-6" variant="outlined">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
                className={`p-4 rounded-lg transition-all duration-200 flex flex-col items-center space-y-2 ${
                  formData.role === 'student'
                    ? isDark
                      ? 'bg-lime text-dark-surface shadow-md'
                      : 'bg-asu-maroon text-white shadow-md'
                    : isDark
                      ? 'text-dark-muted hover:bg-dark-surface'
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Person className="h-6 w-6" />
                <span className="font-medium">Student</span>
                <span className="text-xs opacity-75">Access your dashboard</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'employer' }))}
                className={`p-4 rounded-lg transition-all duration-200 flex flex-col items-center space-y-2 ${
                  formData.role === 'employer'
                    ? isDark
                      ? 'bg-lime text-dark-surface shadow-md'
                      : 'bg-asu-maroon text-white shadow-md'
                    : isDark
                      ? 'text-dark-muted hover:bg-dark-surface'
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Business className="h-6 w-6" />
                <span className="font-medium">Employer</span>
                <span className="text-xs opacity-75">Manage your hiring</span>
              </button>
            </div>
          </Card>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address "
              type="email"
              required
              value={formData.email}
              onChange={handleChange('email')}
              placeholder={formData.role === 'student' ? 'your.name@aut.edu' : 'your.email@company.com '}
              variant="outlined"
              fullWidth
              error={validationErrors.email}
              startIcon={<Email className="h-5 w-5" />}
            />

            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="Enter your password"
              variant="outlined"
              fullWidth
              showPasswordToggle
              error={validationErrors.password}
              startIcon={<Lock className="h-5 w-5" />}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange('rememberMe')}
                  className={`h-4 w-4 rounded border-2 focus:ring-2 focus:ring-offset-0 ${
                    isDark 
                      ? 'border-gray-600 text-lime focus:ring-lime bg-dark-surface' 
                      : 'border-gray-300 text-asu-maroon focus:ring-asu-maroon bg-white'
                  }`}
                />
                <label htmlFor="rememberMe" className={`text-sm ${isDark ? 'text-dark-text' : 'text-gray-700'}`}>
                  Remember me
                </label>
              </div>
              <Link 
                to="/forgot-password" 
                className={`text-sm font-medium transition-colors duration-300 ${
                  isDark ? 'text-lime hover:text-dark-accent' : 'text-asu-maroon hover:text-asu-maroon/80'
                }`}
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <Card className={`p-4 border-l-4 ${
                isDark 
                  ? 'bg-red-900/20 border-red-500 text-red-300' 
                  : 'bg-red-50 border-red-400 text-red-800'
              }`}>
                <Typography variant="body2">
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
              className="py-4 font-semibold"
              endIcon={<LoginOutlined />}
            >
              Sign In as {formData.role === 'student' ? 'Student' : 'Employer'}
            </Button>
          </form>

          {/* Demo Accounts Section */}
          <div className="mt-6">
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className={`${isDark ? 'border-gray-600 text-dark-muted' : 'border-gray-300 text-gray-600'}`}
              startIcon={<Help className="h-4 w-4" />}
            >
              Try Demo Accounts
            </Button>
            
            {showDemoAccounts && (
              <Card className="mt-3 p-4 space-y-3" variant="outlined">
                <Typography variant="body2" color="textSecondary" className="text-center mb-3">
                  Quick access to demo accounts for testing
                </Typography>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDemoLogin('student@aut.edu', 'password123', 'student')}
                    startIcon={<Person className="h-4 w-4" />}
                    className="justify-start"
                  >
                    Demo Student Account
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDemoLogin('employer@intel.com', 'password123', 'employer')}
                    startIcon={<Business className="h-4 w-4" />}
                    className="justify-start"
                  >
                    Demo Employer Account
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <div className="mt-6 text-center">
            <Typography variant="body2" color="textSecondary">
              Don't have an account?{' '}
              <Link 
                to={`/register?role=${formData.role}`}
                className={`font-medium transition-colors duration-300 ${
                  isDark ? 'text-lime hover:text-dark-accent' : 'text-asu-maroon hover:text-asu-maroon/80'
                }`}
              >
                Sign up now
              </Link>
            </Typography>
          </div>

          {/* Security Badge */}
          <div className={`mt-6 p-3 rounded-lg border ${
            isDark ? 'bg-dark-surface border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-center space-x-2">
              <Security className={`h-4 w-4 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
              <Typography variant="caption" color="textSecondary">
                Your login is secured with enterprise-grade encryption
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced Hero */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className={`absolute inset-0 transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-br from-dark-surface via-dark-bg to-gray-900' 
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
                Welcome Back to <span className={`${
                  isDark ? 'text-lime' : 'text-asu-gold'
                }`}>AUT Handshake</span>
              </Typography>
              <Typography 
                variant="subtitle1" 
                className={`mb-8 leading-relaxed ${
                  isDark ? 'text-dark-muted' : 'text-white/90'
                }`}
              >
                Continue building your career with access to exclusive opportunities and our thriving community
              </Typography>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Card className={`backdrop-blur-xl border p-4 ${
                  isDark 
                    ? 'bg-dark-surface/15 border-lime/30' 
                    : 'bg-white/15 border-white/30'
                }`}>
                  <Typography 
                    variant="h4" 
                    className={`font-bold ${
                      isDark ? 'text-lime' : 'text-asu-gold'
                    }`}
                  >
                    15k+
                  </Typography>
                  <Typography 
                    variant="body2" 
                    className={isDark ? 'text-dark-muted' : 'text-white/70'}
                  >
                    Active Students
                  </Typography>
                </Card>
                <Card className={`backdrop-blur-xl border p-4 ${
                  isDark 
                    ? 'bg-dark-surface/15 border-lime/30' 
                    : 'bg-white/15 border-white/30'
                }`}>
                  <Typography 
                    variant="h4" 
                    className={`font-bold ${
                      isDark ? 'text-lime' : 'text-asu-gold'
                    }`}
                  >
                    2.5k+
                  </Typography>
                  <Typography 
                    variant="body2" 
                    className={isDark ? 'text-dark-muted' : 'text-white/70'}
                  >
                    Jobs Posted
                  </Typography>
                </Card>
              </div>

              {/* New Features Highlight */}
              <Card className={`backdrop-blur-xl border mb-6 ${
                isDark 
                  ? 'bg-dark-surface/15 border-lime/30' 
                  : 'bg-white/15 border-white/30'
              }`}>
                <div className="flex items-center space-x-4 p-6">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-lime' : 'bg-asu-gold'
                  }`}>
                    <AutoAwesome className={`h-8 w-8 ${
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
                      New: AI Job Matching
                    </Typography>
                    <Typography 
                      variant="caption" 
                      className={isDark ? 'text-dark-muted' : 'text-white/70'}
                    >
                      Get personalized job recommendations
                    </Typography>
                  </div>
                </div>
              </Card>

              {/* Call to Action for New Users */}
              <div className="space-y-4">
                <Typography 
                  variant="h6" 
                  className={`font-medium ${isDark ? 'text-dark-text' : 'text-white'}`}
                >
                  New to AUT Handshake?
                </Typography>
                <Button
                  component={Link}
                  to={`/register?role=${formData.role}`}
                  variant="contained"
                  size="large"
                  className={`shadow-lg hover:shadow-xl transition-all duration-200 ${
                    isDark 
                      ? 'bg-lime text-dark-surface hover:bg-lime/90' 
                      : 'bg-asu-gold text-asu-maroon hover:bg-asu-gold/90'
                  }`}
                  startIcon={<RocketLaunch />}
                  endIcon={<ArrowForward />}
                >
                  Create Your Account
                </Button>
              </div>
            </div>

            {/* Success Badge */}
            <Card className={`absolute bottom-8 left-8 shadow-xl ${
              isDark ? 'bg-dark-surface/98' : 'bg-white/95'
            }`}>
              <div className="flex items-center space-x-3 p-4">
                <EmojiEvents className={`h-6 w-6 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
                <div>
                  <Typography variant="body2" className="font-bold">
                    95% Success Rate
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Students find opportunities
                  </Typography>
                </div>
              </div>
            </Card>

            {/* Floating Elements */}
            <div className={`absolute top-8 right-8 rounded-full p-3 shadow-lg animate-pulse ${
              isDark ? 'bg-lime/90' : 'bg-asu-gold/90'
            }`}>
              <Verified className={`h-6 w-6 ${
                isDark ? 'text-dark-surface' : 'text-asu-maroon'
              }`} />
            </div>

            <div className={`absolute top-1/4 left-8 rounded-full p-2 shadow-md ${
              isDark ? 'bg-dark-surface/80' : 'bg-white/80'
            }`}>
              <CheckCircle className={`h-4 w-4 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}