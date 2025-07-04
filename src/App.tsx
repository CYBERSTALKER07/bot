import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import ResourceCenter from './components/ResourceCenter';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import SplashScreen from './components/SplashScreen';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-aut-maroon" />
          <span className="text-gray-600">Loading...</span>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-aut-maroon" />
          <span className="text-gray-600">Loading...</span>
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
    // Show splash screen on first load
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasSeenSplash', 'true');
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-aut-maroon" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navigation />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
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
        <Route path="/resources" element={<ProtectedRoute><ResourceCenter /></ProtectedRoute>} />
        
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
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;