import { useState } from 'react';
import {
  Search,
  MapPin,
  ArrowUpRight,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import PageLayout from './ui/PageLayout';
import { cn } from '../lib/cva';
import { useJobs } from '../hooks/useJobs';
import Animate from './ui/Animate';
import { useBreakpoint } from '@openai/apps-sdk-ui/hooks/useBreakpoints';
import JobCard from './JobCard';

// ==========================================
// 2. SIDEBAR PREVIEW CARD (Floating)
// ==========================================
const PreviewCard = ({ title, company, location, salary, description, tags, logo, isDark }: any) => (
  <div className={cn(
    "absolute right-[105%] top-1/2 -translate-y-1/2 w-80 p-5 rounded-3xl shadow-2xl backdrop-blur-xl border z-[999]",
    "transition-all duration-300 ease-out origin-right",
    "opacity-0 translate-x-8 scale-95 pointer-events-none",
    "group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-hover:pointer-events-auto",
    isDark
      ? "bg-gray-900/95 border-gray-700 text-white shadow-black/80"
      : "bg-white/95 border-white/60 text-gray-900 shadow-blue-900/20"
  )}>
    <div className="flex items-center gap-4 mb-4">
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold border shrink-0",
        isDark ? "bg-black border-gray-800" : "bg-white border-gray-100"
      )}>
        {logo && typeof logo === 'string' && logo.startsWith('http') ? (
          <img src={logo} alt={company} className="w-8 h-8 object-contain" />
        ) : (
          <span>{company ? company[0] : 'J'}</span>
        )}
      </div>
      <div>
        <h4 className="font-bold text-lg leading-tight line-clamp-2">{title}</h4>
        <p className="text-xs opacity-70 font-medium">{company}</p>
      </div>
    </div>
    <div className="flex flex-wrap gap-2 mb-4">
      {tags?.map((tag: string, i: number) => (
        <span key={i} className={cn(
          "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
          isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
        )}>
          {tag}
        </span>
      ))}
    </div>
    <div className="space-y-2 mb-4">
      <div className="flex items-center gap-2 text-sm opacity-80">
        <MapPin className="w-3.5 h-3.5" />
        <span className="truncate">{location || "Remote"}</span>
      </div>
      <div className="flex items-center gap-2 text-sm font-bold text-green-500">
        <DollarSign className="w-3.5 h-3.5" />
        <span>{salary || "Competitive Salary"}</span>
      </div>
    </div>
    <p className="text-xs leading-relaxed opacity-60 line-clamp-3 mb-4">
      {description || "Join our team to help build the future of digital experiences."}
    </p>
    <div className={cn(
      "w-full py-2.5 rounded-xl text-xs font-bold text-center border cursor-pointer hover:opacity-80 transition-opacity",
      isDark ? "bg-white text-black border-white" : "bg-black text-white border-black"
    )}>
      Quick View
    </div>
  </div>
);

// ==========================================
// 3. SIDEBAR WIDGETS
// ==========================================

