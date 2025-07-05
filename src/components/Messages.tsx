import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  Search, 
  Send, 
  User, 
  Clock, 
  MessageCircle, 
  Phone, 
  Video, 
  MoreHorizontal, 
  Paperclip, 
  Smile,
  Star,
  Archive,
  Trash2,
  Circle,
  Check,
  CheckCheck,
  Filter,
  Plus,
  Building2,
  GraduationCap,
  Briefcase,
  Coffee,
  Heart,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

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
    // Mock conversations data - replace with Supabase fetch
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

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate conversations list
      gsap.fromTo(conversationsRef.current, {
        x: -50,
        opacity: 0
      }, {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
      });

      // Animate messages area
      gsap.fromTo(messagesRef.current, {
        x: 50,
        opacity: 0
      }, {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
      });

      // Floating decorations
      gsap.to('.messages-decoration', {
        y: -15,
        x: 10,
        rotation: 360,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return <GraduationCap className="h-4 w-4" />;
      case 'employer':
        return <Building2 className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800';
      case 'employer':
        return isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800';
      default:
        return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div ref={containerRef} className={`min-h-screen relative transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-dark-bg to-dark-surface' : 'bg-gradient-to-br from-gray-50 to-white'
    }`}>
      {/* Decorative elements */}
      <div className={`messages-decoration absolute top-16 right-24 w-4 h-4 rounded-full ${
        isDark ? 'bg-lime/40' : 'bg-asu-gold/40'
      }`}></div>
      <div className={`messages-decoration absolute top-32 left-16 w-3 h-3 rounded-full ${
        isDark ? 'bg-lime/30' : 'bg-asu-maroon/30'
      }`}></div>
      <Sparkles className={`messages-decoration absolute top-24 left-1/4 h-5 w-5 ${
        isDark ? 'text-lime/60' : 'text-asu-gold/60'
      }`} />
      <Coffee className={`messages-decoration absolute bottom-32 right-1/4 h-4 w-4 ${
        isDark ? 'text-lime/50' : 'text-asu-maroon/50'
      }`} />
      <Heart className={`messages-decoration absolute bottom-20 left-1/3 h-4 w-4 ${
        isDark ? 'text-lime/70' : 'text-asu-gold/70'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 transition-colors ${
            isDark ? 'text-dark-text' : 'text-gray-900'
          }`}>Messages</h1>
          <p className={`transition-colors ${
            isDark ? 'text-dark-muted' : 'text-gray-600'
          }`}>Connect with students and employers</p>
        </div>

        <div className={`rounded-3xl shadow-lg border overflow-hidden transition-colors duration-300 ${
          isDark ? 'bg-dark-surface border-lime/20' : 'bg-white border-gray-100'
        }`}>
          <div className="flex h-[700px]">
            {/* Conversations Sidebar */}
            <div ref={conversationsRef} className={`w-1/3 border-r flex flex-col transition-colors duration-300 ${
              isDark ? 'border-lime/20' : 'border-gray-200'
            }`}>
              {/* Search and Filter */}
              <div className={`p-4 border-b transition-colors duration-300 ${
                isDark 
                  ? 'border-lime/20 bg-gradient-to-r from-lime to-dark-accent' 
                  : 'border-gray-200 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark'
              }`}>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-white/70" />
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
                    className={`p-4 border-b cursor-pointer transition-colors ${
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
                        {conversation.participant_avatar ? (
                          <img
                            src={conversation.participant_avatar}
                            alt={conversation.participant_name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isDark ? 'bg-lime/20' : 'bg-asu-maroon/20'
                          }`}>
                            <User className={`h-6 w-6 ${
                              isDark ? 'text-lime' : 'text-asu-maroon'
                            }`} />
                          </div>
                        )}
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${getRoleColor(conversation.participant_role)}`}>
                          {getRoleIcon(conversation.participant_role)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold truncate transition-colors ${
                            isDark ? 'text-dark-text' : 'text-gray-900'
                          }`}>{conversation.participant_name}</h3>
                          <span className={`text-xs transition-colors ${
                            isDark ? 'text-dark-muted' : 'text-gray-500'
                          }`}>
                            {new Date(conversation.last_message_time).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        {conversation.job_title && (
                          <div className="flex items-center space-x-1 mb-1">
                            <Briefcase className={`h-3 w-3 transition-colors ${
                              isDark ? 'text-dark-muted' : 'text-gray-400'
                            }`} />
                            <span className={`text-xs truncate transition-colors ${
                              isDark ? 'text-dark-muted' : 'text-gray-500'
                            }`}>{conversation.job_title}</span>
                          </div>
                        )}
                        <p className={`text-sm truncate transition-colors ${
                          isDark ? 'text-dark-muted' : 'text-gray-600'
                        }`}>{conversation.last_message}</p>
                        {conversation.unread_count > 0 && (
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs transition-colors ${
                              isDark ? 'text-dark-muted' : 'text-gray-500'
                            }`}>
                              {conversation.unread_count} unread
                            </span>
                            <div className={`w-2 h-2 rounded-full ${
                              isDark ? 'bg-lime' : 'bg-asu-maroon'
                            }`}></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages Area */}
            <div ref={messagesRef} className="flex-1 flex flex-col">
              {selectedConversation && currentConversation ? (
                <>
                  {/* Chat Header */}
                  <div className={`p-4 border-b transition-colors duration-300 ${
                    isDark 
                      ? 'border-lime/20 bg-gradient-to-r from-dark-surface to-dark-bg' 
                      : 'border-gray-200 bg-gradient-to-r from-white to-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          {currentConversation.participant_avatar ? (
                            <img
                              src={currentConversation.participant_avatar}
                              alt={currentConversation.participant_name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isDark ? 'bg-lime/20' : 'bg-asu-maroon/20'
                            }`}>
                              <User className={`h-5 w-5 ${
                                isDark ? 'text-lime' : 'text-asu-maroon'
                              }`} />
                            </div>
                          )}
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${getRoleColor(currentConversation.participant_role)}`}>
                            {getRoleIcon(currentConversation.participant_role)}
                          </div>
                        </div>
                        <div>
                          <h3 className={`font-semibold transition-colors ${
                            isDark ? 'text-dark-text' : 'text-gray-900'
                          }`}>{currentConversation.participant_name}</h3>
                          {currentConversation.job_title && (
                            <div className="flex items-center space-x-1">
                              <Briefcase className={`h-3 w-3 transition-colors ${
                                isDark ? 'text-dark-muted' : 'text-gray-400'
                              }`} />
                              <span className={`text-xs transition-colors ${
                                isDark ? 'text-dark-muted' : 'text-gray-500'
                              }`}>{currentConversation.job_title}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className={`p-2 rounded-full transition-colors ${
                          isDark ? 'hover:bg-dark-bg' : 'hover:bg-gray-100'
                        }`}>
                          <Phone className={`h-5 w-5 transition-colors ${
                            isDark ? 'text-dark-muted' : 'text-gray-600'
                          }`} />
                        </button>
                        <button className={`p-2 rounded-full transition-colors ${
                          isDark ? 'hover:bg-dark-bg' : 'hover:bg-gray-100'
                        }`}>
                          <Video className={`h-5 w-5 transition-colors ${
                            isDark ? 'text-dark-muted' : 'text-gray-600'
                          }`} />
                        </button>
                        <button className={`p-2 rounded-full transition-colors ${
                          isDark ? 'hover:bg-dark-bg' : 'hover:bg-gray-100'
                        }`}>
                          <MoreHorizontal className={`h-5 w-5 transition-colors ${
                            isDark ? 'text-dark-muted' : 'text-gray-600'
                          }`} />
                        </button>
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
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs ${
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
                            </span>
                            {message.sender_id === user?.id && (
                              <div className="ml-2">
                                {message.read ? (
                                  <CheckCheck className={`h-4 w-4 ${
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
                  <div className={`p-4 border-t transition-colors duration-300 ${
                    isDark 
                      ? 'border-lime/20 bg-gradient-to-r from-dark-surface to-dark-bg' 
                      : 'border-gray-200 bg-gradient-to-r from-white to-gray-50'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <button className={`p-2 rounded-full transition-colors ${
                        isDark ? 'hover:bg-dark-bg' : 'hover:bg-gray-100'
                      }`}>
                        <Paperclip className={`h-5 w-5 transition-colors ${
                          isDark ? 'text-dark-muted' : 'text-gray-600'
                        }`} />
                      </button>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type your message..."
                          className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                            isDark 
                              ? 'border-lime/20 focus:ring-lime bg-dark-bg text-dark-text placeholder-dark-muted' 
                              : 'border-gray-300 focus:ring-asu-maroon bg-white text-gray-900'
                          }`}
                        />
                        <button className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                          isDark ? 'hover:bg-dark-bg' : 'hover:bg-gray-100'
                        }`}>
                          <Smile className={`h-5 w-5 transition-colors ${
                            isDark ? 'text-dark-muted' : 'text-gray-600'
                          }`} />
                        </button>
                      </div>
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className={`p-3 text-white rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          isDark 
                            ? 'bg-lime hover:bg-dark-accent text-dark-surface' 
                            : 'bg-asu-maroon hover:bg-asu-maroon-dark'
                        }`}
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* No Conversation Selected */
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className={`h-24 w-24 mx-auto mb-4 transition-colors ${
                      isDark ? 'text-dark-muted' : 'text-gray-300'
                    }`} />
                    <h3 className={`text-xl font-medium mb-2 transition-colors ${
                      isDark ? 'text-dark-text' : 'text-gray-900'
                    }`}>Select a conversation</h3>
                    <p className={`transition-colors ${
                      isDark ? 'text-dark-muted' : 'text-gray-500'
                    }`}>Choose a conversation from the sidebar to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
