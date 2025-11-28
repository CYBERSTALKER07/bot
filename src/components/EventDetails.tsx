import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Video,
  ExternalLink,
  Share,
  SavedXs as Bookmark,
  SavedFilledXs as BookmarkCheck,
  ArrowLeft,
  CheckCircle,
  X
} from '@openai/apps-sdk-ui/components/Icon';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import { useEmployerEvent, useEventAttendees, useEventRegistrationStatus, useRegisterForEvent, useUnregisterFromEvent } from '../hooks/useOptimizedQuery';
import Button from './ui/Button';
import { cn } from '../lib/cva';

export default function EventDetails() {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    dietary_restrictions: '',
    accessibility_needs: '',
    questions: ''
  });

  // Fetch event data
  const { data: event, isLoading: eventLoading, error: eventError } = useEmployerEvent(eventId);

  // Fetch event attendees
  const { data: attendees = [], isLoading: attendeesLoading } = useEventAttendees(eventId);

  // Check registration status
  const { data: registrationStatus } = useEventRegistrationStatus(eventId, user?.id);

  // Mutations
  const registerMutation = useRegisterForEvent();
  const unregisterMutation = useUnregisterFromEvent();

  const handleRegister = async () => {
    if (!event?.id || !user?.id) return;

    try {
      await registerMutation.mutateAsync({
        eventId: event.id,
        userId: user.id
      });
      setShowRegisterModal(false);
    } catch (err) {
      console.error('Error registering for event:', err);
    }
  };

  const handleUnregister = async () => {
    if (!event?.id || !user?.id) return;

    try {
      await unregisterMutation.mutateAsync({
        eventId: event.id,
        userId: user.id
      });
    } catch (err) {
      console.error('Error unregistering from event:', err);
    }
  };

  if (eventLoading) {
    return (
      <div className={cn(
        'min-h-screen flex items-center justify-center',
        isDark ? 'bg-black' : 'bg-gray-50'
      )}>
        <div className="text-center">
          <div className={cn(
            'animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4',
            isDark ? 'border-info-500' : 'border-info-600'
          )}></div>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className={cn(
        'min-h-screen flex items-center justify-center p-4',
        isDark ? 'bg-black' : 'bg-gray-50'
      )}>
        <div className={cn(
          'rounded-3xl p-8 text-center max-w-md w-full',
          isDark ? 'bg-black' : 'bg-white'
        )}>
          <p className="text-red-600 font-semibold mb-2">Event Not Found</p>
          <p className={cn('text-sm mb-6', isDark ? 'text-gray-400' : 'text-gray-600')}>
            {eventError || 'The event you are looking for could not be found.'}
          </p>
          <Button onClick={() => navigate('/events')}>Back to Events</Button>
        </div>
      </div>
    );
  }

  const isRegistered = registrationStatus?.isRegistered || false;
  const registrationPercentage = event.capacity ? (event.attendees_count / event.capacity) * 100 : 0;
  const spotsRemaining = event.capacity ? Math.max(0, event.capacity - event.attendees_count) : 'Unlimited';

  return (
    <div className={cn(
      'min-h-screen',
      isDark ? 'bg-black text-white' : 'bg-gray-50 text-blbg-black'
    )}>
      {/* Back Button */}
      <div className={cn(
        'sticky top-0 z-39 backdrop-blur-xl border-b mr-52',
        isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
      )}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/events"
            className={cn(
              'inline-flex items-center space-x-2 transition-colors',
              isDark
                ? 'text-[#D3FB52] hover:text-[#B8E044]'
                : 'text-[#D3FB52] hover:text-[#B8E044]'
            )}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Events</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
        {/* Event Header - Title & Info Section */}
        <div className={cn(
          'rounded-[24px] overflow-hidden mb-8 p-8',
          isDark
            ? 'bg-black border-[0.1px] border-gray-800 shadow-2xl shadow-black/50'
            : 'bg-white border-[0.1px] border-gray-200 shadow-lg'
        )}>
          {/* Event Type Badge */}
          <div className="flex items-center space-x-2 mb-4 w-fit">
            <span className={cn(
              'px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center space-x-2',
              isDark
                ? 'bg-gray-900/50 text-gray-300 border border-gray-700'
                : 'bg-gray-50 text-gray-700 border border-gray-200'
            )}>
              <span>{event.event_type || 'Event'}</span>
            </span>
          </div>

          {/* Title and Description */}
          <h1 className={cn(
            'text-4xl font-bold mb-4',
            isDark ? 'text-white' : 'text-gray-900'
          )}>{event.title}</h1>
          <p className={cn(
            'text-lg mb-6',
            isDark ? 'text-gray-400' : 'text-gray-700'
          )}>{event.description}</p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Date & Time */}
            <div className={cn(
              'flex items-start space-x-4 p-4 rounded-[24px]',
              isDark
                ? 'bg-gray-900 border-[0.1px] border-gray-700'
                : 'bg-gray-50 border-[0.1px] border-gray-200'
            )}>
              <Calendar className={cn(
                'h-6 w-6 shrink-0 mt-1',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )} />
              <div>
                <p className={cn('text-sm mb-1', isDark ? 'text-gray-400' : 'text-gray-600')}>Date & Time</p>
                <p className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                  {event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'TBA'}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className={cn(
              'flex items-start space-x-4 p-4 rounded-[24px]',
              isDark
                ? 'bg-gray-900 border-[0.1px] border-gray-700'
                : 'bg-gray-50 border-[0.1px] border-gray-200'
            )}>
              {event.virtual_link ? (
                <Video className={cn(
                  'h-6 w-6 shrink-0 mt-1',
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )} />
              ) : (
                <MapPin className={cn(
                  'h-6 w-6 shrink-0 mt-1',
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )} />
              )}
              <div>
                <p className={cn('text-sm mb-1', isDark ? 'text-gray-400' : 'text-gray-600')}>{event.virtual_link ? 'Virtual' : 'Location'}</p>
                <p className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>{event.location || (event.virtual_link ? 'Online' : 'TBA')}</p>
              </div>
            </div>

            {/* Attendees */}
            <div className={cn(
              'flex items-start space-x-4 p-4 rounded-[24px]',
              isDark
                ? 'bg-gray-900 border-[0.1px] border-gray-700'
                : 'bg-gray-50 border-[0.1px] border-gray-200'
            )}>
              <Users className={cn(
                'h-6 w-6 shrink-0 mt-1',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )} />
              <div>
                <p className={cn('text-sm mb-1', isDark ? 'text-gray-400' : 'text-gray-600')}>Attendees</p>
                <p className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>{event.attendees_count} / {event.capacity || '∞'}</p>
              </div>
            </div>
          </div>

          {/* Registration Progress & Action Buttons */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex-1">
              {event.capacity && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>Capacity</span>
                    <span className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>{Math.round(registrationPercentage)}%</span>
                  </div>
                  <div className={cn(
                    'w-full h-2 rounded-full overflow-hidden',
                    isDark ? 'bg-gray-700' : 'bg-gray-300'
                  )}>
                    <div
                      className="h-full bg-[#D3FB52] transition-all duration-300"
                      style={{ width: `${Math.min(registrationPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 ml-6">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={cn(
                  'p-3 rounded-full transition-all',
                  isBookmarked
                    ? 'bg-[#D3FB52] text-black'
                    : isDark
                      ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                )}
                title="Bookmark event"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-5 w-5" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </button>

              <button
                className={cn(
                  'p-3 rounded-full transition-all',
                  isDark
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                )}
                title="Share event"
              >
                <Share className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Registration Button */}
          <div className="mt-6">
            {!isRegistered ? (
              <button
                onClick={() => setShowRegisterModal(true)}
                disabled={event.capacity && event.attendees_count >= event.capacity}
                className={cn(
                  'w-full md:w-auto md:min-w-[200px] px-8 py-4 rounded-[24px] font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg',
                  isDark
                    ? 'bg-[#D3FB52] text-black hover:bg-[#D3FB52]/90 shadow-[#D3FB52]/20'
                    : 'bg-[#D3FB52] text-black hover:bg-[#D3FB52]/90 shadow-[#D3FB52]/30'
                )}
              >
                {event.capacity && event.attendees_count >= event.capacity ? 'Event Full' : 'Register Now 🎯'}
              </button>
            ) : (
              <div className={cn(
                'flex items-center justify-center space-x-2 py-4 rounded-[24px] font-semibold w-full md:w-auto md:min-w-[200px]',
                isDark
                  ? 'bg-green-900/20 text-green-400 border-[0.1px] border-green-700'
                  : 'bg-green-50 text-green-700 border-[0.1px] border-green-200'
              )}>
                <CheckCircle className="h-5 w-5" />
                <span>You're Registered! 🎉</span>
              </div>
            )}
          </div>

        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Description Card */}
            <div className={cn(
              'rounded-[24px] p-8',
              isDark ? 'bg-black border-[0.1px] border-gray-800 shadow-2xl shadow-black/50' : 'bg-white border-[0.1px] border-gray-200 shadow-lg'
            )}>
              <h2 className={cn(
                'text-2xl font-bold mb-6',
                isDark ? 'text-white' : 'text-gray-900'
              )}>About This Event</h2>
              <p className={cn(
                'text-lg leading-relaxed whitespace-pre-line',
                isDark ? 'text-gray-400' : 'text-gray-700'
              )}>
                {event.description}
              </p>
            </div>

            {/* Event Banner Image - Now Under Description */}
            {event.banner_image_url && (
              <div className={cn(
                'rounded-[24px] overflow-hidden',
                isDark ? 'border-[0.1px] border-gray-800' : 'border-[0.1px] border-gray-200'
              )}>


                <img
                  src={event.banner_image_url}
                  alt={event.title}
                  className="w-full h-80 object-cover inset-0 bg-black via-transparent to-transparent "

                />


              </div>
            )}

            {/* Virtual Link */}
            {event.virtual_link && (
              <div className={cn(
                'rounded-[24px] p-8',
                isDark ? 'bg-black border-[0.1px] border-gray-800 shadow-2xl shadow-black/50' : 'bg-white border-[0.1px] border-gray-200 shadow-lg'
              )}>
                <h3 className={cn(
                  'text-xl font-bold mb-4 flex items-center space-x-2',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  <Video className="h-5 w-5" />
                  <span>Virtual Event Link</span>
                </h3>
                <a
                  href={event.virtual_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all',
                    isDark
                      ? 'bg-[#D3FB52]/10 text-[#D3FB52] hover:bg-[#D3FB52]/20'
                      : 'bg-[#D3FB52]/10 text-black hover:bg-[#D3FB52]/20'
                  )}
                >
                  <span>Join Meeting</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>

          {/* Right Column - Employer & Attendees */}
          <div className="space-y-8">
            {/* Employer Card */}
            {event.employer && (
              <div className={cn(
                'rounded-[24px] p-8 sticky top-24',
                isDark ? 'bg-black border-[0.1px] border-gray-800 shadow-2xl shadow-black/50' : 'bg-white border-[0.1px] border-gray-200 shadow-lg'
              )}>
                <h3 className={cn(
                  'text-xl font-bold mb-6',
                  isDark ? 'text-white' : 'text-blbg-black'
                )}>Hosted By</h3>

                {/* Employer Avatar */}
                <div className="flex flex-col items-center text-center mb-6">
                  {event.employer.avatar_url ? (
                    <img
                      src={event.employer.avatar_url}
                      alt={event.employer.name}
                      className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-white"
                    />
                  ) : (
                    <div className={cn(
                      'w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-4 border-4',
                      isDark
                        ? 'bg-linear-to-br from-info-600 to-purple-600 text-white border-info-500'
                        : 'bg-linear-to-br from-blue-400 to-purple-500 text-white border-info-400'
                    )}>
                      {event.employer.name?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <p className={cn(
                    'text-lg font-bold',
                    isDark ? 'text-white' : 'text-blbg-black'
                  )}>
                    {event.employer.name}
                  </p>
                  <p className={cn(
                    'text-sm',
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {event.employer.company_name}
                  </p>
                  {event.employer.verified && (
                    <div className="mt-2 flex items-center space-x-1 text-info-500">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs font-semibold">Verified</span>
                    </div>
                  )}
                </div>

                {/* View Profile Button */}
                <Link
                  to={`/ profile / ${event.employer.id} `}
                  className={cn(
                    'block w-full text-center px-4 py-2 rounded-lg font-semibold transition-all',
                    isDark
                      ? 'bg-[#D3FB52]/10 text-[#D3FB52] hover:bg-[#D3FB52]/20'
                      : 'bg-[#D3FB52]/10 text-black hover:bg-[#D3FB52]/20'
                  )}
                >
                  View Employer Profile
                </Link>
              </div>
            )}

            {/* Attendees */}
            <div className={cn(
              'rounded-[24px] p-8',
              isDark ? 'bg-black border-[0.1px] border-gray-800 shadow-2xl shadow-black/50' : 'bg-white border-[0.1px] border-gray-200 shadow-lg'
            )}>
              <h3 className={cn(
                'text-xl font-bold mb-6 flex items-center justify-between',
                isDark ? 'text-white' : 'text-blbg-black'
              )}>
                <span>Attendees</span>
                <span className={cn(
                  'text-sm px-3 py-1 rounded-full',
                  isDark
                    ? 'bg-gray-800 text-gray-400'
                    : 'bg-gray-100 text-gray-600'
                )}>
                  {attendees.length}
                </span>
              </h3>

              {attendeesLoading ? (
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading attendees...</p>
              ) : attendees.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {attendees.slice(0, 8).map((attendee) => (
                    <div key={attendee.id} className={cn(
                      'flex items-center space-x-3 p-3 rounded-lg',
                      isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                    )}>
                      {attendee.profiles?.avatar_url ? (
                        <img
                          src={attendee.profiles.avatar_url}
                          alt={attendee.profiles.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
                          isDark
                            ? 'bg-linear-to-br from-info-600 to-purple-600 text-white'
                            : 'bg-linear-to-br from-blue-400 to-purple-500 text-white'
                        )}>
                          {attendee.profiles?.full_name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'font-medium truncate',
                          isDark ? 'text-white' : 'text-blbg-black'
                        )}>
                          {attendee.profiles?.full_name}
                        </p>
                        <p className={cn(
                          'text-xs truncate',
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        )}>
                          @{attendee.profiles?.username}
                        </p>
                      </div>
                    </div>
                  ))}
                  {attendees.length > 8 && (
                    <p className={cn(
                      'text-center text-sm py-2',
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      +{attendees.length - 8} more attending
                    </p>
                  )}
                </div>
              ) : (
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No attendees yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={cn(
            'rounded-[24px] p-8 max-w-md w-full',
            isDark ? 'bg-black border-[0.1px] border-gray-800' : 'bg-white border-[0.1px] border-gray-200'
          )}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={cn(
                'text-2xl font-bold',
                isDark ? 'text-white' : 'text-blbg-black'
              )}>Register for Event</h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className={cn(
                  'p-2 rounded-full transition-colors',
                  isDark
                    ? 'hover:bg-gray-800 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-500'
                )}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
              <div>
                <label className={cn(
                  'block text-sm font-medium mb-2',
                  isDark ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Dietary Restrictions (Optional)
                </label>
                <textarea
                  value={registrationData.dietary_restrictions}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, dietary_restrictions: e.target.value }))}
                  className={cn(
                    'w-full p-3 border rounded-lg focus:ring-2 focus:ring-info-500 focus:border-transparent outline-hidden',
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-blbg-black placeholder-gray-400'
                  )}
                  rows={2}
                  placeholder="Any dietary restrictions?"
                />
              </div>

              <div>
                <label className={cn(
                  'block text-sm font-medium mb-2',
                  isDark ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Accessibility Needs (Optional)
                </label>
                <textarea
                  value={registrationData.accessibility_needs}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, accessibility_needs: e.target.value }))}
                  className={cn(
                    'w-full p-3 border rounded-lg focus:ring-2 focus:ring-info-500 focus:border-transparent outline-hidden',
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-blbg-black placeholder-gray-400'
                  )}
                  rows={2}
                  placeholder="Any accessibility accommodations?"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className={cn(
                    'flex-1 px-6 py-3 border rounded-lg font-medium transition-colors',
                    isDark
                      ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  )}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className={cn(
                    'flex-1 px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 shadow-lg',
                    isDark
                      ? 'bg-[#D3FB52] text-black hover:bg-[#D3FB52]/90 shadow-[#D3FB52]/20'
                      : 'bg-[#D3FB52] text-black hover:bg-[#D3FB52]/90 shadow-[#D3FB52]/30'
                  )}
                >
                  {registerMutation.isPending ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}