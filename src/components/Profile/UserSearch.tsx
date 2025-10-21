import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  X as XIcon,
  Verified,
  Users,
  Loader
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useDebounce } from '../../hooks/useDebounce';
import { useSearch } from '../../hooks/useOptimizedQuery';
import { cn } from '../../lib/cva';

interface SearchUser {
  id: string;
  full_name: string;
  username: string;
  bio?: string;
  avatar_url?: string;
  verified?: boolean;
}

interface UserSearchProps {
  onClose?: () => void;
  isOpen?: boolean;
  minimalMode?: boolean; // For sidebar search bar
}

export default function UserSearch({ onClose, isOpen = true, minimalMode = false }: UserSearchProps) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchInput, setSearchInput] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedQuery = useDebounce(searchInput, 300);
  const { data: searchResults, isLoading } = useSearch(debouncedQuery);

  // Extract and filter users from search results
  const searchUsers: SearchUser[] = useMemo(() => {
    if (!searchResults?.users) return [];
    return searchResults.users as SearchUser[];
  }, [searchResults?.users]);

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    inputRef.current?.focus();
    setSelectedIndex(-1);
  }, []);

  const handleClose = useCallback(() => {
    setSearchInput('');
    setIsSearchFocused(false);
    setSelectedIndex(-1);
    onClose?.();
  }, [onClose]);

  const handleUserClick = useCallback((user: SearchUser) => {
    navigate(`/profile/${user.id}`);
    handleClose();
  }, [navigate, handleClose]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSearchFocused || searchUsers.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < searchUsers.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleUserClick(searchUsers[selectedIndex]);
          }
          break;
        case 'Escape':
          handleClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFocused, searchUsers, selectedIndex, handleUserClick, handleClose]);

  // Reset selected index when search input changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchInput]);

  // Auto-focus when opened
  useEffect(() => {
    if (isOpen && isSearchFocused) {
      inputRef.current?.focus();
    }
  }, [isOpen, isSearchFocused]);

  const handleFocus = () => {
    setIsSearchFocused(true);
  };

  const handleBlur = () => {
    // Delay blur to allow click on results
    setTimeout(() => {
      setIsSearchFocused(false);
    }, 150);
  };

  // Minimal mode - just the search bar for sidebar
  if (minimalMode) {
    return (
      <div className={cn(
        'relative rounded-full overflow-hidden',
        isDark ? 'bg-black border-gray-700' : 'bg-gray-100 border-gray-300'
      )}>
        <div className={cn(
          'flex items-center gap-3 px-4 py-2 border',
          isDark ? 'border-gray-700' : 'border-gray-300'
        )}>
          <SearchIcon className="w-5 h-5 text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Search users"
            className={cn(
              'flex-1 bg-transparent outline-none text-sm',
              isDark ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-500'
            )}
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              title="Clear search"
              className={cn(
                'p-1 rounded-full transition-colors',
                isDark ? 'text-gray-500 hover:text-white hover:bg-gray-900' : 'text-gray-500 hover:text-black hover:bg-gray-200'
              )}
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search results dropdown for minimal mode */}
        {isSearchFocused && searchInput && (
          <div className={cn(
            'absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-lg z-50 max-h-96 overflow-y-auto',
            isDark ? 'bg-black border border-gray-700' : 'bg-white border border-gray-200'
          )}>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader className="w-5 h-5 animate-spin text-gray-500" />
              </div>
            ) : searchUsers.length === 0 ? (
              <div className="p-4 text-center">
                <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                  No users found
                </p>
              </div>
            ) : (
              <div className={cn('divide-y', isDark ? 'divide-gray-800' : 'divide-gray-100')}>
                {searchUsers.map((user, idx) => (
                  <button
                    key={user.id}
                    onClick={() => handleUserClick(user)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    title={`Go to ${user.full_name}'s profile`}
                    className={cn(
                      'w-full text-left p-3 transition-colors flex items-center gap-3',
                      selectedIndex === idx
                        ? isDark ? 'bg-gray-900' : 'bg-gray-50'
                        : isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-50'
                    )}
                  >
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0',
                        isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-700'
                      )}>
                        {user.full_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn('font-semibold text-sm truncate', isDark ? 'text-white' : 'text-gray-900')}>
                          {user.full_name}
                        </p>
                        {user.verified && (
                          <Verified className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className={cn('text-xs truncate', isDark ? 'text-gray-500' : 'text-gray-600')}>
                        @{user.username}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full search modal/page mode
  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-start justify-center pt-0 md:pt-4',
      isOpen ? 'block' : 'hidden'
    )}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden"
        onClick={handleClose}
      />

      {/* Search container */}
      <div className={cn(
        'relative w-full md:w-full md:max-w-2xl rounded-0 md:rounded-2xl shadow-lg z-10',
        isDark ? 'bg-black' : 'bg-white'
      )}>
        {/* Search Header */}
        <div className={cn(
          'sticky top-0 border-b p-4 md:p-5',
          isDark ? 'border-gray-800 bg-black/80' : 'border-gray-200 bg-white/80',
          'backdrop-blur-sm'
        )}>
          <div className={cn(
            'flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-200',
            isSearchFocused
              ? isDark
                ? 'bg-black border-blue-500'
                : 'bg-white border-blue-500'
              : isDark
                ? 'bg-black border-gray-700'
                : 'bg-gray-100 border-gray-300'
          )}>
            <SearchIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />

            <input
              ref={inputRef}
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Search by name or username"
              className={cn(
                'flex-1 bg-transparent outline-none text-base',
                isDark ? 'text-white placeholder:text-gray-500' : 'text-black placeholder:text-gray-500'
              )}
              autoComplete="off"
            />

            {searchInput && (
              <button
                onClick={handleClearSearch}
                title="Clear search"
                className={cn(
                  'p-2 rounded-full transition-colors flex-shrink-0',
                  isDark
                    ? 'text-gray-500 hover:text-white hover:bg-gray-900'
                    : 'text-gray-500 hover:text-black hover:bg-gray-200'
                )}
              >
                <XIcon className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={handleClose}
              title="Close search"
              className={cn(
                'md:hidden p-2 rounded-full transition-colors flex-shrink-0',
                isDark
                  ? 'text-gray-500 hover:text-white hover:bg-gray-900'
                  : 'text-gray-500 hover:text-black hover:bg-gray-200'
              )}
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-[calc(100vh-200px)] md:max-h-96 overflow-y-auto">
          {!searchInput ? (
            <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center">
              <Users className={cn('w-16 h-16 mb-4 opacity-30', isDark ? 'text-gray-700' : 'text-gray-300')} />
              <h2 className={cn('text-xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900')}>
                Search for users
              </h2>
              <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                Search by name or username to find people on the platform
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="flex flex-col items-center gap-3">
                <Loader className="w-8 h-8 animate-spin text-gray-500" />
                <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                  Searching...
                </p>
              </div>
            </div>
          ) : searchUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center">
              <SearchIcon className={cn('w-16 h-16 mb-4 opacity-30', isDark ? 'text-gray-700' : 'text-gray-300')} />
              <h2 className={cn('text-xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900')}>
                No results for "{searchInput}"
              </h2>
              <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                Try searching with a different name or username
              </p>
            </div>
          ) : (
            <div className={cn('divide-y', isDark ? 'divide-gray-800' : 'divide-gray-100')}>
              {searchUsers.map((user, idx) => (
                <button
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  title={`Go to ${user.full_name}'s profile`}
                  className={cn(
                    'w-full text-left p-4 md:p-3 transition-colors flex items-center gap-3 md:gap-4',
                    selectedIndex === idx
                      ? isDark ? 'bg-gray-900' : 'bg-gray-50'
                      : isDark ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50'
                  )}
                >
                  {/* Avatar */}
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-12 h-12 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className={cn(
                      'w-12 h-12 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0',
                      isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-700'
                    )}>
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={cn('font-semibold text-base md:text-sm truncate', isDark ? 'text-white' : 'text-gray-900')}>
                        {user.full_name}
                      </p>
                      {user.verified && (
                        <Verified className="w-5 h-5 md:w-4 md:h-4 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className={cn('text-sm md:text-xs truncate', isDark ? 'text-gray-500' : 'text-gray-600')}>
                      @{user.username}
                    </p>
                    {user.bio && (
                      <p className={cn('text-sm md:text-xs line-clamp-2 mt-1', isDark ? 'text-gray-400' : 'text-gray-700')}>
                        {user.bio}
                      </p>
                    )}
                  </div>

                  {/* Arrow indicator */}
                  <div className={cn(
                    'text-gray-500 flex-shrink-0',
                    selectedIndex === idx ? (isDark ? 'text-white' : 'text-gray-900') : ''
                  )}>
                    <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
