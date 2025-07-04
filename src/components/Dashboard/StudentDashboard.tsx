import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users,
  BookmarkPlus,
  ExternalLink,
  Loader2,
  Building2,
  Star,
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';
import { useJobs } from '../../hooks/useJobs';
import { Job } from '../../types';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function StudentDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const jobsRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');
  const { jobs, loading } = useJobs();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation with welcome message
      gsap.from(headerRef.current, {
        duration: 1.2,
        y: -60,
        opacity: 0,
        ease: 'power3.out'
      });

      // Enhanced stats cards animation
      gsap.from('.dashboard-stat', {
        duration: 0.8,
        y: 40,
        opacity: 0,
        scale: 0.9,
        ease: 'back.out(1.7)',
        stagger: 0.15,
        delay: 0.3
      });

      // Filters animation
      gsap.from(filtersRef.current, {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: 'power2.out',
        delay: 0.6
      });

      // Job cards scroll trigger animation
      ScrollTrigger.create({
        trigger: jobsRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.from('.job-card', {
            duration: 0.6,
            y: 50,
            opacity: 0,
            scale: 0.95,
            ease: 'power2.out',
            stagger: 0.1
          });
        }
      });

      // Enhanced hover animations for job cards
      gsap.utils.toArray('.job-card').forEach((card: any) => {
        const tl = gsap.timeline({ paused: true });
        tl.to(card, {
          y: -8,
          scale: 1.02,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          duration: 0.4,
          ease: 'power2.out'
        });

        card.addEventListener('mouseenter', () => tl.play());
        card.addEventListener('mouseleave', () => tl.reverse());
      });

      // Animate bookmark buttons
      gsap.utils.toArray('.bookmark-btn').forEach((btn: any) => {
        const tl = gsap.timeline({ paused: true });
        tl.to(btn, {
          scale: 1.2,
          rotation: 10,
          duration: 0.3,
          ease: 'back.out(1.7)'
        });

        btn.addEventListener('mouseenter', () => tl.play());
        btn.addEventListener('mouseleave', () => tl.reverse());
      });

      // Animate skill tags
      gsap.from('.skill-tag', {
        duration: 0.6,
        scale: 0,
        opacity: 0,
        ease: 'elastic.out(1, 0.3)',
        stagger: 0.05,
        delay: 1.2
      });

      // Animate company logos
      gsap.from('.company-logo', {
        duration: 0.8,
        scale: 0,
        rotation: 180,
        opacity: 0,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        delay: 1
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !typeFilter || job.type === typeFilter;
    const matchesSalary = !salaryFilter; // Implement salary filtering logic as needed
    
    return matchesSearch && matchesLocation && matchesType && matchesSalary;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-asu-maroon" />
          <span className="text-gray-600">Loading opportunities...</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Enhanced Header */}
      <div ref={headerRef} className="mb-8">
        <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Welcome Back! 👋</h1>
          <p className="text-xl text-gray-200 mb-4">Ready to find your next opportunity?</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>52 new jobs this week</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>95% placement rate</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Top companies hiring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Dashboard */}
      <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="dashboard-stat bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-600 text-sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+12% this week</span>
          </div>
        </div>

        <div className="dashboard-stat bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Internships</p>
              <p className="text-3xl font-bold text-gray-900">{jobs.filter(job => job.type === 'internship').length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-600 text-sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>High demand</span>
          </div>
        </div>

        <div className="dashboard-stat bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Remote Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{jobs.filter(job => job.location.toLowerCase().includes('remote')).length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-600 text-sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>Trending up</span>
          </div>
        </div>

        <div className="dashboard-stat bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">My Applications</p>
              <p className="text-3xl font-bold text-gray-900">7</p>
            </div>
            <div className="w-12 h-12 bg-asu-maroon/10 rounded-full flex items-center justify-center">
              <Building2 className="h-6 w-6 text-asu-maroon" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-600 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>3 pending reviews</span>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div ref={filtersRef} className="bg-white rounded-xl shadow-lg border p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
              >
                <option value="">All Locations</option>
                <option value="remote">Remote</option>
                <option value="arizona">Arizona</option>
                <option value="california">California</option>
                <option value="new york">New York</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="internship">Internships</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Jobs Grid */}
      <div ref={jobsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card bg-white rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="company-logo w-12 h-12 bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{job.company}</h3>
                    <p className="text-sm text-gray-600">Verified Employer</p>
                  </div>
                </div>
                <button className="bookmark-btn p-2 text-gray-400 hover:text-asu-maroon transition-colors">
                  <BookmarkPlus className="h-5 w-5" />
                </button>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">{job.title}</h2>
              
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(job.posted_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{job.applicants_count} applicants</span>
                </div>
              </div>

              {job.salary && (
                <div className="flex items-center space-x-1 mb-4 text-green-600 font-semibold">
                  <DollarSign className="h-4 w-4" />
                  <span>{job.salary}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`skill-tag px-3 py-1 rounded-full text-sm font-medium ${
                  job.type === 'internship' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {job.type}
                </span>
                {job.skills.slice(0, 2).map((skill, index) => (
                  <span 
                    key={index}
                    className="skill-tag px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 2 && (
                  <span className="skill-tag px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    +{job.skills.length - 2} more
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                {job.description}
              </p>

              <div className="flex space-x-3">
                <Link
                  to={`/job/${job.id}`}
                  className="flex-1 bg-asu-maroon text-white px-4 py-2 rounded-lg hover:bg-asu-maroon-dark transition-colors text-center font-medium"
                >
                  View Details
                </Link>
                <button className="px-4 py-2 border border-asu-maroon text-asu-maroon rounded-lg hover:bg-asu-maroon hover:text-white transition-colors flex items-center space-x-1">
                  <ExternalLink className="h-4 w-4" />
                  <span>Apply</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg border">
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
              setSalaryFilter('');
            }}
            className="bg-asu-maroon text-white px-6 py-3 rounded-lg hover:bg-asu-maroon-dark transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}