// Best Matches
const BestMatchesWidget = ({ isDark }: { isDark: boolean }) => {
  const matches = [
    {
      title: "Brand Strategist",
      company: "Apple Inc.",
      location: "California, USA",
      match: 98,
      logoColor: "bg-black text-white",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
    },
    {
      title: "Product Manager",
      company: "Wallet App",
      location: "New York, USA",
      match: 85,
      logoColor: "bg-pink-100 text-pink-600",
      logo: null
    },
  ];

  return (
    <div className={cn(
      "p-6 rounded-[2.5rem] border shadow-xs transition-all mb-6",
      isDark ? "bg-black border-gray-800" : "bg-white border-white shadow-gray-200/50"
    )}>
      <h3 className={cn("font-bold text-xl mb-6", isDark ? "text-white" : "text-gray-900")}>
        Best Matches
      </h3>
      <div className="space-y-6">
        {matches.map((job, i) => (
          <div key={i} className="group relative cursor-pointer">
            <PreviewCard
              isDark={isDark}
              title={job.title}
              company={job.company}
              location={job.location}
              logo={job.logo}
              salary="$120k - $150k"
              tags={['Full Time', 'Match']}
            />
            <div className="flex items-start gap-4 mb-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg font-bold transition-transform group-hover:scale-110 shadow-sm",
                job.logoColor,
                isDark && !job.logo ? "bg-gray-800 text-white" : ""
              )}>
                {job.logo ? <img src={job.logo} className="w-5 h-5 object-contain invert dark:invert-0" /> : job.company[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={cn("font-bold text-sm truncate", isDark ? "text-white" : "text-gray-900")}>{job.title}</h4>
                <p className="text-xs text-gray-400 truncate">{job.company}</p>
              </div>
            </div>
            {/* Match Bar */}
            <div className={cn("p-3 rounded-xl", isDark ? "bg-gray-900" : "bg-gray-50")}>
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Match</span>
                <span className={cn("text-xs font-bold", job.match > 90 ? "text-blue-500" : "text-purple-500")}>{job.match}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", job.match > 90 ? "bg-blue-500" : "bg-purple-500")} style={{ width: `${job.match}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Job Status
const JobStatusWidget = ({ isDark }: { isDark: boolean }) => {
  const activeJobs = [
    { title: "Sr Product Designer", company: "Neo", location: "Calgary, Canada", hours: "48hrs / week", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Neo_logo.svg", bg: "bg-black" },
    { title: "Jr UX/UI Designer", company: "Adobe", location: "UK, (Remote)", hours: "32hrs / week", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Adobe_Corporate_Logo.png", bg: "bg-red-600" },
    { title: "Freelance UI Designer", company: "Dice", location: "US, (Remote)", hours: "40hrs / week", logo: null, bg: "bg-black" }
  ];

  const closedJobs = [
    { title: "3D Designer", company: "Jit", location: "Kolin, Georgia", hours: "20hrs / week", logo: null, bg: "bg-orange-400" }
  ];

  return (
    <div className={cn(
      "p-8 rounded-[2.5rem] border shadow-xs mb-6",
      isDark ? "bg-black border-gray-800" : "bg-white border-white shadow-gray-200/50"
    )}>
      <h3 className={cn("font-bold text-2xl mb-6", isDark ? "text-white" : "text-black")}>
        Job Status
      </h3>
      <div className="mb-8">
        <h4 className="text-green-600 font-bold text-lg mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Active Jobs
        </h4>
        <div className="space-y-6">
          {activeJobs.map((job, i) => (
            <div key={i} className="flex items-center gap-4 group relative cursor-pointer">
              <PreviewCard
                isDark={isDark}
                title={job.title}
                company={job.company}
                location={job.location}
                tags={['Active', 'Ongoing']}
                salary={job.hours}
              />
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xl overflow-hidden",
                job.bg
              )}>
                {job.logo ? <img src={job.logo} className="w-full h-full object-cover" /> : "D"}
              </div>
              <div>
                <h5 className={cn("font-bold text-base", isDark ? "text-white" : "text-black")}>{job.title}</h5>
                <p className="text-sm text-gray-400">{job.location}</p>
                <p className={cn("text-xs font-medium mt-0.5", isDark ? "text-gray-500" : "text-gray-500")}>{job.hours}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-red-500 font-bold text-lg mb-4 opacity-80">Closed</h4>
        <div className="space-y-6">
          {closedJobs.map((job, i) => (
            <div key={i} className="flex items-center gap-4 group relative cursor-pointer grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
              <PreviewCard
                isDark={isDark}
                title={job.title}
                company={job.company}
                location={job.location}
                tags={['Closed']}
                salary={job.hours}
              />
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xl",
                job.bg
              )}>
                Jt
              </div>
              <div>
                <h5 className={cn("font-bold text-base", isDark ? "text-white" : "text-black")}>{job.title}</h5>
                <p className="text-sm text-gray-400">{job.location}</p>
                <p className="text-xs font-medium mt-0.5 text-gray-500">{job.hours}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Widget: Employers
const EmployersWidget = ({ isDark }: { isDark: boolean }) => {
  const employers = [
    { name: "Google", items: 12, logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" },
    { name: "Airbnb", items: 5, logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" },
    { name: "Figma", items: 8, logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" }
  ];

  return (
    <div className={cn(
      "p-6 rounded-[2.5rem] border shadow-xs mb-6",
      isDark ? "bg-black border-gray-800" : "bg-white border-white shadow-gray-200/50"
    )}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={cn("font-bold text-xl", isDark ? "text-white" : "text-gray-900")}>
          Employers
        </h3>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowUpRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      <div className="space-y-4">
        {employers.map((emp, i) => (
          <div key={i} className="flex items-center justify-between group relative cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-2xl transition-colors">
            {/* Employer Preview */}
            <div className={cn(
              "absolute right-[105%] top-1/2 -translate-y-1/2 w-64 p-5 rounded-3xl shadow-2xl backdrop-blur-xl border z-[999]",
              "transition-all duration-300 ease-out origin-right pointer-events-none opacity-0 translate-x-8 scale-95",
              "group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100",
              isDark ? "bg-gray-900/95 border-gray-700 text-white" : "bg-white/95 border-white text-black"
            )}>
              <div className="flex items-center gap-3 mb-3">
                <img src={emp.logo} className="w-8 h-8 object-contain" />
                <span className="font-bold text-lg">{emp.name}</span>
              </div>
              <p className="text-xs mb-4 opacity-70 leading-relaxed">
                A leading technology company shaping the future. Follow to get updates on new roles.
              </p>
              <button className="w-full py-2 rounded-xl bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20">
                View Company Page
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center p-2 border",
                isDark ? "bg-white border-gray-700" : "bg-white border-gray-100"
              )}>
                <img src={emp.logo} className="w-full h-full object-contain" />
              </div>
              <div>
                <p className={cn("font-bold text-sm", isDark ? "text-white" : "text-gray-900")}>{emp.name}</p>
                <p className="text-xs text-gray-400">{emp.items} Openings</p>
              </div>
            </div>
            <button className={cn(
              "text-[10px] font-bold px-3 py-1.5 rounded-full border transition-colors uppercase tracking-wide",
              isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-100"
            )}>
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================
export default function JobsPage() {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const isMd = useBreakpoint('md');
  const isMobile = !isMd;

  // Mock data hook
  const { jobs: jobsData = [], loading } = useJobs();

  // Filter Logic
  const filteredJobs = (jobsData || []).filter(job => {
    const matchesSearch =
      (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.company || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || job.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className={cn(
      'min-h-screen transition-colors duration-300',
      isDark ? 'bg-black text-white' : 'bg-gray-50/50 text-black'
    )}>
      <PageLayout maxWidth="7xl" padding={isMobile ? 'sm' : 'md'}>
        <div className="py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">

          {/* -----------------------------------------------------------------
              LEFT COLUMN: SEARCH & FEED (8 Cols)
          ----------------------------------------------------------------- */}
          <div className="lg:col-span-8 flex flex-col gap-6 z-10">

            {/* Page Header */}
            <div className="px-2">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Find your next job</h1>
              <p className="text-gray-500">
                Browsing <span className="font-bold text-black dark:text-white">{filteredJobs.length}</span> active jobs
              </p>
            </div>

            {/* Sticky Search Bar */}
            <div className={cn(
              "sticky top-4 z-40 p-4 rounded-[2rem] border backdrop-blur-md transition-all mb-2",
              isDark
                ? "bg-black/80 border-gray-800 shadow-2xl shadow-black/50"
                : "bg-white/80 border-white shadow-xl shadow-gray-200/50"
            )}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for jobs, companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={cn(
                      "w-full pl-12 pr-4 py-3 rounded-xl outline-hidden transition-all",
                      isDark
                        ? "bg-gray-900 focus:bg-gray-800 text-white placeholder-gray-500"
                        : "bg-gray-100 focus:bg-white focus:ring-2 ring-blue-100 text-black"
                    )}
                  />
                </div>
                {/* Desktop Filter Chips */}
                <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {['all', 'full-time', 'contract'].map(type => (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className={cn(
                        "px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap capitalize transition-all",
                        typeFilter === type
                          ? (isDark ? "bg-white text-black" : "bg-black text-white")
                          : (isDark ? "bg-gray-900 text-gray-400 hover:bg-gray-800" : "bg-gray-100 text-gray-500 hover:bg-gray-200")
                      )}
                    >
                      {type.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Filters */}
              <div className="sm:hidden mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['all', 'full-time', 'part-time', 'contract'].map(type => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap capitalize border",
                      typeFilter === type
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-600 border-gray-200"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Jobs Feed Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={cn("h-80 rounded-[2rem] animate-pulse", isDark ? "bg-gray-900" : "bg-gray-200")} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredJobs.map((job, index) => (
                  <Animate
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    enter={{ opacity: 1, y: 0, duration: 400, delay: index * 50 }}
                  >
                    <JobCard
                      id={job.id}
                      title={job.title}
                      company={job.company}
                      location={job.location}
                      type={job.type}
                      salary_range={job.salary_range}
                      posted_at={job.created_at}
                      skills={job.skills || []}
                      is_remote={job.is_remote}
                      employer={job.employer}
                    />
                  </Animate>
                ))}

                {filteredJobs.length === 0 && (
                  <div className="col-span-full py-20 text-center opacity-50">
                    <Briefcase className="w-12 h-12 mx-auto mb-4" />
                    <p>No jobs found.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* -----------------------------------------------------------------
              RIGHT COLUMN: SIDEBAR (4 Cols)
              Z-20 ensures popups float over the feed (Z-10)
          ----------------------------------------------------------------- */}
          <div className="hidden lg:block lg:col-span-4 relative z-20">
            <div className="sticky top-6 pb-10">

              {/* 1. Best Matches */}
              <BestMatchesWidget isDark={isDark} />

              {/* 2. Job Status */}
              <JobStatusWidget isDark={isDark} />

              {/* 3. Employers */}
              <EmployersWidget isDark={isDark} />

              {/* Footer */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-gray-400 px-6 mt-8">
                <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
                <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
                <a href="#" className="hover:text-gray-600 transition-colors">Help</a>
                <span>© 2024 JobBoard</span>
              </div>
            </div>
          </div>

        </div>
      </PageLayout>
    </div>
  );
}