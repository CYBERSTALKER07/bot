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
      to={`/company/${id}`}
      className={cn(
        "group relative flex flex-col justify-between w-full md:w-[300px] h-[320px] rounded-[32px] p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden border",
        isDark
          ? "bg-[#1C1C1E] border-white/5 hover:shadow-2xl hover:shadow-black/50"
          : "bg-white border-gray-100 hover:shadow-2xl hover:shadow-gray-200"
      )}
    >
      {/* Top Section: Icon/Logo & Badge */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm overflow-hidden bg-white border border-gray-100",
          isDark ? "bg-[#2C2C2E] border-white/10" : ""
        )}>
          {logo_url ? (
            <img src={logo_url} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span>🏢</span>
          )}
        </div>

        {is_hiring && (
          <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
            isDark ? "bg-green-900/30 text-green-400 border border-green-800" : "bg-green-50 text-green-700 border border-green-200"
          )}>
            Hiring
          </span>
        )}
      </div>

      {/* Main Content: Category & Title */}
      <div className="mb-6 relative z-10">
        <div className={cn(
          "text-xs font-bold uppercase tracking-wider mb-2 opacity-60",
          isDark ? "text-gray-300" : "text-gray-600"
        )}>
          {industry}
        </div>
        <h3 className={cn(
          "text-2xl font-black leading-tight tracking-tight mb-2 line-clamp-2",
          isDark ? "text-white" : "text-gray-900"
        )}>
          {name}
        </h3>
        <div className={cn(
          "text-sm font-medium flex items-center gap-1.5",
          isDark ? "text-gray-400" : "text-gray-500"
        )}>
          <MapPin className="w-3.5 h-3.5" />
          {location}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-6 relative z-10">
        <div>
          <div className={cn("text-[10px] font-bold uppercase opacity-50 mb-1", isDark ? "text-white" : "text-black")}>Rating</div>
          <div className={cn("text-sm font-bold flex items-center gap-1", isDark ? "text-white" : "text-gray-900")}>
            {rating.toFixed(1)} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          </div>
        </div>
        <div>
          <div className={cn("text-[10px] font-bold uppercase opacity-50 mb-1", isDark ? "text-white" : "text-black")}>Size</div>
          <div className={cn("text-sm font-bold truncate", isDark ? "text-white" : "text-gray-900")}>
            {company_size}
          </div>
        </div>
        <div>
          <div className={cn("text-[10px] font-bold uppercase opacity-50 mb-1", isDark ? "text-white" : "text-black")}>Jobs</div>
          <div className={cn("text-sm font-bold", isDark ? "text-white" : "text-gray-900")}>
            {recent_jobs_count}
          </div>
        </div>
      </div>

      {/* Bottom Action & Decoration */}
      <div className="flex items-end justify-between mt-auto relative z-10">
        <div className="flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm",
            color.bg, "text-white"
          )}>
            <ArrowRight className="w-4 h-4" />
          </div>
          <span className={cn("text-xs font-bold uppercase tracking-wider", isDark ? "text-gray-400" : "text-gray-500")}>
            View Profile
          </span>
        </div>
      </div>

      {/* Graffiti Corner Pattern */}
      <div className="absolute bottom-0 right-0 w-40 h-40 pointer-events-none overflow-hidden rounded-br-[32px]">
        <svg
          viewBox="0 0 100 100"
          className={cn(
            "absolute bottom-[-10%] right-[-10%] w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-110",
            color.text
          )}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <path d={shapePath} fill="currentColor" fillOpacity="0.1" />
        </svg>

        {/* Layer 2 for depth */}
        <svg
          viewBox="0 0 100 100"
          className={cn(
            "absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] transform transition-transform duration-500 ease-out group-hover:scale-125 group-hover:rotate-12",
            color.text
          )}
        >
          <path d={shapePath} fill="currentColor" fillOpacity="0.2" />
        </svg>
      </div>
    </Link>
  );
}