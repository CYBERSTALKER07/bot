import { useState, useRef, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search as SearchIcon,
  X as XIcon,
  ArrowLeft,
  AtSign,
  Users as UsersIcon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/cva';
import { useSearch, useMostFollowedUsers, useFollowUser, useUnfollowUser, useFollowStatus } from '../hooks/useOptimizedQuery';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import WhoToFollowItem from './WhoToFollowItem';
import { SearchResultsListSkeleton, SearchPageSidebarSkeleton } from './ui/Skeleton';

interface SearchResult {
  id: string;
  type: 'user' | 'job' | 'post' | 'company';
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
  const [hoveredFollowId, setHoveredFollowId] = useState<string | null>(null);
  const [processingFollowId, setProcessingFollowId] = useState<string | null>(null);
  
  // Parse search input to detect @ symbol
  const isUsernameSearch = searchInput.startsWith('@');
  const cleanSearchQuery = searchInput.startsWith('@') ? searchInput.slice(1) : searchInput;
  
  const debouncedQuery = useDebounce(cleanSearchQuery, 300);
  const { data: searchResults, isLoading: loading } = useSearch(debouncedQuery);
  
  // Fetch most followed users for sidebar
  const { data: mostFollowedUsers = [] } = useMostFollowedUsers(5);
  const followUserMutation = useFollowUser();
  const unfollowUserMutation = useUnfollowUser();

  // Filter and sort results based on search type
  const userResults: SearchResult[] = useMemo(() => {
    const typedResults = searchResults as SearchResultData | undefined;
    if (!typedResults) return [];
    
    const users: SearchResult[] = [];

    (typedResults.users || []).forEach((user) => {
      users.push({
        id: user.id,
        type: 'user',
        title: user.full_name,
        subtitle: `@${user.username}`,
        description: user.bio || '',
        avatar: user.avatar_url,
        verified: user.verified || false,
      });
    });

    // If searching by username (@), prioritize exact username matches
    if (isUsernameSearch && cleanSearchQuery) {
      users.sort((a, b) => {
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
    }

    return users;
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

  const handleFollow = async (userId: string) => {
    if (!user?.id) return;
    
    setProcessingFollowId(userId);
    try {
      await followUserMutation.mutateAsync({ 
        followerId: user.id, 
        followingId: userId 
      });
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setProcessingFollowId(null);
    }
  };

  const handleUnfollow = async (userId: string) => {
    if (!user?.id) return;
    
    setProcessingFollowId(userId);
    try {
      await unfollowUserMutation.mutateAsync({ 
        followerId: user.id, 
        followingId: userId 
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setProcessingFollowId(null);
    }
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
                        ? 'text-gray-500 hover:text-blue-400 hover:bg-blue-500/10'
                        : 'text-gray-500 hover:text-blue-600 hover:bg-blue-500/10'
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
                    ? isDark ? 'text-blue-400' : 'text-blue-600'
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
          <div className="flex-1 overflow-y-auto w-full">
            {!searchInput && !isSearchFocused ? (
              // Empty State
              <div className="flex flex-col items-center justify-center h-full px-4 py-12 text-center max-w-2xl mx-auto">
                <div className="mb-6">
                  <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                </div>
                <h1 className="text-3xl font-serif mb-2">Search</h1>
              
                
                {/* Search Tips */}
          
              </div>
            ) : searchInput && loading ? (
              // Loading State
              <div className="max-w-2xl mx-auto">
                <SearchResultsListSkeleton />
              </div>
            ) : (
              // Results List
              <div className="max-w-2xl mx-auto w-full">
                {userResults.length === 0 && searchInput ? (
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
                    {userResults.map((result) => (
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
                              isDark ? 'bg-black' : 'bg-gray-200'
                            )}>
                              {result.title.charAt(0).toUpperCase()}
                            </div>
                          )}

                          {/* Content */}
                          <div className="flex-1 min-w-0 py-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-base truncate">{result.title}</h3>
                              {result.verified && (
                                <svg className="w-4 h-4 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                              )}
                            </div>
                            
                            <p className={cn(
                              'text-sm truncate mb-1.5 font-medium',
                              isUsernameSearch
                                ? isDark ? 'text-blue-400' : 'text-blue-600'
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
          <div className="p-4 sticky top-0">
            {/* Most Followed Users Box */}
            <div className={cn(
              'rounded-2xl overflow-hidden border',
              isDark ? 'bg-black border-gray-800' : 'bg-gray-50 border-gray-200'
            )}>
              <div className={cn(
                'p-4 border-b flex items-center gap-2',
                isDark ? 'border-gray-800' : 'border-gray-200'
              )}>
                <UsersIcon className="w-5 h-5" />
                <h2 className="font-serif text-lg">Most Followed</h2>
              </div>
              
              <div className={cn(
                'divide-y',
                isDark ? 'divide-gray-800' : 'divide-gray-200'
              )}>
                {mostFollowedUsers && mostFollowedUsers.length > 0 ? (
                  mostFollowedUsers.map((user) => (
                    <WhoToFollowItem
                      key={user.id}
                      user={{
                        id: user.id,
                        full_name: user.full_name,
                        username: user.username,
                        avatar_url: user.avatar_url,
                        verified: user.verified,
                        bio: `${user.followerCount || 0} followers`
                      }}
                      onNavigate={() => {}}
                    />
                  ))
                ) : (
                  <SearchPageSidebarSkeleton />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}