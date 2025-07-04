import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  GraduationCap, 
  Building2, 
  Search, 
  User, 
  MessageSquare, 
  Bell,
  LogOut,
  Menu,
  X,
  Calendar,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      const ctx = gsap.context(() => {
        // Animate navigation on load
        gsap.from(navRef.current, {
          duration: 0.8,
          y: -100,
          opacity: 0,
          ease: 'power3.out'
        });

        // Animate logo
        gsap.from(logoRef.current, {
          duration: 1,
          scale: 0.5,
          rotation: -180,
          opacity: 0,
          ease: 'back.out(1.7)',
          delay: 0.2
        });

        // Animate menu items
        gsap.from('.nav-item', {
          duration: 0.6,
          y: -20,
          opacity: 0,
          ease: 'power2.out',
          stagger: 0.1,
          delay: 0.4
        });

        // Animate notification badge
        gsap.from('.notification-badge', {
          duration: 0.8,
          scale: 0,
          opacity: 0,
          ease: 'elastic.out(1, 0.3)',
          delay: 0.8
        });

        // Hover animations for nav items
        gsap.utils.toArray('.nav-item').forEach((item: any) => {
          const tl = gsap.timeline({ paused: true });
          tl.to(item, {
            scale: 1.05,
            y: -2,
            duration: 0.3,
            ease: 'power2.out'
          });

          item.addEventListener('mouseenter', () => tl.play());
          item.addEventListener('mouseleave', () => tl.reverse());
        });

        // Logo hover animation
        const logoTl = gsap.timeline({ paused: true });
        logoTl.to(logoRef.current, {
          scale: 1.1,
          rotation: 5,
          duration: 0.3,
          ease: 'power2.out'
        });

        logoRef.current?.addEventListener('mouseenter', () => logoTl.play());
        logoRef.current?.addEventListener('mouseleave', () => logoTl.reverse());

      }, navRef);

      return () => ctx.revert();
    }
  }, [user]);

  const handleLogout = () => {
    // Animate logout
    gsap.to(navRef.current, {
      duration: 0.5,
      y: -100,
      opacity: 0,
      ease: 'power2.in',
      onComplete: () => {
        logout();
        navigate('/');
      }
    });
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
    { path: '/events', icon: Calendar, label: 'Events' },
    { path: '/resources', icon: BookOpen, label: 'Resources' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const employerNavItems = [
    { path: '/dashboard', icon: Building2, label: 'Dashboard' },
    { path: '/post-job', icon: Building2, label: 'Post Job' },
    { path: '/applicants', icon: User, label: 'Applicants' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/profile', icon: Building2, label: 'Company Profile' },
  ];

  const adminNavItems = [
    { path: '/dashboard', icon: Building2, label: 'Admin Dashboard' },
    { path: '/events', icon: Calendar, label: 'Events' },
    { path: '/resources', icon: BookOpen, label: 'Resources' },
  ];

  const getNavItems = () => {
    if (user.role === 'admin') return adminNavItems;
    return user.role === 'student' ? studentNavItems : employerNavItems;
  };

  const navItems = getNavItems();

  return (
    <nav ref={navRef} className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" ref={logoRef} className="flex items-center space-x-2">
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
                  className={`nav-item flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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
              <button className="nav-item relative p-2 text-gray-600 hover:text-asu-maroon transition-colors">
                <Bell className="h-5 w-5" />
                <span className="notification-badge absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="nav-item p-2 text-gray-600 hover:text-red-600 transition-colors"
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
          <div ref={menuRef} className="md:hidden py-4 border-t">
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