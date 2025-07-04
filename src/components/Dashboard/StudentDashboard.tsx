import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users,
  BookmarkPlus,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useJobs } from '../../hooks/useJobs';
import { Job } from '../../types';

export default function StudentDashboard() {
  const { jobs, loading, error } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    location: 'all',
    remote: false
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filters.type === 'all' || job.type === filters.type;
    
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'internship':
        return 'bg-blue-100 text-blue-800';
      case 'full-time':
        return 'bg-green-100 text-green-800';
      case 'part-time':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatType = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-asu-maroon" />
          <span className="ml-2 text-gray-600">Loading opportunities...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          Error loading jobs: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Opportunity</h1>
        <p className="text-gray-600">Discover internships and jobs tailored for ASU students</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block mt-4 pt-4 border-t`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="internship">Internships</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
              >
                <option value="all">All Locations</option>
                <option value="phoenix">Phoenix, AZ</option>
                <option value="tempe">Tempe, AZ</option>
                <option value="scottsdale">Scottsdale, AZ</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.remote}
                  onChange={(e) => setFilters(prev => ({ ...prev, remote: e.target.checked }))}
                  className="w-4 h-4 text-asu-maroon border-gray-300 rounded focus:ring-asu-maroon"
                />
                <span className="text-sm text-gray-700">Remote OK</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredJobs.length} of {jobs.length} opportunities
        </p>
      </div>

      {/* Job Listings */}
      <div className="space-y-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        <Link 
                          to={`/job/${job.id}`}
                          className="hover:text-asu-maroon transition-colors"
                        >
                          {job.title}
                        </Link>
                      </h3>
                      <p className="text-lg text-gray-700 font-medium">{job.company}</p>
                    </div>
                    <button className="text-gray-400 hover:text-asu-maroon transition-colors">
                      <BookmarkPlus className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location || 'Location TBD'}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{job.salary}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Posted {new Date(job.posted_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{job.applicants_count || 0} applicants</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {job.description.substring(0, 200)}...
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(job.type)}`}>
                      {formatType(job.type)}
                    </span>
                    {job.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 lg:ml-6 mt-4 lg:mt-0">
                  <Link
                    to={`/job/${job.id}`}
                    className="bg-asu-maroon text-white px-6 py-2 rounded-md hover:bg-asu-maroon-dark transition-colors text-center flex items-center justify-center space-x-2"
                  >
                    <span>View Details</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <button className="border border-asu-maroon text-asu-maroon px-6 py-2 rounded-md hover:bg-asu-maroon hover:text-white transition-colors">
                    Quick Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
}