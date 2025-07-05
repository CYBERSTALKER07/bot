import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Dashboard,
  Work,
  Business,
  Assignment,
  Search,
  LocationOn,
  AccessTime,
  TrendingUp,
  Person,
  Bookmark,
  Notifications,
  School,
  Event,
  MenuBook
} from '@mui/icons-material';
import { useJobs } from '../../hooks/useJobs';
import { useTheme } from '../../context/ThemeContext';
import Typography from '../ui/Typography';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Card } from '../ui/Card';

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
      <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
              isDark ? 'border-lime' : 'border-asu-maroon'
            }`}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <Typography variant="h4" className="font-medium mb-2">
            Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Welcome back! Here's your career overview.
          </Typography>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6" elevation={1}>
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-lime/10 text-lime' : 'bg-asu-maroon/10 text-asu-maroon'
              }`}>
                <Work className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <Typography variant="h5" className="font-semibold">
                  {jobs.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Available Jobs
                </Typography>
              </div>
            </div>
          </Card>

          <Card className="p-6" elevation={1}>
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
              }`}>
                <Business className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <Typography variant="h5" className="font-semibold">
                  156
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Companies
                </Typography>
              </div>
            </div>
          </Card>

          <Card className="p-6" elevation={1}>
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'
              }`}>
                <Assignment className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <Typography variant="h5" className="font-semibold">
                  7
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Applications
                </Typography>
              </div>
            </div>
          </Card>

          <Card className="p-6" elevation={1}>
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'
              }`}>
                <Bookmark className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <Typography variant="h5" className="font-semibold">
                  12
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Saved Jobs
                </Typography>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mb-8" elevation={1}>
          <Typography variant="h6" className="font-medium mb-4">
            Quick Actions
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/jobs">
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<Search />}
                className="justify-start h-12"
              >
                Search Jobs
              </Button>
            </Link>
            <Link to="/events">
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<Event />}
                className="justify-start h-12"
              >
                Career Events
              </Button>
            </Link>
            <Link to="/resources">
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<MenuBook />}
                className="justify-start h-12"
              >
                Resources
              </Button>
            </Link>
          </div>
        </Card>

        {/* Search and Filters */}
        <Card className="p-6 mb-8" elevation={1}>
          <Typography variant="h6" className="font-medium mb-4">
            Find Opportunities
          </Typography>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search jobs or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startIcon={<Search />}
                variant="outlined"
                fullWidth
              />
            </div>
            <div className="flex gap-4">
              <Input
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                startIcon={<LocationOn />}
                variant="outlined"
                className="w-48"
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  isDark 
                    ? 'border-gray-600 bg-dark-surface text-dark-text focus:ring-lime' 
                    : 'border-gray-300 bg-white text-gray-900 focus:ring-asu-maroon'
                }`}
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
            <Typography variant="h5" className="font-medium">
              Recommended for You
            </Typography>
            <Link to="/jobs">
              <Button variant="text" color="primary">
                View All Jobs
              </Button>
            </Link>
          </div>

          {error && (
            <Card className="p-6 mb-6 border-l-4 border-red-500" elevation={1}>
              <Typography variant="body1" className="text-red-600">
                Error loading jobs: {error}
              </Typography>
            </Card>
          )}

          {filteredJobs.length === 0 ? (
            <Card className="p-12 text-center" elevation={1}>
              <Work className={`h-16 w-16 mx-auto mb-4 ${
                isDark ? 'text-dark-muted' : 'text-gray-400'
              }`} />
              <Typography variant="h6" className="mb-2">
                No jobs found
              </Typography>
              <Typography variant="body1" color="textSecondary" className="mb-4">
                Try adjusting your search criteria or check back later
              </Typography>
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
                <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow" elevation={1}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Typography variant="h6" className="font-medium mb-1">
                        {job.title}
                      </Typography>
                      <Typography variant="subtitle1" color="primary" className="font-medium">
                        {job.company}
                      </Typography>
                    </div>
                    <Button variant="text" size="small" className="min-w-0 p-2">
                      <Bookmark className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className={`flex items-center text-sm ${
                      isDark ? 'text-dark-muted' : 'text-gray-600'
                    }`}>
                      <LocationOn className="h-4 w-4 mr-2" />
                      {job.location}
                    </div>
                    <div className={`flex items-center text-sm ${
                      isDark ? 'text-dark-muted' : 'text-gray-600'
                    }`}>
                      <AccessTime className="h-4 w-4 mr-2" />
                      {job.type}
                    </div>
                    {job.salary_range && (
                      <div className={`flex items-center text-sm ${
                        isDark ? 'text-dark-muted' : 'text-gray-600'
                      }`}>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        {job.salary_range}
                      </div>
                    )}
                  </div>

                  <Typography variant="body2" color="textSecondary" className="mb-4 line-clamp-3">
                    {job.description}
                  </Typography>

                  <div className="flex gap-2">
                    <Button variant="contained" size="small" fullWidth>
                      Apply Now
                    </Button>
                    <Button variant="outlined" size="small" fullWidth>
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