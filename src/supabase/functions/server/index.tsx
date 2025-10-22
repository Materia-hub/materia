import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Initialize storage bucket for listing images
const bucketName = 'make-8ae6fee0-listings';
(async () => {
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  if (!bucketExists) {
    await supabase.storage.createBucket(bucketName, { public: false });
    console.log(`Created bucket: ${bucketName}`);
  }
})();

// Health check endpoint
app.get("/make-server-8ae6fee0/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-8ae6fee0/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, businessType, location } = body;
    
    if (!email || !password || !name || !businessType) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        businessType,
        location: location || 'Not specified',
        role: 'both',
        membershipStatus: 'Free',
        subscriptionTier: 'free',
        joinDate: new Date().toISOString().split('T')[0],
        avatar: name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
        isAdmin: false,
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    return c.json({ 
      user: data.user,
      success: true 
    });
  } catch (error) {
    console.error('Error during signup:', error);
    return c.json({ error: 'Failed to create account', details: error.message }, 500);
  }
});

// Get current user profile
app.get("/make-server-8ae6fee0/me", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.error('Auth error:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // Return user data with metadata
    return c.json({
      user: {
        id: user.id,
        email: user.email,
        ...user.user_metadata,
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return c.json({ error: 'Failed to fetch user', details: error.message }, 500);
  }
});

// Get all listings with optional filters
app.get("/make-server-8ae6fee0/listings", async (c) => {
  try {
    const { searchParams } = new URL(c.req.url);
    const category = searchParams.get('category');
    const condition = searchParams.get('condition');
    const search = searchParams.get('search')?.toLowerCase();
    const priceMax = searchParams.get('priceMax');
    const priceMin = searchParams.get('priceMin');

    const allListings = await kv.getByPrefix('listing:');
    
    let filtered = allListings.filter((item: any) => {
      if (!item.value) return false;
      
      const listing = item.value;
      
      // Filter by category
      if (category && category !== 'all' && listing.category !== category) return false;
      
      // Filter by condition
      if (condition && condition !== 'all' && listing.condition !== condition) return false;
      
      // Filter by search term
      if (search) {
        const searchLower = search.toLowerCase();
        const titleMatch = listing.title?.toLowerCase().includes(searchLower);
        const descMatch = listing.description?.toLowerCase().includes(searchLower);
        const locationMatch = listing.location?.toLowerCase().includes(searchLower);
        if (!titleMatch && !descMatch && !locationMatch) return false;
      }
      
      // Filter by price range
      if (listing.pricing?.type === 'fixed') {
        const price = listing.pricing.price;
        if (priceMin && price < parseFloat(priceMin)) return false;
        if (priceMax && price > parseFloat(priceMax)) return false;
      }
      
      return true;
    });

    const listings = filtered.map((item: any) => item.value);
    
    return c.json({ listings });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return c.json({ error: 'Failed to fetch listings', details: error.message }, 500);
  }
});

// Get single listing by ID
app.get("/make-server-8ae6fee0/listings/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const listing = await kv.get(`listing:${id}`);
    
    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }
    
    return c.json({ listing });
  } catch (error) {
    console.error('Error fetching listing:', error);
    return c.json({ error: 'Failed to fetch listing', details: error.message }, 500);
  }
});

// Create new listing
app.post("/make-server-8ae6fee0/listings", async (c) => {
  try {
    const body = await c.req.json();
    const { listing } = body;
    
    if (!listing || !listing.title) {
      return c.json({ error: 'Invalid listing data' }, 400);
    }
    
    // Generate unique ID
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const newListing = {
      ...listing,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`listing:${id}`, newListing);
    
    return c.json({ listing: newListing, success: true });
  } catch (error) {
    console.error('Error creating listing:', error);
    return c.json({ error: 'Failed to create listing', details: error.message }, 500);
  }
});

// Update listing
app.put("/make-server-8ae6fee0/listings/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { listing } = body;
    
    const existing = await kv.get(`listing:${id}`);
    if (!existing) {
      return c.json({ error: 'Listing not found' }, 404);
    }
    
    const updatedListing = {
      ...existing,
      ...listing,
      id,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`listing:${id}`, updatedListing);
    
    return c.json({ listing: updatedListing, success: true });
  } catch (error) {
    console.error('Error updating listing:', error);
    return c.json({ error: 'Failed to update listing', details: error.message }, 500);
  }
});

