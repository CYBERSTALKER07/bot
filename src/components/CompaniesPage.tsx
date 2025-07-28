import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Building2,
  Users,
  Briefcase,
  Calendar,
  Clock,
  Star,
  ExternalLink,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  List,
  SlidersHorizontal
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';
import { Card } from './ui/Card';
import PageLayout from './ui/PageLayout';
import { cn } from '../lib/cva';
import { mockCompanies } from '../data/mockData';

interface CompanyListing {
  id: string;
  name: string;
  logo_url?: string;
  cover_image_url?: string;
  industry: string;
  location: string;
  company_size: string;
  description: string;
  rating: number;
  reviews_count: number;
  is_verified: boolean;
  is_hiring: boolean;
  is_following?: boolean;
  featured_benefits: string[];
  employee_count: number;
  founded_year: number;
  growth_rate?: number;
  recent_jobs: Array<{
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    posted_date: string;
    application_count: number;
  }>;
}

export default function CompaniesPage() {
  const { isDark } = useTheme();
  const [companies, setCompanies] = useState<CompanyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'positions' | 'employees'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [followingCompanies, setFollowingCompanies] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      
      // Convert mock data to match interface
      const companiesData: CompanyListing[] = mockCompanies.map(company => ({
        id: company.id,
        name: company.name,
        logo_url: company.logo_url,
        cover_image_url: company.cover_image_url,
        industry: company.industry,
        location: company.location,
        company_size: company.company_size,
        description: company.description,
        rating: company.rating,
        reviews_count: company.reviews_count,
        is_verified: company.is_verified,
        is_hiring: company.is_hiring,
        is_following: company.is_following,
        featured_benefits: company.featured_benefits,
        employee_count: company.employee_count,
        founded_year: company.founded_year,
        growth_rate: company.growth_rate,
        recent_jobs: company.recent_jobs
      }));

      setCompanies(companiesData);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowCompany = async (companyId: string) => {
    const newFollowingState = new Set(followingCompanies);
    if (newFollowingState.has(companyId)) {
      newFollowingState.delete(companyId);
    } else {
      newFollowingState.add(companyId);
    }
    setFollowingCompanies(newFollowingState);

    // In a real app, this would update the database
    try {
      // await supabase.from('company_followers').upsert([...])
    } catch (error) {
      console.error('Error following company:', error);
    }
  };

  const filteredAndSortedCompanies = companies
    .filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustry = !selectedIndustry || company.industry === selectedIndustry;
      const matchesLocation = !selectedLocation || company.location.includes(selectedLocation);
      const matchesSize = !selectedSize || company.company_size === selectedSize;
      
      return matchesSearch && matchesIndustry && matchesLocation && matchesSize;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'positions':
          return b.recent_jobs.length - a.recent_jobs.length;
        case 'employees':
          return b.employee_count - a.employee_count;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const getTotalOpenPositions = (company: CompanyListing) => {
    return company.recent_jobs.reduce((sum, job) => sum + job.application_count, 0);
  };

  const industries = [...new Set(companies.map(c => c.industry))];
  const locations = [...new Set(companies.map(c => c.location.split(',')[1]?.trim() || c.location))];
  const sizes = [...new Set(companies.map(c => c.company_size))];

  // Clear filters function
  const clearFilters = () => {
    setSelectedIndustry('');
    setSelectedLocation('');
    setSelectedSize('');
    setSearchTerm('');
  };

  const hasActiveFilters = selectedIndustry || selectedLocation || selectedSize || searchTerm;

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-black via-black to-purple-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 ${
              isDark ? 'border-lime' : 'border-asu-maroon'
            }`}></div>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Loading companies...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageLayout 
      className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}
      maxWidth="full"
      padding="none"
    >
      {/* Mobile Header */}
      <div className={cn(
        'sticky top-0 z-50 backdrop-blur-xl border-b lg:hidden ios-header-safe',
        isDark ? 'bg-black/95 border-gray-800' : 'bg-white/95 border-gray-200'
      )}>
        <div className="flex items-center justify-between px-4 py-3 ios-nav-spacing">
          <div>
            <h1 className="text-lg sm:text-xl font-bold">Companies</h1>
            <p className={cn(
              'text-xs sm:text-sm',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>
              {filteredAndSortedCompanies.length} companies
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 ios-touch-target relative"
              onClick={() => setShowMobileFilters(true)}
            >
              <SlidersHorizontal className="h-5 w-5" />
              {hasActiveFilters && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 ios-touch-target"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div 
            className={cn(
              'fixed left-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto ios-sidebar-fix ios-safe-area',
              isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200',
              'border-r shadow-xl'
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold">Filters & Search</h2>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 ios-touch-target"
                onClick={() => setShowMobileFilters(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Mobile Search */}
              <div>
                <label className="block text-sm font-medium mb-2">Search Companies</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={cn(
                      'w-full pl-10 pr-4 py-3 rounded-lg border',
                      isDark 
                        ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-black placeholder-gray-500'
                    )}
                  />
                </div>
              </div>

              {/* Mobile Industry Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Industry</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg border ios-touch-target',
                    isDark 
                      ? 'bg-gray-900 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-black'
                  )}
                >
                  <option value="">All Industries</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              
              {/* Mobile Size Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Company Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg border ios-touch-target',
                    isDark 
                      ? 'bg-gray-900 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-black'
                  )}
                >
                  <option value="">All Sizes</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Sort */}
              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg border ios-touch-target',
                    isDark 
                      ? 'bg-gray-900 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-black'
                  )}
                >
                  <option value="name">Company Name</option>
                  <option value="rating">Rating</option>
                  <option value="positions">Open Positions</option>
                  <option value="employees">Company Size</option>
                </select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="outlined"
                  className="w-full ios-touch-target"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Desktop Header */}
        <div className="hidden lg:block px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Companies</h1>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Discover companies that are actively hiring students
            </p>
          </div>

          {/* Desktop Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-black placeholder-gray-500'
                  }`}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className={`px-4 py-3 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-900 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-black'
                }`}
              >
                <option value="">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
              
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className={`px-4 py-3 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-900 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-black'
                }`}
              >
                <option value="">All Sizes</option>
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>

              <Button
                variant="ghost"
                size="sm"
                className="p-3"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Companies Grid/List */}
        <div className="px-4 sm:px-6 pb-8 ios-bottom-safe">
          <div className={cn(
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
              : 'space-y-4'
          )}>
            {filteredAndSortedCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                viewMode={viewMode}
                isDark={isDark}
                isFollowing={followingCompanies.has(company.id)}
                onFollow={() => handleFollowCompany(company.id)}
              />
            ))}
          </div>

          {filteredAndSortedCompanies.length === 0 && (
            <div className="text-center py-12">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isDark ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <Building2 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No companies found</h3>
              <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Try adjusting your search or filters
              </p>
              {hasActiveFilters && (
                <Button variant="outlined" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

// Extracted Company Card Component
const CompanyCard = ({ company, viewMode, isDark, isFollowing, onFollow }: {
  company: CompanyListing;
  viewMode: 'grid' | 'list';
  isDark: boolean;
  isFollowing: boolean;
  onFollow: () => void;
}) => {
  if (viewMode === 'list') {
    return (
      <Card 
        className={cn(
          'p-4 sm:p-6 hover:shadow-lg transition-all duration-200',
          isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-start space-x-4 flex-1 min-w-0">
            <div className={cn(
              'w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center flex-shrink-0',
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            )}>
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg sm:text-xl font-semibold truncate">{company.name}</h3>
                {company.is_verified && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className={cn(
                'text-sm mb-2',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {company.industry}
              </p>
              <p className={cn(
                'text-sm line-clamp-2 mb-3',
                isDark ? 'text-gray-300' : 'text-gray-600'
              )}>
                {company.description}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{company.employee_count.toLocaleString()} employees</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">{company.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current text-yellow-500" />
                  <span>{company.rating}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:items-end space-y-3 flex-shrink-0">
            <div className="text-center sm:text-right">
              <p className="text-lg sm:text-xl font-semibold text-green-600">
                {company.recent_jobs.length}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                open positions
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outlined" 
                size="sm"
                className="ios-touch-target"
                onClick={onFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Link to={`/companies/${company.id}`}>
                <Button size="sm" className="ios-touch-target">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        'p-4 sm:p-6 hover:shadow-lg transition-all duration-200',
        isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
            isDark ? 'bg-gray-800' : 'bg-gray-100'
          )}>
            <Building2 className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-base sm:text-lg font-semibold truncate">{company.name}</h3>
              {company.is_verified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <p className={cn(
              'text-xs sm:text-sm',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>
              {company.industry}
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className="ios-touch-target"
          onClick={onFollow}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
      </div>
      
      <p className={cn(
        'text-xs sm:text-sm mb-4 line-clamp-3',
        isDark ? 'text-gray-300' : 'text-gray-600'
      )}>
        {company.description}
      </p>
      
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-xs sm:text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Users className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>{company.employee_count.toLocaleString()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="truncate">{company.location}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current text-yellow-500" />
          <span>{company.rating}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-sm sm:text-base font-semibold text-green-600">
            {company.recent_jobs.length} open positions
          </p>
        </div>
        <Link to={`/companies/${company.id}`}>
          <Button size="sm" className="ios-touch-target">
            View Profile
          </Button>
        </Link>
      </div>
    </Card>
  );
};