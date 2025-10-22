import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, Image as ImageIcon, Check, CheckCheck, MoreVertical, Paperclip } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface EnhancedMessagesProps {
  accessToken: string | null;
  onViewListing: (listingId: string) => void;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  text: string;
  image?: string;
  read: boolean;
  createdAt: string;
}

interface Conversation {
  id: string;
  participants: string[];
  listingId?: string;
  lastMessage: string;
  lastMessageAt: string;
  lastMessageBy: string;
}

export default function EnhancedMessages({ accessToken, onViewListing }: EnhancedMessagesProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (accessToken) {
      fetchConversations();
    }
  }, [accessToken]);

  useEffect(() => {
    if (selectedConversation && accessToken) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation, accessToken]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const response = await api.getConversations(accessToken);
      setConversations(response.conversations || []);
      
      if (response.conversations && response.conversations.length > 0) {
        setSelectedConversation(response.conversations[0].id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    if (!accessToken) return;

    try {
      const response = await api.getMessages(conversationId, accessToken);
      setMessages(response.messages || []);
      
      // Mark messages as read
      const unreadMessages = response.messages.filter((m: Message) => !m.read && m.senderId !== 'currentUserId');
      for (const msg of unreadMessages) {
        await api.markMessageRead(msg.id, accessToken);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !accessToken || !selectedConversation) return;

    const recipientId = conversations.find(c => c.id === selectedConversation)?.participants.find(p => p !== 'currentUserId') || '';

    if (!recipientId) {
      toast.error('Cannot send message: recipient not found');
      return;
    }

    try {
      setSending(true);
      await api.sendMessage(
        {
          recipientId,
          text: newMessage,
          image: selectedImage || undefined,
        },
        accessToken
      );

      setNewMessage('');
      setSelectedImage(null);
      fetchMessages(selectedConversation);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleTyping = () => {
    if (!accessToken || !selectedConversation) return;

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set typing status
    api.setTypingStatus(selectedConversation, true, accessToken);

    // Clear after 3 seconds of no typing
    const timeout = setTimeout(() => {
      api.setTypingStatus(selectedConversation, false, accessToken);
    }, 3000);

    setTypingTimeout(timeout);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-blue-900 mb-2">Messages</h2>
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
        <Card className="p-12 text-center text-muted-foreground">
          Loading...
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-blue-900 mb-2">Messages</h2>
        <p className="text-muted-foreground">
          Communicate with buyers and sellers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1 p-4 flex flex-col">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No conversations yet</p>
                  <p className="text-xs mt-1">Start a conversation by messaging a seller</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation === conv.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700">
                        <AvatarFallback className="text-white">
                          U
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="truncate text-sm">Conversation</p>
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(conv.lastMessageAt)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Message Thread */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700">
                    <AvatarFallback className="text-white">U</AvatarFallback>
                  </Avatar>
                  <div>
                    <p>Other User</p>
                    <p className="text-xs text-muted-foreground">Active now</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No messages yet</p>
                      <p className="text-xs mt-1">Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isOwnMessage = msg.senderId === 'currentUserId';
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                            <div
                              className={`rounded-lg p-3 ${
                                isOwnMessage
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              {msg.image && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <img
                                      src={msg.image}
                                      alt="Shared"
                                      className="rounded cursor-pointer max-w-full mb-2 hover:opacity-90"
                                    />
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl">
                                    <img src={msg.image} alt="Shared" className="w-full" />
                                  </DialogContent>
                                </Dialog>
                              )}
                              <p className="break-words">{msg.text}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-1 px-1">
                              <span className="text-xs text-muted-foreground">
                                {getTimeAgo(msg.createdAt)}
                              </span>
                              {isOwnMessage && (
                                <span>
                                  {msg.read ? (
                                    <CheckCheck className="w-3 h-3 text-blue-600" />
                                  ) : (
                                    <Check className="w-3 h-3 text-gray-400" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                {selectedImage && (
                  <div className="mb-2 relative inline-block">
                    <img src={selectedImage} alt="Preview" className="h-20 rounded" />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute -top-2 -right-2 bg-white rounded-full shadow"
                      onClick={() => setSelectedImage(null)}
                    >
                      ×
                    </Button>
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={(!newMessage.trim() && !selectedImage) || sending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
