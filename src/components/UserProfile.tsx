import React, { useState } from 'react';
import { User, Mail, MapPin, Briefcase, Calendar, Shield, Edit2, Save, BarChart3, Search, Heart } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import SubscriptionDialog from './SubscriptionDialog';

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    businessType: string;
    location: string;
    membershipStatus: string;
    subscriptionTier: string;
    joinDate: string;
    avatar: string;
    isAdmin: boolean;
  };
  onUpdateUser: (user: any) => void;
  onNavigate?: (page: string) => void;
}

export default function UserProfile({ user, onUpdateUser, onNavigate }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    businessType: user.businessType,
    location: user.location,
  });

  const handleSave = () => {
    onUpdateUser({
      ...user,
      ...formData,
    });
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      businessType: user.businessType,
      location: user.location,
    });
    setIsEditing(false);
  };

  const handleSelectPayPerListing = () => {
    toast.success('Pay-per-listing plan selected! This is a prototype - payment integration would be implemented here.');
    setShowSubscriptionDialog(false);
  };

  const handleSelectAnnual = () => {
    toast.success('Annual subscription selected! This is a prototype - payment integration would be implemented here.');
    setShowSubscriptionDialog(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-blue-900 mb-2">Profile Settings</h2>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700">
              <AvatarFallback className="text-white text-2xl">{user.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-gray-900 mb-2">{user.name}</h3>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-600 text-white border-0">
                  {user.membershipStatus} Member
                </Badge>
                {user.isAdmin && (
                  <Badge className="bg-purple-600 text-white border-0">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Member since {new Date(user.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </Card>

      {/* Profile Information */}
      <Card className="p-6">
        <h3 className="text-gray-900 mb-6">Account Information</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="mt-2">
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4 text-muted-foreground" />
                    {user.name}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="mt-2">
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {user.email}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <div className="mt-2">
                {isEditing ? (
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {user.location}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <div className="mt-2">
                {isEditing ? (
                  <Input
                    id="businessType"
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    {user.businessType}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="role">Account Type</Label>
              <div className="mt-2">
                {isEditing ? (
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">Buyer Only</SelectItem>
                      <SelectItem value="seller">Seller Only</SelectItem>
                      <SelectItem value="both">Buyer & Seller</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-gray-700">
                    {user.role === 'both' ? 'Buyer & Seller' : user.role === 'seller' ? 'Seller Only' : 'Buyer Only'}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Member Since</Label>
              <div className="mt-2 flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {new Date(user.joinDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Account Stats */}
      <Card className="p-6">
        <h3 className="text-gray-900 mb-6">Account Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-blue-700 mb-1">5</p>
            <p className="text-sm text-muted-foreground">Active Listings</p>
          </div>
          <div className="text-center">
            <p className="text-blue-700 mb-1">12</p>
            <p className="text-sm text-muted-foreground">Total Sales</p>
          </div>
          <div className="text-center">
            <p className="text-blue-700 mb-1">147</p>
            <p className="text-sm text-muted-foreground">Profile Views</p>
          </div>
          <div className="text-center">
            <p className="text-blue-700 mb-1">4.8</p>
            <p className="text-sm text-muted-foreground">Rating</p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      {onNavigate && (
        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => onNavigate('notification-settings')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Notification Preferences
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => onNavigate('analytics')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => onNavigate('saved-searches')}
            >
              <Search className="w-4 h-4 mr-2" />
              Saved Searches
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => onNavigate('favorites')}
            >
              <Heart className="w-4 h-4 mr-2" />
              My Favorites
            </Button>
          </div>
        </Card>
      )}

      {/* Subscription Status */}
      <Card 
        className="p-6 bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
        onClick={() => setShowSubscriptionDialog(true)}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-blue-900 mb-2">
              {user.membershipStatus === 'Premium' || user.subscriptionTier === 'annual' ? 'Premium Subscription' : 
               user.subscriptionTier === 'pay-per-listing' ? 'Pay-Per-Listing Plan' : 
               'Free Plan'}
            </h3>
            <p className="text-gray-700 mb-4">
              {user.membershipStatus === 'Premium' || user.subscriptionTier === 'annual' 
                ? "You're enjoying unlimited listings with your premium subscription:"
                : user.subscriptionTier === 'pay-per-listing'
                ? "You pay $0.99 for each listing you create. Click to view plans:"
                : "You have 3 free listings. Click to upgrade for more:"
              }
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              {(user.membershipStatus === 'Premium' || user.subscriptionTier === 'annual') && (
                <>
                  <li>✓ Unlimited listings</li>
                  <li>✓ Priority customer support</li>
                  <li>✓ Featured listing badge</li>
                  <li>✓ Advanced analytics</li>
                </>
              )}
              {user.subscriptionTier === 'pay-per-listing' && user.membershipStatus !== 'Premium' && (
                <>
                  <li>✓ Pay only when you list</li>
                  <li>✓ No commitment required</li>
                  <li>✓ All standard features</li>
                </>
              )}
              {user.subscriptionTier === 'free' && user.membershipStatus !== 'Premium' && (
                <>
                  <li>✓ 3 free listings included</li>
                  <li>✓ Basic messaging features</li>
                  <li>✓ Transaction management</li>
                  <li>→ Upgrade for unlimited listings</li>
                </>
              )}
            </ul>
          </div>
          <Badge className={(user.membershipStatus === 'Premium' || user.subscriptionTier === 'annual') ? 'bg-blue-600 text-white border-0' : 'bg-gray-600 text-white border-0'}>
            {user.membershipStatus === 'Premium' || user.subscriptionTier === 'annual' ? 'Premium' : 
             user.subscriptionTier === 'pay-per-listing' ? 'Pay-per' : 
             'Free'}
          </Badge>
        </div>
      </Card>

      {/* Subscription Dialog */}
      <SubscriptionDialog
        open={showSubscriptionDialog}
        onClose={() => setShowSubscriptionDialog(false)}
        onSelectPayPerListing={handleSelectPayPerListing}
        onSelectAnnual={handleSelectAnnual}
        currentListingCount={3}
      />
    </div>
  );
}
