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
  School,
  RocketLaunch,
  ArrowForward
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
              Welcome to ASU Handshake
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Sign in to your account to access amazing career opportunities
            </Typography>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your ASU email"
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

          <div className="mt-4 text-center">
            <Typography variant="body2" color="textSecondary" className="text-center">
              By signing in, you agree to our terms of service and privacy policy. 
              Welcome to the ASU career community! 🎓
            </Typography>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Content */}
      <div className={`hidden lg:flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 ${
        isDark 
          ? 'bg-gradient-to-br from-dark-surface via-dark-bg to-gray-900' 
          : 'bg-gradient-to-br from-asu-maroon via-asu-maroon-dark to-gray-900'
      }`}>
        <div className="mx-auto max-w-md text-center">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
            isDark ? 'bg-lime/20' : 'bg-asu-gold/20'
          }`}>
            <EmojiEvents className={`h-12 w-12 ${isDark ? 'text-lime' : 'text-asu-gold'}`} />
          </div>
          <Typography 
            variant="h3" 
            className={`font-bold mb-4 ${isDark ? 'text-dark-text' : 'text-white'}`}
          >
            Your Career Journey Starts Here! 🚀
          </Typography>
          <Typography 
            variant="h6" 
            className={`mb-8 ${isDark ? 'text-dark-muted' : 'text-gray-200'}`}
          >
            Connect with amazing companies, find your dream internship, and launch your career at Arizona State University's most comprehensive job platform! ✨
          </Typography>
          
          {/* Success Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Card 
              className={`p-4 ${isDark ? 'bg-dark-surface' : 'bg-white/10'}`}
              variant="outlined"
            >
              <Typography 
                variant="h4" 
                className={`font-bold ${isDark ? 'text-lime' : 'text-asu-gold'}`}
              >
                15k+
              </Typography>
              <Typography 
                variant="body2" 
                className={`${isDark ? 'text-dark-muted' : 'text-gray-300'}`}
              >
                Happy Students 😊
              </Typography>
            </Card>
            <Card 
              className={`p-4 ${isDark ? 'bg-dark-surface' : 'bg-white/10'}`}
              variant="outlined"
            >
              <Typography 
                variant="h4" 
                className={`font-bold ${isDark ? 'text-lime' : 'text-asu-gold'}`}
              >
                2.5k+
              </Typography>
              <Typography 
                variant="body2" 
                className={`${isDark ? 'text-dark-muted' : 'text-gray-300'}`}
              >
                Dream Jobs 💼
              </Typography>
            </Card>
          </div>
          
          {/* Call to Action */}
          <div className="space-y-4">
            <Typography 
              variant="h6" 
              className={`font-medium ${isDark ? 'text-dark-text' : 'text-white'}`}
            >
              Ready to join the ASU career community? 🌟
            </Typography>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="primary"
              size="large"
              className="shadow-lg hover:shadow-xl transition-shadow duration-200"
              startIcon={<RocketLaunch />}
              endIcon={<ArrowForward />}
            >
              Create Your Account 🎯
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}