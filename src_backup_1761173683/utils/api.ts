import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-8ae6fee0`;

interface FetchOptions {
  method?: string;
  body?: any;
}

async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
  const { method = 'GET', body } = options;
  
  const headers: HeadersInit = {
    'Authorization': `Bearer ${publicAnonKey}`,
    'Content-Type': 'application/json',
  };
  
  const config: RequestInit = {
    method,
    headers,
  };
  
  if (body) {
    config.body = JSON.stringify(body);
  }
  
  try {
    console.log(`📡 API ${method} ${endpoint}`);
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      let errorMessage = 'API request failed';
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      console.error(`❌ API Error ${method} ${endpoint}:`, errorMessage);
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log(`✅ API Success ${method} ${endpoint}`);
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('❌ Network error - server may be offline:', error);
      throw new Error('Network error - please check your connection or try again later');
    }
    throw error;
  }
}

export const api = {
  // Auth
  signup: async (userData: {
    email: string;
    password: string;
    name: string;
    businessType: string;
    location?: string;
  }) => {
    return fetchAPI('/signup', {
      method: 'POST',
      body: userData,
    });
  },
  
  getCurrentUser: async (accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/me`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get user');
    }
    
    return response.json();
  },
  
  // Listings
  getListings: async (filters?: {
    category?: string;
    condition?: string;
    search?: string;
    priceMin?: number;
    priceMax?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.condition) params.append('condition', filters.condition);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.priceMin) params.append('priceMin', filters.priceMin.toString());
    if (filters?.priceMax) params.append('priceMax', filters.priceMax.toString());
    
    const query = params.toString();
    return fetchAPI(`/listings${query ? `?${query}` : ''}`);
  },
  
  getListing: async (id: string) => {
    return fetchAPI(`/listings/${id}`);
  },
  
  createListing: async (listing: any) => {
    return fetchAPI('/listings', {
      method: 'POST',
      body: { listing },
    });
  },
  
  updateListing: async (id: string, listing: any) => {
    return fetchAPI(`/listings/${id}`, {
      method: 'PUT',
      body: { listing },
    });
  },
  
  deleteListing: async (id: string) => {
    return fetchAPI(`/listings/${id}`, {
      method: 'DELETE',
    });
  },
  
  uploadImage: async (imageData: string, filename?: string) => {
    return fetchAPI('/upload-image', {
      method: 'POST',
      body: { image: imageData, filename },
    });
  },
  
  // Favorites
  getFavorites: async (accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/favorites`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get favorites');
    }
    
    return response.json();
  },
  
  addFavorite: async (listingId: string, accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/favorites/${listingId}`, {
      method: 'POST',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add favorite');
    }
    
    return response.json();
  },
  
  removeFavorite: async (listingId: string, accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/favorites/${listingId}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove favorite');
    }
    
    return response.json();
  },
  
  // Reviews
  getListingReviews: async (listingId: string) => {
    return fetchAPI(`/listings/${listingId}/reviews`);
  },
  
  getSellerReviews: async (sellerId: string) => {
    return fetchAPI(`/sellers/${sellerId}/reviews`);
  },
  
  createReview: async (reviewData: {
    listingId: string;
    sellerId: string;
    rating: number;
    comment?: string;
  }, accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers,
      body: JSON.stringify(reviewData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create review');
    }
    
    return response.json();
  },
  
  // Notifications
  getNotifications: async (accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/notifications`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get notifications');
    }
    
    return response.json();
  },
  
  markNotificationRead: async (notificationId: string, accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to mark notification as read');
    }
    
    return response.json();
  },
  
  markAllNotificationsRead: async (accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/notifications/read-all`, {
      method: 'PUT',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to mark all notifications as read');
    }
    
    return response.json();
  },
  
  // Payments
  createCheckoutSession: async (subscriptionType: 'pay-per-listing' | 'annual', accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/create-checkout-session`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ subscriptionType }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }
    
    return response.json();
  },
  
  // Messages
  getConversations: async (accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/conversations`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get conversations');
    }
    
    return response.json();
  },
  
  getMessages: async (conversationId: string, accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/conversations/${conversationId}/messages`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get messages');
    }
    
    return response.json();
  },
  
  sendMessage: async (messageData: {
    recipientId: string;
    listingId?: string;
    text: string;
    image?: string;
  }, accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify(messageData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }
    
    return response.json();
  },
  
  markMessageRead: async (messageId: string, accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/messages/${messageId}/read`, {
      method: 'PUT',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to mark message as read');
    }
    
    return response.json();
  },
  
  setTypingStatus: async (conversationId: string, typing: boolean, accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/conversations/${conversationId}/typing`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ typing }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to set typing status');
    }
    
    return response.json();
  },
  
  // Saved Searches
  getSavedSearches: async (accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/saved-searches`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get saved searches');
    }
    
    return response.json();
  },
  
  createSavedSearch: async (searchData: {
    name: string;
    filters: any;
    alertEnabled?: boolean;
  }, accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/saved-searches`, {
      method: 'POST',
      headers,
      body: JSON.stringify(searchData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create saved search');
    }
    
    return response.json();
  },
  
  updateSavedSearch: async (searchId: string, searchData: any, accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/saved-searches/${searchId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(searchData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update saved search');
    }
    
    return response.json();
  },
  
  deleteSavedSearch: async (searchId: string, accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/saved-searches/${searchId}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete saved search');
    }
    
    return response.json();
  },
  
  // Analytics
  getAnalytics: async (accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/analytics`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get analytics');
    }
    
    return response.json();
  },
  
  // Notification Preferences
  getNotificationPreferences: async (accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/notification-preferences`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get preferences');
    }
    
    return response.json();
  },
  
  updateNotificationPreferences: async (preferences: any, accessToken: string) => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/notification-preferences`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(preferences),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update preferences');
    }
    
    return response.json();
  },
};
