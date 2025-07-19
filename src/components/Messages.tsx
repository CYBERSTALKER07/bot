import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Search, 
  Filter,
  MoreHorizontal,
  Paperclip,
  Smile,
  Phone,
  Video,
  Info,
  ArrowLeft,
  Plus,
  Check,
  CheckCheck,
  Menu,
  X as XIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';
import { cn } from '../lib/cva';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id?: string;
  timestamp: string;
  read: boolean;
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
  job_title?: string;
}

export default function Messages() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);

  // Mock data
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: '1',
        participant_id: 'user1',
        participant_name: 'Sarah Johnson',
        participant_role: 'student',
        last_message: 'Thanks for the interview opportunity!',
        last_message_time: new Date(Date.now() - 3600000).toISOString(),
        unread_count: 2,
        job_title: 'Software Engineer Intern'
      },
      {
        id: '2',
        participant_id: 'user2',
        participant_name: 'Tech Corp HR',
        participant_role: 'employer',
        last_message: 'We would like to schedule a follow-up interview',
        last_message_time: new Date(Date.now() - 7200000).toISOString(),
        unread_count: 0
      },
      {
        id: '3',
        participant_id: 'user3',
        participant_name: 'Mike Chen',
        participant_role: 'student',
        last_message: 'Could you share more details about the position?',
        last_message_time: new Date(Date.now() - 86400000).toISOString(),
        unread_count: 1
      }
    ];

    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Hi! I saw your application for our Software Engineer position.',
        sender_id: 'user1',
        recipient_id: user?.id,
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        read: true
      },
      {
        id: '2',
        content: 'Thank you for reaching out! I\'m very interested in learning more about this opportunity.',
        sender_id: user?.id || '',
        recipient_id: 'user1',
        timestamp: new Date(Date.now() - 1500000).toISOString(),
        read: true
      },
      {
        id: '3',
        content: 'Great! Would you be available for a quick call tomorrow?',
        sender_id: 'user1',
        recipient_id: user?.id,
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        read: false
      }
    ];

    setConversations(mockConversations);
    setMessages(mockMessages);
    setSelectedConversation('1');
  }, [user?.id]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender_id: user?.id || '',
      recipient_id: selectedConversation,
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update conversation
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation 
          ? { ...conv, last_message: newMessage.trim(), last_message_time: new Date().toISOString() }
          : conv
      )
    );
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conv.job_title && conv.job_title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentConversation = conversations.find(conv => conv.id === selectedConversation);
  const conversationMessages = messages.filter(msg => 
    (msg.sender_id === selectedConversation && msg.recipient_id === user?.id) ||
    (msg.sender_id === user?.id && msg.recipient_id === selectedConversation)
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'now';
    if (hours < 24) return `${hours}h`;
    return date.toLocaleDateString();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-500';
      case 'employer': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`h-screen flex ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      
      {/* Left Sidebar - X Style */}
      <div className={`${
        showSidebar ? 'flex' : 'hidden'
      } lg:flex flex-col w-full lg:w-80 xl:w-96 border-r ${
        isDark ? 'border-gray-800' : 'border-gray-200'
      }`}>
        
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isDark ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold">Messages</h1>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
            }`}>
              {conversations.reduce((sum, conv) => sum + conv.unread_count, 0)} unread
            </div>
          </div>
          <Button variant="ghost" size="sm" className="p-2">
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className={`relative rounded-2xl ${
            isDark ? 'bg-gray-900' : 'bg-gray-100'
          }`}>
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search messages"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-2xl bg-transparent border-none outline-none ${
                isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
              }`}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => {
                setSelectedConversation(conversation.id);
                setShowSidebar(false);
              }}
              className={cn(
                'p-4 cursor-pointer transition-colors hover:bg-gray-50/5',
                selectedConversation === conversation.id && (
                  isDark ? 'bg-gray-900' : 'bg-gray-100'
                )
              )}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-gray-800' : 'bg-gray-200'
                  }`}>
                    <span className="text-lg">
                      {conversation.participant_avatar ? (
                        <img 
                          src={conversation.participant_avatar} 
                          alt={conversation.participant_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        conversation.participant_name[0]
                      )}
                    </span>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getRoleColor(conversation.participant_role)}`} />
                  {conversation.unread_count > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold truncate">{conversation.participant_name}</p>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatTime(conversation.last_message_time)}
                    </span>
                  </div>
                  {conversation.job_title && (
                    <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Re: {conversation.job_title}
                    </p>
                  )}
                  <p className={`text-sm truncate ${
                    conversation.unread_count > 0 
                      ? isDark ? 'text-white' : 'text-black font-medium'
                      : isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {conversation.last_message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area - X Style */}
      <div className={`flex-1 flex flex-col ${
        !showSidebar || selectedConversation ? 'flex' : 'hidden lg:flex'
      }`}>
        {selectedConversation && currentConversation ? (
          <>
            {/* Chat Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              isDark ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(true)}
                  className="lg:hidden p-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-gray-800' : 'bg-gray-200'
                  }`}>
                    <span className="text-lg">
                      {currentConversation.participant_avatar ? (
                        <img 
                          src={currentConversation.participant_avatar} 
                          alt={currentConversation.participant_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        currentConversation.participant_name[0]
                      )}
                    </span>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getRoleColor(currentConversation.participant_role)}`} />
                </div>
                <div>
                  <p className="font-bold">{currentConversation.participant_name}</p>
                  {currentConversation.job_title && (
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Re: {currentConversation.job_title}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="p-2 hidden sm:flex">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hidden sm:flex">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
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
                    className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-3 rounded-2xl ${
                      message.sender_id === user?.id
                        ? isDark
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-blue-500 text-white rounded-br-md'
                        : isDark
                          ? 'bg-gray-900 text-white rounded-bl-md'
                          : 'bg-gray-100 text-black rounded-bl-md'
                    }`}
                  >
                    <p className="break-words mb-2">{message.content}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${
                        message.sender_id === user?.id 
                          ? 'text-white/70'
                          : isDark 
                            ? 'text-gray-400' 
                            : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </span>
                      {message.sender_id === user?.id && (
                        <div className="ml-2">
                          {message.read ? (
                            <CheckCheck className="h-4 w-4 text-white/70" />
                          ) : (
                            <Check className="h-4 w-4 text-white/70" />
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
              isDark ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <div className="flex items-end space-x-2">
                <Button variant="ghost" size="sm" className="p-2 mb-3 hidden sm:flex">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                  <div className={`flex items-end rounded-2xl border ${
                    isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-gray-50'
                  }`}>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Start a new message"
                      rows={1}
                      className={`flex-1 px-4 py-3 bg-transparent border-none outline-none resize-none ${
                        isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
                      }`}
                      style={{ minHeight: '20px', maxHeight: '100px' }}
                    />
                    <Button variant="ghost" size="sm" className="p-2 mr-2 hidden sm:flex">
                      <Smile className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`p-3 rounded-full ${
                    newMessage.trim()
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                isDark ? 'bg-gray-900' : 'bg-gray-100'
              }`}>
                <XIcon className={`w-12 h-12 ${isDark ? 'text-white' : 'text-black'}`} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Select a message</h2>
              <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Choose from your existing conversations, start a new one, or just keep swimming.
              </p>
              <Button 
                className={`rounded-full px-6 py-3 font-bold ${
                  isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                }`}
                onClick={() => setShowSidebar(true)}
              >
                New message
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
