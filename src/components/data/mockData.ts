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

export const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Reclaimed Oak Flooring - 500 sq ft',
    description: 'Beautiful reclaimed oak hardwood flooring from a 1920s warehouse. Excellent condition with natural patina. All boards are 3.25" wide and various lengths from 4-8 feet. Already cleaned and ready for installation. Perfect for rustic or industrial design projects.',
    category: 'Wood',
    quantity: '500 sq ft',
    condition: 'Excellent',
    price: 1200,
    pricingType: 'per-item',
    tradeAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1715534408885-b9e45db5fc13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNsYWltZWQlMjB3b29kJTIwbWF0ZXJpYWxzfGVufDF8fHx8MTc2MDYxNTQ4OHww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    location: 'Grand Rapids, MI',
    locationData: { city: 'Grand Rapids', state: 'MI', zipCode: '49503' },
    sellerId: '1',
    sellerName: 'Dillon Weldy',
    sellerType: 'Construction Contractor',
    verified: true,
    views: 45,
    postedDate: '2025-10-10',
  },
  {
    id: '2',
    title: 'Steel I-Beams - Various Sizes',
    description: 'Structural steel I-beams from commercial demolition project. Mix of 6", 8", and 10" beams. Lengths range from 12-20 feet. Some surface rust but structurally sound. Great for building frames, supports, or industrial furniture. Must pick up from our yard in Holland.',
    category: 'Metal',
    quantity: '15 pieces',
    condition: 'Good',
    price: 2500,
    pricingType: 'per-item',
    tradeAvailable: false,
    images: [
      'https://images.unsplash.com/photo-1708064235939-0b78938aa224?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwbWV0YWwlMjBzY3JhcHxlbnwxfHx8fDE3NjA2MTU0ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    location: 'Holland, MI',
    locationData: { city: 'Holland', state: 'MI', zipCode: '49423' },
    sellerId: '2',
    sellerName: 'Mike Chen',
    sellerType: 'Demolition Contractor',
    verified: true,
    views: 78,
    postedDate: '2025-10-12',
  },
  {
    id: '3',
    title: 'Industrial Wooden Pallets - 100 units',
    description: 'Standard 48x40 inch wooden pallets in good condition. Heat treated and stamped. Perfect for DIY furniture projects, shipping, or storage. Can deliver locally for an additional fee. Bulk discount available for purchases over 50 units.',
    category: 'Pallets',
    quantity: '100 units',
    condition: 'Good',
    price: 500,
    pricingType: 'bulk',
    bulkPricing: [
      { minQuantity: 1, maxQuantity: 24, pricePerUnit: 8 },
      { minQuantity: 25, maxQuantity: 49, pricePerUnit: 6.50 },
      { minQuantity: 50, pricePerUnit: 5 }
    ],
    tradeAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1759300635757-19ab99f4cfed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBwYWxsZXRzJTIwd2FyZWhvdXNlfGVufDF8fHx8MTc2MDU0MzE2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    location: 'Muskegon, MI',
    locationData: { city: 'Muskegon', state: 'MI', zipCode: '49440' },
    sellerId: '3',
    sellerName: 'Valley Logistics',
    sellerType: 'Warehouse Operations',
    verified: true,
    views: 92,
    postedDate: '2025-10-08',
  },
  {
    id: '4',
    title: 'Brick Pavers - Antique Clay',
    description: 'Reclaimed antique clay brick pavers from downtown street renovation. Approximately 2000 bricks available. Beautiful weathered red color with character. Perfect for landscaping, walkways, or accent walls. Each brick is approximately 4x8 inches.',
    category: 'Construction Materials',
    quantity: '2000 pieces',
    condition: 'Good',
    price: 800,
    pricingType: 'bulk',
    bulkPricing: [
      { minQuantity: 1, maxQuantity: 499, pricePerUnit: 0.60 },
      { minQuantity: 500, maxQuantity: 999, pricePerUnit: 0.50 },
      { minQuantity: 1000, pricePerUnit: 0.40 }
    ],
    tradeAvailable: false,
    images: [
      'https://images.unsplash.com/photo-1637241612956-b7309005288b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBtYXRlcmlhbHN8ZW58MXx8fHwxNzYwNTQwMzcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    location: 'Grand Rapids, MI',
    locationData: { city: 'Grand Rapids', state: 'MI', zipCode: '49503' },
    sellerId: '1',
    sellerName: 'Dillon Weldy',
    sellerType: 'Construction Contractor',
    verified: true,
    views: 63,
    postedDate: '2025-10-05',
  },
  {
    id: '5',
    title: 'Copper Pipe and Fittings',
    description: 'Assorted copper plumbing pipes and fittings from residential renovation projects. Mix of 1/2", 3/4", and 1" pipes. Approximately 200 feet total. All cleaned and sorted. Great value for plumbers or artists working with copper.',
    category: 'Specialty Materials',
    quantity: '200+ feet',
    condition: 'Excellent',
    price: 650,
    pricingType: 'per-item',
    tradeAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1705164686320-cf877bf7f338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xlZCUyMGJ1aWxkaW5nJTIwc3VwcGxpZXN8ZW58MXx8fHwxNzYwNjE1NDg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    location: 'Wyoming, MI',
    locationData: { city: 'Wyoming', state: 'MI', zipCode: '49509' },
    sellerId: '4',
    sellerName: 'Anderson Plumbing',
    sellerType: 'Plumbing Contractor',
    verified: false,
    views: 34,
    postedDate: '2025-10-14',
  },
  {
    id: '6',
    title: 'Ceramic Floor Tiles - Overstock',
    description: 'Brand new ceramic floor tiles, 12x12 inches. Manufacturer overstock in a neutral beige color. 500 tiles available. Never installed, still in original boxes. Perfect for bathrooms, kitchens, or commercial spaces.',
    category: 'Construction Materials',
    quantity: '500 tiles',
    condition: 'Excellent',
    price: 450,
    pricingType: 'per-item',
    tradeAvailable: false,
    images: [
      'https://images.unsplash.com/photo-1637241612956-b7309005288b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBtYXRlcmlhbHN8ZW58MXx8fHwxNzYwNTQwMzcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    location: 'Kentwood, MI',
    locationData: { city: 'Kentwood', state: 'MI', zipCode: '49512' },
    sellerId: '5',
    sellerName: 'BuildRight Supply',
    sellerType: 'Building Materials Supplier',
    verified: true,
    views: 56,
    postedDate: '2025-10-13',
  },
  {
    id: '7',
    title: 'Reclaimed Barn Wood',
    description: 'Authentic barn wood from 100+ year old barn in rural Kent County. Mix of weathered gray and brown boards. Various widths and lengths. Perfect for feature walls, furniture, or decorative projects. Adds instant character to any space.',
    category: 'Wood',
    quantity: '300 board feet',
    condition: 'Good',
    price: 900,
    pricingType: 'per-item',
    tradeAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1715534408885-b9e45db5fc13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNsYWltZWQlMjB3b29kJTIwbWF0ZXJpYWxzfGVufDF8fHx8MTc2MDYxNTQ4OHww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    location: 'Rockford, MI',
    locationData: { city: 'Rockford', state: 'MI', zipCode: '49341' },
    sellerId: '1',
    sellerName: 'Dillon Weldy',
    sellerType: 'Construction Contractor',
    verified: true,
    views: 71,
    postedDate: '2025-10-11',
  },
  {
    id: '8',
    title: 'Aluminum Window Frames',
    description: 'Commercial-grade aluminum window frames from office building renovation. Various sizes available. All frames are clean and in excellent working condition. Hardware included. Great for greenhouses, workshops, or residential projects.',
    category: 'Specialty Materials',
    quantity: '25 frames',
    condition: 'Excellent',
    price: 1100,
    pricingType: 'per-item',
    tradeAvailable: false,
    images: [
      'https://images.unsplash.com/photo-1705164686320-cf877bf7f338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xlZCUyMGJ1aWxkaW5nJTIwc3VwcGxpZXN8ZW58MXx8fHwxNzYwNjE1NDg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    location: 'Grand Rapids, MI',
    locationData: { city: 'Grand Rapids', state: 'MI', zipCode: '49503' },
    sellerId: '2',
    sellerName: 'Mike Chen',
    sellerType: 'Demolition Contractor',
    verified: true,
    views: 41,
    postedDate: '2025-10-09',
  },
  {
    id: '9',
    title: 'Alumi-tec Aluminum Composite Panels',
    description: 'High-quality Alumi-tec aluminum composite panels, perfect for exterior cladding, signage, and architectural applications. These lightweight yet durable panels feature a polyethylene core sandwiched between two aluminum sheets. Each panel is 4ft x 8ft with a smooth brushed finish. Excellent condition, surplus from commercial project. Weather-resistant and easy to fabricate.',
    category: 'Construction Materials',
    quantity: '20 sheets',
    condition: 'Excellent',
    price: 165,
    pricingType: 'per-item',
    tradeAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1635647331438-94444d1dd7a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbHVtaW51bSUyMGNvbXBvc2l0ZSUyMHBhbmVsfGVufDF8fHx8MTc2MDY1ODg5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    location: 'Grand Rapids, MI',
    locationData: { city: 'Grand Rapids', state: 'MI', zipCode: '49503' },
    sellerId: '1',
    sellerName: 'Dillon Weldy',
    sellerType: 'Construction Contractor',
    verified: true,
    views: 12,
    postedDate: '2025-10-16',
  },
  {
    id: '10',
    title: 'Commercial Kitchen Equipment - Stainless Steel',
    description: 'High-quality stainless steel commercial kitchen equipment from restaurant renovation. Includes countertops, shelving units, and sink stations. All pieces are heavy-duty 304 stainless steel. Perfect for commercial kitchens, food trucks, or home use. Sanitary and corrosion-resistant.',
    category: 'Specialty Materials',
    quantity: '12 pieces',
    condition: 'Excellent',
    price: 2800,
    pricingType: 'per-item',
    tradeAvailable: false,
    images: [
      'https://images.unsplash.com/photo-1705164686320-cf877bf7f338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xlZCUyMGJ1aWxkaW5nJTIwc3VwcGxpZXN8ZW58MXx8fHwxNzYwNjE1NDg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    location: 'Chicago, IL',
    locationData: { city: 'Chicago', state: 'IL', zipCode: '60601' },
    sellerId: '6',
    sellerName: 'Metro Restaurant Supply',
    sellerType: 'Restaurant Supplier',
    verified: true,
    views: 28,
    postedDate: '2025-10-15',
  },
  {
    id: '11',
    title: 'Douglas Fir Lumber - Premium Grade',
    description: 'Premium Douglas Fir structural lumber from Pacific Northwest mill. Kiln-dried and graded for strength. Mix of 2x4, 2x6, and 2x8 boards in 8-16 foot lengths. Perfect for framing, decking, or heavy construction. Sustainably harvested and milled.',
    category: 'Wood',
    quantity: '2000 board feet',
    condition: 'Excellent',
    price: 4500,
    pricingType: 'per-item',
    tradeAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1715534408885-b9e45db5fc13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNsYWltZWQlMjB3b29kJTIwbWF0ZXJpYWxzfGVufDF8fHx8MTc2MDYxNTQ4OHww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    location: 'Seattle, WA',
    locationData: { city: 'Seattle', state: 'WA', zipCode: '98101' },
    sellerId: '7',
    sellerName: 'Northwest Lumber Co',
    sellerType: 'Lumber Mill',
    verified: true,
    views: 89,
    postedDate: '2025-10-14',
  },
  {
    id: '12',
    title: 'Granite Countertop Remnants - Various Colors',
    description: 'Beautiful granite countertop remnants in various colors including black, white, gray, and beige. Pieces range from 2-6 feet in length. Perfect for smaller projects like bathroom vanities, bar tops, or outdoor kitchen counters. All pieces are polished and ready to install.',
    category: 'Construction Materials',
    quantity: '25 pieces',
    condition: 'Excellent',
    price: 1500,
    pricingType: 'bulk',
    bulkPricing: [
      { minQuantity: 1, maxQuantity: 4, pricePerUnit: 80 },
      { minQuantity: 5, maxQuantity: 9, pricePerUnit: 65 },
      { minQuantity: 10, pricePerUnit: 50 }
    ],
    tradeAvailable: false,
    images: [
      'https://images.unsplash.com/photo-1637241612956-b7309005288b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBtYXRlcmlhbHN8ZW58MXx8fHwxNzYwNTQwMzcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    location: 'Austin, TX',
    locationData: { city: 'Austin', state: 'TX', zipCode: '73301' },
    sellerId: '8',
    sellerName: 'Texas Stone & Tile',
    sellerType: 'Stone Fabricator',
    verified: true,
    views: 53,
    postedDate: '2025-10-13',
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    listingId: '1',
    listingTitle: 'Reclaimed Oak Flooring - 500 sq ft',
    otherUserId: '2',
    otherUserName: 'Mike Chen',
    lastMessage: 'Is the flooring still available? I\'m interested in purchasing all 500 sq ft.',
    timestamp: '2025-10-15T14:30:00',
    unread: true,
    messages: [
      { id: '1-1', senderId: '2', text: 'Hi, is this flooring still available?', timestamp: '2025-10-15T10:00:00' },
      { id: '1-2', senderId: '1', text: 'Yes, it\'s still available! All 500 sq ft.', timestamp: '2025-10-15T11:30:00' },
      { id: '1-3', senderId: '2', text: 'Is the flooring still available? I\'m interested in purchasing all 500 sq ft.', timestamp: '2025-10-15T14:30:00' },
    ],
  },
  {
    id: '2',
    listingId: '2',
    listingTitle: 'Steel I-Beams - Various Sizes',
    otherUserId: '6',
    otherUserName: 'Rachel Park',
    lastMessage: 'Can you provide exact dimensions of each beam?',
    timestamp: '2025-10-14T16:45:00',
    unread: true,
    messages: [
      { id: '2-1', senderId: '6', text: 'Hi, I\'m interested in the steel beams. Can you provide more details?', timestamp: '2025-10-14T15:00:00' },
      { id: '2-2', senderId: '1', text: 'Sure! We have 5x 6-inch, 6x 8-inch, and 4x 10-inch beams.', timestamp: '2025-10-14T15:30:00' },
      { id: '2-3', senderId: '6', text: 'Can you provide exact dimensions of each beam?', timestamp: '2025-10-14T16:45:00' },
    ],
  },
  {
    id: '3',
    listingId: '4',
    listingTitle: 'Brick Pavers - Antique Clay',
    otherUserId: '7',
    otherUserName: 'Tom Williams',
    lastMessage: 'Great, I\'ll come by tomorrow at 2 PM to take a look.',
    timestamp: '2025-10-13T09:20:00',
    unread: false,
    messages: [
      { id: '3-1', senderId: '7', text: 'Are these bricks all the same size?', timestamp: '2025-10-12T14:00:00' },
      { id: '3-2', senderId: '1', text: 'Yes, they\'re all approximately 4x8 inches. Feel free to come see them!', timestamp: '2025-10-12T16:00:00' },
      { id: '3-3', senderId: '7', text: 'Great, I\'ll come by tomorrow at 2 PM to take a look.', timestamp: '2025-10-13T09:20:00' },
    ],
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    listingId: '2',
    listingTitle: 'Steel I-Beams - Various Sizes',
    type: 'offer',
    amount: 2200,
    status: 'pending',
    buyerId: '8',
    buyerName: 'James Miller',
    sellerId: '2',
    sellerName: 'Mike Chen',
    date: '2025-10-15',
    notes: 'Interested in all 15 pieces. Can pick up this weekend.',
  },
  {
    id: '2',
    listingId: '1',
    listingTitle: 'Reclaimed Oak Flooring - 500 sq ft',
    type: 'purchase',
    amount: 1200,
    status: 'accepted',
    buyerId: '9',
    buyerName: 'Lisa Anderson',
    sellerId: '1',
    sellerName: 'Dillon Weldy',
    date: '2025-10-14',
    notes: 'Payment confirmed. Pickup scheduled for Oct 18.',
  },
  {
    id: '3',
    listingId: '3',
    listingTitle: 'Industrial Wooden Pallets - 100 units',
    type: 'counter-offer',
    amount: 450,
    status: 'pending',
    buyerId: '1',
    buyerName: 'Dillon Weldy',
    sellerId: '3',
    sellerName: 'Valley Logistics',
    date: '2025-10-13',
    notes: 'Counter-offer for 75 units.',
  },
  {
    id: '4',
    listingId: '7',
    listingTitle: 'Reclaimed Barn Wood',
    type: 'offer',
    amount: 850,
    status: 'declined',
    buyerId: '10',
    buyerName: 'Kevin Brown',
    sellerId: '1',
    sellerName: 'Dillon Weldy',
    date: '2025-10-12',
  },
];

export const mockPickups: PickupAppointment[] = [
  {
    id: '1',
    listingId: '1',
    listingTitle: 'Reclaimed Oak Flooring - 500 sq ft',
    date: '2025-10-18',
    time: '14:00',
    location: 'CME Warehouse, 2450 Burton St SE, Grand Rapids, MI 49546',
    status: 'scheduled',
    notes: 'Bring truck and help with loading. Flooring is on pallets.',
  },
  {
    id: '2',
    listingId: '4',
    listingTitle: 'Brick Pavers - Antique Clay',
    date: '2025-10-17',
    time: '10:00',
    location: 'CME Warehouse, 2450 Burton St SE, Grand Rapids, MI 49546',
    status: 'scheduled',
    notes: 'Bricks are sorted and ready for pickup.',
  },
  {
    id: '3',
    listingId: '7',
    listingTitle: 'Reclaimed Barn Wood',
    date: '2025-10-14',
    time: '15:00',
    location: 'CME Warehouse, 2450 Burton St SE, Grand Rapids, MI 49546',
    status: 'completed',
  },
];

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
