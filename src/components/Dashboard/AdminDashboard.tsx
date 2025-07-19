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
import { useSwiftUIAnimation, SwiftUITransitions } from '../../hooks/useSwiftUIAnimations';
import { SwiftUICard, SwiftUIList, SwiftUIText } from '../ui/SwiftUICard';
import SwiftUIButton from '../ui/SwiftUIButton';
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
  const { animate, staggeredAnimate } = useSwiftUIAnimation();
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

  // Animate components on mount
  useEffect(() => {
    // Animate stats cards
    setTimeout(() => {
      const statsCards = document.querySelectorAll('.admin-stats-card');
      if (statsCards.length > 0) {
        staggeredAnimate(
          Array.from(statsCards),
          { scale: 1, opacity: 1, y: 0, rotationX: 0 },
          {
            stagger: 0.2,
            duration: 0.8,
            ease: 'back.out(1.7)'
          }
        );
      }
    }, 500);

    // Animate tab content
    setTimeout(() => {
      const contentElements = document.querySelectorAll('.admin-content-item');
      if (contentElements.length > 0) {
        staggeredAnimate(
          Array.from(contentElements),
          { scale: 1, opacity: 1, x: 0 },
          {
            stagger: 0.1,
            duration: 0.6,
            ease: 'back.out(1.4)'
          }
        );
      }
    }, 1200);
  }, [staggeredAnimate, activeTab]);

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
        <div className="admin-stats-card opacity-0 scale-75 -rotate-x-90">
          <StatsCard
            title="Total Users"
            value={userStats.totalUsers.toLocaleString()}
            icon={Users}
            subtitle="+12% from last month"
            color="info"
            animated={false}
          />
        </div>
        <div className="admin-stats-card opacity-0 scale-75 -rotate-x-90">
          <StatsCard
            title="Active Jobs"
            value={jobStats.activeJobs.toString()}
            icon={Briefcase}
            subtitle="+8% from last month"
            color="success"
            animated={false}
          />
        </div>
        <div className="admin-stats-card opacity-0 scale-75 -rotate-x-90">
          <StatsCard
            title="Applications"
            value={jobStats.applications.toLocaleString()}
            icon={FileText}
            subtitle="+24% from last month"
            color="primary"
            animated={false}
          />
        </div>
        <div className="admin-stats-card opacity-0 scale-75 -rotate-x-90">
          <StatsCard
            title="Pending Approvals"
            value={userStats.pendingApprovals.toString()}
            icon={AlertTriangle}
            subtitle="Requires attention"
            color="warning"
            animated={false}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SwiftUICard 
          className="admin-content-item opacity-0 scale-95 translate-x-8"
          variant="elevated"
          slideDirection="right"
          delay={0.3}
          animateOnMount={false}
          hoverScale={1.01}
          springy
        >
          <div className="border-b border-neutral-200 dark:border-neutral-700 pb-4 mb-4">
            <SwiftUIText className="text-lg font-semibold text-foreground">
              Recent User Registrations
            </SwiftUIText>
          </div>
          <div className="space-y-4">
            {recentUsers.map((user, index) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <Users className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div>
                    <SwiftUIText className="font-medium text-foreground" delay={0.1 * index}>
                      {user.name}
                    </SwiftUIText>
                    <SwiftUIText className="text-sm text-neutral-600 dark:text-neutral-400" delay={0.15 * index}>
                      {user.email}
                    </SwiftUIText>
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
        </SwiftUICard>

        <SwiftUICard 
          className="admin-content-item opacity-0 scale-95 -translate-x-8"
          variant="elevated"
          slideDirection="left"
          delay={0.5}
          animateOnMount={false}
          hoverScale={1.01}
          springy
        >
          <div className="border-b border-neutral-200 dark:border-neutral-700 pb-4 mb-4">
            <SwiftUIText className="text-lg font-semibold text-foreground">
              Quick Actions
            </SwiftUIText>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, label: "Manage Users", color: "text-info" },
              { icon: Briefcase, label: "Review Jobs", color: "text-success" },
              { icon: Calendar, label: "Create Event", color: "text-brand-primary" },
              { icon: MessageSquare, label: "Send Announcement", color: "text-warning" }
            ].map((action, index) => (
              <SwiftUIButton
                key={index}
                variant="outlined"
                className="flex flex-col items-center p-4 h-auto"
                springy
                hoverScale={1.05}
              >
                <action.icon className={`h-6 w-6 mb-2 ${action.color}`} />
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </SwiftUIButton>
            ))}
          </div>
        </SwiftUICard>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <SwiftUICard 
      variant="elevated"
      slideDirection="up"
      delay={0.3}
      hoverScale={1.005}
      springy
    >
      <div className="border-b border-neutral-200 dark:border-neutral-700 pb-4 mb-6">
        <SwiftUIText className="text-lg font-semibold text-foreground">
          User Management
        </SwiftUIText>
      </div>
      <div className="space-y-4">
        {recentUsers.map((user, index) => (
          <SwiftUICard
            key={user.id}
            className="admin-user-card"
            variant="outlined"
            padding="medium"
            interactive
            hoverScale={1.01}
            delay={0.1 * index}
            springy
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <Users className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <SwiftUIText className="font-medium text-foreground">
                    {user.name}
                  </SwiftUIText>
                  <SwiftUIText className="text-sm text-neutral-600 dark:text-neutral-400" delay={0.1}>
                    {user.email}
                  </SwiftUIText>
                  <SwiftUIText className="text-sm text-neutral-600 dark:text-neutral-400" delay={0.2}>
                    Joined: {new Date(user.joinDate).toLocaleDateString()}
                  </SwiftUIText>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={cn("px-3 py-1 rounded-full text-sm font-medium", getStatusColor(user.status))}>
                  {user.status}
                </span>
                <SwiftUIButton 
                  variant="text" 
                  size="small" 
                  className="text-neutral-500 hover:text-info"
                  springy
                  hoverScale={1.1}
                >
                  <Eye className="h-4 w-4" />
                </SwiftUIButton>
                <SwiftUIButton 
                  variant="text" 
                  size="small" 
                  className="text-neutral-500 hover:text-error"
                  springy
                  hoverScale={1.1}
                >
                  <Ban className="h-4 w-4" />
                </SwiftUIButton>
              </div>
            </div>
          </SwiftUICard>
        ))}
      </div>
    </SwiftUICard>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
            <SwiftUIText className="text-neutral-600 dark:text-neutral-400">
              Loading admin dashboard...
            </SwiftUIText>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SwiftUICard variant="elevated" padding="large" className="text-center">
            <h2 className="text-xl font-semibold text-error mb-2">
              Error Loading Dashboard
            </h2>
            <SwiftUIText className="text-neutral-600 dark:text-neutral-400 mb-4">
              {error}
            </SwiftUIText>
            <SwiftUIButton onClick={fetchDashboardData} variant="outlined" springy>
              Try Again
            </SwiftUIButton>
          </SwiftUICard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SwiftUIText 
            className="text-3xl font-bold text-foreground mb-2"
            delay={0.2}
          >
            Admin Dashboard ⚡
          </SwiftUIText>
          <SwiftUIText 
            className="text-neutral-600 dark:text-neutral-400"
            delay={0.4}
          >
            Manage users, jobs, events, and platform settings
          </SwiftUIText>
        </div>

        {/* Navigation Tabs with SwiftUI animations */}
        <div className="border-b border-neutral-200 dark:border-neutral-700 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <SwiftUIButton
                  key={tab.id}
                  variant="text"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                    activeTab === tab.id
                      ? "border-brand-primary text-brand-primary"
                      : "border-transparent text-neutral-600 dark:text-neutral-400"
                  )}
                  springy
                  hoverScale={1.02}
                  animateOnMount
                  delay={0.1 * index}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </SwiftUIButton>
              );
            })}
          </nav>
        </div>

        {/* Tab Content with SwiftUI transitions */}
        <div className="tab-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUserManagement()}
          {activeTab === 'jobs' && (
            <SwiftUICard className="text-center py-12" slideDirection="up">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
              <SwiftUIText className="text-neutral-600 dark:text-neutral-400">
                Job moderation features coming soon
              </SwiftUIText>
            </SwiftUICard>
          )}
          {activeTab === 'events' && (
            <SwiftUICard className="text-center py-12" slideDirection="up">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
              <SwiftUIText className="text-neutral-600 dark:text-neutral-400">
                Event management features coming soon
              </SwiftUIText>
            </SwiftUICard>
          )}
          {activeTab === 'resources' && (
            <SwiftUICard className="text-center py-12" slideDirection="up">
              <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
              <SwiftUIText className="text-neutral-600 dark:text-neutral-400">
                Resource management features coming soon
              </SwiftUIText>
            </SwiftUICard>
          )}
          {activeTab === 'settings' && (
            <SwiftUICard className="text-center py-12" slideDirection="up">
              <Settings className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
              <SwiftUIText className="text-neutral-600 dark:text-neutral-400">
                Platform settings coming soon
              </SwiftUIText>
            </SwiftUICard>
          )}
        </div>
      </div>
    </div>
  );
}