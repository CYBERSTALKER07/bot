import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GraduationCap, User, Building2, Eye, EyeOff, CheckCircle, Star, TrendingUp, Zap, Award, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'employer'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'employer') {
      setRole('employer');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (role === 'student' && !email.endsWith('@asu.edu')) {
      setError('Students must use an ASU email address');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, role);
      // Show success message for email confirmation
      setError('');
      alert('Registration successful! Please check your email to confirm your account, then you can log in.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex overflow-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg' 
        : 'bg-gradient-to-br from-red-900 via-red-800 to-gray-900'
    }`}>
      <div className={`w-full max-w-none shadow-2xl flex transition-colors duration-300 ${
        isDark ? 'bg-dark-surface' : 'bg-white'
      }`}>
        {/* Left Side - Registration Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
                <div className="relative">
                  <GraduationCap className={`h-10 w-10 transition-colors ${
                    isDark ? 'text-lime group-hover:text-dark-accent' : 'text-red-800 group-hover:text-red-700'
                  }`} />
                  <Sparkles className={`absolute -top-1 -right-1 h-4 w-4 ${
                    isDark ? 'text-lime' : 'text-yellow-500'
                  }`} />
                </div>
                <span className={`font-bold text-2xl transition-colors ${
                  isDark 
                    ? 'text-dark-text group-hover:text-lime' 
                    : 'text-gray-900 group-hover:text-red-800'
                }`}>ASU Handshake</span>
              </Link>
              <h1 className={`text-4xl font-bold mb-3 transition-colors ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}>Create Your Account</h1>
              <p className={`text-lg transition-colors ${
                isDark ? 'text-dark-muted' : 'text-gray-600'
              }`}>Join the ASU community and launch your career journey</p>
            </div>

            {/* Role Selection */}
            <div className={`flex rounded-xl p-2 mb-8 shadow-inner transition-colors duration-300 ${
              isDark ? 'bg-dark-bg' : 'bg-gray-100'
            }`}>
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-lg transition-all duration-300 font-medium ${
                  role === 'student'
                    ? isDark 
                      ? 'bg-lime text-dark-surface shadow-lg border-2 border-lime/20' 
                      : 'bg-white text-red-800 shadow-lg border-2 border-red-100'
                    : isDark 
                      ? 'text-dark-muted hover:text-dark-text hover:bg-dark-surface/50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <User className="h-5 w-5" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('employer')}
                className={`flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-lg transition-all duration-300 font-medium ${
                  role === 'employer'
                    ? isDark 
                      ? 'bg-lime text-dark-surface shadow-lg border-2 border-lime/20' 
                      : 'bg-white text-red-800 shadow-lg border-2 border-red-100'
                    : isDark 
                      ? 'text-dark-muted hover:text-dark-text hover:bg-dark-surface/50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Building2 className="h-5 w-5" />
                <span>Employer</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className={`block text-sm font-semibold mb-3 transition-colors ${
                  isDark ? 'text-dark-text' : 'text-gray-700'
                }`}>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 text-lg ${
                    isDark 
                      ? 'border-lime/20 focus:ring-lime/20 focus:border-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                      : 'border-gray-200 focus:ring-red-100 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder={role === 'student' ? 'your.name@asu.edu' : 'recruiter@company.com'}
                />
                {role === 'student' && (
                  <p className={`text-sm mt-2 flex items-center transition-colors ${
                    isDark ? 'text-dark-muted' : 'text-gray-500'
                  }`}>
                    <CheckCircle className={`h-4 w-4 mr-1 ${
                      isDark ? 'text-lime' : 'text-green-500'
                    }`} />
                    Must use your ASU email address
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className={`block text-sm font-semibold mb-3 transition-colors ${
                  isDark ? 'text-dark-text' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 pr-14 transition-all duration-300 text-lg ${
                      isDark 
                        ? 'border-lime/20 focus:ring-lime/20 focus:border-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                        : 'border-gray-200 focus:ring-red-100 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors p-1 ${
                      isDark ? 'text-dark-muted hover:text-dark-text' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className={`block text-sm font-semibold mb-3 transition-colors ${
                  isDark ? 'text-dark-text' : 'text-gray-700'
                }`}>
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 text-lg ${
                    isDark 
                      ? 'border-lime/20 focus:ring-lime/20 focus:border-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                      : 'border-gray-200 focus:ring-red-100 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Confirm your password"
                />
              </div>

              {error && (
                <div className={`border-2 px-6 py-4 rounded-xl text-sm flex items-center space-x-2 transition-colors ${
                  isDark 
                    ? 'bg-red-900/20 border-red-500/30 text-red-300' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    isDark ? 'bg-red-400' : 'bg-red-500'
                  }`}></div>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-8 rounded-xl focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg relative overflow-hidden group ${
                  isDark 
                    ? 'bg-gradient-to-r from-lime to-dark-accent text-dark-surface hover:shadow-2xl focus:ring-lime/20' 
                    : 'bg-gradient-to-r from-red-800 to-red-900 text-white hover:shadow-2xl focus:ring-red-100'
                }`}
              >
                <span className="relative z-10">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </span>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isDark 
                    ? 'bg-gradient-to-r from-dark-accent/20 to-transparent' 
                    : 'bg-gradient-to-r from-yellow-400/20 to-transparent'
                }`}></div>
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className={`text-lg transition-colors ${
                isDark ? 'text-dark-muted' : 'text-gray-600'
              }`}>
                Already have an account?{' '}
                <Link
                  to={`/login?role=${role}`}
                  className={`font-semibold transition-colors hover:underline ${
                    isDark ? 'text-lime hover:text-dark-accent' : 'text-red-800 hover:text-red-700'
                  }`}
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Hero Section */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <div className={`absolute inset-0 transition-colors duration-300 ${
            isDark 
              ? 'bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg' 
              : 'bg-gradient-to-br from-red-800 via-red-900 to-gray-900'
          }`}></div>
          
          {/* Real Campus/Student Image */}
          <div className={`absolute inset-0 bg-cover bg-center bg-no-repeat ${
            isDark ? 'opacity-20' : 'opacity-80'
          }`} 
               style={{
                 backgroundImage: isDark 
                   ? 'none' 
                   : `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`
               }}>
          </div>
          
          {/* Overlay Content */}
          <div className={`absolute inset-0 flex flex-col justify-center items-center p-12 ${
            isDark ? 'bg-dark-surface/80' : 'bg-black/40'
          }`}>
            <div className="text-center max-w-md">
              <h2 className={`text-4xl font-bold mb-6 leading-tight transition-colors ${
                isDark ? 'text-dark-text' : 'text-white'
              }`}>
                Join <span className={`${
                  isDark ? 'text-lime' : 'text-yellow-400'
                }`}>15,000+</span> ASU Students
              </h2>
              <p className={`text-xl mb-8 leading-relaxed transition-colors ${
                isDark ? 'text-dark-muted' : 'text-gray-200'
              }`}>
                Start your career journey with Arizona State University's premier job platform
              </p>

              {/* Static Success Statistics */}
              <div className="space-y-4">
                <div className={`backdrop-blur-xl rounded-2xl p-6 border transition-colors ${
                  isDark 
                    ? 'bg-dark-surface/30 border-lime/30' 
                    : 'bg-white/15 border-white/30'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-lime' : 'bg-yellow-400'
                    }`}>
                      <CheckCircle className={`h-8 w-8 ${
                        isDark ? 'text-dark-surface' : 'text-red-900'
                      }`} />
                    </div>
                    <div className="text-left">
                      <div className={`text-3xl font-bold ${
                        isDark ? 'text-lime' : 'text-yellow-400'
                      }`}>95%</div>
                      <div className={`font-medium ${
                        isDark ? 'text-dark-text' : 'text-yellow-300'
                      }`}>Success Rate</div>
                    </div>
                  </div>
                </div>

                <div className={`backdrop-blur-xl rounded-2xl p-6 border transition-colors ${
                  isDark 
                    ? 'bg-dark-surface/30 border-lime/30' 
                    : 'bg-white/15 border-white/30'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-dark-accent' : 'bg-green-500'
                    }`}>
                      <TrendingUp className={`h-8 w-8 ${
                        isDark ? 'text-dark-surface' : 'text-white'
                      }`} />
                    </div>
                    <div className="text-left">
                      <div className={`text-3xl font-bold ${
                        isDark ? 'text-dark-accent' : 'text-green-300'
                      }`}>2,000+</div>
                      <div className={`font-medium ${
                        isDark ? 'text-dark-text' : 'text-green-200'
                      }`}>Job Opportunities</div>
                    </div>
                  </div>
                </div>

                <div className={`backdrop-blur-xl rounded-2xl p-6 border transition-colors ${
                  isDark 
                    ? 'bg-dark-surface/30 border-lime/30' 
                    : 'bg-white/15 border-white/30'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-blue-400' : 'bg-blue-500'
                    }`}>
                      <Star className={`h-8 w-8 ${
                        isDark ? 'text-dark-surface' : 'text-white'
                      }`} />
                    </div>
                    <div className="text-left">
                      <div className={`text-3xl font-bold ${
                        isDark ? 'text-blue-400' : 'text-blue-300'
                      }`}>500+</div>
                      <div className={`font-medium ${
                        isDark ? 'text-dark-text' : 'text-blue-200'
                      }`}>Top Companies</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className={`mt-8 rounded-2xl p-6 backdrop-blur-sm border transition-colors ${
                isDark 
                  ? 'bg-lime/20 border-lime/40' 
                  : 'bg-yellow-400/20 border-yellow-400/40'
              }`}>
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <Zap className={`h-7 w-7 ${
                    isDark ? 'text-lime' : 'text-yellow-400'
                  }`} />
                  <span className={`font-bold text-xl ${
                    isDark ? 'text-lime' : 'text-yellow-400'
                  }`}>Get Started in 2 Minutes</span>
                </div>
                <p className={`${
                  isDark ? 'text-dark-muted' : 'text-gray-200'
                }`}>
                  Join thousands of ASU students who've found their dream careers
                </p>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className={`absolute bottom-8 left-8 rounded-xl p-4 shadow-xl transition-colors ${
              isDark ? 'bg-dark-surface/95' : 'bg-white/95'
            }`}>
              <div className="flex items-center space-x-3">
                <Award className={`h-6 w-6 ${
                  isDark ? 'text-lime' : 'text-red-800'
                }`} />
                <span className={`text-sm font-bold ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>Award Winning Platform</span>
              </div>
            </div>

            {/* Floating badge */}
            <div className={`absolute top-8 right-8 rounded-full p-3 shadow-lg ${
              isDark ? 'bg-lime/90' : 'bg-yellow-400/90'
            }`}>
              <Sparkles className={`h-6 w-6 ${
                isDark ? 'text-dark-surface' : 'text-red-900'
              }`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}