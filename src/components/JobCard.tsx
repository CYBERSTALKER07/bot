import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  ChevronRight,
  Zap
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
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  const getJobTypeColor = (type: string) => {
    const colors: Record<string, { bg: string; text: string; badge: string; accent: string }> = {
      'full-time': { bg: 'from-emerald-600 to-teal-500', text: 'text-emerald-500', badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', accent: 'border-emerald-500/30' },
      'part-time': { bg: 'from-cyan-600 to-blue-500', text: 'text-cyan-500', badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400', accent: 'border-cyan-500/30' },
      'contract': { bg: 'from-amber-600 to-orange-500', text: 'text-amber-500', badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', accent: 'border-amber-500/30' },
      'internship': { bg: 'from-violet-600 to-purple-500', text: 'text-violet-500', badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400', accent: 'border-violet-500/30' }
    };
    return colors[type] || colors['full-time'];
  };

  const jobTypeColors = getJobTypeColor(type);

  return (
    <Link
      to={`/job/${id}`}
      className={cn(
        'group relative rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer h-full',
        'hover:shadow-2xl hover:scale-105 hover:z-10',
        isDark
          ? 'bg-gradient-to-br from-gray-900 to-gray-800/50 border border-gray-800 hover:border-gray-700'
          : 'bg-white border border-gray-200 hover:border-gray-300'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Container - Flex Layout */}
      <div className={cn(
        'flex flex-col h-full border rounded-3xl overflow-hidden relative',
        jobTypeColors.accent,
        isDark ? 'border-gray-800' : 'border-gray-200'
      )}>
        
        {/* Top Accent Line */}
        <div className={cn(
          'h-1.5 bg-gradient-to-r',
          jobTypeColors.bg
        )} />

        {/* Header Section with Icon and Badge */}
        <div className={cn(
          'px-5 pt-5 pb-3 flex items-start justify-between',
          isDark ? 'bg-gradient-to-b from-gray-800/50 to-transparent' : 'bg-gradient-to-b from-gray-50/50 to-transparent'
        )}>
          <div className="flex items-start gap-3 flex-1">
            <div className={cn(
              'p-2.5 rounded-xl',
              `bg-gradient-to-br ${jobTypeColors.bg}`
            )}>
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn(
                  'inline-block px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide',
                  jobTypeColors.badge
                )}>
                  {type.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>
          
          {/* Employer Avatar - Right Side */}
          {employer && (
            <div className="ml-3 flex-shrink-0">
              {employer.avatar_url ? (
                <img
                  src={employer.avatar_url}
                  alt={employer.company_name || employer.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 shadow-lg"
                />
              ) : (
                <div className={cn(
                  'h-12 w-12 rounded-full flex items-center justify-center font-bold text-white text-sm border-2 shadow-lg bg-gradient-to-br',
                  isDark ? 'border-gray-600 from-blue-600 to-purple-600' : 'border-gray-300 from-blue-500 to-purple-500'
                )}>
                  {(employer.name || employer.company_name || 'E').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content Section */}
        <div className={cn(
          'px-5 pb-5 flex flex-col flex-1',
          isDark ? 'bg-black' : 'bg-white'
        )}>
          
          {/* Title */}
          <h3 className={cn(
            'font-bold text-lg mb-1 line-clamp-2 transition-colors',
            isDark ? 'text-white group-hover:text-emerald-400' : 'text-gray-900 group-hover:text-emerald-600'
          )}>
            {title}
          </h3>

          {/* Company Name */}
          <p className={cn(
            'text-sm font-semibold mb-3',
            isDark ? 'text-gray-300' : 'text-gray-700'
          )}>
            {company}
          </p>

          {/* Location & Remote Badge */}
          <div className={cn(
            'flex items-center gap-2 mb-3 pb-3 border-b',
            isDark ? 'border-gray-700/50' : 'border-gray-200'
          )}>
            <MapPin className={cn(
              'h-3.5 w-3.5 flex-shrink-0',
              isDark ? 'text-gray-500' : 'text-gray-500'
            )} />
            <p className={cn(
              'text-sm line-clamp-1 flex-1',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>
              {location}
            </p>
            {is_remote && (
              <span className={cn(
                'ml-auto px-2 py-0.5 text-xs font-bold rounded-lg flex-shrink-0 uppercase',
                isDark
                  ? 'bg-green-500/15 text-green-400'
                  : 'bg-green-100 text-green-700'
              )}>
                Remote
              </span>
            )}
          </div>

          {/* Salary */}
          {salary_range && (
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-700/50">
              <DollarSign className={cn(
                'h-3.5 w-3.5',
                isDark ? 'text-gray-500' : 'text-gray-500'
              )} />
              <p className={cn(
                'text-sm font-semibold',
                isDark ? 'text-gray-300' : 'text-gray-700'
              )}>
                {salary_range}
              </p>
            </div>
          )}

          {/* Posted Date */}
          <div className="flex items-center gap-2 mb-4">
            <Clock className={cn(
              'h-3.5 w-3.5',
              isDark ? 'text-gray-500' : 'text-gray-500'
            )} />
            <p className={cn(
              'text-xs font-medium',
              isDark ? 'text-gray-500' : 'text-gray-500'
            )}>
              Posted {formatDate(posted_at)}
            </p>
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
              {skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className={cn(
                    'px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all',
                    isDark
                      ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className={cn(
                  'px-2.5 py-1.5 text-xs font-medium',
                  isDark ? 'text-gray-500' : 'text-gray-500'
                )}>
                  +{skills.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Action Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
            }}
            className={cn(
              'w-full px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 group/btn',
              `bg-gradient-to-r ${jobTypeColors.bg} text-white hover:shadow-lg hover:scale-105`
            )}
          >
            <span>Apply Now</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </Link>
  );
}
