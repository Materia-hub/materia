# Phase 1 Features - Implementation Guide

## Overview
Phase 1 introduces essential marketplace features to SupplyWise: Payment Integration, Reviews & Ratings, Favorites/Watchlist, and In-App Notifications.

---

## ✅ 1. Favorites/Watchlist System

### Backend API Endpoints
- `GET /favorites` - Get user's saved listings
- `POST /favorites/:listingId` - Add listing to favorites
- `DELETE /favorites/:listingId` - Remove listing from favorites

### Frontend Components
**New Component:** `/components/Favorites.tsx`
- Displays all saved listings in a grid
- Quick remove from favorites
- Shows save date
- Click to view listing details

**Integration Points:**
- Heart icon on listing cards (hover to save)
- Heart button in ListingDetail (save/unsave)
- "Favorites" menu item in navigation
- Auto-creates notification for seller when favorited

### Features
- Persistent across sessions (stored in backend)
- Real-time favorite status updates
- Visual feedback (filled/unfilled heart)
- Shows when listing was saved

### Usage
1. Browse listings
2. Click heart icon to save
3. Access saved listings from "Favorites" page
4. Click again to unsave

---

## ⭐ 2. Reviews & Ratings System

### Backend API Endpoints
- `GET /listings/:id/reviews` - Get reviews for a listing
- `GET /sellers/:sellerId/reviews` - Get all seller reviews
- `POST /reviews` - Create a new review

### Frontend Components
**New Component:** `/components/Reviews.tsx`
- Star rating selector (1-5 stars)
- Comment textarea (optional)
- Review list with avatars
- Average rating display
- Review count

**Integration Points:**
- Appears at bottom of ListingDetail page
- Shows seller's overall rating
- "Write a Review" button for authenticated users
- Creates notification for seller when reviewed

### Features
- 5-star rating system
- Optional text comments
- Shows reviewer name and avatar
- Displays "time ago" timestamps
- Calculates and displays average rating
- Review verification (must be signed in)

### Data Structure
```typescript
{
  id: string;
  listingId: string;
  sellerId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}
```

---

## 🔔 3. Notification System

### Backend API Endpoints
- `GET /notifications` - Get user notifications
- `PUT /notifications/:id/read` - Mark single as read
- `PUT /notifications/read-all` - Mark all as read
- `POST /notifications` - Create notification (internal)

### Frontend Components
**New Component:** `/components/Notifications.tsx`
- Bell icon in header with unread count badge
- Dropdown popover with notification list
- Icons for different notification types
- "Mark all read" button
- Click notification to navigate

**Integration Points:**
- Bell icon in header (top right)
- Auto-updates when new notifications arrive
- Creates notifications for:
  - New favorites on listings
  - New reviews
  - New messages
  - New offers
  - Purchase confirmations

### Notification Types
- `favorite` - Someone favorited your listing (❤️ red)
- `review` - New review received (⭐ yellow)
- `message` - New message (💬 blue)
- `offer` - New offer/counter-offer (🛒 green)
- `purchase` - Purchase confirmed (🛒 green)

### Features
- Real-time unread count badge
- Visual distinction (blue bg for unread)
- Grouping by type with icons
- "Time ago" formatting
- Persistent notification history
- Mark individual or all as read

---

## 💳 4. Payment Integration (Stripe)

### Backend API Endpoints
- `POST /create-checkout-session` - Create Stripe checkout
- `POST /stripe-webhook` - Handle Stripe webhooks

### Payment Options
**Pay-Per-Listing:** $0.99 per additional listing
- First 3 listings free
- Each additional listing costs $0.99
- One-time payment per listing

**Annual Unlimited:** $20/year
- Unlimited listings
- No per-listing fees
- Best value for active sellers

### Integration Points
**SubscriptionDialog Component** (Updated)
- Shows current plan
- Displays pricing cards
- Links to Stripe checkout
- Handles payment confirmation

### Stripe Setup (Production)
1. Create Stripe account
2. Get API keys (publishable & secret)
3. Store secret key in environment variable
4. Configure webhook endpoint
5. Set up product pricing in Stripe Dashboard

### Current Implementation
- **Development Mode:** Simulated payments (no real charges)
- **Production Ready:** Stripe integration structure in place
- **Webhook Handler:** Processes successful payments
- **User Metadata Update:** Updates subscription tier after payment

