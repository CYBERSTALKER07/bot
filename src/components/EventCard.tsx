import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Users,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/cva';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_end_date?: string;
  location?: string;
  virtual_link?: string;
  event_type: 'recruiting' | 'webinar' | 'networking' | 'workshop' | 'conference';
  banner_image_url?: string;
  capacity?: number;
  attendees_count: number;
  tags: string[];
  employer?: {
    id: string;
    name: string;
    username: string;
    avatar_url?: string;
    company_name?: string;
    verified: boolean;
  } | null;
  onRegister?: () => void;
  isRegistered?: boolean;
}

export default function EventCard({
  id,
  title,
  event_date,
  location,
  event_type,
  banner_image_url,
  capacity,
  attendees_count,
  employer,
  onRegister,
  isRegistered = false
}: EventCardProps) {
  const { isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate(),
      year: date.getFullYear()
    };
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, { bg: string; text: string; badge: string }> = {
      recruiting: { bg: 'from-blue-600 to-teal-400', text: 'text-blue-500', badge: 'bg-blue-500/10 text-blue-600' },
      webinar: { bg: 'from-purple-600 to-purple-400', text: 'text-purple-500', badge: 'bg-purple-500/10 text-purple-600' },
      networking: { bg: 'from-pink-600 to-pink-400', text: 'text-pink-500', badge: 'bg-pink-500/10 text-pink-600' },
      workshop: { bg: 'from-green-600 to-green-400', text: 'text-green-500', badge: 'bg-green-500/10 text-green-600' },
      conference: { bg: 'from-orange-600 to-orange-400', text: 'text-orange-500', badge: 'bg-orange-500/10 text-orange-600' }
    };
    return colors[type] || colors.recruiting;
  };

  const dateObj = formatDate(event_date);
  const eventTypeColors = getEventTypeColor(event_type);
  const capacityPercentage = capacity ? Math.round((attendees_count / capacity) * 100) : 0;

  const getGradientBg = (type: string) => {
    const gradients: Record<string, string> = {
      recruiting: 'black',
      webinar: 'black',
      networking: 'black',
      workshop: 'black',
      conference: 'black'
    };
    return gradients[type] || gradients.recruiting;
  };

  return (
    <Link
      to={`/event/${id}`}
      className={cn(
        'group relative rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer h-full',
        'hover:shadow-2xl hover:scale-105 hover:z-10',
        isDark
          ? 'bg-gray-900/80  border-gray-800 hover:border-gray-700'
          : 'bg-white  border-gray-200 hover:border-gray-300'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Container - Flex Layout */}
      <div className="flex flex-col h-full border  rounded-3xl overflow-hidden">
        
        {/* Top Section: Date and Image */}
        <div className="flex flex-1 min-h-0">
          
          {/* Left: Date Column */}
          <div className={cn(
            'w-20 sm:w-24 flex flex-col rounded-tr-3xl rounded-br-3xl rounded-tl-3xl  rounded-bl-3xl border-r-0 border-l border-t border-b  border-r-none items-center justify-center py-4 sm:py-6 ',
            isDark ? 'bg-black  ' : 'bg-gradient-to-b from-gray-50 to-white border border-gray-200'
          )}>
            <div className="text-center">
              <div className={cn(
                'text-xs sm:text-sm font-sans tracking-widest',
                eventTypeColors.text
              )}>
                {dateObj.month}
              </div>
              <div className={cn(
                'text-2xl sm:text-3xl font-black mt-1',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                {dateObj.day}
              </div>
              <div className={cn(
                'text-xs mt-2 opacity-70',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {dateObj.year % 100}
              </div>
            </div>
          </div>

          {/* Right: Banner Image or Fallback Gradient */}
          <div className={cn(
            'flex-1 overflow-hidden relative border-t borrder-l border-b rounded-tl-3xl rounded-bl-3xl rounded-br-3xl',
            !banner_image_url || imageError ? `bg-gradient-to-br ${getGradientBg(event_type)}` : 'bg-gradient-to-br from-gray-300 to-gray-400'
          )}>
            {banner_image_url && !imageError ? (
              <>
                <img
                  src={banner_image_url}
                  alt={title}
                  onError={() => setImageError(true)}
                  className={cn(
                    'w-full h-full object-cover transition-transform duration-500',
                    isHovered ? 'scale-110' : 'scale-100'
                  )}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-black/10 via-transparent to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/80">
                  <svg className="w-12 h-12 mx-auto mb-2 opacity-70" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <p className="text-sm font-medium capitalize">{event_type.replace('_', ' ')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Event Details */}
        <div className={cn(
          'p-4 sm:p-5 border-t flex flex-col flex-1',
          isDark ? 'border-none bg-black' : 'border-gray-100 bg-white'
        )}>
          
          {/* Event Type Tag */}
          <div className="mb-3">
            <span className={cn(
              'inline-block px-2.5 py-1 rounded-full text-xs font-sans capitalize',
              eventTypeColors.badge
            )}>
              {event_type.replace('_', ' ')}
            </span>
          </div>

          {/* Title */}
          <h3 className={cn(
            'font-sans text-base sm:text-lg mb-2 line-clamp-2 transition-colors',
            isDark ? 'text-white group-hover:text-teal-400' : 'text-gray-900 group-hover:text-blue-600'
          )}>
            {title}
          </h3>

          {/* Location */}
          {location && (
            <div className="flex items-start gap-2 mb-3">
              <MapPin className={cn(
                'h-4 w-4 mt-0.5 flex-shrink-0',
                isDark ? 'text-gray-500' : 'text-gray-600'
              )} />
              <p className={cn(
                'text-pretty sm:text-sm line-clamp-1',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {location}
              </p>
            </div>
          )}

          {/* Employer Info */}
          {employer && (
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-700/30">
              {employer.avatar_url && (
                <img
                  src={employer.avatar_url}
                  alt={employer.name}
                  className="h-6 w-6 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-xs font-sem-font-sans truncate',
                  isDark ? 'text-gray-300' : 'text-gray-700'
                )}>
                  {employer.company_name || employer.name}
                </p>
              </div>
            </div>
          )}

          {/* Stats - Attendees */}
          {capacity && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className={cn(
                  'text-xs font-medium flex items-center gap-1',
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}>
                  <Users className="h-3.5 w-3.5" />
                  Attending
                </span>
                <span className={cn(
                  'text-xs font-sans',
                  capacityPercentage > 80 ? 'text-red-500' : 'text-green-500'
                )}>
                  {attendees_count}/{capacity}
                </span>
              </div>
              <div className={cn(
                'h-1.5 rounded-full overflow-hidden',
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              )}>
                <div
                  className={cn(
                    'h-full transition-all duration-300',
                    capacityPercentage > 80
                      ? 'bg-gradient-to-r from-red-500 to-red-400'
                      : 'bg-gradient-to-r from-blue-500 to-teal-400'
                  )}
                  data-width={Math.min(capacityPercentage, 100)}
                />
              </div>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Action Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onRegister?.();
            }}
            disabled={isRegistered}
            className={cn(
              'w-full px-4 py-2.5 rounded-xl font-sem-font-sans text-sm transition-all duration-200 flex items-center justify-center gap-2',
              isRegistered
                ? isDark
                  ? 'bg-gray-700 text-gray-300 cursor-default'
                  : 'bg-gray-200 text-gray-600 cursor-default'
                : isDark
                  ? 'bg-black text-white hover:bg-gray-700  hover:shadow-lg'
                  : 'bg-black text-white hover:bg-white/10 hover:shadow-lg'
            )}
          >
            {isRegistered ? (
              <>
                <span>✓ Registered</span>
              </>
            ) : (
              <>
                <span>Register</span>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
