import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  LocationOn,
  Language,
  People,
  TrendingUp,
  Star,
  Verified,
  Work,
  School,
  Favorite,
  FavoriteBorder,
  Share,
  OpenInNew,
  Business,
  Group,
  Assessment,
  EmojiEvents,
  Diversity3,
  HealthAndSafety,
  LocalCafe,
  SportsEsports,
  Flight,
  CardGiftcard,
  AttachMoney,
  Schedule,
  HomeWork,
  Eco,
  Volunteer
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Typography from './ui/Typography';
import Button from './ui/Button';
import { Card } from './ui/Card';
import Avatar from './ui/Avatar';
import Badge from './ui/Badge';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Company {
  id: string;
  name: string;
  logo_url?: string;
  cover_image_url?: string;
  description: string;
  mission_statement?: string;
  industry: string;
  company_size: string;
  founded_year?: number;
  location: string;
  website_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  culture_videos?: string[];
  employee_count?: number;
  rating?: number;
  reviews_count?: number;
  is_following?: boolean;
  is_verified?: boolean;
  benefits: CompanyBenefit[];
  values: CompanyValue[];
  offices: CompanyOffice[];
  stats: CompanyStats;
  recent_jobs: Job[];
  employee_testimonials: EmployeeTestimonial[];
  diversity_data?: DiversityData;
  sustainability_initiatives?: SustainabilityInitiative[];
}

interface CompanyBenefit {
  id: string;
  category: 'health' | 'financial' | 'time-off' | 'learning' | 'perks' | 'family';
  title: string;
  description: string;
  icon: string;
}

interface CompanyValue {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface CompanyOffice {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  is_headquarters: boolean;
  employee_count?: number;
  image_url?: string;
}

interface CompanyStats {
  total_employees: number;
  avg_tenure: string;
  employee_satisfaction: number;
  glassdoor_rating?: number;
  total_jobs_posted: number;
  successful_hires: number;
}

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  posted_date: string;
  application_count: number;
}

interface EmployeeTestimonial {
  id: string;
  employee_name: string;
  employee_title: string;
  employee_avatar?: string;
  content: string;
  rating: number;
  tenure: string;
  department: string;
}

interface DiversityData {
  gender_diversity: { male: number; female: number; other: number };
  age_diversity: { under_25: number; age_25_34: number; age_35_44: number; over_45: number };
  ethnicity_diversity: Record<string, number>;
  leadership_diversity: number;
}

interface SustainabilityInitiative {
  id: string;
  title: string;
  description: string;
  category: 'environmental' | 'social' | 'governance';
  impact_metric?: string;
}

