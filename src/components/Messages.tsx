import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  Search, 
  Send, 
  Person, 
  AccessTime, 
  Chat, 
  Phone, 
  VideoCall, 
  MoreHoriz, 
  AttachFile, 
  EmojiEmotions,
  Star,
  Archive,
  Delete,
  Circle,
  Check,
  DoneAll,
  FilterList,
  Add,
  Business,
  School,
  Work,
  AutoAwesome,
  LocalCafe,
  Favorite,
  Message,
  Forum,
  VideoCallOutlined,
  PhoneInTalk,
  EmojiEvents,
  TrendingUp,
  People,
  Notifications
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Typography from './ui/Typography';
import Button from './ui/Button';
import Input from './ui/Input';
import { Card, StatsCard } from './ui/Card';
import Badge from './ui/Badge';
import Avatar from './ui/Avatar';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  sender_name: string;
  sender_avatar?: string;
  sender_role: 'student' | 'employer' | 'admin';
  content: string;
  timestamp: string;
  read: boolean;
  job_id?: string;
  job_title?: string;
}

interface Conversation {
  id: string;
  participant_id: string;
  participant_name: string;
  participant_avatar?: string;
  participant_role: 'student' | 'employer' | 'admin';
  last_message: string;
  last_message_time: string;
  unread_count: number;
  job_id?: string;
  job_title?: string;
}

