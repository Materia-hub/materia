import React, { useState, useEffect } from 'react';
import { Package2, MessageSquare, FileCheck, Calendar, LayoutDashboard, ShieldCheck, LogOut, Menu, X, Heart, BarChart3, Search, Bell, ChevronDown } from 'lucide-react';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './components/ui/dropdown-menu';
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
import { mockListings, Listing } from './components/data/mockData';

// NOTE: SellerDirectory, ActivityFeed, and SellerProfile are excluded due to Figma webpack errors

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
  const [unreadCount, setUnreadCount] = useState(3);
  const [listings, setListings] = useState<Listing[]>(mockListings);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const storedUser = localStorage.getItem('materia_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsOnboarding(false);
        
        // Get session token
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setAccessToken(data.session.access_token);
        }
      } catch (e) {
        console.error('Error loading user:', e);
        setIsOnboarding(true);
      }
    } else {
      setIsOnboarding(true);
    }
  };

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
    
    // Get session token
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setAccessToken(data.session.access_token);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setAccessToken(null);
    localStorage.removeItem('materia_user');
    setIsOnboarding(true);
    setCurrentView('listings');
  };

  const handleViewListing = (listingId: string) => {
    setSelectedListingId(listingId);
    setCurrentView('listing-detail');
  };

  const handleEditListing = (listingId: string) => {
    setEditingListingId(listingId);
    setCurrentView('create-listing');
  };

  const handleCreateListing = () => {
    setEditingListingId(null);
    setCurrentView('create-listing');
  };

  const handleBackToListings = () => {
    setSelectedListingId(null);
    setEditingListingId(null);
    setCurrentView('listings');
  };

  const handleUpdateProfile = (updatedUser: Partial<User>) => {
    if (currentUser) {
      const updated = { ...currentUser, ...updatedUser };
      setCurrentUser(updated);
      localStorage.setItem('materia_user', JSON.stringify(updated));
    }
  };

  const handleDeleteListing = () => {
    console.log('Listing deleted, refreshing...');
    setCurrentView('listings');
  };

  if (isOnboarding || !currentUser) {
    return (
      <ErrorBoundary>
        <Onboarding onComplete={handleOnboardingComplete} />
        <Toaster />
      </ErrorBoundary>
    );
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'listings', label: 'Browse Listings', icon: Package2 },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'saved-searches', label: 'Saved Searches', icon: Search },
    { id: 'enhanced-messages', label: 'Messages', icon: MessageSquare },
    { id: 'transactions', label: 'Transactions', icon: FileCheck },
    { id: 'pickup', label: 'Pickup Schedule', icon: Calendar },
    ...(currentUser.role === 'seller' ? [
      { id: 'analytics', label: 'Analytics', icon: BarChart3 }
    ] : []),
    ...(currentUser.role === 'admin' ? [
      { id: 'admin', label: 'Admin Panel', icon: ShieldCheck }
    ] : []),
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigate={(page: string) => setCurrentView(page as View)}
            onViewListing={handleViewListing}
            onDeleteListing={handleDeleteListing}
            listings={listings}
            currentUser={{
              id: currentUser.id,
              subscriptionTier: currentUser.subscriptionTier || 'free',
              membershipStatus: currentUser.membershipStatus || 'Basic',
            }}
          />
        );
      case 'listings':
        return (
          <Listings
            accessToken={accessToken}
            currentUserId={currentUser.id}
            onViewListing={handleViewListing}
            onEditListing={handleEditListing}
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
            currentUserId={currentUser.id}
          />
        ) : null;
      case 'create-listing':
        return (
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
        );
      case 'enhanced-messages':
        return <EnhancedMessages accessToken={accessToken} currentUserId={currentUser.id} onViewListing={handleViewListing} />;
      case 'transactions':
        return <Transactions accessToken={accessToken} currentUserId={currentUser.id} />;
      case 'pickup':
        return <PickupScheduler accessToken={accessToken} currentUserId={currentUser.id} />;
      case 'admin':
        return currentUser.role === 'admin' ? (
          <AdminPanel accessToken={accessToken} />
        ) : (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">Access denied. Admin privileges required.</p>
            </div>
          </div>
        );
      case 'profile':
        return (
          <UserProfile
            user={{
              id: currentUser.id,
              name: currentUser.name,
              email: currentUser.email,
              role: currentUser.role,
              businessType: currentUser.businessType || '',
              location: currentUser.location || '',
              membershipStatus: currentUser.membershipStatus || 'Basic',
              subscriptionTier: currentUser.subscriptionTier || 'free',
              joinDate: currentUser.joinDate || currentUser.memberSince || new Date().toISOString(),
              avatar: currentUser.avatar || currentUser.name.charAt(0).toUpperCase(),
              isAdmin: currentUser.isAdmin || currentUser.role === 'admin',
            }}
            onUpdateUser={handleUpdateProfile}
            onNavigate={(page: string) => setCurrentView(page as View)}
          />
        );
      case 'notifications':
        return (
          <NotificationsPage
            accessToken={accessToken}
            currentUserId={currentUser.id}
            onViewListing={handleViewListing}
            onClearAll={() => setUnreadCount(0)}
          />
        );
      case 'favorites':
        return (
          <Favorites
            accessToken={accessToken}
            currentUserId={currentUser.id}
            onViewListing={handleViewListing}
          />
        );
      case 'analytics':
        return currentUser.role === 'seller' ? (
          <SellerAnalytics accessToken={accessToken} sellerId={currentUser.id} />
        ) : (
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">Analytics are only available for seller accounts.</p>
            </div>
          </div>
        );
      case 'saved-searches':
        return (
          <SavedSearches
            accessToken={accessToken}
            currentUserId={currentUser.id}
            onViewResults={() => setCurrentView('listings')}
          />
        );
      case 'notification-preferences':
        return (
          <NotificationPreferences
            accessToken={accessToken}
            currentUserId={currentUser.id}
            onBack={() => setCurrentView('profile')}
          />
        );
      default:
        return (
          <Dashboard
            onNavigate={(page: string) => setCurrentView(page as View)}
            onViewListing={handleViewListing}
            onDeleteListing={handleDeleteListing}
            listings={listings}
            currentUser={{
              id: currentUser.id,
              subscriptionTier: currentUser.subscriptionTier || 'free',
              membershipStatus: currentUser.membershipStatus || 'Basic',
            }}
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
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('listings')}>
                <h1 className="text-xl materia-brand">Materia</h1>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-2">
                {/* Browse Listings - Always Visible */}
                <Button
                  variant={currentView === 'listings' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('listings')}
                  className={currentView === 'listings' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-blue-600'}
                >
                  <Package2 className="h-4 w-4 mr-2" />
                  Browse Listings
                </Button>

                {/* Dropdown Menu for Other Items */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600">
                      <Menu className="h-4 w-4 mr-2" />
                      Menu
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
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
              </nav>

              {/* User Actions */}
              <div className="flex items-center gap-3">
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

                {/* User Profile Button */}
                <div className="flex items-center gap-2">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm text-gray-800">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 capitalize hidden">{currentUser.role}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentView('profile')}
                    className="p-1"
                  >
                    {currentUser.avatar ? (
                      <ImageWithFallback
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Button>
                </div>

                {/* Logout */}
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-red-600">
                  <LogOut className="h-5 w-5" />
                </Button>

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
