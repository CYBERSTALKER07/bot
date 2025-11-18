import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  User, 
  Building2, 
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  GraduationCap,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'employer',
    companyName: '',
    agreeToTerms: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const { signUp } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Set role from URL params
  React.useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'employer' || roleParam === 'student') {
      setFormData(prev => ({ ...prev, role: roleParam as 'student' | 'employer' }));
    }
  }, [searchParams]);

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'agreeToTerms' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    setError('');
    setSuccess('');
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (formData.role === 'employer' && !formData.companyName.trim()) {
      errors.companyName = 'Company name is required for employers';
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
      
      const { error } = await signUp(formData.email, formData.password, {
        full_name: fullName,
        username: formData.email.split('@')[0],
        role: formData.role
      });
      
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      
      setSuccess('Registration successful! Please check your email to confirm your account before signing in.');
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigate(`/login?role=${formData.role}`);
      }, 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 max-w-2xl mx-auto lg:max-w-none">
          <div className="mx-auto w-full max-w-md lg:w-full">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className={`w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center ${
                isDark ? 'bg-[#BCE953]' : 'bg-[#BCE953]'
              }`}>
                <GraduationCap className="h-6 w-6 text-black" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Create your account</h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Join the AUT community and start connecting with opportunities
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">I am a:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-3 ${
                      formData.role === 'student'
                        ? 'border-[#BCE953] bg-[#BCE953] text-black'
                        : isDark
                          ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Student</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'employer' }))}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-3 ${
                      formData.role === 'employer'
                        ? 'border-[#BCE953] bg-[#BCE953] text-black'
                        : isDark
                          ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <Building2 className="h-5 w-5" />
                    <span className="font-medium">Employer</span>
                  </button>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange('firstName')}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      validationErrors.firstName
                        ? 'border-red-500 focus:border-red-500'
                        : isDark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#BCE953]'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#BCE953]'
                    } focus:outline-none focus:ring-2 focus:ring-[#BCE953]/20`}
                  />
                  {validationErrors.firstName && (
                    <p className="text-red-500 text-sm flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{validationErrors.firstName}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange('lastName')}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      validationErrors.lastName
                        ? 'border-red-500 focus:border-red-500'
                        : isDark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#BCE953]'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#BCE953]'
                    } focus:outline-none focus:ring-2 focus:ring-[#BCE953]/20`}
                  />
                  {validationErrors.lastName && (
                    <p className="text-red-500 text-sm flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{validationErrors.lastName}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange('email')}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      validationErrors.email
                        ? 'border-red-500 focus:border-red-500'
                        : isDark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#BCE953]'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#BCE953]'
                    } focus:outline-none focus:ring-2 focus:ring-[#BCE953]/20`}
                  />
                  <Mail className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
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

              {/* Company Name (for employers) */}
              {formData.role === 'employer' && (
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={handleChange('companyName')}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      validationErrors.companyName
                        ? 'border-red-500 focus:border-red-500'
                        : isDark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#BCE953]'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#BCE953]'
                    } focus:outline-none focus:ring-2 focus:ring-[#BCE953]/20`}
                  />
                  {validationErrors.companyName && (
                    <p className="text-red-500 text-sm flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{validationErrors.companyName}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Password Fields */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange('password')}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors pr-12 ${
                        validationErrors.password
                          ? 'border-red-500 focus:border-red-500'
                          : isDark
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#BCE953]'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#BCE953]'
                      } focus:outline-none focus:ring-2 focus:ring-[#BCE953]/20`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
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

                <div className="space-y-1">
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange('confirmPassword')}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors pr-12 ${
                        validationErrors.confirmPassword
                          ? 'border-red-500 focus:border-red-500'
                          : isDark
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#BCE953]'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#BCE953]'
                      } focus:outline-none focus:ring-2 focus:ring-[#BCE953]/20`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="text-red-500 text-sm flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{validationErrors.confirmPassword}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-1">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleChange('agreeToTerms')}
                    className={`mt-1 w-4 h-4 rounded ${
                      isDark 
                        ? 'bg-gray-800 border-gray-600 text-[#BCE953]' 
                        : 'bg-white border-gray-300 text-[#BCE953]'
                    }`}
                  />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    I agree to the{' '}
                    <Link to="/terms" className="text-[#BCE953] hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-[#BCE953] hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {validationErrors.agreeToTerms && (
                  <p className="text-red-500 text-sm flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{validationErrors.agreeToTerms}</span>
                  </p>
                )}
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
                  <span>Creating account...</span>
                ) : (
                  <>
                    <span>Create account</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Already have an account?{' '}
                <Link 
                  to={`/login?role=${formData.role}`}
                  className="text-[#BCE953] hover:underline font-medium"
                >
                  Sign in
                </Link>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Visual Content (Desktop only) */}
        <div className="hidden lg:flex relative flex-1 overflow-hidden">
          <div className={`absolute inset-0 ${
            isDark 
              ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' 
              : 'bg-gradient-to-br from-info-600 via-purple-600 to-indigo-600'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#BCE953]/20 to-transparent"></div>
          </div>
          
          <div className="relative z-10 flex flex-col justify-center items-center h-full p-12 text-white">
            <div className="max-w-md text-center">
              <GraduationCap className="w-24 h-24 mx-auto mb-8 text-[#BCE953]" />
              <h2 className="text-4xl font-bold mb-6">
                {formData.role === 'student' ? 'Launch Your Career' : 'Find Top Talent'}
              </h2>
              <p className="text-xl mb-8 text-gray-200">
                {formData.role === 'student' 
                  ? 'Connect with leading employers and discover opportunities that match your skills and interests.'
                  : 'Access a pool of talented students and graduates from AUT University.'
                }
              </p>
              
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-[#BCE953] mb-2">15k+</div>
                  <div className="text-sm text-gray-300">
                    {formData.role === 'student' ? 'Students' : 'Active Students'}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#BCE953] mb-2">2.5k+</div>
                  <div className="text-sm text-gray-300">
                    {formData.role === 'student' ? 'Job Opportunities' : 'Companies'}
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