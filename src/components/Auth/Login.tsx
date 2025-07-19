import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  AlertCircle,
  X as XIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
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
  const [showPassword, setShowPassword] = useState(false);
  
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
      
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('savedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('savedEmail');
      }
      
      if (formData.email === 'admin@aut.edu' && formData.password === 'admin123') {
        navigate('/admin');
      } else {
        navigate('/feed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Invalid credentials. Please check your email and password.');
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
      navigate('/feed');
    } catch {
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
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 max-w-md mx-auto lg:max-w-none">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {/* X Logo */}
            <div className="text-center mb-8">
              <div className={`w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center ${
                isDark ? 'bg-white' : 'bg-black'
              }`}>
                <XIcon className={`h-6 w-6 ${isDark ? 'text-black' : 'text-white'}`} />
              </div>
              <h1 className="text-3xl font-bold mb-2">Sign in to X</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection - X Style */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
                  className={`w-full p-4 rounded-full border-2 transition-all duration-200 flex items-center justify-center space-x-3 ${
                    formData.role === 'student'
                      ? isDark
                        ? 'border-white bg-white text-black'
                        : 'border-black bg-black text-white'
                      : isDark
                        ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Continue as Student</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'employer' }))}
                  className={`w-full p-4 rounded-full border-2 transition-all duration-200 flex items-center justify-center space-x-3 ${
                    formData.role === 'employer'
                      ? isDark
                        ? 'border-white bg-white text-black'
                        : 'border-black bg-black text-white'
                      : isDark
                        ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <Building2 className="h-5 w-5" />
                  <span className="font-medium">Continue as Employer</span>
                </button>
              </div>

              <div className="relative">
                <div className={`absolute inset-0 flex items-center ${error ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${isDark ? 'bg-black text-gray-400' : 'bg-white text-gray-500'}`}>
                    Or
                  </span>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    placeholder="Email"
                    className={`w-full px-4 py-4 text-lg rounded-md border-2 bg-transparent transition-colors ${
                      validationErrors.email
                        ? 'border-red-500 focus:border-red-500'
                        : isDark
                          ? 'border-gray-600 focus:border-blue-500 text-white placeholder-gray-400'
                          : 'border-gray-300 focus:border-blue-500 text-black placeholder-gray-500'
                    } focus:outline-none`}
                  />
                  <Mail className={`absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </div>
                {validationErrors.email && (
                  <p className="text-red-500 text-sm flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{validationErrors.email}</span>
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange('password')}
                    placeholder="Password"
                    className={`w-full px-4 py-4 text-lg rounded-md border-2 bg-transparent transition-colors pr-12 ${
                      validationErrors.password
                        ? 'border-red-500 focus:border-red-500'
                        : isDark
                          ? 'border-gray-600 focus:border-blue-500 text-white placeholder-gray-400'
                          : 'border-gray-300 focus:border-blue-500 text-black placeholder-gray-500'
                    } focus:outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                      isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-red-500 text-sm flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{validationErrors.password}</span>
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className={`p-4 rounded-lg border ${
                  isDark 
                    ? 'bg-red-900/20 border-red-800 text-red-300' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className={`w-full py-4 text-lg font-bold rounded-full transition-colors ${
                  isDark
                    ? 'bg-white text-black hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-500'
                    : 'bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500'
                }`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange('rememberMe')}
                    className={`w-4 h-4 rounded ${
                      isDark 
                        ? 'bg-gray-800 border-gray-600 text-blue-500' 
                        : 'bg-white border-gray-300 text-blue-600'
                    }`}
                  />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    Remember me
                  </span>
                </label>
                <Link 
                  to="/forgot-password" 
                  className={`font-medium hover:underline ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}
                >
                  Forgot password?
                </Link>
              </div>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6">
              <button
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className={`w-full p-3 text-sm rounded-md border ${
                  isDark 
                    ? 'border-gray-600 text-gray-400 hover:bg-gray-900' 
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Try Demo Accounts
              </button>
              
              {showDemoAccounts && (
                <div className="mt-3 space-y-2">
                  <button
                    onClick={() => handleDemoLogin('student@aut.edu', 'password123', 'student')}
                    className={`w-full p-3 text-sm text-left rounded-md border ${
                      isDark 
                        ? 'border-gray-700 hover:bg-gray-900' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    Demo Student Account
                  </button>
                  <button
                    onClick={() => handleDemoLogin('employer@intel.com', 'password123', 'employer')}
                    className={`w-full p-3 text-sm text-left rounded-md border ${
                      isDark 
                        ? 'border-gray-700 hover:bg-gray-900' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    Demo Employer Account
                  </button>
                </div>
              )}
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Don't have an account?{' '}
                <Link 
                  to={`/register?role=${formData.role}`}
                  className={`font-medium hover:underline ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}
                >
                  Sign up
                </Link>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Hero */}
        <div className="hidden lg:block relative flex-1">
          <div className={`absolute inset-0 ${
            isDark 
              ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' 
              : 'bg-gradient-to-br from-gray-100 via-white to-gray-100'
          }`}>
            <div className="flex flex-col justify-center items-center h-full p-12 text-center">
              <div className={`w-24 h-24 rounded-full mb-8 flex items-center justify-center ${
                isDark ? 'bg-white' : 'bg-black'
              }`}>
                <XIcon className={`h-12 w-12 ${isDark ? 'text-black' : 'text-white'}`} />
              </div>
              
              <h2 className={`text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-black'
              }`}>
                Happening now
              </h2>
              
              <p className={`text-xl mb-8 max-w-md ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Join the professional network that's changing how students and employers connect.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-8 max-w-xs">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                    15k+
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Students
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                    2.5k+
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Jobs
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}