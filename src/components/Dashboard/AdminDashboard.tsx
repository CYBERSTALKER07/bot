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
        return 'bg-success/10 text-success border border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border border-warning/20';
      case 'suspended':
        return 'bg-error/10 text-error border border-error/20';
      default:
        return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={userStats.totalUsers.toLocaleString()}
          icon={Users}
          subtitle="+12% from last month"
          color="info"
          delay={0.2}
          rotation={1}
        />
        <StatsCard
          title="Active Jobs"
          value={jobStats.activeJobs.toString()}
          icon={Briefcase}
          subtitle="+8% from last month"
          color="success"
          delay={0.4}
          rotation={-1}
        />
        <StatsCard
          title="Applications"
          value={jobStats.applications.toLocaleString()}
          icon={FileText}
          subtitle="+24% from last month"
          color="primary"
          delay={0.6}
          rotation={0.5}
        />
        <StatsCard
          title="Pending Approvals"
          value={userStats.pendingApprovals.toString()}
          icon={AlertTriangle}
          subtitle="Requires attention"
          color="warning"
          delay={0.8}
          rotation={-0.5}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card variant="elevated" className="transform rotate-0.5" delay={1}>
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold text-foreground">Recent User Registrations</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                      <Users className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(user.status))}>
                      {user.status}
                    </span>
                    {getStatusIcon(user.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card variant="elevated" className="transform -rotate-0.5" delay={1.2}>
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                <Users className="h-6 w-6 mb-2 text-info" />
                <span className="text-sm font-medium text-foreground">Manage Users</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                <Briefcase className="h-6 w-6 mb-2 text-success" />
                <span className="text-sm font-medium text-foreground">Review Jobs</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                <Calendar className="h-6 w-6 mb-2 text-brand-primary" />
                <span className="text-sm font-medium text-foreground">Create Event</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                <MessageSquare className="h-6 w-6 mb-2 text-warning" />
                <span className="text-sm font-medium text-foreground">Send Announcement</span>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <Card variant="elevated" className="transform rotate-0.3" delay={0.5}>
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
        <h3 className="text-lg font-semibold text-foreground">User Management</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {recentUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <Users className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{user.email}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Joined: {new Date(user.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={cn("px-3 py-1 rounded-full text-sm font-medium", getStatusColor(user.status))}>
                  {user.status}
                </span>
                <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-info">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-error">
                  <Ban className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">
              Loading admin dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card variant="elevated" padding="large" className="text-center">
            <h2 className="text-xl font-semibold text-error mb-2">
              Error Loading Dashboard
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              {error}
            </p>
            <Button onClick={fetchDashboardData} variant="outline">
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Manage users, jobs, events, and platform settings</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-neutral-200 dark:border-neutral-700 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                    activeTab === tab.id
                      ? "border-brand-primary text-brand-primary"
                      : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-foreground hover:border-neutral-300 dark:hover:border-neutral-600"
                  )}
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
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
            <p className="text-neutral-600 dark:text-neutral-400">Job moderation features coming soon</p>
          </div>
        )}
        {activeTab === 'events' && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
            <p className="text-neutral-600 dark:text-neutral-400">Event management features coming soon</p>
          </div>
        )}
        {activeTab === 'resources' && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
            <p className="text-neutral-600 dark:text-neutral-400">Resource management features coming soon</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
            <p className="text-neutral-600 dark:text-neutral-400">Platform settings coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}