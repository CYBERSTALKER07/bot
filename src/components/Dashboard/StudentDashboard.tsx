import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3,
  Briefcase,
  Building2,
  FileText,
  Search,
  MapPin,
  Clock,
  TrendingUp,
  User,
  Bookmark,
  Bell,
  GraduationCap,
  Calendar,
  BookOpen
} from 'lucide-react';
import { useJobs } from '../../hooks/useJobs';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, StatsCard } from '../ui/Card';
import { cn } from '../../lib/cva';

export default function StudentDashboard() {
  const { jobs, loading, error } = useJobs();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesType = !typeFilter || job.type === typeFilter;
      return matchesSearch && matchesLocation && matchesType;
    })
    .slice(0, 12);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
       

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Available Jobs"
            value={jobs.length.toString()}
            icon={Briefcase}
            color="primary"
            animated
            delay={0.1}
          />
          
          <StatsCard
            title="Companies"
            value="156"
            icon={Building2}
            color="info"
            animated
            delay={0.2}
          />
          
          <StatsCard
            title="Applications"
            value="7"
            icon={FileText}
            color="success"
            animated
            delay={0.3}
          />
          
          <StatsCard
            title="Saved Jobs"
            value="12"
            icon={Bookmark}
            color="warning"
            animated
            delay={0.4}
          />
        </div>

        {/* Quick Actions */}
        <Card variant="elevated" padding="large" className="mb-8">
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-lime' : 'text-gray-900'}`}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/jobs">
              <Button 
                variant="outlined" 
                fullWidth 
                leftIcon={<Search className="h-4 w-4 " />}
                className="justify-start h-12 text-left"
              >
                Search Jobs
              </Button>
            </Link>
            <Link to="/events">
              <Button 
                variant="outlined" 
                fullWidth 
                leftIcon={<Calendar className="h-4 w-4" />}
                className="justify-start h-12 text-left"
              >
                Career Events
              </Button>
            </Link>
            <Link to="/resources">
              <Button 
                variant="outlined" 
                fullWidth 
                leftIcon={<BookOpen className="h-4 w-4" />}
                className="justify-start h-12 text-left"
              >
                Resources
              </Button>
            </Link>
          </div>
        </Card>

        {/* Search and Filters */}
        <Card variant="elevated" padding="large" className="mb-8">
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
            Find Opportunities
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search jobs or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startIcon={<Search className="h-4 w-4" />}
                variant="default"
                fullWidth
              />
            </div>
            <div className="flex gap-4">
              <Input
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                startIcon={<MapPin className="h-4 w-4" />}
                variant="default"
                className="w-48"
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={cn(
                  "px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                  isDark 
                    ? "border-gray-600 bg-dark-surface text-dark-text focus:ring-lime focus:border-lime" 
                    : "border-gray-300 bg-white text-gray-900 focus:ring-asu-maroon focus:border-asu-maroon"
                )}
              >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Jobs Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-semibold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
              Recommended for You
            </h2>
            <Link to="/jobs">
              <Button variant="ghost" className={isDark ? 'text-lime' : 'text-asu-maroon'}>
                View All Jobs
              </Button>
            </Link>
          </div>

          {error && (
            <Card variant="outlined" padding="large" className="mb-6 border-l-4 border-red-500">
              <p className="text-red-600 font-medium">
                Error loading jobs: {error}
              </p>
            </Card>
          )}

          {filteredJobs.length === 0 ? (
            <Card variant="elevated" padding="large" className="text-center">
              <Briefcase className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-dark-muted' : 'text-gray-400'}`} />
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                No jobs found
              </h3>
              <p className={`mb-6 ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                Try adjusting your search criteria or check back later
              </p>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setSearchTerm('');
                  setLocationFilter('');
                  setTypeFilter('');
                }}
              >
                Clear Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} variant="elevated" padding="large" interactive className="group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold mb-1 group-hover:${isDark ? 'text-lime' : 'text-asu-maroon'} transition-colors ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                        {job.title}
                      </h3>
                      <p className={`font-medium ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>
                        {job.company}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className={`${isDark ? 'text-dark-muted hover:text-lime' : 'text-gray-400 hover:text-asu-maroon'}`}>
                      <Bookmark className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className={`flex items-center text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                      <MapPin className="h-4 w-4 mr-2" />
                      {job.location}
                    </div>
                    <div className={`flex items-center text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                      <Clock className="h-4 w-4 mr-2" />
                      {job.type}
                    </div>
                    {job.salary_range && (
                      <div className={`flex items-center text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        {job.salary_range}
                      </div>
                    )}
                  </div>

                  <p className={`text-sm mb-4 line-clamp-3 ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                    {job.description}
                  </p>

                  <div className="flex gap-2">
                    <Button variant="filled" size="sm" fullWidth>
                      Apply Now
                    </Button>
                    <Button variant="outlined" size="sm" fullWidth>
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}