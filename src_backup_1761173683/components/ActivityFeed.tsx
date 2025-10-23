import React, { useState, useEffect } from 'react';
import { Package, Star, Heart, MessageSquare, UserPlus, TrendingUp, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';

interface ActivityFeedProps {
  accessToken: string | null;
  onViewListing: (listingId: string) => void;
  onViewSeller: (sellerId: string) => void;
}

interface Activity {
  id: string;
  type: 'new_listing' | 'new_review' | 'new_follower' | 'sale' | 'favorite';
  sellerName: string;
  sellerId: string;
  sellerAvatar: string;
  title: string;
  description: string;
  timestamp: string;
  listingId?: string;
  image?: string;
}

export default function ActivityFeed({ accessToken, onViewListing, onViewSeller }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'following'>('all');

  useEffect(() => {
    if (accessToken) {
      fetchActivities();
    }
  }, [accessToken, filter]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      
      // Mock activities data - in real app, fetch from API
      const mockActivities: Activity[] = [
        {
          id: 'act-1',
          type: 'new_listing',
          sellerName: 'John Smith Construction',
          sellerId: 'seller-1',
          sellerAvatar: 'JS',
          title: 'New Listing: Reclaimed Oak Beams',
          description: 'Posted 12 beautiful reclaimed oak beams, 8"x8"x12ft',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          listingId: 'listing-1',
        },
        {
          id: 'act-2',
          type: 'new_review',
          sellerName: 'EcoBuilders Supply',
          sellerId: 'seller-2',
          sellerAvatar: 'EB',
          title: 'Received a 5-star review',
          description: '"Excellent quality bricks, fast delivery!" - Sarah M.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
          id: 'act-3',
          type: 'sale',
          sellerName: 'Vintage Salvage Co',
          sellerId: 'seller-3',
          sellerAvatar: 'VS',
          title: 'Completed a sale',
          description: 'Sold vintage brass door handles',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          listingId: 'listing-2',
        },
        {
          id: 'act-4',
          type: 'new_follower',
          sellerName: 'Green Reclaim LLC',
          sellerId: 'seller-5',
          sellerAvatar: 'GR',
          title: 'Gained 5 new followers',
          description: 'Now has 178 followers',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        },
        {
          id: 'act-5',
          type: 'new_listing',
          sellerName: 'Metro Demolition',
          sellerId: 'seller-4',
          sellerAvatar: 'MD',
          title: 'New Listing: Industrial Steel I-Beams',
          description: 'Posted 20 steel I-beams from commercial building',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          listingId: 'listing-3',
        },
        {
          id: 'act-6',
          type: 'favorite',
          sellerName: 'John Smith Construction',
          sellerId: 'seller-1',
          sellerAvatar: 'JS',
          title: 'Listing favorited 10 times',
          description: 'Reclaimed barn wood planks is trending!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          listingId: 'listing-4',
        },
      ];

      setActivities(mockActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activity feed');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'new_listing':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'new_review':
        return <Star className="w-5 h-5 text-yellow-600" />;
      case 'new_follower':
        return <UserPlus className="w-5 h-5 text-purple-600" />;
      case 'sale':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'favorite':
        return <Heart className="w-5 h-5 text-red-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'new_listing':
        return 'bg-blue-50 border-blue-200';
      case 'new_review':
        return 'bg-yellow-50 border-yellow-200';
      case 'new_follower':
        return 'bg-purple-50 border-purple-200';
      case 'sale':
        return 'bg-green-50 border-green-200';
      case 'favorite':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-blue-900 mb-2">Activity Feed</h2>
          <p className="text-muted-foreground">Loading latest updates...</p>
        </div>
        <Card className="p-12 text-center text-muted-foreground">
          Loading...
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-blue-900 mb-2">Activity Feed</h2>
          <p className="text-muted-foreground">
            Latest updates from sellers you follow
          </p>
        </div>
        <Button variant="outline" onClick={fetchActivities}>
          <Clock className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'following')}>
        <TabsList>
          <TabsTrigger value="all">All Activity</TabsTrigger>
          <TabsTrigger value="following">Following Only</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Activity List */}
      {activities.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-muted-foreground mb-2">No activity yet</p>
          <p className="text-sm text-muted-foreground">
            Follow sellers to see their latest updates here
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <Card
              key={activity.id}
              className={`p-6 hover:shadow-md transition-all ${getActivityColor(activity.type)}`}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <Avatar className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center">
                  {activity.sellerAvatar}
                </Avatar>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getActivityIcon(activity.type)}
                      <h3 className="text-gray-900">{activity.title}</h3>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {getTimeAgo(activity.timestamp)}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {activity.description}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewSeller(activity.sellerId)}
                    >
                      View Seller
                    </Button>
                    {activity.listingId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewListing(activity.listingId!)}
                      >
                        View Listing
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Load More */}
      {activities.length > 0 && (
        <div className="text-center">
          <Button variant="outline">
            Load More Activity
          </Button>
        </div>
      )}
    </div>
  );
}

export default ActivityFeed;
