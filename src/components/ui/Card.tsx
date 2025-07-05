import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { LucideIcon } from 'lucide-react';
import { 
  BookmarkBorder, 
  LocationOn, 
  Schedule, 
  People, 
  AttachMoney, 
  School, 
  Work,
  Visibility,
  RocketLaunch,
  Star
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
// import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  animated?: boolean;
  rotation?: number;
  delay?: number;
  scale?: number;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'asu-maroon';
  animated?: boolean;
  delay?: number;
  rotation?: number;
}

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary?: string;
    posted_date: string;
    applicants_count: number;
    description: string;
    skills: string[];
  };
  index: number;
  onBookmark?: () => void;
  onApply?: () => void;
}

// Base Card Component
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  animated = true,
  rotation = 0,
  delay = 0,
  scale = 1
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    if (!animated || !cardRef.current) return;

    const ctx = gsap.context(() => {
      // Initial state - start small and grow
      gsap.set(cardRef.current, {
        scale: 0.3,
        opacity: 0,
        y: 50,
        rotation: rotation + (Math.random() - 0.5) * 6
      });

      // Animate to final state
      gsap.to(cardRef.current, {
        scale: scale,
        opacity: 1,
        y: 0,
        rotation: rotation,
        duration: 0.8,
        delay: delay,
        ease: 'back.out(1.7)'
      });
    }, cardRef);

    return () => ctx.revert();
  }, [animated, rotation, delay, scale]);

  const baseClasses = "rounded-xl transition-all duration-300";

  const variantClasses = {
    default: "bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-600 shadow-sm",
    elevated: "bg-white dark:bg-dark-surface shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700",
    outlined: "bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-gray-600",
    glass: "bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 shadow-lg"
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverClasses = hover ? "hover:scale-105 hover:shadow-xl cursor-pointer" : "";

  const cardClasses = cn(
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    hoverClasses,
    className
  );

  return (
    <div ref={cardRef} className={cardClasses}>
      {children}
    </div>
  );
};

