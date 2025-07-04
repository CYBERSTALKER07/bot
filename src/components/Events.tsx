import React, { useState, useEffect, useRef } from 'react';
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
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Event } from '../types';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function Events() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headerRef.current, {
        duration: 1.2,
        y: -60,
        opacity: 0,
        ease: 'power3.out'
      });

      // Stats cards animation
      gsap.from('.event-stat', {
        duration: 0.8,
        y: 40,
        opacity: 0,
        scale: 0.9,
        ease: 'back.out(1.7)',
        stagger: 0.15,
        delay: 0.3
      });

      // Filters animation
      gsap.from(filtersRef.current, {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: 'power2.out',
        delay: 0.6
      });

      // Event cards scroll trigger animation
      ScrollTrigger.create({
        trigger: eventsRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.from('.event-card', {
            duration: 0.6,
            y: 50,
            opacity: 0,
            scale: 0.95,
            ease: 'power2.out',
            stagger: 0.1
          });
        }
      });

      // Enhanced hover animations for event cards
      gsap.utils.toArray('.event-card').forEach((card: any) => {
        const tl = gsap.timeline({ paused: true });
        tl.to(card, {
          y: -8,
          scale: 1.02,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          duration: 0.4,
          ease: 'power2.out'
        });

        card.addEventListener('mouseenter', () => tl.play());
        card.addEventListener('mouseleave', () => tl.reverse());
      });

      // Animate event type badges
      gsap.from('.event-badge', {
        duration: 0.6,
        scale: 0,
        opacity: 0,
        ease: 'elastic.out(1, 0.3)',
        stagger: 0.05,
        delay: 1.2
      });

      // Animate bookmark buttons
      gsap.utils.toArray('.bookmark-event').forEach((btn: any) => {
        const tl = gsap.timeline({ paused: true });
        tl.to(btn, {
          scale: 1.2,
          rotation: 10,
          duration: 0.3,
          ease: 'back.out(1.7)'
        });

        btn.addEventListener('mouseenter', () => tl.play());
        btn.addEventListener('mouseleave', () => tl.reverse());
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Mock events data
  const events: Event[] = [
    {
      id: '1',
      title: 'Tech Career Fair 2024',
      description: 'Connect with top tech companies including Google, Microsoft, Apple, and more. Explore internship and full-time opportunities.',
      type: 'career_fair',
      date: '2024-02-15',
      time: '10:00 AM - 4:00 PM',
      location: 'AUT Tempe Campus - Memorial Union',
      is_virtual: false,
      attendees_count: 450,
      max_attendees: 500,
      organizer: 'AUT Career Services',
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
      organizer: 'AUT Alumni Network',
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
      organizer: 'AUT Entrepreneurship Club',
      created_at: '2024-01-30',
      updated_at: '2024-01-30'
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    const matchesDate = dateFilter === 'all'; // Implement date filtering logic as needed
    
    return matchesSearch && matchesType && matchesDate;
  });

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
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Enhanced Header */}
      <div ref={headerRef} className="mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Career Events & Workshops</h1>
          <p className="text-xl text-gray-200 mb-4">Boost your career with networking events, workshops, and company sessions</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>5 events this week</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>1,000+ students attending</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Top companies participating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Dashboard */}
      <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="event-stat bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Events</p>
              <p className="text-3xl font-bold text-gray-900">{eventStats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-600 text-sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>Always growing</span>
          </div>
        </div>

        <div className="event-stat bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">This Week</p>
              <p className="text-3xl font-bold text-gray-900">{eventStats.thisWeek}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-600 text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Don't miss out</span>
          </div>
        </div>

        <div className="event-stat bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Virtual Events</p>
              <p className="text-3xl font-bold text-gray-900">{eventStats.virtual}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Video className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-600 text-sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>Join from anywhere</span>
          </div>
        </div>

        <div className="event-stat bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">My Registered</p>
              <p className="text-3xl font-bold text-gray-900">{eventStats.registered}</p>
            </div>
            <div className="w-12 h-12 bg-asu-maroon/10 rounded-full flex items-center justify-center">
              <Bookmark className="h-6 w-6 text-asu-maroon" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-600 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>Ready to attend</span>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div ref={filtersRef} className="bg-white rounded-xl shadow-lg border p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-aut-maroon focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-aut-maroon focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="career_fair">Career Fairs</option>
                <option value="workshop">Workshops</option>
                <option value="info_session">Info Sessions</option>
                <option value="webinar">Webinars</option>
                <option value="networking">Networking</option>
              </select>
            </div>
            {user?.role === 'employer' && (
              <Link
                to="/create-event"
                className="flex items-center space-x-2 bg-aut-maroon text-white px-4 py-3 rounded-lg hover:bg-aut-maroon-dark transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Create Event</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Events Grid */}
      <div ref={eventsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="event-card bg-white rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`event-badge px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getEventTypeColor(event.type)}`}>
                    {getEventTypeIcon(event.type)}
                    <span className="capitalize">{event.type.replace('_', ' ')}</span>
                  </span>
                  {event.is_virtual && (
                    <span className="event-badge px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Virtual
                    </span>
                  )}
                </div>
                <button className="bookmark-event p-2 text-gray-400 hover:text-aut-maroon transition-colors">
                  <BookmarkPlus className="h-5 w-5" />
                </button>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">{event.title}</h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {event.is_virtual ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{event.attendees_count}/{event.max_attendees} attendees</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-aut-maroon h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(event.attendees_count / event.max_attendees) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {event.max_attendees - event.attendees_count} spots remaining
                </p>
              </div>

              <p className="text-sm text-gray-500 mb-6">Organized by {event.organizer}</p>

              <div className="flex space-x-3">
                <button className="flex-1 bg-aut-maroon text-white px-4 py-2 rounded-lg hover:bg-aut-maroon-dark transition-colors font-medium">
                  Register Now
                </button>
                <button className="px-4 py-2 border border-aut-maroon text-aut-maroon rounded-lg hover:bg-aut-maroon hover:text-white transition-colors flex items-center space-x-1">
                  <ExternalLink className="h-4 w-4" />
                  <span>Details</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg border">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">No events found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Try adjusting your search criteria or check back later for new events.
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('all');
              setDateFilter('all');
            }}
            className="bg-aut-maroon text-white px-6 py-3 rounded-lg hover:bg-aut-maroon-dark transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}