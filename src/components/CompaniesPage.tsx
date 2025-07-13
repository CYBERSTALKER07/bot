import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search,
  FilterList,
  LocationOn,
  People,
  Star,
  Verified,
  Business,
  TrendingUp,
  Work,
  Favorite,
  FavoriteBorder,
  ArrowForward,
  ViewModule,
  ViewList,
  Sort
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Typography from './ui/Typography';
import Button from './ui/Button';
import { Card } from './ui/Card';
import Avatar from './ui/Avatar';
import Badge from './ui/Badge';
import Input from './ui/Input';
import Select from './ui/Select';
import { mockCompanies, mockIndustries, mockLocations, mockCompanySizes } from '../data/mockData';

interface CompanyListing {
  id: string;
  name: string;
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
  const { user } = useAuth();
  const [companies, setCompanies] = useState<CompanyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [followingCompanies, setFollowingCompanies] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCompanies(mockCompanies);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowCompany = (companyId: string) => {
    setFollowingCompanies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(companyId)) {
        newSet.delete(companyId);
      } else {
        newSet.add(companyId);
      }
      return newSet;
    });
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
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'positions':
          return b.recent_jobs.length - a.recent_jobs.length;
        case 'size':
          return b.employee_count - a.employee_count;
        default:
          return 0;
      }
    });

  const getTotalOpenPositions = (company: CompanyListing) => {
    return company.recent_jobs.length;
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-black via-black to-purple-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 ${
              isDark ? 'border-lime' : 'border-asu-maroon'
            }`}></div>
            <Typography variant="body1" color="textSecondary">
              Loading companies...
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-black via-black to-purple-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Typography variant="h4" className="font-bold mb-2">
            Discover Amazing Companies
          </Typography>
          <Typography variant="body1" color="textSecondary" className="mb-6">
            Explore top employers and find your perfect workplace match
          </Typography>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 text-center" elevation={1}>
              <div className={`text-2xl font-bold ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>
                {companies.length}
              </div>
              <Typography variant="body2" color="textSecondary">Companies</Typography>
            </Card>
            <Card className="p-4 text-center" elevation={1}>
              <div className={`text-2xl font-bold ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>
                {companies.reduce((sum, c) => sum + c.recent_jobs.length, 0)}
              </div>
              <Typography variant="body2" color="textSecondary">Open Positions</Typography>
            </Card>
            <Card className="p-4 text-center" elevation={1}>
              <div className={`text-2xl font-bold ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>
                {Math.round(companies.reduce((sum, c) => sum + c.rating, 0) / companies.length * 10) / 10}
              </div>
              <Typography variant="body2" color="textSecondary">Avg Rating</Typography>
            </Card>
            <Card className="p-4 text-center" elevation={1}>
              <div className={`text-2xl font-bold ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>
                {companies.filter(c => c.is_hiring).length}
              </div>
              <Typography variant="body2" color="textSecondary">Actively Hiring</Typography>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="p-6 mb-6" elevation={1}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="lg:col-span-2">
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startIcon={<Search />}
                  fullWidth
                />
              </div>
              <Select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                options={[
                  { value: '', label: 'All Industries' },
                  ...mockIndustries.map(industry => ({ value: industry, label: industry }))
                ]}
                placeholder="Industry"
              />
              <Select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                options={[
                  { value: '', label: 'All Locations' },
                  ...mockLocations.map(location => ({ value: location, label: location }))
                ]}
                placeholder="Location"
              />
              <Select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                options={[
                  { value: '', label: 'All Sizes' },
                  ...mockCompanySizes.map(size => ({ value: size, label: size }))
                ]}
                placeholder="Company Size"
              />
            </div>
          </Card>

          {/* View Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setViewMode('grid')}
                  startIcon={<ViewModule />}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setViewMode('list')}
                  startIcon={<ViewList />}
                >
                  List
                </Button>
              </div>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: 'name', label: 'Name' },
                  { value: 'rating', label: 'Rating' },
                  { value: 'positions', label: 'Open Positions' },
                  { value: 'size', label: 'Company Size' }
                ]}
                size="small"
                startIcon={<Sort />}
              />
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Sort className="h-4 w-4 text-gray-400" />
              <Typography variant="body2" color="textSecondary">
                Sorted by {sortBy === 'name' ? 'Name' : sortBy === 'rating' ? 'Rating' : 
                          sortBy === 'positions' ? 'Open Positions' : 'Company Size'}
              </Typography>
            </div>
          </div>
        </div>

        {/* Companies Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCompanies.map((company) => (
              <Card key={company.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300" elevation={2}>
                {/* Cover Image */}
                <div className="relative h-32 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=150&fit=crop"
                    alt={`${company.name} office`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  {company.is_hiring && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 text-white">
                        Hiring
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Company Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg ${
                          isDark ? 'bg-lime text-dark-surface' : 'bg-asu-maroon text-white'
                        }`}>
                          {company.name.charAt(0)}
                        </div>
                        {company.is_verified && (
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                            isDark ? 'bg-lime' : 'bg-asu-maroon'
                          }`}>
                            <Verified className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <Typography variant="h6" className="font-bold">
                          {company.name}
                        </Typography>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span>{company.rating}</span>
                          <span>({company.reviews_count})</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => handleFollowCompany(company.id)}
                      className="min-w-0 p-1"
                    >
                      {followingCompanies.has(company.id) ? 
                        <Favorite className={`h-5 w-5 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} /> : 
                        <FavoriteBorder className="h-5 w-5" />
                      }
                    </Button>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Business className="h-4 w-4" />
                      <span>{company.industry}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <LocationOn className="h-4 w-4" />
                      <span>{company.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <People className="h-4 w-4" />
                      <span>{company.company_size}</span>
                    </div>
                    {company.growth_rate && (
                      <div className="flex items-center space-x-2 text-sm text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        <span>{company.growth_rate}% growth</span>
                      </div>
                    )}
                  </div>

                  <Typography variant="body2" color="textSecondary" className="mb-4 line-clamp-2">
                    {company.description}
                  </Typography>

                  {/* Benefits */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {company.featured_benefits.slice(0, 3).map((benefit, index) => (
                      <Badge key={index} variant="outlined" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm">
                      <Work className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{getTotalOpenPositions(company)} open positions</span>
                    </div>
                    <Link to={`/companies/${company.id}`}>
                      <Button variant="contained" color="primary" size="small">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedCompanies.map((company) => (
              <Card key={company.id} className="p-6 hover:shadow-lg transition-shadow" elevation={2}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg ${
                        isDark ? 'bg-lime text-dark-surface' : 'bg-asu-maroon text-white'
                      }`}>
                        {company.name.charAt(0)}
                      </div>
                      {company.is_verified && (
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                          isDark ? 'bg-lime' : 'bg-asu-maroon'
                        }`}>
                          <Verified className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <Typography variant="h6" className="font-bold">
                              {company.name}
                            </Typography>
                            {company.is_hiring && (
                              <Badge className="bg-green-500 text-white text-xs">
                                Hiring
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center space-x-1">
                              <Business className="h-4 w-4" />
                              <span>{company.industry}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <LocationOn className="h-4 w-4" />
                              <span>{company.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <People className="h-4 w-4" />
                              <span>{company.employee_count.toLocaleString()} employees</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span>{company.rating} ({company.reviews_count} reviews)</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => handleFollowCompany(company.id)}
                          className="min-w-0 p-2"
                        >
                          {followingCompanies.has(company.id) ? 
                            <Favorite className={`h-5 w-5 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} /> : 
                            <FavoriteBorder className="h-5 w-5" />
                          }
                        </Button>
                      </div>
                      
                      <Typography variant="body2" color="textSecondary" className="mb-3 line-clamp-2">
                        {company.description}
                      </Typography>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex flex-wrap gap-1">
                            {company.featured_benefits.slice(0, 4).map((benefit, index) => (
                              <Badge key={index} variant="outlined" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center space-x-1 text-sm">
                            <Work className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{getTotalOpenPositions(company)} open positions</span>
                          </div>
                        </div>
                        <Link to={`/companies/${company.id}`}>
                          <Button variant="contained" color="primary" endIcon={<ArrowForward />}>
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredAndSortedCompanies.length === 0 && (
          <Card className="p-12 text-center" elevation={2}>
            <Business className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <Typography variant="h6" className="mb-2">
              No companies found
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-4">
              Try adjusting your search criteria or filters to find more companies.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setSelectedIndustry('');
                setSelectedLocation('');
                setSelectedSize('');
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}