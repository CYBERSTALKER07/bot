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
  Clock
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/cva';
import { useSearch, useMostFollowedUsers, useFollowUser, useUnfollowUser, useMostLikedPosts, useMatchedJobs } from '../hooks/useOptimizedQuery';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../context/AuthContext';
import WhoToFollowItem from './WhoToFollowItem';
import { SearchResultsListSkeleton, SearchPageSidebarSkeleton } from './ui/Skeleton';
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

  // Parse search input to detect @ symbol
  const isUsernameSearch = searchInput.startsWith('@');
  const cleanSearchQuery = searchInput.startsWith('@') ? searchInput.slice(1) : searchInput;

  const debouncedQuery = useDebounce(cleanSearchQuery, 300);
  const { data: searchResults, isLoading: loading } = useSearch(debouncedQuery);

  // Fetch most followed users for sidebar
  const { data: mostFollowedUsers = [], isLoading: isLoadingMostFollowed } = useMostFollowedUsers(5);
  const followUserMutation = useFollowUser();
  const unfollowUserMutation = useUnfollowUser();

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

  const handleClearSearch = () => {
    setSearchInput('');
    inputRef.current?.focus();
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(`/profile/${result.id}`);
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
            'sticky top-0 z-49 border-b backdrop-blur-xl transition-colors',
            isDark ? 'bg-black/95 border-gray-800' : 'bg-white/95 border-gray-100'
          )}>
            <div className="max-w-2xl mx-auto w-full px-4 py-3">
              {/* Search Bar Container */}
              <div className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200',
                isSearchFocused
                  ? isDark
                    ? 'bg-black border-2 border-white'
                    : 'bg-gray-50 border-2 border-white'
                  : isDark
                    ? 'bg-black border border-gray-700'
                    : 'bg-gray-100 border border-gray-300'
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
                    ? 'text-white'
                    : isDark ? 'text-gray-600' : 'text-gray-500'
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
                    'flex-1 bg-transparent outline-none text-base search-input',
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
                        ? 'text-gray-500 hover:text-info-400 hover:bg-info-500/10'
                        : 'text-gray-500 hover:text-info-600 hover:bg-info-500/10'
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
                        : 'text-gray-500 hover:text-black hover:bg-gray-200'
                    )}
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Search Mode Indicator */}
              {searchInput && (
                <div className={cn(
                  'mt-2 px-4 text-xs font-medium flex items-center gap-2',
                  isUsernameSearch
                    ? isDark ? 'text-info-400' : 'text-info-600'
                    : isDark ? 'text-gray-500' : 'text-gray-600'
                )}>
                  {isUsernameSearch ? (
                    <>
                      <AtSign className="w-4 h-4" />
                      <span>Searching by username</span>
                    </>
                  ) : (
                    <span>Searching by name</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto w-full pb-20 lg:pb-0">
            {!searchInput && !isSearchFocused ? (
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
                  <div className="space-y-0">
                    {trendingPosts.map((post: any) => (
                      <div
                        key={post.id}
                        className={cn(
                          'p-4 border-b transition-colors',
                          isDark ? 'border-gray-800 hover:bg-gray-900/50' : 'border-gray-200 hover:bg-gray-50'
                        )}
                      >
                        {/* Post Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <img
                            src={post.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username}`}
                            alt={post.author?.name}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-base truncate">{post.author?.name}</p>
                              {post.author?.verified && (
                                <svg className="w-4 h-4 text-info-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                              )}
                            </div>
                            <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                              @{post.author?.username} • {new Date(post.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="mb-3">
                          <p className={cn('text-base whitespace-pre-wrap', isDark ? 'text-white' : 'text-black')}>
                            {post.content}
                          </p>
                        </div>

                        {/* Post Media */}
                        {post.media && post.media.length > 0 && (
                          <div className="mb-3 rounded-xl overflow-hidden">
                            {post.media[0].type === 'image' ? (
                              <img
                                src={post.media[0].url}
                                alt={post.media[0].alt || 'Post image'}
                                className="w-full max-h-96 object-cover"
                              />
                            ) : (
                              <video
                                src={post.media[0].url}
                                controls
                                className="w-full max-h-96"
                              />
                            )}
                          </div>
                        )}

                        {/* Engagement Stats (no interactions) */}

                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Who to Follow Section - Horizontal Scroll */}
                {suggestedUsers.length > 0 && (
                  <div className={cn('border-t border-b py-6', isDark ? 'border-gray-800' : 'border-gray-200')}>
                    <div className="px-4">
                      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <UsersIcon className="w-5 h-5" />
                        Who to Follow
                      </h2>
                      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                        {suggestedUsers.map((user: any) => (
                          <button
                            key={user.id}
                            onClick={() => navigate(`/profile/${user.id}`)}
                            className={cn(
                              'flex-shrink-0 w-48 p-4 rounded-2xl text-center transition-all border',
                              isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-800' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                            )}
                          >
                            <img
                              src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                              alt={user.full_name}
                              className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                            />
                            <div className="mb-2">
                              <p className="font-bold text-sm truncate">{user.full_name}</p>
                              <p className={cn('text-xs truncate', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                @{user.username}
                              </p>
                            </div>
                            {user.bio && (
                              <p className={cn('text-xs line-clamp-2 mb-3', isDark ? 'text-gray-500' : 'text-gray-600')}>
                                {user.bio}
                              </p>
                            )}
                            <div className={cn(
                              'text-xs px-3 py-1.5 rounded-full font-medium',
                              isDark ? 'bg-white text-black' : 'bg-black text-white'
                            )}>
                              Follow
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Jobs Section */}
                {recentJobs.length > 0 && (
                  <div className={cn('border-t', isDark ? 'border-gray-800' : 'border-gray-200')}>
                    <div className="p-4">
                      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        Recent Jobs
                      </h2>
                      <div className="space-y-3">
                        {recentJobs.slice(0, 3).map((job: any) => (
                          <button
                            key={job.id}
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            className={cn(
                              'w-full p-4 rounded-xl text-left transition-all border',
                              isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-800' : 'bg-white hover:bg-gray-50 border-gray-200'
                            )}
                          >
                            <h3 className="font-bold text-base mb-2">{job.title}</h3>
                            <p className={cn('text-sm mb-2', isDark ? 'text-gray-400' : 'text-gray-600')}>
                              {job.company}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
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
                      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Upcoming Events
                      </h2>
                      <div className="space-y-3">
                        {upcomingEvents.map((event: any) => (
                          <button
                            key={event.id}
                            onClick={() => navigate(`/events/${event.id}`)}
                            className={cn(
                              'w-full p-4 rounded-xl text-left transition-all border',
                              isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-800' : 'bg-white hover:bg-gray-50 border-gray-200'
                            )}
                          >
                            <h3 className="font-bold text-base mb-2">{event.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(event.event_date).toLocaleDateString()}</span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
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
              <div className="max-w-2xl mx-auto">
                <SearchResultsListSkeleton />
              </div>
            ) : (
              // Results List
              <div className="max-w-2xl mx-auto w-full">
                {allResults.length === 0 && searchInput ? (
                  <div className="flex flex-col items-center justify-center h-64 px-4 py-12 text-center">
                    <SearchIcon className="w-16 h-16 text-gray-500 mb-4 opacity-50" />
                    <h2 className="text-xl font-bold mb-2">
                      No results for "{searchInput}"
                    </h2>
                    <p className={cn('text-sm mb-4', isDark ? 'text-gray-500' : 'text-gray-600')}>
                      {isUsernameSearch
                        ? 'Try searching for a different username'
                        : 'Try searching for a different name'}
                    </p>

                    {isUsernameSearch && (
                      <button
                        onClick={() => setSearchInput('')}
                        className={cn(
                          'text-sm px-4 py-2 rounded-full transition-colors',
                          isDark
                            ? 'bg-black hover:bg-gray-700 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-black'
                        )}
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={cn(
                    'divide-y',
                    isDark ? 'divide-gray-800' : 'divide-gray-200'
                  )}>
                    {allResults.map((result: SearchResult) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className={cn(
                          'search-result w-full text-left p-4 transition-colors',
                          isDark ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50'
                        )}
                      >
                        <div className="flex gap-4">
                          {/* Avatar */}
                          {result.avatar ? (
                            <img
                              src={result.avatar}
                              alt={result.title}
                              className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className={cn(
                              'w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold',
                              isDark ? 'bg-black' : 'bg-gray-200',
                              result.type === 'hashtag' && (isDark ? 'text-info-400' : 'text-info-600')
                            )}>
                              {result.type === 'hashtag' ? (
                                <Hash className="w-6 h-6" />
                              ) : (
                                result.title.charAt(0).toUpperCase()
                              )}
                            </div>
                          )}

                          {/* Content */}
                          <div className="flex-1 min-w-0 py-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-base truncate">{result.title}</h3>
                              {result.verified && (
                                <svg className="w-4 h-4 text-info-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                              )}
                            </div>

                            <p className={cn(
                              'text-sm truncate mb-1.5 font-medium',
                              isUsernameSearch
                                ? isDark ? 'text-info-400' : 'text-info-600'
                                : isDark ? 'text-gray-500' : 'text-gray-600'
                            )}>
                              {result.subtitle}
                            </p>

                            {result.description && (
                              <p className={cn(
                                'text-sm line-clamp-2',
                                isDark ? 'text-gray-400' : 'text-gray-700'
                              )}>
                                {result.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Desktop Only */}
        <div className={cn(
          'search-sidebar hidden lg:block w-80 border-l overflow-y-auto',
          isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-100'
        )}>
          <div className="p-4 space-y-6">
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

            {/* Companies Section */}
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
          </div>
        </div>
      </div>
    </div>
  );
}