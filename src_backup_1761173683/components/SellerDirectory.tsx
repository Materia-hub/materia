import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Package, TrendingUp, Filter, Users } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

interface SellerDirectoryProps {
  onViewSeller: (sellerId: string) => void;
  onViewListing: (listingId: string) => void;
  accessToken: string | null;
}

export default function SellerDirectory({ onViewSeller, onViewListing, accessToken }: SellerDirectoryProps) {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      
      // Mock sellers data - in real app, fetch from API
      const mockSellers = [
        {
          id: 'seller-1',
          name: 'John Smith Construction',
          avatar: 'JS',
          location: 'Denver, CO',
          memberSince: '2024-01-15',
          bio: 'Family-owned construction company specializing in sustainable building materials.',
          badges: ['Verified Seller', 'Top Rated'],
          stats: {
            totalListings: 24,
            completedSales: 156,
            averageRating: 4.8,
            followers: 89,
          },
          categories: ['Wood', 'Metal', 'Fixtures'],
        },
        {
          id: 'seller-2',
          name: 'EcoBuilders Supply',
          avatar: 'EB',
          location: 'Portland, OR',
          memberSince: '2024-02-20',
          bio: 'Committed to sustainable building through reclaimed materials.',
          badges: ['Verified Seller', 'Eco-Warrior'],
          stats: {
            totalListings: 18,
            completedSales: 92,
            averageRating: 4.9,
            followers: 134,
          },
          categories: ['Brick & Stone', 'Concrete', 'Glass'],
        },
        {
          id: 'seller-3',
          name: 'Vintage Salvage Co',
          avatar: 'VS',
          location: 'Austin, TX',
          memberSince: '2023-11-10',
          bio: 'Specializing in architectural salvage and vintage building materials.',
          badges: ['Verified Seller', 'Top Rated', 'Fast Shipper'],
          stats: {
            totalListings: 31,
            completedSales: 203,
            averageRating: 4.7,
            followers: 156,
          },
          categories: ['Fixtures', 'Wood', 'Glass'],
        },
        {
          id: 'seller-4',
          name: 'Metro Demolition',
          avatar: 'MD',
          location: 'Chicago, IL',
          memberSince: '2024-03-05',
          bio: 'Professional demolition contractor offering quality salvaged materials.',
          badges: ['Verified Seller'],
          stats: {
            totalListings: 15,
            completedSales: 67,
            averageRating: 4.6,
            followers: 45,
          },
          categories: ['Metal', 'Concrete', 'Other'],
        },
        {
          id: 'seller-5',
          name: 'Green Reclaim LLC',
          avatar: 'GR',
          location: 'Seattle, WA',
          memberSince: '2023-12-01',
          bio: 'Eco-friendly reclamation services for residential and commercial projects.',
          badges: ['Verified Seller', 'Eco-Warrior', 'Top Rated'],
          stats: {
            totalListings: 27,
            completedSales: 145,
            averageRating: 4.9,
            followers: 178,
          },
          categories: ['Wood', 'Brick & Stone', 'Fixtures'],
        },
      ];

      setSellers(mockSellers);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      toast.error('Failed to load sellers');
    } finally {
      setLoading(false);
    }
  };

  const filteredSellers = sellers
    .filter(seller => {
      // Search filter
      const matchesSearch = seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           seller.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           seller.bio.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = filterCategory === 'all' || seller.categories.includes(filterCategory);
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.stats.averageRating - a.stats.averageRating;
        case 'sales':
          return b.stats.completedSales - a.stats.completedSales;
        case 'followers':
          return b.stats.followers - a.stats.followers;
        case 'listings':
          return b.stats.totalListings - a.stats.totalListings;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-blue-900 mb-2">Seller Directory</h2>
          <p className="text-muted-foreground">Loading sellers...</p>
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
      <div>
        <h2 className="text-blue-900 mb-2">Seller Directory</h2>
        <p className="text-muted-foreground">
          Browse verified sellers and discover quality materials
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Wood">Wood</SelectItem>
                <SelectItem value="Metal">Metal</SelectItem>
                <SelectItem value="Brick & Stone">Brick & Stone</SelectItem>
                <SelectItem value="Concrete">Concrete</SelectItem>
                <SelectItem value="Glass">Glass</SelectItem>
                <SelectItem value="Fixtures">Fixtures</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="sales">Most Sales</SelectItem>
                <SelectItem value="followers">Most Followers</SelectItem>
                <SelectItem value="listings">Most Listings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredSellers.length} seller{filteredSellers.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Sellers Grid */}
      {filteredSellers.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-muted-foreground mb-2">No sellers found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSellers.map((seller) => (
            <Card
              key={seller.id}
              className="p-6 hover:shadow-xl transition-all cursor-pointer"
              onClick={() => onViewSeller(seller.id)}
            >
              {/* Seller Header */}
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-xl">
                  {seller.avatar}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 truncate mb-1">{seller.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{seller.location}</span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {seller.badges.map((badge: string, index: number) => (
                  <Badge key={index} variant="outline" className="border-blue-200 text-blue-700 text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {seller.bio}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-3 h-3 text-yellow-600" />
                    <p className="text-sm text-blue-700">{seller.stats.averageRating}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <p className="text-sm text-green-700">{seller.stats.completedSales}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Sales</p>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Package className="w-3 h-3 text-purple-600" />
                    <p className="text-sm text-purple-700">{seller.stats.totalListings}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Listings</p>
                </div>
                <div className="text-center p-2 bg-pink-50 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="w-3 h-3 text-pink-600" />
                    <p className="text-sm text-pink-700">{seller.stats.followers}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </div>

              {/* Categories */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-muted-foreground mb-2">Specializes in:</p>
                <div className="flex flex-wrap gap-1">
                  {seller.categories.map((cat: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* View Profile Button */}
              <Button 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewSeller(seller.id);
                }}
              >
                View Profile
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerDirectory;
