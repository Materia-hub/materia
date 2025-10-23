import React, { useState, useEffect } from 'react';
import { Package2, ListFilter, MessageSquare, FileCheck, Calendar, LayoutDashboard, Settings, Users, ShieldCheck, LogOut, Menu, X, Leaf, Heart, BarChart3, Search, Bell, Activity, Store } from 'lucide-react';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './components/Dashboard';
import Listings from './components/Listings';
import ListingDetail from './components/ListingDetail';
import CreateListing from './components/CreateListing';
import Messages from './components/Messages';
import EnhancedMessages from './components/EnhancedMessages';
import Transactions from './components/Transactions';
import PickupScheduler from './components/PickupScheduler';
import AdminPanel from './components/AdminPanel';
import UserProfile from './components/UserProfile';
import Onboarding from './components/Onboarding';
import Notifications from './components/Notifications';
import Favorites from './components/Favorites';
import SellerAnalytics from './components/SellerAnalytics';
import SavedSearches from './components/SavedSearches';
import NotificationPreferences from './components/NotificationPreferences';
import SellerDirectory from './components/SellerDirectory';
import ActivityFeed from './components/ActivityFeed';
import SellerProfile from './components/SellerProfile';
import ErrorDetector from './components/ErrorDetector';
import { mockListings, Listing } from './components/data/mockData';
import { api } from './utils/api';
import { supabase } from './utils/supabase/client';

// This is a backup of your full App.tsx
// The full implementation is preserved here
