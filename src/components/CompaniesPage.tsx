import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import CompanyCard from './ui/CompanyCard';
import { mockCompanies } from '../data/mockData';
import { cn } from '../lib/cva';
import PageLayout from './ui/PageLayout';
import { Building2 } from 'lucide-react';

interface Company {
  id: number | string;
  name: string;
  logo_url?: string;
  cover_image_url?: string;
  industry?: string;
  location?: string;
  size?: string;
  rating?: number;
  reviews_count?: number;
  is_verified?: boolean;
  is_hiring?: boolean;
  employee_count?: number;
  founded_year?: number;
  featured_benefits?: string[];
}

export default function CompaniesPage() {
  const { isDark } = useTheme();
  const [followingCompanies, setFollowingCompanies] = useState<Set<string>>(new Set());

  // Use mock companies data
  const companiesData = mockCompanies as Company[];

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
    const company = companiesData?.find(c => c.id.toString() === companyId);
    if (company && navigator.share) {
      navigator.share({
        title: `Check out ${company.name}`,
        text: `${company.name} - ${company.industry} company`,
        url: `${window.location.origin}/company-detail/${companyId}`
      }).catch(err => console.log('Share cancelled:', err));
    }
  };

  return (
    <div className={cn(
      'grid grid-flow-row min-h-screen transition-colors duration-300 py-12 px-4',
      isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'
    )}>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Featured Companies</h1>
        <p className={cn(
          'text-lg',
          isDark ? 'text-gray-400' : 'text-gray-600'
        )}>
          Explore and discover amazing companies to work for
        </p>
      </div>

      {/* Companies Grid - 300x300px cards */}
      {companiesData && companiesData.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
          {companiesData.map((company: Company) => (
            <CompanyCard
              key={company.id}
              id={company.id.toString()}
              name={company.name}
              logo_url={company.logo_url}
              cover_image_url={company.cover_image_url}
              industry={company.industry || 'Technology'}
              location={company.location || 'Remote'}
              company_size={company.size || 'Unknown'}
              rating={company.rating || 4.5}
              reviews_count={company.reviews_count || 0}
              is_verified={company.is_verified}
              is_hiring={company.is_hiring}
              is_following={followingCompanies.has(company.id.toString())}
              employee_count={company.employee_count || 0}
              founded_year={company.founded_year || new Date().getFullYear()}
              isDark={isDark}
              onFollow={handleFollowCompany}
              onShare={handleShareCompany}
            />
          ))}
        </div>
      ) : (
        <div className={cn(
          'p-8 text-center max-w-2xl mx-auto rounded-lg',
          isDark ? 'bg-black border-b' : 'bg-white shadow'
        )}>
          <Building2 className={cn(
            'h-12 w-12 mx-auto mb-4',
            isDark ? 'text-gray-600' : 'text-gray-400'
          )} />
          <h3 className="text-lg font-semibold mb-2">No companies found</h3>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Companies data is being loaded. Please check back soon!
          </p>
        </div>
      )}

      {/* Stats Section */}
      {companiesData && companiesData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className={cn(
            'p-6 rounded-lg text-center',
            isDark ? 'bg-black border-b' : 'bg-white shadow-md'
          )}>
            <div className="text-3xl font-bold mb-2">{companiesData.length}</div>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Featured Companies</p>
          </div>
          <div className={cn(
            'p-6 rounded-lg text-center',
            isDark ? 'bg-black border-b' : 'bg-white shadow-md'
          )}>
            <div className="text-3xl font-bold mb-2">{followingCompanies.size}</div>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Companies Following</p>
          </div>
          <div className={cn(
            'p-6 rounded-lg text-center',
            isDark ? 'bg-black border-b' : 'bg-white shadow-md'
          )}>
            <div className="text-3xl font-bold mb-2">
              {companiesData.reduce((sum: number) => sum + 1, 0) * 5}
            </div>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Open Positions</p>
          </div>
        </div>
      )}
    </div>
  );
}