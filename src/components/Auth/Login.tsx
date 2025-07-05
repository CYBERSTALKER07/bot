import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  User, 
  Building2, 
  Sparkles, 
  Award, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  AutoAwesome,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'employer'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
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
    setLoading(true);

    try {
      await login(email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Try: student@asu.edu or employer@intel.com');
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
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              isDark ? 'bg-lime/20' : 'bg-red-100'
            }`}>
              <Sparkles className={`h-8 w-8 ${isDark ? 'text-lime' : 'text-red-800'}`} />
            </div>
            <h1 className={`text-4xl font-bold mb-3 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}>Welcome Back</h1>
            <p className={`text-lg ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}>Sign in to continue your career journey</p>
          </div>

          {/* Role Selection */}
          <div className={`flex rounded-xl p-2 mb-8 shadow-inner ${
            isDark ? 'bg-dark-surface' : 'bg-gray-100'
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
                    ? 'text-dark-muted hover:text-dark-text hover:bg-dark-bg/50' 
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
                    ? 'text-dark-muted hover:text-dark-text hover:bg-dark-bg/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Building2 className="h-5 w-5" />
              <span>Employer</span>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                  isDark 
                    ? 'border-lime/20 focus:ring-lime focus:border-lime bg-dark-surface text-dark-text placeholder-dark-muted' 
                    : 'border-gray-300 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-4 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                    isDark 
                      ? 'border-lime/20 focus:ring-lime focus:border-lime bg-dark-surface text-dark-text placeholder-dark-muted' 
                      : 'border-gray-300 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-4 flex items-center ${
                    isDark ? 'text-dark-muted hover:text-dark-text' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className={`p-4 rounded-lg border ${
                isDark 
                  ? 'bg-red-900/20 border-red-500/30 text-red-300' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark 
                  ? 'bg-lime text-dark-surface hover:bg-dark-accent focus:ring-lime' 
                  : 'bg-red-800 text-white hover:bg-red-900 focus:ring-red-500'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className={`font-medium transition-colors duration-300 ${
                  isDark ? 'text-lime hover:text-dark-accent' : 'text-red-800 hover:text-red-900'
                }`}
              >
                Sign up
              </Link>
            </span>
          </div>
        </div>
      </div>

      {/* Right Side - Hero */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className={`absolute inset-0 transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-br from-dark-surface via-dark-bg to-dark-surface' 
            : 'bg-gradient-to-br from-red-800 via-red-900 to-red-800'
        }`}>
          <div className={`absolute inset-0 ${
            isDark ? 'bg-lime/5' : 'bg-black/40'
          } flex flex-col justify-center items-center p-12`}>
            <div className="text-center max-w-md">
              <h2 className={`text-4xl font-bold mb-6 leading-tight ${
                isDark ? 'text-dark-text' : 'text-white'
              }`}>
                Welcome Back to <span className={`${
                  isDark ? 'text-lime' : 'text-yellow-400'
                }`}>ASU Handshake</span>
              </h2>
              <p className={`text-xl mb-8 leading-relaxed ${
                isDark ? 'text-dark-muted' : 'text-gray-200'
              }`}>
                Continue building your career with Arizona State University's premier job platform
              </p>

              {/* Static Success Statistics */}
              <div className="space-y-4">
                <div className={`backdrop-blur-xl rounded-2xl p-6 border ${
                  isDark 
                    ? 'bg-dark-surface/15 border-lime/30' 
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
                      <div className={`text-2xl font-bold ${
                        isDark ? 'text-dark-text' : 'text-white'
                      }`}>95%</div>
                      <div className={`text-sm ${
                        isDark ? 'text-dark-muted' : 'text-gray-300'
                      }`}>Student Success Rate</div>
                    </div>
                  </div>
                </div>

                <div className={`backdrop-blur-xl rounded-2xl p-6 border ${
                  isDark 
                    ? 'bg-dark-surface/15 border-lime/30' 
                    : 'bg-white/15 border-white/30'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-lime' : 'bg-yellow-400'
                    }`}>
                      <TrendingUp className={`h-8 w-8 ${
                        isDark ? 'text-dark-surface' : 'text-red-900'
                      }`} />
                    </div>
                    <div className="text-left">
                      <div className={`text-2xl font-bold ${
                        isDark ? 'text-dark-text' : 'text-white'
                      }`}>15,000+</div>
                      <div className={`text-sm ${
                        isDark ? 'text-dark-muted' : 'text-gray-300'
                      }`}>Active Users</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className={`absolute bottom-8 left-8 rounded-xl p-4 shadow-xl ${
              isDark ? 'bg-dark-surface/98' : 'bg-white/95'
            }`}>
              <div className="flex items-center space-x-3">
                <Award className={`h-6 w-6 ${isDark ? 'text-lime' : 'text-red-800'}`} />
                <span className={`text-sm font-bold ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>Trusted by ASU Students</span>
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