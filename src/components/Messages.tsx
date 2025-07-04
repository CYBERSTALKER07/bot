import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  MessageSquare, 
  Search, 
  Send, 
  User, 
  Circle, 
  Video, 
  Phone, 
  MoreHorizontal, 
  Smile, 
  Paperclip, 
  Star, 
  TrendingUp, 
  Users, 
  Sparkles, 
  Coffee, 
  Heart, 
  Filter 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_type: 'student' | 'employer';
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    type: 'student' | 'employer';
    company?: string;
    avatar?: string;
  };
  lastMessage: Message;
  unreadCount: number;
  online: boolean;
}

export default function Messages() {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const conversationsRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance animation
      gsap.fromTo(headerRef.current, {
        opacity: 0,
        y: -60,
        scale: 0.8
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.4,
        ease: 'power3.out'
      });

      // Conversation cards entrance
      gsap.fromTo('.conversation-card', {
        opacity: 0,
        x: -50,
        scale: 0.9
      }, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.4
      });

      // Chat messages entrance
      gsap.fromTo('.message-item', {
        opacity: 0,
        y: 30,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
        stagger: 0.05,
        delay: 0.8
      });

      // Online indicators pulse
      gsap.to('.online-indicator', {
        scale: 1.2,
        opacity: 0.8,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
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

      // Typing indicator animation
      gsap.to('.typing-dot', {
        y: -4,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        stagger: 0.2
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const conversations: Conversation[] = [
    {
      id: '1',
      participant: {
        id: '1',
        name: 'Sarah Johnson',
        type: 'employer',
        company: 'Google',
        avatar: '👩‍💼'
      },
      lastMessage: {
        id: '1',
        sender_id: '1',
        sender_name: 'Sarah Johnson',
        sender_type: 'employer',
        content: 'Hi! I reviewed your application and I\'m impressed with your portfolio. Would you be available for a quick call this week?',
        timestamp: '2024-02-05T10:30:00Z',
        read: false
      },
      unreadCount: 2,
      online: true
    },
    {
      id: '2',
      participant: {
        id: '2',
        name: 'Michael Chen',
        type: 'employer',
        company: 'Microsoft',
        avatar: '👨‍💻'
      },
      lastMessage: {
        id: '2',
        sender_id: '2',
        sender_name: 'Michael Chen',
        sender_type: 'employer',
        content: 'Thanks for your interest in our internship program. Let\'s schedule an interview!',
        timestamp: '2024-02-05T09:15:00Z',
        read: true
      },
      unreadCount: 0,
      online: false
    },
    {
      id: '3',
      participant: {
        id: '3',
        name: 'Emma Wilson',
        type: 'student',
        avatar: '👩‍🎓'
      },
      lastMessage: {
        id: '3',
        sender_id: '3',
        sender_name: 'Emma Wilson',
        sender_type: 'student',
        content: 'Hey! I saw your post about the hackathon. Are you still looking for team members?',
        timestamp: '2024-02-05T08:45:00Z',
        read: true
      },
      unreadCount: 0,
      online: true
    }
  ];

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const mockMessages: Message[] = selectedConv ? [
    {
      id: '1',
      sender_id: selectedConv.participant.id,
      sender_name: selectedConv.participant.name,
      sender_type: selectedConv.participant.type,
      content: 'Hi there! I hope you\'re doing well. I wanted to reach out about the position you applied for.',
      timestamp: '2024-02-05T10:00:00Z',
      read: true
    },
    {
      id: '2',
      sender_id: user?.id || 'me',
      sender_name: user?.name || 'You',
      sender_type: 'student',
      content: 'Hi! Thank you for reaching out. I\'m very interested in learning more about the opportunity.',
      timestamp: '2024-02-05T10:15:00Z',
      read: true
    },
    {
      id: '3',
      sender_id: selectedConv.participant.id,
      sender_name: selectedConv.participant.name,
      sender_type: selectedConv.participant.type,
      content: selectedConv.lastMessage.content,
      timestamp: selectedConv.lastMessage.timestamp,
      read: selectedConv.lastMessage.read
    }
  ] : [];

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Animation for sending message
      gsap.fromTo('.message-input', {
        scale: 0.95
      }, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out'
      });
      
      setNewMessage('');
      setShowEmojiPicker(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversation(conversationId);
    
    // Animation for conversation selection
    gsap.fromTo('.chat-container', {
      opacity: 0,
      x: 50
    }, {
      opacity: 1,
      x: 0,
      duration: 0.5,
      ease: 'power3.out'
    });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative">
      {/* Decorative elements */}
      <div className="message-decoration absolute top-16 right-24 w-4 h-4 bg-asu-gold/40 rounded-full"></div>
      <div className="message-decoration absolute top-32 left-16 w-3 h-3 bg-asu-maroon/30 rounded-full"></div>
      <Sparkles className="message-decoration absolute top-24 left-1/4 h-5 w-5 text-asu-gold/60" />
      <Coffee className="message-decoration absolute bottom-32 right-1/4 h-4 w-4 text-asu-maroon/50" />
      <Heart className="message-decoration absolute bottom-20 left-1/3 h-4 w-4 text-asu-gold/70" />

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
                Connect and communicate with employers and students ✨
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Real-time messaging 💬</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Video className="h-5 w-5" />
                  <span>Video calls available 📹</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Star className="h-5 w-5" />
                  <span>Secure communication 🔐</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Interface */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div ref={conversationsRef} className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations... 🔍"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationClick(conversation.id)}
                    className={`conversation-card p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                      selectedConversation === conversation.id ? 'bg-asu-maroon/5 border-l-4 border-l-asu-maroon' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-asu-maroon/20 to-asu-gold/20 rounded-full flex items-center justify-center text-lg">
                          {conversation.participant.avatar}
                        </div>
                        {conversation.online && (
                          <div className="online-indicator absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {conversation.participant.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        {conversation.participant.company && (
                          <p className="text-sm text-asu-maroon font-medium">
                            {conversation.participant.company}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conversation.lastMessage.content}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="w-5 h-5 bg-asu-maroon rounded-full flex items-center justify-center">
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
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <div className="chat-container h-full flex flex-col">
                  {/* Chat Header */}
                  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-asu-maroon/20 to-asu-gold/20 rounded-full flex items-center justify-center">
                            {selectedConv?.participant.avatar}
                          </div>
                          {selectedConv?.online && (
                            <div className="online-indicator absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {selectedConv?.participant.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {selectedConv?.online ? 'Online' : 'Offline'} • {selectedConv?.participant.company}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-asu-maroon hover:bg-asu-maroon/10 rounded-full transition-colors">
                          <Phone className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-asu-maroon hover:bg-asu-maroon/10 rounded-full transition-colors">
                          <Video className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-asu-maroon hover:bg-asu-maroon/10 rounded-full transition-colors">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {mockMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`message-item flex ${
                          message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                            message.sender_id === user?.id
                              ? 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            message.sender_id === user?.id ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Typing indicator */}
                    {selectedConv?.online && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 px-4 py-3 rounded-2xl max-w-xs">
                          <div className="flex items-center space-x-1">
                            <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Type your message... ✨"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="message-input w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white shadow-inner transition-all duration-200 font-medium"
                        />
                        <button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-asu-maroon transition-colors p-1 rounded-full hover:bg-asu-maroon/10"
                        >
                          <Smile className="h-5 w-5" />
                        </button>
                      </div>
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="p-4 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-asu-maroon/20 to-asu-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="h-12 w-12 text-asu-maroon" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600 max-w-sm">
                      Choose a conversation from the sidebar to start messaging 💬
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
