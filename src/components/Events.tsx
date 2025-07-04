import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  BookmarkPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Event } from '../types';

export default function Events() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('upcoming');
  
  // Mock events data
  const events: Event[] = [
    {
      id: '1',
      title: 'Fall 2024 Career Fair',
      description: 'Connect with top employers from tech, finance, healthcare, and more. Bring your resume and dress professionally.',
      type: 'career_fair',
      location: 'ASU Memorial Union Ballroom',
      start_date: '2024-10-15T09:00:00Z',
      end_date: '2024-10-15T16:00:00Z',
      capacity: 500,
      registered_count: 387,
      organizer_id: 'admin-1',
      organizer_type: 'admin',
      status: 'published',
      requirements: ['Bring printed resumes', 'Business professional attire'],
      tags: ['career', 'networking', 'jobs'],
      image_url: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
      created_at: '2024-09-01T00:00:00Z',
      updated_at: '2024-09-15T00:00:00Z'
    },
    {
      id: '2',
      title: 'Resume Writing Workshop',
      description: 'Learn how to craft a compelling resume that stands out to employers. Interactive session with personalized feedback.',
      type: 'workshop',
      location: 'Virtual Event',
      virtual_link: 'https://zoom.us/j/example',
      start_date: '2024-09-25T14:00:00Z',
      end_date: '2024-09-25T16:00:00Z',
      capacity: 50,
      registered_count: 42,
      organizer_id: 'admin-2',
      organizer_type: 'admin',
      status: 'published',
      requirements: ['Bring current resume draft', 'Laptop or tablet'],
      tags: ['resume', 'workshop', 'career development'],
      created_at: '2024-09-01T00:00:00Z',
      updated_at: '2024-09-10T00:00:00Z'
    },
    {
      id: '3',
      title: 'Intel Information Session',
      description: 'Learn about internship and full-time opportunities at Intel. Q&A session with current engineers and recruiters.',
      type: 'info_session',
      location: 'Engineering Center Room 202',
      start_date: '2024-10-05T18:00:00Z',
      end_date: '2024-10-05T19:30:00Z',
      capacity: 100,
      registered_count: 78,
      organizer_id: 'employer-1',
      organizer_type: 'employer',
      status: 'published',
      requirements: ['RSVP required'],
      tags: ['intel', 'technology', 'internships'],
      created_at: '2024-09-15T00:00:00Z',
      updated_at: '2024-09-20T00:00:00Z'
    },
    {
      id: '4',
      title: 'Tech Industry Networking Night',
      description: 'Network with alumni and professionals in the technology industry. Casual networking with refreshments provided.',
      type: 'networking',
      location: 'ASU SkySong Innovation Center',
      start_date: '2024-10-20T17:00:00Z',
      end_date: '2024-10-20T20:00:00Z',
      capacity: 150,
      registered_count: 89,
      organizer_id: 'admin-3',
      organizer_type: 'admin',
      status: 'published',
      requirements: ['Business casual attire', 'Bring business cards if available'],
      tags: ['networking', 'technology', 'alumni'],
      created_at: '2024-09-10T00:00:00Z',
      updated_at: '2024-09-25T00:00:00Z'
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    
    const eventDate = new Date(event.start_date);
    const now = new Date();
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'upcoming' && eventDate > now) ||
                       (dateFilter === 'past' && eventDate < now);
    
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

  const formatEventType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  const handleRegister = (eventId: string) => {
    // In real implementation, this would call Supabase
    alert('Registration successful! Check your email for event details.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
            <p className="text-gray-600">Discover career fairs, workshops, and networking opportunities</p>
          </div>
          {user?.role === 'admin' && (
            <Link
              to="/create-event"
              className="mt-4 sm:mt-0 bg-asu-maroon text-white px-6 py-3 rounded-md hover:bg-asu-maroon-dark transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create Event</span>
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="career_fair">Career Fairs</option>
                <option value="workshop">Workshops</option>
                <option value="info_session">Info Sessions</option>
                <option value="webinar">Webinars</option>
                <option value="networking">Networking</option>
              </select>
            </div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past Events</option>
              <option value="all">All Events</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            {event.image_url && (
              <div className="h-48 overflow-hidden">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
                    {formatEventType(event.type)}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-asu-maroon transition-colors">
                  <BookmarkPlus className="h-5 w-5" />
                </button>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(event.start_date)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(event.start_date)} - {formatTime(event.end_date)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  {event.virtual_link ? (
                    <>
                      <Video className="h-4 w-4" />
                      <span>Virtual Event</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{event.registered_count}/{event.capacity || '∞'} registered</span>
                </div>
              </div>

              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {event.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                  {event.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{event.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex space-x-2">
                <Link
                  to={`/event/${event.id}`}
                  className="flex-1 border border-asu-maroon text-asu-maroon px-4 py-2 rounded-md hover:bg-asu-maroon hover:text-white transition-colors text-center flex items-center justify-center space-x-1"
                >
                  <span>View Details</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
                {user?.role === 'student' && isUpcoming(event.start_date) && (
                  <button
                    onClick={() => handleRegister(event.id)}
                    className="flex-1 bg-asu-maroon text-white px-4 py-2 rounded-md hover:bg-asu-maroon-dark transition-colors"
                    disabled={event.capacity && event.registered_count >= event.capacity}
                  >
                    {event.capacity && event.registered_count >= event.capacity ? 'Full' : 'Register'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">
            {searchTerm || typeFilter !== 'all' || dateFilter !== 'upcoming'
              ? 'Try adjusting your search criteria or filters'
              : 'No events are currently scheduled'
            }
          </p>
        </div>
      )}
    </div>
  );
}