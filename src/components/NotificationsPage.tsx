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
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';
import { Card } from './ui/Card';
import PageLayout from './ui/PageLayout';
import Typography from './ui/Typography';
import { cn } from '../lib/cva';

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'job_match' | 'application_update'>('all');
  const [loading, setLoading] = useState(true);

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'job_match',
        title: 'New Job Match',
        message: 'Software Engineer position at Tech Corp matches your profile',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false,
        actionUrl: '/jobs/1',
        company: 'Tech Corp'
      },
      {
        id: '2',
        type: 'application_update',
        title: 'Application Update',
        message: 'Your application for Frontend Developer has been reviewed',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isRead: false,
        actionUrl: '/applications/2',
        company: 'Innovation Labs'
      },
      {
        id: '3',
        type: 'message',
        title: 'New Message',
        message: 'Sarah from HR sent you a message about the interview',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        isRead: true,
        actionUrl: '/messages',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b278?w=40&h=40&fit=crop&crop=face'
      }
    ];
    
    setNotifications(mockNotifications);
    setLoading(false);
  }, []);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'job_match': return <Briefcase className="h-5 w-5 text-blue-500" />;
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
      <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'}>
        <div className="flex justify-center items-center h-64">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
            isDark ? 'border-white' : 'border-black'
          }`}></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'} maxWidth="4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Typography variant="h4" className="font-bold mb-2">
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Typography variant="body2" color="textSecondary">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </Typography>
            )}
          </div>
          
          <div className="flex space-x-2">
            {unreadCount > 0 && (
              <Button variant="outlined" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Mark all read
              </Button>
            )}
            <Link to="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 overflow-x-auto">
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'job_match', label: 'Job Matches', count: notifications.filter(n => n.type === 'job_match').length },
            { key: 'application_update', label: 'Applications', count: notifications.filter(n => n.type === 'application_update').length }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={filter === tab.key ? 'contained' : 'ghost'}
              size="sm"
              onClick={() => setFilter(tab.key as any)}
              className="whitespace-nowrap"
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  filter === tab.key 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card className="p-8 text-center">
            <BellOff className={`h-12 w-12 mx-auto mb-4 ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <Typography variant="h6" className="mb-2">
              No notifications
            </Typography>
            <Typography variant="body2" color="textSecondary">
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
                'p-4 transition-all duration-200 hover:shadow-md cursor-pointer',
                !notification.isRead && (isDark 
                  ? 'bg-lime/5 border-lime/20' 
                  : 'bg-blue-50 border-blue-200'
                )
              )}
              onClick={() => {
                if (!notification.isRead) markAsRead(notification.id);
                if (notification.actionUrl) {
                  // Navigate to action URL
                }
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {notification.avatar ? (
                    <img 
                      src={notification.avatar} 
                      alt="" 
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Typography 
                        variant="body1" 
                        className={cn(
                          'font-medium mb-1',
                          !notification.isRead && 'font-semibold'
                        )}
                      >
                        {notification.title}
                        {!notification.isRead && (
                          <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                        )}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="mb-2">
                        {notification.message}
                      </Typography>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimestamp(notification.timestamp)}</span>
                        {notification.company && (
                          <>
                            <span>•</span>
                            <span>{notification.company}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
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
                      >
                        {notification.isRead ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
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