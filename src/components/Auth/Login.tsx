import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  User,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  GraduationCap,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sign In State
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
    role: 'student' as 'student' | 'employer',
    rememberMe: false
  });

  // Sign Up State
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'student' as 'student' | 'employer'
  });

  const { signIn, signUp } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Load saved credentials on mount
  useEffect(() => {
    const rememberMe = localStorage.getItem('rememberMe');
    const savedEmail = localStorage.getItem('savedEmail');

    if (rememberMe === 'true' && savedEmail) {
      setSignInData(prev => ({
        ...prev,
        email: savedEmail,
        rememberMe: true
      }));
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(signInData.email, signInData.password);

      if (error) {
        setError(error.message);
        return;
      }

      // Save remember me preference
      if (signInData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('savedEmail', signInData.email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('savedEmail');
      }

      // Navigate to feed for all users
      navigate('/feed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!signUpData.email || !signUpData.password) {
      setError('Please fill in all fields');
      return;
    }

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
      const username = signUpData.email.split('@')[0].toLowerCase();

      const { error } = await signUp(signUpData.email, signUpData.password, {
        full_name: fullName,
        username: username,
        role: signUpData.role
      });

      if (error) {
        setError(error.message);
        return;
      }

      // After successful sign up, redirect to profile setup
      // This allows users to complete their profile before accessing the main app
      navigate('/profile-setup', { 
        state: { 
          isNewUser: true,
          role: signUpData.role,
          welcomeMessage: `Welcome to AUT Handshake, ${signUpData.firstName}!`
        } 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(
      'min-h-screen',
      isDark ? 'bg-black text-white' : 'bg-snow-white text-foreground'
    )}>
      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen relative">
        {/* Background Pattern */}
        <div className={cn(
          'absolute inset-0',
          isDark
            ? 'bg-gradient-to-br from-neutral-900 via-black to-neutral-900'
            : 'bg-gradient-to-br from-snow-white via-neutral-50 to-neutral-100'
        )}>
          <div className="absolute inset-0 opacity-10">
            <div className={cn(
              'absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl',
              isDark ? 'bg-success' : 'bg-success'
            )}></div>
            <div className={cn(
              'absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl',
              isDark ? 'bg-success' : 'bg-success'
            )}></div>
            <div className={cn(
              'absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2',
              isDark ? 'bg-success' : 'bg-success'
            )}></div>
          </div>
        </div>

        {/* Main Container */}
        <div className={cn(
          'relative shadow-2xl overflow-hidden w-full h-full transition-all duration-700 ease-in-out',
          isDark
            ? 'bg-black/95 backdrop-blur-xl'
            : 'bg-snow-white/95 backdrop-blur-xl'
        )}>

          {/* Sign Up Form */}
          <div className={cn(
            'absolute top-0 h-full w-1/2 transition-all duration-700 ease-in-out',
            isSignUp
              ? 'transform translate-x-full opacity-100 z-[5]'
              : 'left-0 opacity-0 z-[1]'
          )}>
            <form onSubmit={handleSignUp} className={cn(
              'flex items-center justify-center flex-col px-12 h-full',
              isDark
                ? 'bg-black/95 backdrop-blur-xl'
                : 'bg-snow-white/95 backdrop-blur-xl'
            )}>
              <div className="max-w-md w-full space-y-6">
                <div className="text-center mb-8">
                  <div className={cn(
                    'w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center',
                    isDark ? 'bg-success' : 'bg-success'
                  )}>
                    <GraduationCap className="h-8 w-8 text-black" />
                  </div>
                  <h1 className={cn(
                    'text-4xl font-bold mb-4',
                    isDark ? 'text-white' : 'text-foreground'
                  )}>Create Account</h1>
                  <p className={cn(
                    isDark ? 'text-muted-foreground' : 'text-muted-foreground'
                  )}>
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
                      className={cn(
                        'border rounded-xl h-12 px-4 focus:outline-none focus:ring-2 focus:ring-success focus:border-success transition-all',
                        isDark
                          ? 'bg-neutral-800 border-neutral-700 text-white placeholder-muted-foreground'
                          : 'bg-snow-white border-neutral-300 text-foreground placeholder-muted-foreground'
                      )}
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={signUpData.lastName}
                      onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                      required
                      className={cn(
                        'border rounded-xl h-12 px-4 focus:outline-none focus:ring-2 focus:ring-success focus:border-success transition-all',
                        isDark
                          ? 'bg-neutral-800 border-neutral-700 text-white placeholder-muted-foreground'
                          : 'bg-snow-white border-neutral-300 text-foreground placeholder-muted-foreground'
                      )}
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    required
                    className={cn(
                      'w-full border rounded-xl h-12 px-4 focus:outline-none focus:ring-2 focus:ring-success focus:border-success transition-all',
                      isDark
                        ? 'bg-neutral-800 border-neutral-700 text-white placeholder-muted-foreground'
                        : 'bg-snow-white border-neutral-300 text-foreground placeholder-muted-foreground'
                    )}
                  />

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      required
                      className={cn(
                        'w-full border rounded-xl h-12 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-success focus:border-success transition-all',
                        isDark
                          ? 'bg-neutral-800 border-neutral-700 text-white placeholder-muted-foreground'
                          : 'bg-snow-white border-neutral-300 text-foreground placeholder-muted-foreground'
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={cn(
                        'absolute right-4 top-1/2 transform -translate-y-1/2',
                        isDark ? 'text-muted-foreground hover:text-neutral-300' : 'text-muted-foreground hover:text-neutral-700'
                      )}
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
                      className={cn(
                        'w-full border rounded-xl h-12 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-success focus:border-success transition-all',
                        isDark
                          ? 'bg-neutral-800 border-neutral-700 text-white placeholder-muted-foreground'
                          : 'bg-snow-white border-neutral-300 text-foreground placeholder-muted-foreground'
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={cn(
                        'absolute right-4 top-1/2 transform -translate-y-1/2',
                        isDark ? 'text-muted-foreground hover:text-neutral-300' : 'text-muted-foreground hover:text-neutral-700'
                      )}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setSignUpData({ ...signUpData, role: 'student' })}
                      className={cn(
                        'w-full p-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-center space-x-3',
                        signUpData.role === 'student'
                          ? 'border-success bg-success text-black'
                          : isDark
                            ? 'border-neutral-600 text-muted-foreground hover:border-neutral-500'
                            : 'border-neutral-300 text-muted-foreground hover:border-neutral-400'
                      )}
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">I'm a Student</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSignUpData({ ...signUpData, role: 'employer' })}
                      className={cn(
                        'w-full p-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-center space-x-3',
                        signUpData.role === 'employer'
                          ? 'border-success bg-success text-black'
                          : isDark
                            ? 'border-neutral-600 text-muted-foreground hover:border-neutral-500'
                            : 'border-neutral-300 text-muted-foreground hover:border-neutral-400'
                      )}
                    >
                      <Building2 className="h-5 w-5" />
                      <span className="font-medium">I'm an Employer</span>
                    </button>
                  </div>
                </div>

                {error && (
                  <div className={cn(
                    'border rounded-xl p-4',
                    isDark
                      ? 'bg-destructive/10 border-destructive text-destructive'
                      : 'bg-destructive/10 border-destructive text-destructive'
                  )}>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5" />
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-success text-black font-semibold py-3 px-6 rounded-xl hover:bg-success/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className={cn(
                    'text-sm',
                    isDark ? 'text-muted-foreground' : 'text-muted-foreground'
                  )}>
                    Already have an account?{' '}
                    <button
                      onClick={() => {
                        setIsSignUp(false);
                        setError('');
                      }}
                      className="text-success hover:text-success/80 font-medium transition-colors"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Sign In Form */}
          <div className={cn(
            'absolute top-0 h-full w-1/2 transition-all duration-700 ease-in-out left-0 z-[2]',
            isSignUp ? 'transform translate-x-full' : ''
          )}>
            <form onSubmit={handleSignIn} className={cn(
              'flex items-center justify-center flex-col px-12 h-full',
              isDark
                ? 'bg-black/95 backdrop-blur-xl'
                : 'bg-snow-white/95 backdrop-blur-xl'
            )}>
              <div className="max-w-md w-full space-y-6">
                <div className="text-center mb-8">
                  <div className={cn(
                    'w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center',
                    isDark ? 'bg-success' : 'bg-success'
                  )}>
                    <GraduationCap className="h-8 w-8 text-black" />
                  </div>
                  <h1 className={cn(
                    'text-4xl font-bold mb-4',
                    isDark ? 'text-white' : 'text-foreground'
                  )}>Welcome Back</h1>
                  <p className={cn(
                    isDark ? 'text-muted-foreground' : 'text-muted-foreground'
                  )}>
                    Sign in to your AUT Handshake account
                  </p>
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setSignInData({ ...signInData, role: 'student' })}
                    className={cn(
                      'w-full p-4 rounded-full border-2 transition-all duration-200 flex items-center justify-center space-x-3',
                      signInData.role === 'student'
                        ? 'border-success bg-success text-black'
                        : isDark
                          ? 'border-neutral-600 text-muted-foreground hover:border-neutral-500'
                          : 'border-neutral-300 text-muted-foreground hover:border-neutral-400'
                    )}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Continue as Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignInData({ ...signInData, role: 'employer' })}
                    className={cn(
                      'w-full p-4 rounded-full border-2 transition-all duration-200 flex items-center justify-center space-x-3',
                      signInData.role === 'employer'
                        ? 'border-success bg-success text-black'
                        : isDark
                          ? 'border-neutral-600 text-muted-foreground hover:border-neutral-500'
                          : 'border-neutral-300 text-muted-foreground hover:border-neutral-400'
                    )}
                  >
                    <Building2 className="h-5 w-5" />
                    <span className="font-medium">Continue as Employer</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      placeholder="Email"
                      required
                      className={cn(
                        'w-full px-4 py-4 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-success focus:border-success transition-all',
                        isDark
                          ? 'bg-neutral-800 border-neutral-700 text-white placeholder-muted-foreground'
                          : 'bg-snow-white border-neutral-300 text-foreground placeholder-muted-foreground'
                      )}
                    />
                    <Mail className={cn(
                      'absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5',
                      isDark ? 'text-muted-foreground' : 'text-muted-foreground'
                    )} />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      placeholder="Password"
                      required
                      className={cn(
                        'w-full px-4 py-4 text-lg border rounded-xl pr-12 focus:outline-none focus:ring-2 focus:ring-success focus:border-success transition-all',
                        isDark
                          ? 'bg-neutral-800 border-neutral-700 text-white placeholder-muted-foreground'
                          : 'bg-snow-white border-neutral-300 text-foreground placeholder-muted-foreground'
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={cn(
                        'absolute right-4 top-1/2 transform -translate-y-1/2',
                        isDark ? 'text-muted-foreground hover:text-neutral-300' : 'text-muted-foreground hover:text-neutral-700'
                      )}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={signInData.rememberMe}
                        onChange={(e) => setSignInData({ ...signInData, rememberMe: e.target.checked })}
                        className={cn(
                          'w-4 h-4 rounded text-success focus:ring-success',
                          isDark
                            ? 'bg-neutral-800 border-neutral-600'
                            : 'bg-snow-white border-neutral-300'
                        )}
                      />
                      <span className={isDark ? 'text-muted-foreground' : 'text-muted-foreground'}>
                        Remember me
                      </span>
                    </label>
                  </div>
                </div>

                {error && (
                  <div className={cn(
                    'border rounded-xl p-4',
                    isDark
                      ? 'bg-destructive/10 border-destructive text-destructive'
                      : 'bg-destructive/10 border-destructive text-destructive'
                  )}>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-success text-black font-semibold py-3 px-6 rounded-xl hover:bg-success/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className={cn(
                    'text-sm',
                    isDark ? 'text-muted-foreground' : 'text-muted-foreground'
                  )}>
                    Don't have an account?{' '}
                    <button
                      onClick={() => {
                        setIsSignUp(true);
                        setError('');
                      }}
                      className="text-success hover:text-success/80 font-medium transition-colors"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Toggle Container - Animated Panel */}
          <div className={cn(
            'absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 ease-in-out z-[1000]',
            isSignUp ? 'transform -translate-x-full' : ''
          )}>
            <div className={cn(
              'bg-gradient-to-br from-success via-success/90 to-success/80 h-full text-black relative -left-full w-[200%] transition-all duration-700 ease-in-out',
              isSignUp ? 'transform translate-x-1/2' : 'transform translate-x-0'
            )}>

              {/* Toggle Left Panel */}
              <div className={cn(
                'absolute w-1/2 h-full flex items-center justify-center flex-col px-12 text-center top-0 transition-all duration-700 ease-in-out',
                isSignUp ? 'transform translate-x-0' : 'transform -translate-x-[200%]'
              )}>
                <div className="max-w-md space-y-6">
                  <div className="mb-8">
                    <GraduationCap className="w-24 h-24 mx-auto mb-6 text-black/90" />
                    <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                    <p className="text-lg text-black/80 leading-relaxed">
                      Enter your details to access your AUT Handshake account and continue your career journey.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsSignUp(false);
                      setError('');
                    }}
                    className="bg-transparent border-2 border-black text-black font-semibold py-3 px-8 rounded-xl hover:bg-black hover:text-success transition-all duration-300 transform hover:scale-105"
                  >
                    Sign In
                  </button>
                </div>
              </div>

              {/* Toggle Right Panel */}
              <div className={cn(
                'absolute w-1/2 h-full flex items-center justify-center flex-col px-12 text-center top-0 right-0 transition-all duration-700 ease-in-out',
                isSignUp ? 'transform translate-x-[200%]' : 'transform translate-x-0'
              )}>
                <div className="max-w-md space-y-6">
                  <div className="mb-8">
                    <GraduationCap className="w-24 h-24 mx-auto mb-6 text-black/90" />
                    <h1 className="text-4xl font-bold mb-4">Hello, Friend!</h1>
                    <p className="text-lg text-black/80 leading-relaxed">
                      Register with your details to create your Handshake account and start connecting with opportunities.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsSignUp(true);
                      setError('');
                    }}
                    className="bg-transparent border-2 border-black text-black font-semibold py-3 px-8 rounded-xl hover:bg-black hover:text-success transition-all duration-300 transform hover:scale-105"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Simplified */}
      <div className="md:hidden min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className={cn(
              'w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center',
              isDark ? 'bg-success' : 'bg-success'
            )}>
              <GraduationCap className="h-8 w-8 text-black" />
            </div>
            <h1 className={cn(
              'text-3xl font-bold mb-2',
              isDark ? 'text-white' : 'text-foreground'
            )}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className={cn(
              'text-sm',
              isDark ? 'text-muted-foreground' : 'text-muted-foreground'
            )}>
              {isSignUp ? 'Join AUT Handshake today' : 'Sign in to your account'}
            </p>
          </div>

          {isSignUp ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Mobile Sign Up Form - Same fields as desktop */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={signUpData.firstName}
                  onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                  required
                  className={cn(
                    'border rounded-xl h-12 px-4 focus:outline-none focus:ring-2 focus:ring-success',
                    isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300'
                  )}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={signUpData.lastName}
                  onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                  required
                  className={cn(
                    'border rounded-xl h-12 px-4 focus:outline-none focus:ring-2 focus:ring-success',
                    isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300'
                  )}
                />
              </div>

              <input
                type="email"
                placeholder="Email"
                value={signUpData.email}
                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                required
                className={cn(
                  'w-full border rounded-xl h-12 px-4 focus:outline-none focus:ring-2 focus:ring-success',
                  isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300'
                )}
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  required
                  className={cn(
                    'w-full border rounded-xl h-12 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-success',
                    isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
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
                  className={cn(
                    'w-full border rounded-xl h-12 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-success',
                    isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive rounded-xl p-3 text-sm flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-success text-black font-semibold py-3 rounded-xl hover:bg-success/90 transition-all disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <p className="text-center text-sm">
                <span className={isDark ? 'text-muted-foreground' : 'text-muted-foreground'}>
                  Already have an account?{' '}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError('');
                  }}
                  className="text-success font-medium"
                >
                  Sign in
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Mobile Sign In Form */}
              <input
                type="email"
                placeholder="Email"
                value={signInData.email}
                onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                required
                className={cn(
                  'w-full border rounded-xl h-12 px-4 focus:outline-none focus:ring-2 focus:ring-success',
                  isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300'
                )}
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  required
                  className={cn(
                    'w-full border rounded-xl h-12 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-success',
                    isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive rounded-xl p-3 text-sm flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-success text-black font-semibold py-3 rounded-xl hover:bg-success/90 transition-all disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

              <p className="text-center text-sm">
                <span className={isDark ? 'text-muted-foreground' : 'text-muted-foreground'}>
                  Don't have an account?{' '}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError('');
                  }}
                  className="text-success font-medium"
                >
                  Sign up
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}