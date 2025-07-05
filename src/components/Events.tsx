import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Event,
  LocationOn,
  AccessTime,
  Person,
  Search,
  FilterList,
  CalendarToday,
  BusinessCenter,
  School,
  Group,
  Bookmark,
  Share
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import Typography from './ui/Typography';
import Button from './ui/Button';
import Input from './ui/Input';
import { Card } from './ui/Card';

interface CareerEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'workshop' | 'fair' | 'networking' | 'webinar' | 'info-session';
  organizer: string;
  attendees: number;
  maxAttendees: number;
  isRegistered: boolean;
  isVirtual: boolean;
  tags: string[];
}

export default function Events() {
  const { isDark } = useTheme();
  const [events, setEvents] = useState<CareerEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock events data
    const mockEvents: CareerEvent[] = [
      {
        id: '1',
        title: 'Tech Career Fair 2024',
        description: 'Connect with top tech companies hiring for internships and full-time positions. Meet recruiters from Google, Microsoft, Apple, and more.',
        date: '2024-02-15',
        time: '10:00 AM - 4:00 PM',
        location: 'ASU Memorial Union',
        type: 'fair',
        organizer: 'ASU Career Services',
        attendees: 245,
        maxAttendees: 500,
        isRegistered: false,
        isVirtual: false,
        tags: ['Technology', 'Internships', 'Full-time', 'Networking']
      },
      {
        id: '2',
        title: 'Resume Writing Workshop',
        description: 'Learn how to craft a compelling resume that stands out to employers. Get personalized feedback from career counselors.',
        date: '2024-02-12',
        time: '2:00 PM - 4:00 PM',
        location: 'Virtual Event',
        type: 'workshop',
        organizer: 'Career Development Center',
        attendees: 78,
        maxAttendees: 100,
        isRegistered: true,
        isVirtual: true,
        tags: ['Resume', 'Career Development', 'Writing Skills']
      },
      {
        id: '3',
        title: 'LinkedIn Networking Strategies',
        description: 'Master the art of professional networking on LinkedIn. Build meaningful connections and grow your professional network.',
        date: '2024-02-18',
        time: '6:00 PM - 7:30 PM',
        location: 'Virtual Event',
        type: 'webinar',
        organizer: 'Alumni Network',
        attendees: 156,
        maxAttendees: 200,
        isRegistered: false,
        isVirtual: true,
        tags: ['LinkedIn', 'Networking', 'Professional Development']
      },
      {
        id: '4',
        title: 'Finance Industry Info Session',
        description: 'Discover career opportunities in finance. Learn about different roles, required skills, and application processes.',
        date: '2024-02-20',
        time: '5:00 PM - 6:30 PM',
        location: 'Business Building Room 101',
        type: 'info-session',
        organizer: 'Finance Department',
        attendees: 92,
        maxAttendees: 150,
        isRegistered: false,
        isVirtual: false,
        tags: ['Finance', 'Banking', 'Investment', 'Career Paths']
      }
    ];

    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'fair': return <BusinessCenter className="h-5 w-5" />;
      case 'workshop': return <School className="h-5 w-5" />;
      case 'networking': return <Group className="h-5 w-5" />;
      case 'webinar': return <Event className="h-5 w-5" />;
      case 'info-session': return <Person className="h-5 w-5" />;
      default: return <Event className="h-5 w-5" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'fair': return isDark ? 'bg-lime/10 text-lime' : 'bg-asu-maroon/10 text-asu-maroon';
      case 'workshop': return isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600';
      case 'networking': return isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600';
      case 'webinar': return isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600';
      case 'info-session': return isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600';
      default: return isDark ? 'bg-gray-500/10 text-gray-400' : 'bg-gray-50 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
              isDark ? 'border-lime' : 'border-asu-maroon'
            }`}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <Typography variant="h4" className="font-medium mb-2">
            Career Events
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Discover networking opportunities, workshops, and career fairs.
          </Typography>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6" elevation={1}>
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-lime/10 text-lime' : 'bg-asu-maroon/10 text-asu-maroon'
              }`}>
                <Event className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <Typography variant="h5" className="font-semibold">
                  {events.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Events
                </Typography>
              </div>
            </div>
          </Card>

          <Card className="p-6" elevation={1}>
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
              }`}>
                <CalendarToday className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <Typography variant="h5" className="font-semibold">
                  {events.filter(e => e.isRegistered).length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Registered
                </Typography>
              </div>
            </div>
          </Card>

          <Card className="p-6" elevation={1}>
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'
              }`}>
                <Group className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <Typography variant="h5" className="font-semibold">
                  {events.reduce((sum, e) => sum + e.attendees, 0)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Attendees
                </Typography>
              </div>
            </div>
          </Card>

          <Card className="p-6" elevation={1}>
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'
              }`}>
                <BusinessCenter className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <Typography variant="h5" className="font-semibold">
                  {events.filter(e => e.type === 'fair').length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Career Fairs
                </Typography>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8" elevation={1}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startIcon={<Search />}
                variant="outlined"
                fullWidth
              />
            </div>
            <div className="flex gap-4">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  isDark 
                    ? 'border-gray-600 bg-dark-surface text-dark-text focus:ring-lime' 
                    : 'border-gray-300 bg-white text-gray-900 focus:ring-asu-maroon'
                }`}
              >
                <option value="all">All Types</option>
                <option value="fair">Career Fairs</option>
                <option value="workshop">Workshops</option>
                <option value="networking">Networking</option>
                <option value="webinar">Webinars</option>
                <option value="info-session">Info Sessions</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <Card className="p-12 text-center" elevation={1}>
            <Event className={`h-16 w-16 mx-auto mb-4 ${
              isDark ? 'text-dark-muted' : 'text-gray-400'
            }`} />
            <Typography variant="h6" className="mb-2">
              No events found
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-4">
              Try adjusting your search criteria or check back later for new events
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow" elevation={1}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
                    {getEventTypeIcon(event.type)}
                    <span className="capitalize">{event.type.replace('-', ' ')}</span>
                  </div>
                  <Button variant="text" size="small" className="min-w-0 p-1">
                    <Bookmark className="h-5 w-5" />
                  </Button>
                </div>

                <Typography variant="h6" className="font-medium mb-2">
                  {event.title}
                </Typography>

                <Typography variant="body2" color="textSecondary" className="mb-4 line-clamp-3">
                  {event.description}
                </Typography>

                <div className="space-y-2 mb-4">
                  <div className={`flex items-center text-sm ${
                    isDark ? 'text-dark-muted' : 'text-gray-600'
                  }`}>
                    <CalendarToday className="h-4 w-4 mr-2" />
                    {new Date(event.date).toLocaleDateString()} • {event.time}
                  </div>
                  <div className={`flex items-center text-sm ${
                    isDark ? 'text-dark-muted' : 'text-gray-600'
                  }`}>
                    <LocationOn className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  <div className={`flex items-center text-sm ${
                    isDark ? 'text-dark-muted' : 'text-gray-600'
                  }`}>
                    <Person className="h-4 w-4 mr-2" />
                    {event.attendees}/{event.maxAttendees} attendees
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {event.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                  {event.tags.length > 3 && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      +{event.tags.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  {event.isRegistered ? (
                    <Button variant="outlined" size="small" fullWidth>
                      Registered
                    </Button>
                  ) : (
                    <Button variant="contained" size="small" fullWidth>
                      Register
                    </Button>
                  )}
                  <Button variant="text" size="small" className="min-w-0 px-3">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}