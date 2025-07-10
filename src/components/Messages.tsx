import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Search, 
  FilterList, 
  MoreVert,
  AttachFile,
  EmojiEmotions,
  Phone,
  VideoCall,
  Info
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Message, Conversation } from '../types';
import { supabase } from '../lib/supabase';
import Typography from './ui/Typography';
import Button from './ui/Button';
import { Card } from './ui/Card';
import Input from './ui/Input';
import Badge from './ui/Badge';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchConversations();
    }
  }, [user?.id]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          profiles!conversations_participant_id_fkey(
            full_name,
            avatar_url,
            role
          )
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      const formattedConversations: Conversation[] = data?.map(conv => ({
        id: conv.id,
        participant_id: conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1,
        participant_name: conv.profiles?.full_name || 'Unknown User',
        participant_avatar: conv.profiles?.avatar_url || null,
        participant_role: conv.profiles?.role || 'student',
        last_message: conv.last_message,
        last_message_time: conv.last_message_at,
        unread_count: conv.unread_count || 0,
        job_id: conv.job_id,
        job_title: conv.job_title
      })) || [];

      setConversations(formattedConversations);
      
      // Select first conversation if none selected
      if (formattedConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(formattedConversations[0].id);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user?.id) return;

    const messageData = {
      conversation_id: selectedConversation,
      sender_id: user.id,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;

      // Add message to local state
      setMessages(prev => [...prev, data]);
      setNewMessage('');

      // Update conversation last message
      await supabase
        .from('conversations')
        .update({
          last_message: newMessage.trim(),
          last_message_at: new Date().toISOString()
        })
        .eq('id', selectedConversation);

    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (conv.job_title && conv.job_title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filterRole === 'all' || conv.participant_role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4 ${
              isDark ? 'border-lime' : 'border-asu-maroon'
            }`}></div>
            <Typography variant="body1" color="textSecondary">
              Loading conversations...
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center">
            <Typography variant="h6" className="text-red-600 mb-2">
              Error Loading Messages
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-4">
              {error}
            </Typography>
            <Button onClick={fetchConversations} variant="outlined">
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

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
