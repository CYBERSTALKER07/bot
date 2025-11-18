import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Linkedin, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import PageLayout from '../ui/PageLayout';
import { linkedInJobService } from '../../lib/linkedin-job-service';

export default function LinkedInCallback() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        setError(`LinkedIn authentication failed: ${error}`);
        setStatus('error');
        return;
      }

      if (!code || !state) {
        setError('Missing authorization code or state parameter');
        setStatus('error');
        return;
      }

      // Exchange code for access token
      const accessToken = await linkedInJobService.exchangeCodeForToken(code, state);
      
      // Get user profile to confirm connection
      const profile = await linkedInJobService.getUserProfile();
      setUserProfile(profile);
      
      setStatus('success');
      
      // Redirect to LinkedIn Job Manager after 2 seconds
      setTimeout(() => {
        navigate('/linkedin-job-manager');
      }, 2000);

    } catch (error: any) {
      console.error('LinkedIn callback error:', error);
      setError(error.message || 'Failed to connect to LinkedIn');
      setStatus('error');
    }
  };

  const handleRetry = () => {
    linkedInJobService.initiateAuth();
  };

  const handleContinue = () => {
    navigate('/linkedin-job-manager');
  };

  return (
    <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'} maxWidth="2xl">
      <div className="flex items-center justify-center min-h-96">
        <Card className="p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 mx-auto mb-6 bg-info-100 dark:bg-info-900 rounded-full flex items-center justify-center">
            {status === 'loading' && (
              <Loader2 className="h-8 w-8 text-info-600 dark:text-info-400 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            )}
            {status === 'error' && (
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            )}
          </div>

          {status === 'loading' && (
            <>
              <h2 className="text-2xl font-bold mb-4">Connecting to LinkedIn</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please wait while we verify your LinkedIn connection...
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Linkedin className="h-4 w-4" />
                <span>Authenticating with LinkedIn</span>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
                Successfully Connected!
              </h2>
              {userProfile && (
                <div className="mb-6">
                  <p className="text-lg font-medium">
                    Welcome, {userProfile.firstName} {userProfile.lastName}!
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your LinkedIn account has been connected successfully.
                  </p>
                </div>
              )}
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Redirecting to LinkedIn Job Manager...
              </p>
              <Button
                onClick={handleContinue}
                className="bg-green-600 text-white hover:bg-green-700 w-full"
              >
                Continue to Job Manager
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
                Connection Failed
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error}
              </p>
              <div className="space-y-3">
                <Button
                  onClick={handleRetry}
                  className="bg-info-600 text-white hover:bg-info-700 w-full flex items-center justify-center space-x-2"
                >
                  <Linkedin className="h-4 w-4" />
                  <span>Try Again</span>
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outlined"
                  className="w-full"
                >
                  Back to Dashboard
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}