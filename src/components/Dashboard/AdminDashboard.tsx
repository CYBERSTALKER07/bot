import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  MessageSquare,
  FileText,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface UserStats {
  totalUsers: number;
  students: number;
  employers: number;
  activeToday: number;
  pendingApprovals: number;
}

interface JobStats {
  totalJobs: number;
  activeJobs: number;
  pendingApproval: number;
  applications: number;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'suspended';
  joinDate: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data - in real implementation, fetch from Supabase
  const userStats: UserStats = {
    totalUsers: 15420,
    students: 12850,
    employers: 2570,
    activeToday: 1240,
    pendingApprovals: 23
  };

  const jobStats: JobStats = {
    totalJobs: 856,
    activeJobs: 432,
    pendingApproval: 18,
    applications: 5420
  };

  const recentUsers: RecentUser[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'jsmith@asu.edu',
      role: 'Student',
      status: 'active',
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@intel.com',
      role: 'Employer',
      status: 'pending',
      joinDate: '2024-01-14'
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mdavis@asu.edu',
      role: 'Student',
      status: 'active',
      joinDate: '2024-01-13'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'jobs', label: 'Job Moderation', icon: Briefcase },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'suspended':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{userStats.totalUsers.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">+12%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{jobStats.activeJobs}</p>
            </div>
            <Briefcase className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">+8%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Applications</p>
              <p className="text-3xl font-bold text-gray-900">{jobStats.applications.toLocaleString()}</p>
            </div>
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">+24%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-3xl font-bold text-gray-900">{userStats.pendingApprovals}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">Requires attention</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Recent User Registrations</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                    {getStatusIcon(user.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Manage Users</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Briefcase className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm font-medium">Review Jobs</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="h-6 w-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium">Create Event</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <MessageSquare className="h-6 w-6 text-yellow-600 mb-2" />
                <span className="text-sm font-medium">Send Announcement</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {recentUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-sm text-gray-500">Joined: {new Date(user.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
                <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                  <Ban className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, jobs, events, and platform settings</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-asu-maroon text-asu-maroon'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'users' && renderUserManagement()}
      {activeTab === 'jobs' && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Job moderation features coming soon</p>
        </div>
      )}
      {activeTab === 'events' && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Event management features coming soon</p>
        </div>
      )}
      {activeTab === 'resources' && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Resource management features coming soon</p>
        </div>
      )}
      {activeTab === 'settings' && (
        <div className="text-center py-12">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Platform settings coming soon</p>
        </div>
      )}
    </div>
  );
}