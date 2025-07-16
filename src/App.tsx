import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProfileSetup from './components/Profile/ProfileSetup';
import Profile from './components/Profile/Profile';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import EmployerDashboard from './components/Dashboard/EmployerDashboard';
import JobDetails from './components/JobDetails';
import Messages from './components/Messages';
import Applications from './components/Applications';
import Applicants from './components/Applicants';
import PostJob from './components/PostJob';
import Events from './components/Events';
import EventDetails from './components/EventDetails';
import ResourceCenter from './components/ResourceCenter';
import ResourceDetails from './components/ResourceDetails';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import SplashScreen from './components/SplashScreen';
import { Loader2 } from 'lucide-react';
import MobileAppPage from './components/MobileAppPage';
import ForStudentsPage from './components/ForStudentsPage';
import ForEmployersPage from './components/ForEmployersPage';
import CareerTipsPage from './components/CareerTipsPage';
import WhosHiringPage from './components/WhosHiringPage';
import DigitalLearningPassport from './components/DigitalLearningPassport';
import SkillsAuditSystem from './components/SkillsAuditSystem';
import Feed from './components/Feed';
import PostDetails from './components/PostDetails';
import CompaniesPage from './components/CompaniesPage';
import CompanyProfile from './components/CompanyProfile';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';

// ScrollToTop component to handle automatic scrolling on route changes
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top whenever the pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center transition-colors duration-300">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-asu-maroon dark:text-lime" />
          <span className="text-gray-600 dark:text-dark-muted">Loading...</span>
        </div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function DashboardRouter() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center transition-colors duration-300">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-asu-maroon dark:text-lime" />
          <span className="text-gray-600 dark:text-dark-muted">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" />;
  
  // Always redirect to Feed as the main page
  return <Navigate to="/feed" />;
}

function AppContent() {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash if user hasn't seen it in this session
    return !sessionStorage.getItem('aut-handshake-splash-seen');
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
    // Store in sessionStorage so it only persists for the current session
    sessionStorage.setItem('aut-handshake-splash-seen', 'true');
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center transition-colors duration-300">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-asu-maroon dark:text-lime" />
          <span className="text-gray-600 dark:text-dark-muted">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      {user && <Navigation />}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/mobile-app" element={<MobileAppPage />} />
        <Route path="/for-students" element={<ForStudentsPage />} />
        <Route path="/for-employers" element={<ForEmployersPage />} />
        <Route path="/career-tips" element={<CareerTipsPage />} />
        <Route path="/whos-hiring" element={<WhosHiringPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
        
        {/* Student Routes */}
        <Route path="/job/:id" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
        <Route path="/job-search" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/event/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><ResourceCenter /></ProtectedRoute>} />
        <Route path="/resource/:id" element={<ProtectedRoute><ResourceDetails /></ProtectedRoute>} />
        
        {/* Employer Routes */}
        <Route path="/employer-dashboard" element={<ProtectedRoute><EmployerDashboard /></ProtectedRoute>} />
        <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
        <Route path="/applicants" element={<ProtectedRoute><Applicants /></ProtectedRoute>} />
        
        {/* Profile Routes */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* Digital Learning Passport Routes */}
        <Route path="/digital-learning-passport" element={<ProtectedRoute><DigitalLearningPassport /></ProtectedRoute>} />
        <Route path="/skills-audit-system" element={<ProtectedRoute><SkillsAuditSystem /></ProtectedRoute>} />
        
        {/* Social Media Routes */}
        <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/post/:id" element={<ProtectedRoute><PostDetails /></ProtectedRoute>} />
        
        {/* Company Routes */}
        <Route path="/companies" element={<ProtectedRoute><CompaniesPage /></ProtectedRoute>} />
        <Route path="/companies/:companyId" element={<ProtectedRoute><CompanyProfile /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Router
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
              }}
            >
              <AppContent />
            </Router>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;