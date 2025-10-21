import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  MoreHorizontal,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';
import Input from './ui/Input';
import PageLayout from './ui/PageLayout';
import { cn } from '../lib/cva';
import { supabase } from '../lib/supabase';
import { useConversations } from '../hooks/useOptimizedQuery';
import { PostCardSkeleton } from './ui/Skeleton';

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
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch real conversations
  const { data: conversationsData, isLoading: loading, error } = useConversations(user?.id);

  // Transform to component format
  const conversations: Conversation[] = conversationsData?.map(conv => {
    const otherParticipant = conv.participant1_id === user?.id ? conv.participant2 : conv.participant1;
    const lastMessage = conv.messages?.[0];

    return {
      id: conv.id,
      participant: {
        id: otherParticipant?.id || '',
        name: otherParticipant?.full_name || 'Unknown',
        avatar: otherParticipant?.avatar_url,
        username: otherParticipant?.username || '',
        online: false,
        last_seen: new Date(),
      },
      last_message: lastMessage?.content || '',
      last_message_time: lastMessage?.created_at ? new Date(lastMessage.created_at) : new Date(),
      unread_count: 0, // Calculate this if you have read status
      is_pinned: false,
    };
  }) || [];

  // Fetch messages for selected conversation
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:sender_id(id, full_name, avatar_url, username)')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages: Message[] = data?.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender_id,
        sender_name: msg.sender?.full_name || 'Unknown',
        sender_avatar: msg.sender?.avatar_url,
        timestamp: new Date(msg.created_at),
        is_read: msg.is_read || false,
      })) || [];

      setMessages(formattedMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          content: newMessage.trim(),
        }]);

      if (error) throw error;

      // Refresh messages
      await fetchMessages(selectedConversation.id);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.last_message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentConversation = conversations.find(conv => conv.id === selectedConversation?.id);
  const conversationMessages = messages.filter(msg => 
    (msg.sender_id === selectedConversation?.id && msg.recipient_id === user?.id) ||
    (msg.sender_id === user?.id && msg.recipient_id === selectedConversation?.id)
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

  if (loading) {
    return (
      <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'} maxWidth="full">
        <div className="flex h-[calc(100vh-8rem)]">
          <div className="w-1/3 border-r space-y-2 p-4">
            {[...Array(5)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout className={isDark ? 'bg-black text-white' : 'bg-white text-black'} maxWidth="full">
        <Card className="p-8 text-center">
          <p className="text-red-600 mb-4">Error loading messages</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      className={isDark ? 'bg-black text-white' : 'bg-white text-black'}
      maxWidth="full"
      padding="none"
    >
      <div className="flex h-screen">
        {/* Conversations List */}
        <div className={`w-80 border-r ${
          isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'
        }`}>
          {/* Header */}
          <div className={`p-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">Messages</h1>
              <Button variant="ghost" size="sm">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search messages"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-full text-sm ${
                  isDark 
                    ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-400' 
                    : 'bg-gray-100 border-gray-300 text-black placeholder-gray-600'
                }`}
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="overflow-y-auto flex-1">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50/5 transition-colors ${
                  selectedConversation?.id === conversation.id 
                    ? (isDark ? 'bg-gray-900' : 'bg-blue-50') 
                    : ''
                } ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-gray-800' : 'bg-gray-200'
                  }`}>
                    <span className="font-medium">
                      {conversation.participant.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">
                        {conversation.participant.name}
                      </p>
                      <span className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {formatTime(conversation.last_message_time.toString())}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 truncate ${
                      conversation.unread_count > 0 
                        ? 'font-medium' 
                        : (isDark ? 'text-gray-400' : 'text-gray-600')
                    }`}>
                      {conversation.last_message}
                    </p>
                    {conversation.unread_count > 0 && (
                      <div className="flex justify-between items-center mt-2">
                        <div></div>
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                          {conversation.unread_count}
                        </span>
                      </div>
                    )}
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
              <div className={`p-4 border-b flex items-center justify-between ${
                isDark ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-gray-800' : 'bg-gray-200'
                  }`}>
                    <span className="font-medium">
                      {currentConversation.participant_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-semibold">
                      {currentConversation.participant_name}
                    </h2>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {currentConversation.job_title}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Info className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
                isDark ? 'bg-black' : 'bg-white'
              }`}>
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading messages...</p>
                  </div>
                ) : conversationMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  conversationMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender_id === user?.id
                          ? 'bg-blue-500 text-white'
                          : (isDark ? 'bg-gray-800' : 'bg-gray-100')
                      }`}>
                        <p className="break-words">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender_id === user?.id
                            ? 'text-blue-100'
                            : (isDark ? 'text-gray-400' : 'text-gray-600')
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className={`p-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className={`flex items-center space-x-2 rounded-full border ${
                  isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-300 bg-white'
                } p-2`}>
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className={`flex-1 bg-transparent outline-none ${
                      isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
                    }`}
                  />
                  <Button variant="ghost" size="sm">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className={`rounded-full p-2 ${
                      newMessage.trim() 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Choose a conversation to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
