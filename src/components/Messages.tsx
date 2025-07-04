import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Send, 
  User, 
  Building2,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Check,
  CheckCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Message } from '../types';

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    role: 'student' | 'employer';
    avatar?: string;
    company?: string;
    online: boolean;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export default function Messages() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      participant: {
        id: '1',
        name: 'Sarah Johnson',
        role: 'employer',
        company: 'Intel Corporation',
        online: true
      },
      lastMessage: 'Thanks for your interest in our internship program!',
      lastMessageTime: '2024-01-15T10:30:00Z',
      unreadCount: 2,
      messages: [
        {
          id: '1',
          from_id: '1',
          to_id: user?.id || '',
          content: 'Hi! I reviewed your application for our Software Engineering Intern position.',
          timestamp: '2024-01-15T10:25:00Z',
          read: true,
          created_at: '2024-01-15T10:25:00Z'
        },
        {
          id: '2',
          from_id: '1',
          to_id: user?.id || '',
          content: 'Thanks for your interest in our internship program!',
          timestamp: '2024-01-15T10:30:00Z',
          read: false,
          created_at: '2024-01-15T10:30:00Z'
        }
      ]
    },
    {
      id: '2',
      participant: {
        id: '2',
        name: 'Microsoft Recruiting',
        role: 'employer',
        company: 'Microsoft',
        online: false
      },
      lastMessage: 'Would you be available for a phone interview next week?',
      lastMessageTime: '2024-01-14T15:45:00Z',
      unreadCount: 0,
      messages: [
        {
          id: '3',
          from_id: '2',
          to_id: user?.id || '',
          content: 'Hello! We\'d like to schedule an interview with you.',
          timestamp: '2024-01-14T15:40:00Z',
          read: true,
          created_at: '2024-01-14T15:40:00Z'
        },
        {
          id: '4',
          from_id: '2',
          to_id: user?.id || '',
          content: 'Would you be available for a phone interview next week?',
          timestamp: '2024-01-14T15:45:00Z',
          read: true,
          created_at: '2024-01-14T15:45:00Z'
        }
      ]
    }
  ]);

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participant.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentConversation = conversations.find(conv => conv.id === selectedConversation);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      from_id: user?.id || '',
      to_id: currentConversation?.participant.id || '',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
      created_at: new Date().toISOString()
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: newMessage,
              lastMessageTime: new Date().toISOString()
            }
          : conv
      )
    );

    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border h-[calc(100vh-200px)] flex">
        {/* Conversations List */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conversation.id ? 'bg-asu-maroon/5 border-r-2 border-r-asu-maroon' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      {conversation.participant.role === 'employer' ? (
                        <Building2 className="h-5 w-5 text-gray-600" />
                      ) : (
                        <User className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    {conversation.participant.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.participant.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.participant.company}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-asu-maroon text-white text-xs px-2 py-1 rounded-full">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      {currentConversation.participant.role === 'employer' ? (
                        <Building2 className="h-5 w-5 text-gray-600" />
                      ) : (
                        <User className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    {currentConversation.participant.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {currentConversation.participant.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {currentConversation.participant.company}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <Phone className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <Video className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentConversation.messages.map((message) => {
                  const isFromMe = message.from_id === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isFromMe
                          ? 'bg-asu-maroon text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center justify-end mt-1 space-x-1 ${
                          isFromMe ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          <span className="text-xs">
                            {formatTime(message.timestamp)}
                          </span>
                          {isFromMe && (
                            message.read ? (
                              <CheckCheck className="h-3 w-3" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-asu-maroon focus:border-transparent"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors">
                      <Smile className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-asu-maroon text-white rounded-full hover:bg-asu-maroon-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}