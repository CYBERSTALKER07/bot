import React, { useState, useEffect } from 'react';
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
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase';
import { StatsCard, Card } from '../ui/Card';
import Button from '../ui/Button';
import { cn } from '../../lib/cva';

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
  status: string;
  joinDate: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    students: 0,
    employers: 0,
    activeToday: 0,
    pendingApprovals: 0
  });
  const [jobStats, setJobStats] = useState<JobStats>({
    totalJobs: 0,
    activeJobs: 0,
    pendingApproval: 0,
    applications: 0
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user statistics
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, role, created_at, status');

      if (profilesError) throw profilesError;

      const students = profiles?.filter(p => p.role === 'student').length || 0;
      const employers = profiles?.filter(p => p.role === 'employer').length || 0;
      const totalUsers = profiles?.length || 0;
      const pendingApprovals = profiles?.filter(p => p.status === 'pending').length || 0;

      // Calculate active today (users with activity in last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { data: activeSessions, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('user_id')
        .gte('last_activity', yesterday.toISOString());

      if (sessionsError) console.warn('Could not fetch session data:', sessionsError);

      const activeToday = activeSessions?.length || 0;

      setUserStats({
        totalUsers,
        students,
        employers,
        activeToday,
        pendingApprovals
      });

      // Fetch job statistics
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id, status, created_at');

      if (jobsError) throw jobsError;

      const totalJobs = jobs?.length || 0;
      const activeJobs = jobs?.filter(j => j.status === 'active').length || 0;
      const pendingJobApproval = jobs?.filter(j => j.status === 'pending').length || 0;

      // Fetch application count
      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select('id');

      if (applicationsError) throw applicationsError;

      setJobStats({
        totalJobs,
        activeJobs,
        pendingApproval: pendingJobApproval,
        applications: applications?.length || 0
      });

      // Fetch recent users
      const { data: recentProfiles, error: recentError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentError) throw recentError;

      const formattedRecentUsers: RecentUser[] = recentProfiles?.map(profile => ({
        id: profile.id,
        name: profile.full_name || 'Unknown User',
        email: profile.email || '',
        role: profile.role || 'student',
        status: profile.status || 'active',
        joinDate: profile.created_at
      })) || [];

      setRecentUsers(formattedRecentUsers);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

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
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'suspended':
        return <XCircle className="h-4 w-4 text-error" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return isDark 
          ? 'bg-green-900/20 text-green-400 border border-green-800'
          : 'bg-green-50 text-green-800 border border-green-200';
      case 'pending':
        return isDark 
          ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-800'
          : 'bg-yellow-50 text-yellow-800 border border-yellow-200';
      case 'suspended':
        return isDark 
          ? 'bg-red-900/20 text-red-400 border border-red-800'
          : 'bg-red-50 text-red-800 border border-red-200';
      default:
        return isDark 
          ? 'bg-gray-800 text-gray-400 border border-gray-700'
          : 'bg-gray-100 text-gray-600 border border-gray-300';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6 sm:space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Users"
          value={userStats.totalUsers.toLocaleString()}
          icon={Users}
          subtitle="+12% from last month"
          color="info"
          animated
          delay={0.1}
          className="text-center"
        />
        <StatsCard
          title="Active Jobs"
          value={jobStats.activeJobs.toString()}
          icon={Briefcase}
          subtitle="+8% from last month"
          color="success"
          animated
          delay={0.2}
          className="text-center"
        />
        <StatsCard
          title="Applications"
          value={jobStats.applications.toLocaleString()}
          icon={FileText}
          subtitle="+24% from last month"
          color="primary"
          animated
          delay={0.3}
          className="text-center"
        />
        <StatsCard
          title="Pending Approvals"
          value={userStats.pendingApprovals.toString()}
          icon={AlertTriangle}
          subtitle="Requires attention"
          color="warning"
          animated
          delay={0.4}
          className="text-center"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <Card className={`p-4 sm:p-6 ${
          isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
        } border rounded-2xl`}>
          <div className={`border-b pb-4 mb-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-base sm:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Recent User Registrations
            </h3>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {recentUsers.slice(0, 5).map((user, index) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <Users className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm sm:text-base truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user.name}
                    </p>
                    <p className={`text-xs sm:text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(user.status))}>
                    {user.status}
                  </span>
                  {getStatusIcon(user.status)}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className={`p-4 sm:p-6 ${
          isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
        } border rounded-2xl`}>
          <div className={`border-b pb-4 mb-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-base sm:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Quick Actions
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { icon: Users, label: "Manage Users", color: isDark ? "text-info-400" : "text-info-600" },
              { icon: Briefcase, label: "Review Jobs", color: isDark ? "text-green-400" : "text-green-600" },
              { icon: Calendar, label: "Create Event", color: isDark ? "text-lime" : "text-asu-maroon" },
              { icon: MessageSquare, label: "Send Announcement", color: isDark ? "text-yellow-400" : "text-yellow-600" }
            ].map((action, index) => (
              <Button
                key={index}
                variant="outlined"
                className={`flex flex-col items-center p-3 sm:p-4 h-auto border-2 ${
                  isDark 
                    ? 'border-gray-600 hover:bg-gray-800 hover:border-lime' 
                    : 'border-gray-300 hover:bg-gray-100 hover:border-asu-maroon'
                }`}
              >
                <action.icon className={`h-5 w-5 sm:h-6 sm:w-6 mb-2 ${action.color}`} />
                <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {action.label}
                </span>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <Card className={`p-4 sm:p-6 ${
      isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
    } border rounded-2xl`}>
      <div className={`border-b pb-4 mb-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-base sm:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          User Management
        </h3>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {recentUsers.map((user, index) => (
          <Card
            key={user.id}
            className={`p-3 sm:p-4 transition-all duration-300 hover:shadow-md ${
              isDark ? 'bg-black border-gray-800 hover:bg-gray-900' : 'bg-white border-gray-200 hover:shadow-lg'
            } border rounded-xl`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <Users className={`h-4 w-4 sm:h-5 sm:w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm sm:text-base truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {user.name}
                  </p>
                  <p className={`text-xs sm:text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {user.email}
                  </p>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Joined: {new Date(user.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0">
                <span className={cn("px-3 py-1 rounded-full text-xs sm:text-sm font-medium", getStatusColor(user.status))}>
                  {user.status}
                </span>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`${isDark ? 'text-gray-500 hover:text-info-400' : 'text-gray-500 hover:text-info-600'}`}
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`${isDark ? 'text-gray-500 hover:text-red-400' : 'text-gray-500 hover:text-red-600'}`}
                  >
                    <Ban className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4 ${
              isDark ? 'border-lime' : 'border-asu-maroon'
            }`}></div>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Loading admin dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className={`text-center p-6 sm:p-8 ${
            isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
          } border rounded-2xl`}>
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Error Loading Dashboard
            </h2>
            <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {error}
            </p>
            <Button 
              onClick={fetchDashboardData} 
              variant="outlined"
              className={`${
                isDark 
                  ? 'border-lime text-lime hover:bg-lime/10' 
                  : 'border-asu-maroon text-asu-maroon hover:bg-asu-maroon/10'
              }`}
            >
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Admin Dashboard ⚡
          </h1>
          <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage users, jobs, events, and platform settings
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className={`border-b mb-6 sm:mb-8 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center space-x-2 py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap",
                    activeTab === tab.id
                      ? `${isDark ? 'border-lime text-lime' : 'border-asu-maroon text-asu-maroon'}`
                      : `border-transparent ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`
                  )}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUserManagement()}
          {activeTab === 'jobs' && (
            <Card className={`text-center py-8 sm:py-12 ${
              isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
            } border rounded-2xl`}>
              <Briefcase className={`h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Job moderation features coming soon
              </p>
            </Card>
          )}
          {activeTab === 'events' && (
            <Card className={`text-center py-8 sm:py-12 ${
              isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
            } border rounded-2xl`}>
              <Calendar className={`h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Event management features coming soon
              </p>
            </Card>
          )}
          {activeTab === 'resources' && (
            <Card className={`text-center py-8 sm:py-12 ${
              isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
            } border rounded-2xl`}>
              <FileText className={`h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Resource management features coming soon
              </p>
            </Card>
          )}
          {activeTab === 'settings' && (
            <Card className={`text-center py-8 sm:py-12 ${
              isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
            } border rounded-2xl`}>
              <Settings className={`h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Platform settings coming soon
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}