import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Search, 
  Filter, 
  User, 
  Building2, 
  Star, 
  Heart, 
  Coffee, 
  Sparkles, 
  Zap, 
  TrendingUp,
  Award,
  Bookmark,
  Share2,
  Eye,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Event } from '../types';

export default function Events() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [rsvpedEvents, setRsvpedEvents] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Mock events data
  const events: Event[] = [
    {
      id: '1',
      title: 'Tech Career Fair 2024',
      description: 'Connect with top technology companies and explore exciting career opportunities. Meet recruiters from Google, Microsoft, Apple, and more!',
      date: '2024-03-15',
      time: '10:00 AM',
      location: 'Memorial Union Ballroom',
      capacity: 500,
      registered: 387,
      category: 'career',
      type: 'in-person',
      organizer: 'ASU Career Services',
      featured: true,
      tags: ['networking', 'technology', 'recruiting', 'internships']
    },
    {
      id: '2',
      title: 'Resume Writing Workshop',
      description: 'Learn how to craft the perfect resume that gets noticed by employers. Interactive session with personalized feedback.',
      date: '2024-03-10',
      time: '2:00 PM',
      location: 'Virtual Event',
      capacity: 100,
      registered: 78,
      category: 'workshop',
      type: 'virtual',
      organizer: 'Career Development Team',
      featured: false,
      tags: ['resume', 'career advice', 'professional development']
    },
    {
      id: '3',
      title: 'Google Information Session',
      description: 'Join Google engineers and recruiters to learn about internship programs, company culture, and application tips.',
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
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    const matchesTime = timeFilter === 'all' || 
                       (timeFilter === 'today' && new Date(event.date).toDateString() === new Date().toDateString()) ||
                       (timeFilter === 'week' && new Date(event.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesCategory && matchesTime;
  });

  const toggleRSVP = (eventId: string) => {
    setRsvpedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-white relative ${isLoaded ? 'animate-fade-in' : ''}`}>
      {/* Decorative elements with floating animation */}
      <div className="absolute top-16 right-24 w-4 h-4 bg-asu-gold/40 rounded-full animate-float"></div>
      <div className="absolute top-32 left-16 w-3 h-3 bg-asu-maroon/30 rounded-full animate-float animate-delay-200"></div>
      <Sparkles className="absolute top-24 left-1/4 h-5 w-5 text-asu-gold/60 animate-bounce-gentle" />
      <Coffee className="absolute bottom-32 right-1/4 h-4 w-4 text-asu-maroon/50 animate-float animate-delay-300" />
      <Heart className="absolute bottom-20 left-1/3 h-4 w-4 text-asu-gold/70 animate-pulse-gentle" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with slide animation */}
        <div className="mb-12 animate-slide-up">
          <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-3xl p-8 text-white relative overflow-hidden hover-glow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4 relative text-gradient">
                Campus Events 📅
                <div className="absolute -top-3 -right-8 w-6 h-6 bg-asu-gold rounded-full animate-pulse-gentle"></div>
              </h1>
              <p className="text-xl text-white/90 mb-6 max-w-3xl">
                Discover amazing career events, workshops, and networking opportunities at ASU ✨
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover-scale">
                  <Calendar className="h-5 w-5" />
                  <span>12 upcoming events 📈</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover-scale">
                  <Users className="h-5 w-5" />
                  <span>500+ students attending 🎯</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover-scale">
                  <Star className="h-5 w-5" />
                  <span>Career-focused content 🌟</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats with staggered animations */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 interactive-card animate-slide-up animate-delay-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center icon-bounce">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-blue-600 text-sm bg-blue-50 rounded-full px-3 py-1 w-fit">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>Growing weekly 📈</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 interactive-card animate-slide-up animate-delay-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">This Week</p>
                <p className="text-3xl font-bold text-gray-900">5</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center icon-bounce">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600 text-sm bg-green-50 rounded-full px-3 py-1 w-fit">
              <Zap className="h-4 w-4 mr-1" />
              <span>Don't miss out ⚡</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 interactive-card animate-slide-up animate-delay-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Attendees</p>
                <p className="text-3xl font-bold text-gray-900">500+</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center icon-bounce">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-purple-600 text-sm bg-purple-50 rounded-full px-3 py-1 w-fit">
              <Star className="h-4 w-4 mr-1" />
              <span>Amazing network 🌟</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 interactive-card animate-slide-up animate-delay-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Your RSVPs</p>
                <p className="text-3xl font-bold text-gray-900">{rsvpedEvents.size}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center icon-bounce">
                <Award className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-red-600 text-sm bg-red-50 rounded-full px-3 py-1 w-fit">
              <Heart className="h-4 w-4 mr-1" />
              <span>Ready to grow 🚀</span>
            </div>
          </div>
        </div>

        {/* Filters with slide animation */}
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100 p-8 mb-12 animate-slide-left">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events... 🔍"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner transition-all duration-200 hover:shadow-md input-focus"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner cursor-pointer hover:shadow-md transition-all duration-200 input-focus"
                >
                  <option value="all">All Categories 📋</option>
                  <option value="career">Career Events 💼</option>
                  <option value="workshop">Workshops 🛠️</option>
                  <option value="networking">Networking 🤝</option>
                  <option value="info">Info Sessions 📢</option>
                </select>
              </div>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner cursor-pointer hover:shadow-md transition-all duration-200 input-focus"
              >
                <option value="all">All Time 📅</option>
                <option value="today">Today 📍</option>
                <option value="week">This Week 📆</option>
                <option value="month">This Month 🗓️</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid with staggered animations */}
        <div className="space-y-6">
          {filteredEvents.map((event, index) => (
            <div 
              key={event.id} 
              className={`bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden interactive-card animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-center space-x-3 mb-3">
                      {event.featured && (
                        <span className="bg-gradient-to-r from-asu-gold to-yellow-400 text-asu-maroon px-3 py-1 rounded-full text-sm font-bold animate-bounce-gentle">
                          ⭐ Featured
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        event.category === 'career' ? 'bg-blue-100 text-blue-800' :
                        event.category === 'workshop' ? 'bg-green-100 text-green-800' :
                        event.category === 'networking' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {event.category === 'career' && '💼 Career Event'}
                        {event.category === 'workshop' && '🛠️ Workshop'}
                        {event.category === 'networking' && '🤝 Networking'}
                        {event.category === 'info' && '📢 Info Session'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        event.type === 'virtual' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {event.type === 'virtual' ? '💻 Virtual' : '📍 In-Person'}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-asu-maroon transition-colors cursor-pointer">
                      {event.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 hover-scale">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 hover-scale">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 hover-scale">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 hover-scale">
                        <Building2 className="h-4 w-4" />
                        <span className="font-medium">{event.organizer}</span>
                      </div>
                    </div>

                    {event.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-full text-xs font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-200 cursor-pointer hover-scale"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {event.registered}/{event.capacity}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">registered</div>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="progress-bar h-2 rounded-full" 
                          style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => toggleRSVP(event.id)}
                    className={`interactive-button px-6 py-3 rounded-2xl font-semibold shadow-md flex items-center space-x-2 ${
                      rsvpedEvents.has(event.id)
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white hover:shadow-lg'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>{rsvpedEvents.has(event.id) ? 'RSVP\'d ✓' : 'RSVP Now'}</span>
                  </button>
                  
                  <button className="interactive-button border-2 border-asu-maroon text-asu-maroon px-6 py-3 rounded-2xl hover:bg-asu-maroon hover:text-white font-semibold shadow-sm hover:shadow-md flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  
                  <button className="interactive-button border border-gray-300 text-gray-600 px-4 py-3 rounded-2xl hover:bg-gray-50 flex items-center justify-center">
                    <Share2 className="h-4 w-4" />
                  </button>
                  
                  <button className="interactive-button border border-gray-300 text-gray-600 px-4 py-3 rounded-2xl hover:bg-gray-50 flex items-center justify-center">
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100 animate-scale-in">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce-gentle">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No events found</h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              {searchTerm || categoryFilter !== 'all' || timeFilter !== 'all' 
                ? "Try adjusting your search criteria! 🔍"
                : "New events are added regularly. Check back soon! 🚀"
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {(searchTerm || categoryFilter !== 'all' || timeFilter !== 'all') ? (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setTimeFilter('all');
                  }}
                  className="interactive-button bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-8 py-4 rounded-2xl hover:shadow-xl font-semibold shadow-lg"
                >
                  Clear Filters 🔄
                </button>
              ) : (
                <button className="interactive-button bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-8 py-4 rounded-2xl hover:shadow-xl font-semibold shadow-lg">
                  Create Event 📅
                </button>
              )}
              <button className="interactive-button border-2 border-asu-maroon text-asu-maroon px-8 py-4 rounded-2xl hover:bg-asu-maroon hover:text-white font-semibold shadow-sm hover:shadow-md">
                Browse All Events 🔍
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions - fixed colors
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

// Mock events data
const events = [
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