import { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp,
  CalendarToday,
  LocationOn,
  AccessTime,
  Refresh,
  AutoAwesome,
  LocalCafe,
  Favorite,
  EmojiEvents,
  Star,
  Search,
  FilterAlt,
  Business,
  Work,
  Assignment,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useJobs } from '../../hooks/useJobs';
import { useTheme } from '../../context/ThemeContext';
import { StatsCard, JobCard } from '../ui/Card';
import Typography from '../ui/Typography';
import Input from '../ui/Input';
import Button from '../ui/Button';

// Register GSAP plugins
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function StudentDashboard() {
  const { jobs, loading, error } = useJobs();
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const jobsRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Filter and sort jobs
  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesType = !typeFilter || job.type === typeFilter;
      return matchesSearch && matchesLocation && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime();
        case 'salary':
          return (b.salary_range || '').localeCompare(a.salary_range || '');
        case 'company':
          return a.company.localeCompare(b.company);
        default:
          return 0;
      }
    });

  // Enhanced animations with Material Design principles
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Material Design stagger animation for stats cards
      gsap.fromTo('.stats-card', {
        scale: 0.8,
        opacity: 0,
        y: 40
      }, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.2
      });

      // Elegant job card animations
      gsap.fromTo('.job-card', {
        opacity: 0,
        y: 30,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.4
      });

      // Floating decorative elements
      gsap.to('.dashboard-sparkle', {
        y: -10,
        x: 5,
        rotation: 180,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, [filteredJobs.length]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className={`flex items-center space-x-4 p-6 rounded-2xl shadow-lg ${
            isDark ? 'bg-dark-surface border border-lime/20' : 'bg-white border border-gray-200'
          }`}>
            <Refresh className={`h-6 w-6 animate-spin ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
            <Typography variant="subtitle1" color="textPrimary">
              Finding amazing opportunities... ✨
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Decorative elements with Material Design flair */}
      <div className={`float-decoration absolute top-10 right-20 w-4 h-4 rounded-full blur-sm ${
        isDark ? 'bg-lime/30' : 'bg-asu-gold/30'
      }`}></div>
      <div className={`float-decoration absolute top-40 left-16 w-3 h-3 rounded-full blur-sm ${
        isDark ? 'bg-dark-accent/20' : 'bg-asu-maroon/20'
      }`}></div>
      <AutoAwesome className={`dashboard-sparkle absolute top-20 left-1/4 h-5 w-5 ${
        isDark ? 'text-lime/50' : 'text-asu-gold/50'
      }`} />
      <LocalCafe className={`dashboard-sparkle absolute top-60 right-1/3 h-4 w-4 ${
        isDark ? 'text-dark-accent/40' : 'text-asu-maroon/40'
      }`} />
      <Favorite className={`dashboard-sparkle absolute bottom-20 left-1/3 h-4 w-4 ${
        isDark ? 'text-lime/60' : 'text-asu-gold/60'
      }`} />

      {/* Header */}
      <div ref={headerRef} className="mb-8">
        <div className={`rounded-3xl p-8 text-white mb-8 relative overflow-hidden transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-r from-dark-surface to-dark-bg' 
            : 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark'
        }`}>
          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl ${
            isDark ? 'bg-lime/10' : 'bg-white/10'
          }`}></div>
          <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full blur-xl ${
            isDark ? 'bg-dark-accent/20' : 'bg-asu-gold/20'
          }`}></div>
          <div className="relative z-10">
            <Typography 
              variant="h4" 
              className={`font-bold mb-2 transform rotate-0.5 ${
                isDark ? 'text-dark-text' : 'text-white'
              }`}
              gutterBottom
            >
              Welcome back! 🎓
            </Typography>
            <Typography 
              variant="subtitle1" 
              className={`max-w-2xl ${
                isDark ? 'text-dark-muted' : 'text-white/90'
              }`}
            >
              Ready to discover amazing career opportunities? Let's find your perfect match from ASU's top employer partners.
            </Typography>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stats-card">
          <StatsCard
            title="Available Jobs 🚀"
            value={jobs.length}
            icon={Work}
            subtitle="New opportunities daily"
            color="primary"
            trend="up"
            trendValue="+12 this week"
            delay={0.2}
            rotation={-0.5}
          />
        </div>
        <div className="stats-card">
          <StatsCard
            title="Companies Hiring 🏢"
            value="156"
            icon={Business}
            subtitle="Top ASU partners"
            color="secondary"
            trend="up"
            trendValue="+8 new partners"
            delay={0.4}
            rotation={0.3}
          />
        </div>
        <div className="stats-card">
          <StatsCard
            title="Career Events 📅"
            value="24"
            icon={CalendarToday}
            subtitle="This month"
            color="info"
            trend="neutral"
            trendValue="5 this week"
            delay={0.6}
            rotation={-0.3}
          />
        </div>
        <div className="stats-card">
          <StatsCard
            title="My Applications 📝"
            value="7"
            icon={Assignment}
            subtitle="3 pending reviews ⏳"
            color="warning"
            trend="up"
            trendValue="+2 recent"
            delay={0.8}
            rotation={0.5}
          />
        </div>
      </div>

      {/* Filters */}
      <div ref={filtersRef} className={`rounded-3xl shadow-lg border-2 p-6 mb-8 transform rotate-0.3 transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-r from-dark-surface to-dark-bg border-lime/20' 
          : 'bg-gradient-to-r from-white to-gray-50 border-gray-100'
      }`}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search jobs, companies, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startIcon={<Search />}
              variant="outlined"
              size="medium"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
            <Input
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              startIcon={<LocationOn />}
              variant="outlined"
              size="medium"
              className="sm:w-48"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                isDark 
                  ? 'border-lime/20 bg-dark-bg text-dark-text focus:ring-lime' 
                  : 'border-gray-300 bg-white text-gray-900 focus:ring-asu-maroon'
              }`}
            >
              <option value="">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                isDark 
                  ? 'border-lime/20 bg-dark-bg text-dark-text focus:ring-lime' 
                  : 'border-gray-300 bg-white text-gray-900 focus:ring-asu-maroon'
              }`}
            >
              <option value="recent">Most Recent</option>
              <option value="salary">Salary</option>
              <option value="company">Company</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div ref={jobsRef}>
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h5" color="textPrimary" className="font-bold">
            🎯 Recommended Jobs ({filteredJobs.length})
          </Typography>
          <Button 
            variant="outlined" 
            size="small"
            startIcon={FilterAlt}
            className="hidden sm:inline-flex"
          >
            More Filters
          </Button>
        </div>

        {error && (
          <div className={`p-6 rounded-2xl border-l-4 mb-6 ${
            isDark 
              ? 'bg-red-900/20 border-red-500 text-red-300' 
              : 'bg-red-50 border-red-400 text-red-800'
          }`}>
            <Typography variant="subtitle2" className="font-medium">
              Error loading jobs: {error}
            </Typography>
          </div>
        )}

        {filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isDark ? 'bg-lime/20' : 'bg-asu-maroon/10'
            }`}>
              <Search className={`w-12 h-12 ${
                isDark ? 'text-lime' : 'text-asu-maroon'
              }`} />
            </div>
            <Typography variant="h6" color="textPrimary" className="font-bold mb-3">
              No jobs found matching your criteria
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-6 max-w-md mx-auto">
              Try adjusting your search terms or filters to discover more opportunities.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => {
                setSearchTerm('');
                setLocationFilter('');
                setTypeFilter('');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => (
              <div key={job.id} className="job-card">
                <JobCard
                  job={job}
                  onView={() => console.log('View job:', job.id)}
                  onApply={() => console.log('Apply to job:', job.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions FAB-style buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-4 z-30">
        <Button
          variant="fab"
          color="primary"
          size="large"
          className="shadow-2xl"
          title="Quick Apply"
        >
          <EmojiEvents />
        </Button>
        <Button
          variant="fab"
          color="secondary"
          size="medium"
          className="shadow-xl"
          title="Saved Jobs"
        >
          <Star />
        </Button>
      </div>
    </div>
  );
}