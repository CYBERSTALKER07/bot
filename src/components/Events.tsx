import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Search, 
  Filter,
  Heart,
  Share2,
  ExternalLink,
  UserPlus,
  Trophy,
  Sparkles,
  Coffee,
  Zap,
  Building2,
  GraduationCap,
  BookOpen,
  Video,
  Globe,
  Target,
  Award,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'workshop' | 'career-fair' | 'networking' | 'webinar' | 'interview-prep' | 'company-info';
  organizer: string;
  attendees: number;
  maxAttendees: number;
  image: string;
  tags: string[];
  featured: boolean;
  virtual: boolean;
  price: number;
  registered: boolean;
  rating: number;
  reviewCount: number;
}

export default function Events() {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [showRegistered, setShowRegistered] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance animation
      gsap.fromTo(headerRef.current, {
        opacity: 0,
        y: -60,
        scale: 0.8,
        rotation: -2
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 1.5,
        ease: 'power3.out'
      });

      // Filters entrance
      gsap.fromTo(filtersRef.current, {
        opacity: 0,
        y: 40,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.3
      });

      // Event cards entrance with staggered animation
      gsap.fromTo('.event-card', {
        opacity: 0,
        y: 60,
        scale: 0.8,
        rotation: 3
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 1,
        ease: 'back.out(1.7)',
        stagger: 0.15,
        delay: 0.6
      });

      // Featured event special animation
      gsap.fromTo('.featured-event', {
        opacity: 0,
        scale: 0.7,
        rotation: -5
      }, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.3)',
        delay: 0.4
      });

      // Floating decorations
      gsap.to('.event-decoration', {
        y: -15,
        x: 8,
        rotation: 360,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Pulse animation for live events
      gsap.to('.live-indicator', {
        scale: 1.2,
        opacity: 0.6,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const eventTypes = [
    { value: 'all', label: 'All Events', icon: Calendar, color: 'bg-gray-100 text-gray-700' },
    { value: 'workshop', label: 'Workshops', icon: BookOpen, color: 'bg-blue-100 text-blue-700' },
    { value: 'career-fair', label: 'Career Fairs', icon: Building2, color: 'bg-green-100 text-green-700' },
    { value: 'networking', label: 'Networking', icon: Users, color: 'bg-purple-100 text-purple-700' },
    { value: 'webinar', label: 'Webinars', icon: Video, color: 'bg-orange-100 text-orange-700' },
    { value: 'interview-prep', label: 'Interview Prep', icon: Target, color: 'bg-red-100 text-red-700' },
    { value: 'company-info', label: 'Company Info', icon: Award, color: 'bg-yellow-100 text-yellow-700' }
  ];

  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Tech Giants Career Fair 2024',
      description: 'Meet recruiters from Google, Microsoft, Apple, and other top tech companies. Network with industry professionals and discover exciting career opportunities.',
      date: '2024-02-15',
      time: '10:00 AM - 4:00 PM',
      location: 'ASU Memorial Union',
      type: 'career-fair',
      organizer: 'ASU Career Services',
      attendees: 450,
      maxAttendees: 500,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
      tags: ['Tech', 'Internships', 'Full-time', 'Networking'],
      featured: true,
      virtual: false,
      price: 0,
      registered: false,
      rating: 4.9,
      reviewCount: 127
    },
    {
      id: '2',
      title: 'Resume Writing Workshop',
      description: 'Learn how to create compelling resumes that stand out to employers. Get personalized feedback from career advisors.',
      date: '2024-02-10',
      time: '2:00 PM - 4:00 PM',
      location: 'Virtual Event',
      type: 'workshop',
      organizer: 'Career Development Center',
      attendees: 85,
      maxAttendees: 100,
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop',
      tags: ['Resume', 'Career Tips', 'Professional Development'],
      featured: false,
      virtual: true,
      price: 0,
      registered: true,
      rating: 4.7,
      reviewCount: 43
    },
    {
      id: '3',
      title: 'Mock Interview Session',
      description: 'Practice your interview skills with experienced professionals. Get real-time feedback and improve your confidence.',
      date: '2024-02-12',
      time: '1:00 PM - 3:00 PM',
      location: 'Business School',
      type: 'interview-prep',
      organizer: 'Professional Development',
      attendees: 25,
      maxAttendees: 30,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=400&fit=crop',
      tags: ['Interview', 'Practice', 'Feedback'],
      featured: false,
      virtual: false,
      price: 0,
      registered: false,
      rating: 4.8,
      reviewCount: 67
    },
    {
      id: '4',
      title: 'Startup Networking Night',
      description: 'Connect with entrepreneurs, startup founders, and fellow students interested in the startup ecosystem.',
      date: '2024-02-18',
      time: '6:00 PM - 8:00 PM',
      location: 'Innovation Hub',
      type: 'networking',
      organizer: 'Entrepreneurship Club',
      attendees: 120,
      maxAttendees: 150,
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop',
      tags: ['Startup', 'Entrepreneurship', 'Networking'],
      featured: true,
      virtual: false,
      price: 15,
      registered: true,
      rating: 4.6,
      reviewCount: 89
    },
    {
      id: '5',
      title: 'Data Science Webinar Series',
      description: 'Deep dive into data science trends, tools, and career opportunities. Industry experts share insights.',
      date: '2024-02-20',
      time: '3:00 PM - 5:00 PM',
      location: 'Virtual Event',
      type: 'webinar',
      organizer: 'Data Science Institute',
      attendees: 300,
      maxAttendees: 500,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
      tags: ['Data Science', 'Analytics', 'Machine Learning'],
      featured: false,
      virtual: true,
      price: 0,
      registered: false,
      rating: 4.9,
      reviewCount: 156
    },
    {
      id: '6',
      title: 'Goldman Sachs Info Session',
      description: 'Learn about career opportunities at Goldman Sachs. Meet current employees and understand the application process.',
      date: '2024-02-25',
      time: '7:00 PM - 8:30 PM',
      location: 'Business School Auditorium',
      type: 'company-info',
      organizer: 'Goldman Sachs',
      attendees: 200,
      maxAttendees: 250,
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
      tags: ['Finance', 'Investment Banking', 'Company'],
      featured: false,
      virtual: false,
      price: 0,
      registered: false,
      rating: 4.5,
      reviewCount: 78
    }
  ];

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || event.type === selectedType;
    
    const matchesRegistered = !showRegistered || event.registered;
    
    return matchesSearch && matchesType && matchesRegistered;
  });

  const handleRegister = (eventId: string) => {
    // Animation for registration
    gsap.to(`.event-card-${eventId}`, {
      scale: 1.05,
      duration: 0.2,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventTypeColor = (type: string) => {
    const eventType = eventTypes.find(t => t.value === type);
    return eventType?.color || 'bg-gray-100 text-gray-700';
  };

  const getEventTypeIcon = (type: string) => {
    const eventType = eventTypes.find(t => t.value === type);
    const Icon = eventType?.icon || Calendar;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative">
      {/* Decorative elements */}
      <div className="event-decoration absolute top-20 right-20 w-4 h-4 bg-asu-gold/40 rounded-full"></div>
      <div className="event-decoration absolute top-40 left-20 w-3 h-3 bg-asu-maroon/30 rounded-full"></div>
      <Sparkles className="event-decoration absolute top-32 left-1/4 h-5 w-5 text-asu-gold/60" />
      <Coffee className="event-decoration absolute bottom-32 right-1/3 h-4 w-4 text-asu-maroon/50" />
      <Zap className="event-decoration absolute bottom-20 left-1/4 h-4 w-4 text-asu-gold/70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4 relative">
                Career Events 📅
                <div className="absolute -top-3 -right-8 w-6 h-6 bg-asu-gold rounded-full"></div>
              </h1>
              <p className="text-xl text-white/90 mb-6 max-w-3xl">
                Discover amazing career events, workshops, and networking opportunities ✨
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Calendar className="h-5 w-5" />
                  <span>Weekly events 📆</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Users className="h-5 w-5" />
                  <span>Expert speakers 🎤</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Award className="h-5 w-5" />
                  <span>Career growth 📈</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div ref={filtersRef} className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">Filter Events</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">View:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    viewMode === 'grid' 
                      ? 'bg-asu-maroon text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    viewMode === 'list' 
                      ? 'bg-asu-maroon text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  List
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events... 🔍"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                />
              </div>

              {/* Event Type Filter */}
              <div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                >
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Filters */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showRegistered}
                    onChange={(e) => setShowRegistered(e.target.checked)}
                    className="rounded border-gray-300 text-asu-maroon focus:ring-asu-maroon"
                  />
                  <span className="text-sm text-gray-700">My Events</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid/List */}
        <div ref={eventsRef} className="space-y-6">
          {filteredEvents.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`event-card event-card-${event.id} ${event.featured ? 'featured-event' : ''} bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Event Image */}
                  <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'}`}>
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Event Type Badge */}
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                      <div className="flex items-center space-x-1">
                        {getEventTypeIcon(event.type)}
                        <span>{eventTypes.find(t => t.value === event.type)?.label}</span>
                      </div>
                    </div>

                    {/* Featured Badge */}
                    {event.featured && (
                      <div className="absolute top-3 right-3 bg-asu-gold text-asu-maroon px-3 py-1 rounded-full text-xs font-bold">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>Featured</span>
                        </div>
                      </div>
                    )}

                    {/* Virtual Badge */}
                    {event.virtual && (
                      <div className="absolute bottom-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        <div className="flex items-center space-x-1">
                          <Globe className="h-3 w-3" />
                          <span>Virtual</span>
                        </div>
                      </div>
                    )}

                    {/* Price Badge */}
                    {event.price > 0 && (
                      <div className="absolute bottom-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        ${event.price}
                      </div>
                    )}

                    {/* Registered Badge */}
                    {event.registered && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        <div className="flex items-center space-x-1">
                          <UserPlus className="h-3 w-3" />
                          <span>Registered</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">{event.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-asu-maroon" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-asu-maroon" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-asu-maroon" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="h-4 w-4 text-asu-maroon" />
                        <span>{event.attendees}/{event.maxAttendees} attending</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-asu-maroon/10 text-asu-maroon text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Attendee Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Spots filled</span>
                        <span>{Math.round((event.attendees / event.maxAttendees) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-asu-maroon to-asu-gold h-2 rounded-full"
                          style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {event.registered ? (
                        <div className="flex-1 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-center font-medium">
                          <div className="flex items-center justify-center space-x-2">
                            <UserPlus className="h-4 w-4" />
                            <span>Registered ✓</span>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRegister(event.id)}
                          className="flex-1 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                        >
                          Register Now 🚀
                        </button>
                      )}
                      <button className="p-2 text-gray-500 hover:text-asu-maroon hover:bg-asu-maroon/10 rounded-xl transition-colors">
                        <Heart className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-asu-maroon hover:bg-asu-maroon/10 rounded-xl transition-colors">
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-asu-maroon/20 to-asu-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-asu-maroon" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your search criteria or check back later for new events! 🔍
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}