import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { LucideIcon } from 'lucide-react';

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
      className={`bg-white rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 ${className}`}
    >
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
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLParagraphElement>(null);

  const colorClasses = {
    blue: 'from-blue-100 to-blue-200 text-blue-700',
    green: 'from-green-100 to-green-200 text-green-700',
    purple: 'from-purple-100 to-purple-200 text-purple-700',
    yellow: 'from-yellow-100 to-yellow-200 text-yellow-700',
    red: 'from-red-100 to-red-200 text-red-700',
    'asu-maroon': 'from-asu-maroon/20 to-asu-maroon/30 text-asu-maroon'
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
      className={`bg-white rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 p-6 transform ${rotation > 0 ? 'rotate-1' : rotation < 0 ? '-rotate-1' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-1">{title}</p>
          <p ref={valueRef} className="text-3xl font-bold text-gray-900">
            {value}
          </p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-full flex items-center justify-center transform rotate-12`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {subtitle && (
        <div className="mt-4 text-sm text-gray-600 bg-gray-50 rounded-full px-3 py-1 w-fit">
          {subtitle}
        </div>
      )}
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
      className={`bg-white rounded-3xl shadow-lg border-2 border-gray-100 overflow-hidden transform rotate-${rotation}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-14 h-14 bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-2xl flex items-center justify-center shadow-lg transform ${index % 2 === 0 ? 'rotate-3' : '-rotate-3'}`}>
              <div className="text-white font-bold text-lg">
                {job.company.charAt(0)}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 leading-tight">
                {job.company}
              </h3>
              <p className="text-sm text-gray-600 flex items-center">
                Verified Employer ✅
              </p>
            </div>
          </div>
          <button
            onClick={onBookmark}
            className="p-3 text-gray-500 hover:text-asu-maroon transition-colors bg-gray-50 rounded-full hover:bg-asu-maroon/10"
            aria-label="Bookmark job"
          >
            📌
          </button>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
          {job.title}
        </h2>
        
        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-700">
          <div className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full">
            📍
            <span className="font-medium">{job.location}</span>
          </div>
          <div className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full">
            🕐
            <span className="font-medium">
              {new Date(job.posted_date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full">
            👥
            <span className="font-medium">{job.applicants_count} applicants</span>
          </div>
        </div>

        {job.salary && (
          <div className="flex items-center space-x-1 mb-4 text-green-700 font-semibold bg-green-50 px-3 py-2 rounded-full w-fit">
            💰
            <span>{job.salary}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transform hover:scale-105 transition-transform duration-200 ${
            job.type === 'internship' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {job.type} {job.type === 'internship' ? '🎓' : '💼'}
          </span>
          {job.skills.slice(0, 2).map((skill, skillIndex) => (
            <span 
              key={skillIndex}
              className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-full text-sm font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-200"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 2 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
              +{job.skills.length - 2} more ✨
            </span>
          )}
        </div>

        <p className="text-gray-700 text-sm mb-6 line-clamp-3 leading-relaxed">
          {job.description}
        </p>

        <div className="flex space-x-3">
          <button
            onClick={() => window.open(`/job/${job.id}`, '_blank')}
            className="flex-1 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-6 py-3 rounded-2xl hover:from-asu-maroon-dark hover:to-asu-maroon transition-all duration-300 text-center font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            View Details 👁️
          </button>
          <button
            onClick={onApply}
            className="px-6 py-3 border-2 border-asu-maroon text-asu-maroon rounded-2xl hover:bg-asu-maroon hover:text-white transition-all duration-300 flex items-center space-x-2 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <span>Apply 🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;