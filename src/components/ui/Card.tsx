import { useEffect, useRef } from 'react';
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

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  hoverEffect?: boolean;
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
  animated = true,
  hoverEffect = true,
  rotation = 0,
  delay = 0,
  scale = 1
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated || !cardRef.current) return;

    const ctx = gsap.context(() => {
      // Initial state - start small and grow
      gsap.set(cardRef.current, {
        scale: 0.3,
        opacity: 0,
        rotation: rotation + 10,
        y: 30
      });

      // Animate to full size
      gsap.to(cardRef.current, {
        scale: scale,
        opacity: 1,
        rotation: rotation,
        y: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        delay: delay
      });

      // Hover animation
      if (hoverEffect && cardRef.current) {
        const element = cardRef.current;
        const hoverTl = gsap.timeline({ paused: true });
        hoverTl.to(element, {
          scale: scale * 1.05,
          rotation: rotation + (Math.random() - 0.5) * 4,
          y: -8,
          duration: 0.3,
          ease: 'power2.out'
        });

        element.addEventListener('mouseenter', () => hoverTl.play());
        element.addEventListener('mouseleave', () => hoverTl.reverse());
      }
    }, cardRef);

    return () => ctx.revert();
  }, [animated, hoverEffect, rotation, delay, scale]);

  return (
    <div
      ref={cardRef}
      className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: `${20 + Math.random() * 10}px ${25 + Math.random() * 8}px ${22 + Math.random() * 12}px ${18 + Math.random() * 10}px`
      }}
    >
      {/* Organic background patterns */}
      <>
        <div className="absolute inset-0 opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-asu-maroon/10 via-transparent to-asu-gold/10" />
        <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-radial from-asu-gold/20 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-radial from-asu-maroon/20 to-transparent rounded-full blur-xl" />
        <div className="relative z-10">
          {children}
        </div>
      </>
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
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLParagraphElement>(null);

  const colorClasses = {
    blue: 'from-blue-400/20 to-blue-600/30',
    green: 'from-green-400/20 to-green-600/30',
    purple: 'from-purple-400/20 to-purple-600/30',
    yellow: 'from-yellow-400/20 to-yellow-600/30',
    red: 'from-red-400/20 to-red-600/30',
    'asu-maroon': 'from-asu-maroon/20 to-asu-maroon/40'
  };

  useEffect(() => {
    if (!animated || !cardRef.current) return;

    const ctx = gsap.context(() => {
      // Start from small scale and grow
      gsap.set(cardRef.current, {
        scale: 0.2,
        opacity: 0,
        rotation: rotation + 15,
        y: 50
      });

      // Animate to full size
      gsap.to(cardRef.current, {
        scale: 1,
        opacity: 1,
        rotation: rotation,
        y: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.8)',
        delay: delay
      });

      // Animate number counting
      if (valueRef.current && typeof value === 'number') {
        gsap.from(valueRef.current, {
          textContent: 0,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          delay: delay + 0.5
        });
      }
    }, cardRef);

    return () => ctx.revert();
  }, [animated, value, delay, rotation]);

  return (
    <div
      ref={cardRef}
      className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 relative overflow-hidden group"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
        borderRadius: `${18 + Math.random() * 8}px ${22 + Math.random() * 6}px ${20 + Math.random() * 10}px ${16 + Math.random() * 8}px`,
        transform: `rotate(${rotation}deg) translateY(${Math.random() * 4 - 2}px)`
      }}
    >
      {/* Flowing background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2 opacity-80">{title}</p>
            <p ref={valueRef} className="text-4xl font-bold text-gray-900 tracking-tight">
              {value}
            </p>
          </div>
          <div 
            className="w-16 h-16 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
            style={{
              borderRadius: `${50 + Math.random() * 10}% ${45 + Math.random() * 15}% ${55 + Math.random() * 10}% ${50 + Math.random() * 12}%`
            }}
          >
            <Icon className="h-7 w-7 text-gray-600" />
          </div>
        </div>
        {subtitle && (
          <div className="mt-4 text-sm text-gray-600 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

// Job Card Component
export const JobCard: React.FC<JobCardProps> = ({
  job,
  index,
  onBookmark,
  onApply
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const cardRotations = [1, -1, 0.5, -0.5, 1.5, -1.5];
  const rotation = cardRotations[index % cardRotations.length];

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      // Start from tiny scale and grow
      gsap.set(cardRef.current, {
        scale: 0.1,
        opacity: 0,
        rotation: rotation + 20,
        y: 60
      });

      // Animate to full size with bounce
      gsap.to(cardRef.current, {
        scale: 1,
        opacity: 1,
        rotation: rotation,
        y: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.7)',
        delay: index * 0.15
      });

      // Enhanced hover animation
      if (cardRef.current) {
        const element = cardRef.current;
        const hoverTl = gsap.timeline({ paused: true });
        hoverTl.to(element, {
          scale: 1.08,
          rotation: rotation + (Math.random() - 0.5) * 6,
          y: -15,
          boxShadow: '0 25px 50px -12px rgba(139, 29, 64, 0.2)',
          duration: 0.4,
          ease: 'power2.out'
        });

        element.addEventListener('mouseenter', () => hoverTl.play());
        element.addEventListener('mouseleave', () => hoverTl.reverse());
      }
    }, cardRef);

    return () => ctx.revert();
  }, [index, rotation]);

  return (
    <div
      ref={cardRef}
      className="bg-white/85 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group relative"
      style={{
        background: 'linear-gradient(150deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)',
        borderRadius: `${20 + Math.random() * 10}px ${25 + Math.random() * 8}px ${22 + Math.random() * 12}px ${18 + Math.random() * 10}px`,
        transform: `rotate(${rotation}deg)`
      }}
    >
      {/* Organic flowing background */}
      <div className="absolute inset-0 bg-gradient-to-br from-asu-maroon/5 via-transparent to-asu-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="p-7 relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center space-x-4">
            <div 
              className="w-16 h-16 bg-gradient-to-br from-asu-maroon/80 to-asu-maroon-dark shadow-lg flex items-center justify-center text-white font-bold text-xl"
              style={{
                borderRadius: `${15 + Math.random() * 8}px ${20 + Math.random() * 6}px ${18 + Math.random() * 10}px ${14 + Math.random() * 8}px`,
                transform: `rotate(${index % 2 === 0 ? 3 : -3}deg)`
              }}
            >
              {job.company.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 leading-tight">
                {job.company}
              </h3>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Verified Employer
              </p>
            </div>
          </div>
          <button
            onClick={onBookmark}
            className="p-3 text-gray-500 hover:text-asu-maroon transition-colors bg-white/60 backdrop-blur-sm rounded-full hover:bg-asu-maroon/10 shadow-sm"
            aria-label="Bookmark job"
          >
            <BookmarkBorder className="h-5 w-5" />
          </button>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-4 leading-tight">
          {job.title}
        </h2>
        
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="flex items-center space-x-1 text-sm text-gray-700 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <LocationOn className="h-4 w-4" />
            <span className="font-medium">{job.location}</span>
          </span>
          <span className="flex items-center space-x-1 text-sm text-gray-700 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Schedule className="h-4 w-4" />
            <span className="font-medium">{new Date(job.posted_date).toLocaleDateString()}</span>
          </span>
          <span className="flex items-center space-x-1 text-sm text-gray-700 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <People className="h-4 w-4" />
            <span className="font-medium">{job.applicants_count} applicants</span>
          </span>
        </div>

        {job.salary && (
          <div className="flex items-center space-x-2 mb-4 text-green-700 font-semibold bg-green-50/80 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
            <AttachMoney className="h-4 w-4" />
            <span>{job.salary}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-5">
          <span className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transform hover:scale-105 transition-transform duration-200 flex items-center space-x-1 ${
            job.type === 'internship' 
              ? 'bg-blue-100/80 text-blue-800 backdrop-blur-sm' 
              : 'bg-green-100/80 text-green-800 backdrop-blur-sm'
          }`}>
            {job.type === 'internship' ? <School className="h-4 w-4" /> : <Work className="h-4 w-4" />}
            <span>{job.type}</span>
          </span>
          {job.skills.slice(0, 2).map((skill, skillIndex) => (
            <span 
              key={skillIndex}
              className="px-3 py-1 bg-gray-100/80 backdrop-blur-sm text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200/80 transition-all duration-200"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 2 && (
            <span className="px-3 py-1 bg-gray-100/80 backdrop-blur-sm text-gray-600 rounded-full text-sm font-medium flex items-center space-x-1">
              <span>+{job.skills.length - 2} more</span>
              <Star className="h-3 w-3" />
            </span>
          )}
        </div>

        <p className="text-gray-700 text-sm mb-6 line-clamp-3 leading-relaxed opacity-90">
          {job.description}
        </p>

        <div className="flex space-x-3">
          <button
            onClick={() => window.open(`/job/${job.id}`, '_blank')}
            className="flex-1 bg-gradient-to-r from-asu-maroon/90 to-asu-maroon-dark/90 text-white px-6 py-3 rounded-2xl hover:from-asu-maroon hover:to-asu-maroon-dark transition-all duration-300 text-center font-medium shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm flex items-center justify-center space-x-2"
          >
            <Visibility className="h-4 w-4" />
            <span>View Details</span>
          </button>
          <button
            onClick={onApply}
            className="px-6 py-3 bg-white/60 backdrop-blur-sm border border-asu-maroon/30 text-asu-maroon rounded-2xl hover:bg-asu-maroon hover:text-white transition-all duration-300 flex items-center space-x-2 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <RocketLaunch className="h-4 w-4" />
            <span>Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;