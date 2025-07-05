import { useEffect, useRef, useState } from 'react';
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
  FileText
} from 'lucide-react';
import { 
  AccountCircle,
  Business,
  School,
  AutoAwesome,
  Person,
  Work,
  Group,
  Dashboard,
  Assignment,
  Chat,
  Event,
  MenuBook,
  Bolt
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ui/ThemeToggle';

export default function Navigation() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Check screen size and update responsive state
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      // Auto-collapse sidebar on tablet
      if (width < 1024) {
        setIsCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle mobile menu animations
  useEffect(() => {
    if (isMobileMenuOpen && mobileMenuRef.current) {
      gsap.fromTo(mobileMenuRef.current, 
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo('.mobile-nav-item', 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, delay: 0.1 }
      );
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Desktop sidebar animations
  useEffect(() => {
    if (!isMobile) {
      const ctx = gsap.context(() => {
        gsap.from('.nav-item', {
          duration: 0.4,
          x: -15,
          ease: 'power2.out',
          stagger: 0.05,
          delay: 0.1
        });

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
    }
  }, [isMobile]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Show mobile-friendly top nav for non-authenticated users
  if (!user) {
    return (
      <nav className={`shadow-lg border-b-2 relative z-50 transition-colors duration-300 ${
        isDark 
          ? 'bg-dark-surface border-lime/20' 
          : 'bg-white border-asu-maroon/20'
      }`}>
        <div className={`absolute top-0 left-0 w-full h-1 ${
          isDark 
            ? 'bg-gradient-to-r from-lime via-dark-accent to-lime' 
            : 'bg-gradient-to-r from-asu-maroon via-asu-gold to-asu-maroon'
        }`}></div>
        <Coffee className={`nav-decoration absolute top-1 right-40 h-3 w-3 hidden sm:block ${
          isDark ? 'text-lime' : 'text-asu-gold'
        }`} />
        <Star className={`nav-decoration absolute bottom-1 right-60 h-2 w-2 hidden sm:block ${
          isDark ? 'text-lime' : 'text-asu-maroon'
        }`} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <GraduationCap className={`h-8 w-8 sm:h-9 sm:w-9 transition-colors duration-300 group-hover:rotate-12 ${
                  isDark 
                    ? 'text-lime group-hover:text-dark-accent' 
                    : 'text-asu-maroon group-hover:text-asu-gold'
                }`} />
                <AutoAwesome className={`nav-decoration absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 hidden sm:block ${
                  isDark ? 'text-lime' : 'text-asu-gold'
                }`} />
                <div className={`absolute -bottom-1 -left-1 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse ${
                  isDark ? 'bg-lime' : 'bg-asu-gold'
                }`}></div>
              </div>
              <span className={`font-bold text-lg sm:text-xl relative ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}>
                <span className="hidden sm:inline">ASU Handshake</span>
                <span className="sm:hidden">ASU</span>
                <div className={`absolute -bottom-1 left-0 w-full h-0.5 transform -skew-x-12 ${
                  isDark ? 'bg-lime' : 'bg-asu-maroon'
                }`}></div>
              </span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle size="sm" />
              <Link
                to="/login"
                className={`transition-all duration-300 hover:scale-105 transform hover:-rotate-1 relative group text-sm sm:text-base ${
                  isDark 
                    ? 'text-dark-muted hover:text-lime' 
                    : 'text-gray-600 hover:text-asu-maroon'
                }`}
              >
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Login</span>
                <div className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full transform -skew-x-12 ${
                  isDark ? 'bg-lime' : 'bg-asu-maroon'
                }`}></div>
              </Link>
              <Link
                to="/register"
                className={`px-4 py-2 sm:px-6 sm:py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:rotate-1 relative overflow-hidden text-sm sm:text-base ${
                  isDark 
                    ? 'bg-gradient-to-r from-lime to-dark-accent text-dark-surface hover:shadow-xl' 
                    : 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white hover:shadow-xl'
                }`}
              >
                <span className="relative z-10 flex items-center space-x-1">
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                  <AutoAwesome className="h-4 w-4" />
                </span>
                <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 ${
                  isDark 
                    ? 'bg-gradient-to-r from-dark-accent/20 to-transparent' 
                    : 'bg-gradient-to-r from-asu-gold/20 to-transparent'
                }`}></div>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const isActive = (path: string) => location.pathname === path;

  const studentNavItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', muiIcon: Dashboard, description: 'Your career hub' },
    { path: '/job-search', icon: Search, label: 'Find Jobs', muiIcon: Search, description: 'Discover opportunities' },
    { path: '/applications', icon: FileText, label: 'My Applications', muiIcon: Assignment, description: 'Track your progress' },
    { path: '/messages', icon: MessageSquare, label: 'Messages', muiIcon: Chat, description: 'Connect with employers' },
    { path: '/events', icon: Calendar, label: 'Events', muiIcon: Event, description: 'Career events & workshops' },
    { path: '/resources', icon: BookOpen, label: 'Resources', muiIcon: MenuBook, description: 'Career guidance' },
    { path: '/profile', icon: User, label: 'Profile', muiIcon: Person, description: 'Manage your profile' },
  ];

  const employerNavItems = [
    { path: '/dashboard', icon: Building2, label: 'Dashboard', muiIcon: Dashboard, description: 'Employer overview' },
    { path: '/post-job', icon: Briefcase, label: 'Post Jobs', muiIcon: Work, description: 'Create job postings' },
    { path: '/applicants', icon: Users, label: 'Applicants', muiIcon: Group, description: 'Review candidates' },
    { path: '/messages', icon: MessageSquare, label: 'Messages', muiIcon: Chat, description: 'Connect with students' },
    { path: '/events', icon: Calendar, label: 'Events', muiIcon: Event, description: 'Host events' },
    { path: '/profile', icon: Building2, label: 'Company Profile', muiIcon: Business, description: 'Company information' },
  ];

  const adminNavItems = [
    { path: '/dashboard', icon: Settings, label: 'Admin Dashboard', muiIcon: Dashboard, description: 'Platform management' },
    { path: '/events', icon: Calendar, label: 'Events', muiIcon: Event, description: 'Event management' },
    { path: '/resources', icon: BookOpen, label: 'Resources', muiIcon: MenuBook, description: 'Content management' },
  ];

  const getNavItems = () => {
    if (user.role === 'admin') return adminNavItems;
    return user.role === 'student' ? studentNavItems : employerNavItems;
  };

  const navItems = getNavItems();

  // Mobile Navigation
  if (isMobile) {
    return (
      <>
        {/* Mobile Top Bar */}
        <div className={`fixed top-0 left-0 right-0 shadow-lg border-b-2 z-50 transition-colors duration-300 ${
          isDark 
            ? 'bg-dark-surface border-lime/20' 
            : 'bg-white border-asu-maroon/20'
        }`}>
          <div className={`absolute top-0 left-0 w-full h-1 ${
            isDark 
              ? 'bg-gradient-to-r from-lime via-dark-accent to-lime' 
              : 'bg-gradient-to-r from-asu-maroon via-asu-gold to-asu-maroon'
          }`}></div>
          
          <div className="flex items-center justify-between px-4 h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2 group">
              <div className="relative">
                <GraduationCap className={`h-8 w-8 transition-colors duration-300 ${
                  isDark 
                    ? 'text-lime group-hover:text-dark-accent' 
                    : 'text-asu-maroon group-hover:text-asu-gold'
                }`} />
                <div className={`absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full animate-pulse ${
                  isDark ? 'bg-lime' : 'bg-asu-gold'
                }`}></div>
              </div>
              <span className={`font-bold text-lg ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}>ASU</span>
            </Link>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <ThemeToggle size="sm" />
              
              {/* Notifications */}
              <div className="relative">
                <Bell className={`h-6 w-6 ${
                  isDark ? 'text-dark-text' : 'text-gray-700'
                }`} />
                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-lime' : 'bg-asu-maroon'
                }`}>
                  <span className={`text-xs font-bold ${
                    isDark ? 'text-dark-surface' : 'text-white'
                  }`}>3</span>
                </div>
              </div>

              {/* Profile */}
              <div className="relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  isDark 
                    ? 'bg-gradient-to-br from-lime to-dark-accent text-dark-surface' 
                    : 'bg-gradient-to-br from-asu-maroon to-asu-maroon-dark text-white'
                }`}>
                  {user.name?.charAt(0) || <AccountCircle className="h-5 w-5" />}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 ${
                  isDark ? 'border-dark-surface' : 'border-white'
                }`}></div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 transition-colors ${
                  isDark 
                    ? 'text-dark-text hover:text-lime' 
                    : 'text-gray-700 hover:text-asu-maroon'
                }`}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className={`fixed top-16 left-0 right-0 shadow-2xl border-b-2 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto transition-colors duration-300 ${
              isDark 
                ? 'bg-dark-surface border-gray-600' 
                : 'bg-white border-gray-200'
            }`}
          >
            {/* User Profile Section */}
            <div className={`p-4 border-b ${
              isDark 
                ? 'border-gray-600 bg-gradient-to-r from-lime/5 to-dark-accent/5' 
                : 'border-gray-200 bg-gradient-to-r from-asu-maroon/5 to-asu-gold/5'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    isDark 
                      ? 'bg-gradient-to-br from-lime to-dark-accent text-dark-surface' 
                      : 'bg-gradient-to-br from-asu-maroon to-asu-maroon-dark text-white'
                  }`}>
                    {user.name?.charAt(0) || <AccountCircle className="h-6 w-6" />}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 ${
                    isDark ? 'border-dark-surface' : 'border-white'
                  }`}></div>
                </div>
                <div>
                  <h3 className={`font-semibold ${
                    isDark ? 'text-dark-text' : 'text-gray-900'
                  }`}>{user.name || 'User'}</h3>
                  <p className={`text-sm capitalize flex items-center space-x-1 ${
                    isDark ? 'text-dark-muted' : 'text-gray-600'
                  }`}>
                    <span>{user.role}</span>
                    {user.role === 'student' && <School className="h-4 w-4" />}
                    {user.role === 'employer' && <Business className="h-4 w-4" />}
                    {user.role === 'admin' && <Bolt className="h-4 w-4" />}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="py-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const MuiIcon = item.muiIcon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`mobile-nav-item flex items-center space-x-3 px-4 py-4 transition-all duration-200 ${
                      active
                        ? isDark 
                          ? 'bg-gradient-to-r from-lime to-dark-accent text-dark-surface border-l-4 border-lime'
                          : 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white border-l-4 border-asu-gold'
                        : isDark
                          ? 'text-dark-text hover:bg-lime/10 hover:text-lime'
                          : 'text-gray-700 hover:bg-asu-maroon/10 hover:text-asu-maroon'
                    }`}
                  >
                    <div className={`rounded-xl p-2 ${
                      active 
                        ? isDark 
                          ? 'bg-dark-surface/25' 
                          : 'bg-white/25'
                        : isDark
                          ? 'bg-lime/15'
                          : 'bg-asu-maroon/15'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{item.label}</span>
                        <MuiIcon className="h-5 w-5" />
                      </div>
                      <p className={`text-xs ${
                        active 
                          ? isDark 
                            ? 'text-dark-surface/90' 
                            : 'text-white/90'
                          : isDark
                            ? 'text-dark-muted'
                            : 'text-gray-500'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                    {active && <ChevronRight className="h-4 w-4" />}
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className={`p-4 border-t ${
              isDark 
                ? 'border-gray-600 bg-dark-surface/50' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <h4 className={`text-sm font-semibold mb-3 ${
                isDark ? 'text-dark-text' : 'text-gray-800'
              }`}>Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                {user.role === 'student' && (
                  <>
                    <button className={`flex flex-col items-center p-3 rounded-xl transition-colors ${
                      isDark 
                        ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300' 
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                    }`}>
                      <Search className="h-5 w-5 mb-1" />
                      <span className="text-xs font-medium">Search Jobs</span>
                    </button>
                    <button className={`flex flex-col items-center p-3 rounded-xl transition-colors ${
                      isDark 
                        ? 'bg-green-500/20 hover:bg-green-500/30 text-green-300' 
                        : 'bg-green-50 hover:bg-green-100 text-green-700'
                    }`}>
                      <Event className="h-5 w-5 mb-1" />
                      <span className="text-xs font-medium">Events</span>
                    </button>
                  </>
                )}
                
                {user.role === 'employer' && (
                  <>
                    <button className={`flex flex-col items-center p-3 rounded-xl transition-colors ${
                      isDark 
                        ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300' 
                        : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                    }`}>
                      <Work className="h-5 w-5 mb-1" />
                      <span className="text-xs font-medium">Post Job</span>
                    </button>
                    <button className={`flex flex-col items-center p-3 rounded-xl transition-colors ${
                      isDark 
                        ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-300' 
                        : 'bg-orange-50 hover:bg-orange-100 text-orange-700'
                    }`}>
                      <Group className="h-5 w-5 mb-1" />
                      <span className="text-xs font-medium">Applicants</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <div className={`p-4 border-t ${
              isDark ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isDark 
                    ? 'text-red-400 hover:bg-red-500/10' 
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Mobile Bottom Navigation */}
        <div className={`fixed bottom-0 left-0 right-0 border-t-2 shadow-2xl z-40 ${
          isDark 
            ? 'bg-dark-surface border-gray-600' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-around py-2">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                    active
                      ? isDark 
                        ? 'text-lime bg-lime/10'
                        : 'text-asu-maroon bg-asu-maroon/10'
                      : isDark
                        ? 'text-dark-muted hover:text-lime hover:bg-lime/5'
                        : 'text-gray-600 hover:text-asu-maroon hover:bg-asu-maroon/5'
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{item.label.split(' ')[0]}</span>
                  {active && <div className={`w-1 h-1 rounded-full mt-1 ${
                    isDark ? 'bg-lime' : 'bg-asu-maroon'
                  }`}></div>}
                </Link>
              );
            })}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-colors ${
                isDark 
                  ? 'text-dark-muted hover:text-lime hover:bg-lime/5'
                  : 'text-gray-600 hover:text-asu-maroon hover:bg-asu-maroon/5'
              }`}
            >
              <Menu className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">More</span>
            </button>
          </div>
        </div>

        {/* Mobile Content Spacer */}
        <div className="h-16" />
        {/* Bottom spacer for bottom navigation */}
        <div className="h-16 fixed bottom-0 left-0 right-0 pointer-events-none" />
      </>
    );
  }

  // Desktop/Tablet Navigation
  return (
    <>
      {/* Desktop Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full shadow-2xl border-r-2 z-40 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-80'
        } ${
          isDark 
            ? 'bg-dark-surface border-gray-600' 
            : 'bg-white border-gray-200'
        }`}
      >
        {/* Decorative elements */}
        {!isCollapsed && (
          <>
            <div className={`nav-decoration absolute top-8 right-8 w-3 h-3 rounded-full ${
              isDark ? 'bg-lime' : 'bg-asu-gold'
            }`}></div>
            <div className={`nav-decoration absolute top-20 right-12 w-2 h-2 rounded-full ${
              isDark ? 'bg-lime' : 'bg-asu-maroon'
            }`}></div>
            <Sparkles className={`nav-decoration absolute top-12 right-16 h-4 w-4 ${
              isDark ? 'text-lime' : 'text-asu-gold'
            }`} />
          </>
        )}

        {/* Header */}
        <div className={`border-b ${isCollapsed ? 'p-4' : 'p-6'} ${
          isDark ? 'border-gray-600' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-center">
            <div className="relative">
              <GraduationCap className={`${isCollapsed ? 'h-8 w-8' : 'h-10 w-10'} ${
                isDark ? 'text-lime' : 'text-asu-maroon'
              }`} />
              {!isCollapsed && <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse ${
                isDark ? 'bg-lime' : 'bg-asu-gold'
              }`}></div>}
            </div>
            {!isCollapsed && (
              <div className="ml-3 flex-1">
                <h1 className={`text-xl font-bold ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>ASU Handshake</h1>
                <p className={`text-sm ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}>Your career platform</p>
              </div>
            )}
          </div>
          
          {/* Theme Toggle in Header */}
          {!isCollapsed && (
            <div className="mt-4 flex justify-center">
              <ThemeToggle variant="switch" size="sm" />
            </div>
          )}
        </div>

        {/* User Profile Section - Enhanced visibility */}
        <div className={`border-b border-gray-200 ${isCollapsed ? 'p-3' : 'p-4'}`}>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                isDark 
                  ? 'bg-gradient-to-br from-lime to-dark-accent text-dark-surface' 
                  : 'bg-gradient-to-br from-asu-maroon to-asu-maroon-dark text-white'
              }`}>
                {user.name?.charAt(0) || <AccountCircle className="h-6 w-6" />}
              </div>
              <div className={`absolute bg-green-500 rounded-full border-2 ${
                isCollapsed ? '-bottom-0.5 -right-0.5 w-3 h-3' : '-bottom-1 -right-1 w-4 h-4'
              } ${
                isDark ? 'border-dark-surface' : 'border-white'
              }`}></div>
            </div>
            {!isCollapsed && (
              <div className="ml-3 flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{user.name || 'User'}</h3>
                <p className="text-sm text-gray-600 capitalize flex items-center space-x-1">
                  <span>{user.role}</span>
                  {user.role === 'student' && <School className="h-4 w-4" />}
                  {user.role === 'employer' && <Business className="h-4 w-4" />}
                  {user.role === 'admin' && <Bolt className="h-4 w-4" />}
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
              const MuiIcon = item.muiIcon;
              const active = isActive(item.path);
              
              return (
                <div key={item.path} className="relative group">
                  <Link
                    to={item.path}
                    className={`nav-item flex items-center rounded-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden ${
                      isCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3'
                    } ${
                      active
                        ? isDark 
                          ? 'bg-gradient-to-r from-lime to-dark-accent text-dark-surface shadow-lg'
                          : 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white shadow-lg'
                        : isDark
                          ? 'text-dark-text hover:bg-gradient-to-r hover:from-lime/15 hover:to-dark-accent/15 hover:text-lime'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-asu-maroon/15 hover:to-asu-gold/15 hover:text-asu-maroon'
                    }`}
                  >
                    <div className={`rounded-xl transition-all duration-300 p-2 ${
                      active 
                        ? isDark 
                          ? 'bg-dark-surface/25' 
                          : 'bg-white/25'
                        : isDark
                          ? 'bg-lime/15 group-hover:bg-lime/25'
                          : 'bg-asu-maroon/15 group-hover:bg-asu-maroon/25'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.label}</span>
                          <MuiIcon className="h-5 w-5" />
                        </div>
                        <p className={`text-xs mt-1 ${
                          active 
                            ? isDark 
                              ? 'text-dark-surface/90' 
                              : 'text-white/90'
                            : isDark
                              ? 'text-dark-muted group-hover:text-lime/90'
                              : 'text-gray-600 group-hover:text-asu-maroon/90'
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
                      <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 rounded-r-full ${
                        isCollapsed ? 'w-1 h-6' : 'w-1 h-8'
                      } ${
                        isDark ? 'bg-lime' : 'bg-asu-gold'
                      }`}></div>
                    )}
                  </Link>
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
                    <Event className="h-4 w-4 text-green-600 mx-auto mb-1" />
                    <span className="text-xs text-green-700 font-medium">Events</span>
                  </button>
                </>
              )}
              
              {user.role === 'employer' && (
                <>
                  <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-300 transform hover:scale-105">
                    <Work className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                    <span className="text-xs text-purple-700 font-medium">Post Job</span>
                  </button>
                  <button className="p-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all duration-300 transform hover:scale-105">
                    <Group className="h-4 w-4 text-orange-600 mx-auto mb-1" />
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
                <p className="text-xs text-gray-800 font-medium">New job match found!</p>
                <p className="text-xs text-gray-600 mt-1">2 minutes ago</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <p className="text-xs text-gray-800 font-medium">Message from recruiter</p>
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
              className={`w-full flex items-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                isCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3'
              }`}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span className="font-medium">Sign Out</span>}
            </button>
          </div>
        </div>

        {/* Theme Toggle for collapsed state */}
        {isCollapsed && (
          <div className={`border-t ${isDark ? 'border-gray-600' : 'border-gray-200'} p-3`}>
            <div className="flex justify-center">
              <ThemeToggle size="sm" />
            </div>
          </div>
        )}

        {/* Collapse/Expand Button */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 ${
              isDark 
                ? 'bg-lime text-dark-surface' 
                : 'bg-asu-maroon text-white'
            }`}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </button>
        )}
      </div>

      {/* Main Content Spacer */}
      <div className={`transition-all duration-300 ease-in-out ${
        isCollapsed ? 'ml-20' : 'ml-80'
      }`} />
    </>
  );
}
