import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Send, 
  Person, 
  Chat, 
  Phone, 
  VideoCall, 
  MoreHoriz, 
  AttachFile, 
  EmojiEmotions,
  Star,
  Archive,
  Delete,
  Check,
  DoneAll,
  FilterList,
  Add,
  Business,
  School,
  Work,
  Message,
  Forum,
  VideoCallOutlined,
  PhoneInTalk,
  Notifications,
  ArrowBack,
  Menu
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Typography from './ui/Typography';
import Button from './ui/Button';
import Input from './ui/Input';
import { Card } from './ui/Card';
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
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'employer'>('all');
  const [showSidebar, setShowSidebar] = useState(true);

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

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      
      {/* Mobile Header */}
      <div className={`lg:hidden flex items-center justify-between p-4 border-b ${
        isDark ? 'border-gray-600 bg-dark-surface' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-center space-x-3">
          <Button
            variant="text"
            size="small"
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Typography variant="h6" className="font-medium">
            Messages
          </Typography>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isDark ? 'bg-lime/10 text-lime' : 'bg-asu-maroon/10 text-asu-maroon'
          }`}>
            {conversations.reduce((sum, conv) => sum + conv.unread_count, 0)} unread
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Conversations Sidebar */}
        <div className={`${
          showSidebar ? 'flex' : 'hidden'
        } lg:flex flex-col w-full lg:w-80 xl:w-96 border-r ${
          isDark ? 'border-gray-600 bg-dark-surface' : 'border-gray-200 bg-white'
        }`}>
          
          {/* Search and Filter */}
          <div className="p-4 border-b space-y-3">
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startIcon={<Search />}
              variant="outlined"
              fullWidth
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as 'all' | 'student' | 'employer')}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                isDark 
                  ? 'border-gray-600 bg-dark-bg text-dark-text focus:ring-lime' 
                  : 'border-gray-300 bg-white text-gray-900 focus:ring-asu-maroon'
              }`}
            >
              <option value="all">All Conversations</option>
              <option value="student">Students</option>
              <option value="employer">Employers</option>
            </select>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => {
                  setSelectedConversation(conversation.id);
                  setShowSidebar(false); // Hide sidebar on mobile when selecting conversation
                }}
                className={`p-4 border-b cursor-pointer transition-colors ${
                  isDark 
                    ? `border-gray-700 hover:bg-dark-bg ${
                        selectedConversation === conversation.id 
                          ? 'bg-lime/10 border-l-4 border-l-lime' 
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
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs ${getRoleColor(conversation.participant_role)}`}>
                      {getRoleIcon(conversation.participant_role)}
                    </div>
                    {conversation.unread_count > 0 && (
                      <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        isDark ? 'bg-lime' : 'bg-asu-maroon'
                      }`}>
                        {conversation.unread_count}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <Typography variant="subtitle2" className="font-medium truncate">
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
        <div className={`flex-1 flex flex-col ${
          !showSidebar || selectedConversation ? 'flex' : 'hidden lg:flex'
        }`}>
          {selectedConversation && currentConversation ? (
            <>
              {/* Chat Header */}
              <div className={`p-4 border-b flex items-center justify-between ${
                isDark ? 'border-gray-600 bg-dark-surface' : 'border-gray-200 bg-white'
              }`}>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setShowSidebar(true)}
                    className="lg:hidden"
                  >
                    <ArrowBack className="h-5 w-5" />
                  </Button>
                  <div className="relative">
                    <Avatar
                      src={currentConversation.participant_avatar}
                      alt={currentConversation.participant_name}
                      size="md"
                      fallback={currentConversation.participant_name[0]}
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs ${getRoleColor(currentConversation.participant_role)}`}>
                      {getRoleIcon(currentConversation.participant_role)}
                    </div>
                  </div>
                  <div>
                    <Typography variant="subtitle1" className="font-medium">
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
                  <Button variant="text" size="small" className="hidden sm:flex">
                    <PhoneInTalk className="h-5 w-5" />
                  </Button>
                  <Button variant="text" size="small" className="hidden sm:flex">
                    <VideoCallOutlined className="h-5 w-5" />
                  </Button>
                  <Button variant="text" size="small">
                    <MoreHoriz className="h-5 w-5" />
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
                      className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                        message.sender_id === user?.id
                          ? isDark
                            ? 'bg-lime text-dark-surface rounded-br-md'
                            : 'bg-asu-maroon text-white rounded-br-md'
                          : isDark
                            ? 'bg-dark-bg text-dark-text rounded-bl-md border border-gray-600'
                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                      }`}
                    >
                      <Typography variant="body2" className="mb-2 break-words">
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
                isDark ? 'border-gray-600 bg-dark-surface' : 'border-gray-200 bg-white'
              }`}>
                <div className="flex items-end space-x-2">
                  <Button variant="text" size="small" className="hidden sm:flex mb-3">
                    <AttachFile className="h-5 w-5" />
                  </Button>
                  <div className="flex-1">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                      placeholder="Type your message..."
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={1}
                      endIcon={
                        <Button variant="text" size="small" className="hidden sm:flex">
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
                    className="mb-3"
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
                <div className={`w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-lime/10' : 'bg-asu-maroon/10'
                }`}>
                  <Chat className={`w-8 h-8 sm:w-12 sm:h-12 ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`} />
                </div>
                <Typography variant="h6" className="font-medium mb-2">
                  Select a conversation
                </Typography>
                <Typography variant="body2" color="textSecondary" className="mb-4">
                  Choose a conversation to start messaging
                </Typography>
                <Button 
                  variant="outlined"
                  color="primary"
                  startIcon={<Add />}
                  onClick={() => setShowSidebar(true)}
                  className="lg:hidden"
                >
                  View Conversations
                </Button>
              </div>
            </div>
          )}
        </div>
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
      return 'bg-blue-500';
    case 'employer':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};
