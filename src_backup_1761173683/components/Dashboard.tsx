import React, { useState } from 'react';
import { Package, TrendingUp, MessageSquare, Calendar, ArrowRight, CheckCircle, Eye, AlertCircle, Zap, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { mockListings, Listing } from './data/mockData';
import { toast } from 'sonner@2.0.3';
import { api } from '../utils/api';

interface DashboardProps {
  onNavigate: (page: string) => void;
  onViewListing: (listingId: string) => void;
  onDeleteListing?: () => void;
  listings: Listing[];
  currentUser?: {
    id: string;
    subscriptionTier: 'free' | 'pay-per-listing' | 'annual';
    membershipStatus: string;
  };
}

export default function Dashboard({ onNavigate, onViewListing, onDeleteListing, listings, currentUser }: DashboardProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const myListings = listings.filter(l => l.sellerId === '1').slice(0, 3);
  const totalMyListings = listings.filter(l => l.sellerId === '1').length;
  const FREE_LISTING_LIMIT = 3;
  const isPremiumMember = currentUser?.membershipStatus === 'Premium';
  const remainingFreeListings = Math.max(0, FREE_LISTING_LIMIT - totalMyListings);
  const needsPayPerListing = !isPremiumMember && currentUser?.subscriptionTier !== 'annual' && totalMyListings >= FREE_LISTING_LIMIT;
  
  // Debug logging
  console.log('Dashboard Debug:', {
    membershipStatus: currentUser?.membershipStatus,
    isPremiumMember,
    subscriptionTier: currentUser?.subscriptionTier,
    shouldShowAlert: !isPremiumMember && currentUser?.subscriptionTier !== 'annual'
  });
  
  const recentActivity = [
    { id: '1', type: 'message', text: 'New message from Mike Chen about Oak Flooring', time: '2 hours ago' },
    { id: '2', type: 'offer', text: 'Offer received for Steel I-Beams', time: '5 hours ago' },
    { id: '3', type: 'pickup', text: 'Pickup scheduled for tomorrow at 2 PM', time: '1 day ago' },
  ];

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
    
    // Check if this is a real user listing (has timestamp-based ID) vs mock data
    const isRealListing = listingId.includes('-');
    
    if (!isRealListing) {
      toast.error('Cannot delete demo listings. Please create your own listing to test this feature.');
      return;
    }
    
    setDeletingId(listingId);
    try {
      await api.deleteListing(listingId);
      toast.success('Listing deleted successfully');
      if (onDeleteListing) {
        onDeleteListing();
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
    { label: 'Messages', value: '12', icon: MessageSquare, color: 'text-purple-600' },
    { label: 'Scheduled Pickups', value: '2', icon: Calendar, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 border-0 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-white mb-2">Welcome back, Dillon!</h2>
            <p className="text-blue-100">You have 3 new messages and 1 pending offer</p>
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
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground">${listing.price}</p>
                  <p className="text-xs text-muted-foreground">{listing.views} views</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-blue-900">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors">
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
            ))}
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
