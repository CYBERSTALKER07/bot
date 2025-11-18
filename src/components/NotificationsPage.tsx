import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  BellOff,
  Check,
  Clock,
  Briefcase,
  MessageCircle,
  Calendar,
  Heart,
  Filter,
  MoreHorizontal,
  Trash2,
  Settings,
  Eye,
  EyeOff,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';
import { Card } from './ui/Card';
import PageLayout from './ui/PageLayout';
import Typography from './ui/Typography';
import { cn } from '../lib/cva';
import { useNotifications } from '../hooks/useOptimizedQuery';
import { PostCardSkeleton } from './ui/Skeleton';

interface Notification {
  id: string;
  type: 'job_match' | 'application_update' | 'message' | 'event' | 'like' | 'follow';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  avatar?: string;
  company?: string;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [filter, setFilter] = useState<'all' | 'unread' | 'job_match' | 'application_update'>('all');

  // Fetch real notifications
  const { data: notificationsData, isLoading: loading, error } = useNotifications(user?.id);

  // Transform to component format
  const notifications: Notification[] = notificationsData?.map(notif => ({
    id: notif.id,
    type: notif.type,
    title: notif.title,
    message: notif.message,
    timestamp: new Date(notif.created_at),
    isRead: notif.is_read || false,
    actionUrl: notif.action_url,
    avatar: notif.avatar_url,
    company: notif.company,
  })) || [];

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'job_match': return <Briefcase className="h-5 w-5 text-info-500" />;
      case 'application_update': return <Clock className="h-5 w-5 text-orange-500" />;
      case 'message': return <MessageCircle className="h-5 w-5 text-green-500" />;
      case 'event': return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'like': return <Heart className="h-5 w-5 text-red-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.isRead;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <PageLayout className={cn(
        "min-h-screen transition-colors duration-300 pb-20",
        isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'
      )} maxWidth="4xl">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout className={cn(
        "min-h-screen transition-colors duration-300",
        isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'
      )} maxWidth="4xl">
        <Card className="p-8 text-center">
          <p className="text-red-600 mb-4">Error loading notifications</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      className={cn(
        "min-h-screen transition-colors duration-300 pb-20", // Added bottom padding for mobile nav
        isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'
      )} 
      maxWidth="4xl"
    >
      {/* Mobile-optimized Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex items-start justify-between mb-4 sm:items-center">
          <div className="flex-1 min-w-0">
            <Typography 
              variant="h4" 
              className="font-bold mb-1 sm:mb-2 text-xl sm:text-2xl lg:text-3xl"
            >
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Typography 
                variant="body2" 
                color="textSecondary"
                className="text-sm sm:text-base"
              >
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </Typography>
            )}
          </div>
          
          {/* Mobile-optimized action buttons */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {unreadCount > 0 && (
              <Button 
                variant="outlined" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
              >
                <Check className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Mark all read</span>
              </Button>
            )}
            <Link to="/settings">
              <Button 
                variant="ghost" 
                size="sm"
                className="p-1.5 sm:p-2"
              >
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile-optimized Filter Tabs */}
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide pb-2">
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'job_match', label: 'Jobs', count: notifications.filter(n => n.type === 'job_match').length },
            { key: 'application_update', label: 'Apps', count: notifications.filter(n => n.type === 'application_update').length }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={filter === tab.key ? 'contained' : 'ghost'}
              size="sm"
              onClick={() => setFilter(tab.key as any)}
              className={cn(
                "whitespace-nowrap flex-shrink-0 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full transition-all duration-200",
                "ios-touch-target", // iOS-friendly touch target
                filter === tab.key && "shadow-sm"
              )}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={cn(
                  "ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium",
                  filter === tab.key 
                    ? 'bg-white/20 text-white' 
                    : isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                )}>
                  {tab.count}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Mobile-optimized Notifications List */}
      <div className="space-y-2 sm:space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card className={cn(
            "p-6 sm:p-8 text-center mx-2 sm:mx-0 rounded-xl sm:rounded-2xl",
            isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          )}>
            <BellOff className={cn(
              "h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4",
              isDark ? 'text-gray-600' : 'text-gray-400'
            )} />
            <Typography variant="h6" className="mb-2 text-base sm:text-lg">
              No notifications
            </Typography>
            <Typography 
              variant="body2" 
              color="textSecondary"
              className="text-sm sm:text-base px-4"
            >
              {filter === 'unread' 
                ? "You're all caught up!" 
                : "We'll notify you when something important happens."
              }
            </Typography>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "transition-all duration-200 hover:shadow-md cursor-pointer mx-2 sm:mx-0 rounded-xl sm:rounded-2xl",
                "active:scale-[0.98] active:shadow-sm", // Mobile press feedback
                "ios-touch-target ios-nav-item", // iOS-friendly interactions
                !notification.isRead && (isDark 
                  ? 'bg-lime/5 border-lime/20 shadow-lime/5' 
                  : 'bg-info-50 border-info-200 shadow-blue/5'
                ),
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
              )}
              onClick={() => {
                if (!notification.isRead) markAsRead(notification.id);
                if (notification.actionUrl) {
                  // Navigate to action URL
                }
              }}
            >
              <div className="p-3 sm:p-4">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  {/* Mobile-optimized avatar/icon */}
                  <div className="flex-shrink-0">
                    {notification.avatar ? (
                      <img 
                        src={notification.avatar} 
                        alt="" 
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center",
                        isDark ? 'bg-gray-800' : 'bg-gray-100'
                      )}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                    {/* Unread indicator */}
                    {!notification.isRead && (
                      <div className="absolute w-2 h-2 bg-info-500 rounded-full -mt-1 -ml-1 ring-2 ring-white dark:ring-gray-900"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-2">
                        <Typography 
                          variant="body1" 
                          className={cn(
                            'mb-1 text-sm sm:text-base leading-tight',
                            !notification.isRead ? 'font-semibold' : 'font-medium'
                          )}
                        >
                          {notification.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="textSecondary" 
                          className="mb-2 text-xs sm:text-sm leading-relaxed line-clamp-2"
                        >
                          {notification.message}
                        </Typography>
                        
                        {/* Mobile-optimized metadata */}
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{formatTimestamp(notification.timestamp)}</span>
                          {notification.company && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="truncate">{notification.company}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Mobile-optimized action buttons */}
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (notification.isRead) {
                              setNotifications(prev => 
                                prev.map(n => 
                                  n.id === notification.id ? { ...n, isRead: false } : n
                                )
                              );
                            } else {
                              markAsRead(notification.id);
                            }
                          }}
                          className="p-1 sm:p-1.5 ios-touch-target"
                        >
                          {notification.isRead ? 
                            <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" /> : 
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          }
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1 sm:p-1.5 ios-touch-target text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        
                        {/* Chevron for mobile */}
                        <div className="sm:hidden">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Mobile spacing for bottom navigation */}
      <div className="h-16 sm:hidden"></div>
    </PageLayout>
  );
}

function formatTimestamp(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 7) {
    return `${days}d ago`;
  } else {
    return timestamp.toLocaleDateString();
  }
}