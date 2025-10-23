import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { Listing } from './data/mockData';

interface FavoritesProps {
  accessToken: string | null;
  onListingClick: (listingId: string) => void;
}

export default function Favorites({ accessToken, onListingClick }: FavoritesProps) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessToken) {
      fetchFavorites();
    }
  }, [accessToken]);

  const fetchFavorites = async () => {
    if (!accessToken) return;
    
    try {
      setLoading(true);
      const response = await api.getFavorites(accessToken);
      setFavorites(response.favorites || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (listingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!accessToken) return;
    
    try {
      await api.removeFavorite(listingId, accessToken);
      setFavorites(prev => prev.filter(f => f.listingId !== listingId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-blue-900 mb-2">Favorites</h2>
          <p className="text-muted-foreground">Loading your saved listings...</p>
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
        <h2 className="text-blue-900 mb-2">Favorites</h2>
        <p className="text-muted-foreground">
          Your saved listings ({favorites.length})
        </p>
      </div>

      {favorites.length === 0 ? (
        <Card className="p-12 text-center">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-muted-foreground mb-2">No favorites yet</p>
          <p className="text-sm text-muted-foreground">
            Click the heart icon on any listing to save it here
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => {
            const listing = favorite.listing;
            return (
              <Card
                key={favorite.listingId}
                className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group relative"
                onClick={() => onListingClick(favorite.listingId)}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white shadow-sm"
                  onClick={(e) => handleRemoveFavorite(favorite.listingId, e)}
                >
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                </Button>

                <div className="relative h-48 overflow-hidden">
                  <img
                    src={listing.images?.[0] || 'https://images.unsplash.com/photo-1715534408885-b9e45db5fc13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNsYWltZWQlMjB3b29kJTIwbWF0ZXJpYWxzfGVufDF8fHx8MTc2MDYxNTQ4OHww&ixlib=rb-4.1.0&q=80&w=1080'}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {listing.verified && (
                    <Badge className="absolute top-3 left-3 bg-blue-600 text-white border-0">
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {listing.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-700">${listing.price?.toLocaleString() || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">{listing.quantity}</p>
                    </div>
                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                      {listing.condition}
                    </Badge>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-muted-foreground">
                      Saved {new Date(favorite.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
