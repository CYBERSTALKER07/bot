import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Building2, 
  Search, 
  User, 
  MessageSquare, 
  Bell,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-asu-maroon" />
              <span className="font-bold text-xl text-gray-900">ASU Handshake</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-asu-maroon transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-asu-maroon text-white px-4 py-2 rounded-md hover:bg-asu-maroon-dark transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const isActive = (path: string) => location.pathname === path;

  const studentNavItems = [
    { path: '/dashboard', icon: Search, label: 'Find Jobs' },
    { path: '/applications', icon: Building2, label: 'My Applications' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const employerNavItems = [
    { path: '/dashboard', icon: Building2, label: 'Dashboard' },
    { path: '/post-job', icon: Building2, label: 'Post Job' },
    { path: '/applicants', icon: User, label: 'Applicants' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/profile', icon: Building2, label: 'Company Profile' },
  ];

  const navItems = user.role === 'student' ? studentNavItems : employerNavItems;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-asu-maroon" />
            <span className="font-bold text-xl text-gray-900">ASU Handshake</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-asu-maroon bg-asu-maroon/10'
                      : 'text-gray-600 hover:text-asu-maroon hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-gray-600 hover:text-asu-maroon transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-asu-maroon transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-asu-maroon bg-asu-maroon/10'
                        : 'text-gray-600 hover:text-asu-maroon hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="flex items-center justify-between px-3 py-2">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-asu-maroon transition-colors">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                  <span className="ml-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">2</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}