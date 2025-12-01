import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Heart, Share2, ArrowRight, Briefcase, MapPin, Loader2 } from 'lucide-react';
import { cn } from '../lib/cva';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type CompanyRow = Database['public']['Tables']['companies']['Row'];
type Job = Database['public']['Tables']['jobs']['Row'];

interface CompanyDetails extends CompanyRow {
  highlights?: { number: string; label: string }[];
  benefits?: { icon: string; title: string; desc: string }[];
  values?: { title: string; description: string }[];
}

export default function CompanyDetailPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const { isDark } = useTheme();
  const [isFollowing, setIsFollowing] = useState(false);
  const [company, setCompany] = useState<CompanyDetails | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);

        // Fetch company details from companies table
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .single();

        if (companyError) throw companyError;

        // Fetch jobs linked to this company
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .eq('company_id', companyId)
          .eq('status', 'open');

        if (jobsError) throw jobsError;

        setJobs(jobsData || []);

        // Construct company object
        setCompany({
          ...companyData,
          highlights: [
            { number: `${jobsData?.length || 0}`, label: 'Open Jobs' },
            { number: `${companyData.employee_count || 0}+`, label: 'Employees' },
            { number: `${companyData.rating || 0}`, label: 'Rating' },
            { number: '98%', label: 'Satisfaction' } // Placeholder
          ],
          // Parse benefits if they exist, or use defaults
          benefits: companyData.featured_benefits?.map(benefit => ({
            icon: '✨', title: benefit, desc: 'Company Benefit'
          })) || [
              { icon: '🏥', title: 'Health Insurance', desc: 'Comprehensive coverage' },
              { icon: '💻', title: 'Remote Work', desc: 'Work from anywhere' },
              { icon: '📚', title: 'Learning Budget', desc: '$5K annually' },
              { icon: '🎯', title: 'Career Growth', desc: 'Clear progression' }
            ],
          values: [
            { title: 'Innovation', description: 'We push boundaries' },
            { title: 'User First', description: 'Driven by user needs' }
          ]
        });

      } catch (error) {
        console.error('Error fetching company details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchCompanyDetails();
    }
  }, [companyId]);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  if (loading) {
    return (
      <div className={cn(
        'min-h-screen flex items-center justify-center',
        isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'
      )}>
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className={cn(
        'min-h-screen flex items-center justify-center',
        isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'
      )}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Company not found</h2>
          <Link to="/companies" className="text-blue-500 hover:underline">
            Back to Companies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'min-h-screen transition-colors duration-300',
      isDark ? 'bg-black text-white' : 'bg-white text-black'
    )}>
      {/* Hero Section */}
      <div className={cn(
        'relative overflow-hidden py-16 px-4 md:px-8',
        isDark ? 'bg-linear-to-br from-black via-gray-900 to-black' : 'bg-linear-to-br from-white via-gray-50 to-white'
      )}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-12">
            {/* Logo and Basic Info */}
            <div className="md:col-span-1">
              <div className="mb-6">
                {company.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={company.name || 'Company Logo'}
                    className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-4xl">
                    🏢
                  </div>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
              <p className={cn(
                'text-lg mb-6',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {company.description?.slice(0, 100)}...
              </p>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={toggleFollow}
                  className={cn(
                    'px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2',
                    isFollowing
                      ? isDark
                        ? 'bg-white text-black'
                        : 'bg-black text-white'
                      : isDark
                        ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                        : 'bg-gray-100 text-black hover:bg-gray-200 border border-gray-300'
                  )}
                >
                  <Heart className={cn(
                    'w-5 h-5 transition-colors',
                    isFollowing ? 'fill-red-500 text-red-500' : ''
                  )} />
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button className={cn(
                  'px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2',
                  isDark
                    ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                    : 'bg-gray-100 text-black hover:bg-gray-200 border border-gray-300'
                )}>
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            {/* Bento Grid - Key Stats */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              {/* Large card - Top Right */}
              <div className={cn(
                'row-span-2 rounded-2xl p-6 flex flex-col justify-center',
                isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
              )}>
                <div className="text-sm font-semibold mb-2 flex items-center gap-2 opacity-70">
                  <MapPin className="w-4 h-4" />
                  Location
                </div>
                <p className="text-2xl font-bold mb-4">{company.location || 'Remote'}</p>
                <div className="text-sm opacity-70">{company.industry} • Est. {company.founded_year}</div>
              </div>

              {/* Small card 1 */}
              <div className={cn(
                'rounded-2xl p-4 flex flex-col justify-center',
                isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
              )}>
                <div className="text-sm font-semibold mb-2 opacity-70">Employees</div>
                <p className="text-2xl font-bold">{company.employee_count}+</p>
              </div>

              {/* Small card 2 */}
              <div className={cn(
                'rounded-2xl p-4 flex flex-col justify-center',
                isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
              )}>
                <div className="text-sm font-semibold mb-2 opacity-70">Rating</div>
                <p className="text-2xl font-bold">{company.rating}⭐</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid - Benefits Section */}
      <section className={cn(
        'py-24 px-4 md:px-8',
        isDark ? 'bg-black' : 'bg-white'
      )}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Join {company.company_name || 'Us'}</h2>
            <div className={cn(
              'w-24 h-1 rounded-full',
              isDark ? 'bg-white' : 'bg-black'
            )} />
          </div>

          {/* Bento Grid - Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {company.benefits?.map((benefit, idx) => (
              <div
                key={idx}
                className={cn(
                  'rounded-2xl p-6 flex flex-col justify-center',
                  idx === 0 ? 'md:col-span-2 md:row-span-2' : '',
                  isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                )}
              >
                <div className="text-3xl mb-3">{benefit.icon}</div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className={cn(
                  'text-sm',
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid - Company Values */}
      <section className={cn(
        'py-24 px-4 md:px-8',
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      )}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <div className={cn(
              'w-24 h-1 rounded-full',
              isDark ? 'bg-white' : 'bg-black'
            )} />
          </div>

          {/* Bento Grid - Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {company.values?.map((value, idx) => (
              <div
                key={idx}
                className={cn(
                  'rounded-3xl p-8 flex flex-col justify-center',
                  isDark
                    ? 'bg-black border border-gray-700 hover:border-gray-600'
                    : 'bg-white border border-gray-200 hover:border-gray-400',
                  'transition-all duration-300 hover:shadow-lg'
                )}
              >
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className={cn(
                  'text-lg',
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid - Jobs Section */}
      <section className={cn(
        'py-24 px-4 md:px-8',
        isDark ? 'bg-black' : 'bg-white'
      )}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-4">Open Positions</h2>
              <div className={cn(
                'w-24 h-1 rounded-full',
                isDark ? 'bg-white' : 'bg-black'
              )} />
            </div>
            <Link to="/jobs">
              <button className={cn(
                'px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all',
                isDark
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-black text-white hover:bg-gray-900'
              )}>
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Bento Grid - Jobs */}
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className={cn(
                    'rounded-2xl p-6 flex flex-col justify-between',
                    isDark
                      ? 'bg-gray-900 border border-gray-700 hover:border-gray-600'
                      : 'bg-gray-50 border border-gray-200 hover:border-gray-400',
                    'transition-all duration-300 hover:shadow-lg'
                  )}
                >
                  <div>
                    <h3 className="text-xl font-bold mb-3">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="flex items-center gap-1 text-sm">
                        <Briefcase className="w-4 h-4" />
                        {job.type || 'Full-time'}
                      </span>
                      <span className="flex items-center gap-1 text-sm">
                        <MapPin className="w-4 h-4" />
                        {job.location || 'Remote'}
                      </span>
                    </div>
                  </div>
                  <Link to={`/job/${job.id}`}>
                    <button className={cn(
                      'mt-4 px-4 py-2 rounded-lg font-semibold transition-all w-full',
                      isDark
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'bg-black text-white hover:bg-gray-900'
                    )}>
                      View Details
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                No open positions at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={cn(
        'py-24 px-4 md:px-8',
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      )}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Join {company.name}?
          </h2>
          <p className={cn(
            'text-xl mb-8',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            Be part of a team that's changing the future.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/jobs">
              <button className={cn(
                'px-8 py-4 rounded-lg font-semibold transition-all',
                isDark
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-black text-white hover:bg-gray-900'
              )}>
                Apply Now
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}