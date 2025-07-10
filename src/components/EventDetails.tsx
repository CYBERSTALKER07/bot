import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Video, 
  ExternalLink,
  Share2,
  Bookmark,
  BookmarkPlus,
  Star,
  TrendingUp,
  Award,
  Sparkles,
  Coffee,
  Heart,
  ArrowLeft,
  Building2,
  Globe,
  CheckCircle,
  X,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Event } from '../types';
import { supabase } from '../lib/supabase';
import Typography from './ui/Typography';
import Button from './ui/Button';
import { Card } from './ui/Card';
import Badge from './ui/Badge';
import Modal from './ui/Modal';

gsap.registerPlugin(ScrollTrigger);

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    dietary_restrictions: '',
    accessibility_needs: '',
    questions: ''
  });

  useEffect(() => {
    if (id) {
      fetchEvent();
      checkRegistrationStatus();
    }
  }, [id, user?.id]);

  const fetchEvent = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setEvent(data);
    } catch (err) {
      console.error('Error fetching event:', err);
      setError(err instanceof Error ? err.message : 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async () => {
    if (!id || !user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', id)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setIsRegistered(!!data);
    } catch (err) {
      console.error('Error checking registration status:', err);
    }
  };

  const handleRegister = async () => {
    if (!event?.id || !user?.id) return;

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert([{
          event_id: event.id,
          user_id: user.id,
          registered_at: new Date().toISOString(),
          dietary_restrictions: registrationData.dietary_restrictions,
          accessibility_needs: registrationData.accessibility_needs,
          questions: registrationData.questions
        }]);

      if (error) throw error;

      setIsRegistered(true);
      setShowRegisterModal(false);
      
      // Update attendee count
      await supabase
        .from('events')
        .update({ attendees: (event.attendees || 0) + 1 })
        .eq('id', event.id);

      setEvent(prev => prev ? { ...prev, attendees: (prev.attendees || 0) + 1 } : null);
    } catch (err) {
      console.error('Error registering for event:', err);
    }
  };

  useEffect(() => {
    if (!event) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current, {
        opacity: 0,
        y: -50,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out'
      });

      // Content animation
      gsap.fromTo(contentRef.current, {
        opacity: 0,
        y: 50
      }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3
      });

      // Floating decorations
      gsap.to('.event-decoration', {
        y: -15,
        x: 10,
        rotation: 360,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, [event]);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'career_fair':
        return 'bg-blue-100 text-blue-800';
      case 'workshop':
        return 'bg-green-100 text-green-800';
      case 'info_session':
        return 'bg-purple-100 text-purple-800';
      case 'networking':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'career_fair':
        return <Building2 className="h-5 w-5" />;
      case 'workshop':
        return <Award className="h-5 w-5" />;
      case 'info_session':
        return <Users className="h-5 w-5" />;
      case 'networking':
        return <Globe className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4 ${
              isDark ? 'border-lime' : 'border-asu-maroon'
            }`}></div>
            <Typography variant="body1" color="textSecondary">
              Loading event details...
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center">
            <Typography variant="h6" className="text-red-600 mb-2">
              {error || 'Event Not Found'}
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-4">
              {error || 'The event you are looking for could not be found.'}
            </Typography>
            <Button onClick={() => navigate('/events')} variant="outlined">
              Back to Events
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const registrationProgress = (event.attendees_count / event.max_attendees) * 100;

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative">
      {/* Remove decorative elements */}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          to="/events" 
          className="inline-flex items-center space-x-2 text-asu-maroon hover:text-asu-maroon-dark transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Events</span>
        </Link>

        {/* Header */}
        <div ref={headerRef} className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-3xl p-8 text-white relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${getEventTypeColor(event.type).replace('text-', 'text-white bg-white/20')}`}>
                {getEventTypeIcon(event.type)}
                <span className="font-semibold text-white">{event.type.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                  <BookmarkPlus className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <p className="text-xl text-white/90 mb-6">{event.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Calendar className="h-6 w-6 text-asu-gold" />
                <div>
                  <p className="font-semibold">{new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-sm text-white/80">{event.time}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-xl p-4">
                {event.is_virtual ? <Video className="h-6 w-6 text-green-400" /> : <MapPin className="h-6 w-6 text-blue-400" />}
                <div>
                  <p className="font-semibold">{event.is_virtual ? 'Virtual Event' : 'In-Person'}</p>
                  <p className="text-sm text-white/80">{event.location}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Users className="h-6 w-6 text-purple-400" />
                <div>
                  <p className="font-semibold">{event.attendees_count} / {event.max_attendees}</p>
                  <p className="text-sm text-white/80">Attendees</p>
                </div>
              </div>
            </div>

            {/* Registration Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white/90">Registration Progress</span>
                <span className="text-sm text-white/80">{Math.round(registrationProgress)}% Full</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-asu-gold h-2 rounded-full transition-all duration-300"
                  style={{ width: `${registrationProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Registration Button */}
            {!isRegistered ? (
              <button
                onClick={() => setShowRegisterModal(true)}
                className="bg-asu-gold text-asu-maroon px-8 py-4 rounded-2xl font-bold text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Register Now 🎯
              </button>
            ) : (
              <div className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-2xl font-semibold">
                <CheckCircle className="h-5 w-5" />
                <span>You're Registered! 🎉</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {event.long_description}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Register for Event</h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Restrictions (Optional)
                </label>
                <textarea
                  value={registrationData.dietary_restrictions}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, dietary_restrictions: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                  rows={3}
                  placeholder="Any dietary restrictions or food allergies?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accessibility Needs (Optional)
                </label>
                <textarea
                  value={registrationData.accessibility_needs}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, accessibility_needs: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                  rows={3}
                  placeholder="Any accessibility accommodations needed?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Questions for Organizers (Optional)
                </label>
                <textarea
                  value={registrationData.questions}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, questions: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                  rows={3}
                  placeholder="Any questions about the event?"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-asu-maroon text-white rounded-xl hover:bg-asu-maroon-dark transition-colors"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}