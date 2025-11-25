import { useState } from 'react';
import {
  Search,
  Calendar
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import PageLayout from './ui/PageLayout';
import { cn } from '../lib/cva';
import { useEmployerEvents, useRegisterForEvent } from '../hooks/useOptimizedQuery';
import EventCard from './EventCard';

export default function Events() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const { data: employerEvents = [], isLoading: loading, error } = useEmployerEvents(50, 'upcoming');
  const registerForEventMutation = useRegisterForEvent();

  const handleRegisterEvent = async (eventId: string) => {
    if (!user?.id) {
      // Handle not logged in
      return;
    }
    
    try {
      await registerForEventMutation.mutateAsync({
        eventId,
        userId: user.id
      });
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  // Filter events based on search and type
  const filteredEvents = employerEvents.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.employer?.company_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || event.event_type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className={cn(
        'min-h-screen',
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      )}>
        <PageLayout maxWidth="7xl">
          <div className="py-12">
            {/* Header Skeleton */}
            <div className="mb-12 space-y-4">
              <div className={cn('h-10 w-1/3 rounded-lg animate-pulse', isDark ? 'bg-gray-800' : 'bg-gray-200')} />
              <div className={cn('h-6 w-2/3 rounded-lg animate-pulse', isDark ? 'bg-gray-800' : 'bg-gray-200')} />
            </div>

            {/* Search Skeleton */}
            <div className={cn('h-12 w-full rounded-xl animate-pulse mb-6', isDark ? 'bg-gray-800' : 'bg-gray-200')} />

            {/* Cards Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    'h-80 rounded-3xl animate-pulse',
                    isDark ? 'bg-gray-800' : 'bg-gray-200'
                  )}
                />
              ))}
            </div>
          </div>
        </PageLayout>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(
        'min-h-screen flex items-center justify-center',
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      )}>
        <PageLayout maxWidth="7xl">
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-red-500 mb-4 text-lg font-semibold">Failed to load events</p>
            <Button 
              className="rounded-full"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </PageLayout>
      </div>
    );
  }

  return (
    <div className={cn(
      'min-h-screen',
      isDark ? 'bg-black text-white' : 'bg-white text-black'
    )}>
      <PageLayout maxWidth="7xl">
        <div className="py-8 sm:py-12">
                {/* Search and Filter Section */}
          <div className="mb-10 space-y-4">
            
            {/* Search Bar */}
            <div className="relative ">
              <Search className={cn(
                'absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5',
                isDark ? 'text-gray-500' : 'text-gray-400'
              )} />
              <input
                type="text"
                placeholder="Search events by name, company, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  'w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-200 text-base',
                  isDark
                    ? 'bg-black border-gray-700 text-white placeholder-gray-500 focus:border-info-500 focus:outline-hidden'
                    : 'bg-gray-50 border-gray-200 text-black placeholder-gray-500 focus:border-info-500 focus:outline-hidden focus:ring-2 focus:ring-info-500/20'
                )}
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: ' All Events' },
                { value: 'recruiting', label: ' Recruiting' },
                { value: 'webinar', label: 'Webinars' },
                { value: 'networking', label: ' Networking' },
                { value: 'workshop', label: ' Workshops' },
                { value: 'conference', label: ' Conferences' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setTypeFilter(value)}
                  className={cn(
                    'px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200',
                    typeFilter === value
                      ? isDark 
                        ? 'bg-black text-white shadow-lg shadow-info-600' 
                        : 'bg-info-600 text-white shadow-lg shadow-info-600/30'
                      : isDark
                        ? 'bg-black text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid - Masonry Layout */}
          {filteredEvents.length === 0 ? (
            <div className={cn(
              'text-center py-20 px-4 rounded-3xl border-none',
              isDark ? 'bg-black border-none' : 'bg-gray-50 border-gray-300'
            )}>
              <Calendar className={cn(
                'h-16 w-16 mx-auto mb-4 opacity-40',
                isDark ? 'text-white' : 'text-gray-900'
              )} />
              <h3 className="text-2xl font-bold mb-2">No events found</h3>
              <p className={cn(
                'mb-6 text-lg',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                Try adjusting your search or filters
              </p>
              <Button 
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
            <>
              {/* Events Grid - Responsive Masonry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="h-128"
                  >
                    <EventCard
                      id={event.id}
                      title={event.title}
                      description={event.description}
                      event_date={event.event_date}
                      event_end_date={event.event_end_date}
                      location={event.location}
                      virtual_link={event.virtual_link}
                      event_type={event.event_type as 'recruiting' | 'webinar' | 'networking' | 'workshop' | 'conference'}
                      banner_image_url={event.banner_image_url}
                      capacity={event.capacity}
                      attendees_count={event.attendees_count}
                      is_featured={event.is_featured}
                      tags={event.tags}
                      employer={event.employer || undefined}
                      onRegister={() => handleRegisterEvent(event.id)}
                      isRegistered={false}
                    />
                  </div>
                ))}
              </div>

              {/* Results Count */}
              <div className={cn(
                'text-center py-8',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                <p className="text-sm font-medium">
                  Showing <span className="font-bold text-info-500">{filteredEvents.length}</span> of <span className="font-bold">{employerEvents.length}</span> events
                </p>
              </div>
            </>
          )}
        </div>
      </PageLayout>
    </div>
  );
}