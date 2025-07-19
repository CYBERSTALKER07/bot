import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Building2, 
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  X as XIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'employer',
    companyName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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
              <h1 className="text-3xl font-bold mb-2">Create your account</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
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
                  <span className="font-medium">Sign up as Student</span>
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
                  <span className="font-medium">Sign up as Employer</span>
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${isDark ? 'bg-black text-gray-400' : 'bg-white text-gray-500'}`}>
                    Enter your details
                  </span>
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-1">
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleChange('name')}
                  placeholder="Full name"
                  required
                  className={`w-full px-4 py-4 text-lg rounded-md border-2 bg-transparent transition-colors ${
                    isDark
                      ? 'border-gray-600 focus:border-blue-500 text-white placeholder-gray-400'
                      : 'border-gray-300 focus:border-blue-500 text-black placeholder-gray-500'
                  } focus:outline-none`}
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    placeholder="Email"
                    required
                    className={`w-full px-4 py-4 text-lg rounded-md border-2 bg-transparent transition-colors ${
                      isDark
                        ? 'border-gray-600 focus:border-blue-500 text-white placeholder-gray-400'
                        : 'border-gray-300 focus:border-blue-500 text-black placeholder-gray-500'
                    } focus:outline-none`}
                  />
                  <Mail className={`absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </div>
              </div>

              {/* Company Name (for employers) */}
              {formData.role === 'employer' && (
                <div className="space-y-1">
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={handleChange('companyName')}
                    placeholder="Company name"
                    required
                    className={`w-full px-4 py-4 text-lg rounded-md border-2 bg-transparent transition-colors ${
                      isDark
                        ? 'border-gray-600 focus:border-blue-500 text-white placeholder-gray-400'
                        : 'border-gray-300 focus:border-blue-500 text-black placeholder-gray-500'
                    } focus:outline-none`}
                  />
                </div>
              )}

              {/* Password Input */}
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange('password')}
                    placeholder="Password"
                    required
                    className={`w-full px-4 py-4 text-lg rounded-md border-2 bg-transparent transition-colors pr-12 ${
                      isDark
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
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Must be at least 6 characters
                </p>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    placeholder="Confirm password"
                    required
                    className={`w-full px-4 py-4 text-lg rounded-md border-2 bg-transparent transition-colors pr-12 ${
                      isDark
                        ? 'border-gray-600 focus:border-blue-500 text-white placeholder-gray-400'
                        : 'border-gray-300 focus:border-blue-500 text-black placeholder-gray-500'
                    } focus:outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                      isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
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
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            {/* Terms */}
            <p className={`mt-6 text-sm text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              By signing up, you agree to the{' '}
              <Link to="/terms" className={`hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className={`hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                Privacy Policy
              </Link>
              .
            </p>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Already have an account?{' '}
                <Link 
                  to="/login"
                  className={`font-medium hover:underline ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}
                >
                  Sign in
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
                Join today.
              </h2>
              
              <p className={`text-xl mb-8 max-w-md ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Connect with students, employers, and opportunities that matter to your career.
              </p>

              {/* Benefits */}
              <div className="space-y-4 text-left max-w-sm">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-white text-black' : 'bg-black text-white'
                  }`}>
                    <span className="text-sm">✓</span>
                  </div>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    Free for students
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-white text-black' : 'bg-black text-white'
                  }`}>
                    <span className="text-sm">✓</span>
                  </div>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    Direct access to employers
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-white text-black' : 'bg-black text-white'
                  }`}>
                    <span className="text-sm">✓</span>
                  </div>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    Exclusive job opportunities
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}