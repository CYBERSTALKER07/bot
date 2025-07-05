import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  LocationOn, 
  Schedule, 
  People, 
  AttachMoney, 
  School, 
  Work,
  Visibility,
  RocketLaunch,
  Star,
  Business
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import Badge from './Badge';
import Button from './Button';

// Simple cn utility function to combine class names
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  hover?: boolean;
  animated?: boolean;
  rotation?: number;
  delay?: number;
  scale?: number;
  elevation?: number;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ComponentType<any>;
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  animated?: boolean;
  delay?: number;
  rotation?: number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary_range?: string;
    posted_date: string;
    description: string;
    requirements?: string[];
    applicants_count?: number;
  };
  onView: () => void;
  onApply: () => void;
  className?: string;
}

// Base Card Component with Material Design principles
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'medium',
  hover = false,
  animated = true,
  rotation = 0,
  delay = 0,
  scale = 1,
  elevation = 1
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    if (!animated || !cardRef.current) return;

    const ctx = gsap.context(() => {
      // Material Design entrance animation
      gsap.set(cardRef.current, {
        scale: 0.8,
        opacity: 0,
        y: 20,
        rotation: rotation + (Math.random() - 0.5) * 3
      });

      gsap.to(cardRef.current, {
        scale: scale,
        opacity: 1,
        y: 0,
        rotation: rotation,
        duration: 0.6,
        delay: delay,
        ease: 'power2.out'
      });
    }, cardRef);

    return () => ctx.revert();
  }, [animated, rotation, delay, scale]);

  const baseClasses = "transition-all duration-300 ease-out";

  const variantClasses = {
    default: isDark 
      ? "bg-dark-surface border border-lime/20 shadow-md hover:shadow-lg" 
      : "bg-white border border-gray-200 shadow-md hover:shadow-lg",
    elevated: isDark 
      ? "bg-dark-surface shadow-lg hover:shadow-xl border border-lime/20" 
      : "bg-white shadow-lg hover:shadow-xl border border-gray-100",
    outlined: isDark 
      ? "bg-dark-surface border-2 border-lime/40 shadow-sm hover:shadow-md" 
      : "bg-white border-2 border-gray-300 shadow-sm hover:shadow-md",
    filled: isDark 
      ? "bg-dark-bg border border-lime/10 shadow-sm hover:shadow-md" 
      : "bg-gray-50 border border-gray-100 shadow-sm hover:shadow-md"
  };

  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const hoverClasses = hover ? "hover:scale-105 hover:-rotate-1 cursor-pointer" : "";
  
  const elevationClasses = {
    0: 'shadow-none',
    1: 'shadow-sm hover:shadow-md',
    2: 'shadow-md hover:shadow-lg',
    3: 'shadow-lg hover:shadow-xl',
    4: 'shadow-xl hover:shadow-2xl'
  };

  const cardClasses = cn(
    baseClasses,
    'rounded-2xl', // Material Design rounded corners
    variantClasses[variant],
    paddingClasses[padding],
    elevationClasses[elevation],
    hoverClasses,
    className
  );

  return (
    <div ref={cardRef} className={cardClasses}>
      {children}
    </div>
  );
};

// Material Design Stats Card
export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  color = 'primary',
  animated = true,
  delay = 0,
  rotation = 0,
  trend,
  trendValue
}) => {
  const { isDark } = useTheme();
  
  const colorClasses = {
    primary: isDark ? 'text-lime' : 'text-asu-maroon',
    secondary: isDark ? 'text-dark-accent' : 'text-asu-gold',
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500'
  };

  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: isDark ? 'text-dark-muted' : 'text-gray-500'
  };

  return (
    <Card
      animated={animated}
      delay={delay}
      rotation={rotation}
      className="group hover:scale-105 hover:-rotate-1 transition-all duration-300"
      elevation={2}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${
            isDark ? 'text-dark-muted' : 'text-gray-600'
          }`}>
            {title}
          </p>
          <p className={`text-3xl font-bold mt-1 ${
            isDark ? 'text-dark-text' : 'text-gray-900'
          }`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-xs mt-1 ${
              isDark ? 'text-dark-muted' : 'text-gray-500'
            }`}>
              {subtitle}
            </p>
          )}
          {trend && trendValue && (
            <div className={`flex items-center mt-2 text-sm ${trendColors[trend]}`}>
              {trend === 'up' && <span>↗</span>}
              {trend === 'down' && <span>↘</span>}
              {trend === 'neutral' && <span>→</span>}
              <span className="ml-1">{trendValue}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-4 rounded-2xl ${
            isDark ? 'bg-dark-bg' : 'bg-gray-50'
          } group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`h-8 w-8 ${colorClasses[color]}`} />
          </div>
        )}
      </div>
    </Card>
  );
};

