import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Loader2,
  Building2,
  Star,
  TrendingUp,
  Calendar,
  Award,
  Sparkles,
  Coffee,
  Heart
} from 'lucide-react';
import { useJobs } from '../../hooks/useJobs';
import { StatsCard, JobCard } from '../ui/Card';

// Register GSAP plugins
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function StudentDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const { jobs, loading } = useJobs();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation - scale from small to big
      gsap.from(headerRef.current, {
        duration: 1.5,
        scale: 0.5,
        opacity: 0,
        ease: 'elastic.out(1, 0.8)',
        rotation: 2
      });

      // Filters animation
      gsap.from(filtersRef.current, {
        duration: 1,
        y: 50,
        opacity: 0,
        scale: 0.8,
        ease: 'back.out(1.7)',
        delay: 0.8,
        rotation: -1
      });

      // Floating decorative elements
      gsap.to('.float-decoration', {
        y: (index) => -10 + (index * 2),
        x: (index) => 5 - (index * 2),
        rotation: (index) => 360 * (index % 2 === 0 ? 1 : -1),
        duration: (index) => 4 + index,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });

      // Sparkle animations
      gsap.to('.dashboard-sparkle', {
        scale: (index) => 1.2 + (index * 0.1),
        opacity: (index) => 0.4 + (index * 0.1),
        rotation: (index) => 360 * (index % 2 === 0 ? 1 : -1),
        duration: (index) => 2 + index,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !typeFilter || job.type === typeFilter;
    return matchesSearch && matchesLocation && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="flex items-center space-x-3 bg-white rounded-full px-8 py-4 shadow-lg border transform rotate-1">
          <Loader2 className="h-6 w-6 animate-spin text-asu-maroon" />
          <span className="text-gray-700 font-medium">Finding amazing opportunities... ✨</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Decorative elements */}
      <div className="float-decoration absolute top-10 right-20 w-4 h-4 bg-asu-gold/30 rounded-full blur-sm"></div>
      <div className="float-decoration absolute top-40 left-16 w-3 h-3 bg-asu-maroon/20 rounded-full blur-sm"></div>
      <Sparkles className="dashboard-sparkle absolute top-20 left-1/4 h-5 w-5 text-asu-gold/50" />
      <Coffee className="dashboard-sparkle absolute top-60 right-1/3 h-4 w-4 text-asu-maroon/40" />
      <Heart className="dashboard-sparkle absolute bottom-20 left-1/3 h-4 w-4 text-asu-gold/60" />

      {/* Header */}
      <div ref={headerRef} className="mb-8">
        <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-3xl p-8 text-white relative overflow-hidden transform -rotate-0.5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2 transform rotate-0.5 text-white">Welcome Back! 👋</h1>
            <p className="text-xl text-white/90 mb-4">Ready to find your next amazing opportunity? 🚀</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 transform rotate-1">
                <TrendingUp className="h-5 w-5 text-white" />
                <span className="text-white font-medium">52 new jobs this week! 📈</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 transform -rotate-1">
                <Award className="h-5 w-5 text-white" />
                <span className="text-white font-medium">95% placement rate 🏆</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 transform rotate-0.5">
                <Star className="h-5 w-5 text-white" />
                <span className="text-white font-medium">Top companies hiring 🌟</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Jobs 💼"
          value={jobs.length}
          icon={Search}
          subtitle="+12% this week 📊"
          color="blue"
          delay={0.2}
          rotation={1}
        />
        <StatsCard
          title="Internships 🎓"
          value={jobs.filter(job => job.type === 'internship').length}
          icon={Calendar}
          subtitle="High demand 🔥"
          color="green"
          delay={0.4}
          rotation={-1}
        />
        <StatsCard
          title="Remote Jobs 🏠"
          value={jobs.filter(job => job.location.toLowerCase().includes('remote')).length}
          icon={MapPin}
          subtitle="Trending up 🚀"
          color="purple"
          delay={0.6}
          rotation={0.5}
        />
        <StatsCard
          title="My Applications 📝"
          value={7}
          icon={Building2}
          subtitle="3 pending reviews ⏳"
          color="asu-maroon"
          delay={0.8}
          rotation={-0.5}
        />
      </div>

      {/* Filters */}
      <div ref={filtersRef} className="bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-lg border-2 border-gray-100 p-6 mb-8 transform rotate-0.3">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search for your dream job... 🔍"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-asu-maroon bg-white shadow-inner transition-all duration-200 hover:shadow-md text-gray-900 placeholder-gray-500"
              aria-label="Search jobs"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-asu-maroon bg-white shadow-inner cursor-pointer hover:shadow-md transition-all duration-200 text-gray-900"
                aria-label="Filter by location"
              >
                <option value="">All Locations 🌍</option>
                <option value="remote">Remote 💻</option>
                <option value="arizona">Arizona 🌵</option>
                <option value="california">California ☀️</option>
                <option value="new york">New York 🗽</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-asu-maroon bg-white shadow-inner cursor-pointer hover:shadow-md transition-all duration-200 text-gray-900"
                aria-label="Filter by job type"
              >
                <option value="">All Types 📋</option>
                <option value="internship">Internships 🎓</option>
                <option value="full-time">Full-time 💼</option>
                <option value="part-time">Part-time ⏰</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredJobs.map((job, index) => (
          <JobCard
            key={job.id}
            job={{
              ...job,
              applicants_count: job.applicants_count || 0
            }}
            index={index}
            onBookmark={() => console.log('Bookmark', job.id)}
            onApply={() => console.log('Apply', job.id)}
          />
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg border-2 border-gray-100">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">No jobs found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Try adjusting your search criteria or check back later for new opportunities.
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setLocationFilter('');
              setTypeFilter('');
            }}
            className="bg-asu-maroon text-white px-6 py-3 rounded-lg hover:bg-asu-maroon-dark transition-colors font-medium"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}