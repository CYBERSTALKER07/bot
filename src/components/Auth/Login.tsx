import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GraduationCap, User, Building2, Eye, EyeOff, CheckCircle, Star, TrendingUp, Zap, Award, Sparkles, Mail, Lock, ArrowRight, AlertCircle, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'employer'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>();
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'employer') {
      setRole('employer');
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) return;
    
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
    <div className="min-h-screen bg-gradient-to-br from-asu-maroon via-asu-maroon-dark to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-asu-gold/20 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-pulse-gentle animate-delay-200"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-asu-gold/30 rounded-full blur-xl animate-pulse-gentle animate-delay-400"></div>
      </div>

      {/* Floating decorative elements */}
      <Sparkles className="absolute top-20 left-20 h-6 w-6 text-asu-gold/60 animate-bounce-gentle" />
      <Star className="absolute top-32 right-32 h-5 w-5 text-white/50 animate-float" />
      <Heart className="absolute bottom-32 left-32 h-4 w-4 text-asu-gold/70 animate-bounce-gentle animate-delay-300" />
      <Zap className="absolute bottom-20 right-20 h-5 w-5 text-white/60 animate-float animate-delay-500" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="w-20 h-20 bg-gradient-to-br from-asu-gold to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl hover-scale animate-scale-in">
            <Shield className="h-10 w-10 text-asu-maroon" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 animate-slide-up animate-delay-100">
            Welcome Back! 👋
          </h1>
          <p className="text-white/80 text-lg animate-slide-up animate-delay-200">
            Sign in to your ASU Career Hub account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 animate-slide-up animate-delay-300 hover-glow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="animate-slide-right animate-delay-400">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address ✉️
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none transition-all duration-300 input-focus ${
                    errors?.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:border-asu-maroon focus:ring-asu-maroon'
                  }`}
                  placeholder="Enter your email"
                />
                {errors?.email && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 animate-bounce-gentle">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors?.email && (
                <p className="text-red-500 text-sm mt-2 animate-slide-up">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="animate-slide-right animate-delay-500">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password 🔒
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:outline-none transition-all duration-300 input-focus ${
                    errors?.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:border-asu-maroon focus:ring-asu-maroon'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors interactive-button"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors?.password && (
                <p className="text-red-500 text-sm mt-2 animate-slide-up">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between animate-slide-up animate-delay-600">
              <label className="flex items-center space-x-2 cursor-pointer hover-scale">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-asu-maroon border-gray-300 rounded focus:ring-asu-maroon transition-all duration-200"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-asu-maroon hover:text-asu-maroon-dark transition-colors hover-scale"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white py-4 px-6 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 animate-slide-up animate-delay-700 ${
                isLoading 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:from-asu-maroon-dark hover:to-asu-maroon interactive-button hover-scale'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <UserCheck className="h-5 w-5" />
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5 icon-bounce" />
                </>
              )}
            </button>

            {/* Success Message */}
            {email && password && !errors?.email && !errors?.password && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-xl animate-slide-up">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Ready to sign in! 🎉</span>
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="my-8 animate-slide-up animate-delay-800">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or continue with</span>
              </div>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4 animate-slide-up animate-delay-900">
            <button className="flex items-center justify-center space-x-2 bg-white border-2 border-gray-200 py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 interactive-button">
              <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
              <span className="text-sm font-medium text-gray-700">Google</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-white border-2 border-gray-200 py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 interactive-button">
              <div className="w-5 h-5 bg-gradient-to-r from-gray-800 to-gray-900 rounded"></div>
              <span className="text-sm font-medium text-gray-700">GitHub</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-8 animate-slide-up animate-delay-1000">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-asu-maroon hover:text-asu-maroon-dark font-semibold transition-colors hover-scale"
              >
                Sign up here! 🚀
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 animate-slide-up animate-delay-1100">
          <p className="text-white/60 text-sm">
            © 2025 ASU Career Hub. Made with ❤️ for Sun Devils
          </p>
        </div>
      </div>
    </div>
  );
}