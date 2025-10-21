import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase,
  MapPin,
  Users,
  TrendingUp,
  ExternalLink,
  Plus,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import { cn } from '../../lib/cva';

interface ProfileCompany {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  industry: string;
  location: string;
  employee_count?: number;
  website_url?: string;
  rating?: number;
  role?: string; // e.g., "Founder", "Employee", "Investor"
  added_date?: string;
  is_current?: boolean;
}

interface ProfileCompaniesProps {
  userId?: string;
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

export default function ProfileCompanies({ 
  userId, 
  isOwnProfile = false, 
  onEdit 
}: ProfileCompaniesProps) {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [companies, setCompanies] = useState<ProfileCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCompany, setShowAddCompany] = useState(false);

  // Load companies for the profile
  useEffect(() => {
    if (userId || user?.id) {
      fetchProfileCompanies(userId || user?.id);
    }
  }, [userId, user?.id]);

  const fetchProfileCompanies = async (profileUserId: string) => {
    try {
      setLoading(true);
      
      // First, get the user's company_name from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('company_name')
        .eq('id', profileUserId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // For now, create mock company data based on the profile
      const mockCompanies: ProfileCompany[] = [];
      
      if (profileData?.company_name) {
        mockCompanies.push({
          id: '1',
          name: profileData.company_name,
          description: 'Current workplace',
          industry: 'Technology',
          location: 'Remote',
          employee_count: 1000,
          website_url: 'https://example.com',
          rating: 4.5,
          role: 'Employee',
          is_current: true,
          added_date: new Date().toISOString()
        });
      }

      // Add mock companies for demonstration
      mockCompanies.push(
        {
          id: '2',
          name: 'Google',
          description: 'Search and advertising giant',
          industry: 'Technology',
          location: 'Mountain View, CA',
          employee_count: 156500,
          website_url: 'https://google.com',
          rating: 4.5,
          role: 'Former Employee',
          is_current: false,
          added_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          name: 'Meta',
          description: 'Social media and metaverse company',
          industry: 'Technology',
          location: 'Menlo Park, CA',
          employee_count: 67317,
          website_url: 'https://meta.com',
          rating: 4.2,
          role: 'Investor',
          is_current: false,
          added_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
        }
      );

      setCompanies(mockCompanies);
    } catch (error) {
      console.error('Error fetching profile companies:', error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCompany = async (companyId: string) => {
    try {
      setCompanies(companies.filter(c => c.id !== companyId));
      // TODO: Add actual database deletion when table is created
    } catch (error) {
      console.error('Error removing company:', error);
    }
  };

  const handleAddCompany = () => {
    setShowAddCompany(true);
    // TODO: Open modal or navigate to add company page
  };

  if (loading) {
    return (
      <div className={cn(
        "rounded-2xl border overflow-hidden",
        isDark ? "bg-black border-gray-800" : "bg-white border-gray-200"
      )}>
        <div className={cn("p-4 border-b", isDark ? "border-gray-800" : "border-gray-200")}>
          <h3 className="font-bold flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Companies
          </h3>
        </div>
        <div className="p-4 flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#BCE953]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-2xl border overflow-hidden",
      isDark ? "bg-black border-gray-800" : "bg-white border-gray-200"
    )}>
      {/* Header */}
      <div className={cn(
        "p-4 border-b flex items-center justify-between",
        isDark ? "border-gray-800" : "border-gray-200"
      )}>
        <h3 className="font-bold flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Companies ({companies.length})
        </h3>
        {isOwnProfile && (
          <button
            onClick={handleAddCompany}
            className={cn(
              "p-1 rounded-full transition-colors",
              isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
            )}
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Companies List */}
      <div className={cn(
        "divide-y",
        isDark ? "divide-gray-800" : "divide-gray-200"
      )}>
        {companies.length === 0 ? (
          <div className="p-6 text-center">
            <div className={cn(
              "w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center",
              isDark ? "bg-gray-900" : "bg-gray-100"
            )}>
              <Briefcase className={cn("w-6 h-6", isDark ? "text-gray-700" : "text-gray-400")} />
            </div>
            <p className={cn("text-sm mb-3", isDark ? "text-gray-400" : "text-gray-600")}>
              No companies added yet
            </p>
            {isOwnProfile && (
              <Button
                onClick={handleAddCompany}
                variant="outlined"
                className="text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Company
              </Button>
            )}
          </div>
        ) : (
          companies.map((company) => (
            <div
              key={company.id}
              className={cn(
                "p-4 transition-colors cursor-pointer",
                isDark ? "hover:bg-gray-900/50" : "hover:bg-gray-50"
              )}
              onClick={() => navigate(`/companies/${company.id}`)}
            >
              <div className="flex gap-3">
                {/* Company Logo/Avatar */}
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0",
                  isDark ? "bg-gray-900" : "bg-gray-100"
                )}>
                  {company.logo_url ? (
                    <img
                      src={company.logo_url}
                      alt={company.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                      {company.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Company Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h4 className={cn(
                        "font-semibold text-sm",
                        isDark ? "text-white" : "text-gray-900"
                      )}>
                        {company.name}
                      </h4>
                      {company.role && (
                        <p className={cn(
                          "text-xs",
                          isDark ? "text-lime" : "text-lime"
                        )}>
                          {company.role}
                          {company.is_current && (
                            <span className={cn(
                              "ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                              isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"
                            )}>
                              Current
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                    {isOwnProfile && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCompany(company.id);
                        }}
                        className={cn(
                          "p-1 rounded transition-colors",
                          isDark ? "text-gray-400 hover:text-red-400 hover:bg-red-500/10" : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                        )}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Company Details */}
                  <div className={cn(
                    "flex flex-wrap gap-3 text-xs mb-2",
                    isDark ? "text-gray-400" : "text-gray-600"
                  )}>
                    {company.industry && (
                      <span>{company.industry}</span>
                    )}
                    {company.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{company.location}</span>
                      </div>
                    )}
                    {company.employee_count && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{company.employee_count.toLocaleString()} employees</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {company.description && (
                    <p className={cn(
                      "text-xs mb-2 line-clamp-2",
                      isDark ? "text-gray-400" : "text-gray-600"
                    )}>
                      {company.description}
                    </p>
                  )}

                  {/* Rating and Website */}
                  <div className="flex items-center justify-between">
                    {company.rating && (
                      <div className="flex items-center gap-1">
                        <span className={cn(
                          "text-xs font-medium",
                          isDark ? "text-yellow-400" : "text-yellow-600"
                        )}>
                          ★ {company.rating}
                        </span>
                      </div>
                    )}
                    {company.website_url && (
                      <a
                        href={company.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                          "flex items-center gap-1 text-xs transition-colors",
                          isDark ? "text-lime hover:text-lime/80" : "text-lime hover:text-lime/80"
                        )}
                      >
                        Visit <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View All Button */}
      {companies.length > 0 && (
        <div className={cn("p-4 border-t text-center", isDark ? "border-gray-800" : "border-gray-200")}>
          <button className={cn(
            "text-sm font-medium hover:underline",
            isDark ? "text-lime" : "text-lime"
          )}>
            View all companies
          </button>
        </div>
      )}
    </div>
  );
}
