import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Visibility, 
  VisibilityOff, 
  Person, 
  Business, 
  AutoAwesome,
  EmojiEvents,
  CheckCircle, 
  TrendingUp, 
  Group,
  School
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Typography from '../ui/Typography';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Card } from '../ui/Card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'employer'>('student');
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
              Sign in to continue your career journey
            </Typography>
          </div>

          {/* Role Selection Card */}
          <Card className="p-2 mb-8" variant="outlined">
            <div className="flex">
              <Button
                variant={role === 'student' ? 'contained' : 'text'}
                color="primary"
                startIcon={Person}
                fullWidth
                onClick={() => setRole('student')}
                className="flex-1 mr-1"
              >
                Student
              </Button>
              <Button
                variant={role === 'employer' ? 'contained' : 'text'}
                color="primary"
                startIcon={Business}
                fullWidth
                onClick={() => setRole('employer')}
                className="flex-1 ml-1"
              >
                Employer
              </Button>
            </div>
          </Card>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              variant="outlined"
              fullWidth
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Typography variant="body2" color="textSecondary">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className={`font-medium transition-colors duration-300 ${
                  isDark ? 'text-lime hover:text-dark-accent' : 'text-asu-maroon hover:text-asu-maroon/80'
                }`}
              >
                Sign up
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
                Welcome Back to <span className={`${
                  isDark ? 'text-lime' : 'text-asu-gold'
                }`}>ASU Handshake</span>
              </Typography>
              <Typography 
                variant="subtitle1" 
                className={`mb-8 leading-relaxed ${
                  isDark ? 'text-dark-muted' : 'text-white/90'
                }`}
              >
                Continue building your career with Arizona State University's premier job platform
              </Typography>

              {/* Success Statistics */}
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
                        variant="h4" 
                        className={`font-bold ${
                          isDark ? 'text-dark-text' : 'text-white'
                        }`}
                      >
                        95%
                      </Typography>
                      <Typography 
                        variant="caption" 
                        className={isDark ? 'text-dark-muted' : 'text-white/70'}
                      >
                        Student Success Rate
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
                        variant="h4" 
                        className={`font-bold ${
                          isDark ? 'text-dark-text' : 'text-white'
                        }`}
                      >
                        15,000+
                      </Typography>
                      <Typography 
                        variant="caption" 
                        className={isDark ? 'text-dark-muted' : 'text-white/70'}
                      >
                        Active Users
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
                  Trusted by ASU Students
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