### Security
- Stripe handles all payment processing
- PCI compliance managed by Stripe
- Webhook signature verification
- No card data stored in app

---

## 🔐 Authentication Integration

All Phase 1 features require authentication:
- Favorites require sign-in to save
- Reviews require sign-in to submit
- Notifications only for logged-in users
- Payments require user account

### Access Token Management
- Stored in App.tsx state
- Passed to components as prop
- Used in API headers for auth
- Refreshed on session check

---

## 📊 Database Schema (KV Store)

### Favorites
```
Key: favorite:{userId}:{listingId}
Value: {
  userId, listingId, listing, createdAt
}
```

### Reviews
```
Key: review:listing:{listingId}:{reviewId}
Key: review:seller:{sellerId}:{reviewId}
Value: {
  id, listingId, sellerId, reviewerId,
  reviewerName, reviewerAvatar, rating, comment, createdAt
}
```

### Notifications
```
Key: notification:{userId}:{notificationId}
Value: {
  id, userId, type, title, message,
  listingId, transactionId, read, createdAt
}
```

---

## 🎨 UI/UX Highlights

### Visual Design
- Consistent blue theme (#2563EB)
- Heart icons for favorites (red when filled)
- Star icons for ratings (yellow when filled)
- Bell icon for notifications (with red badge)
- Clean, minimal design

### User Feedback
- Toast notifications for all actions
- Loading states on buttons
- Real-time updates
- Visual confirmation of actions

### Responsive Design
- Mobile-friendly notification dropdown
- Touch-friendly star rating
- Card grid layouts
- Responsive navigation

---

## 🚀 Testing Guide

### Test Favorites
1. Sign in to app
2. Browse listings
3. Click heart icon on any listing
4. Go to "Favorites" page
5. Verify listing appears
6. Click heart again to remove
7. Verify it's removed from favorites

### Test Reviews
1. Sign in to app
2. View any listing detail
3. Scroll to reviews section
4. Click "Write a Review"
5. Select star rating
6. Add comment (optional)
7. Submit review
8. Verify it appears in review list

### Test Notifications
1. Sign in to app
2. Perform actions that create notifications:
   - Favorite a listing (seller gets notified)
   - Leave a review (seller gets notified)
3. Click bell icon in header
4. Verify notifications appear
5. Click "Mark all read"
6. Verify unread badge disappears

### Test Payments (Development)
1. Sign in to app
2. Try to create 4th listing
3. Subscription dialog appears
4. Click upgrade option
5. Mock checkout session created
6. Simulated payment confirmation

---

## 📱 API Usage Examples

### Add to Favorites
```javascript
await api.addFavorite(listingId, accessToken);
```

### Create Review
```javascript
await api.createReview({
  listingId: 'listing-123',
  sellerId: 'seller-456',
  rating: 5,
  comment: 'Great materials!'
}, accessToken);
```

### Get Notifications
```javascript
const { notifications } = await api.getNotifications(accessToken);
```

### Mark Notification Read
```javascript
await api.markNotificationRead(notificationId, accessToken);
```

---

## 🔧 Environment Variables

Required for production:
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## ⚡ Performance Optimizations

- Notifications loaded only when dropdown opened
- Favorites checked on mount (cached)
- Reviews paginated (future enhancement)
- Lazy loading for listing images
- Debounced API calls

---

## 🎯 Future Enhancements (Phase 2+)

### Email Notifications
- Send emails for new favorites
- Review notifications via email
- Weekly digest of activity

### Push Notifications
- Browser push for new notifications
- Mobile app push notifications

### Advanced Reviews
- Photo uploads in reviews
- Seller responses to reviews
- Helpful votes on reviews
- Verified purchase badges

### Enhanced Favorites
- Favorite collections/folders
- Price drop alerts
- Back-in-stock notifications
- Share favorites list

### Payment Features
- Promo codes/discounts
- Referral rewards
- Bulk listing packages
- Free trial periods

---

## 📞 Support

For issues or questions:
1. Check console logs for errors
2. Verify Supabase connection
3. Check API endpoint responses
4. Review network requests in DevTools

Common Issues:
- **401 Unauthorized:** Access token expired, re-login
- **Favorites not saving:** Check access token is passed
- **Notifications not appearing:** Verify backend route is working
- **Reviews not submitting:** Ensure required fields (rating) are filled