export default function CompanyProfile() {
  const { companyId } = useParams<{ companyId: string }>();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'culture' | 'reviews'>('overview');
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (companyId) {
      fetchCompanyData();
    }
  }, [companyId]);

  useEffect(() => {
    // Hero section parallax animation
    gsap.registerPlugin(ScrollTrigger);
    
    if (heroRef.current) {
      gsap.to(heroRef.current.querySelector('.hero-bg'), {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Stats animation
    if (statsRef.current) {
      gsap.fromTo(statsRef.current.querySelectorAll('.stat-card'), 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%'
          }
        }
      );
    }

    // Benefits animation
    if (benefitsRef.current) {
      gsap.fromTo(benefitsRef.current.querySelectorAll('.benefit-item'), 
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: 'top 80%'
          }
        }
      );
    }

    // Values animation
    if (valuesRef.current) {
      gsap.fromTo(valuesRef.current.querySelectorAll('.value-card'), 
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: valuesRef.current,
            start: 'top 80%'
          }
        }
      );
    }
  }, [company]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would fetch from your database
      // For now, creating mock data
      const mockCompany: Company = {
        id: companyId!,
        name: 'Google',
        logo_url: 'https://logo.clearbit.com/google.com',
        cover_image_url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&h=400&fit=crop',
        description: 'Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware.',
        mission_statement: 'To organize the world\'s information and make it universally accessible and useful.',
        industry: 'Technology',
        company_size: '10,000+ employees',
        founded_year: 1998,
        location: 'Mountain View, CA',
        website_url: 'https://google.com',
        linkedin_url: 'https://linkedin.com/company/google',
        culture_videos: ['https://youtube.com/watch?v=example1', 'https://youtube.com/watch?v=example2'],
        employee_count: 156500,
        rating: 4.5,
        reviews_count: 12847,
        is_following: false,
        is_verified: true,
        benefits: [
          {
            id: '1',
            category: 'health',
            title: 'Comprehensive Healthcare',
            description: 'Full medical, dental, and vision coverage for you and your family',
            icon: 'health'
          },
          {
            id: '2',
            category: 'financial',
            title: 'Competitive Salary + Equity',
            description: 'Industry-leading compensation with stock options and bonuses',
            icon: 'money'
          },
          {
            id: '3',
            category: 'time-off',
            title: 'Unlimited PTO',
            description: 'Take the time you need to recharge and spend with family',
            icon: 'vacation'
          },
          {
            id: '4',
            category: 'learning',
            title: 'Learning & Development',
            description: '$5,000 annual budget for courses, conferences, and certifications',
            icon: 'education'
          },
          {
            id: '5',
            category: 'perks',
            title: 'Free Meals & Snacks',
            description: 'Gourmet cafeterias and micro-kitchens on every floor',
            icon: 'food'
          },
          {
            id: '6',
            category: 'family',
            title: 'Parental Leave',
            description: '24 weeks paid leave for new parents and adoption support',
            icon: 'family'
          }
        ],
        values: [
          {
            id: '1',
            title: 'Focus on the user',
            description: 'Everything we do starts with the user experience in mind',
            icon: 'user-focus'
          },
          {
            id: '2',
            title: 'Innovation',
            description: 'We push boundaries and think differently to solve big problems',
            icon: 'innovation'
          },
          {
            id: '3',
            title: 'Diversity & Inclusion',
            description: 'Building products for everyone means including everyone',
            icon: 'diversity'
          },
          {
            id: '4',
            title: 'Excellence',
            description: 'We set high standards and continuously raise the bar',
            icon: 'excellence'
          }
        ],
        offices: [
          {
            id: '1',
            name: 'Googleplex',
            address: '1600 Amphitheatre Parkway',
            city: 'Mountain View',
            country: 'USA',
            is_headquarters: true,
            employee_count: 25000,
            image_url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop'
          }
        ],
        stats: {
          total_employees: 156500,
          avg_tenure: '3.8 years',
          employee_satisfaction: 92,
          glassdoor_rating: 4.5,
          total_jobs_posted: 2847,
          successful_hires: 15600
        },
        recent_jobs: [
          {
            id: '1',
            title: 'Software Engineer',
            department: 'Engineering',
            location: 'Mountain View, CA',
            type: 'full-time',
            posted_date: '2025-07-08',
            application_count: 234
          },
          {
            id: '2',
            title: 'Product Manager',
            department: 'Product',
            location: 'New York, NY',
            type: 'full-time',
            posted_date: '2025-07-06',
            application_count: 156
          }
        ],
        employee_testimonials: [
          {
            id: '1',
            employee_name: 'Sarah Chen',
            employee_title: 'Senior Software Engineer',
            employee_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
            content: 'Google has been an incredible place to grow my career. The learning opportunities are endless, and I work with some of the brightest minds in tech.',
            rating: 5,
            tenure: '4 years',
            department: 'Engineering'
          },
          {
            id: '2',
            employee_name: 'Marcus Johnson',
            employee_title: 'Product Design Lead',
            employee_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            content: 'The culture here truly embraces innovation and creativity. I feel empowered to take risks and think big about solving user problems.',
            rating: 5,
            tenure: '2 years',
            department: 'Design'
          }
        ],
        diversity_data: {
          gender_diversity: { male: 68, female: 30, other: 2 },
          age_diversity: { under_25: 15, age_25_34: 45, age_35_44: 25, over_45: 15 },
          ethnicity_diversity: { 'White': 48, 'Asian': 35, 'Hispanic': 8, 'Black': 5, 'Other': 4 },
          leadership_diversity: 35
        },
        sustainability_initiatives: [
          {
            id: '1',
            title: 'Carbon Neutral by 2030',
            description: 'Committed to operating on 24/7 carbon-free energy by 2030',
            category: 'environmental',
            impact_metric: '100% renewable energy'
          },
          {
            id: '2',
            title: 'AI for Social Good',
            description: 'Using AI to address humanitarian and environmental challenges',
            category: 'social',
            impact_metric: '50+ projects launched'
          }
        ]
      };

      setCompany(mockCompany);
      setIsFollowing(mockCompany.is_following || false);
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowCompany = async () => {
    try {
      if (!user || !company) return;

      const newFollowState = !isFollowing;
      setIsFollowing(newFollowState);

      // In a real app, this would update the database
      await supabase
        .from('company_followers')
        .upsert([
          {
            user_id: user.id,
            company_id: company.id,
            is_following: newFollowState
          }
        ]);
    } catch (error) {
      console.error('Error following company:', error);
      setIsFollowing(!isFollowing); // Revert on error
    }
  };

  const getBenefitIcon = (category: string) => {
    switch (category) {
      case 'health': return <HealthAndSafety className="h-6 w-6" />;
      case 'financial': return <AttachMoney className="h-6 w-6" />;
      case 'time-off': return <Flight className="h-6 w-6" />;
      case 'learning': return <School className="h-6 w-6" />;
      case 'perks': return <LocalCafe className="h-6 w-6" />;
      case 'family': return <Diversity3 className="h-6 w-6" />;
      default: return <CardGiftcard className="h-6 w-6" />;
    }
  };

  const getValueIcon = (iconType: string) => {
    switch (iconType) {
      case 'user-focus': return <People className="h-8 w-8" />;
      case 'innovation': return <EmojiEvents className="h-8 w-8" />;
      case 'diversity': return <Diversity3 className="h-8 w-8" />;
      case 'excellence': return <Star className="h-8 w-8" />;
      default: return <Business className="h-8 w-8" />;
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gradient-to-br from-black via-black to-purple-900' : 'bg-gray-50'
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
        isDark ? 'bg-gradient-to-br from-black via-black to-purple-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <Typography variant="h5" className="mb-4">
            Company not found
          </Typography>
          <Link to="/companies">
            <Button variant="contained" color="primary">
              Browse Companies
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      isDark ? 'bg-gradient-to-br from-black via-black to-purple-900' : 'bg-gray-50'
    }`}>
      {/* Hero Section */}
      <div ref={heroRef} className="relative h-96 overflow-hidden">
        <div className="hero-bg absolute inset-0">
          <img
            src={company.cover_image_url}
            alt={`${company.name} office`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
            <div className="flex items-end justify-between">
              <div className="flex items-end space-x-6">
                <div className="relative">
                  <Avatar
                    src={company.logo_url}
                    alt={company.name}
                    size="xl"
                    className="ring-4 ring-white shadow-2xl bg-white"
                    fallback={company.name[0]}
                  />
                  {company.is_verified && (
                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-lime' : 'bg-asu-maroon'
                    }`}>
                      <Verified className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="text-white">
                  <div className="flex items-center space-x-3 mb-2">
                    <Typography variant="h3" className="font-bold">
                      {company.name}
                    </Typography>
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="font-medium">{company.rating}</span>
                      <span className="text-gray-300">({company.reviews_count} reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-gray-200">
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
                      <span>{company.company_size}</span>
                    </div>
                    {company.founded_year && (
                      <div className="flex items-center space-x-1">
                        <Schedule className="h-4 w-4" />
                        <span>Founded {company.founded_year}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="outlined"
                  onClick={handleFollowCompany}
                  startIcon={isFollowing ? <Favorite /> : <FavoriteBorder />}
                  className="border-white text-white hover:bg-white/10"
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  className="border-white text-white hover:bg-white/10"
                >
                  Share
                </Button>
                {company.website_url && (
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<OpenInNew />}
                    onClick={() => window.open(company.website_url, '_blank')}
                  >
                    Visit Website
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'jobs', label: `Jobs (${company.recent_jobs.length})` },
                { id: 'culture', label: 'Culture & Values' },
                { id: 'reviews', label: `Reviews (${company.reviews_count})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? `border-${isDark ? 'lime' : 'asu-maroon'} text-${isDark ? 'lime' : 'asu-maroon'}`
                      : `border-transparent ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Company Stats */}
            <div ref={statsRef}>
              <Typography variant="h5" className="mb-6 font-semibold">
                Company Highlights
              </Typography>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="stat-card p-6 text-center" elevation={2}>
                  <div className={`text-3xl font-bold mb-2 ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>
                    {company.stats.total_employees.toLocaleString()}
                  </div>
                  <Typography variant="body2" color="textSecondary">
                    Employees
                  </Typography>
                </Card>
                <Card className="stat-card p-6 text-center" elevation={2}>
                  <div className={`text-3xl font-bold mb-2 ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>
                    {company.stats.avg_tenure}
                  </div>
                  <Typography variant="body2" color="textSecondary">
                    Avg. Tenure
                  </Typography>
                </Card>
                <Card className="stat-card p-6 text-center" elevation={2}>
                  <div className={`text-3xl font-bold mb-2 ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>
                    {company.stats.employee_satisfaction}%
                  </div>
                  <Typography variant="body2" color="textSecondary">
                    Employee Satisfaction
                  </Typography>
                </Card>
                <Card className="stat-card p-6 text-center" elevation={2}>
                  <div className={`text-3xl font-bold mb-2 ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>
                    {company.stats.successful_hires.toLocaleString()}
                  </div>
                  <Typography variant="body2" color="textSecondary">
                    Successful Hires
                  </Typography>
                </Card>
              </div>
            </div>

            {/* About Section */}
            <div>
              <Typography variant="h5" className="mb-6 font-semibold">
                About {company.name}
              </Typography>
              <Card className="p-8" elevation={2}>
                <Typography variant="body1" className="mb-6 leading-relaxed">
                  {company.description}
                </Typography>
                {company.mission_statement && (
                  <div className={`p-6 rounded-lg border-l-4 ${
                    isDark 
                      ? 'bg-lime/10 border-lime' 
                      : 'bg-asu-maroon/10 border-asu-maroon'
                  }`}>
                    <Typography variant="h6" className="mb-2 font-semibold">
                      Our Mission
                    </Typography>
                    <Typography variant="body1" className="italic">
                      "{company.mission_statement}"
                    </Typography>
                  </div>
                )}
              </Card>
            </div>

            {/* Benefits & Perks */}
            <div ref={benefitsRef}>
              <Typography variant="h5" className="mb-6 font-semibold">
                Benefits & Perks
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {company.benefits.map((benefit) => (
                  <Card key={benefit.id} className="benefit-item p-6 hover:shadow-lg transition-shadow" elevation={2}>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                      isDark ? 'bg-lime/20 text-lime' : 'bg-asu-maroon/20 text-asu-maroon'
                    }`}>
                      {getBenefitIcon(benefit.category)}
                    </div>
                    <Typography variant="h6" className="mb-2 font-semibold">
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {benefit.description}
                    </Typography>
                  </Card>
                ))}
              </div>
            </div>

            {/* Diversity & Inclusion */}
            {company.diversity_data && (
              <div>
                <Typography variant="h5" className="mb-6 font-semibold">
                  Diversity & Inclusion
                </Typography>
                <Card className="p-8" elevation={2}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <Typography variant="h6" className="mb-4 font-semibold">
                        Gender Diversity
                      </Typography>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Male</span>
                          <span className="font-medium">{company.diversity_data.gender_diversity.male}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Female</span>
                          <span className="font-medium">{company.diversity_data.gender_diversity.female}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Other</span>
                          <span className="font-medium">{company.diversity_data.gender_diversity.other}%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Typography variant="h6" className="mb-4 font-semibold">
                        Leadership Diversity
                      </Typography>
                      <div className={`text-3xl font-bold ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>
                        {company.diversity_data.leadership_diversity}%
                      </div>
                      <Typography variant="body2" color="textSecondary">
                        of leadership positions held by underrepresented groups
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="h6" className="mb-4 font-semibold">
                        Our Commitment
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        We're committed to building a diverse and inclusive workplace where everyone can thrive and contribute their unique perspectives.
                      </Typography>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Sustainability */}
            {company.sustainability_initiatives && company.sustainability_initiatives.length > 0 && (
              <div>
                <Typography variant="h5" className="mb-6 font-semibold flex items-center">
                  <Eco className="mr-2" />
                  Sustainability Initiatives
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {company.sustainability_initiatives.map((initiative) => (
                    <Card key={initiative.id} className="p-6" elevation={2}>
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          initiative.category === 'environmental' 
                            ? 'bg-green-100 text-green-600'
                            : initiative.category === 'social'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-purple-100 text-purple-600'
                        }`}>
                          {initiative.category === 'environmental' ? <Eco className="h-5 w-5" /> :
                           initiative.category === 'social' ? <Volunteer className="h-5 w-5" /> :
                           <Assessment className="h-5 w-5" />}
                        </div>
                        <div>
                          <Typography variant="h6" className="mb-2 font-semibold">
                            {initiative.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" className="mb-2">
                            {initiative.description}
                          </Typography>
                          {initiative.impact_metric && (
                            <Badge variant="outlined" className="text-xs">
                              {initiative.impact_metric}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <Typography variant="h5" className="font-semibold">
                Open Positions
              </Typography>
              <Link to={`/companies/${company.id}/jobs`}>
                <Button variant="outlined" color="primary">
                  View All Jobs
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {company.recent_jobs.map((job) => (
                <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow" elevation={2}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Typography variant="h6" className="font-semibold">
                          {job.title}
                        </Typography>
                        <Badge variant="outlined">
                          {job.type}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{job.department}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>Posted {new Date(job.posted_date).toLocaleDateString()}</span>
                      </div>
                      <Typography variant="body2" color="textSecondary" className="mt-2">
                        {job.application_count} applications received
                      </Typography>
                    </div>
                    <Link to={`/jobs/${job.id}`}>
                      <Button variant="contained" color="primary">
                        Apply Now
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'culture' && (
          <div className="space-y-12">
            {/* Company Values */}
            <div ref={valuesRef}>
              <Typography variant="h5" className="mb-6 font-semibold">
                Our Values
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {company.values.map((value) => (
                  <Card key={value.id} className="value-card p-8 hover:shadow-lg transition-shadow" elevation={2}>
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-6 ${
                      isDark ? 'bg-lime/20 text-lime' : 'bg-asu-maroon/20 text-asu-maroon'
                    }`}>
                      {getValueIcon(value.icon)}
                    </div>
                    <Typography variant="h6" className="mb-3 font-semibold">
                      {value.title}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {value.description}
                    </Typography>
                  </Card>
                ))}
              </div>
            </div>

            {/* Employee Testimonials */}
            <div>
              <Typography variant="h5" className="mb-6 font-semibold">
                What Our Employees Say
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {company.employee_testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="p-6" elevation={2}>
                    <div className="flex items-start space-x-4 mb-4">
                      <Avatar
                        src={testimonial.employee_avatar}
                        alt={testimonial.employee_name}
                        size="md"
                        fallback={testimonial.employee_name[0]}
                      />
                      <div>
                        <Typography variant="subtitle1" className="font-semibold">
                          {testimonial.employee_name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {testimonial.employee_title}
                        </Typography>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <Typography variant="caption" color="textSecondary">
                            {testimonial.tenure} • {testimonial.department}
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <Typography variant="body1" className="italic">
                      "{testimonial.content}"
                    </Typography>
                  </Card>
                ))}
              </div>
            </div>

            {/* Culture Videos */}
            {company.culture_videos && company.culture_videos.length > 0 && (
              <div>
                <Typography variant="h5" className="mb-6 font-semibold">
                  Life at {company.name}
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {company.culture_videos.map((video, index) => (
                    <Card key={index} className="overflow-hidden" elevation={2}>
                      <div className="aspect-video bg-gray-200 flex items-center justify-center">
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          onClick={() => window.open(video, '_blank')}
                        >
                          Watch Video
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <Typography variant="h5" className="mb-6 font-semibold">
              Employee Reviews
            </Typography>
            <Card className="p-8 text-center" elevation={2}>
              <Typography variant="h6" className="mb-4">
                Reviews Coming Soon
              </Typography>
              <Typography variant="body1" color="textSecondary">
                We're working on integrating employee reviews to give you better insights into company culture.
              </Typography>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}