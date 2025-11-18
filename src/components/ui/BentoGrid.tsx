import { ReactNode } from 'react';
import { cn } from '../../lib/cva';

interface BentoCardProps {
  Icon?: React.ComponentType<{ className?: string }>;
  name: string;
  description: string;
  href?: string;
  cta?: string;
  background?: ReactNode;
  className?: string;
  onClick?: () => void;
}

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoCard({
  Icon,
  name,
  description,
  href,
  cta,
  background,
  className,
  onClick,
}: BentoCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6',
        className
      )}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          {Icon && (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-info-500/20 to-purple-500/20 flex items-center justify-center">
              <Icon className="w-6 h-6 text-info-600 dark:text-info-400" />
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          {name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {description}
        </p>
        
        {cta && href && (
          <a
            href={href}
            className="text-sm font-medium text-info-600 dark:text-info-400 hover:underline inline-flex items-center gap-2"
          >
            {cta} →
          </a>
        )}
      </div>
    </div>
  );
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-max',
        className
      )}
    >
      {children}
    </div>
  );
}
