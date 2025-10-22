import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Plus, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';
import { mockListings, categories, conditions, Listing, BulkPricingTier } from './data/mockData';
import SubscriptionDialog from './SubscriptionDialog';
import { api } from '../utils/api';

interface CreateListingProps {
  editListingId: string | null;
  onBack: () => void;
  onSave: (listingData: Omit<Listing, 'id' | 'sellerId' | 'sellerName' | 'sellerType' | 'verified' | 'views' | 'postedDate'>) => void;
  listings: Listing[];
  currentUser: {
    id: string;
    subscriptionTier: 'free' | 'pay-per-listing' | 'annual';
  };
  onUpdateSubscription: (tier: 'pay-per-listing' | 'annual') => void;
}

export default function CreateListing({ editListingId, onBack, onSave, listings, currentUser, onUpdateSubscription }: CreateListingProps) {
  const existingListing = editListingId ? listings.find(l => l.id === editListingId) : null;
  
  // Calculate user's listing count
  const userListingCount = listings.filter(l => l.sellerId === currentUser.id).length;
  const FREE_LISTING_LIMIT = 3;
  const canCreateFree = userListingCount < FREE_LISTING_LIMIT || currentUser.subscriptionTier === 'annual';
  
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  
  const [title, setTitle] = useState(existingListing?.title || '');
  const [description, setDescription] = useState(existingListing?.description || '');
  const [category, setCategory] = useState(existingListing?.category || 'Wood');
  const [quantity, setQuantity] = useState(existingListing?.quantity || '');
  const [condition, setCondition] = useState(existingListing?.condition || 'Good');
  const [price, setPrice] = useState(existingListing?.price.toString() || '');
  const [location, setLocation] = useState(existingListing?.location || '');
  const [zipCode, setZipCode] = useState(existingListing?.locationData?.zipCode || '');
  const [tradeAvailable, setTradeAvailable] = useState(existingListing?.tradeAvailable || false);
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [shape, setShape] = useState<'none' | 'round' | 'square' | 'rectangle'>('none');
  const [diameter, setDiameter] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [calculatedArea, setCalculatedArea] = useState('');
  const [pricingType, setPricingType] = useState<'per-item' | 'bulk'>(existingListing?.pricingType || 'per-item');
  const [bulkTiers, setBulkTiers] = useState<Array<{ minQuantity: string; maxQuantity: string; pricePerUnit: string }>>(
    existingListing?.bulkPricing?.map(tier => ({
      minQuantity: tier.minQuantity.toString(),
      maxQuantity: tier.maxQuantity?.toString() || '',
      pricePerUnit: tier.pricePerUnit.toString()
    })) || [{ minQuantity: '1', maxQuantity: '', pricePerUnit: '' }]
  );
  const [uploadedImages, setUploadedImages] = useState<string[]>(existingListing?.images || []);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePayPerListing = () => {
    onUpdateSubscription('pay-per-listing');
    setShowSubscriptionDialog(false);
    toast.success('Subscription updated to pay-per-listing');
  };

  const handleAnnualSubscription = () => {
    onUpdateSubscription('annual');
    setShowSubscriptionDialog(false);
    toast.success('Annual subscription activated!');
  };

  const handleImageUpload = () => {
    // Trigger file input click
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadedImages.length >= 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const remainingSlots = 5 - uploadedImages.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    setUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Max size is 5MB`);
          return null;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image`);
          return null;
        }

        // Convert to base64
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const base64Data = e.target?.result as string;
              
              // Upload to backend
              const response = await api.uploadImage(base64Data, file.name);
              resolve(response.url);
            } catch (error) {
              console.error('Upload error:', error);
              toast.error(`Failed to upload ${file.name}`);
              reject(error);
            }
          };
          reader.onerror = () => {
            toast.error(`Failed to read ${file.name}`);
            reject(new Error('Failed to read file'));
          };
          reader.readAsDataURL(file);
        });
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter((url): url is string => url !== null);

      if (validUrls.length > 0) {
        setUploadedImages([...uploadedImages, ...validUrls]);
        toast.success(`${validUrls.length} image(s) uploaded successfully!`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const addBulkTier = () => {
    setBulkTiers([...bulkTiers, { minQuantity: '', maxQuantity: '', pricePerUnit: '' }]);
  };

  // Calculate area based on shape
  useEffect(() => {
    if (shape === 'round' && diameter) {
      const d = parseFloat(diameter);
      if (!isNaN(d)) {
        const area = Math.PI * Math.pow(d / 2, 2);
        setCalculatedArea(area.toFixed(2));
      }
    } else if (shape === 'square' && length) {
      const l = parseFloat(length);
      if (!isNaN(l)) {
        const area = l * l;
        setCalculatedArea(area.toFixed(2));
      }
    } else if (shape === 'rectangle' && length && width) {
      const l = parseFloat(length);
      const w = parseFloat(width);
      if (!isNaN(l) && !isNaN(w)) {
        const area = l * w;
        setCalculatedArea(area.toFixed(2));
      }
    } else {
      setCalculatedArea('');
    }
  }, [shape, diameter, length, width]);

  const removeBulkTier = (index: number) => {
    if (bulkTiers.length > 1) {
      setBulkTiers(bulkTiers.filter((_, i) => i !== index));
    }
  };

  const updateBulkTier = (index: number, field: 'minQuantity' | 'maxQuantity' | 'pricePerUnit', value: string) => {
    const newTiers = [...bulkTiers];
    newTiers[index][field] = value;
    setBulkTiers(newTiers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !quantity || !location) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (pricingType === 'per-item' && !price) {
      toast.error('Please enter a price');
      return;
    }

    if (pricingType === 'bulk') {
      const hasInvalidTier = bulkTiers.some(tier => !tier.minQuantity || !tier.pricePerUnit);
      if (hasInvalidTier) {
        toast.error('Please fill in all bulk pricing tiers');
        return;
      }
    }

    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    // Simple location data (no coordinates needed)
    const locationData = location ? {
      city: location.split(', ')[0] || 'Unknown',
      state: location.split(', ')[1] || 'Unknown',
      zipCode: zipCode || '00000',
    } : undefined;

    // Prepare listing data
    const listingData: Omit<Listing, 'id' | 'sellerId' | 'sellerName' | 'sellerType' | 'verified' | 'views' | 'postedDate'> = {
      title,
      description,
      category,
      quantity,
      condition: condition as 'Excellent' | 'Good' | 'Fair' | 'Salvage',
      price: pricingType === 'per-item' ? parseFloat(price) : 0,
      pricingType,
      bulkPricing: pricingType === 'bulk' ? bulkTiers.map(tier => ({
        minQuantity: parseInt(tier.minQuantity),
        maxQuantity: tier.maxQuantity ? parseInt(tier.maxQuantity) : undefined,
        pricePerUnit: parseFloat(tier.pricePerUnit),
      })) : undefined,
      tradeAvailable,
      images: uploadedImages,
      location,
      locationData,
    };

    try {
      // Save to backend
      const fullListingData = {
        ...listingData,
        sellerId: currentUser.id,
        sellerName: 'Current User', // This should come from actual user data
        sellerType: 'individual' as const,
        verified: false,
        views: 0,
        postedDate: new Date().toISOString(),
      };

      if (editListingId) {
        await api.updateListing(editListingId, fullListingData);
      } else {
        await api.createListing(fullListingData);
      }

      // Also call the parent callback for local state update
      onSave(listingData);
      toast.success(editListingId ? 'Listing updated successfully!' : 'Listing created successfully!');
      setTimeout(() => onBack(), 1500);
    } catch (error) {
      console.error('Error saving listing:', error);
      toast.error('Failed to save listing. Please try again.');
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <SubscriptionDialog
        open={showSubscriptionDialog}
        onClose={() => setShowSubscriptionDialog(false)}
        onSelectPayPerListing={handlePayPerListing}
        onSelectAnnual={handleAnnualSubscription}
        currentListingCount={userListingCount}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={onBack} className="text-blue-700 hover:text-blue-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div>
          <h2 className="text-blue-900 mb-2">
            {editListingId ? 'Edit Listing' : 'Create New Listing'}
          </h2>
          <p className="text-muted-foreground">
            Share your surplus or reclaimed materials with the community
          </p>
          {!editListingId && (
            <p className="text-sm text-blue-600 mt-1">
              {currentUser.subscriptionTier === 'annual' 
                ? `Unlimited listings (Annual Plan) • ${userListingCount} listings created`
                : currentUser.subscriptionTier === 'free'
                ? `Free listings: ${userListingCount}/${FREE_LISTING_LIMIT} used`
                : `Pay-per-listing plan • ${userListingCount} listings created`
              }
            </p>
          )}
        </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Reclaimed Oak Flooring - 500 sq ft"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed information about the materials..."
                  rows={6}
                  className="mt-2"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Include condition, dimensions, origin, and any other relevant details
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== 'All Categories').map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="condition">Condition *</Label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.filter(c => c !== 'All Conditions').map(cond => (
                        <SelectItem key={cond} value={cond}>{cond}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g., 500 sq ft, 100 units, 15 pieces"
                  className="mt-2"
                  required
                />
              </div>

              {/* Size/Area Calculator */}
              <div className="border-t pt-4">
                <Label htmlFor="shape">Item Shape (Optional)</Label>
                <Select value={shape} onValueChange={(value: any) => {
                  setShape(value);
                  setDiameter('');
                  setLength('');
                  setWidth('');
                  setCalculatedArea('');
                }}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select shape to calculate area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No shape selected</SelectItem>
                    <SelectItem value="round">Round (Circle)</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="rectangle">Rectangle</SelectItem>
                  </SelectContent>
                </Select>

                {shape === 'round' && (
                  <div className="mt-4">
                    <Label htmlFor="diameter">Diameter (inches or feet)</Label>
                    <Input
                      id="diameter"
                      type="number"
                      step="0.01"
                      value={diameter}
                      onChange={(e) => setDiameter(e.target.value)}
                      placeholder="Enter diameter"
                      className="mt-2"
                    />
                    {calculatedArea && (
                      <p className="text-sm text-blue-600 mt-2">
                        Calculated Area: {calculatedArea} sq units
                      </p>
                    )}
                  </div>
                )}

                {shape === 'square' && (
                  <div className="mt-4">
                    <Label htmlFor="length">Side Length (inches or feet)</Label>
                    <Input
                      id="length"
                      type="number"
                      step="0.01"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      placeholder="Enter side length"
                      className="mt-2"
                    />
                    {calculatedArea && (
                      <p className="text-sm text-blue-600 mt-2">
                        Calculated Area: {calculatedArea} sq units
                      </p>
                    )}
                  </div>
                )}

                {shape === 'rectangle' && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label htmlFor="length">Length (inches or feet)</Label>
                      <Input
                        id="length"
                        type="number"
                        step="0.01"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        placeholder="Enter length"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="width">Width (inches or feet)</Label>
                      <Input
                        id="width"
                        type="number"
                        step="0.01"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        placeholder="Enter width"
                        className="mt-2"
                      />
                    </div>
                    {calculatedArea && (
                      <p className="text-sm text-blue-600 mt-2">
                        Calculated Area: {calculatedArea} sq units
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div>
            <h3 className="text-gray-900 mb-4">Pricing</h3>
            <div className="space-y-4">
              <div>
                <Label>Pricing Type *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setPricingType('per-item')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      pricingType === 'per-item'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-sm">Single Price</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      One price for all quantities
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricingType('bulk')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      pricingType === 'bulk'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-sm">Bulk Pricing</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tiered pricing by quantity
                    </p>
                  </button>
                </div>
              </div>

              {pricingType === 'per-item' ? (
                <div>
                  <Label htmlFor="price">Total Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    className="mt-2"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the total price for the entire listing
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Label>Pricing Tiers *</Label>
                  <p className="text-xs text-muted-foreground">
                    Set different prices based on quantity purchased
                  </p>
                  {bulkTiers.map((tier, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-4">
                        <Label htmlFor={`min-qty-${index}`} className="text-xs">Min Quantity</Label>
                        <Input
                          id={`min-qty-${index}`}
                          type="number"
                          value={tier.minQuantity}
                          onChange={(e) => updateBulkTier(index, 'minQuantity', e.target.value)}
                          placeholder="1"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div className="col-span-3">
                        <Label htmlFor={`max-qty-${index}`} className="text-xs">Max Qty</Label>
                        <Input
                          id={`max-qty-${index}`}
                          type="number"
                          value={tier.maxQuantity}
                          onChange={(e) => updateBulkTier(index, 'maxQuantity', e.target.value)}
                          placeholder="Optional"
                          className="mt-1"
                        />
                      </div>
                      <div className="col-span-4">
                        <Label htmlFor={`price-${index}`} className="text-xs">Price/Unit ($)</Label>
                        <Input
                          id={`price-${index}`}
                          type="number"
                          step="0.01"
                          value={tier.pricePerUnit}
                          onChange={(e) => updateBulkTier(index, 'pricePerUnit', e.target.value)}
                          placeholder="0.00"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBulkTier(index)}
                          disabled={bulkTiers.length === 1}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addBulkTier}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tier
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">City, State *</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Grand Rapids, MI"
                    className="mt-2"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter your city and state
                  </p>
                </div>
                <div>
                  <Label htmlFor="zipCode">Zip Code (Optional)</Label>
                  <Input
                    id="zipCode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="12345"
                    className="mt-2"
                    maxLength={5}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <Label htmlFor="trade-available">Open to Trade Offers</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow buyers to propose trading materials instead of purchasing
                  </p>
                </div>
                <Switch
                  id="trade-available"
                  checked={tradeAvailable}
                  onCheckedChange={setTradeAvailable}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <Label htmlFor="delivery-available">Delivery Available</Label>
                  <p className="text-xs text-muted-foreground">
                    Check if you can deliver items to the buyer
                  </p>
                </div>
                <Switch
                  id="delivery-available"
                  checked={deliveryAvailable}
                  onCheckedChange={setDeliveryAvailable}
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-gray-900 mb-4">Photos *</h3>
            <div className="space-y-4">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {uploadedImages.length < 5 && (
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={uploading}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
                        <span className="text-sm text-gray-500">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Upload Photo</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Upload up to 5 photos (max 5MB each). First photo will be the cover image.
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editListingId ? 'Update Listing' : 'Create Listing'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Cancel
            </Button>
          </div>
        </Card>
      </form>
      </div>
    </>
  );
}
