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
  Award,
  Sparkles,
  Coffee,
  Heart,
  Smile,
  Zap
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
      // More organic header animation with slight rotation
      gsap.from(headerRef.current, {
        duration: 1.5,
        y: -80,
        opacity: 0,
        ease: 'power3.out',
        rotation: 1.5
      });

      // Asymmetrical stats cards animation with varied timing
      gsap.from('.dashboard-stat', {
        duration: (index) => 0.8 + (index * 0.1),
        y: (index) => 40 + (index * 8),
        opacity: 0,
        scale: 0.85,
        ease: 'back.out(1.7)',
        stagger: 0.18,
        delay: 0.4,
        rotation: (index) => (index % 2 === 0 ? 2 : -2)
      });

      // Natural filters animation
      gsap.from(filtersRef.current, {
        duration: 1,
        y: 35,
        opacity: 0,
        ease: 'power2.out',
        delay: 0.8,
        rotation: -0.5
      });

      // Organic job cards scroll trigger animation
      ScrollTrigger.create({
        trigger: jobsRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.from('.job-card', {
            duration: 0.8,
            y: (index) => 50 + (index * 10),
            opacity: 0,
            scale: 0.92,
            ease: 'power2.out',
            stagger: 0.12,
            rotation: (index) => (index % 2 === 0 ? 1 : -1)
          });
        }
      });

      // Enhanced organic hover animations for job cards
      gsap.utils.toArray('.job-card').forEach((card: any, index) => {
        const tl = gsap.timeline({ paused: true });
        const randomRotation = (Math.random() - 0.5) * 3;
        tl.to(card, {
          y: -12,
          scale: 1.03,
          rotation: randomRotation,
          boxShadow: '0 25px 50px -12px rgba(139, 29, 64, 0.15)',
          duration: 0.4,
          ease: 'power2.out'
        });

        card.addEventListener('mouseenter', () => tl.play());
        card.addEventListener('mouseleave', () => tl.reverse());
      });

      // Playful bookmark button animations
      gsap.utils.toArray('.bookmark-btn').forEach((btn: any) => {
        const tl = gsap.timeline({ paused: true });
        tl.to(btn, {
          scale: 1.25,
          rotation: 15,
          duration: 0.3,
          ease: 'back.out(1.7)'
        });

        btn.addEventListener('mouseenter', () => tl.play());
        btn.addEventListener('mouseleave', () => tl.reverse());
      });

      // Organic skill tags animation
      gsap.from('.skill-tag', {
        duration: 0.8,
        scale: 0,
        opacity: 0,
        ease: 'elastic.out(1, 0.4)',
        stagger: () => 0.03 + Math.random() * 0.05,
        delay: 1.4
      });

      // Natural company logos animation
      gsap.from('.company-logo', {
        duration: 1,
        scale: 0,
        rotation: (index) => 180 + (index * 30),
        opacity: 0,
        ease: 'back.out(1.7)',
        stagger: 0.15,
        delay: 1.2
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

      // Sparkle animations with random variations
      gsap.to('.dashboard-sparkle', {
        scale: () => 0.8 + Math.random() * 0.6,
        opacity: () => 0.3 + Math.random() * 0.7,
        duration: () => 1.5 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        stagger: () => Math.random() * 0.8
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="flex items-center space-x-3 bg-white rounded-full px-8 py-4 shadow-lg border transform rotate-1">
          <Loader2 className="h-6 w-6 animate-spin text-asu-maroon" />
          <span className="text-gray-600 font-medium">Finding amazing opportunities... ✨</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Organic decorative elements */}
      <div className="float-decoration absolute top-10 right-20 w-4 h-4 bg-asu-gold/30 rounded-full blur-sm"></div>
      <div className="float-decoration absolute top-40 left-16 w-3 h-3 bg-asu-maroon/20 rounded-full blur-sm"></div>
      <Sparkles className="dashboard-sparkle absolute top-20 left-1/4 h-5 w-5 text-asu-gold/50" />
      <Coffee className="dashboard-sparkle absolute top-60 right-1/3 h-4 w-4 text-asu-maroon/40" />
      <Heart className="dashboard-sparkle absolute bottom-20 left-1/3 h-4 w-4 text-asu-gold/60" />

      {/* More organic header */}
      <div ref={headerRef} className="mb-8">
        <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-3xl p-8 text-white relative overflow-hidden transform -rotate-0.5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2 transform rotate-0.5">Welcome Back! 👋</h1>
            <p className="text-xl text-gray-200 mb-4">Ready to find your next amazing opportunity? 🚀</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1 transform rotate-1">
                <TrendingUp className="h-5 w-5" />
                <span>52 new jobs this week! 📈</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1 transform -rotate-1">
                <Award className="h-5 w-5" />
                <span>95% placement rate 🏆</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1 transform rotate-0.5">
                <Star className="h-5 w-5" />
                <span>Top companies hiring 🌟</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Organic stats dashboard */}
      <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="dashboard-stat bg-white rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 transform rotate-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Jobs 💼</p>
              <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center transform rotate-12">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-600 text-sm bg-green-50 rounded-full px-3 py-1 w-fit">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+12% this week 📊</span>
          </div>
        </div>

        <div className="dashboard-stat bg-white rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 transform -rotate-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Internships 🎓</p>
              <p className="text-3xl font-bold text-gray-900">{jobs.filter(job => job.type === 'internship').length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center transform -rotate-12">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-600 text-sm bg-green-50 rounded-full px-3 py-1 w-fit">
            <Zap className="h-4 w-4 mr-1" />
            <span>High demand 🔥</span>
          </div>
        </div>

        <div className="dashboard-stat bg-white rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 transform rotate-0.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Remote Jobs 🏠</p>
              <p className="text-3xl font-bold text-gray-900">{jobs.filter(job => job.location.toLowerCase().includes('remote')).length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center transform rotate-45">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-purple-600 text-sm bg-purple-50 rounded-full px-3 py-1 w-fit">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>Trending up 🚀</span>
          </div>
        </div>

        <div className="dashboard-stat bg-white rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 transform -rotate-0.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">My Applications 📝</p>
              <p className="text-3xl font-bold text-gray-900">7</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-asu-maroon/10 to-asu-maroon/20 rounded-full flex items-center justify-center transform -rotate-45">
              <Building2 className="h-6 w-6 text-asu-maroon" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-600 text-sm bg-blue-50 rounded-full px-3 py-1 w-fit">
            <Clock className="h-4 w-4 mr-1" />
            <span>3 pending reviews ⏳</span>
          </div>
        </div>
      </div>

      {/* Organic filters */}
      <div ref={filtersRef} className="bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-lg border-2 border-gray-100 p-6 mb-8 transform rotate-0.3">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for your dream job... 🔍"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner transition-all duration-200 hover:shadow-md"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner cursor-pointer hover:shadow-md transition-all duration-200"
              >
                <option value="">All Locations 🌍</option>
                <option value="remote">Remote 💻</option>
                <option value="arizona">Arizona 🌵</option>
                <option value="california">California ☀️</option>
                <option value="new york">New York 🗽</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner cursor-pointer hover:shadow-md transition-all duration-200"
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

      {/* Organic jobs grid */}
      <div ref={jobsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredJobs.map((job, index) => {
          const cardRotations = ['rotate-1', '-rotate-1', 'rotate-0.5', '-rotate-0.5', 'rotate-1.5', '-rotate-1.5'];
          return (
            <div key={job.id} className={`job-card bg-white rounded-3xl shadow-lg border-2 border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden ${cardRotations[index % cardRotations.length]}`}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`company-logo w-14 h-14 bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-2xl flex items-center justify-center shadow-lg transform ${index % 2 === 0 ? 'rotate-3' : '-rotate-3'}`}>
                      <Building2 className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 leading-tight">{job.company}</h3>
                      <p className="text-sm text-gray-600 flex items-center">
                        Verified Employer ✅
                      </p>
                    </div>
                  </div>
                  <button className="bookmark-btn p-3 text-gray-400 hover:text-asu-maroon transition-colors bg-gray-50 rounded-full hover:bg-asu-maroon/10">
                    <BookmarkPlus className="h-5 w-5" />
                  </button>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">{job.title}</h2>
                
                <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1 rounded-full">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1 rounded-full">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(job.posted_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1 rounded-full">
                    <Users className="h-4 w-4" />
                    <span>{job.applicants_count} applicants</span>
                  </div>
                </div>

                {job.salary && (
                  <div className="flex items-center space-x-1 mb-4 text-green-600 font-semibold bg-green-50 px-3 py-2 rounded-full w-fit">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary} 💰</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`skill-tag px-4 py-2 rounded-full text-sm font-medium shadow-sm transform hover:scale-105 transition-transform duration-200 ${
                    job.type === 'internship' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {job.type} {job.type === 'internship' ? '🎓' : '💼'}
                  </span>
                  {job.skills.slice(0, 2).map((skill, skillIndex) => (
                    <span 
                      key={skillIndex}
                      className="skill-tag px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-sm font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 2 && (
                    <span className="skill-tag px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">
                      +{job.skills.length - 2} more ✨
                    </span>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex space-x-3">
                  <Link
                    to={`/job/${job.id}`}
                    className="flex-1 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-6 py-3 rounded-2xl hover:from-asu-maroon-dark hover:to-asu-maroon transition-all duration-300 text-center font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    View Details 👁️
                  </Link>
                  <button className="px-6 py-3 border-2 border-asu-maroon text-asu-maroon rounded-2xl hover:bg-asu-maroon hover:text-white transition-all duration-300 flex items-center space-x-2 font-medium shadow-sm hover:shadow-md transform hover:scale-105">
                    <ExternalLink className="h-4 w-4" />
                    <span>Apply</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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