import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar,
  MapPin,
  Clock,
  Users,
  Search,
  Filter,
  CalendarDays,
  Building2,
  GraduationCap,
  Video,
  UserPlus,
  Bookmark,
  Share,
  User,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Event as CareerEvent } from '../types';
import { supabase } from '../lib/supabase';
import Button from './ui/Button';
import { cn } from '../lib/cva';

export default function Events() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [events, setEvents] = useState<CareerEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedEvents, setSavedEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;

      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert([{
          event_id: eventId,
          user_id: user.id,
          registered_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, isRegistered: true, attendees: event.attendees + 1 }
          : event
      ));
    } catch (err) {
      console.error('Error registering for event:', err);
    }
  };

  const toggleSaveEvent = (eventId: string) => {
    setSavedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'fair': return <Building2 className="h-4 w-4" />;
      case 'workshop': return <GraduationCap className="h-4 w-4" />;
      case 'networking': return <Users className="h-4 w-4" />;
      case 'webinar': return <Video className="h-4 w-4" />;
      case 'info-session': return <UserPlus className="h-4 w-4" />;
      default: return <CalendarDays className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'fair': return 'text-blue-500';
      case 'workshop': return 'text-green-500';
      case 'networking': return 'text-purple-500';
      case 'webinar': return 'text-red-500';
      case 'info-session': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <div className="max-w-2xl mx-auto p-4">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`p-4 border-b animate-pulse ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className={`h-4 rounded mb-2 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                <div className={`h-3 rounded w-3/4 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <div className="max-w-2xl mx-auto p-4">
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Failed to load events</p>
            <Button onClick={fetchEvents} variant="outlined" className="rounded-full">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      
      {/* X-Style Header */}
      <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${
        isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-2xl mx-auto px-4 py-3">
          <h1 className="text-xl font-bold">Events</h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {filteredEvents.length} upcoming events
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        
        {/* Search & Filter */}
        <div className={`border-b p-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="space-y-4">
            
            {/* Search */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 text-xl bg-transparent border-none outline-none ${
                  isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
                }`}
              />
            </div>

            {/* Filter Pills */}
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {[
                { value: 'all', label: 'All', icon: CalendarDays },
                { value: 'fair', label: 'Fairs', icon: Building2 },
                { value: 'workshop', label: 'Workshops', icon: GraduationCap },
                { value: 'networking', label: 'Networking', icon: Users },
                { value: 'webinar', label: 'Webinars', icon: Video },
                { value: 'info-session', label: 'Info Sessions', icon: UserPlus }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTypeFilter(value)}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                    typeFilter === value
                      ? isDark 
                        ? 'bg-white text-black' 
                        : 'bg-black text-white'
                      : isDark 
                        ? 'bg-gray-900 text-gray-300 hover:bg-gray-800' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events List */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 px-4">
            <CalendarDays className={`h-16 w-16 mx-auto mb-4 ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className="text-xl font-bold mb-2">No events found</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              Try adjusting your search or filters
            </p>
            <Button 
              variant="outlined" 
              className="rounded-full"
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredEvents.map((event, index) => (
              <article key={event.id} className={`border-b p-4 hover:bg-opacity-50 transition-colors cursor-pointer ${
                isDark ? 'border-gray-800 hover:bg-gray-900' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                
                {/* Event Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    
                    {/* Event Avatar */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-gray-900' : 'bg-gray-100'
                    }`}>
                      <div className={getEventTypeColor(event.type)}>
                        {getEventTypeIcon(event.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      
                      {/* Organizer & Type */}
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-bold text-sm">{event.organizer}</span>
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>•</span>
                        <div className={`flex items-center space-x-1 text-sm ${getEventTypeColor(event.type)}`}>
                          {getEventTypeIcon(event.type)}
                          <span className="capitalize">{event.type.replace('-', ' ')}</span>
                        </div>
                      </div>

                      {/* Event Title */}
                      <h2 className="text-xl font-bold mb-2 leading-tight">
                        {event.title}
                      </h2>

                      {/* Event Description */}
                      <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {event.description}
                      </p>

                      {/* Event Details */}
                      <div className={`space-y-1 text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{event.attendees.toLocaleString()} attending</span>
                          {event.maxAttendees && (
                            <>
                              <span>•</span>
                              <span>{(event.maxAttendees - event.attendees).toLocaleString()} spots left</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Event Tags */}
                      {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {event.tags.slice(0, 4).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              #{tag}
                            </span>
                          ))}
                          {event.tags.length > 4 && (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                            }`}>
                              +{event.tags.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 flex-shrink-0"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pl-15">
                  <div className="flex items-center space-x-6">
                    
                    {/* Save Button */}
                    <button
                      onClick={() => toggleSaveEvent(event.id)}
                      className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                        savedEvents.has(event.id)
                          ? 'text-red-500 hover:text-red-600'
                          : isDark 
                            ? 'text-gray-400 hover:text-red-500' 
                            : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${savedEvents.has(event.id) ? 'fill-current' : ''}`} />
                      <span>Save</span>
                    </button>

                    {/* Share Button */}
                    <button className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                      isDark ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-500'
                    }`}>
                      <Share className="h-5 w-5" />
                      <span>Share</span>
                    </button>

                    {/* View Details */}
                    <Link 
                      to={`/events/${event.id}`}
                      className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                        isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-500'
                      }`}
                    >
                      <Eye className="h-5 w-5" />
                      <span>Details</span>
                    </Link>
                  </div>

                  {/* Register Button */}
                  <div className="flex-shrink-0">
                    {event.isRegistered ? (
                      <Button
                        variant="outlined"
                        size="sm"
                        className="rounded-full font-bold min-w-24"
                      >
                        Registered
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleRegister(event.id)}
                        className={`rounded-full font-bold min-w-24 ${
                          isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                        }`}
                      >
                        Register
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Trending Events Section */}
        {filteredEvents.length > 0 && (
          <div className={`border-t p-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <h3 className="font-bold">Trending Events</h3>
            </div>
            <div className="space-y-2">
              {filteredEvents
                .sort((a, b) => b.attendees - a.attendees)
                .slice(0, 3)
                .map((event, index) => (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className={`block p-3 rounded-xl transition-colors ${
                      isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm font-bold ${
                          index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-gray-400' : 
                          'text-orange-600'
                        }`}>
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-sm">{event.title}</p>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {event.attendees.toLocaleString()} attending
                          </p>
                        </div>
                      </div>
                      <div className={getEventTypeColor(event.type)}>
                        {getEventTypeIcon(event.type)}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}