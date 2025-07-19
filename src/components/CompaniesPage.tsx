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
  ExternalLink
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
      className={isDark ? 'bg-black text-white' : 'bg-white text-black'}
      maxWidth="6xl"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Companies</h1>
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Discover companies that are actively hiring students
        </p>
      </div>

      {/* Search and Filters */}
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
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedCompanies.map((company) => (
          <Card 
            key={company.id}
            className={`p-6 hover:shadow-lg transition-all duration-200 ${
              isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isDark ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <Building2 className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{company.name}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {company.industry}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            
            <p className={`text-sm mb-4 line-clamp-2 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {company.description}
            </p>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{company.employee_count}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{company.location}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <span className="text-sm font-medium">{company.rating}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-lg font-semibold text-green-600">
                  {company.recent_jobs.length} open positions
                </p>
              </div>
              <Link to={`/companies/${company.id}`}>
                <Button size="sm">
                  View Profile
                </Button>
              </Link>
            </div>
          </Card>
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
        </div>
      )}
    </PageLayout>
  );
}