import React, { useState, useEffect } from 'react';
import { Package2, MessageSquare, FileCheck, Calendar, LayoutDashboard, ShieldCheck, LogOut, Menu, X, Heart, BarChart3, Search, Bell, User, Settings, ChevronDown } from 'lucide-react';
import { Button } from './components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './components/ui/dropdown-menu';
import { Toaster } from './components/ui/sonner';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { supabase } from './utils/supabase/client';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './components/Dashboard';
import Listings from './components/Listings';
import ListingDetail from './components/ListingDetail';
import CreateListing from './components/CreateListing';
import EnhancedMessages from './components/EnhancedMessages';
import Transactions from './components/Transactions';
import PickupScheduler from './components/PickupScheduler';
import AdminPanel from './components/AdminPanel';
import UserProfile from './components/UserProfile';
import Onboarding from './components/Onboarding';
import NotificationsPage from './components/NotificationsPage';
import Favorites from './components/Favorites';
import SellerAnalytics from './components/SellerAnalytics';
import SavedSearches from './components/SavedSearches';
import NotificationPreferences from './components/NotificationPreferences';
import MateriaLogo from './components/MateriaLogo';
import { mockListings, Listing } from './components/data/mockData';
import { api } from './utils/api';

type View = 
  | 'dashboard' 
  | 'listings' 
  | 'listing-detail' 
  | 'create-listing' 
  | 'enhanced-messages'
  | 'transactions' 
  | 'pickup' 
  | 'admin' 
  | 'profile' 
  | 'notifications'
  | 'favorites'
  | 'analytics'
  | 'saved-searches'
  | 'notification-preferences';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
  location?: string;
  memberSince?: string;
  phoneNumber?: string;
  bio?: string;
  verified?: boolean;
  listingsSold?: number;
  listingsActive?: number;
  rating?: number;
  reviews?: number;
  businessType?: string;
  membershipStatus?: string;
  subscriptionTier?: 'free' | 'pay-per-listing' | 'annual';
  joinDate?: string;
  isAdmin?: boolean;
}

