import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GraduationCap, User, Building2, Eye, EyeOff, CheckCircle, Star, TrendingUp, Zap, Award, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'employer'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
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
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-gray-900 flex overflow-hidden">
      <div className="w-full max-w-none bg-white shadow-2xl flex">
        {/* Left Side - Registration Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
                <div className="relative">
                  <GraduationCap className="h-10 w-10 text-red-800 group-hover:text-red-700 transition-colors" />
                  <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
                </div>
                <span className="font-bold text-2xl text-gray-900 group-hover:text-red-800 transition-colors">ASU Handshake</span>
              </Link>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Create Your Account</h1>
              <p className="text-gray-600 text-lg">Join the ASU community and launch your career journey</p>
            </div>

            {/* Role Selection */}
            <div className="flex rounded-xl bg-gray-100 p-2 mb-8 shadow-inner">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-lg transition-all duration-300 font-medium ${
                  role === 'student'
                    ? 'bg-white text-red-800 shadow-lg border-2 border-red-100'
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
                    ? 'bg-white text-red-800 shadow-lg border-2 border-red-100'
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
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-300 text-lg"
                  placeholder={role === 'student' ? 'your.name@asu.edu' : 'recruiter@company.com'}
                />
                {role === 'student' && (
                  <p className="text-sm text-gray-500 mt-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    Must use your ASU email address
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 pr-14 transition-all duration-300 text-lg"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-3">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-300 text-lg"
                  placeholder="Confirm your password"
                />
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl text-sm flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-800 to-red-900 text-white py-4 px-8 rounded-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 text-lg">
                Already have an account?{' '}
                <Link
                  to={`/login?role=${role}`}
                  className="text-red-800 hover:text-red-700 font-semibold transition-colors hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Real Image */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-800 via-red-900 to-gray-900"></div>
          
          {/* Real Campus/Student Image */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80" 
               style={{
                 backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`
               }}>
          </div>
          
          {/* Overlay Content */}
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white p-12">
            <div className="text-center max-w-md">
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Join <span className="text-yellow-400">15,000+</span> ASU Students
              </h2>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Start your career journey with Arizona State University's premier job platform
              </p>

              {/* Static Success Statistics */}
              <div className="space-y-4">
                <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-red-900" />
                    </div>
                    <div className="text-left">
                      <div className="text-3xl font-bold text-yellow-400">95%</div>
                      <div className="text-yellow-300 font-medium">Success Rate</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-3xl font-bold text-green-300">2,000+</div>
                      <div className="text-green-200 font-medium">Job Opportunities</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-3xl font-bold text-blue-300">500+</div>
                      <div className="text-blue-200 font-medium">Top Companies</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-8 bg-yellow-400/20 rounded-2xl p-6 backdrop-blur-sm border border-yellow-400/40">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <Zap className="h-7 w-7 text-yellow-400" />
                  <span className="font-bold text-yellow-400 text-xl">Get Started in 2 Minutes</span>
                </div>
                <p className="text-gray-200">
                  Join thousands of ASU students who've found their dream careers
                </p>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="absolute bottom-8 left-8 bg-white/95 rounded-xl p-4 shadow-xl">
              <div className="flex items-center space-x-3">
                <Award className="h-6 w-6 text-red-800" />
                <span className="text-sm font-bold text-gray-900">Award Winning Platform</span>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute top-8 right-8 bg-yellow-400/90 rounded-full p-3 shadow-lg">
              <Sparkles className="h-6 w-6 text-red-900" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}