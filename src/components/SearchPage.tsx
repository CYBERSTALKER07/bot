import { useState, useRef, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  ArrowLeft,
  Users as UsersIcon,
  Briefcase,
  TrendingUp,
  ChevronRight,
  Filter,
  Building2,
  Clock,
  Verified,
  MoreHorizontal
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/cva';
import { useSearch, useMostLikedPosts } from '../hooks/useOptimizedQuery'; // Assuming matched hooks exist
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

// --- Types ---
interface SearchResult {
  id: string;
  type: 'user' | 'job' | 'post' | 'company' | 'hashtag';
  title: string;
  subtitle?: string;
  description: string;
  avatar?: string;
  verified?: boolean;
}

// --- Constants & Styles ---
const COLORS = {
  pink: 'bg-[#F472B6] text-black',
  orange: 'bg-[#FB923C] text-black',
  teal: 'bg-[#2DD4BF] text-black',
  verified: 'text-[#2DD4BF]',
};

// CSS Injection for Scrollbars & Glassmorphism
const styles = `
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .glass-panel {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  .dark .glass-panel {
    background: rgba(15, 15, 17, 0.85);
  }
  @keyframes shimmer {
    0% { opacity: 0.5; transform: translateX(-5%); }
    50% { opacity: 1; transform: translateX(0); }
    100% { opacity: 0.5; transform: translateX(-5%); }
  }
  .glass-pulse { animation: shimmer 2s infinite ease-in-out; }
`;

// --- GLASSMORPHIC SKELETONS ---

const GlassBlock = ({ className, rounded = "rounded-full" }: { className?: string, rounded?: string }) => (
  <div className={cn(
    "glass-pulse bg-gray-200/50 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/5",
    rounded, className
  )} />
);

const HeroSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[1, 2].map(i => (
      <div key={i} className="h-48 rounded-[32px] border border-gray-100 dark:border-gray-800 bg-white/40 dark:bg-white/5 backdrop-blur-sm p-8 flex flex-col justify-between">
        <div className="space-y-4">
          <GlassBlock className="h-12 w-24 rounded-2xl" />
          <GlassBlock className="h-4 w-32 rounded-lg" />
        </div>
        <GlassBlock className="h-24 w-24 rounded-full self-end opacity-10" />
      </div>
    ))}
  </div>
);

const PostSkeleton = () => (
  <div className="p-6 rounded-[32px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181B] space-y-5">
    <div className="flex gap-4">
      <GlassBlock className="w-14 h-14 rounded-full shrink-0" />
      <div className="space-y-2 flex-1 pt-2">
        <GlassBlock className="h-4 w-32 rounded-lg" />
        <GlassBlock className="h-3 w-20 rounded-lg" />
      </div>
    </div>
    <div className="space-y-3 pl-18">
      <GlassBlock className="h-3 w-full rounded-lg" />
      <GlassBlock className="h-3 w-5/6 rounded-lg" />
      <GlassBlock className="h-3 w-4/6 rounded-lg" />
    </div>
  </div>
);

const SearchResultSkeleton = () => (
  <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-white/5 mb-3 flex items-center gap-4">
    <GlassBlock className="w-14 h-14 rounded-full shrink-0" />
    <div className="flex-1 space-y-2">
      <GlassBlock className="h-4 w-40 rounded-lg" />
      <GlassBlock className="h-3 w-24 rounded-lg" />
    </div>
    <GlassBlock className="w-8 h-8 rounded-full" />
  </div>
);

const SidebarItemSkeleton = ({ type = 'circle' }: { type?: 'circle' | 'square' }) => (
  <div className="flex items-center gap-3 py-1">
    <GlassBlock className={cn("w-10 h-10 shrink-0", type === 'square' ? "rounded-xl" : "rounded-full")} />
    <div className="flex-1 space-y-2">
      <GlassBlock className="h-3 w-24 rounded-lg" />
      <GlassBlock className="h-2 w-16 rounded-lg" />
    </div>
  </div>
);

