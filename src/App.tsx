import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
  
  if (user.role === 'admin') return <AdminDashboard />;
  return user.role === 'student' ? <StudentDashboard /> : <EmployerDashboard />;
}

function AppContent() {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash screen only on first visit (use localStorage instead of sessionStorage)
    const hasSeenSplash = localStorage.getItem('aut-handshake-splash-seen');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    // Store in localStorage so it persists across browser sessions
    localStorage.setItem('aut-handshake-splash-seen', 'true');
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
        <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
        <Route path="/applicants" element={<ProtectedRoute><Applicants /></ProtectedRoute>} />
        
        {/* Profile Routes */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;