// Stats Card Component
export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  color = 'blue',
  animated = true,
  delay = 0,
  rotation = 0
}) => {
  const { isDark } = useTheme();
  
  const colorClasses = {
    blue: isDark ? 'text-blue-400' : 'text-blue-600',
    green: isDark ? 'text-green-400' : 'text-green-600',
    purple: isDark ? 'text-purple-400' : 'text-purple-600',
    yellow: isDark ? 'text-yellow-400' : 'text-yellow-600',
    red: isDark ? 'text-red-400' : 'text-red-600',
    'asu-maroon': isDark ? 'text-lime' : 'text-asu-maroon'
  };

  return (
    <Card
      animated={animated}
      delay={delay}
      rotation={rotation}
      className="transform hover:scale-105 hover:-rotate-1 transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
              {title}
            </p>
            <p className={`text-3xl font-bold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
              {value}
            </p>
            {subtitle && (
              <p className={`text-xs ${isDark ? 'text-dark-muted' : 'text-gray-500'}`}>
                {subtitle}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
            <Icon className={`h-8 w-8 ${colorClasses[color]}`} />
          </div>
        </div>
      </div>
    </Card>
  );
};

// Job Card Component
export const JobCard: React.FC<JobCardProps> = ({
  job,
  index,
  onBookmark,
  onApply
}) => {
  const { isDark } = useTheme();

  return (
    <Card
      animated={true}
      delay={index * 0.1}
      rotation={(index % 3 - 1) * 0.5}
      className="transform hover:scale-105 hover:-rotate-1 transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
              {job.title}
            </h3>
            <div className="flex items-center space-x-2 mb-3">
              <LocationOn className={`h-4 w-4 ${isDark ? 'text-dark-muted' : 'text-gray-500'}`} />
              <span className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                {job.company}
              </span>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <LocationOn className={`h-4 w-4 ${isDark ? 'text-lime' : 'text-blue-600'}`} />
              <span className={`text-sm font-medium ${isDark ? 'text-dark-text' : 'text-gray-700'}`}>
                {job.location}
              </span>
            </div>
          </div>
          <button
            onClick={onBookmark}
            className={`p-2 rounded-full transition-colors ${
              isDark 
                ? 'hover:bg-lime/10 text-dark-muted hover:text-lime' 
                : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
            }`}
          >
            <BookmarkBorder className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Schedule className={`h-4 w-4 ${isDark ? 'text-dark-muted' : 'text-gray-500'}`} />
          <span className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
            {new Date(job.posted_date).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <People className={`h-4 w-4 ${isDark ? 'text-dark-muted' : 'text-gray-500'}`} />
          <span className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
            {job.applicants_count} applicants
          </span>
        </div>

        {job.salary && (
          <div className={`flex items-center space-x-2 mb-4 font-semibold ${isDark ? 'text-green-400' : 'text-green-700'} bg-green-50/80 backdrop-blur-sm px-4 py-2 rounded-full inline-block`}>
            <AttachMoney className="h-4 w-4" />
            <span>{job.salary}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-5">
          <span className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transform hover:scale-105 transition-transform duration-200 flex items-center space-x-1 ${
            job.type === 'internship' 
              ? isDark ? 'bg-blue-500/20 text-blue-400 backdrop-blur-sm' : 'bg-blue-100/80 text-blue-800 backdrop-blur-sm'
              : isDark ? 'bg-green-500/20 text-green-400 backdrop-blur-sm' : 'bg-green-100/80 text-green-800 backdrop-blur-sm'
          }`}>
            {job.type === 'internship' ? <School className="h-4 w-4" /> : <Work className="h-4 w-4" />}
            <span>{job.type}</span>
          </span>
          {job.skills.slice(0, 2).map((skill, skillIndex) => (
            <span 
              key={skillIndex}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                isDark 
                  ? 'bg-dark-bg/80 backdrop-blur-sm text-dark-text hover:bg-lime/20 hover:text-lime' 
                  : 'bg-gray-100/80 backdrop-blur-sm text-gray-800 hover:bg-gray-200/80'
              }`}
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 2 && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${
              isDark 
                ? 'bg-dark-bg/80 backdrop-blur-sm text-dark-muted' 
                : 'bg-gray-100/80 backdrop-blur-sm text-gray-600'
            }`}>
              <span>+{job.skills.length - 2} more</span>
              <Star className="h-3 w-3" />
            </span>
          )}
        </div>

        <p className={`text-sm mb-6 line-clamp-3 leading-relaxed ${isDark ? 'text-dark-muted opacity-90' : 'text-gray-700 opacity-90'}`}>
          {job.description}
        </p>

        <div className="flex space-x-3">
          <button
            onClick={() => window.open(`/job/${job.id}`, '_blank')}
            className={`flex-1 px-6 py-3 rounded-2xl transition-all duration-300 text-center font-medium shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm flex items-center justify-center space-x-2 ${
              isDark 
                ? 'bg-gradient-to-r from-lime to-dark-accent text-dark-surface hover:from-lime hover:to-dark-accent'
                : 'bg-gradient-to-r from-asu-maroon/90 to-asu-maroon-dark/90 text-white hover:from-asu-maroon hover:to-asu-maroon-dark'
            }`}
          >
            <Visibility className="h-4 w-4" />
            <span>View Details</span>
          </button>
          <button
            onClick={onApply}
            className={`px-6 py-3 rounded-2xl transition-all duration-300 flex items-center space-x-2 font-medium shadow-sm hover:shadow-md transform hover:scale-105 ${
              isDark 
                ? 'bg-dark-bg/60 backdrop-blur-sm border border-lime text-lime hover:bg-lime hover:text-dark-surface'
                : 'bg-white/60 backdrop-blur-sm border border-asu-maroon/30 text-asu-maroon hover:bg-asu-maroon hover:text-white'
            }`}
          >
            <RocketLaunch className="h-4 w-4" />
            <span>Apply</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default Card;