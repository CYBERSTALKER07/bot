import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail,
  ArrowRight,
  AlertCircle,
  GraduationCap,
  Check,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { resetPassword } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess('Password reset instructions have been sent to your email address.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center ${
              isDark ? 'bg-[#BCE953]' : 'bg-[#BCE953]'
            }`}>
              <GraduationCap className="h-6 w-6 text-black" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Reset your password</h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#BCE953]'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#BCE953]'
                  } focus:outline-hidden focus:ring-2 focus:ring-[#BCE953]/20`}
                />
                <Mail className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
            </div>

            {/* Error/Success Messages */}
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

            {success && (
              <div className={`p-4 rounded-lg border ${
                isDark 
                  ? 'bg-green-900/20 border-green-800 text-green-300' 
                  : 'bg-green-50 border-green-200 text-green-700'
              }`}>
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5" />
                  <span>{success}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-lg font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#BCE953] hover:bg-[#BCE953]/90 text-black'
              }`}
            >
              {loading ? (
                <span>Sending...</span>
              ) : (
                <>
                  <span>Send reset instructions</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          {/* Back to Sign In */}
          <div className="text-center">
            <Link 
              to="/login"
              className={`inline-flex items-center space-x-2 text-sm font-medium transition-colors ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}