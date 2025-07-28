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
  SlidersHorizontal,
  Heart,
  Share2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';
import { Card } from './ui/Card';
import PageLayout from './ui/PageLayout';
import Input from './ui/Input';
import Select from './ui/Select';
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
    <div className={cn(
      'min-h-screen w-full',
      isDark ? 'bg-black text-white' : 'bg-white text-black'
    )}>
      {/* Mobile Header - Sticky */}
      <div className={cn(
        'sticky top-0 z-50 backdrop-blur-xl border-b lg:hidden',
        isDark ? 'bg-black/95 border-gray-800' : 'bg-white/95 border-gray-200'
      )}>
        <div className="flex items-center justify-between px-4 py-3 safe-area-inset-top">
          <div>
            <h1 className="text-lg font-bold">Companies</h1>
            <p className={cn(
              'text-sm',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>
              {filteredAndSortedCompanies.length} companies
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-3 min-h-[44px] min-w-[44px] relative"
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
              className="p-3 min-h-[44px] min-w-[44px]"
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
          <div className={cn(
            'fixed bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-xl',
            isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200',
            'border-t safe-area-inset-bottom'
          )}>
            {/* Mobile Filter Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold">Filters & Search</h2>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 min-h-[44px] min-w-[44px]"
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
                  <Input
                    type="text"
                    placeholder="Company name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 min-h-[48px]"
                  />
                </div>
              </div>

              {/* Mobile Location */}
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-10 min-h-[48px]"
                  >
                    <option value="">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Mobile Filters Grid */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Industry</label>
                  <Select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="w-full min-h-[48px]"
                  >
                    <option value="">All Industries</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Company Size</label>
                  <Select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full min-h-[48px]"
                  >
                    <option value="">All Sizes</option>
                    {sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sort By</label>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'rating' | 'positions' | 'employees')}
                    className="w-full min-h-[48px]"
                  >
                    <option value="name">Company Name</option>
                    <option value="rating">Highest Rating</option>
                    <option value="positions">Most Positions</option>
                    <option value="employees">Company Size</option>
                  </Select>
                </div>
              </div>

              {/* Apply/Clear Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outlined"
                  className="flex-1 min-h-[48px]"
                  onClick={clearFilters}
                >
                  Clear All
                </Button>
                <Button
                  variant="filled"
                  className="flex-1 min-h-[48px]"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 py-8">
        {/* Desktop Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore Companies</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover {companies.length} amazing companies to work for
          </p>
        </div>

        {/* Desktop Search and Filters */}
        <Card className="p-6 mb-8">
          {/* Main search section */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
            </div>
            
            <Select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </Select>
            
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'rating' | 'positions' | 'employees')}
              className="w-full"
            >
              <option value="name">Company Name</option>
              <option value="rating">Highest Rating</option>
              <option value="positions">Most Positions</option>
              <option value="employees">Company Size</option>
            </Select>
          </div>

          {/* Desktop filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Button
              variant="text"
              size="small"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Advanced Filters</span>
              <ChevronDown className={cn(
                'h-4 w-4 transition-transform duration-200',
                showFilters ? 'rotate-180' : ''
              )} />
            </Button>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredAndSortedCompanies.length} of {companies.length} companies
            </div>
          </div>

          {/* Advanced filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full"
              >
                <option value="">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </Select>
              
              <Select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full"
              >
                <option value="">All Sizes</option>
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </Select>
              
              <div className="flex gap-2">
                <Button variant="outlined" size="small" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Company Listings */}
      <div className={cn(
        'px-4 pb-8 lg:max-w-7xl lg:mx-auto lg:px-6',
        'safe-area-inset-bottom'
      )}>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedCompanies.map((company) => (
              <CompanyCardGrid key={company.id} company={company} isDark={isDark} followingCompanies={followingCompanies} handleFollowCompany={handleFollowCompany} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedCompanies.map((company) => (
              <CompanyCardList key={company.id} company={company} isDark={isDark} followingCompanies={followingCompanies} handleFollowCompany={handleFollowCompany} />
            ))}
          </div>
        )}

        {filteredAndSortedCompanies.length === 0 && (
          <Card className="p-8 text-center">
            <Building2 className={cn(
              'h-12 w-12 mx-auto mb-4',
              isDark ? 'text-gray-600' : 'text-gray-400'
            )} />
            <h3 className="text-lg font-semibold mb-2">No companies found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or filters
            </p>
          </Card>
        )}

        {/* Load More */}
        {filteredAndSortedCompanies.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outlined" size="large" className="w-full sm:w-auto min-h-[48px]">
              Load More Companies
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Company Card Components
const CompanyCardList = ({ company, isDark, followingCompanies, handleFollowCompany }: {
  company: CompanyListing;
  isDark: boolean;
  followingCompanies: Set<string>;
  handleFollowCompany: (id: string) => void;
}) => {
  return (
    <Card className="p-4 transition-all duration-200 hover:shadow-lg">
      {/* Cover Image */}
      {company.cover_image_url && (
        <div className="relative w-full h-32 sm:h-40 mb-4 -mt-4 -mx-4 overflow-hidden rounded-t-lg">
          <img 
            src={company.cover_image_url} 
            alt={`${company.name} cover`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Company Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {company.logo_url && (
            <img 
              src={company.logo_url} 
              alt={company.name} 
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
          )}
          
          <div className="flex-1 min-w-0">
            <Link to={`/company/${company.id}`} className="hover:underline block">
              <h3 className="font-bold text-lg mb-1 line-clamp-2 flex items-center">
                {company.name}
                {company.is_verified && (
                  <span className="ml-2 text-blue-500">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 0L12.09 6.26L20 4.27L14.64 9.63L18.18 15.64L10 12.73L1.82 15.64L5.36 9.63L0 4.27L7.91 6.26L10 0Z"/>
                    </svg>
                  </span>
                )}
                {company.is_hiring && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded">
                    Hiring
                  </span>
                )}
              </h3>
            </Link>
            <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
              {company.industry}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFollowCompany(company.id)}
            className={cn(
              'p-2 min-h-[44px] min-w-[44px]',
              followingCompanies.has(company.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            )}
          >
            <Heart className={cn(
              'h-5 w-5',
              followingCompanies.has(company.id) ? 'fill-current' : ''
            )} />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 min-h-[44px] min-w-[44px] text-gray-500 hover:text-blue-500">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Company Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{company.location}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{company.company_size}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 flex-shrink-0 text-yellow-500" />
          <span>{company.rating.toFixed(1)} ({company.reviews_count} reviews)</span>
        </div>
        <div className="flex items-center space-x-1">
          <Briefcase className="h-4 w-4 flex-shrink-0" />
          <span>{company.recent_jobs.length} open positions</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {company.description}
      </p>

      {/* Benefits */}
      <div className="flex flex-wrap gap-2 mb-4">
        {company.featured_benefits.slice(0, window.innerWidth < 768 ? 2 : 3).map((benefit, index) => (
          <span key={index} className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded">
            {benefit}
          </span>
        ))}
        {company.featured_benefits.length > (window.innerWidth < 768 ? 2 : 3) && (
          <span className="bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-xs px-2 py-1 rounded">
            +{company.featured_benefits.length - (window.innerWidth < 768 ? 2 : 3)} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pt-4 border-t border-gray-200 dark:border-gray-700 gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Founded {company.founded_year} • {company.employee_count.toLocaleString()} employees
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Link to={`/company/${company.id}`} className="flex-1 sm:flex-none">
            <Button variant="outlined" size="sm" className="w-full sm:w-auto min-h-[44px]">
              View Company
            </Button>
          </Link>
          <Button variant="filled" size="sm" className="w-full sm:w-auto min-h-[44px]">
            View Jobs ({company.recent_jobs.length})
          </Button>
        </div>
      </div>
    </Card>
  );
};

const CompanyCardGrid = ({ company, isDark, followingCompanies, handleFollowCompany }: {
  company: CompanyListing;
  isDark: boolean;
  followingCompanies: Set<string>;
  handleFollowCompany: (id: string) => void;
}) => {
  return (
    <Card className="transition-all duration-200 hover:shadow-lg h-full flex flex-col overflow-hidden">
      {/* Cover Image */}
      {company.cover_image_url && (
        <div className="relative w-full h-32 overflow-hidden">
          <img 
            src={company.cover_image_url} 
            alt={`${company.name} cover`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {company.logo_url && (
              <img 
                src={company.logo_url} 
                alt={company.name} 
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base mb-1 line-clamp-2 flex items-center">
                {company.name}
                {company.is_verified && (
                  <span className="ml-2 text-blue-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 0L12.09 6.26L20 4.27L14.64 9.63L18.18 15.64L10 12.73L1.82 15.64L5.36 9.63L0 4.27L7.91 6.26L10 0Z"/>
                    </svg>
                  </span>
                )}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                {company.industry}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFollowCompany(company.id)}
            className={cn(
              'p-2 min-h-[44px] min-w-[44px] flex-shrink-0',
              followingCompanies.has(company.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            )}
          >
            <Heart className={cn(
              'h-4 w-4',
              followingCompanies.has(company.id) ? 'fill-current' : ''
            )} />
          </Button>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-3 flex-1">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{company.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{company.company_size}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 flex-shrink-0 text-yellow-500" />
            <span>{company.rating.toFixed(1)} ({company.reviews_count})</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {company.is_hiring && (
            <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded text-xs font-medium">
              Hiring
            </span>
          )}
          <span className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded text-xs font-medium">
            {company.recent_jobs.length} jobs
          </span>
        </div>

        {/* Footer */}
        <div className="space-y-2 mt-auto">
          <Link to={`/company/${company.id}`}>
            <Button variant="outlined" size="sm" className="w-full min-h-[44px]">
              View Company
            </Button>
          </Link>
          <Button variant="filled" size="sm" className="w-full min-h-[44px]">
            View Jobs ({company.recent_jobs.length})
          </Button>
        </div>
      </div>
    </Card>
  );
};