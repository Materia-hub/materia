import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, CheckCircle, ArrowUpDown, Navigation, Plus, X } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { mockListings, categories, conditions, Listing } from './data/mockData';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { calculateDistance, getCoordinatesFromZip, parseLocation, getUserLocation } from '../utils/distance';

interface ListingsProps {
  accessToken: string | null;
  currentUserId: string;
  onViewListing: (listingId: string) => void;
  onEditListing: (listingId: string) => void;
  listings: Listing[];
}

export default function Listings({ accessToken, currentUserId, onViewListing, onEditListing, listings }: ListingsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedCondition, setSelectedCondition] = useState('All Conditions');
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [tradeOnly, setTradeOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedState, setSelectedState] = useState('All States');
  const [sortBy, setSortBy] = useState('newest');
  
  // Distance filter states
  const [userZipCode, setUserZipCode] = useState('');
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceEnabled, setDistanceEnabled] = useState(false);
  const [maxDistance, setMaxDistance] = useState([500]); // in miles

  // Use listings from props (managed by App.tsx)
  const allListings = listings;

  // Extract unique states for filtering
  const uniqueStates = ['All States', ...Array.from(new Set(
    allListings
      .map(listing => listing.locationData?.state || listing.location.split(', ')[1])
      .filter(Boolean)
  ))].sort();

  // Calculate distance for each listing if user coordinates are available
  const listingsWithDistance = allListings.map(listing => {
    let distance: number | null = null;
    
    if (userCoordinates) {
      const listingCoords = parseLocation(listing.location, listing.locationData?.zipCode);
      if (listingCoords) {
        distance = calculateDistance(
          userCoordinates.lat,
          userCoordinates.lng,
          listingCoords.lat,
          listingCoords.lng
        );
      }
    }
    
    return { ...listing, distance };
  });

  const filteredListings = listingsWithDistance.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || listing.category === selectedCategory;
    const matchesCondition = selectedCondition === 'All Conditions' || listing.condition === selectedCondition;
    const listingState = listing.locationData?.state || listing.location.split(', ')[1];
    const matchesState = selectedState === 'All States' || listingState === selectedState;
    // Handle bulk pricing (price might be 0)
    const listingPrice = listing.pricingType === 'bulk' && listing.bulkPricing ? 
                         listing.bulkPricing[0]?.pricePerUnit || 0 : listing.price;
    const matchesPrice = listingPrice >= priceRange[0] && listingPrice <= priceRange[1];
    const matchesTrade = !tradeOnly || listing.tradeAvailable;
    const matchesVerified = !verifiedOnly || listing.verified;
    
    // Distance filter
    const matchesDistance = !distanceEnabled || !userCoordinates || 
                           (listing.distance !== null && listing.distance <= maxDistance[0]);
    
    return matchesSearch && matchesCategory && matchesCondition && matchesState && matchesPrice && matchesTrade && matchesVerified && matchesDistance;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'location') return a.location.localeCompare(b.location);
    if (sortBy === 'distance' && a.distance !== null && b.distance !== null) return a.distance - b.distance;
    if (sortBy === 'newest') return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    return 0;
  });

  // Handle user location input
  const handleZipCodeChange = (zip: string) => {
    setUserZipCode(zip);
    if (zip.length >= 3) {
      const coords = getCoordinatesFromZip(zip);
      if (coords) {
        setUserCoordinates(coords);
        if (!distanceEnabled) {
          setDistanceEnabled(true);
        }
      }
    } else {
      if (distanceEnabled) {
        setUserCoordinates(null);
      }
    }
  };

  // Get user's current location
  const handleUseCurrentLocation = async () => {
    try {
      const coords = await getUserLocation();
      setUserCoordinates(coords);
      setUserZipCode('Current Location');
      setDistanceEnabled(true);
      toast.success('Location detected successfully!');
    } catch (error) {
      toast.error('Unable to get your location. Please enter a zip code.');
    }
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <Label>Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Condition</Label>
        <Select value={selectedCondition} onValueChange={setSelectedCondition}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {conditions.map(cond => (
              <SelectItem key={cond} value={cond}>{cond}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>State/Region</Label>
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {uniqueStates.map(state => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Distance Filter */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <Label htmlFor="distance-filter">Filter by Distance</Label>
          <Switch 
            id="distance-filter" 
            checked={distanceEnabled} 
            onCheckedChange={(checked) => {
              setDistanceEnabled(checked);
              if (!checked) {
                setUserZipCode('');
                setUserCoordinates(null);
              }
            }} 
          />
        </div>
        
        {distanceEnabled && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="user-zip">Your Zip Code</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="user-zip"
                  value={userZipCode}
                  onChange={(e) => handleZipCodeChange(e.target.value)}
                  placeholder="Enter zip code"
                  maxLength={5}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleUseCurrentLocation}
                  title="Use my current location"
                >
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Or click <Navigation className="w-3 h-3 inline" /> to use your current location
              </p>
            </div>
            
            {userCoordinates && (
              <div>
                <Label>Maximum Distance: {maxDistance[0] >= 1000 ? 'Nationwide' : `${maxDistance[0]} miles`}</Label>
                <Slider
                  value={maxDistance}
                  onValueChange={setMaxDistance}
                  min={10}
                  max={1000}
                  step={10}
                  className="mt-3"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>10 mi</span>
                  <span>Nationwide</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Show listings within {maxDistance[0] >= 1000 ? 'nationwide range' : `${maxDistance[0]} miles`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <Label>Price Range: ${priceRange[0]} - ${priceRange[1]}</Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={3000}
          step={100}
          className="mt-3"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="trade-only">Trade Available Only</Label>
        <Switch id="trade-only" checked={tradeOnly} onCheckedChange={setTradeOnly} />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="verified-only">Verified Listings Only</Label>
        <Switch id="verified-only" checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
      </div>

      <Button
        variant="outline"
        onClick={() => {
          setSelectedCategory('All Categories');
          setSelectedCondition('All Conditions');
          setSelectedState('All States');
          setPriceRange([0, 3000]);
          setTradeOnly(false);
          setVerifiedOnly(false);
          setDistanceEnabled(false);
          setUserZipCode('');
          setUserCoordinates(null);
          setMaxDistance([500]);
        }}
        className="w-full"
      >
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-blue-900 mb-2">Browse Materials</h2>
          <p className="text-muted-foreground">
            Discover sustainable building materials from sellers across the platform
          </p>
        </div>
        <Button
          onClick={() => onEditListing('')}
          className="bg-green-600 hover:bg-green-700 text-white shrink-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Listing
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          {/* Search and Sort Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="location">Location (A-Z)</SelectItem>
                  {userCoordinates && <SelectItem value="distance">Distance (Nearest)</SelectItem>}
                </SelectContent>
              </Select>

              {/* Desktop Filters */}
              <div className="hidden lg:block">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filter Listings</SheetTitle>
                      <SheetDescription>
                        Refine your search with filters
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Mobile Filters */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">
                      <SlidersHorizontal className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filter Listings</SheetTitle>
                      <SheetDescription>
                        Refine your search with filters
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          {/* Distance Filter Quick Access */}
          {distanceEnabled && userCoordinates && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 flex-shrink-0">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-900">Distance Filter Active:</span>
              </div>
              <div className="flex items-center gap-3 flex-1">
                <span className="text-sm text-blue-700">Within</span>
                <Select 
                  value={maxDistance[0].toString()} 
                  onValueChange={(value) => setMaxDistance([parseInt(value)])}
                >
                  <SelectTrigger className="w-[140px] h-9 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 miles</SelectItem>
                    <SelectItem value="25">25 miles</SelectItem>
                    <SelectItem value="50">50 miles</SelectItem>
                    <SelectItem value="100">100 miles</SelectItem>
                    <SelectItem value="250">250 miles</SelectItem>
                    <SelectItem value="500">500 miles</SelectItem>
                    <SelectItem value="1000">Nationwide</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-blue-700">of {userZipCode === 'Current Location' ? 'your location' : `ZIP ${userZipCode}`}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDistanceEnabled(false);
                  setUserZipCode('');
                  setUserCoordinates(null);
                }}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'} found
        </p>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <Card
            key={listing.id}
            className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => onViewListing(listing.id)}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={listing.images?.[0] || 'https://images.unsplash.com/photo-1715534408885-b9e45db5fc13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNsYWltZWQlMjB3b29kJTIwbWF0ZXJpYWxzfGVufDF8fHx8MTc2MDYxNTQ4OHww&ixlib=rb-4.1.0&q=80&w=1080'}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {listing.verified && (
                <Badge className="absolute top-3 right-3 bg-blue-600 text-white border-0">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
              {listing.tradeAvailable && (
                <Badge className="absolute top-3 left-3 bg-sky-600 text-white border-0">
                  Trade OK
                </Badge>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                {listing.title}
              </h3>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <MapPin className="w-4 h-4" />
                <span className="flex-1">{listing.location}</span>
                {listing.distance !== null && distanceEnabled && (
                  <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                    {listing.distance} mi
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700">${listing.price.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{listing.quantity}</p>
                </div>
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  {listing.condition}
                </Badge>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-muted-foreground">
                  {listing.sellerName} • {listing.views} views
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No listings found matching your criteria</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Categories');
              setSelectedCondition('All Conditions');
              setSelectedState('All States');
              setPriceRange([0, 3000]);
              setTradeOnly(false);
              setVerifiedOnly(false);
              setDistanceEnabled(false);
              setUserZipCode('');
              setUserCoordinates(null);
              setMaxDistance([500]);
            }}
          >
            Clear All Filters
          </Button>
        </Card>
      )}
    </div>
  );
}
