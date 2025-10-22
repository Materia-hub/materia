import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Package, CheckCircle, Calendar, MessageSquare, DollarSign, Share2, Flag, Edit, Trash2, Heart } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Listing } from './data/mockData';
import { toast } from 'sonner@2.0.3';
import { api } from '../utils/api';
import Reviews from './Reviews';

interface ListingDetailProps {
  listingId: string;
  onBack: () => void;
  onEdit: (listingId: string) => void;
  onDelete?: () => void;
  listings: Listing[];
  accessToken: string | null;
  currentUserId?: string;
}

export default function ListingDetail({ listingId, onBack, onEdit, onDelete, listings, accessToken, currentUserId }: ListingDetailProps) {
  const listing = listings.find(l => l.id === listingId);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [messageText, setMessageText] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Check if listing is favorited
  useEffect(() => {
    const checkFavorite = async () => {
      if (!accessToken) return;
      
      try {
        const response = await api.getFavorites(accessToken);
        const favorites = response.favorites || [];
        setIsFavorited(favorites.some((f: any) => f.listingId === listingId));
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };
    
    checkFavorite();
  }, [accessToken, listingId]);

  const handleToggleFavorite = async () => {
    if (!accessToken) {
      toast.error('Please sign in to save favorites');
      return;
    }
    
    try {
      setFavoriteLoading(true);
      
      if (isFavorited) {
        await api.removeFavorite(listingId, accessToken);
        setIsFavorited(false);
        toast.success('Removed from favorites');
      } else {
        await api.addFavorite(listingId, accessToken);
        setIsFavorited(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (!listing) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground mb-4">Listing not found</p>
        <Button onClick={onBack}>Go Back</Button>
      </Card>
    );
  }

  const handleSendOffer = () => {
    toast.success('Offer sent successfully!');
    setOfferAmount('');
    setOfferMessage('');
  };

  const handleSendMessage = () => {
    toast.success('Message sent to seller!');
    setMessageText('');
  };

  const handleScheduleDelivery = () => {
    if (!deliveryAddress || !deliveryDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Delivery scheduled successfully!');
    setDeliveryAddress('');
    setDeliveryDate('');
    setDeliveryNotes('');
  };

  const handleBuyNow = () => {
    toast.success(`Purchase confirmed! You bought "${listing.title}" for ${listing.price.toLocaleString()}`);
  };

  const handleDelete = async () => {
    // Check if this is a real user listing (has timestamp-based ID) vs mock data
    const isRealListing = listing.id.includes('-');
    
    if (!isRealListing) {
      toast.error('Cannot delete demo listings. Please create your own listing to test this feature.');
      return;
    }
    
    setIsDeleting(true);
    try {
      await api.deleteListing(listing.id);
      toast.success('Listing deleted successfully');
      if (onDelete) {
        onDelete();
      }
      onBack();
    } catch (error) {
      console.error('Error deleting listing:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete listing';
      
      if (errorMessage.includes('not found')) {
        toast.error('This listing no longer exists or has already been deleted.');
      } else {
        toast.error('Failed to delete listing. Please try again.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwnListing = listing.sellerId === '1'; // Current user's listing

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="text-blue-700 hover:text-blue-900">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Listings
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card className="overflow-hidden">
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-96 object-cover"
            />
          </Card>

          {/* Details */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-blue-900">{listing.title}</h2>
                  {listing.verified && (
                    <Badge className="bg-blue-600 text-white border-0">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {listing.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Posted {new Date(listing.postedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {isOwnListing && (
                  <>
                    <Button variant="outline" onClick={() => onEdit(listing.id)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{listing.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
                <Button variant="ghost" size="icon">
                  <Share2 className="w-5 h-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Flag className="w-5 h-5 text-muted-foreground" />
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Price</p>
                {listing.pricingType === 'bulk' && listing.bulkPricing ? (
                  <div className="text-blue-700">
                    <p>From ${listing.bulkPricing[0].pricePerUnit.toLocaleString()}/unit</p>
                  </div>
                ) : (
                  <p className="text-blue-700">${listing.price.toLocaleString()}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Quantity</p>
                <p>{listing.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Condition</p>
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  {listing.condition}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Category</p>
                <p>{listing.category}</p>
              </div>
            </div>

            {listing.pricingType === 'bulk' && listing.bulkPricing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="text-sm text-blue-900 mb-3">Bulk Pricing Tiers</h4>
                <div className="space-y-2">
                  {listing.bulkPricing.map((tier, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-blue-800">
                        {tier.minQuantity}{tier.maxQuantity ? `-${tier.maxQuantity}` : '+'} units
                      </span>
                      <span className="text-blue-700">${tier.pricePerUnit.toLocaleString()}/unit</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {listing.tradeAvailable && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  <Package className="w-4 h-4 inline mr-2" />
                  Seller is open to trade offers
                </p>
              </div>
            )}

            <div>
              <h3 className="text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{listing.description}</p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Info */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Seller Information</h3>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700">
                <AvatarFallback className="text-white">
                  {listing.sellerName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p>{listing.sellerName}</p>
                <p className="text-sm text-muted-foreground">{listing.sellerType}</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location</span>
                <span>{listing.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span>Aug 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Listings</span>
                <span>5</span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          {!isOwnListing && (
            <Card className="p-6 space-y-3">
              <Button 
                variant="outline" 
                className="w-full border-2"
                onClick={handleToggleFavorite}
                disabled={favoriteLoading}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorited ? 'Saved' : 'Save to Favorites'}
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Make an Offer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Make an Offer</DialogTitle>
                    <DialogDescription>
                      Submit your offer for this listing
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="offer-amount">Offer Amount ($)</Label>
                      <Input
                        id="offer-amount"
                        type="number"
                        placeholder="Enter your offer"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Listed price: ${listing.price.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="offer-message">Message to Seller (Optional)</Label>
                      <Textarea
                        id="offer-message"
                        placeholder="Add a message..."
                        value={offerMessage}
                        onChange={(e) => setOfferMessage(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSendOffer} className="bg-blue-600 hover:bg-blue-700">
                      Send Offer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full text-sm border-gray-300">
                    Buy It Now - ${listing.price.toLocaleString()}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Purchase</DialogTitle>
                    <DialogDescription>
                      You're about to purchase this item at the listed price
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-6 space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm text-blue-900 mb-2">{listing.title}</h4>
                      <p className="text-blue-700">
                        Purchase Price: ${listing.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        By clicking "Confirm Purchase", you agree to buy this item at the listed price. 
                        The seller will be notified and you'll receive payment and pickup instructions.
                      </p>
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button onClick={handleBuyNow} className="bg-blue-600 hover:bg-blue-700">
                        Confirm Purchase
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Seller
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Message</DialogTitle>
                    <DialogDescription>
                      Contact the seller about this listing
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Write your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      rows={6}
                      className="mt-2"
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                      Send Message
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
                    <Package className="w-4 h-4 mr-2" />
                    Schedule Delivery
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule Delivery</DialogTitle>
                    <DialogDescription>
                      Arrange delivery for this listing
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="delivery-address">Delivery Address *</Label>
                      <Input
                        id="delivery-address"
                        placeholder="Enter your delivery address"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="delivery-date">Preferred Delivery Date *</Label>
                      <Input
                        id="delivery-date"
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="delivery-notes">Special Instructions (Optional)</Label>
                      <Textarea
                        id="delivery-notes"
                        placeholder="Any special delivery instructions..."
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        rows={3}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleScheduleDelivery} className="bg-blue-600 hover:bg-blue-700">
                      Confirm Delivery
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Pickup
              </Button>
            </Card>
          )}

          {/* Stats */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Listing Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Views</span>
                <span>{listing.views}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Interested Buyers</span>
                <span>7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Saved</span>
                <span>12</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <Reviews 
          listingId={listingId}
          sellerId={listing.sellerId}
          accessToken={accessToken}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}
