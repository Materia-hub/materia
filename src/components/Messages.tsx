import React, { useState } from 'react';
import { Send, Search } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { mockMessages } from './data/mockData';

interface MessagesProps {
  onViewListing: (listingId: string) => void;
}

export default function Messages({ onViewListing }: MessagesProps) {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(mockMessages[0]?.id || null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedConversation = mockMessages.find(m => m.id === selectedMessageId);

  const filteredMessages = mockMessages.filter(msg =>
    msg.otherUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.listingTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // In real app, would send message here
    setNewMessage('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-green-900 mb-2">Messages</h2>
        <p className="text-muted-foreground">
          Communicate securely with buyers and sellers
        </p>
      </div>

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
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessageId(message.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedMessageId === message.id
                      ? 'bg-green-50 border border-green-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700">
                      <AvatarFallback className="text-white">
                        {message.otherUserName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="truncate">{message.otherUserName}</p>
                        {message.unread && (
                          <Badge className="bg-red-500 text-white border-0 h-5 w-5 flex items-center justify-center p-0 rounded-full">
                            !
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-1">
                        {message.listingTitle}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {message.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
                        {selectedConversation.otherUserName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{selectedConversation.otherUserName}</p>
                      <button
                        onClick={() => onViewListing(selectedConversation.listingId)}
                        className="text-xs text-green-600 hover:text-green-700 hover:underline"
                      >
                        {selectedConversation.listingTitle}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 h-[450px]">
                <div className="space-y-4">
                  {selectedConversation.messages.map((msg) => {
                    const isCurrentUser = msg.senderId === '1';
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
                            {new Date(msg.timestamp).toLocaleTimeString([], {
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
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-green-600 hover:bg-green-700"
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
    </div>
  );
}
