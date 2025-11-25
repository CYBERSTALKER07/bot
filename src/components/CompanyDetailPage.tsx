import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Heart, Share2, ArrowRight, Briefcase, Users, MapPin, Calendar, Award, TrendingUp, Code2, Globe } from 'lucide-react';
import { cn } from '../lib/cva';

interface CompanyDetailsPageProps {
  id?: string;
}

export default function CompanyDetailPage({ id: propId }: CompanyDetailsPageProps) {
  const { companyId } = useParams<{ companyId: string }>();
  const finalId = propId || companyId;
  const { isDark } = useTheme();
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock company data
  const company = {
    id: finalId,
    name: 'TechCorp',
    tagline: 'Building the Future of Technology',
    logo: '🚀',
    coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
    industry: 'Technology',
    location: 'San Francisco, CA',
    founded: 2015,
    employees: 2500,
    rating: 4.8,
    reviews: 1240,
    description: 'A cutting-edge technology company focused on innovation and excellence.',
    highlights: [
      { number: '2.5K+', label: 'Team Members' },
      { number: '50+', label: 'Countries' },
      { number: '$500M', label: 'Valuation' },
      { number: '98%', label: 'Employee Satisfaction' }
    ],
    benefits: [
      { icon: '🏥', title: 'Health Insurance', desc: 'Comprehensive coverage' },
      { icon: '💻', title: 'Remote Work', desc: 'Work from anywhere' },
      { icon: '📚', title: 'Learning Budget', desc: '$5K annually' },
      { icon: '🎯', title: 'Career Growth', desc: 'Clear progression' },
      { icon: '🌴', title: 'Unlimited PTO', desc: 'Work-life balance' },
      { icon: '🍕', title: 'Free Meals', desc: 'Daily catering' }
    ],
    values: [
      { title: 'Innovation First', description: 'We push boundaries and embrace new ideas' },
      { title: 'User Focused', description: 'Every decision is driven by user needs' },
      { title: 'Team Excellence', description: 'We celebrate and develop our people' },
      { title: 'Integrity', description: 'Honest and transparent in all dealings' }
    ],
    recentJobs: [
      { title: 'Senior Software Engineer', dept: 'Engineering', location: 'SF', applicants: 234 },
      { title: 'Product Manager', dept: 'Product', location: 'Remote', applicants: 156 },
      { title: 'UI/UX Designer', dept: 'Design', location: 'NY', applicants: 89 }
    ]
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

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
              <div className="text-7xl mb-6">{company.logo}</div>
              <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
              <p className={cn(
                'text-lg mb-6',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {company.tagline}
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
                <p className="text-2xl font-bold mb-4">{company.location}</p>
                <div className="text-sm opacity-70">{company.industry} • Est. {company.founded}</div>
              </div>

              {/* Small card 1 */}
              <div className={cn(
                'rounded-2xl p-4 flex flex-col justify-center',
                isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
              )}>
                <div className="text-sm font-semibold mb-2 opacity-70">Employees</div>
                <p className="text-2xl font-bold">{company.employees}+</p>
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
            <h2 className="text-4xl font-bold mb-4">Why Join TechCorp</h2>
            <div className={cn(
              'w-24 h-1 rounded-full',
              isDark ? 'bg-white' : 'bg-black'
            )} />
          </div>

          {/* Bento Grid - 6 items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large featured card */}
            <div className={cn(
              'md:col-span-2 md:row-span-2 rounded-3xl p-8 flex flex-col justify-center',
              isDark
                ? 'bg-linear-to-br from-gray-900 to-gray-800 border border-gray-700'
                : 'bg-linear-to-br from-gray-50 to-white border border-gray-200'
            )}>
              <div className="text-6xl mb-4">{company.benefits[0].icon}</div>
              <h3 className="text-3xl font-bold mb-3">{company.benefits[0].title}</h3>
              <p className={cn(
                'text-lg',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {company.benefits[0].desc}
              </p>
            </div>

            {/* Small cards - Row 1 */}
            <div className={cn(
              'rounded-2xl p-6 flex flex-col justify-center',
              isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
            )}>
              <div className="text-3xl mb-3">{company.benefits[1].icon}</div>
              <h3 className="font-bold text-lg mb-2">{company.benefits[1].title}</h3>
              <p className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {company.benefits[1].desc}
              </p>
            </div>

            {/* Small cards - Row 2 */}
            <div className={cn(
              'rounded-2xl p-6 flex flex-col justify-center',
              isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
            )}>
              <div className="text-3xl mb-3">{company.benefits[2].icon}</div>
              <h3 className="font-bold text-lg mb-2">{company.benefits[2].title}</h3>
              <p className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {company.benefits[2].desc}
              </p>
            </div>

            {/* Small cards - Row 3 */}
            <div className={cn(
              'rounded-2xl p-6 flex flex-col justify-center',
              isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
            )}>
              <div className="text-3xl mb-3">{company.benefits[3].icon}</div>
              <h3 className="font-bold text-lg mb-2">{company.benefits[3].title}</h3>
              <p className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {company.benefits[3].desc}
              </p>
            </div>

            {/* Small cards - Row 4 */}
            <div className={cn(
              'rounded-2xl p-6 flex flex-col justify-center',
              isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
            )}>
              <div className="text-3xl mb-3">{company.benefits[4].icon}</div>
              <h3 className="font-bold text-lg mb-2">{company.benefits[4].title}</h3>
              <p className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {company.benefits[4].desc}
              </p>
            </div>

            {/* Small cards - Row 5 */}
            <div className={cn(
              'rounded-2xl p-6 flex flex-col justify-center',
              isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
            )}>
              <div className="text-3xl mb-3">{company.benefits[5].icon}</div>
              <h3 className="font-bold text-lg mb-2">{company.benefits[5].title}</h3>
              <p className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {company.benefits[5].desc}
              </p>
            </div>
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
            {company.values.map((value, idx) => (
              <div
                key={idx}
                className={cn(
                  'rounded-3xl p-8 flex flex-col justify-center',
                  idx === 0
                    ? 'md:col-span-2'
                    : 'md:col-span-1',
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {company.recentJobs.map((job, idx) => (
              <div
                key={idx}
                className={cn(
                  'rounded-2xl p-6 flex flex-col justify-between',
                  idx === 0
                    ? 'md:col-span-2 md:row-span-1'
                    : 'md:col-span-1',
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
                      {job.dept}
                    </span>
                    <span className="flex items-center gap-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                  </div>
                  <span className={cn(
                    'inline-block px-3 py-1 rounded-full text-xs font-medium',
                    isDark
                      ? 'bg-gray-800 text-gray-300'
                      : 'bg-gray-200 text-gray-700'
                  )}>
                    {job.applicants} applicants
                  </span>
                </div>
                <button className={cn(
                  'mt-4 px-4 py-2 rounded-lg font-semibold transition-all w-full',
                  isDark
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-black text-white hover:bg-gray-900'
                )}>
                  Apply Now
                </button>
              </div>
            ))}
          </div>
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
            Be part of a team that's changing the future of technology.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className={cn(
              'px-8 py-4 rounded-lg font-semibold transition-all',
              isDark
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-black text-white hover:bg-gray-900'
            )}>
              Apply Now
            </button>
            <button className={cn(
              'px-8 py-4 rounded-lg font-semibold transition-all border-2',
              isDark
                ? 'border-white text-white hover:bg-white hover:text-black'
                : 'border-black text-black hover:bg-black hover:text-white'
            )}>
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}