export default function Messages() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const conversationsRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'employer'>('all');

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Material Design entrance animations
      gsap.fromTo('.header-card', {
        opacity: 0,
        y: -30,
        scale: 0.98
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out'
      });

      gsap.fromTo('.stats-card', {
        opacity: 0,
        y: 20,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        delay: 0.2
      });

      gsap.fromTo('.conversation-card', {
        opacity: 0,
        x: -30,
        scale: 0.95
      }, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.4
      });

      gsap.fromTo('.messages-area', {
        opacity: 0,
        x: 30,
        scale: 0.98
      }, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.6
      });

      // Floating decorations
      gsap.to('.messages-decoration', {
        y: -10,
        x: 5,
        rotation: 180,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Mock conversations data
    const mockConversations: Conversation[] = [
      {
        id: '1',
        participant_id: '2',
        participant_name: 'Sarah Johnson',
        participant_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        participant_role: 'student',
        last_message: 'Thank you for considering my application! I\'d love to discuss the internship opportunity.',
        last_message_time: '2024-01-15T10:30:00Z',
        unread_count: 2,
        job_id: '1',
        job_title: 'Software Engineering Intern'
      },
      {
        id: '2',
        participant_id: '3',
        participant_name: 'Tech Corp Recruiting',
        participant_avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
        participant_role: 'employer',
        last_message: 'We\'d like to schedule a follow-up interview for next week.',
        last_message_time: '2024-01-14T15:45:00Z',
        unread_count: 1,
        job_id: '2',
        job_title: 'Full Stack Developer'
      },
      {
        id: '3',
        participant_id: '4',
        participant_name: 'Alex Chen',
        participant_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        participant_role: 'student',
        last_message: 'I have a question about the project requirements.',
        last_message_time: '2024-01-13T09:20:00Z',
        unread_count: 0,
        job_id: '3',
        job_title: 'Data Science Internship'
      },
      {
        id: '4',
        participant_id: '5',
        participant_name: 'Innovation Labs',
        participant_avatar: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150',
        participant_role: 'employer',
        last_message: 'Great portfolio! Let\'s discuss the next steps.',
        last_message_time: '2024-01-12T14:15:00Z',
        unread_count: 0,
        job_id: '4',
        job_title: 'UX Designer'
      }
    ];

    const mockMessages: Message[] = [
      {
        id: '1',
        sender_id: '2',
        recipient_id: user?.id || '1',
        sender_name: 'Sarah Johnson',
        sender_role: 'student',
        content: 'Hi! I just submitted my application for the Software Engineering Intern position. I\'m really excited about the opportunity to work with your team.',
        timestamp: '2024-01-15T10:00:00Z',
        read: true,
        job_id: '1',
        job_title: 'Software Engineering Intern'
      },
      {
        id: '2',
        sender_id: user?.id || '1',
        recipient_id: '2',
        sender_name: 'You',
        sender_role: user?.role || 'employer',
        content: 'Thank you for your interest! I\'ve reviewed your application and I\'m impressed with your projects. Could you tell me more about your experience with React?',
        timestamp: '2024-01-15T10:15:00Z',
        read: true,
        job_id: '1',
        job_title: 'Software Engineering Intern'
      },
      {
        id: '3',
        sender_id: '2',
        recipient_id: user?.id || '1',
        sender_name: 'Sarah Johnson',
        sender_role: 'student',
        content: 'Thank you for considering my application! I\'d love to discuss the internship opportunity.',
        timestamp: '2024-01-15T10:30:00Z',
        read: false,
        job_id: '1',
        job_title: 'Software Engineering Intern'
      }
    ];

    setConversations(mockConversations);
    setMessages(mockMessages);
    setSelectedConversation(mockConversations[0]?.id || null);
  }, [user]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      sender_id: user?.id || '1',
      recipient_id: selectedConversation,
      sender_name: 'You',
      sender_role: user?.role || 'employer',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update conversation last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation 
          ? { 
              ...conv, 
              last_message: newMessage,
              last_message_time: new Date().toISOString()
            }
          : conv
      )
    );
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.last_message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || conv.participant_role === filterRole;
    return matchesSearch && matchesRole;
  });

  const currentConversation = conversations.find(conv => conv.id === selectedConversation);
  const conversationMessages = messages.filter(msg => 
    (msg.sender_id === selectedConversation && msg.recipient_id === user?.id) ||
    (msg.sender_id === user?.id && msg.recipient_id === selectedConversation)
  );

  const messageStats = [
    { 
      title: 'Total Messages', 
      value: messages.length.toString(), 
      subtitle: 'All conversations',
      icon: Message,
      color: 'primary' as const,
      trend: 'up' as const,
      trendValue: 'All conversations'
    },
    { 
      title: 'Unread', 
      value: conversations.reduce((sum, conv) => sum + conv.unread_count, 0).toString(), 
      subtitle: 'Need attention',
      icon: Notifications,
      color: 'warning' as const,
      trend: 'up' as const,
      trendValue: 'Need attention'
    },
    { 
      title: 'Active Chats', 
      value: conversations.length.toString(), 
      subtitle: 'Ongoing conversations',
      icon: Forum,
      color: 'success' as const,
      trend: 'up' as const,
      trendValue: 'Ongoing conversations'
    },
    { 
      title: 'Response Rate', 
      value: '95%', 
      subtitle: 'Within 24 hours',
      icon: TrendingUp,
      color: 'info' as const,
      trend: 'up' as const,
      trendValue: 'Within 24 hours'
    },
  ];

  return (
    <div ref={containerRef} className={`min-h-screen relative ${
      isDark ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      {/* Remove decorative elements */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Card className="header-card overflow-hidden mb-8" elevation={3}>
          <div className={`p-8 text-white relative ${
            isDark 
              ? 'bg-gradient-to-r from-dark-surface to-dark-bg' 
              : 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark'
          }`}>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl ${
              isDark ? 'bg-lime/10' : 'bg-white/10'
            }`}></div>
            <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full blur-xl ${
              isDark ? 'bg-dark-accent/20' : 'bg-asu-gold/20'
            }`}></div>
            
            <div className="relative z-10">
              <Typography variant="h3" className="font-bold mb-4 text-white">
                Messages
              </Typography>
              <Typography variant="subtitle1" className={`mb-6 max-w-3xl ${
                isDark ? 'text-dark-muted' : 'text-white/90'
              }`}>
                Connect with students and employers through our messaging system
              </Typography>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <EmojiEvents className="h-5 w-5" />
                  <span>Real-time messaging</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <People className="h-5 w-5" />
                  <span>Professional networking</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Star className="h-5 w-5" />
                  <span>Secure communication</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {messageStats.map((stat, index) => (
            <div key={index} className="stats-card">
              <StatsCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                subtitle={stat.subtitle}
                color={stat.color}
                trend={stat.trend}
                trendValue={stat.trendValue}
                delay={index * 0.1}
                rotation={index % 2 === 0 ? -0.5 : 0.5}
              />
            </div>
          ))}
        </div>

        {/* Messages Interface */}
        <Card className="overflow-hidden h-[700px]" elevation={3}>
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className={`w-1/3 border-r flex flex-col ${
              isDark ? 'border-lime/20' : 'border-gray-200'
            }`}>
              {/* Search and Filter */}
              <div className={`p-4 border-b ${
                isDark 
                  ? 'border-lime/20 bg-gradient-to-r from-lime to-dark-accent' 
                  : 'border-gray-200 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark'
              }`}>
                <div className="mb-4">
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startIcon={<Search />}
                    variant="outlined"
                    fullWidth
                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <FilterList className="h-4 w-4 text-white/70" />
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value as 'all' | 'student' | 'employer')}
                    className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Students</option>
                    <option value="employer">Employers</option>
                  </select>
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`conversation-card p-4 border-b cursor-pointer transition-colors ${
                      isDark 
                        ? `border-lime/10 hover:bg-dark-bg ${
                            selectedConversation === conversation.id 
                              ? 'bg-lime/5 border-l-4 border-l-lime' 
                              : ''
                          }`
                        : `border-gray-100 hover:bg-gray-50 ${
                            selectedConversation === conversation.id 
                              ? 'bg-asu-maroon/5 border-l-4 border-l-asu-maroon' 
                              : ''
                          }`
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar
                          src={conversation.participant_avatar}
                          alt={conversation.participant_name}
                          size="md"
                          fallback={conversation.participant_name[0]}
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${getRoleColor(conversation.participant_role)}`}>
                          {getRoleIcon(conversation.participant_role)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <Typography variant="subtitle2" color="textPrimary" className="font-semibold truncate">
                            {conversation.participant_name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(conversation.last_message_time).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </Typography>
                        </div>
                        {conversation.job_title && (
                          <div className="flex items-center space-x-1 mb-1">
                            <Work className={`h-3 w-3 ${isDark ? 'text-dark-muted' : 'text-gray-400'}`} />
                            <Typography variant="caption" color="textSecondary" className="truncate">
                              {conversation.job_title}
                            </Typography>
                          </div>
                        )}
                        <Typography variant="body2" color="textSecondary" className="truncate">
                          {conversation.last_message}
                        </Typography>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col messages-area">
              {selectedConversation && currentConversation ? (
                <>
                  {/* Chat Header */}
                  <div className={`p-4 border-b ${
                    isDark 
                      ? 'border-lime/20 bg-gradient-to-r from-dark-surface to-dark-bg' 
                      : 'border-gray-200 bg-gradient-to-r from-white to-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar
                            src={currentConversation.participant_avatar}
                            alt={currentConversation.participant_name}
                            size="md"
                            fallback={currentConversation.participant_name[0]}
                          />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${getRoleColor(currentConversation.participant_role)}`}>
                            {getRoleIcon(currentConversation.participant_role)}
                          </div>
                        </div>
                        <div>
                          <Typography variant="subtitle1" color="textPrimary" className="font-semibold">
                            {currentConversation.participant_name}
                          </Typography>
                          {currentConversation.job_title && (
                            <div className="flex items-center space-x-1">
                              <Work className={`h-3 w-3 ${isDark ? 'text-dark-muted' : 'text-gray-400'}`} />
                              <Typography variant="caption" color="textSecondary">
                                {currentConversation.job_title}
                              </Typography>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="text" size="small" className="min-w-0 p-2">
                          <PhoneInTalk className="h-5 w-5" />
                        </Button>
                        <Button variant="text" size="small" className="min-w-0 p-2">
                          <VideoCallOutlined className="h-5 w-5" />
                        </Button>
                        <Button variant="text" size="small" className="min-w-0 p-2">
                          <MoreHoriz className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {conversationMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                            message.sender_id === user?.id
                              ? isDark
                                ? 'bg-lime text-dark-surface rounded-br-md'
                                : 'bg-asu-maroon text-white rounded-br-md'
                              : isDark
                                ? 'bg-dark-bg text-dark-text rounded-bl-md'
                                : 'bg-gray-100 text-gray-900 rounded-bl-md'
                          }`}
                        >
                          <Typography variant="body2" className="mb-2">
                            {message.content}
                          </Typography>
                          <div className="flex items-center justify-between">
                            <Typography variant="caption" className={`${
                              message.sender_id === user?.id 
                                ? isDark 
                                  ? 'text-dark-surface/70' 
                                  : 'text-white/70'
                                : isDark 
                                  ? 'text-dark-muted' 
                                  : 'text-gray-500'
                            }`}>
                              {new Date(message.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </Typography>
                            {message.sender_id === user?.id && (
                              <div className="ml-2">
                                {message.read ? (
                                  <DoneAll className={`h-4 w-4 ${
                                    isDark ? 'text-dark-surface/70' : 'text-white/70'
                                  }`} />
                                ) : (
                                  <Check className={`h-4 w-4 ${
                                    isDark ? 'text-dark-surface/70' : 'text-white/70'
                                  }`} />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className={`p-4 border-t ${
                    isDark 
                      ? 'border-lime/20 bg-gradient-to-r from-dark-surface to-dark-bg' 
                      : 'border-gray-200 bg-gradient-to-r from-white to-gray-50'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <Button variant="text" size="small" className="min-w-0 p-2">
                        <AttachFile className="h-5 w-5" />
                      </Button>
                      <div className="flex-1">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type your message..."
                          variant="outlined"
                          fullWidth
                          endIcon={
                            <Button variant="text" size="small" className="min-w-0 p-1">
                              <EmojiEmotions className="h-5 w-5" />
                            </Button>
                          }
                        />
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        variant="contained"
                        color="primary"
                        size="small"
                        className="min-w-0 p-3"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                /* No Conversation Selected */
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-lime/20' : 'bg-asu-maroon/10'
                    }`}>
                      <Chat className={`w-12 h-12 ${
                        isDark ? 'text-lime' : 'text-asu-maroon'
                      }`} />
                    </div>
                    <Typography variant="h5" color="textPrimary" className="font-bold mb-4">
                      Select a conversation
                    </Typography>
                    <Typography variant="body1" color="textSecondary" className="mb-6">
                      Choose a conversation from the sidebar to start messaging
                    </Typography>
                    <Button 
                      variant="outlined"
                      color="primary"
                      startIcon={<Add />}
                    >
                      Start New Conversation
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Helper functions
const getRoleIcon = (role: string) => {
  switch (role) {
    case 'student':
      return <School className="h-3 w-3" />;
    case 'employer':
      return <Business className="h-3 w-3" />;
    default:
      return <Person className="h-3 w-3" />;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'student':
      return 'bg-blue-100 text-blue-800';
    case 'employer':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