// Delete listing
app.delete("/make-server-8ae6fee0/listings/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    const existing = await kv.get(`listing:${id}`);
    if (!existing) {
      return c.json({ error: 'Listing not found' }, 404);
    }
    
    await kv.del(`listing:${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return c.json({ error: 'Failed to delete listing', details: error.message }, 500);
  }
});

// Upload image
app.post("/make-server-8ae6fee0/upload-image", async (c) => {
  try {
    const body = await c.req.json();
    const { image, filename } = body;
    
    if (!image) {
      return c.json({ error: 'No image provided' }, 400);
    }
    
    // Remove data URL prefix if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    const path = `${Date.now()}-${filename || 'image.jpg'}`;
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, buffer, {
        contentType: 'image/jpeg',
        upsert: false
      });
    
    if (error) {
      console.error('Storage upload error:', error);
      return c.json({ error: 'Failed to upload image', details: error.message }, 500);
    }
    
    // Get signed URL (valid for 1 year)
    const { data: urlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(path, 31536000);
    
    return c.json({ url: urlData?.signedUrl, path });
  } catch (error) {
    console.error('Error uploading image:', error);
    return c.json({ error: 'Failed to upload image', details: error.message }, 500);
  }
});

// ==================== FAVORITES ====================

// Get user favorites
app.get("/make-server-8ae6fee0/favorites", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const favorites = await kv.getByPrefix(`favorite:${user.id}:`);
    const favoriteListings = favorites.map((item: any) => item.value);
    
    return c.json({ favorites: favoriteListings });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return c.json({ error: 'Failed to fetch favorites', details: error.message }, 500);
  }
});

// Add favorite
app.post("/make-server-8ae6fee0/favorites/:listingId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const listingId = c.req.param('listingId');
    const listing = await kv.get(`listing:${listingId}`);
    
    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }
    
    const favorite = {
      userId: user.id,
      listingId,
      listing,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`favorite:${user.id}:${listingId}`, favorite);
    
    // Create notification for seller
    const notification = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId: listing.sellerId,
      type: 'favorite',
      title: 'New Favorite',
      message: `Someone favorited your listing: ${listing.title}`,
      listingId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    await kv.set(`notification:${listing.sellerId}:${notification.id}`, notification);
    
    return c.json({ success: true, favorite });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return c.json({ error: 'Failed to add favorite', details: error.message }, 500);
  }
});

// Remove favorite
app.delete("/make-server-8ae6fee0/favorites/:listingId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const listingId = c.req.param('listingId');
    await kv.del(`favorite:${user.id}:${listingId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return c.json({ error: 'Failed to remove favorite', details: error.message }, 500);
  }
});

// ==================== REVIEWS ====================

// Get reviews for a listing
app.get("/make-server-8ae6fee0/listings/:id/reviews", async (c) => {
  try {
    const listingId = c.req.param('id');
    const reviews = await kv.getByPrefix(`review:listing:${listingId}:`);
    const reviewList = reviews.map((item: any) => item.value);
    
    return c.json({ reviews: reviewList });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return c.json({ error: 'Failed to fetch reviews', details: error.message }, 500);
  }
});

// Get reviews for a seller
app.get("/make-server-8ae6fee0/sellers/:sellerId/reviews", async (c) => {
  try {
    const sellerId = c.req.param('sellerId');
    const reviews = await kv.getByPrefix(`review:seller:${sellerId}:`);
    const reviewList = reviews.map((item: any) => item.value);
    
    return c.json({ reviews: reviewList });
  } catch (error) {
    console.error('Error fetching seller reviews:', error);
    return c.json({ error: 'Failed to fetch reviews', details: error.message }, 500);
  }
});

