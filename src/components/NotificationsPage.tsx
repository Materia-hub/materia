import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface Notification {
  id: string;
  userId: string;
  type: 'favorite' | 'review' | 'message' | 'offer' | 'purchase';
  title: string;
  message: string;
  listingId?: string;
  transactionId?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsPageProps {
  accessToken: string | null;
  currentUserId?: string;
  onViewListing?: (listingId: string) => void;
  onClearAll?: () => void;
}

export default function NotificationsPage({ accessToken, currentUserId, onViewListing, onClearAll }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    let mounted = true;

    const loadNotifications = async () => {
      if (!accessToken) {
        if (mounted) {
          setLoading(false);
          setNotifications([]);
        }
        return;
      }
      
      try {
        if (mounted) setLoading(true);
        const response = await api.getNotifications(accessToken);
        if (mounted) {
          setNotifications(response.notifications || []);
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
        if (mounted) {
          setNotifications([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadNotifications();

    return () => {
      mounted = false;
    };
  }, [accessToken]);

  const markAsRead = async (notificationId: string) => {
    if (!accessToken) return;
    
    try {
      await api.markNotificationRead(notificationId, accessToken);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!accessToken) return;
    
    try {
      await api.markAllNotificationsRead(accessToken);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      if (onClearAll) onClearAll();
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to update notifications');
    }
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast.success('Notification deleted');
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.listingId && onViewListing) {
      onViewListing(notification.listingId);
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="p-6">
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        
        {notifications.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        )}
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
        <TabsList>
          <TabsTrigger value="all">
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {filteredNotifications.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg text-gray-900 mb-2">No notifications</h3>
                <p className="text-sm text-gray-600">
                  {filter === 'unread' ? 'You have no unread notifications' : "You don't have any notifications yet"}
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    !notification.read ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm text-gray-900">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <Badge variant="default" className="bg-blue-600">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        
                        <div className="flex gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
