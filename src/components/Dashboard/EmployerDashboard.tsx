import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search,
  TrendingUp,
  Users,
  Briefcase,
  Eye,
  MessageCircle,
  Star,
  Plus,
  Filter,
  MoreHorizontal,
  Sparkles,
  Building2,
  Calendar,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import { cn } from '../../lib/cva';

export default function EmployerDashboard() {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data
  const jobPostings = [
    { id: 1, title: 'Senior Software Engineer', applicants: 24, views: 156, posted: '2d', status: 'active' },
    { id: 2, title: 'Product Manager', applicants: 18, views: 89, posted: '5d', status: 'active' },
    { id: 3, title: 'UX Designer', applicants: 31, views: 203, posted: '1w', status: 'paused' },
  ];

  const recentApplicants = [
    { name: 'Sarah Johnson', position: 'Senior Software Engineer', time: '2h', rating: 4.8 },
    { name: 'Mike Chen', position: 'Product Manager', time: '4h', rating: 4.6 },
    { name: 'Emily Davis', position: 'UX Designer', time: '6h', rating: 4.9 },
  ];

  const metrics = [
    { label: 'Active Jobs', value: '8', change: '+2', color: 'text-blue-500' },
    { label: 'Total Applicants', value: '147', change: '+23', color: 'text-green-500' },
    { label: 'Interviews Scheduled', value: '12', change: '+5', color: 'text-yellow-500' },
    { label: 'Hired This Month', value: '3', change: '+1', color: 'text-purple-500' },
  ];

  const trendingSkills = [
    { skill: 'React', demand: '95%' },
    { skill: 'Python', demand: '88%' },
    { skill: 'AWS', demand: '76%' },
    { skill: 'TypeScript', demand: '72%' },
    { skill: 'Node.js', demand: '68%' },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* X-Style Three Column Layout */}
      <div className="max-w-7xl mx-auto flex">
        
        {/* Main Content - Center Column */}
        <div className="flex-1 max-w-2xl mx-auto border-x border-gray-800 dark:border-gray-200">
          {/* Header */}
          <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${
            isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
          }`}>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <h1 className="text-xl font-bold">Employer Hub</h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage your hiring pipeline
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="p-2">
                  <Sparkles className="h-5 w-5" />
                </Button>
                <Button 
                  className={`rounded-full px-4 py-2 font-bold ${
                    isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                  }`}
                  onClick={() => window.location.href = '/post-job'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post Job
                </Button>
              </div>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className={`border-b p-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metrics.map((metric, index) => (
                <div key={index} className="text-center p-3 rounded-lg hover:bg-gray-50/5 transition-colors">
                  <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                    {metric.label}
                  </div>
                  <div className="text-xs text-green-500">{metric.change}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Applicants */}
          <div className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Recent Applicants</h2>
                <Link to="/applicants" className="text-blue-500 hover:underline text-sm">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {recentApplicants.map((applicant, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50/5 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isDark ? 'bg-gray-800' : 'bg-gray-200'
                      }`}>
                        <span className="text-lg">👤</span>
                      </div>
                      <div>
                        <p className="font-medium">{applicant.name}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Applied for {applicant.position}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-yellow-500">{applicant.rating}</span>
                          </div>
                          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {applicant.time} ago
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outlined" size="sm" className="rounded-full text-sm">
                        View
                      </Button>
                      <Button className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-4 text-sm">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Job Postings */}
          <div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Your Job Postings</h2>
                <Button variant="ghost" size="sm" className="p-2">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {jobPostings.map((job) => (
                  <div key={job.id} className={`p-4 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50/5 ${
                    isDark ? 'border-gray-800' : 'border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-bold text-lg">{job.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            job.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{job.applicants} applicants</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{job.views} views</span>
                          </div>
                          <span>Posted {job.posted}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-2">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="flex items-center space-x-2 p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">Messages</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-2 p-2 text-gray-500 hover:text-green-500 hover:bg-green-500/10 rounded-full">
                          <BarChart3 className="h-4 w-4" />
                          <span className="text-sm">Analytics</span>
                        </Button>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outlined" size="sm" className="rounded-full">
                          Edit
                        </Button>
                        <Button className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-4">
                          View Applicants
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
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
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-2xl bg-transparent border-none outline-none text-lg ${
                  isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
                }`}
              />
            </div>
          </div>

          {/* Trending Skills */}
          <div className={`rounded-2xl p-4 ${
            isDark ? 'bg-gray-900' : 'bg-gray-100'
          }`}>
            <h2 className="text-xl font-bold mb-4">Trending Skills</h2>
            <div className="space-y-3">
              {trendingSkills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-500/10 cursor-pointer transition-colors">
                  <div>
                    <p className="font-medium">{skill.skill}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden`}>
                        <div 
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: skill.demand }}
                        />
                      </div>
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {skill.demand}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-3 text-blue-500 justify-start p-2">
              View skill insights
            </Button>
          </div>

          {/* Quick Actions */}
          <div className={`rounded-2xl p-4 ${
            isDark ? 'bg-gray-900' : 'bg-gray-100'
          }`}>
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/post-job" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
                <Plus className="h-5 w-5 text-blue-500" />
                <span>Post New Job</span>
              </Link>
              <Link to="/applicants" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
                <Users className="h-5 w-5 text-green-500" />
                <span>Review Applicants</span>
              </Link>
              <Link to="/analytics" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                <span>View Analytics</span>
              </Link>
              <Link to="/messages" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-500/10 transition-colors">
                <MessageCircle className="h-5 w-5 text-yellow-500" />
                <span>Messages</span>
              </Link>
            </div>
          </div>

          {/* Hiring Tips */}
          <div className={`rounded-2xl p-4 ${
            isDark ? 'bg-gray-900' : 'bg-gray-100'
          }`}>
            <h2 className="text-xl font-bold mb-4">Hiring Tips</h2>
            <div className="space-y-3">
              <div className="p-3 rounded-lg hover:bg-gray-500/10 cursor-pointer transition-colors">
                <p className="font-medium text-sm">Write clear job descriptions</p>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Jobs with detailed descriptions get 30% more applications
                </p>
              </div>
              <div className="p-3 rounded-lg hover:bg-gray-500/10 cursor-pointer transition-colors">
                <p className="font-medium text-sm">Respond to candidates quickly</p>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Fast responses improve candidate experience
                </p>
              </div>
              <div className="p-3 rounded-lg hover:bg-gray-500/10 cursor-pointer transition-colors">
                <p className="font-medium text-sm">Use skill assessments</p>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Better evaluate candidate capabilities
                </p>
              </div>
            </div>
            <Button variant="ghost" className="w-full mt-3 text-blue-500 justify-start p-2">
              More hiring tips
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}