// Create review
app.post("/make-server-8ae6fee0/reviews", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const body = await c.req.json();
    const { listingId, sellerId, rating, comment } = body;
    
    if (!listingId || !sellerId || !rating) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    if (rating < 1 || rating > 5) {
      return c.json({ error: 'Rating must be between 1 and 5' }, 400);
    }
    
    const reviewId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const review = {
      id: reviewId,
      listingId,
      sellerId,
      reviewerId: user.id,
      reviewerName: user.user_metadata?.name || 'Anonymous',
      reviewerAvatar: user.user_metadata?.avatar || 'AN',
      rating,
      comment: comment || '',
      createdAt: new Date().toISOString(),
    };
    
    // Store review by listing and seller
    await kv.set(`review:listing:${listingId}:${reviewId}`, review);
    await kv.set(`review:seller:${sellerId}:${reviewId}`, review);
    
    // Create notification for seller
    const notification = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId: sellerId,
      type: 'review',
      title: 'New Review',
      message: `${user.user_metadata?.name || 'Someone'} left you a ${rating}-star review`,
      listingId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    await kv.set(`notification:${sellerId}:${notification.id}`, notification);
    
    return c.json({ success: true, review });
  } catch (error) {
    console.error('Error creating review:', error);
    return c.json({ error: 'Failed to create review', details: error.message }, 500);
  }
});

// ==================== NOTIFICATIONS ====================

// Get user notifications
app.get("/make-server-8ae6fee0/notifications", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const notifications = await kv.getByPrefix(`notification:${user.id}:`);
    const notificationList = notifications
      .map((item: any) => item.value)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json({ notifications: notificationList });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return c.json({ error: 'Failed to fetch notifications', details: error.message }, 500);
  }
});

// Mark notification as read
app.put("/make-server-8ae6fee0/notifications/:id/read", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const notificationId = c.req.param('id');
    const notification = await kv.get(`notification:${user.id}:${notificationId}`);
    
    if (!notification) {
      return c.json({ error: 'Notification not found' }, 404);
    }
    
    const updated = { ...notification, read: true };
    await kv.set(`notification:${user.id}:${notificationId}`, updated);
    
    return c.json({ success: true, notification: updated });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return c.json({ error: 'Failed to update notification', details: error.message }, 500);
  }
});

// Mark all notifications as read
app.put("/make-server-8ae6fee0/notifications/read-all", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const notifications = await kv.getByPrefix(`notification:${user.id}:`);
    
    for (const item of notifications) {
      const updated = { ...item.value, read: true };
      await kv.set(`notification:${user.id}:${item.value.id}`, updated);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return c.json({ error: 'Failed to update notifications', details: error.message }, 500);
  }
});

// Create notification (for internal use)
app.post("/make-server-8ae6fee0/notifications", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, type, title, message, listingId, transactionId } = body;
    
    if (!userId || !type || !title || !message) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const notificationId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const notification = {
      id: notificationId,
      userId,
      type,
      title,
      message,
      listingId,
      transactionId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`notification:${userId}:${notificationId}`, notification);
    
    return c.json({ success: true, notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    return c.json({ error: 'Failed to create notification', details: error.message }, 500);
  }
});

// ==================== STRIPE PAYMENT ====================

// Create Stripe checkout session
app.post("/make-server-8ae6fee0/create-checkout-session", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const body = await c.req.json();
    const { subscriptionType } = body; // 'pay-per-listing' or 'annual'
    
    // Note: In production, you would use the Stripe API here
    // For now, we'll simulate a successful payment
    const sessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    return c.json({ 
      sessionId,
      // In production, return actual Stripe session URL
      url: `https://checkout.stripe.com/pay/${sessionId}`
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return c.json({ error: 'Failed to create checkout session', details: error.message }, 500);
  }
});

// Webhook handler for Stripe events
app.post("/make-server-8ae6fee0/stripe-webhook", async (c) => {
  try {
    // Note: In production, verify the Stripe signature
    const body = await c.req.json();
    const { type, data } = body;
    
    if (type === 'checkout.session.completed') {
      // Update user subscription in metadata
      const userId = data.object.client_reference_id;
      const subscriptionType = data.object.metadata?.subscriptionType;
      
      if (userId && subscriptionType) {
        // Update user metadata with new subscription
        // This would be done through Supabase Auth admin API
        console.log(`Updated user ${userId} to ${subscriptionType} subscription`);
      }
    }
    
    return c.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return c.json({ error: 'Webhook handler failed', details: error.message }, 500);
  }
});

// ==================== MESSAGES (ENHANCED) ====================

// Get conversations for user
app.get("/make-server-8ae6fee0/conversations", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const conversations = await kv.getByPrefix(`conversation:${user.id}:`);
    const conversationList = conversations
      .map((item: any) => item.value)
      .sort((a: any, b: any) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    
    return c.json({ conversations: conversationList });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return c.json({ error: 'Failed to fetch conversations', details: error.message }, 500);
  }
});

