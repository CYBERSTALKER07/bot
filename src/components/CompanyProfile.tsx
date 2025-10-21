import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star,
  Verified,
  Favorite,
  FavoriteBorder,
  Share,
  OpenInNew,
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Typography from './ui/Typography';
import Button from './ui/Button';

interface Company {
  id: string;
  name: string;
  cover_image_url?: string;
  description: string;
  industry: string;
  location: string;
  website_url?: string;
  rating?: number;
  is_verified?: boolean;
}

export default function CompanyProfile() {
  const { companyId } = useParams<{ companyId: string }>();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        
        // Mock company data - replace with real API call
        const mockCompany: Company = {
          id: companyId!,
          name: 'Google',
          cover_image_url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&h=400&fit=crop',
          description: 'Organizing the world\'s information and making it universally accessible.',
          industry: 'Technology',
          location: 'Mountain View, CA',
          website_url: 'https://google.com',
          rating: 4.5,
          is_verified: true,
        };

        setCompany(mockCompany);
      } catch (error) {
        console.error('Error fetching company data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchCompanyData();
    }
  }, [companyId]);

  const handleFollowCompany = async () => {
    if (!user || !company) return;
    setIsFollowing(!isFollowing);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-black' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 ${
            isDark ? 'border-lime' : 'border-asu-maroon'
          }`}></div>
          <Typography variant="body1" color="textSecondary">
            Loading company profile...
          </Typography>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-black' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <Typography variant="h5" className="mb-4">
            Company not found
          </Typography>
          <Link to="/companies">
            <Button variant="filled">
              Browse Companies
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      isDark ? 'bg-black' : 'bg-gray-50'
    }`}>
      {/* Hero Section */}
 

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Typography variant="h4" className="font-bold mb-2">
            Explore {company.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Learn more about the company and its opportunities
          </Typography>
        </div>

        {/* Main Grid Layout - Featured Left, Items Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 h-[600px] mb-8">
          {/* Featured Section - Full Height Left Side (2 cols) */}
          <div className="lg:col-span-2 h-[600px]">
            <div className="relative bg-black rounded-3xl overflow-hidden group cursor-pointer h-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-100 border-[0.7px] border-white">
              <img
                src={company.cover_image_url}
                alt={`${company.name}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              
              <div className="absolute bottom-4 left-4 z-10">
                <div className="bg-black border-[0.7px] border-white rounded-3xl px-4 py-3 backdrop-blur-sm">
                  <h3 className="text-white font-bold text-lg mb-2">
                    {company.name}
                  </h3>
                  <p className="text-white text-sm mb-3 line-clamp-2">
                    {company.description}
                  </p>
                  <div className="flex items-center space-x-3 text-xs text-white">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="font-medium">{company.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{company.industry}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Industry Card Full Height */}
          <div className="lg:col-span-1 w-full h-[600px]">
            {/* Industry Card */}
            <div className="relative bg-black w-[500px] rounded-3xl overflow-hidden group cursor-pointer h-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 border-[0.7px] border-white">
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <Typography variant="h5" className="font-bold mb-3 text-white">
                  Industry
                </Typography>
                <Typography variant="h6" className="text-white">
                  {company.industry}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features Row - 2 large cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Rating Card */}
          <Link to={`/companies/${companyId}/reviews`} className="no-underline">
            <div className="relative bg-black rounded-3xl overflow-hidden group cursor-pointer h-80 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 border-[0.7px] border-white">
              <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                <Typography variant="h5" className="font-bold mb-2 text-white">
                  Rating
                </Typography>
                <Typography variant="h4" className="text-yellow-400 font-bold mb-1">
                  {company.rating} / 5.0
                </Typography>
                <Typography variant="caption" className="text-white">
                  ★ Stars
                </Typography>
              </div>
            </div>
          </Link>

          {/* Career Opportunities Card */}
          <Link to={`/companies/${companyId}/jobs`} className="no-underline">
            <div className="relative bg-black rounded-3xl overflow-hidden group cursor-pointer h-80 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 border-[0.7px] border-white">
              <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                <Typography variant="h5" className="font-bold mb-2 text-white">
                  Career Opportunities
                </Typography>
                <Typography variant="body2" className="mb-3 text-white">
                  Discover exciting jobs and internships
                </Typography>
                <Button variant="filled" size="small">
                  Browse Jobs
                </Button>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}