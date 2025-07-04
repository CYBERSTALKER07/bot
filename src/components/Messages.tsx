import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
  Mute
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

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
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Organic header animation
      gsap.from(headerRef.current, {
        duration: 1.5,
        y: -40,
        opacity: 0,
        ease: 'power3.out',
        rotation: 0.5
      });

      // Conversation list animation
      gsap.from('.conversation-item', {
        duration: 1,
        x: -30,
        opacity: 0,
        ease: 'power2.out',
        stagger: 0.1,
        delay: 0.3
      });

      // Message bubbles animation
      gsap.from('.message-bubble', {
        duration: 0.8,
        y: 20,
        opacity: 0,
        scale: 0.95,
        ease: 'back.out(1.7)',
        stagger: 0.05,
        delay: 0.5
      });

      // Floating decorations
      gsap.to('.message-decoration', {
        y: -8,
        x: 4,
        rotation: 180,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });

      // Online indicator pulse
      gsap.to('.online-indicator', {
        scale: 1.2,
        opacity: 0.7,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, [selectedConversation]);

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

    // Add message with animation
    gsap.from('.message-bubble:last-child', {
      duration: 0.6,
      y: 30,
      opacity: 0,
      scale: 0.8,
      ease: 'back.out(1.7)'
    });

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

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Decorative elements */}
      <div className="message-decoration absolute top-16 right-24 w-4 h-4 bg-asu-gold/30 rounded-full"></div>
      <div className="message-decoration absolute top-32 left-16 w-3 h-3 bg-asu-maroon/20 rounded-full"></div>
      <Sparkles className="message-decoration absolute top-24 left-1/4 h-5 w-5 text-asu-gold/50" />
      <Coffee className="message-decoration absolute bottom-32 right-1/4 h-4 w-4 text-asu-maroon/40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-3xl p-8 text-white relative overflow-hidden transform -rotate-0.3">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">Messages 💬</h1>
              <p className="text-xl text-gray-200">Connect and communicate with employers and students</p>
            </div>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden" style={{ height: '70vh' }}>
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation, index) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`conversation-item p-4 border-b border-gray-100 cursor-pointer transition-all duration-300 hover:bg-asu-maroon/5 relative ${
                      selectedConversation === conversation.id ? 'bg-asu-maroon/10 border-l-4 border-l-asu-maroon' : ''
                    }`}
                  >
                    {conversation.pinned && (
                      <Pin className="absolute top-2 right-2 h-3 w-3 text-asu-maroon" />
                    )}
                    
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-full flex items-center justify-center text-white font-bold">
                          {conversation.participant_name.charAt(0)}
                        </div>
                        {conversation.is_online && (
                          <div className="online-indicator absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {conversation.participant_name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {conversation.unread_count > 0 && (
                              <span className="bg-asu-maroon text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {conversation.unread_count}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.last_message_time)}
                            </span>
                          </div>
                        </div>
                        
                        {conversation.company && (
                          <p className="text-sm text-asu-maroon font-medium">
                            {conversation.company} • {conversation.job_title}
                          </p>
                        )}
                        
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conversation.last_message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConv ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-full flex items">
                          {/* Add any additional content here */}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{selectedConv.participant_name}</h3>
                          {selectedConv.company && (
                            <p className="text-sm text-asu-maroon">{selectedConv.company}</p>
                          )}
                          <p className="text-xs text-gray-500 flex items-center">
                            {selectedConv.is_online ? 'Online' : 'Offline'}
                            <span className="ml-1">{selectedConv.is_online ? '🟢' : '⚪'}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-500 hover:text-asu-maroon transition-colors transform hover:scale-110">
                          <Phone className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-asu-maroon transition-colors transform hover:scale-110">
                          <Video className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-asu-maroon transition-colors transform hover:scale-110">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {conversationMessages.map((message, index) => (
                      <div
                        key={message.id}
                        className={`message-bubble flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${
                          message.sender_id === user?.id
                            ? 'bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white rounded-3xl rounded-br-lg'
                            : 'bg-white border border-gray-200 text-gray-900 rounded-3xl rounded-bl-lg'
                        } px-4 py-3 shadow-lg transform hover:scale-105 transition-transform duration-200`}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <div className={`flex items-center justify-between mt-2 text-xs ${
                            message.sender_id === user?.id ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            <span>{formatTime(message.timestamp)}</span>
                            {message.sender_id === user?.id && (
                              <div className="flex items-center space-x-1">
                                {message.read ? (
                                  <CheckCheck className="h-3 w-3 text-green-300" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <button className="p-2 text-gray-500 hover:text-asu-maroon transition-colors transform hover:scale-110">
                        <Paperclip className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-asu-maroon transition-colors transform hover:scale-110">
                        <Image className="h-5 w-5" />
                      </button>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Type your message... 💬"
                          className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent bg-white"
                        />
                        <button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-asu-maroon transition-colors"
                        >
                          <Smile className="h-5 w-5" />
                        </button>
                      </div>
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="p-3 bg-asu-maroon text-white rounded-full hover:bg-asu-maroon-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 shadow-lg"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                    
                    {showEmojiPicker && (
                      <div className="absolute bottom-20 right-4 bg-white border border-gray-200 rounded-2xl p-4 shadow-xl z-10">
                        <div className="grid grid-cols-8 gap-2">
                          {['😊', '😍', '👍', '❤️', '😂', '🔥', '💯', '🎉'].map((emoji, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setNewMessage(prev => prev + emoji);
                                setShowEmojiPicker(false);
                              }}
                              className="text-2xl hover:bg-gray-100 p-2 rounded-lg transition-colors"
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
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <MessageSquare className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
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
