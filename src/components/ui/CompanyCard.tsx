import { Link } from 'react-router-dom';
import { MapPin, Users, Star, Heart, Share2 } from 'lucide-react';
import { cn } from '../../lib/cva';

interface CompanyCardProps {
  id: string;
  name: string;
  logo_url?: string;
  cover_image_url?: string;
  industry: string;
  location: string;
  company_size: string;
  rating: number;
  reviews_count: number;
  is_verified?: boolean;
  is_hiring?: boolean;
  is_following?: boolean;
  employee_count: number;
  founded_year: number;
  recent_jobs_count?: number;
  isDark?: boolean;
  onFollow?: (id: string) => void;
  onShare?: (id: string) => void;
}

export default function CompanyCard({
  id,
  name,
  logo_url,
  cover_image_url,
  industry,
  location,
  company_size,
  rating,
  reviews_count,
  is_verified,
  is_hiring,
  is_following = false,
  employee_count,
  founded_year,
  recent_jobs_count = 0,
  isDark = false,
  onFollow,
  onShare
}: CompanyCardProps) {
  return (
    <Link to={`/company/${id}`}>
      <div className={cn(
        'relative rounded-2xl overflow-hidden w-[300px] h-[300px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group',
        isDark ? 'hover:shadow-gray-900' : 'hover:shadow-gray-300'
      )}>
        {/* Cover Photo Background */}
        {cover_image_url ? (
          <img
            src={cover_image_url}
            alt={`${name} cover`}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-info-500 to-purple-600" />
        )}
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-300" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-4">
          {/* Top Section - Company Logo */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {logo_url ? (
                <img
                  src={logo_url}
                  alt={name}
                  className="w-12 h-12 rounded-lg border-2 border-white object-cover shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg border-2 border-white bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                  {name.charAt(0)}
                </div>
              )}
              {is_verified && (
                <div className="w-6 h-6 bg-info-500 rounded-full flex items-center justify-center border border-white">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onFollow?.(id);
                }}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                aria-label="Follow company"
              >
                <Heart className={cn(
                  'w-4 h-4 text-white transition-colors',
                  is_following ? 'fill-red-500 text-red-500' : ''
                )} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onShare?.(id);
                }}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                aria-label="Share company"
              >
                <Share2 className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Middle Section - Company Info */}
          <div className="space-y-2">
            <div>
              <h3 className="font-bold text-white text-base line-clamp-2 group-hover:line-clamp-none">
                {name}
              </h3>
              <p className="text-white/90 text-xs font-semibold">{industry}</p>
            </div>
            
            {/* Location and Size */}
            <div className="flex items-center gap-2 text-xs text-white/80">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>
         
          </div>

          {/* Bottom Section - Stats and Tags */}
          <div className="space-y-2">
            {/* Rating */}
          

            {/* Status Badges */}
            <div className="flex gap-2 flex-wrap">
              {is_hiring && (
                <span className="bg-green-500/90 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  Hiring
                </span>
              )}
              {recent_jobs_count > 0 && (
                <span className="bg-info-500/90 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  {recent_jobs_count} jobs
                </span>
              )}
            </div>

            {/* Founded and Employees */}
           
          </div>
        </div>

        {/* Hover Overlay Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-5" />
      </div>
    </Link>
  );
}