// Get messages in a conversation
app.get("/make-server-8ae6fee0/conversations/:conversationId/messages", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const conversationId = c.req.param('conversationId');
    const messages = await kv.getByPrefix(`message:${conversationId}:`);
    const messageList = messages
      .map((item: any) => item.value)
      .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    return c.json({ messages: messageList });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return c.json({ error: 'Failed to fetch messages', details: error.message }, 500);
  }
});

// Send message
app.post("/make-server-8ae6fee0/messages", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const body = await c.req.json();
    const { recipientId, listingId, text, image } = body;
    
    if (!recipientId || !text) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Create or get conversation
    const conversationId = [user.id, recipientId].sort().join(':');
    
    const messageId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const message = {
      id: messageId,
      conversationId,
      senderId: user.id,
      senderName: user.user_metadata?.name || 'Unknown',
      recipientId,
      listingId,
      text,
      image,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`message:${conversationId}:${messageId}`, message);
    
    // Update conversation metadata
    const conversation = {
      id: conversationId,
      participants: [user.id, recipientId],
      listingId,
      lastMessage: text,
      lastMessageAt: message.createdAt,
      lastMessageBy: user.id,
    };
    
    await kv.set(`conversation:${user.id}:${conversationId}`, conversation);
    await kv.set(`conversation:${recipientId}:${conversationId}`, conversation);
    
    // Create notification for recipient
    const notification = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId: recipientId,
      type: 'message',
      title: 'New Message',
      message: `${user.user_metadata?.name || 'Someone'} sent you a message`,
      listingId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    await kv.set(`notification:${recipientId}:${notification.id}`, notification);
    
    return c.json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    return c.json({ error: 'Failed to send message', details: error.message }, 500);
  }
});

// Mark message as read
app.put("/make-server-8ae6fee0/messages/:messageId/read", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const messageId = c.req.param('messageId');
    const messages = await kv.getByPrefix('message:');
    const messageItem = messages.find((m: any) => m.value?.id === messageId);
    
    if (!messageItem) {
      return c.json({ error: 'Message not found' }, 404);
    }
    
    const message = messageItem.value;
    const updated = { ...message, read: true };
    await kv.set(`message:${message.conversationId}:${messageId}`, updated);
    
    return c.json({ success: true, message: updated });
  } catch (error) {
    console.error('Error marking message as read:', error);
    return c.json({ error: 'Failed to update message', details: error.message }, 500);
  }
});

// Set typing status
app.post("/make-server-8ae6fee0/conversations/:conversationId/typing", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const conversationId = c.req.param('conversationId');
    const body = await c.req.json();
    const { typing } = body;
    
    // Store typing status with TTL (expires in 5 seconds)
    const typingStatus = {
      userId: user.id,
      conversationId,
      typing,
      timestamp: new Date().toISOString(),
    };
    
    await kv.set(`typing:${conversationId}:${user.id}`, typingStatus);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error setting typing status:', error);
    return c.json({ error: 'Failed to set typing status', details: error.message }, 500);
  }
});

// ==================== SAVED SEARCHES ====================

// Get user's saved searches
app.get("/make-server-8ae6fee0/saved-searches", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const searches = await kv.getByPrefix(`search:${user.id}:`);
    const searchList = searches
      .map((item: any) => item.value)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json({ searches: searchList });
  } catch (error) {
    console.error('Error fetching saved searches:', error);
    return c.json({ error: 'Failed to fetch saved searches', details: error.message }, 500);
  }
});

// Create saved search
app.post("/make-server-8ae6fee0/saved-searches", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const body = await c.req.json();
    const { name, filters, alertEnabled } = body;
    
    if (!name || !filters) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const searchId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const savedSearch = {
      id: searchId,
      userId: user.id,
      name,
      filters,
      alertEnabled: alertEnabled || false,
      createdAt: new Date().toISOString(),
      lastMatched: null,
    };
    
    await kv.set(`search:${user.id}:${searchId}`, savedSearch);
    
    return c.json({ success: true, search: savedSearch });
  } catch (error) {
    console.error('Error creating saved search:', error);
    return c.json({ error: 'Failed to create saved search', details: error.message }, 500);
  }
});