// Material Design Job Card
export const JobCard: React.FC<JobCardProps> = ({
  job,
  onView,
  onApply,
  className = ''
}) => {
  const { isDark } = useTheme();

  const getJobTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'full-time':
        return 'success';
      case 'part-time':
        return 'info';
      case 'internship':
        return 'warning';
      case 'contract':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card 
      className={`group hover:shadow-xl transition-all duration-300 ${className}`}
      hover
      elevation={2}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge 
                color={getJobTypeColor(job.type) as any}
                variant="standard"
                className="capitalize"
              >
                {job.type.replace('-', ' ')}
              </Badge>
              {job.applicants_count && job.applicants_count > 50 && (
                <Badge color="error" variant="outlined">
                  Popular
                </Badge>
              )}
            </div>
            <h3 className={`text-xl font-semibold mb-1 group-hover:text-opacity-80 transition-all ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}>
              {job.title}
            </h3>
            <div className="flex items-center space-x-1 mb-2">
              <Business className={`h-4 w-4 ${
                isDark ? 'text-dark-muted' : 'text-gray-500'
              }`} />
              <p className={`font-medium ${
                isDark ? 'text-dark-accent' : 'text-asu-gold'
              }`}>
                {job.company}
              </p>
            </div>
          </div>
          <div className={`p-2 rounded-full ${
            isDark ? 'bg-lime/10' : 'bg-asu-maroon/10'
          }`}>
            <Work className={`h-5 w-5 ${
              isDark ? 'text-lime' : 'text-asu-maroon'
            }`} />
          </div>
        </div>

        {/* Job Details */}
        <div className={`flex flex-wrap items-center gap-4 text-sm ${
          isDark ? 'text-dark-muted' : 'text-gray-600'
        }`}>
          <div className="flex items-center space-x-1">
            <LocationOn className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Schedule className="h-4 w-4" />
            <span>{formatDate(job.posted_date)}</span>
          </div>
          {job.salary_range && (
            <div className="flex items-center space-x-1">
              <AttachMoney className="h-4 w-4" />
              <span>{job.salary_range}</span>
            </div>
          )}
          {job.applicants_count && (
            <div className="flex items-center space-x-1">
              <People className="h-4 w-4" />
              <span>{job.applicants_count} applicants</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className={`text-sm leading-relaxed line-clamp-3 ${
          isDark ? 'text-dark-muted' : 'text-gray-600'
        }`}>
          {job.description}
        </p>

        {/* Requirements Preview */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.requirements.slice(0, 3).map((req, index) => (
              <span
                key={index}
                className={`inline-block px-3 py-1 text-xs rounded-full ${
                  isDark 
                    ? 'bg-dark-bg text-dark-text' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {req}
              </span>
            ))}
            {job.requirements.length > 3 && (
              <span className={`text-xs ${
                isDark ? 'text-dark-muted' : 'text-gray-500'
              }`}>
                +{job.requirements.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-opacity-20">
          <Button
            variant="outlined"
            size="small"
            startIcon={Visibility}
            onClick={onView}
            className="flex-1 mr-2"
          >
            View Details
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={RocketLaunch}
            onClick={onApply}
            className="flex-1 ml-2"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Card;