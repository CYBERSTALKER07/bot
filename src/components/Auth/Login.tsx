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
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card } from '../ui/Card';
import { SupabaseTest } from '../SupabaseTest';

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
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'student' as 'student' | 'employer'
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { login, register } = useAuth();
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
      
      // Navigate based on role
      if (formData.role === 'employer') {
        navigate('/dashboard');
      } else {
        navigate('/feed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed. Please try again.');
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
      // First try to login with existing demo account
      await login(demoEmail, demoPassword, demoRole);
      if (demoRole === 'employer') {
        navigate('/dashboard');
      } else {
        navigate('/feed');
      }
    } catch (error) {
      // If login fails, create the demo account
      try {
        console.log('Creating demo account:', demoEmail);
        await register(demoEmail, demoPassword, demoRole, 
          demoRole === 'student' ? 'Demo Student' : 'Demo Employer'
        );
        
        // After creating, try to login again
        setTimeout(async () => {
          try {
            await login(demoEmail, demoPassword, demoRole);
            if (demoRole === 'employer') {
              navigate('/dashboard');
            } else {
              navigate('/feed');
            }
          } catch (loginError) {
            setError('Demo account created but login failed. Please try again.');
          }
        }, 1000);
        
      } catch (createError) {
        setError(createError instanceof Error ? createError.message : 'Demo account creation failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const fullName = `${signUpData.firstName} ${signUpData.lastName}`.trim();
      await register(signUpData.email, signUpData.password, signUpData.role, fullName);
      
      // Show success message
      setError('Registration successful! You can now sign in.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
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
      {/* Desktop Layout with Sliding Animation */}
      <div className="hidden md:flex h-screen relative">
        {/* Background Pattern */}
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' 
            : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200'
        }`}>
          <div className="absolute inset-0 opacity-10">
            <div className={`absolute top-20 left-20 w-72 h-72 ${
              isDark ? 'bg-[#BCE953]' : 'bg-[#BCE953]'
            } rounded-full blur-3xl`}></div>
            <div className={`absolute bottom-20 right-20 w-96 h-96 ${
              isDark ? 'bg-[#BCE953]' : 'bg-[#BCE953]'
            } rounded-full blur-3xl`}></div>
            <div className={`absolute top-1/2 left-1/2 w-64 h-64 ${
              isDark ? 'bg-[#BCE953]' : 'bg-[#BCE953]'
            } rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2`}></div>
          </div>
        </div>

        {/* Main Container - Fullscreen with Sliding Animation */}
        <div className={`relative ${
          isDark 
            ? 'bg-black/95 backdrop-blur-xl' 
            : 'bg-white/95 backdrop-blur-xl'
        } shadow-2xl overflow-hidden w-full h-full transition-all duration-700 ease-in-out ${isSignUp ? 'active' : ''}`}>
          
          {/* Sign Up Form - Desktop */}
          <div className={`absolute top-0 h-full w-1/2 transition-all duration-700 ease-in-out ${
            isSignUp 
              ? 'transform translate-x-full opacity-100 z-[5]' 
              : 'left-0 opacity-0 z-[1]'
          }`}>
            <form onSubmit={handleSignUp} className={`${
              isDark 
                ? 'bg-black/95 backdrop-blur-xl' 
                : 'bg-white/95 backdrop-blur-xl'
            } flex items-center justify-center flex-col px-12 h-full`}>
              <div className="max-w-md w-full space-y-6">
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
                    isDark ? 'bg-[#BCE953]' : 'bg-[#BCE953]'
                  }`}>
                    <GraduationCap className="h-8 w-8 text-black" />
                  </div>
                  <h1 className={`text-4xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Create Account</h1>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Join AUT Handshake to connect with opportunities
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={signUpData.firstName}
                      onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                      required
                      className={`${
                        isDark 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      } border rounded-xl h-12 px-4 focus:outline-none focus:ring-2 focus:ring-[#BCE953] focus:border-[#BCE953] transition-all`}
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={signUpData.lastName}
                      onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                      required
                      className={`${
                        isDark 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      } border rounded-xl h-12 px-4 focus:outline-none focus:ring-2 focus:ring-[#BCE953] focus:border-[#BCE953] transition-all`}
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="your.email@aut.edu"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    required
                    className={`w-full ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    } border rounded-xl h-12 px-4 focus:outline-none focus:ring-2 focus:ring-[#BCE953] focus:border-[#BCE953] transition-all`}
                  />

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      required
                      className={`w-full ${
                        isDark 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      } border rounded-xl h-12 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#BCE953] focus:border-[#BCE953] transition-all`}
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

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                      required
                      className={`w-full ${
                        isDark 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      } border rounded-xl h-12 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#BCE953] focus:border-[#BCE953] transition-all`}
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

                {error && (
                  <div className={`${
                    isDark 
                      ? 'bg-red-900/20 border-red-800 text-red-300' 
                      : 'bg-red-50 border-red-200 text-red-700'
                  } border rounded-xl p-4`}>
                    <p className="text-sm text-center">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full bg-[#BCE953] text-black font-semibold py-3 px-6 rounded-xl hover:bg-[#BCE953]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2`}
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>

                <div className="text-center">
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Already have an account?{' '}
                    <button
                      onClick={() => setIsSignUp(false)}
                      className="text-[#BCE953] hover:text-[#BCE953]/80 font-medium transition-colors"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Sign In Form - Desktop */}
          <div className={`absolute top-0 h-full w-1/2 transition-all duration-700 ease-in-out left-0 z-[2] ${
            isSignUp ? 'transform translate-x-full' : ''
          }`}>
            <form onSubmit={handleSubmit} className={`${
              isDark 
                ? 'bg-black/95 backdrop-blur-xl' 
                : 'bg-white/95 backdrop-blur-xl'
            } flex items-center justify-center flex-col px-12 h-full`}>
              <div className="max-w-md w-full space-y-6">
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
                    isDark ? 'bg-[#BCE953]' : 'bg-[#BCE953]'
                  }`}>
                    <GraduationCap className="h-8 w-8 text-black" />
                  </div>
                  <h1 className={`text-4xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Welcome Back</h1>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Sign in to your AUT Handshake account
                  </p>
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
                    className={`w-full p-4 rounded-full border-2 transition-all duration-200 flex items-center justify-center space-x-3 ${
                      formData.role === 'student'
                        ? 'border-[#BCE953] bg-[#BCE953] text-black'
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
                        ? 'border-[#BCE953] bg-[#BCE953] text-black'
                        : isDark
                          ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <Building2 className="h-5 w-5" />
                    <span className="font-medium">Continue as Employer</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={handleChange('email')}
                      placeholder="Email"
                      className={`w-full px-4 py-4 text-lg ${
                        isDark 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      } border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BCE953] focus:border-[#BCE953] transition-all`}
                    />
                    <Mail className={`absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange('password')}
                      placeholder="Password"
                      className={`w-full px-4 py-4 text-lg ${
                        isDark 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      } border rounded-xl pr-12 focus:outline-none focus:ring-2 focus:ring-[#BCE953] focus:border-[#BCE953] transition-all`}
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

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={handleChange('rememberMe')}
                        className={`w-4 h-4 rounded ${
                          isDark 
                            ? 'bg-gray-800 border-gray-600 text-[#BCE953]' 
                            : 'bg-white border-gray-300 text-[#BCE953]'
                        }`}
                      />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        Remember me
                      </span>
                    </label>
                    <Link 
                      to="/forgot-password" 
                      className="text-[#BCE953] hover:text-[#BCE953]/80 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {error && (
                  <div className={`${
                    isDark 
                      ? 'bg-red-900/20 border-red-800 text-red-300' 
                      : 'bg-red-50 border-red-200 text-red-700'
                  } border rounded-xl p-4`}>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-[#BCE953] text-black font-semibold py-3 px-6 rounded-xl hover:bg-[#BCE953]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2`}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>

                <div className="text-center">
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Don't have an account?{' '}
                    <button
                      onClick={() => setIsSignUp(true)}
                      className="text-[#BCE953] hover:text-[#BCE953]/80 font-medium transition-colors"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Toggle Container - Desktop Fullscreen */}
          <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 ease-in-out z-[1000] ${
            isSignUp ? 'transform -translate-x-full' : ''
          }`}>
            <div className={`bg-gradient-to-br from-[#BCE953] via-[#BCE953]/90 to-[#BCE953]/80 h-full text-black relative -left-full w-[200%] transition-all duration-700 ease-in-out ${
              isSignUp ? 'transform translate-x-1/2' : 'transform translate-x-0'
            }`}>
              
              {/* Toggle Left Panel */}
              <div className={`absolute w-1/2 h-full flex items-center justify-center flex-col px-12 text-center top-0 transition-all duration-700 ease-in-out ${
                isSignUp ? 'transform translate-x-0' : 'transform -translate-x-[200%]'
              }`}>
                <div className="max-w-md space-y-6">
                  <div className="mb-8">
                    <GraduationCap className="w-24 h-24 mx-auto mb-6 text-black/90" />
                    <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                    <p className="text-lg text-black/80 leading-relaxed">
                      Enter your personal details to access your AUT Handshake account and continue your career journey.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSignUp(false)}
                    className="bg-transparent border-2 border-black text-black font-semibold py-3 px-8 rounded-xl hover:bg-black hover:text-[#BCE953] transition-all duration-300 transform hover:scale-105"
                  >
                    Sign In
                  </button>
                </div>
              </div>

              {/* Toggle Right Panel */}
              <div className={`absolute w-1/2 h-full flex items-center justify-center flex-col px-12 text-center top-0 right-0 transition-all duration-700 ease-in-out ${
                isSignUp ? 'transform translate-x-[200%]' : 'transform translate-x-0'
              }`}>
                <div className="max-w-md space-y-6">
                  <div className="mb-8">
                    <GraduationCap className="w-24 h-24 mx-auto mb-6 text-black/90" />
                    <h1 className="text-4xl font-bold mb-4">Hello, Student!</h1>
                    <p className="text-lg text-black/80 leading-relaxed">
                      Register with your AUT details to create your Handshake account and start connecting with opportunities.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSignUp(true)}
                    className="bg-transparent border-2 border-black text-black font-semibold py-3 px-8 rounded-xl hover:bg-black hover:text-[#BCE953] transition-all duration-300 transform hover:scale-105"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Keep existing mobile layout */}
      <div className="md:hidden min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6">
        
        {/* Temporary Supabase Test - Remove after debugging */}
        <div className="mb-8">
          <SupabaseTest />
        </div>
        
        <div className="min-h-screen flex">
          {/* Left Side - Form */}
          <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 max-w-md mx-auto lg:max-w-none">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              {/* Logo */}
              <div className="text-center mb-8">
                <div className={`w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center ${
                  isDark ? 'bg-[#BCE953]' : 'bg-asu-maroon'
                }`}>
                  <GraduationCap className={`h-6 w-6 ${isDark ? 'text-black' : 'text-white'}`} />
                </div>
                <h1 className="text-3xl font-bold mb-2">Sign in</h1>
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
                      ? 'bg-[#BCE953] text-dark-surface hover:bg-[#BCE953]/90 disabled:bg-gray-800 disabled:text-gray-500'
                      : 'bg-[#BCE953] text-dark-surface hover:bg-[#BCE953]/90 disabled:bg-gray-300 disabled:text-gray-500'
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
                          ? 'bg-gray-800 border-gray-600 text-[#BCE953]' 
                          : 'bg-white border-gray-300 text-[#BCE953]'
                      }`}
                    />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      Remember me
                    </span>
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className={`font-medium hover:underline ${
                      isDark ? 'text-[#BCE953]' : 'text-[#BCE953]'
                    }`}
                  >
                    Forgot password?
                  </Link>
                </div>
              </form>

              <div className="text-center">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsSignUp(true)}
                    className="text-[#BCE953] hover:text-[#BCE953]/80 font-medium transition-colors"
                  >
                    Sign up
                  </button>
                </p>
              </div>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Don't have an account?{' '}
                  <Link 
                    to={`/register?role=${formData.role}`}
                    className={`font-medium hover:underline ${
                      isDark ? 'text-[#BCE953]' : 'text-[#BCE953]'
                    }`}
                  >
                    Sign up
                  </Link>
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Desktop only with enhanced fullscreen animation */}
          <div className="hidden lg:flex relative flex-1 overflow-hidden">
            {/* Background Pattern */}
            <div className={`absolute inset-0 ${
              isDark 
                ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' 
                : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200'
            }`}>
              <div className="absolute inset-0 opacity-10">
                <div className={`absolute top-20 left-20 w-72 h-72 ${
                  isDark ? 'bg-[#BCE953]' : 'bg-[#BCE953]'
                } rounded-full blur-3xl`}></div>
                <div className={`absolute bottom-20 right-20 w-96 h-96 ${
                  isDark ? 'bg-[#BCE953]' : 'bg-[#BCE953]'
                } rounded-full blur-3xl`}></div>
                <div className={`absolute top-1/2 left-1/2 w-64 h-64 ${
                  isDark ? 'bg-[#BCE953]' : 'bg-[#BCE953]'
                } rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2`}></div>
              </div>
            </div>

            {/* Main Container with Sliding Animation */}
            <div className={`relative ${
              isDark 
                ? 'bg-black/95 backdrop-blur-xl' 
                : 'bg-white/95 backdrop-blur-xl'
            } shadow-2xl overflow-hidden w-full h-full`}>
              
              {/* Student Images Grid with Animation */}
              <div className="absolute inset-0 p-8 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 max-w-md w-full">
                  <div className="space-y-4">
                    <div className="relative overflow-hidden rounded-2xl shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-500">
                      <img 
                        src="/student1.jpg" 
                        alt="Student studying" 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl shadow-lg transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                      <img 
                        src="/student2.jpg" 
                        alt="Students collaborating" 
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="relative overflow-hidden rounded-2xl shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                      <img 
                        src="/student3.jpg" 
                        alt="Student presenting" 
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-500">
                      <img 
                        src="/student1.jpg" 
                        alt="Students learning" 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content overlay with enhanced animation */}
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className={`${
                  isDark 
                    ? 'bg-black/40 backdrop-blur-sm border border-[#BCE953]/20' 
                    : 'bg-white/40 backdrop-blur-sm border border-[#BCE953]/20'
                } rounded-2xl p-8 max-w-sm transform transition-all duration-700 hover:scale-105`}>
                  <div className={`w-16 h-16 rounded-full mb-6 flex items-center justify-center mx-auto ${
                    isDark ? 'bg-[#BCE953]' : 'bg-[#BCE953]'
                  }`}>
                    <GraduationCap className={`h-8 w-8 ${
                      isDark ? 'text-black' : 'text-black'
                    }`} />
                  </div>
                  
                  <h2 className={`text-2xl font-bold mb-4 text-center ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Join Your Peers
                  </h2>
                  
                  <p className={`text-sm mb-6 text-center ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Connect with fellow AUT students and launch your career.
                  </p>

                  {/* Stats with animation */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center transform transition-all duration-300 hover:scale-110">
                      <div className={`text-xl font-bold ${
                        isDark ? 'text-[#BCE953]' : 'text-[#BCE953]'
                      }`}>
                        15k+
                      </div>
                      <div className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Students
                      </div>
                    </div>
                    <div className="text-center transform transition-all duration-300 hover:scale-110">
                      <div className={`text-xl font-bold ${
                        isDark ? 'text-[#BCE953]' : 'text-[#BCE953]'
                      }`}>
                        2.5k+
                      </div>
                      <div className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Jobs
                      </div>
                    </div>
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