// Delete saved search
app.delete("/make-server-8ae6fee0/saved-searches/:searchId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const searchId = c.req.param('searchId');
    await kv.del(`search:${user.id}:${searchId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting saved search:', error);
    return c.json({ error: 'Failed to delete saved search', details: error.message }, 500);
  }
});

// Update saved search
app.put("/make-server-8ae6fee0/saved-searches/:searchId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const searchId = c.req.param('searchId');
    const body = await c.req.json();
    
    const existing = await kv.get(`search:${user.id}:${searchId}`);
    if (!existing) {
      return c.json({ error: 'Saved search not found' }, 404);
    }
    
    const updated = {
      ...existing,
      ...body,
      id: searchId,
      userId: user.id,
    };
    
    await kv.set(`search:${user.id}:${searchId}`, updated);
    
    return c.json({ success: true, search: updated });
  } catch (error) {
    console.error('Error updating saved search:', error);
    return c.json({ error: 'Failed to update saved search', details: error.message }, 500);
  }
});

// ==================== SELLER ANALYTICS ====================

// Get seller analytics
app.get("/make-server-8ae6fee0/analytics", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // Get all seller's listings
    const allListings = await kv.getByPrefix('listing:');
    const sellerListings = allListings
      .map((item: any) => item.value)
      .filter((listing: any) => listing.sellerId === user.id);
    
    // Get favorites for seller's listings
    const allFavorites = await kv.getByPrefix('favorite:');
    const sellerFavorites = allFavorites
      .map((item: any) => item.value)
      .filter((fav: any) => sellerListings.some((l: any) => l.id === fav.listingId));
    
    // Get reviews for seller
    const sellerReviews = await kv.getByPrefix(`review:seller:${user.id}:`);
    const reviews = sellerReviews.map((item: any) => item.value);
    
    // Calculate metrics
    const totalListings = sellerListings.length;
    const totalViews = sellerListings.reduce((sum: number, l: any) => sum + (l.views || 0), 0);
    const totalFavorites = sellerFavorites.length;
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
      : 0;
    
    // Calculate performance by category
    const byCategory = sellerListings.reduce((acc: any, listing: any) => {
      const cat = listing.category || 'Other';
      if (!acc[cat]) {
        acc[cat] = { count: 0, views: 0, favorites: 0 };
      }
      acc[cat].count += 1;
      acc[cat].views += listing.views || 0;
      acc[cat].favorites += sellerFavorites.filter((f: any) => f.listingId === listing.id).length;
      return acc;
    }, {});
    
    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentListings = sellerListings.filter((l: any) => 
      new Date(l.createdAt) >= thirtyDaysAgo
    );
    
    const recentFavorites = sellerFavorites.filter((f: any) => 
      new Date(f.createdAt) >= thirtyDaysAgo
    );
    
    const recentReviews = reviews.filter((r: any) => 
      new Date(r.createdAt) >= thirtyDaysAgo
    );
    
    const analytics = {
      overview: {
        totalListings,
        totalViews,
        totalFavorites,
        totalReviews: reviews.length,
        averageRating: averageRating.toFixed(1),
      },
      recent: {
        newListings: recentListings.length,
        newFavorites: recentFavorites.length,
        newReviews: recentReviews.length,
      },
      byCategory,
      topListings: sellerListings
        .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
        .slice(0, 5)
        .map((l: any) => ({
          id: l.id,
          title: l.title,
          views: l.views || 0,
          favorites: sellerFavorites.filter((f: any) => f.listingId === l.id).length,
        })),
    };
    
    return c.json({ analytics });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return c.json({ error: 'Failed to fetch analytics', details: error.message }, 500);
  }
});

// ==================== EMAIL SYSTEM ====================

// Send email via Resend API
async function sendEmail(to: string, subject: string, html: string) {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  
  if (!RESEND_API_KEY) {
    console.log('Resend API key not configured, skipping email send');
    return { success: false, error: 'Email not configured' };
  }
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Materia <notifications@materia.app>',
        to: [to],
        subject,
        html,
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return { success: false, error };
    }
    
    const data = await response.json();
    console.log('Email sent successfully:', data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

// ==================== NOTIFICATION PREFERENCES ====================

// Get user notification preferences
app.get("/make-server-8ae6fee0/notification-preferences", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const prefs = await kv.get(`preferences:${user.id}`);
    
    // Default preferences
    const defaultPrefs = {
      emailNotifications: true,
      emailDigest: 'weekly',
      notifyOnFavorite: true,
      notifyOnReview: true,
      notifyOnMessage: true,
      notifyOnOffer: true,
      notifyOnPurchase: true,
    };
    
    return c.json({ preferences: prefs || defaultPrefs });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return c.json({ error: 'Failed to fetch preferences', details: error.message }, 500);
  }
});

// Update notification preferences
app.put("/make-server-8ae6fee0/notification-preferences", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const body = await c.req.json();
    await kv.set(`preferences:${user.id}`, body);
    
    return c.json({ success: true, preferences: body });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return c.json({ error: 'Failed to update preferences', details: error.message }, 500);
  }
});

// ==================== SOCIAL FEATURES ====================

// Follow a seller
app.post("/make-server-8ae6fee0/sellers/:sellerId/follow", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const sellerId = c.req.param('sellerId');
    
    // Store the follow relationship
    await kv.set(`follow:${user.id}:${sellerId}`, {
      followerId: user.id,
      sellerId,
      followedAt: new Date().toISOString(),
    });
    
    // Increment seller's follower count
    const sellerStats = await kv.get(`seller-stats:${sellerId}`) || { followers: 0 };
    sellerStats.followers = (sellerStats.followers || 0) + 1;
    await kv.set(`seller-stats:${sellerId}`, sellerStats);
    
    return c.json({ success: true, following: true });
  } catch (error) {
    console.error('Error following seller:', error);
    return c.json({ error: 'Failed to follow seller', details: error.message }, 500);
  }
});

// Unfollow a seller
app.delete("/make-server-8ae6fee0/sellers/:sellerId/follow", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const sellerId = c.req.param('sellerId');
    
    // Remove the follow relationship
    await kv.del(`follow:${user.id}:${sellerId}`);
    
    // Decrement seller's follower count
    const sellerStats = await kv.get(`seller-stats:${sellerId}`) || { followers: 0 };
    sellerStats.followers = Math.max(0, (sellerStats.followers || 0) - 1);
    await kv.set(`seller-stats:${sellerId}`, sellerStats);
    
    return c.json({ success: true, following: false });
  } catch (error) {
    console.error('Error unfollowing seller:', error);
    return c.json({ error: 'Failed to unfollow seller', details: error.message }, 500);
  }
});

// Check if following a seller
app.get("/make-server-8ae6fee0/sellers/:sellerId/following", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ following: false });
    }
    
    const sellerId = c.req.param('sellerId');
    const follow = await kv.get(`follow:${user.id}:${sellerId}`);
    
    return c.json({ following: !!follow });
  } catch (error) {
    console.error('Error checking follow status:', error);
    return c.json({ following: false });
  }
});

// Get user's followed sellers
app.get("/make-server-8ae6fee0/following", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // Get all follows for this user
    const follows = await kv.getByPrefix(`follow:${user.id}:`);
    const sellerIds = follows.map((f: any) => f.sellerId);
    
    return c.json({ sellerIds });
  } catch (error) {
    console.error('Error fetching following list:', error);
    return c.json({ error: 'Failed to fetch following list', details: error.message }, 500);
  }
});

// Get activity feed
app.get("/make-server-8ae6fee0/activity-feed", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // Get followed sellers
    const follows = await kv.getByPrefix(`follow:${user.id}:`);
    const sellerIds = follows.map((f: any) => f.sellerId);
    
    // Get recent activities for followed sellers
    // In a real app, this would aggregate activities from multiple sources
    const activities: any[] = [];
    
    // For demo purposes, return mock activities
    // In production, query listings, reviews, sales, etc. for followed sellers
    
    return c.json({ activities });
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    return c.json({ error: 'Failed to fetch activity feed', details: error.message }, 500);
  }
});

// Get seller profile
app.get("/make-server-8ae6fee0/sellers/:sellerId", async (c) => {
  try {
    const sellerId = c.req.param('sellerId');
    
    // Get seller stats
    const stats = await kv.get(`seller-stats:${sellerId}`) || {
      followers: 0,
      totalListings: 0,
      completedSales: 0,
      averageRating: 0,
    };
    
    return c.json({ stats });
  } catch (error) {
    console.error('Error fetching seller profile:', error);
    return c.json({ error: 'Failed to fetch seller profile', details: error.message }, 500);
  }
});

Deno.serve(app.fetch);