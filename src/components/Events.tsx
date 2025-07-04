import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Video, 
  Filter,
  Search,
  Plus,
  ExternalLink,
  Bookmark,
  BookmarkPlus,
  Star,
  TrendingUp,
  Award,
  Sparkles,
  Coffee,
  Heart,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Event } from '../types';

gsap.registerPlugin(ScrollTrigger);

export default function Events() {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [bookmarkedEvents, setBookmarkedEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance animation
      gsap.fromTo(headerRef.current, {
        opacity: 0,
        y: -40,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out'
      });

      // Stats cards entrance
      gsap.fromTo('.stat-card', {
        opacity: 0,
        y: 30,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.7)',
        stagger: 0.15,
        delay: 0.4
      });

      // Event cards entrance animation
      gsap.fromTo('.event-card', {
        opacity: 0,
        y: 40,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.8
      });

      // Floating decorations
      gsap.to('.event-decoration', {
        y: -8,
        x: 4,
        rotation: 360,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Progress bar animations
      gsap.fromTo('.progress-bar', {
        width: '0%'
      }, {
        width: (index, target) => target.getAttribute('data-width'),
        duration: 1.5,
        ease: 'power2.out',
        delay: 1.2,
        stagger: 0.2
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const events: Event[] = [
    {
      id: '1',
      title: 'Tech Career Fair 2024',
      description: 'Connect with top tech companies including Google, Microsoft, Apple, and more. Explore internship and full-time opportunities.',
      type: 'career_fair',
      date: '2024-02-15',
      time: '10:00 AM - 4:00 PM',
      location: 'ASU Tempe Campus - Memorial Union',
      is_virtual: false,
      attendees_count: 450,
      max_attendees: 500,
      organizer: 'ASU Career Services',
      created_at: '2024-01-15',
      updated_at: '2024-01-15'
    },
    {
      id: '2',
      title: 'Resume Writing Workshop',
      description: 'Learn how to craft compelling resumes that get noticed by recruiters. Get personalized feedback from career experts.',
      type: 'workshop',
      date: '2024-02-08',
      time: '2:00 PM - 4:00 PM',
      location: 'Virtual Event',
      is_virtual: true,
      attendees_count: 85,
      max_attendees: 100,
      organizer: 'Career Development Center',
      created_at: '2024-01-20',
      updated_at: '2024-01-20'
    },
    {
      id: '3',
      title: 'Google Information Session',
      description: 'Join Google engineers and recruiters to learn about internship programs, company culture, and application tips.',
      type: 'info_session',
      date: '2024-02-12',
      time: '6:00 PM - 7:30 PM',
      location: 'Engineering Center G-Wing',
      is_virtual: false,
      attendees_count: 120,
      max_attendees: 150,
      organizer: 'Google',
      created_at: '2024-01-18',
      updated_at: '2024-01-18'
    },
    {
      id: '4',
      title: 'Interview Skills Webinar',
      description: 'Master the art of interviewing with tips from industry professionals. Includes mock interview sessions.',
      type: 'webinar',
      date: '2024-02-20',
      time: '7:00 PM - 8:30 PM',
      location: 'Online',
      is_virtual: true,
      attendees_count: 200,
      max_attendees: 300,
      organizer: 'ASU Alumni Network',
      created_at: '2024-01-25',
      updated_at: '2024-01-25'
    },
    {
      id: '5',
      title: 'Startup Networking Night',
      description: 'Network with local entrepreneurs and startup founders. Perfect for students interested in the startup ecosystem.',
      type: 'networking',
      date: '2024-02-25',
      time: '5:30 PM - 8:00 PM',
      location: 'SkySong Innovation Center',
      is_virtual: false,
      attendees_count: 75,
      max_attendees: 120,
      organizer: 'ASU Entrepreneurship Club',
      created_at: '2024-01-30',
      updated_at: '2024-01-30'
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const toggleBookmark = (eventId: string) => {
    setBookmarkedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });

    // Bookmark animation
    gsap.to(`#bookmark-${eventId}`, {
      scale: 1.3,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out'
    });
  };

  const eventStats = {
    total: events.length,
    thisWeek: events.filter(event => {
      const eventDate = new Date(event.date);
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return eventDate >= now && eventDate <= weekFromNow;
    }).length,
    virtual: events.filter(event => event.is_virtual).length,
    registered: 3 // Mock registered events count
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative">
      {/* Decorative elements */}
      <div className="event-decoration absolute top-16 right-24 w-4 h-4 bg-asu-gold/40 rounded-full"></div>
      <div className="event-decoration absolute top-32 left-16 w-3 h-3 bg-asu-maroon/30 rounded-full"></div>
      <Sparkles className="event-decoration absolute top-24 left-1/4 h-5 w-5 text-asu-gold/60" />
      <Coffee className="event-decoration absolute bottom-32 right-1/4 h-4 w-4 text-asu-maroon/50" />
      <Heart className="event-decoration absolute bottom-20 left-1/3 h-4 w-4 text-asu-gold/70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4 relative">
                Career Events & Workshops 📅
                <div className="absolute -top-3 -right-8 w-6 h-6 bg-asu-gold rounded-full"></div>
              </h1>
              <p className="text-xl text-white/90 mb-6 max-w-3xl">
                Boost your career with networking events, workshops, and company sessions ✨
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>5 events this week 📈</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Users className="h-5 w-5" />
                  <span>1,000+ students attending 👥</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Star className="h-5 w-5" />
                  <span>Top companies participating 🌟</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="stat-card bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{events.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-blue-600 text-sm bg-blue-50 rounded-full px-3 py-1 w-fit">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>Always growing 📈</span>
            </div>
          </div>

          <div className="stat-card bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">This Week</p>
                <p className="text-3xl font-bold text-gray-900">5</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600 text-sm bg-green-50 rounded-full px-3 py-1 w-fit">
              <Zap className="h-4 w-4 mr-1" />
              <span>Don't miss out ⚡</span>
            </div>
          </div>

          <div className="stat-card bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Virtual Events</p>
                <p className="text-3xl font-bold text-gray-900">2</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                <Video className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-purple-600 text-sm bg-purple-50 rounded-full px-3 py-1 w-fit">
              <Video className="h-4 w-4 mr-1" />
              <span>Join from anywhere 💻</span>
            </div>
          </div>

          <div className="stat-card bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">My Registered</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-asu-maroon/20 to-asu-maroon/30 rounded-full flex items-center justify-center">
                <Bookmark className="h-6 w-6 text-asu-maroon" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-asu-maroon text-sm bg-asu-maroon/10 rounded-full px-3 py-1 w-fit">
              <Clock className="h-4 w-4 mr-1" />
              <span>Ready to attend 🎉</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div ref={filtersRef} className="bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100 p-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for amazing events... 🔍"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner transition-all duration-200 hover:shadow-md"
                aria-label="Search events"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner cursor-pointer hover:shadow-md transition-all duration-200"
                  aria-label="Filter by event type"
                >
                  <option value="all">All Types 📋</option>
                  <option value="career_fair">Career Fairs 🏢</option>
                  <option value="workshop">Workshops 🛠️</option>
                  <option value="info_session">Info Sessions 💬</option>
                  <option value="webinar">Webinars 🎬</option>
                  <option value="networking">Networking 🤝</option>
                </select>
              </div>
              {user?.role === 'employer' && (
                <Link
                  to="/create-event"
                  className="flex items-center space-x-2 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-6 py-4 rounded-2xl hover:shadow-lg transition-all duration-300 shadow-md"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Event ✨</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => (
            <div key={event.id} className="event-card bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow overflow-hidden">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-2xl ${getEventTypeColor(event.type)}`}>
                      {getEventTypeIcon(event.type)}
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getEventTypeColor(event.type)}`}>
                      {event.type.replace('_', ' ').split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                    {event.is_virtual && (
                      <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Virtual 💻
                      </div>
                    )}
                  </div>
                  <button
                    id={`bookmark-${event.id}`}
                    onClick={() => toggleBookmark(event.id)}
                    className={`p-3 rounded-full transition-colors ${
                      bookmarkedEvents.has(event.id)
                        ? 'bg-asu-maroon text-white'
                        : 'bg-gray-100 text-gray-400 hover:text-asu-maroon'
                    }`}
                  >
                    {bookmarkedEvents.has(event.id) ? (
                      <Bookmark className="h-5 w-5" />
                    ) : (
                      <BookmarkPlus className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight hover:text-asu-maroon transition-colors cursor-pointer">
                  {event.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-3 mb-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
                    <Calendar className="h-4 w-4 text-asu-maroon" />
                    <span className="font-medium">{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
                    {event.is_virtual ? <Video className="h-4 w-4 text-green-600" /> : <MapPin className="h-4 w-4 text-blue-600" />}
                    <span className="font-medium">{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">{event.attendees_count}/{event.max_attendees} attendees</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Registration Progress</span>
                    <span className="text-sm text-gray-500">
                      {Math.round((event.attendees_count / event.max_attendees) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="progress-bar bg-gradient-to-r from-asu-maroon to-asu-gold h-3 rounded-full transition-all duration-1000" 
                      data-width={`${(event.attendees_count / event.max_attendees) * 100}%`}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-medium">
                    {event.max_attendees - event.attendees_count} spots remaining ⏰
                  </p>
                </div>

                <div className="flex items-center space-x-2 mb-6 bg-asu-maroon/5 rounded-xl p-3">
                  <Award className="h-4 w-4 text-asu-maroon" />
                  <span className="text-sm text-gray-700 font-medium">Organized by {event.organizer}</span>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md">
                    Register Now 🚀
                  </button>
                  <button className="px-4 py-3 border-2 border-asu-maroon text-asu-maroon rounded-2xl hover:bg-asu-maroon hover:text-white transition-all duration-300 flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No events found</h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Try adjusting your search criteria or check back later for new events! 🔍
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                }}
                className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-8 py-4 rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold shadow-lg"
              >
                Clear Filters 🔄
              </button>
              <button className="border-2 border-asu-maroon text-asu-maroon px-8 py-4 rounded-2xl hover:bg-asu-maroon hover:text-white transition-all duration-300 font-semibold shadow-sm hover:shadow-md">
                View All Events 📅
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions
const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'career_fair':
      return 'bg-blue-100 text-blue-800';
    case 'workshop':
      return 'bg-green-100 text-green-800';
    case 'info_session':
      return 'bg-purple-100 text-purple-800';
    case 'webinar':
      return 'bg-orange-100 text-orange-800';
    case 'networking':
      return 'bg-pink-100 text-pink-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getEventTypeIcon = (type: string) => {
  switch (type) {
    case 'career_fair':
      return <Users className="h-4 w-4" />;
    case 'workshop':
      return <Award className="h-4 w-4" />;
    case 'info_session':
      return <ExternalLink className="h-4 w-4" />;
    case 'webinar':
      return <Video className="h-4 w-4" />;
    case 'networking':
      return <Star className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};