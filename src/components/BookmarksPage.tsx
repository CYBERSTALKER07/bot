import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  BookmarkCheck,
  Search,
  Filter,
  Calendar,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Trash2,
  ExternalLink,
  FolderOpen,
  Archive,
  Star,
  Eye,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';
import { Card } from './ui/Card';
import PageLayout from './ui/PageLayout';
import Typography from './ui/Typography';
import Input from './ui/Input';
import Select from './ui/Select';
import Badge from './ui/Badge';
import { cn } from '../lib/cva';
import { useBookmarks } from '../hooks/useOptimizedQuery';
import { PostCardSkeleton } from './ui/Skeleton';

interface SavedItem {
  id: string;
  type: 'job' | 'company' | 'event' | 'resource';
  title: string;
  company?: string;
  location?: string;
  salary?: string;
  description: string;
  savedDate: Date;
  tags: string[];
  url: string;
  image?: string;
  status?: 'active' | 'expired' | 'applied';
}

interface SavedCollection {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  createdDate: Date;
  color: string;
}

export default function BookmarksPage() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'posts'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch real bookmarks
  const { data: bookmarksData, isLoading: loading, error } = useBookmarks(user?.id);

  // Transform to component format
  const items: SavedItem[] = bookmarksData?.map(bookmark => {
    if (bookmark.jobs) {
      return {
        id: bookmark.id,
        type: 'job' as const,
        title: bookmark.jobs.title,
        company: bookmark.jobs.company,
        location: bookmark.jobs.location,
        saved_date: new Date(bookmark.created_at),
        job_type: bookmark.jobs.type,
        salary: bookmark.jobs.salary_range,
      };
    } else if (bookmark.posts) {
      return {
        id: bookmark.id,
        type: 'post' as const,
        title: bookmark.posts.content.substring(0, 100),
        author: bookmark.posts.author?.full_name || 'Unknown',
        saved_date: new Date(bookmark.created_at),
        content: bookmark.posts.content,
        avatar: bookmark.posts.author?.avatar_url,
      };
    }
    return null;
  }).filter(Boolean) || [];

  const collections: SavedCollection[] = [
    {
      id: '1',
      name: 'My Bookmarks',
      description: 'All saved items',
      items_count: items.length,
      created_date: new Date(),
    }
  ];

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const removeSelectedItems = () => {
    setSavedItems(prev => prev.filter(item => !selectedItems.has(item.id)));
    setSelectedItems(new Set());
  };

  const getTypeIcon = (type: SavedItem['type']) => {
    switch (type) {
      case 'job': return <Building2 className="h-4 w-4" />;
      case 'company': return <Building2 className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      case 'resource': return <FolderOpen className="h-4 w-4" />;
      default: return <Bookmark className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: SavedItem['type']) => {
    switch (type) {
      case 'job': return 'bg-info-100 text-info-800';
      case 'company': return 'bg-green-100 text-green-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      case 'resource': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'applied': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === 'all' || item.type === activeTab.slice(0, -1);
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.company?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.author?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  if (loading) {
    return (
      <PageLayout className={cn(
        'min-h-screen transition-colors duration-300 pb-20',
        isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'
      )} maxWidth="4xl">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout className={cn(
        'min-h-screen transition-colors duration-300',
        isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'
      )} maxWidth="4xl">
        <Card className="p-8 text-center">
          <p className="text-red-600 mb-4">Error loading bookmarks</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      className={cn(
        'min-h-screen transition-colors duration-300 pb-20',
        isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'
      )} 
      maxWidth="4xl"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Typography variant="h4" className="font-bold mb-2">
              My Bookmarks
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {items.length} saved items across {collections.length} collections
            </Typography>
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedItems.size > 0 && (
              <Button variant="outlined" size="sm" onClick={removeSelectedItems}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedItems.size})
              </Button>
            )}
            
            <div className="flex rounded-lg border">
              <Button
                variant={viewMode === 'grid' ? 'contained' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'contained' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Collections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {collections.map((collection) => (
            <Card key={collection.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start space-x-3">
                <div className={`w-3 h-3 rounded-full ${collection.color}`} />
                <div className="flex-1">
                  <Typography variant="h6" className="font-medium mb-1">
                    {collection.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className="mb-2">
                    {collection.description}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {collection.itemCount} items
                  </Typography>
                </div>
              </div>
            </Card>
          ))}
          
          <Card className="p-4 border-dashed border-2 hover:border-solid transition-all cursor-pointer">
            <div className="text-center">
              <FolderOpen className={`h-8 w-8 mx-auto mb-2 ${
                isDark ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <Typography variant="body2" color="textSecondary">
                Create Collection
              </Typography>
            </div>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              className="w-full"
            />
          </div>
          
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full"
          >
            <option value="all">All Types</option>
            <option value="job">Jobs</option>
            <option value="company">Companies</option>
            <option value="event">Events</option>
            <option value="resource">Resources</option>
          </Select>
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="applied">Applied</option>
            <option value="expired">Expired</option>
          </Select>
        </div>
      </Card>

      {/* Bookmarks */}
      {filteredItems.length === 0 ? (
        <Card className="p-8 text-center">
          <Bookmark className={`h-12 w-12 mx-auto mb-4 ${
            isDark ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <Typography variant="h6" className="mb-2">
            No bookmarks found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start bookmarking jobs, companies, and events to build your collection'
            }
          </Typography>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className={cn(
                'transition-all duration-200 hover:shadow-md',
                viewMode === 'grid' ? 'p-4' : 'p-6',
                selectedItems.has(item.id) && 'ring-2 ring-info-500'
              )}
            >
              {viewMode === 'grid' ? (
                // Grid View
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="rounded"
                      />
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Link to={item.url} className="block mb-3">
                    <Typography variant="h6" className="font-bold mb-1 hover:underline">
                      {item.title}
                    </Typography>
                    {item.company && (
                      <Typography variant="body2" className="text-info-600 mb-1">
                        {item.company}
                      </Typography>
                    )}
                    <Typography variant="body2" color="textSecondary" className="line-clamp-2">
                      {item.description}
                    </Typography>
                  </Link>

                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      <Badge className={getTypeColor(item.type)}>
                        {getTypeIcon(item.type)}
                        <span className="ml-1">{item.type}</span>
                      </Badge>
                      {item.status && (
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      )}
                    </div>

                    {item.type === 'job' && (
                      <div className="text-xs text-gray-500 space-y-1">
                        {item.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{item.location}</span>
                          </div>
                        )}
                        {item.salary && (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3" />
                            <span>{item.salary}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Saved {item.savedDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // List View
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleItemSelection(item.id)}
                    className="mt-1 rounded"
                  />
                  
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                  )}

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link to={item.url} className="hover:underline">
                          <Typography variant="h6" className="font-bold mb-1">
                            {item.title}
                          </Typography>
                        </Link>
                        {item.company && (
                          <Typography variant="body1" className="text-info-600 mb-1">
                            {item.company}
                          </Typography>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Typography variant="body2" color="textSecondary" className="mb-3">
                      {item.description}
                    </Typography>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getTypeColor(item.type)}>
                          {getTypeIcon(item.type)}
                          <span className="ml-1">{item.type}</span>
                        </Badge>
                        {item.status && (
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        )}
                        {item.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} className="bg-gray-100 text-gray-700 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="text-xs text-gray-500">
                        Saved {item.savedDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}