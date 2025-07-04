import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  GraduationCap, 
  Search, 
  Building2, 
  MessageSquare, 
  Calendar, 
  BookOpen, 
  User, 
  LogOut,
  Bell,
  Sparkles,
  Coffee,
  Star,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Home,
  Briefcase,
  Users,
  Settings,
  FileText,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Simple navigation items animation - removed problematic opacity animation
      gsap.from('.nav-item', {
        duration: 0.4,
        x: -15,
        ease: 'power2.out',
        stagger: 0.05,
        delay: 0.1
      });

      // Floating animations for decorative elements
      gsap.to('.nav-decoration', {
        y: -3,
        x: 2,
        rotation: 180,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });

    }, sidebarRef);

    return () => ctx.revert();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Show simple top nav for non-authenticated users
  if (!user) {
    return (
      <nav className="bg-white shadow-lg border-b-2 border-asu-maroon/20 relative z-50">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-asu-maroon via-asu-gold to-asu-maroon"></div>
        <Coffee className="nav-decoration absolute top-1 right-40 h-3 w-3 text-asu-gold" />
        <Star className="nav-decoration absolute bottom-1 right-60 h-2 w-2 text-asu-maroon" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 group transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <GraduationCap className="h-9 w-9 text-asu-maroon group-hover:text-asu-gold transition-colors duration-300 group-hover:rotate-12" />
                <Sparkles className="nav-decoration absolute -top-1 -right-1 h-4 w-4 text-asu-gold" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-asu-gold rounded-full animate-pulse"></div>
              </div>
              <span className="font-bold text-xl text-gray-900 relative">
                ASU Handshake
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-asu-maroon transform -skew-x-12"></div>
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-asu-maroon transition-all duration-300 hover:scale-105 transform hover:-rotate-1 relative group"
              >
                Sign In
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-asu-maroon transition-all duration-300 group-hover:w-full transform -skew-x-12"></div>
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-6 py-2 rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:rotate-1 relative overflow-hidden"
              >
                <span className="relative z-10">Get Started ✨</span>
                <div className="absolute inset-0 bg-gradient-to-r from-asu-gold/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const isActive = (path: string) => location.pathname === path;

  const studentNavItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', emoji: '🏠', description: 'Your career hub' },
    { path: '/job-search', icon: Search, label: 'Find Jobs', emoji: '🔍', description: 'Discover opportunities' },
    { path: '/applications', icon: FileText, label: 'My Applications', emoji: '📝', description: 'Track your progress' },
    { path: '/messages', icon: MessageSquare, label: 'Messages', emoji: '💬', description: 'Connect with employers' },
    { path: '/events', icon: Calendar, label: 'Events', emoji: '📅', description: 'Career events & workshops' },
    { path: '/resources', icon: BookOpen, label: 'Resources', emoji: '📚', description: 'Career guidance' },
    { path: '/profile', icon: User, label: 'Profile', emoji: '👤', description: 'Manage your profile' },
  ];

  const employerNavItems = [
    { path: '/dashboard', icon: Building2, label: 'Dashboard', emoji: '🏢', description: 'Employer overview' },
    { path: '/post-job', icon: Briefcase, label: 'Post Jobs', emoji: '✨', description: 'Create job postings' },
    { path: '/applicants', icon: Users, label: 'Applicants', emoji: '👥', description: 'Review candidates' },
    { path: '/messages', icon: MessageSquare, label: 'Messages', emoji: '💬', description: 'Connect with students' },
    { path: '/events', icon: Calendar, label: 'Events', emoji: '📅', description: 'Host events' },
    { path: '/profile', icon: Building2, label: 'Company Profile', emoji: '🏢', description: 'Company information' },
  ];

  const adminNavItems = [
    { path: '/dashboard', icon: Settings, label: 'Admin Dashboard', emoji: '⚡', description: 'Platform management' },
    { path: '/events', icon: Calendar, label: 'Events', emoji: '📅', description: 'Event management' },
    { path: '/resources', icon: BookOpen, label: 'Resources', emoji: '📚', description: 'Content management' },
  ];

  const getNavItems = () => {
    if (user.role === 'admin') return adminNavItems;
    return user.role === 'student' ? studentNavItems : employerNavItems;
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Desktop Sidebar - Fixed visibility issues */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full bg-white shadow-2xl border-r-2 border-gray-200 z-40 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-80'
        }`}
      >
        {/* Decorative elements - made fully visible */}
        {!isCollapsed && (
          <>
            <div className="nav-decoration absolute top-8 right-8 w-3 h-3 bg-asu-gold rounded-full"></div>
            <div className="nav-decoration absolute top-20 right-12 w-2 h-2 bg-asu-maroon rounded-full"></div>
            <Sparkles className="nav-decoration absolute top-12 right-16 h-4 w-4 text-asu-gold" />
          </>
        )}

        {/* Header - Improved visibility */}
        <div className={`border-b border-gray-200 ${isCollapsed ? 'p-4' : 'p-6'}`}>
          <div className="flex items-center justify-center">
            <div className="relative">
              <GraduationCap className={`text-asu-maroon ${isCollapsed ? 'h-8 w-8' : 'h-10 w-10'}`} />
              {!isCollapsed && <div className="absolute -top-1 -right-1 w-3 h-3 bg-asu-gold rounded-full animate-pulse"></div>}
            </div>
            {!isCollapsed && (
              <div className="ml-3 flex-1">
                <h1 className="text-xl font-bold text-gray-900">ASU Handshake</h1>
                <p className="text-sm text-gray-600">Your career platform</p>
              </div>
            )}
          </div>
        </div>

        {/* User Profile Section - Enhanced visibility */}
        <div className={`border-b border-gray-200 ${isCollapsed ? 'p-3' : 'p-4'}`}>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className={`bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                isCollapsed ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-lg'
              }`}>
                {user.name?.charAt(0) || '👤'}
              </div>
              <div className={`absolute bg-green-500 rounded-full border-2 border-white ${
                isCollapsed ? '-bottom-0.5 -right-0.5 w-3 h-3' : '-bottom-1 -right-1 w-4 h-4'
              }`}></div>
            </div>
            {!isCollapsed && (
              <div className="ml-3 flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{user.name || 'User'}</h3>
                <p className="text-sm text-gray-600 capitalize">
                  {user.role}
                  {user.role === 'student' && ' 🎓'}
                  {user.role === 'employer' && ' 🏢'}
                  {user.role === 'admin' && ' ⚡'}
                </p>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="mt-4 p-3 bg-gradient-to-r from-asu-maroon/10 to-asu-gold/10 rounded-xl">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Profile Strength</span>
                <span className="font-semibold text-asu-maroon">85%</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-asu-maroon to-asu-gold h-2 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items - Fixed all opacity issues */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className={`space-y-2 ${isCollapsed ? 'px-2' : 'px-4'}`}>
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <div key={item.path} className="relative group">
                  <Link
                    to={item.path}
                    className={`nav-item flex items-center rounded-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden ${
                      isCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3'
                    } ${
                      active
                        ? 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-asu-maroon/15 hover:to-asu-gold/15 hover:text-asu-maroon'
                    }`}
                  >
                    <div className={`rounded-xl transition-all duration-300 p-2 ${
                      active 
                        ? 'bg-white/25' 
                        : 'bg-asu-maroon/15 group-hover:bg-asu-maroon/25'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-lg">{item.emoji}</span>
                        </div>
                        <p className={`text-xs mt-1 ${
                          active ? 'text-white/90' : 'text-gray-600 group-hover:text-asu-maroon/90'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                    )}
                    
                    {active && !isCollapsed && (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    
                    {/* Active indicator */}
                    {active && (
                      <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-asu-gold rounded-r-full ${
                        isCollapsed ? 'w-1 h-6' : 'w-1 h-8'
                      }`}></div>
                    )}
                  </Link>
                  
                  {/* Tooltip for collapsed state - improved visibility */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                      <div className="flex items-center space-x-2">
                        <span>{item.label}</span>
                        <span>{item.emoji}</span>
                      </div>
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Quick Actions - Enhanced visibility */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              {user.role === 'student' && (
                <>
                  <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 transform hover:scale-105">
                    <Search className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                    <span className="text-xs text-blue-700 font-medium">Search Jobs</span>
                  </button>
                  <button className="p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-300 transform hover:scale-105">
                    <Calendar className="h-4 w-4 text-green-600 mx-auto mb-1" />
                    <span className="text-xs text-green-700 font-medium">Events</span>
                  </button>
                </>
              )}
              
              {user.role === 'employer' && (
                <>
                  <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-300 transform hover:scale-105">
                    <Briefcase className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                    <span className="text-xs text-purple-700 font-medium">Post Job</span>
                  </button>
                  <button className="p-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all duration-300 transform hover:scale-105">
                    <Users className="h-4 w-4 text-orange-600 mx-auto mb-1" />
                    <span className="text-xs text-orange-700 font-medium">Applicants</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Notifications - Enhanced visibility */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-800">Notifications</h4>
              <div className="w-6 h-6 bg-asu-maroon rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-asu-maroon/10 rounded-xl">
                <p className="text-xs text-gray-800 font-medium">New job match found! 🎉</p>
                <p className="text-xs text-gray-600 mt-1">2 minutes ago</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <p className="text-xs text-gray-800 font-medium">Message from recruiter 💬</p>
                <p className="text-xs text-gray-600 mt-1">1 hour ago</p>
              </div>
            </div>
          </div>
        )}

        {/* Notification indicator for collapsed state - improved */}
        {isCollapsed && (
          <div className="p-3 border-t border-gray-200">
            <div className="flex justify-center">
              <div className="relative group">
                <Bell className="h-6 w-6 text-gray-700 hover:text-asu-maroon transition-colors cursor-pointer" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-asu-maroon rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">3</span>
                </div>
                {/* Tooltip */}
                <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  Notifications
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button - Enhanced visibility */}
        <div className={`border-t border-gray-200 ${isCollapsed ? 'p-3' : 'p-4'}`}>
          <div className="relative group">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                isCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3'
              }`}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && (
                <>
                  <span className="font-medium">Sign Out</span>
                  <span className="text-lg">👋</span>
                </>
              )}
            </button>
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Sign Out 👋
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            )}
          </div>
        </div>

        {/* Collapse/Expand Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-asu-maroon rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </div>

      {/* Main Content Spacer */}
      <div className={`transition-all duration-300 ease-in-out ${
        isCollapsed ? 'ml-20' : 'ml-80'
      }`} />
    </>
  );
}