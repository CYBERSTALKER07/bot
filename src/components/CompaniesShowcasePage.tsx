import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import CompanyCard from './ui/CompanyCard';
import { cn } from '../lib/cva';
import PageLayout from './ui/PageLayout';

// Example companies data
const EXAMPLE_COMPANIES = [
  {
    id: '1',
    name: 'Google',
    logo_url: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop',
    cover_image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop',
    industry: 'Technology',
    location: 'Mountain View, CA',
    company_size: '10,000+',
    rating: 4.5,
    reviews_count: 2345,
    is_verified: true,
    is_hiring: true,
    employee_count: 190000,
    founded_year: 1998,
    recent_jobs_count: 48
  },
  {
    id: '2',
    name: 'Meta',
    logo_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
    cover_image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop',
    industry: 'Social Media',
    location: 'Menlo Park, CA',
    company_size: '5,000-10,000',
    rating: 4.2,
    reviews_count: 1856,
    is_verified: true,
    is_hiring: true,
    employee_count: 86482,
    founded_year: 2004,
    recent_jobs_count: 32
  },
  {
    id: '3',
    name: 'Apple',
    logo_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
    cover_image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop',
    industry: 'Technology',
    location: 'Cupertino, CA',
    company_size: '10,000+',
    rating: 4.6,
    reviews_count: 3421,
    is_verified: true,
    is_hiring: false,
    employee_count: 161000,
    founded_year: 1976,
    recent_jobs_count: 12
  },
  {
    id: '4',
    name: 'Netflix',
    logo_url: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=100&h=100&fit=crop',
    cover_image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop',
    industry: 'Entertainment',
    location: 'Los Gatos, CA',
    company_size: '5,000-10,000',
    rating: 4.3,
    reviews_count: 987,
    is_verified: true,
    is_hiring: true,
    employee_count: 12800,
    founded_year: 1997,
    recent_jobs_count: 24
  },
  {
    id: '5',
    name: 'Tesla',
    logo_url: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=100&h=100&fit=crop',
    cover_image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop',
    industry: 'Automotive',
    location: 'Austin, TX',
    company_size: '5,000-10,000',
    rating: 3.8,
    reviews_count: 654,
    is_verified: true,
    is_hiring: true,
    employee_count: 127855,
    founded_year: 2003,
    recent_jobs_count: 56
  },
  {
    id: '6',
    name: 'Microsoft',
    logo_url: 'https://images.unsplash.com/photo-1599059113033-a5cf9d2a3b48?w=100&h=100&fit=crop',
    cover_image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop',
    industry: 'Technology',
    location: 'Redmond, WA',
    company_size: '10,000+',
    rating: 4.4,
    reviews_count: 2156,
    is_verified: true,
    is_hiring: true,
    employee_count: 221000,
    founded_year: 1975,
    recent_jobs_count: 45
  }
];

export default function CompaniesShowcasePage() {
  const { isDark } = useTheme();
  const [followingCompanies, setFollowingCompanies] = useState<Set<string>>(new Set());

  const handleFollowCompany = (companyId: string) => {
    const newFollowing = new Set(followingCompanies);
    if (newFollowing.has(companyId)) {
      newFollowing.delete(companyId);
    } else {
      newFollowing.add(companyId);
    }
    setFollowingCompanies(newFollowing);
  };

  const handleShareCompany = (companyId: string) => {
    const company = EXAMPLE_COMPANIES.find(c => c.id === companyId);
    if (company && navigator.share) {
      navigator.share({
        title: `Check out ${company.name}`,
        text: `${company.name} - ${company.industry} company with ${company.employee_count.toLocaleString()} employees`,
        url: window.location.href
      }).catch(err => console.log('Share cancelled:', err));
    }
  };

  return (
    <PageLayout className={cn(
      'min-h-screen transition-colors duration-300',
      isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'
    )}>
      <div className="py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Featured Companies</h1>
          <p className={cn(
            'text-lg',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            Explore and connect with top companies hiring now
          </p>
        </div>

        {/* Companies Grid - 300x300px cards */}
        <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
          {EXAMPLE_COMPANIES.map((company) => (
            <div key={company.id} className="flex justify-center">
              <CompanyCard
                {...company}
                isDark={isDark}
                is_following={followingCompanies.has(company.id)}
                onFollow={handleFollowCompany}
                onShare={handleShareCompany}
              />
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className={cn(
            'p-6 rounded-lg text-center',
            isDark ? 'bg-gray-900' : 'bg-white shadow-md'
          )}>
            <div className="text-3xl font-bold mb-2">{EXAMPLE_COMPANIES.length}</div>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Featured Companies</p>
          </div>
          <div className={cn(
            'p-6 rounded-lg text-center',
            isDark ? 'bg-gray-900' : 'bg-white shadow-md'
          )}>
            <div className="text-3xl font-bold mb-2">{followingCompanies.size}</div>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Companies Following</p>
          </div>
          <div className={cn(
            'p-6 rounded-lg text-center',
            isDark ? 'bg-gray-900' : 'bg-white shadow-md'
          )}>
            <div className="text-3xl font-bold mb-2">
              {EXAMPLE_COMPANIES.reduce((sum, c) => sum + c.recent_jobs_count, 0)}
            </div>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Open Positions</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
