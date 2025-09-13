import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Users, Briefcase, Hash, FileText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';
import { cn } from '../lib/cva';

interface SearchResult {
  id: string;
  type: 'user' | 'job' | 'post' | 'company';
  title: string;
  subtitle?: string;
  description: string;
  avatar?: string;
  verified?: boolean;
  tags?: string[];
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState<'all' | 'users' | 'jobs' | 'posts' | 'companies'>('all');
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<SearchResult[]>([]);
  
  const query = searchParams.get('q') || '';

  const filters = [
    { id: 'all', label: 'All', icon: Hash },
    { id: 'users', label: 'People', icon: Users },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'companies', label: 'Companies', icon: Briefcase }
  ];

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'user',
      title: 'Sarah Johnson',
      subtitle: '@sarahj_dev',
      description: 'Senior Frontend Developer at Google. React, TypeScript, and UI/UX enthusiast.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b278?w=40&h=40&fit=crop&crop=face',
      verified: true,
      tags: ['React', 'TypeScript', 'Frontend']
    },
    {
      id: '2',
      type: 'job',
      title: 'Frontend Developer',
      subtitle: 'Google • Remote',
      description: 'Join our team to build the next generation of web applications using React and TypeScript.',
      tags: ['React', 'TypeScript', 'Remote', '$120k-180k']
    },
    {
      id: '3',
      type: 'post',
      title: 'The Future of React Development',
      subtitle: 'Posted by Alex Chen • 2 hours ago',
      description: 'Exploring the latest React 18 features and how they\'re changing the way we build applications...',
      tags: ['React', 'Development', 'Tutorial']
    },
    {
      id: '4',
      type: 'company',
      title: 'Meta',
      subtitle: 'Technology Company',
      description: 'Building the future of social technology. Join us in connecting the world through innovative platforms.',
      avatar: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=40&h=40&fit=crop',
      verified: true,
      tags: ['Social Media', 'VR/AR', 'AI']
    }
  ];

  useEffect(() => {
    // Simulate search API call
    setLoading(true);
    setTimeout(() => {
      // Filter results based on query and active filter
      let filteredResults = mockResults.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        result.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );

      if (activeFilter !== 'all') {
        filteredResults = filteredResults.filter(result => 
          result.type === activeFilter.slice(0, -1) // Remove 's' from filter name
        );
      }

      setResults(filteredResults);
      setLoading(false);
    }, 800);
  }, [query, activeFilter]);

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'user': return Users;
      case 'job': return Briefcase;
      case 'post': return FileText;
      case 'company': return Briefcase;
      default: return Hash;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'user': return 'text-blue-500';
      case 'job': return 'text-green-500';
      case 'post': return 'text-purple-500';
      case 'company': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={cn(
      'min-h-screen transition-colors duration-300',
      isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'
    )}>
      {/* Page entrance animation */}
      <style jsx>{`
        @keyframes slideInFromRight {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .search-page-container {
          animation: slideInFromRight 0.5s ease-out;
        }

        .search-result {
          animation: fadeInUp 0.3s ease-out;
          animation-fill-mode: both;
        }

        .search-result:nth-child(1) { animation-delay: 0.1s; }
        .search-result:nth-child(2) { animation-delay: 0.2s; }
        .search-result:nth-child(3) { animation-delay: 0.3s; }
        .search-result:nth-child(4) { animation-delay: 0.4s; }
        .search-result:nth-child(5) { animation-delay: 0.5s; }
      `}</style>

      <div className="search-page-container max-w-4xl mx-auto">
        {/* Header */}
        <div className={cn(
          'sticky top-0 z-10 backdrop-blur-md border-b',
          isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
        )}>
          <div className="flex items-center p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex-1">
              <h1 className="text-xl font-bold">Search Results</h1>
              <p className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {loading ? 'Searching...' : `${results.length} results for "${query}"`}
              </p>
            </div>

            <Button variant="ghost" size="sm" className="p-2">
              <Filter className="w-5 h-5" />
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex overflow-x-auto pb-2 px-4">
            {filters.map((filter) => {
              const IconComponent = filter.icon;
              const isActive = activeFilter === filter.id;
              
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as any)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap mr-2 transition-all',
                    isActive
                      ? 'bg-[#BCE953] text-black font-medium'
                      : isDark
                        ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm">{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className={cn(
                'animate-spin rounded-full h-8 w-8 border-b-2',
                isDark ? 'border-white' : 'border-gray-900'
              )}></div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <div className={cn(
                'text-6xl mb-4',
                isDark ? 'text-gray-700' : 'text-gray-300'
              )}>
                🔍
              </div>
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                Try searching with different keywords or check your spelling.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => {
                const IconComponent = getResultIcon(result.type);
                
                return (
                  <div
                    key={result.id}
                    className={cn(
                      'search-result p-4 rounded-xl border cursor-pointer transition-all hover:shadow-lg',
                      isDark
                        ? 'bg-gray-900 border-gray-800 hover:bg-gray-800'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    )}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar/Icon */}
                      <div className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
                        result.avatar
                          ? 'overflow-hidden'
                          : isDark ? 'bg-gray-800' : 'bg-gray-100'
                      )}>
                        {result.avatar ? (
                          <img
                            src={result.avatar}
                            alt={result.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <IconComponent className={cn('w-6 h-6', getResultColor(result.type))} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{result.title}</h3>
                          {result.verified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                          <span className={cn(
                            'text-xs px-2 py-1 rounded-full capitalize',
                            result.type === 'user' && 'bg-blue-100 text-blue-700',
                            result.type === 'job' && 'bg-green-100 text-green-700',
                            result.type === 'post' && 'bg-purple-100 text-purple-700',
                            result.type === 'company' && 'bg-orange-100 text-orange-700'
                          )}>
                            {result.type}
                          </span>
                        </div>
                        
                        {result.subtitle && (
                          <p className={cn(
                            'text-sm mb-2',
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          )}>
                            {result.subtitle}
                          </p>
                        )}
                        
                        <p className={cn(
                          'text-sm mb-3 line-clamp-2',
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        )}>
                          {result.description}
                        </p>
                        
                        {/* Tags */}
                        {result.tags && (
                          <div className="flex flex-wrap gap-2">
                            {result.tags.map((tag, i) => (
                              <span
                                key={i}
                                className={cn(
                                  'text-xs px-2 py-1 rounded-full',
                                  isDark
                                    ? 'bg-gray-800 text-gray-300'
                                    : 'bg-gray-100 text-gray-600'
                                )}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}