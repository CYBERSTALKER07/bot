import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Loader2, Search, X } from 'lucide-react';
import { cn } from '../lib/cva';
import CompanyCard from './ui/CompanyCard';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type CompanyRow = Database['public']['Tables']['companies']['Row'];

interface Company extends CompanyRow {
  job_count: number;
}

// Skeleton loader for company cards
const CompanyCardSkeleton = ({ isDark }: { isDark: boolean }) => (
  <div className={cn(
    "w-[300px] h-[320px] rounded-[32px] p-6 animate-pulse",
    isDark ? "bg-[#1C1C1E]" : "bg-gray-100"
  )}>
    <div className="flex justify-between items-start mb-4">
      <div className={cn("w-12 h-12 rounded-2xl", isDark ? "bg-[#2C2C2E]" : "bg-gray-200")} />
      <div className={cn("w-16 h-6 rounded-full", isDark ? "bg-[#2C2C2E]" : "bg-gray-200")} />
    </div>
    <div className="mb-6">
      <div className={cn("h-4 w-24 rounded mb-2", isDark ? "bg-[#2C2C2E]" : "bg-gray-200")} />
      <div className={cn("h-8 w-full rounded mb-2", isDark ? "bg-[#2C2C2E]" : "bg-gray-200")} />
      <div className={cn("h-4 w-32 rounded", isDark ? "bg-[#2C2C2E]" : "bg-gray-200")} />
    </div>
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <div className={cn("h-3 w-12 rounded mb-1", isDark ? "bg-[#2C2C2E]" : "bg-gray-200")} />
          <div className={cn("h-4 w-16 rounded", isDark ? "bg-[#2C2C2E]" : "bg-gray-200")} />
        </div>
      ))}
    </div>
  </div>
);

export default function CompaniesPage() {
  const { isDark } = useTheme();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (searchQuery) {
      setSearching(true);
      const timer = setTimeout(() => {
        setSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearching(false);
    }
  }, [searchQuery]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);

      // Fetch companies
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*');

      if (companiesError) throw companiesError;

      // Fetch active job counts for each company
      const companiesWithStats = await Promise.all(
        (companiesData || []).map(async (company) => {
          const { count, error: countError } = await supabase
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id)
            .eq('status', 'open');

          if (countError) console.error('Error fetching job count:', countError);

          return {
            ...company,
            job_count: count || 0
          };
        })
      );

      setCompanies(companiesWithStats);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter companies based on search query
  const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) return companies;

    const query = searchQuery.toLowerCase();
    return companies.filter(company =>
      company.name.toLowerCase().includes(query) ||
      company.industry?.toLowerCase().includes(query) ||
      company.location?.toLowerCase().includes(query)
    );
  }, [companies, searchQuery]);

  if (loading) {
    return (
      <div className={cn(
        'min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300',
        isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'
      )}>
        {/* Search Bar Skeleton */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className={cn(
            "h-14 rounded-3xl animate-pulse",
            isDark ? "bg-[#1C1C1E]" : "bg-gray-200"
          )} />
        </div>

        {/* Company Cards Skeleton */}
        <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CompanyCardSkeleton key={i} isDark={isDark} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300',
      isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'
    )}>
      {/* Search Bar */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="relative">
          <div className={cn(
            'flex items-center px-6 py-4 rounded-3xl transition-all duration-200 border',
            isDark
              ? 'bg-gray-900/50 border-gray-800 focus-within:bg-black focus-within:ring-2 focus-within:ring-blue-500'
              : 'bg-white border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 shadow-sm'
          )}>
            <Search className={cn(
              'w-5 h-5 mr-3 transition-colors',
              isDark ? 'text-gray-500' : 'text-gray-400'
            )} />
            <input
              type="text"
              placeholder="Search companies by name, industry, or location..."
              className={cn(
                'bg-transparent border-none outline-none w-full text-base placeholder-gray-500',
                isDark ? 'text-white' : 'text-black'
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={cn(
                  'p-2 rounded-full hover:bg-gray-700 transition-colors',
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'
                )}
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {searching && (
              <Loader2 className="w-5 h-5 animate-spin text-blue-500 ml-2" />
            )}
          </div>
        </div>

        {/* Results count */}
        {searchQuery && (
          <div className={cn(
            "mt-4 text-sm",
            isDark ? "text-gray-400" : "text-gray-600"
          )}>
            Found {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'}
          </div>
        )}
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              id={company.id.toString()}
              name={company.name}
              logo_url={company.logo_url || undefined}
              industry={company.industry || 'Technology'}
              location={company.location || 'Remote'}
              company_size={company.size || 'Unknown'}
              rating={company.rating || 0}
              is_hiring={company.is_hiring}
              recent_jobs_count={company.job_count}
              isDark={isDark}
            />
          ))}
        </div>
      ) : (
        <div className={cn(
          'p-8 text-center max-w-2xl mx-auto rounded-lg',
          isDark ? 'bg-black border-b' : 'bg-white shadow-sm'
        )}>
          <Loader2 className={cn(
            'h-12 w-12 mx-auto mb-4',
            isDark ? 'text-gray-600' : 'text-gray-400'
          )} />
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery ? 'No companies found' : 'No companies available'}
          </h3>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {searchQuery
              ? `Try adjusting your search terms`
              : 'Be the first to create a company profile!'}
          </p>
        </div>
      )}
    </div>
  );
}