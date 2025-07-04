import React, { useEffect, useRef } from 'react';
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
  Heart,
  Sparkles,
  Coffee,
  Star,
  Smile
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // More organic navigation animations with natural imperfections
      gsap.from(navRef.current, {
        duration: 1.2,
        y: -25,
        opacity: 0,
        ease: 'power2.out',
        rotation: 0.8
      });

      // Playful logo animation with bounce
      gsap.from(logoRef.current, {
        duration: 1.5,
        scale: 0.7,
        rotation: -8,
        ease: 'elastic.out(1, 0.6)',
        delay: 0.3
      });

      // Staggered nav items with organic variations
      gsap.from('.nav-item', {
        duration: 1,
        y: (index) => -20 + (index * 3), // Varied heights
        opacity: 0,
        ease: 'power2.out',
        stagger: 0.15,
        delay: 0.6,
        rotation: (index) => (index % 2 === 0 ? 2 : -2) // Alternating rotations
      });

      // Floating notification badge with organic bounce
      gsap.from('.notification-badge', {
        duration: 1.3,
        scale: 0,
        rotation: 270,
        ease: 'elastic.out(1, 0.8)',
        delay: 1.2
      });

      // Decorative elements animations
      gsap.from('.nav-decoration', {
        duration: 1.5,
        scale: 0,
        opacity: 0,
        ease: 'back.out(1.4)',
        stagger: 0.2,
        delay: 0.8
      });

      // Continuous floating animations for decorative elements
      gsap.to('.float-decoration-1', {
        y: -8,
        x: 3,
        rotation: 360,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });

      gsap.to('.float-decoration-2', {
        y: -6,
        x: -2,
        rotation: -180,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 1
      });

      // Sparkle animations with random scaling
      gsap.to('.nav-sparkle', {
        scale: () => 0.8 + Math.random() * 0.6,
        opacity: () => 0.3 + Math.random() * 0.7,
        duration: () => 1.5 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        stagger: () => Math.random() * 0.5
      });

      // Organic hover animations for nav items
      gsap.utils.toArray('.nav-item').forEach((item: any, index) => {
        const tl = gsap.timeline({ paused: true });
        const randomRotation = (Math.random() - 0.5) * 4;
        tl.to(item, {
          scale: 1.08,
          y: -3,
          rotation: randomRotation,
          duration: 0.3,
          ease: 'power2.out'
        });

        item.addEventListener('mouseenter', () => tl.play());
        item.addEventListener('mouseleave', () => tl.reverse());
      });

    }, navRef);

    return () => ctx.revert();
  }, []);

  const handleLogout = () => {
    // Organic logout animation
    gsap.to(navRef.current, {
      duration: 0.8,
      y: -120,
      opacity: 0,
      rotation: 2,
      ease: 'power2.in',
      onComplete: () => {
        logout();
        navigate('/');
      }
    });
  };

  if (!user) {
    return (
      <nav className="bg-gradient-to-r from-white to-gray-50 shadow-lg border-b-2 border-asu-maroon/20 transform rotate-0.5">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-asu-maroon via-asu-gold to-asu-maroon opacity-60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 group transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <GraduationCap className="h-8 w-8 text-asu-maroon group-hover:rotate-12 transition-transform duration-300" />
                <Sparkles className="nav-sparkle absolute -top-1 -right-1 h-3 w-3 text-asu-gold" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-asu-gold/50 rounded-full animate-pulse"></div>
              </div>
              <span className="font-bold text-xl text-gray-900 relative">
                ASU Handshake
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-asu-maroon/30 transform -skew-x-12"></div>
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
    { path: '/dashboard', icon: Search, label: 'Find Jobs', emoji: '🔍' },
    { path: '/applications', icon: Building2, label: 'My Applications', emoji: '📝' },
    { path: '/messages', icon: MessageSquare, label: 'Messages', emoji: '💬' },
    { path: '/events', icon: Calendar, label: 'Events', emoji: '📅' },
    { path: '/resources', icon: BookOpen, label: 'Resources', emoji: '📚' },
    { path: '/profile', icon: User, label: 'Profile', emoji: '👤' },
  ];

  const employerNavItems = [
    { path: '/dashboard', icon: Building2, label: 'Dashboard', emoji: '🏢' },
    { path: '/post-job', icon: Building2, label: 'Post Job', emoji: '✨' },
    { path: '/applicants', icon: User, label: 'Applicants', emoji: '👥' },
    { path: '/messages', icon: MessageSquare, label: 'Messages', emoji: '💬' },
    { path: '/profile', icon: Building2, label: 'Company Profile', emoji: '🏢' },
  ];

  const adminNavItems = [
    { path: '/dashboard', icon: Building2, label: 'Admin Dashboard', emoji: '⚡' },
    { path: '/events', icon: Calendar, label: 'Events', emoji: '📅' },
    { path: '/resources', icon: BookOpen, label: 'Resources', emoji: '📚' },
  ];

  const getNavItems = () => {
    if (user.role === 'admin') return adminNavItems;
    return user.role === 'student' ? studentNavItems : employerNavItems;
  };

  const navItems = getNavItems();

  return (
    <nav ref={navRef} className="bg-gradient-to-r from-white to-gray-50 shadow-lg border-b-4 border-asu-maroon/20 relative overflow-hidden transform rotate-0.3">
      {/* Hand-drawn style decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-asu-maroon via-asu-gold to-asu-maroon opacity-80"></div>
      <div className="nav-decoration float-decoration-1 absolute top-2 right-20 w-3 h-3 bg-asu-gold/40 rounded-full"></div>
      <div className="nav-decoration float-decoration-2 absolute bottom-2 left-40 w-2 h-2 bg-asu-maroon/30 rounded-full"></div>
      <div className="nav-decoration absolute top-3 left-20 w-1 h-1 bg-asu-gold/60 rounded-full"></div>
      <Coffee className="nav-sparkle absolute top-1 right-40 h-3 w-3 text-asu-gold/50" />
      <Star className="nav-sparkle absolute bottom-1 right-60 h-2 w-2 text-asu-maroon/40" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" ref={logoRef} className="flex items-center space-x-3 group transform hover:scale-105 transition-all duration-300">
            <div className="relative">
              <GraduationCap className="h-9 w-9 text-asu-maroon group-hover:text-asu-gold transition-colors duration-300 group-hover:rotate-12" />
              <Sparkles className="nav-sparkle absolute -top-1 -right-1 h-4 w-4 text-asu-gold" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-asu-gold/50 rounded-full animate-pulse"></div>
            </div>
            <span className="font-bold text-xl text-gray-900 group-hover:text-asu-maroon transition-colors duration-300 relative">
              ASU Handshake
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-asu-maroon transition-all duration-300 group-hover:w-full transform -skew-x-12"></div>
            </span>
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActiveItem = location.pathname === item.path;
              const rotations = ['rotate-1', '-rotate-1', 'rotate-0.5', '-rotate-0.5', 'rotate-1.5', '-rotate-1.5'];
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item relative px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 group ${rotations[index % rotations.length]} ${
                    isActiveItem
                      ? 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:text-asu-maroon hover:bg-gradient-to-r hover:from-asu-maroon/10 hover:to-asu-gold/10'
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-all duration-300 ${isActiveItem ? 'text-white' : 'group-hover:text-asu-maroon group-hover:rotate-12'}`} />
                  <span className="hidden md:inline">{item.label}</span>
                  <span className="text-xs">{item.emoji}</span>
                  {isActiveItem && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-asu-gold rounded-full animate-pulse">
                      <Smile className="h-2 w-2 text-asu-maroon" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            {/* Organic notifications */}
            <button className="relative p-2 text-gray-500 hover:text-asu-maroon transition-colors duration-300 transform hover:scale-110 hover:rotate-3">
              <Bell className="h-5 w-5" />
              <span className="notification-badge absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-asu-gold to-yellow-300 text-asu-maroon text-xs rounded-full flex items-center justify-center font-bold shadow-lg transform rotate-12">
                3
              </span>
            </button>

            {/* Human-made profile menu */}
            <div className="relative group">
              <button className="flex items-center space-x-3 p-2 rounded-full hover:bg-gradient-to-r hover:from-asu-maroon/10 hover:to-asu-gold/10 transition-all duration-300 transform hover:scale-105 hover:-rotate-1">
                <div className="w-10 h-10 bg-gradient-to-br from-asu-maroon to-asu-gold rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white transform rotate-3">
                  {user.name?.charAt(0) || '🙂'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">{user.name} ✨</div>
                  <div className="text-xs text-gray-500 capitalize flex items-center">
                    {user.role} 
                    {user.role === 'student' && '🎓'}
                    {user.role === 'employer' && '🏢'}
                    {user.role === 'admin' && '⚡'}
                  </div>
                </div>
              </button>

              {/* Organic dropdown */}
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-3xl shadow-2xl border-2 border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-3 z-50 rotate-1">
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-6 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-asu-maroon/10 hover:to-asu-gold/10 hover:text-asu-maroon transition-all duration-300 transform hover:scale-105"
                >
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                  <span className="text-xs">👤</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-6 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-600 transition-all duration-300 w-full text-left transform hover:scale-105"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                  <span className="text-xs">👋</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}