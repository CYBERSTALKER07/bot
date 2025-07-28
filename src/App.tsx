import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';
import PerformanceMonitor from './components/ui/PerformanceMonitor';
import Navigation from './components/Navigation';
import PWAInstallBanner from './components/ui/PWAInstallBanner';

// Import Capacitor for platform detection
declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform(): boolean;
      getPlatform(): string;
    };
    gtag?: (command: string, action: string, parameters: any) => void;
  }
}

// PWA Update notification component
const PWAUpdateNotification = () => {
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShowUpdateNotification(true);
      });
    }
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  if (!showUpdateNotification) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-asu-maroon text-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <span>App updated! Reload to see changes.</span>
        <button 
          onClick={handleUpdate}
          className="bg-white text-asu-maroon px-3 py-1 rounded text-sm font-medium"
        >
          Reload
        </button>
      </div>
    </div>
  );
};

// Lazy load components for better performance
const LandingPage = lazy(() => import('./components/LandingPage'));
const Login = lazy(() => import('./components/Auth/Login'));
const Register = lazy(() => import('./components/Auth/Register'));
const ProfileSetup = lazy(() => import('./components/Profile/ProfileSetup'));
const Profile = lazy(() => import('./components/Profile/Profile'));
const Settings = lazy(() => import('./components/Settings'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const SplashScreen = lazy(() => import('./components/SplashScreen'));
const PostJob = lazy(() => import('./components/PostJob'));
const Messages = lazy(() => import('./components/Messages'));
const Applications = lazy(() => import('./components/Applications'));
const Applicants = lazy(() => import('./components/Applicants'));
const Events = lazy(() => import('./components/Events'));
const EventDetails = lazy(() => import('./components/EventDetails'));
const ResourceCenter = lazy(() => import('./components/ResourceCenter'));
const ResourceDetails = lazy(() => import('./components/ResourceDetails'));
const JobDetails = lazy(() => import('./components/JobDetails'));
const MobileAppPage = lazy(() => import('./components/MobileAppPage')); 
const ForStudentsPage = lazy(() => import('./components/ForStudentsPage'));
const ForEmployersPage = lazy(() => import('./components/ForEmployersPage'));
const CareerTipsPage = lazy(() => import('./components/CareerTipsPage'));
const WhosHiringPage = lazy(() => import('./components/WhosHiringPage'));
const DigitalLearningPassport = lazy(() => import('./components/DigitalLearningPassport'));
const SkillsAuditSystem = lazy(() => import('./components/SkillsAuditSystem'));
const Feed = lazy(() => import('./components/Feed'));
const PostDetails = lazy(() => import('./components/PostDetails'));
const CompaniesPage = lazy(() => import('./components/CompaniesPage'));
const CompanyProfile = lazy(() => import('./components/CompanyProfile'));

// New pages
const NotificationsPage = lazy(() => import('./components/NotificationsPage'));
const JobsPage = lazy(() => import('./components/JobsPage'));
const BookmarksPage = lazy(() => import('./components/BookmarksPage'));

// Optimized loading component with better UX
function LoadingFallback({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center transition-colors duration-300">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-asu-maroon dark:text-lime" />
        <span className="text-gray-600 dark:text-dark-muted text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}

// ScrollToTop component to handle automatic scrolling on route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingFallback message="Checking authentication..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Dashboard Router component
function DashboardRouter() {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Suspense fallback={<LoadingFallback message="Loading dashboard..." />}>
      <Dashboard />
    </Suspense>
  );
}

// Utility function to detect if app is running as PWA
const isPWA = () => {
  // Check if running in standalone mode (installed PWA)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  // Check if running through Capacitor (mobile app)
  const isCapacitor = window.Capacitor?.isNativePlatform();
  
  // Check iOS standalone mode
  const isIOSStandalone = (window.navigator as any).standalone === true;
  
  return isStandalone || isCapacitor || isIOSStandalone;
};

// Component to handle smart routing based on PWA vs Web
function SmartHomeRoute() {
  const { user } = useAuth();
  
  // If user is authenticated, go to feed
  if (user) {
    return <Navigate to="/feed" replace />;
  }
  
  // If running as PWA, skip landing page and go to login
  if (isPWA()) {
    return <Navigate to="/login" replace />;
  }
  
  // If running in web browser, show landing page
  return (
    <Suspense fallback={<LoadingFallback message="Loading homepage..." />}>
      <LandingPage />
    </Suspense>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(() => {
    // For iOS, disable splash screen initially to debug
    if (window.Capacitor?.isNativePlatform() && window.Capacitor.getPlatform() === 'ios') {
      return false;
    }
    // Only show splash if user hasn't seen it in this session
    return !sessionStorage.getItem('aut-handshake-splash-seen');
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
    // Store in sessionStorage so it only persists for the current session
    sessionStorage.setItem('aut-handshake-splash-seen', 'true');
  };

  // PWA Service Worker registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('PWA: Service Worker registered successfully:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New update available
                  console.log('PWA: New content available');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.log('PWA: Service Worker registration failed:', error);
        });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SKIP_WAITING') {
          window.location.reload();
        }
      });
    }

    // iOS specific PWA setup
    if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
      document.body.classList.add('pwa-installed');
      
      // Handle iOS safe area
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
      document.head.appendChild(meta);
    }
  }, []);

  // Performance issue handler
  const handlePerformanceIssue = (fps: number) => {
    console.warn(`Performance issue detected: ${fps} FPS. Reducing animation complexity.`);
    
    // You could also send analytics here
    if (window.gtag) {
      window.gtag('event', 'performance_issue', {
        fps: fps,
        timestamp: Date.now()
      });
    }
  };

  // Add error boundary fallback for iOS
  if (showSplash) {
    return (
      <Suspense fallback={<LoadingFallback message="Initializing..." />}>
        <SplashScreen onComplete={handleSplashComplete} />
      </Suspense>
    );
  }

  if (loading) {
    return <LoadingFallback message="Loading application..." />;
  }

  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        {/* X-Style Navigation - only show when user is authenticated */}
        {user && <Navigation />}
        
        <main className="min-h-screen">
          <Routes>
            {/* Public routes with lazy loading */}
            <Route path="/login" element={
              <Suspense fallback={<LoadingFallback message="Loading login..." />}>
                <Login />
              </Suspense>
            } />
            <Route path="/register" element={
              <Suspense fallback={<LoadingFallback message="Loading registration..." />}>
                <Register />
              </Suspense>
            } />
            <Route path="/mobile-app" element={
              <Suspense fallback={<LoadingFallback message="Loading mobile app info..." />}>
                <MobileAppPage />
              </Suspense>
            } />
            <Route path="/for-students" element={
              <Suspense fallback={<LoadingFallback message="Loading student resources..." />}>
                <ForStudentsPage />
              </Suspense>
            } />
            <Route path="/for-employers" element={
              <Suspense fallback={<LoadingFallback message="Loading employer resources..." />}>
                <ForEmployersPage />
              </Suspense>
            } />
            <Route path="/career-tips" element={
              <Suspense fallback={<LoadingFallback message="Loading career tips..." />}>
                <CareerTipsPage />
              </Suspense>
            } />
            <Route path="/whos-hiring" element={
              <Suspense fallback={<LoadingFallback message="Loading hiring info..." />}>
                <WhosHiringPage />
              </Suspense>
            } />
            <Route path="/companies" element={
              <Suspense fallback={<LoadingFallback message="Loading companies..." />}>
                <CompaniesPage />
              </Suspense>
            } />
            <Route path="/company/:companyId" element={
              <Suspense fallback={<LoadingFallback message="Loading company profile..." />}>
                <CompanyProfile />
              </Suspense>
            } />

            {/* Protected routes with lazy loading */}
            <Route path="/feed" element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback message="Loading feed..." />}>
                  <Feed />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } />
            <Route path="/profile-setup" element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback message="Loading profile setup..." />}>
                  <ProfileSetup />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback message="Loading profile..." />}>
                  <Profile />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/job/:jobId" element={
              <Suspense fallback={<LoadingFallback message="Loading job details..." />}>
                <JobDetails />
              </Suspense>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback message="Loading messages..." />}>
                  <Messages />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/applications" element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback message="Loading applications..." />}>
                  <Applications />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/applicants" element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback message="Loading applicants..." />}>
                  <Applicants />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/post-job" element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback message="Loading job posting..." />}>
                  <PostJob />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/events" element={
              <Suspense fallback={<LoadingFallback message="Loading events..." />}>
                <Events />
              </Suspense>
            } />
            <Route path="/event/:eventId" element={
              <Suspense fallback={<LoadingFallback message="Loading event details..." />}>
                <EventDetails />
              </Suspense>
            } />
            <Route path="/resources" element={
              <Suspense fallback={<LoadingFallback message="Loading resources..." />}>
                <ResourceCenter />
              </Suspense>
            } />
            <Route path="/resource/:resourceId" element={
              <Suspense fallback={<LoadingFallback message="Loading resource details..." />}>
                <ResourceDetails />
              </Suspense>
            } />
            <Route path="/digital-passport" element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback message="Loading digital passport..." />}>
                  <DigitalLearningPassport />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/skills-audit" element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback message="Loading skills audit..." />}>
                  <SkillsAuditSystem />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback message="Loading settings..." />}>
                  <Settings />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/post/:postId" element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback message="Loading post details..." />}>
                  <PostDetails />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback message="Loading notifications..." />}>
                  <NotificationsPage />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/jobs" element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback message="Loading jobs..." />}>
                  <JobsPage />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/bookmarks" element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback message="Loading bookmarks..." />}>
                  <BookmarksPage />
                </Suspense>
              </ProtectedRoute>
            } />

            {/* Smart root route - shows landing page for web, redirects to login for PWA */}
            <Route path="/" element={<SmartHomeRoute />} />

            {/* Catch all route - redirect to appropriate home */}
            <Route path="*" element={
              user ? <Navigate to="/feed" replace /> : <Navigate to="/login" replace />
            } />
          </Routes>
        </main>
        
        {/* Performance Monitor - only shows in development */}
        {/* {process.env.NODE_ENV === 'development' && (
          <PerformanceMonitor onPerformanceIssue={handlePerformanceIssue} />
        )} */}
        
        {/* PWA Update Notification */}
        <PWAUpdateNotification />
        
        {/* PWA Install Banner */}
        <PWAInstallBanner />
      </Router>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}