import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, MessageSquare, Calendar, ArrowRight, CheckCircle, Eye, AlertCircle, Zap, Trash2, Edit } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { ScrollArea } from './ui/scroll-area';
import { mockListings, Listing } from './data/mockData';
import { toast } from 'sonner@2.0.3';
import { api } from '../utils/api';

interface DashboardProps {
  onNavigate: (page: string) => void;
  onViewListing: (listingId: string) => void;
  onEditListing: (listingId: string) => void;
  onDeleteListing?: (listingId?: string) => void;
  onRefreshListings?: () => void;
  listings: Listing[];
  currentUser?: {
    id: string;
    subscriptionTier: 'free' | 'pay-per-listing' | 'annual';
    membershipStatus: string;
  };
  accessToken?: string;
}

interface Conversation {
  id: string;
  participants: string[];
  listingId: string;
  lastMessage: string;
  lastMessageAt: string;
  lastMessageBy: string;
}

export default function Dashboard({ onNavigate, onViewListing, onEditListing, onDeleteListing, onRefreshListings, listings, currentUser, accessToken }: DashboardProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string;
    type: 'message' | 'offer' | 'pickup';
    text: string;
    time: string;
  }>>([]);
  const [messageCount, setMessageCount] = useState(0);
  
  const myListings = listings.filter(l => l.sellerId === currentUser?.id);
  const totalMyListings = myListings.length;
  
  const FREE_LISTING_LIMIT = 10;
  const isPremiumMember = currentUser?.membershipStatus === 'Premium';
  const remainingFreeListings = Math.max(0, FREE_LISTING_LIMIT - totalMyListings);
  const needsPayPerListing = !isPremiumMember && currentUser?.subscriptionTier !== 'annual' && totalMyListings >= FREE_LISTING_LIMIT;
  
  // Fetch real conversations and messages
  useEffect(() => {
    const fetchRecentMessages = async () => {
      if (!accessToken || !currentUser?.id) {
        return;
      }

      try {
        const { conversations } = await api.getConversations(accessToken);

        // Filter conversations to only show those with valid listings
        const validListingIds = new Set(listings.map(l => l.id));
        const validConversations = conversations.filter((conv: Conversation) => 
          conv.listingId && validListingIds.has(conv.listingId)
        );
        
        // Count total messages
        setMessageCount(validConversations.length);

        // Convert recent conversations to activity items
        const activities = validConversations.slice(0, 3).map((conv: Conversation) => {
          const listing = listings.find(l => l.id === conv.listingId);
          const isFromMe = conv.lastMessageBy === currentUser.id;
          const otherUserId = conv.participants.find(p => p !== currentUser.id);
          
          // Calculate time ago
          const messageDate = new Date(conv.lastMessageAt);
          const now = new Date();
          const diffMs = now.getTime() - messageDate.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);
          
          let timeAgo = '';
          if (diffMins < 1) timeAgo = 'Just now';
          else if (diffMins < 60) timeAgo = `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
          else if (diffHours < 24) timeAgo = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
          else timeAgo = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

          return {
            id: conv.id,
            type: 'message' as const,
            text: `${isFromMe ? 'You sent a' : 'New'} message about ${listing?.title || 'a listing'}`,
            time: timeAgo,
          };
        });

        setRecentActivity(activities);
      } catch (error) {
        console.error('❌ Error fetching conversations:', error);
        // Don't show error toast, just silently fail with empty activity
        setRecentActivity([]);
      }
    };

    fetchRecentMessages();
  }, [accessToken, currentUser?.id, listings]);

  const getListingLabel = () => {
    if (currentUser?.subscriptionTier === 'annual') {
      return `${totalMyListings} (Unlimited)`;
    } else if (currentUser?.subscriptionTier === 'free') {
      return `${totalMyListings}/${FREE_LISTING_LIMIT} Free`;
    } else {
      return `${totalMyListings} (Pay-per)`;
    }
  };

  const handleDeleteListing = async (listingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setDeletingId(listingId);
    try {
      await api.deleteListing(listingId);
      toast.success('Listing deleted successfully');
      
      // Refresh the listings data - pass the listing ID for optimistic update
      if (onDeleteListing) {
        await onDeleteListing(listingId);
      }
      
      // Also refresh current data
      if (onRefreshListings) {
        await onRefreshListings();
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete listing';
      
      if (errorMessage.includes('not found')) {
        toast.error('This listing no longer exists or has already been deleted.');
      } else {
        toast.error('Failed to delete listing. Please try again.');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const stats = [
    { label: 'Active Listings', value: getListingLabel(), icon: Package, color: 'text-blue-600' },
    { label: 'Total Views', value: '147', icon: Eye, color: 'text-sky-600' },
    { label: 'Messages', value: messageCount.toString(), icon: MessageSquare, color: 'text-purple-600' },
    { label: 'Scheduled Pickups', value: '2', icon: Calendar, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">

      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 border-0 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-white mb-2">Welcome back, Dillon!</h2>
            <p className="text-blue-100">
              {messageCount > 0 
                ? `You have ${messageCount} conversation${messageCount !== 1 ? 's' : ''}`
                : 'No new messages'
              }
            </p>
          </div>
          <Button
            onClick={() => onNavigate('create-listing')}
            className="bg-white text-blue-700 hover:bg-blue-50"
          >
            Create New Listing
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>

      {/* Listing Limit Alert - Only for Non-Premium Members */}
      {!isPremiumMember && currentUser?.subscriptionTier !== 'annual' && (
        <Alert className={remainingFreeListings === 0 ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50'}>
          <Zap className={remainingFreeListings === 0 ? 'h-4 w-4 text-orange-600' : 'h-4 w-4 text-blue-600'} />
          <AlertTitle className={remainingFreeListings === 0 ? 'text-orange-900' : 'text-blue-900'}>
            {remainingFreeListings > 0 ? 'Free Listings Remaining' : 'Free Listings Used'}
          </AlertTitle>
          <AlertDescription className={remainingFreeListings === 0 ? 'text-orange-800' : 'text-blue-800'}>
            {remainingFreeListings > 0 ? (
              <>
                You have <strong>{remainingFreeListings} free listing{remainingFreeListings !== 1 ? 's' : ''}</strong> remaining. 
                After that, it's just $0.99 per listing or upgrade to our Annual Plan for unlimited listings at $20/year.
              </>
            ) : (
              <>
                You've used all {FREE_LISTING_LIMIT} free listings. Your next listing will cost <strong>$0.99</strong>, or upgrade to 
                our <strong>Annual Plan ($20/year)</strong> for unlimited listings.
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">{stat.label}</p>
                  <p className={`${stat.color}`}>{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color} opacity-70`} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Active Listings */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-blue-900">My Active Listings</h3>
            <Button
              variant="ghost"
              onClick={() => onNavigate('listings')}
              className="text-blue-600 hover:text-blue-700"
            >
              View All
            </Button>
          </div>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {myListings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex gap-4 p-3 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer group"
                  onClick={() => onViewListing(listing.id)}
                >
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-gray-900 truncate">{listing.title}</h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {listing.verified && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {listing.id.includes('-') && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditListing(listing.id);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{listing.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={(e) => handleDeleteListing(listing.id, e)}
                                    disabled={deletingId === listing.id}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    {deletingId === listing.id ? 'Deleting...' : 'Delete'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-muted-foreground">${listing.price}</p>
                    <p className="text-xs text-muted-foreground">{listing.views} views</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-blue-900">Recent Activity</h3>
            {recentActivity.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => onNavigate('messages')}
                className="text-blue-600 hover:text-blue-700"
              >
                View All
              </Button>
            )}
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  onClick={() => onNavigate('messages')}
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {activity.type === 'message' && <MessageSquare className="w-5 h-5 text-blue-600" />}
                    {activity.type === 'offer' && <TrendingUp className="w-5 h-5 text-blue-600" />}
                    {activity.type === 'pickup' && <Calendar className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No recent messages</p>
                <p className="text-xs mt-1">Messages about your listings will appear here</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-blue-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            variant="outline"
            onClick={() => onNavigate('listings')}
            className="justify-start border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Package className="w-4 h-4 mr-2" />
            Browse Materials
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate('messages')}
            className="justify-start border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            View Messages
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate('pickup')}
            className="justify-start border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Pickup
          </Button>
        </div>
      </Card>
    </div>
  );
}
