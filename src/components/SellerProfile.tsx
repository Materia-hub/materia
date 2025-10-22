import React, { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Star, Package, CheckCircle, Share2, Heart, UserPlus, UserMinus, ExternalLink } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { api } from '../utils/api';

interface SellerProfileProps {
  sellerId: string;
  accessToken: string | null;
  currentUserId?: string;
  onViewListing: (listingId: string) => void;
}

export default function SellerProfile({ sellerId, accessToken, currentUserId, onViewListing }: SellerProfileProps) {
  const [seller, setSeller] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerData();
  }, [sellerId]);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      
      // Fetch seller info, listings, and reviews
      // In a real app, these would be separate API calls
      const mockSeller = {
        id: sellerId,
        name: 'John Smith Construction',
        avatar: 'JS',
        location: 'Denver, CO',
        memberSince: '2024-01-15',
        bio: 'Family-owned construction company specializing in sustainable building materials. We salvage quality materials from demolition projects and offer them at great prices.',
        badges: ['Verified Seller', 'Top Rated', 'Eco-Warrior'],
        stats: {
          totalListings: 24,
          completedSales: 156,
          averageRating: 4.8,
          responseTime: '< 2 hours',
        },
      };
      
      setSeller(mockSeller);
      setFollowers(Math.floor(Math.random() * 100) + 50);
      
      // Fetch listings
      const listingsResponse = await api.getListings();
      const sellerListings = listingsResponse.listings.filter((l: any) => l.sellerId === sellerId);
      setListings(sellerListings);
      
      // Fetch reviews
      if (accessToken) {
        try {
          const reviewsResponse = await api.getSellerReviews(sellerId);
          setReviews(reviewsResponse.reviews || []);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching seller data:', error);
      toast.error('Failed to load seller profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!accessToken) {
      toast.error('Please sign in to follow sellers');
      return;
    }
    
    try {
      // In real app, call follow API
      setIsFollowing(!isFollowing);
      setFollowers(prev => isFollowing ? prev - 1 : prev + 1);
      toast.success(isFollowing ? 'Unfollowed seller' : 'Following seller!');
    } catch (error) {
      console.error('Error following seller:', error);
      toast.error('Failed to follow seller');
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/seller/${sellerId}`;
    navigator.clipboard.writeText(url);
    toast.success('Profile link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-12 text-center text-muted-foreground">
          Loading seller profile...
        </Card>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="space-y-6">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Seller not found</p>
        </Card>
      </div>
    );
  }

  const isOwnProfile = currentUserId === sellerId;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-2xl">
                {seller.avatar}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex gap-2">
              {!isOwnProfile && (
                <Button
                  onClick={handleFollow}
                  className={isFollowing ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="w-4 h-4 mr-2" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
              )}
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl text-blue-900 mb-2">{seller.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{seller.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {new Date(seller.memberSince).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {seller.badges.map((badge: string) => (
                <Badge key={badge} className="bg-blue-100 text-blue-700 border-0">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {badge}
                </Badge>
              ))}
            </div>

            {/* Bio */}
            <p className="text-gray-700 mb-4">{seller.bio}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl text-blue-700">{seller.stats.totalListings}</p>
                <p className="text-xs text-muted-foreground">Active Listings</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl text-green-700">{seller.stats.completedSales}</p>
                <p className="text-xs text-muted-foreground">Sales</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl text-yellow-700">{seller.stats.averageRating}</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl text-purple-700">{followers}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="listings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="listings">
            <Package className="w-4 h-4 mr-2" />
            Listings ({listings.length})
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <Star className="w-4 h-4 mr-2" />
            Reviews ({reviews.length})
          </TabsTrigger>
          <TabsTrigger value="about">
            <User className="w-4 h-4 mr-2" />
            About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-4">
          {listings.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground">
              No active listings at the moment
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Card
                  key={listing.id}
                  className="overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => onViewListing(listing.id)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={listing.images?.[0] || 'https://via.placeholder.com/400'}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    {listing.verified && (
                      <Badge className="absolute top-3 right-3 bg-blue-600 text-white border-0">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-gray-900 mb-2 line-clamp-2">{listing.title}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-blue-700">${listing.price?.toLocaleString() || 'N/A'}</p>
                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                        {listing.condition}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          {reviews.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground">
              No reviews yet
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-10 h-10 bg-blue-100 text-blue-700 flex items-center justify-center">
                    {review.reviewerAvatar}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-900">{review.reviewerName}</p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground">{review.comment}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">About This Seller</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Response Time</Label>
                <p className="text-gray-900">{seller.stats.responseTime}</p>
              </div>
              <Separator />
              <div>
                <Label className="text-sm text-muted-foreground">Total Sales</Label>
                <p className="text-gray-900">{seller.stats.completedSales} completed transactions</p>
              </div>
              <Separator />
              <div>
                <Label className="text-sm text-muted-foreground">Average Rating</Label>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900">{seller.stats.averageRating}</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(seller.stats.averageRating) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Label component if not imported
const Label = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <label className={`block text-sm font-medium ${className}`}>{children}</label>
);

export default SellerProfile;
