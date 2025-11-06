import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  ChevronRight,
  Building2,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/cva';

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary_range?: string;
  description: string;
  skills: string[];
  posted_at: string;
  is_remote?: boolean;
  employer?: {
    id: string;
    name: string;
    avatar_url?: string;
    company_name?: string;
    verified?: boolean;
  };
}

export default function JobCard({
  id,
  title,
  company,
  location,
  type,
  salary_range,
  description,
  skills,
  posted_at,
  is_remote,
  employer
}: JobCardProps) {
  const { isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const isNew = formatDate(posted_at).includes('Today') || formatDate(posted_at).includes('Yesterday');

  return (
    <Link
      to={`/job/${id}`}
      className={cn(
        'group relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer block',
        'hover:shadow-lg',
        isDark
          ? 'bg-black border border-gray-800 hover:border-gray-600'
          : 'bg-white border border-gray-200 hover:border-gray-400'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container */}
      <div className="flex h-full">
        
        {/* Left Side - Vertical Company Branding */}
        <div className={cn(
          'w-24 sm:w-28 flex flex-col items-center justify-between py-6 border-r relative overflow-hidden',
          isDark ? 'bg-black border-gray-800' : 'bg-gray-50 border-gray-200'
        )}>
          {/* Animated Background Pattern */}
          <div className={cn(
            'absolute inset-0 opacity-0 transition-opacity duration-300',
            isHovered && 'opacity-5'
          )}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-500 to-transparent" />
          </div>

          {/* Company Logo/Avatar */}
          <div className="relative z-10 mb-4">
            {employer?.avatar_url ? (
              <div className="relative">
                <img
                  src={employer.avatar_url}
                  alt={company}
                  className={cn(
                    'w-16 h-16 rounded-xl object-cover border-2 transition-all duration-300',
                    isHovered ? 'scale-105' : 'scale-100',
                    isDark ? 'border-gray-800 grayscale' : 'border-gray-300 grayscale'
                  )}
                />
                {employer.verified && (
                  <div className={cn(
                    'absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2',
                    isDark ? 'bg-white border-black' : 'bg-black border-white'
                  )}>
                    <svg className={cn('w-3 h-3', isDark ? 'text-black' : 'text-white')} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ) : (
              <div className={cn(
                'w-16 h-16 rounded-xl flex items-center justify-center font-black text-2xl transition-all duration-300',
                isHovered ? 'scale-105' : 'scale-100',
                isDark ? 'bg-white text-black' : 'bg-black text-white'
              )}>
                {company.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Job Type Icon */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
            <div className={cn(
              'p-3 rounded-xl mb-2 transition-all duration-300',
              isHovered ? 'scale-110' : 'scale-100',
              isDark ? 'bg-gray-900' : 'bg-white'
            )}>
              <Briefcase className={cn('w-6 h-6', isDark ? 'text-white' : 'text-black')} />
            </div>
            <div className="text-center">
              <p className={cn(
                'text-[10px] font-bold uppercase tracking-wider',
                isDark ? 'text-gray-500' : 'text-gray-500'
              )}>
                {type.split('-')[0]}
              </p>
            </div>
          </div>

          {/* Posted Date */}
          <div className="relative z-10 text-center">
            <Clock className={cn('w-4 h-4 mx-auto mb-1', isDark ? 'text-gray-600' : 'text-gray-400')} />
            <p className={cn(
              'text-[10px] font-medium',
              isDark ? 'text-gray-500' : 'text-gray-500'
            )}>
              {formatDate(posted_at)}
            </p>
          </div>
        </div>

        {/* Right Side - Job Details */}
        <div className="flex-1 flex flex-col p-5 sm:p-6">
          
          {/* Header with Badge and Remote Tag */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn(
                'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border',
                isDark
                  ? 'bg-white/10 text-white border-gray-700'
                  : 'bg-black/5 text-black border-gray-300'
              )}>
                {type.replace('-', ' ')}
              </span>
              {is_remote && (
                <span className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border',
                  isDark
                    ? 'bg-white/10 text-white border-gray-700'
                    : 'bg-black/5 text-black border-gray-300'
                )}>
                  🌍 Remote
                </span>
              )}
              {isNew && (
                <span className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 border',
                  isDark
                    ? 'bg-white/10 text-white border-gray-700'
                    : 'bg-black/5 text-black border-gray-300'
                )}>
                  <Sparkles className="w-3 h-3" />
                  New
                </span>
              )}
            </div>
          </div>

          {/* Job Title */}
          <h3 className={cn(
            'font-bold text-xl sm:text-2xl mb-2 line-clamp-2 transition-colors leading-tight',
            isDark ? 'text-white' : 'text-black'
          )}>
            {title}
          </h3>

          {/* Company Name */}
          <div className="flex items-center gap-2 mb-4">
            <Building2 className={cn('w-4 h-4', isDark ? 'text-gray-500' : 'text-gray-500')} />
            <p className={cn(
              'text-base font-semibold',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>
              {company}
            </p>
          </div>

          {/* Location & Salary Row */}
          <div className={cn(
            'flex flex-wrap items-center gap-4 mb-4 pb-4 border-b',
            isDark ? 'border-gray-800' : 'border-gray-200'
          )}>
            <div className="flex items-center gap-2">
              <MapPin className={cn('w-4 h-4 flex-shrink-0', isDark ? 'text-gray-500' : 'text-gray-500')} />
              <span className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {location}
              </span>
            </div>
            {salary_range && (
              <>
                <div className={cn('w-1 h-1 rounded-full', isDark ? 'bg-gray-700' : 'bg-gray-400')} />
                <div className="flex items-center gap-2">
                  <DollarSign className={cn('w-4 h-4 flex-shrink-0', isDark ? 'text-gray-500' : 'text-gray-500')} />
                  <span className={cn(
                    'text-sm font-semibold',
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    {salary_range}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <p className={cn(
            'text-sm mb-4 line-clamp-2 leading-relaxed',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            {description}
          </p>

          {/* Skills Tags */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {skills.slice(0, 4).map((skill, idx) => (
                <span
                  key={idx}
                  className={cn(
                    'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border',
                    isDark
                      ? 'bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800 hover:border-gray-700'
                      : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 hover:border-gray-300'
                  )}
                >
                  {skill}
                </span>
              ))}
              {skills.length > 4 && (
                <span className={cn(
                  'px-3 py-1.5 text-xs font-semibold',
                  isDark ? 'text-gray-500' : 'text-gray-500'
                )}>
                  +{skills.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Action Button - X Style */}
          <button
            onClick={(e) => {
              e.preventDefault();
            }}
            className={cn(
              'w-full px-6 py-3.5 rounded-full font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 group/btn',
              isDark
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-black text-white hover:bg-gray-900'
            )}
          >
            <span>Apply Now</span>
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </Link>
  );
}