const PromoSkeleton = () => (
  <div className="h-48 rounded-[32px] border border-gray-100 dark:border-gray-800 bg-white/40 dark:bg-white/5 backdrop-blur-sm p-6 flex flex-col justify-center space-y-4 relative overflow-hidden">
    <GlassBlock className="h-6 w-3/4 rounded-xl relative z-10" />
    <GlassBlock className="h-6 w-1/2 rounded-xl relative z-10" />
    <GlassBlock className="h-10 w-32 rounded-full mt-4 relative z-10" />
    <div className="absolute -right-4 top-0 h-full w-24 bg-white/5 -skew-x-12" />
  </div>
);

// --- Helper: Highlight Text ---
const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <span className="truncate">{text}</span>;
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <span className="truncate">
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="text-[#F472B6] font-bold bg-[#F472B6]/10 rounded-sm px-0.5">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user } = useAuth();

  const inputRef = useRef<HTMLInputElement>(null);
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState('Top');
  const [recentSearches, setRecentSearches] = useState(['Product Design', '#RemoteWork', 'Fashion Tech', 'Google']);

  const tabs = [
    { id: 'Top', label: 'Top' },
    { id: 'People', label: 'People' },
    { id: 'Jobs', label: 'Jobs' },
    { id: 'Companies', label: 'Companies' }
  ];

  const debouncedQuery = useDebounce(searchInput, 300);
  const { data: searchResults, isLoading: loading } = useSearch(debouncedQuery);
  const { data: trendingPosts = [], isLoading: isLoadingPosts } = useMostLikedPosts(3, user?.id);

  // Sidebar Data State
  const [suggestedPeople, setSuggestedPeople] = useState<any[]>([]);
  const [sidebarCompanies, setSidebarCompanies] = useState<any[]>([]);
  const [isLoadingSidebar, setIsLoadingSidebar] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingSidebar(true);
      await new Promise(r => setTimeout(r, 1200)); // Simulate skeleton
      const { data: people } = await supabase.from('profiles').select('*').limit(3);
      if (people) setSuggestedPeople(people);
      const { data: companies } = await supabase.from('companies').select('*').limit(3);
      if (companies) setSidebarCompanies(companies);
      setIsLoadingSidebar(false);
    }
    fetchData();
  }, []);

  // Update URL on search
  useEffect(() => {
    if (debouncedQuery) setSearchParams({ q: debouncedQuery });
    else setSearchParams({});
  }, [debouncedQuery, setSearchParams]);

  const filteredResults = useMemo(() => {
    const raw = searchResults as any;
    if (!raw) return [];

    let list: SearchResult[] = [];
    if (raw.users) raw.users.forEach((u: any) => list.push({ id: u.id, type: 'user', title: u.full_name, subtitle: `@${u.username}`, description: u.bio, avatar: u.avatar_url, verified: u.verified }));
    if (raw.jobs) raw.jobs.forEach((j: any) => list.push({ id: j.id, type: 'job', title: j.title, subtitle: j.company, description: j.location }));
    if (raw.companies) raw.companies.forEach((c: any) => list.push({ id: c.id, type: 'company', title: c.name, subtitle: c.industry, description: c.description, avatar: c.logo_url }));

    if (activeTab !== 'Top') {
      if (activeTab === 'People') list = list.filter(x => x.type === 'user');
      if (activeTab === 'Jobs') list = list.filter(x => x.type === 'job');
      if (activeTab === 'Companies') list = list.filter(x => x.type === 'company');
    }
    return list;
  }, [searchResults, activeTab]);

  return (
    <div className={cn('min-h-screen pb-20 font-sans transition-colors duration-300', isDark ? 'bg-[#0f0f11] text-gray-100' : 'bg-[#FAFAFA] text-gray-900')}>
      <style>{styles}</style>

      {/* --- Sticky Header --- */}
      <div className={cn(
        'sticky top-0 z-50 border-b transition-all duration-300 glass-panel',
        isDark ? 'border-gray-800/50' : 'border-gray-200/50'
      )}>
        <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">

          {/* Search Input Area */}
          <div className="flex justify-center w-full">
            <div className="w-full relative group">
              <div className={cn(
                'flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 shadow-sm',
                isSearchFocused
                  ? isDark ? 'bg-[#18181B] border border-[#F472B6] ring-2 ring-[#F472B6]/20' : 'bg-white border border-[#F472B6] ring-2 ring-[#F472B6]/20'
                  : isDark ? 'bg-[#18181B] border border-gray-800 hover:border-gray-700' : 'bg-white border border-gray-200 hover:border-gray-300'
              )}>
                {searchInput ? (
                  <button onClick={() => setSearchInput('')} className="p-1 -ml-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-[#F472B6]" />
                  </button>
                ) : (
                  <SearchIcon className={cn('w-5 h-5 transition-colors', isSearchFocused ? 'text-[#F472B6]' : 'text-gray-400')} />
                )}

                <input
                  ref={inputRef}
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Search creators, jobs, or tags..."
                  className="flex-1 bg-transparent outline-none text-[16px] placeholder:text-gray-500 font-medium"
                />

                {searchInput && (
                  <button
                    onClick={() => setSearchInput('')}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <span className="sr-only">Clear</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                )}
              </div>

              {/* Recent Searches Dropdown */}
              {isSearchFocused && !searchInput && (
                <div className={cn(
                  "absolute top-full left-0 right-0 mt-3 p-2 rounded-3xl border shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top",
                  isDark ? "bg-[#18181B] border-gray-800" : "bg-white border-gray-100"
                )}>
                  <div className="flex items-center justify-between px-4 py-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Recent</h3>
                    <button className="text-xs text-[#F472B6] font-semibold hover:underline">Clear all</button>
                  </div>
                  {recentSearches.map((term, i) => (
                    <button key={i} onClick={() => setSearchInput(term)} className={cn(
                      "flex items-center justify-between w-full p-3 rounded-2xl transition-colors group",
                      isDark ? "hover:bg-white/5" : "hover:bg-gray-50"
                    )}>
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-full", isDark ? "bg-white/5 group-hover:bg-[#F472B6]/20" : "bg-gray-100 group-hover:bg-[#F472B6]/10")}>
                          <Clock className="w-4 h-4 text-gray-400 group-hover:text-[#F472B6]" />
                        </div>
                        <span className="font-medium">{term}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Styled Tabs */}
          {searchInput && (
            <div className="flex justify-center w-full animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-1 p-1.5 bg-gray-100 dark:bg-[#18181B] rounded-full border border-gray-200 dark:border-gray-800">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "px-6 py-2 rounded-full text-sm font-bold transition-all duration-300",
                      activeTab === tab.id
                        ? `${COLORS.pink} shadow-lg shadow-pink-500/20 scale-105`
                        : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/5"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="max-w-5xl mx-auto px-4 py-8 flex items-start gap-10">

        {/* LEFT COLUMN (MAIN FEED) */}
        <div className="flex-1 min-w-0">

          {!searchInput ? (
            /* --- DISCOVERY MODE --- */
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">

              {/* Bento Grid Stats */}
              {isLoadingPosts ? (
                <HeroSkeleton />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={cn("group p-8 rounded-[32px] relative overflow-hidden flex flex-col justify-between h-48 transition-transform hover:scale-[1.02] cursor-pointer", COLORS.pink)}>
                    <div className="relative z-10">
                      <h3 className="text-4xl font-black tracking-tighter mb-1">27</h3>
                      <p className="font-bold opacity-80 uppercase tracking-wide text-xs">Active Designers</p>
                    </div>
                    <UsersIcon className="absolute -bottom-6 -right-6 w-32 h-32 opacity-20 rotate-12 transition-transform group-hover:rotate-0" />
                  </div>
                  <div className={cn("group p-8 rounded-[32px] relative overflow-hidden flex flex-col justify-between h-48 transition-transform hover:scale-[1.02] cursor-pointer", COLORS.orange)}>
                    <div className="relative z-10">
                      <h3 className="text-4xl font-black tracking-tighter mb-1">19</h3>
                      <p className="font-bold opacity-80 uppercase tracking-wide text-xs">Active Vacancies</p>
                    </div>
                    <TrendingUp className="absolute -bottom-6 -right-6 w-32 h-32 opacity-20 transition-transform group-hover:scale-110" />
                  </div>
                </div>
              )}

              {/* Trending Feed */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                    Latest Updates <span className="text-[#F472B6]">.</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {isLoadingPosts
                    ? [1, 2, 3].map(i => <PostSkeleton key={i} />)
                    : trendingPosts.map((post: any) => (
                      <div key={post.id} className={cn(
                        "group p-6 rounded-[32px] border transition-all cursor-pointer",
                        isDark ? "bg-[#18181B] border-gray-800 hover:border-gray-700 hover:shadow-2xl hover:shadow-black/50" : "bg-white border-gray-200 hover:border-[#F472B6]/30 hover:shadow-xl hover:shadow-[#F472B6]/5"
                      )}>
                        <div className="flex gap-4">
                          <img src={post.author?.avatar_url} className="w-14 h-14 rounded-full object-cover border-2 border-transparent group-hover:border-[#F472B6] transition-colors" alt="" />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-lg group-hover:text-[#F472B6] transition-colors">{post.author?.name}</h4>
                                <p className={cn("text-sm font-medium", isDark ? "text-gray-500" : "text-gray-400")}>@{post.author?.username}</p>
                              </div>
                              <button className="text-gray-400 hover:text-[#F472B6]"><MoreHorizontal className="w-5 h-5" /></button>
                            </div>
                            <p className="mt-3 text-[15px] leading-relaxed line-clamp-3 opacity-90">{post.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            /* --- SEARCH RESULTS LIST --- */
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {!loading && (
                <div className="flex items-center justify-between pb-2 px-1">
                  <p className="text-sm font-medium text-gray-500">Found <span className="text-[#F472B6] font-bold">{filteredResults.length}</span> results</p>
                  <button className="text-sm font-bold flex items-center gap-1.5 hover:text-[#F472B6] transition-colors bg-gray-100 dark:bg-[#18181B] px-3 py-1.5 rounded-lg">
                    <Filter className="w-3.5 h-3.5" /> Filter
                  </button>
                </div>
              )}

              {loading ? (
                [1, 2, 3, 4].map((i) => <SearchResultSkeleton key={i} />)
              ) : filteredResults.length === 0 ? (
                <div className="text-center py-24 rounded-[32px] border border-dashed border-gray-300 dark:border-gray-800 bg-gray-50/50 dark:bg-[#18181B]/50">
                  <SearchIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold">No results found</h3>
                  <p className="text-sm text-gray-500">Try adjusting your search terms</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredResults.map((result) => (
                    <div key={result.id} onClick={() => navigate(`/${result.type}/${result.id}`)} className={cn(
                      "p-4 rounded-3xl border transition-all cursor-pointer relative group",
                      isDark
                        ? "bg-[#18181B] border-gray-800 hover:bg-[#202024] hover:border-gray-700"
                        : "bg-white border-gray-100 hover:border-[#F472B6]/30 hover:shadow-lg hover:shadow-[#F472B6]/5"
                    )}>
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <img
                            src={result.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${result.title}`}
                            alt={result.title}
                            className={cn(
                              "object-cover shadow-sm",
                              result.type === 'company' ? "w-16 h-16 rounded-2xl" : "w-16 h-16 rounded-full"
                            )}
                          />
                          <div className={cn(
                            "absolute -bottom-1 -right-1 p-1.5 rounded-full border-[3px] shadow-sm",
                            isDark ? "bg-[#18181B] border-[#18181B]" : "bg-white border-white"
                          )}>
                            {result.type === 'user' && <UsersIcon className="w-3 h-3 text-[#F472B6]" />}
                            {result.type === 'job' && <Briefcase className="w-3 h-3 text-[#FB923C]" />}
                            {result.type === 'company' && <Building2 className="w-3 h-3 text-[#2DD4BF]" />}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <h3 className="font-bold text-[17px] tracking-tight truncate">
                                <HighlightedText text={result.title} highlight={searchInput} />
                              </h3>
                              {result.verified && <Verified className={cn("w-4 h-4 fill-current flex-shrink-0", COLORS.verified)} />}
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#F472B6] group-hover:translate-x-1 transition-all" />
                          </div>
                          <p className="text-sm text-gray-500 font-medium truncate">{result.subtitle}</p>
                          <p className="text-xs text-gray-400 mt-1 truncate max-w-[90%]">{result.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR (DESKTOP ONLY) */}
        <div className="hidden lg:block w-[340px] shrink-0 sticky top-28 h-fit space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000">

          {/* 1. Trending People Widget */}
          <div className={cn("p-6 rounded-[32px] border", isDark ? "bg-[#18181B] border-gray-800" : "bg-white border-gray-200")}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Trending People</h3>
              <button className="text-xs font-bold text-[#F472B6] hover:underline">View All</button>
            </div>

            <div className="space-y-5">
              {isLoadingSidebar
                ? [1, 2, 3].map(i => <SidebarItemSkeleton key={i} type="circle" />)
                : suggestedPeople.map((p, i) => (
                  <div key={i} onClick={() => navigate(`/profile/${p.id}`)} className="flex items-center gap-4 group cursor-pointer">
                    <div className="relative">
                      <img src={p.avatar_url} className="w-12 h-12 rounded-full bg-gray-200 object-cover border-2 border-transparent group-hover:border-[#F472B6] transition-colors" alt="" />
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#2DD4BF] border-[3px] border-white dark:border-[#18181B] rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate group-hover:text-[#F472B6] transition-colors">{p.full_name}</p>
                      <p className="text-xs text-gray-500 truncate">@{p.username}</p>
                    </div>
                    <button className={cn(
                      "p-2 rounded-full transition-colors",
                      isDark ? "hover:bg-white/10 text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-400 hover:text-black"
                    )}>
                      <UsersIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* 2. Recommended Companies Widget */}
          <div className={cn("p-6 rounded-[32px] border", isDark ? "bg-[#18181B] border-gray-800" : "bg-white border-gray-200")}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Companies</h3>
            </div>

            <div className="space-y-5">
              {isLoadingSidebar
                ? [1, 2].map(i => <SidebarItemSkeleton key={i} type="square" />)
                : sidebarCompanies.map((c, i) => (
                  <div key={i} onClick={() => navigate(`/company/${c.id}`)} className="flex items-center gap-4 group cursor-pointer">
                    <div className="relative shrink-0">
                      <img src={c.logo_url} className="w-12 h-12 rounded-2xl bg-gray-200 object-cover shadow-sm group-hover:shadow-md transition-shadow" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate group-hover:text-[#FB923C] transition-colors">{c.name}</p>
                      <p className="text-xs text-gray-500 truncate">{c.industry || 'Business'}</p>
                    </div>
                    <button className={cn("px-3 py-1.5 rounded-full text-[10px] font-bold border transition-colors opacity-0 group-hover:opacity-100", isDark ? "border-gray-700 bg-white text-black" : "border-gray-200 bg-black text-white")}>
                      View
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* 3. Promo Widget */}
          {isLoadingSidebar ? (
            <PromoSkeleton />
          ) : (
            <div className={cn("p-8 rounded-[32px] relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]", COLORS.teal)}>
              <div className="relative z-10">
                <span className="inline-block px-2 py-1 bg-black/10 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3 backdrop-blur-sm">New Issue</span>
                <h3 className="font-black text-2xl leading-tight mb-6">The Future <br />of Design Systems</h3>
                <button className="px-5 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-900 transition-colors shadow-lg flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read Magazine <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-full bg-black/5 -skew-x-12 transform translate-x-10 group-hover:translate-x-6 transition-transform duration-700"></div>
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-colors duration-500"></div>
            </div>
          )}

          {/* Mini Footer */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-gray-500 px-4">
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Advertising</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Cookies</a>
            <span className="text-gray-400">© 2024 Design.co</span>
          </div>
        </div>

      </div>
    </div>
  );
}