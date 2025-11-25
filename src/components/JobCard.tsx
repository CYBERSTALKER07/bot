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
import { Card } from './ui/Card';

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
      className="block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        variant="x-style"
        className={cn(
          'h-full transition-all duration-300 group relative overflow-hidden border',
          isDark 
            ? 'bg-black border-gray-800 hover:border-gray-700' 
            : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
        )}
        padding="none"
      >
        <div className="flex h-full flex-col sm:flex-row">
          
          {/* Left Side - Vertical Company Branding */}
          <div className={cn(
            'w-full sm:w-28 flex sm:flex-col items-center justify-between p-4 sm:py-6 border-b sm:border-b-0 sm:border-r relative overflow-hidden',
            isDark ? 'bg-black border-gray-800' : 'bg-gray-50 border-gray-100'
          )}>
            {/* Company Logo/Avatar */}
            <div className="relative z-10">
              {employer?.avatar_url ? (
                <div className="relative">
                  <img
                    src={employer.avatar_url}
                    alt={company}
                    className={cn(
                      'w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover border-2 transition-all duration-300',
                      isHovered ? 'scale-105' : 'scale-100',
                      isDark ? 'border-gray-800 grayscale' : 'border-gray-200 grayscale'
                    )}
                  />
                  {employer.verified && (
                    <div className={cn(
                      'absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2',
                      isDark ? 'bg-white border-black' : 'bg-black border-white'
                    )}>
                      <svg className={cn('w-2 h-2 sm:w-3 sm:h-3', isDark ? 'text-black' : 'text-white')} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ) : (
                <div className={cn(
                  'w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center font-black text-xl sm:text-2xl transition-all duration-300',
                  isHovered ? 'scale-105' : 'scale-100',
                  isDark ? 'bg-white text-black' : 'bg-black text-white'
                )}>
                  {company.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Job Type Icon - Hidden on mobile, visible on desktop */}
            <div className="hidden sm:flex relative z-10 flex-1 flex-col items-center justify-center my-4">
              <div className={cn(
                'p-3 rounded-xl mb-2 transition-all duration-300',
                isHovered ? 'scale-110' : 'scale-100',
                isDark ? 'bg-gray-900' : 'bg-white shadow-sm'
              )}>
                <Briefcase className={cn('w-5 h-5', isDark ? 'text-white' : 'text-black')} />
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
            <div className="hidden sm:block relative z-10 text-center">
              <Clock className={cn('w-3 h-3 mx-auto mb-1', isDark ? 'text-gray-600' : 'text-gray-400')} />
              <p className={cn(
                'text-[10px] font-medium',
                isDark ? 'text-gray-500' : 'text-gray-500'
              )}>
                {formatDate(posted_at)}
              </p>
            </div>
            
            {/* Mobile only: Company Name & Date */}
            <div className="sm:hidden ml-3 flex-1">
              <h3 className={cn("font-bold text-base", isDark ? "text-white" : "text-black")}>{company}</h3>
              <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-500")}>{formatDate(posted_at)}</p>
            </div>
          </div>

          {/* Right Side - Job Details */}
          <div className="flex-1 flex flex-col p-5 sm:p-6">
            
            {/* Header with Badge and Remote Tag */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border',
                  isDark
                    ? 'bg-gray-900 text-gray-300 border-gray-800'
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                )}>
                  {type.replace('-', ' ')}
                </span>
                {is_remote && (
                  <span className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border',
                    isDark
                      ? 'bg-gray-900 text-gray-300 border-gray-800'
                      : 'bg-gray-100 text-gray-600 border-gray-200'
                  )}>
                    Remote
                  </span>
                )}
                {isNew && (
                  <span className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide flex items-center gap-1 border',
                    isDark
                      ? 'bg-gray-900 text-white border-gray-800'
                      : 'bg-black text-white border-black'
                  )}>
                    <Sparkles className="w-3 h-3" />
                    New
                  </span>
                )}
              </div>
            </div>

            {/* Job Title */}
            <h3 className={cn(
              'font-bold text-lg sm:text-xl mb-1 line-clamp-2 transition-colors leading-tight group-hover:underline decoration-2 underline-offset-2',
              isDark ? 'text-white decoration-white' : 'text-black decoration-black'
            )}>
              {title}
            </h3>

            {/* Company Name (Desktop) */}
            <div className="hidden sm:flex items-center gap-2 mb-4">
              <Building2 className={cn('w-3.5 h-3.5', isDark ? 'text-gray-500' : 'text-gray-500')} />
              <p className={cn(
                'text-sm font-medium',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {company}
              </p>
            </div>

            {/* Location & Salary Row */}
            <div className={cn(
              'flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 pb-4 border-b text-sm',
              isDark ? 'border-gray-800' : 'border-gray-100'
            )}>
              <div className="flex items-center gap-1.5">
                <MapPin className={cn('w-3.5 h-3.5 shrink-0', isDark ? 'text-gray-500' : 'text-gray-400')} />
                <span className={cn(
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {location}
                </span>
              </div>
              {salary_range && (
                <>
                  <div className={cn('hidden sm:block w-1 h-1 rounded-full', isDark ? 'bg-gray-700' : 'bg-gray-300')} />
                  <div className="flex items-center gap-1.5">
                    <DollarSign className={cn('w-3.5 h-3.5 shrink-0', isDark ? 'text-gray-500' : 'text-gray-400')} />
                    <span className={cn(
                      'font-semibold',
                      isDark ? 'text-gray-300' : 'text-gray-900'
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
              isDark ? 'text-gray-500' : 'text-gray-500'
            )}>
              {description}
            </p>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Action Button - X Style */}
            <div className="flex items-center justify-between mt-2">
               {/* Skills Tags (Preview) */}
               <div className="hidden sm:flex flex-wrap gap-1.5 mr-4">
                {skills.slice(0, 2).map((skill, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      'px-2 py-1 text-[10px] font-medium rounded-md border',
                      isDark
                        ? 'bg-gray-900 text-gray-400 border-gray-800'
                        : 'bg-gray-50 text-gray-500 border-gray-200'
                    )}
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 2 && (
                  <span className={cn(
                    'px-2 py-1 text-[10px] font-medium',
                    isDark ? 'text-gray-600' : 'text-gray-400'
                  )}>
                    +{skills.length - 2}
                  </span>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                }}
                className={cn(
                  'w-full sm:w-auto px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2',
                  isDark
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-black text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-black/20'
                )}
              >
                <span>Apply Now</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