function App() {
  const [currentView, setCurrentView] = useState<View>('listings');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load listings function
  const loadListings = async () => {
    try {
      const response = await api.getListings();
      const backendListings = response.listings || [];
      setListings(backendListings.length > 0 ? backendListings : mockListings);
    } catch (error) {
      console.error('Error loading listings:', error);
      setListings(mockListings);
    }
  };

  // Initialize auth and load data
  useEffect(() => {
    document.title = 'Materia - Buy and Sell Material For Your Project';
    
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('materia_user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          setCurrentView('dashboard'); // Logged-in users see dashboard
          
          // Get session token
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            setAccessToken(data.session.access_token);
          }
        } catch (e) {
          console.error('Error loading user:', e);
        }
      }
      // If no stored user, that's fine - public browsing enabled
    };

    const init = async () => {
      await initializeAuth();
      await loadListings();
      setIsInitialized(true);
    };

    init();
  }, []);

  const handleOnboardingComplete = async (userData: any) => {
    console.log('User logged in:', userData);
    const userWithDefaults = {
      ...userData,
      subscriptionTier: userData.subscriptionTier || 'free',
      membershipStatus: userData.membershipStatus || 'Basic',
    };
    setCurrentUser(userWithDefaults);
    localStorage.setItem('materia_user', JSON.stringify(userWithDefaults));
    setIsOnboarding(false);
    setCurrentView('dashboard'); // Show dashboard after login
    
    // Get session token
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setAccessToken(data.session.access_token);
    }

    // Reload listings
    await loadListings();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setAccessToken(null);
    localStorage.removeItem('materia_user');
    setCurrentView('listings'); // Return to public listings view
  };

  const handleViewListing = (listingId: string) => {
    setSelectedListingId(listingId);
    setCurrentView('listing-detail');
  };

  const handleEditListing = (listingId: string) => {
    if (!currentUser) {
      setIsOnboarding(true);
    } else {
      setEditingListingId(listingId);
      setCurrentView('create-listing');
    }
  };

  const handleCreateListing = () => {
    if (!currentUser) {
      setIsOnboarding(true);
    } else {
      setEditingListingId(null);
      setCurrentView('create-listing');
    }
  };

  const handleBackToListings = async () => {
    setSelectedListingId(null);
    setEditingListingId(null);
    setCurrentView('listings');
    await loadListings(); // Refresh listings
  };

  const handleUpdateProfile = (updatedUser: Partial<User>) => {
    if (currentUser) {
      const updated = { ...currentUser, ...updatedUser };
      setCurrentUser(updated);
      localStorage.setItem('materia_user', JSON.stringify(updated));
    }
  };

  const handleDeleteListing = async () => {
    console.log('Listing deleted, refreshing...');
    await loadListings(); // Refresh listings
    setCurrentView(currentUser ? 'dashboard' : 'listings');
  };

  // Show loading state
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Materia...</p>
        </div>
      </div>
    );
  }

  // Show onboarding modal when requested
  if (isOnboarding) {
    return (
      <ErrorBoundary>
        <Onboarding onComplete={handleOnboardingComplete} />
        <Toaster />
      </ErrorBoundary>
    );
  }

  // Public browsing enabled - currentUser can be null

  // Navigation items - only show protected items when logged in
  const navigationItems = [
    { id: 'listings', label: 'Browse Listings', icon: Package2, public: true },
    ...(currentUser ? [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, public: false },
      { id: 'favorites', label: 'Favorites', icon: Heart, public: false },
      { id: 'saved-searches', label: 'Saved Searches', icon: Search, public: false },
      { id: 'enhanced-messages', label: 'Messages', icon: MessageSquare, public: false },
      { id: 'transactions', label: 'Transactions', icon: FileCheck, public: false },
      { id: 'pickup', label: 'Pickup Schedule', icon: Calendar, public: false },
      ...(currentUser.role === 'seller' ? [
        { id: 'analytics', label: 'Analytics', icon: BarChart3, public: false }
      ] : []),
      ...(currentUser.role === 'admin' ? [
        { id: 'admin', label: 'Admin Panel', icon: ShieldCheck, public: false }
      ] : []),
    ] : []),
  ];

  const renderContent = () => {
    // Protected views - require login
    if (!currentUser && currentView !== 'listings' && currentView !== 'listing-detail') {
      return (
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-blue-800 mb-4">Please sign in to access this feature.</p>
            <Button onClick={() => setIsOnboarding(true)} className="bg-blue-600 text-white">
              Sign In / Sign Up
            </Button>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return currentUser ? (
          <Dashboard
            onNavigate={(page: string) => setCurrentView(page as View)}
            onViewListing={handleViewListing}
            onEditListing={handleEditListing}
            onDeleteListing={handleDeleteListing}
            listings={listings}
            currentUser={{
              id: currentUser.id,
              subscriptionTier: currentUser.subscriptionTier || 'free',
              membershipStatus: currentUser.membershipStatus || 'Basic',
            }}
            accessToken={accessToken || undefined}
          />
        ) : null;
      case 'listings':
        return (
          <Listings
            accessToken={accessToken}
            currentUserId={currentUser?.id || ''}
            onViewListing={handleViewListing}
            onEditListing={handleEditListing}
            listings={listings}
          />
        );
      case 'listing-detail':
        return selectedListingId ? (
          <ListingDetail
            listingId={selectedListingId}
            onBack={handleBackToListings}
            onEdit={handleEditListing}
            onDelete={handleDeleteListing}
            listings={listings}
            accessToken={accessToken}
            currentUserId={currentUser?.id || ''}
          />
        ) : null;
      case 'create-listing':
        return currentUser ? (
          <CreateListing
            accessToken={accessToken}
            editingListingId={editingListingId}
            onBack={handleBackToListings}
            onSuccess={handleBackToListings}
            currentUser={{
              id: currentUser.id,
              subscriptionTier: currentUser.subscriptionTier || 'free',
            }}
          />
        ) : null;
      case 'enhanced-messages':
        return currentUser ? <EnhancedMessages accessToken={accessToken} currentUserId={currentUser.id} onViewListing={handleViewListing} /> : null;
      case 'transactions':
        return currentUser ? <Transactions accessToken={accessToken} currentUserId={currentUser.id} /> : null;
      case 'pickup':
        return currentUser ? <PickupScheduler accessToken={accessToken} currentUserId={currentUser.id} /> : null;
      case 'admin':
        return currentUser?.role === 'admin' ? (
          <AdminPanel accessToken={accessToken} />
        ) : (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">Access denied. Admin privileges required.</p>
            </div>
          </div>
        );
      case 'profile':
        return currentUser ? (
          <UserProfile
            user={{
              id: currentUser.id,
              name: currentUser.name,
              email: currentUser.email,
              role: currentUser.role,
              businessType: currentUser.businessType || 'General',
              location: currentUser.location || 'Not specified',
              membershipStatus: currentUser.membershipStatus || 'Basic',
              subscriptionTier: currentUser.subscriptionTier || 'free',
              joinDate: currentUser.joinDate || currentUser.memberSince || new Date().toISOString(),
              avatar: currentUser.avatar || currentUser.name.charAt(0).toUpperCase(),
              isAdmin: currentUser.role === 'admin',
            }}
            onUpdateUser={handleUpdateProfile}
            onNavigate={(page: string) => setCurrentView(page as View)}
          />
        ) : null;
      case 'notifications':
        return currentUser ? (
          <NotificationsPage
            accessToken={accessToken}
            currentUserId={currentUser.id}
            onViewListing={handleViewListing}
            onClearAll={() => setUnreadCount(0)}
          />
        ) : null;
      case 'favorites':
        return currentUser ? (
          <Favorites
            accessToken={accessToken}
            currentUserId={currentUser.id}
            onViewListing={handleViewListing}
          />
        ) : null;
      case 'analytics':
        return currentUser?.role === 'seller' ? (
          <SellerAnalytics accessToken={accessToken} sellerId={currentUser.id} />
        ) : (
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">Analytics are only available for seller accounts.</p>
            </div>
          </div>
        );
      case 'saved-searches':
        return currentUser ? (
          <SavedSearches
            accessToken={accessToken}
            currentUserId={currentUser.id}
            onViewResults={() => setCurrentView('listings')}
          />
        ) : null;
      case 'notification-preferences':
        return currentUser ? (
          <NotificationPreferences
            accessToken={accessToken}
            currentUserId={currentUser.id}
            onBack={() => setCurrentView('profile')}
          />
        ) : null;
      default:
        return (
          <Listings
            accessToken={accessToken}
            currentUserId={currentUser?.id || ''}
            onViewListing={handleViewListing}
            onEditListing={handleEditListing}
            listings={listings}
          />
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100">
        {/* Header */}
        <header className="bg-white border-b border-blue-100 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => currentUser ? setCurrentView('dashboard') : setCurrentView('listings')}>
                <MateriaLogo size={36} />
                <h1 className="text-xl materia-brand">Materia</h1>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-2">
                {/* Browse Listings - Always visible */}
                <Button
                  variant={currentView === 'listings' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('listings')}
                  className={currentView === 'listings' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-blue-600'}
                >
                  <Package2 className="h-4 w-4 mr-2" />
                  Browse Listings
                </Button>

                {/* My Activity Dropdown - Only when logged in */}
                {currentUser && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600">
                        Menu
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setCurrentView('dashboard')}>
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setCurrentView('favorites')}>
                        <Heart className="h-4 w-4 mr-2" />
                        Favorites
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setCurrentView('saved-searches')}>
                        <Search className="h-4 w-4 mr-2" />
                        Saved Searches
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Activity</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setCurrentView('enhanced-messages')}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Messages
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setCurrentView('transactions')}>
                        <FileCheck className="h-4 w-4 mr-2" />
                        Transactions
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setCurrentView('pickup')}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Pickup Schedule
                      </DropdownMenuItem>
                      {currentUser.role === 'seller' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setCurrentView('analytics')}>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics
                          </DropdownMenuItem>
                        </>
                      )}
                      {currentUser.role === 'admin' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setCurrentView('admin')}>
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Admin Panel
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </nav>

              {/* User Actions */}
              <div className="flex items-center gap-3">
                {currentUser ? (
                  <>
                    {/* Notifications */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentView('notifications')}
                      className="relative"
                    >
                      <Bell className="h-5 w-5 text-gray-600" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </Button>

                    {/* User Profile Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center p-1.5">
                            <MateriaLogo size={20} className="text-white" />
                          </div>
                          <div className="hidden sm:block text-left">
                            <p className="text-sm text-gray-800">{currentUser.name}</p>
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm">{currentUser.name}</p>
                            <p className="text-xs text-gray-500">{currentUser.email}</p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setCurrentView('profile')}>
                          <User className="h-4 w-4 mr-2" />
                          Profile Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentView('notification-preferences')}>
                          <Settings className="h-4 w-4 mr-2" />
                          Preferences
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  /* Sign In Button for non-logged-in users */
                  <Button
                    onClick={() => setIsOnboarding(true)}
                    className="bg-blue-600 text-white"
                    size="sm"
                  >
                    Sign In / Sign Up
                  </Button>
                )}

                {/* Mobile Menu Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden"
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-blue-100 bg-white">
              <nav className="px-4 py-3 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => {
                        setCurrentView(item.id as View);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full justify-start ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-blue-100 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-sm">© 2025 Materia. All rights reserved.</span>
              </div>
              <div className="flex gap-4 text-sm text-gray-600">
                <a href="#" className="hover:text-blue-600">Help Center</a>
                <a href="#" className="hover:text-blue-600">Terms</a>
                <a href="#" className="hover:text-blue-600">Privacy</a>
              </div>
            </div>
          </div>
        </footer>

        <Toaster />
      </div>
    </ErrorBoundary>
  );
}

export default App;
