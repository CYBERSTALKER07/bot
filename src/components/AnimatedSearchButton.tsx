import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
    
interface SearchResult {
  id: string;
  type: 'user' | 'job' | 'post' | 'company' | 'hashtag';
  title: string;
  subtitle?: string;
  avatar?: string;
  verified?: boolean;
  trending?: boolean;
}

interface AnimatedSearchButtonProps {
  className?: string;
  onSearch?: (query: string) => void;
  themeAware?: boolean;
}

export default function AnimatedSearchButton({ 
  className = '', 
  onSearch,
  themeAware = false 
}: AnimatedSearchButtonProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // Debounced search function
  const debouncedSearch = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await performSearch(query);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Perform search across multiple tables
  const performSearch = async (query: string): Promise<SearchResult[]> => {
    const searchTerm = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    try {
      // Search users/profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, verified')
        .or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
        .limit(5);

      if (profiles) {
        profiles.forEach(profile => {
          results.push({
            id: profile.id,
            type: 'user',
            title: profile.full_name || profile.username || 'Unknown User',
            subtitle: `@${profile.username || 'user'}`,
            avatar: profile.avatar_url,
            verified: profile.verified
          });
        });
      }

      // Search posts
      const { data: posts } = await supabase
        .from('posts')
        .select(`
          id, 
          content,
          profiles!posts_user_id_fkey(full_name, username, avatar_url)
        `)
        .ilike('content', `%${searchTerm}%`)
        .limit(5);

      if (posts) {
        posts.forEach(post => {
          const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
          results.push({
            id: post.id,
            type: 'post',
            title: post.content.substring(0, 50) + (post.content.length > 50 ? '...' : ''),
            subtitle: `by @${profile?.username || 'user'}`,
            avatar: profile?.avatar_url
          });
        });
      }

      // Add hashtag suggestions
      if (searchTerm.startsWith('#')) {
        results.push({
          id: `hashtag-${searchTerm}`,
          type: 'hashtag',
          title: searchTerm,
          subtitle: 'Search hashtag',
          trending: true
        });
      }

    } catch (error) {
      console.error('Search error:', error);
    }

    return results;
  };

  // Handle search input changes
  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, debouncedSearch]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Save to recent searches
      const updatedRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updatedRecent);
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));

      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
      
      setShowResults(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'user':
        navigate(`/profile/${result.id}`);
        break;
      case 'post':
        navigate(`/post/${result.id}`);
        break;
      case 'job':
        navigate(`/job/${result.id}`);
        break;
      case 'company':
        navigate(`/company/${result.id}`);
        break;
      case 'hashtag':
        navigate(`/search?q=${encodeURIComponent(result.title)}`);
        break;
      default:
        setSearchQuery(result.title);
        handleSearchSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
    setShowResults(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e as React.FormEvent);
    }
  };

  // Theme-aware colors or original crimson
  const primaryColor = themeAware 
    ? (isDark ? '#84cc16' : '#8B1538')
    : 'crimson';
  
  const backgroundDark = themeAware
    ? (isDark ? '#1f2937' : '#151515')
    : '#151515';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <style>{`
        .container {
          position: relative;
          width: 80px;
          height: 70px;
          margin: auto;
        }

        .search {
          position: absolute;
          margin: auto;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 70px;
          height: 70px;
          background-color: ${primaryColor};
          border-radius: 50%;
          z-index: 4;
          box-shadow: 0 0 25px 0 rgba(0, 0, 0, 0.4);
          transition: 0.5s all;
        }

        .search:hover {
          cursor: pointer;
        }

        .search::before {
          content: " ";
          position: absolute;
          margin: auto;
          top: 22px;
          left: 22px;
          right: 0;
          bottom: 0;
          width: 12px;
          height: 2px;
          background-color: #fff;
          transform: rotate(45deg);
          transition: 0.5s all;
        }

        .search::after {
          content: " ";
          position: absolute;
          margin: auto;
          top: -5px;
          left: -5px;
          right: 0;
          bottom: 0;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          border: 2px solid #fff;
          transition: 0.5s all;
        }

        .search-input {
          position: absolute;
          margin: auto;
          top: 0px;
          left: 0px;
          right: 0;
          bottom: 0;
          width: 50px;
          height: 50px;
          outline: none;
          border: none;
          background-color: ${primaryColor};
          color: #fff;
          text-shadow: 0 0 10px ${primaryColor};
          padding: 0 80px 0 20px;
          border-radius: 30px;
          box-shadow: 0 0 25px 0 ${primaryColor}, 0 20px 25px 0 rgba(0, 0, 0, 0.2);
          opacity: 0;
          z-index: 5;
          letter-spacing: 0.1em;
          transition: 1s all;
          font-size: 16px;
        }

        .search-input:hover {
          cursor: pointer;
        }

        .search-input:focus {
          width: 300px;
          opacity: 1;
          cursor: text;
        }

        .search-input:focus ~ .search {
          right: -250px;
          background-color: ${backgroundDark};
          z-index: 6;
        }

        .search-input:focus ~ .search::before {
          top: 0;
          left: 0;
          width: 25px;
        }

        .search-input:focus ~ .search::after {
          top: 0;
          left: 0;
          width: 25px;
          height: 2px;
          border: none;
          background-color: #fff;
          border-radius: 0;
          transform: rotate(-45deg);
        }

        .search-input::placeholder {
          color: #fff;
        }

        /* Search Results Dropdown */
        .search-results {
          position: absolute;
          top: 60px;
          left: 0;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          max-height: 300px;
          overflow-y: auto;
          z-index: 10;
        }

        .search-results.dark {
          background: #1f2937;
          color: white;
        }

        .search-result-item {
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: background-color 0.2s;
        }

        .search-result-item:hover {
          background-color: #f5f5f5;
        }

        .search-results.dark .search-result-item {
          border-bottom-color: #374151;
        }

        .search-results.dark .search-result-item:hover {
          background-color: #374151;
        }

        .search-result-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #e5e5e5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }

        .search-result-content {
          flex: 1;
          min-width: 0;
        }

        .search-result-title {
          font-weight: 600;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .search-result-subtitle {
          font-size: 12px;
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .search-results.dark .search-result-subtitle {
          color: #9ca3af;
        }

        .loading-spinner {
          padding: 16px;
          text-align: center;
          color: #666;
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .search-input:focus {
            width: 250px;
          }
          
          .search-input:focus ~ .search {
            right: -200px;
          }
        }

        @media (max-width: 480px) {
          .search-input:focus {
            width: 200px;
          }
          
          .search-input:focus ~ .search {
            right: -150px;
          }
        }
      `}</style>

      <div className="container">
        <form onSubmit={handleSearchSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowResults(true)}
            placeholder="Search..."
            className="search-input"
          />
          <div className="search" />
        </form>

        {/* Search Results Dropdown */}
        {showResults && (searchResults.length > 0 || isLoading) && (
          <div className={`search-results ${isDark ? 'dark' : ''}`}>
            {isLoading ? (
              <div className="loading-spinner">
                Searching...
              </div>
            ) : (
              searchResults.map((result) => (
                <div
                  key={`${result.type}-${result.id}`}
                  className="search-result-item"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="search-result-avatar">
                    {result.avatar ? (
                      <img 
                        src={result.avatar} 
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      result.title.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="search-result-content">
                    <div className="search-result-title">
                      {result.title}
                      {result.verified && ' ✓'}
                      {result.trending && ' 🔥'}
                    </div>
                    {result.subtitle && (
                      <div className="search-result-subtitle">
                        {result.subtitle}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Debounce utility function
function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}