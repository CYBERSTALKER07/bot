import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search,
  TrendingUp,
  MapPin,
  Clock,
  Building2,
  Briefcase,
  Calendar,
  BookOpen,
  Users,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  MoreHorizontal,
  Sparkles,
  ChevronRight,
  Star
} from 'lucide-react';
import { useJobs } from '../../hooks/useJobs';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card } from '../ui/Card';
import PageLayout from '../ui/PageLayout';
import { cn } from '../../lib/cva';

export default function StudentDashboard() {
  const { jobs, loading, error } = useJobs();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .slice(0, 6);

  // Mock trending topics and suggestions
  const trendingTopics = [
    { tag: '#TechJobs', posts: '45.2K posts' },
    { tag: '#RemoteWork', posts: '32.1K posts' },
    { tag: '#Internships', posts: '28.5K posts' },
    { tag: '#CareerTips', posts: '19.8K posts' },
    { tag: '#Networking', posts: '15.3K posts' }
  ];

  const suggestedUsers = [
    { name: 'Career Coach Pro', handle: '@careercoach', verified: true },
    { name: 'Tech Recruiter', handle: '@techrecruiter', verified: false },
    { name: 'Industry Insider', handle: '@industryexpert', verified: true }
  ];

  const recentActivity = [
    { type: 'application', company: 'Google', position: 'Software Engineer', time: '2h' },
    { type: 'saved', company: 'Microsoft', position: 'Product Manager', time: '5h' },
    { type: 'viewed', company: 'Apple', position: 'UX Designer', time: '1d' }
  ];

  if (loading) {
    return (
      <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'}>
        <div className="flex justify-center items-center h-screen">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
            isDark ? 'border-white' : 'border-black'
          }`}></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      className={isDark ? 'bg-black text-white' : 'bg-white text-black'}
      maxWidth="7xl"
      padding="none"
    >
      {/* X-Style Three Column Layout */}
      <div className="flex">
        
        {/* Main Content - Center Column */}
        <div className="flex-1 max-w-4xl mx-auto border-x border-gray-800 dark:border-gray-200">
          {/* Header */}
          <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${
            isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
          }`}>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <h1 className="text-xl font-bold">Dashboard</h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your career hub
                </p>
              </div>
              <Button variant="ghost" size="sm" className="p-2">
                <Sparkles className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className={`border-b p-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{jobs.length}</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">7</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Applied</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">3</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Interviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">12</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Saved</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="p-4">
              <h2 className="font-bold text-lg mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50/5 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'application' ? 'bg-blue-500' :
                        activity.type === 'saved' ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                      <div>
                        <p className="font-medium">{activity.position} at {activity.company}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {activity.type === 'application' ? 'Applied' :
                           activity.type === 'saved' ? 'Saved job' : 'Viewed'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Jobs */}
          <div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Recommended for You</h2>
                <Link to="/jobs" className="text-blue-500 hover:underline text-sm">
                  View all
                </Link>
              </div>
              
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div key={job.id} className={`p-4 rounded-lg border hover:bg-gray-50/5 transition-colors cursor-pointer ${
                    isDark ? 'border-gray-800' : 'border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{job.title}</h3>
                        <p className="text-blue-500 font-medium mb-2">{job.company}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{job.type}</span>
                          </div>
                          {job.salary_range && (
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="h-4 w-4" />
                              <span>{job.salary_range}</span>
                            </div>
                          )}
                        </div>
                        <p className={`text-sm line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {job.description}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-2">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="flex items-center space-x-2 p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-2 p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outlined" size="sm" className="rounded-full border-gray-300 hover:bg-gray-100">
                          Save
                        </Button>
                        <Button className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-6">
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - X Style */}
        <div className="hidden lg:block w-80 p-4 space-y-4">
          
          {/* Search */}
          <div className={`sticky top-4 p-3 rounded-2xl ${
            isDark ? 'bg-gray-900' : 'bg-gray-100'
          }`}>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search jobs, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-2xl bg-transparent border-none outline-none text-lg ${
                  isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
                }`}
              />
            </div>
          </div>

          {/* Trending */}
          <div className={`rounded-2xl p-4 ${
            isDark ? 'bg-gray-900' : 'bg-gray-100'
          }`}>
            <h2 className="text-xl font-bold mb-4">What's trending</h2>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-500/10 cursor-pointer transition-colors">
                  <div>
                    <p className="font-bold">{topic.tag}</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {topic.posts}
                    </p>
                  </div>
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-3 text-blue-500 justify-start p-2">
              Show more
            </Button>
          </div>

          {/* Who to follow */}
          <div className={`rounded-2xl p-4 ${
            isDark ? 'bg-gray-900' : 'bg-gray-100'
          }`}>
            <h2 className="text-xl font-bold mb-4">Who to follow</h2>
            <div className="space-y-3">
              {suggestedUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-gray-800' : 'bg-gray-200'
                    }`}>
                      <span className="text-lg">👤</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        <p className="font-bold text-sm">{user.name}</p>
                        {user.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user.handle}
                      </p>
                    </div>
                  </div>
                  <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-4 py-1 text-sm font-bold">
                    Follow
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-3 text-blue-500 justify-start p-2">
              Show more
            </Button>
          </div>

          {/* Quick Actions */}
          <div className={`rounded-2xl p-4 ${
            isDark ? 'bg-gray-900' : 'bg-gray-100'
          }`}>
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/applications" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
                <Briefcase className="h-5 w-5 text-blue-500" />
                <span>View Applications</span>
              </Link>
              <Link to="/events" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
                <Calendar className="h-5 w-5 text-green-500" />
                <span>Career Events</span>
              </Link>
              <Link to="/companies" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
                <Building2 className="h-5 w-5 text-purple-500" />
                <span>Browse Companies</span>
              </Link>
              <Link to="/resources" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
                <BookOpen className="h-5 w-5 text-yellow-500" />
                <span>Career Resources</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}