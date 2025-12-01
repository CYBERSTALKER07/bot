import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/cva';

interface CompanyCardProps {
  id: string;
  name: string;
  logo_url?: string;
  industry: string;
  location: string;
  company_size: string;
  rating: number;
  is_hiring?: boolean;
  recent_jobs_count?: number;
  isDark?: boolean;
}

// Predefined palette to match the "Google" aesthetic (Blue, Red, Yellow, Green)
const BRAND_COLORS = [
  { bg: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-50' },
  { bg: 'bg-red-500', text: 'text-red-500', light: 'bg-red-50' },
  { bg: 'bg-yellow-500', text: 'text-yellow-500', light: 'bg-yellow-50' },
  { bg: 'bg-green-500', text: 'text-green-500', light: 'bg-green-50' },
  { bg: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-50' },
];

// Organic corner shapes (graffiti-like blobs)
const CORNER_SHAPES = [
  // Shape 1: Classic blob
  "M30,-10 C50,-10 80,10 80,40 C80,70 50,90 20,90 C-10,90 -30,60 -30,30 C-30,0 0,-10 30,-10 Z",
  // Shape 2: Wavy hill
  "M0,100 C30,60 70,60 100,100 L0,100 Z",
  // Shape 3: Abstract splash
  "M10,100 C30,50 60,40 100,80 L100,100 L0,100 Z",
  // Shape 4: Rounded corner fill
  "M50,100 C50,50 100,50 100,0 L100,100 Z"
];

export default function CompanyCard({
  id,
  name,
  logo_url,
  industry,
  location,
  company_size,
  rating,
  is_hiring,
  recent_jobs_count = 0,
  isDark = false,
}: CompanyCardProps) {

  // Deterministically generate style based on company name
  const { color, shapePath, rotation } = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colorIndex = Math.abs(hash) % BRAND_COLORS.length;
    const shapeIndex = Math.abs(hash) % CORNER_SHAPES.length;
    const rot = (Math.abs(hash) % 30) - 15; // Random rotation between -15 and 15 deg

    return {
      color: BRAND_COLORS[colorIndex],
      shapePath: CORNER_SHAPES[shapeIndex],
      rotation: rot
    };
  }, [name]);

  return (
    <Link
      to={`/ company - detail / ${id} `}
      className={cn(
        "group relative flex flex-col justify-between w-[300px] h-[320px] rounded-[32px] p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden",
        isDark ? "bg-[#1C1C1E] hover:shadow-2xl hover:shadow-blue-900/20" : "bg-white hover:shadow-2xl hover:shadow-gray-200"
      )}
    >
      {/* Top Section: Icon/Logo & Badge */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm overflow-hidden",
          isDark ? "bg-gray-800" : "bg-gray-50"
        )}>
          {logo_url ? (
            <img src={logo_url} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span>🏢</span>
          )}
        </div>

        {is_hiring && (
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-bold",
            isDark ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-600"
          )}>
            Hiring
          </span>
        )}
      </div>

      {/* Main Content: Category & Title */}
      <div className="mb-6 relative z-10">
        <div className={cn(
          "text-sm font-medium mb-1",
          isDark ? "text-gray-400" : "text-gray-500"
        )}>
          {industry}
        </div>
        <h3 className={cn(
          "text-2xl font-black leading-tight tracking-tight mb-1 line-clamp-2",
          isDark ? "text-white" : "text-gray-900"
        )}>
          {name}
        </h3>
        <div className={cn(
          "text-sm font-medium flex items-center gap-1",
          isDark ? "text-gray-500" : "text-gray-400"
        )}>
          <MapPin className="w-3 h-3" />
          {location}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
        <div>
          <div className={cn("text-xs font-medium mb-1", isDark ? "text-gray-500" : "text-gray-400")}>Rating</div>
          <div className={cn("text-sm font-bold flex items-center gap-1", isDark ? "text-white" : "text-gray-900")}>
            {rating.toFixed(1)} <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
        <div>
          <div className={cn("text-xs font-medium mb-1", isDark ? "text-gray-500" : "text-gray-400")}>Size</div>
          <div className={cn("text-sm font-bold truncate", isDark ? "text-white" : "text-gray-900")}>
            {company_size}
          </div>
        </div>
        <div>
          <div className={cn("text-xs font-medium mb-1", isDark ? "text-gray-500" : "text-gray-400")}>Jobs</div>
          <div className={cn("text-sm font-bold", isDark ? "text-white" : "text-gray-900")}>
            {recent_jobs_count}
          </div>
        </div>
      </div>

      {/* Bottom Action & Decoration */}
      <div className="flex items-end justify-between mt-auto relative z-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 group-hover:gap-3 transition-all">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
              color.bg, "text-white"
            )}>
              <ArrowRight className="w-4 h-4" />
            </div>
            <span className={cn("text-xs font-medium", isDark ? "text-gray-400" : "text-gray-500")}>
              View Profile
            </span>
          </div>
        </div>
      </div>

      {/* Graffiti Corner Pattern */}
      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none overflow-hidden rounded-br-[32px]">
        <svg
          viewBox="0 0 100 100"
          className={cn(
            "absolute bottom-0 right-0 w-full h-full transform transition-transform duration-500 group-hover:scale-110",
            color.text
          )}
          style={{ transform: `rotate(${rotation}deg) translate(10 %, 10 %)` }}
        >
          <path d={shapePath} fill="currentColor" fillOpacity="0.15" />
        </svg>

        {/* Secondary smaller blob for layering */}
        <svg
          viewBox="0 0 100 100"
          className={cn(
            "absolute bottom-[-10px] right-[-10px] w-20 h-20 transform transition-transform duration-700 group-hover:scale-125",
            color.text
          )}
          style={{ transform: `rotate(${- rotation * 2}deg)` }}
        >
          <path d={shapePath} fill="currentColor" fillOpacity="0.3" />
        </svg>
      </div>
    </Link>
  );
}
