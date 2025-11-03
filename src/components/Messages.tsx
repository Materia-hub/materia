import React, { useState, useEffect } from 'react';
import { Send, Search } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { api } from '../utils/api';
import { Listing } from './data/mockData';
import { toast } from 'sonner@2.0.3';

interface MessagesProps {
  onViewListing: (listingId: string) => void;
  accessToken?: string;
  currentUserId?: string;
  listings: Listing[];
}

interface Conversation {
  id: string;
  participants: string[];
  listingId: string;
  lastMessage: string;
  lastMessageAt: string;
  lastMessageBy: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  listingId: string;
  text: string;
  image?: string;
  read: boolean;
  createdAt: string;
}

export default function Messages({ onViewListing, accessToken, currentUserId, listings }: MessagesProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!accessToken || !currentUserId) {
        console.log('📭 No access token or user ID, skipping conversation fetch');
        setLoading(false);
        return;
      }

      try {
        console.log('📡 Fetching conversations...');
        const { conversations: allConversations } = await api.getConversations(accessToken);
        console.log('📨 Received conversations:', allConversations);

        // Filter conversations to only show those with valid listings
        const validListingIds = new Set(listings.map(l => l.id));
        const validConversations = allConversations.filter((conv: Conversation) => 
          conv.listingId && validListingIds.has(conv.listingId)
        );

        console.log('✅ Valid conversations (with existing listings):', validConversations.length);
        setConversations(validConversations);
        
        // Auto-select first conversation
        if (validConversations.length > 0 && !selectedConversationId) {
          setSelectedConversationId(validConversations[0].id);
        }
      } catch (error) {
        console.error('❌ Error fetching conversations:', error);
        // Don't show error toast if user just hasn't had any messages yet
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [accessToken, currentUserId, listings]);

  // Fetch messages for selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!accessToken || !selectedConversationId) {
        setMessages([]);
        return;
      }

      try {
        console.log('📡 Fetching messages for conversation:', selectedConversationId);
        const { messages: conversationMessages } = await api.getMessages(selectedConversationId, accessToken);
        console.log('📨 Received messages:', conversationMessages);
        setMessages(conversationMessages);
      } catch (error) {
        console.error('❌ Error fetching messages:', error);
        toast.error('Failed to load messages');
      }
    };

    fetchMessages();
  }, [accessToken, selectedConversationId]);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  
  const filteredConversations = conversations.filter(conv => {
    const listing = listings.find(l => l.id === conv.listingId);
    // Search by listing title
    return listing?.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !accessToken || !selectedConversation) return;
    
    setSendingMessage(true);
    try {
      const otherUserId = selectedConversation.participants.find(p => p !== currentUserId);
      if (!otherUserId) {
        toast.error('Could not find recipient');
        return;
      }

      await api.sendMessage({
        recipientId: otherUserId,
        listingId: selectedConversation.listingId,
        text: newMessage,
      }, accessToken);
      
      setNewMessage('');
      
      // Refresh messages
      const { messages: conversationMessages } = await api.getMessages(selectedConversationId!, accessToken);
      setMessages(conversationMessages);
      
      toast.success('Message sent');
    } catch (error) {
      console.error('❌ Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-green-900 mb-2">Messages</h2>
          <p className="text-muted-foreground">
            Communicate securely with buyers and sellers
          </p>
        </div>
        <Card className="p-8 text-center text-muted-foreground">
          Loading conversations...
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-green-900 mb-2">Messages</h2>
        <p className="text-muted-foreground">
          Communicate securely with buyers and sellers about your listings
        </p>
      </div>

      {conversations.length === 0 && !loading ? (
        <Card className="p-12 text-center">
          <div className="max-w-sm mx-auto">
            <Send className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
            <h3 className="text-gray-900 mb-2">No Messages Yet</h3>
            <p className="text-muted-foreground mb-4">
              When you inquire about a listing or someone messages you about your listings, conversations will appear here.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="lg:col-span-1 p-4">
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

            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {filteredConversations.map((conversation) => {
                  const listing = listings.find(l => l.id === conversation.listingId);
                  const otherUserId = conversation.participants.find(p => p !== currentUserId);
                  const hasUnread = conversation.lastMessageBy !== currentUserId && conversation.lastMessage;
                  
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversationId(conversation.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversationId === conversation.id
                          ? 'bg-green-50 border border-green-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700">
                          <AvatarFallback className="text-white">
                            {listing?.title?.substring(0, 2).toUpperCase() || '??'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="truncate text-sm">Conversation</p>
                            {hasUnread && (
                              <Badge className="bg-red-500 text-white border-0 h-5 w-5 flex items-center justify-center p-0 rounded-full">
                                !
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate mb-1">
                            {listing?.title || 'Unknown listing'}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </Card>

          {/* Conversation View */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700">
                        <AvatarFallback className="text-white">
                          {listings.find(l => l.id === selectedConversation.listingId)?.title?.substring(0, 2).toUpperCase() || '??'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p>Conversation</p>
                        <button
                          onClick={() => onViewListing(selectedConversation.listingId)}
                          className="text-xs text-green-600 hover:text-green-700 hover:underline"
                        >
                          {listings.find(l => l.id === selectedConversation.listingId)?.title || 'View listing'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4 h-[450px]">
                  <div className="space-y-4">
                    {messages.map((msg) => {
                      const isCurrentUser = msg.senderId === currentUserId;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              isCurrentUser
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p>{msg.text}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isCurrentUser ? 'text-green-100' : 'text-muted-foreground'
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={sendingMessage}
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={sendingMessage || !newMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center">
                <div>
                  <p className="text-muted-foreground mb-2">No conversation selected</p>
                  <p className="text-sm text-muted-foreground">
                    Select a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
