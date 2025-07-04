import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  MessageCircle, 
  Send, 
  Search, 
  Filter, 
  Phone, 
  Video, 
  MoreHorizontal,
  Paperclip,
  Smile,
  Star,
  Archive,
  Trash2,
  Clock,
  CheckCircle,
  Check,
  Users,
  Building2,
  GraduationCap,
  MapPin,
  Calendar,
  Image,
  FileText,
  Download,
  Eye,
  Sparkles,
  Coffee,
  Heart,
  BookOpen,
  Target,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: {
    type: 'image' | 'document' | 'link';
    url: string;
    name: string;
    size?: string;
  }[];
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantTitle: string;
  participantCompany?: string;
  participantLocation?: string;
  lastMessage: Message;
  unreadCount: number;
  isOnline: boolean;
  isPinned: boolean;
  conversationType: 'job_inquiry' | 'interview' | 'general' | 'application_update';
  jobTitle?: string;
  messages: Message[];
}

export default function Messages() {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'pinned' | 'job_inquiry' | 'interview'>('all');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance animation
      gsap.fromTo(headerRef.current, {
        opacity: 0,
        y: -60,
        scale: 0.8,
        rotation: -2
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 1.5,
        ease: 'power3.out'
      });

      // Sidebar entrance
      gsap.fromTo(sidebarRef.current, {
        opacity: 0,
        x: -100,
        scale: 0.9
      }, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.3
      });

      // Chat area entrance
      gsap.fromTo(chatRef.current, {
        opacity: 0,
        x: 100,
        scale: 0.9
      }, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.5
      });

      // Conversation items entrance
      gsap.fromTo('.conversation-item', {
        opacity: 0,
        y: 40,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        delay: 0.7
      });

      // Message bubbles entrance
      gsap.fromTo('.message-bubble', {
        opacity: 0,
        y: 20,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        delay: 0.9
      });

      // Floating decorations
      gsap.to('.message-decoration', {
        y: -12,
        x: 6,
        rotation: 360,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Online indicators animation
      gsap.to('.online-indicator', {
        scale: 1.2,
        opacity: 0.8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation?.messages]);

  const mockConversations: Conversation[] = [
    {
      id: '1',
      participantId: '1',
      participantName: 'Sarah Johnson',
      participantAvatar: '👩‍💻',
      participantTitle: 'Software Engineer',
      participantCompany: 'Tech Corp',
      participantLocation: 'San Francisco, CA',
      conversationType: 'job_inquiry',
      jobTitle: 'Full Stack Developer',
      unreadCount: 2,
      isOnline: true,
      isPinned: true,
      lastMessage: {
        id: '1',
        senderId: '1',
        senderName: 'Sarah Johnson',
        senderAvatar: '👩‍💻',
        content: 'Thank you for considering my application! I would love to discuss the Full Stack Developer position further.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false
      },
      messages: [
        {
          id: '1',
          senderId: 'employer',
          senderName: 'You',
          senderAvatar: '👨‍💼',
          content: 'Hi Sarah! I reviewed your application and I\'m impressed with your experience. Would you be available for a quick call this week?',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: true
        },
        {
          id: '2',
          senderId: '1',
          senderName: 'Sarah Johnson',
          senderAvatar: '👩‍💻',
          content: 'Thank you for considering my application! I would love to discuss the Full Stack Developer position further.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isRead: false
        }
      ]
    },
    {
      id: '2',
      participantId: '2',
      participantName: 'Michael Chen',
      participantAvatar: '👨‍🔬',
      participantTitle: 'Data Scientist',
      participantCompany: 'Analytics Pro',
      participantLocation: 'Seattle, WA',
      conversationType: 'interview',
      jobTitle: 'Data Analyst',
      unreadCount: 0,
      isOnline: false,
      isPinned: false,
      lastMessage: {
        id: '1',
        senderId: 'employer',
        senderName: 'You',
        senderAvatar: '👨‍💼',
        content: 'Great! I\'ll send you the calendar invite for Tuesday at 2 PM.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true
      },
      messages: [
        {
          id: '1',
          senderId: '2',
          senderName: 'Michael Chen',
          senderAvatar: '👨‍🔬',
          content: 'Hi! I wanted to follow up on the Data Analyst position. When would be a good time for the interview?',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          isRead: true
        },
        {
          id: '2',
          senderId: 'employer',
          senderName: 'You',
          senderAvatar: '👨‍💼',
          content: 'Hi Michael! Thanks for reaching out. How about Tuesday at 2 PM? We can do a video call.',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          isRead: true
        },
        {
          id: '3',
          senderId: '2',
          senderName: 'Michael Chen',
          senderAvatar: '👨‍🔬',
          content: 'Perfect! Tuesday at 2 PM works great for me. Should I prepare anything specific?',
          timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
          isRead: true
        },
        {
          id: '4',
          senderId: 'employer',
          senderName: 'You',
          senderAvatar: '👨‍💼',
          content: 'Great! I\'ll send you the calendar invite for Tuesday at 2 PM.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: true
        }
      ]
    },
    {
      id: '3',
      participantId: '3',
      participantName: 'Emily Rodriguez',
      participantAvatar: '🎨',
      participantTitle: 'UX Designer',
      participantCompany: 'Design Studio',
      participantLocation: 'Los Angeles, CA',
      conversationType: 'application_update',
      jobTitle: 'UI/UX Designer',
      unreadCount: 1,
      isOnline: true,
      isPinned: false,
      lastMessage: {
        id: '1',
        senderId: '3',
        senderName: 'Emily Rodriguez',
        senderAvatar: '🎨',
        content: 'I\'ve updated my portfolio with some new projects. Would you like me to share the link?',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        isRead: false
      },
      messages: [
        {
          id: '1',
          senderId: '3',
          senderName: 'Emily Rodriguez',
          senderAvatar: '🎨',
          content: 'I\'ve updated my portfolio with some new projects. Would you like me to share the link?',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          isRead: false,
          attachments: [
            {
              type: 'link',
              url: 'https://emily-portfolio.com',
              name: 'Portfolio Update'
            }
          ]
        }
      ]
    },
    {
      id: '4',
      participantId: '4',
      participantName: 'David Kim',
      participantAvatar: '📈',
      participantTitle: 'Marketing Specialist',
      participantCompany: 'Growth Agency',
      participantLocation: 'Austin, TX',
      conversationType: 'general',
      jobTitle: 'Marketing Coordinator',
      unreadCount: 0,
      isOnline: false,
      isPinned: true,
      lastMessage: {
        id: '1',
        senderId: 'employer',
        senderName: 'You',
        senderAvatar: '👨‍💼',
        content: 'Thanks for the quick response! Looking forward to working with you.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isRead: true
      },
      messages: [
        {
          id: '1',
          senderId: '4',
          senderName: 'David Kim',
          senderAvatar: '📈',
          content: 'Congratulations on the successful campaign launch! I\'m excited to contribute to future projects.',
          timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
          isRead: true
        },
        {
          id: '2',
          senderId: 'employer',
          senderName: 'You',
          senderAvatar: '👨‍💼',
          content: 'Thanks for the quick response! Looking forward to working with you.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          isRead: true
        }
      ]
    }
  ];

  const filteredConversations = mockConversations.filter(conversation => {
    const matchesSearch = conversation.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'unread' && conversation.unreadCount > 0) ||
                         (filterType === 'pinned' && conversation.isPinned) ||
                         conversation.conversationType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // Animation for sending message
      gsap.fromTo('.message-input', {
        scale: 0.95
      }, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out'
      });

      // Here you would send the message to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const conversationTypeColors = {
    job_inquiry: 'bg-blue-100 text-blue-800',
    interview: 'bg-purple-100 text-purple-800',
    general: 'bg-gray-100 text-gray-800',
    application_update: 'bg-green-100 text-green-800'
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative">
      {/* Decorative elements */}
      <div className="message-decoration absolute top-20 right-20 w-4 h-4 bg-asu-gold/40 rounded-full"></div>
      <div className="message-decoration absolute top-40 left-20 w-3 h-3 bg-asu-maroon/30 rounded-full"></div>
      <Sparkles className="message-decoration absolute top-32 left-1/4 h-5 w-5 text-asu-gold/60" />
      <Coffee className="message-decoration absolute bottom-32 right-1/3 h-4 w-4 text-asu-maroon/50" />
      <TrendingUp className="message-decoration absolute bottom-20 left-1/4 h-4 w-4 text-asu-gold/70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4 relative">
                Messages 💬
                <div className="absolute -top-3 -right-8 w-6 h-6 bg-asu-gold rounded-full"></div>
              </h1>
              <p className="text-xl text-white/90 mb-6 max-w-3xl">
                Connect with candidates and manage your conversations ✨
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Real-time messaging 🚀</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Users className="h-5 w-5" />
                  <span>Candidate communication 👥</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Target className="h-5 w-5" />
                  <span>Interview coordination 🎯</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Interface */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="flex h-[700px]">
            {/* Sidebar */}
            <div ref={sidebarRef} className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Sidebar Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Conversations</h2>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-asu-maroon hover:bg-asu-maroon/10 rounded-lg transition-colors">
                      <Filter className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-asu-maroon hover:bg-asu-maroon/10 rounded-lg transition-colors">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations... 🔍"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'unread', label: 'Unread' },
                    { key: 'pinned', label: 'Pinned' },
                    { key: 'job_inquiry', label: 'Job Inquiries' },
                    { key: 'interview', label: 'Interviews' }
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setFilterType(filter.key as any)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        filterType === filter.key
                          ? 'bg-asu-maroon text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`conversation-item p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                      selectedConversation?.id === conversation.id ? 'bg-asu-maroon/5 border-r-4 border-asu-maroon' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-asu-maroon/20 to-asu-gold/20 rounded-full flex items-center justify-center text-xl">
                          {conversation.participantAvatar}
                        </div>
                        {conversation.isOnline && (
                          <div className="online-indicator absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                        {conversation.isPinned && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-asu-gold rounded-full flex items-center justify-center">
                            <Star className="h-2 w-2 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {conversation.participantName}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm text-asu-maroon font-medium">
                            {conversation.participantTitle}
                          </span>
                          {conversation.jobTitle && (
                            <span className={`px-2 py-1 text-xs rounded-full ${conversationTypeColors[conversation.conversationType]}`}>
                              {conversation.jobTitle}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage.content}
                        </p>
                        {conversation.participantLocation && (
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{conversation.participantLocation}</span>
                          </div>
                        )}
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="w-6 h-6 bg-asu-maroon rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">
                            {conversation.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div ref={chatRef} className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-asu-maroon/20 to-asu-gold/20 rounded-full flex items-center justify-center text-xl">
                            {selectedConversation.participantAvatar}
                          </div>
                          {selectedConversation.isOnline && (
                            <div className="online-indicator absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {selectedConversation.participantName}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{selectedConversation.participantTitle}</span>
                            {selectedConversation.participantCompany && (
                              <>
                                <span>•</span>
                                <span>{selectedConversation.participantCompany}</span>
                              </>
                            )}
                          </div>
                          {selectedConversation.isOnline ? (
                            <span className="text-sm text-green-600">Online</span>
                          ) : (
                            <span className="text-sm text-gray-500">Last seen recently</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-500 hover:text-asu-maroon hover:bg-asu-maroon/10 rounded-lg transition-colors">
                          <Phone className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-asu-maroon hover:bg-asu-maroon/10 rounded-lg transition-colors">
                          <Video className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-asu-maroon hover:bg-asu-maroon/10 rounded-lg transition-colors">
                          <Star className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-asu-maroon hover:bg-asu-maroon/10 rounded-lg transition-colors">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`message-bubble flex ${
                          message.senderId === 'employer' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                          message.senderId === 'employer' 
                            ? 'bg-asu-maroon text-white' 
                            : 'bg-gray-100 text-gray-900'
                        } rounded-2xl px-4 py-3 shadow-sm`}>
                          <p className="text-sm">{message.content}</p>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2"></div>
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="flex items-center space-x-2"></div>
                                  {attachment.type === 'image' && <Image className="h-4 w-4" />}
                                  {attachment.type === 'document' && <FileText className="h-4 w-4" />}
                                  {attachment.type === 'link' && <Eye className="h-4 w-4" />}
                                  <span className="text-xs underline">{attachment.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-70">
                              {formatTime(message.timestamp)}
                            </span>
                            {message.senderId === 'employer' && (
                              <div className="flex items-center space-x-1">
                                {message.isRead ? (
                                  <CheckCircle className="h-3 w-3 opacity-70" />
                                ) : (
                                  <Check className="h-3 w-3 opacity-70" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="px-6 py-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span>{selectedConversation.participantName} is typing...</span>
                      </div>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="p-6 border-t border-gray-200 bg-white">
                    <div className="flex items-center space-x-4">
                      <button className="p-2 text-gray-500 hover:text-asu-maroon hover:bg-asu-maroon/10 rounded-lg transition-colors">
                        <Paperclip className="h-5 w-5" />
                      </button>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Type a message... 💬"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="message-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                        />
                        <button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-asu-maroon transition-colors"
                        >
                          <Smile className="h-5 w-5" />
                        </button>
                      </div>
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="p-3 bg-asu-maroon text-white rounded-xl hover:bg-asu-maroon-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-asu-maroon/20 to-asu-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageCircle className="h-12 w-12 text-asu-maroon" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Choose a conversation from the sidebar to start messaging with candidates! 💬
                    </p>
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
