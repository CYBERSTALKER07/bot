import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  CalendarToday, 
  LocationOn, 
  People, 
  AccessTime, 
  VideoCall, 
  FilterList,
  Search,
  Add,
  OpenInNew,
  BookmarkAdd,
  Bookmark,
  Star,
  TrendingUp,
  EmojiEvents,
  AutoAwesome,
  LocalCafe,
  Favorite,
  Bolt,
  Event,
  Business,
  School,
  Work
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Event as EventType } from '../types';
import Typography from './ui/Typography';
import Button from './ui/Button';
import Input from './ui/Input';
import { Card, StatsCard } from './ui/Card';
import Badge from './ui/Badge';

gsap.registerPlugin(ScrollTrigger);

export default function Events() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [bookmarkedEvents, setBookmarkedEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Material Design entrance animations
      gsap.fromTo('.header-card', {
        opacity: 0,
        y: -30,
        scale: 0.98
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out'
      });

      gsap.fromTo('.stats-card', {
        opacity: 0,
        y: 20,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        delay: 0.2
      });

      gsap.fromTo('.event-card', {
        opacity: 0,
        y: 30,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.4
      });

      // Floating decorations
      gsap.to('.event-decoration', {
        y: -10,
        x: 5,
        rotation: 180,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const events: EventType[] = [
    {
      id: '1',
      title: 'Tech Career Fair 2024',
      description: 'Connect with top tech companies including Google, Microsoft, Apple, and more. Explore internship and full-time opportunities.',
      type: 'career_fair',
      location: 'ASU Tempe Campus - Memorial Union',
      start_date: '2024-02-15T10:00:00Z',
      end_date: '2024-02-15T16:00:00Z',
      capacity: 500,
      registered_count: 450,
      organizer_id: 'asu-career-services',
      organizer_type: 'admin',
      status: 'published',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      title: 'Resume Writing Workshop',
      description: 'Learn how to craft compelling resumes that get noticed by recruiters. Get personalized feedback from career experts.',
      type: 'workshop',
      location: 'Virtual Event',
      virtual_link: 'https://zoom.us/j/123456789',
      start_date: '2024-02-08T14:00:00Z',
      end_date: '2024-02-08T16:00:00Z',
      capacity: 100,
      registered_count: 85,
      organizer_id: 'career-dev-center',
      organizer_type: 'admin',
      status: 'published',
      created_at: '2024-01-20T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z'
    },
    {
      id: '3',
      title: 'Google Information Session',
      description: 'Join Google engineers and recruiters to learn about internship programs, company culture, and application tips.',
      type: 'info_session',
      location: 'Engineering Center G-Wing',
      start_date: '2024-02-12T18:00:00Z',
      end_date: '2024-02-12T19:30:00Z',
      capacity: 150,
      registered_count: 120,
      organizer_id: 'google-recruiter',
      organizer_type: 'employer',
      status: 'published',
      created_at: '2024-01-18T00:00:00Z',
      updated_at: '2024-01-18T00:00:00Z'
    },
    {
      id: '4',
      title: 'Interview Skills Webinar',
      description: 'Master the art of interviewing with tips from industry professionals. Includes mock interview sessions.',
      type: 'webinar',
      location: 'Online',
      virtual_link: 'https://zoom.us/j/987654321',
      start_date: '2024-02-20T19:00:00Z',
      end_date: '2024-02-20T20:30:00Z',
      capacity: 300,
      registered_count: 200,
      organizer_id: 'asu-alumni-network',
      organizer_type: 'admin',
      status: 'published',
      created_at: '2024-01-25T00:00:00Z',
      updated_at: '2024-01-25T00:00:00Z'
    },
    {
      id: '5',
      title: 'Startup Networking Night',
      description: 'Network with local entrepreneurs and startup founders. Perfect for students interested in the startup ecosystem.',
      type: 'networking',
      location: 'SkySong Innovation Center',
      start_date: '2024-02-25T17:30:00Z',
      end_date: '2024-02-25T20:00:00Z',
      capacity: 120,
      registered_count: 75,
      organizer_id: 'asu-entrepreneurship-club',
      organizer_type: 'admin',
      status: 'published',
      created_at: '2024-01-30T00:00:00Z',
      updated_at: '2024-01-30T00:00:00Z'
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
  };

  const eventStats = [
    { 
      title: 'Total Events', 
      value: events.length.toString(), 
      subtitle: 'Always growing',
      icon: CalendarToday,
      color: 'primary' as const,
      trend: 'up' as const,
      trendValue: 'Always growing'
    },
    { 
      title: 'This Week', 
      value: '5', 
      subtitle: 'Don\'t miss out',
      icon: AccessTime,
      color: 'success' as const,
      trend: 'up' as const,
      trendValue: 'Don\'t miss out'
    },
    { 
      title: 'Virtual Events', 
      value: '2', 
      subtitle: 'Join from anywhere',
      icon: VideoCall,
      color: 'info' as const,
      trend: 'neutral' as const,
      trendValue: 'Join from anywhere'
    },
    { 
      title: 'My Registered', 
      value: '3', 
      subtitle: 'Ready to attend',
      icon: Bookmark,
      color: 'warning' as const,
      trend: 'up' as const,
      trendValue: 'Ready to attend'
    },
  ];

  return (
    <div ref={containerRef} className={`min-h-screen relative ${
      isDark ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      {/* Decorative elements */}
      <AutoAwesome className={`event-decoration absolute top-20 right-20 h-5 w-5 ${
        isDark ? 'text-lime/50' : 'text-asu-gold/50'
      }`} />
      <LocalCafe className={`event-decoration absolute top-40 left-20 h-4 w-4 ${
        isDark ? 'text-dark-accent/40' : 'text-asu-maroon/40'
      }`} />
      <Favorite className={`event-decoration absolute bottom-32 right-1/3 h-4 w-4 ${
        isDark ? 'text-lime/60' : 'text-asu-gold/60'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Card className="header-card overflow-hidden mb-8" elevation={3}>
          <div className={`p-8 text-white relative ${
            isDark 
              ? 'bg-gradient-to-r from-dark-surface to-dark-bg' 
              : 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark'
          }`}>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl ${
              isDark ? 'bg-lime/10' : 'bg-white/10'
            }`}></div>
            <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full blur-xl ${
              isDark ? 'bg-dark-accent/20' : 'bg-asu-gold/20'
            }`}></div>
            
            <div className="relative z-10">
              <Typography variant="h3" className="font-bold mb-4 text-white">
                Career Events & Workshops
              </Typography>
              <Typography variant="subtitle1" className={`mb-6 max-w-3xl ${
                isDark ? 'text-dark-muted' : 'text-white/90'
              }`}>
                Boost your career with networking events, workshops, and company sessions
              </Typography>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>5 events this week</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <People className="h-5 w-5" />
                  <span>1,000+ students attending</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Star className="h-5 w-5" />
                  <span>Top companies participating</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {eventStats.map((stat, index) => (
            <div key={index} className="stats-card">
              <StatsCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                subtitle={stat.subtitle}
                color={stat.color}
                trend={stat.trend}
                trendValue={stat.trendValue}
                delay={index * 0.1}
                rotation={index % 2 === 0 ? -0.5 : 0.5}
              />
            </div>
          ))}
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8" elevation={2}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search for amazing events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startIcon={<Search />}
                variant="outlined"
                fullWidth
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <FilterList className={`h-5 w-5 ${
                  isDark ? 'text-dark-muted' : 'text-gray-400'
                }`} />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                    isDark 
                      ? 'border-lime/20 bg-dark-bg text-dark-text focus:ring-lime' 
                      : 'border-gray-300 bg-white text-gray-900 focus:ring-asu-maroon'
                  }`}
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
                <Button
                  component={Link}
                  to="/create-event"
                  variant="contained"
                  color="primary"
                  startIcon={Add}
                >
                  Create Event
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="event-card overflow-hidden hover:shadow-lg transition-shadow" elevation={2}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl ${getEventTypeColor(event.type)}`}>
                      {getEventTypeIcon(event.type)}
                    </div>
                    <Badge 
                      color={getEventTypeBadgeColor(event.type)}
                      variant="standard"
                      className="capitalize"
                    >
                      {event.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => toggleBookmark(event.id)}
                    className="min-w-0 p-2"
                  >
                    {bookmarkedEvents.has(event.id) ? 
                      <Bookmark className={`h-5 w-5 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} /> : 
                      <BookmarkAdd className={`h-5 w-5 ${isDark ? 'text-dark-muted' : 'text-gray-400'}`} />
                    }
                  </Button>
                </div>

                <Typography variant="h6" color="textPrimary" className="font-bold mb-3">
                  {event.title}
                </Typography>
                
                <Typography variant="body2" color="textSecondary" className="mb-4 line-clamp-3">
                  {event.description}
                </Typography>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <CalendarToday className={`h-4 w-4 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
                    <Typography variant="caption" color="textSecondary">
                      {new Date(event.start_date).toLocaleDateString()} at {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </div>
                  <div className="flex items-center space-x-2">
                    {event.virtual_link ? 
                      <VideoCall className="h-4 w-4 text-green-600" /> : 
                      <LocationOn className="h-4 w-4 text-blue-600" />
                    }
                    <Typography variant="caption" color="textSecondary">
                      {event.virtual_link ? 'Online' : event.location}
                    </Typography>
                  </div>
                  <div className="flex items-center space-x-2">
                    <People className="h-4 w-4 text-purple-600" />
                    <Typography variant="caption" color="textSecondary">
                      {event.registered_count}/{event.capacity} attendees
                    </Typography>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Typography variant="caption" color="textSecondary">
                      Registration Progress
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {Math.round((event.registered_count / event.capacity) * 100)}%
                    </Typography>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        isDark ? 'bg-lime' : 'bg-asu-maroon'
                      }`}
                      style={{ width: `${(event.registered_count / event.capacity) * 100}%` }}
                    />
                  </div>
                  <Typography variant="caption" color="textSecondary" className="mt-1">
                    {event.capacity - event.registered_count} spots remaining
                  </Typography>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <EmojiEvents className={`h-4 w-4 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
                  <Typography variant="caption" color="textSecondary">
                    Organized by {event.organizer_id.replace('-', ' ')}
                  </Typography>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    fullWidth
                  >
                    Register Now
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    endIcon={<OpenInNew />}
                    component={Link}
                    to={`/events/${event.id}`}
                  >
                    Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* No events found state */}
        {filteredEvents.length === 0 && (
          <Card className="p-12 text-center">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isDark ? 'bg-lime/20' : 'bg-asu-maroon/10'
            }`}>
              <Search className={`w-12 h-12 ${
                isDark ? 'text-lime' : 'text-asu-maroon'
              }`} />
            </div>
            <Typography variant="h5" color="textPrimary" className="font-bold mb-4">
              No events found
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-6 max-w-md mx-auto">
              Try adjusting your search criteria or check back later for new events!
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="contained"
                color="primary"
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                }}
              >
                Clear Filters
              </Button>
              <Button 
                variant="outlined"
                color="primary"
              >
                View All Events
              </Button>
            </div>
          </Card>
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

const getEventTypeBadgeColor = (type: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' => {
  switch (type) {
    case 'career_fair':
      return 'info';
    case 'workshop':
      return 'success';
    case 'info_session':
      return 'secondary';
    case 'webinar':
      return 'warning';
    case 'networking':
      return 'error';
    default:
      return 'primary';
  }
};

const getEventTypeIcon = (type: string) => {
  switch (type) {
    case 'career_fair':
      return <People className="h-4 w-4" />;
    case 'workshop':
      return <Work className="h-4 w-4" />;
    case 'info_session':
      return <Business className="h-4 w-4" />;
    case 'webinar':
      return <VideoCall className="h-4 w-4" />;
    case 'networking':
      return <Star className="h-4 w-4" />;
    default:
      return <Event className="h-4 w-4" />;
  }
};