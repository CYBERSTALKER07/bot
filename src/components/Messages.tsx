import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Image, 
  User, 
  Building2, 
  Calendar, 
  Clock, 
  Check, 
  CheckCheck, 
  Star, 
  Heart, 
  Coffee, 
  Sparkles, 
  Archive, 
  Trash2, 
  Pin, 
  Mute,
  TrendingUp,
  Users,
  Mail,
  Bell,
  Bookmark,
  Reply,
  Forward,
  Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'student' | 'employer' | 'admin';
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file';
  attachment_url?: string;
}

interface Conversation {
  id: string;
  participant_id: string;
  participant_name: string;
  participant_role: 'student' | 'employer' | 'admin';
  participant_avatar?: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  is_online: boolean;
  job_title?: string;
  company?: string;
  pinned: boolean;
  archived: boolean;
}

export default function Messages() {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate smooth loading
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Mock data
  const conversations: Conversation[] = [
    {
      id: '1',
      participant_id: 'emp-1',
      participant_name: 'Sarah Chen',
      participant_role: 'employer',
      last_message: 'Great! Looking forward to discussing the position with you.',
      last_message_time: '2024-01-15T10:30:00Z',
      unread_count: 2,
      is_online: true,
      job_title: 'Software Engineer Intern',
      company: 'Google',
      pinned: true,
      archived: false
    },
    {
      id: '2',
      participant_id: 'emp-2',
      participant_name: 'Michael Rodriguez',
      participant_role: 'employer',
      last_message: 'Can you send me your portfolio?',
      last_message_time: '2024-01-14T15:20:00Z',
      unread_count: 0,
      is_online: false,
      job_title: 'UI/UX Designer Intern',
      company: 'Adobe',
      pinned: false,
      archived: false
    },
    {
      id: '3',
      participant_id: 'stu-1',
      participant_name: 'Emily Johnson',
      participant_role: 'student',
      last_message: 'Thank you for the interview opportunity!',
      last_message_time: '2024-01-13T09:15:00Z',
      unread_count: 1,
      is_online: true,
      pinned: false,
      archived: false
    },
    {
      id: '4',
      participant_id: 'stu-2',
      participant_name: 'John Doe',
      participant_role: 'student',
      last_message: 'I have some questions about the job responsibilities.',
      last_message_time: '2024-01-12T14:10:00Z',
      unread_count: 3,
      is_online: false,
      pinned: false,
      archived: false
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      conversation_id: '1',
      sender_id: 'emp-1',
      sender_name: 'Sarah Chen',
      sender_role: 'employer',
      content: 'Hi! I reviewed your application for the Software Engineer Intern position. Very impressed with your projects!',
      timestamp: '2024-01-15T09:00:00Z',
      read: true,
      type: 'text'
    },
    {
      id: '2',
      conversation_id: '1',
      sender_id: user?.id || 'current-user',
      sender_name: user?.name || 'You',
      sender_role: user?.role || 'student',
      content: 'Thank you so much! I\'m really excited about this opportunity.',
      timestamp: '2024-01-15T09:15:00Z',
      read: true,
      type: 'text'
    },
    {
      id: '3',
      conversation_id: '1',
      sender_id: 'emp-1',
      sender_name: 'Sarah Chen',
      sender_role: 'employer',
      content: 'Would you be available for a quick video call this week?',
      timestamp: '2024-01-15T10:00:00Z',
      read: true,
      type: 'text'
    },
    {
      id: '4',
      conversation_id: '1',
      sender_id: user?.id || 'current-user',
      sender_name: user?.name || 'You',
      sender_role: user?.role || 'student',
      content: 'Absolutely! I\'m free Wednesday through Friday afternoons.',
      timestamp: '2024-01-15T10:15:00Z',
      read: true,
      type: 'text'
    },
    {
      id: '5',
      conversation_id: '1',
      sender_id: 'emp-1',
      sender_name: 'Sarah Chen',
      sender_role: 'employer',
      content: 'Great! Looking forward to discussing the position with you.',
      timestamp: '2024-01-15T10:30:00Z',
      read: false,
      type: 'text'
    },
    {
      id: '6',
      conversation_id: '2',
      sender_id: 'emp-2',
      sender_name: 'Michael Rodriguez',
      sender_role: 'employer',
      content: 'Hi! I\'m reviewing your application for the UI/UX Designer Intern position. Impressive portfolio!',
      timestamp: '2024-01-14T14:00:00Z',
      read: true,
      type: 'text'
    },
    {
      id: '7',
      conversation_id: '2',
      sender_id: user?.id || 'current-user',
      sender_name: user?.name || 'You',
      sender_role: user?.role || 'student',
      content: 'Thank you! I\'m excited about the opportunity at Adobe.',
      timestamp: '2024-01-14T14:05:00Z',
      read: true,
      type: 'text'
    },
    {
      id: '8',
      conversation_id: '2',
      sender_id: 'emp-2',
      sender_name: 'Michael Rodriguez',
      sender_role: 'employer',
      content: 'Can you tell me about your experience with design systems?',
      timestamp: '2024-01-14T14:10:00Z',
      read: true,
      type: 'text'
    },
    {
      id: '9',
      conversation_id: '2',
      sender_id: user?.id || 'current-user',
      sender_name: user?.name || 'You',
      sender_role: user?.role || 'student',
      content: 'I\'ve worked with design systems extensively in my previous projects. I can share some examples during the interview.',
      timestamp: '2024-01-14T14:15:00Z',
      read: true,
      type: 'text'
    },
    {
      id: '10',
      conversation_id: '3',
      sender_id: 'stu-1',
      sender_name: 'Emily Johnson',
      sender_role: 'student',
      content: 'Hi! I\'m interested in the Software Engineer Intern position. Can we discuss this further?',
      timestamp: '2024-01-13T09:00:00Z',
      read: true,
      type: 'text'
    },
    {
      id: '11',
      conversation_id: '3',
      sender_id: 'emp-1',
      sender_name: 'Sarah Chen',
      sender_role: 'employer',
      content: 'Hello Emily! I\'d be happy to discuss the position with you. When are you available for a call?',
      timestamp: '2024-01-13T09:05:00Z',
      read: true,
      type: 'text'
    },
    {
      id: '12',
      conversation_id: '3',
      sender_id: user?.id || 'current-user',
      sender_name: user?.name || 'You',
      sender_role: user?.role || 'student',
      content: 'Thank you for considering my application, Sarah. I\'m available for a call on Monday or Tuesday afternoon.',
      timestamp: '2024-01-13T09:10:00Z',
      read: true,
      type: 'text'
    },
    {
      id: '13',
      conversation_id: '3',
      sender_id: 'emp-1',
      sender_name: 'Sarah Chen',
      sender_role: 'employer',
      content: 'Great! I\'ll send you a calendar invite for Monday at 3 PM.',
      timestamp: '2024-01-13T09:15:00Z',
      read: false,
      type: 'text'
    },
    {
      id: '14',
      conversation_id: '4',
      sender_id: 'stu-2',
      sender_name: 'John Doe',
      sender_role: 'student',
      content: 'Hello! I have some questions regarding the job responsibilities for the Software Engineer Intern position.',
      timestamp: '2024-01-12T14:00:00Z',
      read: true,
      type: 'text'
    },
    {
      id: '15',
      conversation_id: '4',
      sender_id: 'emp-1',
      sender_name: 'Sarah Chen',
      sender_role: 'employer',
      content: 'Hi John! I\'d be happy to provide more information. What would you like to know?',
      timestamp: '2024-01-12T14:05:00Z',
      read: true,
      type: 'text'
    },
    {
      id: '16',
      conversation_id: '4',
      sender_id: user?.id || 'current-user',
      sender_name: user?.name || 'You',
      sender_role: user?.role || 'student',
      content: 'Thank you for the quick response, Sarah. Could you please elaborate on the day-to-day responsibilities?',
      timestamp: '2024-01-12T14:10:00Z',
      read: true,
      type: 'text'
    },
    {
      id: '17',
      conversation_id: '4',
      sender_id: 'emp-1',
      sender_name: 'Sarah Chen',
      sender_role: 'employer',
      content: 'Certainly! As an intern, you\'ll be working on developing features, fixing bugs, and collaborating with the team on various projects.',
      timestamp: '2024-01-12T14:15:00Z',
      read: false,
      type: 'text'
    }
  ];

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConversation]);

  const filteredConversations = conversations.filter(conv =>
    conv.participant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.last_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conv.company && conv.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const conversationMessages = messages.filter(m => m.conversation_id === selectedConversation);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'recruitment':
        return 'bg-blue-100 text-blue-800';
      case 'interview':
        return 'bg-purple-100 text-purple-800';
      case 'networking':
        return 'bg-green-100 text-green-800';
      case 'offer':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: conversations.length,
    unread: conversations.reduce((acc, conv) => acc + conv.unread_count, 0),
    active: conversations.filter(conv => conv.is_online).length,
    offers: conversations.filter(conv => conv.last_message.includes('Congratulations')).length
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-white ${isLoaded ? 'animate-fade-in' : ''}`}>
      {/* Decorative elements */}
      <div className="absolute top-16 right-24 w-4 h-4 bg-asu-gold/40 rounded-full animate-float"></div>
      <div className="absolute top-32 left-16 w-3 h-3 bg-asu-maroon/30 rounded-full animate-float animate-delay-200"></div>
      <Sparkles className="absolute top-24 left-1/4 h-5 w-5 text-asu-gold/60 animate-bounce-gentle" />
      <Coffee className="absolute bottom-32 right-1/4 h-4 w-4 text-asu-maroon/50 animate-float animate-delay-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-3xl p-8 text-white relative overflow-hidden hover-glow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-4 relative">
                Messages 💬
                <div className="absolute -top-2 -right-6 w-4 h-4 bg-asu-gold rounded-full animate-pulse-gentle"></div>
              </h1>
              <p className="text-lg text-white/90 mb-6">
                Connect with recruiters, hiring managers, and industry professionals 🤝
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover-scale">
                  <MessageSquare className="h-4 w-4" />
                  <span>{stats.total} conversations</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover-scale">
                  <Bell className="h-4 w-4" />
                  <span>{stats.unread} unread</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover-scale">
                  <Users className="h-4 w-4" />
                  <span>{stats.active} online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats with animations */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 interactive-card animate-slide-up animate-delay-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Messages</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center icon-bounce">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-blue-600 text-sm bg-blue-50 rounded-full px-3 py-1 w-fit">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>Active networking 📈</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 interactive-card animate-slide-up animate-delay-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Unread</p>
                <p className="text-3xl font-bold text-gray-900">{stats.unread}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center icon-bounce">
                <Mail className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-red-600 text-sm bg-red-50 rounded-full px-3 py-1 w-fit">
              <Mail className="h-4 w-4 mr-1" />
              <span>Needs attention 📨</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 interactive-card animate-slide-up animate-delay-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Contacts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center icon-bounce">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600 text-sm bg-green-50 rounded-full px-3 py-1 w-fit">
              <Heart className="h-4 w-4 mr-1" />
              <span>Online now 🟢</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 interactive-card animate-slide-up animate-delay-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Job Offers</p>
                <p className="text-3xl font-bold text-gray-900">{stats.offers}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center icon-bounce">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-yellow-600 text-sm bg-yellow-50 rounded-full px-3 py-1 w-fit">
              <Sparkles className="h-4 w-4 mr-1" />
              <span>Opportunities! 🎉</span>
            </div>
          </div>
        </div>

        {/* Messages Interface */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-slide-up animate-delay-500">
          <div className="flex h-[600px]">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-gray-50 input-focus"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation, index) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 cursor-pointer transition-all duration-200 border-b border-gray-100 hover:bg-gray-50 interactive-card animate-slide-right ${
                      selectedConversation === conversation.id ? 'bg-asu-maroon/5 border-l-4 border-l-asu-maroon' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-asu-maroon to-asu-gold rounded-full flex items-center justify-center text-white font-bold">
                          {conversation.participant_name.charAt(0)}
                        </div>
                        {conversation.is_online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse-gentle"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">{conversation.participant_name}</h3>
                          <span className="text-xs text-gray-500">{conversation.last_message_time}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation.company}</p>
                        <p className="text-xs text-gray-500 truncate mt-1">{conversation.last_message}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        {conversation.unread_count > 0 && (
                          <span className="bg-asu-maroon text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce-gentle">
                            {conversation.unread_count}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full ${getMessageTypeColor(conversation.participant_role)}`}>
                          {conversation.participant_role}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message View */}
            <div className="flex-1 flex flex-col">
              {selectedConv ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-asu-maroon to-asu-gold rounded-full flex items-center justify-center text-white font-bold">
                          {conversations.find(c => c.id === selectedConversation)?.participant_name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {conversations.find(c => c.id === selectedConversation)?.participant_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {conversations.find(c => c.id === selectedConversation)?.company}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors icon-bounce">
                          <Phone className="h-5 w-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors icon-bounce">
                          <Video className="h-5 w-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors icon-bounce">
                          <MoreVertical className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {conversationMessages.map((message, index) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'} animate-slide-up`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          message.sender_id === user?.id
                            ? 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white'
                            : 'bg-gray-100 text-gray-900'
                        } hover-scale`}>
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-75">
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {message.sender_id === user?.id && (
                              <CheckCircle2 className={`h-4 w-4 ${message.read ? 'text-blue-300' : 'text-gray-400'}`} />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-white to-gray-50">
                    <div className="flex items-center space-x-4">
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors icon-bounce">
                        <Paperclip className="h-5 w-5 text-gray-600" />
                      </button>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white input-focus"
                        />
                        <button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Smile className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="interactive-button bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white p-3 rounded-full hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                    
                    {showEmojiPicker && (
                      <div className="absolute bottom-20 right-4 bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-2xl z-10">
                        <div className="grid grid-cols-8 gap-2">
                          {['😊', '😍', '👍', '❤️', '😂', '🔥', '💯', '🎉', '✨', '🚀', '💪', '🙌', '👏', '🎯', '💡', '🌟'].map((emoji, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setNewMessage(prev => prev + emoji);
                                setShowEmojiPicker(false);
                              }}
                              className="text-2xl hover:bg-asu-maroon/10 p-2 rounded-xl transition-all duration-200"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center animate-scale-in">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-asu-maroon/10 to-asu-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-gentle">
                      <MessageSquare className="h-12 w-12 text-asu-maroon" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a conversation from the list to start messaging 💬</p>
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
