import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Building2,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  X as XIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'landing' | 'signin' | 'signup'>('landing');

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

  // Landing Page (X-style)
  if (step === 'landing') {
    return (
      <div className={cn(
        'min-h-screen flex',
        isDark ? 'bg-black' : 'bg-white'
      )}>
        {/* Left Side - Logo (Hidden on mobile) */}
        <div className={cn(
          'hidden lg:flex flex-1 items-center justify-center',
          isDark ? 'bg-black' : 'bg-white'
        )}>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={cn(
              'w-80 h-80',
              isDark ? 'fill-white' : 'fill-black'
            )}
          >
            <g>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </g>
          </svg>
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-[440px] w-full space-y-12">
            {/* Mobile Logo */}
            <div className="lg:hidden">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={cn(
                  'w-12 h-12',
                  isDark ? 'fill-white' : 'fill-black'
                )}
              >
                <g>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </g>
              </svg>
            </div>

            <h1 className={cn(
              'text-6xl font-bold',
              isDark ? 'text-white' : 'text-black'
            )}>
              Happening now
            </h1>

            <div className="space-y-4">
              <h2 className={cn(
                'text-3xl font-bold mb-8',
                isDark ? 'text-white' : 'text-black'
              )}>
                Join today.
              </h2>

              <button
                onClick={() => setStep('signup')}
                className={cn(
                  'w-full rounded-full py-3 font-bold text-base transition-colors',
                  isDark
                    ? 'bg-white text-black hover:bg-neutral-200'
                    : 'bg-black text-white hover:bg-neutral-800'
                )}
              >
                Create account
              </button>

              <p className={cn(
                'text-xs px-2',
                isDark ? 'text-neutral-500' : 'text-neutral-600'
              )}>
                By signing up, you agree to the{' '}
                <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
              </p>

              <div className="pt-8">
                <p className={cn(
                  'text-base font-bold mb-4',
                  isDark ? 'text-white' : 'text-black'
                )}>
                  Already have an account?
                </p>
                <button
                  onClick={() => setStep('signin')}
                  className={cn(
                    'w-full rounded-full py-3 font-bold text-base border transition-colors',
                    isDark
                      ? 'border-neutral-700 text-blue-500 hover:bg-blue-500/10'
                      : 'border-neutral-300 text-blue-500 hover:bg-blue-50'
                  )}
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sign In Page (X-style)
  if (step === 'signin') {
    return (
      <div className={cn(
        'min-h-screen flex items-center justify-center p-4',
        isDark ? 'bg-black' : 'bg-white'
      )}>
        <div className="max-w-[440px] w-full">
          <div className="mb-8">
            <button
              onClick={() => setStep('landing')}
              className={cn(
                'mb-8 p-2 rounded-full transition-colors',
                isDark ? 'hover:bg-neutral-900' : 'hover:bg-neutral-100'
              )}
            >
              <XIcon className={cn('w-8 h-8', isDark ? 'text-white' : 'text-black')} />
            </button>

            <h1 className={cn(
              'text-3xl font-bold mb-8',
              isDark ? 'text-white' : 'text-black'
            )}>
              Sign in to AUT Handshake
            </h1>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Role Selection */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSignInData({ ...signInData, role: 'student' })}
                className={cn(
                  'flex-1 py-3 px-4 rounded-full font-bold text-sm border transition-all',
                  signInData.role === 'student'
                    ? isDark
                      ? 'bg-white text-black border-white'
                      : 'bg-black text-white border-black'
                    : isDark
                      ? 'border-neutral-700 text-white hover:bg-neutral-900'
                      : 'border-neutral-300 text-black hover:bg-neutral-100'
                )}
              >
                <User className="inline w-4 h-4 mr-2" />
                Student
              </button>
              <button
                type="button"
                onClick={() => setSignInData({ ...signInData, role: 'employer' })}
                className={cn(
                  'flex-1 py-3 px-4 rounded-full font-bold text-sm border transition-all',
                  signInData.role === 'employer'
                    ? isDark
                      ? 'bg-white text-black border-white'
                      : 'bg-black text-white border-black'
                    : isDark
                      ? 'border-neutral-700 text-white hover:bg-neutral-900'
                      : 'border-neutral-300 text-black hover:bg-neutral-100'
                )}
              >
                <Building2 className="inline w-4 h-4 mr-2" />
                Employer
              </button>
            </div>

            <div className="space-y-5">
              <div className="relative">
                <input
                  type="email"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  placeholder=" "
                  required
                  className={cn(
                    'peer w-full px-4 pt-6 pb-2 text-base border rounded outline-none transition-all',
                    isDark
                      ? 'bg-black border-neutral-700 text-white focus:border-blue-500'
                      : 'bg-white border-neutral-300 text-black focus:border-blue-500'
                  )}
                />
                <label
                  className={cn(
                    'absolute left-4 top-4 text-base transition-all pointer-events-none',
                    'peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500',
                    'peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs',
                    isDark ? 'text-neutral-500' : 'text-neutral-600'
                  )}
                >
                  Email
                </label>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  placeholder=" "
                  required
                  className={cn(
                    'peer w-full px-4 pt-6 pb-2 text-base border rounded outline-none transition-all pr-12',
                    isDark
                      ? 'bg-black border-neutral-700 text-white focus:border-blue-500'
                      : 'bg-white border-neutral-300 text-black focus:border-blue-500'
                  )}
                />
                <label
                  className={cn(
                    'absolute left-4 top-4 text-base transition-all pointer-events-none',
                    'peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500',
                    'peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs',
                    isDark ? 'text-neutral-500' : 'text-neutral-600'
                  )}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    'absolute right-4 top-1/2 -translate-y-1/2',
                    isDark ? 'text-neutral-500 hover:text-white' : 'text-neutral-600 hover:text-black'
                  )}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !signInData.email || !signInData.password}
              className={cn(
                'w-full rounded-full py-3 font-bold text-base transition-colors disabled:opacity-50',
                isDark
                  ? 'bg-white text-black hover:bg-neutral-200'
                  : 'bg-black text-white hover:bg-neutral-800'
              )}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>

            <button
              type="button"
              className={cn(
                'w-full rounded-full py-3 font-bold text-base border transition-colors',
                isDark
                  ? 'border-neutral-700 text-white hover:bg-neutral-900'
                  : 'border-neutral-300 text-black hover:bg-neutral-100'
              )}
            >
              Forgot password?
            </button>
          </form>

          <p className={cn(
            'mt-10 text-base',
            isDark ? 'text-neutral-500' : 'text-neutral-600'
          )}>
            Don't have an account?{' '}
            <button
              onClick={() => setStep('signup')}
              className="text-blue-500 hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Sign Up Page (X-style)
  return (
    <div className={cn(
      'min-h-screen flex items-center justify-center p-4',
      isDark ? 'bg-black' : 'bg-white'
    )}>
      <div className="max-w-[440px] w-full">
        <div className="mb-8">
          <button
            onClick={() => setStep('landing')}
            className={cn(
              'mb-8 p-2 rounded-full transition-colors',
              isDark ? 'hover:bg-neutral-900' : 'hover:bg-neutral-100'
            )}
          >
            <XIcon className={cn('w-8 h-8', isDark ? 'text-white' : 'text-black')} />
          </button>

          <h1 className={cn(
            'text-3xl font-bold mb-8',
            isDark ? 'text-white' : 'text-black'
          )}>
            Create your account
          </h1>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          {/* Role Selection */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSignUpData({ ...signUpData, role: 'student' })}
              className={cn(
                'flex-1 py-3 px-4 rounded-full font-bold text-sm border transition-all',
                signUpData.role === 'student'
                  ? isDark
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-black'
                  : isDark
                    ? 'border-neutral-700 text-white hover:bg-neutral-900'
                    : 'border-neutral-300 text-black hover:bg-neutral-100'
              )}
            >
              <User className="inline w-4 h-4 mr-2" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setSignUpData({ ...signUpData, role: 'employer' })}
              className={cn(
                'flex-1 py-3 px-4 rounded-full font-bold text-sm border transition-all',
                signUpData.role === 'employer'
                  ? isDark
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-black'
                  : isDark
                    ? 'border-neutral-700 text-white hover:bg-neutral-900'
                    : 'border-neutral-300 text-black hover:bg-neutral-100'
              )}
            >
              <Building2 className="inline w-4 h-4 mr-2" />
              Employer
            </button>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={signUpData.firstName}
                  onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                  placeholder=" "
                  required
                  className={cn(
                    'peer w-full px-4 pt-6 pb-2 text-base border rounded outline-none transition-all',
                    isDark
                      ? 'bg-black border-neutral-700 text-white focus:border-blue-500'
                      : 'bg-white border-neutral-300 text-black focus:border-blue-500'
                  )}
                />
                <label
                  className={cn(
                    'absolute left-4 top-4 text-base transition-all pointer-events-none',
                    'peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500',
                    'peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs',
                    isDark ? 'text-neutral-500' : 'text-neutral-600'
                  )}
                >
                  First Name
                </label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={signUpData.lastName}
                  onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                  placeholder=" "
                  required
                  className={cn(
                    'peer w-full px-4 pt-6 pb-2 text-base border rounded outline-none transition-all',
                    isDark
                      ? 'bg-black border-neutral-700 text-white focus:border-blue-500'
                      : 'bg-white border-neutral-300 text-black focus:border-blue-500'
                  )}
                />
                <label
                  className={cn(
                    'absolute left-4 top-4 text-base transition-all pointer-events-none',
                    'peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500',
                    'peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs',
                    isDark ? 'text-neutral-500' : 'text-neutral-600'
                  )}
                >
                  Last Name
                </label>
              </div>
            </div>

            <div className="relative">
              <input
                type="email"
                value={signUpData.email}
                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                placeholder=" "
                required
                className={cn(
                  'peer w-full px-4 pt-6 pb-2 text-base border rounded outline-none transition-all',
                  isDark
                    ? 'bg-black border-neutral-700 text-white focus:border-blue-500'
                    : 'bg-white border-neutral-300 text-black focus:border-blue-500'
                )}
              />
              <label
                className={cn(
                  'absolute left-4 top-4 text-base transition-all pointer-events-none',
                  'peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500',
                  'peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs',
                  isDark ? 'text-neutral-500' : 'text-neutral-600'
                )}
              >
                Email
              </label>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={signUpData.password}
                onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                placeholder=" "
                required
                className={cn(
                  'peer w-full px-4 pt-6 pb-2 text-base border rounded outline-none transition-all pr-12',
                  isDark
                    ? 'bg-black border-neutral-700 text-white focus:border-blue-500'
                    : 'bg-white border-neutral-300 text-black focus:border-blue-500'
                )}
              />
              <label
                className={cn(
                  'absolute left-4 top-4 text-base transition-all pointer-events-none',
                  'peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500',
                  'peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs',
                  isDark ? 'text-neutral-500' : 'text-neutral-600'
                )}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  'absolute right-4 top-1/2 -translate-y-1/2',
                  isDark ? 'text-neutral-500 hover:text-white' : 'text-neutral-600 hover:text-black'
                )}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !signUpData.email || !signUpData.password || !signUpData.firstName}
            className={cn(
              'w-full rounded-full py-3 font-bold text-base transition-colors disabled:opacity-50',
              isDark
                ? 'bg-white text-black hover:bg-neutral-200'
                : 'bg-black text-white hover:bg-neutral-800'
            )}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </span>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <p className={cn(
          'mt-10 text-base',
          isDark ? 'text-neutral-500' : 'text-neutral-600'
        )}>
          Already have an account?{' '}
          <button
            onClick={() => setStep('signin')}
            className="text-blue-500 hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}