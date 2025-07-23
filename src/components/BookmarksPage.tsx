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
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [collections, setCollections] = useState<SavedCollection[]>([]);
  const [filteredItems, setFilteredItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data
  useEffect(() => {
    const mockItems: SavedItem[] = [
      {
        id: '1',
        type: 'job',
        title: 'Senior Frontend Developer',
        company: 'Tech Innovators',
        location: 'Auckland, NZ',
        salary: '$85,000 - $110,000',
        description: 'Build cutting-edge web applications with React and TypeScript...',
        savedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        tags: ['React', 'TypeScript', 'Remote'],
        url: '/job/1',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=80&h=80&fit=crop'
      },
      {
        id: '2',
        type: 'company',
        title: 'Microsoft New Zealand',
        description: 'Leading technology company with opportunities in software development...',
        savedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        tags: ['Technology', 'Software', 'Global'],
        url: '/company/2',
        image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=80&h=80&fit=crop'
      },
      {
        id: '3',
        type: 'event',
        title: 'Auckland Tech Career Fair 2025',
        description: 'Meet top employers and explore career opportunities in tech...',
        savedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        tags: ['Networking', 'Career Fair', 'Technology'],
        url: '/event/3'
      }
    ];

    const mockCollections: SavedCollection[] = [
      {
        id: '1',
        name: 'Dream Jobs',
        description: 'Jobs I really want to apply for',
        itemCount: 5,
        createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        color: 'bg-blue-500'
      },
      {
        id: '2',
        name: 'Tech Companies',
        description: 'Interesting tech companies to follow',
        itemCount: 3,
        createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        color: 'bg-green-500'
      }
    ];

    setSavedItems(mockItems);
    setCollections(mockCollections);
    setFilteredItems(mockItems);
    setLoading(false);
  }, []);

  // Filter items
  useEffect(() => {
    let filtered = savedItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.company && item.company.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });

    setFilteredItems(filtered);
  }, [savedItems, searchTerm, typeFilter, statusFilter]);

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
      case 'job': return 'bg-blue-100 text-blue-800';
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

  if (loading) {
    return (
      <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'}>
        <div className="flex justify-center items-center h-64">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
            isDark ? 'border-white' : 'border-black'
          }`}></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'} maxWidth="7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Typography variant="h4" className="font-bold mb-2">
              My Bookmarks
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {savedItems.length} saved items across {collections.length} collections
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
                selectedItems.has(item.id) && 'ring-2 ring-blue-500'
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
                      <Typography variant="body2" className="text-blue-600 mb-1">
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
                          <Typography variant="body1" className="text-blue-600 mb-1">
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