import { useState, useRef, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  X as XIcon,
  ArrowLeft,
  AtSign,
  Users as UsersIcon,
  Briefcase,
  Calendar,
  MapPin,
  Clock,
  Hash,
  Verified
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/cva';
import { useSearch, useMostFollowedUsers, useMostLikedPosts, useMatchedJobs } from '../hooks/useOptimizedQuery';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../context/AuthContext';
import WhoToFollowCard from './WhoToFollowCard';
import { SearchResultsListSkeleton } from './ui/Skeleton';
import { supabase } from '../lib/supabase';

interface SearchResult {
  id: string;
  type: 'user' | 'job' | 'post' | 'company' | 'hashtag';
  title: string;
  subtitle?: string;
  description: string;
  avatar?: string;
  verified?: boolean;
  engagement?: {
    likes?: number;
    replies?: number;
  };
}

interface SearchResultData {
  users?: Array<{ id: string; full_name: string; username: string; bio?: string; avatar_url?: string; verified?: boolean }>;
  posts?: Array<{ id: string; content: string; profiles?: Array<{ full_name: string; username: string; avatar_url?: string }> }>;
  jobs?: Array<{ id: string; title: string; company: string; location: string; type?: string }>;
  companies?: Array<{ id: string; name: string; industry?: string; description?: string; logo_url?: string }>;
  hashtags?: Array<{ id: string; name: string; usage_count: number; trending_score: number }>;
}

const styles = `
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(107, 114, 128, 0.5) transparent;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(107, 114, 128, 0.5);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(107, 114, 128, 0.7);
  }

  .search-result {
    transition: background-color 0.15s ease;
  }

  .search-result:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .search-input::placeholder {
    color: rgba(107, 114, 128, 0.7);
  }

  .at-symbol {
    color: #3b82f6;
    font-weight: 600;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 640px) {
    .search-sidebar {
      display: none;
    }
  }
`;

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState('Top');

  const tabs = [
    { id: 'Top', label: 'Top' },
    { id: 'People', label: 'People' },
    { id: 'Jobs', label: 'Jobs' },
    { id: 'Posts', label: 'Posts' },
    { id: 'Companies', label: 'Companies' }
  ];

  // Parse search input to detect @ symbol
  const isUsernameSearch = searchInput.startsWith('@');
  const cleanSearchQuery = searchInput.startsWith('@') ? searchInput.slice(1) : searchInput;

  const debouncedQuery = useDebounce(cleanSearchQuery, 300);
  const { data: searchResults, isLoading: loading } = useSearch(debouncedQuery);

  // Fetch most followed users for sidebar
  const { data: mostFollowedUsers = [] } = useMostFollowedUsers(5);

  // Fallback: Fetch regular users if mostFollowedUsers is empty
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [employers, setEmployers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (mostFollowedUsers.length > 0) {
        setSuggestedUsers(mostFollowedUsers);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url, bio, verified')
          .not('username', 'is', null)
          .limit(10);

        if (!error && data) {
          setSuggestedUsers(data);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, [mostFollowedUsers]);

  // Fetch employers/companies for left sidebar
  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url, bio, company_name, verified')
          .eq('role', 'employer')
          .not('company_name', 'is', null)
          .limit(5);

        if (!error && data) {
          setEmployers(data);
        }
      } catch (err) {
        console.error('Error fetching employers:', err);
      }
    };

    fetchEmployers();
  }, []);

  // Fetch trending content for empty state
  const { data: trendingPosts = [], isLoading: isLoadingPosts } = useMostLikedPosts(4, user?.id);
  const { data: recentJobs = [] } = useMatchedJobs(undefined, 4);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  // Fetch upcoming events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('employer_events')
          .select('id, title, event_date, location, employer_id, status')
          .gte('event_date', new Date().toISOString())
          .eq('status', 'upcoming')
          .order('event_date', { ascending: true })
          .limit(3);

        if (!error && data) {
          setUpcomingEvents(data);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);


  // Filter and sort results based on search type
  const allResults: SearchResult[] = useMemo(() => {
    const typedResults = searchResults as SearchResultData | undefined;
    if (!typedResults) return [];

    const results: SearchResult[] = [];

    // Add users
    (typedResults.users || []).forEach((user) => {
      results.push({
        id: user.id,
        type: 'user',
        title: user.full_name,
        subtitle: `@${user.username}`,
        description: user.bio || '',
        avatar: user.avatar_url,
        verified: user.verified || false,
      });
    });

    // Add posts
    (typedResults.posts || []).forEach((post: any) => {
      const profile = post.profiles;
      results.push({
        id: post.id,
        type: 'post',
        title: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
        subtitle: `by @${profile?.username || 'user'}`,
        description: post.content,
        avatar: profile?.avatar_url,
      });
    });

    // Add jobs
    (typedResults.jobs || []).forEach((job: any) => {
      results.push({
        id: job.id,
        type: 'job',
        title: job.title,
        subtitle: job.company,
        description: `${job.location} • ${job.type || 'Full-time'}`,
      });
    });

    // Add companies
    (typedResults.companies || []).forEach((company: any) => {
      results.push({
        id: company.id,
        type: 'company',
        title: company.name,
        subtitle: company.description || '',
        description: company.website || '',
        avatar: company.logo_url,
      });
    });

    // Add hashtags
    (typedResults.hashtags || []).forEach((hashtag: any) => {
      results.push({
        id: hashtag.id,
        type: 'hashtag',
        title: `#${hashtag.name}`,
        subtitle: `${hashtag.usage_count || 0} posts`,
        description: 'Trending hashtag',
      });
    });

    // If searching by username (@), prioritize exact username matches for users
    if (isUsernameSearch && cleanSearchQuery) {
      const userResults = results.filter(r => r.type === 'user');
      const otherResults = results.filter(r => r.type !== 'user');

      userResults.sort((a, b) => {
        const aUsername = a.subtitle?.slice(1) || '';
        const bUsername = b.subtitle?.slice(1) || '';

        // Exact match first
        if (aUsername.toLowerCase() === cleanSearchQuery.toLowerCase()) return -1;
        if (bUsername.toLowerCase() === cleanSearchQuery.toLowerCase()) return 1;

        // Starts with query
        if (aUsername.toLowerCase().startsWith(cleanSearchQuery.toLowerCase())) return -1;
        if (bUsername.toLowerCase().startsWith(cleanSearchQuery.toLowerCase())) return 1;

        // Default order
        return 0;
      });

      return [...userResults, ...otherResults];
    }

    return results;
  }, [searchResults, isUsernameSearch, cleanSearchQuery]);

  const filteredResults = useMemo(() => {
    if (activeTab === 'Top') return allResults;
    if (activeTab === 'People') return allResults.filter(r => r.type === 'user');
    if (activeTab === 'Jobs') return allResults.filter(r => r.type === 'job');
    if (activeTab === 'Posts') return allResults.filter(r => r.type === 'post' || r.type === 'hashtag');
    if (activeTab === 'Companies') return allResults.filter(r => r.type === 'company');
    return allResults;
  }, [allResults, activeTab]);

  const handleClearSearch = () => {
    setSearchInput('');
    inputRef.current?.focus();
  };

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'user':
        navigate(`/profile/${result.id}`);
        break;
      case 'job':
        navigate(`/jobs/${result.id}`);
        break;
      case 'post':
        navigate(`/post/${result.id}`);
        break;
      case 'company':
        navigate(`/company/${result.id}`);
        break;
      case 'hashtag':
        navigate(`/hashtag/${result.title.replace('#', '')}`);
        break;
      default:
        console.warn('Unknown result type:', result.type);
    }
  };

  const handleAtSymbolClick = () => {
    setSearchInput('@');
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (searchInput) {
      inputRef.current?.focus();
    }
  }, [searchInput]);

  return (
    <div className={cn(
      'min-h-screen transition-colors duration-200',
      isDark ? 'bg-black text-white' : 'bg-white text-black'
    )}>
      <style>{styles}</style>

      <div className="flex h-screen overflow-hidden">
        {/* Main Content Area */}
        <div className={cn(
          'flex-1 flex flex-col border-r',
          isDark ? 'border-gray-800' : 'border-gray-200'
        )}>
          {/* Search Header - Fixed/Sticky */}
          <div className={cn(
            'sticky top-0 z-49 border-b backdrop-blur-xl transition-colors ios-header-safe',
            isDark ? 'bg-black/85 border-gray-800' : 'bg-white/85 border-gray-100'
          )}>
            <div className="max-w-2xl mx-auto w-full px-4 py-3">
              {/* Search Bar Container */}
              <div className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 shadow-sm',
                isSearchFocused
                  ? isDark
                    ? 'bg-black border-2 border-[#BCE953] ring-2 ring-[#BCE953]/20'
                    : 'bg-white border-2 border-[#BCE953] ring-2 ring-[#BCE953]/20'
                  : isDark
                    ? 'bg-gray-900/50 border border-gray-800 hover:border-gray-700'
                    : 'bg-gray-100/50 border border-gray-200 hover:border-gray-300'
              )}>
                {/* Mobile Back Button */}
                <button
                  onClick={() => navigate(-1)}
                  className="sm:hidden p-1 hover:bg-gray-700/50 rounded-full transition-colors"
                  title="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <SearchIcon className={cn(
                  'w-5 h-5 flex-shrink-0 transition-colors',
                  isSearchFocused
                    ? 'text-[#BCE953]'
                    : isDark ? 'text-gray-500' : 'text-gray-400'
                )} />

                <input
                  ref={inputRef}
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search by name or type @ for username"
                  className={cn(
                    'flex-1 bg-transparent outline-none text-base search-input placeholder:text-gray-500',
                    isDark ? 'text-white' : 'text-black'
                  )}
                />

                {/* @ Symbol Quick Button */}
                {!searchInput && (
                  <button
                    onClick={handleAtSymbolClick}
                    title="Search by username"
                    className={cn(
                      'p-2 rounded-full transition-all',
                      isDark
                        ? 'text-gray-500 hover:text-[#BCE953] hover:bg-[#BCE953]/10'
                        : 'text-gray-400 hover:text-[#BCE953] hover:bg-[#BCE953]/10'
                    )}
                  >
                    <AtSign className="w-5 h-5" />
                  </button>
                )}

                {searchInput && (
                  <button
                    onClick={handleClearSearch}
                    title="Clear search"
                    className={cn(
                      'p-1 rounded-full transition-colors flex-shrink-0',
                      isDark
                        ? 'text-gray-500 hover:text-white hover:bg-gray-800'
                        : 'text-gray-400 hover:text-black hover:bg-gray-200'
                    )}
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Search Mode Indicator */}
              {searchInput && (
                <div className={cn(
                  'mt-2 px-4 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1',
                  isUsernameSearch
                    ? 'text-[#BCE953]'
                    : isDark ? 'text-gray-500' : 'text-gray-500'
                )}>
                  {isUsernameSearch ? (
                    <>
                      <AtSign className="w-3 h-3" />
                      <span>Searching by username</span>
                    </>
                  ) : (
                    <span>Searching by name</span>
                  )}
                </div>
              )}
            </div>

            {/* Filter Tabs */}
            {searchInput && (
              <div className="max-w-2xl mx-auto w-full px-4 pb-3">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                        activeTab === tab.id
                          ? "bg-[#BCE953] text-black border-[#BCE953] shadow-sm"
                          : isDark
                            ? "bg-transparent text-gray-400 border-gray-800 hover:border-gray-700 hover:text-white"
                            : "bg-transparent text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto w-full pb-20 lg:pb-0 scrollbar-hide">
            {!searchInput ? (
              // Full Post Cards Display
              <div className="w-full max-w-2xl mx-auto">
                {/* Trending Posts as Full Cards */}
                {isLoadingPosts ? (
                  <div className="space-y-4 p-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={cn('p-6 rounded-xl animate-pulse', isDark ? 'bg-gray-900' : 'bg-gray-100')}>
                        <div className="h-32 bg-gray-700 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : trendingPosts.length > 0 ? (
                  <div className="divide-y border-b" style={{ borderColor: isDark ? 'rgb(31 41 55)' : 'rgb(229 231 235)' }}>
                    {trendingPosts.map((post: any) => (
                      <div
                        key={post.id}
                        onClick={() => navigate(`/post/${post.id}`)}
                        className={cn(
                          'p-4 transition-colors cursor-pointer',
                          isDark ? 'hover:bg-gray-900/30' : 'hover:bg-gray-50'
                        )}
                      >
                        {/* Post Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <img
                            src={post.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username}`}
                            alt={post.author?.name}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className={cn("font-bold text-sm truncate", isDark ? "text-white" : "text-gray-900")}>
                                {post.author?.name}
                              </p>
                              {post.author?.verified && (
                                <Verified className="w-3.5 h-3.5 text-[#BCE953] fill-current" />
                              )}
                              <span className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-500')}>
                                @{post.author?.username} · {new Date(post.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="pl-[52px]">
                          <p className={cn('text-base whitespace-pre-wrap mb-3', isDark ? 'text-white' : 'text-black')}>
                            {post.content}
                          </p>

                          {/* Post Media */}
                          {post.media && post.media.length > 0 && (
                            <div className="mb-3 rounded-2xl overflow-hidden border" style={{ borderColor: isDark ? 'rgb(55 65 81)' : 'rgb(229 231 235)' }}>
                              {post.media[0].type === 'image' ? (
                                <img
                                  src={post.media[0].url}
                                  alt={post.media[0].alt || 'Post image'}
                                  className="w-full max-h-[500px] object-cover"
                                />
                              ) : (
                                <video
                                  src={post.media[0].url}
                                  controls
                                  className="w-full max-h-[500px]"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Who to Follow Section - Horizontal Scroll */}
                {suggestedUsers.length > 0 && (
                  <div className={cn('border-t border-b py-6', isDark ? 'border-gray-800' : 'border-gray-200')}>
                    <div className="px-4">
                      <h2 className={cn("text-xl font-bold mb-4 flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                        <UsersIcon className="w-5 h-5" />
                        Who to Follow
                      </h2>
                      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                        {suggestedUsers.map((user: any) => (
                          <WhoToFollowCard key={user.id} user={user} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Jobs Section */}
                {recentJobs.length > 0 && (
                  <div className={cn('border-t', isDark ? 'border-gray-800' : 'border-gray-200')}>
                    <div className="p-4">
                      <h2 className={cn("text-xl font-bold mb-4 flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                        <Briefcase className="w-5 h-5" />
                        Recent Jobs
                      </h2>
                      <div className="space-y-3">
                        {recentJobs.slice(0, 3).map((job: any) => (
                          <button
                            key={job.id}
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            className={cn(
                              'w-full p-4 rounded-2xl text-left transition-all border group',
                              isDark
                                ? 'bg-gray-900/50 hover:bg-gray-900 border-gray-800 hover:border-gray-700'
                                : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                            )}
                          >
                            <h3 className={cn("font-bold text-base mb-1 group-hover:text-[#BCE953] transition-colors", isDark ? "text-white" : "text-gray-900")}>
                              {job.title}
                            </h3>
                            <p className={cn('text-sm mb-2', isDark ? 'text-gray-400' : 'text-gray-600')}>
                              {job.company}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{job.location}</span>
                              {job.type && (
                                <>
                                  <span>•</span>
                                  <span>{job.type}</span>
                                </>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Events Section */}
                {upcomingEvents.length > 0 && (
                  <div className={cn('border-t', isDark ? 'border-gray-800' : 'border-gray-200')}>
                    <div className="p-4">
                      <h2 className={cn("text-xl font-bold mb-4 flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                        <Calendar className="w-5 h-5" />
                        Upcoming Events
                      </h2>
                      <div className="space-y-3">
                        {upcomingEvents.map((event: any) => (
                          <button
                            key={event.id}
                            onClick={() => navigate(`/event/${event.id}`)}
                            className={cn(
                              'w-full p-4 rounded-2xl text-left transition-all border group',
                              isDark
                                ? 'bg-gray-900/50 hover:bg-gray-900 border-gray-800 hover:border-gray-700'
                                : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                            )}
                          >
                            <h3 className={cn("font-bold text-base mb-1 group-hover:text-[#BCE953] transition-colors", isDark ? "text-white" : "text-gray-900")}>
                              {event.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(event.event_date).toLocaleDateString()}</span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin className="w-4 h-4" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : searchInput && loading ? (
              // Loading State
              <div className="max-w-2xl mx-auto pt-4">
                <SearchResultsListSkeleton />
              </div>
            ) : (
              // Results List
              <div className="max-w-2xl mx-auto w-full pb-20">
                {filteredResults.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 px-4 py-12 text-center">
                    <div className={cn(
                      "w-16 h-16 mb-4 rounded-full flex items-center justify-center",
                      isDark ? "bg-gray-900" : "bg-gray-100"
                    )}>
                      <SearchIcon className={cn("w-8 h-8", isDark ? "text-gray-700" : "text-gray-400")} />
                    </div>
                    <h2 className={cn("text-xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>
                      No results found
                    </h2>
                    <p className={cn('text-sm mb-6', isDark ? 'text-gray-500' : 'text-gray-600')}>
                      We couldn't find anything matching "{searchInput}"
                    </p>
                    <button
                      onClick={() => setSearchInput('')}
                      className={cn(
                        'text-sm px-6 py-2.5 rounded-full font-medium transition-all',
                        isDark
                          ? 'bg-white text-black hover:bg-gray-200'
                          : 'bg-black text-white hover:bg-gray-800'
                      )}
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: isDark ? 'rgb(31 41 55)' : 'rgb(229 231 235)' }}>
                    {filteredResults.map((result) => (
                      <div
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className={cn(
                          "p-4 transition-all cursor-pointer group hover:bg-opacity-50",
                          isDark
                            ? "hover:bg-gray-900"
                            : "hover:bg-gray-50"
                        )}
                      >
                        <div className="flex gap-3">
                          {/* Avatar/Icon */}
                          <div className="flex-shrink-0">
                            {result.avatar ? (
                              <img
                                src={result.avatar}
                                alt={result.title}
                                className={cn(
                                  "object-cover transition-colors",
                                  result.type === 'company' ? "w-12 h-12 rounded-lg" : "w-10 h-10 rounded-full"
                                )}
                              />
                            ) : (
                              <div className={cn(
                                "w-10 h-10 flex items-center justify-center transition-colors",
                                result.type === 'company' ? "rounded-lg" : "rounded-full",
                                isDark ? "bg-gray-900 text-gray-400 group-hover:bg-gray-800" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                              )}>
                                {result.type === 'user' && <UsersIcon className="w-5 h-5" />}
                                {result.type === 'job' && <Briefcase className="w-5 h-5" />}
                                {result.type === 'company' && <Briefcase className="w-5 h-5" />}
                                {result.type === 'hashtag' && <Hash className="w-5 h-5" />}
                                {result.type === 'post' && <AtSign className="w-5 h-5" />}
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <h3 className={cn(
                                  "font-bold text-base truncate",
                                  isDark ? "text-white" : "text-gray-900"
                                )}>
                                  {result.title}
                                </h3>
                                {result.verified && (
                                  <Verified className="w-3.5 h-3.5 text-[#BCE953] fill-current flex-shrink-0" />
                                )}
                                <span className={cn(
                                  "text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-medium ml-1",
                                  isDark ? "bg-gray-900 text-gray-500" : "bg-gray-100 text-gray-500"
                                )}>
                                  {result.type}
                                </span>
                              </div>
                            </div>

                            <p className={cn("text-sm mb-1 truncate", isDark ? "text-gray-500" : "text-gray-600")}>
                              {result.subtitle}
                            </p>

                            {result.description && (
                              <p className={cn(
                                "text-sm line-clamp-2",
                                isDark ? "text-gray-400" : "text-gray-500"
                              )}>
                                {result.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Desktop Only */}
        <div className={cn(
          'search-sidebar hidden mr-4 lg:block w-96 border-l overflow-y-auto',
          isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-100'
        )}>
          <div className="p-4 space-y-6">
            {/* Companies Section - Moved to Top */}
            {employers.length > 0 && (
              <div className={cn(
                'rounded-2xl overflow-hidden border',
                isDark ? 'bg-black border-gray-800' : 'bg-gray-50 border-gray-200'
              )}>
                <div className={cn(
                  'p-4 border-b flex items-center gap-2',
                  isDark ? 'border-gray-800' : 'border-gray-200'
                )}>
                  <Briefcase className="w-5 h-5" />
                  <h2 className="font-serif text-lg">Companies</h2>
                </div>
                <div className={cn(
                  'divide-y',
                  isDark ? 'divide-gray-800' : 'divide-gray-200'
                )}>
                  {employers.map((employer: any) => (
                    <button
                      key={employer.id}
                      onClick={() => navigate(`/profile/${employer.id}`)}
                      className={cn(
                        'w-full flex items-center gap-3 p-4 transition-colors text-left',
                        isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-100'
                      )}
                    >
                      <img
                        src={employer.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${employer.company_name}`}
                        alt={employer.company_name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{employer.company_name}</p>
                        <p className={cn('text-xs truncate', isDark ? 'text-gray-400' : 'text-gray-600')}>
                          {employer.full_name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Users Section */}
            {suggestedUsers.length > 0 && (
              <div className={cn(
                'rounded-2xl overflow-hidden border',
                isDark ? 'bg-black border-gray-800' : 'bg-gray-50 border-gray-200'
              )}>
                <div className={cn(
                  'p-4 border-b flex items-center gap-2',
                  isDark ? 'border-gray-800' : 'border-gray-200'
                )}>
                  <UsersIcon className="w-5 h-5" />
                  <h2 className="font-serif text-lg">Suggested for you</h2>
                </div>
                <div className={cn(
                  'divide-y',
                  isDark ? 'divide-gray-800' : 'divide-gray-200'
                )}>
                  {suggestedUsers.slice(0, 5).map((user: any) => (
                    <button
                      key={user.id}
                      onClick={() => navigate(`/profile/${user.id}`)}
                      className={cn(
                        'w-full flex items-center gap-3 p-4 transition-colors text-left',
                        isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-100'
                      )}
                    >
                      <img
                        src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                        alt={user.full_name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{user.full_name}</p>
                        <p className={cn('text-xs truncate', isDark ? 'text-gray-400' : 'text-gray-600')}>
                          @{user.username}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}