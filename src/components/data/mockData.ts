export interface BulkPricingTier {
  minQuantity: number;
  maxQuantity?: number;
  pricePerUnit: number;
}

export interface LocationData {
  city: string;
  state: string;
  zipCode: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Salvage';
  price: number;
  pricingType: 'per-item' | 'bulk';
  bulkPricing?: BulkPricingTier[];
  tradeAvailable: boolean;
  images: string[];
  location: string;
  locationData?: LocationData;
  sellerId: string;
  sellerName: string;
  sellerType: string;
  verified: boolean;
  views: number;
  postedDate: string;
}

export interface Message {
  id: string;
  listingId: string;
  listingTitle: string;
  otherUserId: string;
  otherUserName: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  messages: {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
  }[];
}

export interface Transaction {
  id: string;
  listingId: string;
  listingTitle: string;
  type: 'offer' | 'purchase' | 'counter-offer';
  amount: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  date: string;
  notes?: string;
}

export interface PickupAppointment {
  id: string;
  listingId: string;
  listingTitle: string;
  date: string;
  time: string;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

// Demo listings cleared - all listings now come from the database
export const mockListings: Listing[] = [];

export const mockMessages: Message[] = [];

export const mockTransactions: Transaction[] = [];

export const mockPickups: PickupAppointment[] = [];

export const categories = [
  'All Categories',
  'Wood',
  'Metal',
  'Pallets',
  'Construction Materials',
  'Specialty Materials',
  'Tools',
  'Packaging',
  'Construction Debris',
];

export const conditions = [
  'All Conditions',
  'Excellent',
  'Good',
  'Fair',
  'Salvage',
];
